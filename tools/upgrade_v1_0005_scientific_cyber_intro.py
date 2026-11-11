#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MOZOK v1.0005:
- Remove autoplay na abertura do sistema (abre direto na página inicial)
- Vincula a Apresentação Cinemática Científica ao botão 'Sobre' (#btn-about), com botão 'Pular para Informações do Projeto [ESC]' que abre o modal #mozok-about-modal
- Remove qualquer menção a jogos (Doom 3 / Carmack / UAC) e foca em texto científico robusto sobre a necessidade e utilidade do MOZOK
- Grade Hexagonal Colmeia perfeita desenhada via Canvas 2D procedural (#cyber-hex-canvas)
- Fundo 100% escuro no Ato I do logo Espectro Ipê, encéfalo isolado à esquerda no Ato II, sem legenda duplicada no rodapé
- Processador DSP de Voz Robótica Real em nível de AudioBuffer (Ring Modulator + Metallic Resonator)
"""

import asyncio
import re
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
INDEX_HTML = ROOT / "web" / "index.html"
SW_JS = ROOT / "web" / "sw.js"
VERSION_FILE = ROOT / "VERSION"
CARGO_TOML = ROOT / "Cargo.toml"
AUDITOR_PY = ROOT / "tools" / "night_auditor_buttons.py"

VERSION_FILE.write_text("1.0005\n", encoding="utf-8")
cargo_txt = CARGO_TOML.read_text(encoding="utf-8")
for old_v in ['version = "1.0.4+0004"', 'version = "1.0.3+0003"', 'version = "1.0.2+0002"', 'version = "1.0.1+0001"', 'version = "1.0.0"']:
    cargo_txt = cargo_txt.replace(old_v, 'version = "1.0.5+0005"')
CARGO_TOML.write_text(cargo_txt, encoding="utf-8")

if SW_JS.exists():
    sw_txt = SW_JS.read_text(encoding="utf-8")
    for old_sw in ["mozok-v1.0004-github-sync", "mozok-v1.0003-github-sync", "mozok-v1.0002-github-sync"]:
        sw_txt = sw_txt.replace(old_sw, "mozok-v1.0005-github-sync")
    SW_JS.write_text(sw_txt, encoding="utf-8")

html = INDEX_HTML.read_text(encoding="utf-8").replace("\r\n", "\n")

# 1. Atualizar versão no badge do topo
for old_b in ["v1.0004", "v1.0003", "v1.0002", "v1.0001"]:
    html = html.replace(old_b, "v1.0005")
for old_sv in ["1.0.4+0004", "1.0.3+0003", "1.0.2+0002", "1.0.1+0001"]:
    html = html.replace(old_sv, "1.0.5+0005")
html = html.replace("version: '1.0003'", "version: '1.0005'")

# 2. Remover botão separado #btn-doom-intro da Topbar (a apresentação agora vive em #btn-about)
html = re.sub(
    r'\s*<button[^>]*id="btn-doom-intro"[^>]*>.*?</button>',
    '',
    html,
    flags=re.DOTALL
)

# 3. Substituir o CSS antigo de #doom3-intro-overlay pelo novo CSS Científico Hexagonal com Ato I 100% opaco e ocultação da barra de legenda inferior
OLD_CSS_MATCH = re.search(
    r"/\* =========================================================================\s*MÓDULO DE (?:INTRODUÇÃO DOOM 3|APRESENTAÇÃO CINEMÁTICA CIENTÍFICA).*?/\* =========================================================================\s*PAINEL DE PALCO",
    html,
    re.DOTALL
)

NEW_CYBER_CSS = """/* =========================================================================
           MÓDULO DE APRESENTAÇÃO CINEMÁTICA CIENTÍFICA (ESPECTRO IPÊ // MOZOK)
           ========================================================================= */
        body.cyber-intro-active .topbar,
        body.cyber-intro-active .left-sidebar,
        body.cyber-intro-active .right-sidebar,
        body.cyber-intro-active #nav-pan-hud,
        body.cyber-intro-active #mozok-scale-hud,
        body.cyber-intro-active #mobile-bottom-nav,
        body.cyber-intro-active #mozok-subtitle-bar {
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
            transition: opacity 0.6s ease;
        }

        #webgl-container {
            transition: filter 1.4s cubic-bezier(0.22, 1, 0.36, 1);
        }

        body.cyber-brain-blurred #webgl-container {
            filter: blur(6.5px) contrast(1.24) brightness(0.82) saturate(1.12);
        }

        #doom3-intro-overlay {
            position: fixed;
            inset: 0;
            z-index: 95;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: auto;
            overflow: hidden;
            background: radial-gradient(circle at 22% 50%, rgba(0, 42, 60, 0.14) 0%, rgba(2, 6, 14, 0.84) 54%, rgba(1, 3, 8, 0.98) 100%);
            transition: opacity 1.1s ease;
        }

        #doom3-intro-overlay.hidden-intro {
            opacity: 0;
            pointer-events: none;
            visibility: hidden;
        }

        /* Canvas 2D Procedural para a Malha Colmeia Hexagonal de Alta Precisão */
        #cyber-hex-canvas {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 2;
        }

        .cyber-scanline-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0, 242, 254, 0.045) 50%, rgba(0, 0, 0, 0.32));
            background-size: 100% 4px;
            box-shadow: inset 0 0 160px rgba(0, 0, 0, 0.96);
            pointer-events: none;
            z-index: 3;
        }

        /* ATO I: Palco 100% Negro Opaco para o Emblema Espectro Ipê (O cérebro não vaza atrás!) */
        #doom3-logo-stage {
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at 50% 50%, #061024 0%, #02050d 55%, #000000 100%);
            z-index: 8;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            transition: opacity 0.95s ease;
        }

        .espectro-ipe-cyber-frame {
            position: relative;
            width: 260px;
            height: 260px;
            display: flex;
            align-items: center;
            justify-content: center;
            filter: drop-shadow(0 0 32px rgba(0, 242, 254, 0.45)) drop-shadow(0 0 55px rgba(250, 204, 21, 0.28));
            animation: cyberFramePulse 3.0s infinite ease-in-out;
        }

        @keyframes cyberFramePulse {
            0%, 100% { transform: scale(1.0); filter: drop-shadow(0 0 28px rgba(0, 242, 254, 0.45)); }
            50% { transform: scale(1.045); filter: drop-shadow(0 0 46px rgba(0, 242, 254, 0.85)); }
        }

        .espectro-ring-outer {
            position: absolute;
            inset: 0;
            border: 2px dashed rgba(0, 242, 254, 0.55);
            border-radius: 50%;
            animation: spinSlow 16s linear infinite;
        }

        .espectro-ring-mid {
            position: absolute;
            inset: 10px;
            border: 1px solid rgba(244, 63, 94, 0.45);
            border-radius: 50%;
            animation: spinSlow 11s linear infinite reverse;
        }

        .espectro-ring-inner {
            position: absolute;
            inset: 20px;
            border: 2px solid rgba(250, 204, 21, 0.65);
            clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%);
            background: radial-gradient(circle, rgba(15, 28, 55, 0.92) 0%, rgba(2, 6, 15, 0.98) 100%);
        }

        @keyframes spinSlow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        .espectro-title-cyber {
            margin-top: 20px;
            font-family: 'Consolas', 'Courier New', monospace;
            font-size: 28px;
            font-weight: 900;
            letter-spacing: 7px;
            color: #f8fafc;
            text-shadow: 0 0 18px rgba(0, 242, 254, 0.85), 0 0 36px rgba(250, 204, 21, 0.45);
        }

        .espectro-sub-cyber {
            margin-top: 6px;
            font-family: 'Consolas', 'Courier New', monospace;
            font-size: 12px;
            letter-spacing: 4.5px;
            color: #f43f5e;
            text-transform: uppercase;
            font-weight: 700;
        }

        .carmack-tribute-pill {
            margin-top: 14px;
            padding: 6px 16px;
            border: 1px solid rgba(0, 242, 254, 0.45);
            background: rgba(0, 242, 254, 0.10);
            border-radius: 4px;
            font-family: 'Consolas', monospace;
            font-size: 11px;
            letter-spacing: 2.5px;
            color: #00f2fe;
            text-transform: uppercase;
        }

        /* ATO II: Terminal Científico Ciano à Direita do Encéfalo Desfocado */
        #doom3-terminal-stage {
            position: absolute;
            left: 24%;
            right: 9%;
            top: 46%;
            transform: translateY(-50%);
            z-index: 6;
            display: none;
            flex-direction: column;
            gap: 14px;
            pointer-events: none;
        }

        .doom3-uac-header {
            font-family: 'Consolas', 'Lucida Console', monospace;
            font-size: 11.5px;
            letter-spacing: 3.5px;
            color: rgba(0, 242, 254, 0.78);
            text-transform: uppercase;
            border-left: 3px solid #00f2fe;
            padding-left: 12px;
        }

        #doom3-typewriter-line {
            font-family: 'Consolas', 'Lucida Console', 'Courier New', monospace;
            font-size: clamp(19px, 2.35vw, 31px);
            font-weight: 700;
            letter-spacing: 1.5px;
            line-height: 1.44;
            color: #67e8f9;
            text-shadow: 0 0 12px rgba(0, 242, 254, 0.95), 0 0 28px rgba(0, 242, 254, 0.55);
            min-height: 110px;
        }

        .doom3-block-cursor {
            display: inline-block;
            width: 14px;
            height: 1.05em;
            background: #00f2fe;
            vertical-align: text-bottom;
            margin-left: 5px;
            box-shadow: 0 0 16px #00f2fe;
            animation: blinkDoomCursor 0.52s steps(2, start) infinite;
        }

        @keyframes blinkDoomCursor {
            to { visibility: hidden; }
        }

        .doom3-controls-bar {
            position: fixed;
            bottom: 28px;
            right: 34px;
            z-index: 105;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .doom3-action-btn {
            background: rgba(4, 12, 24, 0.92);
            border: 1px solid rgba(0, 242, 254, 0.65);
            color: #00f2fe;
            font-family: 'Consolas', monospace;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 1.5px;
            padding: 9px 18px;
            border-radius: 6px;
            cursor: pointer;
            text-transform: uppercase;
            box-shadow: 0 0 18px rgba(0, 242, 254, 0.28);
            transition: all 0.2s ease;
        }

        .doom3-action-btn:hover {
            background: rgba(0, 242, 254, 0.24);
            box-shadow: 0 0 28px rgba(0, 242, 254, 0.65);
        }

        /* =========================================================================
           PAINEL DE PALCO"""

if OLD_CSS_MATCH:
    html = html[:OLD_CSS_MATCH.start()] + NEW_CYBER_CSS + html[OLD_CSS_MATCH.end():]

# 4. Atualizar o HTML de #doom3-intro-overlay para incluir o <canvas id="cyber-hex-canvas">, remover menções a jogos e renomear o botão para "⏭ Pular para Informações do Projeto [ESC]"
OLD_OVERLAY_HTML = re.search(
    r'<!-- OVERLAY DE (?:INTRODUÇÃO CINEMÁTICA DOOM 3|APRESENTAÇÃO CINEMÁTICA CIENTÍFICA).*?<!-- BARRA DE PALCO',
    html,
    re.DOTALL
)

NEW_OVERLAY_HTML = """<!-- OVERLAY DE APRESENTAÇÃO CINEMÁTICA CIENTÍFICA (ACIONADO PELO BOTÃO SOBRE) -->
    <div id="doom3-intro-overlay" class="hidden-intro" role="dialog" aria-label="Apresentação Científica MOZOK">
        <canvas id="cyber-hex-canvas"></canvas>
        <div class="cyber-scanline-overlay"></div>

        <!-- ATO I: EMBLEMA CIBERNÉTICO ESPECTRO IPÊ EM FUNDO 100% ESCURO -->
        <div id="doom3-logo-stage">
            <div class="espectro-ipe-cyber-frame">
                <div class="espectro-ring-outer"></div>
                <div class="espectro-ring-mid"></div>
                <div class="espectro-ring-inner"></div>
                <svg width="182" height="182" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="position:relative; z-index:4;">
                    <defs>
                        <linearGradient id="ipeGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#fde047" />
                            <stop offset="55%" stop-color="#f59e0b" />
                            <stop offset="100%" stop-color="#d97706" />
                        </linearGradient>
                        <linearGradient id="birdCyberGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#00f2fe" />
                            <stop offset="45%" stop-color="#10b981" />
                            <stop offset="75%" stop-color="#f59e0b" />
                            <stop offset="100%" stop-color="#f43f5e" />
                        </linearGradient>
                    </defs>
                    <g stroke="#fef08a" stroke-width="1.0" fill="url(#ipeGoldGrad)" opacity="0.96">
                        <path d="M85 118 C52 108, 34 80, 42 52 C56 64, 72 86, 85 118 Z" />
                        <path d="M85 118 C45 122, 26 105, 24 82 C48 86, 68 98, 85 118 Z" />
                        <path d="M85 118 C62 146, 48 164, 68 172 C78 156, 82 138, 85 118 Z" />
                        <path d="M85 118 C92 148, 108 168, 128 162 C116 142, 102 128, 85 118 Z" />
                        <path d="M85 118 C112 126, 136 118, 142 98 C120 98, 102 106, 85 118 Z" />
                        <path d="M85 118 C75 88, 72 64, 88 54 C94 74, 92 96, 85 118 Z" />
                    </g>
                    <g stroke="#00f2fe" stroke-width="1.5">
                        <line x1="85" y1="118" x2="102" y2="92" />
                        <line x1="85" y1="118" x2="108" y2="98" />
                        <line x1="85" y1="118" x2="96" y2="88" />
                        <circle cx="102" cy="92" r="2.4" fill="#00f2fe" />
                        <circle cx="108" cy="98" r="2.4" fill="#00f2fe" />
                        <circle cx="96" cy="88" r="2.4" fill="#00f2fe" />
                    </g>
                    <g stroke="#00f2fe" stroke-width="1.2" fill="url(#birdCyberGrad)">
                        <polygon points="98,94 118,78 116,84" fill="#00f2fe" />
                        <polygon points="116,76 132,72 128,88 116,84" />
                        <circle cx="123" cy="79" r="2.3" fill="#030712" stroke="#00f2fe" stroke-width="1.2" />
                        <polygon points="128,88 146,96 138,118 120,102" />
                        <polygon points="132,76 174,34 156,74 138,88" />
                        <polygon points="138,86 184,48 168,88 144,96" opacity="0.90" />
                        <polygon points="138,118 146,96 164,142 148,148" />
                    </g>
                </svg>
            </div>
            <div class="espectro-title-cyber">ESPECTRO IPÊ</div>
            <div class="espectro-sub-cyber">SOLUÇÕES TECNOLÓGICAS // ECOSSISTEMA MRIYA</div>
            <div class="carmack-tribute-pill">⚡ MOZOK NEURO-SIMULATION ENGINE • OPEN SCIENCE</div>
        </div>

        <!-- ATO II: TERMINAL HOLOGRÁFICO CIENTÍFICO SOBRE O ENCÉFALO DESFOCADO -->
        <div id="doom3-terminal-stage">
            <div class="doom3-uac-header" id="doom3-uac-header">ESPECTRO IPÊ // MODELAGEM NEUROANATÔMICA E BIOFÍSICA MULTIESCALA</div>
            <div id="doom3-typewriter-line">
                <span id="doom3-typed-text"></span><span class="doom3-block-cursor"></span>
            </div>
        </div>

        <!-- CONTROLES DA APRESENTAÇÃO -->
        <div class="doom3-controls-bar">
            <button class="doom3-action-btn" id="btn-doom3-replay-audio" title="Status do Sintetizador de Voz Cibernética">🤖 Voz Cibernética: ATIVA</button>
            <button class="doom3-action-btn" id="btn-doom3-skip" title="Pular Apresentação e Abrir Informações do Projeto (ESC)">⏭ Pular para Informações do Projeto [ESC]</button>
        </div>
    </div>

    <!-- BARRA DE PALCO"""

if OLD_OVERLAY_HTML:
    html = html[:OLD_OVERLAY_HTML.start()] + NEW_OVERLAY_HTML + html[OLD_OVERLAY_HTML.end():]

# 5. Adicionar botão "🎬 Rever Apresentação Cinemática" dentro do modal #mozok-about-modal
if 'id="btn-replay-cyber-intro"' not in html:
    html = html.replace(
        '<button class="hud-btn" id="btn-narrate-about"',
        '<button class="hud-btn gold" id="btn-replay-cyber-intro" style="padding:7px 14px;">🎬 Rever Apresentação Cinemática</button>\n                        <button class="hud-btn" id="btn-narrate-about"'
    )

# 6. Substituir o bloco JavaScript da introdução por:
# - Renderizador Canvas 2D da Malha Colmeia Hexagonal de Alta Precisão (startHexagonalVisorCanvas)
# - DSP de Voz Robótica Real em nível de AudioBuffer (applyRoboticVocoderToAudioBuffer: Ring Modulator 54Hz + Comb Metálico + Soft Clipping)
# - Roteiro 100% científico (sem menção a jogos ou Kyiv)
# - Ocultação de medula/nervos durante a abertura para o encéfalo ficar como uma esfera limpa no canto esquerdo
# - Sem autoplay ao abrir o MOZOK; acionado ao clicar em #btn-about, e ao terminar (ou clicar em Pular) abre #mozok-about-modal!
OLD_JS_ENGINE_MATCH = re.search(
    r"// =====================================================================\s*// (?:SINTETIZADOR DE VOZ ROBÓTICA GEMINI|MALHA HEXAGONAL EM CANVAS 2D).*?// =====================================================================\s*// MODO APRESENTAÇÃO DE ESTRUTURAS",
    html,
    re.DOTALL
)

