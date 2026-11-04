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

fn url_decode(input: &str) -> String {
    let mut bytes = Vec::with_capacity(input.len());
    let mut chars = input.as_bytes().iter().copied();
    while let Some(b) = chars.next() {
        if b == b'+' {
            bytes.push(b' ');
        } else if b == b'%' {
            let h1 = chars.next();
            let h2 = chars.next();
            if let (Some(c1), Some(c2)) = (h1, h2) {
                let hex = [c1, c2];
                if let Ok(s) = std::str::from_utf8(&hex) {
                    if let Ok(val) = u8::from_str_radix(s, 16) {
                        bytes.push(val);
                        continue;
                    }
                }
            }
        } else {
            bytes.push(b);
        }
    }
    String::from_utf8_lossy(&bytes).into_owned()
}

fn parse_query_param(query: &str, key: &str) -> Option<String> {
    for pair in query.split('&') {
        let mut kv = pair.splitn(2, '=');
        let k = kv.next()?.trim();
        let v = kv.next().unwrap_or("");
        if k == key {
            return Some(url_decode(v));
        }
    }
    None
}

fn simple_hash_hex(input: &str) -> String {
    use std::collections::hash_map::DefaultHasher;
    use std::hash::{Hash, Hasher};
    let mut hasher = DefaultHasher::new();
    input.hash(&mut hasher);
    let h1 = hasher.finish();
    format!("{:016x}{:08x}", h1, input.len())
}

fn find_bridge_script(web_root: &Path) -> Option<PathBuf> {
    let candidates = [
        web_root.join("../tools/gemini_tts_bridge.py"),
        web_root.join("../../tools/gemini_tts_bridge.py"),
        PathBuf::from("tools/gemini_tts_bridge.py"),
        PathBuf::from("../tools/gemini_tts_bridge.py"),
    ];
    for c in candidates {
        if c.exists() && c.is_file() {
            return c.canonicalize().ok().or(Some(c));
        }
    }
    None
}

