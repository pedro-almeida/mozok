import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent

# 1. Atualizar VERSION e Cargo.toml para v1.0010 (1.0.10+0010)
(ROOT / "VERSION").write_text("1.0010\n", encoding="utf-8")

cargo_path = ROOT / "Cargo.toml"
cargo_txt = cargo_path.read_text(encoding="utf-8")
cargo_txt = re.sub(r'version\s*=\s*"[^"]+"', 'version = "1.0.10+0010"', cargo_txt, count=1)
cargo_path.write_text(cargo_txt, encoding="utf-8")

# 2. Atualizar web/index.html
html_path = ROOT / "web" / "index.html"
html = html_path.read_text(encoding="utf-8")

html = html.replace("v1.0009", "v1.0010").replace("1.0.9+0009", "1.0.10+0010")

# 2A. Substituir CSS antigo de [vw] / #vlibras-container pelo CSS limpo do palco 3D oficial VLibras + regras cyber-intro-active
old_vw_css_start = "        /* =========================================================================\r\n           VLIBRAS SOB DEMANDA"
if old_vw_css_start not in html:
    old_vw_css_start = "        /* =========================================================================\n           VLIBRAS SOB DEMANDA"
old_vw_css_end = "        /* Barra de Legendas Acessíveis"

new_vw_css = """        /* =========================================================================
           INTÉRPRETE OFICIAL 3D VLIBRAS (WebGL REAL) EM PALCO RECORTADO v1.0010
           ========================================================================= */
        #mozok-vlibras-3d-stage {
            position: fixed;
            bottom: 72px;
            right: 24px;
            width: 224px;
            height: 286px;
            z-index: 122;
            border-radius: 14px;
            border: 1px solid rgba(0, 242, 254, 0.48);
            background: rgba(2, 10, 20, 0.86);
            backdrop-filter: blur(12px);
            box-shadow: 0 0 28px rgba(0, 242, 254, 0.25);
            overflow: hidden !important;
            display: none;
            pointer-events: auto;
        }
        #mozok-vlibras-3d-stage.active {
            display: block !important;
        }
        #mozok-vlibras-3d-stage div[vw],
        #mozok-vlibras-3d-stage [vw] {
            position: relative !important;
            inset: auto !important;
            top: 0 !important;
            left: 0 !important;
            right: auto !important;
            bottom: auto !important;
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            display: block !important;
            transform: none !important;
        }
        #mozok-vlibras-3d-stage div[vw] [vw-access-button],
        #mozok-vlibras-3d-stage [vw-access-button] {
            display: none !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }
        #mozok-vlibras-3d-stage [vw-plugin-wrapper],
        #mozok-vlibras-3d-stage .vw-plugin-wrapper,
        #mozok-vlibras-3d-stage .vpw-box {
            position: relative !important;
            top: -34px !important;
            left: 0 !important;
            width: 100% !important;
            height: calc(100% + 74px) !important;
            max-width: 100% !important;
            min-width: 0 !important;
            display: block !important;
            background: transparent !important;
            box-shadow: none !important;
            border: none !important;
        }
        @media (max-width: 1180px) {
            #mozok-vlibras-3d-stage {
                right: 12px;
                bottom: 66px;
                width: 185px;
                height: 235px;
            }
        }

        /* Oculta barras inferiores residuais e players nativos durante a Apresentação Doom 3 */
        body.cyber-intro-active #mozok-scale-hud,
        body.cyber-intro-active #nav-pan-hud,
        body.cyber-intro-active #mozok-subtitle-bar,
        body.cyber-intro-active #mobile-bottom-nav,
        body.cyber-intro-active audio {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
        }

"""

s_idx = html.find(old_vw_css_start)
e_idx = html.find(old_vw_css_end)
if s_idx == -1 or e_idx == -1:
    raise RuntimeError("Bloco CSS do VLibras nao localizado em index.html")
html = html[:s_idx] + new_vw_css + html[e_idx:]

# 2B. Substituir HTML do #mozok-libras-native-panel pelo palco 3D oficial VLibras
old_panel_html = """    <!-- AVATAR NATIVO DE LIBRAS INTEGRADO AO LAYOUT DO MOZOK -->
    <div id="mozok-libras-native-panel">
        <canvas id="mozok-libras-canvas" width="220" height="220"></canvas>
        <div id="mozok-libras-gloss-bar">LIBRAS // AGUARDANDO FALA</div>
    </div>"""

