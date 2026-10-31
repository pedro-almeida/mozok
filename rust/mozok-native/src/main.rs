#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::env;
use std::fs;
use std::io::{Read, Write};
use std::net::{TcpListener, TcpStream};
use std::path::{Component, Path, PathBuf};
use std::thread;

const PORT: u16 = 8090;

#[cfg(target_os = "windows")]
#[no_mangle]
pub static NvOptimusEnablement: u32 = 0x00000001;

#[cfg(target_os = "windows")]
#[no_mangle]
pub static AmdPowerXpressRequestHighPerformance: i32 = 1;

fn force_windows_high_performance_gpu() {
    #[cfg(target_os = "windows")]
    {
        use std::os::windows::process::CommandExt;
        use std::process::Command;

        const CREATE_NO_WINDOW: u32 = 0x08000000;
        let reg_key = r"HKCU\Software\Microsoft\DirectX\UserGpuPreferences";

        // Vincula GpuPreference=2 exclusivamente ao executável mozok-native.exe
        if let Ok(exe_path) = env::current_exe() {
            if let Some(exe_str) = exe_path.to_str() {
                let _ = Command::new("reg")
                    .args([
                        "add",
                        reg_key,
                        "/v",
                        exe_str,
                        "/t",
                        "REG_SZ",
                        "/d",
                        "GpuPreference=2;",
                        "/f",
                    ])
                    .creation_flags(CREATE_NO_WINDOW)
                    .status();
            }
        }

        // Remove qualquer vínculo global anterior em msedgewebview2.exe para preservar a VRAM da GTX 1650 para o Zorya
        let pf_x86 =
            env::var("ProgramFiles(x86)").unwrap_or_else(|_| r"C:\Program Files (x86)".to_string());
        let webview_base = Path::new(&pf_x86).join(r"Microsoft\EdgeWebView\Application");
        if let Ok(entries) = fs::read_dir(webview_base) {
            for entry in entries.flatten() {
                let candidate = entry.path().join("msedgewebview2.exe");
                if candidate.exists() {
                    if let Some(cand_str) = candidate.to_str() {
                        let _ = Command::new("reg")
                            .args(["delete", reg_key, "/v", cand_str, "/f"])
                            .creation_flags(CREATE_NO_WINDOW)
                            .status();
                    }
                }
            }
        }
    }

    let gpu_flags = [
        "--force-high-performance-gpu",
        "--enable-gpu-rasterization",
        "--enable-zero-copy",
        "--ignore-gpu-blocklist",
        "--enable-webgl2-compute-context",
        "--enable-accelerated-2d-canvas",
        "--use-angle=d3d11",
        concat!(
            "--enable-features=VaapiVideoDecoder,",
            "CanvasOopRasterization,WebGLDeveloperExtensions,UseSkiaRenderer"
        ),
        "--disable-frame-rate-limit",
        "--disable-gpu-vsync",
        "--disable-renderer-backgrounding",
        "--disable-background-timer-throttling",
        "--autoplay-policy=no-user-gesture-required",
    ]
    .join(" ");

    env::set_var("WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS", &gpu_flags);
    env::set_var("SHIM_MCCOMPAT", "0x800000001");
}

fn find_web_root() -> PathBuf {
    if let Ok(exe_path) = env::current_exe() {
        if let Some(exe_dir) = exe_path.parent() {
            let candidates = [
                exe_dir.join("web"),
                exe_dir.join("../web"),
                exe_dir.join("../../web"),
                exe_dir.join("../../../web"),
            ];
            for candidate in candidates {
                if candidate.join("index.html").exists() {
                    return candidate;
                }
            }
        }
    }
    let cwd = env::current_dir().unwrap_or_else(|_| PathBuf::from("."));
    if cwd.join("web/index.html").exists() {
        return cwd.join("web");
    }
    if cwd.join("../../web/index.html").exists() {
        return cwd.join("../../web");
    }
    cwd.join("web")
}

fn get_mime_type(path: &Path) -> &'static str {
    match path.extension().and_then(|e| e.to_str()) {
        Some("html") => "text/html; charset=utf-8",
        Some("js") | Some("mjs") => "application/javascript; charset=utf-8",
        Some("css") => "text/css; charset=utf-8",
        Some("wasm") => "application/wasm",
        Some("json") | Some("webmanifest") => "application/json; charset=utf-8",
        Some("svg") => "image/svg+xml",
        Some("png") => "image/png",
        Some("jpg") | Some("jpeg") => "image/jpeg",
        Some("webp") => "image/webp",
        Some("ico") => "image/x-icon",
        Some("mp3") => "audio/mpeg",
        Some("wav") => "audio/wav",
        Some("ogg") => "audio/ogg",
        Some("woff2") => "font/woff2",
        Some("woff") => "font/woff",
        Some("ttf") => "font/ttf",
        _ => "application/octet-stream",
    }
}

fn resolve_safe_path(web_root: &Path, raw_url_path: &str) -> Option<PathBuf> {
    let trimmed = raw_url_path.trim_start_matches('/');
    let rel_str = if trimmed.is_empty() {
        "index.html"
    } else {
        trimmed
    };

    let rel_path = Path::new(rel_str);
    let mut candidate = web_root.to_path_buf();
    for comp in rel_path.components() {
        match comp {
            Component::Normal(part) => candidate.push(part),
            _ => return None,
        }
    }

    let canon_root = web_root.canonicalize().ok()?;
    let canon_file = candidate.canonicalize().ok()?;
    if canon_file.starts_with(&canon_root) && canon_file.is_file() {
        Some(canon_file)
    } else {
        None
    }
}

