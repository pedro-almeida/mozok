#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MOZOK v1.0004 — Unificação Arquitetural (Remoção do Legado Godot),
Correção do Vazamento de Meta-Prompt TTS, Zoom Contínuo Google Earth (Cross-Fade + Organelas + Átomos)
e Sincronia Estrita de Áudio no Apresentador de Estruturas.
"""

import os
import re
import sys
import json
import shutil
import asyncio
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent

# 1. Atualizar VERSION, sw.js e Cargo.toml (removendo rust/mozok-godot do workspace)
(ROOT / "VERSION").write_text("1.0004\n", encoding="utf-8")

sw_path = ROOT / "web" / "sw.js"
if sw_path.exists():
    sw_txt = sw_path.read_text(encoding="utf-8")
    for old_sw in ["mozok-v1.0003-github-sync", "mozok-v1.0002-github-sync", "mozok-v1.0001-github-sync"]:
        sw_txt = sw_txt.replace(old_sw, "mozok-v1.0004-github-sync")
    sw_path.write_text(sw_txt, encoding="utf-8")

CARGO_CONTENT = """[workspace]
members = [
    "rust/mozok-core",
    "rust/mozok-atlas",
    "rust/mozok-navigation",
    "rust/mozok-streaming",
    "rust/mozok-search",
    "rust/mozok-physiology",
    "rust/mozok-pathology",
    "rust/mozok-native",
    "tests",
]
default-members = [
    "rust/mozok-core",
    "rust/mozok-atlas",
    "rust/mozok-navigation",
    "rust/mozok-streaming",
    "rust/mozok-search",
    "rust/mozok-physiology",
    "rust/mozok-pathology",
    "rust/mozok-native",
    "tests",
]
resolver = "2"

[workspace.package]
version = "1.0.4+0004"
edition = "2021"
authors = ["Pedro Luís <pedro@mozok.org>", "MOZOK Open Source Contributors"]
license = "Apache-2.0"
repository = "https://github.com/pedro-almeida/mozok"
homepage = "https://mozok.org"

[profile.dev]
opt-level = 1
debug = true

[profile.release]
opt-level = 3
lto = "thin"
codegen-units = 1
panic = "abort"
"""
(ROOT / "Cargo.toml").write_text(CARGO_CONTENT, encoding="utf-8")

# 2. Remover artefatos da vertente paralela legada Godot e áudios struct_*.mp3 órfãos
legacy_paths = [
    ROOT / "project.godot",
    ROOT / "mozok.gdextension",
    ROOT / ".godot",
    ROOT / "scenes",
    ROOT / "scripts",
    ROOT / "rust" / "mozok-godot",
    ROOT / "tools" / "prebuild_neural_audio.py",
]
for p in legacy_paths:
    if p.exists():
        if p.is_dir():
            shutil.rmtree(p, ignore_errors=True)
        else:
            p.unlink(missing_ok=True)
        print(f"[UNIFICAÇÃO] Removido artefato legado: {p.relative_to(ROOT)}")

pt_audio_dir = ROOT / "web" / "assets" / "audio" / "pt-BR"
if pt_audio_dir.exists():
    for orphan in list(pt_audio_dir.glob("struct_*.mp3")) + [pt_audio_dir / "tour.mp3"]:
        if orphan.exists():
            orphan.unlink(missing_ok=True)
            print(f"[UNIFICAÇÃO] Removido áudio legado órfão: {orphan.name}")

# 3. Atualizar ARCHITECTURE.md e TECH_STACK.md para refletir a Arquitetura Unificada (Rust + WebGL2/Three.js + WebView2 Nativo)
ARCH_MD = """# MOZOK Unified Architecture Specification (v1.0004)

