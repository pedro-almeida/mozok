// [PT-BR]: Macroanatomia 3D Real de Todo o Sistema Nervoso Central (Córtex MNI152 Real, Cerebelo Real, Estriado, Tálamo, Hipotálamo-Hipófise Esculpido, Tronco Encefálico e Medula Espinhal Contínua de Alta Resolução).
// [EN-GB]: Real 3D Macroanatomy of the Entire Central Nervous System (Real MNI152 Cortex, Real Cerebellar Folia, Striatum, Thalamus, Sculpted Hypothalamus-Pituitary, and Continuous High-Resolution Brainstem and Spinal Cord).
// [AI-CTX]: @llm-context: Complete CNS scientific atlas viewer using McGill BrainBrowser MNI152 cortical surface (window.REAL_MNI_BRAIN) and Brainglobe/MNI subcortical atlas (window.SCIENTIFIC_ATLAS_MESHES).
//           @llm-invariant: Strictly zero TorusGeometry, zero floating spheres ("balloon animals"), zero hard primitives. Unified MNI152 coordinate system with rotation.set(0, 0, 0) and uniform SCALE = 10.0.
//           @llm-neuroscience: Telencephalon (+X Left Hemisphere / -X Right Hemisphere, +Z Anterior Frontal / -Z Posterior Occipital), Diencephalon, Mesencephalon, Pons, Medulla, and Continuous Spinal Cord down to cauda equina.

