import pathlib
import re

ROOT = pathlib.Path(".")

# 1. Atualizar versão para 1.0009
(ROOT / "VERSION").write_text("1.0009\n", encoding="utf-8")

cargo_path = ROOT / "Cargo.toml"
cargo_txt = cargo_path.read_text(encoding="utf-8")
cargo_txt = re.sub(
    r'version\s*=\s*"1\.0\.\d+\+\d+"',
    'version = "1.0.9+0009"',
    cargo_txt,
    count=1,
)
cargo_path.write_text(cargo_txt, encoding="utf-8")

sw_path = ROOT / "web" / "sw.js"
if sw_path.exists():
    sw_txt = sw_path.read_text(encoding="utf-8")
    sw_txt = re.sub(r"mozok-v1\.\d+-github-sync", "mozok-v1.0009-github-sync", sw_txt)
    sw_path.write_text(sw_txt, encoding="utf-8")

html_path = ROOT / "web" / "index.html"
html = html_path.read_text(encoding="utf-8")

# Atualizar referências de versão na interface
html = re.sub(r"v1\.000[5678]", "v1.0009", html)
html = html.replace("1.0.8+0008", "1.0.9+0009").replace("version: '1.0008'", "version: '1.0009'")

# ==============================================================================
# 2. CORRIGIR SOBREPOSIÇÃO NO CANTO INFERIOR CENTRAL (#mozok-scale-hud vs #nav-pan-hud)
# ==============================================================================
html = re.sub(
    r"#mozok-scale-hud\s*\{[^}]*\}",
    """#mozok-scale-hud {
            position: fixed;
            bottom: 66px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 25;
            background: rgba(8, 15, 30, 0.88);
            backdrop-filter: blur(14px);
            border: 1px solid rgba(0, 242, 254, 0.35);
            border-radius: 12px;
            padding: 6px 14px;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 8px 28px rgba(0, 0, 0, 0.5);
            max-width: calc(100vw - 760px);
            white-space: nowrap;
        }""",
    html,
    count=1,
)

# Ajustar #mozok-subtitle-bar para ficar acima do #mozok-scale-hud quando visível (sem sobrepor)
html = re.sub(
    r"(#mozok-subtitle-bar\s*\{[^}]*?)bottom:\s*68px;",
    r"\1bottom: 114px;",
    html,
    count=1,
)

# ==============================================================================
# 3. REMOVER 100% O PLUGIN ANTIGO DO VLIBRAS (BOTÃO AZUL FLUTUANTE E SCRIPT EXTERNO)
# ==============================================================================
html = re.sub(
    r'<input id="vlibras-speech-bridge"[^>]*>',
    "",
    html,
)
html = re.sub(
    r'<!-- DOCK NATIVO INTEGRADO DO VLIBRAS[\s\S]*?(?=<!-- BARRA DE PALCO)',
    "",
    html,
)
html = re.sub(
    r"const script = document\.createElement\('script'\);\s*script\.src = 'https://vlibras\.gov\.br/app/vlibras-plugin\.js'[\s\S]*?document\.body\.appendChild\(script\);",
    "// VLibras plugin externo removido em favor do Avatar 3D Nativo MOZOK (v1.0009)",
    html,
)

