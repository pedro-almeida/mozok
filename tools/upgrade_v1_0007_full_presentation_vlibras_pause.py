#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MOZOK v1.0007 — Upgrade Completo da Apresentação Científica Cibernética:
1. Desacopla #btn-about (abre Modal Sobre direto) e vincula #btn-tour ("⚡ Apresentação")
   à Apresentação Científica seguida automaticamente pelo Tour Peça por Peça (runDeckStation(0)).
2. Sincronia exata entre áudio pré-gerado (CYBER_INTRO_1..5.mp3 nos 5 idiomas) e digitação,
   com +0.85s de tail padding no AudioBuffer e +2.4s de leitura pós-fala (zero corte).
3. Botão Pausar/Continuar (#btn-doom3-pause e tecla Espaço) que congela o áudio/digitação
   e exibe o cérebro hexagonal estático à esquerda com o Emblema Elétrico MOZOK em Canvas 2D.
4. Integração nativa com VLibras em Português (pt-BR) com tema HUD MOZOK.
5. Emblema vetorial multifacetado Espectro Ipê (#espectro-ipe-svg) em tela 100% escura
   no Ato I (cnsAnatomy.rootGroup.visible = false) + fontes Doom 3 (Orbitron / Share Tech Mono).
"""

import asyncio
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
INDEX_HTML = ROOT / "web" / "index.html"
SW_JS = ROOT / "web" / "sw.js"
VERSION_FILE = ROOT / "VERSION"
CARGO_TOML = ROOT / "Cargo.toml"


# ---------------------------------------------------------------------------
# 1. ROTEIRO CIENTÍFICO NOS 5 IDIOMAS (SINCRONIZADO COM CYBER_INTRO_1..5.mp3)
# ---------------------------------------------------------------------------
INTRO_SEGMENTS_I18N = {
    "pt-BR": [
        "O estudo da neuroanatomia e da eletrofisiologia humana historicamente enfrentou barreiras severas: o custo proibitivo de laboratórios cadavéricos e a limitação estática dos atlas bidimensionais.",
        "Para superar essas fronteiras educacionais e clínicas, a Espectro Ipê desenvolveu o MOZOK: um simulador neurofisiológico tridimensional aberto, construído sobre o padrão estereotáxico internacional MNI cento e cinquenta e dois.",
        "A plataforma integra em tempo real nove escalas biológicas contínuas: do córtex cerebral, tronco encefálico e árvore vascular até colunas corticais da camada cinco, fendas sinápticas, organelas e átomos.",
        "Seu motor biofísico resolve as equações diferenciais de Hodgkin-Huxley e modela sete patologias neurológicas críticas com referências indexadas por DOI, incluindo acidente vascular cerebral, Alzheimer e doenças priônicas.",
        "Totalmente gratuito, traduzido em cinco idiomas e integrado à Língua Brasileira de Sinais via VLibras, o MOZOK democratiza a neurociência de alta precisão. Iniciando agora o tour guiado peça por peça do encéfalo humano."
    ],
    "en-GB": [
        "The study of human neuroanatomy and electrophysiology has historically faced severe barriers: the prohibitive cost of cadaveric laboratories and the static limitation of two-dimensional atlases.",
        "To overcome these educational and clinical boundaries, Espectro Ipê developed MOZOK: an open three-dimensional neurophysiological simulator built upon the international MNI one-five-two stereotaxic standard.",
        "The platform integrates in real time nine continuous biological scales: from the cerebral cortex, brainstem, and vascular tree down to layer five cortical columns, synaptic clefts, organelles, and atoms.",
        "Its biophysical engine solves the Hodgkin-Huxley differential equations and models seven critical neurological pathologies with DOI-indexed references, including ischaemic stroke, Alzheimer's, and prion diseases.",
        "Completely free and open to humanity in five languages, MOZOK democratizes high-precision neuroscience. Initiating now the piece-by-piece guided tour of the human brain."
    ],
    "es-ES": [
        "El estudio de la neuroanatomía y la electrofisiología humana históricamente enfrentó severas barreras: el costo prohibitivo de los laboratorios cadavéricos y la limitación estática de los atlas bidimensionales.",
        "Para superar estas fronteras educativas y clínicas, Espectro Ipê desarrolló MOZOK: un simulador neurofisiológico tridimensional abierto, construido sobre el estándar estereotáxico internacional MNI ciento cincuenta y dos.",
        "La plataforma integra en tiempo real nueve escalas biológicas continuas: desde la corteza cerebral, el tronco encefálico y el árbol vascular hasta las columnas corticales de la capa cinco, sinapsis, orgánulos y átomos.",
        "Su motor biofísico resuelve las ecuaciones diferenciales de Hodgkin-Huxley y modela siete patologías neurológicas críticas con referencias indexadas por DOI, incluyendo accidente cerebrovascular, Alzheimer y enfermedades priónicas.",
        "Totalmente gratuito y abierto a la humanidad en cinco idiomas, MOZOK democratiza la neurociencia de alta precisión. Iniciando ahora el recorrido guiado pieza por pieza del encéfalo humano."
    ],
    "it-IT": [
        "Lo studio della neuroanatomia e dell'elettrofisiologia umana ha storicamente affrontato gravi barriere: il costo proibitivo dei laboratori cadaverici e il limite statico degli atlanti bidimensionali.",
        "Per superare queste frontiere educative e cliniche, Espectro Ipê ha sviluppato MOZOK: un simulatore neurofisiologico tridimensionale aperto, costruito sullo standard stereotassico internazionale MNI centocinquantadue.",
        "La piattaforma integra in tempo reale nove scale biologiche continue: dalla corteccia cerebrale, tronco encefalico e albero vascolare fino alle colonne corticali dello strato cinque, sinapsi, organelli e atomi.",
        "Il suo motore biofisico risolve le equazioni differenziali di Hodgkin-Huxley e modella sette patologie neurologiche critiche con riferimenti indicizzati DOI, inclusi ictus ischemico, Alzheimer e malattie da prioni.",
        "Totalmente gratuito e aperto all'umanità in cinque lingue, MOZOK democratizza le neuroscienze ad alta precisione. Avvio immediato del tour guidato pezzo per pezzo dell'encefalo umano."
    ],
    "uk-UA": [
        "Вивчення нейроанатомії та електрофізіології людини історично стикалося з серйозними бар'єрами: високою вартістю анатомічних лабораторій та статичністю двовимірних атласів.",
        "Щоб подолати ці освітні та клінічні межі, Espectro Ipê розробила MOZOK: відкритий тривимірний нейрофізіологічний симулятор, побудований на міжнародному стереотаксичному стандарті MNI сто п'ятдесят два.",
        "Платформа інтегрує в реальному часі дев'ять неперервних біологічних масштабів: від кори головного мозку, стовбура та судинного дерева до кортикальних колонок п'ятого шару, синапсів, органел та атомів.",
        "Його біофізичне ядро розв'язує диференціальні рівняння Годжкіна-Гакслі та моделює сім критичних неврологічних патологій із індексованими DOI публікаціями, включаючи інсульт, хворобу Альцгеймера та пріонні хвороби.",
        "Повністю безкоштовний і відкритий для людства п'ятьма мовами, MOZOK демократизує високоточну нейронауку. Розпочинаємо покрокову екскурсію структурами людського мозку."
    ],
}

VOICE_MAP = {
    "pt-BR": "pt-BR-AntonioNeural",
    "en-GB": "en-GB-RyanNeural",
    "es-ES": "es-ES-AlvaroNeural",
    "it-IT": "it-IT-DiegoNeural",
    "uk-UA": "uk-UA-OstapNeural",
}


async def regenerate_all_25_intro_mp3s():
    """Gera em disco os 25 arquivos CYBER_INTRO_1..5.mp3 nos 5 idiomas com paridade 100% palavra por palavra."""
    import edge_tts

    audio_root = ROOT / "web" / "assets" / "audio"
    generated = 0
    for lang, segments in INTRO_SEGMENTS_I18N.items():
        lang_dir = audio_root / lang
        lang_dir.mkdir(parents=True, exist_ok=True)
        voice = VOICE_MAP[lang]
        for idx, text in enumerate(segments, start=1):
            out_file = lang_dir / f"CYBER_INTRO_{idx}.mp3"
            comm = edge_tts.Communicate(text=text, voice=voice, rate="-4%", pitch="-8Hz")
            await comm.save(str(out_file))
            if out_file.exists() and out_file.stat().st_size > 1024:
                generated += 1
                print(f"  [AUDIO v1.0007 OK] {lang}/CYBER_INTRO_{idx}.mp3 ({out_file.stat().st_size} bytes)")
            else:
                raise RuntimeError(f"Falha ao sintetizar {out_file}")

    # Mantém também DOOM3_SEG_0..4.mp3 em pt-BR sincronizados para retrocompatibilidade
    pt_dir = audio_root / "pt-BR"
    for i in range(5):
        src = pt_dir / f"CYBER_INTRO_{i+1}.mp3"
        dst = pt_dir / f"DOOM3_SEG_{i}.mp3"
        dst.write_bytes(src.read_bytes())

    print(f"[OK] {generated}/25 arquivos CYBER_INTRO_1..5.mp3 atualizados em disco.")


# ---------------------------------------------------------------------------
# 2. CSS E FONTES DOOM 3 + VLIBRAS HUD + OVERLAY v1.0007
# ---------------------------------------------------------------------------
DOOM3_FONTS_AND_VLIBRAS_CSS = """
    <!-- Tipografia Industrial Cibernética estilo Doom 3 / UAC Mars Terminal -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Rajdhani:wght@600;700&family=Share+Tech+Mono&display=swap" rel="stylesheet">
    <style id="mozok-v10007-doom3-vlibras-styles">
        .doom3-font-title {
            font-family: 'Orbitron', 'Rajdhani', 'Segoe UI', sans-serif;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            text-shadow: 0 0 18px rgba(0, 240, 255, 0.85), 0 0 36px rgba(0, 140, 255, 0.45);
        }
        .doom3-font-terminal {
            font-family: 'Share Tech Mono', 'Rajdhani', 'Consolas', monospace;
            letter-spacing: 0.045em;
            line-height: 1.68;
            text-shadow: 0 0 10px rgba(0, 240, 255, 0.55);
        }
        .doom3-cursor-block {
            display: inline-block;
            width: 0.62em;
            height: 1.08em;
            background: #00f0ff;
            vertical-align: text-bottom;
            margin-left: 4px;
            box-shadow: 0 0 12px #00f0ff;
            animation: doom3CursorBlink 0.65s infinite steps(2, start);
        }
        @keyframes doom3CursorBlink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
        /* Customização do Widget VLibras para harmonizar com o HUD MOZOK */
        div[vw].enabled {
            z-index: 120 !important;
        }
        div[vw] [vw-access-button] {
            border-radius: 10px !important;
            box-shadow: 0 0 18px rgba(0, 240, 255, 0.45) !important;
            border: 1px solid rgba(0, 240, 255, 0.6) !important;
        }
        div[vw] [vw-plugin-wrapper] {
            border-radius: 14px !important;
            border: 1px solid rgba(0, 240, 255, 0.55) !important;
            box-shadow: 0 12px 42px rgba(2, 8, 23, 0.92), 0 0 24px rgba(0, 240, 255, 0.25) !important;
            background: rgba(4, 12, 28, 0.96) !important;
        }
        /* Palco e componentes da Apresentação Científica v1.0007 */
        #espectro-ipe-splash {
            position: absolute;
            inset: 0;
            z-index: 20;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #01040a;
            transition: opacity 0.9s ease;
        }
        #espectro-ipe-svg {
            width: min(440px, 78vw);
            height: auto;
            filter: drop-shadow(0 0 28px rgba(250, 204, 21, 0.35)) drop-shadow(0 0 42px rgba(0, 240, 255, 0.35));
            transition: transform 1.2s ease-out;
        }
        .espectro-splash-main-title {
            margin-top: 16px;
            font-size: clamp(24px, 3.2vw, 38px);
            font-weight: 900;
            color: #ffffff;
        }
        .espectro-splash-sub-title {
            margin-top: 8px;
            font-size: clamp(12px, 1.4vw, 15px);
            color: rgba(165, 243, 252, 0.92);
            letter-spacing: 0.32em;
            text-transform: uppercase;
        }
        .espectro-splash-divider {
            margin-top: 14px;
            width: 260px;
            height: 2px;
            background: linear-gradient(90deg, transparent, #22d3ee, transparent);
        }
        .espectro-splash-engine-tag {
            margin-top: 12px;
            font-size: 11.5px;
            color: rgba(253, 224, 71, 0.88);
            letter-spacing: 0.22em;
            text-transform: uppercase;
        }
        #doom3-narrative-stage {
            position: absolute;
            inset: 0;
            z-index: 15;
            display: none;
            align-items: center;
            justify-content: flex-end;
            padding: 0 5vw;
            pointer-events: none;
        }
        .doom3-terminal-card {
            width: min(720px, 56vw);
            background: rgba(2, 8, 22, 0.78);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(0, 240, 255, 0.42);
            border-radius: 14px;
            padding: 26px 32px;
            box-shadow: 0 0 50px rgba(0, 240, 255, 0.16), inset 0 0 28px rgba(0, 240, 255, 0.08);
            pointer-events: auto;
        }
        @media screen and (max-width: 900px) {
            #doom3-narrative-stage {
                justify-content: center;
                padding: 0 16px;
            }
            .doom3-terminal-card {
                width: 100%;
                padding: 18px 20px;
            }
        }
        .doom3-terminal-toprow {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid rgba(0, 240, 255, 0.3);
            padding-bottom: 10px;
            margin-bottom: 16px;
            gap: 10px;
            flex-wrap: wrap;
        }
        .doom3-terminal-dots {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .doom3-dot {
            width: 9px;
            height: 9px;
            border-radius: 50%;
            display: inline-block;
        }
        .doom3-dot.cyan { background: #22d3ee; box-shadow: 0 0 8px #00f0ff; }
        .doom3-dot.amber { background: #fbbf24; }
        .doom3-dot.emerald { background: #34d399; }
        #doom3-uac-header {
            font-size: 11.5px;
            color: #67e8f9;
            font-weight: 700;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            border-left: none;
            padding-left: 0;
        }
        #doom3-segment-counter {
            font-size: 11.5px;
            color: #fde047;
            letter-spacing: 0.15em;
        }
        #doom3-typewriter-box {
            min-height: 150px;
            font-size: clamp(17px, 1.85vw, 23px);
            color: #ecfeff;
            font-weight: 600;
        }
        .doom3-progress-track {
            margin-top: 18px;
            width: 100%;
            height: 6px;
            background: rgba(8, 47, 73, 0.85);
            border-radius: 999px;
            overflow: hidden;
            border: 1px solid rgba(0, 240, 255, 0.3);
        }
        #doom3-progress-bar {
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, #22d3ee, #fde047, #10b981);
            transition: width 0.3s ease;
        }
        .doom3-action-btn.amber {
            border-color: rgba(250, 204, 21, 0.7);
            color: #fef08a;
            box-shadow: 0 0 16px rgba(250, 204, 21, 0.22);
        }
        .doom3-action-btn.amber:hover {
            background: rgba(250, 204, 21, 0.22);
            box-shadow: 0 0 24px rgba(250, 204, 21, 0.55);
        }
        .doom3-action-btn.rose {
            border-color: rgba(244, 63, 94, 0.7);
            color: #fecdd3;
            box-shadow: 0 0 16px rgba(244, 63, 94, 0.22);
        }
        .doom3-action-btn.rose:hover {
            background: rgba(244, 63, 94, 0.24);
            box-shadow: 0 0 24px rgba(244, 63, 94, 0.55);
        }
    </style>
