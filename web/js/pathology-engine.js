// [PT-BR]: Motor Fisiológico e Simulador Comparativo de 5 Patologias do SNC (Alzheimer, Parkinson, AVC, Esclerose Múltipla e DCJ).
// [EN-US]: Physiological Engine and Comparative Simulator for 5 CNS Pathologies (Alzheimer's, Parkinson's, Stroke, Multiple Sclerosis, and CJD).
// [AI-CTX]: @llm-context: Dual-scale pathology engine coupling macroscopic CNS focal atrophy/lesions with microscopic neuronal death, beta-amyloid, tau, Lewy bodies, excitotoxicity, demyelination, and prions.
//           @llm-invariant: State machine driving real-time biomarkers (PrPSc, A-Beta42, Tau, 14-3-3, Ca2+, Glutamate), telemetry bars, and 3D visual deformations.
//           @llm-neuroscience: Simulates normal 40Hz gamma rhythm vs. 5 distinct neurodegenerative and acute vascular insults.

(function (window) {
  'use strict';

  // [PT-BR]: Dicionário de metadados clínicos e patológicos das 5 patologias do SNC + Fisiologia Saudável.
  // [EN-US]: Clinical and pathological metadata dictionary for 5 CNS pathologies + Healthy Physiology.
  // [AI-CTX]: @llm-neuroscience: Contains pathophysiology, diagnostic criteria, biomarkers, and auditory clinical scripts.
  const PATHOLOGY_CATALOG = {
    NORMAL: {
      id: 'NORMAL',
      name: 'Fisiologia Normal do SNC',
      badge: 'HIGIDO (40 Hz)',
      badgeClass: 'emerald',
      macroDescription: 'Encéfalo e Medula íntegros, sulcos e giros bem delineados, ventrículos com volume normotenso (LCR claro).',
      microDescription: 'Potenciais de ação regulares em 40 Hz (ritmo gama), condução saltatória íntegra nas bainhas de mielina, sinapses equilibradas.',
      affectedStructures: ['Córtex Cerebral', 'Tratos Corticoespinhais', 'Gânglios da Base'],
      primaryNeurotransmitter: 'Glutamato e GABA em homeostase estequiométrica',
      biomarkers: {
        prpc: '100%',
        prpsc: '0.00',
        vacuoles: '0.0%',
        tau: '180 pg/mL',
        p1433: '0.40 ng/mL',
        abeta: '1200 pg/mL',
        csfFlow: '32.4 mm/s',
        rtquic: 'NEGATIVO'
      },
      audioScript: 'Você está observando o Sistema Nervoso Central Hígido. A condução saltatória nos tratos corticoespinhais flui em alta velocidade, e a síntese de neurotransmissores mantém a homeostase sináptica perfeita.'
    },
    ALZHEIMER: {
      id: 'ALZHEIMER',
      name: 'Doença de Alzheimer (DA)',
      badge: 'DEMÊNCIA NEURODEGENERATIVA',
      badgeClass: 'purple',
      macroDescription: 'Atrofia cortical difusa acentuada no Hipocampo, Córtex Entorrinal e Lobo Temporoparietal, com dilatação dos ventrículos laterais (hidrocefalia ex-vacuo).',
      microDescription: 'Deposição extracelular de Placas Senis de Beta-Amiloide (Aβ42) + Emaranhados Neurofibrilares de Proteína Tau Hiperfosforilada colapsando microtúbulos e colapso colinérgico.',
      affectedStructures: ['Hipocampo (CA1-CA4)', 'Córtex Entorrinal', 'Núcleo Basal de Meynert'],
      primaryNeurotransmitter: 'Queda severa de Acetilcolina (ACh) nas sinapses córtico-hipocampais',
      biomarkers: {
        prpc: '98%',
        prpsc: '0.00',
        vacuoles: '5.2%',
        tau: '4850 pg/mL',
        p1433: '0.65 ng/mL',
        abeta: '240 pg/mL (Consumido nas placas)',
        csfFlow: '21.0 mm/s',
        rtquic: 'NEGATIVO'
      },
      audioScript: 'Na Doença de Alzheimer, a atrofia inicia-se no hipocampo e córtex entorrinal. No zoom microscópico, placas senis de beta-amiloide e emaranhados de proteína Tau asfixiam os neurônios, destruindo a memória episódica.'
    },
    PARKINSON: {
      id: 'PARKINSON',
      name: 'Doença de Parkinson (DP)',
      badge: 'DISTÚRBIO DO MOVIMENTO',
      badgeClass: 'gold',
      macroDescription: 'Despigmentação focal e degeneração da Substância Negra (Pars Compacta) no mesencéfalo e hipoatividade da via nigroestriatal para o Putâmen e Caudado.',
      microDescription: 'Acúmulo intracitoplasmático de Corpos de Lewy (agregados fibrilares de alfa-sinucleína) + perda de axônios dopaminérgicos + oscilação patológica em 4-6 Hz.',
      affectedStructures: ['Substância Negra (Mesencéfalo)', 'Corpo Estriado (Putâmen/Caudado)', 'Globo Pálido'],
      primaryNeurotransmitter: 'Déficit crítico de Dopamina (via nigroestriatal) com hiperatividade inibitória de GABA no Tálamo',
      biomarkers: {
        prpc: '100%',
        prpsc: '0.00',
        vacuoles: '2.0%',
        tau: '210 pg/mL',
        p1433: '0.45 ng/mL',
        abeta: '1150 pg/mL',
        csfFlow: '28.5 mm/s',
        rtquic: 'NEGATIVO'
      },
      audioScript: 'Na Doença de Parkinson, a morte dos neurônios dopaminérgicos pigmentados da substância negra priva o corpo estriado de dopamina. O resultado clínico é o tremor em repouso de 4 a 6 hertz, rigidez e bradicinesia.'
    },
    STROKE: {
      id: 'STROKE',
      name: 'Acidente Vascular Cerebral (AVC Isquêmico de ACM)',
      badge: 'EMERGÊNCIA VASCULAR AGUDA',
      badgeClass: 'rose',
      macroDescription: 'Oclusão tromboembólica da Artéria Cerebral Média Esquerda, causando infarto isquêmico na Área de Broca, Giro Pré-Central M1 e Fascículo Arqueado (Core necrótico e Zona de Penumbra).',
      microDescription: 'Falência de ATP nas bombas Na+/K+, despolarização anóxica, excitotoxicidade maciça por Glutamato, influxo letal de íons Cálcio (Ca2+) via NMDA e edema celular citotóxico.',
      affectedStructures: ['Área de Broca (BA 44/45)', 'Giro Pré-Central M1', 'Fascículo Arqueado', 'Ínsula'],
      primaryNeurotransmitter: 'Excesso tóxico agudo de L-Glutamato extracelular',
      biomarkers: {
        prpc: '95%',
        prpsc: '0.00',
        vacuoles: '18.5%',
        tau: '6200 pg/mL',
        p1433: '1.20 ng/mL',
        abeta: '1050 pg/mL',
        csfFlow: '14.2 mm/s',
        rtquic: 'NEGATIVO'
      },
      audioScript: 'No Acidente Vascular Cerebral Isquêmico da artéria cerebral média esquerda, a interrupção do oxigênio causa falência energética imediata. A liberação maciça de glutamato gera excitotoxicidade por influxo de cálcio, matando o núcleo isquêmico.'
    },
    MS: {
      id: 'MS',
      name: 'Esclerose Múltipla (EM / Desmielinização)',
      badge: 'DOENÇA AUTOIMUNE DESMIELINIZANTE',
      badgeClass: 'blue',
      macroDescription: 'Placas desmielinizantes hiperintensas em substância branca periventricular (Dedos de Dawson), Nervo Óptico, Corpo Caloso, Tronco e Funículos da Medula Espinhal.',
      microDescription: 'Ataque autoimune mediado por linfócitos T e micróglia ativada que fagocitam os oligodendrócitos e destroem as bainhas de mielina cilíndricas, bloqueando a condução saltatória.',
      affectedStructures: ['Funículos da Medula Espinhal', 'Substância Branca Periventricular', 'Ponte e Pedúnculos'],
      primaryNeurotransmitter: 'Bloqueio da condução saltatória nos Nódulos de Ranvier com estresse oxidativo',
      biomarkers: {
        prpc: '99%',
        prpsc: '0.00',
        vacuoles: '4.5%',
        tau: '1250 pg/mL',
        p1433: '0.80 ng/mL',
        abeta: '1180 pg/mL',
        csfFlow: '29.0 mm/s',
        rtquic: 'NEGATIVO (Bandas Oligoclonais IgG Positivas)'
      },
      audioScript: 'Na Esclerose Múltipla, o sistema imunológico ataca a mielina na substância branca e na medula espinhal. Sem as bainhas isolantes, os axônios nus sofrem bloqueio da condução elétrica saltatória.'
    },
    CJD: {
      id: 'CJD',
      name: 'Doença de Creutzfeldt-Jakob (DCJ — Príons)',
      badge: 'ENCEFALOPATIA ESPONGIFORME',
      badgeClass: 'danger',
      macroDescription: 'Atrofia cortical e cerebelar fulminante, degeneração espongiforme com "Sinal do Taco de Hóquei" talâmico no Pulvinar e fita cortical hiperintensa (Cortical Ribboning) na ressonância.',
      microDescription: 'Conversão conformacional em cascata de PrPC (alfa-hélice) em PrPSc (beta-folha insolúvel), formação de placas priônicas, vacúolos intracelulares e morte neuronal rápida.',
      affectedStructures: ['Tálamo Pulvinar', 'Corpo Estriado', 'Córtex Cerebral', 'Cerebelo'],
      primaryNeurotransmitter: 'Colapso polissináptico total e liberação de proteínas neurodegenerativas',
      biomarkers: {
        prpc: '8%',
        prpsc: '9.45',
        vacuoles: '84.0%',
        tau: '18500 pg/mL',
        p1433: '8.50 ng/mL',
        abeta: '890 pg/mL',
        csfFlow: '8.4 mm/s',
        rtquic: 'POSITIVO (Agregação Priônica Reativa)'
      },
      audioScript: 'A Doença de Creutzfeldt-Jakob é a mais rápida e letal encefalopatia humana. Príons PrPSc forçam a proteína normal PrPC a se desdobrar em folhas beta infecciosas, transformando o cérebro numa esponja de vacúolos microscópicos.'
    }
  };

  // [PT-BR]: Classe controladora do simulador de patologias do SNC.
  // [EN-US]: Controller class for the CNS pathology simulator.
  // [AI-CTX]: @llm-invariant: Updates telemetry HUD, communicates with CNSAnatomy3D and NeuralMicrocosmos3D.
  class PathologyEngine {
    constructor(cnsAnatomy, neuralMicrocosmos) {
      this.cnsAnatomy = cnsAnatomy;
      this.neuralMicrocosmos = neuralMicrocosmos;
      this.currentPathology = PATHOLOGY_CATALOG.NORMAL;
      this.evolutionProgress = 0.0; // 0.0 a 1.0 (gravidade da lesão)
      this.isSimulating = false;
      this.isPaused = false;
      this.currentLang = 'pt-BR';

      this.setupUI();
    }

    // [PT-BR]: Constrói e injeta o seletor de patologias e os 3 botões de controle (Iniciar, Pausar, Reiniciar) na barra de navegação superior.
    // [EN-GB]: Builds and injects pathology selector and the 3 control buttons (Start, Pause, Reset) in the top navigation bar.
    // [AI-CTX]: @llm-a11y: Accessible dropdown and action buttons to control disease simulation and camera targeting.
    setupUI() {
      const hudRight = document.querySelector('.hud-right');
      const topBar = hudRight || document.querySelector('.top-controls');
      if (!topBar) return;

      const existingSelect = document.getElementById('select-pathology');
      if (existingSelect) return;

      const container = document.createElement('div');
      container.className = 'hud-card pathology-selector-container';
      container.style.cssText = `
        pointer-events: auto;
        background: rgba(10, 16, 28, 0.96);
        border: 1px solid rgba(244, 63, 94, 0.55);
        border-radius: 10px;
        padding: 10px 12px;
        display: flex;
        flex-direction: column;
        gap: 7px;
        box-shadow: 0 10px 28px rgba(0, 0, 0, 0.65);
      `;

      container.innerHTML = `
        <div class="hud-card-title" style="margin-bottom: 2px;">
          <span id="label-pathology-title" style="color: #fb7185; font-weight: 800;">🧬 SIMULADOR DE PATOLOGIAS</span>
          <span id="pathology-stage-badge" style="font-size: 9px; color: #10b981; font-family: 'JetBrains Mono', monospace;">HÍGIDO</span>
        </div>
        <select id="select-pathology" style="
          width: 100%;
          background: #0f172a;
          color: #f1f5f9;
          border: 1px solid rgba(56, 189, 248, 0.55);
          border-radius: 6px;
          padding: 6px 8px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          outline: none;
        ">
          <option value="NORMAL">🧪 Fisiologia Normal (SNC Hígido)</option>
          <option value="STROKE">🩸 AVC Isquêmico (ACM Esquerda / Broca)</option>
          <option value="CJD">☣️ Doença de Creutzfeldt-Jakob (DCJ / Príons)</option>
          <option value="ALZHEIMER">🧠 Doença de Alzheimer (Hipocampo / Tau)</option>
          <option value="PARKINSON">⚡ Doença de Parkinson (Substância Negra)</option>
          <option value="MS">🛡️ Esclerose Múltipla (Desmielinização)</option>
          <option value="ALS">🧬 Esclerose Lateral Amiotrófica (ELA / M1)</option>
          <option value="EPILEPSY">⚡ Epilepsia (Hipersincronia Paroxística)</option>
        </select>
        <div style="display: flex; gap: 5px; width: 100%;">
          <button id="btn-start-disease" class="btn-action" style="flex: 1; justify-content: center; padding: 5px 6px; font-size: 10px; background: rgba(16, 185, 129, 0.22); border-color: #10b981; color: #34d399;" title="Iniciar Simulação Patológica">
            <span>▶ Simular</span>
          </button>
          <button id="btn-pause-disease" class="btn-action" style="padding: 5px 8px; font-size: 10px;" title="Pausar / Retomar">
            <span>⏸</span>
          </button>
          <button id="btn-reset-disease" class="btn-action" style="padding: 5px 8px; font-size: 10px; color: #fbbf24; border-color: rgba(251, 191, 36, 0.45);" title="Restaurar Fisiologia Normal">
            <span>↺ Saudável</span>
          </button>
        </div>
      `;

      topBar.insertBefore(container, topBar.firstChild);

      const selectEl = document.getElementById('select-pathology');
      selectEl.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val === 'NORMAL') {
          this.resetDiseaseSimulation();
        } else {
          this.startDiseaseSimulation(val);
        }
      });

      const btnStart = document.getElementById('btn-start-disease');
      btnStart.addEventListener('click', () => {
        const val = selectEl.value === 'NORMAL' ? 'STROKE' : selectEl.value;
        selectEl.value = val;
        this.startDiseaseSimulation(val);
      });

      const btnPause = document.getElementById('btn-pause-disease');
      btnPause.addEventListener('click', () => {
        this.pauseDiseaseSimulation();
      });

      const btnReset = document.getElementById('btn-reset-disease');
      btnReset.addEventListener('click', () => {
        this.resetDiseaseSimulation();
      });
    }

    // [PT-BR]: Inicia a simulação temporal da doença com voo automático para a região anatômica primária afetada.
    // [EN-GB]: Starts disease temporal simulation with automatic camera flight to the primary affected anatomical region.
    startDiseaseSimulation(pathologyKey) {
      const pKey = (pathologyKey || 'ALZHEIMER').toUpperCase();
      this.isSimulating = true;
      this.isPaused = false;

      // Mapeamento neuroanatômico da estrutura-alvo primária
      const targetRegionMap = {
        ALZHEIMER: 11, // Hipocampo (CA1-CA4)
        PARKINSON: 20, // Substância Negra (Mesencéfalo)
        STROKE: 3,     // Área de Broca (ACM Esquerda)
        MS: 25,        // Medula Espinhal
        ALS: 4,        // Córtex Motor M1 (Giro Pré-Central)
        EPILEPSY: 11,  // Hipocampo / Foco Temporal
        CJD: 16,       // Tálamo Pulvinar
        NORMAL: 1      // Sistema Nervoso Central Completo
      };

      const targetId = targetRegionMap[pKey] || 1;
      if (typeof window.mozokSelectRegionById === 'function') {
        window.mozokSelectRegionById(targetId, false);
      }

      this.setPathology(pKey, true);

      const btnPause = document.getElementById('btn-pause-disease');
      if (btnPause) {
        btnPause.innerHTML = '<span>⏸ Pausar</span>';
        btnPause.classList.remove('active');
      }
    }

    // [PT-BR]: Pausa ou retoma a progressão da simulação patológica.
    // [EN-GB]: Pauses or resumes progression of pathological simulation.
    // [AI-CTX]: @llm-invariant: Toggles pause state and updates UI.
    pauseDiseaseSimulation() {
      this.isPaused = !this.isPaused;
      const btnPause = document.getElementById('btn-pause-disease');
      if (btnPause) {
        if (this.isPaused) {
          btnPause.innerHTML = '<span>▶ Retomar</span>';
          btnPause.classList.add('active');
        } else {
          btnPause.innerHTML = '<span>⏸ Pausar</span>';
          btnPause.classList.remove('active');
        }
      }
    }

    // [PT-BR]: Restaura 100% da fisiologia normal, zera lesões e retorna à visão macro inicial do SNC.
    // [EN-GB]: Restores 100% normal physiology, zeroes lesions and returns to initial CNS macro view.
    // [AI-CTX]: @llm-neuroscience: Resets baseline biomarkers, clears lesions, and returns camera to macro home.
    resetDiseaseSimulation() {
      this.isSimulating = false;
      this.isPaused = false;
      const selectEl = document.getElementById('select-pathology');
      if (selectEl) selectEl.value = 'NORMAL';

      this.setPathology('NORMAL', false);

      if (typeof window.mozokReturnToMacro === 'function') {
        window.mozokReturnToMacro();
      }

      const btnPause = document.getElementById('btn-pause-disease');
      if (btnPause) {
        btnPause.innerHTML = '<span>⏸ Pausar</span>';
        btnPause.classList.remove('active');
      }
    }

    // [PT-BR]: Atualiza todos os textos para o idioma selecionado (5 idiomas suportados).
    // [EN-GB]: Updates all texts to the selected language (5 supported languages).
    // [AI-CTX]: @llm-a11y: Multi-language reactivity using window.MOZOK_I18N.
    setLanguage(langCode) {
      this.currentLang = langCode || 'pt-BR';
      if (!window.MOZOK_I18N) return;

      const t = (k) => window.MOZOK_I18N.t(k, this.currentLang);

      const titleEl = document.getElementById('label-pathology-title');
      if (titleEl) titleEl.textContent = t('btnPathologies') || 'SIMULADOR DE PATOLOGIAS:';

      const btnStart = document.getElementById('btn-start-disease');
      if (btnStart) btnStart.innerHTML = `<span>▶ ${t('btnStartSim') || 'Iniciar Simulação'}</span>`;

      const btnPause = document.getElementById('btn-pause-disease');
      if (btnPause) btnPause.innerHTML = `<span>⏸ ${t('btnPause') || 'Pausar'}</span>`;

      const btnReset = document.getElementById('btn-reset-disease');
      if (btnReset) btnReset.innerHTML = `<span>↺ ${t('btnResetSim') || 'Reiniciar SNC'}</span>`;

      // Atualiza o card ativo
      if (this.currentPathology && this.currentPathology.id) {
        this.setPathology(this.currentPathology.id, false);
      }
    }

    // [PT-BR]: Define a patologia ativa e atualiza simultaneamente a macroanatomia 3D, o zoom microscópico e a telemetria.
    // [EN-GB]: Sets active pathology and simultaneously updates 3D macroanatomy, microscopic zoom, and telemetry.
    // [AI-CTX]: @llm-neuroscience: Triggers auditory narration and synchronizes with VLibras.
    setPathology(pathologyKey, triggerNarration = true) {
      const pKey = (pathologyKey || 'NORMAL').toUpperCase();
      const cat = (window.MOZOK_DATABASE && window.MOZOK_DATABASE.pathologies) ? window.MOZOK_DATABASE.pathologies : PATHOLOGY_CATALOG;
      let p = cat[pKey] || cat.NORMAL || PATHOLOGY_CATALOG.NORMAL;

      // Integração com dicionário i18n caso disponível
      if (window.MOZOK_I18N && typeof window.MOZOK_I18N.getPathology === 'function') {
        const localized = window.MOZOK_I18N.getPathology(pKey, this.currentLang);
        if (localized) {
          p = { ...p, ...localized };
        }
      }

      this.currentPathology = p;
      this.evolutionProgress = pKey === 'NORMAL' ? 0.0 : 0.85;

      // 1. Atualiza Microcosmo 3D (Neurônios, Mielina, Glia, Vesículas)
      if (this.neuralMicrocosmos && typeof this.neuralMicrocosmos.applyPathologyMode === 'function') {
        this.neuralMicrocosmos.applyPathologyMode(pKey);
      }
      if (window.proteinSim && typeof window.proteinSim.applyPathologyMode === 'function') {
        window.proteinSim.applyPathologyMode(pKey);
      }

      // 1.1 Atualiza impacto nos circuitos de tractografia
      if (this.cnsAnatomy && this.cnsAnatomy.tractography && typeof this.cnsAnatomy.tractography.setPathologyImpact === 'function') {
        this.cnsAnatomy.tractography.setPathologyImpact(pKey);
      }

      // 1.2 Atualiza dano na macroanatomia (Cavitação Worley cortical)
      if (this.cnsAnatomy && typeof this.cnsAnatomy.setDamage === 'function') {
        const damageVal = (pKey === 'NORMAL') ? 0.0 : (pKey === 'CJD' ? 1.0 : 0.65);
        this.cnsAnatomy.setDamage(damageVal);
      }

      // 2. Atualiza Telemetria e Biomarcadores na interface
      this.updateBiomarkersHUD(p.biomarkers);

      // 3. Atualiza Banner de Informações
      const cardTitle = document.getElementById('card-title');
      if (cardTitle) {
        cardTitle.textContent = `${p.name}`;
      }
      const cardDetails = document.getElementById('card-details');
      if (cardDetails) {
        cardDetails.textContent = `${p.macroDescription} Micro: ${p.microDescription}`;
      }
      const cardNeurotrans = document.getElementById('card-neurotrans');
      if (cardNeurotrans) {
        cardNeurotrans.textContent = `Neurotransmissor: ${p.primaryNeurotransmitter}`;
      }
      const cardBadge = document.getElementById('card-badge');
      if (cardBadge) {
        cardBadge.textContent = p.badge;
      }

      // 4. Narração Neural IA + Tradução VLibras
      if (triggerNarration && window.MozokAINarrator) {
        window.MozokAINarrator.speak(p.audioScript, this.currentLang);
      }
    }

    // [PT-BR]: Atualiza as leituras dos biomarcadores na barra de telemetria superior.
    // [EN-US]: Updates biomarker readouts in the top telemetry bar.
    // [AI-CTX]: @llm-invariant: Updates DOM elements with proper color coding for pathology alerts.
    updateBiomarkersHUD(b) {
      if (!b) return;

      const setEl = (id, val, isWarn = false) => {
        const el = document.getElementById(id);
        if (el) {
          el.textContent = val;
          if (isWarn) {
            el.className = 'metric-val warn';
          } else {
            el.className = 'metric-val';
          }
        }
      };

      setEl('metric-prpc', b.prpc);
      setEl('metric-prpsc', b.prpsc, parseFloat(b.prpsc) > 1.0);
      setEl('metric-vacuoles', b.vacuoles, parseFloat(b.vacuoles) > 10.0);
      setEl('metric-tau', b.tau, parseInt(b.tau) > 1000);
      setEl('metric-1433', b.p1433, parseFloat(b.p1433) > 1.5);
      setEl('metric-csf', b.csfFlow);
      setEl('metric-rtquic', b.rtquic, b.rtquic.includes('POSITIVO'));
    }

    // [PT-BR]: Dispara a simulação de AVC Isquêmico ou Hemorrágico com topografia clínica exata da área clicada.
    // [EN-GB]: Triggers focal Ischaemic or Haemorrhagic Stroke simulation with exact clinical topography of clicked area.
    // [AI-CTX]: @llm-neuroscience: Simulates focal MCA/ACA/PCA branch occlusion, necrotic core + ischemic penumbra, and neurological syndrome.
    triggerFocalStrokeSimulation(coords, isHaemorrhagic = false, regionInfo = null) {
      if (!coords) return;

      this.isSimulating = true;
      this.isPaused = false;

      // 1. Aciona a lesão focal no shader do córtex e trombo arterial
      if (this.cnsAnatomy && typeof this.cnsAnatomy.triggerFocalStroke === 'function') {
        this.cnsAnatomy.triggerFocalStroke(coords, isHaemorrhagic);
      }

      // 2. Determina a topografia neurológica clínica
      let areaName = regionInfo ? (regionInfo.estrutura || regionInfo.name || 'Córtex Cerebral') : 'Córtex Cerebral Esquerdo';
      let clinicalSyndrome = '';
      let script = '';

      const x = coords[0], y = coords[1], z = coords[2];

      if (x > 3.0 && z > 1.2) {
        // Área de Broca (Giro Frontal Inferior Esquerdo BA 44/45)
        areaName = 'Área de Broca (Giro Frontal Inferior Esquerdo — BA 44/45)';
        clinicalSyndrome = 'Oclusão do ramo pré-frontal/opercular da ACM Esquerda: Afasia Expressiva de Broca (não-fluente), apraxia orofacial e paresia braquiofacial direita.';
        script = 'Acidente Vascular Cerebral focal na Área de Broca por oclusão do ramo pré-frontal da Artéria Cerebral Média Esquerda. O paciente apresenta afasia de Broca motora não-fluente, com apraxia da fala e paresia facial direita.';
      } else if (x > 3.0 && z < -0.5 && y < 1.0) {
        // Área de Wernicke (Giro Temporal Superior BA 22)
        areaName = 'Área de Wernicke (Giro Temporal Superior Esquerdo — BA 22)';
        clinicalSyndrome = 'Oclusão do ramo temporal posterior da ACM Esquerda: Afasia Receptiva de Wernicke (fluente, parafasias verbais, neologismos e anosognosia).';
        script = 'AVC isquêmico na Área de Wernicke esquerda. Observa-se afasia receptiva fluente com perda severa da compreensão verbal, jargões semânticos e anosognosia.';
      } else if (y > 2.5 && z > -1.0 && z < 1.5) {
        // Córtex Motor M1 (Giro Pré-Central)
        areaName = 'Córtex Motor Primário M1 (Giro Pré-Central Esquerdo)';
        clinicalSyndrome = 'Oclusão de ramo cortical Rolandico da ACM: Hemiplegia espástica contralateral direta (lado direito) com sinal de Babinski positivo.';
        script = 'Infarto isquêmico agudo no Córtex Motor Primário Esquerdo. Causa hemiplegia contralateral espástica e hiperreflexia profunda no hemicorpo direito.';
      } else if (z < -4.5) {
        // Córtex Visual V1 (Lobo Occipital / Sulco Calcarino)
        areaName = 'Córtex Visual Primário V1 (Sulco Calcarino Occipital)';
        clinicalSyndrome = 'Oclusão de ramos calcarinos da Artéria Cerebral Posterior (ACP): Hemianopsia homônima contralateral com preservação macular.';
        script = 'Isquemia do Córtex Visual Primário V1 por oclusão da Artéria Cerebral Posterior. O paciente evolui com hemianopsia homônima contralateral direita.';
      } else if (y < -3.5 && z < -1.5) {
        // Cerebelo
        areaName = 'Hemisfério Cerebelar / Vérmis';
        clinicalSyndrome = 'Oclusão da Artéria Cerebelar Posterior Inferior (PICA) ou AICA: Ataxia cerebelar ipsilateral, dismetria, disdiadococinesia e nistagmo.';
        script = 'Infarto cerebelar agudo por oclusão da PICA. Quadro clínico de ataxia da marcha, dismetria apendicular ipsilateral e nistagmo vestibular.';
      } else {
        areaName = `Córtex Cerebral (Coordenadas MNI [${x.toFixed(1)}, ${y.toFixed(1)}, ${z.toFixed(1)}])`;
        clinicalSyndrome = `Oclusão arterial focal com núcleo isquêmico necrótico irreversível cercado por zona de penumbra recuperável por trombólise imediata.`;
        script = `Alerta de Acidente Vascular Cerebral agudo disparado na coordenada tridimensional selecionada. Núcleo isquêmico em hipoperfusão crítica.`;
      }

      // 3. Atualiza UI e Telemetria
      const cardTitle = document.getElementById('card-title');
      if (cardTitle) cardTitle.textContent = `🚨 ${isHaemorrhagic ? 'AVC HEMORRÁGICO' : 'AVC ISQUÊMICO AGUDO'}: ${areaName}`;

      const cardDetails = document.getElementById('card-details');
      if (cardDetails) cardDetails.textContent = clinicalSyndrome;

      const cardBadge = document.getElementById('card-badge');
      if (cardBadge) cardBadge.textContent = isHaemorrhagic ? 'HEMORRAGIA AGUDA' : 'ISQUEMIA CORE + PENUMBRA';

      // 4. Modela o nível celular (falência de ATP, excitotoxicidade por Glutamato, influxo tóxico de Ca2+)
      if (this.neuralMicrocosmos && typeof this.neuralMicrocosmos.applyPathologyMode === 'function') {
        this.neuralMicrocosmos.applyPathologyMode('STROKE');
      }

      this.updateBiomarkersHUD({
        prpc: '94%',
        prpsc: '0.00',
        vacuoles: isHaemorrhagic ? '28.0%' : '19.5%',
        tau: '6800 pg/mL',
        p1433: '1.45 ng/mL',
        abeta: '1020 pg/mL',
        csfFlow: '11.2 mm/s',
        rtquic: 'NEGATIVO (Core Necrótico + Penumbra)'
      });

      // 5. Narração Neural
      if (window.MozokAINarrator) {
        window.MozokAINarrator.speak(script, this.currentLang);
      }
    }

    // [PT-BR]: Retorna o catálogo completo para navegação e documentação.
    // [EN-US]: Returns complete catalog for navigation and documentation.
    getCatalog() {
      return PATHOLOGY_CATALOG;
    }
  }

  // [PT-BR]: Exportação global do simulador de patologias.
  // [EN-US]: Global export of pathology simulator.
  // [AI-CTX]: @llm-invariant: window.PathologyEngine & window.PATHOLOGY_CATALOG available globally.
  window.PathologyEngine = PathologyEngine;
  window.PATHOLOGY_CATALOG = PATHOLOGY_CATALOG;

})(window);