new_panel_html = """    <!-- INTÉRPRETE OFICIAL 3D DO VLIBRAS (WebGL REAL) EMBUTIDO EM VIEWPORT LIMPO -->
    <div id="mozok-vlibras-3d-stage" title="Intérprete Oficial 3D VLibras">
        <div vw class="enabled" id="mozok-vw-root">
            <div vw-access-button class="active"></div>
            <div vw-plugin-wrapper>
                <div class="vw-plugin-top-wrapper"></div>
            </div>
        </div>
    </div>"""

# Normaliza CRLF para busca
old_panel_crlf = old_panel_html.replace("\n", "\r\n")
if old_panel_crlf in html:
    html = html.replace(old_panel_crlf, new_panel_html.replace("\n", "\r\n"), 1)
elif old_panel_html in html:
    html = html.replace(old_panel_html, new_panel_html, 1)
else:
    raise RuntimeError("Bloco HTML #mozok-libras-native-panel nao encontrado em index.html")

# Remover CSS antigo #mozok-libras-native-panel para manter o arquivo limpo
old_native_css = """        /* AVATAR NATIVO DE LIBRAS INTEGRADO AO LAYOUT DO MOZOK (SEM PLUGIN EXTERNO) */
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
        }"""
html = html.replace(old_native_css.replace("\n", "\r\n"), "", 1).replace(old_native_css, "", 1)

# 2C. Corrigir botoes Ouvir / Narrar (#btn-popup-narrate e #btn-narrate-card) para Toggle (🔊 Narrar <-> ⏹ Parar)
old_speak_block = """            async function speakText(text, lang = currentLang, itemId = null) {
                if (!text) return Promise.resolve();
                // Remove qualquer resquício de meta-prompt caso venha de cache externo
                const cleanText = text.replace(/^(Narrate|Narra|Narre)[^:]*:\\s*/i, '').trim();
                const thisSpeechId = ++activeSpeechId;
                syncSpeechWithVLibras(cleanText);

                if (currentAudio) {
                    try { currentAudio.pause(); currentAudio.currentTime = 0; } catch (_) {}
                    currentAudio = null;
                }
                if ('speechSynthesis' in window) {
                    try { window.speechSynthesis.cancel(); } catch (_) {}
                }

                const playAndWait = (audioObj) => new Promise((resolve) => {
                    let settled = false;
                    const done = () => { if (!settled) { settled = true; resolve(true); } };
                    audioObj.onended = done;
                    audioObj.onerror = () => { if (!settled) { settled = true; resolve(false); } };
                    audioObj.play().catch(() => { if (!settled) { settled = true; resolve(false); } });
                });

                // 1. Tenta primeiro o MP3 estático pré-gerado (exceto se estiver na lista de regeneração dinâmica)
                const skipStaticIds = new Set(['HIPPOCAMPUS', 'NEURON_SYNAPSE']);
                if (itemId && !skipStaticIds.has(itemId)) {
                    const staticMp3Url = `assets/audio/${encodeURIComponent(lang)}/${encodeURIComponent(itemId)}.mp3`;
                    const audio = new Audio(staticMp3Url);
                    if (thisSpeechId !== activeSpeechId) return false;
                    currentAudio = audio;
                    const ok = await playAndWait(audio);
                    if (ok) return true;
                }

                // 2. Tenta a síntese dinâmica Gemini TTS (/api/gemini-tts) sem passar id contaminado
                if (thisSpeechId !== activeSpeechId) return false;
                try {
                    const safeId = skipStaticIds.has(itemId) ? '' : (itemId || '');
                    const audioUrl = `/api/gemini-tts?text=${encodeURIComponent(cleanText)}&lang=${encodeURIComponent(lang)}&id=${encodeURIComponent(safeId)}&_t=${Date.now()}`;
                    const audio = new Audio(audioUrl);
                    currentAudio = audio;
                    const ok = await playAndWait(audio);
                    if (ok) return true;
                } catch (_) {}

                // 3. Fallback para Web Speech API nativa aguardando onend
                if (thisSpeechId === activeSpeechId && 'speechSynthesis' in window) {
                    return new Promise((resolve) => {
                        try {
                            const utter = new SpeechSynthesisUtterance(cleanText);
                            utter.lang = lang;
                            utter.rate = 1.03;
                            utter.onend = () => resolve(true);
                            utter.onerror = () => resolve(false);
                            window.speechSynthesis.speak(utter);
                        } catch (_) {
                            resolve(false);
                        }
                    });
                }
                return false;
            }"""