"""


# ---------------------------------------------------------------------------
# 3. OVERLAY HTML v1.0007 COM SVG MULTIFACETADO ESPECTRO IPÊ DE ALTA PRECISÃO
# ---------------------------------------------------------------------------
ESPECTRO_IPE_HIGH_PRECISION_SVG = """
                <svg id="espectro-ipe-svg" viewBox="0 0 520 420" xmlns="http://www.w3.org/2000/svg" aria-label="Logo Espectro Ipê">
                    <defs>
                        <!-- Gradientes das Pétalas do Ipê-Amarelo -->
                        <linearGradient id="ipePetalGold" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#FFF380"/>
                            <stop offset="45%" stop-color="#FACC15"/>
                            <stop offset="85%" stop-color="#EAB308"/>
                            <stop offset="100%" stop-color="#CA8A04"/>
                        </linearGradient>
                        <linearGradient id="ipePetalShadow" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#A16207"/>
                            <stop offset="50%" stop-color="#EAB308"/>
                            <stop offset="100%" stop-color="#FEF08A"/>
                        </linearGradient>
                        <linearGradient id="ipeCalyxMagenta" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#F43F5E"/>
                            <stop offset="50%" stop-color="#D946EF"/>
                            <stop offset="100%" stop-color="#7E22CE"/>
                        </linearGradient>
                        <!-- Gradientes Low-Poly do Beija-Flor Espectral -->
                        <linearGradient id="wingTopAmberRose" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#F59E0B"/>
                            <stop offset="50%" stop-color="#F43F5E"/>
                            <stop offset="100%" stop-color="#FB7185"/>
                        </linearGradient>
                        <linearGradient id="wingMidGold" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#FEF08A"/>
                            <stop offset="55%" stop-color="#F59E0B"/>
                            <stop offset="100%" stop-color="#EA580C"/>
                        </linearGradient>
                        <linearGradient id="wingLowerViolet" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#EC4899"/>
                            <stop offset="55%" stop-color="#9333EA"/>
                            <stop offset="100%" stop-color="#3B82F6"/>
                        </linearGradient>
                        <linearGradient id="headEmeraldCyan" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#A7F3D0"/>
                            <stop offset="40%" stop-color="#10B981"/>
                            <stop offset="80%" stop-color="#06B6D4"/>
                            <stop offset="100%" stop-color="#0284C7"/>
                        </linearGradient>
                        <linearGradient id="tailRubyPurple" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#F43F5E"/>
                            <stop offset="50%" stop-color="#8B5CF6"/>
                            <stop offset="100%" stop-color="#1D4ED8"/>
                        </linearGradient>
                        <filter id="doomCyberGlow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3.5" result="blur"/>
                            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                        </filter>
                    </defs>

                    <!-- ==================== FLOR DE IPÊ-AMARELO (ESQUERDA) ==================== -->
                    <g id="ipe-flower-group" filter="url(#doomCyberGlow)">
                        <!-- Pétala Superior Esquerda -->
                        <path d="M185,205 C140,185 95,125 118,82 C138,45 188,68 205,115 C215,145 205,185 185,205 Z" fill="url(#ipePetalGold)" stroke="#FEF9C3" stroke-width="1.2"/>
                        <path d="M185,205 C155,165 135,115 132,75" fill="none" stroke="#CA8A04" stroke-width="1.4" opacity="0.65"/>
                        <!-- Pétala Superior Central -->
                        <path d="M195,200 C175,150 175,85 208,65 C238,48 265,88 248,142 C238,175 215,192 195,200 Z" fill="url(#ipePetalShadow)" stroke="#FEF9C3" stroke-width="1.2"/>
                        <!-- Pétala Média Esquerda ( Ampla e Ondulada ) -->
                        <path d="M182,212 C125,215 62,188 55,145 C48,102 105,88 148,128 C172,150 185,188 182,212 Z" fill="url(#ipePetalGold)" stroke="#FEF08A" stroke-width="1.3"/>
                        <path d="M182,212 C135,190 95,165 68,138" fill="none" stroke="#B45309" stroke-width="1.3" opacity="0.6"/>
                        <!-- Pétala Inferior Esquerda -->
                        <path d="M184,220 C130,248 72,265 58,230 C44,195 92,162 142,185 C165,196 178,210 184,220 Z" fill="url(#ipePetalShadow)" stroke="#FEF08A" stroke-width="1.2"/>
                        <!-- Pétala Inferior Central (Rebatida) -->
                        <path d="M192,224 C172,275 135,328 102,308 C72,290 102,235 148,215 C168,206 184,216 192,224 Z" fill="url(#ipePetalGold)" stroke="#FEF9C3" stroke-width="1.3"/>
                        <!-- Pétala Inferior Direita -->
                        <path d="M202,225 C215,275 212,335 178,342 C145,348 145,285 172,242 C182,226 195,222 202,225 Z" fill="url(#ipePetalShadow)" stroke="#FEF08A" stroke-width="1.2"/>
                        <!-- Cálice Tubular Magenta/Violeta (Conecta a Flor ao Bico) -->
                        <polygon points="182,202 218,192 238,205 215,226 186,225" fill="url(#ipeCalyxMagenta)" stroke="#F9A8D4" stroke-width="1"/>
                        <polygon points="218,192 252,186 244,208 215,226" fill="#EC4899" opacity="0.88"/>
                        <!-- Estames Luminosos no Cálice -->
                        <line x1="210" y1="205" x2="258" y2="178" stroke="#FEF08A" stroke-width="2" stroke-linecap="round"/>
                        <circle cx="258" cy="178" r="3" fill="#00F0FF"/>
                    </g>

                    <!-- ==================== BEIJA-FLOR MULTIFACETADO LOW-POLY (DIREITA) ==================== -->
                    <g id="hummingbird-lowpoly-group" filter="url(#doomCyberGlow)">
                        <!-- Bico Longo Ciano/Dourado penetrando a flor -->
                        <polygon points="222,198 292,162 296,170" fill="url(#headEmeraldCyan)" stroke="#67E8F9" stroke-width="0.9"/>
                        <polygon points="222,198 296,170 288,176" fill="#FACC15" opacity="0.9"/>

                        <!-- Cabeça Geométrica (Verde-Esmeralda e Turquesa) -->
                        <polygon points="292,162 318,148 326,166 296,170" fill="#10B981" stroke="#A7F3D0" stroke-width="0.8"/>
                        <polygon points="318,148 342,155 326,166" fill="#059669" stroke="#6EE7B7" stroke-width="0.8"/>
                        <polygon points="296,170 326,166 318,186 288,176" fill="#06B6D4" stroke="#67E8F9" stroke-width="0.8"/>
                        <!-- Olho Cibernético -->
                        <circle cx="312" cy="162" r="3.2" fill="#020617" stroke="#00F0FF" stroke-width="1.4"/>
                        <circle cx="313" cy="161" r="1.1" fill="#FFFFFF"/>

                        <!-- Garganta / Peito Facetado (Turquesa -> Azul Cobalto -> Violeta) -->
                        <polygon points="318,186 326,166 348,182 330,206" fill="#0EA5E9" stroke="#7DD3FC" stroke-width="0.8"/>
                        <polygon points="288,176 318,186 312,212 295,196" fill="#38BDF8" stroke="#BAE6FD" stroke-width="0.8"/>
                        <polygon points="318,186 330,206 312,212" fill="#0284C7" stroke="#38BDF8" stroke-width="0.8"/>
                        <polygon points="312,212 330,206 346,228 320,238" fill="#2563EB" stroke="#60A5FA" stroke-width="0.8"/>
                        <polygon points="330,206 348,182 366,208 346,228" fill="#4F46E5" stroke="#818CF8" stroke-width="0.8"/>

                        <!-- ASA PRINCIPAL DIREITA (Grande Envergadura Facetada: Ouro -> Coral -> Magenta -> Violeta) -->
                        <!-- Bordo de Ataque Superior -->
                        <polygon points="342,155 385,112 376,148 348,182" fill="url(#wingMidGold)" stroke="#FEF08A" stroke-width="0.9"/>
                        <polygon points="385,112 438,68 418,118 376,148" fill="url(#wingTopAmberRose)" stroke="#FDE047" stroke-width="0.9"/>
                        <polygon points="438,68 488,36 458,92 418,118" fill="#F43F5E" stroke="#FDA4AF" stroke-width="0.9"/>
                        <!-- Rêmiges Primárias Superiores -->
                        <polygon points="488,36 496,54 458,92" fill="#FB7185" stroke="#FFE4E6" stroke-width="0.8"/>
                        <polygon points="458,92 492,74 446,122 418,118" fill="#F97316" stroke="#FED7AA" stroke-width="0.8"/>
                        <polygon points="446,122 484,106 435,148 402,142" fill="#F59E0B" stroke="#FEF08A" stroke-width="0.8"/>
                        <!-- Facetas Centrais da Asa (Ouro Solar e Laranja) -->
                        <polygon points="376,148 418,118 402,142 368,175" fill="#FACC15" stroke="#FEF9C3" stroke-width="0.8"/>
                        <polygon points="418,118 446,122 402,142" fill="#FB923C" stroke="#FFEDD5" stroke-width="0.8"/>
                        <polygon points="368,175 402,142 435,148 392,185" fill="#EAB308" stroke="#FEF08A" stroke-width="0.8"/>
                        <polygon points="435,148 472,138 424,174 392,185" fill="#EC4899" stroke="#FBCFE8" stroke-width="0.8"/>
                        <!-- Rêmiges Secundárias Inferiores (Magenta / Púrpura / Violeta) -->
                        <polygon points="348,182 376,148 368,175 366,208" fill="#D946EF" stroke="#F5D0FE" stroke-width="0.8"/>
                        <polygon points="368,175 392,185 366,208" fill="#A855F7" stroke="#E9D5FF" stroke-width="0.8"/>
                        <polygon points="392,185 424,174 454,168 404,205" fill="url(#wingLowerViolet)" stroke="#F0ABFC" stroke-width="0.8"/>
                        <polygon points="366,208 392,185 404,205 376,222" fill="#7E22CE" stroke="#D8B4FE" stroke-width="0.8"/>
                        <polygon points="404,205 442,196 396,226 376,222" fill="#6366F1" stroke="#C7D2FE" stroke-width="0.8"/>

                        <!-- ASA SECUNDÁRIA (Fundo Esquerdo em Perspectiva) -->
                        <polygon points="318,148 345,102 362,126 342,155" fill="#F59E0B" opacity="0.82" stroke="#FEF08A" stroke-width="0.7"/>
                        <polygon points="345,102 378,64 385,112 362,126" fill="#EA580C" opacity="0.78" stroke="#FDBA74" stroke-width="0.7"/>

                        <!-- Ventre e Dorso Inferior -->
                        <polygon points="320,238 346,228 368,248 338,266" fill="#7C3AED" stroke="#C4B5FD" stroke-width="0.8"/>
                        <polygon points="346,228 376,222 368,248" fill="#9333EA" stroke="#E9D5FF" stroke-width="0.8"/>
                        <polygon points="338,266 368,248 382,276 352,288" fill="#C026D3" stroke="#F5D0FE" stroke-width="0.8"/>

                        <!-- CAUDA LONGA BIFURCADA (Rubi / Violeta / Azul-Elétrico) -->
                        <polygon points="352,288 382,276 418,325 378,318" fill="url(#tailRubyPurple)" stroke="#F9A8D4" stroke-width="0.8"/>
                        <polygon points="382,276 405,268 446,315 418,325" fill="#E11D48" stroke="#FDA4AF" stroke-width="0.8"/>
                        <polygon points="378,318 418,325 458,378 408,358" fill="#6D28D9" stroke="#C4B5FD" stroke-width="0.8"/>
                        <polygon points="418,325 446,315 485,365 458,378" fill="#be123c" stroke="#FDA4AF" stroke-width="0.8"/>
                        <!-- Pena Externa Esquerda da Cauda -->
                        <polygon points="338,266 352,288 345,342 326,312" fill="#3B82F6" stroke="#93C5FD" stroke-width="0.8"/>
                        <polygon points="352,288 378,318 362,368 345,342" fill="#1D4ED8" stroke="#60A5FA" stroke-width="0.8"/>
                    </g>
                </svg>