fn handle_http_stream(mut stream: TcpStream, web_root: PathBuf, port: u16) {
    let mut buffer = [0u8; 8192];
    let n = match stream.read(&mut buffer) {
        Ok(n) if n > 0 => n,
        _ => return,
    };

    let mut full_req = buffer[..n].to_vec();
    if let Some(header_end) = full_req.windows(4).position(|w| w == b"\r\n\r\n") {
        let headers_str = String::from_utf8_lossy(&full_req[..header_end]);
        let mut content_length: usize = 0;
        for line in headers_str.lines() {
            let lower = line.to_lowercase();
            if lower.starts_with("content-length:") {
                if let Some(val_str) = line.split(':').nth(1) {
                    content_length = val_str.trim().parse::<usize>().unwrap_or(0);
                }
            }
        }
        let mut body_len = full_req.len() - (header_end + 4);
        while body_len < content_length {
            let mut chunk = [0u8; 4096];
            match stream.read(&mut chunk) {
                Ok(chunk_n) if chunk_n > 0 => {
                    full_req.extend_from_slice(&chunk[..chunk_n]);
                    body_len += chunk_n;
                }
                _ => break,
            }
        }
    }

    let req_str = String::from_utf8_lossy(&full_req);
    let first_line = req_str.lines().next().unwrap_or("GET / HTTP/1.1");

    if first_line.starts_with("OPTIONS ") {
        let header = "HTTP/1.1 204 No Content\r\nAccess-Control-Allow-Origin: *\r\nAccess-Control-Allow-Methods: GET, POST, OPTIONS\r\nAccess-Control-Allow-Headers: Content-Type\r\nConnection: close\r\n\r\n";
        let _ = stream.write_all(header.as_bytes());
        return;
    }

    let raw_url = first_line.split_whitespace().nth(1).unwrap_or("/");
    let path_only = raw_url.split('?').next().unwrap_or("/");

    if path_only == "/health" {
        let body = br#"{"status":"ok","engine":"mozok-native","port":8090}"#;
        let header = format!(
            "HTTP/1.1 200 OK\r\nContent-Type: application/json; charset=utf-8\r\nContent-Length: {}\r\nCache-Control: no-store, no-cache, must-revalidate, max-age=0\r\nPragma: no-cache\r\nConnection: close\r\n\r\n",
            body.len()
        );
        let _ = stream.write_all(header.as_bytes());
        let _ = stream.write_all(body);
        return;
    }

    if path_only == "/api/version" {
        let body = format!(
            r#"{{"version":"6.1.0","git_sha":"{}"}}"#,
            env!("CARGO_PKG_VERSION")
        );
        let header = format!(
            concat!(
                "HTTP/1.1 200 OK\r\n",
                "Content-Type: application/json; charset=utf-8\r\n",
                "Content-Length: {}\r\n",
                "Cache-Control: no-store, no-cache, must-revalidate, max-age=0\r\n",
                "Pragma: no-cache\r\n",
                "Access-Control-Allow-Origin: *\r\n",
                "Connection: close\r\n\r\n"
            ),
            body.len()
        );
        let _ = stream.write_all(header.as_bytes());
        let _ = stream.write_all(body.as_bytes());
        return;
    }

    if path_only == "/api/gemini-tts" {
        let query_str = raw_url.split_once('?').map(|x| x.1).unwrap_or("");
        let text = parse_query_param(query_str, "text").unwrap_or_default();
        let lang = parse_query_param(query_str, "lang").unwrap_or_else(|| "pt-BR".to_string());
        let voice = parse_query_param(query_str, "voice").unwrap_or_else(|| "Aoede".to_string());
        let item_id = parse_query_param(query_str, "id").unwrap_or_default();

        if text.trim().is_empty() {
            let body = b"{\"error\":\"Parametro text obrigatorio\"}";
            let header = format!(
                "HTTP/1.1 400 Bad Request\r\nContent-Type: application/json\r\nContent-Length: {}\r\nAccess-Control-Allow-Origin: *\r\nConnection: close\r\n\r\n",
                body.len()
            );
            let _ = stream.write_all(header.as_bytes());
            let _ = stream.write_all(body);
            return;
        }

        if !item_id.is_empty()
            && item_id
                .chars()
                .all(|c| c.is_ascii_alphanumeric() || c == '_' || c == '-')
        {
            let pregen_mp3 = web_root
                .join("assets")
                .join("audio")
                .join(&lang)
                .join(format!("{}.mp3", item_id));
            if pregen_mp3.exists() {
                if let Ok(mut f) = fs::File::open(&pregen_mp3) {
                    let mut audio_bytes = Vec::new();
                    if f.read_to_end(&mut audio_bytes).is_ok() {
                        let header = format!(
                            concat!(
                                "HTTP/1.1 200 OK\r\n",
                                "Content-Type: audio/mpeg\r\n",
                                "Content-Length: {}\r\n",
                                "Accept-Ranges: bytes\r\n",
                                "Access-Control-Allow-Origin: *\r\n",
                                "Cache-Control: public, max-age=86400\r\n",
                                "Connection: close\r\n\r\n"
                            ),
                            audio_bytes.len()
                        );
                        let _ = stream.write_all(header.as_bytes());
                        let _ = stream.write_all(&audio_bytes);
                        return;
                    }
                }
            }
        }

        let cache_dir = web_root.join("assets").join("audio_cache");
        let _ = fs::create_dir_all(&cache_dir);
        let hash = simple_hash_hex(&format!("{}:{}:{}", lang, voice, text));
        let cache_file = cache_dir.join(format!("{}_{}.mp3", lang, hash));

        if !cache_file.exists() {
            let bridge_script = find_bridge_script(&web_root)
                .unwrap_or_else(|| PathBuf::from("tools/gemini_tts_bridge.py"));
            let mut cmd = std::process::Command::new("python");
            cmd.args([
                bridge_script
                    .to_str()
                    .unwrap_or("tools/gemini_tts_bridge.py"),
                "--mode",
                "tts",
                "--lang",
                &lang,
                "--voice",
                &voice,
                "--text",
                &text,
                "--output",
                cache_file.to_str().unwrap_or(""),
            ]);
            #[cfg(target_os = "windows")]
            {
                use std::os::windows::process::CommandExt;
                const CREATE_NO_WINDOW: u32 = 0x08000000;
                cmd.creation_flags(CREATE_NO_WINDOW);
            }
            let _ = cmd.status();
        }

        if cache_file.exists() {
            if let Ok(mut f) = fs::File::open(&cache_file) {
                let mut audio_bytes = Vec::new();
                if f.read_to_end(&mut audio_bytes).is_ok() {
                    let header = format!(
                        concat!(
                            "HTTP/1.1 200 OK\r\n",
                            "Content-Type: audio/mpeg\r\n",
                            "Content-Length: {}\r\n",
                            "Accept-Ranges: bytes\r\n",
                            "Access-Control-Allow-Origin: *\r\n",
                            "Cache-Control: public, max-age=86400\r\n",
                            "Connection: close\r\n\r\n"
                        ),
                        audio_bytes.len()
                    );
                    let _ = stream.write_all(header.as_bytes());
                    let _ = stream.write_all(&audio_bytes);
                    return;
                }
            }
        }

        let body = b"{\"error\":\"Falha ao sintetizar audio Gemini TTS\"}";
        let header = format!(
            "HTTP/1.1 502 Bad Gateway\r\nContent-Type: application/json\r\nContent-Length: {}\r\nAccess-Control-Allow-Origin: *\r\nConnection: close\r\n\r\n",
            body.len()
        );
        let _ = stream.write_all(header.as_bytes());
        let _ = stream.write_all(body);
        return;
    }

    if path_only == "/api/gemini-translate" {
        let body_bytes = if let Some(pos) = full_req.windows(4).position(|w| w == b"\r\n\r\n") {
            full_req[pos + 4..].to_vec()
        } else {
            Vec::new()
        };

        let body_str = String::from_utf8_lossy(&body_bytes);
        let target_lang = if let Some(pos) = body_str
            .find("\"target_lang\"")
            .or_else(|| body_str.find("\"targetLang\""))
        {
            let rem = &body_str[pos..];
            if let Some(colon) = rem.find(':') {
                let val_part = &rem[colon + 1..];
                val_part.split('"').nth(1).unwrap_or("en-GB").to_string()
            } else {
                "en-GB".to_string()
            }
        } else {
            "en-GB".to_string()
        };

        let tmp_in = env::temp_dir().join(format!(
            "mozok_trans_in_{}.json",
            simple_hash_hex(&body_str)
        ));
        let tmp_out = env::temp_dir().join(format!(
            "mozok_trans_out_{}.json",
            simple_hash_hex(&body_str)
        ));

        let _ = fs::write(&tmp_in, &body_bytes);

        let bridge_script = find_bridge_script(&web_root)
            .unwrap_or_else(|| PathBuf::from("tools/gemini_tts_bridge.py"));
        let mut cmd = std::process::Command::new("python");
        cmd.args([
            bridge_script
                .to_str()
                .unwrap_or("tools/gemini_tts_bridge.py"),
            "--mode",
            "translate",
            "--lang",
            &target_lang,
            "--input-json",
            tmp_in.to_str().unwrap_or(""),
            "--output",
            tmp_out.to_str().unwrap_or(""),
        ]);
        #[cfg(target_os = "windows")]
        {
            use std::os::windows::process::CommandExt;
            const CREATE_NO_WINDOW: u32 = 0x08000000;
            cmd.creation_flags(CREATE_NO_WINDOW);
        }
        let _ = cmd.status();

        let mut translated_json = Vec::new();
        if tmp_out.exists() {
            if let Ok(mut f) = fs::File::open(&tmp_out) {
                let _ = f.read_to_end(&mut translated_json);
            }
            let _ = fs::remove_file(&tmp_out);
        }
        let _ = fs::remove_file(&tmp_in);

        if !translated_json.is_empty() {
            let header = format!(
                concat!(
                    "HTTP/1.1 200 OK\r\n",
                    "Content-Type: application/json; charset=utf-8\r\n",
                    "Content-Length: {}\r\n",
                    "Access-Control-Allow-Origin: *\r\n",
                    "Cache-Control: no-store\r\n",
                    "Connection: close\r\n\r\n"
                ),
                translated_json.len()
            );
            let _ = stream.write_all(header.as_bytes());
            let _ = stream.write_all(&translated_json);
            let _ = stream.flush();
            let _ = stream.shutdown(std::net::Shutdown::Both);
            return;
        }

        let body = b"{\"error\":\"Falha ao traduzir ficha neuroanatomica\"}";
        let header = format!(
            "HTTP/1.1 502 Bad Gateway\r\nContent-Type: application/json\r\nContent-Length: {}\r\nAccess-Control-Allow-Origin: *\r\nConnection: close\r\n\r\n",
            body.len()
        );
        let _ = stream.write_all(header.as_bytes());
        let _ = stream.write_all(body);
        let _ = stream.flush();
        let _ = stream.shutdown(std::net::Shutdown::Both);
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
                        "Cache-Control: no-store, no-cache, must-revalidate, max-age=0\r\n",
                        "Pragma: no-cache\r\n",
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

    let win_title = "MOZOK Beta — Simulacro Neurofisiológico e Clínico 3D (SNC, SNP & Meninges)";
    let event_loop = EventLoop::new();
    let window = WindowBuilder::new()
        .with_title(win_title)
        .with_inner_size(LogicalSize::new(1600.0, 940.0))
        .with_min_inner_size(LogicalSize::new(320.0, 480.0))
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

    if std::env::args().any(|a| a == "--server-only" || a == "--headless")
        || std::env::var("MOZOK_SERVER_ONLY").is_ok()
    {
        println!(
            "MOZOK HTTP server running in server-only mode at {}",
            app_url
        );
        loop {
            std::thread::sleep(std::time::Duration::from_secs(3600));
        }
    }

    launch_native_window(&app_url);
}