NEW_CYBER_JS_ENGINE = """// =====================================================================
            // MALHA HEXAGONAL EM CANVAS 2D + VOZ ROBÓTICA DSP EM NÍVEL DE AMOSTRA
            // + APRESENTAÇÃO CIENTÍFICA VINCULADA AO BOTÃO "SOBRE"
            // =====================================================================
            let doomAudioCtx = null;
            let hexAnimId = null;

            function getDoomAudioContext() {
                if (!doomAudioCtx) {
                    const AudioCtx = window.AudioContext || window.webkitAudioContext;
                    if (AudioCtx) doomAudioCtx = new AudioCtx();
                }
                if (doomAudioCtx && doomAudioCtx.state === 'suspended') {
                    doomAudioCtx.resume().catch(() => {});
                }
                return doomAudioCtx;
            }

            // Desenha a Grade Colmeia Hexagonal de Alta Precisão em Canvas 2D
            function startHexagonalVisorCanvas() {
                const canvas = document.getElementById('cyber-hex-canvas');
                if (!canvas) return;
                const ctx2d = canvas.getContext('2d');
                let pulseTime = 0;

                function renderHexFrame() {
                    if (!doomIntroRunning) return;
                    const dpr = Math.min(window.devicePixelRatio || 1, 2);
                    const w = window.innerWidth;
                    const h = window.innerHeight;
                    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
                        canvas.width = w * dpr;
                        canvas.height = h * dpr;
                    }
                    ctx2d.save();
                    ctx2d.scale(dpr, dpr);
                    ctx2d.clearRect(0, 0, w, h);

                    pulseTime += 0.025;
                    const R = 24; // Raio geométrico exato de cada hexágono
                    const hexW = Math.sqrt(3) * R;
                    const hexH = 2 * R;
                    const vertDist = hexH * 0.75;

                    const scanWaveY = ((pulseTime * 110) % (h + 240)) - 120;

                    ctx2d.lineWidth = 1.05;

                    for (let row = -1; row < Math.ceil(h / vertDist) + 2; row++) {
                        for (let col = -1; col < Math.ceil(w / hexW) + 2; col++) {
                            const cx = col * hexW + ((row % 2 !== 0) ? hexW * 0.5 : 0);
                            const cy = row * vertDist;

                            // Distância até a onda de varredura horizontal e até o encéfalo à esquerda
                            const distScan = Math.abs(cy - scanWaveY);
                            const scanBoost = Math.max(0, 1.0 - distScan / 110.0);
                            const alpha = 0.11 + scanBoost * 0.22;

                            ctx2d.strokeStyle = `rgba(0, 242, 254, ${alpha.toFixed(3)})`;
                            ctx2d.beginPath();
                            for (let s = 0; s < 6; s++) {
                                const angle = (Math.PI / 180) * (60 * s - 30);
                                const vx = cx + R * Math.cos(angle);
                                const vy = cy + R * Math.sin(angle);
                                if (s === 0) ctx2d.moveTo(vx, vy);
                                else ctx2d.lineTo(vx, vy);
                            }
                            ctx2d.closePath();
                            ctx2d.stroke();

                            // Brilho sutil nos nós da colmeia durante a passagem da varredura
                            if (scanBoost > 0.65 && (row + col) % 3 === 0) {
                                ctx2d.fillStyle = `rgba(0, 242, 254, ${(scanBoost * 0.14).toFixed(3)})`;
                                ctx2d.fill();
                            }
                        }
                    }

                    ctx2d.restore();
                    hexAnimId = requestAnimationFrame(renderHexFrame);
                }

                if (hexAnimId) cancelAnimationFrame(hexAnimId);
                hexAnimId = requestAnimationFrame(renderHexFrame);
            }

            // Síntese Sonora Industrial de Abertura (Sub-bass + Impacto Hidráulico + Varredura)
            function playIdSoftwareLogoSound() {
                try {
                    const ctx = getDoomAudioContext();
                    if (!ctx) return;
                    const now = ctx.currentTime;

                    // 1. Impacto Metálico + Drone Sub-Grave (64 Hz -> 26 Hz)
                    const oscSub = ctx.createOscillator();
                    const gainSub = ctx.createGain();
                    oscSub.type = 'sawtooth';
                    oscSub.frequency.setValueAtTime(64, now);
                    oscSub.frequency.exponentialRampToValueAtTime(26, now + 3.3);

                    const filterSub = ctx.createBiquadFilter();
                    filterSub.type = 'lowpass';
                    filterSub.frequency.setValueAtTime(190, now);
                    filterSub.frequency.exponentialRampToValueAtTime(42, now + 3.3);

                    gainSub.gain.setValueAtTime(0.01, now);
                    gainSub.gain.linearRampToValueAtTime(0.36, now + 0.35);
                    gainSub.gain.exponentialRampToValueAtTime(0.001, now + 3.5);

                    oscSub.connect(filterSub);
                    filterSub.connect(gainSub);
                    gainSub.connect(ctx.destination);
                    oscSub.start(now);
                    oscSub.stop(now + 3.55);

                    // 2. Acorde Ressonante Cibernético
                    [110, 164.81, 220, 329.63].forEach((freq, i) => {
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.type = 'sawtooth';
                        osc.frequency.setValueAtTime(freq * 0.5, now + 0.12 * i);
                        osc.frequency.exponentialRampToValueAtTime(freq, now + 0.75 + 0.12 * i);

                        const bp = ctx.createBiquadFilter();
                        bp.type = 'bandpass';
                        bp.frequency.setValueAtTime(600 + i * 350, now);
                        bp.Q.value = 3.5;

                        gain.gain.setValueAtTime(0.001, now);
                        gain.gain.linearRampToValueAtTime(0.075, now + 0.55 + 0.1 * i);
                        gain.gain.exponentialRampToValueAtTime(0.0008, now + 3.4);

                        osc.connect(bp);
                        bp.connect(gain);
                        gain.connect(ctx.destination);
                        osc.start(now);
                        osc.stop(now + 3.45);
                    });
                } catch (_) {}
            }

            function playDoomTypewriterTick() {
                try {
                    const ctx = getDoomAudioContext();
                    if (!ctx) return;
                    const now = ctx.currentTime;
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(1650 + Math.random() * 480, now);
                    gain.gain.setValueAtTime(0.016, now);
                    gain.gain.exponentialRampToValueAtTime(0.0004, now + 0.018);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(now);
                    osc.stop(now + 0.02);
                } catch (_) {}
            }

            // Transforma qualquer AudioBuffer humano em Voz Cibernética Robótica (Ring Modulation + Metallic Comb + Overdrive)
            function applyRoboticVocoderToAudioBuffer(ctx, inputBuffer) {
                const channels = inputBuffer.numberOfChannels;
                const len = inputBuffer.length;
                const sr = inputBuffer.sampleRate;
                const outBuffer = ctx.createBuffer(channels, len, sr);

                const delaySamples1 = Math.floor(0.013 * sr); // 13ms comb metálico
                const delaySamples2 = Math.floor(0.021 * sr); // 21ms ressonador de tubo
                const ringFreqHz = 54.0; // Portadora robótica

                for (let ch = 0; ch < channels; ch++) {
                    const inp = inputBuffer.getChannelData(ch);
                    const out = outBuffer.getChannelData(ch);

                    for (let i = 0; i < len; i++) {
                        const t = i / sr;
                        const dry = inp[i];

                        // 1. Modulação em Anel (Ring Modulator) misturada para manter inteligibilidade total com timbre robótico
                        const carrier = Math.sin(2.0 * Math.PI * ringFreqHz * t) * 0.5 + Math.cos(2.0 * Math.PI * (ringFreqHz * 2.0) * t) * 0.5;
                        const ringMod = dry * (0.62 + 0.38 * carrier);

                        // 2. Duplo Comb Filter Metálico (efeito de cabine cibernética)
                        const d1 = (i >= delaySamples1) ? out[i - delaySamples1] * 0.42 : 0.0;
                        const d2 = (i >= delaySamples2) ? inp[i - delaySamples2] * 0.28 : 0.0;

                        // 3. Saturação Harmônica Suave (Soft Clipping)
                        let sample = ringMod + d1 + d2;
                        sample = Math.tanh(sample * 1.65) * 0.85;
                        out[i] = sample;
                    }
                }
                return outBuffer;
            }

            let activeRoboticSource = null;

            async function speakRoboticDoomVoice(text, lang = 'pt-BR', segId = null) {
                return new Promise(async (resolve) => {
                    if (!text) { resolve(); return; }

                    if (currentAudio) {
                        try { currentAudio.pause(); currentAudio.currentTime = 0; } catch (_) {}
                        currentAudio = null;
                    }
                    if (activeRoboticSource) {
                        try { activeRoboticSource.stop(); } catch (_) {}
                        activeRoboticSource = null;
                    }
                    if ('speechSynthesis' in window) {
                        try { window.speechSynthesis.cancel(); } catch (_) {}
                    }

                    const ctx = getDoomAudioContext();
                    const candidateUrls = [];
                    if (segId) {
                        candidateUrls.push(`assets/audio/pt-BR/${encodeURIComponent(segId)}.mp3`);
                    }
                    candidateUrls.push(`/api/gemini-tts?text=${encodeURIComponent(text)}&lang=${encodeURIComponent(lang)}&_t=${Date.now()}`);

                    for (const url of candidateUrls) {
                        if (doomIntroAbort) { resolve(); return; }
                        try {
                            const resp = await fetch(url);
                            if (resp.ok && ctx) {
                                const arrayBuf = await resp.arrayBuffer();
                                const decoded = await ctx.decodeAudioData(arrayBuf);
                                const roboticBuffer = applyRoboticVocoderToAudioBuffer(ctx, decoded);

                                const src = ctx.createBufferSource();
                                src.buffer = roboticBuffer;
                                src.playbackRate.value = 0.96;

                                // Filtro passa-banda de telemetria
                                const hp = ctx.createBiquadFilter();
                                hp.type = 'highpass';
                                hp.frequency.value = 180;

                                const peak = ctx.createBiquadFilter();
                                peak.type = 'peaking';
                                peak.frequency.value = 2100;
                                peak.gain.value = 6.5;

                                src.connect(hp);
                                hp.connect(peak);
                                peak.connect(ctx.destination);

                                activeRoboticSource = src;
                                src.onended = () => {
                                    activeRoboticSource = null;
                                    resolve();
                                };
                                src.start(0);
                                return;
                            }
                        } catch (_) {}
                    }

                    // Fallback Web Speech Robótico se offline
                    if ('speechSynthesis' in window) {
                        try {
                            const utter = new SpeechSynthesisUtterance(text);
                            utter.lang = lang;
                            utter.pitch = 0.35;
                            utter.rate = 0.96;
                            utter.onend = () => resolve();
                            utter.onerror = () => setTimeout(resolve, Math.max(2600, text.length * 52));
                            window.speechSynthesis.speak(utter);
                            return;
                        } catch (_) {}
                    }
                    setTimeout(resolve, Math.max(2800, text.length * 52));
                });
            }

            // Roteiro Estritamente Científico sobre a Necessidade e Utilidade da Plataforma MOZOK
            const DOOM3_NARRATIVE_SEGMENTS = [
                {
                    id: 'DOOM3_SEG_0',
                    header: 'ESPECTRO IPÊ // DIAGNÓSTICO DO ENSINO EM NEUROCIÊNCIAS',
                    display: 'A compreensão tridimensional do sistema nervoso central humano constitui um dos maiores desafios pedagógicos e clínicos das ciências da saúde.',
                    speech: 'A compreensão tridimensional do sistema nervoso central humano constitui um dos maiores desafios pedagógicos e clínicos das ciências da saúde.'
                },
                {
                    id: 'DOOM3_SEG_1',
                    header: 'BARREIRAS ESTRUTURAIS // LIMITAÇÕES DOS MÉTODOS TRADICIONAIS',
                    display: 'Durante décadas, o treinamento anatômico esteve restrito à abstração bidimensional, ao alto custo de simuladores comerciais e à escassez de peças biológicas preservadas em formaldeído.',
                    speech: 'Durante décadas, o treinamento anatômico esteve restrito à abstração bidimensional, ao alto custo de simuladores comerciais e à escassez de peças biológicas preservadas em formaldeído.'
                },
                {
                    id: 'DOOM3_SEG_2',
                    header: 'ARQUITETURA MOZOK // MODELAGEM VOLUMÉTRICA & BIOFÍSICA ABERTA',
                    display: 'Para superar essas lacunas, o projeto MOZOK estabelece uma plataforma computacional aberta de reconstrução estereotáxica MNI152 e simulação eletrofisiológica em tempo real.',
                    speech: 'Para superar essas lacunas, o projeto Mozok estabelece uma plataforma computacional aberta de reconstrução estereotáxica M N I cento e cinquenta e dois e simulação eletrofisiológica em tempo real.'
                },
                {
                    id: 'DOOM3_SEG_3',
                    header: 'NAVEGAÇÃO MULTIESCALA // DO CÓRTEX AOS ORBITAIS ATÔMICOS',
                    display: 'Integrando macroanatomia, redes neuronais da Camada V, dinâmica sináptica, organelas intracelulares e estrutura atômica, o sistema unifica morfologia e fisiopatologia clínica.',
                    speech: 'Integrando macroanatomia, redes neuronais da camada cinco, dinâmica sináptica, organelas intracelulares e estrutura atômica, o sistema unifica morfologia e fisiopatologia clínica.'
                },
                {
                    id: 'DOOM3_SEG_4',
                    header: 'ACESSIBILIDADE UNIVERSAL // CIÊNCIA ABERTA PARA A HUMANIDADE',
                    display: 'Com suporte nativo a múltiplos idiomas, audiodescrição neural e tradução em Libras, o MOZOK democratiza o conhecimento neurocientífico sem barreiras financeiras ou sensoriais.',
                    speech: 'Com suporte nativo a múltiplos idiomas, audiodescrição neural e tradução em Libras, o Mozok democratiza o conhecimento neurocientífico sem barreiras financeiras ou sensoriais.'
                }
            ];

            let doomIntroRunning = false;
            let doomIntroAbort = false;

            async function typeTextOnDoomTerminal(text) {
                const typedSpan = document.getElementById('doom3-typed-text');
                if (!typedSpan) return;
                typedSpan.textContent = '';
                for (let i = 0; i < text.length; i++) {
                    if (doomIntroAbort) return;
                    typedSpan.textContent += text[i];
                    if (i % 2 === 0 && text[i] !== ' ') {
                        playDoomTypewriterTick();
                    }
                    await new Promise(r => setTimeout(r, 32));
                }
            }

            async function startDoom3CinematicIntro() {
                const overlay = document.getElementById('doom3-intro-overlay');
                const logoStage = document.getElementById('doom3-logo-stage');
                const termStage = document.getElementById('doom3-terminal-stage');
                const headerEl = document.getElementById('doom3-uac-header');
                const aboutModal = document.getElementById('mozok-about-modal');

                if (!overlay) return;
                if (aboutModal) aboutModal.classList.add('hidden');

                doomIntroRunning = true;
                doomIntroAbort = false;

                if (tourTimer) {
                    clearTimeout(tourTimer);
                    tourTimer = null;
                }

                // Garante modo Macro Córtex Real e oculta medula/nervos periféricos para deixar apenas a esfera cerebral à esquerda
                if (isMicroMode) setMicrocosmosMode(false);
                cnsAnatomy.setViewMode('EXTERNAL');
                cnsAnatomy.spinalGroup.visible = false;
                cnsAnatomy.pnsGroup.visible = false;
                cnsAnatomy.vascularGroup.visible = false;

                document.body.classList.add('cyber-intro-active', 'cyber-brain-blurred');
                overlay.classList.remove('hidden-intro');
                logoStage.style.display = 'flex';
                logoStage.style.opacity = '1';
                termStage.style.display = 'none';

                startHexagonalVisorCanvas();

                // Enquadra a esfera encefálica bem no canto esquerdo da tela (como um planeta em penumbra lateral)
                flyCameraTo(new THREE.Vector3(5.6, 0.4, 0.0), new THREE.Vector3(5.6, 0.8, 15.2), 0.5);

                // ATO I: Emblema Espectro Ipê em fundo 100% escuro com som industrial
                playIdSoftwareLogoSound();
                await new Promise(r => setTimeout(r, 3500));
                if (doomIntroAbort) return finishCyberIntroAndOpenAboutModal();

                // Transição para o ATO II: Revela o encéfalo desfocado à esquerda sob a malha hexagonal perfeita
                logoStage.style.opacity = '0';
                await new Promise(r => setTimeout(r, 850));
                if (doomIntroAbort) return finishCyberIntroAndOpenAboutModal();
                logoStage.style.display = 'none';
                termStage.style.display = 'flex';

                for (let s = 0; s < DOOM3_NARRATIVE_SEGMENTS.length; s++) {
                    if (doomIntroAbort) break;
                    const seg = DOOM3_NARRATIVE_SEGMENTS[s];
                    if (headerEl) headerEl.textContent = seg.header;

                    const typePromise = typeTextOnDoomTerminal(seg.display);
                    const speechPromise = speakRoboticDoomVoice(seg.speech, currentLang, seg.id);
                    await Promise.all([typePromise, speechPromise]);

                    if (doomIntroAbort) break;
                    await new Promise(r => setTimeout(r, 450));
                }

                finishCyberIntroAndOpenAboutModal();
            }

            function finishCyberIntroAndOpenAboutModal() {
                doomIntroAbort = true;
                doomIntroRunning = false;

                if (hexAnimId) {
                    cancelAnimationFrame(hexAnimId);
                    hexAnimId = null;
                }
                if (currentAudio) {
                    try { currentAudio.pause(); currentAudio.currentTime = 0; } catch (_) {}
                    currentAudio = null;
                }
                if (activeRoboticSource) {
                    try { activeRoboticSource.stop(); } catch (_) {}
                    activeRoboticSource = null;
                }
                if ('speechSynthesis' in window) {
                    try { window.speechSynthesis.cancel(); } catch (_) {}
                }

                const overlay = document.getElementById('doom3-intro-overlay');
                if (overlay) overlay.classList.add('hidden-intro');

                // Restaura a visibilidade completa do SNC/SNP e a nitidez do cérebro
                document.body.classList.remove('cyber-brain-blurred');
                document.body.classList.remove('cyber-intro-active');
                cnsAnatomy.setViewMode('EXTERNAL');
                flyCameraTo(new THREE.Vector3(0, -1.5, 0), new THREE.Vector3(0, 1.5, 22.0), 1.15);

                // Abre imediatamente o Modal com as Informações Completas do Projeto ("Sobre")!
                const aboutModal = document.getElementById('mozok-about-modal');
                if (aboutModal) {
                    aboutModal.classList.remove('hidden');
                }
            }

            // Rotação suave do encéfalo enquanto a apresentação estiver ativa
            const _origCnsUpdate = cnsAnatomy.update.bind(cnsAnatomy);
            cnsAnatomy.update = function(dt, elapsed) {
                _origCnsUpdate(dt, elapsed);
                if (doomIntroRunning && cnsAnatomy.rootGroup) {
                    cnsAnatomy.rootGroup.rotation.y += dt * 0.20;
                } else if (cnsAnatomy.rootGroup && Math.abs(cnsAnatomy.rootGroup.rotation.y) > 0.001) {
                    cnsAnatomy.rootGroup.rotation.y *= 0.90;
                }
            };

            window.startDoom3CinematicIntro = startDoom3CinematicIntro;
            window.finishCyberIntroAndOpenAboutModal = finishCyberIntroAndOpenAboutModal;

            const btnDoomSkip = document.getElementById('btn-doom3-skip');
            if (btnDoomSkip) {
                btnDoomSkip.addEventListener('click', () => finishCyberIntroAndOpenAboutModal());
            }
            const btnDoomReplayAudio = document.getElementById('btn-doom3-replay-audio');
            if (btnDoomReplayAudio) {
                btnDoomReplayAudio.addEventListener('click', () => {
                    getDoomAudioContext();
                    btnDoomReplayAudio.textContent = '🤖 Voz Cibernética: SINCRONIZADA';
                });
            }
            window.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && doomIntroRunning) {
                    finishCyberIntroAndOpenAboutModal();
                }
            });

            // =====================================================================
            // MODO APRESENTAÇÃO DE ESTRUTURAS"""