"""

NEW_OVERLAY_HTML = f"""    <!-- OVERLAY DE APRESENTAÇÃO CIENTÍFICA CIBERNÉTICA (MOZOK v1.0007 — DOOM 3 / ESPECTRO IPÊ) -->
    <div id="doom3-intro-overlay" class="hidden-intro" role="dialog" aria-label="Apresentação Científica MOZOK">
        <canvas id="cyber-hex-canvas"></canvas>
        <div class="cyber-scanline-overlay"></div>

        <!-- ATO I: VINHETA ESPECTRO IPÊ (TELA 100% ESCURA, SEM CÉREBRO VAZANDO ATRÁS) -->
        <div id="espectro-ipe-splash">
            {ESPECTRO_IPE_HIGH_PRECISION_SVG}
            <h1 class="doom3-font-title espectro-splash-main-title">ESPECTRO IPÊ</h1>
            <p class="doom3-font-terminal espectro-splash-sub-title">SOLUÇÕES TECNOLÓGICAS // ECOSSISTEMA MRIYA</p>
            <div class="espectro-splash-divider"></div>
            <p class="doom3-font-terminal espectro-splash-engine-tag">⚡ MOZOK NEURO-SIMULATION ENGINE • OPEN SCIENCE</p>
        </div>

        <!-- ATO II: TERMINAL CIENTÍFICO ESTILO DOOM 3 COM CÉREBRO HEXAGONAL À ESQUERDA -->
        <div id="doom3-narrative-stage">
            <div class="doom3-terminal-card">
                <div class="doom3-terminal-toprow">
                    <div class="doom3-terminal-dots">
                        <span class="doom3-dot cyan"></span>
                        <span class="doom3-dot amber"></span>
                        <span class="doom3-dot emerald"></span>
                        <span id="doom3-uac-header" class="doom3-font-title">MOZOK // TELEMETRIA CIENTÍFICA MNI152</span>
                    </div>
                    <span id="doom3-segment-counter" class="doom3-font-terminal">SEG 01 / 05</span>
                </div>

                <!-- Texto digitado exatamente no ritmo da fala -->
                <div id="doom3-typewriter-box" class="doom3-font-terminal">
                    <span id="doom3-typewriter-text"></span><span class="doom3-cursor-block"></span>
                </div>

                <!-- Barra de progresso da apresentação -->
                <div class="doom3-progress-track">
                    <div id="doom3-progress-bar"></div>
                </div>
            </div>
        </div>

        <!-- BARRA DE CONTROLES INTERATIVOS (PAUSAR COM EMBLEMA ELÉTRICO MOZOK / IR PARA TOUR / ENCERRAR) -->
        <div class="doom3-controls-bar">
            <button class="doom3-action-btn amber" id="btn-doom3-pause" title="Pausar/Retomar Apresentação e Exibir Emblema Elétrico MOZOK (Espaço)">⏸ Pausar [Espaço]</button>
            <button class="doom3-action-btn" id="btn-doom3-skip-to-about" title="Pular Introdução e Iniciar Tour Peça por Peça do Cérebro">⏭ Ir para o Tour das Estruturas</button>
            <button class="doom3-action-btn rose" id="btn-doom3-skip" title="Encerrar Apresentação [ESC]">✕ Encerrar [ESC]</button>
        </div>
    </div>"""


# ---------------------------------------------------------------------------
# 4. BLOCO JAVASCRIPT COMPLETO v1.0007 (SINCRONIA EXATA + PAUSA ELÉTRICA + VLIBRAS + AUTO-TOUR)
# ---------------------------------------------------------------------------
import json

INTRO_SEGMENTS_JSON = json.dumps(INTRO_SEGMENTS_I18N, ensure_ascii=False, indent=16)

NEW_PRESENTATION_JS = f"""            // =====================================================================
            // MÓDULO DE APRESENTAÇÃO CIENTÍFICA MOZOK v1.0007 (DOOM 3 / ESPECTRO IPÊ)
            // + PAUSA COM EMBLEMA ELÉTRICO MOZOK + VLIBRAS NATIVO + TRANSIÇÃO PARA TOUR
            // =====================================================================
            let doomAudioCtx = null;
            let hexAnimId = null;
            let cyberPresentationActive = false;
            let cyberPresentationPaused = false;
            let cyberPresentationAborted = false;
            let activeRoboticSource = null;

            function getDoomAudioContext() {{
                if (!doomAudioCtx) {{
                    const AudioCtx = window.AudioContext || window.webkitAudioContext;
                    if (AudioCtx) doomAudioCtx = new AudioCtx();
                }}
                if (doomAudioCtx && doomAudioCtx.state === 'suspended' && !cyberPresentationPaused) {{
                    doomAudioCtx.resume().catch(() => {{}});
                }}
                return doomAudioCtx;
            }}

            // Desenha o Emblema Elétrico MOZOK quando a apresentação está PAUSADA
            function drawElectricMozokEmblem(ctx, w, h, t) {{
                const cx = w * 0.66;
                const cy = h * 0.50;
                ctx.save();

                // Moldura Hexagonal Energizada
                const hexR = Math.min(w, h) * 0.22;
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {{
                    const ang = (Math.PI / 3) * i - Math.PI / 6;
                    const hx = cx + hexR * Math.cos(ang);
                    const hy = cy + hexR * Math.sin(ang);
                    if (i === 0) ctx.moveTo(hx, hy);
                    else ctx.lineTo(hx, hy);
                }}
                ctx.closePath();
                ctx.fillStyle = 'rgba(2, 10, 28, 0.88)';
                ctx.fill();
                ctx.lineWidth = 2.8;
                ctx.strokeStyle = '#00f0ff';
                ctx.shadowColor = '#00f0ff';
                ctx.shadowBlur = 24;
                ctx.stroke();

                // Raios Elétricos Dinâmicos ao redor do Emblema MOZOK
                for (let b = 0; b < 6; b++) {{
                    const baseAngle = (Math.PI * 2 * b) / 6 + Math.sin(t * 3.0 + b) * 0.25;
                    ctx.beginPath();
                    let rx = cx + Math.cos(baseAngle) * (hexR * 0.45);
                    let ry = cy + Math.sin(baseAngle) * (hexR * 0.45);
                    ctx.moveTo(rx, ry);
                    const steps = 6;
                    for (let s = 1; s <= steps; s++) {{
                        const r = hexR * (0.45 + (s / steps) * 0.52);
                        const jitter = (Math.sin(t * 28.0 + b * 7 + s * 13) * 14.0);
                        rx = cx + Math.cos(baseAngle) * r - Math.sin(baseAngle) * jitter;
                        ry = cy + Math.sin(baseAngle) * r + Math.cos(baseAngle) * jitter;
                        ctx.lineTo(rx, ry);
                    }}
                    ctx.strokeStyle = (b % 2 === 0) ? '#00f0ff' : '#fde047';
                    ctx.lineWidth = 1.9;
                    ctx.shadowColor = (b % 2 === 0) ? '#00f0ff' : '#facc15';
                    ctx.shadowBlur = 16;
                    ctx.stroke();
                }}

                // Título Central MOZOK com efeito elétrico
                ctx.font = '900 ' + Math.round(Math.min(w, h) * 0.068) + 'px Orbitron, Segoe UI, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#ffffff';
                ctx.shadowColor = '#00f0ff';
                ctx.shadowBlur = 28;
                ctx.fillText('MOZOK', cx, cy - 12);

                ctx.font = '700 ' + Math.round(Math.min(w, h) * 0.019) + 'px "Share Tech Mono", Consolas, monospace';
                ctx.fillStyle = '#fde047';
                ctx.shadowColor = '#facc15';
                ctx.shadowBlur = 12;
                ctx.fillText('⚡ SISTEMA EM PAUSA // PRESSIONE ESPAÇO PARA CONTINUAR', cx, cy + hexR * 0.36);

                ctx.restore();
            }}

            // Grade Colmeia Hexagonal de Alta Precisão em Canvas 2D + Suporte ao Modo Pausado
            function startHexagonalVisorCanvas() {{
                const canvas = document.getElementById('cyber-hex-canvas');
                if (!canvas) return;
                const ctx2d = canvas.getContext('2d');
                let pulseTime = 0;
                let pauseElectricTime = 0;

                function renderHexFrame() {{
                    if (!cyberPresentationActive) return;
                    const dpr = Math.min(window.devicePixelRatio || 1, 2);
                    const w = window.innerWidth;
                    const h = window.innerHeight;
                    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {{
                        canvas.width = w * dpr;
                        canvas.height = h * dpr;
                    }}
                    ctx2d.save();
                    ctx2d.scale(dpr, dpr);
                    ctx2d.clearRect(0, 0, w, h);

                    if (!cyberPresentationPaused) {{
                        pulseTime += 0.025;
                    }}
                    pauseElectricTime += 0.04;

                    const R = 24;
                    const hexW = Math.sqrt(3) * R;
                    const hexH = 2 * R;
                    const vertDist = hexH * 0.75;
                    const scanWaveY = ((pulseTime * 110) % (h + 240)) - 120;

                    ctx2d.lineWidth = 1.05;

                    for (let row = -1; row < Math.ceil(h / vertDist) + 2; row++) {{
                        for (let col = -1; col < Math.ceil(w / hexW) + 2; col++) {{
                            const cx = col * hexW + ((row % 2 !== 0) ? hexW * 0.5 : 0);
                            const cy = row * vertDist;

                            const distScan = Math.abs(cy - scanWaveY);
                            const scanBoost = cyberPresentationPaused ? 0.25 : Math.max(0, 1.0 - distScan / 110.0);
                            const alpha = 0.11 + scanBoost * 0.22;

                            ctx2d.strokeStyle = `rgba(0, 242, 254, ${{alpha.toFixed(3)}})`;
                            ctx2d.beginPath();
                            for (let s = 0; s < 6; s++) {{
                                const angle = (Math.PI / 180) * (60 * s - 30);
                                const vx = cx + R * Math.cos(angle);
                                const vy = cy + R * Math.sin(angle);
                                if (s === 0) ctx2d.moveTo(vx, vy);
                                else ctx2d.lineTo(vx, vy);
                            }}
                            ctx2d.closePath();
                            ctx2d.stroke();

                            if (scanBoost > 0.65 && (row + col) % 3 === 0) {{
                                ctx2d.fillStyle = `rgba(0, 242, 254, ${{(scanBoost * 0.14).toFixed(3)}})`;
                                ctx2d.fill();
                            }}
                        }}
                    }}

                    if (cyberPresentationPaused) {{
                        drawElectricMozokEmblem(ctx2d, w, h, pauseElectricTime);
                    }}

                    ctx2d.restore();
                    hexAnimId = requestAnimationFrame(renderHexFrame);
                }}

                if (hexAnimId) cancelAnimationFrame(hexAnimId);
                hexAnimId = requestAnimationFrame(renderHexFrame);
            }}

            // Síntese Sonora Industrial de Abertura (Sub-bass + Impacto Hidráulico + Varredura)
            function playIdSoftwareLogoSound() {{
                try {{
                    const ctx = getDoomAudioContext();
                    if (!ctx) return;
                    const now = ctx.currentTime;

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

                    [110, 164.81, 220, 329.63].forEach((freq, i) => {{
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
                    }});
                }} catch (_) {{}}
            }}

            function playDoomTypewriterTick() {{
                try {{
                    const ctx = getDoomAudioContext();
                    if (!ctx || cyberPresentationPaused) return;
                    const now = ctx.currentTime;
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(1650 + Math.random() * 480, now);
                    gain.gain.setValueAtTime(0.014, now);
                    gain.gain.exponentialRampToValueAtTime(0.0004, now + 0.018);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(now);
                    osc.stop(now + 0.02);
                }} catch (_) {{}}
            }}

            // Processador Vocoder Robótico com +0.85s de Tail Padding para NUNCA cortar o final da frase
            function applyRoboticVocoderToAudioBuffer(ctx, inputBuffer) {{
                const channels = inputBuffer.numberOfChannels;
                const sr = inputBuffer.sampleRate;
                const tailPadSamples = Math.floor(sr * 0.85);
                const len = inputBuffer.length + tailPadSamples;
                const outBuffer = ctx.createBuffer(channels, len, sr);

                const delaySamples1 = Math.floor(0.013 * sr);
                const delaySamples2 = Math.floor(0.021 * sr);
                const ringFreqHz = 54.0;

                for (let ch = 0; ch < channels; ch++) {{
                    const inp = inputBuffer.getChannelData(ch);
                    const out = outBuffer.getChannelData(ch);

                    for (let i = 0; i < len; i++) {{
                        const t = i / sr;
                        const dry = (i < inputBuffer.length) ? inp[i] : 0.0;

                        const carrier = Math.sin(2.0 * Math.PI * ringFreqHz * t) * 0.5 + Math.cos(2.0 * Math.PI * (ringFreqHz * 2.0) * t) * 0.5;
                        const ringMod = dry * (0.64 + 0.36 * carrier);

                        const d1 = (i >= delaySamples1) ? out[i - delaySamples1] * 0.40 : 0.0;
                        const d2 = (i >= delaySamples2 && (i - delaySamples2) < inputBuffer.length) ? inp[i - delaySamples2] * 0.26 : 0.0;

                        let sample = ringMod + d1 + d2;
                        sample = Math.tanh(sample * 1.55) * 0.86;
                        out[i] = sample;
                    }}
                }}
                return outBuffer;
            }}

            // Ativa automaticamente o Intérprete VLibras quando o idioma é Português (pt-BR)
            function activateVLibrasForPresentation() {{
                const lang = currentLang || 'pt-BR';
                if (!lang.toLowerCase().startsWith('pt')) return;
                try {{
                    const cont = document.getElementById('vlibras-container');
                    if (cont) cont.style.display = 'block';
                    document.body.classList.add('vlibras-dock-open');
                    if (btnVlibras) btnVlibras.classList.add('active');
                    vlibrasActive = true;
                    if (!vlibrasInitialized) {{
                        vlibrasInitialized = true;
                        const script = document.createElement('script');
                        script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
                        script.onload = () => {{
                            if (window.VLibras && window.VLibras.Widget) {{
                                new window.VLibras.Widget('https://vlibras.gov.br/app');
                            }}
                        }};
                        document.body.appendChild(script);
                    }}
                    const vwBtn = document.querySelector('[vw-access-button]');
                    const vwWrapper = document.querySelector('[vw-plugin-wrapper]');
                    if (vwBtn && vwWrapper && !vwWrapper.classList.contains('active')) {{
                        vwBtn.click();
                    }}
                }} catch (_) {{}}
            }}

            function sendSegmentToVLibras(text) {{
                const lang = currentLang || 'pt-BR';
                if (!lang.toLowerCase().startsWith('pt')) return;
                syncSpeechWithVLibras(text);
            }}

            const INTRO_SEGMENTS_I18N = {INTRO_SEGMENTS_JSON};

            async function fetchIntroAudioBuffer(segmentText, segmentIndex) {{
                const ctx = getDoomAudioContext();
                if (!ctx) return null;
                const lang = currentLang || 'pt-BR';
                const candidateUrls = [
                    `assets/audio/${{lang}}/CYBER_INTRO_${{segmentIndex + 1}}.mp3`,
                    `assets/audio/pt-BR/CYBER_INTRO_${{segmentIndex + 1}}.mp3`,
                    `/api/gemini-tts?text=${{encodeURIComponent(segmentText)}}&lang=${{encodeURIComponent(lang)}}`
                ];
                for (const url of candidateUrls) {{
                    if (cyberPresentationAborted) return null;
                    try {{
                        const res = await fetch(url);
                        if (res.ok) {{
                            const arr = await res.arrayBuffer();
                            if (arr && arr.byteLength > 256) {{
                                return await ctx.decodeAudioData(arr);
                            }}
                        }}
                    }} catch (_) {{}}
                }}
                return null;
            }}

            // Mantém compatibilidade com auditoria automatizada (speakRoboticDoomVoice)
            async function speakRoboticDoomVoice(text, lang = 'pt-BR', segId = null) {{
                const buf = await fetchIntroAudioBuffer(text, 0);
                if (!buf) return;
                const ctx = getDoomAudioContext();
                const robotic = applyRoboticVocoderToAudioBuffer(ctx, buf);
                return new Promise((resolve) => {{
                    const src = ctx.createBufferSource();
                    src.buffer = robotic;
                    src.connect(ctx.destination);
                    src.onended = () => resolve();
                    src.start(0);
                }});
            }}

            async function waitWithPauseAndAbort(ms) {{
                const step = 40;
                let elapsed = 0;
                while (elapsed < ms) {{
                    if (cyberPresentationAborted) return false;
                    if (!cyberPresentationPaused) {{
                        elapsed += step;
                    }}
                    await new Promise(r => setTimeout(r, step));
                }}
                return !cyberPresentationAborted;
            }}

            async function playSegmentWithExactSyncedTypewriter(segmentText, segmentIndex, totalSegments) {{
                const textEl = document.getElementById('doom3-typewriter-text');
                const counterEl = document.getElementById('doom3-segment-counter');
                const progEl = document.getElementById('doom3-progress-bar');
                const narrativeStage = document.getElementById('doom3-narrative-stage');

                if (counterEl) counterEl.textContent = `SEG 0${{segmentIndex + 1}} / 0${{totalSegments}}`;
                if (progEl) progEl.style.width = `${{Math.round(((segmentIndex) / totalSegments) * 100)}}%`;
                if (textEl) textEl.textContent = '';

                sendSegmentToVLibras(segmentText);

                const rawBuffer = await fetchIntroAudioBuffer(segmentText, segmentIndex);
                if (cyberPresentationAborted) return;

                let effectiveSpeechSec = Math.max(5.5, segmentText.length * 0.058);
                let audioEndedPromise = Promise.resolve();

                const ctx = getDoomAudioContext();
                if (rawBuffer && ctx) {{
                    const processedBuffer = applyRoboticVocoderToAudioBuffer(ctx, rawBuffer);
                    effectiveSpeechSec = Math.max(2.5, processedBuffer.duration - 0.85);

                    audioEndedPromise = new Promise((resolveAudio) => {{
                        try {{
                            if (activeRoboticSource) {{
                                try {{ activeRoboticSource.stop(); }} catch (_) {{}}
                            }}
                            const src = ctx.createBufferSource();
                            src.buffer = processedBuffer;

                            const hp = ctx.createBiquadFilter();
                            hp.type = 'highpass';
                            hp.frequency.value = 165;

                            const peak = ctx.createBiquadFilter();
                            peak.type = 'peaking';
                            peak.frequency.value = 2100;
                            peak.gain.value = 5.5;

                            src.connect(hp);
                            hp.connect(peak);
                            peak.connect(ctx.destination);

                            activeRoboticSource = src;
                            src.onended = () => {{
                                activeRoboticSource = null;
                                resolveAudio();
                            }};
                            src.start(0);
                        }} catch (_) {{
                            resolveAudio();
                        }}
                    }});
                }} else {{
                    audioEndedPromise = waitWithPauseAndAbort(effectiveSpeechSec * 1000);
                }}

                // Sincroniza a velocidade de digitação com a duração real da fala (90% do tempo da voz)
                const chars = Array.from(segmentText);
                const charDelayMs = Math.max(18, Math.min(62, Math.floor((effectiveSpeechSec * 1000 * 0.90) / Math.max(1, chars.length))));

                for (let i = 0; i < chars.length; i++) {{
                    if (cyberPresentationAborted) return;
                    while (cyberPresentationPaused && !cyberPresentationAborted) {{
                        await new Promise(r => setTimeout(r, 50));
                    }}
                    if (cyberPresentationAborted) return;

                    if (textEl) textEl.textContent += chars[i];
                    if (i % 3 === 0 && chars[i] !== ' ') {{
                        playDoomTypewriterTick();
                    }}
                    await new Promise(r => setTimeout(r, charDelayMs));
                }}

                if (progEl) progEl.style.width = `${{Math.round(((segmentIndex + 1) / totalSegments) * 100)}}%`;

                // Aguarda o BufferSource terminar integralmente (incluindo os +0.85s de tail padding)
                await audioEndedPromise;
                if (cyberPresentationAborted) return;

                // Mantém o texto completo visível por mais 2.4 segundos após o término da voz para leitura confortável
                await waitWithPauseAndAbort(2400);
            }}

            function toggleDoom3PresentationPause() {{
                if (!cyberPresentationActive) return;
                cyberPresentationPaused = !cyberPresentationPaused;
                const pauseBtn = document.getElementById('btn-doom3-pause');
                const narrativeStage = document.getElementById('doom3-narrative-stage');

                if (cyberPresentationPaused) {{
                    if (doomAudioCtx && doomAudioCtx.state === 'running') {{
                        doomAudioCtx.suspend().catch(() => {{}});
                    }}
                    if (pauseBtn) pauseBtn.textContent = '▶ Continuar [Espaço]';
                    if (narrativeStage) narrativeStage.style.opacity = '0.16';
                }} else {{
                    if (doomAudioCtx && doomAudioCtx.state === 'suspended') {{
                        doomAudioCtx.resume().catch(() => {{}});
                    }}
                    if (pauseBtn) pauseBtn.textContent = '⏸ Pausar [Espaço]';
                    if (narrativeStage) narrativeStage.style.opacity = '1';
                }}
            }}

            async function startDoom3ScientificPresentation(chainIntoPieceByPieceTour = true) {{
                const overlay = document.getElementById('doom3-intro-overlay');
                const splash = document.getElementById('espectro-ipe-splash');
                const narrative = document.getElementById('doom3-narrative-stage');
                const pauseBtn = document.getElementById('btn-doom3-pause');
                const aboutModal = document.getElementById('mozok-about-modal');

                if (!overlay) return;
                if (aboutModal) aboutModal.classList.add('hidden');

                if (tourTimer) {{
                    clearTimeout(tourTimer);
                    tourTimer = null;
                }}
                if (currentAudio) {{
                    try {{ currentAudio.pause(); currentAudio.currentTime = 0; }} catch (_) {{}}
                    currentAudio = null;
                }}

                cyberPresentationActive = true;
                cyberPresentationPaused = false;
                cyberPresentationAborted = false;

                if (pauseBtn) pauseBtn.textContent = '⏸ Pausar [Espaço]';
                overlay.classList.remove('hidden-intro');
                document.body.classList.add('cyber-intro-active');

                // ATO I: Tela 100% escura para o Emblema Espectro Ipê — oculta completamente o cérebro 3D para não vazar atrás!
                if (isMicroMode) setMicrocosmosMode(false);
                if (cnsAnatomy && cnsAnatomy.rootGroup) {{
                    cnsAnatomy.rootGroup.visible = false;
                }}
                if (neuralMicro) {{
                    neuralMicro.setVisible(false);
                }}

                if (splash) {{
                    splash.style.display = 'flex';
                    splash.style.opacity = '1';
                }}
                if (narrative) {{
                    narrative.style.display = 'none';
                    narrative.style.opacity = '1';
                }}

                startHexagonalVisorCanvas();
                activateVLibrasForPresentation();
                playIdSoftwareLogoSound();

                const okSplash = await waitWithPauseAndAbort(3400);
                if (!okSplash || cyberPresentationAborted) return;

                if (splash) splash.style.opacity = '0';
                const okFade = await waitWithPauseAndAbort(850);
                if (!okFade || cyberPresentationAborted) return;
                if (splash) splash.style.display = 'none';

                // ATO II: Revela o encéfalo 3D deslocado à esquerda sob a malha hexagonal + Terminal Doom 3 à direita
                if (cnsAnatomy && cnsAnatomy.rootGroup) {{
                    cnsAnatomy.rootGroup.visible = true;
                    cnsAnatomy.setViewMode('EXTERNAL');
                    cnsAnatomy.spinalGroup.visible = false;
                    cnsAnatomy.pnsGroup.visible = false;
                    cnsAnatomy.vascularGroup.visible = false;
                }}
                document.body.classList.add('cyber-brain-blurred');
                flyCameraTo(new THREE.Vector3(5.6, 0.4, 0.0), new THREE.Vector3(5.6, 0.8, 15.2), 0.75);

                if (narrative) {{
                    narrative.style.display = 'flex';
                    narrative.style.opacity = '1';
                }}

                const lang = currentLang || 'pt-BR';
                const segments = INTRO_SEGMENTS_I18N[lang] || INTRO_SEGMENTS_I18N['pt-BR'];

                for (let s = 0; s < segments.length; s++) {{
                    if (cyberPresentationAborted) break;
                    await playSegmentWithExactSyncedTypewriter(segments[s], s, segments.length);
                }}

                if (!cyberPresentationAborted) {{
                    finishDoom3Presentation(chainIntoPieceByPieceTour);
                }}
            }}

            function finishDoom3Presentation(startPieceByPieceBrainTour = false) {{
                cyberPresentationAborted = true;
                cyberPresentationActive = false;
                cyberPresentationPaused = false;

                if (hexAnimId) {{
                    cancelAnimationFrame(hexAnimId);
                    hexAnimId = null;
                }}
                if (activeRoboticSource) {{
                    try {{ activeRoboticSource.stop(); }} catch (_) {{}}
                    activeRoboticSource = null;
                }}
                if (doomAudioCtx && doomAudioCtx.state === 'suspended') {{
                    doomAudioCtx.resume().catch(() => {{}});
                }}

                const overlay = document.getElementById('doom3-intro-overlay');
                if (overlay) overlay.classList.add('hidden-intro');

                document.body.classList.remove('cyber-brain-blurred');
                document.body.classList.remove('cyber-intro-active');

                if (cnsAnatomy && cnsAnatomy.rootGroup) {{
                    cnsAnatomy.rootGroup.visible = true;
                    cnsAnatomy.setViewMode('EXTERNAL');
                }}
                flyCameraTo(new THREE.Vector3(0, -1.5, 0), new THREE.Vector3(0, 1.5, 22.0), 1.0);

                // Se concluído naturalmente ou se o usuário clicou em "Ir para o Tour das Estruturas",
                // embala automaticamente no Tour Guiado Peça por Peça do Cérebro!
                if (startPieceByPieceBrainTour) {{
                    setTimeout(() => {{
                        const deckEl = document.getElementById('mozok-presenter-deck');
                        const tourBtn = document.getElementById('btn-tour');
                        const voiceBtn = document.getElementById('btn-voice');
                        const playBtn = document.getElementById('btn-deck-play');
                        deckActive = true;
                        deckPlaying = true;
                        voiceEnabled = true;
                        if (tourBtn) tourBtn.classList.add('active');
                        if (deckEl) deckEl.classList.add('active');
                        if (voiceBtn) voiceBtn.classList.add('active');
                        if (playBtn) playBtn.textContent = '⏸ Pausar';
                        runDeckStation(0);
                    }}, 450);
                }}
            }}

            // Rotação suave do encéfalo enquanto a apresentação estiver ativa (congela na pausa!)
            const _origCnsUpdate = cnsAnatomy.update.bind(cnsAnatomy);
            cnsAnatomy.update = function(dt, elapsed) {{
                _origCnsUpdate(dt, elapsed);
                if (cyberPresentationActive && !cyberPresentationPaused && cnsAnatomy.rootGroup && cnsAnatomy.rootGroup.visible) {{
                    cnsAnatomy.rootGroup.rotation.y += dt * 0.22;
                }} else if (!cyberPresentationActive && cnsAnatomy.rootGroup && Math.abs(cnsAnatomy.rootGroup.rotation.y) > 0.001) {{
                    cnsAnatomy.rootGroup.rotation.y *= 0.90;
                }}
            }};

            // Aliases globais
            window.startDoom3ScientificPresentation = startDoom3ScientificPresentation;
            window.startDoom3CinematicIntro = startDoom3ScientificPresentation;
            window.finishDoom3Presentation = finishDoom3Presentation;
            window.toggleDoom3PresentationPause = toggleDoom3PresentationPause;

            const btnDoomPause = document.getElementById('btn-doom3-pause');
            if (btnDoomPause) {{
                btnDoomPause.addEventListener('click', () => toggleDoom3PresentationPause());
            }}
            const btnDoomSkipToTour = document.getElementById('btn-doom3-skip-to-about');
            if (btnDoomSkipToTour) {{
                btnDoomSkipToTour.addEventListener('click', () => finishDoom3Presentation(true));
            }}
            const btnDoomSkip = document.getElementById('btn-doom3-skip');
            if (btnDoomSkip) {{
                btnDoomSkip.addEventListener('click', () => finishDoom3Presentation(false));
            }}

            window.addEventListener('keydown', (e) => {{
                if (!cyberPresentationActive) return;
                if (e.code === 'Space') {{
                    e.preventDefault();
                    e.stopPropagation();
                    toggleDoom3PresentationPause();
                }} else if (e.key === 'Escape') {{
                    e.preventDefault();
                    finishDoom3Presentation(false);
                }}
            }}, true);"""


def patch_files():
    # 1. Atualiza VERSION e Cargo.toml e web/sw.js
    VERSION_FILE.write_text("1.0007\n", encoding="utf-8")
    cargo_txt = CARGO_TOML.read_text(encoding="utf-8")
    cargo_txt = re.sub(r'version\s*=\s*"[^"]+"', 'version = "1.0.7+0007"', cargo_txt, count=1)
    CARGO_TOML.write_text(cargo_txt, encoding="utf-8")

    sw_txt = SW_JS.read_text(encoding="utf-8")
    sw_txt = re.sub(r"mozok-v1\.\d+-github-sync", "mozok-v1.0007-github-sync", sw_txt)
    SW_JS.write_text(sw_txt, encoding="utf-8")

    html = INDEX_HTML.read_text(encoding="utf-8")

    # 2. Injeta as fontes Doom 3 + CSS VLibras e Estilos v1.0007 no <head>
    if 'id="mozok-v10007-doom3-vlibras-styles"' not in html:
        html = html.replace("</style>\n    <script>", "</style>\n" + DOOM3_FONTS_AND_VLIBRAS_CSS + "\n    <script>", 1)

    # 3. Atualiza o Overlay de Apresentação Científica (#doom3-intro-overlay)
    overlay_pattern = re.compile(
        r'<!-- OVERLAY DE APRESENTAÇÃO CINEMÁTICA CIENTÍFICA.*?<!-- BARRA DE PALCO — APRESENTADOR DE ESTRUTURAS \(CONCIC\) -->',
        re.S,
    )
    if not overlay_pattern.search(html):
        raise RuntimeError("Não foi possível localizar o bloco #doom3-intro-overlay em web/index.html")
    html = overlay_pattern.sub(
        NEW_OVERLAY_HTML + "\n\n    <!-- BARRA DE PALCO — APRESENTADOR DE ESTRUTURAS (CONCIC) -->",
        html,
        count=1,
    )

    # 4. Atualiza badge de versão v1.0007 e botão #btn-tour ("⚡ Apresentação") na Topbar e UI_I18N
    html = html.replace(
        '<span class="brand-preset-tag" id="brand-version-badge" title="SemVer 1.0.6+0006">v1.0006</span>',
        '<span class="brand-preset-tag" id="brand-version-badge" title="SemVer 1.0.7+0007">v1.0007</span>',
    )
    html = html.replace("MOZOK v1.0006", "MOZOK v1.0007")
    html = html.replace("version: '1.0006'", "version: '1.0007'")

    html = html.replace(
        '<button class="hud-btn" id="btn-tour" data-i18n="btn_tour" title="Iniciar Apresentação Guiada pelas Estruturas e Casos Clínicos">🎙️ Apresentar Estruturas</button>',
        '<button class="hud-btn gold" id="btn-tour" data-i18n="btn_tour" title="Iniciar Apresentação Científica estilo Doom 3 seguida do Tour Peça por Peça do Cérebro">⚡ Apresentação</button>',
    )

    # Atualiza os rótulos btn_tour nos 5 idiomas dentro de UI_I18N
    html = html.replace("btn_tour: '🎙️ Apresentar Estruturas'", "btn_tour: '⚡ Apresentação'")
    html = html.replace("btn_tour: '🧭 Guided Tour'", "btn_tour: '⚡ Presentation'")
    html = html.replace("btn_tour: '🧭 Tour Guidato'", "btn_tour: '⚡ Presentazione'")
    html = html.replace("btn_tour: '🧭 Екскурсія'", "btn_tour: '⚡ Презентація'")

    # 5. Substitui o bloco JS da Apresentação Científica pelo novo motor v1.0007
    js_pattern = re.compile(
        r"// =====================================================================\s*// MALHA HEXAGONAL EM CANVAS 2D \+ VOZ ROBÓTICA DSP.*?// =====================================================================\s*// MODO APRESENTAÇÃO DE ESTRUTURAS \(DECK CONCIC COM VOZ E MERGULHO MULTIESCALA\)",
        re.S,
    )
    if not js_pattern.search(html):
        raise RuntimeError("Não foi possível localizar o bloco JS da apresentação em web/index.html")
    html = js_pattern.sub(
        NEW_PRESENTATION_JS
        + "\n\n            // =====================================================================\n            // MODO APRESENTAÇÃO DE ESTRUTURAS (DECK CONCIC COM VOZ E MERGULHO MULTIESCALA)",
        html,
        count=1,
    )

    # 6. Atualiza o listener do #btn-tour para iniciar a Apresentação Científica seguida automaticamente pelo Tour Peça por Peça
    old_tour_listener = """            newBtnTour.addEventListener('click', () => {
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
            });"""

    new_tour_listener = """            newBtnTour.addEventListener('click', () => {
                if (cyberPresentationActive) {
                    finishDoom3Presentation(false);
                    return;
                }
                if (deckActive) {
                    deckActive = false;
                    deckPlaying = false;
                    newBtnTour.classList.remove('active');
                    if (presenterDeckEl) presenterDeckEl.classList.remove('active');
                    if (tourTimer) { clearTimeout(tourTimer); tourTimer = null; }
                    return;
                }
                // Inicia a Apresentação Científica estilo Doom 3 e embala automaticamente no Tour Peça por Peça!
                startDoom3ScientificPresentation(true);
            });"""

    if old_tour_listener not in html:
        raise RuntimeError("Não foi possível localizar old_tour_listener em web/index.html")
    html = html.replace(old_tour_listener, new_tour_listener, 1)

    # 7. Desacopla o botão #btn-about ("ℹ️ Sobre") para abrir diretamente o Modal Sobre (#mozok-about-modal)
    #    e mantém #btn-replay-cyber-intro dentro do Modal Sobre para rever a Apresentação Científica
    old_about_script = """            function openAboutWithIntro() {
                if (typeof window.startDoom3CinematicIntro === 'function') {
                    window.startDoom3CinematicIntro();
                } else if (modal) {
                    modal.classList.remove('hidden');
                }
            }
            function closeAbout() { if (modal) modal.classList.add('hidden'); }
            if (btnOpen) btnOpen.addEventListener('click', openAboutWithIntro);
            if (btnReplayCyber) btnReplayCyber.addEventListener('click', openAboutWithIntro);"""

    new_about_script = """            function openAboutModalDirectly() {
                if (modal) modal.classList.remove('hidden');
            }
            function replayPresentationFromAbout() {
                if (modal) modal.classList.add('hidden');
                if (typeof window.startDoom3ScientificPresentation === 'function') {
                    window.startDoom3ScientificPresentation(true);
                }
            }
            function closeAbout() { if (modal) modal.classList.add('hidden'); }
            if (btnOpen) btnOpen.addEventListener('click', openAboutModalDirectly);
            if (btnReplayCyber) btnReplayCyber.addEventListener('click', replayPresentationFromAbout);"""

    if old_about_script not in html:
        raise RuntimeError("Não foi possível localizar old_about_script em web/index.html")
    html = html.replace(old_about_script, new_about_script, 1)

    INDEX_HTML.write_text(html, encoding="utf-8")
    print("[OK] web/index.html, VERSION, Cargo.toml e web/sw.js atualizados para v1.0007 (1.0.7+0007).")


if __name__ == "__main__":
    patch_files()
    asyncio.run(regenerate_all_25_intro_mp3s())

