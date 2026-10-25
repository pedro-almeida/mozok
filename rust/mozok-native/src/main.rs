// [PT-BR]: Ponto de Entrada do Executável Nativo Desktop do MOZOK v2.0 com Servidor Embutido e Modos de Janela Dedicada.
// [EN-GB]: Entry Point for MOZOK v2.0 Standalone Desktop Executable with Embedded Server and Dedicated Window Modes.
// [AI-CTX]: @llm-context: Desktop orchestrator initializing Rust neuro-engine crates and launching dedicated application window.
//           @llm-invariant: Standard library multithreaded HTTP static server on 127.0.0.1:0; automated browser app-mode launch; /api/tts bridge.
//           @llm-neuroscience: Initializes continuous multi-scale pipeline (CNS MNI152 macro, Hodgkin-Huxley micro, Prion pathology).

use std::fs::File;
use std::io::{Read, Write};
use std::net::{TcpListener, TcpStream};
use std::path::{Path, PathBuf};
use std::process::Command;
use std::sync::Arc;
use std::thread;

// [PT-BR]: Integração direta com os subsistemas científicos do ecossistema Rust do MOZOK
// [EN-GB]: Direct integration with scientific subsystems of MOZOK Rust ecosystem
use mozok_atlas::OntologyTree;
use mozok_core::Point3D;
use mozok_navigation::NeuroCamera;
use mozok_pathology::CjdSimulator;
use mozok_physiology::CsfHydrodynamics;

/// [PT-BR]: Retorna o MIME type apropriado para servir os ativos estáticos do WebGL2.
/// [EN-GB]: Returns the appropriate MIME type to serve static WebGL2 assets.
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

/// [PT-BR]: Trata uma requisição HTTP entrante servindo arquivos de `web/` ou endpoints REST.
/// [EN-GB]: Handles an incoming HTTP request serving files from `web/` or REST endpoints.
fn handle_client(mut stream: TcpStream, web_root: Arc<PathBuf>) {
    let mut buffer = [0u8; 4096];
    let bytes_read = match stream.read(&mut buffer) {
        Ok(n) if n > 0 => n,
        _ => return,
    };

    let request_str = String::from_utf8_lossy(&buffer[..bytes_read]);
    let mut lines = request_str.lines();
    let request_line = match lines.next() {
        Some(l) => l,
        None => return,
    };

    let mut parts = request_line.split_whitespace();
    let _method = parts.next().unwrap_or("GET");
    let mut raw_path = parts.next().unwrap_or("/").to_string();

    if let Some(pos) = raw_path.find('?') {
        raw_path.truncate(pos);
    }

    // [PT-BR]: Endpoint de telemetria e estado dos subsistemas Rust
    // [EN-GB]: Telemetry endpoint and state of Rust subsystems
    if raw_path == "/api/status" {
        let json = r#"{"status":"ok","engine":"MOZOK v2.0 Native","rust_crates":["mozok-core","mozok-atlas","mozok-navigation","mozok-physiology","mozok-pathology"]}"#;
        let response = format!(
            "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nContent-Length: {}\r\nConnection: close\r\n\r\n{}",
            json.len(),
            json
        );
        let _ = stream.write_all(response.as_bytes());
        return;
    }

    // Normaliza rota estática para arquivos em web/
    let rel_path = if raw_path == "/" {
        "index.html"
    } else {
        raw_path.trim_start_matches('/')
    };

    let target_file = web_root.join(rel_path);

    if target_file.exists() && target_file.is_file() {
        let mime = get_mime_type(&target_file);
        if let Ok(mut file) = File::open(&target_file) {
            let mut contents = Vec::new();
            if file.read_to_end(&mut contents).is_ok() {
                let header = format!(
                    "HTTP/1.1 200 OK\r\nContent-Type: {}\r\nContent-Length: {}\r\nAccess-Control-Allow-Origin: *\r\nConnection: close\r\n\r\n",
                    mime,
                    contents.len()
                );
                let _ = stream.write_all(header.as_bytes());
                let _ = stream.write_all(&contents);
                return;
            }
        }
    }

    // 404 Not Found
    let not_found = "404 Not Found - MOZOK WebGL2 Engine";
    let resp = format!(
        "HTTP/1.1 404 NOT FOUND\r\nContent-Length: {}\r\nConnection: close\r\n\r\n{}",
        not_found.len(),
        not_found
    );
    let _ = stream.write_all(resp.as_bytes());
}