new_speak_block = """            let isMozokNarrating = false;

            function updateNarrateButtonsState(playing) {
                isMozokNarrating = !!playing;
                const hudDict = UI_I18N[currentLang] || UI_I18N['pt-BR'];
                const bPop = document.getElementById('btn-popup-narrate');
                const bCard = document.getElementById('btn-narrate-card');
                const stopLbl = (currentLang === 'en-GB') ? '⏹ Stop' : (currentLang === 'es-ES') ? '⏹ Detener' : (currentLang === 'it-IT') ? '⏹ Ferma' : (currentLang === 'uk-UA') ? '⏹ Стоп' : '⏹ Parar';
                if (bPop) bPop.textContent = playing ? stopLbl : (hudDict.btn_narrate || '🔊 Narrar');
                if (bCard) bCard.textContent = playing ? stopLbl : (hudDict.btn_narrate_card || '🔊 Narrar Peça');
            }

            function stopCurrentNarration() {
                activeSpeechId++;
                if (currentAudio) {
                    try { currentAudio.pause(); currentAudio.currentTime = 0; } catch (_) {}
                    currentAudio = null;
                }
                if ('speechSynthesis' in window) {
                    try { window.speechSynthesis.cancel(); } catch (_) {}
                }
                updateNarrateButtonsState(false);
            }

            async function toggleNarrationPlayback() {
                const isBrowserSpeaking = ('speechSynthesis' in window) && window.speechSynthesis.speaking;
                const isAudioPlaying = !!(currentAudio && !currentAudio.paused);
                if (isMozokNarrating || isBrowserSpeaking || isAudioPlaying) {
                    stopCurrentNarration();
                    return;
                }
                return await narrateCurrentSelection();
            }

            async function speakText(text, lang = currentLang, itemId = null) {
                if (!text) return Promise.resolve();
                // Remove qualquer resquício de meta-prompt caso venha de cache externo
                const cleanText = text.replace(/^(Narrate|Narra|Narre)[^:]*:\\s*/i, '').trim();
                const thisSpeechId = ++activeSpeechId;
                syncSpeechWithVLibras(cleanText);

                if (currentAudio) {
                    try { currentAudio.pause(); currentAudio.currentTime = 0; } catch (_) {}
                    currentAudio = null;
                }
                if ('speechSynthesis' in window) {
                    try { window.speechSynthesis.cancel(); } catch (_) {}
                }
                updateNarrateButtonsState(true);

                const playAndWait = (audioObj) => new Promise((resolve) => {
                    let settled = false;
                    const done = () => { if (!settled) { settled = true; resolve(true); } };
                    audioObj.onended = done;
                    audioObj.onerror = () => { if (!settled) { settled = true; resolve(false); } };
                    audioObj.play().catch(() => { if (!settled) { settled = true; resolve(false); } });
                });

                try {
                    // 1. Tenta primeiro o MP3 estático pré-gerado (exceto se estiver na lista de regeneração dinâmica)
                    const skipStaticIds = new Set(['HIPPOCAMPUS', 'NEURON_SYNAPSE']);
                    if (itemId && !skipStaticIds.has(itemId)) {
                        const staticMp3Url = `assets/audio/${encodeURIComponent(lang)}/${encodeURIComponent(itemId)}.mp3`;
                        const audio = new Audio(staticMp3Url);
                        if (thisSpeechId !== activeSpeechId) return false;
                        currentAudio = audio;
                        const ok = await playAndWait(audio);
                        if (ok) return true;
                    }

                    // 2. Tenta a síntese dinâmica Gemini TTS (/api/gemini-tts) sem passar id contaminado
                    if (thisSpeechId !== activeSpeechId) return false;
                    try {
                        const safeId = skipStaticIds.has(itemId) ? '' : (itemId || '');
                        const audioUrl = `/api/gemini-tts?text=${encodeURIComponent(cleanText)}&lang=${encodeURIComponent(lang)}&id=${encodeURIComponent(safeId)}&_t=${Date.now()}`;
                        const audio = new Audio(audioUrl);
                        currentAudio = audio;
                        const ok = await playAndWait(audio);
                        if (ok) return true;
                    } catch (_) {}

                    // 3. Fallback para Web Speech API nativa aguardando onend
                    if (thisSpeechId === activeSpeechId && 'speechSynthesis' in window) {
                        return await new Promise((resolve) => {
                            try {
                                const utter = new SpeechSynthesisUtterance(cleanText);
                                utter.lang = lang;
                                utter.rate = 1.03;
                                utter.onend = () => resolve(true);
                                utter.onerror = () => resolve(false);
                                window.speechSynthesis.speak(utter);
                            } catch (_) {
                                resolve(false);
                            }
                        });
                    }
                    return false;
                } finally {
                    if (thisSpeechId === activeSpeechId) {
                        updateNarrateButtonsState(false);
                    }
                }
            }"""