# ==============================================================================
# 4. SUBSTITUIR ESTILOS DA APRESENTAÇÃO DOOM 3 + CONTROLES MINIMALISTAS + AVATAR NATIVO
# ==============================================================================
new_v10009_styles = """<style id="mozok-v10009-doom3-styles">
        .doom3-font-title {
            font-family: 'Orbitron', 'Rajdhani', sans-serif !important;
            letter-spacing: 0.24em !important;
            text-transform: uppercase;
        }
        .doom3-font-terminal {
            font-family: 'Share Tech Mono', 'Orbitron', monospace !important;
            letter-spacing: 0.08em !important;
        }
        #doom3-intro-overlay {
            position: fixed;
            inset: 0;
            z-index: 95;
            background: rgba(0, 2, 6, 0.38);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            pointer-events: auto;
            transition: opacity 0.45s ease;
        }
        #doom3-intro-overlay.hidden-intro {
            display: none !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }
        #cyber-hex-canvas {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            pointer-events: none;
        }
        .cyber-scanline-overlay {
            position: absolute;
            inset: 0;
            z-index: 2;
            pointer-events: none;
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.30) 50%),
                        linear-gradient(90deg, rgba(0, 242, 254, 0.025), rgba(0, 0, 0, 0), rgba(0, 242, 254, 0.025));
            background-size: 100% 3px, 6px 100%;
        }

        /* ATO I: TELA PRETA COM NOME MOZOK E RAIOS ELÉTRICOS */
        #mozok-lightning-stage {
            position: absolute;
            inset: 0;
            z-index: 20;
            background: #000206;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            transition: opacity 0.65s ease;
        }
        #mozok-lightning-canvas {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            z-index: 21;
        }
        .mozok-title-glow {
            position: relative;
            z-index: 22;
            font-family: 'Orbitron', sans-serif;
            font-size: clamp(3.4rem, 8.5vw, 7.2rem);
            font-weight: 900;
            letter-spacing: 0.30em;
            color: #e0f2fe;
            text-shadow: 0 0 22px rgba(0, 242, 254, 0.95), 0 0 58px rgba(0, 180, 216, 0.85), 0 0 110px rgba(0, 242, 254, 0.45);
            user-select: none;
            text-align: center;
            animation: mozokElectricPulse 2.4s ease-in-out infinite;
        }
        .mozok-subtitle-sci {
            position: relative;
            z-index: 22;
            font-family: 'Share Tech Mono', monospace;
            font-size: clamp(0.75rem, 1.6vw, 1.05rem);
            color: #38bdf8;
            letter-spacing: 0.44em;
            text-transform: uppercase;
            margin-top: 12px;
            text-shadow: 0 0 14px rgba(56, 189, 248, 0.85);
            text-align: center;
        }
        @keyframes mozokElectricPulse {
            0%, 100% { filter: brightness(1); transform: scale(1); }
            48% { filter: brightness(1.08); }
            50% { filter: brightness(1.35) drop-shadow(0 0 18px #00f2fe); transform: scale(1.008); }
            52% { filter: brightness(1); transform: scale(1); }
        }

        /* ATO II: SOMENTE AS FRASES EM AZUL CIANO NO CENTRO DA TELA (ESTILO DOOM 3 PURO) */
        #doom3-narrative-stage {
            position: relative;
            z-index: 10;
            max-width: 960px;
            width: 88%;
            text-align: center;
            pointer-events: none;
            transition: opacity 0.5s ease;
        }
        #doom3-typewriter-text {
            font-family: 'Orbitron', 'Share Tech Mono', sans-serif;
            font-size: clamp(1.35rem, 2.5vw, 2.2rem);
            font-weight: 700;
            line-height: 1.55;
            color: #00f2fe;
            text-shadow: 0 0 18px rgba(0, 242, 254, 0.95), 0 0 42px rgba(0, 180, 216, 0.65);
            transition: transform 0.04s linear, filter 0.04s linear;
        }
        #doom3-typewriter-text.shock-glitch {
            text-shadow: -3px 0 #ff2a85, 3px 0 #00f2fe, 0 0 28px #ffffff;
            transform: translate(1.5px, -1px) skewX(-1.5deg);
            filter: brightness(1.45);
        }
        #doom3-cursor-block {
            display: inline-block;
            color: #00f2fe;
            text-shadow: 0 0 18px #00f2fe;
            animation: doom3CursorBlink 0.72s infinite steps(1);
        }
        @keyframes doom3CursorBlink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }

        /* CONTROLES MINIMALISTAS NO CANTO INFERIOR DIREITO (QUASE INVISÍVEIS ATÉ HOVER) */
        #doom3-minimal-controls {
            position: fixed;
            bottom: 22px;
            right: 24px;
            z-index: 125;
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 12px;
            border-radius: 999px;
            background: rgba(2, 10, 20, 0.35);
            border: 1px solid rgba(0, 242, 254, 0.16);
            backdrop-filter: blur(8px);
            opacity: 0.14;
            transition: opacity 0.25s ease, background 0.25s ease, border-color 0.25s ease;
            pointer-events: auto;
        }
        #doom3-minimal-controls:hover,
        #doom3-minimal-controls.paused-highlight {
            opacity: 1 !important;
            background: rgba(2, 10, 22, 0.88);
            border-color: rgba(0, 242, 254, 0.55);
            box-shadow: 0 0 24px rgba(0, 242, 254, 0.25);
        }
        .doom3-icon-btn {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: 1px solid rgba(0, 242, 254, 0.32);
            background: rgba(0, 242, 254, 0.08);
            color: #bae6fd;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .doom3-icon-btn svg.hidden {
            display: none !important;
        }
        .doom3-icon-btn:hover {
            background: rgba(0, 242, 254, 0.25);
            border-color: #00f2fe;
            color: #ffffff;
            transform: scale(1.08);
        }
        .doom3-icon-btn.active {
            background: rgba(16, 185, 129, 0.25);
            border-color: #34d399;
            color: #6ee7b7;
        }
        .doom3-icon-btn.danger:hover {
            background: rgba(239, 68, 68, 0.28);
            border-color: #f87171;
            color: #fecaca;
        }

        /* AVATAR NATIVO DE LIBRAS INTEGRADO AO LAYOUT DO MOZOK (SEM PLUGIN EXTERNO) */
        #mozok-libras-native-panel {
            position: fixed;
            bottom: 72px;
            right: 24px;
            width: 220px;
            z-index: 122;
            background: rgba(2, 10, 20, 0.88);
            border: 1px solid rgba(0, 242, 254, 0.45);
            border-radius: 14px;
            backdrop-filter: blur(12px);
            box-shadow: 0 0 28px rgba(0, 242, 254, 0.22);
            display: none;
            flex-direction: column;
            overflow: hidden;
            pointer-events: auto;
        }
        #mozok-libras-native-panel.active {
            display: flex;
        }
        #mozok-libras-canvas {
            width: 220px;
            height: 220px;
            display: block;
        }
        #mozok-libras-gloss-bar {
            padding: 6px 10px;
            font-family: 'Share Tech Mono', monospace;
            font-size: 10.5px;
            color: #67e8f9;
            background: rgba(0, 242, 254, 0.08);
            border-top: 1px solid rgba(0, 242, 254, 0.25);
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    </style>"""

