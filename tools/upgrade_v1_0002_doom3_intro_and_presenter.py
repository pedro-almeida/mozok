#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Upgrade MOZOK v1.0002:
- Homenagem a John Carmack / Introdução estilo Doom 3 com Logo Cibernética do Espectro Ipê
- Cérebro 3D desfocado à esquerda sob grade hexagonal colmeia + Terminal Typewriter Ciano
- Processador DSP de Voz Robótica para Gemini TTS (Web Audio API Ring Modulator + Metallic Resonator)
- Transição suave de foco (unblur) abrindo direto na página inicial do MOZOK
- Painel Apresentador de Estruturas (Deck de Congresso com Play/Pause/Prev/Next sincronizado)
"""

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INDEX_HTML = ROOT / "web" / "index.html"
VERSION_FILE = ROOT / "VERSION"
CARGO_TOML = ROOT / "Cargo.toml"
SW_JS = ROOT / "web" / "sw.js"

VERSION_FILE.write_text("1.0002\n", encoding="utf-8")
cargo_txt = CARGO_TOML.read_text(encoding="utf-8")
cargo_txt = (
    cargo_txt.replace('version = "1.0.1+0001"', 'version = "1.0.2+0002"')
    .replace('version = "1.0.0"', 'version = "1.0.2+0002"')
)
CARGO_TOML.write_text(cargo_txt, encoding="utf-8")

if SW_JS.exists():
    sw_txt = SW_JS.read_text(encoding="utf-8")
    sw_txt = sw_txt.replace("mozok-v1.0001-github-sync", "mozok-v1.0002-github-sync")
    SW_JS.write_text(sw_txt, encoding="utf-8")

html = INDEX_HTML.read_text(encoding="utf-8").replace("\r\n", "\n")

# Atualizar badge para v1.0002
html = html.replace(
    'title="SemVer 1.0.1+0001">v1.0001</span>',
    'title="SemVer 1.0.2+0002">v1.0002</span>'
).replace(
    '>v1.0001</span>',
    ' title="SemVer 1.0.2+0002">v1.0002</span>'
).replace(
    '<span class="brand-preset-tag">BETA</span>',
    '<span class="brand-preset-tag" id="brand-version-badge" title="SemVer 1.0.2+0002">v1.0002</span>'
)

DOOM3_CSS = """
        /* =========================================================================
           MÓDULO DE INTRODUÇÃO DOOM 3 (HOMENAGEM A JOHN CARMACK & ESPECTRO IPÊ)
           ========================================================================= */
        body.doom3-intro-active .topbar,
        body.doom3-intro-active .left-sidebar,
        body.doom3-intro-active .right-sidebar,
        body.doom3-intro-active #nav-pan-hud,
        body.doom3-intro-active #mozok-scale-hud,
        body.doom3-intro-active #mobile-bottom-nav {
            opacity: 0 !important;
            pointer-events: none !important;
            transition: opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1);
        }

        #webgl-container {
            transition: filter 1.6s cubic-bezier(0.22, 1, 0.36, 1);
        }

        body.doom3-brain-blurred #webgl-container {
            filter: blur(5.5px) contrast(1.22) brightness(0.86) saturate(1.15);
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
            background: radial-gradient(circle at 24% 50%, rgba(0, 40, 55, 0.18) 0%, rgba(2, 6, 14, 0.78) 58%, rgba(1, 3, 8, 0.96) 100%);
            transition: opacity 1.3s ease;
        }

        #doom3-intro-overlay.hidden-intro {
            opacity: 0;
            pointer-events: none;
        }

        /* Grade Hexagonal Colmeia (Honeycomb Visor idêntico a Doom 3) */
        .doom3-hex-grid {
            position: absolute;
            inset: 0;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='98' viewBox='0 0 56 98'%3E%3Cg fill='none' stroke='%2300f2fe' stroke-width='1.1' stroke-opacity='0.16'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100'/%3E%3Cpath d='M0 82L28 66L56 82L56 116L28 132L0 116L0 82Z'/%3E%3C/g%3E%3C/svg%3E");
            background-size: 46px 80px;
            box-shadow: inset 0 0 140px rgba(0, 0, 0, 0.95);
            pointer-events: none;
            z-index: 2;
        }

        .doom3-scanline {
            position: absolute;
            inset: 0;
            background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0, 242, 254, 0.04) 50%, rgba(0, 0, 0, 0.25));
            background-size: 100% 4px;
            pointer-events: none;
            z-index: 3;
        }

        /* ATO I: Emblema Cibernético Espectro Ipê (Estilo id Software Doom 3) */
        #doom3-logo-stage {
            position: relative;
            z-index: 5;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            transition: opacity 0.85s ease, transform 0.85s ease;
        }

        .espectro-ipe-cyber-frame {
            position: relative;
            width: 250px;
            height: 250px;
            display: flex;
            align-items: center;
            justify-content: center;
            filter: drop-shadow(0 0 28px rgba(0, 242, 254, 0.35)) drop-shadow(0 0 45px rgba(250, 204, 21, 0.22));
            animation: doomPulseFrame 3.2s infinite ease-in-out;
        }

        @keyframes doomPulseFrame {
            0%, 100% { transform: scale(1.0); }
            50% { transform: scale(1.04); }
        }

        .espectro-ring-outer {
            position: absolute;
            inset: 0;
            border: 2px dashed rgba(0, 242, 254, 0.45);
            border-radius: 50%;
            animation: spinSlow 18s linear infinite;
        }

        .espectro-ring-inner {
            position: absolute;
            inset: 16px;
            border: 1.5px solid rgba(250, 204, 21, 0.55);
            clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%);
            background: radial-gradient(circle, rgba(15, 25, 48, 0.85) 0%, rgba(3, 7, 18, 0.96) 100%);
        }

        @keyframes spinSlow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        .espectro-title-cyber {
            margin-top: 18px;
            font-family: 'Consolas', 'Courier New', monospace;
            font-size: 26px;
            font-weight: 900;
            letter-spacing: 6px;
            color: #f8fafc;
            text-shadow: 0 0 16px rgba(0, 242, 254, 0.75), 0 0 32px rgba(250, 204, 21, 0.45);
        }

        .espectro-sub-cyber {
            margin-top: 4px;
            font-family: 'Consolas', 'Courier New', monospace;
            font-size: 11.5px;
            letter-spacing: 4px;
            color: #f43f5e;
            text-transform: uppercase;
            font-weight: 700;
        }

        .carmack-tribute-pill {
            margin-top: 14px;
            padding: 5px 14px;
            border: 1px solid rgba(0, 242, 254, 0.4);
            background: rgba(0, 242, 254, 0.08);
            border-radius: 4px;
            font-family: 'Consolas', monospace;
            font-size: 10.5px;
            letter-spacing: 2px;
            color: #00f2fe;
            text-transform: uppercase;
        }

        /* ATO II: Terminal Typewriter Ciano de Doom 3 sobre o Cérebro Desfocado */
        #doom3-terminal-stage {
            position: absolute;
            left: 22%;
            right: 10%;
            top: 44%;
            transform: translateY(-50%);
            z-index: 6;
            display: none;
            flex-direction: column;
            gap: 12px;
            pointer-events: none;
        }

        .doom3-uac-header {
            font-family: 'Consolas', 'Lucida Console', monospace;
            font-size: 11px;
            letter-spacing: 3.5px;
            color: rgba(0, 242, 254, 0.65);
            text-transform: uppercase;
            border-left: 3px solid #00f2fe;
            padding-left: 10px;
        }

        #doom3-typewriter-line {
            font-family: 'Consolas', 'Lucida Console', 'Courier New', monospace;
            font-size: clamp(20px, 2.7vw, 34px);
            font-weight: 700;
            letter-spacing: 1.8px;
            line-height: 1.38;
            color: #7dd3fc;
            text-shadow: 0 0 12px rgba(0, 242, 254, 0.95), 0 0 28px rgba(0, 242, 254, 0.55);
            min-height: 96px;
        }

        .doom3-block-cursor {
            display: inline-block;
            width: 14px;
            height: 1.05em;
            background: #00f2fe;
            vertical-align: text-bottom;
            margin-left: 4px;
            box-shadow: 0 0 14px #00f2fe;
            animation: blinkDoomCursor 0.55s steps(2, start) infinite;
        }

        @keyframes blinkDoomCursor {
            to { visibility: hidden; }
        }

        .doom3-controls-bar {
            position: fixed;
            bottom: 28px;
            right: 34px;
            z-index: 100;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .doom3-action-btn {
            background: rgba(4, 12, 24, 0.88);
            border: 1px solid rgba(0, 242, 254, 0.55);
            color: #00f2fe;
            font-family: 'Consolas', monospace;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 1.5px;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            text-transform: uppercase;
            box-shadow: 0 0 18px rgba(0, 242, 254, 0.25);
            transition: all 0.2s ease;
        }

        .doom3-action-btn:hover {
            background: rgba(0, 242, 254, 0.22);
            box-shadow: 0 0 25px rgba(0, 242, 254, 0.6);
        }

        /* =========================================================================
           PAINEL DE PALCO — APRESENTADOR DE ESTRUTURAS (CONCIC DECK)
           ========================================================================= */
        #mozok-presenter-deck {
            position: fixed;
            top: 72px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 40;
            background: rgba(6, 14, 28, 0.94);
            backdrop-filter: blur(18px);
            border: 1px solid #facc15;
            border-radius: 12px;
            padding: 8px 16px;
            display: none;
            align-items: center;
            gap: 12px;
            box-shadow: 0 12px 38px rgba(0, 0, 0, 0.75);
        }

        #mozok-presenter-deck.active {
            display: flex;
        }

        .deck-station-badge {
            font-size: 11.5px;
            font-weight: 800;
            color: #facc15;
            min-width: 240px;
            text-align: center;
        }