if old_speak_block.replace("\n", "\r\n") in html:
    html = html.replace(old_speak_block.replace("\n", "\r\n"), new_speak_block.replace("\n", "\r\n"), 1)
elif old_speak_block in html:
    html = html.replace(old_speak_block, new_speak_block, 1)
else:
    raise RuntimeError("Bloco speakText nao encontrado em index.html")

html = html.replace(
    "document.getElementById('btn-popup-narrate').addEventListener('click', narrateCurrentSelection);",
    "document.getElementById('btn-popup-narrate').addEventListener('click', toggleNarrationPlayback);"
)
html = html.replace(
    "document.getElementById('btn-narrate-card').addEventListener('click', narrateCurrentSelection);",
    "document.getElementById('btn-narrate-card').addEventListener('click', toggleNarrationPlayback);"
)

# 2D. Sincronizar patologia ao entrar no Microcosmos Neuronal + Focar estrutura acometida no modo Macro + chamar neuralMicro.setPathology
old_micro_block = """                    selectNeuronSubPart(selectedNeuronPartId || 'NEURON_SOMA', false, false);
                    flyCameraTo(new THREE.Vector3(0.0, 0.5, 0.0), new THREE.Vector3(0.0, 1.5, 22.5), 0.75);"""
new_micro_block = """                    selectNeuronSubPart(selectedNeuronPartId || 'NEURON_SOMA', false, false);
                    if (typeof neuralMicro.setPathology === 'function' && typeof pathologySelect !== 'undefined' && pathologySelect) {
                        const curKey = pathologySelect.value || 'HEALTHY';
                        const curSev = curKey === 'HEALTHY' ? 0.0 : (parseFloat(pathologySeveritySlider ? pathologySeveritySlider.value : '0.75') || 0.75);
                        neuralMicro.setPathology(curKey, curSev);
                    }
                    flyCameraTo(new THREE.Vector3(0.0, 0.5, 0.0), new THREE.Vector3(0.0, 1.5, 22.5), 0.75);"""

if old_micro_block.replace("\n", "\r\n") in html:
    html = html.replace(old_micro_block.replace("\n", "\r\n"), new_micro_block.replace("\n", "\r\n"), 1)
elif old_micro_block in html:
    html = html.replace(old_micro_block, new_micro_block, 1)
else:
    raise RuntimeError("Bloco setMicrocosmosMode nao encontrado em index.html")

old_apply_pathology = """                cnsAnatomy.setPathologySimulation(diseaseKey, sev);
                neuralMicro.setPathologySimulation(diseaseKey, sev);

                const stageBadge = document.getElementById('pathology-stage-badge');
                stageBadge.textContent = profile.stage;
                stageBadge.style.color = profile.color;

                document.getElementById('pathology-sev-label').textContent = `${Math.round(sev * 100)}%`;
                document.getElementById('pathology-clinical-note').textContent = profile.note;
                const pDoi = MOZOK_PATHOLOGY_DOIS[diseaseKey] || MOZOK_PATHOLOGY_DOIS['HEALTHY'];
                const pDoiLink = document.getElementById('pathology-doi-link');
                const pDoiCit = document.getElementById('pathology-doi-citation');
                if (pDoiLink && pDoi) {
                    pDoiLink.href = `https://doi.org/${pDoi.doi}`;
                    pDoiLink.textContent = `DOI: ${pDoi.doi} ↗`;
                }
                if (pDoiCit && pDoi) {
                    pDoiCit.textContent = pDoi.citation;
                }
                document.getElementById('bm-abeta-tau').textContent = profile.abetaTau;
                document.getElementById('bm-nfl-prion').textContent = profile.nflPrion;
                document.getElementById('bm-ocb').textContent = profile.ocb;

                // Se estiver no modo Macro SNC/SNP e a doença tiver uma estrutura-alvo primária, destaca os dados clínicos sem perder o foco
                if (!isMicroMode && profile.targetStructure && ontologyMap.has(profile.targetStructure)) {
                    selectedStructureId = profile.targetStructure;
                    cnsAnatomy.selectStructure(selectedStructureId);
                    updateHUDAndPopup(ontologyMap.get(selectedStructureId));
                    document.querySelectorAll('.structure-item').forEach(el => {
                        el.classList.toggle('active', el.dataset.id === selectedStructureId);
                    });
                }"""