idx_style = html.find('<style id="mozok-v1000')
if idx_style != -1:
    idx_style_end = html.find("</style>", idx_style) + len("</style>")
    html = html[:idx_style] + new_v10009_styles + html[idx_style_end:]

# ==============================================================================
# 5. SUBSTITUIR HTML DO OVERLAY (#doom3-intro-overlay) + AVATAR LIBRAS NATIVO
# ==============================================================================
overlay_start = html.find('<div id="doom3-intro-overlay"')
if overlay_start != -1:
    pos = overlay_start
    depth = 0
    overlay_end = -1
    while pos < len(html):
        if html[pos : pos + 4] == "<div":
            depth += 1
            pos += 4
        elif html[pos : pos + 6] == "</div>":
            depth -= 1
            pos += 6
            if depth == 0:
                overlay_end = pos
                break
        else:
            pos += 1

    new_overlay_html = """<div id="doom3-intro-overlay" class="hidden-intro" role="dialog" aria-label="Apresentação Científica MOZOK">
        <canvas id="cyber-hex-canvas"></canvas>
        <div class="cyber-scanline-overlay"></div>

        <!-- ATO I: ABERTURA MOZOK COM RAIOS ELÉTRICOS -->
        <div id="mozok-lightning-stage">
            <canvas id="mozok-lightning-canvas"></canvas>
            <div class="mozok-title-glow">MOZOK</div>
            <div class="mozok-subtitle-sci">BIO-SIMULATION ENGINE // ESPECTRO IPÊ</div>
        </div>

        <!-- ATO II: FRASES EM AZUL CIANO PURO NO MEIO DA TELA (SEM BARRAS OU CAIXAS) -->
        <div id="doom3-narrative-stage" style="display:none; opacity:0;">
            <span id="doom3-typewriter-text"></span><span id="doom3-cursor-block">█</span>
        </div>

        <!-- CONTROLES MINIMALISTAS NO CANTO INFERIOR DIREITO (QUASE INVISÍVEIS ATÉ HOVER) -->
        <div id="doom3-minimal-controls">
            <button id="btn-doom3-pause" class="doom3-icon-btn" title="Pausar / Continuar [Espaço]">
                <svg id="icon-doom3-pause" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>
                <svg id="icon-doom3-play" class="hidden" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            </button>
            <button id="btn-doom3-restart" class="doom3-icon-btn" title="Recomeçar Pausado com MOZOK e Raios Elétricos">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            </button>
            <button id="btn-doom3-libras" class="doom3-icon-btn" title="Ativar/Ocultar Intérprete de Libras Integrado">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2.2"/><path d="M7 10.5c1.5-1 3.2-1.5 5-1.5s3.5.5 5 1.5"/><path d="M8 10.5l-2.5 4.5 2 1.5"/><path d="M16 10.5l2.5 4.5-2 1.5"/><path d="M10 14v6"/><path d="M14 14v6"/></svg>
            </button>
            <button id="btn-doom3-skip" class="doom3-icon-btn danger" title="Sair da Apresentação [ESC]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
        </div>
    </div>

    <!-- AVATAR NATIVO DE LIBRAS INTEGRADO AO LAYOUT DO MOZOK -->
    <div id="mozok-libras-native-panel">
        <canvas id="mozok-libras-canvas" width="220" height="220"></canvas>
        <div id="mozok-libras-gloss-bar">LIBRAS // AGUARDANDO FALA</div>
    </div>"""

    if overlay_end != -1:
        html = html[:overlay_start] + new_overlay_html + html[overlay_end:]