"""

if "#doom3-intro-overlay" not in html:
    html = html.replace("</style>", DOOM3_CSS + "\n    </style>", 1)

# Adicionar botão 🎬 Intro Doom 3 e atualizar botão 🧭 Tour Guiado -> 🎙️ Apresentar Estruturas na Topbar
if 'id="btn-doom-intro"' not in html:
    html = html.replace(
        '<button class="hud-btn" id="btn-tour" data-i18n="btn_tour">🧭 Tour Guiado</button>',
        '<button class="hud-btn gold" id="btn-doom-intro" title="Executar Introdução Cinemática estilo Doom 3 (Homenagem a John Carmack & Espectro Ipê)">🎬 Intro Doom 3</button>\n            <button class="hud-btn" id="btn-tour" data-i18n="btn_tour" title="Iniciar Apresentação Guiada pelas Estruturas e Casos Clínicos">🎙️ Apresentar Estruturas</button>'
    )

# Atualizar tradução de btn_tour para refletir "Apresentar Estruturas"
html = html.replace("btn_tour: '🧭 Tour Guiado',", "btn_tour: '🎙️ Apresentar Estruturas',")

DOOM3_HTML_OVERLAY = """
    <!-- OVERLAY DE INTRODUÇÃO CINEMÁTICA DOOM 3 (HOMENAGEM A JOHN CARMACK & ESPECTRO IPÊ) -->
    <div id="doom3-intro-overlay" class="hidden-intro" role="dialog" aria-label="Introdução Cinemática MOZOK">
        <div class="doom3-hex-grid"></div>
        <div class="doom3-scanline"></div>

        <!-- ATO I: SÍMBOLO DO ESPECTRO IPÊ EM ESTÉTICA DOOM 3 / ID SOFTWARE -->
        <div id="doom3-logo-stage">
            <div class="espectro-ipe-cyber-frame">
                <div class="espectro-ring-outer"></div>
                <div class="espectro-ring-inner"></div>
                <!-- SVG Vetorial Harmônico: Flor de Ipê Amarelo + Beija-Flor Poligonal Cibernético -->
                <svg width="175" height="175" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="position:relative; z-index:4;">
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
                    <!-- Flor de Ipê Amarelo (Pétalas esculturais + estames incandescentes) -->
                    <g stroke="#fef08a" stroke-width="0.9" fill="url(#ipeGoldGrad)" opacity="0.94">
                        <path d="M85 118 C52 108, 34 80, 42 52 C56 64, 72 86, 85 118 Z" />
                        <path d="M85 118 C45 122, 26 105, 24 82 C48 86, 68 98, 85 118 Z" />
                        <path d="M85 118 C62 146, 48 164, 68 172 C78 156, 82 138, 85 118 Z" />
                        <path d="M85 118 C92 148, 108 168, 128 162 C116 142, 102 128, 85 118 Z" />
                        <path d="M85 118 C112 126, 136 118, 142 98 C120 98, 102 106, 85 118 Z" />
                        <path d="M85 118 C75 88, 72 64, 88 54 C94 74, 92 96, 85 118 Z" />
                    </g>
                    <!-- Estames Neon Ciano/Ouro -->
                    <g stroke="#00f2fe" stroke-width="1.4">
                        <line x1="85" y1="118" x2="102" y2="92" />
                        <line x1="85" y1="118" x2="108" y2="98" />
                        <line x1="85" y1="118" x2="96" y2="88" />
                        <circle cx="102" cy="92" r="2.2" fill="#00f2fe" />
                        <circle cx="108" cy="98" r="2.2" fill="#00f2fe" />
                        <circle cx="96" cy="88" r="2.2" fill="#00f2fe" />
                    </g>
                    <!-- Beija-Flor Low-Poly Cibernético (Espectro Ipê) -->
                    <g stroke="#00f2fe" stroke-width="1.1" fill="url(#birdCyberGrad)">
                        <!-- Bico fino tocando o néctar -->
                        <polygon points="98,94 118,78 116,84" fill="#00f2fe" />
                        <!-- Cabeça e Olho biônico -->
                        <polygon points="116,76 132,72 128,88 116,84" />
                        <circle cx="123" cy="79" r="2.3" fill="#030712" stroke="#00f2fe" stroke-width="1.2" />
                        <!-- Dorso e Peito -->
                        <polygon points="128,88 146,96 138,118 120,102" />
                        <!-- Asas em Voo Dinâmico -->
                        <polygon points="132,76 174,34 156,74 138,88" />
                        <polygon points="138,86 184,48 168,88 144,96" opacity="0.88" />
                        <!-- Cauda -->
                        <polygon points="138,118 146,96 164,142 148,148" />
                    </g>
                </svg>
            </div>
            <div class="espectro-title-cyber">ESPECTRO IPÊ</div>
            <div class="espectro-sub-cyber">SOLUÇÕES TECNOLÓGICAS // ECOSSISTEMA MRIYA</div>
            <div class="carmack-tribute-pill">⚡ HOMENAGEM ARQUITETURAL A JOHN CARMACK &amp; DOOM 3 ENGINE</div>
        </div>

        <!-- ATO II: TERMINAL HOLOGRÁFICO DE DOOM 3 SOBRE O CÉREBRO DESFOCADO -->
        <div id="doom3-terminal-stage">
            <div class="doom3-uac-header" id="doom3-uac-header">ESPECTRO IPÊ CORP // MOZOK NEURO-SIMULATION TERMINAL v1.0002</div>
            <div id="doom3-typewriter-line">
                <span id="doom3-typed-text"></span><span class="doom3-block-cursor"></span>
            </div>
        </div>

        <!-- CONTROLES DA INTRODUÇÃO -->
        <div class="doom3-controls-bar">
            <button class="doom3-action-btn" id="btn-doom3-replay-audio" title="Ativar/Sincronizar Voz Robótica Gemini">🤖 Voz Robótica: ATIVA</button>
            <button class="doom3-action-btn" id="btn-doom3-skip" title="Pular Introdução e Ir para a Página Inicial (ESC)">⏭ Abrir Sistema [ESC]</button>
        </div>
    </div>

    <!-- BARRA DE PALCO — APRESENTADOR DE ESTRUTURAS (CONCIC) -->
    <div id="mozok-presenter-deck">
        <button class="hud-btn" id="btn-deck-prev" title="Estação Anterior (Seta Esquerda)">⏮ Anterior</button>
        <button class="hud-btn active" id="btn-deck-play" title="Pausar / Retomar Apresentação">⏸ Pausar</button>
        <span class="deck-station-badge" id="deck-station-label">1/8 • Córtex MNI152</span>
        <button class="hud-btn" id="btn-deck-next" title="Próxima Estação (Seta Direita)">⏭ Próxima</button>
        <button class="hud-btn danger" id="btn-deck-close" title="Encerrar Modo Apresentação">✕ Sair</button>
    </div>