if OLD_JS_ENGINE_MATCH:
    html = html[:OLD_JS_ENGINE_MATCH.start()] + NEW_CYBER_JS_ENGINE + html[OLD_JS_ENGINE_MATCH.end():]

# 7. Remover o autoplay da introdução na inicialização padrão (para abrir direto na página inicial!)
html = html.replace(
    "setTimeout(() => { if (!urlQuery.get('clean_hud')) startDoom3CinematicIntro(); }, 350);",
    "// Abre diretamente na página inicial limpa; a Apresentação Cinemática inicia ao clicar em 'Sobre' (#btn-about)"
)

# 8. Atualizar o script do modal #mozok-about-modal para que clicar em #btn-about inicie a Apresentação Cinemática (com opção de pular para as informações do modal)
OLD_ABOUT_SCRIPT = """            const modal = document.getElementById('mozok-about-modal');
            const btnOpen = document.getElementById('btn-about');
            const btnClose1 = document.getElementById('btn-close-about-modal');
            const btnClose2 = document.getElementById('btn-close-about-footer');
            function openAbout() { if (modal) modal.classList.remove('hidden'); }
            function closeAbout() { if (modal) modal.classList.add('hidden'); }
            if (btnOpen) btnOpen.addEventListener('click', openAbout);"""

