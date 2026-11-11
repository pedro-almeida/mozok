#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PASSO 2 — MOZOK v1.0008 (Engine JavaScript):
1. Remove o zoom intrusivo em evaluateContinuousMultiscaleZoom (o scroll do mouse nunca mais
   comuta isMicroMode sozinho; em Microcosmos Neuronal é possível afastar livremente a câmera).
2. Substitui o Ato I da apresentação pelo gerador de raios elétricos dinâmicos em Canvas
   ao redor do título MOZOK (#mozok-lightning-canvas), sem flor e sem beija-flor.
3. Exibe as frases do Ato II em azul ciano puro (#00f2fe) no centro da tela (#doom3-center-stage).
4. Garante encerramento 100% limpo em finishDoom3Presentation() (para todo áudio e fecha o overlay,
   sem disparar tour de slides nem abrir cards sobrepostos).
5. Integra o botão 🤟 Libras (#btn-vlibras) e a apresentação ao Dock Nativo #mozok-vlibras-dock.
"""

import asyncio
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent
html_path = ROOT / "web" / "index.html"
html_code = html_path.read_text(encoding="utf-8")

# 1. REMOVER COMPLETAMENTE O ZOOM INTRUSIVO QUE MUDA DE MODO SOZINHO EM evaluateContinuousMultiscaleZoom
old_zoom_fn_start = html_code.find("function evaluateContinuousMultiscaleZoom()")
if old_zoom_fn_start != -1:
    old_zoom_fn_end = html_code.find("if (scaleSlider) {", old_zoom_fn_start)
    if old_zoom_fn_end != -1:
        new_zoom_fn = """function evaluateContinuousMultiscaleZoom() {
                const dist = camera.position.distanceTo(controls.target);

                const minD = 0.16, maxD = 45.0;
                const clampedD = Math.max(minD, Math.min(maxD, dist));
                const depthPct = Math.round((1.0 - (Math.log(clampedD) - Math.log(minD)) / (Math.log(maxD) - Math.log(minD))) * 100);
                if (scaleSlider && document.activeElement !== scaleSlider) {
                    scaleSlider.value = String(Math.max(0, Math.min(100, depthPct)));
                }

                // v1.0008: FIM DO ZOOM INTRUSIVO!
                // O scroll do mouse nunca mais altera entre Macro e Micro sozinho!
                // No modo neuronal, o usuário pode afastar a câmera o quanto quiser para ver a rede inteira de longe sem voltar pro cérebro.
                // A alternância volta a ser 100% manual e explícita pelos botões "🔬 Microcosmos Neuronal" e "🧠 Córtex Real".
                if (isMicroMode && typeof neuralMicro.setMultiscaleDepth === 'function') {
                    neuralMicro.setMultiscaleDepth(dist);
                }

                if (scaleTierLabel) {
                    if (!isMicroMode) {
                        scaleTierLabel.textContent = '15 cm • Macro SNC';
                        scaleTierLabel.style.borderColor = '#00f2fe';
                        scaleTierLabel.style.color = '#00f2fe';
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
            }

            """
        html_code = html_code[:old_zoom_fn_start] + new_zoom_fn + html_code[old_zoom_fn_end:]

# 2. ATUALIZAR O BOTÃO #btn-vlibras DA TOPBAR PARA CONTROLAR O DOCK NATIVO #mozok-vlibras-dock
old_vlibras_btn_block = """            let vlibrasInitialized = false;
            let vlibrasActive = false;
            const btnVlibras = document.getElementById('btn-vlibras');
            if (btnVlibras) {
                btnVlibras.addEventListener('click', () => {
                    vlibrasActive = !vlibrasActive;
                    btnVlibras.classList.toggle('active', vlibrasActive);
                    document.body.classList.toggle('vlibras-dock-open', vlibrasActive);
                    const cont = document.getElementById('vlibras-container');
                    if (cont) {
                        cont.style.display = vlibrasActive ? 'block' : 'none';
                    }
                    if (vlibrasActive && !vlibrasInitialized) {
                        vlibrasInitialized = true;
                        const script = document.createElement('script');
                        script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
                        script.onload = () => {
                            if (window.VLibras && window.VLibras.Widget) {
                                new window.VLibras.Widget('https://vlibras.gov.br/app');
                            }
                        };
                        document.body.appendChild(script);
                    }
                });
            }"""

new_vlibras_btn_block = """            let vlibrasInitialized = false;
            let vlibrasActive = false;
            const btnVlibras = document.getElementById('btn-vlibras');
            function ensureVLibrasWidgetLoaded() {
                const cont = document.getElementById('vlibras-container');
                if (cont) cont.style.display = 'block';
                if (!vlibrasInitialized) {
                    vlibrasInitialized = true;
                    const script = document.createElement('script');
                    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
                    script.onload = () => {
                        if (window.VLibras && window.VLibras.Widget) {
                            new window.VLibras.Widget('https://vlibras.gov.br/app');
                        }
                        setTimeout(() => {
                            const vwBtn = document.querySelector('[vw-access-button]');
                            const vwWrapper = document.querySelector('[vw-plugin-wrapper]');
                            if (vwBtn && vwWrapper && !vwWrapper.classList.contains('active')) {
                                vwBtn.click();
                            }
                        }, 450);
                    };
                    document.body.appendChild(script);
                } else {
                    const vwBtn = document.querySelector('[vw-access-button]');
                    const vwWrapper = document.querySelector('[vw-plugin-wrapper]');
                    if (vwBtn && vwWrapper && !vwWrapper.classList.contains('active')) {
                        vwBtn.click();
                    }
                }
            }
            if (btnVlibras) {
                btnVlibras.addEventListener('click', () => {
                    const dock = document.getElementById('mozok-vlibras-dock');
                    vlibrasActive = !vlibrasActive;
                    btnVlibras.classList.toggle('active', vlibrasActive);
                    document.body.classList.toggle('vlibras-dock-open', vlibrasActive);
                    if (dock) dock.classList.toggle('active', vlibrasActive);
                    if (vlibrasActive) ensureVLibrasWidgetLoaded();
                });
            }"""

if old_vlibras_btn_block in html_code:
    html_code = html_code.replace(old_vlibras_btn_block, new_vlibras_btn_block, 1)

# 3. ATUALIZAR O 5º SEGMENTO EM INTRO_SEGMENTS_I18N PARA ENCERRAMENTO LIMPO (SEM PROMETER INICIAR TOUR DE SLIDES)
SEG5_CLEAN = {
    "pt-BR": (
        "Totalmente gratuito, traduzido em cinco idiomas e integrado à Língua Brasileira de Sinais via VLibras, o MOZOK democratiza a neurociência de alta precisão. Iniciando agora o tour guiado peça por peça do encéfalo humano.",
        "Totalmente gratuito, traduzido em cinco idiomas e integrado à Língua Brasileira de Sinais via VLibras, o MOZOK democratiza a neurociência de alta precisão como patrimônio científico aberto da humanidade.",
    ),
    "en-GB": (
        "Completely free and open to humanity in five languages, MOZOK democratizes high-precision neuroscience. Initiating now the piece-by-piece guided tour of the human brain.",
        "Completely free and open to humanity in five languages, MOZOK democratizes high-precision neuroscience as an open scientific heritage for all humanity.",
    ),
    "es-ES": (
        "Totalmente gratuito y abierto a la humanidad en cinco idiomas, MOZOK democratiza la neurociencia de alta precisión. Iniciando ahora el recorrido guiado pieza por pieza del encéfalo humano.",
        "Totalmente gratuito y abierto a la humanidad en cinco idiomas, MOZOK democratiza la neurociencia de alta precisión como patrimonio científico abierto de la humanidad.",
    ),
    "it-IT": (
        "Totalmente gratuito e aperto all'umanità in cinque lingue, MOZOK democratizza le neuroscienze ad alta precisione. Avvio immediato del tour guidato pezzo per pezzo dell'encefalo umano.",
        "Totalmente gratuito e aperto all'umanità in cinque lingue, MOZOK democratizza le neuroscienze ad alta precisione come patrimonio scientifico aperto dell'umanità.",
    ),
    "uk-UA": (
        "Повністю безкоштовний і відкритий для людства п'ятьма мовами, MOZOK демократизує високоточну нейронауку. Розпочинаємо покрокову екскурсію структурами людського мозку.",
        "Повністю безкоштовний і відкритий для людства п'ятьма мовами, MOZOK демократизує високоточну нейронауку як відкриту наукову спадщину людства.",
    ),
}

for _lang, (old_s5, new_s5) in SEG5_CLEAN.items():
    html_code = html_code.replace(old_s5, new_s5)

# 4. SUBSTITUIR O MOTOR DA APRESENTAÇÃO CIENTÍFICA:
# - Gerador de Raios Elétricos Dinâmicos no Ato I (MOZOK)
# - Frases Centrais em Azul Ciano Puro no Ato II (sem caixas opacas)
# - Encerramento Limpo (a apresentação para de verdade, sem invadir nem abrir outros modais)
# - Integração com o Dock Nativo do VLibras
fn_start = html_code.find("async function startDoom3ScientificPresentation")
if fn_start == -1:
    fn_start = html_code.find("function startDoom3ScientificPresentation")

if fn_start != -1:
    fn_end = html_code.find("// =====================================================================", fn_start + 100)
    if fn_end != -1:
        new_engine = """// RENDERIZADOR DE RAIOS ELÉTRICOS EM TEMPO REAL PARA O ATO I (TÍTULO MOZOK)
            let lightningAnimId = null;
            function startMozokLightningEffect() {
                const canvas = document.getElementById('mozok-lightning-canvas');
                if (!canvas) return;
                const ctx = canvas.getContext('2d');
                canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
                canvas.height = canvas.parentElement.clientHeight || window.innerHeight;

                const bolts = [];
                function createBolt(x1, y1, x2, y2) {
                    const points = [{ x: x1, y: y1 }];
                    const dist = Math.hypot(x2 - x1, y2 - y1);
                    const steps = Math.max(4, Math.floor(dist / 22));
                    for (let i = 1; i < steps; i++) {
                        const t = i / steps;
                        const bx = x1 + (x2 - x1) * t + (Math.random() - 0.5) * 45;
                        const by = y1 + (y2 - y1) * t + (Math.random() - 0.5) * 45;
                        points.push({ x: bx, y: by });
                    }
                    points.push({ x: x2, y: y2 });
                    return { points, life: 1.0, width: Math.random() * 2.5 + 1.2 };
                }

                function renderLightning() {
                    if (!cyberPresentationActive) return;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    // Gera novos raios em torno do centro onde fica "MOZOK"
                    if (Math.random() < 0.34) {
                        const cx = canvas.width / 2;
                        const cy = canvas.height / 2;
                        const angle = Math.random() * Math.PI * 2;
                        const r1 = 70 + Math.random() * 65;
                        const r2 = 240 + Math.random() * 140;
                        bolts.push(createBolt(
                            cx + Math.cos(angle) * r1,
                            cy + Math.sin(angle) * r1,
                            cx + Math.cos(angle + (Math.random() - 0.5) * 0.8) * r2,
                            cy + Math.sin(angle + (Math.random() - 0.5) * 0.8) * r2
                        ));
                    }

                    for (let i = bolts.length - 1; i >= 0; i--) {
                        const b = bolts[i];
                        b.life -= 0.085;
                        if (b.life <= 0) {
                            bolts.splice(i, 1);
                            continue;
                        }
                        ctx.beginPath();
                        ctx.moveTo(b.points[0].x, b.points[0].y);
                        for (let j = 1; j < b.points.length; j++) {
                            ctx.lineTo(b.points[j].x, b.points[j].y);
                        }
                        ctx.strokeStyle = `rgba(0, 242, 254, ${b.life * 0.95})`;
                        ctx.lineWidth = b.width;
                        ctx.shadowColor = '#00f2fe';
                        ctx.shadowBlur = 22;
                        ctx.stroke();

                        // Núcleo branco intenso do relâmpago
                        ctx.strokeStyle = `rgba(255, 255, 255, ${b.life * 0.85})`;
                        ctx.lineWidth = b.width * 0.45;
                        ctx.stroke();
                    }

                    lightningAnimId = requestAnimationFrame(renderLightning);
                }
                renderLightning();
            }

            function stopMozokLightningEffect() {
                if (lightningAnimId) {
                    cancelAnimationFrame(lightningAnimId);
                    lightningAnimId = null;
                }
            }

            // ATIVAÇÃO DO DOCK NATIVO DO VLIBRAS NO CANTO DA TELA
            function activateNativeVLibrasDock() {
                const lang = currentLang || 'pt-BR';
                if (!lang.toLowerCase().startsWith('pt')) return;
                const dock = document.getElementById('mozok-vlibras-dock');
                if (dock) dock.classList.add('active');
                vlibrasActive = true;
                if (btnVlibras) btnVlibras.classList.add('active');
                ensureVLibrasWidgetLoaded();
            }

            document.getElementById('btn-close-vlibras-dock')?.addEventListener('click', () => {
                document.getElementById('mozok-vlibras-dock')?.classList.remove('active');
                vlibrasActive = false;
                if (btnVlibras) btnVlibras.classList.remove('active');
            });

            // CONTROLADOR PRINCIPAL DA APRESENTAÇÃO CIENTÍFICA (v1.0008)
            async function startDoom3ScientificPresentation() {
                const overlay = document.getElementById('doom3-intro-overlay');
                const lightningStage = document.getElementById('mozok-lightning-stage');
                const narrative = document.getElementById('doom3-narrative-stage');
                const pauseBtn = document.getElementById('btn-doom3-pause');
                const indicatorEl = document.getElementById('doom3-segment-indicator');
                const progressBar = document.getElementById('doom3-progress-bar');
                const aboutModal = document.getElementById('mozok-about-modal');

                if (!overlay) return;
                if (aboutModal) aboutModal.classList.add('hidden');

                // Cancela qualquer áudio ou tour anterior
                if (tourTimer) {
                    clearTimeout(tourTimer);
                    tourTimer = null;
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
                    window.speechSynthesis.cancel();
                }

                // Garante que nenhum modal/deck de slides fique encavalado
                const deckEl = document.getElementById('mozok-presenter-deck');
                if (deckEl) deckEl.classList.remove('active');

                cyberPresentationActive = true;
                cyberPresentationPaused = false;
                cyberPresentationAborted = false;

                if (pauseBtn) pauseBtn.textContent = '⏸ Pausar [Espaço]';
                overlay.classList.remove('hidden-intro');
                document.body.classList.add('cyber-intro-active');

                // ATO I: Fundo escuro com Nome MOZOK e Raios Elétricos (sem vazar cérebro)
                if (isMicroMode) setMicrocosmosMode(false);
                if (cnsAnatomy && cnsAnatomy.rootGroup) cnsAnatomy.rootGroup.visible = false;
                if (neuralMicro) neuralMicro.setVisible(false);

                if (lightningStage) {
                    lightningStage.style.display = 'flex';
                    lightningStage.style.opacity = '1';
                }
                if (narrative) {
                    narrative.style.display = 'none';
                    narrative.style.opacity = '0';
                }

                startHexagonalVisorCanvas();
                startMozokLightningEffect();
                activateNativeVLibrasDock();
                playIdSoftwareLogoSound();

                const okSplash = await waitWithPauseAndAbort(3400);
                if (!okSplash || cyberPresentationAborted) return finishDoom3Presentation();

                stopMozokLightningEffect();
                if (lightningStage) lightningStage.style.opacity = '0';
                const okFade = await waitWithPauseAndAbort(750);
                if (!okFade || cyberPresentationAborted) return finishDoom3Presentation();
                if (lightningStage) lightningStage.style.display = 'none';

                // ATO II: Cérebro 3D desfocado ao fundo + Malha Hexagonal + Frases Centrais em Azul Ciano Puro
                if (cnsAnatomy && cnsAnatomy.rootGroup) {
                    cnsAnatomy.rootGroup.visible = true;
                    cnsAnatomy.setViewMode('EXTERNAL');
                    cnsAnatomy.spinalGroup.visible = false;
                    cnsAnatomy.pnsGroup.visible = false;
                    cnsAnatomy.vascularGroup.visible = false;
                }
                document.body.classList.add('cyber-brain-blurred');
                flyCameraTo(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1.2, 14.5), 0.85);

                if (narrative) {
                    narrative.style.display = 'flex';
                    narrative.style.opacity = '1';
                }

                const lang = currentLang || 'pt-BR';
                const segments = INTRO_SEGMENTS_I18N[lang] || INTRO_SEGMENTS_I18N['pt-BR'];

                for (let s = 0; s < segments.length; s++) {
                    if (cyberPresentationAborted) break;
                    if (indicatorEl) indicatorEl.textContent = `SEQUÊNCIA CIENTÍFICA 0${s + 1} / 0${segments.length}`;
                    if (progressBar) progressBar.style.width = `${((s + 1) / segments.length) * 100}%`;

                    await playSegmentWithExactSyncedTypewriter(segments[s], s, segments.length);
                }

                // Ao terminar todos os segmentos, encerra limpamente (sem invadir outros modais)
                finishDoom3Presentation();
            }

            // ENCERRAMENTO LIMPO DA APRESENTAÇÃO (PARA DE VERDADE, SEM ENCAVALAR ELEMENTOS)
            function finishDoom3Presentation() {
                cyberPresentationAborted = true;
                cyberPresentationActive = false;
                cyberPresentationPaused = false;

                stopMozokLightningEffect();

                if (hexAnimId) {
                    cancelAnimationFrame(hexAnimId);
                    hexAnimId = null;
                }
                if (activeRoboticSource) {
                    try { activeRoboticSource.stop(); } catch (_) {}
                    activeRoboticSource = null;
                }
                if (currentAudio) {
                    try { currentAudio.pause(); currentAudio.currentTime = 0; } catch (_) {}
                    currentAudio = null;
                }
                if ('speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                }
                if (doomAudioCtx && doomAudioCtx.state === 'suspended') {
                    doomAudioCtx.resume().catch(() => {});
                }

                const overlay = document.getElementById('doom3-intro-overlay');
                if (overlay) overlay.classList.add('hidden-intro');

                document.body.classList.remove('cyber-brain-blurred');
                document.body.classList.remove('cyber-intro-active');

                if (cnsAnatomy && cnsAnatomy.rootGroup) {
                    cnsAnatomy.rootGroup.visible = true;
                    cnsAnatomy.setViewMode('EXTERNAL');
                }
                flyCameraTo(new THREE.Vector3(0, -1.5, 0), new THREE.Vector3(0, 1.5, 22.0), 1.0);

                // Garante que o deck modal ou tours não abram sozinhos por trás
                deckActive = false;
                deckPlaying = false;
                if (tourTimer) {
                    clearTimeout(tourTimer);
                    tourTimer = null;
                }
                const deckEl = document.getElementById('mozok-presenter-deck');
                if (deckEl) deckEl.classList.remove('active');
                const tourBtn = document.getElementById('btn-tour');
                if (tourBtn) tourBtn.classList.remove('active');
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
            window.toggleDoom3PresentationPause = toggleDoom3PresentationPause;

            document.getElementById('btn-doom3-pause')?.addEventListener('click', () => toggleDoom3PresentationPause());
            document.getElementById('btn-doom3-skip')?.addEventListener('click', () => finishDoom3Presentation());

            window.addEventListener('keydown', (e) => {
                if (!cyberPresentationActive) return;
                if (e.code === 'Space') {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleDoom3PresentationPause();
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    finishDoom3Presentation();
                }
            }, true);"""

        html_code = html_code[:fn_start] + new_engine + "\n\n            " + html_code[fn_end:]

# 5. Garantir que o listener de newBtnTour (#btn-tour) chame startDoom3ScientificPresentation() sem encadear tour
old_btn_tour_handler = """            newBtnTour.addEventListener('click', () => {
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

new_btn_tour_handler = """            newBtnTour.addEventListener('click', () => {
                if (cyberPresentationActive) {
                    finishDoom3Presentation();
                    return;
                }
                startDoom3ScientificPresentation();
            });"""

if old_btn_tour_handler in html_code:
    html_code = html_code.replace(old_btn_tour_handler, new_btn_tour_handler, 1)

html_path.write_text(html_code, encoding="utf-8")
print("Engine JavaScript de apresentação e navegação atualizada para v1.0008.")


async def update_seg5_audio_files():
    """Regenera CYBER_INTRO_5.mp3 nos 5 idiomas com o encerramento limpo sem menção ao tour de slides."""
    import edge_tts

    voice_map = {
        "pt-BR": "pt-BR-AntonioNeural",
        "en-GB": "en-GB-RyanNeural",
        "es-ES": "es-ES-AlvaroNeural",
        "it-IT": "it-IT-DiegoNeural",
        "uk-UA": "uk-UA-OstapNeural",
    }
    audio_root = ROOT / "web" / "assets" / "audio"
    for lang, (_old_txt, new_txt) in SEG5_CLEAN.items():
        out_file = audio_root / lang / "CYBER_INTRO_5.mp3"
        comm = edge_tts.Communicate(text=new_txt, voice=voice_map[lang], rate="-4%", pitch="-8Hz")
        await comm.save(str(out_file))
        print(f"  [AUDIO v1.0008 OK] {lang}/CYBER_INTRO_5.mp3 ({out_file.stat().st_size} bytes)")


if __name__ == "__main__":
    asyncio.run(update_seg5_audio_files())