"""

if 'id="doom3-intro-overlay"' not in html:
    html = html.replace('<header class="topbar">', DOOM3_HTML_OVERLAY + '\n    <header class="topbar">', 1)

DOOM3_JS_ENGINE = """
            // =====================================================================
            // SINTETIZADOR DE VOZ ROBÓTICA GEMINI (DOOM 3 DSP VOCODER / RING-MODULATOR)
            // & SEQUÊNCIA DE INTRODUÇÃO EM HOMENAGEM A JOHN CARMACK
            // =====================================================================
            let doomAudioCtx = null;

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

            // Efeito sonoro de abertura industrial (Logo Espectro Ipê / id Software)
            function playIdSoftwareLogoSound() {
                try {
                    const ctx = getDoomAudioContext();
                    if (!ctx) return;
                    const now = ctx.currentTime;

                    // 1. Sub-bass Sísmico Profundo (42 Hz -> 28 Hz)
                    const oscSub = ctx.createOscillator();
                    const gainSub = ctx.createGain();
                    oscSub.type = 'sawtooth';
                    oscSub.frequency.setValueAtTime(58, now);
                    oscSub.frequency.exponentialRampToValueAtTime(29, now + 3.2);

                    const filterSub = ctx.createBiquadFilter();
                    filterSub.type = 'lowpass';
                    filterSub.frequency.setValueAtTime(140, now);
                    filterSub.frequency.exponentialRampToValueAtTime(45, now + 3.2);

                    gainSub.gain.setValueAtTime(0.01, now);
                    gainSub.gain.linearRampToValueAtTime(0.32, now + 0.45);
                    gainSub.gain.exponentialRampToValueAtTime(0.001, now + 3.6);

                    oscSub.connect(filterSub);
                    filterSub.connect(gainSub);
                    gainSub.connect(ctx.destination);
                    oscSub.start(now);
                    oscSub.stop(now + 3.7);

                    // 2. Ressonância Metálica Hexagonal (Acorde Cibernético Carmack)
                    [220, 277.18, 329.63, 440].forEach((freq, i) => {
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.type = 'triangle';
                        osc.frequency.setValueAtTime(freq * 0.5, now + 0.15 * i);
                        osc.frequency.exponentialRampToValueAtTime(freq, now + 0.8 + 0.15 * i);

                        gain.gain.setValueAtTime(0.001, now);
                        gain.gain.linearRampToValueAtTime(0.06, now + 0.6 + 0.1 * i);
                        gain.gain.exponentialRampToValueAtTime(0.0008, now + 3.4);

                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        osc.start(now);
                        osc.stop(now + 3.5);
                    });
                } catch (_) {}
            }

            // Clique de Teleimpressora (Typewriter Terminal de Doom 3)
            function playDoomTypewriterTick() {
                try {
                    const ctx = getDoomAudioContext();
                    if (!ctx) return;
                    const now = ctx.currentTime;
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(1480 + Math.random() * 420, now);
                    gain.gain.setValueAtTime(0.018, now);
                    gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.022);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(now);
                    osc.stop(now + 0.025);
                } catch (_) {}
            }

            // Pulso Formante Robótico Auxiliar (acompanha sílabas em qualquer navegador)
            function playRoboticSyllablePulse(durationSec = 3.5) {
                try {
                    const ctx = getDoomAudioContext();
                    if (!ctx) return;
                    const now = ctx.currentTime;
                    const carrier = ctx.createOscillator();
                    const modulator = ctx.createOscillator();
                    const modGain = ctx.createGain();
                    const masterGain = ctx.createGain();

                    carrier.type = 'sawtooth';
                    carrier.frequency.setValueAtTime(115, now);
                    modulator.type = 'sine';
                    modulator.frequency.setValueAtTime(38, now);
                    modGain.gain.setValueAtTime(45, now);

                    masterGain.gain.setValueAtTime(0.018, now);
                    masterGain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

                    modulator.connect(modGain);
                    modGain.connect(carrier.frequency);
                    carrier.connect(masterGain);
                    masterGain.connect(ctx.destination);

                    carrier.start(now);
                    modulator.start(now);
                    carrier.stop(now + durationSec);
                    modulator.stop(now + durationSec);
                } catch (_) {}
            }

            // Fala Robótica Gemini (Conecta o stream da Gemini TTS a um Ring Modulator + Filtro Metálico WebAudio)
            async function speakRoboticDoomVoice(text, lang = 'pt-BR', segId = null) {
                return new Promise(async (resolve) => {
                    if (!text) { resolve(); return; }
                    syncSpeechWithVLibras(text);

                    if (currentAudio) {
                        try { currentAudio.pause(); currentAudio.currentTime = 0; } catch (_) {}
                        currentAudio = null;
                    }
                    if ('speechSynthesis' in window) {
                        try { window.speechSynthesis.cancel(); } catch (_) {}
                    }

                    const estDurationMs = Math.max(3200, text.length * 68);
                    playRoboticSyllablePulse(estDurationMs / 1000);

                    const attachRoboticDsp = (audio) => {
                        const ctx = getDoomAudioContext();
                        if (!ctx) return;
                        try {
                            const source = ctx.createMediaElementSource(audio);
                            const bandpass = ctx.createBiquadFilter();
                            bandpass.type = 'bandpass';
                            bandpass.frequency.value = 1150;
                            bandpass.Q.value = 1.4;

                            const highshelf = ctx.createBiquadFilter();
                            highshelf.type = 'peaking';
                            highshelf.frequency.value = 2400;
                            highshelf.gain.value = 8.0;

                            // Delay curto de 14ms para timbre metálico robótico (Flanger/Comb de IA)
                            const delay = ctx.createDelay();
                            delay.delayTime.value = 0.014;
                            const feedback = ctx.createGain();
                            feedback.gain.value = 0.42;

                            source.connect(bandpass);
                            bandpass.connect(highshelf);
                            highshelf.connect(ctx.destination);

                            highshelf.connect(delay);
                            delay.connect(feedback);
                            feedback.connect(delay);
                            delay.connect(ctx.destination);
                        } catch (_) {}
                    };

                    // 1. Tenta primeiro o MP3 estático pré-gerado pela Gemini TTS (0ms tanto na VPS quanto no Desktop)
                    if (segId) {
                        try {
                            const staticUrl = `assets/audio/pt-BR/${encodeURIComponent(segId)}.mp3`;
                            const audio = new Audio();
                            audio.crossOrigin = 'anonymous';
                            audio.src = staticUrl;
                            audio.playbackRate = 0.96;
                            currentAudio = audio;
                            attachRoboticDsp(audio);
                            audio.onended = () => resolve();
                            audio.onerror = () => fallbackRoboticWebSpeech(text, lang, resolve);
                            await audio.play();
                            return;
                        } catch (_) {}
                    }

                    // 2. Tenta Gemini TTS dinâmico com cadeia DSP Robótica
                    try {
                        const audioUrl = `/api/gemini-tts?text=${encodeURIComponent(text)}&lang=${encodeURIComponent(lang)}&id=${encodeURIComponent(segId || '')}&_t=${Date.now()}`;
                        const audio = new Audio();
                        audio.crossOrigin = 'anonymous';
                        audio.src = audioUrl;
                        audio.playbackRate = 0.96;
                        currentAudio = audio;
                        attachRoboticDsp(audio);

                        audio.onended = () => resolve();
                        audio.onerror = () => {
                            fallbackRoboticWebSpeech(text, lang, resolve);
                        };
                        await audio.play();
                        return;
                    } catch (_) {
                        fallbackRoboticWebSpeech(text, lang, resolve);
                    }
                });
            }

            function fallbackRoboticWebSpeech(text, lang, resolve) {
                if ('speechSynthesis' in window) {
                    try {
                        const utter = new SpeechSynthesisUtterance(text);
                        utter.lang = lang;
                        utter.pitch = 0.55; // Timbre robótico grave estilo UAC Computer
                        utter.rate = 0.98;
                        utter.onend = () => resolve();
                        utter.onerror = () => setTimeout(resolve, Math.max(2600, text.length * 55));
                        window.speechSynthesis.speak(utter);
                        return;
                    } catch (_) {}
                }
                setTimeout(resolve, Math.max(2800, text.length * 55));
            }

            // Roteiro Narrativo da Introdução de Doom 3 (História do MOZOK & Homenagem a Carmack)
            const DOOM3_NARRATIVE_SEGMENTS = [
                {
                    id: 'DOOM3_SEG_0',
                    header: 'ESPECTRO IPÊ // INICIALIZAÇÃO DO NÚCLEO MOZOK v1.0002',
                    display: 'O cérebro humano é a fronteira mais complexa do universo conhecido.',
                    speech: 'O cérebro humano é a fronteira mais complexa do universo conhecido.'
                },
                {
                    id: 'DOOM3_SEG_1',
                    header: 'ARQUITETURA ABERTA // HOMENAGEM A JOHN CARMACK',
                    display: 'Durante décadas, o ensino de neurociências esteve restrito a peças anatômicas formolizadas e licenças comerciais proibitivas.',
                    speech: 'Durante décadas, o ensino de neurociências esteve restrito a peças anatômicas formolizadas e licenças comerciais proibitivas.'
                },
                {
                    id: 'DOOM3_SEG_2',
                    header: 'ORIGEM UCRANIANA // KYIV • VOLODYMYR BETS (1874)',
                    display: 'Para romper essas barreiras nasceu o MOZOK — cérebro, em ucraniano — em tributo à ciência de Kyiv e a Volodymyr Bets.',
                    speech: 'Para romper essas barreiras nasceu o Mozok, cérebro em ucraniano, em tributo à ciência de Kyiv e a Volodymyr Bets.'
                },
                {
                    id: 'DOOM3_SEG_3',
                    header: 'MOTOR MULTIESCALA // DO CÓRTEX MNI152 AOS ÁTOMOS',
                    display: 'Renderizando em tempo real desde os giros corticais até os neurônios da Camada V, sinapses, organelas e orbitais atômicos.',
                    speech: 'Renderizando em tempo real desde os giros corticais até os neurônios da camada cinco, sinapses, organelas e orbitais atômicos.'
                },
                {
                    id: 'DOOM3_SEG_4',
                    header: 'ÉTICA DEONTOLÓGICA DE KANT // PATRIMÔNIO DA HUMANIDADE',
                    display: 'O conhecimento sobre o corpo humano pertence inalienavelmente a toda a humanidade. Inicializando sistema...',
                    speech: 'O conhecimento sobre o corpo humano pertence inalienavelmente a toda a humanidade. Inicializando sistema.'
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
                    await new Promise(r => setTimeout(r, 34));
                }
            }

            async function startDoom3CinematicIntro() {
                const overlay = document.getElementById('doom3-intro-overlay');
                const logoStage = document.getElementById('doom3-logo-stage');
                const termStage = document.getElementById('doom3-terminal-stage');
                const headerEl = document.getElementById('doom3-uac-header');

                if (!overlay) return;
                doomIntroRunning = true;
                doomIntroAbort = false;

                // Desativa tour anterior se ativo
                if (tourTimer) {
                    clearTimeout(tourTimer);
                    tourTimer = null;
                }

                // Garante modo Macro Córtex Real e posiciona o cérebro à esquerda como Marte em Doom 3
                if (isMicroMode) setMicrocosmosMode(false);
                cnsAnatomy.setViewMode('EXTERNAL');
                document.body.classList.add('doom3-intro-active', 'doom3-brain-blurred');
                overlay.classList.remove('hidden-intro');
                logoStage.style.display = 'flex';
                logoStage.style.opacity = '1';
                termStage.style.display = 'none';

                // Posiciona a câmera deslocada para a direita, deixando o cérebro no lado esquerdo da tela (igual a Marte em Doom 3)
                flyCameraTo(new THREE.Vector3(4.2, -0.8, 0.0), new THREE.Vector3(4.2, 0.8, 17.5), 0.6);

                // ATO I: Exibe o símbolo do Espectro Ipê com som industrial estilo id Software
                playIdSoftwareLogoSound();
                await new Promise(r => setTimeout(r, 3600));
                if (doomIntroAbort) return finishDoom3IntroToHome();

                // Transição para o ATO II: Cérebro desfocado à esquerda sob a grade hexagonal + palavras digitadas
                logoStage.style.opacity = '0';
                await new Promise(r => setTimeout(r, 750));
                if (doomIntroAbort) return finishDoom3IntroToHome();
                logoStage.style.display = 'none';
                termStage.style.display = 'flex';

                for (let s = 0; s < DOOM3_NARRATIVE_SEGMENTS.length; s++) {
                    if (doomIntroAbort) break;
                    const seg = DOOM3_NARRATIVE_SEGMENTS[s];
                    if (headerEl) headerEl.textContent = seg.header;

                    // Dispara digitação e voz robótica da Gemini em paralelo sincronizado
                    const typePromise = typeTextOnDoomTerminal(seg.display);
                    const speechPromise = speakRoboticDoomVoice(seg.speech, currentLang, seg.id);
                    await Promise.all([typePromise, speechPromise]);

                    if (doomIntroAbort) break;
                    await new Promise(r => setTimeout(r, 420));
                }

                finishDoom3IntroToHome();
            }

            function finishDoom3IntroToHome() {
                doomIntroAbort = true;
                doomIntroRunning = false;

                if (currentAudio) {
                    try { currentAudio.pause(); currentAudio.currentTime = 0; } catch (_) {}
                    currentAudio = null;
                }
                if ('speechSynthesis' in window) {
                    try { window.speechSynthesis.cancel(); } catch (_) {}
                }

                const overlay = document.getElementById('doom3-intro-overlay');
                if (overlay) overlay.classList.add('hidden-intro');

                // Remove o desfoque do cérebro e traz os painéis da página inicial com transição suave
                document.body.classList.remove('doom3-brain-blurred');
                document.body.classList.remove('doom3-intro-active');

                // Centraliza o cérebro na posição canônica inicial do MOZOK
                flyCameraTo(new THREE.Vector3(0, -1.5, 0), new THREE.Vector3(0, 1.5, 22.0), 1.35);
            }

            // Rotação lenta do cérebro tipo planeta Marte enquanto a intro de Doom 3 estiver ativa
            const _origCnsUpdate = cnsAnatomy.update.bind(cnsAnatomy);
            cnsAnatomy.update = function(dt, elapsed) {
                _origCnsUpdate(dt, elapsed);
                if (doomIntroRunning && cnsAnatomy.rootGroup) {
                    cnsAnatomy.rootGroup.rotation.y += dt * 0.22;
                } else if (cnsAnatomy.rootGroup && Math.abs(cnsAnatomy.rootGroup.rotation.y) > 0.001) {
                    cnsAnatomy.rootGroup.rotation.y *= 0.92;
                }
            };

            const btnDoomIntro = document.getElementById('btn-doom-intro');
            if (btnDoomIntro) {
                btnDoomIntro.addEventListener('click', () => startDoom3CinematicIntro());
            }
            const btnDoomSkip = document.getElementById('btn-doom3-skip');
            if (btnDoomSkip) {
                btnDoomSkip.addEventListener('click', () => finishDoom3IntroToHome());
            }
            const btnDoomReplayAudio = document.getElementById('btn-doom3-replay-audio');
            if (btnDoomReplayAudio) {
                btnDoomReplayAudio.addEventListener('click', () => {
                    getDoomAudioContext();
                    btnDoomReplayAudio.textContent = '🤖 Voz Robótica: SINCRONIZADA';
                });
            }
            window.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && doomIntroRunning) {
                    finishDoom3IntroToHome();
                }
            });

            // =====================================================================
            // MODO APRESENTAÇÃO DE ESTRUTURAS (DECK CONCIC COM VOZ E MERGULHO MULTIESCALA)
            // =====================================================================
            const CONCIC_PRESENTATION_STATIONS = [
                { title: '1/8 • Córtex MNI152 & Lobo Frontal', mode: 'MACRO', structId: 'FRONTAL_LOBE', pathology: 'HEALTHY' },
                { title: '2/8 • Circuito da Linguagem (Área de Broca)', mode: 'MACRO', structId: 'BROCA_AREA_BA44_45', pathology: 'HEALTHY' },
                { title: '3/8 • Simulação Clínica: AVC na Artéria Cerebral Média', mode: 'MACRO', structId: 'MIDDLE_CEREBRAL_ARTERY', pathology: 'ISCHEMIC_STROKE' },
                { title: '4/8 • Hipocampo & Degeneração no Alzheimer', mode: 'MACRO', structId: 'HIPPOCAMPUS', pathology: 'ALZHEIMER' },
                { title: '5/8 • Mergulho na Camada V: Neurônios de Betz', mode: 'MICRO', partId: 'NEURON_SOMA', dist: 4.2, pathology: 'HEALTHY' },
                { title: '6/8 • Condução Saltatória & Fenda Sináptica', mode: 'MICRO', partId: 'NEURON_SYNAPSE', dist: 1.8, pathology: 'HEALTHY' },
                { title: '7/8 • Interior Celular: Organelas & Mitocôndrias', mode: 'MICRO', partId: 'NEURON_NUCLEUS', dist: 0.85, pathology: 'HEALTHY' },
                { title: '8/8 • Escala Sub-Nanométrica: Átomos & Orbitais', mode: 'MICRO', partId: 'NEURON_NUCLEUS', dist: 0.32, pathology: 'HEALTHY' }
            ];

            let deckActive = false;
            let deckPlaying = false;
            let deckStationIdx = 0;

            function runDeckStation(idx) {
                deckStationIdx = (idx + CONCIC_PRESENTATION_STATIONS.length) % CONCIC_PRESENTATION_STATIONS.length;
                const st = CONCIC_PRESENTATION_STATIONS[deckStationIdx];
                const lbl = document.getElementById('deck-station-label');
                if (lbl) lbl.textContent = st.title;

                if (st.pathology) {
                    pathologySelect.value = st.pathology;
                    applyPathologySelection(st.pathology, st.pathology === 'HEALTHY' ? 0.0 : 0.85);
                }

                if (st.mode === 'MACRO') {
                    if (isMicroMode) setMicrocosmosMode(false);
                    selectMacroStructure(st.structId, true, true);
                } else {
                    if (!isMicroMode) setMicrocosmosMode(true);
                    selectNeuronSubPart(st.partId, false, true);
                    const target = new THREE.Vector3(0, 0.5, 0);
                    const pos = new THREE.Vector3(0, 0.5 + st.dist * 0.12, st.dist);
                    flyCameraTo(target, pos, 1.1);
                }

                if (voiceEnabled) {
                    narrateCurrentSelection();
                }

                if (tourTimer) clearTimeout(tourTimer);
                if (deckActive && deckPlaying) {
                    tourTimer = setTimeout(() => {
                        if (deckActive && deckPlaying) {
                            runDeckStation(deckStationIdx + 1);
                        }
                    }, 9500);
                }
            }

            const presenterDeckEl = document.getElementById('mozok-presenter-deck');
            const btnTourEl = document.getElementById('btn-tour');

            // Substitui o comportamento antigo do #btn-tour pelo Deck de Apresentação Estruturada
            const newBtnTour = btnTourEl.cloneNode(true);
            btnTourEl.parentNode.replaceChild(newBtnTour, btnTourEl);

            newBtnTour.addEventListener('click', () => {
                deckActive = !deckActive;
                newBtnTour.classList.toggle('active', deckActive);
                if (presenterDeckEl) presenterDeckEl.classList.toggle('active', deckActive);
                if (deckActive) {
                    deckPlaying = true;
                    voiceEnabled = true;
                    document.getElementById('btn-voice').classList.add('active');
                    document.getElementById('btn-deck-play').textContent = '⏸ Pausar';
                    runDeckStation(0);
                } else {
                    deckPlaying = false;
                    if (tourTimer) { clearTimeout(tourTimer); tourTimer = null; }
                }
            });

            document.getElementById('btn-deck-prev').addEventListener('click', () => runDeckStation(deckStationIdx - 1));
            document.getElementById('btn-deck-next').addEventListener('click', () => runDeckStation(deckStationIdx + 1));
            document.getElementById('btn-deck-play').addEventListener('click', (e) => {
                deckPlaying = !deckPlaying;
                e.currentTarget.textContent = deckPlaying ? '⏸ Pausar' : '▶ Continuar';
                if (deckPlaying) runDeckStation(deckStationIdx);
                else if (tourTimer) { clearTimeout(tourTimer); tourTimer = null; }
            });
            document.getElementById('btn-deck-close').addEventListener('click', () => {
                deckActive = false;
                deckPlaying = false;
                newBtnTour.classList.remove('active');
                if (presenterDeckEl) presenterDeckEl.classList.remove('active');
                if (tourTimer) { clearTimeout(tourTimer); tourTimer = null; }
            });