# ==============================================================================
# 6. REMOVER ZOOM INTRUSIVO EM evaluateContinuousMultiscaleZoom
# ==============================================================================
old_zoom_start = html.find("function evaluateContinuousMultiscaleZoom()")
if old_zoom_start != -1:
    old_zoom_end = html.find("if (scaleSlider) {", old_zoom_start)
    if old_zoom_end != -1:
        clean_zoom = """function evaluateContinuousMultiscaleZoom() {
                const dist = camera.position.distanceTo(controls.target);
                const minD = 0.16, maxD = 45.0;
                const clampedD = Math.max(minD, Math.min(maxD, dist));
                const depthPct = Math.round((1.0 - (Math.log(clampedD) - Math.log(minD)) / (Math.log(maxD) - Math.log(minD))) * 100);
                if (scaleSlider && document.activeElement !== scaleSlider) {
                    scaleSlider.value = String(Math.max(0, Math.min(100, depthPct)));
                }
                // v1.0009: Sem zoom intrusivo. O usuário pode afastar a câmera nos neurônios livremente sem voltar pro cérebro.
                if (isMicroMode && typeof neuralMicro.setMultiscaleDepth === 'function') {
                    neuralMicro.setMultiscaleDepth(dist);
                }
            }

            """
        html = html[:old_zoom_start] + clean_zoom + html[old_zoom_end:]

# Garantir que toggleDoom3PresentationPause não sobrescreva o innerHTML/textContent dos ícones SVG de #btn-doom3-pause
html = html.replace("if (pauseBtn) pauseBtn.textContent = '▶ Continuar [Espaço]';", "")
html = html.replace("if (pauseBtn) pauseBtn.textContent = '⏸ Pausar [Espaço]';", "")

# ==============================================================================
# 7. ATUALIZAR MOTOR JAVASCRIPT: CHOQUE ELÉTRICO DOOM 3, RECOMEÇAR PAUSADO,
#    AVATAR LIBRAS NATIVO E ENCERRAMENTO 100% LIMPO
# ==============================================================================
fn_start = html.find("// RENDERIZADOR DE RAIOS ELÉTRICOS EM TEMPO REAL")
if fn_start == -1:
    fn_start = html.find("function startDoom3ScientificPresentation")

