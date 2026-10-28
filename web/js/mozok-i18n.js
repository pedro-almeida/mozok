// [PT-BR]: Módulo de Internacionalização (i18n) do MOZOK em 5 Idiomas (Português, Inglês Britânico, Italiano, Ucraniano Cirílico e Espanhol).
// [EN-GB]: Internationalisation (i18n) Module for MOZOK across 5 Languages (Portuguese, British English, Italian, Ukrainian Cyrillic, and Spanish).
// [AI-CTX]: @llm-context: Multi-language registry for all UI components, 31 CNS & PNS structures, 6 pathology simulation modes, and AI voice scripts.
//           @llm-invariant: Strict British English orthography (neuroanatomy, modelling, colour, organisation, centre, fibres, signalling, behaviour) and strict Ukrainian Cyrillic.

(function (window) {
  'use strict';

  const MOZOK_I18N = {
    currentLang: 'pt-BR',

    ui: {
      'pt-BR': {
        brandTitle: 'MOZOK v1.0 Beta — Atlas do Sistema Nervoso Central, SNP & Patologias',
        brandSubtitle: 'Córtex MNI152 Real | 500 Neurônios Camada V | VLibras A11y',
        btnHome: '🏠 Voltar à Visão Inicial (SNC)',
        btnDive: '🔬 Mergulhar nos Neurônios (Camada V)',
        btnReturnMacro: '🔭 Retornar ao SNC Macro',
        btnTour: '🎬 Tour Guiado IA',
        btnTourPause: '⏸ Pausar Tour',
        btnVoiceOn: '🔊 Voz IA: ON',
        btnVoiceOff: '🔈 Voz IA: OFF',
        btnFullscreen: '⛶ Tela Cheia',
        btnStartDisease: '▶ Iniciar Simulação',
        btnPauseDisease: '⏸ Pausar',
        btnResumeDisease: '▶ Retomar',
        btnResetDisease: '↺ Reiniciar SNC',
        searchPlaceholder: 'Buscar região, sulco ou função...',
        cnsStudyTitle: 'ESTUDO DO SNC COMPLETO',
        structureCount: '31 Estruturas',
        spatialResTitle: 'RESOLUÇÃO ESPACIAL',
        distLabel: 'Distância:',
        connectomeTitle: 'MICRO-CONECTOMA CAMADA V',
        connectomeBadge: '500 NEURÔNIOS',
        connectomeDesc: 'Aproxime o zoom ou clique em "Mergulhar nos Neurônios" para explorar a microscopia 3D da Camada V com neurônios piramidais âmbar, mielina e nós de Ranvier azul-elétrico.',
        btnNarrateCard: '🔊 Narrar com Libras',
        btnIsolatePiece: '🧩 Isolar Peça Real 3D',
        btnViewFullCNS: '🧠 Ver no SNC Completo',
        btnTriggerStroke: '🩸 Disparar AVC Aqui',
        btnRestoreTissue: '↺ Restaurar',
        simPathologyTitle: 'SIMULADOR DE PATOLOGIAS:',
        optNormal: '🧪 Fisiologia Normal (SNC Hígido)',
        optAlzheimer: '🧠 Doença de Alzheimer (DA)',
        optParkinson: '⚡ Doença de Parkinson (DP)',
        optStroke: '🩸 AVC Isquêmico (ACM Esquerda)',
        optMS: '🛡️ Esclerose Múltipla (EM)',
        optCJD: '☣️ Doença de Creutzfeldt-Jakob (DCJ)',
        scaleMacro: 'MACRO',
        scaleMeso: 'MESO',
        scaleMicro: 'MICRO',
        scaleMacroDesc: 'Macroanatomia completa do SNC: Telencéfalo MNI152 com sulcos, Tronco e Medula Espinhal.',
        scaleMesoDesc: 'Córtex semitransparente revelando Núcleos da Base, Tálamo Pulvinar, Hipocampo, Tronco e Medula.',
        scaleMicroDesc: 'Mergulho no Conectoma de Neurônios da Camada V: neurônios piramidais âmbar, mielina e sinapses químicas!',
        tourActiveBanner: '🎬 Tour Guiado Ativo:',
        neurotransmitterPrefix: 'Neurotransmissor:',
        clinicalPrefix: 'Correlação:'
      },
      'en-GB': {
        brandTitle: 'MOZOK v1.0 Beta — Central Nervous System Atlas & Neuropathology Simulator',
        brandSubtitle: 'Real MNI152 Cortex | Layer V Neurons | Accessible Multilingual Hub',
        btnHome: '🏠 Reset to Initial View (CNS)',
        btnDive: '🔬 Dive into Neurons (Layer V)',
        btnReturnMacro: '🔭 Return to Macro CNS',
        btnTour: '🎬 AI Guided Tour',
        btnTourPause: '⏸ Pause Tour',
        btnVoiceOn: '🔊 AI Voice: ON',
        btnVoiceOff: '🔈 AI Voice: OFF',
        btnFullscreen: '⛶ Fullscreen',
        btnStartDisease: '▶ Start Simulation',
        btnPauseDisease: '⏸ Pause',
        btnResumeDisease: '▶ Resume',
        btnResetDisease: '↺ Reset CNS',
        searchPlaceholder: 'Search region, sulcus, or function...',
        cnsStudyTitle: 'COMPLETE CNS STUDY',
        structureCount: '31 Structures',
        spatialResTitle: 'SPATIAL RESOLUTION',
        distLabel: 'Distance:',
        connectomeTitle: 'LAYER V MICRO-CONNECTOME',
        connectomeBadge: 'LAYER V',
        connectomeDesc: 'Zoom in or click "Dive into Neurons" to explore Layer V 3D microscopy featuring amber pyramidal neurons, myelin sheaths, and electric-blue Nodes of Ranvier.',
        btnNarrateCard: '🔊 Narrate Anatomy',
        btnIsolatePiece: '🧩 Isolate Real 3D Piece',
        btnViewFullCNS: '🧠 View Full CNS',
        btnTriggerStroke: '🩸 Trigger Stroke Here',
        btnRestoreTissue: '↺ Restore Tissue',
        simPathologyTitle: 'PATHOLOGY SIMULATOR:',
        optNormal: '🧪 Normal Physiology (Healthy CNS)',
        optAlzheimer: '🧠 Alzheimer’s Disease (AD)',
        optParkinson: '⚡ Parkinson’s Disease (PD)',
        optStroke: '🩸 Ischaemic Stroke (Left MCA)',
        optMS: '🛡️ Multiple Sclerosis (MS)',
        optCJD: '☣️ Creutzfeldt-Jakob Disease (CJD)',
        scaleMacro: 'MACRO',
        scaleMeso: 'MESO',
        scaleMicro: 'MICRO',
        scaleMacroDesc: 'Complete CNS macroanatomy: MNI152 telencephalon with sulcal relief, brainstem, and spinal cord.',
        scaleMesoDesc: 'Semi-transparent cortex revealing basal ganglia, pulvinar thalamus, hippocampus, brainstem, and spinal cord.',
        scaleMicroDesc: 'Deep immersion into Layer V neurons: bioluminescent amber somas and electric-blue Ranvier nodes!',
        tourActiveBanner: '🎬 Active Guided Tour:',
        neurotransmitterPrefix: 'Neurotransmitter:',
        clinicalPrefix: 'Clinical Correlation:'
      },
      'it-IT': {
        brandTitle: 'MOZOK v1.0 Beta — Atlante del Sistema Nervioso Centrale e Simulatore di Patologie',
        brandSubtitle: 'Corteccia MNI152 Reale | Neuroni Strato V | Accessibilità Totale',
        btnHome: '🏠 Torna alla Vista Iniziale (SNC)',
        btnDive: '🔬 Immergiti nei Neuroni (Strato V)',
        btnReturnMacro: '🔭 Ritorna al SNC Macro',
        btnTour: '🎬 Tour Guidato IA',
        btnTourPause: '⏸ Pausa Tour',
        btnVoiceOn: '🔊 Voce IA: ON',
        btnVoiceOff: '🔈 Voce IA: OFF',
        btnFullscreen: '⛶ Schermo Intero',
        btnStartDisease: '▶ Avvia Simulazione',
        btnPauseDisease: '⏸ Pausa',
        btnResumeDisease: '▶ Riprendi',
        btnResetDisease: '↺ Ripristina SNC',
        searchPlaceholder: 'Cerca regione, solco o funzione...',
        cnsStudyTitle: 'STUDIO COMPLETO DEL SNC',
        structureCount: '31 Strutture',
        spatialResTitle: 'RISOLUZIONE SPAZIALE',
        distLabel: 'Distanza:',
        connectomeTitle: 'MICRO-CONNETTOMA STRATO V',
        connectomeBadge: 'STRATO V',
        connectomeDesc: 'Avvicina lo zoom o fai clic su "Immergiti nei Neuroni" per esplorare la microscopia 3D dello Strato V con neuroni piramidali ambrati e nodi di Ranvier blu-elettrico.',
        btnNarrateCard: '🔊 Narra Anatomia',
        btnIsolatePiece: '🧩 Isola Pezzo 3D Reale',
        btnViewFullCNS: '🧠 Vedi SNC Completo',
        btnTriggerStroke: '🩸 Innesca Ictus Qui',
        btnRestoreTissue: '↺ Ripristina Tessuto',
        simPathologyTitle: 'SIMULATORE DI PATOLOGIE:',
        optNormal: '🧪 Fisiologia Normale (SNC Sano)',
        optAlzheimer: '🧠 Malattia di Alzheimer',
        optParkinson: '⚡ Malattia di Parkinson',
        optStroke: '🩸 Ictus Ischemico (ACM Sinistra)',
        optMS: '🛡️ Sclerosi Multipla (SM)',
        optCJD: '☣️ Malattia di Creutzfeldt-Jakob (MCJ)',
        scaleMacro: 'MACRO',
        scaleMeso: 'MESO',
        scaleMicro: 'MICRO',
        scaleMacroDesc: 'Macroanatomia completa del SNC: telencefalo MNI152 con solchi, tronco encefalico e midollo spinale.',
        scaleMesoDesc: 'Corteccia semitrasparente che rivela nuclei della base, talamo pulvinar, ippocampo e tronco.',
        scaleMicroDesc: 'Immersione nel connettoma di neuroni dello Strato V con nodi di Ranvier blu-elettrico!',
        tourActiveBanner: '🎬 Tour Guidato Attivo:',
        neurotransmitterPrefix: 'Neurotrasmettitore:',
        clinicalPrefix: 'Correlazione Clinica:'
      },
      'uk-UA': {
        brandTitle: 'МОЗОК v1.0 Beta — Інтерактивний 3D-атлас ЦНС та симулятор нейропатологій',
        brandSubtitle: 'Справжня кора MNI152 | Нейрони V шару | Повна доступність',
        btnHome: '🏠 Початковий вигляд (ЦНС)',
        btnDive: '🔬 Зануритися в нейрони (V шар)',
        btnReturnMacro: '🔭 Повернутися до макро ЦНС',
        btnTour: '🎬 ШІ-екскурсія',
        btnTourPause: '⏸ Пауза екскурсії',
        btnVoiceOn: '🔊 Голос ШІ: УВІМК',
        btnVoiceOff: '🔈 Голос ШІ: ВИМК',
        btnFullscreen: '⛶ Повний екран',
        btnStartDisease: '▶ Запустити симуляцію',
        btnPauseDisease: '⏸ Пауза',
        btnResumeDisease: '▶ Продовжити',
        btnResetDisease: '↺ Скинути ЦНС',
        searchPlaceholder: 'Пошук структури, борозни або функції...',
        cnsStudyTitle: 'ПОВНЕ ДОСЛІДЖЕННЯ ЦНС',
        structureCount: '31 структура',
        spatialResTitle: 'ПРОСТОРОВА РОЗДІЛЬНІСТЬ',
        distLabel: 'Відстань:',
        connectomeTitle: 'МІКРОКОНЕКТОМ V ШАРУ',
        connectomeBadge: 'V ШАР',
        connectomeDesc: 'Наблизьте масштаб або натисніть "Зануритися в нейрони", щоб дослідити 3D-мікроскопію V шару з бурштиновими пірамідними нейронами та електроблакитними вузлами Ранв’є.',
        btnNarrateCard: '🔊 Озвучити анатомію',
        btnIsolatePiece: '🧩 Ізолювати анатомічну деталь 3D',
        btnViewFullCNS: '🧠 Дивитися всю ЦНС',
        btnTriggerStroke: '🩸 Спричинити інсульт тут',
        btnRestoreTissue: '↺ Відновити тканину',
        simPathologyTitle: 'СИМУЛЯТОР ПАТОЛОГІЙ:',
        optNormal: '🧪 Нормальна фізіологія (Здорова ЦНС)',
        optAlzheimer: '🧠 Хвороба Альцгеймера',
        optParkinson: '⚡ Хвороба Паркінсона',
        optStroke: '🩸 Ішемічний інсульт (Ліва СМА)',
        optMS: '🛡️ Розсіяний склероз',
        optCJD: '☣️ Хвороба Кройцфельда-Якоба (ХКЯ)',
        scaleMacro: 'МАКРО',
        scaleMeso: 'МЕЗО',
        scaleMicro: 'МІКРО',
        scaleMacroDesc: 'Повна макроанатомія ЦНС: кора MNI152 з борознами, стовбур мозку та спинний мозок.',
        scaleMesoDesc: 'Напівпрозора кора відкриває базальні ядра, таламус, гіпокамп та стовбур мозку.',
        scaleMicroDesc: 'Занурення в конектом нейронів V шару: бурштинова біолюмінесценція та вузли Ранв’є!',
        tourActiveBanner: '🎬 Активна екскурсія:',
        neurotransmitterPrefix: 'Нейромедіатор:',
        clinicalPrefix: 'Клінічна кореляція:'
      },
      'es-ES': {
        brandTitle: 'MOZOK v1.0 Beta — Atlas del Sistema Nervioso Central y Simulador de Patologías',
        brandSubtitle: 'Corteza MNI152 Real | Neuronas Capa V | Accesibilidad Total',
        btnHome: '🏠 Volver a la Vista Inicial (SNC)',
        btnDive: '🔬 Sumergirse en las Neuronas (Capa V)',
        btnReturnMacro: '🔭 Regresar al SNC Macro',
        btnTour: '🎬 Tour Guiado IA',
        btnTourPause: '⏸ Pausar Tour',
        btnVoiceOn: '🔊 Voz IA: ON',
        btnVoiceOff: '🔈 Voz IA: OFF',
        btnFullscreen: '⛶ Pantalla Completa',
        btnStartDisease: '▶ Iniciar Simulación',
        btnPauseDisease: '⏸ Pausar',
        btnResumeDisease: '▶ Reanudar',
        btnResetDisease: '↺ Reiniciar SNC',
        searchPlaceholder: 'Buscar región, surco o función...',
        cnsStudyTitle: 'ESTUDIO DEL SNC COMPLETO',
        structureCount: '31 Estructuras',
        spatialResTitle: 'RESOLUCIÓN ESPACIAL',
        distLabel: 'Distancia:',
        connectomeTitle: 'MICRO-CONECTOMA CAPA V',
        connectomeBadge: 'CAPA V',
        connectomeDesc: 'Acerque el zoom o haga clic en "Sumergirse en las Neuronas" para explorar la microscopía 3D de la Capa V con neuronas piramidales ámbar y nódulos de Ranvier azul eléctrico.',
        btnNarrateCard: '🔊 Narrar Anatomía',
        btnIsolatePiece: '🧩 Aislar Pieza Real 3D',
        btnViewFullCNS: '🧠 Ver SNC Completo',
        btnTriggerStroke: '🩸 Disparar Ictus Aquí',
        btnRestoreTissue: '↺ Restaurar Tejido',
        simPathologyTitle: 'SIMULADOR DE PATOLOGÍAS:',
        optNormal: '🧪 Fisiología Normal (SNC Sano)',
        optAlzheimer: '🧠 Enfermedad de Alzheimer',
        optParkinson: '⚡ Enfermedad de Parkinson',
        optStroke: '🩸 Ictus Isquémico (ACM Izquierda)',
        optMS: '🛡️ Esclerosis Múltiple (EM)',
        optCJD: '☣️ Enfermedad de Creutzfeldt-Jakob (ECJ)',
        scaleMacro: 'MACRO',
        scaleMeso: 'MESO',
        scaleMicro: 'MICRO',
        scaleMacroDesc: 'Macroanatomía completa del SNC: telencéfalo MNI152 con surcos, tronco encefálico y médula espinal.',
        scaleMesoDesc: 'Corteza semitransparente que revela núcleos basales, tálamo pulvinar, hipocampo y tronco.',
        scaleMicroDesc: 'Inmersión en el conectoma de 500 neuronas de la Capa V con nódulos de Ranvier azul eléctrico!',
        tourActiveBanner: '🎬 Tour Guiado Activo:',
        neurotransmitterPrefix: 'Neurotransmisor:',
        clinicalPrefix: 'Correlación Clínica:'
      }
    },

    // 22 Estructuras Anatómicas validadas científicamente,

    structures: {
      1: {
        'pt-BR': {
          name: 'Sistema Nervoso Central Completo (Encéfalo + Medula Espinhal)',
          category: 'VISÃO GLOBAL',
          functionText: 'Comando global, integração sensitivo-motora, homeostase autônoma, cognição superior, linguagem e consciência.',
          clinicalText: 'Acometimento difuso em encefalopatias espongiformes (DCJ), leucoencefalopatias, esclerose múltipla e choque neurogênico.',
          neurotransmitter: 'Sistema integrado polissináptico (Glutamato, GABA, Dopamina, Serotonina, Acetilcolina)',
          audioScript: 'Você está contemplando a totalidade do Sistema Nervoso Central Humano: o encéfalo esculpido a partir da média MNI152, diencéfalo, tronco encefálico, cerebelo anatômico e a medula espinhal contínua descendo até a cauda equina.'
        },
        'en-GB': {
          name: 'Complete Central Nervous System (Brain & Spinal Cord)',
          category: 'GLOBAL VIEW',
          functionText: 'Global somatic command, sensorimotor integration, autonomic homeostasis, higher cognition, language, and consciousness.',
          clinicalText: 'Diffuse involvement in prion spongiform encephalopathies (CJD), leukoencephalopathies, multiple sclerosis, and neurogenic shock.',
          neurotransmitter: 'Integrated polysynaptic signalling (Glutamate, GABA, Dopamine, Serotonin, Acetylcholine)',
          audioScript: 'You are contemplating the totality of the Human Central Nervous System: the encephalon sculpted from MNI152 coordinates, diencephalon, brainstem, cerebellar folia, and the continuous spinal cord descending to the cauda equina.'
        },
        'it-IT': {
          name: 'Sistema Nervoso Centrale Completo (Encefalo + Midollo Spinale)',
          category: 'VISIONE GLOBALE',
          functionText: 'Comando globale, integrazione sensitivo-motoria, omeostasi autonoma, cognizione superiore, linguaggio e coscienza.',
          clinicalText: 'Coinvolgimento diffuso in encefalopatie spongiformi (MCJ), leucoencefalopatie, sclerosi multipla e shock neurogeno.',
          neurotransmitter: 'Sistema integrato polisinaptico (Glutammato, GABA, Dopamina, Serotonina, Acetilcolina)',
          audioScript: 'State osservando la totalità del Sistema Nervoso Centrale Umano: l encefalo scolpito sulla media MNI152, diencefalo, tronco encefalico, cervelletto e il midollo spinale continuo fino alla cauda equina.'
        },
        'uk-UA': {
          name: 'Центральна нервова система (Головний та спинний мозок)',
          category: 'ЗАГАЛЬНИЙ ОГЛЯД',
          functionText: 'Глобальне керування, сенсомоторна інтеграція, автономний гомеостаз, вища когніція, мовлення та свідомість.',
          clinicalText: 'Дифузне ураження при спонгіформних енцефалопатіях (ХКЯ), лейкоенцефалопатіях, розсіяному склерозі та шоку.',
          neurotransmitter: 'Полісинаптична система (глутамат, ГАМК, дофамін, серотонін, ацетилхолін)',
          audioScript: 'Перед вами повна центральна нервова система людини: головний мозок у системі координат MNI152, діенцефалон, стовбур мозку, мозочок та спинний мозок.'
        },
        'es-ES': {
          name: 'Sistema Nervioso Central Completo (Encéfalo + Médula Espinal)',
          category: 'VISIÓN GLOBAL',
          functionText: 'Mando global, integración sensitivo-motora, homeostasis autónoma, cognición superior, lenguaje y consciencia.',
          clinicalText: 'Afectación difusa en encefalopatías espongiformes (ECJ), leucoencefalopatías, esclerosis múltiple y shock neurogénico.',
          neurotransmitter: 'Sistema integrado polisináptico (Glutamato, GABA, Dopamina, Serotonina, Acetilcolina)',
          audioScript: 'Está contemplando la totalidad del Sistema Nervioso Central Humano: el encéfalo esculpido a partir del promedio MNI152, diencéfalo, tronco encefálico, cerebelo y la médula espinal continua hasta la cauda equina.'
        }
      },
      2: {
        'pt-BR': {
          name: 'Córtex Pré-Frontal Dorsolateral Esquerdo (DLPFC — BA 9/46)',
          category: 'TELENCÉFALO',
          functionText: 'Funções executivas centrais, memória operacional de trabalho, planejamento abstrato e flexibilidade cognitiva.',
          clinicalText: 'Síndrome disexecutiva, apatia, déficit de atenção sustentada e comprometimento precoce na demência.',
          neurotransmitter: 'Dopamina (receptores D1 mesocorticais) e L-Glutamato córtico-cortical',
          audioScript: 'O Córtex Pré-Frontal Dorsolateral Esquerdo orquestra o planejamento superior e o raciocínio executivo, inibindo respostas automáticas e mantendo metas cognitivas ativas.'
        },
        'en-GB': {
          name: 'Left Dorsolateral Prefrontal Cortex (DLPFC — BA 9/46)',
          category: 'TELENCEPHALON',
          functionText: 'Central executive functions, working memory, abstract planning, and cognitive flexibility.',
          clinicalText: 'Dysexecutive syndrome, apathy, working memory deficits, and early executive decline in neurodegeneration.',
          neurotransmitter: 'Dopamine (mesocortical D1 receptors) and corticocortical L-Glutamate',
          audioScript: 'The Left Dorsolateral Prefrontal Cortex orchestrates higher executive planning and logical reasoning, suppressing prepotent responses and maintaining working memory.'
        },
        'it-IT': {
          name: 'Corteccia Prefrontale Dorsolaterale Sinistra (DLPFC — BA 9/46)',
          category: 'TELENCEFALO',
          functionText: 'Funzioni esecutive centrali, memoria di lavoro, pianificazione astratta e flessibilità cognitiva.',
          clinicalText: 'Sindrome disesecutiva, apatia, deficit attentivi e decadimento cognitivo precoce.',
          neurotransmitter: 'Dopamina (recettori D1 mesocorticali) e L-Glutammato cortico-corticale',
          audioScript: 'La Corteccia Prefrontale Dorsolaterale Sinistra coordina la pianificazione superiore e il ragionamento logico, inibendo risposte automatiche.'
        },
        'uk-UA': {
          name: 'Ліва дорсолатеральна префронтальна кора (DLPFC — BA 9/46)',
          category: 'КІНЦЕВИЙ МОЗОК',
          functionText: 'Вищі виконавчі функції, робоча пам’ять, абстрактне планування та когнітивна гнучкість.',
          clinicalText: 'Дисексекутивний синдром, апатія, втрата робочої пам’яті при деменціях.',
          neurotransmitter: 'Дофамін (D1-рецептори) та глутамат',
          audioScript: 'Ліва дорсолатеральна префронтальна кора координує стратегічне мислення, робочу пам ять та придушення імпульсивних дій.'
        },
        'es-ES': {
          name: 'Corteza Prefrontal Dorsolateral Izquierda (DLPFC — BA 9/46)',
          category: 'TELENCÉFALO',
          functionText: 'Funciones ejecutivas centrales, memoria de trabajo operativa, planificación abstracta y flexibilidad cognitiva.',
          clinicalText: 'Síndrome disejecutivo, apatía, déficit de atención sostenida y deterioro precoz en demencias.',
          neurotransmitter: 'Dopamina (receptores D1 mesocorticales) y L-Glutamato córtico-cortical',
          audioScript: 'La Corteza Prefrontal Dorsolateral Izquierda orquesta la planificación superior y el razonamiento ejecutivo, manteniendo las metas cognitivas activas.'
        }
      },
      3: {
        'pt-BR': {
          name: 'Área de Broca (Giro Frontal Inferior Esquerdo — BA 44/45)',
          category: 'TELENCÉFALO',
          functionText: 'Programação motora da fala, articulação fonológica e processamento morfossintático da linguagem verbal.',
          clinicalText: 'Afasia motora não-fluente de Broca com preservação relativa da compreensão; território vascular crítico da ACM.',
          neurotransmitter: 'Acetilcolina modulada por GABA e Glutamato',
          audioScript: 'A Área de Broca, situada estritamente no hemisfério esquerdo anatômico nos giros opercular e triangular, converte formulações linguísticas abstratas em comandos motores coordenados para as pregas vocais e lábios.'
        },
        'en-GB': {
          name: 'Broca’s Area (Left Inferior Frontal Gyrus — BA 44/45)',
          category: 'TELENCEPHALON',
          functionText: 'Motor speech programming, phonological articulation, and morphosyntactic linguistic processing.',
          clinicalText: 'Broca non-fluent motor aphasia with agrammatism; hallmark lesion site of left middle cerebral artery infarction.',
          neurotransmitter: 'Acetylcholine modulated by local GABA and Glutamate',
          audioScript: 'Broca’s Area, situated strictly in the anatomical left hemisphere within the pars opercularis and triangularis, translates linguistic concepts into coordinated orofacial motor articulation.'
        },
        'it-IT': {
          name: 'Area di Broca (Giro Frontale Inferiore Sinistro — BA 44/45)',
          category: 'TELENCEFALO',
          functionText: 'Programmazione motoria del linguaggio parlato, articolazione fonologica e sintassi.',
          clinicalText: 'Afasia motoria non fluente di Broca con conservata comprensione; territorio della arteria cerebrale media.',
          neurotransmitter: 'Acetilcolina modulata da GABA e Glutammato',
          audioScript: 'L Area di Broca nell emisfero sinistro converte i concetti linguistici in comandi motori per la laringe, la lingua e i muscoli orofacciali.'
        },
        'uk-UA': {
          name: 'Зона Брока (Ліва нижня лобова закрутка — BA 44/45)',
          category: 'КІНЦЕВИЙ МОЗОК',
          functionText: 'Моторне програмування мовлення, артикуляція та граматична структура мови.',
          clinicalText: 'Моторна афазія Брока при інсульті в басейні лівої середньої мозкової артерії.',
          neurotransmitter: 'Ацетилхолін, ГАМК та глутамат',
          audioScript: 'Зона Брока в лівій півкулі перетворює мовні образи на скоординовані рухи голосових зв язок, язика та губ.'
        },
        'es-ES': {
          name: 'Área de Broca (Giro Frontal Inferior Izquierdo — BA 44/45)',
          category: 'TELENCÉFALO',
          functionText: 'Programación motora del habla, articulación fonológica y procesamiento sintáctico del lenguaje.',
          clinicalText: 'Afasia motora no fluente de Broca; territorio vascular crítico de la arteria cerebral media izquierda.',
          neurotransmitter: 'Acetilcolina modulada por GABA y Glutamato',
          audioScript: 'El Área de Broca en el hemisferio izquierdo convierte las formulaciones lingüísticas en comandos motores coordinados para las cuerdas vocales y la boca.'
        }
      },
      4: {
        'pt-BR': {
          name: 'Córtex Motor Primário M1 (Giro Pré-Central Esquerdo — BA 4)',
          category: 'TELENCÉFALO',
          functionText: 'Origem do Trato Corticoespinhal lateral, comando motor voluntário fracionado com organização somatotópica de Penfield.',
          clinicalText: 'Hemiplegia espástica contralateral no AVC de ACM ou TCE; mioclonias corticais na DCJ.',
          neurotransmitter: 'L-Glutamato excitatório nas células piramidais gigantes de Betz',
          audioScript: 'O Giro Pré-Central Esquerdo abriga o Córtex Motor Primário. Aqui residem os neurônios piramidais de Betz da Camada V, cujos axônios descem ininterruptamente pela cápsula interna até a medula espinhal.'
        },
        'en-GB': {
          name: 'Primary Motor Cortex M1 (Left Precentral Gyrus — BA 4)',
          category: 'TELENCEPHALON',
          functionText: 'Origin of lateral corticospinal tract, fractionated voluntary motor execution with Penfield somatotopy.',
          clinicalText: 'Contralateral spastic hemiplegia following MCA ischaemic stroke; cortical myoclonus in CJD.',
          neurotransmitter: 'Excitatory L-Glutamate in giant Betz pyramidal projection neurons',
          audioScript: 'The Left Precentral Gyrus accommodates the Primary Motor Cortex. Layer V giant Betz pyramidal neurons project their long myelinated axons directly through the internal capsule into the spinal cord.'
        },
        'it-IT': {
          name: 'Corteccia Motoria Primaria M1 (Giro Precentrale Sinistro — BA 4)',
          category: 'TELENCEFALO',
          functionText: 'Origine del fascio piramidale cortico-spinale, motilità volontaria frazionata (homunculus motorio).',
          clinicalText: 'Emiplegia spastica controlaterale in ictus ischemico o trauma; mioclonie corticali nella MCJ.',
          neurotransmitter: 'L-Glutammato eccitatorio nei neuroni piramidali giganti di Betz',
          audioScript: 'Il Giro Precentrale Sinistro ospita la Corteccia Motoria Primaria M1, le cui cellule piramidali dello Strato V inviano assoni mielinizzati al midollo spinale.'
        },
        'uk-UA': {
          name: 'Первинна моторна кора M1 (Ліва прецентральна закрутка — BA 4)',
          category: 'КІНЦЕВИЙ МОЗОК',
          functionText: 'Початок пірамідного шляху, довільні рухи м язів тіла (моторний гомункулус Пенфілда).',
          clinicalText: 'Контралатеральна спастична геміплегія при інсультах; кіркові міоклонії при ХКЯ.',
          neurotransmitter: 'L-Глутамат у гігантських клітинах Беца',
          audioScript: 'Прецентральна закрутка лівої півкулі містить первинну моторну кору з гігантськими клітинами Беца V шару, що керують рухами протилежної половини тіла.'
        },
        'es-ES': {
          name: 'Corteza Motora Primaria M1 (Giro Precentral Izquierdo — BA 4)',
          category: 'TELENCÉFALO',
          functionText: 'Origen del haz corticoespinal lateral, ejecución motora voluntaria fina (homúnculo motor de Penfield).',
          clinicalText: 'Hemiplejía espástica contralateral en ictus isquémico; mioclonías corticales en la ECJ.',
          neurotransmitter: 'L-Glutamato excitador en neuronas piramidales de Betz',
          audioScript: 'El Giro Precentral Izquierdo aloja la Corteza Motora Primaria M1. Las neuronas piramidales de Betz de la Capa V proyectan axones mielinizados hacia la médula espinal.'
        }
      },
      5: {
        'pt-BR': {
          name: 'Córtex Somatossensorial Primário S1 (Giro Pós-Central Esquerdo — BA 3/1/2)',
          category: 'TELENCÉFALO',
          functionText: 'Mapeamento somatotópico contralateral de tato epicrítico, dor, temperatura e propriocepção consciente.',
          clinicalText: 'Hipoestesia/anestesia contralateral, astereognosia e parestesias em lesões isquêmicas parietais.',
          neurotransmitter: 'L-Glutamato córtico-talâmico e interneurônios inibitórios GABAérgicos',
          audioScript: 'O Giro Pós-Central Esquerdo recebe pelo leminisco medial e trato espinotalâmico todas as sensações do corpo contralateral mapeadas no homúnculo sensitivo.'
        },
        'en-GB': {
          name: 'Primary Somatosensory Cortex S1 (Left Postcentral Gyrus — BA 3/1/2)',
          category: 'TELENCEPHALON',
          functionText: 'Contralateral somatotopic mapping of discriminative touch, nociception, temperature, and conscious proprioception.',
          clinicalText: 'Contralateral hemi-hypaesthesia, astereognosis, and sensory ataxia in parietal lesions.',
          neurotransmitter: 'Thalamocortical L-Glutamate and GABAergic lateral inhibition',
          audioScript: 'The Left Postcentral Gyrus decodes ascending sensory signals from the medial lemniscus and spinothalamic tracts, mapped across Penfield’s sensory homunculus.'
        },
        'it-IT': {
          name: 'Corteccia Somatosensoriale Primaria S1 (Giro Postcentrale Sinistro — BA 3/1/2)',
          category: 'TELENCEFALO',
          functionText: 'Mappatura somatotopica di tatto fine, dolore, temperatura e propriocezione cosciente.',
          clinicalText: 'Ipoestesia controlaterale, astereognosia e atassia sensitiva in lesioni parietali.',
          neurotransmitter: 'L-Glutammato talamo-corticale e inibizione laterale GABAergica',
          audioScript: 'Il Giro Postcentrale Sinistro riceve dal lemnisco mediale e dal fascio spino-talamico le sensazioni corporee controlaterali.'
        },
        'uk-UA': {
          name: 'Первинна соматосенсорна кора S1 (Ліва постцентральна закрутка — BA 3/1/2)',
          category: 'КІНЦЕВИЙ МОЗОК',
          functionText: 'Соматотопічна дискримінація дотику, болю, температури та свідомої пропріоцепції.',
          clinicalText: 'Контралатеральна гемігіпестезія, астереогноз та сенсорна атаксія при ішемії.',
          neurotransmitter: 'Глутамат та ГАМК-гальмування',
          audioScript: 'Постцентральна закрутка лівої півкулі аналізує соматосенсорні стимули від протилежної половини тіла через таламокортикальні проекції.'
        },
        'es-ES': {
          name: 'Corteza Somatosensorial Primaria S1 (Giro Poscentral Izquierdo — BA 3/1/2)',
          category: 'TELENCÉFALO',
          functionText: 'Mapeo somatotópico contralateral de tacto fino, dolor, temperatura y propiocepción consciente.',
          clinicalText: 'Hipoestesia contralateral, astereognosia y parestesias en lesiones isquémicas parietales.',
          neurotransmitter: 'L-Glutamato córtico-talámico e interneuronas GABAérgicas',
          audioScript: 'El Giro Poscentral Izquierdo recibe por el lemnisco medial y el tracto espinotalámico todas las sensaciones corporales contralaterales.'
        }
      },
      6: {
        'pt-BR': {
          name: 'Área de Wernicke e Fascículo Arqueado (Giro Temporal Superior Esquerdo — BA 22)',
          category: 'TELENCÉFALO',
          functionText: 'Decodificação fonológica auditiva, semântica lexical da linguagem e condução arqueada para Broca.',
          clinicalText: 'Afasia fluente de Wernicke (jargonafasia com anosognosia) ou afasia de condução por lesão do fascículo arqueado.',
          neurotransmitter: 'Glutamato e GABA em circuitos córtico-talâmicos auditivos',
          audioScript: 'A Área de Wernicke no hemisfério esquerdo interpreta os fonemas e o sentido semântico da fala, projetando axônios myelinizados até Broca através do fascículo arqueado.'
        },
        'en-GB': {
          name: 'Wernicke’s Area & Arcuate Fasciculus (Left Superior Temporal Gyrus — BA 22)',
          category: 'TELENCEPHALON',
          functionText: 'Phonological comprehension, lexical semantic processing, and arcuate transmission to Broca’s area.',
          clinicalText: 'Fluent Wernicke aphasia with severe receptive impairment and anosognosia; conduction aphasia from arcuate disruption.',
          neurotransmitter: 'Glutamate and GABA in audiocortical networks',
          audioScript: 'Wernicke’s Area in the posterior superior temporal gyrus comprehends spoken phonemes and projects dense myelinated pathways through the arcuate fasciculus forward to Broca’s area.'
        },
        'it-IT': {
          name: 'Area di Wernicke e Fascicolo Arcuato (Giro Temporale Superiore Sinistro — BA 22)',
          category: 'TELENCEFALO',
          functionText: 'Comprensione fonologica, semantica del linguaggio e connessione con l area di Broca.',
          clinicalText: 'Afasia fluente di Wernicke con anosognosia e afasia di conduzione per lesione del fascicolo arcuato.',
          neurotransmitter: 'Glutammato e GABA nei circuiti cortico-talamici uditivi',
          audioScript: 'L Area di Wernicke nel giro temporale superiore sinistro decodifica i suoni del linguaggio e si proietta a Broca tramite il fascicolo arcuato.'
        },
        'uk-UA': {
          name: 'Зона Верніке та дугоподібний пучок (Ліва верхня скронева закрутка — BA 22)',
          category: 'КІНЦЕВИЙ МОЗОК',
          functionText: 'Сприйняття мовлення, фонематичний аналіз та зв’язок із зоною Брока через дугоподібний пучок.',
          clinicalText: 'Сенсорна афазія Верніке (мовна безладність із порушенням розуміння) та провідникова афазія.',
          neurotransmitter: 'Глутамат та ГАМК у слухових мережах',
          audioScript: 'Зона Верніке в задній частині верхньої скроневої закрутки відповідає за розуміння почутого мовлення та передає сигнали до зони Брока.'
        },
        'es-ES': {
          name: 'Área de Wernicke y Fascículo Arqueado (Giro Temporal Superior Izquierdo — BA 22)',
          category: 'TELENCÉFALO',
          functionText: 'Decodificación fonológica auditiva, semántica del lenguaje y conducción hacia el área de Broca.',
          clinicalText: 'Afasia sensitiva de Wernicke (habla fluida incomprensible) y afasia de conducción por desconexión arqueada.',
          neurotransmitter: 'Glutamato y GABA en circuitos córtico-talámicos auditivos',
          audioScript: 'El Área de Wernicke en el giro temporal superior izquierdo interpreta los sonidos del lenguaje y proyecta axones densos hacia Broca mediante el fascículo arqueado.'
        }
      },
      7: {
        'pt-BR': {
          name: 'Córtex Visual Primário V1 (Sulco Calcarino Occipital — BA 17)',
          category: 'TELENCÉFALO',
          functionText: 'Mapeamento retinotópico de alta resolução, orientação de bordas, contraste espacial e disparidade binocular.',
          clinicalText: 'Hemianopsia homônima contralateral com preservação macular em AVC de Artéria Cerebral Posterior.',
          neurotransmitter: 'L-Glutamato vindo das radiações ópticas geniculocalcarinas',
          audioScript: 'No polo occipital posterior, o Córtex Visual Primário às margens do sulco calcarino decifra os impulsos elétricos originados nos fotorreceptores da retina.'
        },
        'en-GB': {
          name: 'Primary Visual Cortex V1 (Calcarine Sulcus — BA 17)',
          category: 'TELENCEPHALON',
          functionText: 'High-resolution retinotopic mapping, edge orientation, spatial contrast, and binocular disparity.',
          clinicalText: 'Contralateral homonymous hemianopia with macular sparing in posterior cerebral artery (PCA) stroke.',
          neurotransmitter: 'L-Glutamate from geniculocalcarine optic radiations',
          audioScript: 'At the posterior occipital pole, the Primary Visual Cortex bordering the calcarine sulcus decodes retinotopic input transmitted from photoreceptors via the lateral geniculate nucleus.'
        },
        'it-IT': {
          name: 'Corteccia Visiva Primaria V1 (Solco Calcarino Occipitale — BA 17)',
          category: 'TELENCEFALO',
          functionText: 'Mappatura retinotopica ad alta risoluzione di bordi, contrasto e disparità binoculare.',
          clinicalText: 'Emianopsia omonima controlaterale con risparmio maculare in ictus dell arteria cerebrale posteriore.',
          neurotransmitter: 'L-Glutammato dalle radiazioni ottiche genicolo-calcarine',
          audioScript: 'Nel polo occipitale, la Corteccia Visiva Primaria lungo il solco calcarino decifra le informazioni visive provenienti dalla retina.'
        },
        'uk-UA': {
          name: 'Первинна зорова кора V1 (Шпорна борозна потиличної частки — BA 17)',
          category: 'КІНЦЕВИЙ МОЗОК',
          functionText: 'Ретинотопічне картування високої роздільності, орієнтація контурів, контраст та бінокулярний зір.',
          clinicalText: 'Контралатеральна гомонімна геміанопсія зі збереженням макулярного зору при інсульті задньої мозкової артерії.',
          neurotransmitter: 'Глутамат із зорової променистості',
          audioScript: 'У потиличній частці навколо шпорної борозни первинна зорова кора розшифровує оптичні сигнали від сітківки ока.'
        },
        'es-ES': {
          name: 'Corteza Visual Primaria V1 (Surco Calcarino Occipital — BA 17)',
          category: 'TELENCÉFALO',
          functionText: 'Mapeo retinotópico de alta resolución, orientación de bordes, contraste espacial y disparidad binocular.',
          clinicalText: 'Hemianopsia homónima contralateral con preservación macular en ictus de arteria cerebral posterior.',
          neurotransmitter: 'L-Glutamato de las radiaciones ópticas geniculocalcarinas',
          audioScript: 'En el polo occipital, la Corteza Visual Primaria en los márgenes del surco calcarino descifra la información óptica procedente de la retina.'
        }
      },
      8: {
        'pt-BR': {
          name: 'Córtex Auditivo Primário A1 (Giros Transversos de Heschl — BA 41/42)',
          category: 'TELENCÉFALO',
          functionText: 'Mapeamento tonotópico coclear, discriminação de frequências acústicas e sincronização binaural.',
          clinicalText: 'Agnosia auditiva cortical, perda de discriminação fonética e alucinações sonoras temporais.',
          neurotransmitter: 'L-Glutamato excitatório e GABA em inibição lateral',
          audioScript: 'Profundo ao sulco lateral, o giro transverso anterior de Heschl processa as frequências acústicas com arquitetura tonotópica precisa.'
        },
        'en-GB': {
          name: 'Primary Auditory Cortex A1 (Transverse Heschl’s Gyri — BA 41/42)',
          category: 'TELENCEPHALON',
          functionText: 'Cochlear tonotopic representation, acoustic frequency discrimination, and binaural temporal gating.',
          clinicalText: 'Cortical auditory agnosia, word deafness, and central auditory processing deficits.',
          neurotransmitter: 'Excitatory L-Glutamate and GABAergic lateral inhibition',
          audioScript: 'Buried deep within the lateral sulcus, Heschl’s transverse gyrus maps acoustic frequencies with rigorous tonotopic fidelity.'
        },
        'it-IT': {
          name: 'Corteccia Uditiva Primaria A1 (Giri di Heschl — BA 41/42)',
          category: 'TELENCEFALO',
          functionText: 'Mappatura tonotopica cocleare, discriminazione delle frequenze sonore e localizzazione binaurale.',
          clinicalText: 'Agnosia uditiva corticale, sordità verbale pura e allucinazioni uditive.',
          neurotransmitter: 'L-Glutammato e inibizione laterale GABAergica',
          audioScript: 'Nel profondo del solco laterale, il giro di Heschl elabora le frequenze sonore con organizzazione tonotopica millimetrica.'
        },
        'uk-UA': {
          name: 'Первинна слухова кора A1 (Поперечні закрутки Гешля — BA 41/42)',
          category: 'КІНЦЕВИЙ МОЗОК',
          functionText: 'Тонотопічна організація равлика, розпізнавання частот звуку та бінауральна локалізація.',
          clinicalText: 'Кіркова слухова агнозія, чиста мовна глухота при двобічних ураженнях.',
          neurotransmitter: 'Глутамат та ГАМК',
          audioScript: 'У глибині латеральної борозни закрутки Гешля аналізують частотний спектр звуків із високою тонотопічною точністю.'
        },
        'es-ES': {
          name: 'Corteza Auditiva Primaria A1 (Giros de Heschl — BA 41/42)',
          category: 'TELENCÉFALO',
          functionText: 'Mapeo tonotópico coclear, discriminación de frecuencias sonoras y localización binaural.',
          clinicalText: 'Agnosia auditiva cortical, sordera verbal pura y alucinaciones sonoras temporales.',
          neurotransmitter: 'L-Glutamato excitador e inhibición lateral por GABA',
          audioScript: 'Profundo al surco lateral, el giro transverso de Heschl procesa las frecuencias de audio con arquitectura tonotópica precisa.'
        }
      },
      9: {
        'pt-BR': {
          name: 'Córtex da Ínsula Esquerda (Profunda ao Sulco Lateral de Sylvius)',
          category: 'TELENCÉFALO',
          functionText: 'Integração interoceptiva viscero-sensorial, percepção gustativa, empatia social e homeostase autonômica.',
          clinicalText: 'Disautonomia neurovegetativa, agnosia gustativa e perda da consciência somática de dor.',
          neurotransmitter: 'GABA, Serotonina e Neuropeptídeos autonômicos',
          audioScript: 'A Ínsula, oculta sob os opérculos frontal, parietal e temporal, é o centro da percepção visceral, da interocepção e do processamento emocional consciente.'
        },
        'en-GB': {
          name: 'Left Insular Cortex (Deep to the Sylvian Lateral Sulcus)',
          category: 'TELENCEPHALON',
          functionText: 'Interoceptive viscerosensory integration, gustatory processing, empathy, and autonomic cardiac homeostasis.',
          clinicalText: 'Autonomic dysregulation, central neurogenic arrhythmia, central gustatory loss, and loss of pain empathy.',
          neurotransmitter: 'GABA, Serotonin, and autonomic neuropeptides',
          audioScript: 'The Insular Cortex, submerged beneath the frontoparietal opercula, registers physiological visceral sensations and mediates self-awareness of the bodily state.'
        },
        'it-IT': {
          name: 'Corteccia dell Insula Sinistra (Profonda al Solco Laterale di Silvio)',
          category: 'TELENCEFALO',
          functionText: 'Integrazione interocettiva viscero-sensoriale, percezione gustativa, empatia e regolazione autonomica.',
          clinicalText: 'Disautonomia neurovegetativa, perdita del gusto e alterazione dell elaborazione del dolore.',
          neurotransmitter: 'GABA, Serotonina e neuropeptidi autonomici',
          audioScript: 'L Insula integra i segnali viscerali corporei, la percezione gustativa e la consapevolezza emotiva interocettiva.'
        },
        'uk-UA': {
          name: 'Острівець (Глибоко в сильвієвій борозні лівої півкулі)',
          category: 'КІНЦЕВИЙ МОЗОК',
          functionText: 'Інтероцепція, внутрішній вісцеральний стан, смак, емпатія та автономна регуляція серця.',
          clinicalText: 'Вегетативна дисфункція, втрата смаку та порушення тілесної самосвідомості.',
          neurotransmitter: 'ГАМК, серотонін та нейропептиди',
          audioScript: 'Острівцева кора під лобово-тім яними покришками обробляє внутрішні тілесні відчуття, серцевий ритм та емоційну емпатію.'
        },
        'es-ES': {
          name: 'Corteza de la Ínsula Izquierda (Profunda al Surco Lateral de Silvio)',
          category: 'TELENCÉFALO',
          functionText: 'Integración interoceptiva viscero-sensorial, percepción gustativa, empatía social y homeostasis autonómica.',
          clinicalText: 'Disautonomía neurovegetativa, agnosia gustativa y pérdida de la consciencia somática del dolor.',
          neurotransmitter: 'GABA, Serotonina y neuropéptidos autonómicos',
          audioScript: 'La Ínsula, oculta bajo los opérculos cerebrales, es el centro de la percepción visceral, la interocepción y la empatía emocional.'
        }
      },
      10: {
        'pt-BR': {
          name: 'Lobo Parietal Superior Esquerdo (BA 7 / Área de Associação Sensitiva)',
          category: 'TELENCÉFALO',
          functionText: 'Integração sensoriomotora visuoespacial, manipulação de coordenadas espaciais e esquema corporal.',
          clinicalText: 'Apraxia ideomotora, síndrome de Balint (ataxia óptica) e déficits de navegação espacial.',
          neurotransmitter: 'Glutamato e Acetilcolina em vias córtico-parietais',
          audioScript: 'O Lobo Parietal Superior sintetiza estímulos visuais e somatossensoriais para gerar o mapa do corpo no espaço tridimensional.'
        },
        'en-GB': {
          name: 'Left Superior Parietal Lobule (BA 7 / Sensory Association)',
          category: 'TELENCEPHALON',
          functionText: 'Visuospatial sensorimotor integration, spatial coordinate transformation, and body schema representation.',
          clinicalText: 'Ideomotor apraxia, optic ataxia (Bálint’s syndrome component), and spatial construction deficits.',
          neurotransmitter: 'Glutamate and Acetylcholine in parietal networks',
          audioScript: 'The Superior Parietal Lobule synthesises visual and somatosensory coordinates to construct a dynamic three-dimensional body schema.'
        },
        'it-IT': {
          name: 'Lobulo Parietale Superiore Sinistro (BA 7 / Associazione Sensoriale)',
          category: 'TELENCEFALO',
          functionText: 'Integrazione sensorimotoria visuospaziale, manipolazione delle coordinate e schema corporeo.',
          clinicalText: 'Aprassia ideomotoria, atassia ottica e disorientamento spaziale.',
          neurotransmitter: 'Glutammato e Acetilcolina nelle vie parietali',
          audioScript: 'Il Lobulo Parietale Superiore integra stimoli visivi e somatosensoriali per guidare i movimenti nello spazio.'
        },
        'uk-UA': {
          name: 'Ліва верхня тім’яна часточка (BA 7 / Сенсорна асоціація)',
          category: 'КІНЦЕВИЙ МОЗОК',
          functionText: 'Зорово-просторова інтеграція, координація рухів у просторі та схема власного тіла.',
          clinicalText: 'Ідеомоторна апраксія, оптична атаксія та порушення просторової орієнтації.',
          neurotransmitter: 'Глутамат та ацетилхолін',
          audioScript: 'Верхня тім яна часточка поєднує зорові та тілесні відчуття, будуючи просторову карту дій.'
        },
        'es-ES': {
          name: 'Lóbulo Parietal Superior Izquierdo (BA 7 / Asociación Sensorial)',
          category: 'TELENCÉFALO',
          functionText: 'Integración sensoriomotora visuoespacial, transformación de coordenadas y esquema corporal.',
          clinicalText: 'Apraxia ideomotora, ataxia óptica y desorientación espacial.',
          neurotransmitter: 'Glutamato y Acetilcolina en vías córtico-parietales',
          audioScript: 'El Lóbulo Parietal Superior sintetiza estímulos visuales y táctiles para guiar las acciones del cuerpo en el espacio.'
        }
      },
      11: {
        'pt-BR': {
          name: 'Hipocampo (Corno de Amon CA1–CA4 e Giro Denteado)',
          category: 'SISTEMA LÍMBICO',
          functionText: 'Consolidação da memória episódica, navegação espacial através de células de lugar (place cells) e neurogênese adulta.',
          clinicalText: 'Amnésia anterógrada severa na Doença de Alzheimer (atrofia precoce de CA1/subículo), epilepsia de lobo temporal mesial.',
          neurotransmitter: 'L-Glutamato na via perfurante/musgosa e Acetilcolina septal',
          audioScript: 'O Hipocampo, situado medialmente no lobo temporal e contínuo ao fórnix, consolida memórias recentes em memórias de longo prazo e codifica a navegação espacial.'
        },
        'en-GB': {
          name: 'Hippocampus (Cornu Ammonis CA1–CA4 & Dentate Gyrus)',
          category: 'LIMBIC SYSTEM',
          functionText: 'Consolidation of declarative episodic memory, spatial cognitive mapping via place cells, and adult neurogenesis.',
          clinicalText: 'Profound anterograde amnesia in Alzheimer’s disease; hallmark site of neurofibrillary tau tangles and sclerosis.',
          neurotransmitter: 'L-Glutamate in perforant and mossy fibre pathways; septohippocampal Acetylcholine',
          audioScript: 'The Hippocampus, arching along the medial temporal lobe into the fornix, converts short-term experiences into long-term memories and generates cognitive spatial maps.'
        },
        'it-IT': {
          name: 'Ippocampo (Corno d Ammone CA1–CA4 e Giro Dentato)',
          category: 'SISTEMA LIMBICO',
          functionText: 'Consolidamento della memoria dichiarativa, navigazione spaziale tramite cellule di posizione e neurogenesi adulta.',
          clinicalText: 'Amnesia anterograda marcata nella malattia di Alzheimer; atrofia precoce di CA1 e del subicolo.',
          neurotransmitter: 'L-Glutammato nelle vie perforanti e Acetilcolina settale',
          audioScript: 'L Ippocampo nel lobo temporale mediale è essenziale per consolidare nuovi ricordi e orientarsi nello spazio tridimensionale.'
        },
        'uk-UA': {
          name: 'Гіпокамп (Амонів ріг CA1–CA4 та зубчаста закрутка)',
          category: 'ЛІМБІЧНА СИСТЕМА',
          functionText: 'Консолідація декларативної пам’яті, просторова орієнтація за допомогою клітин місця та нейрогенез.',
          clinicalText: 'Глибока антероградна амнезія при хворобі Альцгеймера; рання дегенерація поля CA1.',
          neurotransmitter: 'Глутамат у мохоподібних волокнах та ацетилхолін',
          audioScript: 'Гіпокамп у медіальній частині скроневої частки перетворює поточні враження на довготривалу пам ять.'
        },
        'es-ES': {
          name: 'Hipocampo (Cuerno de Amón CA1–CA4 y Giro Dentado)',
          category: 'SISTEMA LÍMBICO',
          functionText: 'Consolidación de la memoria episódica, navegación espacial mediante células de lugar y neurogénesis adulta.',
          clinicalText: 'Amnesia anterógrada severa en la enfermedad de Alzheimer; atrofia precoz de CA1 y esclerosis mesial temporal.',
          neurotransmitter: 'L-Glutamato en la vía perforante y Acetilcolina septal',
          audioScript: 'El Hipocampo en el lóbulo temporal medial consolida recuerdos recientes en memoria a largo plazo y codifica el mapa espacial.'
        }
      },
      12: {
        'pt-BR': {
          name: 'Complexo Amigdaloidiano (Amígdala — Núcleos BLA e CeA)',
          category: 'SISTEMA LÍMBICO',
          functionText: 'Detecção de ameaças, condicionamento aversivo ao medo, valência emocional da memória e respostas de fuga/luta.',
          clinicalText: 'Síndrome de Klüver-Bucy (hiperoralidade, docilidade extrema, ausência de medo), transtorno de estresse pós-traumático (TEPT).',
          neurotransmitter: 'GABA inibitório modulado por Noradrenalina e Serotonina',
          audioScript: 'A Amígdala, localizada logo à frente da cabeça do hipocampo, avalia instantaneamente estímulos de perigo e ativa o eixo do estresse antes mesmo da percepção consciente.'
        },
        'en-GB': {
          name: 'Amygdaloid Complex (Amygdala — BLA & CeA Nuclei)',
          category: 'LIMBIC SYSTEM',
          functionText: 'Threat detection, Pavlovian fear conditioning, emotional memory valence, and fight-or-flight autonomic arousal.',
          clinicalText: 'Klüver-Bucy syndrome (loss of fear, hyperorality), post-traumatic stress disorder, and panic circuitry overdrive.',
          neurotransmitter: 'Inhibitory GABA modulated by Noradrenaline and Serotonin',
          audioScript: 'The Amygdala, nestled rostral to the hippocampal head, acts as the brain’s sentinel, processing salient threats and triggering autonomic defense cascades.'
        },
        'it-IT': {
          name: 'Amigdala (Nuclei Basolaterale e Centrale)',
          category: 'SISTEMA LIMBICO',
          functionText: 'Elaborazione della paura, condizionamento aversivo, valenza emotiva e risposte di attacco o fuga.',
          clinicalText: 'Sindrome di Klüver-Bucy, perdita della paura, disturbi d ansia e iperreattività da stress.',
          neurotransmitter: 'GABA modulato da Noradrenalina e Serotonina',
          audioScript: 'L Amigdala valuta istantaneamente i segnali di minaccia e innesca le reazioni emotive e vegetative di allarme.'
        },
        'uk-UA': {
          name: 'Мигдалеподібне тіло (Амигдала — BLA та CeA)',
          category: 'ЛІМБІЧНА СИСТЕМА',
          functionText: 'Розпізнавання загроз, умовний рефлекс страху, емоційна валентність пам’яті та реакція "бийся або біжи".',
          clinicalText: 'Синдром Клювера-Б юсі (зникнення страху), тривожні розлади та посттравматичний стрес.',
          neurotransmitter: 'ГАМК, норадреналін та серотонін',
          audioScript: 'Мигдалеподібне тіло миттєво оцінює небезпеку в навколишньому середовищі та запускає захисні реакції організму.'
        },
        'es-ES': {
          name: 'Complejo Amigdalino (Amígdala — Núcleos BLA y CeA)',
          category: 'SISTEMA LÍMBICO',
          functionText: 'Detección de amenazas, condicionamiento del miedo, valencia emocional y respuestas de lucha o huida.',
          clinicalText: 'Síndrome de Klüver-Bucy (pérdida del miedo, hiperoralidad), trastorno por estrés postraumático (TEPT).',
          neurotransmitter: 'GABA inhibitorio modulado por Noradrenalina y Serotonina',
          audioScript: 'La Amígdala detecta estímulos de peligro y activa los circuitos del miedo y la alerta antes de la toma de consciencia.'
        }
      },
      13: {
        'pt-BR': {
          name: 'Corpo Estriado (Núcleo Caudado e Putâmen)',
          category: 'NÚCLEOS DA BASE',
          functionText: 'Porta de entrada dos gânglios da base, seleção de programas motores, aprendizado por reforço e hábitos automatizados.',
          clinicalText: 'Bradicinesia e rigidez na Doença de Parkinson; coreia de Huntington por morte de neurônios espinhosos médios GABAérgicos.',
          neurotransmitter: 'Dopamina (receptores D1 da via direta e D2 da via indireta) e GABA',
          audioScript: 'O Corpo Estriado integra os comandos motores corticais com os disparos dopaminérgicos da substância negra para autorizar ou inibir movimentos voluntários.'
        },
        'en-GB': {
          name: 'Striatum (Caudate Nucleus & Putamen)',
          category: 'BASAL GANGLIA',
          functionText: 'Input gateway to the basal ganglia, motor action selection, reinforcement learning, and habit execution.',
          clinicalText: 'Bradykinesia and rigidity in Parkinson’s disease; choreic hyperkinesia in Huntington’s disease from striatal medium spiny neuron loss.',
          neurotransmitter: 'Dopamine (D1 direct and D2 indirect pathways) and GABA',
          audioScript: 'The Striatum integrates neocortical motor intent with nigrostriatal dopaminergic tone, filtering and releasing selected voluntary actions.'
        },
        'it-IT': {
          name: 'Corpo Striato (Nucleo Caudato e Putamen)',
          category: 'NUCLEI DELLA BASE',
          functionText: 'Stazione di ingresso dei gangli della base, selezione dei programmi motori e apprendimento procedurale.',
          clinicalText: 'Bradicinesia nel Parkinson; corea di Huntington per morte dei neuroni GABAergici striatali.',
          neurotransmitter: 'Dopamina (recettori D1 e D2) e GABA',
          audioScript: 'Il Corpo Striato riceve proiezioni dalla corteccia e seleziona i movimenti desiderati bloccando quelli indesiderati.'
        },
        'uk-UA': {
          name: 'Смугасте тіло (Хвостате ядро та лушпина — Стріатум)',
          category: 'БАЗАЛЬНІ ЯДРА',
          functionText: 'Вхідна ланка базальних гангліїв, селекція рухів, закріплення навичок та підкріплення дій.',
          clinicalText: 'Брадикінезія при хворобі Паркінсона; хорея Гантінгтона внаслідок загибелі ГАМК-нейронів.',
          neurotransmitter: 'Дофамін (D1 і D2 шляхи) та ГАМК',
          audioScript: 'Стріатум аналізує моторні команди кори та за допомогою дофаміну фільтрує потрібні рухи, блокуючи зайві.'
        },
        'es-ES': {
          name: 'Cuerpo Estriado (Núcleo Caudado y Putamen)',
          category: 'NÚCLEOS DE LA BASE',
          functionText: 'Entrada de los ganglios basales, selección de actos motores, aprendizaje de hábitos y refuerzo.',
          clinicalText: 'Bradicinesia en el Parkinson; corea de Huntington por degeneración de neuronas estriatales.',
          neurotransmitter: 'Dopamina (vías D1 directa y D2 indirecta) y GABA',
          audioScript: 'El Cuerpo Estriado integra las órdenes motoras corticales con la dopamina de la sustancia negra para modular los movimientos.'
        }
      },
      14: {
        'pt-BR': {
          name: 'Globo Pálido (Segmentos Interno GPi e Externo GPe)',
          category: 'NÚCLEOS DA BASE',
          functionText: 'Principal núcleo eferente dos gânglios da base, regulação do tônus postural e controle inibitório sobre o tálamo motor (via direta vs indireta).',
          clinicalText: 'Distonia primária, atetose, discinesias induzidas por L-DOPA e alvo preferencial de Estimulação Cerebral Profunda (DBS) no Parkinson.',
          neurotransmitter: 'GABAérgico inibitório com Substância P (GPi) ou Encefalina (GPe)',
          audioScript: 'O Globo Pálido divide-se em segmento interno e externo. O GPi atua como o freio inibitório primário dos gânglios da base sobre o tálamo motor, modulando a postura e a precisão motora.'
        },
        'en-GB': {
          name: 'Globus Pallidus (Internal GPi & External GPe Segments)',
          category: 'BASAL GANGLIA',
          functionText: 'Primary output nucleus of the basal ganglia, postural tone regulation, and tonic inhibitory gating over the motor thalamus.',
          clinicalText: 'Primary dystonia, athetosis, L-DOPA-induced dyskinesias, and optimal surgical target for Deep Brain Stimulation (DBS) in Parkinson’s disease.',
          neurotransmitter: 'Inhibitory GABAergic transmission, Substance P (GPi), and Enkephalin (GPe)',
          audioScript: 'The Globus Pallidus comprises internal and external segments. GPi serves as the primary inhibitory brake of the basal ganglia upon the motor thalamus, refining posture and smooth motor execution.'
        },
        'it-IT': {
          name: 'Globo Pallido (Segmenti Interno GPi ed Esterno GPe)',
          category: 'NUCLEI DELLA BASE',
          functionText: 'Principale nucleo efferente dei gangli della base, regolazione del tono posturale e controllo inibitorio sul talamo motorio.',
          clinicalText: 'Distonia primaria, atetosi, discinesie da levodopa e bersaglio per la stimolazione cerebrale profonda (DBS) nel Parkinson.',
          neurotransmitter: 'GABAergico inibitorio con Sostanza P ed Encefalina',
          audioScript: 'Il Globo Pallido costituisce il freno inibitorio fondamentale dei gangli della base, regolando la precisione dei movimenti e la postura corporea.'
        },
        'uk-UA': {
          name: 'Бліда куля (Внутрішній GPi та зовнішній GPe сегменти)',
          category: 'БАЗАЛЬНІ ЯДРА',
          functionText: 'Головне вихідне ядро базальних гангліїв, регуляція м’язового тонусу та тонічне гальмування рухового таламуса.',
          clinicalText: 'Первинна дистонія, атетоз, леводопа-індуковані дискінезії та мішень для глибокої стимуляції мозку (DBS) при паркінсонізмі.',
          neurotransmitter: 'ГАМК-гальмування, речовина P та енкефалін',
          audioScript: 'Бліда куля ділиться на внутрішній та зовнішній сегменти, діючи як первинне гальмо рухових команд на шляху до таламуса.'
        },
        'es-ES': {
          name: 'Globo Pálido (Segmentos Interno GPi y Externo GPe)',
          category: 'NÚCLEOS DE LA BASE',
          functionText: 'Principal núcleo eferente de los ganglios basales, regulación del tono postural y freno inhibidor sobre el tálamo motor.',
          clinicalText: 'Distonía primaria, atetosis, discinesias por levodopa y diana para estimulación cerebral profunda (DBS) en Parkinson.',
          neurotransmitter: 'GABAérgico inhibitorio, Sustancia P y Encefalina',
          audioScript: 'El Globo Pálido regula la postura y la fluidez del movimiento actuando como el freno inhibidor de los ganglios basales sobre el tálamo.'
        }
      },
      15: {
        'pt-BR': {
          name: 'Corpo Caloso (Esplênio, Tronco, Joelho e Rostro)',
          category: 'SUBSTÂNCIA BRANCA',
          functionText: 'Maior comissura inter-hemisférica (~200 milhões de axônios mielinizados), transferência de informações e integração bilateral.',
          clinicalText: 'Síndrome da desconexão inter-hemisférica, apraxia da mão esquerda, agenesia de corpo caloso e calosotomia para epilepsia intratável.',
          neurotransmitter: 'L-Glutamato excitatório nas projeções axonais córtico-corticais',
          audioScript: 'O Corpo Caloso é a colossal ponte de substância branca que une os dois hemisférios cerebrais com mais de duzentos milhões de fibras axonais mielinizadas.'
        },
        'en-GB': {
          name: 'Corpus Callosum (Splenium, Body, Genu & Rostrum)',
          category: 'WHITE MATTER',
          functionText: 'Principal interhemispheric commissure (~200 million myelinated axons), interhemispheric transfer of sensorimotor and cognitive data.',
          clinicalText: 'Alien hand syndrome, callosal disconnection syndrome, agenesis of the corpus callosum, and therapeutic corpus callosotomy.',
          neurotransmitter: 'Excitatory L-Glutamate in corticocortical commissural projections',
          audioScript: 'The Corpus Callosum is the colossal white-matter bridge uniting the cerebral hemispheres with over two hundred million densely packed myelinated fibres.'
        },
        'it-IT': {
          name: 'Corpo Calloso (Splenio, Tronco, Ginocchio e Rostro)',
          category: 'SOSTANZA BIANCA',
          functionText: 'Principale commessura interemisferica con oltre 200 milioni di fibre mielinizzate per l integrazione tra i due emisferi.',
          clinicalText: 'Sindrome da disconnessione callosale, mano aliena, agenesia del corpo calloso e callosotomia chirurgica.',
          neurotransmitter: 'L-Glutammato eccitatorio nelle fibre commessurali',
          audioScript: 'Il Corpo Calloso collega i due emisferi cerebrali consentendo la condivisione istantanea di memorie, abilità e percezioni.'
        },
        'uk-UA': {
          name: 'Мозолисте тіло (Валик, стовбур, коліно та дзьоб)',
          category: 'БІЛА РЕЧОВИНА',
          functionText: 'Головна міжпівкульна комісура (понад 200 мільйонів мієлінізованих аксонів), синхронізація роботи правої та лівої півкуль.',
          clinicalText: 'Синдром розщепленого мозку (міжпівкульної дисконексії), синдром чужої руки та агенезія мозолистого тіла.',
          neurotransmitter: 'Глутамат у комісуральних шляхах',
          audioScript: 'Мозолисте тіло — це найпотужніший міст білої речовини, що об’єднує обидві півкулі мозку в єдиний злагоджений центр.'
        },
        'es-ES': {
          name: 'Cuerpo Calloso (Esplenio, Tronco, Rodilla y Rostro)',
          category: 'SUSTANCIA BLANCA',
          functionText: 'Mayor comisura interhemisférica (~200 millones de axones mielinizados) para la transferencia de información bilateral.',
          clinicalText: 'Síndrome de desconexión callosa, síndrome de la mano alienígena y agenesia del cuerpo calloso.',
          neurotransmitter: 'L-Glutamato excitador en proyecciones comisurales',
          audioScript: 'El Cuerpo Calloso es el puente de sustancia blanca más voluminoso del encéfalo, coordinando ambos hemisferios cerebrales.'
        }
      },
      16: {
        'pt-BR': {
          name: 'Tálamo (Núcleos de Relé e Pulvinar Posterior)',
          category: 'DIENCÉFALO',
          functionText: 'Estação de relé sensorial universal para o córtex, sincronização tálamo-cortical de 40 Hz e filtro atencional.',
          clinicalText: 'Sinal do taco de hóquei (hiperintensidade do pulvinar) na DCJ variante; dor talâmica central (síndrome de Dejerine-Roussy).',
          neurotransmitter: 'Glutamato córtico-talâmico e inibição pelo núcleo reticular GABAérgico',
          audioScript: 'O Tálamo atua como o grande comutador central do encéfalo. Todas as vias sensitivas — exceto o olfato — fazem sinapse nos seus núcleos antes de alcançarem a consciência cortical.'
        },
        'en-GB': {
          name: 'Thalamus (Relay Nuclei & Posterior Pulvinar)',
          category: 'DIENCEPHALON',
          functionText: 'Universal sensory and motor gating relay to cortex, 40 Hz thalamocortical synchrony, and attentional focus.',
          clinicalText: 'Hockey-stick sign (pulvinar hyperintensity) in variant CJD; Dejerine-Roussy central post-stroke thalamic pain.',
          neurotransmitter: 'Thalamocortical Glutamate and Reticular GABAergic gating',
          audioScript: 'The Thalamus functions as the brain’s grand gateway. Every sensory modality except olfaction traverses its relay nuclei before gaining conscious neocortical representation.'
        },
        'it-IT': {
          name: 'Talamo (Nuclei di Relè e Pulvinar Posteriore)',
          category: 'DIENCEFALO',
          functionText: 'Stazione di relè sensoriale universale verso la corteccia e sincronizzazione talamo-corticale a 40 Hz.',
          clinicalText: 'Segno della mazza da hockey (iperintensità del pulvinar) nella MCJ; sindrome talamica di Dejerine-Roussy.',
          neurotransmitter: 'Glutammato e inibizione GABAergica del nucleo reticolare',
          audioScript: 'Il Talamo filtra e smista tutti i segnali sensitivi verso la corteccia, coordinando i ritmi cerebrali della veglia.'
        },
        'uk-UA': {
          name: 'Таламус (Релейні ядра та задній пульвінар)',
          category: 'ПРОМІЖНИЙ МОЗОК',
          functionText: 'Головна релейна станція всіх видів чутливості (крім нюху) та таламокортикальна синхронізація 40 Гц.',
          clinicalText: 'Симптом хокейної ключки (гіперінтенсивність пульвінара) при ХКЯ; центральний таламичний біль.',
          neurotransmitter: 'Глутамат та ГАМК-гальмування ретикулярного ядра',
          audioScript: 'Таламус слугує головним комутатором сенсорних потоків організму, фільтруючи інформацію на шляху до кори.'
        },
        'es-ES': {
          name: 'Tálamo (Núcleos de Relevo y Pulvinar Posterior)',
          category: 'DIENCÉFALO',
          functionText: 'Estación de relevo sensorial universal a la corteza, sincronización tálamo-cortical y filtro atencional.',
          clinicalText: 'Signo del palo de hockey en la resonancia de la ECJ; dolor talámico de Dejerine-Roussy.',
          neurotransmitter: 'Glutamato tálamo-cortical y modulación GABAérgica',
          audioScript: 'El Tálamo es la gran puerta de entrada sensitiva del cerebro, relevando la información hacia la corteza consciente.'
        }
      },
      17: {
        'pt-BR': {
          name: 'Hipotálamo, Infundíbulo e Glândula Hipófise',
          category: 'DIENCÉFALO / ENDÓCRINO',
          functionText: 'Centro supremo de homeostase: termorregulação, ritmo circadiano, apetite, osmolaridade e controle do eixo endócrino.',
          clinicalText: 'Diabetes insipidus por deficit de ADH, pan-hipopituitarismo, síndrome de Cushing e desregulação neurovegetativa.',
          neurotransmitter: 'Oxitocina, Vasopressina (ADH), CRH, GnRH, TRH e Dopamina hipofisiotrópica',
          audioScript: 'O Hipotálamo e a Hipófise formam a ponte entre o sistema neural e o sistema endócrino, regulando temperatura, hormônios e equilíbrio hídrico.'
        },
        'en-GB': {
          name: 'Hypothalamus, Infundibulum & Pituitary Gland',
          category: 'DIENCEPHALON / ENDOCRINE',
          functionText: 'Master regulator of visceral homeostasis: thermoregulation, circadian pacing, appetite, and neuroendocrine axes.',
          clinicalText: 'Diabetes insipidus from vasopressin deficit, pituitary adenomas with visual chiasm compression, and hypopituitarism.',
          neurotransmitter: 'Oxytocin, Vasopressin, CRH, GnRH, TRH, and hypophysiotropic Dopamine',
          audioScript: 'The Hypothalamus and Pituitary Gland establish the master interface coupling neural signalling to systemic hormonal homeostasis, governing thirst, temperature, and endocrine glands.'
        },
        'it-IT': {
          name: 'Ipotalamo, Infundibolo e Ghiandola Ipofisi',
          category: 'DIENCEFALO / ENDOCRINO',
          functionText: 'Centro primario dell omeostasi: termoregolazione, fame, sete, ritmo sonno-veglia e controllo ormonale.',
          clinicalText: 'Diabete insipido, adenomi ipofisari con emianopsia bitemporale e disfunzioni neuroendocrine.',
          neurotransmitter: 'Ossitocina, Vasopressina, CRH, GnRH e Dopamina',
          audioScript: 'L Ipotalamo e l Ipofisi collegano il sistema nervoso con quello endocrino, orchestrando l equilibrio ormonale dell intero organismo.'
        },
        'uk-UA': {
          name: 'Гіпоталамус, лійка та гіпофіз',
          category: 'ПРОМІЖНИЙ МОЗОК / ЕНДОКРИННИЙ',
          functionText: 'Головний центр гомеостазу: терморегуляція, водний баланс, сон-неспання та керування ендокринною системою.',
          clinicalText: 'Нецукровий діабет при дефіциті вазопресину, аденоми гіпофіза з бітемпоральною геміанопсією.',
          neurotransmitter: 'Окситоцин, вазопресин, ліберини, статини та дофамін',
          audioScript: 'Гіпоталамус і гіпофіз утворюють спільний командний пункт, що контролює гормональний баланс та сталість внутрішнього середовища.'
        },
        'es-ES': {
          name: 'Hipotálamo, Infundíbulo y Glándula Hipófisis',
          category: 'DIENCÉFALO / ENDOCRINO',
          functionText: 'Centro rector de la homeostasis: termorregulación, sed, apetito, ritmo circadiano y control hormonal sistémico.',
          clinicalText: 'Diabetes insípida, adenomas hipofisarios y panhipopituitarismo.',
          neurotransmitter: 'Oxitocina, Vasopresina, CRH, GnRH y Dopamina',
          audioScript: 'El Hipotálamo y la Hipófisis conectan el sistema nervioso con el sistema endocrino, regulando las hormonas y la homeostasis visceral.'
        }
      },
      18: {
        'pt-BR': {
          name: 'Quiasma Óptico e Tratos Ópticos',
          category: 'VIA VISUAL',
          functionText: 'Decussação seletiva das fibras retinianas nasais (53% dos axônios do NC II) para garantir a visão binocular estereoscópica e tridimensional.',
          clinicalText: 'Hemianopsia bitemporal clássica por compressão de adenoma hipofisário no quiasma, neurite óptica desmielinizante na Esclerose Múltipla.',
          neurotransmitter: 'L-Glutamato excitatório nos axônios das células ganglionares da retina',
          audioScript: 'No Quiasma Óptico, as fibras originadas nas hemirretinas nasais cruzam para o lado oposto, permitindo que cada hemisfério cerebral enxergue o hemicampo visual contralateral completo.'
        },
        'en-GB': {
          name: 'Optic Chiasm & Optic Tracts',
          category: 'VISUAL PATHWAY',
          functionText: 'Selective hemidecussation of nasal retinal fibres (53% of CN II axons) establishing stereoscopic binocular vision.',
          clinicalText: 'Bitemporal hemianopia from pituitary macroadenoma compression; optic neuritis in multiple sclerosis.',
          neurotransmitter: 'Excitatory L-Glutamate in retinal ganglion cell axons',
          audioScript: 'At the Optic Chiasm, fibres originating in the nasal hemiretinae cross the midline, allowing each cerebral hemisphere to reconstruct the complete contralateral visual hemifield.'
        },
        'it-IT': {
          name: 'Chiasma Ottico e Tratti Ottici',
          category: 'VIA VISIVA',
          functionText: 'Decussazione selettiva delle fibre retiniche nasali per la visione binoculare e stereoscopica.',
          clinicalText: 'Emianopsia bitemporale per adenoma ipofisario e neurite ottica nella sclerosi multipla.',
          neurotransmitter: 'L-Glutammato dalle cellule gangliari retiniche',
          audioScript: 'Nel Chiasma Ottico le fibre nasali della retina si incrociano, permettendo al cervello di fondere le due immagini in una visione tridimensionale.'
        },
        'uk-UA': {
          name: 'Зорове перехрестя (Хіазма) та зорові тракти',
          category: 'ЗОРОВИЙ ШЛЯХ',
          functionText: 'Селективне перехрещення назальних волокон сітківки для забезпечення бінокулярного об’ємного зору.',
          clinicalText: 'Бітемпоральна гетеронімна геміанопсія при стисненні аденомою гіпофіза; неврит зорового нерва при розсіяному склерозі.',
          neurotransmitter: 'Глутамат в аксонах гангліонарних клітин',
          audioScript: 'У зоровому перехресті волокна від носових половин сітківки переходять на протилежний бік, створюючи об ємне тривимірне сприйняття світу.'
        },
        'es-ES': {
          name: 'Quiasma Óptico y Tractos Ópticos',
          category: 'VÍA VISUAL',
          functionText: 'Decusación selectiva de las fibras retinianas nasales para garantizar la visión binocular estereoscópica.',
          clinicalText: 'Hemianopsia bitemporal por compresión de adenomas hipofisarios y neuritis óptica en esclerosis múltiple.',
          neurotransmitter: 'L-Glutamato excitador en axones de las células ganglionares',
          audioScript: 'En el Quiasma Óptico las fibras nasales de la retina cruzan la línea media, permitiendo una visión estereoscópica coordinada.'
        }
      },
      19: {
        'pt-BR': {
          name: 'Sistema Ventricular Completo (Laterais, III, Aqueduto e IV Ventrículo)',
          category: 'SISTEMA LIQUÓRICO',
          functionText: 'Produção diária de ~500 mL de líquor pelos plexos corióideos, circulação crânio-caudal, flutuabilidade mecânica e drenagem glinfática.',
          clinicalText: 'Hidrocefalia obstrutiva por estenose do aqueduto de Sylvius, hidrocefalia de pressão normal (HPN: tríade de Hakim-Adams) e meningites.',
          neurotransmitter: 'Homeostase iônica liquórica (Na+, K+, Cl- e Clivagem de Neuropeptídeos)',
          audioScript: 'O Sistema Ventricular constitui a rede de câmaras internas preenchidas por líquor, garantindo a proteção mecânica, o amortecimento gravitacional e a limpeza metabólica do SNC.'
        },
        'en-GB': {
          name: 'Ventricular System (Lateral, Third, Aqueduct & Fourth Ventricles)',
          category: 'VENTRICULAR & CSF SYSTEM',
          functionText: 'Synthesis of ~500 mL/day of cerebrospinal fluid (CSF) by choroid plexuses, craniocaudal bulk flow, buoyant cushioning, and glymphatic clearance.',
          clinicalText: 'Non-communicating hydrocephalus from aqueductal stenosis; normal pressure hydrocephalus (Hakim-Adams triad); ventricular shunt failure.',
          neurotransmitter: 'Ionic cerebrospinal homeostasis (Na+, K+, Cl- transport) and glymphatic neuropeptide exchange',
          audioScript: 'The Ventricular System is the internal hydraulic chamber network lined by ependyma and choroid plexuses, producing cerebrospinal fluid that cushions the brain and clears metabolic waste.'
        },
        'it-IT': {
          name: 'Sistema Ventricolare Completo (Laterali, III, Acquedotto e IV Ventricolo)',
          category: 'SISTEMA LIQUORALE',
          functionText: 'Produzione di circa 500 mL al giorno di liquor dai plessi corioidei, protezione meccanica e drenaggio glinfatico.',
          clinicalText: 'Idrocefalo ostruttivo da stenosi dell acquedotto di Silvio, idrocefalo normoteso e meningiti.',
          neurotransmitter: 'Omeostasi idroelettrolitica del liquor',
          audioScript: 'Il Sistema Ventricolare fa circolare il liquido cefalorachidiano che protegge il cervello dai traumi e ne rimuove i cataboliti metabolici.'
        },
        'uk-UA': {
          name: 'Шлуночкова система (Бічні, III, водопровід та IV шлуночок)',
          category: 'ЛІКВОРНА СИСТЕМА',
          functionText: 'Продукція ~500 мл ліквору на добу судинними сплетеннями, амортизація та глімфатичне очищення мозку.',
          clinicalText: 'Оклюзійна гідроцефалія при стенозі сильвієвого водопроводу; нормотензивна гідроцефалія (тріада Хакіма-Адамса).',
          neurotransmitter: 'Іонний гомеостаз ліквору та нейропептиди',
          audioScript: 'Шлуночкова система утворює внутрішнє гідравлічне русло мозку, забезпечуючи механічний захист та видалення токсичних метаболітів.'
        },
        'es-ES': {
          name: 'Sistema Ventricular Completo (Laterales, III, Acueducto y IV Ventrículo)',
          category: 'SISTEMA LIQUORAL',
          functionText: 'Producción de ~500 mL diarios de LCR por los plexos coroideos, flotabilidad mecánica y aclaramiento glinfático.',
          clinicalText: 'Hidrocefalia obstructiva por estenosis del acueducto e hidrocefalia normotensiva (tríada de Hakim-Adams).',
          neurotransmitter: 'Homeostasis iónica del líquido cefalorraquídeo',
          audioScript: 'El Sistema Ventricular distribuye el líquido cefalorraquídeo amortiguando el encéfalo y depurando los desechos metabólicos.'
        }
      },
      20: {
        'pt-BR': {
          name: 'Mesencéfalo e Substância Negra (Pars Compacta)',
          category: 'TRONCO ENCEFÁLICO',
          functionText: 'Síntese de Dopamina nigroestriatal, reflexos auditivos e visuais nos colículos, e controle do tônus muscular.',
          clinicalText: 'Morte de neurônios dopaminérgicos pigmentados por neuromelanina na Doença de Parkinson; paralisia supranuclear progressiva.',
          neurotransmitter: 'Dopamina nigral e GABA da pars reticulata',
          audioScript: 'O Mesencéfalo abriga a Substância Negra, rica em neuromelanina. A perda dessas células produtoras de dopamina é a causa patológica direta da rigidez e tremor no Parkinson.'
        },
        'en-GB': {
          name: 'Midbrain & Substantia Nigra (Pars Compacta)',
          category: 'BRAINSTEM',
          functionText: 'Nigrostriatal dopaminergic synthesis, auditory/visual collicular reflexes, and locomotor motor modulation.',
          clinicalText: 'Degeneration of neuromelanin-pigmented dopaminergic neurons in Parkinson’s disease; progressive supranuclear palsy.',
          neurotransmitter: 'Dopamine (pars compacta) and GABA (pars reticulata)',
          audioScript: 'The Midbrain accommodates the Substantia Nigra. Progressive degeneration of its neuromelanin-containing dopaminergic neurons precipitates the motor triad of Parkinson’s disease.'
        },
        'it-IT': {
          name: 'Mesencefalo e Sostanza Nera (Pars Compacta)',
          category: 'TRONCO ENCEFALICO',
          functionText: 'Sintesi di dopamina nigro-striatale, riflessi oculari e uditivi nei collicoli quadrigemini.',
          clinicalText: 'Perdita dei neuroni dopaminergici nella malattia di Parkinson; paralisi sopranucleare progressiva.',
          neurotransmitter: 'Dopamina nigrale e GABA',
          audioScript: 'Nel Mesencefalo, la Sostanza Nera produce dopamina indispensabile per la fluidità e l armonia di tutti i movimenti.'
        },
        'uk-UA': {
          name: 'Середній мозок та чорна речовина (Pars Compacta)',
          category: 'СТОВБУР МОЗКУ',
          functionText: 'Синтез дофаміну для стріатума, орієнтувальні зорові та слухові рефлекси горбків чотиригорбикового тіла.',
          clinicalText: 'Загибель дофамінергічних нейронів чорної речовини при хворобі Паркінсона.',
          neurotransmitter: 'Дофамін та ГАМК',
          audioScript: 'У середньому мозку чорна речовина виробляє дофамін, дефіцит якого призводить до скутості рухів і тремору.'
        },
        'es-ES': {
          name: 'Mesencéfalo y Sustancia Negra (Pars Compacta)',
          category: 'TRONCO ENCEFÁLICO',
          functionText: 'Producción de dopamina hacia el estriado, reflejos de los colículos y control de la motilidad.',
          clinicalText: 'Degeneración de neuronas dopaminérgicas pigmentadas en la enfermedad de Parkinson.',
          neurotransmitter: 'Dopamina nigral y GABA',
          audioScript: 'El Mesencéfalo contiene la Sustancia Negra; su degeneración provoca la bradicinesia, rigidez y temblor del Parkinson.'
        }
      },
      21: {
        'pt-BR': {
          name: 'Ponte de Varólio (Protuberância Anular)',
          category: 'TRONCO ENCEFÁLICO',
          functionText: 'Conexão córtico-ponto-cerebelar, núcleos dos nervos cranianos V, VI, VII e VIII, e centro pneumotáxico respiratório.',
          clinicalText: 'Síndrome do encarceramento (Locked-in) em trombose da artéria basilar, mielinólise pontina central.',
          neurotransmitter: 'Noradrenalina (Locus Coeruleus), Glutamato e Acetilcolina',
          audioScript: 'A Ponte de Varólio possui um volumoso abaulamento ventral de fibras transversais que levam ordens motoras ao cerebelo e contém núcleos de nervos cranianos vitais.'
        },
        'en-GB': {
          name: 'Pons (Pons Varolii)',
          category: 'BRAINSTEM',
          functionText: 'Corticopontocerebellar motor relay, cranial nerve nuclei (V, VI, VII, VIII), and pneumotaxic respiratory control.',
          clinicalText: 'Locked-in syndrome following basilar artery occlusion; central pontine myelinolysis from rapid hyponatraemia correction.',
          neurotransmitter: 'Noradrenaline (Locus Coeruleus), Glutamate, and Acetylcholine',
          audioScript: 'The Pons presents a prominent ventral transverse bulge that conveys motor copies into the cerebellum and houses key cranial nerve nuclei.'
        },
        'it-IT': {
          name: 'Ponte di Varolio',
          category: 'TRONCO ENCEFALICO',
          functionText: 'Ponte cortico-cerebellare, nuclei dei nervi cranici dal V all VIII e centri del ritmo respiratorio.',
          clinicalText: 'Sindrome locked-in per occlusione dell arteria basilare; mielinolisi pontina centrale.',
          neurotransmitter: 'Noradrenalina (Locus Coeruleus), Glutammato e Acetilcolina',
          audioScript: 'Il Ponte di Varolio smista le informazioni motorie verso il cervelletto e controlla nervi cranici fondamentali per il viso e l udito.'
        },
        'uk-UA': {
          name: 'Міст (Вароліїв міст)',
          category: 'СТОВБУР МОЗКУ',
          functionText: 'Перемикання рухових сигналів кори на мозочок, ядра черепних нервів (V–VIII) та дихальний центр.',
          clinicalText: 'Синдром ізоляції ("замкненої людини") при тромбозі базилярної артерії; центральний понтинний мієліноліз.',
          neurotransmitter: 'Норадреналін (блакитна пляма), глутамат, ацетилхолін',
          audioScript: 'Вароліїв міст містить масивні поперечні волокна, які пересилають копії моторних команд до мозочка.'
        },
        'es-ES': {
          name: 'Puente de Varolio (Protuberancia Anular)',
          category: 'TRONCO ENCEFÁLICO',
          functionText: 'Conexión córtico-ponto-cerebelosa, núcleos de pares craneales (V a VIII) y centro respiratorio.',
          clinicalText: 'Síndrome de cautiverio (locked-in) por trombosis basilar; mielinólisis pontina central.',
          neurotransmitter: 'Noradrenalina (Locus Coeruleus), Glutamato y Acetilcolina',
          audioScript: 'El Puente de Varolio contiene gruesas fibras transversales que conducen la información motora al cerebelo.'
        }
      },
      22: {
        'pt-BR': {
          name: 'Bulbo (Medula Oblonga) e Decussação das Pirâmides',
          category: 'TRONCO ENCEFÁLICO',
          functionText: 'Centros vitais cardiorrespiratórios, reflexos vasomotores, deglutição, vômito e cruzamento piramidal motor.',
          clinicalText: 'Morte encefálica por herniação tonsilar no forame magno; síndrome bulbar lateral de Wallenberg.',
          neurotransmitter: 'Serotonina (Núcleos da Rafe), Noradrenalina, Dopamina e Acetilcolina',
          audioScript: 'O Bulbo é o centro da sobrevivência humana. Em sua porção anterior, as fibras motoras cruzam para o lado oposto na decussação das pirâmides, enquanto seu interior regula o coração e a respiração.'
        },
        'en-GB': {
          name: 'Medulla Oblongata & Pyramidal Decussation',
          category: 'BRAINSTEM',
          functionText: 'Vital cardiorespiratory pace-making, vasomotor tone, deglutition, vomiting reflexes, and motor decussation.',
          clinicalText: 'Brainstem death from cerebellar tonsillar herniation through the foramen magnum; Wallenberg lateral medullary syndrome.',
          neurotransmitter: 'Serotonin (Raphe Nuclei), Noradrenaline, and Acetylcholine',
          audioScript: 'The Medulla Oblongata safeguards human life. Along its ventral aspect, the pyramidal motor fibres cross to the contralateral side, whilst internal nuclei govern heartbeat and breathing.'
        },
        'it-IT': {
          name: 'Bulbo (Midollo Allungato) e Decussazione Piramidale',
          category: 'TRONCO ENCEFALICO',
          functionText: 'Centri vitali cardiorespiratori, riflessi vegetativi, deglutizione e incrocio delle fibre piramidali.',
          clinicalText: 'Morte encefalica per erniazione tonsillare; sindrome di Wallenberg per infarto della PICA.',
          neurotransmitter: 'Serotonina (Nuclei del Rafe), Noradrenalina e Acetilcolina',
          audioScript: 'Il Midollo Allungato controlla le funzioni vitali involontarie come il battito cardiaco e il respiro.'
        },
        'uk-UA': {
          name: 'Довгастий мозок та перехрест пірамід',
          category: 'СТОВБУР МОЗКУ',
          functionText: 'Життєво важливі серцево-судинний та дихальний центри, рефлекси ковтання, блювання та перехрест пірамід.',
          clinicalText: 'Зупинка дихання при вклиненні мигдаликів мозочка у великий потиличний отвір; синдром Валленберга.',
          neurotransmitter: 'Серотонін (ядра шва), норадреналін, ацетилхолін',
          audioScript: 'Довгастий мозок забезпечує автоматичну роботу серця й легень, а на його передній поверхні пірамідні шляхи переходять на протилежний бік.'
        },
        'es-ES': {
          name: 'Bulbo Raquídeo (Médula Oblongada) y Decusación Piramidal',
          category: 'TRONCO ENCEFÁLICO',
          functionText: 'Centros vitales cardiorrespiratorios, reflejos vasomotores, deglución y cruce piramidal motor.',
          clinicalText: 'Paro cardiorrespiratorio por enclavamiento tonsilar; síndrome bulbar lateral de Wallenberg.',
          neurotransmitter: 'Serotonina (Núcleos del Rafe), Noradrenalina y Acetilcolina',
          audioScript: 'El Bulbo Raquídeo sustenta la vida manteniendo la respiración y el ritmo cardíaco, mientras sus pirámides cruzan las fibras motoras.'
        }
      },
      23: {
        'pt-BR': {
          name: 'Nervos Cranianos (I ao XII: Olfatório ao Hipoglosso)',
          category: 'NERVOS CRANIANOS',
          functionText: 'Doze pares de nervos que emergem do encéfalo e tronco encefálico para inervação sensitiva especial, motora somática e parassimpática da cabeça e pescoço.',
          clinicalText: 'Paralisia de Bell (NC VII), nevralgia do trigêmeo (NC V), oftalmoplegias (NC III/IV/VI) e síndrome bulbar progressiva na ELA.',
          neurotransmitter: 'Acetilcolina motora e parassimpática, Glutamato e Substância P sensitivos',
          audioScript: 'Os doze pares de nervos cranianos constituem as pontes diretas de comando sensorial, mímico, mastigatório e autônomo entre o tronco encefálico e todos os órgãos dos sentidos.'
        },
        'en-GB': {
          name: 'Cranial Nerves (I to XII: Olfactory to Hypoglossal)',
          category: 'CRANIAL NERVES',
          functionText: 'Twelve pairs of peripheral cranial nerves carrying special sensory, somatic motor, and parasympathetic visceral innervation to the head and neck.',
          clinicalText: 'Bell’s palsy (CN VII), trigeminal neuralgia (CN V), cranial oculomotor nerve palsies (CN III/IV/VI), and bulbar amyotrophic lateral sclerosis.',
          neurotransmitter: 'Somatic and parasympathetic Acetylcholine, Glutamate, and Substance P',
          audioScript: 'The twelve pairs of cranial nerves mediate vision, audition, facial expression, mastication, swallowing, and vagal autonomic regulation directly from the brainstem.'
        },
        'it-IT': {
          name: 'Nervi Cranici (I-XII: dall Olfattivo all Ipoglosso)',
          category: 'NERVI CRANICI',
          functionText: 'Dodici paia di nervi che emergono dall encefalo e dal tronco per la sensibilità speciale, motilità e parasimpatico cranico.',
          clinicalText: 'Paralisi di Bell (VII), nevralgia del trigemino (V) e paralisi oculomotorie (III, IV, VI).',
          neurotransmitter: 'Acetilcolina motoria e Glutammato sensitivo',
          audioScript: 'I dodici nervi cranici controllano i sensi speciali, la mimica facciale, la deglutizione e gli organi viscerali.'
        },
        'uk-UA': {
          name: 'Черепні нерви (I–XII: від нюхового до під’язикового)',
          category: 'ЧЕРЕПНІ НЕРВИ',
          functionText: 'Дванадцять пар нервів, що іннервують органи чуття, мімічні м’язи, гортань, язик та внутрішні органи.',
          clinicalText: 'Параліч Белла (VII), невралгія трійчастого нерва (V), окорухові порушення та бульбарний синдром при БАС.',
          neurotransmitter: 'Ацетилхолін та глутамат',
          audioScript: 'Дванадцять пар черепних нервів керують зором, слухом, мімікою обличчя, ковтанням та парасимпатичними рефлексами.'
        },
        'es-ES': {
          name: 'Nervios Craneales (I al XII: Olfatorio al Hipogloso)',
          category: 'NERVIOS CRANEALES',
          functionText: 'Doce pares craneales para la inervación sensorial, motora somática y parasimpática de la cabeza, cuello y vísceras.',
          clinicalText: 'Parálisis facial de Bell (NC VII), neuralgia del trigémino (NC V) y oftalmoplejías (NC III/IV/VI).',
          neurotransmitter: 'Acetilcolina motora y Glutamato sensitivo',
          audioScript: 'Los doce pares de nervios craneales conectan el tronco encefálico con los órganos de los sentidos, la cara y el aparato fonador.'
        }
      },
      24: {
        'pt-BR': {
          name: 'Cerebelo (Fólias, Vérmis e Árvore da Vida)',
          category: 'CEREBELO',
          functionText: 'Coordenação motora fina, cronometria de movimentos, correção de erros motores em tempo real e equilíbrio vestibular.',
          clinicalText: 'Ataxia cerebelar da marcha, dismetria, disdiadococinesia, tremor intencional e nistagmo.',
          neurotransmitter: 'GABA nas células gigantes de Purkinje e Glutamato nas células granulares',
          audioScript: 'O Cerebelo contém mais de metade de todos os neurônios do cérebro. Suas fólias delgadas e as células de Purkinje corrigem em milissegundos qualquer erro de execução motora.'
        },
        'en-GB': {
          name: 'Cerebellum (Folia, Vermis & Arbor Vitae)',
          category: 'CEREBELLUM',
          functionText: 'Fine motor coordination, predictive movement timing, online sensorimotor error correction, and vestibular balance.',
          clinicalText: 'Cerebellar gait ataxia, intention tremor, dysmetria, dysdiadochokinesia, and gaze-evoked nystagmus.',
          neurotransmitter: 'Inhibitory GABA from Purkinje cells and excitatory Glutamate from granule cells',
          audioScript: 'The Cerebellum accommodates more than half of all neurons in the human brain. Its tightly folded folia and Purkinje cells compute real-time kinematic error corrections.'
        },
        'it-IT': {
          name: 'Cervelletto (Folia, Verme e Arbor Vitae)',
          category: 'CERVELLETTO',
          functionText: 'Coordinazione motoria fine, sincronizzazione dei movimenti, correzione degli errori in tempo reale ed equilibrio.',
          clinicalText: 'Atassia della marcia, dismetria, tremore intenzionale e nistagmo in lesioni cerebellari.',
          neurotransmitter: 'GABA nelle cellule di Purkinje e Glutammato nei granuli',
          audioScript: 'Il Cervelletto coordina con precisione i movimenti volontari ed è essenziale per l equilibrio posturale.'
        },
        'uk-UA': {
          name: 'Мозочок (Листки, черв’як та дерево життя)',
          category: 'МОЗОЧОК',
          functionText: 'Координація рухів, точний таймінг, корекція моторних помилок та вестибулярна рівновага.',
          clinicalText: 'Мозочкова атаксія ходи, інтенційний тремор, дисметрія та ністагм.',
          neurotransmitter: 'ГАМК у клітинах Пуркіньє та глутамат у гранулярних клітинах',
          audioScript: 'Мозочок містить понад половину всіх нейронів мозку. Його клітини Пуркіньє миттєво виправляють будь-які неточності в рухах.'
        },
        'es-ES': {
          name: 'Cerebelo (Folia, Vermis y Árbol de la Vida)',
          category: 'CEREBELO',
          functionText: 'Coordinación motora fina, sincronización temporal, corrección de errores en tiempo real y equilibrio.',
          clinicalText: 'Ataxia cerebelosa de la marcha, dismetría, temblor intencional y nistagmo.',
          neurotransmitter: 'GABA en las células de Purkinje y Glutamato en las células granulares',
          audioScript: 'El Cerebelo alberga más de la mitad de las neuronas del encéfalo, calibrando la precisión de cada movimiento voluntario.'
        }
      },
      25: {
        'pt-BR': {
          name: 'Medula Espinhal Cervical e Torácica (C1–T12)',
          category: 'MEDULA ESPINHAL',
          functionText: 'Condução ascendente sensitiva (lemnisco medial e espinotalâmico) e descendente motora piramidal para membros superiores e tronco.',
          clinicalText: 'Tetraplegia em secção cervical alta (C1-C4 com falência diafragmática do nervo frênico); paraplegia torácica; placas de Esclerose Múltipla.',
          neurotransmitter: 'Glutamato nos tratos de substância branca e Acetilcolina nos motoneurônios alfa',
          audioScript: 'A Medula Espinhal Cervical e Torácica estende-se como a rodovia elétrica primordial do organismo, apresentando a intumescência cervical para o controle refinado das mãos.'
        },
        'en-GB': {
          name: 'Cervical & Thoracic Spinal Cord (C1–T12)',
          category: 'SPINAL CORD',
          functionText: 'Ascending sensory transmission and descending lateral corticospinal motor execution to the upper extremities and thorax.',
          clinicalText: 'Tetraplegia from high cervical cord trauma (C1–C4 diaphragmatic compromise via phrenic roots); multiple sclerosis myelitis plaques.',
          neurotransmitter: 'Glutamate in white matter tracts and Acetylcholine in alpha motor neurons',
          audioScript: 'The Cervical and Thoracic Spinal Cord forms the primary neural highway of the human body, featuring the cervical enlargement for fine manual dexterity.'
        },
        'it-IT': {
          name: 'Midollo Spinale Cervicale e Toracico (C1–T12)',
          category: 'MIDOLLO SPINALE',
          functionText: 'Conduzione ascendente della sensibilità e discendente motoria verso gli arti superiori e il tronco.',
          clinicalText: 'Tetraplegia in lesioni cervicali alte; paraplegia in lesioni toraciche; placche di sclerosi multipla.',
          neurotransmitter: 'Glutammato nelle vie della sostanza bianca e Acetilcolina nei motoneuroni alfa',
          audioScript: 'Il Midollo Spinale Cervicale e Toracico trasmette i segnali motori e sensoriali tra il cervello e il resto del corpo.'
        },
        'uk-UA': {
          name: 'Шийний та грудний відділи спинного мозку (C1–T12)',
          category: 'СПИННИЙ МОЗОК',
          functionText: 'Висхідні сенсорні та низхідні рухові провідні шляхи до рук, дихальних м язів та тулуба.',
          clinicalText: 'Тетраплегія при шийних травмах (C1–C4 із паралічем діафрагми); бляшки розсіяного склерозу.',
          neurotransmitter: 'Глутамат у провідних шляхах та ацетилхолін у альфа-мотонейронах',
          audioScript: 'Шийний та грудний відділи спинного мозку утворюють головну інформаційну магістраль тіла з потовщенням для тонких рухів рук.'
        },
        'es-ES': {
          name: 'Médula Espinal Cervical y Torácica (C1–T12)',
          category: 'MÉDULA ESPINAL',
          functionText: 'Conducción sensitiva ascendente y motora piramidal descendente para miembros superiores y tórax.',
          clinicalText: 'Tetraplejía en sección cervical alta; paraplejía torácica; placas desmielinizantes de Esclerosis Múltiple.',
          neurotransmitter: 'Glutamato en la sustancia blanca y Acetilcolina en motoneuronas alfa',
          audioScript: 'La Médula Espinal Cervical y Torácica transmite las señales motoras y sensoriales entre el cerebro y las extremidades.'
        }
      },
      26: {
        'pt-BR': {
          name: 'Medula Espinhal Lombossacral, Cone Medular e Cauda Equina',
          category: 'MEDULA ESPINHAL',
          functionText: 'Inervação motora e sensitiva dos membros inferiores, esfíncteres vesical e retal, e funções sexuais autônomas.',
          clinicalText: 'Síndrome da Cauda Equina (anestesia em sela, incontinência urinária/fecal), paraplegia flácida e ciatalgia compressiva.',
          neurotransmitter: 'Acetilcolina sacral parassimpática, GABA e Glutamato',
          audioScript: 'No segmento lombar inferior, a medula afunila-se no cone medular em L1-L2 e dá origem ao denso feixe filamentoso da cauda equina.'
        },
        'en-GB': {
          name: 'Lumbosacral Spinal Cord, Conus Medullaris & Cauda Equina',
          category: 'SPINAL CORD',
          functionText: 'Sensorimotor innervation of the lower limbs, autonomic regulation of urinary/fecal sphincters, and pelvic reflex circuits.',
          clinicalText: 'Cauda Equina syndrome (saddle anaesthesia, bladder/bowel incontinence), flaccid lower motor paraparesis, and disk herniation radiculopathy.',
          neurotransmitter: 'Sacral parasympathetic Acetylcholine, GABA, and Glutamate',
          audioScript: 'In the lower lumbar spine, the cord tapers into the conus medullaris at L1–L2 and terminates in the cascading nerve bundle of the cauda equina.'
        },
        'it-IT': {
          name: 'Midollo Lombosacrale, Cono Midollare e Cauda Equina',
          category: 'MIDOLLO SPINALE',
          functionText: 'Innervazione sensitiva e motoria degli arti inferiori e controllo sfinterico urinario e fecale.',
          clinicalText: 'Sindrome della cauda equina (anestesia a sella, incontinenza), paraparesi flaccida.',
          neurotransmitter: 'Acetilcolina sacrale, GABA e Glutammato',
          audioScript: 'La parte lombare del midollo termina nel cono midollare e prosegue nel fascio di radici nervose della cauda equina.'
        },
        'uk-UA': {
          name: 'Попереково-крижовий відділ, мозковий конус та кінський хвіст',
          category: 'СПИННИЙ МОЗОК',
          functionText: 'Моторна та сенсорна іннервація ніг, регуляція функції сечового міхура, кишківника та тазових органів.',
          clinicalText: 'Синдром кінського хвоста (сідлоподібна анестезія, нетримання сечі), млявий параліч ніг.',
          neurotransmitter: 'Ацетилхолін, ГАМК та глутамат',
          audioScript: 'На рівні L1–L2 спинний мозок закінчується мозковим конусом, від якого донизу відходить пучок нервових корінців — кінський хвіст.'
        },
        'es-ES': {
          name: 'Médula Lumbosacra, Cono Medular y Cauda Equina',
          category: 'MÉDULA ESPINAL',
          functionText: 'Inervación motora y sensitiva de miembros inferiores, control de esfínteres vesical y rectal y reflejos pélvicos.',
          clinicalText: 'Síndrome de cola de caballo (anestesia en silla de montar, incontinencia urinaria), ciática y paraparesia flácida.',
          neurotransmitter: 'Acetilcolina parasimpática sacra, GABA y Glutamato',
          audioScript: 'En la región lumbar, la médula se afina en el cono medular en L1-L2 y se divide en las raíces filamentosas de la cauda equina.'
        }
      },
      27: {
        'pt-BR': {
          name: 'SNP — Plexo Cervical (C1–C4) e Nervo Frênico (C3–C5)',
          category: 'SISTEMA NERVOSO PERIFÉRICO (SNP)',
          functionText: 'Inervação motora diafragmática vital via Nervo Frênico (C3–C5), alça cervical e sensibilidade do pescoço e nuca.',
          clinicalText: 'Paralisia diafragmática por lesão medular alta (C1–C3) exigindo ventilação mecânica, nevralgia occipital e soluço intratável.',
          neurotransmitter: 'Acetilcolina na placa motora e Glutamato sensorial',
          audioScript: 'O Plexo Cervical e o Nervo Frênico emergem das raízes cervicais superiores, conduzindo o comando motor essencial para o diafragma e a respiração.'
        },
        'en-GB': {
          name: 'PNS — Cervical Plexus (C1–C4) & Phrenic Nerve (C3–C5)',
          category: 'PERIPHERAL NERVOUS SYSTEM (PNS)',
          functionText: 'Vital motor innervation to the thoracic diaphragm via the Phrenic Nerve (C3–C5), ansa cervicalis, and sensory innervation of neck and occiput.',
          clinicalText: 'Diaphragmatic paralysis following high cervical spinal cord injury (C1–C3); occipital neuralgia; intractable singultus.',
          neurotransmitter: 'Neuromuscular Acetylcholine and sensory Glutamate',
          audioScript: 'The Cervical Plexus and Phrenic Nerve descend through the neck and thoracic cavity to sustain pulmonary ventilation by contracting the diaphragm.'
        },
        'it-IT': {
          name: 'SNP — Plesso Cervicale (C1–C4) e Nervo Frenico (C3–C5)',
          category: 'SISTEMA NERVOSO PERIFERICO (SNP)' ,
          functionText: 'Innervazione motoria del diaframma tramite il nervo frenico (C3–C5) e sensibilità cutanea del collo.',
          clinicalText: 'Paralisi diaframmatica da lesione cervicale alta, nevralgia occipitale e insufficienza respiratoria.',
          neurotransmitter: 'Acetilcolina neuromuscolare',
          audioScript: 'Il Plesso Cervicale genera il nervo frenico, fondamentale per contrarre il diaframma e permettere la respirazione polmonare.'
        },
        'uk-UA': {
          name: 'ПНС — Шийне сплетення (C1–C4) та діафрагмальний нерв (C3–C5)',
          category: 'ПЕРИФЕРИЧНА НЕРВОВА СИСТЕМА (ПНС)',
          functionText: 'Життєво важлива моторна іннервація діафрагми через діафрагмальний нерв (C3–C5) та чутливість шиї.',
          clinicalText: 'Параліч діафрагми при високій травмі шийного відділу (C1–C3); потилична невралгія.',
          neurotransmitter: 'Ацетилхолін нервово-м’язових синапсів',
          audioScript: 'Шийне сплетення та діафрагмальний нерв посилають імпульси до діафрагми, забезпечуючи кожен вдих і видих.'
        },
        'es-ES': {
          name: 'SNP — Plexo Cervical (C1–C4) y Nervio Frénico (C3–C5)',
          category: 'SISTEMA NERVIOSO PERIFÉRICO (SNP)',
          functionText: 'Inervación motora vital del diafragma mediante el nervio frénico (C3–C5) y sensibilidad de la nuca y cuello.',
          clinicalText: 'Parálisis diafragmática por lesión cervical alta, neuralgia occipital y disnea.',
          neurotransmitter: 'Acetilcolina neuromuscular',
          audioScript: 'El Plexo Cervical origina el nervio frénico, que desciende hacia el diafragma garantizando la respiración pulmonar.'
        }
      },
      28: {
        'pt-BR': {
          name: 'SNP — Plexo Braquial (C5–T1) e Nervos Mediano, Ulnar, Radial e Axilar',
          category: 'SISTEMA NERVOSO PERIFÉRICO (SNP)',
          functionText: 'Complexo de raízes, troncos, divisões e fascículos que comandam toda a motricidade e sensibilidade do membro superior.',
          clinicalText: 'Paralisia obstétrica de Erb-Duchenne (C5–C6), paralisia de Klumpke (C8–T1) e Síndrome do Túnel do Carpo no nervo mediano.',
          neurotransmitter: 'Acetilcolina motora, Substância P e CGRP sensoriais',
          audioScript: 'O Plexo Braquial distribui-se das raízes C5 a T1 pelos troncos e fascículos axilares para originar os nervos mediano, ulnar e radial para o braço e mão.'
        },
        'en-GB': {
          name: 'PNS — Brachial Plexus (C5–T1) & Upper Limb Nerves',
          category: 'PERIPHERAL NERVOUS SYSTEM (PNS)',
          functionText: 'Somatic sensorimotor network of roots, trunks, divisions, and cords innervating the shoulder, arm, forearm, and hand.',
          clinicalText: 'Erb-Duchenne palsy (upper trunk C5–C6), Klumpke palsy (lower trunk C8–T1), and carpal tunnel syndrome.',
          neurotransmitter: 'Somatic motor Acetylcholine, Substance P, and CGRP',
          audioScript: 'The Brachial Plexus emerges from the cervical enlargement to supply fine motor control and tactile sensitivity to the entire upper limb.'
        },
        'it-IT': {
          name: 'SNP — Plesso Brachiale (C5–T1) e Nervi dell Arto Superiore',
          category: 'SISTEMA NERVOSO PERIFERICO (SNP)',
          functionText: 'Rete nervosa che controlla la motilità fine della mano, la forza del braccio e la sensibilità dell arto superiore.',
          clinicalText: 'Paralisi di Erb-Duchenne, paralisi di Klumpke e sindrome del tunnel carpale.',
          neurotransmitter: 'Acetilcolina',
          audioScript: 'Il Plesso Brachiale coordina i movimenti delle braccia e delle dita tramite i nervi mediano, radiale e ulnare.'
        },
        'uk-UA': {
          name: 'ПНС — Плечове сплетення (C5–T1) та нерви верхньої кінцівки',
          category: 'ПЕРИФЕРИЧНА НЕРВОВА СИСТЕМА (ПНС)',
          functionText: 'Складне сплетення стовбурів та пучків, що забезпечує точні рухи кисті, пальців та чутливість руки.',
          clinicalText: 'Параліч Ерба-Дюшенна (C5–C6), параліч Дежерін-Клюмпке (C8–T1) та синдром зап’ястного каналу.',
          neurotransmitter: 'Ацетилхолін',
          audioScript: 'Плечове сплетення розгалужується на серединний, ліктьовий та променевий нерви, керуючи кожним рухом руки.'
        },
        'es-ES': {
          name: 'SNP — Plexo Braquial (C5–T1) y Nervios del Miembro Superior',
          category: 'SISTEMA NERVIOSO PERIFÉRICO (SNP)',
          functionText: 'Red de troncos y fascículos que inerva motora y sensitivamente el hombro, brazo, antebrazo y mano.',
          clinicalText: 'Parálisis de Erb-Duchenne (C5–C6), parálisis de Klumpke (C8–T1) y síndrome del túnel carpiano.',
          neurotransmitter: 'Acetilcolina',
          audioScript: 'El Plexo Braquial origina los nervios mediano, radial y cubital para gobernar la motricidad fina de la mano y el brazo.'
        }
      },
      29: {
        'pt-BR': {
          name: 'SNP Autônomo — Cadeia Ganglionar Simpática Paravertebral e Nervos Intercostais (T1–L2)',
          category: 'SISTEMA NERVOSO PERIFÉRICO (SNP)',
          functionText: 'Tronco simpático paravertebral com 22 gânglios que distribuem a resposta adrenérgica de luta ou fuga e os 12 nervos intercostais.',
          clinicalText: 'Síndrome de Horner por lesão do gânglio estrelado/T1, neuralgia pós-herpética intercostal e hiperidrose.',
          neurotransmitter: 'Noradrenalina pós-ganglionar e Acetilcolina pré-ganglionar',
          audioScript: 'A Cadeia Simpática Paravertebral percorre os dois lados da coluna vertebral, orquestrando respostas de alerta, vasoconstrição e taquicardia.'
        },
        'en-GB': {
          name: 'PNS — Paravertebral Sympathetic Trunk & Intercostal Nerves (T1–L2)',
          category: 'PERIPHERAL NERVOUS SYSTEM (PNS)',
          functionText: 'Bilateral sympathetic chain (22 ganglia) mediating systemic fight-or-flight adrenergic responses accompanied by 12 intercostal nerves.',
          clinicalText: 'Horner’s syndrome (ptosis, miosis, anhidrosis), post-herpetic intercostal neuralgia, and complex regional pain syndrome.',
          neurotransmitter: 'Postganglionic Noradrenaline and preganglionic Acetylcholine',
          audioScript: 'The Paravertebral Sympathetic Chain runs parallel to the spine, dispatching sympathetic vasomotor and visceral acceleration commands.'
        },
        'it-IT': {
          name: 'SNP Autonomo — Catena Simpatica Paravertebrale e Nervi Intercostali',
          category: 'SISTEMA NERVOSO PERIFERICO (SNP)',
          functionText: 'Tronco simpatico bilaterale con gangli paravertebrali per la risposta di attacco o fuga e nervi intercostali toracici.',
          clinicalText: 'Sindrome di Horner per lesione del ganglio stellato e nevralgia post-erpetica intercostale.',
          neurotransmitter: 'Noradrenalina e Acetilcolina',
          audioScript: 'La Catena Simpatica Paravertebrale controlla le reazioni di emergenza, la frequenza cardiaca e il tono dei vasi sanguigni.'
        },
        'uk-UA': {
          name: 'ПНС — Симпатичний стовбур та міжреберні нерви (T1–L2)',
          category: 'ПЕРИФЕРИЧНА НЕРВОВА СИСТЕМА (ПНС)',
          functionText: 'Паравертебральний симпатичний ланцюг із 22 гангліями (реакція стресу, спазм судин) та 12 пар міжреберних нервів.',
          clinicalText: 'Синдром Горнера при ураженні зірчастого вузла; постгерпетична міжреберна невралгія.',
          neurotransmitter: 'Норадреналін та ацетилхолін',
          audioScript: 'Симпатичний стовбур вздовж хребта регулює судинний тонус, артеріальний тиск та адаптацію до навантажень.'
        },
        'es-ES': {
          name: 'SNP Autónomo — Cadena Simpática Paravertebral y Nervios Intercostales',
          category: 'SISTEMA NERVIOSO PERIFÉRICO (SNP)',
          functionText: 'Cadena ganglionar paravertebral que comanda las respuestas de lucha o huida y los nervios intercostales del tórax.',
          clinicalText: 'Síndrome de Horner por lesión del ganglio estrellado y neuralgia intercostal.',
          neurotransmitter: 'Noradrenalina y Acetilcolina',
          audioScript: 'La Cadena Simpática Paravertebral distribuye el tono adrenérgico hacia el corazón, vasos y vísceras en situaciones de alerta.'
        }
      },
      30: {
        'pt-BR': {
          name: 'SNP Autônomo — Nervo Vago (NC X) e Eixo Parassimpático Cranio-Sacral',
          category: 'SISTEMA NERVOSO PERIFÉRICO (SNP)',
          functionText: 'Décimo par craniano responsável por 75% da inervação parassimpática (bradicardia, peristaltismo digestivo e eixo intestino-cérebro).',
          clinicalText: 'Síncope vasovagal, gastroparesia diabética e disfonia por paralisia do nervo laríngeo recorrente.',
          neurotransmitter: 'Acetilcolina em receptores muscarínicos M2 e M3',
          audioScript: 'O Nervo Vago é o grande maestro do sistema parassimpático. Emergindo do bulbo, ele viaja até o coração, pulmões e trato gastrointestinal para promover repouso e homeostase.'
        },
        'en-GB': {
          name: 'PNS — Vagus Nerve (CN X) & Parasympathetic Craniosacral Axis',
          category: 'PERIPHERAL NERVOUS SYSTEM (PNS)',
          functionText: 'Tenth cranial nerve delivering ~75% of all parasympathetic output: vagal bradycardia, peristalsis, and the gut-brain axis.',
          clinicalText: 'Vasovagal syncope, vagal gastroparesis, and vocal cord paralysis from recurrent laryngeal nerve damage.',
          neurotransmitter: 'Acetylcholine acting on muscarinic M2 and M3 receptors',
          audioScript: 'The Vagus Nerve descends from the medulla to the thoracic and abdominal viscera, orchestrating calm, digestive secretion, and cardiac decelerations.'
        },
        'it-IT': {
          name: 'SNP Autonomo — Nervo Vago (NC X) e Sistema Parasimpatico',
          category: 'SISTEMA NERVOSO PERIFERICO (SNP)',
          functionText: 'Decimo nervo cranico per il controllo del battito cardiaco, della digestione e della modulazione antinfiammatoria.',
          clinicalText: 'Sincope vasovagale, gastroparesi e disfonia da paralisi del nervo laringeo ricorrente.',
          neurotransmitter: 'Acetilcolina',
          audioScript: 'Il Nervo Vago collega il tronco encefalico con cuore, polmoni e stomaco, favorendo il riposo e la digestione.'
        },
        'uk-UA': {
          name: 'ПНС — Блукаючий нерв (NC X) та парасимпатична система',
          category: 'ПЕРИФЕРИЧНА НЕРВОВА СИСТЕМА (ПНС)',
          functionText: 'Десятий черепний нерв, що забезпечує 75% парасимпатичних волокон: уповільнення серцебиття, перистальтика ШКТ.',
          clinicalText: 'Вазовагальна непритомність, гастропарез та парез голосових зв язок при пошкодженні зворотного нерва.',
          neurotransmitter: 'Ацетилхолін',
          audioScript: 'Блукаючий нерв спускається від довгастого мозку до серця та внутрішніх органів, відновлюючи ресурси організму.'
        },
        'es-ES': {
          name: 'SNP Autónomo — Nervio Vago (NC X) y Eje Parasimpático',
          category: 'SISTEMA NERVIOSO PERIFÉRICO (SNP)',
          functionText: 'Décimo par craneal responsable del 75% de la inervación parasimpática: bradicardia, digestión y eje intestino-cerebro.',
          clinicalText: 'Síncope vasovagal, gastroparesia y disfonía por lesión del nervio laríngeo recurrente.',
          neurotransmitter: 'Acetilcolina',
          audioScript: 'El Nervio Vago conecta el bulbo con el corazón y el tracto digestivo, coordinando el reposo y la recuperación física.'
        }
      },
      31: {
        'pt-BR': {
          name: 'SNP — Plexo Lombossacral (L1–S4), Nervo Femoral e Grande Nervo Ciático (Isquiático)',
          category: 'SISTEMA NERVOSO PERIFÉRICO (SNP)',
          functionText: 'Origina o Nervo Ciático (o maior do corpo humano) e o Nervo Femoral, comandando a marcha, postura e sensibilidade dos membros inferiores.',
          clinicalText: 'Ciatalgia por hérnia discal L4–L5/L5–S1, síndrome do piriforme e pé caído por lesão do nervo fibular comum.',
          neurotransmitter: 'Acetilcolina motora somática e Glutamato sensorial',
          audioScript: 'Da região lombossacral emergem o Nervo Femoral e o imponente Nervo Ciático — o mais longo e calibroso nervo do corpo humano, essencial para a marcha e locomoção.'
        },
        'en-GB': {
          name: 'PNS — Lumbosacral Plexus (L1–S4), Femoral & Sciatic Nerves',
          category: 'PERIPHERAL NERVOUS SYSTEM (PNS)',
          functionText: 'Gives rise to the Sciatic Nerve (largest in human body) and Femoral Nerve, governing bipedal locomotion, gait, and leg sensation.',
          clinicalText: 'Sciatica from L4–L5/L5–S1 disc herniation, piriformis syndrome, and foot drop from common peroneal nerve injury.',
          neurotransmitter: 'Somatic motor Acetylcholine and sensory Glutamate',
          audioScript: 'The Lumbosacral Plexus converges into the massive Sciatic Nerve, descending into the thigh and leg to govern bipedal standing and locomotion.'
        },
        'it-IT': {
          name: 'SNP — Plesso Lombosacrale (L1–S4) e Nervo Sciatico',
          category: 'SISTEMA NERVOSO PERIFERICO (SNP)',
          functionText: 'Origina il nervo femorale e il nervo sciatico (il più grande del corpo), controllando il cammino e le gambe.',
          clinicalText: 'Sciatalgia da ernia del disco lombare, sindrome del piriforme e paralisi del piede cadente.',
          neurotransmitter: 'Acetilcolina',
          audioScript: 'Il Plesso Lombosacrale genera il grande nervo sciatico, fondamentale per la deambulazione e la sensibilità delle gambe.'
        },
        'uk-UA': {
          name: 'ПНС — Попереково-крижове сплетення (L1–S4) та сідничний нерв',
          category: 'ПЕРИФЕРИЧНА НЕРВОВА СИСТЕМА (ПНС)',
          functionText: 'Формує стегновий та сідничний нерв (найбільший нерв тіла людини), керуючи ходою, поставою та кінцівками.',
          clinicalText: 'Ішіас (сіднична невралгія) при грижах дисків L4–S1; синдром відвислої стопи.',
          neurotransmitter: 'Ацетилхолін',
          audioScript: 'Попереково-крижове сплетення формує величний сідничний нерв, що забезпечує прямоходіння та рухливість стопи.'
        },
        'es-ES': {
          name: 'SNP — Plexo Lumbosacro (L1–S4) y Nervio Ciático',
          category: 'SISTEMA NERVIOSO PERIFÉRICO (SNP)',
          functionText: 'Origina el Nervio Ciático (el mayor del cuerpo) y el Nervio Femoral, permitiendo la marcha y la postura bípeda.',
          clinicalText: 'Ciática por hernia discal L4–S1, síndrome piramidal y pie caído por lesión del nervio peroneo.',
          neurotransmitter: 'Acetilcolina',
          audioScript: 'El Plexo Lumbosacro origina el nervio ciático para garantizar la bipedestación, la marcha y la fuerza de las piernas.'
        }
      }
    },

    pathologies: {
      NORMAL: {
        'pt-BR': {
          name: 'Fisiologia Normal do SNC',
          badge: 'HIGIDO (40 Hz)',
          macroDescription: 'Encéfalo e Medula íntegros, sulcos e giros bem delineados, ventrículos com volume normotenso (LCR claro).',
          microDescription: 'Potenciais de ação regulares em 40 Hz (ritmo gama), condução saltatória íntegra nas bainhas de mielina, sinapses equilibradas.',
          primaryNeurotransmitter: 'Glutamato e GABA em homeostase estequiométrica',
          audioScript: 'Você está observando o Sistema Nervoso Central Hígido. A condução saltatória nos tratos corticoespinhais flui em alta velocidade, e a síntese de neurotransmissores mantém a homeostase sináptica perfeita.'
        },
        'en-GB': {
          name: 'Normal CNS Physiology',
          badge: 'HEALTHY (40 Hz)',
          macroDescription: 'Intact encephalon and spinal cord, well-defined sulcal and gyral relief, normotensive ventricles with clear cerebrospinal fluid.',
          microDescription: 'Synchronous 40 Hz gamma rhythm action potentials, unimpeded saltatory conduction across myelin internodes, balanced synaptic transmission.',
          primaryNeurotransmitter: 'Stoichiometric homeostasis between L-Glutamate and GABA',
          audioScript: 'You are inspecting the healthy Central Nervous System. Saltatory conduction along corticospinal axons operates with high velocity, whilst balanced neurotransmission sustains physiological neural synchrony.'
        },
        'it-IT': {
          name: 'Fisiologia Normale del SNC',
          badge: 'SANO (40 Hz)',
          macroDescription: 'Encefalo e midollo intatti, solchi e giri ben delineati, ventricoli normotesi con liquido cerebrospinale limpido.',
          microDescription: 'Potenziali d azione ritmici a 40 Hz, conduzione saltatoria intatta lungo la mielina e trasmissione bilanciata.',
          primaryNeurotransmitter: 'Omeostasi stechiometrica tra Glutammato e GABA',
          audioScript: 'State osservando il Sistema Nervoso Centrale Sano. La conduzione saltatoria è rapida e la sintesi dei neurotrasmettitori mantiene un perfetto equilibrio sinaptico.'
        },
        'uk-UA': {
          name: 'Нормальна фізіологія ЦНС',
          badge: 'ЗДОРОВИЙ (40 Гц)',
          macroDescription: 'Цілісний головний та спинний мозок, чіткі борозни та звивини, нормальний об’єм шлуночків з прозорим ліквором.',
          microDescription: 'Регулярні потенціали дії на частоті 40 Гц (гамма-ритм), швидке сальтаторне проведення по мієлінових волокнах.',
          primaryNeurotransmitter: 'Гомеостатична рівновага глутамату та ГАМК',
          audioScript: 'Ви спостерігаєте за здоровою центральною нервовою системою. Нервові імпульси поширюються з високою швидкістю, підтримуючи ідеальну роботу синапсів.'
        },
        'es-ES': {
          name: 'Fisiología Normal del SNC',
          badge: 'SANO (40 Hz)',
          macroDescription: 'Encéfalo y médula íntegros, surcos y circunvoluciones bien delineados, ventrículos normotensos con LCR claro.',
          microDescription: 'Potenciales de acción rítmicos a 40 Hz, conducción saltatoria intacta en las vainas de mielina y sinapsis equilibradas.',
          primaryNeurotransmitter: 'Homeostasis entre Glutamato y GABA',
          audioScript: 'Está observando el Sistema Nervoso Central Sano. La conducción saltatoria fluye a gran velocidad y los neurotransmisores mantienen una perfecta homeostasis sináptica.'
        }
      },
      ALZHEIMER: {
        'pt-BR': {
          name: 'Doença de Alzheimer (DA)',
          badge: 'DEMÊNCIA NEURODEGENERATIVA',
          macroDescription: 'Atrofia cortical difusa acentuada no Hipocampo, Córtex Entorrinal e Lobo Temporoparietal, com dilatação dos ventrículos laterais (hidrocefalia ex-vacuo).',
          microDescription: 'Deposição extracelular de Placas Senis de Beta-Amiloide (Aβ42) + Emaranhados Neurofibrilares de Proteína Tau Hiperfosforilada colapsando microtúbulos e colapso colinérgico.',
          primaryNeurotransmitter: 'Queda severa de Acetilcolina (ACh) nas sinapses córtico-hipocampais',
          audioScript: 'Na Doença de Alzheimer, a atrofia inicia-se no hipocampo e córtex entorrinal. No zoom microscópico, placas senis de beta-amiloide e emaranhados de proteína Tau asfixiam os neurônios, destruindo a memória episódica.'
        },
        'en-GB': {
          name: 'Alzheimer’s Disease (AD)',
          badge: 'NEURODEGENERATIVE DEMENTIA',
          macroDescription: 'Marked cortical atrophy centred on the Hippocampus, Entorhinal Cortex, and Temporoparietal regions with ex-vacuo lateral ventricular enlargement.',
          microDescription: 'Extracellular Amyloid-Beta (Aβ42) senile plaque deposition alongside intracellular Hyperphosphorylated Tau neurofibrillary tangles triggering synaptic breakdown.',
          primaryNeurotransmitter: 'Severe cholinergic deficit (Acetylcholine) in cortico-hippocampal circuits',
          audioScript: 'In Alzheimer’s disease, neurodegeneration initiates within the hippocampus and entorhinal cortex. At the microscopic level, amyloid-beta plaques and hyperphosphorylated tau tangles asphyxiate neurons, erasing episodic memory.'
        },
        'it-IT': {
          name: 'Malattia di Alzheimer',
          badge: 'DEMENZA NEURODEGENERATIVA',
          macroDescription: 'Atrofia corticale marcata nell ippocampo e corteccia entorinale con dilatazione ventricolare ex-vacuo.',
          microDescription: 'Placche senili extracellulari di Beta-Amiloide e grovigli neurofibrillari di proteina Tau iperfosforilata con collasso sinaptico.',
          primaryNeurotransmitter: 'Marcata riduzione di Acetilcolina nelle sinapsi ippocampali',
          audioScript: 'Nella Malattia di Alzheimer, l atrofia colpisce precocemente l ippocampo. Al microscopio, le placche amiloidi e i grovigli di proteina Tau distruggono la memoria episodica.'
        },
        'uk-UA': {
          name: 'Хвороба Альцгеймера',
          badge: 'НЕЙРОДЕГЕНЕРАТИВНА ДЕМЕНЦІЯ',
          macroDescription: 'Виражена атрофія гіпокампа, енторинальної кори та скроневих часток із розширенням бічних шлуночків.',
          microDescription: 'Позаклітинні бляшки бета-амілоїду та внутрішньоклітинні клубочки гіперфосфорильованого тау-білка, що руйнують синапси.',
          primaryNeurotransmitter: 'Критичне падіння рівня ацетилхоліну в кірково-гіпокампальних ланцюгах',
          audioScript: 'При хворобі Альцгеймера дегенерація починається в гіпокампі. Під мікроскопом амілоїдні бляшки та тау-клубочки блокують нейрони, знищуючи пам ять.'
        },
        'es-ES': {
          name: 'Enfermedad de Alzheimer',
          badge: 'DEMENCIA NEURODEGENERATIVA',
          macroDescription: 'Atrofia cortical difusa marcada en el hipocampo y corteza entorrinal con dilatación ventricular ex-vacuo.',
          microDescription: 'Depósito de placas seniles de Beta-Amiloide y ovillos neurofibrilares de proteína Tau hiperfosforilada que colapsan las sinapsis.',
          primaryNeurotransmitter: 'Caída severa de Acetilcolina en las sinapsis córtico-hipocámpicas',
          audioScript: 'En la Enfermedad de Alzheimer, la atrofia comienza en el hipocampo. Al microscopio, las placas de beta-amiloide y los ovillos de Tau asfixian las neuronas y borran los recuerdos.'
        }
      },
      PARKINSON: {
        'pt-BR': {
          name: 'Doença de Parkinson (DP)',
          badge: 'DISTÚRBIO DO MOVIMENTO',
          macroDescription: 'Despigmentação focal e degeneração da Substância Negra (Pars Compacta) no mesencéfalo e hipoatividade da via nigroestriatal para o Putâmen e Caudado.',
          microDescription: 'Acúmulo intracitoplasmático de Corpos de Lewy (agregados fibrilares de alfa-sinucleína) + perda de axônios dopaminérgicos + oscilação patológica em 4-6 Hz.',
          primaryNeurotransmitter: 'Déficit crítico de Dopamina (via nigroestriatal) com hiperatividade inibitória de GABA no Tálamo',
          audioScript: 'Na Doença de Parkinson, a morte dos neurônios dopaminérgicos pigmentados da substância negra priva o corpo estriado de dopamina. O resultado clínico é o tremor em repouso de 4 a 6 hertz, rigidez e bradicinesia.'
        },
        'en-GB': {
          name: 'Parkinson’s Disease (PD)',
          badge: 'MOVEMENT DISORDER',
          macroDescription: 'Focal depigmentation and loss of the Substantia Nigra pars compacta in the midbrain, precipitating nigrostriatal denervation of the Putamen and Caudate.',
          microDescription: 'Intracellular Lewy bodies composed of misfolded alpha-synuclein aggregates, loss of dopaminergic terminals, and pathological 4–6 Hz tremor oscillation.',
          primaryNeurotransmitter: 'Critical Dopamine depletion across the nigrostriatal pathway with excessive thalamic GABAergic inhibition',
          audioScript: 'In Parkinson’s disease, selective death of neuromelanin-containing dopaminergic neurons in the substantia nigra deprives the striatum of dopamine, precipitating rest tremor, rigidity, and bradykinesia.'
        },
        'it-IT': {
          name: 'Malattia di Parkinson',
          badge: 'DISTURBO DEL MOVIMENTO',
          macroDescription: 'Depigmentazione e degenerazione della Sostanza Nera nel mesencefalo con denervazione dopaminergica del corpo striato.',
          microDescription: 'Accumulo intracitoplasmatico di Corpi di Lewy (aggregati di alfa-sinucleina) con perdita di terminazioni dopaminergiche.',
          primaryNeurotransmitter: 'Deficit critico di Dopamina con eccessiva inibizione GABAergica talamica',
          audioScript: 'Nella Malattia di Parkinson, la morte dei neuroni della sostanza nera causa una carenza di dopamina, provocando tremore a riposo, rigidità e lentezza dei movimenti.'
        },
        'uk-UA': {
          name: 'Хвороба Паркінсона',
          badge: 'РОЗЛАД РУХОВОЇ СФЕРИ',
          macroDescription: 'Депігментація та загибель клітин чорної речовини середнього мозку з порушенням нігростріарного шляху.',
          microDescription: 'Внутрішньоклітинні тільця Леві (агрегати альфа-синуклеїну), дефіцит дофаміну та патологічна осциляція 4–6 Гц.',
          primaryNeurotransmitter: 'Критичний дефіцит дофаміну в нігростріарній системі',
          audioScript: 'При хворобі Паркінсона загибель дофамінових клітин чорної речовини викликає тремор спокою, м язову скутість та сповільненість рухів.'
        },
        'es-ES': {
          name: 'Enfermedad de Parkinson',
          badge: 'TRASTORNO DEL MOVIMIENTO',
          macroDescription: 'Despigmentación y degeneración de la Sustancia Negra mesencefálica con denervación dopaminérgica del estriado.',
          microDescription: 'Acumulación de Cuerpos de Lewy (agregados de alfa-sinucleína) con pérdida de terminales dopaminérgicas.',
          primaryNeurotransmitter: 'Déficit crítico de Dopamina con hiperactividad inhibidora de GABA en el tálamo',
          audioScript: 'En la Enfermedad de Parkinson, la pérdida de neuronas en la sustancia negra priva de dopamina al estriado, causando temblor de reposo, rigidez y lentitud motora.'
        }
      },
      STROKE: {
        'pt-BR': {
          name: 'Acidente Vascular Cerebral (AVC Isquêmico de ACM Esquerda)',
          badge: 'EMERGÊNCIA VASCULAR AGUDA',
          macroDescription: 'Oclusão tromboembólica da Artéria Cerebral Média Esquerda, causando infarto isquêmico na Área de Broca, Giro Pré-Central M1 e Fascículo Arqueado.',
          microDescription: 'Falência de ATP nas bombas Na+/K+, despolarização anóxica, excitotoxicidade maciça por Glutamato, influxo letal de íons Cálcio (Ca2+) via NMDA e edema citotóxico.',
          primaryNeurotransmitter: 'Excesso tóxico agudo de L-Glutamato extracelular',
          audioScript: 'No Acidente Vascular Cerebral Isquêmico da artéria cerebral média esquerda, a interrupção do fluxo sanguíneo causa colapso energético imediato. A liberação maciça de glutamato gera excitotoxicidade por cálcio, destruindo o córtex motor e da fala.'
        },
        'en-GB': {
          name: 'Acute Ischaemic Stroke (Left MCA Infarction)',
          badge: 'ACUTE VASCULAR EMERGENCY',
          macroDescription: 'Thromboembolic occlusion of the Left Middle Cerebral Artery, producing ischaemic infarction across Broca’s Area, M1 Precentral Gyrus, and Arcuate Fasciculus.',
          microDescription: 'Bioenergetic ATP collapse, anoxic membrane depolarisation, massive extracellular glutamate excitotoxicity, lethal NMDA calcium influx, and cytotoxic oedema.',
          primaryNeurotransmitter: 'Lethal surge of extracellular L-Glutamate triggering calcium excitotoxicity',
          audioScript: 'In Acute Ischaemic Stroke of the left middle cerebral artery, cessation of perfusion precipitates bioenergetic failure. Unchecked glutamate release triggers calcium excitotoxicity, rapidly destroying speech and motor cortices.'
        },
        'it-IT': {
          name: 'Ictus Ischemico Acuto (ACM Sinistra)',
          badge: 'EMERGENZA VASCOLARE ACUTA',
          macroDescription: 'Occlusione tromboembolica dell arteria cerebrale media sinistra con infarto nell Area di Broca e nel Giro Precentrale M1.',
          microDescription: 'Esaurimento di ATP, depolarizzazione anossica, eccitotossicità da Glutammato, massiccio afflusso di Calcio ed edema citotossico.',
          primaryNeurotransmitter: 'Eccesso tossico acuto di L-Glutammato extracellulare',
          audioScript: 'Nell Ictus Ischemico dell arteria cerebrale media sinistra, la mancanza di sangue causa necrosi immediata della corteccia motora e del linguaggio.'
        },
        'uk-UA': {
          name: 'Гострий ішемічний інсульт (Ліва СМА)',
          badge: 'НЕВІДКЛАДНИЙ СТАН',
          macroDescription: 'Тромбоемболічна оклюзія лівої середньої мозкової артерії з інфарктом зони Брока, моторної кори M1 та дугоподібного пучка.',
          microDescription: 'Енергетичний колапс АТФ, аноксична деполяризація, глутаматна ексайтотоксичність, летальний вхід кальцію та набряк клітин.',
          primaryNeurotransmitter: 'Масивний токсичний викид глутамату',
          audioScript: 'При ішемічному інсульті лівої середньої мозкової артерії припинення кровотоку руйнує клітини кори мовлення та моторного контролю.'
        },
        'es-ES': {
          name: 'Ictus Isquémico Agudo (ACM Izquierda)',
          badge: 'EMERGENCIA VASCULAR AGUDA',
          macroDescription: 'Oclusión tromboembólica de la arteria cerebral media izquierda con infarto en el Área de Broca, M1 y Fascículo Arqueado.',
          microDescription: 'Fallo de ATP, despolarización anóxica, excitotoxicidad masiva por Glutamato, sobrecarga de Calcio y edema citotóxico.',
          primaryNeurotransmitter: 'Exceso tóxico agudo de L-Glutamato extracelular',
          audioScript: 'En el Ictus Isquémico de la arteria cerebral media izquierda, el cese del flujo sanguíneo provoca la muerte celular de las áreas motoras y del lenguaje.'
        }
      },
      MS: {
        'pt-BR': {
          name: 'Esclerose Múltipla (EM / Desmielinização)',
          badge: 'DOENÇA AUTOIMUNE DESMIELINIZANTE',
          macroDescription: 'Placas desmielinizantes hiperintensas em substância branca periventricular (Dedos de Dawson), Nervo Óptico, Tronco e Funículos da Medula Espinhal.',
          microDescription: 'Ataque autoimune mediado por linfócitos T e micróglia ativada que fagocitam os oligodendrócitos e destroem as bainhas de mielina, bloqueando a condução saltatória.',
          primaryNeurotransmitter: 'Bloqueio da condução saltatória nos Nódulos de Ranvier com estresse oxidativo',
          audioScript: 'Na Esclerose Múltipla, o sistema imunológico ataca a mielina na substância branca e na medula espinhal. Sem as bainhas isolantes, os axônios nus sofrem bloqueio da condução elétrica saltatória.'
        },
        'en-GB': {
          name: 'Multiple Sclerosis (MS / Demyelination)',
          badge: 'AUTOIMMUNE DEMYELINATING DISEASE',
          macroDescription: 'Hyperintense demyelinating plaques across periventricular white matter (Dawson’s fingers), optic nerves, brainstem, and spinal cord columns.',
          microDescription: 'Autoimmune attack mediated by autoreactive T cells and microglia targeting oligodendrocytes, stripping myelin internodes and abolishing saltatory conduction.',
          primaryNeurotransmitter: 'Conduction failure at Ranvier nodes with microglial inflammatory stress',
          audioScript: 'In Multiple Sclerosis, the immune system mistakenly attacks myelin sheaths in white matter pathways and spinal columns. Without their protective insulation, denuded axons suffer conduction block.'
        },
        'it-IT': {
          name: 'Sclerosi Multipla (SM / Demielinizzazione)',
          badge: 'PATOLOGIA AUTOIMMUNE DEMIELINIZZANTE',
          macroDescription: 'Placche demielinizzanti periventricolari (Dita di Dawson), nervo ottico, tronco e cordoni del midollo spinale.',
          microDescription: 'Attacco autoimmune ai danni degli oligodendrociti con distruzione delle guaine mieliniche e blocco della conduzione saltatoria.',
          primaryNeurotransmitter: 'Interruzione della conduzione nei nodi di Ranvier e stress ossidativo',
          audioScript: 'Nella Sclerosi Multipla, i linfociti aggrediscono la mielina nel cervello e nel midollo, provocando il blocco della trasmissione elettrica negli assoni.'
        },
        'uk-UA': {
          name: 'Розсіяний склероз (Демієлінізація)',
          badge: 'АУТОІМУННЕ ДЕМІЄЛІНІЗУЮЧЕ ЗАХВОРЮВАННЯ',
          macroDescription: 'Демієлінізуючі бляшки в перивентрикулярній білій речовині (пальці Доусона), стовбурі та канатиках спинного мозку.',
          microDescription: 'Аутоімунна атака T-лімфоцитів та мікроглії на олігодендроцити, руйнування мієліну та випадіння сальтаторного проведення.',
          primaryNeurotransmitter: 'Блокада проведення у вузлах Ранв’є та окисний стрес',
          audioScript: 'При розсіяному склерозі імунна система руйнує мієлінові оболонки у спинному та головному мозку, блокуючи проходження нервових імпульсів.'
        },
        'es-ES': {
          name: 'Esclerosis Múltiple (EM / Desmielinización)',
          badge: 'ENFERMEDAD AUTOINMUNE DESMIELINIZANTE',
          macroDescription: 'Placas desmielinizantes en sustancia blanca periventricular (dedos de Dawson), tronco y cordones de la médula espinal.',
          microDescription: 'Ataque autoinmune a los oligodendrocitos con destrucción de las vainas de mielina y bloqueo de la conducción saltatoria.',
          primaryNeurotransmitter: 'Fallo de conducción en los nódulos de Ranvier y estrés oxidativo',
          audioScript: 'En la Esclerosis Múltiple, el sistema inmunitario destruye la mielina en el encéfalo y la médula espinal, interrumpiendo la conducción nerviosa.'
        }
      },
      CJD: {
        'pt-BR': {
          name: 'Doença de Creutzfeldt-Jakob (DCJ — Príons)',
          badge: 'ENCEFALOPATIA ESPONGIFORME FULMINANTE',
          macroDescription: 'Atrofia cortical e cerebelar fulminante, degeneração espongiforme com "Sinal do Taco de Hóquei" talâmico no Pulvinar e fita cortical hiperintensa (Cortical Ribboning).',
          microDescription: 'Conversão conformacional em cascata de PrPC (alfa-hélice) em PrPSc (beta-folha insolúvel), formação de placas priônicas, vacúolos e morte neuronal rápida.',
          primaryNeurotransmitter: 'Colapso polissináptico total e liberação maciça de marcadores 14-3-3 e Tau',
          audioScript: 'A Doença de Creutzfeldt-Jakob é a mais rápida e letal encefalopatia humana. Príons PrPSc forçam a proteína normal PrPC a se desdobrar em folhas beta infecciosas, transformando o cérebro numa esponja de vacúolos microscópicos.'
        },
        'en-GB': {
          name: 'Creutzfeldt-Jakob Disease (CJD — Prions)',
          badge: 'FULMINANT SPONGIFORM ENCEPHALOPATHY',
          macroDescription: 'Rapidly progressive cortical and cerebellar atrophy, spongiform degeneration with pulvinar "hockey-stick sign", and cortical ribboning on MRI.',
          microDescription: 'Conformational autocatalytic conversion of normal alpha-helical PrPC into insoluble beta-sheet PrPSc aggregates, inducing microvacuolation and neuronal death.',
          primaryNeurotransmitter: 'Global polysynaptic collapse with surge in CSF 14-3-3 and Total Tau',
          audioScript: 'Creutzfeldt-Jakob Disease is the most rapid and lethal human prion encephalopathy. Pathological PrPSc templating forces normal PrPC into infectious beta-sheet aggregates, converting neural parenchyma into a sponge of microscopic vacuoles.'
        },
        'it-IT': {
          name: 'Malattia di Creutzfeldt-Jakob (MCJ — Prioni)',
          badge: 'ENCEFALOPATIA SPONGIFORME FULMINANTE',
          macroDescription: 'Atrofia fulminante con degenerazione spongiforme, "Segno della mazza da hockey" nel talamo pulvinar e nastro corticale alla RM.',
          microDescription: 'Conversione conformazionale di PrPC in PrPSc a foglietti beta, formazione di placche prioniche, vacuoli microscopici e morte neuronale.',
          primaryNeurotransmitter: 'Collasso polisinaptico totale e aumento di proteina 14-3-3 e Tau',
          audioScript: 'La Malattia di Creutzfeldt-Jakob è una encefalopatia letale in cui i prioni PrPSc trasformano il parenchima cerebrale in una spugna di vacuoli microscopici.'
        },
        'uk-UA': {
          name: 'Хвороба Кройцфельда-Якоба (ХКЯ — Пріони)',
          badge: 'СПОНГІФОРМНА ЕНЦЕФАЛОПАТІЯ',
          macroDescription: 'Швидкопрогресуюча атрофія кори та мозочка, спонгіформна дегенерація із "симптомом хокейної ключки" в таламусі на МРТ.',
          microDescription: 'Автокаталітична конверсія нормального PrPC у нерозчинний PrPSc (бета-складчасті агрегати), формування вакуолей та масова загибель нейронів.',
          primaryNeurotransmitter: 'Глобальний полісинаптичний колапс, викид білків 14-3-3 та тау в ліквор',
          audioScript: 'Хвороба Кройцфельда-Якоба — це блискавична пріонна енцефалопатія, де патологічні пріони перетворюють мозок на губчасту структуру з мікроскопічними порожнинами.'
        },
        'es-ES': {
          name: 'Enfermedad de Creutzfeldt-Jakob (ECJ — Priones)',
          badge: 'ENCEFALOPATÍA ESPONGIFORME FULMINANTE',
          macroDescription: 'Atrofia cortical y cerebelosa fulminante con degeneración espongiforme, "Signo del palo de hockey" talámico y ribete cortical en RM.',
          microDescription: 'Conversión conformacional en cascada de PrPC a PrPSc en láminas beta, formación de placas priónicas, vacuolización y muerte neuronal rápida.',
          primaryNeurotransmitter: 'Colapso polisináptico total y liberación masiva de proteína 14-3-3 y Tau',
          audioScript: 'La Enfermedad de Creutzfeldt-Jakob es la encefalopatía más fulminante. Los priones PrPSc transforman el tejido cerebral en una esponja de vacuolas microscópicas.'
        }
      }
    },

    // Mapeamento bidirecional Código -> ID para garantir correspondência exata
    codeToIdMap: {
      'WB_CNS': 1,
      'DLPFC_LEFT': 2,
      'BROCA_LEFT': 3,
      'M1_LEFT': 4,
      'S1_LEFT': 5,
      'WERNICKE_LEFT': 6,
      'V1_CALCARINE': 7,
      'A1_LEFT': 8,
      'INSULA_LEFT': 9,
      'PARIETAL_LEFT': 10,
      'HIPPOCAMPUS': 11,
      'AMYGDALA': 12,
      'STRIATUM': 13,
      'GLOBUS_PALLIDUS': 14,
      'CORPUS_CALLOSUM': 15,
      'THALAMUS': 16,
      'HYPOTHALAMUS_PITUITARY': 17,
      'HYPOTHALAMUS': 17,
      'OPTIC_CHIASM': 18,
      'VENTRICULAR_SYSTEM': 19,
      'MIDBRAIN_SN': 20,
      'PONS_VAROLII': 21,
      'MEDULLA_OBLONGATA': 22,
      'CRANIAL_NERVES': 23,
      'CEREBELLUM_FOLIA': 24,
      'CEREBELLUM': 24,
      'SPINAL_CERVICAL_THORACIC': 25,
      'SPINAL_CORD_CERVICAL': 25,
      'SPINAL_LUMBAR_CAUDA': 26,
      'SPINAL_CORD_LUMBOSACRAL': 26,
      'PNS_CERVICAL_PHRENIC': 27,
      'PNS_BRACHIAL_PLEXUS': 28,
      'BRACHIAL_PLEXUS': 28,
      'PNS_SYMPATHETIC_CHAIN': 29,
      'PNS_VAGUS_PARASYMPATHETIC': 30,
      'PNS_LUMBOSACRAL_SCIATIC': 31,
      'SCIATIC_LUMBOSACRAL': 31
    },

    // Obtém texto localizado de elemento da UI
    t(key, lang) {
      const l = lang || this.currentLang || 'pt-BR';
      if (this.ui[l] && this.ui[l][key]) {
        return this.ui[l][key];
      }
      return (this.ui['pt-BR'] && this.ui['pt-BR'][key]) || key;
    },

    // Obtém estrutura anatômica traduzida por ID numérico (1..31) ou por código de string
    getStructure(idOrCode, lang) {
      const l = lang || this.currentLang || 'pt-BR';
      let id = idOrCode;
      if (typeof idOrCode === 'string') {
        if (this.codeToIdMap[idOrCode]) {
          id = this.codeToIdMap[idOrCode];
        } else if (!isNaN(parseInt(idOrCode, 10))) {
          id = parseInt(idOrCode, 10);
        }
      }
      const item = this.structures[id];
      if (item && (item[l] || item['pt-BR'])) {
        return item[l] || item['pt-BR'];
      }
      // Fallback para banco de dados unificado
      if (window.MOZOK_DATABASE && typeof window.MOZOK_DATABASE.getStructureById === 'function') {
        const s = window.MOZOK_DATABASE.getStructureById(id);
        if (s) {
          return {
            name: s.name || s.estrutura,
            category: s.category || s.categoria,
            functionText: Array.isArray(s.funcoes) ? s.funcoes.join(' • ') : (s.functionText || s.descricao || ''),
            clinicalText: Array.isArray(s.doencas) ? s.doencas.join('; ') : (s.clinicalText || ''),
            neurotransmitter: Array.isArray(s.neurotransmissores) ? s.neurotransmissores.join(', ') : (s.neurotransmitter || ''),
            audioScript: s.audioScript
          };
        }
      }
      return null;
    },

    // Obtém patologia traduzida
    getPathology(code, lang) {
      const l = lang || this.currentLang || 'pt-BR';
      const item = this.pathologies[code];
      if (item && (item[l] || item['pt-BR'])) {
        return item[l] || item['pt-BR'];
      }
      if (window.MOZOK_DATABASE && typeof window.MOZOK_DATABASE.getPathologyById === 'function') {
        const p = window.MOZOK_DATABASE.getPathologyById(code);
        if (p) return p;
      }
      return null;
    },

    // Troca de idioma global
    setLanguage(langCode) {
      if (!['pt-BR', 'en-GB', 'it-IT', 'uk-UA', 'es-ES'].includes(langCode)) {
        langCode = 'pt-BR';
      }
      this.currentLang = langCode;

      // Dispara evento global
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('mozokLanguageChanged', { detail: { lang: langCode } });
        window.dispatchEvent(event);
      }
    }
  };

  window.MOZOK_I18N = MOZOK_I18N;

})(window);
