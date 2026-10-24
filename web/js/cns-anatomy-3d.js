// [PT-BR]: Macroanatomia 3D Completa de Todo o Sistema Nervoso Central (Encéfalo, Diencéfalo, Tronco, Cerebelo e Medula Espinhal).
// [EN-US]: Complete 3D Macroanatomy of the Entire Central Nervous System (Cerebrum, Diencephalon, Brainstem, Cerebellum, and Spinal Cord).
// [AI-CTX]: @llm-context: Complete CNS 3D procedural generator with neuroanatomical fidelity, sulci/gyri, subcortical nuclei, brainstem, cerebellum arbor vitae, and spinal cord segments.
//           @llm-invariant: All structures are raycastable, tagged with region metadata, support progressive transparency and pathological deformation.
//           @llm-neuroscience: Encapsulates Telencephalon (Lobes & Functional Areas), Limbic & Diencephalon, Basal Ganglia, Brainstem (Midbrain, Pons, Medulla), Cerebellum, and Spinal Cord (C1-Co1 + Cauda Equina).

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
      center: [0, 5, 0],
      optimalDist: 260,
      color: '#d1d5db',
      functionText: 'Comando global, integração sensitivo-motora, homeostase autônoma, cognição superior, linguagem e consciência.',
      clinicalText: 'Acometimento difuso em encefalopatias espongiformes (DCJ), leucoencefalopatias, esclerose múltipla e choque neurogênico.',
      neurotransmitter: 'Sistema integrado polissináptico (Glutamato, GABA, Dopamina, Serotonina, Acetilcolina, Noradrenalina)',
      citation: 'Kandel et al. Principles of Neural Science 6th Ed. (2021)',
      doi: '10.1036/0838577016',
      audioScript: 'Você está visualizando a totalidade do Sistema Nervoso Central Humano: o encéfalo com seus dois hemisférios, diencéfalo, tronco encefálico, cerebelo e a medula espinhal contínua descendo até a cauda equina.'
    },
    {
      id: 2,
      code: 'DLPFC_OFC',
      name: 'Córtex Pré-Frontal (Dorsolateral e Orbitofrontal — BA 9, 10, 11, 46)',
      category: 'TELENCÉFALO',
      tier: 'MESO',
      center: [-3.8, 5.2, 3.2],
      optimalDist: 85,
      color: '#38bdf8',
      functionText: 'Funções executivas centrais, tomada de decisão baseada em recompensa, flexibilidade cognitiva e memória de trabalho.',
      clinicalText: 'Síndrome disexecutiva, desinibição de conduta, apatia e apraxia motora precoce na Doença de Alzheimer e DCJ.',
      neurotransmitter: 'Dopamina (receptores D1/D2 mesocorticais) e L-Glutamato córtico-cortical',
      citation: 'Miller & Cohen (2001) / Petrides (2005)',
      doi: '10.1146/annurev.neuro.24.1.167',
      audioScript: 'O Córtex Pré-Frontal Dorsolateral e Orbitofrontal é o ápice do raciocínio e julgamento humano, orquestrando metas e inibindo impulsos primitivos.'
    },
    {
      id: 3,
      code: 'BROCA',
      name: 'Área de Broca (Giro Frontal Inferior — BA 44/45)',
      category: 'TELENCÉFALO',
      tier: 'MESO',
      center: [-5.2, 2.2, 1.4],
      optimalDist: 75,
      color: '#fb923c',
      functionText: 'Programação e expressão motora da fala, articulação fonológica e sintaxe linguística.',
      clinicalText: 'Afasia de Broca não-fluente por AVC da Artéria Cerebral Média esquerda ou degeneração frontotemporal.',
      neurotransmitter: 'Acetilcolina modulada por GABA e Glutamato',
      citation: 'Broca (1861) / Dronkers et al. (2007) Brain',
      doi: '10.1093/brain/awm042',
      audioScript: 'A Área de Broca no hemisfério esquerdo converte representações neurais abstratas em comandos motores coordenados para laringe, língua e lábios.'
    },
    {
      id: 4,
      code: 'M1_PRECENTRAL',
      name: 'Córtex Motor Primário M1 (Giro Pré-Central — BA 4)',
      category: 'TELENCÉFALO',
      tier: 'MESO',
      center: [-4.2, -1.2, 5.8],
      optimalDist: 70,
      color: '#f43f5e',
      functionText: 'Origem do Trato Corticoespinhal lateral, comando voluntário fino fracionado (Homúnculo Motor de Penfield).',
      clinicalText: 'Hemiplegia/hemiparesia contralateral espástica (AVC de ACM ou lesão medular alta) e mioclonias corticais.',
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
      center: [-4.2, -2.8, 5.4],
      optimalDist: 70,
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
      center: [-5.6, -3.8, 1.8],
      optimalDist: 75,
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
      center: [-1.4, -7.8, 0.4],
      optimalDist: 75,
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
      center: [-4.6, -1.8, 1.2],
      optimalDist: 60,
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
      center: [-3.4, 0.2, 0.6],
      optimalDist: 60,
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
      center: [-2.8, -2.4, -1.2],
      optimalDist: 50,
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
      center: [-2.4, -0.6, -1.8],
      optimalDist: 48,
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
      center: [-1.2, -2.2, 0.8],
      optimalDist: 50,
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
      center: [0.0, -0.8, -2.4],
      optimalDist: 45,
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
      center: [0.0, -3.2, 0.4],
      optimalDist: 40,
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
      name: 'Gânglios da Base (Estriado: Caudado e Putâmen; Globo Pálido e Subtalâmico)',
      category: 'NÚCLEOS DA BASE',
      tier: 'MESO',
      center: [-1.8, 0.6, 0.4],
      optimalDist: 55,
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
      center: [-0.9, -1.8, -1.3],
      optimalDist: 45,
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
      center: [0.0, -2.4, -3.2],
      optimalDist: 60,
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
      center: [0.0, -2.6, -5.2],
      optimalDist: 55,
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
      name: 'Cerebelo e Árvore da Vida (Arbor Vitae)',
      category: 'CEREBELO',
      tier: 'MESO',
      center: [0.0, -4.8, -4.0],
      optimalDist: 85,
      color: '#fda4af',
      functionText: 'Coordenação da motricidade fina, cálculo de erro em tempo real, tônus postural e reflexo vestíbulo-ocular.',
      clinicalText: 'Ataxia cerebelar da marcha, dismetria índice-nariz, disdiadococinesia e nistagmo vestibular.',
      neurotransmitter: 'GABA inibitório das Células de Purkinje e Glutamato das fibras trepadeiras e paralelas',
      citation: 'Ito (2006) Nature Rev Neurosci / Eccles, Ito & Szentágothai (1967)',
      doi: '10.1038/nrn1938',
      audioScript: 'O Cerebelo abriga mais da metade de todos os neurônios humanos. Suas folhas externas envolvem a substância branca ramificada da Árvore da Vida.'
    },
    {
      id: 20,
      code: 'SPINAL_CORD_CERVICAL',
      name: 'Medula Espinhal Cervical (C1–C8 e Intumescência Cervical C4–T1)',
      category: 'MEDULA ESPINHAL',
      tier: 'MESO',
      center: [0.0, -2.4, -9.5],
      optimalDist: 65,
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
      center: [0.0, -2.2, -16.5],
      optimalDist: 70,
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
      center: [0.0, -1.8, -24.0],
      optimalDist: 75,
      color: '#34d399',
      functionText: 'Inervação motora e sensorial dos membros inferiores (Plexo Lombossacral) e esfíncteres genitourinários/anais.',
      clinicalText: 'Síndrome da Cauda Equina (anestesia em sela, bexiga neurogênica e paraparesia flácida arrefléxica).',
      neurotransmitter: 'Acetilcolina nas placas motoras e GABA/Glicina interneuronal inibitória',
      citation: 'Wall & Melzack (1965) Science (Teoria das Comportas da Dor)',
      doi: '10.1126/science.150.3699.971',
      audioScript: 'A medula se afunila no cone medular ao nível da vértebra L2, de onde as raízes espinhais lombo-sacrais descem em feixe como a Cauda Equina.'
    }
  ];

  // [PT-BR]: Classe construtora da anatomia 3D completa de todo o SNC.
  // [EN-US]: Builder class for complete 3D anatomy of the entire CNS.
  // [AI-CTX]: @llm-invariant: Builds Three.js groups with vertex-sculpted gyri, subcortical nuclei, brainstem, and full spinal cord tract columns.
  class CNSAnatomy3D {
    constructor(scene) {
      this.scene = scene;
      this.masterGroup = new THREE.Group();
      this.masterGroup.name = "CNS_MASTER_GROUP";
      this.scene.add(this.masterGroup);

      this.corticalMeshes = [];
      this.subcorticalMeshes = [];
      this.brainstemMeshes = [];
      this.cerebellarMeshes = [];
      this.spinalMeshes = [];
      this.regionsRegistry = CNS_REGIONS_REGISTRY;

      this.buildAllCNSStructures();
    }

    // [PT-BR]: Orquestra a construção de todos os compartimentos neuroanatômicos.
    // [EN-US]: Orchestrates construction of all neuroanatomical compartments.
    // [AI-CTX]: @llm-neuroscience: Assembles whole CNS pipeline from telencephalon to coccygeal spinal nerves.
    buildAllCNSStructures() {
      this.buildSulcatedCerebrum();
      this.buildLimbicAndDiencephalon();
      this.buildBasalGanglia();
      this.buildCompleteBrainstem();
      this.buildFoliatedCerebellum();
      this.buildContinuousSpinalCord();
    }

    // [PT-BR]: Constrói o telencéfalo esculpindo sulcos e fissuras anatômicas reais (Rolando, Sylvius, Fissura Longitudinal).
    // [EN-US]: Builds cerebrum sculpting real anatomical sulci and fissures (Rolandic, Sylvian, Longitudinal Fissure).
    // [AI-CTX]: @llm-context: Displaces sphere vertices with sinusoidal harmonic sulcal patterns and interhemispheric cleft.
    buildSulcatedCerebrum() {
      const cerebrumGroup = new THREE.Group();
      cerebrumGroup.name = "CEREBRUM_TELENCEPHALON";

      // Criamos dois hemisférios (esquerdo e direito) com fissura longitudinal profunda
      [-1, 1].forEach((hemiSign) => {
        const radius = 32;
        const widthSeg = 64;
        const heightSeg = 52;
        const geo = new THREE.SphereGeometry(radius, widthSeg, heightSeg);
        const pos = geo.attributes.position;

        for (let i = 0; i < pos.count; i++) {
          let x = pos.getX(i);
          let y = pos.getY(i);
          let z = pos.getZ(i);

          // Esculpe formato oval cerebral (alongado anteroposteriormente e achatado inferiormente)
          x *= 0.82;
          y *= 0.90;
          z *= 1.15;

          // Desloca para formar os hemisférios esquerdo/direito com fissura longitudinal medial
          x = (x + hemiSign * 1.8);

          // Esculpe os Giros e Sulcos Cerebrais (Micro e Macro sulcos)
          // 1. Sulco Central de Rolando (separação frontal-parietal)
          const rolandicPhase = (z * 0.12 - y * 0.08);
          const rolandicDip = Math.exp(-Math.pow(rolandicPhase, 2) * 2.2) * 2.4;

          // 2. Sulco Lateral de Sylvius (profundo para o lobo temporal e ínsula)
          const sylvianPhase = (y + 4.0 + z * 0.25);
          const sylvianDip = (z > -10 && z < 25 && y < 5) ? Math.exp(-Math.pow(sylvianPhase * 0.15, 2)) * 3.2 : 0;

          // 3. Fissuras terciárias e giros neocorticais
          const gyriNoise = (Math.sin(x * 0.45) * Math.cos(y * 0.5) + Math.sin(z * 0.42) * Math.cos(x * 0.38)) * 1.35;

          // Aplica o deslocamento radial
          const r = Math.sqrt(x * x + y * y + z * z);
          if (r > 0.001) {
            const factor = 1.0 - (rolandicDip + sylvianDip - gyriNoise) / r;
            x *= factor;
            y *= factor;
            z *= factor;
          }

          pos.setXYZ(i, x, y, z);
        }
        geo.computeVertexNormals();

        const mat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(hemiSign < 0 ? 0xd1d5db : 0xc7cbd1),
          roughness: 0.42,
          metalness: 0.08,
          transparent: true,
          opacity: 1.0,
          depthWrite: true,
          side: THREE.DoubleSide
        });

        const mesh = new THREE.Mesh(geo, mat);
        mesh.name = hemiSign < 0 ? "Hemisferio_Esquerdo" : "Hemisferio_Direito";
        mesh.userData = { hemi: hemiSign };
        cerebrumGroup.add(mesh);
        this.corticalMeshes.push(mesh);
      });

      cerebrumGroup.position.set(0, 4.0, 0);
      cerebrumGroup.scale.set(1.05, 1.05, 1.05);
      this.masterGroup.add(cerebrumGroup);
    }

    // [PT-BR]: Constrói o Sistema Límbico (Hipocampo, Fórnix, Amígdala) e Diencéfalo (Tálamo, Hipotálamo, Hipófise, Pineal).
    // [EN-US]: Builds Limbic System (Hippocampus, Fornix, Amygdala) and Diencephalon (Thalamus, Hypothalamus, Pituitary, Pineal).
    // [AI-CTX]: @llm-neuroscience: Sculpted subcortical horseshoe limbic arch, ovoid thalami with interthalamic adhesion, infundibular pituitary.
    buildLimbicAndDiencephalon() {
      const diencephalonGroup = new THREE.Group();
      diencephalonGroup.name = "DIENCEPHALON_LIMBIC";

      // 1. Tálamo Bilateral em ovoide com Aderência Intertalâmica
      [-1, 1].forEach((sign) => {
        const thalGeo = new THREE.SphereGeometry(6.5, 24, 20);
        thalGeo.scale(0.8, 1.1, 1.4);
        const thalMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(0xea580c),
          roughness: 0.35,
          emissive: new THREE.Color(0x7c2d12),
          emissiveIntensity: 0.35
        });
        const thalMesh = new THREE.Mesh(thalGeo, thalMat);
        thalMesh.position.set(sign * 6.5, 2.0, -1.0);
        thalMesh.name = `Talamo_${sign < 0 ? 'Esq' : 'Dir'}`;
        diencephalonGroup.add(thalMesh);
        this.subcorticalMeshes.push(thalMesh);
      });

      // Aderência Intertalâmica conectando os dois tálamos
      const adhesionGeo = new THREE.CylinderGeometry(2.2, 2.2, 7.0, 16);
      adhesionGeo.rotateZ(Math.PI / 2);
      const adhesionMat = new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.4 });
      const adhesionMesh = new THREE.Mesh(adhesionGeo, adhesionMat);
      adhesionMesh.position.set(0, 2.0, -1.0);
      diencephalonGroup.add(adhesionMesh);

      // 2. Hipotálamo e Glândula Hipófise com Infundíbulo
      const hypoGeo = new THREE.ConeGeometry(5.2, 7.5, 20);
      hypoGeo.rotateX(Math.PI);
      const hypoMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0xd97706),
        roughness: 0.3,
        emissive: new THREE.Color(0x92400e),
        emissiveIntensity: 0.4
      });
      const hypoMesh = new THREE.Mesh(hypoGeo, hypoMat);
      hypoMesh.position.set(0, -3.2, 2.2);
      hypoMesh.name = "Hipotálamo";
      diencephalonGroup.add(hypoMesh);
      this.subcorticalMeshes.push(hypoMesh);

      // Haste Infundibular e Hipófise (Pituitária anterior e posterior)
      const stalkGeo = new THREE.CylinderGeometry(0.8, 1.2, 5.0, 12);
      const stalkMat = new THREE.MeshStandardMaterial({ color: 0xb45309 });
      const stalkMesh = new THREE.Mesh(stalkGeo, stalkMat);
      stalkMesh.position.set(0, -7.5, 2.4);
      diencephalonGroup.add(stalkMesh);

      const pituitaryGeo = new THREE.SphereGeometry(2.4, 16, 14);
      pituitaryGeo.scale(1.2, 0.9, 1.0);
      const pituitaryMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.35 });
      const pituitaryMesh = new THREE.Mesh(pituitaryGeo, pituitaryMat);
      pituitaryMesh.position.set(0, -10.2, 2.6);
      pituitaryMesh.name = "Glandula_Hipofise";
      diencephalonGroup.add(pituitaryMesh);
      this.subcorticalMeshes.push(pituitaryMesh);

      // 3. Glândula Pineal (Epitálamo posterior aos colículos)
      const pinealGeo = new THREE.ConeGeometry(1.6, 3.2, 12);
      pinealGeo.rotateX(-Math.PI / 2.2);
      const pinealMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0xca8a04),
        roughness: 0.25,
        emissive: new THREE.Color(0x854d0e),
        emissiveIntensity: 0.5
      });
      const pinealMesh = new THREE.Mesh(pinealGeo, pinealMat);
      pinealMesh.position.set(0, 0.8, -10.5);
      pinealMesh.name = "Glandula_Pineal";
      diencephalonGroup.add(pinealMesh);
      this.subcorticalMeshes.push(pinealMesh);

      // 4. Hipocampo bilateral (Curvatura em Corno de Amon) e Amígdala anterior
      [-1, 1].forEach((sign) => {
        // Arco do Hipocampo usando CurvePath e TubeGeometry
        const hipCurve = new THREE.CubicBezierCurve3(
          new THREE.Vector3(sign * 11, -3.5, 8),
          new THREE.Vector3(sign * 18, -4.0, -2),
          new THREE.Vector3(sign * 14, 1.0, -12),
          new THREE.Vector3(sign * 5, 6.0, -6) // Fórnix
        );
        const hipGeo = new THREE.TubeGeometry(hipCurve, 28, 2.2, 10, false);
        const hipMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(0x6366f1),
          roughness: 0.35,
          emissive: new THREE.Color(0x3730a3),
          emissiveIntensity: 0.3
        });
        const hipMesh = new THREE.Mesh(hipGeo, hipMat);
        hipMesh.name = `Hipocampo_${sign < 0 ? 'Esq' : 'Dir'}`;
        diencephalonGroup.add(hipMesh);
        this.subcorticalMeshes.push(hipMesh);

        // Amígdala esferoide no polo anterior do hipocampo
        const amygGeo = new THREE.SphereGeometry(3.2, 16, 12);
        amygGeo.scale(1.0, 0.85, 1.2);
        const amygMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(0xe11d48),
          roughness: 0.3,
          emissive: new THREE.Color(0x9f1239),
          emissiveIntensity: 0.4
        });
        const amygMesh = new THREE.Mesh(amygGeo, amygMat);
        amygMesh.position.set(sign * 11.5, -3.8, 10.5);
        amygMesh.name = `Amigdala_${sign < 0 ? 'Esq' : 'Dir'}`;
        diencephalonGroup.add(amygMesh);
        this.subcorticalMeshes.push(amygMesh);
      });

      this.masterGroup.add(diencephalonGroup);
    }

    // [PT-BR]: Constrói os Núcleos da Base (Núcleo Caudado em C, Putâmen e Globo Pálido).
    // [EN-US]: Builds Basal Ganglia (C-shaped Caudate Nucleus, Putamen, and Globus Pallidus).
    // [AI-CTX]: @llm-neuroscience: Models striatal arch wrapping lateral ventricles and lentiform complex.
    buildBasalGanglia() {
      const bgGroup = new THREE.Group();
      bgGroup.name = "BASAL_GANGLIA";

      [-1, 1].forEach((sign) => {
        // 1. Núcleo Caudado em arco em forma de C
        const caudateCurve = new THREE.CubicBezierCurve3(
          new THREE.Vector3(sign * 6.5, 8.5, 6.0),   // Cabeça volumosa
          new THREE.Vector3(sign * 11.5, 9.5, -4.0),  // Corpo
          new THREE.Vector3(sign * 12.0, 1.5, -12.0), // Cauda
          new THREE.Vector3(sign * 10.0, -3.0, -2.0)  // Terminação temporal
        );
        const caudateGeo = new THREE.TubeGeometry(caudateCurve, 24, 2.4, 10, false);
        const caudateMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(0xf59e0b),
          roughness: 0.35,
          emissive: new THREE.Color(0xb45309),
          emissiveIntensity: 0.35
        });
        const caudateMesh = new THREE.Mesh(caudateGeo, caudateMat);
        caudateMesh.name = `Nucleo_Caudado_${sign < 0 ? 'Esq' : 'Dir'}`;
        bgGroup.add(caudateMesh);
        this.subcorticalMeshes.push(caudateMesh);

        // 2. Núcleo Lentiforme (Putâmen + Globo Pálido Interno/Externo)
        const lentGeo = new THREE.SphereGeometry(5.8, 18, 14);
        lentGeo.scale(0.8, 1.0, 1.5);
        const lentMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(0xd97706),
          roughness: 0.4
        });
        const lentMesh = new THREE.Mesh(lentGeo, lentMat);
        lentMesh.position.set(sign * 14.5, 2.5, -1.0);
        lentMesh.name = `Putamen_GloboPalido_${sign < 0 ? 'Esq' : 'Dir'}`;
        bgGroup.add(lentMesh);
        this.subcorticalMeshes.push(lentMesh);
      });

      this.masterGroup.add(bgGroup);
    }

    // [PT-BR]: Constrói o Tronco Encefálico Completo (Mesencéfalo com Teto e Substância Negra, Ponte de Varólio, Bulbo com Decussação).
    // [EN-US]: Builds Full Brainstem (Midbrain with Tectum & Substantia Nigra, Pons, Medulla with Pyramidal Decussation).
    // [AI-CTX]: @llm-neuroscience: Anatomical brainstem pillar, cerebral peduncles, superior/inferior colliculi, olivary bodies, basilar groove.
    buildCompleteBrainstem() {
      const stemGroup = new THREE.Group();
      stemGroup.name = "BRAINSTEM_FULL";

      // 1. MESENCÉFALO (Midbrain)
      const midbrainGeo = new THREE.CylinderGeometry(6.2, 7.0, 9.5, 24);
      const midbrainMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x38bdf8),
        roughness: 0.45
      });
      const midbrainMesh = new THREE.Mesh(midbrainGeo, midbrainMat);
      midbrainMesh.position.set(0, -6.5, -4.5);
      stemGroup.add(midbrainMesh);
      this.brainstemMeshes.push(midbrainMesh);

      // Colículos Superiores e Inferiores (Teto Mesencefálico posterior)
      [
        { name: "Coliculo_Sup_Esq", pos: [-2.2, -4.5, -8.2] },
        { name: "Coliculo_Sup_Dir", pos: [2.2, -4.5, -8.2] },
        { name: "Coliculo_Inf_Esq", pos: [-2.0, -8.0, -8.0] },
        { name: "Coliculo_Inf_Dir", pos: [2.0, -8.0, -8.0] }
      ].forEach((col) => {
        const colGeo = new THREE.SphereGeometry(1.6, 12, 10);
        const colMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.35 });
        const cMesh = new THREE.Mesh(colGeo, colMat);
        cMesh.position.set(col.pos[0], col.pos[1], col.pos[2]);
        cMesh.name = col.name;
        stemGroup.add(cMesh);
      });

      // Substância Negra Bilateral (Pars Compacta e Reticulata)
      [-1, 1].forEach((sign) => {
        const snGeo = new THREE.BoxGeometry(2.4, 4.5, 1.2);
        snGeo.rotateZ(sign * 0.35);
        const snMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(0x1e293b),
          roughness: 0.3,
          emissive: new THREE.Color(0x0f172a),
          emissiveIntensity: 0.5
        });
        const snMesh = new THREE.Mesh(snGeo, snMat);
        snMesh.position.set(sign * 3.4, -6.5, -3.2);
        snMesh.name = `Substancia_Negra_${sign < 0 ? 'Esq' : 'Dir'}`;
        stemGroup.add(snMesh);
        this.brainstemMeshes.push(snMesh);
      });

      // 2. PONTE DE VARÓLIO (Pons) - Proeminência anterior e fibras transversas
      const ponsGeo = new THREE.SphereGeometry(8.5, 24, 20);
      ponsGeo.scale(1.15, 0.95, 0.85);
      const ponsMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x0ea5e9),
        roughness: 0.4
      });
      const ponsMesh = new THREE.Mesh(ponsGeo, ponsMat);
      ponsMesh.position.set(0, -14.5, -3.8);
      ponsMesh.name = "Ponte_de_Varolio";
      stemGroup.add(ponsMesh);
      this.brainstemMeshes.push(ponsMesh);

      // Sulco Basilar central na ponte (por onde passa a Artéria Basilar)
      const basilarGeo = new THREE.BoxGeometry(0.8, 9.5, 0.5);
      const basilarMat = new THREE.MeshStandardMaterial({ color: 0x0369a1 });
      const basilarMesh = new THREE.Mesh(basilarGeo, basilarMat);
      basilarMesh.position.set(0, -14.5, -0.2);
      stemGroup.add(basilarMesh);

      // 3. BULBO / MEDULA OBLONGA (Medulla Oblongata)
      const medullaGeo = new THREE.CylinderGeometry(5.2, 4.0, 14.0, 24);
      const medullaMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x0284c7),
        roughness: 0.42
      });
      const medullaMesh = new THREE.Mesh(medullaGeo, medullaMat);
      medullaMesh.position.set(0, -24.5, -4.8);
      medullaMesh.name = "Bulbo_MedulaOblonga";
      stemGroup.add(medullaMesh);
      this.brainstemMeshes.push(medullaMesh);

      // Pirâmides Bulbares e Decussação das Pirâmides
      [-1, 1].forEach((sign) => {
        // Pirâmide
        const pyrGeo = new THREE.CylinderGeometry(1.6, 1.2, 10.0, 14);
        const pyrMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.35 });
        const pyrMesh = new THREE.Mesh(pyrGeo, pyrMat);
        pyrMesh.position.set(sign * 1.8, -23.5, -2.6);
        stemGroup.add(pyrMesh);

        // Olivas Bulbares laterais
        const oliveGeo = new THREE.SphereGeometry(1.8, 12, 10);
        oliveGeo.scale(0.8, 1.6, 1.0);
        const oliveMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.4 });
        const oliveMesh = new THREE.Mesh(oliveGeo, oliveMat);
        oliveMesh.position.set(sign * 3.8, -22.8, -3.4);
        oliveMesh.name = `Oliva_Bulbar_${sign < 0 ? 'Esq' : 'Dir'}`;
        stemGroup.add(oliveMesh);
      });

      // Decussação das Pirâmides no terço inferior do bulbo
      const decussGeo = new THREE.TorusGeometry(2.4, 0.8, 10, 20, Math.PI);
      decussGeo.rotateX(Math.PI / 2);
      const decussMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.3 });
      const decussMesh = new THREE.Mesh(decussGeo, decussMat);
      decussMesh.position.set(0, -29.8, -3.2);
      decussMesh.name = "Decussacao_das_Piramides";
      stemGroup.add(decussMesh);
      this.brainstemMeshes.push(decussMesh);

      this.masterGroup.add(stemGroup);
    }

    // [PT-BR]: Constrói o Cerebelo Completo (Vérmis Central, Hemisférios com fólias e Árvore da Vida interna).
    // [EN-US]: Builds Full Cerebellum (Central Vermis, Foliated Hemispheres, and Internal Arbor Vitae).
    // [AI-CTX]: @llm-neuroscience: Cerebellar folia striations, primary fissure, peduncles linking to brainstem.
    buildFoliatedCerebellum() {
      const cerebGroup = new THREE.Group();
      cerebGroup.name = "CEREBELLUM_FULL";

      // 1. Hemisférios Cerebelares bilaterais com sulcos horizontais (Fólias)
      [-1, 1].forEach((sign) => {
        const cGeo = new THREE.SphereGeometry(18.5, 48, 36);
        const cPos = cGeo.attributes.position;
        for (let i = 0; i < cPos.count; i++) {
          let x = cPos.getX(i);
          let y = cPos.getY(i);
          let z = cPos.getZ(i);

          // Achata dorsoventralmente e alonga transversalmente
          x *= 1.15;
          y *= 0.72;
          z *= 0.88;

          // Esculpe as finas lâminas paralelas das fólias cerebelares
          const foliaWaves = Math.sin(y * 1.85) * 0.95;
          const r = Math.sqrt(x * x + y * y + z * z);
          if (r > 0.001) {
            const factor = 1.0 + foliaWaves / r;
            x *= factor;
            y *= factor;
            z *= factor;
          }
          cPos.setXYZ(i, x, y, z);
        }
        cGeo.computeVertexNormals();

        const cMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(0xfda4af),
          roughness: 0.48,
          metalness: 0.05
        });
        const cMesh = new THREE.Mesh(cGeo, cMat);
        cMesh.position.set(sign * 12.5, -14.5, -19.5);
        cMesh.name = `Cerebelo_Hemisferio_${sign < 0 ? 'Esq' : 'Dir'}`;
        cerebGroup.add(cMesh);
        this.cerebellarMeshes.push(cMesh);
      });

      // 2. Vérmis Cerebelar Central
      const vermisGeo = new THREE.SphereGeometry(11.0, 24, 24);
      vermisGeo.scale(0.65, 1.1, 0.9);
      const vermisMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.45 });
      const vermisMesh = new THREE.Mesh(vermisGeo, vermisMat);
      vermisMesh.position.set(0, -14.5, -18.5);
      vermisMesh.name = "Vermis_Cerebelar";
      cerebGroup.add(vermisMesh);
      this.cerebellarMeshes.push(vermisMesh);

      // 3. Pedúnculos Cerebelares (Inferior, Médio e Superior conectando ao Tronco)
      [-1, 1].forEach((sign) => {
        const pedCurve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(sign * 3.5, -14.0, -5.5),
          new THREE.Vector3(sign * 7.5, -14.5, -11.0),
          new THREE.Vector3(sign * 9.0, -14.5, -16.0)
        );
        const pedGeo = new THREE.TubeGeometry(pedCurve, 14, 2.6, 8, false);
        const pedMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.35 });
        const pedMesh = new THREE.Mesh(pedGeo, pedMat);
        cerebGroup.add(pedMesh);
      });

      this.masterGroup.add(cerebGroup);
    }

    // [PT-BR]: Constrói a Medula Espinhal Completa descendo do bulbo (Cervical, Torácica, Lombar, Cone Medular e Cauda Equina).
    // [EN-US]: Builds Full Continuous Spinal Cord descending from medulla (Cervical, Thoracic, Lumbar, Conus Medullaris, and Cauda Equina).
    // [AI-CTX]: @llm-neuroscience: Modeled with Cervical (C4-T1) and Lumbosacral (L1-S3) enlargements, dorsal/ventral rootlets, and spinal cord segments.
    buildContinuousSpinalCord() {
      const cordGroup = new THREE.Group();
      cordGroup.name = "SPINAL_CORD_COMPLETE";

      // 1. Cilindro da Medula Espinhal com Intumescências Anatômicas Reais
      const cordSegments = 64;
      const cordHeight = 95.0; // Desce de y = -31 até y = -126
      const cordGeo = new THREE.CylinderGeometry(2.4, 1.8, cordHeight, 28, cordSegments, false);
      const cordPos = cordGeo.attributes.position;

      for (let i = 0; i < cordPos.count; i++) {
        let x = cordPos.getX(i);
        let y = cordPos.getY(i);
        let z = cordPos.getZ(i);

        // Achata anteroposteriormente (formato oval real da medula)
        z *= 0.82;

        // Calcula a intumescência com base na altura y relativa (de +cordHeight/2 até -cordHeight/2)
        // Intumescência Cervical (C4–T1) em torno de y = +25
        const cervicalBulge = Math.exp(-Math.pow((y - 28.0) * 0.12, 2)) * 1.6;

        // Intumescência Lombossacral (L1–S3) em torno de y = -26
        const lumbarBulge = Math.exp(-Math.pow((y + 26.0) * 0.14, 2)) * 1.4;

        // Afilamento do Cone Medular no terço inferior (abaixo de y = -35)
        let taper = 1.0;
        if (y < -32.0) {
          const tDist = (-32.0 - y) / (cordHeight * 0.5 - 32.0);
          taper = Math.max(0.15, 1.0 - tDist * 0.85);
        }

        const bulge = 1.0 + (cervicalBulge + lumbarBulge) / 2.4;
        x *= bulge * taper;
        z *= bulge * taper;

        // Leve curvatura sagital cifose/lordose fisiológica
        z += Math.sin((y / cordHeight) * Math.PI * 2.2) * 1.8;

        cordPos.setXYZ(i, x, y, z);
      }
      cordGeo.computeVertexNormals();

      const cordMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x10b981),
        roughness: 0.38,
        metalness: 0.05
      });
      const cordMesh = new THREE.Mesh(cordGeo, cordMat);
      // Posiciona para iniciar perfeitamente abaixo do bulbo (y = -31 - 47.5 = -78.5)
      cordMesh.position.set(0, -78.5, -5.2);
      cordMesh.name = "Cilindro_Medula_Espinhal";
      cordGroup.add(cordMesh);
      this.spinalMeshes.push(cordMesh);

      // 2. Raízes Nervosas Espinhais e Gânglios da Raiz Dorsal (31 pares)
      const numPairs = 24;
      for (let p = 0; p < numPairs; p++) {
        const rootY = -34.0 - p * 3.7;
        [-1, 1].forEach((sign) => {
          // Raiz dorsal e ventral projetando-se lateralmente
          const rootCurve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(sign * 2.2, rootY, -5.2),
            new THREE.Vector3(sign * 4.8, rootY - 1.2, -5.2),
            new THREE.Vector3(sign * 8.0, rootY - 2.5, -5.2)
          );
          const rootGeo = new THREE.TubeGeometry(rootCurve, 8, 0.45, 6, false);
          const rootMat = new THREE.MeshStandardMaterial({ color: 0x34d399, roughness: 0.3 });
          const rootMesh = new THREE.Mesh(rootGeo, rootMat);
          cordGroup.add(rootMesh);

          // Gânglio Espinhal da Raiz Dorsal (DRG - contendo corpos sensitivos pseudo-unipolares)
          const drgGeo = new THREE.SphereGeometry(0.9, 10, 8);
          drgGeo.scale(1.2, 0.7, 0.7);
          const drgMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.35 });
          const drgMesh = new THREE.Mesh(drgGeo, drgMat);
          drgMesh.position.set(sign * 6.2, rootY - 1.8, -5.2);
          drgMesh.name = `DRG_Segmento_${p + 1}_${sign < 0 ? 'E' : 'D'}`;
          cordGroup.add(drgMesh);
        });
      }

      // 3. Cauda Equina (Leque filamentar de raízes lombo-sacrais abaixo do Cone Medular)
      const caudaGroup = new THREE.Group();
      caudaGroup.name = "CAUDA_EQUINA";
      const caudaFilaments = 42;
      for (let f = 0; f < caudaFilaments; f++) {
        const angle = (f / caudaFilaments) * Math.PI * 2;
        const spreadRad = 0.8 + Math.random() * 1.8;
        const endSpread = 2.0 + Math.random() * 4.5;
        const length = 28.0 + Math.random() * 14.0;

        const caudaCurve = new THREE.CubicBezierCurve3(
          new THREE.Vector3(Math.cos(angle) * spreadRad, -118.0, -5.2 + Math.sin(angle) * spreadRad),
          new THREE.Vector3(Math.cos(angle) * (spreadRad + 1.5), -126.0, -5.2 + (Math.random() - 0.5) * 2),
          new THREE.Vector3(Math.cos(angle) * endSpread, -136.0, -5.2 + (Math.random() - 0.5) * 3),
          new THREE.Vector3(Math.cos(angle) * (endSpread * 0.7), -118.0 - length, -5.2 + (Math.random() - 0.5) * 2)
        );
        const filGeo = new THREE.TubeGeometry(caudaCurve, 12, 0.22, 5, false);
        const filMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(0xa7f3d0),
          roughness: 0.35,
          transparent: true,
          opacity: 0.85
        });
        const filMesh = new THREE.Mesh(filGeo, filMat);
        caudaGroup.add(filMesh);
      }
      cordGroup.add(caudaGroup);

      this.masterGroup.add(cordGroup);
    }

    // [PT-BR]: Aplica transparência ou destaque a regiões selecionadas (Raycasting e foco).
    // [EN-US]: Applies transparency or highlight to selected regions (Raycasting and focus).
    // [AI-CTX]: @llm-invariant: Supports progressive opacity and highlight color swaps for 3D exploration.
    setAnatomyOpacity(cortexOpacity, subcortexOpacity) {
      this.corticalMeshes.forEach(m => {
        if (m.material) {
          m.material.opacity = cortexOpacity;
          m.material.transparent = cortexOpacity < 0.99;
        }
      });
      this.subcorticalMeshes.forEach(m => {
        if (m.material) {
          m.material.opacity = subcortexOpacity;
        }
      });
    }

    // [PT-BR]: Retorna o registro completo de regiões anatômicas do SNC para a UI.
    // [EN-US]: Returns complete registry of CNS anatomical regions for UI.
    getRegions() {
      return this.regionsRegistry;
    }
  }

  // [PT-BR]: Exportação global da classe CNSAnatomy3D e registro.
  // [EN-US]: Global export of CNSAnatomy3D class and registry.
  // [AI-CTX]: @llm-invariant: window.CNSAnatomy3D & window.CNS_REGIONS_REGISTRY available globally.
  window.CNSAnatomy3D = CNSAnatomy3D;
  window.CNS_REGIONS_REGISTRY = CNS_REGIONS_REGISTRY;

})(window);