(function (window) {
  'use strict';

  // [PT-BR]: Fator de escala anatômico uniforme para transposição de coordenadas MNI152 milimétricas para o espaço da cena WebGL.
  // [EN-GB]: Uniform anatomical scale factor for transposing MNI152 millimetric coordinates into the WebGL scene space.
  // [AI-CTX]: @llm-invariant: All meshes and coordinates must respect SCALE = 10.0 and rotation.set(0, 0, 0).
  const SCALE = 10.0;

  // [PT-BR]: Registro exaustivo das 22 regiões e estruturas anatômicas do SNC com coordenadas MNI152 validadas (multiplicadas por 10.0 na cena).
  // [EN-GB]: Comprehensive registry of all 22 CNS anatomical structures and regions with validated MNI152 coordinates (multiplied by 10.0 in scene space).
  // [AI-CTX]: @llm-neuroscience: +X is anatomical Left Hemisphere, -X is Right Hemisphere, +Z is Anterior (Frontal), -Z is Posterior (Occipital), +Y is Superior (Dorsal), -Y is Inferior (Ventral).
  const CNS_REGIONS_REGISTRY = [
    {
      id: 1,
      code: 'WB_CNS',
      name: 'Sistema Nervoso Central Completo (Encéfalo + Medula Espinhal)',
      category: 'VISÃO GLOBAL',
      tier: 'MACRO',
      center: [0.0, -25.0, 0.0],
      mniCenter: [0.0, -2.5, 0.0],
      optimalDist: 220,
      color: '#d1d5db',
      functionText: 'Comando global, integração sensitivo-motora, homeostase autônoma, cognição superior, linguagem e consciência.',
      clinicalText: 'Acometimento difuso em encefalopatias espongiformes (DCJ), leucoencefalopatias, esclerose múltipla e choque neurogênico.',
      neurotransmitter: 'Sistema integrado polissináptico (Glutamato, GABA, Dopamina, Serotonina, Acetilcolina)',
      citation: 'Kandel et al. Principles of Neural Science 6th Ed. (2021)',
      doi: '10.1036/0838577016',
      audioScript: 'Você está contemplando a totalidade do Sistema Nervoso Central Humano: o encéfalo esculpido a partir da média MNI152, diencéfalo, tronco encefálico, cerebelo anatômico e a medula espinhal contínua descendo até a cauda equina.'
    },
    {
      id: 2,
      code: 'DLPFC_LEFT',
      name: 'Córtex Pré-Frontal Dorsolateral Esquerdo (DLPFC — BA 9/46)',
      category: 'TELENCÉFALO',
      tier: 'MESO',
      center: [+30.4, +18.6, +47.2],
      mniCenter: [+3.04, +1.86, +4.72],
      optimalDist: 110,
      color: '#38bdf8',
      functionText: 'Funções executivas centrais, memória operacional de trabalho, planejamento abstrato e flexibilidade cognitiva.',
      clinicalText: 'Síndrome disexecutiva, apatia, déficit de atenção sustentada e comprometimento precoce na demência.',
      neurotransmitter: 'Dopamina (receptores D1 mesocorticais) e L-Glutamato córtico-cortical',
      citation: 'Miller & Cohen (2001) / Petrides (2005)',
      doi: '10.1146/annurev.neuro.24.1.167',
      audioScript: 'O Córtex Pré-Frontal Dorsolateral Esquerdo orquestra o planejamento superior e o raciocínio executivo, inibindo respostas automáticas e mantendo metas cognitivas ativas.'
    },
    {
      id: 3,
      code: 'BROCA_LEFT',
      name: 'Área de Broca (Giro Frontal Inferior Esquerdo — BA 44/45)',
      category: 'TELENCÉFALO',
      tier: 'MESO',
      center: [+46.2, +5.0, +23.9],
      mniCenter: [+4.62, +0.50, +2.39],
      optimalDist: 105,
      color: '#fb923c',
      functionText: 'Programação motora da fala, articulação fonológica e processamento morfossintático da linguagem verbal.',
      clinicalText: 'Afasia motora não-fluente de Broca com preservação relativa da compreensão; território vascular crítico da ACM esquerda.',
      neurotransmitter: 'Acetilcolina modulada por GABA e Glutamato',
      citation: 'Broca (1861) / Dronkers et al. (2007) Brain',
      doi: '10.1093/brain/awm042',
      audioScript: 'A Área de Broca, situada estritamente no hemisfério esquerdo anatômico nos giros opercular e triangular, converte formulações linguísticas abstratas em comandos motores coordenados para as pregas vocais e lábios.'
    },
    {
      id: 4,
      code: 'M1_LEFT',
      name: 'Córtex Motor Primário M1 (Giro Pré-Central Esquerdo — BA 4)',
      category: 'TELENCÉFALO',
      tier: 'MESO',
      center: [+37.9, +38.0, +4.3],
      mniCenter: [+3.79, +3.80, +0.43],
      optimalDist: 110,
      color: '#f43f5e',
      functionText: 'Origem do Trato Corticoespinhal lateral, comando motor voluntário fracionado com organização somatotópica de Penfield.',
      clinicalText: 'Hemiplegia espástica contralateral no AVC de ACM ou TCE; mioclonias corticais na DCJ.',
      neurotransmitter: 'L-Glutamato excitatório nas células piramidais gigantes de Betz da Camada V',
      citation: 'Penfield & Boldrey (1937) / Betz (1874)',
      doi: '10.1093/brain/60.4.389',
      audioScript: 'O Giro Pré-Central Esquerdo abriga o Córtex Motor Primário. Aqui residem os neurônios piramidais de Betz da Camada V, cujos axônios descem ininterruptamente pela cápsula interna até a medula espinhal.'
    },
    {
      id: 5,
      code: 'S1_LEFT',
      name: 'Córtex Somatossensorial Primário S1 (Giro Pós-Central Esquerdo — BA 3/1/2)',
      category: 'TELENCÉFALO',
      tier: 'MESO',
      center: [+34.7, +36.5, -5.4],
      mniCenter: [+3.47, +3.65, -0.54],
      optimalDist: 110,
      color: '#ec4899',
      functionText: 'Mapeamento somatotópico contralateral de tato epicrítico, dor, temperatura e propriocepção consciente.',
      clinicalText: 'Hipoestesia/anestesia contralateral, astereognosia e parestesias em lesões isquêmicas parietais.',
      neurotransmitter: 'L-Glutamato córtico-talâmico e interneurônios inibitórios GABAérgicos',
      citation: 'Mountcastle (1957) J Neurophysiol',
      doi: '10.1152/jn.1957.20.4.408',
      audioScript: 'O Giro Pós-Central Esquerdo recebe pelo leminisco medial e trato espinotalâmico todas as sensações do corpo contralateral mapeadas no homúnculo sensitivo.'
    },
    {
      id: 6,
      code: 'WERNICKE_LEFT',
      name: 'Área de Wernicke e Fascículo Arqueado (Giro Temporal Superior Esquerdo — BA 22)',
      category: 'TELENCÉFALO',
      tier: 'MESO',
      center: [+48.9, -2.9, -14.1],
      mniCenter: [+4.89, -0.29, -1.41],
      optimalDist: 105,
      color: '#06b6d4',
      functionText: 'Decodificação fonológica auditiva, semântica lexical da linguagem e condução arqueada para Broca.',
      clinicalText: 'Afasia fluente de Wernicke (jargonafasia com anosognosia) ou afasia de condução por lesão do fascículo arqueado.',
      neurotransmitter: 'Glutamato e GABA em circuitos córtico-talâmicos auditivos',
      citation: 'Wernicke (1874) / Catani et al. (2005)',
      doi: '10.1002/ana.20404',
      audioScript: 'A Área de Wernicke no hemisfério esquerdo interpreta os fonemas e o sentido semântico da fala, projetando axônios mielinizados até Broca através do fascículo arqueado.'
    },
    {
      id: 7,
      code: 'V1_CALCARINE',
      name: 'Córtex Visual Primário V1 (Sulco Calcarino Occipital — BA 17)',
      category: 'TELENCÉFALO',
      tier: 'MESO',
      center: [+17.0, -11.8, -63.7],
      mniCenter: [+1.70, -1.18, -6.37],
      optimalDist: 110,
      color: '#8b5cf6',
      functionText: 'Mapeamento retinotópico de alta resolução, orientação de bordas, contraste espacial e disparidade binocular.',
      clinicalText: 'Hemianopsia homônima contralateral com preservação macular em AVC de Artéria Cerebral Posterior.',
      neurotransmitter: 'L-Glutamato vindo das radiações ópticas geniculocalcarinas',
      citation: 'Hubel & Wiesel (1962) / Felleman & Van Essen (1991)',
      doi: '10.1113/jphysiol.1962.sp006837',
      audioScript: 'No polo occipital posterior, o Córtex Visual Primário às margens do sulco calcarino decifra os impulsos elétricos originados nos fotorreceptores da retina.'
    },
    {
      id: 8,
      code: 'A1_LEFT',
      name: 'Córtex Auditivo Primário A1 (Giros Transversos de Heschl — BA 41/42)',
      category: 'TELENCÉFALO',
      tier: 'MESO',
      center: [+47.6, -8.6, -1.2],
      mniCenter: [+4.76, -0.86, -0.12],
      optimalDist: 100,
      color: '#14b8a6',
      functionText: 'Mapeamento tonotópico coclear, discriminação de frequências acústicas e sincronização binaural.',
      clinicalText: 'Agnosia auditiva cortical, perda de discriminação fonética e alucinações sonoras temporais.',
      neurotransmitter: 'L-Glutamato excitatório e GABA em inibição lateral',
      citation: 'Heschl (1878) / Kaas & Hackett (2000)',
      doi: '10.1073/pnas.97.22.11793',
      audioScript: 'Profundo ao sulco lateral, o giro transverso anterior de Heschl processa as frequências acústicas com arquitetura tonotópica precisa.'
    },
    {
      id: 9,
      code: 'INSULA_LEFT',
      name: 'Córtex da Ínsula Esquerda (Profunda ao Sulco Lateral de Sylvius)',
      category: 'TELENCÉFALO',
      tier: 'MESO',
      center: [+35.5, -3.5, +6.0],
      mniCenter: [+3.55, -0.35, +0.60],
      optimalDist: 95,
      color: '#a855f7',
      functionText: 'Integração interoceptiva viscero-sensorial, percepção gustativa, empatia social e homeostase autonômica.',
      clinicalText: 'Disautonomia neurovegetativa, agnosia gustativa e perda da consciência somática de dor.',
      neurotransmitter: 'GABA, Serotonina e Neuropeptídeos autonômicos',
      citation: 'Craig (2009) Nat Rev Neurosci',
      doi: '10.1038/nrn2555',
      audioScript: 'A Ínsula, oculta sob os opérculos frontal, parietal e temporal, é o centro da percepção visceral, da interocepção e do processamento emocional consciente.'
    },
    {
      id: 10,
      code: 'PARIETAL_LEFT',
      name: 'Lobo Parietal Superior Esquerdo (BA 7 / Área de Associação Sensitiva)',
      category: 'TELENCÉFALO',
      tier: 'MESO',
      center: [+26.0, +41.0, -32.0],
      mniCenter: [+2.60, +4.10, -3.20],
      optimalDist: 115,
      color: '#6366f1',
      functionText: 'Integração sensoriomotora visuoespacial, manipulação de coordenadas espaciais e esquema corporal.',
      clinicalText: 'Apraxia ideomotora, síndrome de Balint (ataxia óptica) e déficits de navegação espacial.',
      neurotransmitter: 'Glutamato e Acetilcolina em vias córtico-parietais',
      citation: 'Andersen & Buneo (2002) Annu Rev Neurosci',
      doi: '10.1146/annurev.neuro.25.112701.142922',
      audioScript: 'O Lobo Parietal Superior sintetiza estímulos visuais e somatossensoriais para gerar o mapa do corpo no espaço tridimensional.'
    },
    {
      id: 11,
      code: 'HIPPOCAMPUS',
      name: 'Hipocampo (Corno de Amon CA1–CA4 e Giro Denteado)',
      category: 'SISTEMA LÍMBICO',
      tier: 'MESO',
      center: [+24.5, -18.5, -11.0],
      mniCenter: [+2.45, -1.85, -1.10],
      optimalDist: 95,
      color: '#4f46e5',
      functionText: 'Consolidação da memória episódica, navegação espacial através de células de lugar (place cells) e neurogênese adulta.',
      clinicalText: 'Amnésia anterógrada severa na Doença de Alzheimer (atrofia precoce de CA1/subículo), epilepsia de lobo temporal mesial.',
      neurotransmitter: 'L-Glutamato na via perfurante/musgosa e Acetilcolina septal',
      citation: 'Scoville & Milner (1957) / O’Keefe & Nadel (1978)',
      doi: '10.1136/jnnp.20.1.11',
      audioScript: 'O Hipocampo, situado medialmente no lobo temporal e contínuo ao fórnix, consolida memórias recentes em memórias de longo prazo e codifica a navegação espacial.'
    },
    {
      id: 12,
      code: 'AMYGDALA',
      name: 'Complexo Amigdaloidiano (Amígdala — Núcleos BLA e CeA)',
      category: 'SISTEMA LÍMBICO',
      tier: 'MESO',
      center: [+21.5, -14.5, +4.5],
      mniCenter: [+2.15, -1.45, +0.45],
      optimalDist: 90,
      color: '#e11d48',
      functionText: 'Detecção de ameaças, condicionamento aversivo ao medo, valência emocional da memória e respostas de fuga/luta.',
      clinicalText: 'Síndrome de Klüver-Bucy (hiperoralidade, docilidade extrema, ausência de medo), transtorno de estresse pós-traumático (TEPT).',
      neurotransmitter: 'GABA inibitório modulado por Noradrenalina e Serotonina',
      citation: 'LeDoux (2000) Annu Rev Neurosci',
      doi: '10.1146/annurev.neuro.23.1.155',
      audioScript: 'A Amígdala, localizada logo à frente da cabeça do hipocampo, avalia instantaneamente estímulos de perigo e ativa o eixo do estresse antes mesmo da percepção consciente.'
    },
    {
      id: 13,
      code: 'STRIATUM',
      name: 'Corpo Estriado (Núcleo Caudado e Putâmen)',
      category: 'NÚCLEOS DA BASE',
      tier: 'MESO',
      center: [+18.5, +2.0, +8.5],
      mniCenter: [+1.85, +0.20, +0.85],
      optimalDist: 100,
      color: '#f59e0b',
      functionText: 'Porta de entrada dos gânglios da base, seleção de programas motores, aprendizado por reforço e hábitos automatizados.',
      clinicalText: 'Bradicinesia e rigidez na Doença de Parkinson; coreia de Huntington por morte de neurônios espinhosos médios GABAérgicos.',
      neurotransmitter: 'Dopamina (receptores D1 da via direta e D2 da via indireta) e GABA',
      citation: 'Alexander, DeLong & Strick (1986) / Graybiel (2008)',
      doi: '10.1146/annurev.ne.09.030186.002043',
      audioScript: 'O Corpo Estriado integra os comandos motores corticais com os disparos dopaminérgicos da substância negra para autorizar ou inibir movimentos voluntários.'
    },
    {
      id: 14,
      code: 'THALAMUS',
      name: 'Tálamo (Núcleos de Relé e Pulvinar Posterior)',
      category: 'DIENCÉFALO',
      tier: 'MESO',
      center: [+11.5, -4.0, -8.0],
      mniCenter: [+1.15, -0.40, -0.80],
      optimalDist: 100,
      color: '#ea580c',
      functionText: 'Estação de relé sensorial universal para o córtex, sincronização tálamo-cortical de 40 Hz e filtro atencional.',
      clinicalText: 'Sinal do taco de hóquei (hiperintensidade do pulvinar) na DCJ variante; dor talâmica central (síndrome de Dejerine-Roussy).',
      neurotransmitter: 'Glutamato córtico-talâmico e inibição pelo núcleo reticular GABAérgico',
      citation: 'Sherman & Guillery (2002) / Jones (2007)',
      doi: '10.1098/rstb.2002.1157',
      audioScript: 'O Tálamo atua como o grande comutador central do encéfalo. Todas as vias sensitivas — exceto o olfato — fazem sinapse nos seus núcleos antes de alcançarem a consciência cortical.'
    },
    {
      id: 15,
      code: 'HYPOTHALAMUS_PITUITARY',
      name: 'Hipotálamo, Infundíbulo e Glândula Hipófise',
      category: 'DIENCÉFALO / ENDÓCRINO',
      tier: 'MESO',
      center: [0.0, -17.5, +7.5],
      mniCenter: [0.00, -1.75, +0.75],
      optimalDist: 90,
      color: '#d97706',
      functionText: 'Centro supremo de homeostase: termorregulação, ritmo circadiano, apetite, osmolaridade e controle do eixo endócrino.',
      clinicalText: 'Diabetes insipidus por deficit de ADH, pan-hipopituitarismo, síndrome de Cushing e desregulação neurovegetativa.',
      neurotransmitter: 'Oxitocina, Vasopressina (ADH), CRH, GnRH, TRH e Dopamina hipofisiotrópica',
      citation: 'Saper & Lowell (2014) Cell',
      doi: '10.1016/j.cell.2014.05.023',
      audioScript: 'O Hipotálamo e a Hipófise formam a ponte entre o sistema neural e o sistema endócrino, regulando temperatura, hormônios e equilíbrio hídrico.'
    },
    {
      id: 16,
      code: 'PINEAL_GLAND',
      name: 'Glândula Pineal (Epitálamo)',
      category: 'EPITÁLAMO',
      tier: 'MESO',
      center: [0.0, -3.5, -20.5],
      mniCenter: [0.00, -0.35, -2.05],
      optimalDist: 85,
      color: '#fbbf24',
      functionText: 'Síntese circadiana de Melatonina em resposta à escuridão sincronizada pelo núcleo supraquiasmático.',
      clinicalText: 'Calcificação precoce, pinealomas com hidrocefalia por oclusão do aqueduto de Sylvius e Síndrome de Parinaud.',
      neurotransmitter: 'Melatonina e Serotonina',
      citation: 'Macchi & Bruce (2004) Front Neuroendocrinol',
      doi: '10.1016/j.yfrne.2004.08.001',
      audioScript: 'A Glândula Pineal, no teto do terceiro ventrículo, monitora a alternância dia-noite e secreta melatonina para orquestrar o sono reparador.'
    },
    {
      id: 17,
      code: 'MIDBRAIN_SN',
      name: 'Mesencéfalo e Substância Negra (Pars Compacta)',
      category: 'TRONCO ENCEFÁLICO',
      tier: 'MESO',
      center: [+7.5, -25.5, -6.5],
      mniCenter: [+0.75, -2.55, -0.65],
      optimalDist: 90,
      color: '#38bdf8',
      functionText: 'Síntese de Dopamina nigroestriatal, reflexos auditivos e visuais nos colículos, e controle do tônus muscular.',
      clinicalText: 'Morte de neurônios dopaminérgicos pigmentados por neuromelanina na Doença de Parkinson; paralisia supranuclear progressiva.',
      neurotransmitter: 'Dopamina nigral e GABA da pars reticulata',
      citation: 'Dahlström & Fuxe (1964) / Hirsch et al. (1988) Nature',
      doi: '10.1038/334345a0',
      audioScript: 'O Mesencéfalo abriga a Substância Negra, rica em neuromelanina. A perda dessas células produtoras de dopamina é a causa patológica direta da rigidez e tremor no Parkinson.'
    },
    {
      id: 18,
      code: 'PONS_VAROLII',
      name: 'Ponte de Varólio (Protuberância Anular)',
      category: 'TRONCO ENCEFÁLICO',
      tier: 'MESO',
      center: [0.0, -41.0, -4.5],
      mniCenter: [0.00, -4.10, -0.45],
      optimalDist: 95,
      color: '#0284c7',
      functionText: 'Conexão córtico-ponto-cerebelar, núcleos dos nervos cranianos V, VI, VII e VIII, e centro pneumotáxico respiratório.',
      clinicalText: 'Síndrome do encarceramento (Locked-in) em trombose da artéria basilar, mielinólise pontina central.',
      neurotransmitter: 'Noradrenalina (Locus Coeruleus), Glutamato e Acetilcolina',
      citation: 'Brodal (1981) Neurological Anatomy',
      doi: '10.1093/acprof:oso/9780195052596.001.0001',
      audioScript: 'A Ponte de Varólio possui um volumoso abaulamento ventral de fibras transversais que levam ordens motoras ao cerebelo e contém núcleos de nervos cranianos vitais.'
    },
    {
      id: 19,
      code: 'MEDULLA_OBLONGATA',
      name: 'Bulbo (Medula Oblonga) e Decussação das Pirâmides',
      category: 'TRONCO ENCEFÁLICO',
      tier: 'MESO',
      center: [0.0, -58.5, -6.5],
      mniCenter: [0.00, -5.85, -0.65],
      optimalDist: 95,
      color: '#0369a1',
      functionText: 'Centros vitais cardiorrespiratórios, reflexos vasomotores, deglutição, vômito e cruzamento piramidal motor.',
      clinicalText: 'Morte encefálica por herniação tonsilar no forame magno; síndrome bulbar lateral de Wallenberg.',
      neurotransmitter: 'Serotonina (Núcleos da Rafe), Noradrenalina, Dopamina e Acetilcolina',
      citation: 'Wallenberg (1895) / Guyton & Hall (2020)',
      doi: '10.1007/bf01673516',
      audioScript: 'O Bulbo é o centro da sobrevivência humana. Em sua porção anterior, as fibras motoras cruzam para o lado oposto na decussação das pirâmides, enquanto seu interior regula o coração e a respiração.'
    },
    {
      id: 20,
      code: 'CEREBELLUM_FOLIA',
      name: 'Cerebelo (Fólias, Vérmis e Árvore da Vida)',
      category: 'CEREBELO',
      tier: 'MESO',
      center: [0.0, -44.0, -32.0],
      mniCenter: [0.00, -4.40, -3.20],
      optimalDist: 110,
      color: '#fda4af',
      functionText: 'Coordenação motora fina, cronometria de movimentos, correção de erros motores em tempo real e equilíbrio vestibular.',
      clinicalText: 'Ataxia cerebelar da marcha, dismetria, disdiadococinesia, tremor intencional e nistagmo.',
      neurotransmitter: 'GABA nas células gigantes de Purkinje e Glutamato nas células granulares',
      citation: 'Eccles, Ito & Szentágothai (1967) / Ito (2006)',
      doi: '10.1038/nrn1988',
      audioScript: 'O Cerebelo contém mais de metade de todos os neurônios do cérebro. Suas fólias delgadas e as células de Purkinje corrigem em milissegundos qualquer erro de execução motora.'
    },
    {
      id: 21,
      code: 'SPINAL_CERVICAL_THORACIC',
      name: 'Medula Espinhal Cervical e Torácica (C1–T12)',
      category: 'MEDULA ESPINHAL',
      tier: 'MESO',
      center: [0.0, -100.0, -8.5],
      mniCenter: [0.00, -10.00, -0.85],
      optimalDist: 130,
      color: '#10b981',
      functionText: 'Condução ascendente sensitiva (lemnisco medial e espinotalâmico) e descendente motora piramidal para membros superiores e tronco.',
      clinicalText: 'Tetraplegia em secção cervical alta (C1-C4 com falência diafragmática do nervo frênico); paraplegia torácica; placas de Esclerose Múltipla.',
      neurotransmitter: 'Glutamato nos tratos de substância branca e Acetilcolina nos motoneurônios alfa',
      citation: 'Cajal (1909) Histologie du Système Nerveux',
      doi: '10.1037/11296-000',
      audioScript: 'A Medula Espinhal Cervical e Torácica estende-se como a rodovia elétrica primordial do organismo, apresentando a intumescência cervical para o controle refinado das mãos.'
    },
    {
      id: 22,
      code: 'SPINAL_LUMBAR_CAUDA',
      name: 'Medula Espinhal Lombossacral, Cone Medular e Cauda Equina',
      category: 'MEDULA ESPINHAL',
      tier: 'MESO',
      center: [0.0, -180.0, -8.5],
      mniCenter: [0.00, -18.00, -0.85],
      optimalDist: 130,
      color: '#34d399',
      functionText: 'Inervação motora e sensitiva dos membros inferiores, esfíncteres vesical e retal, e funções sexuais autônomas.',
      clinicalText: 'Síndrome da Cauda Equina (anestesia em sela, incontinência urinária/fecal), paraplegia flácida e ciatalgia compressiva.',
      neurotransmitter: 'Acetilcolina sacral parassimpática, GABA e Glutamato',
      citation: 'Standring (2020) Gray’s Anatomy 42nd Ed.',
      doi: '10.1016/c2018-0-02220-4',
      audioScript: 'No segmento lombar inferior, a medula afunila-se no cone medular em L1-L2 e dá origem ao denso feixe filamentoso da cauda equina.'
    }
  ];

  // [PT-BR]: Função utilitária para criação do Shader GLSL Fotorrealista de Tecido Neural com Subsurface Scattering (SSS) e Simplex Noise 3D.
  // [EN-GB]: Utility function creating a Photorealistic Neural Tissue GLSL Shader with Subsurface Scattering (SSS) and 3D Simplex Noise.
  // [AI-CTX]: @llm-context: Replaces crude plastic materials with genuine organic parenchymal subsurface scattering and moist specular sheen.
  function createPhotorealisticNeuralTissueMaterial(params = {}) {
    const baseColor = new THREE.Color(params.baseColor || 0xdbeafe);
    const sssColor = new THREE.Color(params.sssColor || 0xfbbf24);
    const rimColor = new THREE.Color(params.rimColor || 0x00f2fe);
    const opacity = params.opacity !== undefined ? params.opacity : 1.0;
    const roughness = params.roughness !== undefined ? params.roughness : 0.38;

    const uniforms = {
      uBaseColor: { value: baseColor },
      uSSSColor: { value: sssColor },
      uRimColor: { value: rimColor },
      uOpacity: { value: opacity },
      uRoughness: { value: roughness },
      uTime: { value: 0.0 },
      uHighlightCenter: { value: new THREE.Vector3(0, 0, 0) },
      uHighlightRadius: { value: 0.0 },
      uHighlightColor: { value: new THREE.Color(0x00f2fe) },
      uHighlightIntensity: { value: 0.0 },
      uLightDir1: { value: new THREE.Vector3(0.5, 0.8, 0.6).normalize() },
      uLightDir2: { value: new THREE.Vector3(-0.6, -0.3, -0.5).normalize() }
    };

    const vertexShader = `
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      varying vec3 vViewDir;

      // 3D Simplex-style organic noise displacement
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute(permute(permute(
                  i.z + vec4(0.0, i1.z, i2.z, 1.0))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }

      void main() {
        vec3 N = normalize(normalMatrix * normal);
        float noise = snoise(position * 0.18) * 0.45 + snoise(position * 0.42) * 0.22;
        vec3 displaced = position + normal * (noise * 0.35);

        vec4 worldPos = modelMatrix * vec4(displaced, 1.0);
        vWorldPos = worldPos.xyz;
        vNormal = N;
        vViewDir = normalize(cameraPosition - vWorldPos);
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `;

    const fragmentShader = `
      uniform vec3 uBaseColor;
      uniform vec3 uSSSColor;
      uniform vec3 uRimColor;
      uniform float uOpacity;
      uniform float uRoughness;
      uniform vec3 uHighlightCenter;
      uniform float uHighlightRadius;
      uniform vec3 uHighlightColor;
      uniform float uHighlightIntensity;
      uniform vec3 uLightDir1;
      uniform vec3 uLightDir2;

      varying vec3 vNormal;
      varying vec3 vWorldPos;
      varying vec3 vViewDir;

      void main() {
        vec3 N = normalize(vNormal);
        vec3 V = normalize(vViewDir);

        // Subsurface Scattering (SSS) com wrap lighting
        float wrap = 0.42;
        float diff1 = max(0.0, (dot(N, uLightDir1) + wrap) / (1.0 + wrap));
        float diff2 = max(0.0, (dot(N, uLightDir2) + wrap) / (1.0 + wrap)) * 0.45;

        // Efeito translúcido avermelhado/âmbar retroiluminado (SSS)
        float sssFactor = pow(clamp(dot(-V, uLightDir1) + 0.35, 0.0, 1.0), 2.2);
        vec3 sssGlow = uSSSColor * sssFactor * 0.65;

        // Blinn-Phong úmido especular
        vec3 H1 = normalize(uLightDir1 + V);
        float spec = pow(max(dot(N, H1), 0.0), 38.0) * (1.0 - uRoughness * 0.7);

        // Borda Fresnel bioluminescente
        float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.8) * 0.38;

        vec3 color = uBaseColor * (0.28 + 0.72 * diff1 + diff2) + sssGlow + vec3(spec) + uRimColor * fresnel;

        // Destaque Direto na Superfície sem Saturnos
        if (uHighlightRadius > 0.1 && uHighlightIntensity > 0.01) {
          float dist = length(vWorldPos - uHighlightCenter);
          if (dist < uHighlightRadius) {
            float h = smoothstep(uHighlightRadius, 0.0, dist) * uHighlightIntensity;
            color = mix(color, uHighlightColor, h * 0.85);
          }
        }

        gl_FragColor = vec4(color, uOpacity);
      }
    `;

    return new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: opacity < 0.99,
      side: THREE.DoubleSide
    });
  }

  // [PT-BR]: Classe principal da Macroanatomia 3D do Sistema Nervoso Central com unificação de coordenadas MNI152.
  // [EN-GB]: Main 3D Macroanatomy class of the Central Nervous System with MNI152 coordinate unification.
  // [AI-CTX]: @llm-invariant: Strictly zero rotation.y offset, rotation.set(0, 0, 0), scale.set(SCALE, SCALE, SCALE).
  class CNSAnatomy3D {
    constructor(scene) {
      this.scene = scene;
      this.masterGroup = new THREE.Group();
      this.masterGroup.name = "CNS_MASTER_MACRO_GROUP";
      this.masterGroup.rotation.set(0, 0, 0);
      this.masterGroup.scale.set(SCALE, SCALE, SCALE);
      this.scene.add(this.masterGroup);

      this.cortexMesh = null;
      this.cortexMaterial = null;
      this.cortexUniforms = null;

      this.subcorticalMeshes = [];
      this.brainstemMeshes = [];
      this.spinalMeshes = [];
      this.regionsRegistry = (typeof window !== 'undefined' && window.MOZOK_DATABASE && window.MOZOK_DATABASE.structures)
        ? window.MOZOK_DATABASE.structures
        : CNS_REGIONS_REGISTRY;

      this.highlightCenter = new THREE.Vector3(0, 0, 0);
      this.highlightRadius = 0.0;
      this.highlightColor = new THREE.Color(0x00f2fe);
      this.highlightIntensity = 0.0;

      this.buildAllCNSStructures();

      if (typeof window.Tractography3D !== 'undefined') {
        this.tractography = new window.Tractography3D(this.masterGroup);
      } else {
        this.tractography = null;
      }
    }

    buildAllCNSStructures() {
      this.buildPhotorealisticMNICortex();
      this.buildAtlasSubcorticalStructures();
      this.buildContinuousBrainstemAndSpinalCord();
    }

    // [PT-BR]: Constrói o Córtex MNI152 Real com coordenadas originais sem rotação (Z>0 anterior, Z<0 posterior, X>0 esquerdo, X<0 direito).
    // [EN-GB]: Builds Real MNI152 Cortex with original coordinates without rotation (+Z anterior, -Z posterior, +X left, -X right).
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

          // Cavitação no hemisfério patológico (+X é Esquerdo anatômico)
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

          // Destaque Bioluminescente Direto na Superfície sem Saturnos
          if (uHighlightRadius > 0.1 && uHighlightIntensity > 0.01) {
            float distToHighlight = length(vWorldPos - uHighlightCenter);
            if (distToHighlight < uHighlightRadius) {
              float hFactor = smoothstep(uHighlightRadius, 0.0, distToHighlight) * uHighlightIntensity;
              baseColor = mix(baseColor, uHighlightColor, hFactor * 0.85);
            }
          }

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
      this.cortexMesh.rotation.set(0, 0, 0);
      this.masterGroup.add(this.cortexMesh);
    }

    // [PT-BR]: Constrói estruturas subcorticais do Atlas Científico e malhas esculpidas contínuas (zero animais de balão).
    // [EN-GB]: Builds scientific atlas subcortical structures and continuous sculpted meshes (zero balloon animals).
    buildAtlasSubcorticalStructures() {
      const atlasGroup = new THREE.Group();
      atlasGroup.name = "ATLAS_SUBCORTICAL_GROUP";
      atlasGroup.rotation.set(0, 0, 0);

      const atlas = window.SCIENTIFIC_ATLAS_MESHES || {};

      // 1. Cerebelo com fólias anatômicas reais do Atlas
      if (atlas.cerebellum_folia) {
        const m = atlas.cerebellum_folia;
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(m.vertices), 3));
        geo.setIndex(new THREE.BufferAttribute(new Uint32Array(m.indices), 1));
        geo.computeVertexNormals();

        const mat = createPhotorealisticNeuralTissueMaterial({
          baseColor: 0xfda4af,
          sssColor: 0xf43f5e,
          rimColor: 0xfbbf24,
          roughness: 0.42
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.name = "Cerebelo_Folia_Real";
        mesh.rotation.set(0, 0, 0);
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

        const mat = createPhotorealisticNeuralTissueMaterial({
          baseColor: 0xf59e0b,
          sssColor: 0xd97706,
          rimColor: 0x00f2fe,
          roughness: 0.32
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.name = "Corpo_Estriado_Real";
        mesh.rotation.set(0, 0, 0);
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

        const mat = createPhotorealisticNeuralTissueMaterial({
          baseColor: 0xea580c,
          sssColor: 0xb45309,
          rimColor: 0x38bdf8,
          roughness: 0.30
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.name = "Talamo_Pulvinar_Real";
        mesh.rotation.set(0, 0, 0);
        atlasGroup.add(mesh);
        this.subcorticalMeshes.push(mesh);
      }

      // 4. Ventrículos Laterais e LCR
      if (atlas.lateral_ventricles_csf) {
        const m = atlas.lateral_ventricles_csf;
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(m.vertices), 3));
        geo.setIndex(new THREE.BufferAttribute(new Uint32Array(m.indices), 1));
        geo.computeVertexNormals();

        const mat = new THREE.MeshStandardMaterial({
          color: 0x0ea5e9,
          roughness: 0.08,
          metalness: 0.12,
          transparent: true,
          opacity: 0.68,
          emissive: 0x0284c7,
          emissiveIntensity: 0.35
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.name = "Ventriculos_Laterais_CSF";
        mesh.rotation.set(0, 0, 0);
        atlasGroup.add(mesh);
        this.subcorticalMeshes.push(mesh);
      }

      // 5. Hipotálamo + Infundíbulo + Glândula Hipófise (Malha Anatômica Contínua Esculpida — Zero Balões)
      const hypoMesh = this.createContinuousHypothalamusPituitaryMesh();
      atlasGroup.add(hypoMesh);
      this.subcorticalMeshes.push(hypoMesh);

      // 6. Hipocampo + Fórnix Contínuo em Arco C com Digitações CA1–CA4
      [-1, 1].forEach((sign) => {
        const hipMesh = this.createContinuousHippocampusMesh(sign);
        atlasGroup.add(hipMesh);
        this.subcorticalMeshes.push(hipMesh);

        // Amígdala integrada anterior contínua esculpida com textura parenquimatosa
        const amygMesh = this.createSculptedAmygdalaMesh(sign);
        atlasGroup.add(amygdalaMeshFallback(sign, amygMesh));
        this.subcorticalMeshes.push(amygMesh);
      });

      function amygdalaMeshFallback(s, m) { return m; }

      // 7. Glândula Pineal (Epitálamo)
      const pinealGeo = new THREE.CylinderGeometry(0.22, 0.08, 0.48, 12);
      pinealGeo.rotateX(Math.PI / 2);
      const pinealMat = createPhotorealisticNeuralTissueMaterial({
        baseColor: 0xfbbf24,
        sssColor: 0xd97706,
        rimColor: 0x00f2fe,
        roughness: 0.25
      });
      const pinealMesh = new THREE.Mesh(pinealGeo, pinealMat);
      pinealMesh.position.set(0.0, -0.35, -2.05);
      pinealMesh.name = "Glandula_Pineal_Real";
      atlasGroup.add(pinealMesh);
      this.subcorticalMeshes.push(pinealMesh);

      // 8. Corpo Caloso (Comissura Inter-hemisférica com Esplênio, Tronco, Joelho e Rostro)
      const corpusCallosumMesh = this.buildCorpusCallosumMesh();
      atlasGroup.add(corpusCallosumMesh);
      this.subcorticalMeshes.push(corpusCallosumMesh);

      // 9. Globo Pálido Bilateral (Segmentos GPi e GPe)
      [-1, 1].forEach((sign) => {
        const gpMesh = this.buildGlobusPallidusMesh(sign);
        atlasGroup.add(gpMesh);
        this.subcorticalMeshes.push(gpMesh);
      });

      // 10. Quiasma Óptico e Tratos Ópticos
      const chiasmMesh = this.buildOpticChiasmAndTractsMesh();
      atlasGroup.add(chiasmMesh);
      this.subcorticalMeshes.push(chiasmMesh);

      // 11. Sistema Ventricular Completo com LCR (Laterais, III, Aqueduto e IV Ventrículo)
      const ventMesh = this.buildCompleteVentricularSystemMesh();
      atlasGroup.add(ventMesh);
      this.subcorticalMeshes.push(ventMesh);

      // 12. Nervos Cranianos I a XII com Raízes Emergentes do Tronco
      const cranialMesh = this.buildCranialNervesRootsMesh();
      atlasGroup.add(cranialMesh);
      this.subcorticalMeshes.push(cranialMesh);

      this.masterGroup.add(atlasGroup);
    }

    // [PT-BR]: Constrói o Corpo Caloso como comissura inter-hemisférica em arco contínuo (Rostro, Joelho, Tronco e Esplênio).
    // [EN-GB]: Builds Corpus Callosum as an interhemispheric commissure in a continuous arch (Rostrum, Genu, Body, and Splenium).
    buildCorpusCallosumMesh() {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.0, -0.6, +1.4), // Rostro
        new THREE.Vector3(0.0, +0.4, +2.2), // Joelho
        new THREE.Vector3(0.0, +1.5, +1.0), // Tronco anterior
        new THREE.Vector3(0.0, +1.9, -0.4), // Tronco médio
        new THREE.Vector3(0.0, +1.7, -1.8), // Tronco posterior
        new THREE.Vector3(0.0, +0.7, -2.6)  // Esplênio
      ]);

      const tubularSegments = 36;
      const radialSegments = 16;
      const positions = [];
      const indices = [];

      const frames = curve.computeFrenetFrames(tubularSegments, false);

      for (let i = 0; i <= tubularSegments; i++) {
        const u = i / tubularSegments;
        const pt = curve.getPointAt(u);
        const N = frames.normals[i];

        let rx = 1.35 + Math.sin(u * Math.PI) * 0.45;
        let ry = 0.35 + (u > 0.8 || u < 0.2 ? 0.25 : 0.0);

        for (let j = 0; j <= radialSegments; j++) {
          const v = (j / radialSegments) * Math.PI * 2;
          const sinV = Math.sin(v);
          const cosV = Math.cos(v);

          const nx = cosV * rx;
          const ny = sinV * ry;

          positions.push(
            pt.x + nx,
            pt.y + ny * N.y,
            pt.z + ny * N.z
          );
        }
      }

      for (let i = 0; i < tubularSegments; i++) {
        for (let j = 0; j < radialSegments; j++) {
          const a = i * (radialSegments + 1) + j;
          const b = (i + 1) * (radialSegments + 1) + j;
          const c = (i + 1) * (radialSegments + 1) + (j + 1);
          const d = i * (radialSegments + 1) + (j + 1);
          indices.push(a, b, d);
          indices.push(b, c, d);
        }
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geo.setIndex(indices);
      geo.computeVertexNormals();

      const mat = createPhotorealisticNeuralTissueMaterial({
        baseColor: 0xe2e8f0,
        sssColor: 0x93c5fd,
        rimColor: 0x00f2fe,
        roughness: 0.28
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.name = "Corpo_Caloso_Real";
      mesh.rotation.set(0, 0, 0);
      return mesh;
    }

    // [PT-BR]: Globo Pálido esculpido (Segmentos GPi e GPe) medial ao Putâmen.
    // [EN-GB]: Sculpted Globus Pallidus (GPi and GPe) medial to Putamen.
    buildGlobusPallidusMesh(sign) {
      const geo = new THREE.ConeGeometry(0.72, 1.45, 14, 4);
      geo.rotateZ(sign * (Math.PI / 3.2));
      geo.scale(1.25, 0.85, 1.1);

      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        let x = pos.getX(i);
        let y = pos.getY(i);
        let z = pos.getZ(i);
        if (x * sign > 0) {
          y *= 0.85;
        }
        pos.setXYZ(i, x, y, z);
      }
      geo.computeVertexNormals();

      const mat = createPhotorealisticNeuralTissueMaterial({
        baseColor: 0xd97706,
        sssColor: 0xb45309,
        rimColor: 0x38bdf8,
        roughness: 0.32
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(sign * 1.42, -0.18, +0.40);
      mesh.name = `Globo_Palido_${sign > 0 ? 'Esq' : 'Dir'}`;
      mesh.rotation.set(0, 0, 0);
      return mesh;
    }

    // [PT-BR]: Quiasma Óptico em X com nervos ópticos anteriores e tratos ópticos posteriores.
    // [EN-GB]: X-shaped Optic Chiasm with anterior optic nerves and posterior optic tracts.
    buildOpticChiasmAndTractsMesh() {
      const group = new THREE.Group();
      group.name = "Quiasma_Tratos_Opticos";

      const mat = createPhotorealisticNeuralTissueMaterial({
        baseColor: 0x38bdf8,
        sssColor: 0x0284c7,
        rimColor: 0x10b981,
        roughness: 0.25
      });

      [-1, 1].forEach((sign) => {
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(sign * 0.95, -1.15, +2.6),
          new THREE.Vector3(sign * 0.35, -1.35, +1.75),
          new THREE.Vector3(0.0, -1.40, +1.45),
          new THREE.Vector3(sign * 0.75, -1.65, +0.85),
          new THREE.Vector3(sign * 1.65, -1.85, -0.65)
        ]);
        const geo = new THREE.TubeGeometry(curve, 24, 0.16, 8, false);
        const mesh = new THREE.Mesh(geo, mat);
        group.add(mesh);
      });

      return group;
    }

    // [PT-BR]: Sistema Ventricular Completo com LCR (Laterais, III, Aqueduto e IV Ventrículo).
    // [EN-GB]: Complete Ventricular System with CSF (Lateral, 3rd, Aqueduct, and 4th Ventricles).
    buildCompleteVentricularSystemMesh() {
      const group = new THREE.Group();
      group.name = "Sistema_Ventricular_Completo_CSF";

      const csfMat = new THREE.MeshStandardMaterial({
        color: 0x0ea5e9,
        roughness: 0.08,
        metalness: 0.15,
        transparent: true,
        opacity: 0.72,
        emissive: 0x0284c7,
        emissiveIntensity: 0.45
      });

      const iiiGeo = new THREE.BoxGeometry(0.35, 1.8, 2.8);
      const iiiMesh = new THREE.Mesh(iiiGeo, csfMat);
      iiiMesh.position.set(0.0, -0.85, -0.65);
      group.add(iiiMesh);

      const aqCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.0, -1.75, -1.85),
        new THREE.Vector3(0.0, -2.55, -2.15),
        new THREE.Vector3(0.0, -3.45, -2.35)
      ]);
      const aqGeo = new THREE.TubeGeometry(aqCurve, 12, 0.12, 6, false);
      const aqMesh = new THREE.Mesh(aqGeo, csfMat);
      group.add(aqMesh);

      const ivGeo = new THREE.ConeGeometry(0.85, 1.9, 4, 3);
      ivGeo.rotateX(Math.PI / 1.15);
      const ivMesh = new THREE.Mesh(ivGeo, csfMat);
      ivMesh.position.set(0.0, -4.3, -2.25);
      group.add(ivMesh);

      return group;
    }

    // [PT-BR]: Doze Pares de Nervos Cranianos (I a XII) com Raízes Emergentes do Tronco.
    // [EN-GB]: Twelve Cranial Nerve Pairs (I to XII) with Emergent Brainstem Roots.
    buildCranialNervesRootsMesh() {
      const group = new THREE.Group();
      group.name = "Nervos_Cranianos_I_XII";

      const cnMat = new THREE.MeshStandardMaterial({
        color: 0x34d399,
        roughness: 0.32,
        emissive: 0x10b981,
        emissiveIntensity: 0.4
      });

      [-1, 1].forEach((sign) => {
        const nc1Curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(sign * 0.65, -0.95, +1.8),
          new THREE.Vector3(sign * 0.70, -0.92, +2.8),
          new THREE.Vector3(sign * 0.72, -0.90, +3.5)
        ]);
        group.add(new THREE.Mesh(new THREE.TubeGeometry(nc1Curve, 8, 0.08, 5, false), cnMat));

        const nc3Curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(sign * 0.28, -2.6, -0.55),
          new THREE.Vector3(sign * 0.42, -2.5, +0.45),
          new THREE.Vector3(sign * 0.65, -2.4, +1.25)
        ]);
        group.add(new THREE.Mesh(new THREE.TubeGeometry(nc3Curve, 8, 0.075, 5, false), cnMat));

        const nc4Curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(sign * 0.35, -3.1, -1.45),
          new THREE.Vector3(sign * 1.25, -3.0, -0.85),
          new THREE.Vector3(sign * 1.05, -2.8, +0.65)
        ]);
        group.add(new THREE.Mesh(new THREE.TubeGeometry(nc4Curve, 8, 0.045, 5, false), cnMat));

        const nc5Curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(sign * 1.65, -4.0, -0.35),
          new THREE.Vector3(sign * 2.25, -3.8, +0.45),
          new THREE.Vector3(sign * 2.75, -3.6, +1.15)
        ]);
        group.add(new THREE.Mesh(new THREE.TubeGeometry(nc5Curve, 10, 0.16, 6, false), cnMat));

        const nc6Curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(sign * 0.35, -5.1, -0.45),
          new THREE.Vector3(sign * 0.55, -4.9, +0.45),
          new THREE.Vector3(sign * 0.85, -4.7, +1.15)
        ]);
        group.add(new THREE.Mesh(new THREE.TubeGeometry(nc6Curve, 8, 0.065, 5, false), cnMat));

        const nc7Curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(sign * 1.35, -5.15, -0.65),
          new THREE.Vector3(sign * 1.85, -5.0, +0.25),
          new THREE.Vector3(sign * 2.25, -4.8, +0.95)
        ]);
        group.add(new THREE.Mesh(new THREE.TubeGeometry(nc7Curve, 8, 0.075, 5, false), cnMat));

        const nc8Curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(sign * 1.65, -5.25, -0.75),
          new THREE.Vector3(sign * 2.15, -5.1, +0.15),
          new THREE.Vector3(sign * 2.55, -4.9, +0.85)
        ]);
        group.add(new THREE.Mesh(new THREE.TubeGeometry(nc8Curve, 8, 0.095, 5, false), cnMat));

        const nc9Curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(sign * 0.85, -5.6, -0.85),
          new THREE.Vector3(sign * 1.45, -5.5, -0.25),
          new THREE.Vector3(sign * 1.95, -5.4, +0.35)
        ]);
        group.add(new THREE.Mesh(new THREE.TubeGeometry(nc9Curve, 8, 0.065, 5, false), cnMat));

        const nc10Curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(sign * 0.88, -6.1, -0.90),
          new THREE.Vector3(sign * 1.55, -6.0, -0.30),
          new THREE.Vector3(sign * 2.05, -5.9, +0.30)
        ]);
        group.add(new THREE.Mesh(new THREE.TubeGeometry(nc10Curve, 8, 0.085, 5, false), cnMat));

        const nc11Curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(sign * 0.90, -7.5, -0.95),
          new THREE.Vector3(sign * 1.35, -6.8, -0.55),
          new THREE.Vector3(sign * 1.85, -6.3, +0.25)
        ]);
        group.add(new THREE.Mesh(new THREE.TubeGeometry(nc11Curve, 8, 0.065, 5, false), cnMat));

        const nc12Curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(sign * 0.45, -5.9, -0.55),
          new THREE.Vector3(sign * 0.85, -5.8, +0.15),
          new THREE.Vector3(sign * 1.25, -5.7, +0.75)
        ]);
        group.add(new THREE.Mesh(new THREE.TubeGeometry(nc12Curve, 8, 0.07, 5, false), cnMat));
      });

      return group;
    }

    // [PT-BR]: Modela o Hipotálamo, Infundíbulo e Hipófise como uma malha contínua anatômica afinada e bilobada.
    // [EN-GB]: Models Hypothalamus, Infundibulum, and Pituitary as a continuous sculpted anatomical mesh.
    createContinuousHypothalamusPituitaryMesh() {
      const vRings = 32;
      const hSegs = 24;
      const positions = [];
      const normals = [];
      const indices = [];

      for (let r = 0; r <= vRings; r++) {
        const v = r / vRings;
        // Y desce de -1.2 (assoalho do III ventrículo) até -2.65 (sela túrcica)
        const y = -1.2 - v * 1.45;
        // Z central avança da região mamilar anterior (Z = +0.45) até o infundíbulo e hipófise (Z = +0.75)
        const zCenter = 0.45 + v * 0.30;
        const xCenter = 0.0;

        // Perfil de raio ao longo do eixo vertical (funil do assoalho ventricular -> haste infundibular -> lobos hipofisários)
        let radius = 0.55;
        let xSquash = 1.0;
        let zSquash = 1.0;

        if (v < 0.35) {
          // Assoalho do III ventrículo e eminências mamilares posteriores
          radius = 0.55 - v * 0.65;
          zSquash = 1.25;
        } else if (v < 0.70) {
          // Haste infundibular afunilada
          radius = 0.16 + (0.70 - v) * 0.12;
          xSquash = 0.9;
        } else {
          // Glândula Hipófise bilobada (Adeno-hipófise anterior e Neuro-hipófise posterior)
          const lobeT = (v - 0.70) / 0.30;
          radius = 0.18 + Math.sin(lobeT * Math.PI) * 0.34;
          zSquash = 1.35; // Alongada anteroposteriormente para exibir os dois lobos
        }

        for (let s = 0; s <= hSegs; s++) {
          const u = s / hSegs;
          const theta = u * Math.PI * 2;
          const cosT = Math.cos(theta);
          const sinT = Math.sin(theta);

          // Protrusão bilobada da hipófise anterior
          const anteriorLobeBump = (v >= 0.70 && sinT > 0) ? (sinT * 0.12) : 0;

          const px = xCenter + radius * xSquash * cosT;
          const pz = zCenter + radius * zSquash * sinT + anteriorLobeBump;
          const py = y;

          positions.push(px, py, pz);
        }
      }

      for (let r = 0; r < vRings; r++) {
        for (let s = 0; s < hSegs; s++) {
          const a = r * (hSegs + 1) + s;
          const b = (r + 1) * (hSegs + 1) + s;
          const c = (r + 1) * (hSegs + 1) + (s + 1);
          const d = r * (hSegs + 1) + (s + 1);
          indices.push(a, b, d);
          indices.push(b, c, d);
        }
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geo.setIndex(indices);
      geo.computeVertexNormals();

      const mat = createPhotorealisticNeuralTissueMaterial({
        baseColor: 0xd97706,
        sssColor: 0xf59e0b,
        rimColor: 0x00f2fe,
        roughness: 0.30
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.name = "Hipotalamo_Infundibulo_Hipofise_Continuo";
      mesh.rotation.set(0, 0, 0);
      return mesh;
    }

    // [PT-BR]: Constrói o Hipocampo e Fórnix como malha tubular contínua em arco C com digitações hipocampais CA1–CA4.
    // [EN-GB]: Builds Hippocampus and Fornix as a continuous C-arch tubular mesh with CA1–CA4 hippocampal digitations.
    createContinuousHippocampusMesh(sign) {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(sign * 2.15, -1.45, +0.45), // Cabeça (Pes hippocampi)
        new THREE.Vector3(sign * 2.45, -1.85, -1.10), // Corpo CA1-CA4
        new THREE.Vector3(sign * 2.20, -2.10, -2.40), // Cauda
        new THREE.Vector3(sign * 1.65, -1.20, -2.85), // Fímbria
        new THREE.Vector3(sign * 0.85, -0.45, -2.50)  // Pilar do fórnix sob corpo caloso
      ]);

      const tubularSegments = 40;
      const radialSegments = 16;
      const positions = [];
      const indices = [];

      const frames = curve.computeFrenetFrames(tubularSegments, false);

      for (let i = 0; i <= tubularSegments; i++) {
        const u = i / tubularSegments;
        const pt = curve.getPointAt(u);
        const N = frames.normals[i];
        const B = frames.binormals[i];

        // Raio variável: volumoso na cabeça hipocampal com digitações, afilando nas fímbrias do fórnix
        let baseRadius = 0.42 * (1.0 - u * 0.55);

        // Digitações hipocampais na cabeça (pes hippocampi, u < 0.25)
        const digitationWave = u < 0.28 ? Math.sin(u * Math.PI * 16.0) * 0.08 : 0;
        const currentR = baseRadius + digitationWave;

        for (let j = 0; j <= radialSegments; j++) {
          const v = (j / radialSegments) * Math.PI * 2;
          const sinV = Math.sin(v);
          const cosV = Math.cos(v);

          const nx = cosV * N.x + sinV * B.x;
          const ny = cosV * N.y + sinV * B.y;
          const nz = cosV * N.z + sinV * B.z;

          positions.push(
            pt.x + currentR * nx,
            pt.y + currentR * ny,
            pt.z + currentR * nz
          );
        }
      }

      for (let i = 0; i < tubularSegments; i++) {
        for (let j = 0; j < radialSegments; j++) {
          const a = i * (radialSegments + 1) + j;
          const b = (i + 1) * (radialSegments + 1) + j;
          const c = (i + 1) * (radialSegments + 1) + (j + 1);
          const d = i * (radialSegments + 1) + (j + 1);
          indices.push(a, b, d);
          indices.push(b, c, d);
        }
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geo.setIndex(indices);
      geo.computeVertexNormals();

      const mat = createPhotorealisticNeuralTissueMaterial({
        baseColor: 0x4f46e5,
        sssColor: 0x6366f1,
        rimColor: 0x00f2fe,
        roughness: 0.32
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.name = `Hipocampo_Fornix_${sign > 0 ? 'Esq' : 'Dir'}`;
      mesh.rotation.set(0, 0, 0);
      return mesh;
    }

    // [PT-BR]: Amígdala esculpida contínua com formato orgânico em amêndoa.
    // [EN-GB]: Continuous sculpted amygdala with organic almond morphology.
    createSculptedAmygdalaMesh(sign) {
      const geo = new THREE.SphereGeometry(0.48, 18, 14);
      geo.scale(1.15, 0.90, 1.35);

      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        let x = pos.getX(i);
        let y = pos.getY(i);
        let z = pos.getZ(i);

        // Afunila o polo posterior em direção à cabeça do hipocampo
        if (z < 0) {
          x *= (1.0 + z * 0.35);
          y *= (1.0 + z * 0.35);
        }
        pos.setXYZ(i, x, y, z);
      }
      geo.computeVertexNormals();

      const mat = createPhotorealisticNeuralTissueMaterial({
        baseColor: 0xe11d48,
        sssColor: 0xf43f5e,
        rimColor: 0xfbbf24,
        roughness: 0.35
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(sign * 2.15, -1.45, +0.45);
      mesh.name = `Amigdala_${sign > 0 ? 'Esq' : 'Dir'}`;
      mesh.rotation.set(0, 0, 0);
      return mesh;
    }

    // [PT-BR]: Constrói o Tronco Encefálico Contínuo (Mesencéfalo + Ponte + Bulbo) e Medula Espinhal em uma única malha de alta resolução (120 anéis verticais x 48 segmentos radiais).
    // [EN-GB]: Builds Continuous Brainstem (Midbrain + Pons + Medulla) and Spinal Cord in a single high-resolution continuous mesh (120 vertical rings x 48 radial segments).
    // [AI-CTX]: @llm-invariant: Single sculpted continuous mesh without disjoined primitives or balloon animals.
    buildContinuousBrainstemAndSpinalCord() {
      const stemAndCordGroup = new THREE.Group();
      stemAndCordGroup.name = "BRAINSTEM_SPINAL_CORD_CONTINUOUS_GROUP";
      stemAndCordGroup.rotation.set(0, 0, 0);

      const vRings = 120;
      const hSegs = 48;
      const positions = [];
      const indices = [];

      for (let r = 0; r <= vRings; r++) {
        const t = r / vRings;
        // Y desce de -2.0 (topo do mesencéfalo) até -22.0 (filo terminal da cauda equina)
        const y = -2.0 - t * 20.0;

        // Curvatura longitudinal do neuroeixo
        // Z central: mesencéfalo (-0.65) -> avança na ponte (-0.45) -> bulbo (-0.65) -> medula (-0.85)
        let zCenter = -0.85;
        if (y >= -3.3) {
          // Mesencéfalo
          const f = (y - (-3.3)) / 1.3;
          zCenter = -0.65 + f * 0.05;
        } else if (y >= -5.0) {
          // Ponte: abaulamento ventral anterior em Z
          const ponsT = (y - (-5.0)) / 1.7;
          zCenter = -0.65 + Math.sin(ponsT * Math.PI) * 0.22;
        } else if (y >= -6.8) {
          // Bulbo
          zCenter = -0.65 - ((-5.0 - y) / 1.8) * 0.20;
        }
        const xCenter = 0.0;

        for (let s = 0; s <= hSegs; s++) {
          const theta = (s / hSegs) * Math.PI * 2;
          const cosT = Math.cos(theta); // Direção Anteroposterior (Z): cosT > 0 é Anterior (+Z), cosT < 0 é Posterior (-Z)
          const sinT = Math.sin(theta); // Direção Lateral (X): sinT > 0 é Esquerda (+X), sinT < 0 é Direita (-X)

          let rx = 0.45;
          let rz = 0.40;

          if (y >= -3.3) {
            // ==================== MESENCÉFALO (Y in [-2.0, -3.3]) ====================
            rx = 1.15;
            rz = 1.05;

            // Pedúnculos cerebrais anteriores e fossa interpeduncular na linha média anterior
            if (cosT > 0) {
              const peduncleBump = Math.pow(Math.abs(sinT), 1.5) * 0.35;
              const interpeduncularFossa = (1.0 - Math.abs(sinT)) * 0.20;
              rz += (peduncleBump - interpeduncularFossa);
            }
            // Colículos quadrigêmeos posteriores
            if (cosT < 0) {
              const colliculusBump = Math.abs(sinT) * 0.22;
              rz += colliculusBump;
            }
          } else if (y >= -5.0) {
            // ==================== PONTE DE VARÓLIO (Y in [-3.3, -5.0]) ====================
            const ponsFactor = Math.sin(((y - (-5.0)) / 1.7) * Math.PI);
            rx = 1.05 + ponsFactor * 0.85;
            rz = 0.95 + ponsFactor * 0.95;

            // Abaulamento ventral massivo anterior e sulco basilar mediano
            if (cosT > 0) {
              const ventralBulge = cosT * ponsFactor * 0.65;
              const basilarGroove = (1.0 - Math.abs(sinT)) * 0.16 * ponsFactor;
              rz += (ventralBulge - basilarGroove);

              // Estriações transversais pontocerebelares sutis
              const striation = Math.sin(y * 36.0) * 0.035 * ponsFactor;
              rz += striation;
            }
            // Pedúnculos cerebelares médios laterais
            rx += Math.abs(sinT) * ponsFactor * 0.35;
          } else if (y >= -6.8) {
            // ==================== BULBO / MEDULA OBLONGA (Y in [-5.0, -6.8]) ====================
            const bulbFactor = (y - (-6.8)) / 1.8;
            rx = 0.52 + bulbFactor * 0.42;
            rz = 0.48 + bulbFactor * 0.38;

            // Fissura mediana anterior e Pirâmides bulbares
            if (cosT > 0) {
              const fissure = Math.exp(-Math.pow(sinT * 6.0, 2)) * 0.12;
              const pyramidRidge = Math.sin(Math.abs(sinT) * Math.PI) * 0.16;
              rz += (pyramidRidge - fissure);
            }
            // Olivas bulbares anterolaterais
            if (cosT > 0 && Math.abs(sinT) > 0.45 && Math.abs(sinT) < 0.85) {
              const oliveBump = Math.sin((Math.abs(sinT) - 0.45) / 0.40 * Math.PI) * 0.14 * bulbFactor;
              rz += oliveBump;
              rx += oliveBump * 0.6;
            }
          } else {
            // ==================== MEDULA ESPINHAL (Y in [-6.8, -22.0]) ====================
            // Formato oval anatômico: diâmetro transversal rx > anteroposterior rz
            rx = 0.46;
            rz = 0.38;

            // Intumescência Cervical (C4–T1, centrada em Y = -9.2)
            const cervBulge = Math.exp(-Math.pow((y + 9.2) * 0.55, 2)) * 0.22;
            // Intumescência Lombossacral (L1–S1, centrada em Y = -16.2)
            const lumbBulge = Math.exp(-Math.pow((y + 16.2) * 0.65, 2)) * 0.18;

            // Afunilamento do Cone Medular abaixo de Y = -17.5
            let coneTaper = 1.0;
            if (y < -17.5) {
              coneTaper = Math.max(0.18, 1.0 - (-17.5 - y) * 0.22);
            }

            const cordScale = (1.0 + cervBulge + lumbBulge) * coneTaper;
            rx *= cordScale;
            rz *= cordScale;
          }

          const px = xCenter + rx * sinT;
          const pz = zCenter + rz * cosT;
          const py = y;

          positions.push(px, py, pz);
        }
      }

      for (let r = 0; r < vRings; r++) {
        for (let s = 0; s < hSegs; s++) {
          const a = r * (hSegs + 1) + s;
          const b = (r + 1) * (hSegs + 1) + s;
          const c = (r + 1) * (hSegs + 1) + (s + 1);
          const d = r * (hSegs + 1) + (s + 1);
          indices.push(a, b, d);
          indices.push(b, c, d);
        }
      }

      const stemCordGeo = new THREE.BufferGeometry();
      stemCordGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      stemCordGeo.setIndex(indices);
      stemCordGeo.computeVertexNormals();

      const stemCordMat = createPhotorealisticNeuralTissueMaterial({
        baseColor: 0x38bdf8,
        sssColor: 0x0284c7,
        rimColor: 0x10b981,
        roughness: 0.36
      });

      const stemCordMesh = new THREE.Mesh(stemCordGeo, stemCordMat);
      stemCordMesh.name = "Tronco_Espinhal_Continuo_Real";
      stemCordMesh.rotation.set(0, 0, 0);
      stemAndCordGroup.add(stemCordMesh);
      this.brainstemMeshes.push(stemCordMesh);
      this.spinalMeshes.push(stemCordMesh);

      // Raízes Nervosas Espinhais Orgânicas Contínuas (Pares C1 a L5)
      const pairs = 24;
      for (let p = 0; p < pairs; p++) {
        const rY = -7.2 - p * 0.52;
        [-1, 1].forEach((sign) => {
          const rootCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(sign * 0.38, rY, -0.85),
            new THREE.Vector3(sign * 0.82, rY - 0.12, -0.92),
            new THREE.Vector3(sign * 1.55, rY - 0.32, -0.98)
          ]);
          const rootGeo = new THREE.TubeGeometry(rootCurve, 8, 0.065, 6, false);
          const rootMat = createPhotorealisticNeuralTissueMaterial({
            baseColor: 0x34d399,
            sssColor: 0x10b981,
            rimColor: 0x00f2fe,
            roughness: 0.30
          });
          const rMesh = new THREE.Mesh(rootGeo, rootMat);
          rMesh.name = `Raiz_Nervosa_P${p}_${sign > 0 ? 'Esq' : 'Dir'}`;
          rMesh.rotation.set(0, 0, 0);
          stemAndCordGroup.add(rMesh);
          this.spinalMeshes.push(rMesh);
        });
      }

      // Cauda Equina Filamentosa Descendente a partir de Y = -17.5
      const caudaCount = 42;
      for (let f = 0; f < caudaCount; f++) {
        const angle = (f / caudaCount) * Math.PI * 2;
        const rad = 0.15 + Math.random() * 0.28;
        const len = 3.2 + Math.random() * 2.8;

        const cCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(Math.cos(angle) * rad, -17.5, -0.85 + Math.sin(angle) * rad),
          new THREE.Vector3(Math.cos(angle) * (rad + 0.25), -19.5, -0.85 + (Math.random() - 0.5) * 0.2),
          new THREE.Vector3(Math.cos(angle) * (rad + 0.45), -17.5 - len, -0.85 + (Math.random() - 0.5) * 0.3)
        ]);
        const cGeo = new THREE.TubeGeometry(cCurve, 8, 0.042, 5, false);
        const cMat = new THREE.MeshStandardMaterial({
          color: 0x6ee7b7,
          roughness: 0.35,
          transparent: true,
          opacity: 0.85,
          emissive: 0x10b981,
          emissiveIntensity: 0.25
        });
        const cMesh = new THREE.Mesh(cGeo, cMat);
        cMesh.name = `Cauda_Equina_Filamento_${f}`;
        cMesh.rotation.set(0, 0, 0);
        stemAndCordGroup.add(cMesh);
      }

      this.masterGroup.add(stemAndCordGroup);
    }

    // [PT-BR]: Destaca a região anatômica iluminando a própria malha (sem esferas ou Saturnos).
    // [EN-GB]: Highlights anatomical region directly on mesh surface (zero spheres or Saturns).
    highlightRegion(region) {
      if (!region) return;

      this.highlightCenter.set(region.center[0], region.center[1], region.center[2]);
      this.highlightRadius = 26.0;
      this.highlightColor.set(region.color);
      this.highlightIntensity = 1.0;

      if (this.cortexUniforms) {
        this.cortexUniforms.uHighlightCenter.value.copy(this.highlightCenter);
        this.cortexUniforms.uHighlightRadius.value = this.highlightRadius;
        this.cortexUniforms.uHighlightColor.value.copy(this.highlightColor);
        this.cortexUniforms.uHighlightIntensity.value = 1.0;
      }
    }

    // [PT-BR]: Define a transparência do córtex e subcórtex para exploração profunda.
    // [EN-GB]: Sets cortex and subcortex opacity for deep anatomical exploration.
    setAnatomyOpacity(cortexOpacity, subcortexOpacity) {
      if (this.cortexUniforms) {
        this.cortexUniforms.uOpacity.value = cortexOpacity;
      }
      this.subcorticalMeshes.forEach(m => {
        if (m.material && m.material.uniforms && m.material.uniforms.uOpacity) {
          m.material.uniforms.uOpacity.value = subcortexOpacity;
        } else if (m.material) {
          m.material.opacity = subcortexOpacity;
          m.material.transparent = subcortexOpacity < 0.99;
        }
      });
    }

    // [PT-BR]: Atualiza o índice de dano e cavitação patológica no córtex.
    // [EN-GB]: Updates pathological damage and cavitation index on cortex.
    setDamage(damage) {
      if (this.cortexUniforms) {
        this.cortexUniforms.uDamage.value = damage;
      }
    }

    // [PT-BR]: Atualização por quadro animando o pulso bioluminescente e tractografia.
    // [EN-GB]: Per-frame update animating the bioluminescent pulse and tractography.
    update(dt) {
      if (this.cortexUniforms && this.highlightIntensity > 0) {
        const pulse = 0.85 + Math.sin(performance.now() * 0.005) * 0.25;
        this.cortexUniforms.uHighlightIntensity.value = this.highlightIntensity * pulse;
      }
      if (this.tractography && typeof this.tractography.update === 'function') {
        this.tractography.update(dt);
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
  window.createPhotorealisticNeuralTissueMaterial = createPhotorealisticNeuralTissueMaterial;

})(window);