fn handle_http_stream(mut stream: TcpStream, web_root: PathBuf, port: u16) {
    let mut buffer = [0u8; 8192];
    let n = match stream.read(&mut buffer) {
        Ok(n) if n > 0 => n,
        _ => return,
    };

    let req_str = String::from_utf8_lossy(&buffer[..n]);
    let first_line = req_str.lines().next().unwrap_or("GET / HTTP/1.1");
    let raw_url = first_line.split_whitespace().nth(1).unwrap_or("/");
    let path_only = raw_url.split('?').next().unwrap_or("/");

    if path_only == "/health" {
        let body = br#"{"status":"ok","engine":"mozok-native","port":8090}"#;
        let header = format!(
            "HTTP/1.1 200 OK\r\nContent-Type: application/json; charset=utf-8\r\nContent-Length: {}\r\nConnection: close\r\n\r\n",
            body.len()
        );
        let _ = stream.write_all(header.as_bytes());
        let _ = stream.write_all(body);
        return;
    }

    if let Some(file_path) = resolve_safe_path(&web_root, path_only) {
        if let Ok(mut file) = fs::File::open(&file_path) {
            let mut buf = Vec::new();
            if file.read_to_end(&mut buf).is_ok() {
                let mime = get_mime_type(&file_path);
                let header = format!(
                    concat!(
                        "HTTP/1.1 200 OK\r\n",
                        "Content-Type: {}\r\n",
                        "Content-Length: {}\r\n",
                        "Accept-Ranges: bytes\r\n",
                        "Access-Control-Allow-Origin: http://127.0.0.1:{}\r\n",
                        "X-Content-Type-Options: nosniff\r\n",
                        "Cache-Control: no-cache\r\n",
                        "Connection: close\r\n\r\n"
                    ),
                    mime,
                    buf.len(),
                    port
                );
                let _ = stream.write_all(header.as_bytes());
                let _ = stream.write_all(&buf);
                return;
            }
        }
    }

    let body = b"404 Not Found";
    let header = format!(
        concat!(
            "HTTP/1.1 404 Not Found\r\n",
            "Content-Type: text/plain; charset=utf-8\r\n",
            "Content-Length: {}\r\n",
            "X-Content-Type-Options: nosniff\r\n",
            "Connection: close\r\n\r\n"
        ),
        body.len()
    );
    let _ = stream.write_all(header.as_bytes());
    let _ = stream.write_all(body);
}

fn start_embedded_server(web_root: PathBuf, port: u16) -> u16 {
    let bind_addr = format!("127.0.0.1:{}", port);
    let listener = TcpListener::bind(&bind_addr)
        .or_else(|_| TcpListener::bind("127.0.0.1:0"))
        .expect("Falha ao iniciar servidor HTTP local do Mozok.");

    let actual_port = listener.local_addr().map(|a| a.port()).unwrap_or(port);

    thread::spawn(move || {
        for stream in listener.incoming().flatten() {
            let root_clone = web_root.clone();
            thread::spawn(move || {
                handle_http_stream(stream, root_clone, actual_port);
            });
        }
    });

    actual_port
}

#[cfg(target_os = "windows")]
fn launch_native_window(app_url: &str) {
    use tao::{
        dpi::LogicalSize,
        event::{Event, WindowEvent},
        event_loop::{ControlFlow, EventLoop},
        window::{Fullscreen, WindowBuilder},
    };
    use wry::WebViewBuilder;

    let win_title =
        "MOZOK v7.1 — Simulacro Neurofisiológico 3D (SNC, SNP & Conectoma | GPU High-Perf :8090)";
    let event_loop = EventLoop::new();
    let window = WindowBuilder::new()
        .with_title(win_title)
        .with_inner_size(LogicalSize::new(1600.0, 940.0))
        .with_min_inner_size(LogicalSize::new(1120.0, 700.0))
        .with_maximized(true)
        .build(&event_loop)
        .expect("Falha ao criar janela nativa do Mozok.");

    let window_proxy = event_loop.create_proxy();

    let _webview = WebViewBuilder::new()
        .with_url(app_url)
        .with_devtools(true)
        .with_ipc_handler(move |req| {
            let cmd = req.body();
            if cmd == "TOGGLE_FULLSCREEN" || cmd == "F11" {
                let _ = window_proxy.send_event(());
            }
        })
        .build(&window)
        .expect("Falha ao inicializar WebView2 do Mozok.");

    event_loop.run(move |event, _, control_flow| {
        *control_flow = ControlFlow::Wait;

        match event {
            Event::UserEvent(()) => {
                if window.fullscreen().is_some() {
                    window.set_fullscreen(None);
                } else {
                    window.set_fullscreen(Some(Fullscreen::Borderless(None)));
                }
            }
            Event::WindowEvent {
                event: WindowEvent::CloseRequested,
                ..
            } => {
                *control_flow = ControlFlow::Exit;
            }
            _ => {}
        }
    });
}

#[cfg(not(target_os = "windows"))]
fn launch_native_window(app_url: &str) {
    println!("MOZOK HTTP server running at {}", app_url);
}

fn main() {
    force_windows_high_performance_gpu();

    let web_root = find_web_root();
    let actual_port = start_embedded_server(web_root, PORT);
    let app_url = format!("http://127.0.0.1:{}/index.html", actual_port);

    launch_native_window(&app_url);
}
