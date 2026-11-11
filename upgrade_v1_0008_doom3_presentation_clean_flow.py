#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PASSO 1 — MOZOK v1.0008:
- Bump de versão para 1.0008 (SemVer 1.0.8+0008) em VERSION, Cargo.toml, web/sw.js e web/index.html.
- Estilos CSS v1.0008: Frases centrais em azul ciano puro (#00f2fe) sem caixas opacas,
  Abertura MOZOK com raios elétricos em Canvas (#mozok-lightning-stage) sem flor/beija-flor,
  e Dock Nativo do VLibras (#mozok-vlibras-dock) sem botão azul redondo flutuante.
"""

import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent

# 1. Bump de versão para 1.0008
ROOT.joinpath("VERSION").write_text("1.0008\n", encoding="utf-8")

cargo_path = ROOT / "Cargo.toml"
cargo_txt = cargo_path.read_text(encoding="utf-8")
cargo_txt = re.sub(
    r'version\s*=\s*"1\.0\.\d+\+\d+"',
    'version = "1.0.8+0008"',
    cargo_txt,
    count=1,
)
cargo_path.write_text(cargo_txt, encoding="utf-8")

sw_path = ROOT / "web" / "sw.js"
if sw_path.exists():
    sw_txt = sw_path.read_text(encoding="utf-8")
    sw_txt = re.sub(r"mozok-v1\.\d+-github-sync", "mozok-v1.0008-github-sync", sw_txt)
    sw_path.write_text(sw_txt, encoding="utf-8")

html_path = ROOT / "web" / "index.html"
html_code = html_path.read_text(encoding="utf-8")

# 2. Atualizar strings de versão para v1.0008
html_code = (
    html_code.replace("v1.0007", "v1.0008")
    .replace("v1.0006", "v1.0008")
    .replace("1.0.7+0007", "1.0.8+0008")
    .replace("version: '1.0007'", "version: '1.0008'")
)

# 3. Atualizar Estilos CSS: Frases Centrais em Azul Ciano Puro, Zero Caixas Opacas, e Dock Nativo do VLibras
style_marker = '<style id="mozok-v10007-doom3-vlibras-styles">'
if style_marker not in html_code:
    style_marker = '<style id="mozok-v10008-doom3-styles">'

new_styles = """<style id="mozok-v10008-doom3-styles">
        .doom3-font-title {
            font-family: 'Orbitron', 'Rajdhani', sans-serif !important;
            letter-spacing: 0.24em !important;
            text-transform: uppercase;
        }
        .doom3-font-terminal {
            font-family: 'Share Tech Mono', 'Orbitron', monospace !important;
            letter-spacing: 0.08em !important;
        }
        /* Overlay Doom 3 Oficial */
        #doom3-intro-overlay {
            position: fixed;
            inset: 0;
            z-index: 95;
            background: rgba(0, 2, 6, 0.42);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            pointer-events: none;
            transition: opacity 0.5s ease;
        }
        #doom3-intro-overlay.hidden-intro {
            display: none !important;
            opacity: 0 !important;
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
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.28) 50%),
                        linear-gradient(90deg, rgba(255, 0, 0, 0.02), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.02));
            background-size: 100% 3px, 6px 100%;
        }

        /* ATO I: ABERTURA COM TÍTULO MOZOK E RAIOS ELÉTRICOS (SEM FLOR / SEM BEIJA-FLOR) */
        #mozok-lightning-stage {
            position: absolute;
            inset: 0;
            z-index: 20;
            background: #000104;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            transition: opacity 0.75s ease;
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
            font-size: clamp(3.2rem, 8vw, 6.8rem);
            font-weight: 900;
            letter-spacing: 0.28em;
            color: #f0fdfa;
            text-shadow: 0 0 25px rgba(0, 242, 254, 0.95), 0 0 60px rgba(0, 180, 216, 0.8), 0 0 100px rgba(0, 242, 254, 0.4);
            user-select: none;
            text-align: center;
        }
        .mozok-subtitle-sci {
            position: relative;
            z-index: 22;
            font-family: 'Share Tech Mono', monospace;
            font-size: clamp(0.75rem, 1.8vw, 1.15rem);
            color: #38bdf8;
            letter-spacing: 0.45em;
            text-transform: uppercase;
            margin-top: 14px;
            text-shadow: 0 0 15px rgba(56, 189, 248, 0.8);
            text-align: center;
        }

        /* ATO II: FRASES EM AZUL CIANO PURO NO CENTRO DA TELA (SEM CAIXAS OPACAS) */
        #doom3-narrative-stage {
            position: absolute;
            inset: 0;
            z-index: 10;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 30px 40px;
            pointer-events: none;
            transition: opacity 0.6s ease;
        }
        #doom3-center-stage {
            margin: auto;
            max-width: 980px;
            width: 90%;
            text-align: center;
            pointer-events: none;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        #doom3-segment-indicator {
            font-family: 'Orbitron', monospace;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.35em;
            color: #fbbf24;
            text-transform: uppercase;
            margin-bottom: 24px;
            text-shadow: 0 0 12px rgba(251, 191, 36, 0.6);
        }
        /* O texto flutua puro em azul ciano brilhante diretamente no centro da tela */
        #doom3-typewriter-text {
            font-family: 'Orbitron', 'Share Tech Mono', sans-serif;
            font-size: clamp(1.4rem, 2.7vw, 2.35rem);
            font-weight: 700;
            line-height: 1.55;
            color: #00f2fe !important;
            text-shadow: 0 0 20px rgba(0, 242, 254, 0.95), 0 0 45px rgba(0, 180, 216, 0.65), 0 0 80px rgba(0, 242, 254, 0.35);
            margin: 0;
            min-height: 5.5rem;
            display: inline;
        }
        #doom3-cursor-block {
            display: inline-block;
            color: #00f2fe;
            font-size: clamp(1.4rem, 2.7vw, 2.35rem);
            margin-left: 6px;
            animation: doom3CursorBlink 0.75s infinite steps(1);
            text-shadow: 0 0 18px #00f2fe;
        }
        @keyframes doom3CursorBlink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }

        /* Barra de Controle Superior Discreta */
        #doom3-controls-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            pointer-events: auto;
            z-index: 15;
            background: rgba(2, 6, 14, 0.75);
            backdrop-filter: blur(8px);
            padding: 10px 20px;
            border-radius: 8px;
            border: 1px solid rgba(0, 242, 254, 0.25);
            flex-wrap: wrap;
            gap: 10px;
        }
        .doom3-ctrl-group {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        #doom3-status-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #22d3ee;
            box-shadow: 0 0 12px #00f2fe;
            display: inline-block;
        }
        .doom3-briefing-label {
            font-size: 11px;
            color: #67e8f9;
            font-weight: 700;
        }
        #btn-doom3-pause {
            background: rgba(8, 51, 68, 0.85);
            color: #a5f3fc;
            border: 1px solid rgba(34, 211, 238, 0.55);
            border-radius: 6px;
            padding: 7px 14px;
            font-size: 11px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        #btn-doom3-pause:hover {
            background: rgba(22, 78, 99, 0.95);
            box-shadow: 0 0 18px rgba(0, 242, 254, 0.45);
        }
        #btn-doom3-skip {
            background: rgba(69, 10, 10, 0.75);
            color: #fecdd3;
            border: 1px solid rgba(239, 68, 68, 0.5);
            border-radius: 6px;
            padding: 7px 14px;
            font-size: 11px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        #btn-doom3-skip:hover {
            background: rgba(127, 29, 29, 0.9);
            box-shadow: 0 0 18px rgba(244, 63, 94, 0.45);
        }
        #doom3-progress-line {
            width: 100%;
            height: 3px;
            background: rgba(0, 242, 254, 0.18);
            border-radius: 2px;
            overflow: hidden;
            margin-top: 15px;
        }
        #doom3-progress-bar {
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, #00f2fe, #38bdf8, #f59e0b);
            box-shadow: 0 0 12px #00f2fe;
            transition: width 0.35s ease;
        }

        /* DOCK NATIVO DO VLIBRAS INTEGRADO AO HUD DO MOZOK */
        #mozok-vlibras-dock {
            position: fixed;
            right: 24px;
            bottom: 24px;
            width: 280px;
            height: 380px;
            z-index: 120;
            background: rgba(2, 10, 20, 0.94);
            border: 1.5px solid rgba(0, 242, 254, 0.65);
            border-radius: 14px;
            box-shadow: 0 0 35px rgba(0, 242, 254, 0.28), 0 14px 40px rgba(0, 0, 0, 0.88);
            backdrop-filter: blur(12px);
            display: none;
            flex-direction: column;
            overflow: hidden;
            clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%);
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        #mozok-vlibras-dock.active {
            display: flex !important;
        }
        #mozok-vlibras-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 12px;
            background: rgba(0, 242, 254, 0.08);
            border-bottom: 1px solid rgba(0, 242, 254, 0.35);
            font-family: 'Orbitron', monospace;
            font-size: 10.5px;
            font-weight: 700;
            color: #38bdf8;
            letter-spacing: 0.12em;
        }
        .vlibras-led-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #34d399;
            box-shadow: 0 0 8px #34d399;
            display: inline-block;
            margin-right: 6px;
        }
        #btn-close-vlibras-dock {
            background: transparent;
            border: 1px solid rgba(0, 242, 254, 0.35);
            color: #38bdf8;
            border-radius: 4px;
            padding: 2px 7px;
            cursor: pointer;
            font-size: 11px;
        }
        #btn-close-vlibras-dock:hover {
            color: #ffffff;
            background: rgba(0, 242, 254, 0.2);
        }
        #mozok-vlibras-viewport {
            flex: 1;
            position: relative;
            width: 100%;
            height: 100%;
            background: #010408;
            overflow: hidden;
        }
        /* Oculta o botão flutuante redondo azul padrão do plugin */
        div[vw] [vw-access-button] {
            display: none !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }
        div[vw] [vw-plugin-wrapper] {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100% !important;
            height: 100% !important;
            border: none !important;
            box-shadow: none !important;
            background: transparent !important;
        }
    </style>"""

idx_s = html_code.find(style_marker)
if idx_s != -1:
    idx_s_end = html_code.find("</style>", idx_s) + len("</style>")
    html_code = html_code[:idx_s] + new_styles + html_code[idx_s_end:]

# 4. Remover o <div id="vlibras-container"> antigo do final do body para não duplicar IDs
old_bottom_vlibras = """    <div id="vlibras-container">
        <div vw class="enabled">
            <div vw-access-button class="active"></div>
            <div vw-plugin-wrapper>
                <div class="vw-plugin-top-wrapper"></div>
            </div>
        </div>
    </div>"""
if old_bottom_vlibras in html_code:
    html_code = html_code.replace(old_bottom_vlibras, "", 1)

# 5. Substituir a estrutura do #doom3-intro-overlay no HTML
overlay_start = html_code.find('<div id="doom3-intro-overlay"')
if overlay_start != -1:
    pos = overlay_start
    depth = 0
    overlay_end = -1
    while pos < len(html_code):
        if html_code[pos : pos + 4] == "<div":
            depth += 1
            pos += 4
        elif html_code[pos : pos + 6] == "</div>":
            depth -= 1
            pos += 6
            if depth == 0:
                overlay_end = pos
                break
        else:
            pos += 1

    new_overlay_body = """<div id="doom3-intro-overlay" class="hidden-intro" role="dialog" aria-label="Apresentação Científica MOZOK">
        <canvas id="cyber-hex-canvas"></canvas>
        <div class="cyber-scanline-overlay"></div>

        <!-- ATO I: ABERTURA MOZOK COM RAIOS ELÉTRICOS (SEM FLOR, SEM BEIJA-FLOR) -->
        <div id="mozok-lightning-stage">
            <canvas id="mozok-lightning-canvas"></canvas>
            <div class="mozok-title-glow">MOZOK</div>
            <div class="mozok-subtitle-sci">BIO-SIMULATION ENGINE // ESPECTRO IPÊ</div>
        </div>

        <!-- ATO II: TEXTO EM AZUL CIANO NO CENTRO DA TELA (ESTILO DOOM 3 ORIGINAL) -->
        <div id="doom3-narrative-stage" style="display:none; opacity:0;">
            <!-- Barra Superior Discreta de Controle -->
            <div id="doom3-controls-bar">
                <div class="doom3-ctrl-group">
                    <span id="doom3-status-dot"></span>
                    <span class="doom3-font-title doom3-briefing-label">
                        MOZOK // BRIEFING CIENTÍFICO OFICIAL
                    </span>
                </div>
                <div class="doom3-ctrl-group">
                    <button id="btn-doom3-pause" class="doom3-font-title">
                        ⏸ Pausar [Espaço]
                    </button>
                    <button id="btn-doom3-skip" class="doom3-font-title">
                        ✕ Encerrar [ESC]
                    </button>
                </div>
            </div>

            <!-- Centro da Tela: Frase Pura em Azul Ciano Brilhante Flutuando Sobre o Cérebro e Hexágonos -->
            <div id="doom3-center-stage">
                <div id="doom3-segment-indicator">SEQUÊNCIA CIENTÍFICA 01 / 05</div>
                <div style="position:relative; width:100%;">
                    <span id="doom3-typewriter-text"></span><span id="doom3-cursor-block">█</span>
                </div>
            </div>

            <!-- Rodapé Discreto com Barra de Progresso -->
            <div style="width:100%;">
                <div id="doom3-progress-line">
                    <div id="doom3-progress-bar"></div>
                </div>
            </div>
        </div>
    </div>

    <!-- DOCK NATIVO INTEGRADO DO VLIBRAS NO LAYOUT DO MOZOK -->
    <div id="mozok-vlibras-dock">
        <div id="mozok-vlibras-header">
            <div style="display:flex; align-items:center;">
                <span class="vlibras-led-dot"></span>
                <span>[ VLIBRAS // INTÉRPRETE VIRTUAL DE LIBRAS ]</span>
            </div>
            <button id="btn-close-vlibras-dock" title="Fechar Dock VLibras">✕</button>
        </div>
        <div id="mozok-vlibras-viewport">
            <div id="vlibras-container">
                <div vw class="enabled">
                    <div vw-access-button class="active"></div>
                    <div vw-plugin-wrapper>
                        <div class="vw-plugin-top-wrapper"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>"""

    if overlay_end != -1:
        html_code = html_code[:overlay_start] + new_overlay_body + html_code[overlay_end:]

html_path.write_text(html_code, encoding="utf-8")
print("HTML layout e estilos atualizados para v1.0008.")