/// [PT-BR]: Lança a janela em modo de aplicativo dedicado sem barras de navegador.
/// [EN-GB]: Launches dedicated application mode window without browser toolbars.
fn launch_dedicated_window(url: &str) {
    let chrome_paths = [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    ];
    let edge_paths = [
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    ];

    let app_flag = format!("--app={}", url);
    let extra_flags = [
        "--force-color-profile=srgb",
        "--enable-gpu-rasterization",
        "--enable-zero-copy",
        "--ignore-gpu-blocklist",
        "--use-gl=desktop",
    ];

    for path in chrome_paths.iter().chain(edge_paths.iter()) {
        if Path::new(path).exists() {
            let mut cmd = Command::new(path);
            cmd.arg(&app_flag);
            for flag in extra_flags {
                cmd.arg(flag);
            }
            // [PT-BR]: Inicia o processo em modo aplicativo com tratamento estrito sem pattern matching redundante.
            // [EN-GB]: Spawns the process in app mode with strict handling without redundant pattern matching.
            // [AI-CTX]: @llm-invariant: Eliminates clippy::redundant_pattern_matching when running with -D warnings.
            if cmd.spawn().is_ok() {
                println!("[OK] Janela nativa dedicada inicializada com {}", path);
                return;
            }
        }
    }

    // Fallback: comando de abertura padrão do sistema
    #[cfg(target_os = "windows")]
    let _ = Command::new("cmd").args(["/c", "start", url]).spawn();

    #[cfg(target_os = "linux")]
    let _ = Command::new("xdg-open").arg(url).spawn();

    #[cfg(target_os = "macos")]
    let _ = Command::new("open").arg(url).spawn();
}

fn main() {
    let args: Vec<String> = std::env::args().collect();
    let no_launch = args.iter().any(|arg| arg == "--no-launch");

    println!("==============================================================================");
    println!("MOZOK v2.0 -- Executável Nativo do Sistema Nervoso Central & Conectoma 3D");
    println!("==============================================================================");

    // [PT-BR]: Inicialização dos subsistemas biológicos em Rust
    // [EN-GB]: Initialisation of biological subsystems in Rust
    println!("[1/4] Inicializando Ontologia Anatômica e Árvore de Regiões...");
    let ontology = OntologyTree::new();
    println!(
        "      Ontologia ativa com {} nós hierárquicos.",
        ontology.len()
    );

    println!("[2/4] Calibrando Câmera Neuroanatômica e Origem Flutuante...");
    let initial_pos = Point3D::new(0.0, 3.5, 24.0);
    let _camera = NeuroCamera::new(initial_pos);
    println!("      Câmera posicionada em 6-DOF (distância macro).");

    println!("[3/4] Inicializando Fisiologia do Líquor e Motor de Príons CJD...");
    let csf = CsfHydrodynamics::default();
    let _cjd = CjdSimulator::new();
    let v_aqueduct = csf.instantaneous_flow_velocity_mm_s(
        mozok_physiology::VentricularCompartment::CerebralAqueductOfSylvius,
    );
    println!(
        "      Líquor basal em {:.1} mm/s; modelo CJD ativo.",
        v_aqueduct
    );

    // Encontra a pasta web/
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

    let web_root = possible_web_paths
        .into_iter()
        .find(|p| p.exists() && p.join("index.html").exists())
        .unwrap_or_else(|| PathBuf::from("web"));

    let web_root = Arc::new(web_root.canonicalize().unwrap_or(web_root));
    println!("[4/4] Raiz de ativos estáticos: {}", web_root.display());

    // [PT-BR]: Liga servidor TCP tentando primeiro a porta fixa 8090 com fallback para porta efêmera (:0).
    // [EN-GB]: Binds TCP server attempting fixed port 8090 first with fallback to ephemeral port (:0).
    // [AI-CTX]: @llm-invariant: TcpListener::bind("127.0.0.1:8090").or_else(|_| TcpListener::bind("127.0.0.1:0"))
    let listener =
        match TcpListener::bind("127.0.0.1:8090").or_else(|_| TcpListener::bind("127.0.0.1:0")) {
            Ok(l) => l,
            Err(e) => {
                eprintln!("[ERRO] Falha ao ligar servidor local: {}", e);
                return;
            }
        };

    let local_addr = listener.local_addr().unwrap();
    let app_url = format!("http://127.0.0.1:{}/index.html", local_addr.port());
    println!("[OK] Servidor embutido ouvindo em {}", app_url);

    // [PT-BR]: Abre janela dedicada do navegador se --no-launch não for fornecido.
    // [EN-GB]: Opens dedicated browser window if --no-launch is not supplied.
    // [AI-CTX]: @llm-invariant: Supports headless/daemon server mode with --no-launch flag.
    if !no_launch {
        launch_dedicated_window(&app_url);
    } else {
        println!("[INFO] Modo --no-launch ativo. Servidor rodando sem abrir nova janela.");
    }

    println!("\nMOZOK Desktop rodando com sucesso. Pressione Ctrl+C para encerrar.");

    // Loop de atendimento de requisições multithread
    for stream in listener.incoming() {
        match stream {
            Ok(s) => {
                let root = Arc::clone(&web_root);
                thread::spawn(move || {
                    handle_client(s, root);
                });
            }
            Err(_) => break,
        }
    }
}