new_apply_pathology = """                if (typeof neuralMicro.setPathology === 'function') {
                    neuralMicro.setPathology(diseaseKey, sev);
                } else {
                    neuralMicro.setPathologySimulation(diseaseKey, sev);
                }

                const stageBadge = document.getElementById('pathology-stage-badge');
                stageBadge.textContent = profile.stage;
                stageBadge.style.color = profile.color;

                document.getElementById('pathology-sev-label').textContent = `${Math.round(sev * 100)}%`;
                document.getElementById('pathology-clinical-note').textContent = profile.note;
                const pDoi = MOZOK_PATHOLOGY_DOIS[diseaseKey] || MOZOK_PATHOLOGY_DOIS['HEALTHY'];
                const pDoiLink = document.getElementById('pathology-doi-link');
                const pDoiCit = document.getElementById('pathology-doi-citation');
                if (pDoiLink && pDoi) {
                    pDoiLink.href = `https://doi.org/${pDoi.doi}`;
                    pDoiLink.textContent = `DOI: ${pDoi.doi} ↗`;
                }
                if (pDoiCit && pDoi) {
                    pDoiCit.textContent = pDoi.citation;
                }
                document.getElementById('bm-abeta-tau').textContent = profile.abetaTau;
                document.getElementById('bm-nfl-prion').textContent = profile.nflPrion;
                document.getElementById('bm-ocb').textContent = profile.ocb;

                // No modo Macro SNC/SNP, move a câmera para a estrutura acometida e reaplica a simulação fisiopatológica 3D
                if (!isMicroMode && diseaseKey !== 'HEALTHY' && profile.targetStructure && ontologyMap.has(profile.targetStructure)) {
                    selectMacroStructure(profile.targetStructure, true, false);
                }
                cnsAnatomy.setPathologySimulation(diseaseKey, sev);"""

if old_apply_pathology.replace("\n", "\r\n") in html:
    html = html.replace(old_apply_pathology.replace("\n", "\r\n"), new_apply_pathology.replace("\n", "\r\n"), 1)
elif old_apply_pathology in html:
    html = html.replace(old_apply_pathology, new_apply_pathology, 1)
else:
    raise RuntimeError("Bloco applyPathologySelection nao encontrado em index.html")

# 2E. Substituir o boneco 2D Canvas (MozokLibrasAvatar) pelo Intérprete Oficial 3D VLibras WebGL embutido
old_avatar_start = "            // AVATAR INTÉRPRETE DE LIBRAS NATIVO EM THREE.JS / CANVAS INTEGRADO AO MOZOK"
old_avatar_end = "            // Botão \"Libras\" na barra principal do simulador aciona o Avatar Nativo"

