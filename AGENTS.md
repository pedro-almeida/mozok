# 📜 AGENTS.md — Carta Magna do Mozok v6.1 (Simulacro Neurofisiológico 3D)

1. **Aceleração Gráfica Dedicada e Isolamento de VRAM:**
   - O binário `mozok-native.exe` (`rust/mozok-native/src/main.rs`) exporta obrigatoriamente `NvOptimusEnablement = 0x00000001` e `AmdPowerXpressRequestHighPerformance = 1`.
   - A preferência de registro `GpuPreference=2;` no Windows aplica-se exclusivamente a `mozok-native.exe`, nunca globalmente a `msedgewebview2.exe`.
   - Porta local canônica: `127.0.0.1:8090`.

2. **Invalidação Instantânea de Cache Sincronizada com o GitHub (Zero Stale Cache):**
   - O servidor HTTP embutido em `rust/mozok-native/src/main.rs` e o Service Worker `web/sw.js` operam sob política estrita `Cache-Control: no-store, no-cache, must-revalidate, max-age=0`.
   - O endpoint `/api/version` (e o watcher em `web/index.html`) compara o SHA local com a API do GitHub (`pedro-almeida/mozok/commits/main`). Qualquer novo commit postado no GitHub invalida imediatamente os caches do navegador/celular e recarrega a aplicação (`window.location.replace`).

3. **Rigor Anatômico e Biofísico (9 Escalas):**
   - Coordenadas estereotáxicas RAS+ MNI152 (ICBM 2009c Nonlinear Asymmetric) em milímetros.
   - Simulação biofísica real Hodgkin-Huxley ($C_m \frac{dV}{dt} = I_{\text{ext}} - I_{\text{Na}} - I_{\text{K}} - I_{\text{L}}$), 7 patologias clínicas e 3 camadas meníngeas + fluxo de LCR.

4. **Qualidade Rust Workspace:**
   - Todo commit deve passar em `cargo fmt --all -- --check`, `cargo clippy --workspace -- -D warnings` e `cargo test --workspace`.