"""

if "startDoom3CinematicIntro()" not in html:
    target_init = "// Inicialização padrão"
    html = html.replace(
        target_init,
        DOOM3_JS_ENGINE + "\n            " + target_init + "\n            setTimeout(() => { if (!urlQuery.get('clean_hud')) startDoom3CinematicIntro(); }, 350);",
        1
    )

INDEX_HTML.write_text(html, encoding="utf-8")

# Gerar também os 5 arquivos MP3 estáticos da introdução de Doom 3 via Gemini TTS (Aoede)
sys.path.insert(0, str(ROOT / "tools"))
try:
    from gemini_tts_bridge import synthesize_speech
    doom_segments = [
        ("DOOM3_SEG_0", "O cérebro humano é a fronteira mais complexa do universo conhecido."),
        ("DOOM3_SEG_1", "Durante décadas, o ensino de neurociências esteve restrito a peças anatômicas formolizadas e licenças comerciais proibitivas."),
        ("DOOM3_SEG_2", "Para romper essas barreiras nasceu o Mozok, cérebro em ucraniano, em tributo à ciência de Kyiv e a Volodymyr Bets."),
        ("DOOM3_SEG_3", "Renderizando em tempo real desde os giros corticais até os neurônios da camada cinco, sinapses, organelas e orbitais atômicos."),
        ("DOOM3_SEG_4", "O conhecimento sobre o corpo humano pertence inalienavelmente a toda a humanidade. Inicializando sistema."),
    ]
    for seg_id, text in doom_segments:
        out_mp3 = ROOT / "web" / "assets" / "audio" / "pt-BR" / f"{seg_id}.mp3"
        if not out_mp3.exists() or out_mp3.stat().st_size < 1000:
            synthesize_speech(text, "pt-BR", "Aoede", out_mp3)
except Exception as e:
    print(f"[WARN] Audio pregen warning: {e}")

print("[OK] MOZOK v1.0002 atualizado com Introdução Doom 3 (Espectro Ipê + Carmack Homage + Voz Robótica Gemini) e Deck de Apresentação.")