new_avatar_code = """            // INTÉRPRETE OFICIAL 3D VLIBRAS (WebGL REAL) EMBUTIDO NO PALCO RECORTADO
            const MozokLibrasAvatar = (() => {
                let scriptLoaded = false;
                let active = false;

                function loadOfficialVLibrasScript() {
                    if (scriptLoaded || document.getElementById('mozok-vlibras-script')) {
                        scriptLoaded = true;
                        if (window.VLibras && !window.mozokVLibrasWidget) {
                            try { window.mozokVLibrasWidget = new window.VLibras.Widget('https://vlibras.gov.br/app'); } catch (_) {}
                        }
                        return;
                    }
                    const s = document.createElement('script');
                    s.id = 'mozok-vlibras-script';
                    s.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
                    s.async = true;
                    s.onload = () => {
                        scriptLoaded = true;
                        try {
                            if (window.VLibras && !window.mozokVLibrasWidget) {
                                window.mozokVLibrasWidget = new window.VLibras.Widget('https://vlibras.gov.br/app');
                            }
                            setTimeout(() => {
                                const btn = document.querySelector('#mozok-vlibras-3d-stage [vw-access-button]');
                                const wrap = document.querySelector('#mozok-vlibras-3d-stage [vw-plugin-wrapper]');
                                if (btn && wrap && !wrap.classList.contains('active')) btn.click();
                            }, 500);
                        } catch (_) {}
                    };
                    document.body.appendChild(s);
                }

                return {
                    show() {
                        active = true;
                        vlibrasActive = true;
                        document.body.classList.add('vlibras-dock-open');
                        document.getElementById('mozok-vlibras-3d-stage')?.classList.add('active');
                        document.getElementById('btn-doom3-libras')?.classList.add('active');
                        document.getElementById('btn-vlibras')?.classList.add('active');
                        loadOfficialVLibrasScript();
                        setTimeout(() => {
                            const btn = document.querySelector('#mozok-vlibras-3d-stage [vw-access-button]');
                            const wrap = document.querySelector('#mozok-vlibras-3d-stage [vw-plugin-wrapper]');
                            if (btn && wrap && !wrap.classList.contains('active')) btn.click();
                        }, 300);
                    },
                    hide() {
                        active = false;
                        vlibrasActive = false;
                        document.body.classList.remove('vlibras-dock-open');
                        document.getElementById('mozok-vlibras-3d-stage')?.classList.remove('active');
                        document.getElementById('btn-doom3-libras')?.classList.remove('active');
                        document.getElementById('btn-vlibras')?.classList.remove('active');
                    },
                    toggle() {
                        if (active) this.hide();
                        else this.show();
                    },
                    speak(text) {
                        if (!active || !text) return;
                        try {
                            if (window.plugin && typeof window.plugin.translate === 'function') {
                                window.plugin.translate(text);
                            } else if (window.VLibras && typeof window.VLibras.translate === 'function') {
                                window.VLibras.translate(text);
                            } else if (window.mozokVLibrasWidget && typeof window.mozokVLibrasWidget.translate === 'function') {
                                window.mozokVLibrasWidget.translate(text);
                            }
                        } catch (_) {}
                    },
                    stopSpeaking() {}
                };
            })();

"""

a_idx = html.find(old_avatar_start)
b_idx = html.find(old_avatar_end)
if a_idx == -1 or b_idx == -1:
    raise RuntimeError("Bloco MozokLibrasAvatar nao encontrado em index.html")
html = html[:a_idx] + new_avatar_code + html[b_idx:]

# Remover listener antigo duplicado de #btn-vlibras antes da clonagem para deixar um único listener limpo
old_vl_listener = """            if (btnVlibras) {
                btnVlibras.addEventListener('click', () => {
                    const dock = document.getElementById('mozok-vlibras-dock');
                    vlibrasActive = !vlibrasActive;
                    btnVlibras.classList.toggle('active', vlibrasActive);
                    document.body.classList.toggle('vlibras-dock-open', vlibrasActive);
                    if (dock) dock.classList.toggle('active', vlibrasActive);
                    if (vlibrasActive) ensureVLibrasWidgetLoaded();
                });
            }"""
html = html.replace(old_vl_listener.replace("\n", "\r\n"), "", 1).replace(old_vl_listener, "", 1)

# Também fazer syncSpeechWithVLibras delegar para MozokLibrasAvatar.speak(text) quando ativo em pt-BR
old_sync_fn = "                        if (window.plugin && typeof window.plugin.translate === 'function') {"
new_sync_fn = """                        if (typeof MozokLibrasAvatar !== 'undefined' && typeof MozokLibrasAvatar.speak === 'function') {
                            MozokLibrasAvatar.speak(text);
                        }
                        if (window.plugin && typeof window.plugin.translate === 'function') {"""
if old_sync_fn in html:
    html = html.replace(old_sync_fn, new_sync_fn, 1)

html_path.write_text(html, encoding="utf-8")
print("[OK] v1.0010 aplicada: VERSION, Cargo.toml, VLibras 3D WebGL oficial, Toggle Narrar e Patologias Macro/Micro sincronizadas.")
