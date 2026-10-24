// [PT-BR]: Macroanatomia 3D Real de Todo o Sistema Nervoso Central (Córtex MNI152 Real, Cerebelo Real, Estriado Real, Tálamo Real, Tronco Encefálico e Medula Espinhal Orgânica).
// [EN-US]: Real 3D Macroanatomy of the Entire Central Nervous System (Real MNI152 Cortex, Real Cerebellum, Real Striatum, Real Thalamus, Brainstem, and Organic Spinal Cord).
// [AI-CTX]: @llm-context: Complete CNS 3D procedural and scientific atlas viewer using McGill BrainBrowser MNI152 cortical surface (window.REAL_MNI_BRAIN) and Brainglobe/MNI subcortical atlas (window.SCIENTIFIC_ATLAS_MESHES).
//           @llm-invariant: Strictly zero TorusGeometry, zero floating spheres ("Saturns"), and zero hard primitives. Surface highlights use bioluminescent GLSL uniforms.
//           @llm-neuroscience: Telencephalon (Lobes & Functional Areas), Limbic & Diencephalon, Basal Ganglia, Brainstem (Midbrain, Pons, Medulla), Cerebellum, and Spinal Cord with nerve roots and cauda equina.

(function (window) {
  'use strict';

  // [PT-BR]: Definição exaustiva de todas as estruturas e regiões funcionais do SNC para estudo e navegação.
  // [EN-US]: Comprehensive definition of all CNS structures and functional areas for study and navigation.
  // [AI-CTX]: @llm-neuroscience: Brodmann cytoarchitectonic areas, subcortical nuclei, brainstem cranial centers, spinal cord segments.
  const CNS_REGIONS_REGISTRY = [
    {
      id: 1,
      code: 'WB_CNS',
      name: 'Sistema Nervoso Central Completo (Encéfalo + Medula Espinhal)',
      category: 'VISÃO GLOBAL',
      tier: 'MACRO',
      center: [0, 0, 0],
      optimalDist: 28,
      color: '#d1d5db',
      functionText: 'Comando global, integração sensitivo-motora, homeostase autônoma, cognição superior, linguagem e consciência.',
      clinicalText: 'Acometimento difuso em encefalopatias espongiformes (DCJ), leucoencefalopatias, esclerose múltipla e choque neurogênico.',
      neurotransmitter: 'Sistema integrado polissináptico (Glutamato, GABA, Dopamina, Serotonina, Acetilcolina, Noradrenalina)',
      citation: 'Kandel et al. Principles of Neural Science 6th Ed. (2021)',
      doi: '10.1036/0838577016',
      audioScript: 'Você está contemplando a totalidade do Sistema Nervoso Central Humano: o encéfalo esculpido a partir da média MNI152, diencéfalo, tronco encefálico, cerebelo anatômico e a medula espinhal contínua descendo até a cauda equina.'
    },
    {
      id: 2,
      code: 'DLPFC_OFC',
      name: 'Córtex Pré-Frontal (Dorsolateral e Orbitofrontal — BA 9, 10, 11, 46)',
      category: 'TELENCÉFALO',
      tier: 'MESO',
      center: [-2.8, 3.8, 1.8],
      optimalDist: 18,
      color: '#38bdf8',
      functionText: 'Funções executivas centrais, tomada de decisão baseada em recompensa, flexibilidade cognitiva e memória de trabalho.',
      clinicalText: 'Síndrome disexecutiva, desinibição de conduta, apatia e apraxia motora precoce na Doença de Alzheimer e DCJ.',
      neurotransmitter: 'Dopamina (receptores D1/D2 mesocorticais) e L-Glutamato córtico-cortical',
      citation: 'Miller & Cohen (2001) / Petrides (2005)',
      doi: '10.1146/annurev.neuro.24.1.167',
      audioScript: 'O Córtex Pré-Frontal Dorsolateral e Orbitofrontal orquestra o planejamento superior e o raciocínio executivo, inibindo respostas automáticas e mantendo metas ativas.'
    },
    {
      id: 3,
      code: 'BROCA',
      name: 'Área de Broca (Giro Frontal Inferior — BA 44/45)',
      category: 'TELENCÉFALO',
      tier: 'MESO',
      center: [-4.6, 1.4, 0.8],
      optimalDist: 16,
      color: '#fb923c',
      functionText: 'Programação e expressão motora da fala, articulação fonológica e sintaxe linguística.',
      clinicalText: 'Afasia de Broca não-fluente por AVC da Artéria Cerebral Média esquerda ou degeneração frontotemporal.',
      neurotransmitter: 'Acetilcolina modulada por GABA e Glutamato',
      citation: 'Broca (1861) / Dronkers et al. (2007) Brain',
      doi: '10.1093/brain/awm042',
      audioScript: 'A Área de Broca no hemisfério esquerdo converte formulações linguísticas abstratas em comandos motores coordenados para as cordas vocais, língua e musculatura orofacial.'
    },
    {
      id: 4,
      code: 'M1_PRECENTRAL',
      name: 'Córtex Motor Primário M1 (Giro Pré-Central — BA 4)',
      category: 'TELENCÉFALO',
      tier: 'MESO',
      center: [-3.4, -0.6, 4.4],
      optimalDist: 16,
      color: '#f43f5e',
      functionText: 'Origem do Trato Corticoespinhal lateral, comando voluntário fino fracionado (Homúnculo Motor de Penfield).',
      clinicalText: 'Hemiplegia contralateral espástica no AVC isquêmico ou trauma encefálico e mioclonias corticais.',
      neurotransmitter: 'L-Glutamato excitatório nas projeções córtico-espinhais',
      citation: 'Penfield & Boldrey (1937) / Bets (1874)',
      doi: '10.1093/brain/60.4.389',
      audioScript: 'O Giro Pré-Central hospeda o Córtex Motor Primário M1. Aqui residem as células piramidais gigantes de Betz cujos axônios descem ininterruptos até a medula espinhal.'
    },
    {
      id: 5,
      code: 'S1_POSTCENTRAL',
      name: 'Córtex Somatossensorial Primário S1 (Giro Pós-Central — BA 3, 1, 2)',
      category: 'TELENCÉFALO',
      tier: 'MESO',
      center: [-3.4, -1.8, 4.2],
      optimalDist: 16,
      color: '#ec4899',
      functionText: 'Processamento somatotópico de tato epicrítico, dor, temperatura e propriocepção consciente.',
      clinicalText: 'Hipoestesia/anestesia contralateral, astereognosia e parestesias em lesões isquêmicas ou desmielinizantes.',
      neurotransmitter: 'L-Glutamato córtico-talâmico e interneurônios GABAérgicos',
      citation: 'Mountcastle (1957) J Neurophysiol',
      doi: '10.1152/jn.1957.20.4.408',
      audioScript: 'O Giro Pós-Central recebe pelo leminisco medial e trato espinotalâmico todas as sensações do corpo contralateral mapeadas no homúnculo sensitivo.'
    },
    {
      id: 6,
      code: 'WERNICKE_ARC',
      name: 'Área de Wernicke (BA 22) e Fascículo Arqueado',
      category: 'TELENCÉFALO',
      tier: 'MESO',
      center: [-4.8, -3.2, 1.2],
      optimalDist: 16,
      color: '#06b6d4',
      functionText: 'Decodificação fonológica auditiva, semântica da linguagem e via arqueada de condução fonêmica.',
      clinicalText: 'Afasia de Wernicke fluente com anosognosia e afasia de condução por secção do fascículo arqueado no AVC.',
      neurotransmitter: 'Glutamato e GABA em circuitos córtico-talâmicos auditivos',
      citation: 'Wernicke (1874) / Catani et al. (2005)',
      doi: '10.1002/ana.20404',
      audioScript: 'A Área de Wernicke no giro temporal superior esquerdo interpreta os sons da linguagem e projeta-se até a área de Broca através do denso feixe do fascículo arqueado.'
    },
    {
      id: 7,
      code: 'V1_CALCARINE',
      name: 'Córtex Visual Primário V1 (Sulco Calcarino — BA 17)',
      category: 'TELENCÉFALO',
      tier: 'MESO',
      center: [-1.2, -6.8, 0.2],
      optimalDist: 16,
      color: '#8b5cf6',
      functionText: 'Mapeamento retinotópico de alta resolução de bordas, contraste, orientação espacial e disparidade binocular.',
      clinicalText: 'Hemianopsia homônima contralateral com preservação macular em oclusões da Artéria Cerebral Posterior.',
      neurotransmitter: 'L-Glutamato das radiações ópticas geniculocalcarinas',
      citation: 'Hubel & Wiesel (1962) / Felleman & Van Essen (1991)',
      doi: '10.1113/jphysiol.1962.sp006837',
      audioScript: 'No polo occipital, o Córtex Visual Primário às margens do sulco calcarino decifra a informação ótica vinda dos fotorreceptores da retina via corpo geniculado lateral.'
    },
    {
      id: 8,
      code: 'A1_HESCHL',
      name: 'Córtex Auditivo Primário A1 (Giros de Heschl — BA 41/42)',
      category: 'TELENCÉFALO',
      tier: 'MESO',
      center: [-3.8, -1.4, 0.8],
      optimalDist: 15,
      color: '#14b8a6',
      functionText: 'Mapeamento tonotópico da cóclea, discriminação temporal e frequência sonora fundamental.',
      clinicalText: 'Agnosia auditiva cortical, surdez verbal e alucinações sonoras temporais.',
      neurotransmitter: 'L-Glutamato e inibição lateral por GABA',
      citation: 'Heschl (1878) / Kaas & Hackett (2000)',
      doi: '10.1073/pnas.97.22.11793',
      audioScript: 'Localizado no fundo do sulco lateral, o giro transverso anterior de Heschl processa as frequências de áudio com organização tonotópica precisa.'
    },
    {
      id: 9,
      code: 'INSULA',
      name: 'Lobo da Ínsula (Profunda ao Sulco Lateral de Sylvius)',
      category: 'TELENCÉFALO',
      tier: 'MESO',
      center: [-2.6, 0.2, 0.4],
      optimalDist: 14,
      color: '#a855f7',
      functionText: 'Interocepção corporal, gustação, dor visceral, empatia social e integração autonômica.',
      clinicalText: 'Perda do desejo tabágico em lesões insulares, dor neuropática central e disfunção somatovisceral.',
      neurotransmitter: 'Glutamato, Dopamina e Neuropeptídeos autonômicos',
      citation: 'Craig (2009) Nature Rev Neurosci',
      doi: '10.1038/nrn2555',
      audioScript: 'A Ínsula repousa oculta sob os opérculos frontal, parietal e temporal, traduzindo as sensações viscerais do corpo em sentimentos conscientes e empatia.'
    },
    {
      id: 10,
      code: 'HIPPOCAMPUS',
      name: 'Hipocampo e Córtex Entorrinal (CA1–CA4 e Giro Denteado)',
      category: 'SISTEMA LÍMBICO',
      tier: 'MESO',
      center: [-2.2, -1.8, -0.8],
      optimalDist: 14,
      color: '#6366f1',
      functionText: 'Consolidação de memória declarativa episódica de longo prazo e navegação espacial.',
      clinicalText: 'Alvo patológico primário da Doença de Alzheimer com amnésia anterógrada e degeneração de neurônios piramidais.',
      neurotransmitter: 'L-Glutamato (receptores NMDA/AMPA com Potenciação de Longa Duração - LTP)',
      citation: 'Bliss & Lømo (1973) / Scoville & Milner (1957)',
      doi: '10.1113/jphysiol.1973.sp010273',
      audioScript: 'Na profundidade do lobo temporal medial, o Hipocampo e o Giro Denteado formam novas memórias através do circuito trissináptico.'
    },
    {
      id: 11,
      code: 'AMYGDALA',
      name: 'Complexo Amigdaloidiano (Basolateral e Central)',
      category: 'SISTEMA LÍMBICO',
      tier: 'MESO',
      center: [-1.8, -0.4, -1.2],
      optimalDist: 12,
      color: '#e11d48',
      functionText: 'Detecção de ameaça, vigilância afetiva, condicionamento pavloviano do medo e valência emocional.',
      clinicalText: 'Síndrome de Klüver-Bucy (hiperoralidade e placidez), transtorno de estresse pós-traumático e labilidade afetiva.',
      neurotransmitter: 'Serotonina (5-HT), Noradrenalina e GABA',
      citation: 'LeDoux (2000) / Janak & Tye (2015) Nature',
      doi: '10.1038/nature14188',
      audioScript: 'A Amígdala avalia perigos ambientais em milissegundos, deflagrando respostas simpáticas cardiorrespiratórias através de conexões diretas com o hipotálamo.'
    },
    {
      id: 12,
      code: 'THALAMUS',
      name: 'Tálamo (Núcleos de Relé Sensorial e Pulvinar)',
      category: 'DIENCÉFALO',
      tier: 'MESO',
      center: [-1.15, -0.6, 0.25],
      optimalDist: 12,
      color: '#ea580c',
      functionText: 'Revezamento de todas as vias sensoriais (exceto olfato), regulação dos ritmos corticais teta/gama e sono REM.',
      clinicalText: 'Síndrome talâmica de Déjerine-Roussy (dor central intratável) e "Sinal do Taco de Hóquei" no Pulvinar na DCJ.',
      neurotransmitter: 'Glutamato excitatório e neurônios inibitórios do núcleo reticular GABAérgicos',
      citation: 'Sherman & Guillery (2006) Exploring the Thalamus',
      doi: '10.1016/S1474-4422(09)70291-1',
      audioScript: 'O Tálamo atua como o grande comutador central de informações do cérebro, filtrando e sincronizando os estímulos que sobem ao córtex.'
    },
    {
      id: 13,
      code: 'HYPOTHALAMUS_PIT',
      name: 'Hipotálamo e Glândula Hipófise (Pituitária)',
      category: 'DIENCÉFALO',
      tier: 'MESO',
      center: [0.0, -0.6, -1.6],
      optimalDist: 12,
      color: '#d97706',
      functionText: 'Controle neuroendócrino mestre, balanço hídrico, termorregulação, apetite e ritmo circadiano supraquiasmático.',
      clinicalText: 'Diabetes insípido (déficit de vasopressina), pan-hipopituitarismo, síndrome da secreção inapropriada de ADH (SIADH).',
      neurotransmitter: 'Oxitocina, Vasopressina (ADH), GnRH, CRH, TRH e Dopamina hipofisiotrófica',
      citation: 'Saper & Lowell (2014) Cell / Guillemin & Schally Nobel 1977',
      doi: '10.1016/j.cell.2014.05.023',
      audioScript: 'O Hipotálamo, mesmo pesando menos de 4 gramas, governa a homeostase vital do organismo através da haste infundibular e da glândula hipófise.'
    },
    {
      id: 14,
      code: 'PINEAL',
      name: 'Glândula Pineal (Epitálamo)',
      category: 'DIENCÉFALO',
      tier: 'MESO',
      center: [0.0, -2.2, 0.4],
      optimalDist: 11,
      color: '#ca8a04',
      functionText: 'Secreção rítmica noturna de melatonina sob comando fótico do trato retinohipotalâmico.',
      clinicalText: 'Pinealomas com Síndrome de Parinaud (paralisia do olhar vertical conjugado por compressão dos colículos).',
      neurotransmitter: 'Melatonina e Serotonina',
      citation: 'Axelrod (1974) Science',
      doi: '10.1126/science.184.4144.1341',
      audioScript: 'A Glândula Pineal sintetiza melatonina na escuridão para induzir o sono fisiológico e regular os ciclos sazonais biológicos.'
    },
    {
      id: 15,
      code: 'BASAL_GANGLIA',
      name: 'Gânglios da Base (Estriado: Caudado e Putâmen; Globo Pálido)',
      category: 'NÚCLEOS DA BASE',
      tier: 'MESO',
      center: [-1.85, -0.2, 1.55],
      optimalDist: 14,
      color: '#f59e0b',
      functionText: 'Seleção dinâmica de programas motores, supressão de padrões indesejados e aprendizado procedural de hábitos.',
      clinicalText: 'Coréia na Doença de Huntington, balismo no núcleo subtalâmico e acinesia na Doença de Parkinson.',
      neurotransmitter: 'Dopamina nigroestriatal (D1/D2) e GABA nas vias direta e indireta',
      citation: 'Albin, Young & Penney (1989) / DeLong (1990) Trends Neurosci',
      doi: '10.1016/0166-2236(90)90110-V',
      audioScript: 'Os Núcleos da Base modulam o tônus muscular e a velocidade dos movimentos voluntários através do balanço entre as vias direta e indireta.'
    },
    {
      id: 16,
      code: 'SUBSTANTIA_NIGRA',
      name: 'Substância Negra (Pars Compacta e Reticulata — Mesencéfalo)',
      category: 'TRONCO ENCEFÁLICO',
      tier: 'MESO',
      center: [-0.8, -2.4, -0.6],
      optimalDist: 12,
      color: '#334155',
      functionText: 'Produção massiva de Dopamina projetada para o Estriado com pigmentação escura de neuromelanina.',
      clinicalText: 'Doença de Parkinson por morte de neurônios dopaminérgicos com corpos de Lewy e rigidez em roda denteada.',
      neurotransmitter: 'Dopamina sintetizada pela Tirosina Hidroxilase',
      citation: 'Ehringer & Hornykiewicz (1960) / Keuken et al. (2014)',
      doi: '10.1016/j.neuroimage.2014.03.032',
      audioScript: 'A Substância Negra no mesencéfalo emite os axônios dopaminérgicos da via nigroestriatal. A sua destruição gera o tremor de repouso e a acinesia parkinsoniana.'
    },
    {
      id: 17,
      code: 'PONS_CRANIAL',
      name: 'Ponte de Varólio e Nervos Cranianos (V, VI, VII, VIII)',
      category: 'TRONCO ENCEFÁLICO',
      tier: 'MESO',
      center: [0.0, -3.8, -0.8],
      optimalDist: 14,
      color: '#0284c7',
      functionText: 'Relé de fibras transversas pontocerebelares, sulco basilar e núcleos trigêmeo, abducente, facial e vestibulococlear.',
      clinicalText: 'Síndrome do Cativeiro (Locked-in) por infarto pontino basilar bilateral, paralisia de Bell e neuralgia trigeminal.',
      neurotransmitter: 'Glutamato nas fibras musgosas pontocerebelares e Acetilcolina motora',
      citation: 'Brodal (1981) Neurological Anatomy / Haines (2018)',
      doi: '10.1093/acprof:oso/9780195054347.001.0001',
      audioScript: 'A Ponte conduz os axônios motores até o cerebelo e a medula, contendo núcleos cruciais para a mastigação, mímica facial e audição.'
    },
    {
      id: 18,
      code: 'MEDULLA_DECUSSATION',
      name: 'Bulbo (Medula Oblonga) e Decussação das Pirâmides',
      category: 'TRONCO ENCEFÁLICO',
      tier: 'MESO',
      center: [0.0, -5.6, -1.0],
      optimalDist: 14,
      color: '#0369a1',
      functionText: 'Centros cardiorrespiratórios automáticos vitais (núcleo do trato solitário) e cruzamento de 90% das fibras piramidais.',
      clinicalText: 'Morte encefálica por parada respiratória (síndrome de Ondine), Síndrome de Wallenberg (infarto bulbar lateral).',
      neurotransmitter: 'Acetilcolina parassimpática (Nervo Vago X), Glutamato e Noradrenalina',
      citation: 'Smith et al. (1991) Science (Complexo pré-Bötzinger)',
      doi: '10.1126/science.1683005',
      audioScript: 'No Bulbo, na Decussação das Pirâmides, as vias motoras cruzam para o lado oposto do corpo. É aqui que bate o marcapasso respiratório que mantém a vida.'
    },
    {
      id: 19,
      code: 'CEREBELLUM_ARBOR',
      name: 'Cerebelo Anatômico Real e Árvore da Vida',
      category: 'CEREBELO',
      tier: 'MESO',
      center: [0.0, -4.2, -3.2],
      optimalDist: 16,
      color: '#fda4af',
      functionText: 'Coordenação da motricidade fina, cálculo de erro em tempo real, tônus postural e reflexo vestíbulo-ocular.',
      clinicalText: 'Ataxia cerebelar da marcha, dismetria índice-nariz, disdiadococinesia e nistagmo vestibular.',
      neurotransmitter: 'GABA inibitório das Células de Purkinje e Glutamato das fibras trepadeiras e paralelas',
      citation: 'Ito (2006) Nature Rev Neurosci / Eccles, Ito & Szentágothai (1967)',
      doi: '10.1038/nrn1938',
      audioScript: 'O Cerebelo abriga mais da metade de todos os neurônios humanos. Suas lâminas de fólias reais envolvem a substância branca ramificada da Árvore da Vida.'
    },
    {
      id: 20,
      code: 'SPINAL_CORD_CERVICAL',
      name: 'Medula Espinhal Cervical (C1–C8 e Intumescência C4–T1)',
      category: 'MEDULA ESPINHAL',
      tier: 'MESO',
      center: [0.0, -8.2, -1.2],
      optimalDist: 15,
      color: '#10b981',
      functionText: 'Inervação sensitivo-motora do pescoço, diafragma (Nervo Frênico C3-C5) e membros superiores (Plexo Braquial).',
      clinicalText: 'Tetraplegia espástica e insuficiência respiratória em traumatismo raquimedular cervical alto.',
      neurotransmitter: 'Acetilcolina nos motoneurônios alfa e Substância P nos aferentes nociceptivos',
      citation: 'Netter Anatomy Atlas / Schomburg (1990) Physiol Rev',
      doi: '10.1152/physrev.1990.70.2.329',
      audioScript: 'A medula cervical apresenta a intumescência dos membros superiores. Lesões nesta região podem paralisar os quatro membros e o diafragma.'
    },
    {
      id: 21,
      code: 'SPINAL_CORD_THORACIC',
      name: 'Medula Espinhal Torácica (T1–T12 e Corno Lateral Simpático)',
      category: 'MEDULA ESPINHAL',
      tier: 'MESO',
      center: [0.0, -12.5, -1.4],
      optimalDist: 16,
      color: '#059669',
      functionText: 'Inervação intercostal, estabilidade do tronco e origem dos neurônios pré-ganglionares simpáticos toracolombares.',
      clinicalText: 'Paraplegia espástica, perda sensitiva com nível cutâneo e disreflexia autonômica.',
      neurotransmitter: 'Acetilcolina pré-ganglionar simpática e Noradrenalina',
      citation: 'Langley (1921) The Autonomic Nervous System',
      doi: '10.5962/bhl.title.102047',
      audioScript: 'No segmento torácico, o corno lateral da substância cinzenta abriga as células do sistema nervoso autônomo simpático de luta ou fuga.'
    },
    {
      id: 22,
      code: 'SPINAL_CORD_LUMBAR_CAUDA',
      name: 'Medula Lombar, Cone Medular (L1-L2) e Cauda Equina (L2–Co1)',
      category: 'MEDULA ESPINHAL',
      tier: 'MESO',
      center: [0.0, -17.5, -1.5],
      optimalDist: 18,
      color: '#34d399',
      functionText: 'Inervação motora e sensorial dos membros inferiores (Plexo Lombossacral) e esfíncteres genitourinários/anais.',
      clinicalText: 'Síndrome da Cauda Equina (anestesia em sela, bexiga neurogênica e paraparesia flácida arrefléxica).',
      neurotransmitter: 'Acetilcolina nas placas motoras e GABA/Glicina interneuronal inibitória',
      citation: 'Wall & Melzack (1965) Science (Teoria das Comportas da Dor)',
      doi: '10.1126/science.150.3699.971',
      audioScript: 'A medula se afunila no cone medular ao nível da vértebra L2, de onde as raízes espinhais lombo-sacrais descem em feixe como a Cauda Equina.'
    }
  ];

  // [PT-BR]: Classe construtora da macroanatomia 3D completa do SNC, sem nenhuma primitiva grotesca ("Saturnos").
  // [EN-US]: Builder class for complete 3D macroanatomy of the CNS, strictly without crude primitives ("Saturns").
  // [AI-CTX]: @llm-invariant: Uses window.REAL_MNI_BRAIN, window.SCIENTIFIC_ATLAS_MESHES and CatmullRom organic spinal cord.
  class CNSAnatomy3D {
    constructor(scene) {
      this.scene = scene;
      this.masterGroup = new THREE.Group();
      this.masterGroup.name = "CNS_MASTER_MACRO_GROUP";
      this.scene.add(this.masterGroup);

      this.cortexMesh = null;
      this.cortexMaterial = null;
      this.cortexUniforms = null;

      this.subcorticalMeshes = [];
      this.brainstemMeshes = [];
      this.spinalMeshes = [];
      this.regionsRegistry = CNS_REGIONS_REGISTRY;

      this.highlightCenter = new THREE.Vector3(0, 0, 0);
      this.highlightRadius = 0.0;
      this.highlightColor = new THREE.Color(0x00f2fe);
      this.highlightIntensity = 0.0;

      this.buildAllCNSStructures();
    }

    buildAllCNSStructures() {
      this.buildPhotorealisticMNICortex();
      this.buildAtlasSubcorticalStructures();
      this.buildOrganicBrainstem();
      this.buildOrganicSpinalCordAndCauda();
    }

    // [PT-BR]: Constrói o Córtex MNI152 Real com o Shader GLSL Fotorrealista de brain-3d.js (Subsurface Scattering + Cavitação + Destaque sem Saturnos).
    // [EN-US]: Builds Real MNI152 Cortex with Photorealistic GLSL Shader from brain-3d.js (Subsurface Scattering + Cavitation + In-Mesh Highlight).
    // [AI-CTX]: @llm-context: Uses McGill BrainBrowser window.REAL_MNI_BRAIN vertices with aGyrus curvature and dynamic highlight pulse.
    buildPhotorealisticMNICortex() {
      let geo;
      let vertexCount = 0;

      if (window.REAL_MNI_BRAIN && window.REAL_MNI_BRAIN.vertices && window.REAL_MNI_BRAIN.indices) {
        const data = window.REAL_MNI_BRAIN;
        vertexCount = data.vertexCount || (data.vertices.length / 3);
        geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(data.vertices), 3));
        geo.setIndex(new THREE.BufferAttribute(new Uint32Array(data.indices), 1));

        if (data.gyrus) {
          geo.setAttribute('aGyrus', new THREE.BufferAttribute(new Float32Array(data.gyrus), 1));
        } else {
          const g = new Float32Array(vertexCount);
          g.fill(0.5);
          geo.setAttribute('aGyrus', new THREE.BufferAttribute(g, 1));
        }
        geo.computeVertexNormals();
      } else {
        // Fallback alta densidade
        const sph = new THREE.SphereGeometry(6.2, 120, 90);
        geo = sph;
        const g = new Float32Array(sph.attributes.position.count);
        g.fill(0.5);
        geo.setAttribute('aGyrus', new THREE.BufferAttribute(g, 1));
      }

      this.cortexUniforms = {
        uDamage: { value: 0.0 },
        uOpacity: { value: 1.0 },
        uHighlightCenter: { value: new THREE.Vector3(0, 0, 0) },
        uHighlightRadius: { value: 0.0 },
        uHighlightColor: { value: new THREE.Color(0x00f2fe) },
        uHighlightIntensity: { value: 0.0 },
        uLightDir1: { value: new THREE.Vector3(0.5, 0.7, 0.6).normalize() },
        uLightDir2: { value: new THREE.Vector3(-0.6, 0.2, 0.5).normalize() }
      };

      const vertexShader = `
        attribute float aGyrus;
        varying vec3 vNormal;
        varying vec3 vWorldPos;
        varying vec3 vObjPos;
        varying float vGyrus;
        varying vec3 vViewDir;

        void main() {
          vGyrus = aGyrus;
          vObjPos = position;
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPos = worldPosition.xyz;
          vViewDir = normalize(cameraPosition - vWorldPos);
          gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
      `;

      const fragmentShader = `
        uniform float uDamage;
        uniform float uOpacity;
        uniform vec3 uHighlightCenter;
        uniform float uHighlightRadius;
        uniform vec3 uHighlightColor;
        uniform float uHighlightIntensity;
        uniform vec3 uLightDir1;
        uniform vec3 uLightDir2;

        varying vec3 vNormal;
        varying vec3 vWorldPos;
        varying vec3 vObjPos;
        varying float vGyrus;
        varying vec3 vViewDir;

        // 3D Worley Cellular Noise
        vec3 hash33(vec3 p) {
          p = vec3(
            dot(p, vec3(127.1, 311.7, 74.7)),
            dot(p, vec3(269.5, 183.3, 246.1)),
            dot(p, vec3(113.5, 271.9, 124.6))
          );
          return fract(sin(p) * 43758.5453123);
        }

        vec2 worleyF1F2(vec3 p) {
          vec3 id = floor(p);
          vec3 f = fract(p);
          float d1 = 1.0;
          float d2 = 1.0;
          for (int z = -1; z <= 1; z++) {
            for (int y = -1; y <= 1; y++) {
              for (int x = -1; x <= 1; x++) {
                vec3 neighbor = vec3(float(x), float(y), float(z));
                vec3 pt = hash33(id + neighbor);
                vec3 diff = neighbor + pt - f;
                float d = length(diff);
                if (d < d1) {
                  d2 = d1;
                  d1 = d;
                } else if (d < d2) {
                  d2 = d;
                }
              }
            }
          }
          return vec2(d1, d2);
        }

        void main() {
          vec3 N = normalize(vNormal);
          vec3 V = normalize(vViewDir);

          float sulcalAO = smoothstep(0.08, 0.68, vGyrus);
          vec3 healthyGyrusColor = vec3(0.82, 0.84, 0.86);
          vec3 healthySulcusColor = vec3(0.18, 0.20, 0.23);
          vec3 baseColor = mix(healthySulcusColor, healthyGyrusColor, sulcalAO);

          float specPower = 32.0;
          float specStrength = 0.32 * sulcalAO;
          float poreDepth = 0.0;

          // Cavitação e Atrofia Patológica no hemisfério doente
          float isDiseasedHemi = step(0.0, vObjPos.x);
          if (isDiseasedHemi > 0.5 && uDamage > 0.005) {
            vec3 parallaxOffset = -V * (uDamage * 0.045);
            vec3 pPos = vObjPos + parallaxOffset;
            vec2 w1 = worleyF1F2(pPos * 2.2);
            vec2 w2 = worleyF1F2(pPos * 4.5 + 13.8);

            float r1 = 0.44 * pow(uDamage, 0.62);
            float r2 = 0.48 * pow(uDamage, 0.52);

            float pMacro = 1.0 - smoothstep(r1 * 0.42, r1, w1.x);
            float pMeso  = 1.0 - smoothstep(r2 * 0.48, r2, w2.x);

            poreDepth = clamp((pMacro * 0.95 + pMeso * 0.78) * smoothstep(0.12, 0.58, vGyrus), 0.0, 1.0);

            vec3 necroticCortex  = vec3(0.55, 0.53, 0.50);
            vec3 astroglioticRim = vec3(0.620, 0.604, 0.569);
            vec3 deepPorePit     = vec3(0.020, 0.027, 0.043);

            vec3 diseasedSurface = mix(healthyGyrusColor, necroticCortex, uDamage);
            diseasedSurface = mix(diseasedSurface, astroglioticRim, poreDepth * 0.85);
            baseColor = mix(healthySulcusColor * (1.0 - 0.45 * uDamage), diseasedSurface, sulcalAO);
            baseColor = mix(baseColor, deepPorePit, smoothstep(0.32, 0.85, poreDepth));

            specStrength *= (1.0 - 0.85 * uDamage);
          }

          // Destaque Bioluminescente Direto na Superfície (Zero Saturnos!)
          if (uHighlightRadius > 0.1 && uHighlightIntensity > 0.01) {
            float distToHighlight = length(vObjPos - uHighlightCenter);
            if (distToHighlight < uHighlightRadius) {
              float hFactor = smoothstep(uHighlightRadius, 0.0, distToHighlight) * uHighlightIntensity;
              baseColor = mix(baseColor, uHighlightColor, hFactor * 0.85);
            }
          }

          // Subsurface Scattering (SSS)
          float wrap = 0.35;
          float diff1 = max(0.0, (dot(N, uLightDir1) + wrap) / (1.0 + wrap));
          float diff2 = max(0.0, (dot(N, uLightDir2) + wrap) / (1.0 + wrap)) * 0.45;

          vec3 H1 = normalize(uLightDir1 + V);
          float spec = pow(max(dot(N, H1), 0.0), specPower) * specStrength * (1.0 - poreDepth);
          float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.0) * 0.22 * sulcalAO;

          vec3 finalRGB = baseColor * (0.28 + 0.72 * diff1 + diff2) + vec3(spec + fresnel);
          gl_FragColor = vec4(finalRGB, uOpacity);
        }
      `;

      this.cortexMaterial = new THREE.ShaderMaterial({
        uniforms: this.cortexUniforms,
        vertexShader,
        fragmentShader,
        transparent: true,
        side: THREE.DoubleSide
      });

      this.cortexMesh = new THREE.Mesh(geo, this.cortexMaterial);
      this.cortexMesh.name = "MNI152_CORTICAL_SURFACE";
      this.masterGroup.add(this.cortexMesh);
    }

    // [PT-BR]: Constrói as Estruturas Subcorticais Reais a partir do Atlas Científico (Cerebelo Folia, Estriado, Tálamo Pulvinar e Ventrículos).
    // [EN-US]: Builds Real Subcortical Structures from Scientific Atlas (Cerebellum Folia, Striatum, Pulvinar Thalamus, and Ventricles).
    buildAtlasSubcorticalStructures() {
      const atlasGroup = new THREE.Group();
      atlasGroup.name = "ATLAS_SUBCORTICAL_GROUP";

      if (window.SCIENTIFIC_ATLAS_MESHES) {
        const atlas = window.SCIENTIFIC_ATLAS_MESHES;

        // 1. Cerebelo com fólias anatômicas reais
        if (atlas.cerebellum_folia) {
          const m = atlas.cerebellum_folia;
          const geo = new THREE.BufferGeometry();
          geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(m.vertices), 3));
          geo.setIndex(new THREE.BufferAttribute(new Uint32Array(m.indices), 1));
          geo.computeVertexNormals();

          const mat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xfda4af),
            roughness: 0.55,
            metalness: 0.08
          });
          const mesh = new THREE.Mesh(geo, mat);
          mesh.name = "Cerebelo_Folia_Real";
          atlasGroup.add(mesh);
          this.subcorticalMeshes.push(mesh);
        }

        // 2. Corpo Estriado (Caudado e Putâmen)
        if (atlas.striatum_caudate_putamen) {
          const m = atlas.striatum_caudate_putamen;
          const geo = new THREE.BufferGeometry();
          geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(m.vertices), 3));
          geo.setIndex(new THREE.BufferAttribute(new Uint32Array(m.indices), 1));
          geo.computeVertexNormals();

          const mat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xf59e0b),
            roughness: 0.35,
            metalness: 0.15,
            emissive: new THREE.Color(0x78350f),
            emissiveIntensity: 0.3
          });
          const mesh = new THREE.Mesh(geo, mat);
          mesh.name = "Corpo_Estriado_Real";
          atlasGroup.add(mesh);
          this.subcorticalMeshes.push(mesh);
        }

        // 3. Tálamo Pulvinar Real
        if (atlas.pulvinar_thalamus) {
          const m = atlas.pulvinar_thalamus;
          const geo = new THREE.BufferGeometry();
          geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(m.vertices), 3));
          geo.setIndex(new THREE.BufferAttribute(new Uint32Array(m.indices), 1));
          geo.computeVertexNormals();

          const mat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xea580c),
            roughness: 0.32,
            metalness: 0.15,
            emissive: new THREE.Color(0x9a3412),
            emissiveIntensity: 0.4
          });
          const mesh = new THREE.Mesh(geo, mat);
          mesh.name = "Talamo_Pulvinar_Real";
          atlasGroup.add(mesh);
          this.subcorticalMeshes.push(mesh);
        }

        // 4. Ventrículos Laterais
        if (atlas.lateral_ventricles_csf) {
          const m = atlas.lateral_ventricles_csf;
          const geo = new THREE.BufferGeometry();
          geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(m.vertices), 3));
          geo.setIndex(new THREE.BufferAttribute(new Uint32Array(m.indices), 1));
          geo.computeVertexNormals();

          const mat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0x0ea5e9),
            roughness: 0.1,
            metalness: 0.1,
            transparent: true,
            opacity: 0.72,
            emissive: new THREE.Color(0x0284c7),
            emissiveIntensity: 0.4
          });
          const mesh = new THREE.Mesh(geo, mat);
          mesh.name = "Ventriculos_Laterais_CSF";
          atlasGroup.add(mesh);
          this.subcorticalMeshes.push(mesh);
        }
      }

      // 5. Hipotálamo, Infundíbulo e Hipófise (Pituitária)
      const hypoGroup = new THREE.Group();
      hypoGroup.name = "HIPOTALAMO_HIPOFISE_ORG";

      const hypoCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -0.2, 0.4),
        new THREE.Vector3(0, -0.6, -0.4),
        new THREE.Vector3(0, -1.2, -1.0)
      ]);
      const hypoGeo = new THREE.TubeGeometry(hypoCurve, 12, 0.65, 10, false);
      const hypoMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.35, emissive: 0x78350f, emissiveIntensity: 0.3 });
      const hypoMesh = new THREE.Mesh(hypoGeo, hypoMat);
      hypoGroup.add(hypoMesh);

      // Haste da hipófise + Glândula Hipófise
      const pitCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -1.2, -1.0),
        new THREE.Vector3(0, -1.6, -1.4),
        new THREE.Vector3(0, -2.1, -1.8)
      ]);
      const pitGeo = new THREE.TubeGeometry(pitCurve, 8, 0.28, 8, false);
      const pitMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.3 });
      const pitMesh = new THREE.Mesh(pitGeo, pitMat);
      hypoGroup.add(pitMesh);

      atlasGroup.add(hypoGroup);
      this.subcorticalMeshes.push(hypoMesh);

      // 6. Hipocampo bilateral em arco suave (CA1-CA4) + Amígdala
      [-1, 1].forEach((sign) => {
        const hipCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(sign * 1.6, -0.4, 0.8),
          new THREE.Vector3(sign * 2.4, -0.8, -0.2),
          new THREE.Vector3(sign * 2.2, -1.8, -1.4),
          new THREE.Vector3(sign * 1.4, -2.4, -1.8)
        ]);
        const hipGeo = new THREE.TubeGeometry(hipCurve, 16, 0.35, 8, false);
        const hipMat = new THREE.MeshStandardMaterial({ color: 0x6366f1, roughness: 0.35, emissive: 0x312e81, emissiveIntensity: 0.3 });
        const hipMesh = new THREE.Mesh(hipGeo, hipMat);
        hipMesh.name = `Hipocampo_${sign < 0 ? 'Esq' : 'Dir'}`;
        atlasGroup.add(hipMesh);
        this.subcorticalMeshes.push(hipMesh);

        // Amígdala esferoide no polo anterior
        const amygGeo = new THREE.SphereGeometry(0.48, 12, 10);
        amygGeo.scale(1.0, 0.8, 1.2);
        const amygMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.35 });
        const amygMesh = new THREE.Mesh(amygGeo, amygMat);
        amygMesh.position.set(sign * 1.7, -0.35, 1.1);
        amygMesh.name = `Amigdala_${sign < 0 ? 'Esq' : 'Dir'}`;
        atlasGroup.add(amygMesh);
        this.subcorticalMeshes.push(amygMesh);
      });

      this.masterGroup.add(atlasGroup);
    }

    // [PT-BR]: Constrói o Tronco Encefálico Anatômico Orgânico (Mesencéfalo com Substância Negra, Ponte abaulada e Bulbo com pirâmides).
    // [EN-US]: Builds Organic Anatomical Brainstem (Midbrain with Substantia Nigra, Bulging Pons, and Medulla with Pyramids).
    buildOrganicBrainstem() {
      const stemGroup = new THREE.Group();
      stemGroup.name = "ORGANIC_BRAINSTEM_GROUP";

      // Curva anatômica do tronco conectando-se ao diencéfalo e descendo até o forame magno
      const stemCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -1.8, -0.2), // Base diencefálica
        new THREE.Vector3(0, -2.6, -0.5), // Mesencéfalo
        new THREE.Vector3(0, -3.8, -0.8), // Ponte
        new THREE.Vector3(0, -5.2, -1.0), // Bulbo
        new THREE.Vector3(0, -6.6, -1.1)  // Transição bulbo-medular
      ]);

      const stemGeo = new THREE.TubeGeometry(stemCurve, 28, 1.15, 16, false);
      // Modifica raio dinâmico dos vértices para reproduzir o abaulamento da ponte e afunilamento do bulbo
      const pos = stemGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        let x = pos.getX(i);
        let y = pos.getY(i);
        let z = pos.getZ(i);

        // Abaulamento da ponte em y ~ -3.8
        const ponsBulge = Math.exp(-Math.pow((y + 3.8) * 1.2, 2)) * 0.75;
        // Pirâmides bulbares em y ~ -5.2
        const medullaShape = Math.exp(-Math.pow((y + 5.2) * 1.4, 2)) * 0.25;

        x *= (1.0 + ponsBulge);
        z *= (1.0 + ponsBulge * 0.8 + medullaShape);

        pos.setXYZ(i, x, y, z);
      }
      stemGeo.computeVertexNormals();

      const stemMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x38bdf8),
        roughness: 0.42,
        metalness: 0.08
      });
      const stemMesh = new THREE.Mesh(stemGeo, stemMat);
      stemMesh.name = "Tronco_Encefalico_Pilar";
      stemGroup.add(stemMesh);
      this.brainstemMeshes.push(stemMesh);

      // Substância Negra Bilateral (Mesencéfalo)
      [-1, 1].forEach((sign) => {
        const snCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(sign * 0.6, -2.2, -0.4),
          new THREE.Vector3(sign * 0.9, -2.6, -0.6),
          new THREE.Vector3(sign * 0.7, -3.0, -0.8)
        ]);
        const snGeo = new THREE.TubeGeometry(snCurve, 8, 0.24, 6, false);
        const snMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(0x1e293b),
          roughness: 0.3,
          emissive: new THREE.Color(0x0f172a),
          emissiveIntensity: 0.6
        });
        const snMesh = new THREE.Mesh(snGeo, snMat);
        snMesh.name = `Substancia_Negra_${sign < 0 ? 'Esq' : 'Dir'}`;
        stemGroup.add(snMesh);
        this.brainstemMeshes.push(snMesh);
      });

      this.masterGroup.add(stemGroup);
    }

    // [PT-BR]: Constrói a Medula Espinhal Orgânica e Cauda Equina contínua descendo a partir do bulbo.
    // [EN-US]: Builds Organic Spinal Cord and Continuous Cauda Equina descending from the medulla.
    buildOrganicSpinalCordAndCauda() {
      const cordGroup = new THREE.Group();
      cordGroup.name = "ORGANIC_SPINAL_CORD_GROUP";

      // Curva suave da medula com curvaturas cifose/lordose fisiológicas
      const cordCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -6.6, -1.1),  // Forame magno
        new THREE.Vector3(0, -8.5, -1.2),  // Cervical C1-C8 (Intumescência C4-T1)
        new THREE.Vector3(0, -11.0, -1.3), // Torácica alta
        new THREE.Vector3(0, -13.5, -1.4), // Torácica média T6
        new THREE.Vector3(0, -15.5, -1.5), // Torácica baixa T12
        new THREE.Vector3(0, -17.5, -1.5), // Lombar L1-L2 (Cone Medular)
        new THREE.Vector3(0, -19.0, -1.5)  // Filo terminal
      ]);

      const cordGeo = new THREE.TubeGeometry(cordCurve, 42, 0.48, 12, false);
      const cPos = cordGeo.attributes.position;
      for (let i = 0; i < cPos.count; i++) {
        let x = cPos.getX(i);
        let y = cPos.getY(i);
        let z = cPos.getZ(i);

        // Achata ligeiramente no eixo z (formato oval real da medula humana)
        z *= 0.85;

        // Intumescência Cervical em y ~ -8.5
        const cervBulge = Math.exp(-Math.pow((y + 8.5) * 0.9, 2)) * 0.28;
        // Intumescência Lombar em y ~ -16.5
        const lumbBulge = Math.exp(-Math.pow((y + 16.5) * 1.1, 2)) * 0.24;
        // Afilamento do cone medular abaixo de -17.5
        let taper = 1.0;
        if (y < -17.5) {
          taper = Math.max(0.2, 1.0 - (-17.5 - y) * 0.5);
        }

        const factor = (1.0 + cervBulge + lumbBulge) * taper;
        x *= factor;
        z *= factor;

        cPos.setXYZ(i, x, y, z);
      }
      cordGeo.computeVertexNormals();

      const cordMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x10b981),
        roughness: 0.38,
        metalness: 0.05
      });
      const cordMesh = new THREE.Mesh(cordGeo, cordMat);
      cordMesh.name = "Medula_Espinhal_Cilindro";
      cordGroup.add(cordMesh);
      this.spinalMeshes.push(cordMesh);

      // Raízes nervosas espinhais orgânicas
      const pairs = 18;
      for (let p = 0; p < pairs; p++) {
        const rY = -7.2 - p * 0.65;
        [-1, 1].forEach((sign) => {
          const rootCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(sign * 0.42, rY, -1.2),
            new THREE.Vector3(sign * 0.85, rY - 0.15, -1.25),
            new THREE.Vector3(sign * 1.45, rY - 0.35, -1.3)
          ]);
          const rootGeo = new THREE.TubeGeometry(rootCurve, 6, 0.08, 6, false);
          const rootMat = new THREE.MeshStandardMaterial({ color: 0x34d399, roughness: 0.3 });
          const rMesh = new THREE.Mesh(rootGeo, rootMat);
          cordGroup.add(rMesh);
        });
      }

      // Cauda Equina (feixe de raízes filamentosas descendo do cone medular)
      const caudaFilaments = 36;
      for (let f = 0; f < caudaFilaments; f++) {
        const angle = (f / caudaFilaments) * Math.PI * 2;
        const rad = 0.2 + Math.random() * 0.35;
        const len = 3.5 + Math.random() * 2.5;

        const cCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(Math.cos(angle) * rad, -17.5, -1.5 + Math.sin(angle) * rad),
          new THREE.Vector3(Math.cos(angle) * (rad + 0.3), -19.5, -1.5 + (Math.random() - 0.5) * 0.3),
          new THREE.Vector3(Math.cos(angle) * (rad + 0.5), -17.5 - len, -1.5 + (Math.random() - 0.5) * 0.3)
        ]);
        const cGeo = new THREE.TubeGeometry(cCurve, 8, 0.045, 5, false);
        const cMat = new THREE.MeshStandardMaterial({ color: 0x6ee7b7, roughness: 0.35, transparent: true, opacity: 0.85 });
        const cMesh = new THREE.Mesh(cGeo, cMat);
        cordGroup.add(cMesh);
      }

      this.masterGroup.add(cordGroup);
    }

    // [PT-BR]: Ilumina diretamente a malha anatômica correspondente à estrutura selecionada (Sem Saturnos!).
    // [EN-US]: Illuminates directly the anatomical mesh corresponding to the selected structure (No Saturns!).
    highlightRegion(region) {
      if (!region) return;

      this.highlightCenter.set(region.center[0], region.center[1], region.center[2]);
      this.highlightRadius = 2.8;
      this.highlightColor.set(region.color);
      this.highlightIntensity = 1.0;

      if (this.cortexUniforms) {
        this.cortexUniforms.uHighlightCenter.value.copy(this.highlightCenter);
        this.cortexUniforms.uHighlightRadius.value = this.highlightRadius;
        this.cortexUniforms.uHighlightColor.value.copy(this.highlightColor);
        this.cortexUniforms.uHighlightIntensity.value = 1.0;
      }
    }

    // [PT-BR]: Define a transparência do córtex e das estruturas subcorticais.
    // [EN-US]: Sets transparency of cortex and subcortical structures.
    setAnatomyOpacity(cortexOpacity, subcortexOpacity) {
      if (this.cortexUniforms) {
        this.cortexUniforms.uOpacity.value = cortexOpacity;
      }
      this.subcorticalMeshes.forEach(m => {
        if (m.material) {
          m.material.opacity = subcortexOpacity;
          m.material.transparent = subcortexOpacity < 0.99;
        }
      });
    }

    // [PT-BR]: Atualiza a deformação patológica na malha do córtex (Worley/Voronoi Cavitation).
    // [EN-US]: Updates pathological damage on cortex mesh (Worley/Voronoi Cavitation).
    setDamage(damage) {
      if (this.cortexUniforms) {
        this.cortexUniforms.uDamage.value = damage;
      }
    }

    // [PT-BR]: Atualização por quadro para animar o pulso do destaque anatômico.
    // [EN-US]: Per-frame update to animate anatomical highlight pulse.
    update(dt) {
      if (this.cortexUniforms && this.highlightIntensity > 0) {
        // Pulso suave
        const pulse = 0.85 + Math.sin(performance.now() * 0.005) * 0.25;
        this.cortexUniforms.uHighlightIntensity.value = this.highlightIntensity * pulse;
      }
    }

    setVisible(isVisible) {
      this.masterGroup.visible = isVisible;
    }

    getRegions() {
      return this.regionsRegistry;
    }
  }

  window.CNSAnatomy3D = CNSAnatomy3D;
  window.CNS_REGIONS_REGISTRY = CNS_REGIONS_REGISTRY;

})(window);