NEW_ABOUT_SCRIPT = """            const modal = document.getElementById('mozok-about-modal');
            const btnOpen = document.getElementById('btn-about');
            const btnReplayCyber = document.getElementById('btn-replay-cyber-intro');
            const btnClose1 = document.getElementById('btn-close-about-modal');
            const btnClose2 = document.getElementById('btn-close-about-footer');
            function openAboutWithIntro() {
                if (typeof window.startDoom3CinematicIntro === 'function') {
                    window.startDoom3CinematicIntro();
                } else if (modal) {
                    modal.classList.remove('hidden');
                }
            }
            function closeAbout() { if (modal) modal.classList.add('hidden'); }
            if (btnOpen) btnOpen.addEventListener('click', openAboutWithIntro);
            if (btnReplayCyber) btnReplayCyber.addEventListener('click', openAboutWithIntro);"""

html = html.replace(OLD_ABOUT_SCRIPT, NEW_ABOUT_SCRIPT)

INDEX_HTML.write_text(html, encoding="utf-8")

# 9. Regenerar os 5 segmentos científicos em web/assets/audio/pt-BR/DOOM3_SEG_0..4.mp3 para decodificação AudioBuffer imediata na VPS e Desktop
NEW_SEGMENTS_AUDIO = [
    ("DOOM3_SEG_0", "A compreensão tridimensional do sistema nervoso central humano constitui um dos maiores desafios pedagógicos e clínicos das ciências da saúde."),
    ("DOOM3_SEG_1", "Durante décadas, o treinamento anatômico esteve restrito à abstração bidimensional, ao alto custo de simuladores comerciais e à escassez de peças biológicas preservadas em formaldeído."),
    ("DOOM3_SEG_2", "Para superar essas lacunas, o projeto Mozok estabelece uma plataforma computacional aberta de reconstrução estereotáxica M N I cento e cinquenta e dois e simulação eletrofisiológica em tempo real."),
    ("DOOM3_SEG_3", "Integrando macroanatomia, redes neuronais da camada cinco, dinâmica sináptica, organelas intracelulares e estrutura atômica, o sistema unifica morfologia e fisiopatologia clínica."),
    ("DOOM3_SEG_4", "Com suporte nativo a múltiplos idiomas, audiodescrição neural e tradução em Libras, o Mozok democratiza o conhecimento neurocientífico sem barreiras financeiras ou sensoriais."),
]
pt_audio_dir = ROOT / "web" / "assets" / "audio" / "pt-BR"
if pt_audio_dir.exists():
    try:
        import edge_tts
        async def _gen_all_segs():
            for sid, stxt in NEW_SEGMENTS_AUDIO:
                out_f = pt_audio_dir / f"{sid}.mp3"
                comm = edge_tts.Communicate(stxt, "pt-BR-FranciscaNeural", rate="+2%")
                await comm.save(str(out_f))
                print(f"[ÁUDIO CIENTÍFICO] Atualizado {out_f.relative_to(ROOT)}")
        asyncio.run(_gen_all_segs())
    except Exception as e:
        print(f"[AVISO] Falha ao pré-gerar segmentos via edge_tts: {e}")

# 10. Atualizar tools/night_auditor_buttons.py para validar a versão 1.0005 e o novo fluxo do botão Sobre
if AUDITOR_PY.exists():
    aud_code = AUDITOR_PY.read_text(encoding="utf-8").replace("\r\n", "\n")
    aud_code = aud_code.replace('    "btn-doom-intro",\n', '')
    aud_code = aud_code.replace("1.0003", "1.0005").replace("1.0.3+0003", "1.0.5+0005")
    AUDITOR_PY.write_text(aud_code, encoding="utf-8")

print("[OK] MOZOK v1.0005 atualizado: Apresentação Científica vinculada ao botão 'Sobre' (com botão Pular para Informações), Grade Hexagonal Canvas 2D perfeita e Voz Robótica AudioBuffer DSP!")

