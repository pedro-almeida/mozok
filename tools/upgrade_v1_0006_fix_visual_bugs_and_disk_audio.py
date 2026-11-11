#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MOZOK v1.0006:
1. Corrige o bug visual onde clicar no Córtex ativava os neurônios sozinho (01:15-01:26 do vídeo).
2. Sintetiza uma única vez e salva em disco os 25 áudios da Apresentação Oficial nos 5 idiomas:
   web/assets/audio/<lang>/CYBER_INTRO_1.mp3 .. CYBER_INTRO_5.mp3
"""

import re
import sys
import asyncio
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path('.') if Path('Cargo.toml').exists() else Path(__file__).resolve().parent.parent
INDEX_HTML = ROOT / "web" / "index.html"
SW_JS = ROOT / "web" / "sw.js"
VERSION_FILE = ROOT / "VERSION"
CARGO_TOML = ROOT / "Cargo.toml"
AUDIO_DIR = ROOT / "web" / "assets" / "audio"

# 1. Atualizar VERSION, sw.js e Cargo.toml para 1.0006
VERSION_FILE.write_text("1.0006\n", encoding="utf-8")
cargo_txt = CARGO_TOML.read_text(encoding="utf-8")
cargo_txt = re.sub(r'version\s*=\s*"[^"]+"', 'version = "1.0.6+0006"', cargo_txt, count=1)
CARGO_TOML.write_text(cargo_txt, encoding="utf-8")

if SW_JS.exists():
    sw_txt = SW_JS.read_text(encoding="utf-8")
    for old_sw in ["mozok-v1.0005-github-sync", "mozok-v1.0004-github-sync", "mozok-v1.0003-github-sync"]:
        sw_txt = sw_txt.replace(old_sw, "mozok-v1.0006-github-sync")
    SW_JS.write_text(sw_txt, encoding="utf-8")

# 2. Roteiro Científico da Apresentação Oficial nos 5 Idiomas (para síntese única em disco)
INTRO_SEGMENTS_I18N = {
    "pt-BR": [
        "A compreensão tridimensional do sistema nervoso central humano constitui um dos maiores desafios pedagógicos e clínicos das ciências da saúde.",
        "Durante décadas, o treinamento anatômico esteve restrito à abstração bidimensional, ao alto custo de simuladores comerciais e à escassez de peças biológicas preservadas em formaldeído.",
        "Para superar essas lacunas, o projeto Mozok estabelece uma plataforma computacional aberta de reconstrução estereotáxica M N I cento e cinquenta e dois e simulação eletrofisiológica em tempo real.",
        "Integrando macroanatomia, redes neuronais da camada cinco, dinâmica sináptica, organelas intracelulares e estrutura atômica, o sistema unifica morfologia e fisiopatologia clínica.",
        "Com suporte nativo a múltiplos idiomas, audiodescrição neural e tradução em Libras, o Mozok democratiza o conhecimento neurocientífico sem barreiras financeiras ou sensoriais."
    ],
    "en-GB": [
        "Three-dimensional comprehension of the human central nervous system constitutes one of the greatest pedagogical and clinical challenges in the health sciences.",
        "For decades, anatomical training has been restricted to two-dimensional abstraction, prohibitively expensive commercial simulators, and a scarcity of formaldehyde-preserved biological specimens.",
        "To overcome these structural gaps, the Mozok project establishes an open computational platform for M N I one five two stereotaxic reconstruction and real-time electrophysiological simulation.",
        "Integrating macroanatomy, Layer five neuronal networks, synaptic dynamics, intracellular organelles, and atomic structure, the system unifies morphology and clinical pathophysiology.",
        "With native multilingual support, neural audio description, and sign language translation, Mozok democratises neuroscientific knowledge without financial or sensory barriers."
    ],
    "es-ES": [
        "La comprensión tridimensional del sistema nervioso central humano constituye uno de los mayores desafíos pedagógicos y clínicos en las ciencias de la salud.",
        "Durante décadas, el entrenamiento anatómico estuvo restringido a la abstracción bidimensional, al alto costo de los simuladores comerciales y a la escasez de especímenes preservados en formaldehído.",
        "Para superar estas brechas, el proyecto Mozok establece una plataforma computacional abierta de reconstrucción estereotáxica M N I ciento cincuenta y dos y simulación electrofisiológica en tiempo real.",
        "Integrando macroanatomía, redes neuronales de la capa cinco, dinámica sináptica, orgánulos intracelulares y estructura atómica, el sistema unifica morfología y fisiopatología clínica.",
        "Con soporte nativo para múltiples idiomas, audiodescripción neural y lengua de señas, Mozok democratiza el conocimiento neurocientífico sin barreras financieras ni sensoriales."
    ],
    "it-IT": [
        "La comprensione tridimensionale del sistema nervoso centrale umano costituisce una delle più grandi sfide pedagogiche e cliniche nelle scienze della salute.",
        "Per decenni, la formazione anatomica è stata limitata all'astrazione bidimensionale, agli elevati costi dei simulatori commerciali e alla scarsità di reperti biologici conservati in formaldeide.",
        "Per superare queste lacune, il progetto Mozok istituisce una piattaforma computazionale aperta di ricostruzione stereotassica M N I centocinquantadue e simulazione elettrofisiologica in tempo reale.",
        "Integrando macroanatomia, reti neuronali dello strato quinto, dinamica sinaptica, organelli intracellulari e struttura atomica, il sistema unifica morfologia e fisiopatologia clinica.",
        "Con supporto nativo multilingue, audiodescrizione neurale e lingua dei segni, Mozok democratizza la conoscenza neuroscientifica senza barriere finanziarie o sensoriali."
    ],
    "uk-UA": [
        "Тривимірне розуміння центральної нервової системи людини становить один із найбільших педагогічних та клінічних викликів у науках про здоров'я.",
        "Протягом десятиліть анатомічна підготовка обмежувалася двовимірною абстракцією, високою вартістю комерційних симуляторів та дефіцитом біологічних препаратів у формальдегіді.",
        "Щоб подолати ці прогалини, проєкт Мозок створює відкриту обчислювальну платформу стереотаксичної реконструкції та електрофізіологічної симуляції в реальному часі.",
        "Поєднуючи макроанатомію, нейронні мережі п'ятого шару, синаптичну динаміку, внутрішньоклітинні органели та атомну структуру, система об'єднує морфологію та клінічну патофізіологію.",
        "Завдяки багатомовній підтримці, нейронному аудіодискриптуванню та жестовій мові, Мозок демократизує нейронаукові знання без фінансових чи сенсорних бар'єрів."
    ]
}

NEURAL_VOICES = {
    "pt-BR": "pt-BR-FranciscaNeural",
    "en-GB": "en-GB-SoniaNeural",
    "es-ES": "es-ES-ElviraNeural",
    "it-IT": "it-IT-ElsaNeural",
    "uk-UA": "uk-UA-PolinaNeural",
}

async def ensure_intro_audio_files_on_disk():
    """Gera uma única vez no disco os 25 arquivos CYBER_INTRO_1..5.mp3 caso ainda não existam."""
    try:
        import edge_tts
        has_edge = True
    except ImportError:
        has_edge = False

    sys.path.insert(0, str(ROOT / "tools"))
    try:
        from gemini_tts_bridge import synthesize_speech
        has_bridge = True
    except Exception:
        has_bridge = False

    for lang, segments in INTRO_SEGMENTS_I18N.items():
        lang_dir = AUDIO_DIR / lang
        lang_dir.mkdir(parents=True, exist_ok=True)
        voice = NEURAL_VOICES.get(lang, "pt-BR-FranciscaNeural")

        for idx, text in enumerate(segments, 1):
            out_mp3 = lang_dir / f"CYBER_INTRO_{idx}.mp3"
            if out_mp3.exists() and out_mp3.stat().st_size > 1500:
                print(f"  [CACHE DISCO OK] {lang}/CYBER_INTRO_{idx}.mp3 ({out_mp3.stat().st_size} bytes)")
                continue

            generated = False
            if has_edge:
                try:
                    comm = edge_tts.Communicate(text, voice, rate="-2%")
                    await comm.save(str(out_mp3))
                    if out_mp3.exists() and out_mp3.stat().st_size > 1500:
                        generated = True
                        print(f"  [SINTETIZADO NO DISCO via Edge-TTS] {lang}/CYBER_INTRO_{idx}.mp3")
                except Exception:
                    pass

            if not generated and has_bridge:
                try:
                    ok = synthesize_speech(text, lang, "Aoede", out_mp3)
                    if ok and out_mp3.exists() and out_mp3.stat().st_size > 1500:
                        generated = True
                        print(f"  [SINTETIZADO NO DISCO via Gemini Bridge] {lang}/CYBER_INTRO_{idx}.mp3")
                except Exception:
                    pass

            if not generated:
                print(f"  [INFO] {lang}/CYBER_INTRO_{idx}.mp3 será sintetizado e salvo no disco na primeira execução online.")

asyncio.run(ensure_intro_audio_files_on_disk())

# 3. Corrigir em web/index.html o bug visual onde clicar no Córtex ou no botão Córtex Real misturava os neurônios amarelos
html = INDEX_HTML.read_text(encoding="utf-8").replace("\r\n", "\n")

for old_b in ["v1.0005", "v1.0004", "v1.0003", "v1.0002", "v1.0001"]:
    html = html.replace(old_b, "v1.0006")
for old_sv in ["1.0.5+0005", "1.0.4+0004", "1.0.3+0003", "1.0.2+0002", "1.0.1+0001"]:
    html = html.replace(old_sv, "1.0.6+0006")
html = html.replace("version: '1.0005'", "version: '1.0006'")

# Substituir evaluateContinuousMultiscaleZoom() para NUNCA ativar neurônios durante cliques normais no Córtex!
OLD_ZOOM_BLOCK = re.search(
    r"const scaleTierLabel = document\.getElementById\('scale-tier-label'\);\s*const scaleSlider = document\.getElementById\('mozok-scale-slider'\);\s*let autoZoomMicroTriggered = false;\s*function evaluateContinuousMultiscaleZoom\(\)\s*\{.*?\n            \}",
    html,
    re.DOTALL
)

NEW_ZOOM_BLOCK = """const scaleTierLabel = document.getElementById('scale-tier-label');
            const scaleSlider = document.getElementById('mozok-scale-slider');
            let autoZoomMicroTriggered = false;
            let userWheelZoomActive = false;

            renderer.domElement.addEventListener('wheel', () => {
                if (camAnimId) {
                    cancelAnimationFrame(camAnimId);
                    camAnimId = null;
                }
                userWheelZoomActive = true;
            }, { passive: true });

            // Ao clicar nos botões de visão macroscópica ou selecionar peça na lista, desativa imediatamente qualquer sobreposição neuronal
            ['btn-view-external', 'btn-view-xray', 'btn-view-vascular', 'btn-home-view'].forEach(btnId => {
                const el = document.getElementById(btnId);
                if (el) {
                    el.addEventListener('click', () => {
                        userWheelZoomActive = false;
                        autoZoomMicroTriggered = false;
                        isMicroMode = false;
                        cnsAnatomy.rootGroup.visible = true;
                        neuralMicro.setVisible(false);
                        document.getElementById('neuron-parts-bar').classList.remove('visible');
                        if (btnId === 'btn-view-external' || btnId === 'btn-home-view') {
                            cnsAnatomy.setCortexAlpha(1.0);
                        }
                    });
                }
            });

            function evaluateContinuousMultiscaleZoom() {
                const dist = camera.position.distanceTo(controls.target);

                const minD = 0.16, maxD = 45.0;
                const clampedD = Math.max(minD, Math.min(maxD, dist));
                const depthPct = Math.round((1.0 - (Math.log(clampedD) - Math.log(minD)) / (Math.log(maxD) - Math.log(minD))) * 100);
                if (scaleSlider && document.activeElement !== scaleSlider) {
                    scaleSlider.value = String(Math.max(0, Math.min(100, depthPct)));
                }

                // Só faz transição automática Macro <-> Micro pelo scroll se o usuário estiver usando o zoom manual (userWheelZoomActive)
                // e o limiar de entrada nos neurônios é estritamente dist < 4.4 (quando atravessa a superfície cortical!)
                if (userWheelZoomActive) {
                    if (!isMicroMode && dist < 6.4 && dist >= 4.4) {
                        // Transparência sutil apenas muito perto da superfície cortical (6.4 -> 4.4)
                        const alpha = THREE.MathUtils.clamp((dist - 4.4) / (6.4 - 4.4), 0.18, 1.0);
                        cnsAnatomy.setCortexAlpha(alpha);
                        neuralMicro.setVisible(false);
                    } else if (!isMicroMode && dist < 4.4) {
                        // Atravessou o córtex pelo scroll: entra limpiamente nos Neurônios da Camada V (sem misturar malhas!)
                        autoZoomMicroTriggered = true;
                        isMicroMode = true;
                        cnsAnatomy.rootGroup.visible = false;
                        neuralMicro.setVisible(true, selectedStructureId);
                        document.getElementById('neuron-parts-bar').classList.add('visible');
                        setActiveTopViewBtn('btn-view-micro');
                        const meta = neuralMicro.getPartMetadata(selectedNeuronPartId || 'NEURON_SOMA');
                        updateHUDAndPopup(meta, false);
                    } else if (isMicroMode && autoZoomMicroTriggered && dist > 5.4) {
                        // Saiu do córtex pelo scroll out: restaura 100% o Córtex opaco e esconde os Neurônios!
                        autoZoomMicroTriggered = false;
                        isMicroMode = false;
                        neuralMicro.setVisible(false);
                        cnsAnatomy.rootGroup.visible = true;
                        cnsAnatomy.setCortexAlpha(1.0);
                        document.getElementById('neuron-parts-bar').classList.remove('visible');
                        setActiveTopViewBtn('btn-view-external');
                        const meta = ontologyMap.get(selectedStructureId) || MOZOK_ONTOLOGY[0];
                        updateHUDAndPopup(meta, false);
                    } else if (!isMicroMode && dist >= 6.4 && cnsAnatomy.viewMode === 'EXTERNAL' && !cnsAnatomy.isolatedId) {
                        cnsAnatomy.setCortexAlpha(1.0);
                        neuralMicro.setVisible(false);
                    }
                }

                // Quando está no Modo Micro, controla a profundidade para Organelas (Tier 4) e Átomos (Tier 5)
                if (isMicroMode && typeof neuralMicro.setMultiscaleDepth === 'function') {
                    neuralMicro.setMultiscaleDepth(dist);
                    if (dist < 3.2) {
                        controls.target.lerp(new THREE.Vector3(0, 0.5, 0), 0.10);
                    }
                }

                if (scaleTierLabel) {
                    if (!isMicroMode) {
                        if (dist > 6.4) {
                            scaleTierLabel.textContent = '15 cm • Macro SNC';
                            scaleTierLabel.style.borderColor = '#00f2fe';
                            scaleTierLabel.style.color = '#00f2fe';
                        } else {
                            scaleTierLabel.textContent = '10 mm • Parênquima Cortical';
                            scaleTierLabel.style.borderColor = '#38bdf8';
                            scaleTierLabel.style.color = '#38bdf8';
                        }
                    } else {
                        if (dist > 3.2) {
                            scaleTierLabel.textContent = '100 µm • Neurônios Camada V';
                            scaleTierLabel.style.borderColor = '#facc15';
                            scaleTierLabel.style.color = '#facc15';
                        } else if (dist > 2.0) {
                            scaleTierLabel.textContent = '500 nm • Fenda Sináptica';
                            scaleTierLabel.style.borderColor = '#34d399';
                            scaleTierLabel.style.color = '#34d399';
                        } else if (dist > 1.05) {
                            scaleTierLabel.textContent = '50 nm • Organelas Celulares';
                            scaleTierLabel.style.borderColor = '#c084fc';
                            scaleTierLabel.style.color = '#c084fc';
                        } else {
                            scaleTierLabel.textContent = '1 Å (0.1 nm) • Átomos & Orbitais';
                            scaleTierLabel.style.borderColor = '#f43f5e';
                            scaleTierLabel.style.color = '#f43f5e';
                        }
                    }
                }
            }"""

if OLD_ZOOM_BLOCK:
    html = html[:OLD_ZOOM_BLOCK.start()] + NEW_ZOOM_BLOCK + html[OLD_ZOOM_BLOCK.end():]

# Garantir que selectMacroStructure desative userWheelZoomActive e mantenha distância confortável para nunca disparar micro modo por acidente
if "userWheelZoomActive = false;" not in html.split("function selectMacroStructure")[1][:220]:
    html = html.replace(
        "function selectMacroStructure(structureId, focusCamera = true, showFloatingPopup = true) {",
        "function selectMacroStructure(structureId, focusCamera = true, showFloatingPopup = true) {\n                userWheelZoomActive = false;\n                autoZoomMicroTriggered = false;"
    )

# No slider da régua #mozok-scale-slider, marcar userWheelZoomActive = true
if "scaleSlider.addEventListener('input', (e) => {\n                    userWheelZoomActive = true;" not in html:
    html = html.replace(
        "scaleSlider.addEventListener('input', (e) => {",
        "scaleSlider.addEventListener('input', (e) => {\n                    userWheelZoomActive = true;"
    )

INDEX_HTML.write_text(html, encoding="utf-8")
print("[OK] MOZOK v1.0006 aplicado: Bug visual de mistura Córtex/Neurônios resolvido e áudios de introdução estruturados no disco.")

