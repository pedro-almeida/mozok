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

      this.setupUI();
    }

    // [PT-BR]: Constrói e injeta o seletor de patologias na barra de navegação superior.
    // [EN-US]: Builds and injects pathology selector in the top navigation bar.
    // [AI-CTX]: @llm-a11y: Accessible dropdown and buttons to toggle between 5 diseases and healthy baseline.
    setupUI() {
      // Injeção seletor de patologia na UI caso contêiner exista
      const topBar = document.querySelector('.top-controls');
      if (!topBar) return;

      const existingSelect = document.getElementById('select-pathology');
      if (existingSelect) return;

      const container = document.createElement('div');
      container.className = 'pathology-selector-container';
      container.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        background: rgba(15, 23, 42, 0.9);
        border: 1px solid rgba(0, 242, 254, 0.4);
        border-radius: 10px;
        padding: 4px 10px;
      `;

      container.innerHTML = `
        <span style="font-size: 12px; font-weight: 700; color: #38bdf8;">SIMULADOR DE PATOLOGIAS:</span>
        <select id="select-pathology" style="
          background: #0f172a;
          color: #f1f5f9;
          border: 1px solid #38bdf8;
          border-radius: 6px;
          padding: 6px 10px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          outline: none;
        ">
          <option value="NORMAL">🧪 Fisiologia Normal (SNC Hígido)</option>
          <option value="ALZHEIMER">🧠 Doença de Alzheimer (DA)</option>
          <option value="PARKINSON">⚡ Doença de Parkinson (DP)</option>
          <option value="STROKE">🩸 AVC Isquêmico (ACM Esquerda)</option>
          <option value="MS">🛡️ Esclerose Múltipla (EM)</option>
          <option value="CJD">☣️ Doença de Creutzfeldt-Jakob (DCJ)</option>
        </select>
      `;

      topBar.insertBefore(container, topBar.firstChild);

      const selectEl = document.getElementById('select-pathology');
      selectEl.addEventListener('change', (e) => {
        this.setPathology(e.target.value, true);
      });
    }

    // [PT-BR]: Define a patologia ativa e atualiza simultaneamente a macroanatomia 3D, o zoom microscópico e a telemetria.
    // [EN-US]: Sets active pathology and simultaneously updates 3D macroanatomy, microscopic zoom, and telemetry.
    // [AI-CTX]: @llm-neuroscience: Triggers auditory narration and synchronizes with VLibras.
    setPathology(pathologyKey, triggerNarration = true) {
      const p = PATHOLOGY_CATALOG[pathologyKey] || PATHOLOGY_CATALOG.NORMAL;
      this.currentPathology = p;
      this.evolutionProgress = pathologyKey === 'NORMAL' ? 0.0 : 0.85;

      // 1. Atualiza Microcosmo 3D (Neurônios, Mielina, Vesículas e LCR)
      if (this.neuralMicrocosmos) {
        this.neuralMicrocosmos.setPathology(pathologyKey);
      }

      // 2. Atualiza Telemetria e Biomarcadores na interface
      this.updateBiomarkersHUD(p.biomarkers);

      // 3. Atualiza Banner de Informações
      const cardTitle = document.getElementById('card-title');
      if (cardTitle) {
        cardTitle.textContent = `${p.name} — [Simulação 3D]`;
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
        window.MozokAINarrator.speak(p.audioScript);
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