if fn_start != -1:
    fn_end = html.find("// =====================================================================", fn_start + 100)
    if fn_end != -1:
        new_js_engine = """// AVATAR INTÉRPRETE DE LIBRAS NATIVO EM THREE.JS / CANVAS INTEGRADO AO MOZOK
            const MozokLibrasAvatar = (() => {
                let animId = null;
                let active = false;
                let signing = false;
                let currentGlossTokens = [];
                let phase = 0;

                async function translateToLibrasGloss(text) {
                    try {
                        const res = await fetch("https://traducao2.vlibras.gov.br/translate", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ text })
                        });
                        if (res.ok) {
                            const data = await res.text();
                            const tokens = data.trim().split(/\\s+/).filter(Boolean);
                            if (tokens.length > 0) return tokens;
                        }
                    } catch (_) {}
                    // Fallback local instantâneo de glosas em Português
                    return text.toUpperCase()
                        .replace(/[^A-ZÀ-Ú0-9\\s]/g, "")
                        .split(/\\s+/)
                        .filter(w => w.length > 2)
                        .slice(0, 14);
                }

                function drawAvatarFrame() {
                    if (!active) return;
                    const canvas = document.getElementById("mozok-libras-canvas");
                    if (!canvas) return;
                    const ctx = canvas.getContext("2d");
                    const w = canvas.width, h = canvas.height;
                    ctx.clearRect(0, 0, w, h);

                    if (signing) phase += 0.14;
                    else phase += 0.03;

                    // Aura holográfica de fundo
                    const bgGrad = ctx.createRadialGradient(w/2, h*0.48, 12, w/2, h*0.5, 105);
                    bgGrad.addColorStop(0, "rgba(0, 242, 254, 0.14)");
                    bgGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
                    ctx.fillStyle = bgGrad;
                    ctx.fillRect(0, 0, w, h);

                    const cx = w / 2;
                    const headY = 54 + (signing ? Math.sin(phase * 0.7) * 2.5 : Math.sin(phase) * 1.2);
                    const torsoTopY = 82;

                    // Tronco / Jaleco Cibernético MOZOK
                    ctx.beginPath();
                    ctx.moveTo(cx - 38, h - 14);
                    ctx.lineTo(cx - 32, torsoTopY + 12);
                    ctx.quadraticCurveTo(cx, torsoTopY - 4, cx + 32, torsoTopY + 12);
                    ctx.lineTo(cx + 38, h - 14);
                    ctx.closePath();
                    ctx.fillStyle = "rgba(14, 34, 58, 0.92)";
                    ctx.strokeStyle = "#00f2fe";
                    ctx.lineWidth = 1.8;
                    ctx.fill();
                    ctx.stroke();

                    // Pescoço e Cabeça
                    ctx.beginPath();
                    ctx.arc(cx, headY, 20, 0, Math.PI * 2);
                    ctx.fillStyle = "#16324f";
                    ctx.strokeStyle = "#38bdf8";
                    ctx.lineWidth = 2;
                    ctx.fill();
                    ctx.stroke();

                    // Visor / Expressão Facial
                    ctx.fillStyle = "#00f2fe";
                    ctx.fillRect(cx - 9, headY - 4, 5, 3);
                    ctx.fillRect(cx + 4, headY - 4, 5, 3);

                    // Braços e Mãos articulados executando os sinais de Libras
                    const amp = signing ? 1.0 : 0.12;
                    const lHandX = cx - 42 + Math.sin(phase * 1.3) * 26 * amp;
                    const lHandY = 128 + Math.cos(phase * 1.8) * 24 * amp;
                    const rHandX = cx + 42 + Math.cos(phase * 1.5) * 26 * amp;
                    const rHandY = 124 + Math.sin(phase * 2.0) * 24 * amp;

                    ctx.strokeStyle = "#38bdf8";
                    ctx.lineWidth = 5;
                    ctx.lineCap = "round";
                    ctx.lineJoin = "round";

                    // Braço Esquerdo
                    ctx.beginPath();
                    ctx.moveTo(cx - 30, torsoTopY + 16);
                    ctx.lineTo(cx - 52, 138);
                    ctx.lineTo(lHandX, lHandY);
                    ctx.stroke();

                    // Braço Direito
                    ctx.beginPath();
                    ctx.moveTo(cx + 30, torsoTopY + 16);
                    ctx.lineTo(cx + 52, 138);
                    ctx.lineTo(rHandX, rHandY);
                    ctx.stroke();

                    // Mãos e Dedos sinalizando com brilho ciano
                    for (const [hx, hy, dir] of [[lHandX, lHandY, -1], [rHandX, rHandY, 1]]) {
                        ctx.beginPath();
                        ctx.arc(hx, hy, 7.5, 0, Math.PI * 2);
                        ctx.fillStyle = "#00f2fe";
                        ctx.shadowColor = "#00f2fe";
                        ctx.shadowBlur = 12;
                        ctx.fill();
                        ctx.shadowBlur = 0;

                        // Dedos articulados
                        if (signing) {
                            ctx.strokeStyle = "#e0f2fe";
                            ctx.lineWidth = 1.6;
                            for (let d = -1; d <= 1; d++) {
                                ctx.beginPath();
                                ctx.moveTo(hx, hy);
                                ctx.lineTo(hx + d * 6 + dir * 3, hy - 11 - Math.abs(Math.sin(phase + d)) * 4);
                                ctx.stroke();
                            }
                        }
                    }

                    if (signing && currentGlossTokens.length > 0 && Math.floor(phase) % 6 === 0) {
                        const tok = currentGlossTokens[Math.floor(phase / 6) % currentGlossTokens.length];
                        const bar = document.getElementById("mozok-libras-gloss-bar");
                        if (bar) bar.textContent = "LIBRAS: " + tok;
                    }

                    animId = requestAnimationFrame(drawAvatarFrame);
                }

                return {
                    show() {
                        active = true;
                        document.getElementById("mozok-libras-native-panel")?.classList.add("active");
                        document.getElementById("btn-doom3-libras")?.classList.add("active");
                        document.getElementById("btn-vlibras")?.classList.add("active");
                        if (!animId) drawAvatarFrame();
                    },
                    hide() {
                        active = false;
                        signing = false;
                        if (animId) { cancelAnimationFrame(animId); animId = null; }
                        document.getElementById("mozok-libras-native-panel")?.classList.remove("active");
                        document.getElementById("btn-doom3-libras")?.classList.remove("active");
                        document.getElementById("btn-vlibras")?.classList.remove("active");
                    },
                    toggle() {
                        if (active) this.hide();
                        else this.show();
                    },
                    async speak(text) {
                        if (!active) return;
                        signing = true;
                        currentGlossTokens = await translateToLibrasGloss(text);
                        const bar = document.getElementById("mozok-libras-gloss-bar");
                        if (bar && currentGlossTokens[0]) bar.textContent = "LIBRAS: " + currentGlossTokens[0];
                    },
                    stopSpeaking() {
                        signing = false;
                        const bar = document.getElementById("mozok-libras-gloss-bar");
                        if (bar) bar.textContent = "LIBRAS // EM ESPERA";
                    }
                };
            })();

            // Botão "Libras" na barra principal do simulador aciona o Avatar Nativo
            const mainBtnVlibras = document.getElementById("btn-vlibras");
            if (mainBtnVlibras) {
                const cloneVl = mainBtnVlibras.cloneNode(true);
                mainBtnVlibras.parentNode.replaceChild(cloneVl, mainBtnVlibras);
                cloneVl.addEventListener("click", () => MozokLibrasAvatar.toggle());
            }

            // Efeito de Raios Elétricos contínuos no Ato I (MOZOK) e Faíscas de Choque no Ato II
            let lightningAnimId = null;
            function startMozokLightningEffect() {
                const canvas = document.getElementById("mozok-lightning-canvas");
                if (!canvas) return;
                const ctx = canvas.getContext("2d");
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                const bolts = [];

                function createBolt(x1, y1, x2, y2) {
                    const pts = [{ x: x1, y: y1 }];
                    const steps = Math.max(4, Math.floor(Math.hypot(x2 - x1, y2 - y1) / 20));
                    for (let i = 1; i < steps; i++) {
                        const t = i / steps;
                        pts.push({
                            x: x1 + (x2 - x1) * t + (Math.random() - 0.5) * 44,
                            y: y1 + (y2 - y1) * t + (Math.random() - 0.5) * 44
                        });
                    }
                    pts.push({ x: x2, y: y2 });
                    return { pts, life: 1.0, width: Math.random() * 2.4 + 1.2 };
                }

                function render() {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    if (Math.random() < 0.34) {
                        const cx = canvas.width / 2, cy = canvas.height / 2;
                        const a = Math.random() * Math.PI * 2;
                        const r1 = 70 + Math.random() * 60;
                        const r2 = 230 + Math.random() * 140;
                        bolts.push(createBolt(
                            cx + Math.cos(a) * r1, cy + Math.sin(a) * r1,
                            cx + Math.cos(a + (Math.random() - 0.5) * 0.7) * r2,
                            cy + Math.sin(a + (Math.random() - 0.5) * 0.7) * r2
                        ));
                    }
                    for (let i = bolts.length - 1; i >= 0; i--) {
                        const b = bolts[i];
                        b.life -= 0.08;
                        if (b.life <= 0) { bolts.splice(i, 1); continue; }
                        ctx.beginPath();
                        ctx.moveTo(b.pts[0].x, b.pts[0].y);
                        for (let j = 1; j < b.pts.length; j++) ctx.lineTo(b.pts[j].x, b.pts[j].y);
                        ctx.strokeStyle = `rgba(0, 242, 254, ${b.life})`;
                        ctx.lineWidth = b.width;
                        ctx.shadowColor = "#00f2fe";
                        ctx.shadowBlur = 22;
                        ctx.stroke();
                        ctx.strokeStyle = `rgba(255, 255, 255, ${b.life * 0.85})`;
                        ctx.lineWidth = b.width * 0.4;
                        ctx.stroke();
                    }
                    lightningAnimId = requestAnimationFrame(render);
                }
                render();
            }

            function stopMozokLightningEffect() {
                if (lightningAnimId) { cancelAnimationFrame(lightningAnimId); lightningAnimId = null; }
            }

            // Efeito de Choque / Interferência Elétrica no texto estilo Doom 3
            let shockIntervalId = null;
            function startDoom3ShockGlitches() {
                stopDoom3ShockGlitches();
                shockIntervalId = setInterval(() => {
                    if (!cyberPresentationActive || cyberPresentationPaused) return;
                    if (Math.random() < 0.22) {
                        const el = document.getElementById("doom3-typewriter-text");
                        if (el) {
                            el.classList.add("shock-glitch");
                            setTimeout(() => el.classList.remove("shock-glitch"), 90 + Math.random() * 80);
                        }
                    }
                }, 480);
            }
            function stopDoom3ShockGlitches() {
                if (shockIntervalId) { clearInterval(shockIntervalId); shockIntervalId = null; }
            }

            function updatePauseButtonsUI() {
                const pIcon = document.getElementById("icon-doom3-pause");
                const playIcon = document.getElementById("icon-doom3-play");
                const ctrlBox = document.getElementById("doom3-minimal-controls");
                if (pIcon && playIcon) {
                    pIcon.classList.toggle("hidden", cyberPresentationPaused);
                    playIcon.classList.toggle("hidden", !cyberPresentationPaused);
                }
                if (ctrlBox) {
                    ctrlBox.classList.toggle("paused-highlight", cyberPresentationPaused);
                }
            }

            async function startDoom3ScientificPresentation(startPausedOnMozok = false) {
                const overlay = document.getElementById("doom3-intro-overlay");
                const lightningStage = document.getElementById("mozok-lightning-stage");
                const narrative = document.getElementById("doom3-narrative-stage");
                const textEl = document.getElementById("doom3-typewriter-text");
                const aboutModal = document.getElementById("mozok-about-modal");

                if (!overlay) return;
                if (aboutModal) aboutModal.classList.add("hidden");

                // Para qualquer áudio anterior
                if (activeRoboticSource) { try { activeRoboticSource.stop(); } catch (_) {} activeRoboticSource = null; }
                if (currentAudio) { try { currentAudio.pause(); } catch (_) {} currentAudio = null; }
                if ("speechSynthesis" in window) window.speechSynthesis.cancel();

                cyberPresentationActive = true;
                cyberPresentationPaused = startPausedOnMozok;
                cyberPresentationAborted = false;
                updatePauseButtonsUI();

                overlay.classList.remove("hidden-intro");
                document.body.classList.add("cyber-intro-active");

                if (isMicroMode) setMicrocosmosMode(false);
                if (cnsAnatomy && cnsAnatomy.rootGroup) cnsAnatomy.rootGroup.visible = false;
                if (neuralMicro) neuralMicro.setVisible(false);

                if (lightningStage) { lightningStage.style.display = "flex"; lightningStage.style.opacity = "1"; }
                if (narrative) { narrative.style.display = "none"; narrative.style.opacity = "0"; }
                if (textEl) textEl.textContent = "";

                startHexagonalVisorCanvas();
                startMozokLightningEffect();

                // Se idioma for pt-BR, ativa o Avatar Nativo de Libras automaticamente
                if ((currentLang || "pt-BR").toLowerCase().startsWith("pt")) {
                    MozokLibrasAvatar.show();
                }

                if (!startPausedOnMozok) {
                    playIdSoftwareLogoSound();
                }

                // Se foi acionado por "Recomeçar", fica pausado aqui com MOZOK + raios elétricos até o usuário dar Play!
                const okSplash = await waitWithPauseAndAbort(3400);
                if (!okSplash || cyberPresentationAborted) return finishDoom3Presentation();

                stopMozokLightningEffect();
                if (lightningStage) lightningStage.style.opacity = "0";
                const okFade = await waitWithPauseAndAbort(650);
                if (!okFade || cyberPresentationAborted) return finishDoom3Presentation();
                if (lightningStage) lightningStage.style.display = "none";

                // ATO II: Cérebro desfocado + Malha Hexagonal + Frases em Azul Ciano no Meio da Tela + Choque
                if (cnsAnatomy && cnsAnatomy.rootGroup) {
                    cnsAnatomy.rootGroup.visible = true;
                    cnsAnatomy.setViewMode("EXTERNAL");
                    cnsAnatomy.spinalGroup.visible = false;
                    cnsAnatomy.pnsGroup.visible = false;
                    cnsAnatomy.vascularGroup.visible = false;
                }
                document.body.classList.add("cyber-brain-blurred");
                flyCameraTo(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1.2, 14.5), 0.85);

                if (narrative) { narrative.style.display = "block"; narrative.style.opacity = "1"; }
                startDoom3ShockGlitches();

                const lang = currentLang || "pt-BR";
                const segments = INTRO_SEGMENTS_I18N[lang] || INTRO_SEGMENTS_I18N["pt-BR"];

                for (let s = 0; s < segments.length; s++) {
                    if (cyberPresentationAborted) break;
                    MozokLibrasAvatar.speak(segments[s]);
                    await playSegmentWithExactSyncedTypewriter(segments[s], s, segments.length);
                    MozokLibrasAvatar.stopSpeaking();
                }

                finishDoom3Presentation();
            }

            function finishDoom3Presentation() {
                cyberPresentationAborted = true;
                cyberPresentationActive = false;
                cyberPresentationPaused = false;
                updatePauseButtonsUI();

                stopMozokLightningEffect();
                stopDoom3ShockGlitches();
                MozokLibrasAvatar.stopSpeaking();
                MozokLibrasAvatar.hide();

                if (hexAnimId) { cancelAnimationFrame(hexAnimId); hexAnimId = null; }
                if (activeRoboticSource) { try { activeRoboticSource.stop(); } catch (_) {} activeRoboticSource = null; }
                if ("speechSynthesis" in window) window.speechSynthesis.cancel();
                if (doomAudioCtx && doomAudioCtx.state === "suspended") doomAudioCtx.resume().catch(() => {});

                document.getElementById("doom3-intro-overlay")?.classList.add("hidden-intro");
                document.body.classList.remove("cyber-brain-blurred");
                document.body.classList.remove("cyber-intro-active");

                if (cnsAnatomy && cnsAnatomy.rootGroup) {
                    cnsAnatomy.rootGroup.visible = true;
                    cnsAnatomy.setViewMode("EXTERNAL");
                }
                flyCameraTo(new THREE.Vector3(0, -1.5, 0), new THREE.Vector3(0, 1.5, 22.0), 1.0);
                document.getElementById("mozok-presenter-deck")?.classList.remove("active");
            }

            function toggleDoom3PauseWrapper() {
                if (!cyberPresentationActive) return;
                toggleDoom3PresentationPause();
                updatePauseButtonsUI();
            }

            // Rotação suave do encéfalo enquanto a apresentação estiver ativa (congela na pausa!)
            const _origCnsUpdate = cnsAnatomy.update.bind(cnsAnatomy);
            cnsAnatomy.update = function(dt, elapsed) {
                _origCnsUpdate(dt, elapsed);
                if (cyberPresentationActive && !cyberPresentationPaused && cnsAnatomy.rootGroup && cnsAnatomy.rootGroup.visible) {
                    cnsAnatomy.rootGroup.rotation.y += dt * 0.22;
                } else if (!cyberPresentationActive && cnsAnatomy.rootGroup && Math.abs(cnsAnatomy.rootGroup.rotation.y) > 0.001) {
                    cnsAnatomy.rootGroup.rotation.y *= 0.90;
                }
            };

            window.startDoom3ScientificPresentation = startDoom3ScientificPresentation;
            window.startDoom3CinematicIntro = startDoom3ScientificPresentation;
            window.finishDoom3Presentation = finishDoom3Presentation;
            window.toggleDoom3PresentationPause = toggleDoom3PauseWrapper;

            document.getElementById("btn-doom3-pause")?.addEventListener("click", toggleDoom3PauseWrapper);
            document.getElementById("btn-doom3-restart")?.addEventListener("click", () => {
                cyberPresentationAborted = true;
                setTimeout(() => startDoom3ScientificPresentation(true), 60);
            });
            document.getElementById("btn-doom3-libras")?.addEventListener("click", () => MozokLibrasAvatar.toggle());
            document.getElementById("btn-doom3-skip")?.addEventListener("click", finishDoom3Presentation);

            const tourTopBtn = document.getElementById("btn-tour");
            if (tourTopBtn) {
                const cleanTourBtn = tourTopBtn.cloneNode(true);
                tourTopBtn.parentNode.replaceChild(cleanTourBtn, tourTopBtn);
                cleanTourBtn.addEventListener("click", () => startDoom3ScientificPresentation(false));
            }

            window.addEventListener("keydown", (e) => {
                if (!cyberPresentationActive) return;
                if (e.code === "Space") {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleDoom3PauseWrapper();
                } else if (e.key === "Escape") {
                    e.preventDefault();
                    finishDoom3Presentation();
                }
            }, true);"""

        html = html[:fn_start] + new_js_engine + "\n\n            " + html[fn_end:]

# Remover o segundo cloneNode de btnTourEl no final do script se existir para não sobrescrever cleanTourBtn
old_duplicate_tour_clone = """            const presenterDeckEl = document.getElementById('mozok-presenter-deck');
            const btnTourEl = document.getElementById('btn-tour');

            // Substitui o comportamento antigo do #btn-tour pelo Deck de Apresentação Estruturada
            const newBtnTour = btnTourEl.cloneNode(true);
            btnTourEl.parentNode.replaceChild(newBtnTour, btnTourEl);

            newBtnTour.addEventListener('click', () => {
                if (cyberPresentationActive) {
                    finishDoom3Presentation();
                    return;
                }
                startDoom3ScientificPresentation();
            });"""

new_duplicate_tour_clone = """            const presenterDeckEl = document.getElementById('mozok-presenter-deck');
            const newBtnTour = document.getElementById('btn-tour');"""

if old_duplicate_tour_clone in html:
    html = html.replace(old_duplicate_tour_clone, new_duplicate_tour_clone, 1)

html_path.write_text(html, encoding="utf-8")
print("MOZOK v1.0009 atualizado com sucesso!")
