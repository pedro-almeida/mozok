// [PT-BR]: Aplicativo Desktop Nativo Win32 do MOZOK v2.0 com Aceleração de GPU Dedicada (NVIDIA Optimus / AMD Enduro) e Janela Nativa sem Navegador Externo.
// [EN-GB]: MOZOK v2.0 Native Win32 Desktop Application with Dedicated GPU Acceleration (NVIDIA Optimus / AMD Enduro) and Browserless Native Window.
// [AI-CTX]: @llm-context: Native desktop runtime using tao + wry on Windows with embedded multithreaded static asset server and GPU driver exports.

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs::File;
use std::io::{Read, Write};
use std::net::{TcpListener, TcpStream};
use std::path::{Path, PathBuf};
use std::sync::Arc;
use std::thread;

use mozok_atlas::OntologyTree;
use mozok_core::Point3D;
use mozok_navigation::NeuroCamera;
use mozok_pathology::CjdSimulator;
use mozok_physiology::CsfHydrodynamics;

// [PT-BR]: Símbolos nativos C que forçam o driver NVIDIA Optimus e AMD PowerXpress a usar a GPU dedicada (ex: GTX 1650) no executável.
// [EN-GB]: Native C symbols forcing NVIDIA Optimus and AMD PowerXpress drivers to use the dedicated GPU on this executable.
#[cfg(target_os = "windows")]
#[no_mangle]
pub static NvOptimusEnablement: u32 = 0x00000001;

#[cfg(target_os = "windows")]
#[no_mangle]
pub static AmdPowerXpressRequestHighPerformance: i32 = 1;

fn get_mime_type(path: &Path) -> &'static str {
    match path.extension().and_then(|s| s.to_str()) {
        Some("html") | Some("htm") => "text/html; charset=utf-8",
        Some("js") => "application/javascript; charset=utf-8",
        Some("css") => "text/css; charset=utf-8",
        Some("json") => "application/json",
        Some("png") => "image/png",
        Some("jpg") | Some("jpeg") => "image/jpeg",
        Some("ico") => "image/x-icon",
        Some("svg") => "image/svg+xml",
        Some("mp3") => "audio/mpeg",
        Some("wasm") => "application/wasm",
        _ => "application/octet-stream",
    }
}

fn strip_windows_verbatim(p: PathBuf) -> PathBuf {
    #[cfg(target_os = "windows")]
    {
        let s = p.to_string_lossy();
        if let Some(stripped) = s.strip_prefix(r"\\?\UNC\") {
            return PathBuf::from(format!(r"\\{}", stripped));
        } else if let Some(stripped) = s.strip_prefix(r"\\?\") {
            return PathBuf::from(stripped);
        }
    }
    p
}

fn handle_client(mut stream: TcpStream, web_root: Arc<PathBuf>) {
    let mut buffer = [0u8; 16384];
    let bytes_read = match stream.read(&mut buffer) {
        Ok(n) if n > 0 => n,
        _ => return,
    };

    let request_str = String::from_utf8_lossy(&buffer[..bytes_read]);
    let request_line = match request_str.lines().next() {
        Some(l) => l,
        None => return,
    };

    let mut parts = request_line.split_whitespace();
    let _method = parts.next().unwrap_or("GET");
    let mut raw_path = parts.next().unwrap_or("/").to_string();

    if let Some(pos) = raw_path.find('?') {
        raw_path.truncate(pos);
    }

    if raw_path == "/api/status" {
        let json = r#"{"status":"ok","engine":"MOZOK v2.0 Native GPU","rust_crates":["mozok-core","mozok-atlas","mozok-navigation","mozok-physiology","mozok-pathology"]}"#;
        let response = format!(
            "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nContent-Length: {}\r\nCache-Control: no-store\r\nConnection: close\r\n\r\n{}",
            json.len(),
            json
        );
        let _ = stream.write_all(response.as_bytes());
        return;
    }

    let mut rel_path = PathBuf::new();
    let path_str = if raw_path == "/" {
        "index.html"
    } else {
        raw_path.trim_start_matches('/')
    };

    for part in path_str.split('/') {
        if part.is_empty() || part == "." {
            continue;
        }
        if part == ".." {
            let forbidden = "403 Forbidden";
            let resp = format!(
                "HTTP/1.1 403 FORBIDDEN\r\nContent-Length: {}\r\nConnection: close\r\n\r\n{}",
                forbidden.len(),
                forbidden
            );
            let _ = stream.write_all(resp.as_bytes());
            return;
        }
        rel_path.push(part);
    }

    if rel_path.as_os_str().is_empty() {
        rel_path.push("index.html");
    }

    let target_file = strip_windows_verbatim(web_root.join(&rel_path));

    if target_file.exists() && target_file.is_file() {
        let mime = get_mime_type(&target_file);
        if let Ok(mut file) = File::open(&target_file) {
            let mut contents = Vec::new();
            if file.read_to_end(&mut contents).is_ok() {
                let header = format!(
                    "HTTP/1.1 200 OK\r\nContent-Type: {}\r\nContent-Length: {}\r\nAccess-Control-Allow-Origin: *\r\nCache-Control: no-store\r\nConnection: close\r\n\r\n",
                    mime,
                    contents.len()
                );
                let _ = stream.write_all(header.as_bytes());
                let _ = stream.write_all(&contents);
                return;
            }
        }
    }

    let not_found = "404 Not Found";
    let resp = format!(
        "HTTP/1.1 404 NOT FOUND\r\nContent-Length: {}\r\nCache-Control: no-store\r\nConnection: close\r\n\r\n{}",
        not_found.len(),
        not_found
    );
    let _ = stream.write_all(resp.as_bytes());
}