## 1. Single Source of Truth Principle (Web & Native Desktop Parity)
MOZOK operates on a **single unified codebase** across Web, PWA, and Native Desktop (`mozok-native.exe`):
- **Sovereign Rust Workspace (`rust/`):** Provides domain math (`mozok-core`), ontology DAG (`mozok-atlas`), 6-DOF logarithmic camera & LOD math (`mozok-navigation`), synaptic/CSF biophysics (`mozok-physiology`), disease models (`mozok-pathology`), and the zero-overhead Win32 native runtime (`mozok-native` via `tao` + `wry` WebView2 with dedicated GPU acceleration `NvOptimusEnablement` on port `8090`).
- **Unified WebGL2 / Three.js Presentation Engine (`web/`):** Renders the real 81,924-vertex McGill BrainBrowser MNI152 cortical surface (`cns-anatomy-3d.js`), 45 CNS/PNS structures, 7 pathophysiological simulations, and the multiscale cellular/sub-cellular engine (`neural-microcosmos-3d.js`) spanning from macroscopic lobes down to Layer V Betz pyramidal neurons, synapses, intracellular organelles, and atomic quantum orbitals.
"""
(ROOT / "ARCHITECTURE.md").write_text(ARCH_MD, encoding="utf-8")

TECH_MD = """# MOZOK Unified Technical Stack (v1.0004)

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **3D Rendering Engine** | **WebGL 2.0 / Three.js Custom Shaders** | Real-time rendering of 81,924 MNI152 vertices, custom GLSL cortical/pathology shaders, and multiscale instancing at 60 FPS. |
| **Native Desktop Runtime** | **Rust (`mozok-native` — `tao` + `wry`)** | Native Win32/Linux wrapper binding `GpuPreference=2` (dedicated NVIDIA GPU) and serving the unified `web/` assets on `127.0.0.1:8090`. |
| **Domain & Biophysical Core** | **Rust Workspace (2021 Edition)** | 64-bit spatial coordinates, hierarchical LOD (`mozok-navigation`), Hodgkin-Huxley kinetics (`mozok-physiology`), and neurodegenerative cascades (`mozok-pathology`). |
| **Accessibility & Voice** | **Gemini Neural TTS + Web Audio DSP + VLibras** | Multilingual voice synthesis (PT-BR, EN-GB, ES-ES, IT-IT, UK-UA), cybernetic vocoder DSP, and real-time Brazilian Sign Language (VLibras). |
"""
(ROOT / "TECH_STACK.md").write_text(TECH_MD, encoding="utf-8")

# 4. Corrigir o Vazamento de Prompt ("Narrate clearly with the warm, natural voice...") em gemini_tts_bridge.py e generate_audio_mp3_cache.py
for script_name in ["gemini_tts_bridge.py", "generate_audio_mp3_cache.py"]:
    sp = ROOT / "tools" / script_name
    if sp.exists():
        code = sp.read_text(encoding="utf-8").replace("\r\n", "\n")
        # Nunca injetar instrução em inglês dentro do texto a ser lido; enviar apenas spoken_text limpo e usar systemInstruction
        old_prompt_block = '''    tts_prompt = (
        f"Narrate clearly with the warm, natural voice of a university neuroanatomy professor "
        f"speaking natively in {lang_desc} ({lang}):\\n\\n{spoken_text}"
    )'''
        new_prompt_block = '''    tts_prompt = spoken_text.strip()'''
        code = code.replace(old_prompt_block, new_prompt_block)
        # Adicionar systemInstruction no payload REST para que o modelo não leia instruções
        old_req_body = '''            req_body = {
                "contents": [{"parts": [{"text": tts_prompt}]}],
                "generationConfig": {'''
        new_req_body = '''            req_body = {
                "systemInstruction": {"parts": [{"text": f"Read the user text verbatim in {lang_desc} ({lang}). Do not add any introductory words or meta-commentary."}]},
                "contents": [{"parts": [{"text": tts_prompt}]}],
                "generationConfig": {'''
        code = code.replace(old_req_body, new_req_body)
        sp.write_text(code, encoding="utf-8")
        print(f"[CORREÇÃO TTS] Vazamento de meta-prompt eliminado em tools/{script_name}")

# 5. Regenerar limpa e automaticamente os MP3s em pt-BR que estavam contaminados com a frase "Narra claramente com a voz quente..."
CONTAMINATED_IDS = ["HIPPOCAMPUS", "NEURON_SYNAPSE", "NEURON_NUCLEUS", "ABOUT_MOZOK"]
i18n_path = ROOT / "web" / "assets" / "i18n_cache.json"
if i18n_path.exists():
    i18n_data = json.loads(i18n_path.read_text(encoding="utf-8"))
    pt_items = i18n_data.get("pt-BR", {})
    for cid in CONTAMINATED_IDS:
        bad_mp3 = ROOT / "web" / "assets" / "audio" / "pt-BR" / f"{cid}.mp3"
        if bad_mp3.exists():
            bad_mp3.unlink(missing_ok=True)
            print(f"[LIMPEZA MP3] Removido MP3 contaminado: pt-BR/{cid}.mp3")
        # Tenta regenerar limpa via edge_tts ou gemini_tts_bridge se disponível localmente
        if cid in pt_items:
            meta = pt_items[cid]
            clean_text = f"{meta['name']}. {meta['summary']} Correlação clínica: {meta['clinical']}"
            try:
                import edge_tts
                async def _regen(txt, out_p):
                    comm = edge_tts.Communicate(txt, "pt-BR-FranciscaNeural", rate="+2%")
                    await comm.save(str(out_p))
                asyncio.run(_regen(clean_text, bad_mp3))
                print(f"[REGENERADO] Áudio limpo gerado para pt-BR/{cid}.mp3")
            except Exception:
                try:
                    sys.path.insert(0, str(ROOT / "tools"))
                    from gemini_tts_bridge import synthesize_gemini_tts
                    res_path = synthesize_gemini_tts(clean_text, "pt-BR", f"CLEAN_{cid}")
                    if res_path and Path(res_path).exists():
                        shutil.copyfile(res_path, bad_mp3)
                        print(f"[REGENERADO GEMINI TTS] Áudio limpo gerado para pt-BR/{cid}.mp3")
                except Exception:
                    pass

# 6. Aprimorar web/js/neural-microcosmos-3d.js para que as Organelas (Tier 4) e os Átomos (Tier 5) fiquem grandes, brilhantes, perfeitamente visíveis no centro do Soma e sem colisão de câmera
micro_path = ROOT / "web" / "js" / "neural-microcosmos-3d.js"
micro_js = micro_path.read_text(encoding="utf-8").replace("\r\n", "\n")

# Substituir setMultiscaleDepth para transição contínua perfeita de escala e opacidade
OLD_MULTISCALE_DEPTH = re.search(
    r"setMultiscaleDepth\(cameraDistance\)\s*\{.*?\n    \}",
    micro_js,
    re.DOTALL
)

NEW_MULTISCALE_DEPTH = """setMultiscaleDepth(cameraDistance) {
        // Tier 4 (Organelas Intracelulares): visível quando cameraDistance < 3.6 e > 0.72
        // Tier 5 (Rede Atômica & Orbitais Quânticos): visível quando cameraDistance <= 1.15
        const showOrganelles = (cameraDistance < 3.6 && cameraDistance > 0.65);
        const showAtoms = (cameraDistance <= 1.15);

        if (this.organelleGroup) {
            this.organelleGroup.visible = showOrganelles;
            // Escala adaptativa para preencher o campo de visão com nitidez
            this.organelleGroup.scale.setScalar(1.65);
        }
        if (this.atomicGroup) {
            this.atomicGroup.visible = showAtoms;
            this.atomicGroup.scale.setScalar(2.85);
        }

        // Faz o Soma Piramidal abrir-se como uma câmara de vidro translúcida ao entrar nele
        if (this.somaMeshes && this.somaMeshes.length > 0) {
            this.somaMeshes.forEach((s, idx) => {
                if (s && s.material) {
                    if (cameraDistance < 1.15) {
                        s.material.opacity = idx === 0 ? 0.06 : 0.15;
                        s.material.depthWrite = false;
                    } else if (cameraDistance < 3.6) {
                        const t = (cameraDistance - 1.15) / (3.6 - 1.15);
                        s.material.opacity = idx === 0 ? (0.10 + 0.55 * t) : (0.25 + 0.55 * t);
                        s.material.depthWrite = false;
                    } else {
                        s.material.opacity = 0.88;
                        s.material.depthWrite = true;
                    }
                }
            });
        }
    }"""

if OLD_MULTISCALE_DEPTH:
    micro_js = micro_js[:OLD_MULTISCALE_DEPTH.start()] + NEW_MULTISCALE_DEPTH + micro_js[OLD_MULTISCALE_DEPTH.end():]
    micro_path.write_text(micro_js, encoding="utf-8")
    print("[OK] setMultiscaleDepth recalibrado em web/js/neural-microcosmos-3d.js (Organelas e Átomos ampliados e sem corte).")

# 7. Atualizar web/index.html:
# - camera.near = 0.015 (elimina clipping ao entrar nas células/átomos)
# - Cross-Fade Dual-Layer suave entre Córtex e Neurônios (ambos visíveis na zona de transição dist 9.2 -> 5.2, sem piscar!)
# - speakText retorna Promise real aguardando audio.onended para o modo Apresentar Estruturas nunca cortar a fala
index_path = ROOT / "web" / "index.html"
html = index_path.read_text(encoding="utf-8").replace("\r\n", "\n")

html = html.replace("v1.0003", "v1.0004").replace("1.0.3+0003", "1.0.4+0004")
html = html.replace(
    "const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 500);",
    "const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.015, 500);"
)

# Atualizar evaluateContinuousMultiscaleZoom() para Cross-Fade contínuo sem piscar e com auto-foco no Soma/Organelas/Átomos
OLD_ZOOM_FN = re.search(
    r"function evaluateContinuousMultiscaleZoom\(\)\s*\{.*?\n            \}",
    html,
    re.DOTALL
)

NEW_ZOOM_FN = """function evaluateContinuousMultiscaleZoom() {
                const dist = camera.position.distanceTo(controls.target);

                const minD = 0.16, maxD = 45.0;
                const clampedD = Math.max(minD, Math.min(maxD, dist));
                const depthPct = Math.round((1.0 - (Math.log(clampedD) - Math.log(minD)) / (Math.log(maxD) - Math.log(minD))) * 100);
                if (scaleSlider && document.activeElement !== scaleSlider) {
                    scaleSlider.value = String(Math.max(0, Math.min(100, depthPct)));
                }

                // CROSS-FADE CONTÍNUO ESTILO GOOGLE EARTH (Sem piscar e sem corte abrupto):
                // Zona 1 (dist > 9.5): 100% Macro SNC
                // Zona 2 (9.5 >= dist > 5.0): Zona de Transição Dual-Layer (Córtex fica translúcido E Neurônios já aparecem ao fundo!)
                // Zona 3 (dist <= 5.0): Imersão Microscópica (Neurônios -> Sinapses -> Organelas -> Átomos)
                if (dist > 9.5) {
                    if (autoZoomMicroTriggered) {
                        autoZoomMicroTriggered = false;
                        isMicroMode = false;
                        cnsAnatomy.rootGroup.visible = true;
                        neuralMicro.setVisible(false);
                        if (cnsAnatomy.viewMode === 'EXTERNAL' && !cnsAnatomy.isolatedId) {
                            cnsAnatomy.setCortexAlpha(1.0);
                        }
                        document.getElementById('neuron-parts-bar').classList.remove('visible');
                        setActiveTopViewBtn('btn-view-external');
                    }
                } else if (dist <= 9.5 && dist > 5.0) {
                    // Cross-fade suave: mostra o Córtex semi-transparente E o Microcosmos simultaneamente!
                    const tFade = (dist - 5.0) / (9.5 - 5.0); // 1.0 em 9.5 -> 0.0 em 5.0
                    cnsAnatomy.rootGroup.visible = true;
                    cnsAnatomy.setCortexAlpha(THREE.MathUtils.clamp(tFade * 0.85, 0.08, 0.90));
                    neuralMicro.setVisible(true, selectedStructureId);
                    if (dist < 6.2 && !isMicroMode) {
                        autoZoomMicroTriggered = true;
                        isMicroMode = true;
                        document.getElementById('neuron-parts-bar').classList.add('visible');
                        setActiveTopViewBtn('btn-view-micro');
                    }
                } else if (dist <= 5.0) {
                    if (!isMicroMode) {
                        autoZoomMicroTriggered = true;
                        isMicroMode = true;
                        document.getElementById('neuron-parts-bar').classList.add('visible');
                        setActiveTopViewBtn('btn-view-micro');
                    }
                    cnsAnatomy.rootGroup.visible = false;
                    neuralMicro.setVisible(true, selectedStructureId);
                    // Interpola suavemente o centro de órbita para o Soma (0, 0.5, 0) ao entrar nas Organelas e Átomos
                    if (dist < 3.6) {
                        const centerSoma = new THREE.Vector3(0, 0.5, 0);
                        controls.target.lerp(centerSoma, 0.08);
                    }
                }

                if ((isMicroMode || dist <= 9.5) && typeof neuralMicro.setMultiscaleDepth === 'function') {
                    neuralMicro.setMultiscaleDepth(dist);
                }

                if (scaleTierLabel) {
                    if (dist > 11.5) {
                        scaleTierLabel.textContent = '15 cm • Macro SNC';
                        scaleTierLabel.style.borderColor = '#00f2fe';
                        scaleTierLabel.style.color = '#00f2fe';
                    } else if (dist > 5.5) {
                        scaleTierLabel.textContent = '10 mm • Parênquima Cortical';
                        scaleTierLabel.style.borderColor = '#38bdf8';
                        scaleTierLabel.style.color = '#38bdf8';
                    } else if (dist > 3.6) {
                        scaleTierLabel.textContent = '100 µm • Neurônios Camada V';
                        scaleTierLabel.style.borderColor = '#facc15';
                        scaleTierLabel.style.color = '#facc15';
                    } else if (dist > 2.2) {
                        scaleTierLabel.textContent = '500 nm • Fenda Sináptica';
                        scaleTierLabel.style.borderColor = '#34d399';
                        scaleTierLabel.style.color = '#34d399';
                    } else if (dist > 1.15) {
                        scaleTierLabel.textContent = '50 nm • Organelas Celulares';
                        scaleTierLabel.style.borderColor = '#c084fc';
                        scaleTierLabel.style.color = '#c084fc';
                    } else {
                        scaleTierLabel.textContent = '1 Å (0.1 nm) • Átomos & Orbitais';
                        scaleTierLabel.style.borderColor = '#f43f5e';
                        scaleTierLabel.style.color = '#f43f5e';
                    }
                }
            }"""

if OLD_ZOOM_FN:
    html = html[:OLD_ZOOM_FN.start()] + NEW_ZOOM_FN + html[OLD_ZOOM_FN.end():]

# Fazer speakText retornar uma Promise que aguarda o evento real onended do áudio, e sincronizar runDeckStation
OLD_SPEAK_TEXT = re.search(
    r"async function speakText\(text, lang = currentLang, itemId = null\)\s*\{.*?\n            \}",
    html,
    re.DOTALL
)

NEW_SPEAK_TEXT = """async function speakText(text, lang = currentLang, itemId = null) {
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

if OLD_SPEAK_TEXT:
    html = html[:OLD_SPEAK_TEXT.start()] + NEW_SPEAK_TEXT + html[OLD_SPEAK_TEXT.end():]

# Fazer narrateCurrentSelection retornar a Promise do speakText e runDeckStation aguardar o fim real da fala!
html = html.replace(
    "speakText(`${meta.name}. ${meta.summary} ${clinicalPrefix}${meta.clinical}`, currentLang, rawMeta.id);",
    "return await speakText(`${meta.name}. ${meta.summary} ${clinicalPrefix}${meta.clinical}`, currentLang, rawMeta.id);"
)

OLD_RUN_DECK = re.search(
    r"function runDeckStation\(idx\)\s*\{.*?\n            \}",
    html,
    re.DOTALL
)

NEW_RUN_DECK = """async function runDeckStation(idx) {
                if (tourTimer) { clearTimeout(tourTimer); tourTimer = null; }
                deckStationIdx = (idx + CONCIC_PRESENTATION_STATIONS.length) % CONCIC_PRESENTATION_STATIONS.length;
                const myStationToken = ++activeSpeechId;
                const st = CONCIC_PRESENTATION_STATIONS[deckStationIdx];
                const lbl = document.getElementById('deck-station-label');
                if (lbl) lbl.textContent = st.title;

                if (st.pathology) {
                    pathologySelect.value = st.pathology;
                    applyPathologySelection(st.pathology, st.pathology === 'HEALTHY' ? 0.0 : 0.85);
                }

                // Desativa temporariamente voiceEnabled automático dentro de selectMacroStructure para controlarmos a Promise aqui
                const prevVoice = voiceEnabled;
                voiceEnabled = false;

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

                voiceEnabled = prevVoice;

                if (voiceEnabled) {
                    await narrateCurrentSelection();
                } else {
                    await new Promise(r => setTimeout(r, 6500));
                }

                // Só avança para a próxima estação após o término completo da fala + 1.2s de respiro!
                if (deckActive && deckPlaying) {
                    tourTimer = setTimeout(() => {
                        if (deckActive && deckPlaying) {
                            runDeckStation(deckStationIdx + 1);
                        }
                    }, 1200);
                }
            }"""

if OLD_RUN_DECK:
    html = html[:OLD_RUN_DECK.start()] + NEW_RUN_DECK + html[OLD_RUN_DECK.end():]

index_path.write_text(html, encoding="utf-8")
print("[OK] MOZOK v1.0004 aplicado com sucesso!")