#[cfg(target_os = "windows")]
fn run_native_windows_gui(app_url: String, web_root: PathBuf) {
    use tao::{
        dpi::LogicalSize,
        event::{Event, WindowEvent},
        event_loop::{ControlFlow, EventLoop},
        window::{Icon, WindowBuilder},
    };
    use wry::WebViewBuilder;

    // Configura flags de GPU de alta performance para o motor gráfico nativo
    std::env::set_var(
        "WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS",
        "--ignore-gpu-blocklist --enable-gpu-rasterization --enable-zero-copy --enable-webgl2-compute-context --autoplay-policy=no-user-gesture-required",
    );

    let event_loop = EventLoop::new();

    let mut win_builder = WindowBuilder::new()
        .with_title("MOZOK v2.0 — Atlas e Simulador Neuroanatômico 3D Multiescala (GPU Nativo)")
        .with_inner_size(LogicalSize::new(1440.0, 900.0))
        .with_maximized(true);

    let icon_candidate = web_root.join("assets").join("icon.png");
    if let Ok(img) = image::open(&icon_candidate) {
        let rgba = img
            .resize_exact(64, 64, image::imageops::FilterType::Lanczos3)
            .to_rgba8();
        let (w, h) = rgba.dimensions();
        if let Ok(win_icon) = Icon::from_rgba(rgba.into_raw(), w, h) {
            win_builder = win_builder.with_window_icon(Some(win_icon));
        }
    }

    let window = match win_builder.build(&event_loop) {
        Ok(w) => w,
        Err(_) => return,
    };

    let _webview = match WebViewBuilder::new()
        .with_url(&app_url)
        .with_devtools(true)
        .build(&window)
    {
        Ok(wv) => wv,
        Err(_) => {
            // Fallback caso o runtime WebView2 não esteja presente na máquina
            let _ = std::process::Command::new("cmd")
                .args(["/C", "start", "", &app_url])
                .spawn();
            return;
        }
    };

    event_loop.run(move |event, _, control_flow| {
        *control_flow = ControlFlow::Wait;
        if let Event::WindowEvent {
            event: WindowEvent::CloseRequested,
            ..
        } = event
        {
            *control_flow = ControlFlow::Exit;
        }
    });
}

fn main() {
    let args: Vec<String> = std::env::args().collect();
    let no_launch = args.iter().any(|arg| arg == "--no-launch");

    let _ontology = OntologyTree::new();
    let _camera = NeuroCamera::new(Point3D::new(0.0, 3.5, 24.0));
    let _csf = CsfHydrodynamics::default();
    let _cjd = CjdSimulator::new();

    let exe_dir = std::env::current_exe()
        .ok()
        .and_then(|p| p.parent().map(|d| d.to_path_buf()))
        .unwrap_or_else(|| PathBuf::from("."));

    let possible_web_paths = [
        PathBuf::from("web"),
        exe_dir.join("web"),
        exe_dir.join("../web"),
        exe_dir.join("../../web"),
    ];

    let web_root_raw = possible_web_paths
        .into_iter()
        .find(|p| p.exists() && p.join("index.html").exists())
        .unwrap_or_else(|| PathBuf::from("web"));

    let web_root = Arc::new(strip_windows_verbatim(
        web_root_raw.canonicalize().unwrap_or(web_root_raw),
    ));

    let listener =
        match TcpListener::bind("127.0.0.1:8090").or_else(|_| TcpListener::bind("127.0.0.1:0")) {
            Ok(l) => l,
            Err(_) => return,
        };

    let local_addr = listener.local_addr().unwrap();
    let app_url = format!(
        "http://127.0.0.1:{}/index.html?v=native3",
        local_addr.port()
    );

    if !no_launch {
        #[cfg(target_os = "windows")]
        {
            let server_root = Arc::clone(&web_root);
            thread::spawn(move || {
                for stream in listener.incoming().flatten() {
                    let root = Arc::clone(&server_root);
                    thread::spawn(move || {
                        handle_client(stream, root);
                    });
                }
            });
            run_native_windows_gui(app_url, (*web_root).clone());
            return;
        }

        #[cfg(target_os = "linux")]
        let _ = std::process::Command::new("xdg-open").arg(&app_url).spawn();

        #[cfg(target_os = "macos")]
        let _ = std::process::Command::new("open").arg(&app_url).spawn();
    }

    for stream in listener.incoming().flatten() {
        let root = Arc::clone(&web_root);
        thread::spawn(move || {
            handle_client(stream, root);
        });
    }
}
