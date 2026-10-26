/**
 * ============================================================================
 * MOZOK v2.0 — BANCO DE DADOS CIENTÍFICO ESTRUTURADO DE NEUROANATOMIA E PATOLOGIAS
 * Base de Dados Unificada Baseada em Metadados (Eliminação de Hardcode)
 * ============================================================================
 * Padrões e Referências:
 * - Allen Human Brain Atlas (AHBA)
 * - Human Connectome Project (HCP-MMP1.0)
 * - NeuroMorpho.Org (Neuronal Morphologies)
 * - UBERON Anatomy Ontology / Foundational Model of Anatomy (FMA)
 * - BrainInfo / NeuroNames (National Primate Research Center)
 * ============================================================================
 */

(function (window) {
  'use strict';

  // [PT-BR]: Banco de dados unificado de todas as estruturas neuroanatômicas do SNC com metadados científicos exaustivos.
  // [EN-GB]: Unified database of all CNS neuroanatomical structures with exhaustive scientific metadata.
  const CNS_STRUCTURES_DATABASE = [
    {
      id: 1,
      code: 'WB_CNS',
      estrutura: 'Sistema Nervoso Central Completo (Encéfalo + Medula Espinhal)',
      name: 'Sistema Nervoso Central Completo (Encéfalo + Medula Espinhal)',
      latinName: 'Systema Nervosum Centrale',
      uberonId: 'UBERON:0001017',
      categoria: 'VISÃO GLOBAL',
      category: 'VISÃO GLOBAL',
      escala: 'SNC Inteiro (Macro: ~450 mm)',
      tier: 'MACRO',
      coordenadas: [0.00, -2.50, 0.00],
      center: [0.00, -2.50, 0.00],
      mniCenter: [0.0, -2.5, 0.0],
      optimalDist: 22.0,
      color: '#d1d5db',
      descricao: 'Eixo neuraxial biológico fundamental que integra o encéfalo anterior, tronco encefálico e medula espinhal até a cauda equina.',
      funcoes: [
        'Comando e coordenação motora somática e visceral',
        'Integração sensitivo-sensorial ascendente e descendente',
        'Homeostase neuroendócrina e autonômica',
        'Cognição de alta ordem, memória, linguagem e consciência'
      ],
      conexoes: [
        'Plexos nervosos periféricos espinhais',
        'Nervos cranianos I a XII',
        'Eixo hipotálamo-hipofisário-adrenal'
      ],
      vascularizacao: 'Círculo Arterial de Willis (Artérias Carótidas Internas e Vertebrobasilares) e Artérias Espinhais Anterior e Posteriores',
      neurotransmissores: ['Glutamato', 'GABA', 'Dopamina', 'Serotonina', 'Acetilcolina', 'Noradrenalina'],
      doencas: ['Encefalopatias Espongiformes (DCJ)', 'Esclerose Múltipla', 'AVC', 'Traumatismo Raquimedular', 'ELA'],
      doi: '10.1036/0838577016',
      citacao: 'Kandel et al. Principles of Neural Science 6th Ed. (2021) / Paxinos (2019)',
      audioScript: 'Você está contemplando a totalidade do Sistema Nervoso Central Humano: o encéfalo esculpido a partir da média MNI152, diencéfalo, tronco encefálico, cerebelo anatômico e a medula espinhal contínua descendo até a cauda equina.'
    },
    {
      id: 2,
      code: 'DLPFC_LEFT',
      estrutura: 'Córtex Pré-Frontal Dorsolateral Esquerdo (DLPFC — BA 9/46)',
      name: 'Córtex Pré-Frontal Dorsolateral Esquerdo (DLPFC — BA 9/46)',
      latinName: 'Cortex praefrontalis dorsolateralis sinister',
      uberonId: 'UBERON:0009834',
      categoria: 'TELENCÉFALO',
      category: 'TELENCÉFALO',
      escala: 'Giro / Coluna Cortical (Meso: ~110 mm)',
      tier: 'MESO',
      coordenadas: [3.04, 1.86, 4.72],
      center: [3.04, 1.86, 4.72],
      mniCenter: [+3.04, +1.86, +4.72],
      optimalDist: 11.0,
      color: '#38bdf8',
      descricao: 'Região cortical do giro frontal médio e superior com alta densidade de neurônios piramidais da Camada III e V.',
      funcoes: [
        'Funções executivas centrais e controle inibitório',
        'Memória de trabalho operacional visuoespacial e verbal',
        'Flexibilidade cognitiva e planejamento abstrato',
        'Tomada de decisão baseada em metas'
      ],
      conexoes: [
        'Córtex Parietal Posterior via Fascículo Longitudinal Superior',
        'Núcleo Caudado via Alça Córtico-Estriatal Dorsolateral',
        'Área Tegmentar Ventral (VTA) via Via Mesocortical'
      ],
      vascularizacao: 'Ramos corticais frontais da Artéria Cerebral Média (ACM) e ramos da Artéria Cerebral Anterior (ACA)',
      neurotransmissores: ['Dopamina (receptores D1)', 'L-Glutamato', 'GABA'],
      doencas: ['Esquizofrenia', 'Depressão Maior Refratária', 'TDAH', 'Demência Frontotemporal'],
      doi: '10.1146/annurev.neuro.24.1.167',
      citacao: 'Miller & Cohen (2001) Annu Rev Neurosci / Petrides (2005)',
      audioScript: 'O Córtex Pré-Frontal Dorsolateral Esquerdo orquestra o planejamento superior e o raciocínio executivo, inibindo respostas automáticas e mantendo metas cognitivas ativas.'
    },
    {
      id: 3,
      code: 'BROCA_LEFT',
      estrutura: 'Área de Broca (Giro Frontal Inferior Esquerdo — BA 44/45)',
      name: 'Área de Broca (Giro Frontal Inferior Esquerdo — BA 44/45)',
      latinName: 'Area Broca pars opercularis et triangularis',
      uberonId: 'UBERON:0013524',
      categoria: 'TELENCÉFALO',
      category: 'TELENCÉFALO',
      escala: 'Giro Cortical (Meso: ~105 mm)',
      tier: 'MESO',
      coordenadas: [4.62, 0.50, 2.39],
      center: [4.62, 0.50, 2.39],
      mniCenter: [+4.62, +0.50, +2.39],
      optimalDist: 10.5,
      color: '#fb923c',
      descricao: 'Composta pela pars opercularis (BA 44) e pars triangularis (BA 45) no hemisfério cerebral dominante para linguagem.',
      funcoes: [
        'Programação motora da fala e fonação articulada',
        'Processamento sintático e morfossintaxe hierárquica',
        'Movimentos orofaciais e planejamento dos músculos laríngeos'
      ],
      conexoes: [
        'Área de Wernicke via Fascículo Arqueado',
        'Córtex Pré-Motor ventral e Giro Pré-Central M1',
        'Gânglios da Base e Tálamo ventral anterior'
      ],
      vascularizacao: 'Artéria Prérrolândica e Artéria do Sulco Frontal Inferior (ramos da Artéria Cerebral Média Esquerda)',
      neurotransmissores: ['Acetilcolina', 'Glutamato', 'GABA'],
      doencas: ['Afasia de Broca', 'Apraxia da Fala', 'AVC Isquêmico da ACM Esquerda'],
      doi: '10.1093/brain/awm042',
      citacao: 'Broca (1861) / Dronkers et al. (2007) Brain',
      audioScript: 'A Área de Broca, situada estritamente no hemisfério esquerdo anatômico nos giros opercular e triangular, converte formulações linguísticas abstratas em comandos motores coordenados para as pregas vocais e lábios.'
    },
    {
      id: 4,
      code: 'M1_LEFT',
      estrutura: 'Córtex Motor Primário M1 (Giro Pré-Central Esquerdo — BA 4)',
      name: 'Córtex Motor Primário M1 (Giro Pré-Central Esquerdo — BA 4)',
      latinName: 'Gyrus praecentralis sinister (Area gigantopyramidalis)',
      uberonId: 'UBERON:0001384',
      categoria: 'TELENCÉFALO',
      category: 'TELENCÉFALO',
      escala: 'Giro / Coluna Cortical (Meso: ~110 mm)',
      tier: 'MESO',
      coordenadas: [3.79, 3.80, 0.43],
      center: [3.79, 3.80, 0.43],
      mniCenter: [+3.79, +3.80, +0.43],
      optimalDist: 11.0,
      color: '#f43f5e',
      descricao: 'Organização somatotópica de Penfield (homúnculo motor); abriga as células piramidais gigantes de Betz na Camada V.',
      funcoes: [
        'Geração do comando motor voluntário fracionado distal',
        'Início do Trato Corticoespinhal lateral',
        'Modulação fina de força e velocidade de contração muscular'
      ],
      conexoes: [
        'Motoneurônios Alfa espinhais contralaterais via Trato Corticoespinhal',
        'Córtex Somatossensorial S1 via conexões transcorticais curtas',
        'Cerebelo via circuito Córtico-Ponto-Cerebelar'
      ],
      vascularizacao: 'Artéria Roscado / Rolândica e Ramos Terminais da ACA (para o membro inferior) e ACM (para face e membros superiores)',
      neurotransmissores: ['L-Glutamato', 'GABA'],
      doencas: ['Hemiplegia Espástica Contralateral', 'Esclerose Lateral Amiotrófica (ELA)', 'AVC Motor'],
      doi: '10.1093/brain/60.4.389',
      citacao: 'Penfield & Boldrey (1937) / Betz (1874)',
      audioScript: 'O Giro Pré-Central Esquerdo abriga o Córtex Motor Primário. Aqui residem os neurônios piramidais de Betz da Camada V, cujos axônios descem ininterruptamente pela cápsula interna até a medula espinhal.'
    },
    {
      id: 5,
      code: 'S1_LEFT',
      estrutura: 'Córtex Somatossensorial Primário S1 (Giro Pós-Central Esquerdo — BA 3/1/2)',
      name: 'Córtex Somatossensorial Primário S1 (Giro Pós-Central Esquerdo — BA 3/1/2)',
      latinName: 'Gyrus postcentralis sinister',
      uberonId: 'UBERON:0008933',
      categoria: 'TELENCÉFALO',
      category: 'TELENCÉFALO',
      escala: 'Giro Cortical (Meso: ~110 mm)',
      tier: 'MESO',
      coordenadas: [3.47, 3.65, -0.54],
      center: [3.47, 3.65, -0.54],
      mniCenter: [+3.47, +3.65, -0.54],
      optimalDist: 11.0,
      color: '#ec4899',
      descricao: 'Receptor das radiações tálamo-corticais originadas no núcleo ventral posterolateral (VPL) e posteromedial (VPM).',
      funcoes: [
        'Discriminação táctil epicrítica entre dois pontos',
        'Propriocepção consciente cinestésica articular',
        'Localização e intensidade de dor e temperatura'
      ],
      conexoes: [
        'Núcleos Ventrais Posteriores do Tálamo (VPL/VPM)',
        'Córtex Motor Primário M1 e Córtex Parietal Posterior',
        'Córtex Somatossensorial Secundário (S2)'
      ],
      vascularizacao: 'Artéria Parietal Anterior da Artéria Cerebral Média e ramos pós-rolândicos da ACA',
      neurotransmissores: ['L-Glutamato', 'GABA'],
      doencas: ['Astereognosia', 'Hipoestesia Contralateral', 'Dor Talâmica Central'],
      doi: '10.1152/jn.1957.20.4.408',
      citacao: 'Mountcastle (1957) J Neurophysiol / Kaas (1983)',
      audioScript: 'O Giro Pós-Central Esquerdo recebe pelo leminisco medial e trato espinotalâmico todas as sensações do corpo contralateral mapeadas no homúnculo sensitivo.'
    },
    {
      id: 6,
      code: 'WERNICKE_LEFT',
      estrutura: 'Área de Wernicke e Fascículo Arqueado (Giro Temporal Superior — BA 22)',
      name: 'Área de Wernicke e Fascículo Arqueado (Giro Temporal Superior — BA 22)',
      latinName: 'Area Wernicke in gyro temporali superiore',
      uberonId: 'UBERON:0013525',
      categoria: 'TELENCÉFALO',
      category: 'TELENCÉFALO',
      escala: 'Giro Cortical (Meso: ~105 mm)',
      tier: 'MESO',
      coordenadas: [4.89, -0.29, -1.41],
      center: [4.89, -0.29, -1.41],
      mniCenter: [+4.89, -0.29, -1.41],
      optimalDist: 10.5,
      color: '#06b6d4',
      descricao: 'Zona perissilviana posterior no hemisfério esquerdo fundamental para decodificação da linguagem auditiva.',
      funcoes: [
        'Compreensão semântica e decodificação fonológica',
        'Acesso ao léxico mental e representação de palavras',
        'Transmissão para a Área de Broca para repetição verbal'
      ],
      conexoes: [
        'Área de Broca via Fascículo Arqueado',
        'Córtex Auditivo Primário A1 via conexões intrassulculares',
        'Giro Angular (BA 39) e Supramarginal (BA 40)'
      ],
      vascularizacao: 'Artérias Temporais Posteriores da Artéria Cerebral Média Esquerda',
      neurotransmissores: ['Glutamato', 'GABA'],
      doencas: ['Afasia de Wernicke (Sensitiva Fluente)', 'Afasia de Condução', 'Surdez Verbal Pura'],
      doi: '10.1002/ana.20404',
      citacao: 'Wernicke (1874) / Catani et al. (2005)',
      audioScript: 'A Área de Wernicke no hemisfério esquerdo interpreta os fonemas e o sentido semântico da fala, projetando axônios mielinizados até Broca através do fascículo arqueado.'
    },
    {
      id: 7,
      code: 'V1_CALCARINE',
      estrutura: 'Córtex Visual Primário V1 (Sulco Calcarino Occipital — BA 17 / Área Estriada)',
      name: 'Córtex Visual Primário V1 (Sulco Calcarino Occipital — BA 17 / Área Estriada)',
      latinName: 'Area striata (Cortex visualis primarius)',
      uberonId: 'UBERON:0002436',
      categoria: 'TELENCÉFALO',
      category: 'TELENCÉFALO',
      escala: 'Giro Cortical (Meso: ~110 mm)',
      tier: 'MESO',
      coordenadas: [1.70, -1.18, -6.37],
      center: [1.70, -1.18, -6.37],
      mniCenter: [+1.70, -1.18, -6.37],
      optimalDist: 11.0,
      color: '#8b5cf6',
      descricao: 'Localizado nos lábios superior (cúneus) e inferior (giro lingual) do sulco calcarino; linha proeminente de Gennari.',
      funcoes: [
        'Mapeamento retinotópico de alta fidelidade do campo visual',
        'Detecção de orientação de bordas (células simples e complexas)',
        'Frequência espacial e disparidade ocular para estereopsia 3D'
      ],
      conexoes: [
        'Corpo Geniculado Lateral do Tálamo via Radiações Ópticas de Gratiolet',
        'Áreas visuais secundárias V2, V3, V4 e V5/MT'
      ],
      vascularizacao: 'Artéria Calcarina (ramo terminal da Artéria Cerebral Posterior - ACP)',
      neurotransmissores: ['L-Glutamato', 'GABA'],
      doencas: ['Hemianopsia Homônima Contralateral com Preservação Macular', 'Cegueira Cortical (Síndrome de Anton)'],
      doi: '10.1113/jphysiol.1962.sp006837',
      citacao: 'Hubel & Wiesel (1962) / Felleman & Van Essen (1991)',
      audioScript: 'No polo occipital posterior, o Córtex Visual Primário às margens do sulco calcarino decifra os impulsos elétricos originados nos fotorreceptores da retina.'
    },
    {
      id: 8,
      code: 'A1_LEFT',
      estrutura: 'Córtex Auditivo Primário A1 (Giros Transversos de Heschl — BA 41/42)',
      name: 'Córtex Auditivo Primário A1 (Giros Transversos de Heschl — BA 41/42)',
      latinName: 'Gyri temporales transversi (Heschl)',
      uberonId: 'UBERON:0005727',
      categoria: 'TELENCÉFALO',
      category: 'TELENCÉFALO',
      escala: 'Giro Cortical (Meso: ~100 mm)',
      tier: 'MESO',
      coordenadas: [4.76, -0.86, -0.12],
      center: [4.76, -0.86, -0.12],
      mniCenter: [+4.76, -0.86, -0.12],
      optimalDist: 10.0,
      color: '#14b8a6',
      descricao: 'Profundo ao sulco lateral na face superior do lobo temporal; organização tonotópica iso-frequencial em bandas.',
      funcoes: [
        'Recepção e discriminação de frequências sonoras cocleares',
        'Localização espacial de fontes sonoras por diferença de tempo interaural',
        'Processamento temporal rápido de transientes acústicos'
      ],
      conexoes: [
        'Corpo Geniculado Medial do Tálamo via Radiação Acústica',
        'Área Auditiva Secundária (Planum Temporale) e Área de Wernicke'
      ],
      vascularizacao: 'Ramos temporais e operculares da Artéria Cerebral Média',
      neurotransmissores: ['L-Glutamato', 'GABA'],
      doencas: ['Agnosia Auditiva Cortical', 'Amusia', 'Alucinações Auditivas'],
      doi: '10.1073/pnas.97.22.11793',
      citacao: 'Heschl (1878) / Kaas & Hackett (2000)',
      audioScript: 'Profundo ao sulco lateral, o giro transverso anterior de Heschl processa as frequências acústicas com arquitetura tonotópica precisa.'
    },
    {
      id: 9,
      code: 'INSULA_LEFT',
      estrutura: 'Córtex da Ínsula Esquerda (Lobo Insular / Lobo Oculto de Reil)',
      name: 'Córtex da Ínsula Esquerda (Lobo Insular / Lobo Oculto de Reil)',
      latinName: 'Insula (Lobus insularis)',
      uberonId: 'UBERON:0002022',
      categoria: 'TELENCÉFALO',
      category: 'TELENCÉFALO',
      escala: 'Lobo Cortical (Meso: ~95 mm)',
      tier: 'MESO',
      coordenadas: [3.55, -0.35, 0.60],
      center: [3.55, -0.35, 0.60],
      mniCenter: [+3.55, -0.35, +0.60],
      optimalDist: 9.5,
      color: '#a855f7',
      descricao: 'Oculta sob os opérculos frontal, parietal e temporal; contém giros curtos anteriores e giros longos posteriores.',
      funcoes: [
        'Interocepção e consciência do estado fisiológico interno visceral',
        'Percepção gustativa primária e sensações viscerais',
        'Empatia, nojo consciente e valência afetiva da dor',
        'Regulação autônoma simpática e parassimpática cardíaca'
      ],
      conexoes: [
        'Córtex Cingulado Anterior (Rede de Saliência)',
        'Amígdala e Hipotálamo',
        'Núcleo Ventral Posteromedial (VPMpc) do Tálamo'
      ],
      vascularizacao: 'Artérias Insulares (ramos do segmento M2 da Artéria Cerebral Média)',
      neurotransmissores: ['GABA', 'Serotonina', 'Noradrenalina', 'Peptídeos Opioides'],
      doencas: ['Disautonomia Cardíaca Pós-AVC', 'Perda da Empatia', 'Agnosia Gustativa', 'Adição Química'],
      doi: '10.1038/nrn2555',
      citacao: 'Craig (2009) Nat Rev Neurosci / Menon & Uddin (2010)',
      audioScript: 'A Ínsula, oculta sob os opérculos frontal, parietal e temporal, é o centro da percepção visceral, da interocepção e do processamento emocional consciente.'
    },
    {
      id: 10,
      code: 'PARIETAL_LEFT',
      estrutura: 'Lobo Parietal Superior Esquerdo (BA 7 / Área de Associação Sensitiva)',
      name: 'Lobo Parietal Superior Esquerdo (BA 7 / Área de Associação Sensitiva)',
      latinName: 'Lobulus parietalis superior sinister',
      uberonId: 'UBERON:0006093',
      categoria: 'TELENCÉFALO',
      category: 'TELENCÉFALO',
      escala: 'Lobo Cortical (Meso: ~115 mm)',
      tier: 'MESO',
      coordenadas: [2.60, 4.10, -3.20],
      center: [2.60, 4.10, -3.20],
      mniCenter: [+2.60, +4.10, -3.20],
      optimalDist: 11.5,
      color: '#6366f1',
      descricao: 'Localizado dorsalmente ao sulco intraparietal; polo de convergência de múltiplos mapas espaciais corporais.',
      funcoes: [
        'Integração sensoriomotora visuoespacial em tempo real',
        'Transformação de coordenadas do alvo para alcance manual guiado visualmente',
        'Esquema corporal proprioceptivo e orientação tridimensional'
      ],
      conexoes: [
        'Córtex Pré-Motor Dorsal e Campos Oculares Frontais (FEF)',
        'Córtex Visual de Associação e Pulvinar do Tálamo'
      ],
      vascularizacao: 'Artéria Parietal Posterior da ACM e Artéria Pericalosa da ACA',
      neurotransmissores: ['L-Glutamato', 'Acetilcolina'],
      doencas: ['Apraxia Ideomotora', 'Síndrome de Balint (Ataxia Óptica)', 'Desorientação Espacial'],
      doi: '10.1146/annurev.neuro.25.112701.142922',
      citacao: 'Andersen & Buneo (2002) Annu Rev Neurosci',
      audioScript: 'O Lobo Parietal Superior sintetiza estímulos visuais e somatossensoriais para gerar o mapa do corpo no espaço tridimensional.'
    },
    {
      id: 11,
      code: 'HIPPOCAMPUS',
      estrutura: 'Hipocampo (Corno de Amon CA1–CA4 e Giro Denteado)',
      name: 'Hipocampo (Corno de Amon CA1–CA4 e Giro Denteado)',
      latinName: 'Formatio hippocampi (Cornu Ammonis)',
      uberonId: 'UBERON:0001954',
      categoria: 'SISTEMA LÍMBICO',
      category: 'SISTEMA LÍMBICO',
      escala: 'Estrutura Subcortical (Meso: ~95 mm)',
      tier: 'MESO',
      coordenadas: [2.45, -1.85, -1.10],
      center: [2.45, -1.85, -1.10],
      mniCenter: [+2.45, -1.85, -1.10],
      optimalDist: 9.5,
      color: '#4f46e5',
      descricao: 'Estrutura arqueada trilaminar (arquicórtex) no lobo temporal medial conectada ao fórnix; células de lugar (place cells).',
      funcoes: [
        'Consolidação de memória declarativa episódica e semântica',
        'Navegação espacial e mapa cognitivo do ambiente',
        'Neurogênese hipocampal adulta na zona subgranular do giro denteado'
      ],
      conexoes: [
        'Córtex Entorrinal via Via Perfurante',
        'Corpos Mamilares e Tálamo Anterior via Fórnix (Circuito de Papez)',
        'Amígdala Basolateral'
      ],
      vascularizacao: 'Artéria Coróidea Anterior e Artéria Cerebral Posterior (ramos hipocampais)',
      neurotransmissores: ['L-Glutamato', 'GABA', 'Acetilcolina (projeções septais)', 'BDNF'],
      doencas: ['Doença de Alzheimer (Atrofia precoce de CA1)', 'Epilepsia de Lobo Temporal Mesial com Esclerose Hipocampal', 'Amnésia Global'],
      doi: '10.1136/jnnp.20.1.11',
      citacao: 'Scoville & Milner (1957) / O’Keefe & Nadel (1978)',
      audioScript: 'O Hipocampo, situado medialmente no lobo temporal e contínuo ao fórnix, consolida memórias recentes em memórias de longo prazo e codifica a navegação espacial.'
    },
    {
      id: 12,
      code: 'AMYGDALA',
      estrutura: 'Complexo Amigdaloidiano (Amígdala — Núcleos BLA e CeA)',
      name: 'Complexo Amigdaloidiano (Amígdala — Núcleos BLA e CeA)',
      latinName: 'Corpus amygdaloideum',
      uberonId: 'UBERON:0001876',
      categoria: 'SISTEMA LÍMBICO',
      category: 'SISTEMA LÍMBICO',
      escala: 'Estrutura Subcortical (Meso: ~90 mm)',
      tier: 'MESO',
      coordenadas: [2.15, -1.45, 0.45],
      center: [2.15, -1.45, 0.45],
      mniCenter: [+2.15, -1.45, +0.45],
      optimalDist: 9.0,
      color: '#e11d48',
      descricao: 'Estrutura ovóide em forma de amêndoa rostral à cauda do hipocampo; núcleo basolateral (BLA) e núcleo central (CeA).',
      funcoes: [
        'Processamento de valência emocional e detecção de ameaças',
        'Condicionamento aversivo ao medo (fear conditioning)',
        'Modulação adrenérgica da consolidação de memórias vívidas',
        'Ativação autonômica e endócrina do estresse agudo'
      ],
      conexoes: [
        'Hipotálamo e Substância Cinzenta Periaquedutal (PAG) via Estria Terminal',
        'Córtex Pré-Frontal Ventromedial (Inibição de extinção do medo)',
        'Córtex Sensorial e Tálamo'
      ],
      vascularizacao: 'Artéria Coróidea Anterior e ramos uncal da Artéria Cerebral Média',
      neurotransmissores: ['GABA', 'L-Glutamato', 'Noradrenalina', 'Serotonina', 'CRH'],
      doencas: ['Transtorno de Estresse Pós-Traumático (TEPT)', 'Síndrome de Klüver-Bucy', 'Transtornos de Pânico'],
      doi: '10.1146/annurev.neuro.23.1.155',
      citacao: 'LeDoux (2000) Annu Rev Neurosci / Davis (1992)',
      audioScript: 'A Amígdala, localizada logo à frente da cabeça do hipocampo, avalia instantaneamente estímulos de perigo e ativa o eixo do estresse antes mesmo da percepção consciente.'
    },
    {
      id: 13,
      code: 'STRIATUM',
      estrutura: 'Corpo Estriado (Núcleo Caudado e Putâmen)',
      name: 'Corpo Estriado (Núcleo Caudado e Putâmen)',
      latinName: 'Corpus striatum (Nucleus caudatus et Putamen)',
      uberonId: 'UBERON:0002420',
      categoria: 'NÚCLEOS DA BASE',
      category: 'NÚCLEOS DA BASE',
      escala: 'Núcleo Subcortical (Meso: ~100 mm)',
      tier: 'MESO',
      coordenadas: [1.85, 0.20, 0.85],
      center: [1.85, 0.20, 0.85],
      mniCenter: [+1.85, +0.20, +0.85],
      optimalDist: 10.0,
      color: '#f59e0b',
      descricao: 'Principal núcleo de entrada dos gânglios da base; neurônios espinhosos médios (MSNs) GABAérgicos com receptores D1 e D2.',
      funcoes: [
        'Seleção e iniciação de programas motores adequados',
        'Aprendizado procedural por reforço e consolidação de hábitos',
        'Flexibilidade comportamental e inibição de respostas motoras concorrentes'
      ],
      conexoes: [
        'Substância Negra Pars Compacta via Via Nigroestriatal',
        'Córtex Cerebral (todas as áreas) via projeções córtico-estriatais',
        'Globo Pálido Interno e Externo via vias direta e indireta'
      ],
      vascularizacao: 'Artérias Lenticuloestriadas (ramos perfurantes da Artéria Cerebral Média)',
      neurotransmissores: ['GABA', 'Dopamina (receptores D1 excitatórios e D2 inibitórios)', 'Acetilcolina (interneurônios gigantes)'],
      doencas: ['Doença de Parkinson (desaferentação dopaminérgica)', 'Doença de Huntington (morte dos MSNs)', 'Síndrome de Tourette'],
      doi: '10.1146/annurev.ne.09.030186.002043',
      citacao: 'Alexander, DeLong & Strick (1986) / Graybiel (2008)',
      audioScript: 'O Corpo Estriado integra os comandos motores corticais com os disparos dopaminérgicos da substância negra para autorizar ou inibir movimentos voluntários.'
    },
    {
      id: 14,
      code: 'GLOBUS_PALLIDUS',
      estrutura: 'Globo Pálido (Segmentos Interno GPi e Externo GPe)',
      name: 'Globo Pálido (Segmentos Interno GPi e Externo GPe)',
      latinName: 'Globus pallidus (Pars interna et externa)',
      uberonId: 'UBERON:0002475',
      categoria: 'NÚCLEOS DA BASE',
      category: 'NÚCLEOS DA BASE',
      escala: 'Núcleo Subcortical (Meso: ~95 mm)',
      tier: 'MESO',
      coordenadas: [1.42, -0.18, 0.40],
      center: [1.42, -0.18, 0.40],
      mniCenter: [+1.42, -0.18, +0.40],
      optimalDist: 9.5,
      color: '#d97706',
      descricao: 'Núcleo cuneiforme medial ao putâmen, dividido pela lâmina medular medial em GPe (via indireta) e GPi (estação de saída motora).',
      funcoes: [
        'Saída inibitória tônica dos gânglios da base para o tálamo motor (GPi)',
        'Filtro de movimento voluntário através da via indireta (GPe)',
        'Controle do tônus postural e da fluidez cinética'
      ],
      conexoes: [
        'Putâmen e Núcleo Caudado (estriadopalidais)',
        'Núcleo Subtalâmico (alça recíproca palidossubtalâmica)',
        'Núcleo Ventral Anterior e Ventral Lateral do Tálamo via Fascículo Talâmico'
      ],
      vascularizacao: 'Artéria Coróidea Anterior e ramos lenticuloestriados mediais',
      neurotransmissores: ['GABA', 'Substância P', 'Encefalina'],
      doencas: ['Distonia Primária', 'Bradicinesia no Parkinson', 'Hemibalismo'],
      doi: '10.1038/nrn1156',
      citacao: 'DeLong & Wichmann (2007) Lancet Neurol',
      audioScript: 'O Globo Pálido atua como o freio e acelerador motor dos gânglios da base, emitindo disparos GABAérgicos tônicos para modular a atividade talâmica.'
    },
    {
      id: 15,
      code: 'CORPUS_CALLOSUM',
      estrutura: 'Corpo Caloso (Esplênio, Tronco, Joelho e Rostro)',
      name: 'Corpo Caloso (Esplênio, Tronco, Joelho e Rostro)',
      latinName: 'Corpus callosum',
      uberonId: 'UBERON:0002336',
      categoria: 'SUBSTÂNCIA BRANCA',
      category: 'SUBSTÂNCIA BRANCA',
      escala: 'Comissura Inter-hemisférica (Meso: ~100 mm)',
      tier: 'MESO',
      coordenadas: [0.00, 1.20, -0.50],
      center: [0.00, 1.20, -0.50],
      mniCenter: [0.00, +1.20, -0.50],
      optimalDist: 10.0,
      color: '#e2e8f0',
      descricao: 'Maior trato de substância branca do cérebro, contendo mais de 200 milhões de axônios mielinizados cruzando a fissura longitudinal.',
      funcoes: [
        'Comunicação e integração inter-hemisférica direta',
        'Transferência de informações táteis, visuais e auditivas entre hemisférios',
        'Sincronização cortical bilateral para coordenação bimanual'
      ],
      conexoes: [
        'Córtex frontal esquerdo e direito via fórceps menor (joelho)',
        'Córtex occipital esquerdo e direito via fórceps maior (esplênio)',
        'Córtex parietal e temporal via tapetum e corpo do caloso'
      ],
      vascularizacao: 'Artéria Cerebral Anterior (Artéria Pericalosa e Artéria Calosomarginal)',
      neurotransmissores: ['L-Glutamato axonal com condução saltatória mielinizada'],
      doencas: ['Síndrome do Cérebro Dividido (Split-Brain)', 'Apraxia Calosal', 'Agênese de Corpo Caloso', 'Epilepsia Refratária (calosotomia)'],
      doi: '10.1016/j.neuroimage.2008.06.014',
      citacao: 'Gazzaniga (2000) Brain / Hofer & Frahm (2006)',
      audioScript: 'O Corpo Caloso é a grande ponte inter-hemisférica com mais de 200 milhões de axônios mielinizados conectando os dois lados do cérebro.'
    },
    {
      id: 16,
      code: 'THALAMUS',
      estrutura: 'Tálamo (Núcleos de Relé e Pulvinar Posterior)',
      name: 'Tálamo (Núcleos de Relé e Pulvinar Posterior)',
      latinName: 'Thalamus dorsalis',
      uberonId: 'UBERON:0001897',
      categoria: 'DIENCÉFALO',
      category: 'DIENCÉFALO',
      escala: 'Estrutura Subcortical (Meso: ~100 mm)',
      tier: 'MESO',
      coordenadas: [1.15, -0.40, -0.80],
      center: [1.15, -0.40, -0.80],
      mniCenter: [+1.15, -0.40, -0.80],
      optimalDist: 10.0,
      color: '#ea580c',
      descricao: 'Massa ovóide de substância cinzenta diencefálica; comutador sensorial com núcleos específicos (VPL, VPM, CGL, CGM, VL) e associativos (Pulvinar).',
      funcoes: [
        'Relé obrigatório de todas as vias sensoriais para o córtex (exceto o olfato)',
        'Portão atencional de entrada da consciência perceptiva',
        'Sincronização dos ritmos oscilatórios eletroencefalográficos (ritmo gama 40 Hz)',
        'Relé motor dos gânglios da base e cerebelo para o córtex motor'
      ],
      conexoes: [
        'Todo o manto cortical via Radiações Talâmicas',
        'Núcleo Reticular do Tálamo (envelope inibitório GABAérgico)',
        'Tratos sensoriais ascendentes (lemnisco medial, espinotalâmico, radiações ópticas)'
      ],
      vascularizacao: 'Artérias Talamoperfurantes e Talamogeniculadas da ACP e Artéria Comunicante Posterior',
      neurotransmissores: ['L-Glutamato', 'GABA'],
      doencas: ['Síndrome de Dejerine-Roussy (Dor Talâmica Central)', 'Sinal do Taco de Hóquei Pulvinar na DCJ', 'Insônia Familiar Fatal'],
      doi: '10.1098/rstb.2002.1157',
      citacao: 'Sherman & Guillery (2002) / Jones (2007) The Thalamus',
      audioScript: 'O Tálamo atua como o grande comutador central do encéfalo. Todas as vias sensitivas — exceto o olfato — fazem sinapse nos seus núcleos antes de alcançarem a consciência cortical.'
    },
    {
      id: 17,
      code: 'HYPOTHALAMUS_PITUITARY',
      estrutura: 'Hipotálamo, Infundíbulo e Glândula Hipófise',
      name: 'Hipotálamo, Infundíbulo e Glândula Hipófise',
      latinName: 'Hypothalamus et Glandula pituitaria',
      uberonId: 'UBERON:0001898',
      categoria: 'DIENCÉFALO / ENDÓCRINO',
      category: 'DIENCÉFALO / ENDÓCRINO',
      escala: 'Eixo Neuroendócrino (Meso: ~90 mm)',
      tier: 'MESO',
      coordenadas: [0.00, -1.75, 0.75],
      center: [0.00, -1.75, 0.75],
      mniCenter: [0.00, -1.75, +0.75],
      optimalDist: 9.0,
      color: '#d97706',
      descricao: 'Estrutura integradora neuroendócrina; núcleos pré-óptico, supraquiasmático, paraventricular, supraóptico, arqueado e mamilares.',
      funcoes: [
        'Centro mestre da homeostase fisiológica (temperatura, sede, fome e osmolaridade)',
        'Relógio circadiano mestre no núcleo supraquiasmático',
        'Secreção hormonal trófica (CRH, TRH, GnRH, GHRH, Somatostatina)',
        'Síntese e liberação de Oxitocina e Vasopressina (ADH) pela neuro-hipófise'
      ],
      conexoes: [
        'Adeno-hipófise via Sistema Porta-Hipofisário de Popa e Fielding',
        'Neuro-hipófise via Trato Hipotálamo-Hipofisário',
        'Amígdala, Hipocampo e Tronco Encefálico autonômico'
      ],
      vascularizacao: 'Artérias Hipofisárias Superior e Inferior (ramos da Artéria Carótida Interna)',
      neurotransmissores: ['Oxitocina', 'Vasopressina (ADH)', 'Dopamina (PIF)', 'GABA', 'Orexina / Hipocretina'],
      doencas: ['Diabetes Insipidus', 'Adenomas Hipofisários', 'Síndrome de Cushing', 'Narcolepsia (perda de orexina)'],
      doi: '10.1016/j.cell.2014.05.023',
      citacao: 'Saper & Lowell (2014) Cell / Popa & Fielding (1930)',
      audioScript: 'O Hipotálamo e a Hipófise formam a ponte entre o sistema neural e o sistema endócrino, regulando temperatura, hormônios e equilíbrio hídrico.'
    },
    {
      id: 18,
      code: 'OPTIC_CHIASM',
      estrutura: 'Quiasma Óptico e Tratos Ópticos',
      name: 'Quiasma Óptico e Tratos Ópticos',
      latinName: 'Chiasma opticum et Tractus opticus',
      uberonId: 'UBERON:0000959',
      categoria: 'VIA VISUAL',
      category: 'VIA VISUAL',
      escala: 'Estrutura Diencefálica Anterior (Meso: ~85 mm)',
      tier: 'MESO',
      coordenadas: [0.00, -1.40, 1.45],
      center: [0.00, -1.40, 1.45],
      mniCenter: [0.00, -1.40, +1.45],
      optimalDist: 8.5,
      color: '#38bdf8',
      descricao: 'Cruzamento em X das fibras retinianas nasais na base do cérebro, imediatamente anterior ao infundíbulo e superior à sela túrcica.',
      funcoes: [
        'Decussação de 53% das fibras axonais ganglionares retinianas (axônios das hemirretinas nasais)',
        'Separação dos hemicampos visuais direito e esquerdo para processamento no hemisfério contralateral'
      ],
      conexoes: [
        'Nervos Ópticos (NC II) anteriores vindos das retinas',
        'Tratos Ópticos posteriores contornando o mesencéfalo até o CGL e colículo superior'
      ],
      vascularizacao: 'Artérias Hipofisárias Superiores e ramos da Artéria Cerebral Anterior e Comunicante Anterior',
      neurotransmissores: ['L-Glutamato axonal retiniano'],
      doencas: ['Hemianopsia Heterônima Bitemporal (por compressão tumoral hipofisária)', 'Neurite Óptica'],
      doi: '10.1016/S0140-6736(08)60838-5',
      citacao: 'Wong et al. (2008) Lancet / Cajal (1898)',
      audioScript: 'No Quiasma Óptico, as fibras da retina nasal cruzam a linha média, permitindo que todo o campo visual de um lado seja direcionado ao hemisfério cerebral oposto.'
    },
    {
      id: 19,
      code: 'VENTRICULAR_SYSTEM',
      estrutura: 'Sistema Ventricular Completo (Laterais, III, Aqueduto e IV Ventrículo)',
      name: 'Sistema Ventricular Completo (Laterais, III, Aqueduto e IV Ventrículo)',
      latinName: 'Systema ventriculare cerebri',
      uberonId: 'UBERON:0005281',
      categoria: 'SISTEMA LIQUÓRICO',
      category: 'SISTEMA LIQUÓRICO',
      escala: 'Cavidades Liquóricas (Meso: ~110 mm)',
      tier: 'MESO',
      coordenadas: [0.00, -1.00, -0.40],
      center: [0.00, -1.00, -0.40],
      mniCenter: [0.00, -1.00, -0.40],
      optimalDist: 11.0,
      color: '#0284c7',
      descricao: 'Sistema hidrodinâmico contínuo contendo cerca de 150 mL de Líquido Cefalorraquidiano (LCR) produzido nos plexos coróideos.',
      funcoes: [
        'Amortecimento mecânico e sustentação hidrostática de flutuação para o encéfalo',
        'Drenagem de escórias metabólicas e proteínas amiloides pelo sistema glinfático',
        'Homeostase iônica e circulação de sinalizadores neuropeptídicos'
      ],
      conexoes: [
        'Forames de Monro (Ventrículos Laterais -> III Ventrículo)',
        'Aqueduto Cerebral de Sylvius (III Ventrículo -> IV Ventrículo)',
        'Forames de Luschka e Magendie para o espaço subaracnóideo',
        'Canal central da medula espinhal'
      ],
      vascularizacao: 'Plexos coróideos supridos pela Artéria Coróidea Anterior e Artérias Coróideas Posteriores',
      neurotransmissores: ['LCR acelular isotônico com glicose (60 mg/dL), proteínas (30 mg/dL) e eletrólitos'],
      doencas: ['Hidrocefalia Obstrutiva / Comunicante', 'Hidrocefalia de Pressão Normal (HPN)', 'Estenose de Aqueduto'],
      doi: '10.1126/scitranslmed.3003748',
      citacao: 'Nedergaard (2013) Science / Spector et al. (2015)',
      audioScript: 'O Sistema Ventricular banha e protege o cérebro em líquido cefalorraquidiano. O fluxo contínuo dos ventrículos laterais ao quarto ventrículo lava as escórias moleculares metabólicas.'
    },
    {
      id: 20,
      code: 'MIDBRAIN_SN',
      estrutura: 'Mesencéfalo e Substância Negra (Pars Compacta e Pars Reticulata)',
      name: 'Mesencéfalo e Substância Negra (Pars Compacta e Pars Reticulata)',
      latinName: 'Mesencephalon et Substantia nigra',
      uberonId: 'UBERON:0001891',
      categoria: 'TRONCO ENCEFÁLICO',
      category: 'TRONCO ENCEFÁLICO',
      escala: 'Tronco Encefálico Superior (Meso: ~90 mm)',
      tier: 'MESO',
      coordenadas: [0.75, -2.55, -0.65],
      center: [0.75, -2.55, -0.65],
      mniCenter: [+0.75, -2.55, -0.65],
      optimalDist: 9.0,
      color: '#38bdf8',
      descricao: 'Contém a substância negra pigmentada rica em neuromelanina, núcleo rubro, colículos superiores/inferiores e tegmento mesencefálico.',
      funcoes: [
        'Síntese e secreção de Dopamina pela Via Nigroestriatal (Pars Compacta)',
        'Reflexos visuais de rastreio (Colículo Superior) e reflexos auditivos (Colículo Inferior)',
        'Controle de motricidade extrapiramidal e postura pelo Núcleo Rubro',
        'Origem dos nervos cranianos Oculomotor (III) e Troclear (IV)'
      ],
      conexoes: [
        'Putâmen e Núcleo Caudado via Via Nigroestriatal',
        'Córtex Cerebral via Pedúnculos Cerebrais',
        'Cerebelo via Pedúnculo Cerebelar Superior'
      ],
      vascularizacao: 'Artéria Basilar (ramos perfurantes paramedianos) e Artéria Cerebelar Superior (SCA)',
      neurotransmissores: ['Dopamina', 'GABA', 'Glutamato'],
      doencas: ['Doença de Parkinson (perda >60% dos neurônios dopaminérgicos)', 'Paralisia Supranuclear Progressiva', 'Síndrome de Weber'],
      doi: '10.1038/334345a0',
      citacao: 'Dahlström & Fuxe (1964) / Hirsch et al. (1988) Nature',
      audioScript: 'O Mesencéfalo abriga a Substância Negra, rica em neuromelanina. A perda dessas células produtoras de dopamina é a causa patológica direta da rigidez e tremor no Parkinson.'
    },
    {
      id: 21,
      code: 'PONS_VAROLII',
      estrutura: 'Ponte de Varólio (Protuberância Anular)',
      name: 'Ponte de Varólio (Protuberância Anular)',
      latinName: 'Pons Varolii',
      uberonId: 'UBERON:0000988',
      categoria: 'TRONCO ENCEFÁLICO',
      category: 'TRONCO ENCEFÁLICO',
      escala: 'Tronco Encefálico Médio (Meso: ~95 mm)',
      tier: 'MESO',
      coordenadas: [0.00, -4.10, -0.45],
      center: [0.00, -4.10, -0.45],
      mniCenter: [0.00, -4.10, -0.45],
      optimalDist: 9.5,
      color: '#0284c7',
      descricao: 'Volume abaulado ventral de fibras transversais córtico-ponto-cerebelares; contém núcleos dos nervos cranianos V, VI, VII e VIII.',
      funcoes: [
        'Revezamento de comandos motores córtico-cerebelares via pedúnculo cerebelar médio',
        'Centro pneumotáxico e apnêustico de regulação respiratória',
        'Vigilância, sono REM e noradrenalina no Núcleo Locus Coeruleus'
      ],
      conexoes: [
        'Cerebelo via Pedúnculos Cerebelares Médios (Braço da Ponte)',
        'Córtex Cerebral via Tratos Corticopontinos',
        'Trato Corticoespinhal em trânsito'
      ],
      vascularizacao: 'Artéria Basilar (ramos pontinos circunferenciais e paramedianos) e AICA',
      neurotransmissores: ['Noradrenalina (Locus Coeruleus)', 'Glutamato', 'Acetilcolina'],
      doencas: ['Síndrome do Encarceramento (Locked-in Syndrome)', 'Mielinólise Pontina Central', 'Neuralgia do Trigêmeo'],
      doi: '10.1093/acprof:oso/9780195052596.001.0001',
      citacao: 'Brodal (1981) Neurological Anatomy',
      audioScript: 'A Ponte de Varólio possui um volumoso abaulamento ventral de fibras transversais que levam ordens motoras ao cerebelo e contém núcleos de nervos cranianos vitais.'
    },
    {
      id: 22,
      code: 'MEDULLA_OBLONGATA',
      estrutura: 'Bulbo (Medula Oblonga) e Decussação das Pirâmides',
      name: 'Bulbo (Medula Oblonga) e Decussação das Pirâmides',
      latinName: 'Medulla oblongata',
      uberonId: 'UBERON:0001896',
      categoria: 'TRONCO ENCEFÁLICO',
      category: 'TRONCO ENCEFÁLICO',
      escala: 'Tronco Encefálico Inferior (Meso: ~95 mm)',
      tier: 'MESO',
      coordenadas: [0.00, -5.85, -0.65],
      center: [0.00, -5.85, -0.65],
      mniCenter: [0.00, -5.85, -0.65],
      optimalDist: 9.5,
      color: '#0369a1',
      descricao: 'Transição entre tronco e medula espinhal; apresenta fissura mediana anterior, pirâmides bulbares, olivas inferiores e decussação motora.',
      funcoes: [
        'Centro vital cardiorrespiratório e controle vasomotor autônomo',
        'Decussação motora de 85-90% das fibras do trato corticoespinhal',
        'Reflexos de deglutição, vômito, tosse e espirro',
        'Núcleos dos nervos cranianos IX, X, XI e XII'
      ],
      conexoes: [
        'Medula Espinhal (continuidade anatômica)',
        'Cerebelo via Pedúnculo Cerebelar Inferior (Corpo Restiforme)',
        'Núcleos Grácil e Cuneiforme com lemnisco medial'
      ],
      vascularizacao: 'Artérias Vertebrais, Artéria Espinhal Anterior e PICA (Artéria Cerebelar Inferior Posterior)',
      neurotransmissores: ['Serotonina (Núcleos da Rafe bulbar)', 'Noradrenalina', 'Acetilcolina'],
      doencas: ['Síndrome de Wallenberg (Bulbar Lateral)', 'Herniação Tonsilar (Morte Encefálica)', 'Parada Respiratória Bulbar'],
      doi: '10.1007/bf01673516',
      citacao: 'Wallenberg (1895) / Guyton & Hall (2020)',
      audioScript: 'O Bulbo é o centro da sobrevivência humana. Em sua porção anterior, as fibras motoras cruzam para o lado oposto na decussação das pirâmides, enquanto seu interior regula o coração e a respiração.'
    },
    {
      id: 23,
      code: 'CRANIAL_NERVES',
      estrutura: 'Nervos Cranianos (I ao XII: Olfatório ao Hipoglosso)',
      name: 'Nervos Cranianos (I ao XII: Olfatório ao Hipoglosso)',
      latinName: 'Nervi craniales I–XII',
      uberonId: 'UBERON:0001798',
      categoria: 'NERVOS CRANIANOS',
      category: 'NERVOS CRANIANOS',
      escala: 'Pares Cranianos (Meso: ~90 mm)',
      tier: 'MESO',
      coordenadas: [0.00, -3.80, 0.80],
      center: [0.00, -3.80, 0.80],
      mniCenter: [0.00, -3.80, +0.80],
      optimalDist: 9.0,
      color: '#34d399',
      descricao: 'Doze pares de nervos que emergem diretamente do encéfalo e tronco encefálico para inervação sensitiva, motora e autônoma da cabeça e vísceras.',
      funcoes: [
        'Sensibilidade especial: Olfato (I), Visão (II), Audição e Equilíbrio (VIII), Gustação (VII, IX, X)',
        'Motricidade ocular: Oculomotor (III), Troclear (IV), Abducente (VI)',
        'Sensibilidade da face e mastigação: Trigêmeo (V)',
        'Mímica facial: Facial (VII); Deglutição e fonação: Glossofaríngeo (IX), Vago (X), Hipoglosso (XII)',
        'Motricidade cervical: Acessório (XI)'
      ],
      conexoes: [
        'Núcleos motores, sensitivos e parassimpáticos do tronco encefálico',
        'Órgãos dos sentidos cefálicos e vísceras toracoabdominais (Nervo Vago)'
      ],
      vascularizacao: 'Artéria Basilar, Artérias Vertebrais e ramos meníngeos',
      neurotransmissores: ['Acetilcolina', 'L-Glutamato', 'GABA', 'Substância P'],
      doencas: ['Paralisia de Bell (NC VII)', 'Neuralgia do Trigêmeo (NC V)', 'Diplopia', 'Disfagia Neurogênica'],
      doi: '10.1016/S0140-6736(04)16413-5',
      citacao: 'Wilson-Pauwels et al. Cranial Nerves: Anatomy & Clinical Comments (2010)',
      audioScript: 'Os doze pares de nervos cranianos conectam o cérebro aos órgãos dos sentidos, à musculatura facial e às vísceras torácicas através do longo nervo vago.'
    },
    {
      id: 24,
      code: 'CEREBELLUM_FOLIA',
      estrutura: 'Cerebelo (Fólias, Vérmis e Árvore da Vida)',
      name: 'Cerebelo (Fólias, Vérmis e Árvore da Vida)',
      latinName: 'Cerebellum (Arbor vitae)',
      uberonId: 'UBERON:0002037',
      categoria: 'CEREBELO',
      category: 'CEREBELO',
      escala: 'Estrutura Infratentorial (Meso: ~110 mm)',
      tier: 'MESO',
      coordenadas: [0.00, -4.40, -3.20],
      center: [0.00, -4.40, -3.20],
      mniCenter: [0.00, -4.40, -3.20],
      optimalDist: 11.0,
      color: '#fda4af',
      descricao: 'Contém mais de 50 bilhões de neurônios (cerca de 60-80% do encéfalo); córtex em 3 camadas com células gigantes de Purkinje e células granulares densas.',
      funcoes: [
        'Cronometria e precisão milissegúndica de movimentos voluntários',
        'Correção de erros motores em tempo real através de feedback proprioceptivo',
        'Coordenação motora fina bimanual e equilíbrio postural',
        'Aprendizado motor (adaptação visuo-motora)'
      ],
      conexoes: [
        'Pedúnculos Cerebelares Superior, Médio e Inferior',
        'Núcleos profundos cerebelares (Fastigial, Globoso, Emboliforme, Denteado)',
        'Oliva Inferior via Fibras Trepadeiras e Ponte via Fibras Musgosas'
      ],
      vascularizacao: 'SCA (Artéria Cerebelar Superior), AICA (Artéria Cerebelar Inferior Anterior) e PICA',
      neurotransmissores: ['GABA (Células de Purkinje)', 'L-Glutamato (Células granulares e fibras paralelas)'],
      doencas: ['Ataxia Cerebelar da Marcha', 'Dismetria e Tremor Intencional', 'Disdiadococinesia', 'Ataxias Espinocerebelares (SCA)'],
      doi: '10.1038/nrn1988',
      citacao: 'Eccles, Ito & Szentágothai (1967) / Ito (2006) Nat Rev Neurosci',
      audioScript: 'O Cerebelo contém mais de metade de todos os neurônios do cérebro. Suas fólias delgadas e as células de Purkinje corrigem em milissegundos qualquer erro de execução motora.'
    },
    {
      id: 25,
      code: 'SPINAL_CERVICAL_THORACIC',
      estrutura: 'Medula Espinhal Cervical e Torácica (C1–T12)',
      name: 'Medula Espinhal Cervical e Torácica (C1–T12)',
      latinName: 'Medulla spinalis pars cervicalis et thoracica',
      uberonId: 'UBERON:0002240',
      categoria: 'MEDULA ESPINHAL',
      category: 'MEDULA ESPINHAL',
      escala: 'Neuroeixo Medular (Meso: ~130 mm)',
      tier: 'MESO',
      coordenadas: [0.00, -10.00, -0.85],
      center: [0.00, -10.00, -0.85],
      mniCenter: [0.00, -10.00, -0.85],
      optimalDist: 13.0,
      color: '#10b981',
      descricao: 'Coluna neural cilíndrica contínua protegida no canal vertebral; apresenta a intumescência cervical (C4–T1) com substância cinzenta em H.',
      funcoes: [
        'Condução somatotópica de tratos motores piramidais descendentes',
        'Condução ascendente de dor, tato e temperatura (fascículos grácil/cuneiforme e espinotalâmicos)',
        'Arco reflexo miotático espinhal involuntário rápido',
        'Controle autônomo simpático nos cornos laterais torácicos (T1–L2)'
      ],
      conexoes: [
        'Tronco Encefálico superiormente',
        'Nervos Espinhais Cervicais e Torácicos',
        'Plexo Braquial para inervação dos membros superiores'
      ],
      vascularizacao: 'Artéria Espinhal Anterior única (dois terços anteriores) e duas Artérias Espinhais Posteriores',
      neurotransmissores: ['L-Glutamato axonal', 'GABA / Glicina nos interneurônios inibitórios espinhais', 'Acetilcolina'],
      doencas: ['Tetraplegia Traumática', 'Esclerose Múltipla Medular', 'Siringomielia', 'Mielite Transversa', 'ELA'],
      doi: '10.1037/11296-000',
      citacao: 'Cajal (1909) Histologie du Système Nerveux / Standring (2020)',
      audioScript: 'A Medula Espinhal Cervical e Torácica estende-se como a rodovia elétrica primordial do organismo, apresentando a intumescência cervical para o controle refinado das mãos.'
    },
    {
      id: 26,
      code: 'SPINAL_LUMBAR_CAUDA',
      estrutura: 'Medula Espinhal Lombossacral, Cone Medular e Cauda Equina',
      name: 'Medula Espinhal Lombossacral, Cone Medular e Cauda Equina',
      latinName: 'Conus medullaris et Cauda equina',
      uberonId: 'UBERON:0005856',
      categoria: 'MEDULA ESPINHAL',
      category: 'MEDULA ESPINHAL',
      escala: 'Terminação Medular (Meso: ~140 mm)',
      tier: 'MESO',
      coordenadas: [0.00, -17.50, -0.85],
      center: [0.00, -17.50, -0.85],
      mniCenter: [0.00, -17.50, -0.85],
      optimalDist: 14.0,
      color: '#059669',
      descricao: 'Intumescência lombar (L1–S1) que se afunila no cone medular ao nível vertebral L1/L2, prolongando-se nas raízes nervosas descendentes da cauda equina e filo terminal.',
      funcoes: [
        'Inervação motora voluntária e sensibilidade dos membros inferiores',
        'Centros medulares miccionais, defecatórios e da função sexual erétil (S2–S4)',
        'Amortecimento elástico do saco dural lombar'
      ],
      conexoes: [
        'Plexo Lombossacral (Nervos Femoral, Isquiático e Pudendo)',
        'Filo terminal conectando-se ao cóccix',
        'Cisterna Lombar (local para punção lombar do LCR)'
      ],
      vascularizacao: 'Artéria Radicular Magna de Adamkiewicz e ramos radiculares lombares',
      neurotransmissores: ['L-Glutamato', 'Acetilcolina', 'GABA'],
      doencas: ['Síndrome da Cauda Equina', 'Hérnia Discal Lombar com Ciatalgia', 'Paraplegia Espástica'],
      doi: '10.1097/00007632-198305000-00004',
      citacao: 'Adamkiewicz (1882) / Standring Gray’s Anatomy 42nd Ed.',
    },
    {
      id: 27,
      code: 'PNS_CERVICAL_PHRENIC',
      estrutura: 'SNP — Plexo Cervical (C1–C4) e Nervo Frênico (C3–C5)',
      name: 'SNP — Plexo Cervical (C1–C4) e Nervo Frênico (C3–C5)',
      latinName: 'Plexus cervicalis et Nervus phrenicus',
      uberonId: 'UBERON:0001813',
      categoria: 'SISTEMA NERVOSO PERIFÉRICO (SNP)',
      category: 'SISTEMA NERVOSO PERIFÉRICO (SNP)',
      escala: 'Plexo Periférico (~120 mm)',
      tier: 'MESO',
      coordenadas: [0.00, -8.20, -0.60],
      center: [0.00, -8.20, -0.60],
      mniCenter: [0.00, -8.20, -0.60],
      optimalDist: 11.5,
      color: '#fbbf24',
      descricao: 'Formado pelos ramos ventrais de C1 a C4; origina a alça cervical e o Nervo Frênico (C3, C4, C5), responsável único pelo comando motor do músculo diafragma.',
      funcoes: ['Inervação motora diafragmática (respiração automática e voluntária)', 'Sensibilidade cutânea cervical, auricular e supraclavicular', 'Inervação dos músculos infra-hióideos via alça cervical'],
      conexoes: ['Cornos anteriores de C3–C5', 'Pericárdio fibroso e pleura mediastinal', 'Músculo diafragma'],
      vascularizacao: 'Artéria Cervical Ascendente e Artéria Pericardicofrênica',
      neurotransmissores: ['Acetilcolina (placa motora nicotínica diafragmática)', 'Glutamato aferente'],
      doencas: ['Paralisia Diafragmática por Trauma Raquimedular Alto (C1–C4)', 'Soluço Intratável', 'Nevralgia Occipital'],
      doi: '10.1016/c2018-0-02220-4',
      citacao: 'Standring (2020) Gray’s Anatomy 42nd Ed.',
      audioScript: 'O Plexo Cervical emerge das raízes C1 a C4 e origina o Nervo Frênico, que desce pelo mediastino para comandar cada contração inspiratória do músculo diafragma.'
    },
    {
      id: 28,
      code: 'PNS_BRACHIAL_PLEXUS',
      estrutura: 'SNP — Plexo Braquial (C5–T1) e Nervos Mediano, Ulnar, Radial e Axilar',
      name: 'SNP — Plexo Braquial (C5–T1) e Nervos Mediano, Ulnar, Radial e Axilar',
      latinName: 'Plexus brachialis',
      uberonId: 'UBERON:0001814',
      categoria: 'SISTEMA NERVOSO PERIFÉRICO (SNP)',
      category: 'SISTEMA NERVOSO PERIFÉRICO (SNP)',
      escala: 'Plexo Periférico (~140 mm)',
      tier: 'MESO',
      coordenadas: [0.00, -9.80, -0.65],
      center: [0.00, -9.80, -0.65],
      mniCenter: [0.00, -9.80, -0.65],
      optimalDist: 12.5,
      color: '#f59e0b',
      descricao: 'Rede nervosa periférica organizada em Raízes (C5–T1), Troncos (Superior, Médio, Inferior), Divisões e Fascículos (Lateral, Medial, Posterior), originando os nervos do membro superior.',
      funcoes: ['Motricidade fina da mão e dedos (Nervos Mediano e Ulnar)', 'Extensão do braço, antebraço e punho (Nervo Radial)', 'Abdução do ombro (Nervo Axilar) e flexão do cotovelo (Nervo Musculocutâneo)'],
      conexoes: ['Intumescência cervical medular (C5–T1)', 'Gânglios da raiz dorsal C5–T1', 'Gânglio estrelado simpático'],
      vascularizacao: 'Artéria Subclávia e Artéria Axilar',
      neurotransmissores: ['Acetilcolina neuromuscular', 'Substância P e CGRP sensitivos'],
      doencas: ['Paralisia de Erb-Duchenne (C5–C6)', 'Paralisia de Klumpke (C8–T1)', 'Síndrome do Túnel do Carpo (Nervo Mediano)'],
      doi: '10.1016/c2018-0-02220-4',
      citacao: 'Moore & Dalley (2018) Anatomia Orientada para a Clínica',
      audioScript: 'O Plexo Braquial nasce na intumescência cervical entre C5 e T1, entrelaçando troncos e fascículos para formar os nervos Mediano, Ulnar, Radial, Musculocutâneo e Axilar que movem o braço e a mão.'
    },
    {
      id: 29,
      code: 'PNS_SYMPATHETIC_CHAIN',
      estrutura: 'SNP Autônomo — Cadeia Ganglionar Simpática Paravertebral e Nervos Intercostais (T1–L2)',
      name: 'SNP Autônomo — Cadeia Ganglionar Simpática Paravertebral e Nervos Intercostais (T1–L2)',
      latinName: 'Truncus sympathicus et Nervi intercostales',
      uberonId: 'UBERON:0001809',
      categoria: 'SISTEMA NERVOSO PERIFÉRICO (SNP)',
      category: 'SISTEMA NERVOSO PERIFÉRICO (SNP)',
      escala: 'Eixo Autonômico (~160 mm)',
      tier: 'MESO',
      coordenadas: [0.00, -13.20, -0.50],
      center: [0.00, -13.20, -0.50],
      mniCenter: [0.00, -13.20, -0.50],
      optimalDist: 13.5,
      color: '#fb923c',
      descricao: 'Dupla cadeia bilateral de gânglios simpáticos paravertebrais interligados aos ramos ventrais torácicos por ramos comunicantes brancos (pré-ganglionares mielinizados) e cinzentos (pós-ganglionares).',
      funcoes: ['Resposta autonômica de luta ou fuga (taquicardia, broncodilatação, midríase)', 'Controle vasomotor sistêmico e sudorese', 'Inervação sensitivo-motora da parede torácica pelos 12 pares de Nervos Intercostais'],
      conexoes: ['Coluna intermédio-lateral da medula (T1–L2)', 'Nervos esplâncnicos torácicos e medula adrenal'],
      vascularizacao: 'Artérias Intercostais Posteriores',
      neurotransmissores: ['Acetilcolina (sinapse pré-ganglionar nicotínica)', 'Noradrenalina (fibra pós-ganglionar adrenérgica)'],
      doencas: ['Síndrome de Horner (lesão simpática T1/gânglio estrelado)', 'Neuralgia Pós-Herpética Intercostal', 'Disautonomia'],
      doi: '10.1036/0838577016',
      citacao: 'Kandel et al. (2021) / Guyton & Hall (2020)',
      audioScript: 'Ao longo de toda a coluna torácica, a Cadeia Ganglionar Simpática Paravertebral recebe fibras da coluna lateral da medula e distribui noradrenalina para acelerar o coração e preparar o corpo para ação.'
    },
    {
      id: 30,
      code: 'PNS_VAGUS_PARASYMPATHETIC',
      estrutura: 'SNP Autônomo — Nervo Vago (NC X) e Eixo Parassimpático Cranio-Sacral',
      name: 'SNP Autônomo — Nervo Vago (NC X) e Eixo Parassimpático Cranio-Sacral',
      latinName: 'Nervus vagus (X) et Systema parasympathicum',
      uberonId: 'UBERON:0001759',
      categoria: 'SISTEMA NERVOSO PERIFÉRICO (SNP)',
      category: 'SISTEMA NERVOSO PERIFÉRICO (SNP)',
      escala: 'Eixo Visceral (~160 mm)',
      tier: 'MESO',
      coordenadas: [0.00, -10.50, +0.20],
      center: [0.00, -10.50, +0.20],
      mniCenter: [0.00, -10.50, +0.20],
      optimalDist: 13.0,
      color: '#34d399',
      descricao: 'Principal via parassimpática do organismo; emerge do sulco posterolateral do bulbo (núcleo dorsal do vago e núcleo ambíguo) e desce pelo pescoço, tórax e abdome.',
      funcoes: ['Redução da frequência cardíaca (reflexo vagal bradicárdico)', 'Estímulo do peristaltismo e secreção digestiva (eixo intestino-cérebro)', 'Reflexo inflamatório colinérgico e fonação laríngea'],
      conexoes: ['Núcleo do Trato Solitário, Núcleo Ambíguo e Núcleo Motor Dorsal no Bulbo', 'Plexos Cardíaco, Pulmonar e Entérico de Auerbach/Meissner'],
      vascularizacao: 'Bainha Carotídea e Artérias Bronquiais/Esofágicas',
      neurotransmissores: ['Acetilcolina (receptores muscarínicos M2 cardíacos e M3 viscerais)'],
      doencas: ['Síncope Vasovagal', 'Gastroparesia Vagal', 'Rouquidão por Paralisia do Nervo Laríngeo Recorrente'],
      doi: '10.1036/0838577016',
      citacao: 'Standring (2020) / Berthoud & Neuhuber (2000)',
      audioScript: 'O Nervo Vago é o grande maestro do sistema parassimpático. Emergindo do bulbo, ele viaja até o coração, pulmões e trato gastrointestinal para promover repouso, digestão e equilíbrio homeostático.'
    },
    {
      id: 31,
      code: 'PNS_LUMBOSACRAL_SCIATIC',
      estrutura: 'SNP — Plexo Lombossacral (L1–S4), Nervo Femoral e Grande Nervo Ciático (Isquiático)',
      name: 'SNP — Plexo Lombossacral (L1–S4), Nervo Femoral e Grande Nervo Ciático (Isquiático)',
      latinName: 'Plexus lumbosacralis et Nervus ischiadicus',
      uberonId: 'UBERON:0001815',
      categoria: 'SISTEMA NERVOSO PERIFÉRICO (SNP)',
      category: 'SISTEMA NERVOSO PERIFÉRICO (SNP)',
      escala: 'Plexo Periférico (~165 mm)',
      tier: 'MESO',
      coordenadas: [0.00, -19.50, -0.60],
      center: [0.00, -19.50, -0.60],
      mniCenter: [0.00, -19.50, -0.60],
      optimalDist: 14.5,
      color: '#eab308',
      descricao: 'União dos plexos lombar (L1–L4, originando os nervos Femoral e Obturatório) e sacral (L4–S4, originando o Nervo Ciático — o maior e mais calibroso nervo periférico do corpo humano).',
      funcoes: ['Extensão do joelho e flexão do quadril pelo Nervo Femoral (L2–L4)', 'Flexão do joelho, dorsiflexão e flexão plantar do pé pelo Nervo Ciático (Tibial e Fibular Comum)', 'Sensibilidade de todo o membro inferior e períneo (Nervo Pudendo S2–S4)'],
      conexoes: ['Intumescência lombossacral e raízes da Cauda Equina', 'Forame isquiático maior e fossa poplítea'],
      vascularizacao: 'Artéria Glútea Inferior (artéria satélite do nervo ciático) e Artéria Ilíaca Interna',
      neurotransmissores: ['Acetilcolina motora somática', 'Glutamato e Substância P aferentes'],
      doencas: ['Ciatalgia por Hérnia de Disco L4–L5 ou L5–S1', 'Síndrome do Piriforme', 'Pé Caído por Lesão do Nervo Fibular Comum'],
      doi: '10.1016/c2018-0-02220-4',
      citacao: 'Standring (2020) Gray’s Anatomy 42nd Ed.',
      audioScript: 'Da região lombossacral e da cauda equina emergem o Nervo Femoral e o imponente Nervo Ciático — o mais longo e calibroso nervo do corpo humano, responsável pela marcha, postura e sensibilidade das pernas.'
    }
  ];

  // [PT-BR]: Registro dos 9 Circuitos e Vias de Tractografia Real 3D.
  // [EN-GB]: Registry of the 9 Real 3D Tractography Circuits and Pathways.
  const TRACTOGRAPHY_CIRCUITS_DATABASE = [
    {
      id: 'CORTICOSPINAL',
      nome: 'Via Corticoespinhal (Trato Piramidal)',
      name: 'Corticospinal Pathway (Pyramidal Tract)',
      color: '#f43f5e',
      categoria: 'MOTOR',
      descricao: 'Principal via descendente da motricidade voluntária fracionada, descendo do Córtex Motor M1 (BA 4) através da cápsula interna, pedúnculos cerebrais, ponte e pirâmides bulbares (onde 85-90% das fibras decussam) até a medula espinhal.',
      origem: 'Córtex Motor Primário M1 (Células de Betz)',
      termino: 'Cornos anteriores da medula espinhal (Motoneurônios alfa)',
      decussacao: 'Decussação das pirâmides no bulbo inferior',
      velocidade: 110, // m/s
      frequenciaNormal: 40, // Hz
      funcao: 'Comando voluntário dos movimentos distais dos dedos, mãos e pés',
      doencas: ['AVC Isquêmico de ACM', 'Esclerose Lateral Amiotrófica (ELA)', 'Trauma Raquimedular'],
      roiPath: [
        [+3.79, +3.80, +0.43],
        [+2.05, +1.20, +0.25],
        [+1.20, -1.20, -0.10],
        [+0.75, -2.55, -0.65],
        [0.0, -4.10, -0.45],
        [0.0, -5.85, -0.65],
        [-0.35, -6.40, -0.75],
        [-0.35, -10.00, -0.85],
        [-0.35, -17.00, -0.85]
      ]
    },
    {
      id: 'ARCUATE',
      nome: 'Fascículo Arqueado (Circuito da Linguagem)',
      name: 'Arcuate Fasciculus (Language Circuit)',
      color: '#06b6d4',
      categoria: 'LINGUAGEM / ASSOCIAÇÃO',
      descricao: 'Arco de substância branca conectando a compreensão da linguagem na Área de Wernicke e giro temporal superior à programação motora da fala na Área de Broca através do lobo parietal inferior.',
      origem: 'Área de Wernicke (BA 22, Lobo Temporal Superior Esquerdo)',
      termino: 'Área de Broca (BA 44/45, Giro Frontal Inferior Esquerdo)',
      decussacao: 'Ipsilateral (estritamente hemisfério esquerdo dominante)',
      velocidade: 85,
      frequenciaNormal: 35,
      funcao: 'Repetição fonológica, sintaxe e integração léxico-articulatória',
      doencas: ['Afasia de Condução', 'Afasia de Broca', 'Afasia de Wernicke'],
      roiPath: [
        [+4.89, -0.29, -1.41],
        [+4.20, +1.80, -1.80],
        [+3.60, +3.50, -1.00],
        [+4.00, +2.20, +1.20],
        [+4.62, +0.50, +2.39]
      ]
    },
    {
      id: 'VISUAL',
      nome: 'Via Visual (Radiações Ópticas de Gratiolet)',
      name: 'Visual Pathway (Optic Radiations of Gratiolet)',
      color: '#8b5cf6',
      categoria: 'SENSORIAL ESPECIAL',
      descricao: 'Trajeto visual dos corpos geniculados laterais do tálamo até os lábios do sulco calcarino (V1/BA 17), incluindo a alça de Meyer que contorna o corno temporal do ventrículo lateral.',
      origem: 'Corpo Geniculado Lateral (CGL) do Tálamo',
      termino: 'Córtex Visual Primário V1 (Sulco Calcarino Occipital)',
      decussacao: 'Quiasma Óptico (fibras nasais cruzadas, temporais ipsilaterais)',
      velocidade: 95,
      frequenciaNormal: 60,
      funcao: 'Mapeamento retinotópico consciente de alta resolução espacial e cores',
      doencas: ['Hemianopsia Homônima Contralateral', 'Quadrantanopsia Superior (lesão de Meyer)', 'Neurite Óptica'],
      roiPath: [
        [+1.40, -1.40, +1.45],
        [+1.85, -0.80, -0.60],
        [+2.60, -1.40, -1.80],
        [+2.20, -0.80, -4.20],
        [+1.70, -1.18, -6.37]
      ]
    },
    {
      id: 'AUDITORY',
      nome: 'Via Auditiva (Lemnisco Lateral e Radiação Acústica)',
      name: 'Auditory Pathway (Lateral Lemniscus & Acoustic Radiation)',
      color: '#14b8a6',
      categoria: 'SENSORIAL ESPECIAL',
      descricao: 'Via ascendente bilateral dos núcleos cocleares bulbares, passando pelo complexo olivar superior, lemnisco lateral na ponte, colículo inferior no mesencéfalo e corpo geniculado medial até Heschl (A1).',
      origem: 'Núcleos Cocleares (Bulbo/Ponte)',
      termino: 'Córtex Auditivo Primário A1 (Giros de Heschl, BA 41/42)',
      decussacao: 'Corpo Trapezoide na ponte (bilateralidade com dominância contralateral)',
      velocidade: 90,
      frequenciaNormal: 50,
      funcao: 'Discriminação tonotópica e localização binaural de fontes acústicas',
      doencas: ['Agnosia Auditiva Cortical', 'Zumbido / Tinnitus Central', 'Surdez Central'],
      roiPath: [
        [+1.20, -4.80, -0.50],
        [+0.90, -3.80, -0.30],
        [+0.60, -2.60, -0.80],
        [+1.40, -1.20, -1.00],
        [+4.76, -0.86, -0.12]
      ]
    },
    {
      id: 'PAPEZ',
      nome: 'Circuito de Papez (Circuito Límbico da Memória)',
      name: 'Papez Circuit (Limbic Memory Circuit)',
      color: '#fbbf24',
      categoria: 'LÍMBICO / MEMÓRIA',
      descricao: 'Circuito neural clássico da consolidação da memória episódica: Hipocampo -> Fórnix -> Corpos Mamilares -> Trato Mamilotalâmico de Vicq d\'Azyr -> Núcleo Talâmico Anterior -> Córtex Cingulado -> Córtex Entorrinal -> Hipocampo.',
      origem: 'Hipocampo (Subículo e CA1–CA4)',
      termino: 'Giro Parahipocampal e Hipocampo (circuito fechado)',
      decussacao: 'Comissura do Fórnix (conexão parcial bilateral)',
      velocidade: 60,
      frequenciaNormal: 8, // Ritmo Theta 4-8 Hz
      funcao: 'Consolidação de novas memórias declarativas e processamento emocional',
      doencas: ['Doença de Alzheimer', 'Síndrome de Korsakoff (necrose mamilar)', 'Amnésia Anterógrada'],
      roiPath: [
        [+2.45, -1.85, -1.10],
        [+0.85, -0.45, -2.50],
        [+0.20, -1.20, +0.20],
        [+0.40, -0.80, -0.40],
        [+0.60, +1.40, -1.00],
        [+1.20, +1.80, +0.80],
        [+2.20, -1.20, -1.40],
        [+2.45, -1.85, -1.10]
      ]
    },
    {
      id: 'NIGROSTRIATAL',
      nome: 'Via Nigroestriatal (Dopamina Motora)',
      name: 'Nigrostriatal Pathway (Motor Dopamine)',
      color: '#eab308',
      categoria: 'MOTORA EXTRAPIRAMIDAL',
      descricao: 'Projeção dos neurônios dopaminérgicos pigmentados da Substância Negra Pars Compacta (SNc) no mesencéfalo para o Putâmen e Núcleo Caudado (Corpo Estriado), modulando as vias direta e indireta dos gânglios da base.',
      origem: 'Substância Negra Pars Compacta (Mesencéfalo)',
      termino: 'Corpo Estriado (Putâmen e Núcleo Caudado)',
      decussacao: 'Ipsilateral predominante',
      velocidade: 45,
      frequenciaNormal: 20,
      funcao: 'Iniciação e fluidez cinética de movimentos voluntários sem rigidez',
      doencas: ['Doença de Parkinson (degeneração >70% dos axônios nigrais)', 'Parkinsonismo Farmacológico'],
      roiPath: [
        [+0.75, -2.55, -0.65],
        [+1.10, -1.40, +0.20],
        [+1.50, -0.40, +0.60],
        [+1.85, +0.20, +0.85]
      ]
    },
    {
      id: 'MESOLIMBIC',
      nome: 'Via Mesolímbica (Dopamina de Recompensa)',
      name: 'Mesolimbic Pathway (Reward Dopamine)',
      color: '#f97316',
      categoria: 'RECOMPENSA / MOTIVAÇÃO',
      descricao: 'Projeção dos neurônios da Área Tegmentar Ventral (VTA) para o Núcleo Accumbens, Tubérculo Olfatório e Amígdala.',
      origem: 'Área Tegmentar Ventral (VTA, Mesencéfalo)',
      termino: 'Núcleo Accumbens e Complexo Amigdalino',
      decussacao: 'Ipsilateral',
      velocidade: 40,
      frequenciaNormal: 15,
      funcao: 'Salência motivacional, expectativa de recompensa e aprendizado por reforço',
      doencas: ['Adição a Drogas', 'Sintomas Positivos da Esquizofrenia', 'Depressão / Anedonia'],
      roiPath: [
        [+0.25, -2.40, -0.40],
        [+0.60, -1.60, +0.40],
        [+1.00, -0.80, +1.20],
        [+1.20, -0.20, +1.80]
      ]
    },
    {
      id: 'MESOCORTICAL',
      nome: 'Via Mesocortical (Dopamina Cognitiva)',
      name: 'Mesocortical Pathway (Cognitive Dopamine)',
      color: '#10b981',
      categoria: 'COGNIÇÃO SUPERIOR',
      descricao: 'Projeção da Área Tegmentar Ventral para o Córtex Pré-Frontal Dorsolateral (DLPFC) e Ventromedial.',
      origem: 'Área Tegmentar Ventral (VTA)',
      termino: 'Córtex Pré-Frontal (BA 9/46 e BA 10)',
      decussacao: 'Ipsilateral',
      velocidade: 42,
      frequenciaNormal: 18,
      funcao: 'Atenção sustentada, flexibilidade cognitiva e memória de trabalho operacional',
      doencas: ['TDAH', 'Sintomas Negativos e Cognitivos da Esquizofrenia', 'Apatia'],
      roiPath: [
        [+0.25, -2.40, -0.40],
        [+0.80, -1.20, +0.80],
        [+1.80, +0.40, +2.80],
        [+3.04, +1.86, +4.72]
      ]
    },
    {
      id: 'SEROTONERGIC',
      nome: 'Vias Serotoninérgicas (Núcleos da Rafe)',
      name: 'Serotonergic Pathways (Raphe Nuclei)',
      color: '#f43f5e',
      categoria: 'MODULAÇÃO GLOBAL',
      descricao: 'Sistema difuso dos Núcleos Dorsal e Mediano da Rafe no mesencéfalo e ponte, projetando amplamente para o tálamo, sistema límbico, córtex e medula espinhal.',
      origem: 'Núcleos da Rafe (Mesencéfalo, Ponte e Bulbo)',
      termino: 'Córtex Cerebral, Tálamo, Sistema Límbico e Cornos Dorsais da Medula',
      decussacao: 'Projeções bilaterais difusas',
      velocidade: 35,
      frequenciaNormal: 5,
      funcao: 'Modulação de humor, ciclo sono-vigília, saciedade e inibição da dor espinhal',
      doencas: ['Depressão Maior', 'Transtorno de Ansiedade Generalizada', 'Transtorno Bipolar', 'Dor Crônica'],
      roiPath: [
        [0.0, -3.20, -0.80],
        [+0.40, -1.80, -0.60],
        [+1.20, -0.60, +0.20],
        [+2.00, +0.80, +2.00],
        [+2.60, +2.40, +3.50]
      ]
    }
  ];

  // [PT-BR]: Registro dos 4 Tipos Celulares da Glia com propriedades biológicas completas.
  // [EN-GB]: Registry of the 4 Glia Cell Types with complete biological properties.
  const GLIA_CELLS_DATABASE = [
    {
      id: 'ASTROCYTE',
      nome: 'Astrócito (Protoplasmático e Fibroso)',
      name: 'Astrocyte (Protoplasmic & Fibrous)',
      color: '#38bdf8',
      descricao: 'Células gliais em formato estrelado que abraçam os capilares cerebrais com seus pés vasculares (Barreira Hematoencefálica) e envolvem sinapses para formar a Sinapse Tripartite.',
      marcadores: ['GFAP', 'ALDH1L1', 'Aquaporina-4 (AQP4)', 'GLT-1 / EAAT2'],
      funcoes: [
        'Manutenção da Barreira Hematoencefálica (BHE) via pés perivasculares',
        'Captação e reciclagem rápida de L-Glutamato extracelular (ciclo glutamato-glutamina)',
        'Tamponamento de íons potássio (K+) no espaço intersticial para evitar hiperexcitabilidade',
        'Acoplamento neurovascular (hiperemia funcional por liberação de vasodilatadores)'
      ],
      papelPatologias: 'Astrogliose reativa pronunciada com cicatriz glial em AVC, Alzheimer, Parkinson e infecções do SNC.',
      densidadeTipica: '20% a 40% de todas as células gliais corticais'
    },
    {
      id: 'OLIGODENDROCYTE',
      nome: 'Oligodendrócito (Célula Produtora de Mielina no SNC)',
      name: 'Oligodendrocyte (CNS Myelin-Forming Cell)',
      color: '#34d399',
      descricao: 'Célula glial com corpo pequeno que estende de 15 a 40 prolongamentos citoplasmáticos, cada um enrolando-se em espiral para formar um internódio de bainha de mielina rica em lipídios.',
      marcadores: ['MBP (Proteína Básica de Mielina)', 'PLP', 'Olig2', 'MOG'],
      funcoes: [
        'Formação das bainhas isolantes de mielina ao redor dos axônios do SNC',
        'Permissão da condução saltatória de alta velocidade nos Nódulos de Ranvier',
        'Suporte trófico e energético aos axônios via transporte de lactato por monocarboxilatos'
      ],
      papelPatologias: 'Alvo primário do ataque autoimune na Esclerose Múltipla, gerando desmielinização e bloqueio de condução axonal.',
      densidadeTipica: 'Mais abundante na substância branca (~70% das células gliais do corpo caloso)'
    },
    {
      id: 'MICROGLIA',
      nome: 'Micróglia (Célula Imunológica Residente do SNC)',
      name: 'Microglia (Resident Immune Macrophage of the CNS)',
      color: '#f59e0b',
      descricao: 'Macrófagos residentes derivados do saco vitelino mesodérmico embrionário. Em estado de repouso ("vigilante"), possuem ramos finos e móveis inspecionando o parênquima; ao detectar lesão, transformam-se no fenótipo ameboide fagocítico ativado.',
      marcadores: ['Iba1', 'CD68', 'TMEM119', 'CX3CR1'],
      funcoes: [
        'Vigilância imunológica constante do neuropilo contra patógenos e agregados proteicos',
        'Poda sináptica fisiológica (synaptic pruning) orientada pelo sistema complemento (C1q/C3)',
        'Fagocitose ativa de detritos celulares, placas de beta-amiloide e neurônios apoptóticos',
        'Liberação de citocinas pró-inflamatórias (IL-1β, TNF-α) ou fatores neuroprotetores (BDNF, TGF-β)'
      ],
      papelPatologias: 'Microgliose crônica hiperativada acelera neurodegeneração no Alzheimer, ELA, Parkinson e AVC isquêmico.',
      densidadeTipica: '10% a 15% de todas as células do SNC'
    },
    {
      id: 'EPENDYMAL',
      nome: 'Células Ependimárias (Epêndima Ciliado Ventricular)',
      name: 'Ependymal Cells (Ventricular Ciliated Ependyma)',
      color: '#c084fc',
      descricao: 'Células epiteliais cuboides ou colunares ciliadas que revestem os quatro ventrículos encefálicos e o canal central da medula espinhal, em contato direto com o líquor (LCR).',
      marcadores: ['Vimentina', 'S100B', 'CD133', 'Foxj1'],
      funcoes: [
        'Batimento ciliar síncrono coordenado gerando corrente unidirecional de fluxo de LCR',
        'Filtro seletivo e barreira de difusão entre o parênquima cerebral e o líquido cefalorraquidiano',
        'Participação na drenagem glinfática de escórias e proteínas maldobradas'
      ],
      papelPatologias: 'Disfunção ciliar ependimária resulta em hidrocefalia congênita obstrutiva e estagnação de fluxo liquórico.',
      densidadeTipica: 'Camada única contínua revestindo todas as cavidades ventriculares'
    }
  ];

  // [PT-BR]: Registro do Catálogo de 7 Patologias Clínicas e Fisiopatológicas.
  // [EN-GB]: Registry of the 7 Clinical & Pathophysiological Pathologies Catalog.
  const PATHOLOGY_EXTENDED_CATALOG = {
    NORMAL: {
      id: 'NORMAL',
      name: 'Fisiologia Normal do SNC (SNC Hígido)',
      badge: 'HIGIDO (40 Hz)',
      badgeClass: 'emerald',
      macroDescription: 'Encéfalo e Medula íntegros, sulcos e giros bem delineados, ventrículos com volume normotenso (LCR claro).',
      microDescription: 'Potenciais de ação regulares em 40 Hz (ritmo gama), condução saltatória íntegra nas bainhas de mielina, sinapses equilibradas e astrócitos homeostáticos.',
      affectedStructures: ['Sistema Nervoso Central Completo'],
      primaryNeurotransmitter: 'Glutamato e GABA em homeostase estequiométrica',
      biomarkers: {
        prpc: '100%',
        prpsc: '0.00',
        vacuoles: '0.0%',
        tau: '180 pg/mL',
        p1433: '0.40 ng/mL',
        abeta: '1200 pg/mL',
        csfFlow: '32.4 mm/s',
        rtquic: 'NEGATIVO',
        vmRest: '-70.0 mV',
        conductionSpeed: '110 m/s'
      },
      audioScript: 'Você está observando o Sistema Nervoso Central Hígido. A condução saltatória nos tratos corticoespinhais flui em alta velocidade, e a síntese de neurotransmissores mantém a homeostase sináptica perfeita.'
    },
    ALZHEIMER: {
      id: 'ALZHEIMER',
      name: 'Doença de Alzheimer (DA)',
      badge: 'DEMÊNCIA NEURODEGENERATIVA',
      badgeClass: 'purple',
      macroDescription: 'Atrofia cortical difusa acentuada no Hipocampo, Córtex Entorrinal e Lobo Temporoparietal, com dilatação dos ventrículos laterais (hidrocefalia ex-vacuo).',
      microDescription: 'Deposição extracelular de Placas Senis de Beta-Amiloide (Aβ42) + Emaranhados Neurofibrilares de Proteína Tau Hiperfosforilada colapsando microtúbulos, perda maciça de espinhas dendríticas e colapso colinérgico.',
      affectedStructures: ['Hipocampo (CA1-CA4)', 'Córtex Entorrinal', 'Núcleo Basal de Meynert', 'Lobo Temporal'],
      primaryNeurotransmitter: 'Queda severa de Acetilcolina (ACh) nas sinapses córtico-hipocampais',
      biomarkers: {
        prpc: '98%',
        prpsc: '0.00',
        vacuoles: '5.2%',
        tau: '4850 pg/mL',
        p1433: '0.65 ng/mL',
        abeta: '240 pg/mL (Consumido nas placas)',
        csfFlow: '21.0 mm/s',
        rtquic: 'NEGATIVO',
        vmRest: '-64.5 mV',
        conductionSpeed: '82 m/s'
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
      affectedStructures: ['Substância Negra (SNc)', 'Corpo Estriado (Putâmen/Caudado)', 'Globo Pálido'],
      primaryNeurotransmitter: 'Déficit crítico de Dopamina (via nigroestriatal) com hiperatividade inibitória de GABA no Tálamo',
      biomarkers: {
        prpc: '100%',
        prpsc: '0.00',
        vacuoles: '2.0%',
        tau: '210 pg/mL',
        p1433: '0.45 ng/mL',
        abeta: '1150 pg/mL',
        csfFlow: '28.5 mm/s',
        rtquic: 'NEGATIVO',
        vmRest: '-68.0 mV',
        conductionSpeed: '94 m/s'
      },
      audioScript: 'Na Doença de Parkinson, a morte dos neurônios dopaminérgicos pigmentados da substância negra priva o corpo estriado de dopamina. O resultado clínico é o tremor em repouso de 4 a 6 hertz, rigidez e bradicinesia.'
    },
    MS: {
      id: 'MS',
      name: 'Esclerose Múltipla (EM / Desmielinização Autoimune)',
      badge: 'DOENÇA AUTOIMUNE DESMIELINIZANTE',
      badgeClass: 'blue',
      macroDescription: 'Placas desmielinizantes hiperintensas em substância branca periventricular (Dedos de Dawson), Nervo Óptico, Corpo Caloso, Tronco e Funículos da Medula Espinhal.',
      microDescription: 'Ataque autoimune mediado por linfócitos T autorreativos e micróglia que fagocitam os oligodendrócitos e removem as bainhas de mielina internodais, causando bloqueio da condução saltatória nos Nódulos de Ranvier.',
      affectedStructures: ['Medula Espinhal', 'Substância Branca Periventricular', 'Corpo Caloso', 'Nervo Óptico'],
      primaryNeurotransmitter: 'Bloqueio da condução saltatória nos Nódulos de Ranvier e influxo anormal de cálcio',
      biomarkers: {
        prpc: '99%',
        prpsc: '0.00',
        vacuoles: '4.5%',
        tau: '1250 pg/mL',
        p1433: '0.80 ng/mL',
        abeta: '1180 pg/mL',
        csfFlow: '29.0 mm/s',
        rtquic: 'NEGATIVO (Bandas Oligoclonais IgG Positivas no LCR)',
        vmRest: '-58.0 mV (Vazamento iônico)',
        conductionSpeed: '18 m/s (Bloqueio saltatório severo)'
      },
      audioScript: 'Na Esclerose Múltipla, o sistema imunológico ataca a mielina na substância branca e na medula espinhal. Sem as bainhas isolantes, os axônios nus sofrem bloqueio da condução elétrica saltatória.'
    },
    ALS: {
      id: 'ALS',
      name: 'Esclerose Lateral Amiotrófica (ELA)',
      badge: 'DEGENERAÇÃO DOS MOTONEURÔNIOS',
      badgeClass: 'danger',
      macroDescription: 'Atrofia severa do Giro Pré-Central M1 (BA 4) e dos cornos anteriores da medula espinhal, com afilamento acentuado das raízes nervosas motoras ventrais e do trato corticoespinhal lateral.',
      microDescription: 'Degeneração e morte simultânea de motoneurônios superiores (células piramidais de Betz) e motoneurônios inferiores (alfa espinhais), inclusões citoplasmáticas de TDP-43 hiperfosforilado, excitotoxicidade glutamatérgica por perda de GLT-1 astroglial e denervação neuromuscular.',
      affectedStructures: ['Córtex Motor M1 (Giro Pré-Central)', 'Trato Corticoespinhal Lateral', 'Cornos Anteriores da Medula Espinhal'],
      primaryNeurotransmitter: 'Excitotoxicidade por acúmulo de L-Glutamato extracelular e deficiência de recaptação astroglial',
      biomarkers: {
        prpc: '97%',
        prpsc: '0.00',
        vacuoles: '6.8%',
        tau: '2800 pg/mL',
        p1433: '1.10 ng/mL',
        abeta: '1100 pg/mL',
        csfFlow: '27.0 mm/s',
        rtquic: 'NEGATIVO (Neurofilamentos NfL extremamente elevados no LCR)',
        vmRest: '-62.0 mV',
        conductionSpeed: '42 m/s'
      },
      audioScript: 'Na Esclerose Lateral Amiotrófica, ocorre a morte inexorável dos neurônios motores superiores do córtex e inferiores da medula. O colapso do trato corticoespinhal impede o cérebro de comandar a musculatura esquelética.'
    },
    STROKE: {
      id: 'STROKE',
      name: 'Acidente Vascular Cerebral (AVC Isquêmico de ACM Esquerda)',
      badge: 'EMERGÊNCIA VASCULAR AGUDA',
      badgeClass: 'rose',
      macroDescription: 'Oclusão tromboembólica da Artéria Cerebral Média Esquerda, causando infarto isquêmico na Área de Broca, Giro Pré-Central M1 e Fascículo Arqueado (Core necrótico central e Área de Penumbra periférica recuperável).',
      microDescription: 'Falência imediata de síntese de ATP por anóxia, despolarização anóxica maciça, liberação descontrolada de L-Glutamato, influxo letal de íons Cálcio (Ca2+) via canais NMDA, edema celular citotóxico e necrose celular irreversível.',
      affectedStructures: ['Área de Broca (BA 44/45)', 'Córtex Motor M1', 'Fascículo Arqueado', 'Ínsula Esquerda'],
      primaryNeurotransmitter: 'Excesso tóxico agudo de L-Glutamato extracelular (excitotoxicidade maciça)',
      biomarkers: {
        prpc: '95%',
        prpsc: '0.00',
        vacuoles: '18.5%',
        tau: '6200 pg/mL',
        p1433: '1.20 ng/mL',
        abeta: '1050 pg/mL',
        csfFlow: '14.2 mm/s',
        rtquic: 'NEGATIVO',
        vmRest: '-15.0 mV (Despolarização anóxica completa no Core)',
        conductionSpeed: '0 m/s (Bloqueio elétrico isquêmico total)'
      },
      audioScript: 'No Acidente Vascular Cerebral Isquêmico da artéria cerebral média esquerda, a interrupção do oxigênio causa falência energética imediata. A liberação maciça de glutamato gera excitotoxicidade por influxo de cálcio, matando o núcleo isquêmico.'
    },
    EPILEPSY: {
      id: 'EPILEPSY',
      name: 'Epilepsia (Crise Focal com Generalização Bilateral)',
      badge: 'HIPERSSINCRONIZAÇÃO PAROXÍSTICA',
      badgeClass: 'gold',
      macroDescription: 'Foco epileptogênico hiperativo no Hipocampo e Lobo Temporal Mesial, com rápida propagação através do Fórnix e Corpo Caloso descarregando bilateralmente em todo o manto cortical.',
      microDescription: 'Mudança de despolarização paroxística (PDS), falência aguda dos interneurônios inibitórios GABAérgicos, recrutamento sináptico síncrono maciço em alta frequência (>150 Hz), hiperativação de receptores NMDA/AMPA e esgotamento metabólico neuronal.',
      affectedStructures: ['Hipocampo (Corno de Amon)', 'Córtex Temporal e Frontal', 'Corpo Caloso', 'Tálamo'],
      primaryNeurotransmitter: 'Hiperatividade glutamatérgica sincrônica descontrolada com colapso inibitório de GABA',
      biomarkers: {
        prpc: '100%',
        prpsc: '0.00',
        vacuoles: '3.0%',
        tau: '520 pg/mL',
        p1433: '0.70 ng/mL',
        abeta: '1190 pg/mL',
        csfFlow: '31.0 mm/s',
        rtquic: 'NEGATIVO',
        vmRest: '-48.0 mV (Despolarização paroxística contínua)',
        conductionSpeed: '125 m/s (Descargas de alta frequência)'
      },
      audioScript: 'Na crise de Epilepsia, a perda do freio inibitório do GABA gera uma tempestade elétrica síncrona. Milhões de neurônios disparam simultaneamente em alta frequência, propagando descargas pelo corpo caloso.'
    },
    CJD: {
      id: 'CJD',
      name: 'Doença de Creutzfeldt-Jakob (DCJ — Encefalopatia Priônica)',
      badge: 'ENCEFALOPATIA ESPONGIFORME',
      badgeClass: 'danger',
      macroDescription: 'Atrofia cortical e cerebelar fulminante, degeneração espongiforme com "Sinal do Taco de Hóquei" no Tálamo Pulvinar e fita cortical hiperintensa (Cortical Ribboning) na ressonância magnética por difusão.',
      microDescription: 'Conversão conformacional em cascata de PrPC (alfa-hélice) em PrPSc (folha-beta insolúvel), formação de placas priônicas amiloides, vacúolos intracelulares que conferem aspecto esponjoso ao parênquima e apoptose neuronal massiva.',
      affectedStructures: ['Tálamo Pulvinar', 'Corpo Estriado', 'Córtex Cerebral MNI152', 'Cerebelo'],
      primaryNeurotransmitter: 'Colapso polissináptico total com liberação de proteínas neurodegenerativas intracelulares',
      biomarkers: {
        prpc: '8%',
        prpsc: '9.45',
        vacuoles: '84.0%',
        tau: '18500 pg/mL',
        p1433: '8.50 ng/mL',
        abeta: '890 pg/mL',
        csfFlow: '8.4 mm/s',
        rtquic: 'POSITIVO (Agregação Priônica Reativa no LCR)',
        vmRest: '-40.0 mV',
        conductionSpeed: '30 m/s'
      },
      audioScript: 'A Doença de Creutzfeldt-Jakob é a mais rápida e letal encefalopatia humana. Príons PrPSc forçam a proteína normal PrPC a se desdobrar em folhas beta infecciosas, transformando o cérebro numa esponja de vacúolos microscópicos.'
    }
  };

  // [PT-BR]: Sistema de Escalas Contínuas (9 Níveis Biológicos).
  // [EN-GB]: Continuous Scale System (9 Biological Tiers).
  const MULTISCALE_TIERS = [
    {
      id: 1,
      code: 'TIER_1_WHOLE_CNS',
      name: 'SNC Inteiro (Whole CNS)',
      rangeMm: [450, 200],
      cameraDist: 220,
      cameraTarget: [0, -2.5, 0],
      cameraPos: [0, 3.5, 24.0],
      description: 'Visão integral do Sistema Nervoso Central: Encéfalo MNI152, Tronco Encefálico, Cerebelo e Medula Espinhal até a cauda equina.'
    },
    {
      id: 2,
      code: 'TIER_2_BRAIN',
      name: 'Encéfalo (Encephalon)',
      rangeMm: [200, 130],
      cameraDist: 150,
      cameraTarget: [0, 0.5, 0],
      cameraPos: [3.5, 2.0, 15.0],
      description: 'Hemisférios cerebrais direito e esquerdo, sulco inter-hemisférico e lobos superficiais.'
    },
    {
      id: 3,
      code: 'TIER_3_LOBE',
      name: 'Lobo Cerebral (Cerebral Lobe)',
      rangeMm: [130, 75],
      cameraDist: 95,
      cameraTarget: [2.5, 1.0, 1.5],
      cameraPos: [4.5, 1.8, 9.5],
      description: 'Lobos Frontal, Parietal, Temporal, Occipital, Límbico e Ínsula com vascularização das artérias cerebrais.'
    },
    {
      id: 4,
      code: 'TIER_4_GYRUS',
      name: 'Giro & Sulco Cortical (Gyrus & Sulcus)',
      rangeMm: [75, 35],
      cameraDist: 55,
      cameraTarget: [3.79, 3.80, 0.43],
      cameraPos: [4.2, 4.0, 5.5],
      description: 'Giros e sulcos anatômicos MNI152; transição de transparência cortical revelando estruturas subcorticais.'
    },
    {
      id: 5,
      code: 'TIER_5_COLUMN',
      name: 'Coluna Cortical (Cortical Column)',
      rangeMm: [35, 18],
      cameraDist: 28,
      cameraTarget: [0, 0, 0],
      cameraPos: [0, 4, 28],
      description: 'Minicolunas verticais de Mountcastle (~300–500 μm de diâmetro) contendo ~10.000 neurônios densamente interligados.'
    },
    {
      id: 6,
      code: 'TIER_6_LAYER',
      name: 'Camada Cortical V (Layer V Neuropil)',
      rangeMm: [18, 8],
      cameraDist: 15,
      cameraTarget: [0, 0, 0],
      cameraPos: [0, 2, 15],
      description: 'Camada piramidal interna com grandes neurônios de Betz, neuropilo denso, astrócitos e leito microcapilar.'
    },
    {
      id: 7,
      code: 'TIER_7_NEURON',
      name: 'Neurônio Individual (Pyramidal Neuron)',
      rangeMm: [8, 2.5],
      cameraDist: 6,
      cameraTarget: [0, 0, 0],
      cameraPos: [0, 1, 6],
      description: 'Morfologia celular completa: soma orgânico, núcleo DAPI, nucléolo, dendritos fractais, espinhas, axônio, mielina e nódulos de Ranvier.'
    },
    {
      id: 8,
      code: 'TIER_8_SYNAPSE',
      name: 'Sinapse & Fenda Sináptica (Synaptic Cleft)',
      rangeMm: [2.5, 0.6],
      cameraDist: 1.8,
      cameraTarget: [0.8, 0.4, 0],
      cameraPos: [0.8, 0.5, 1.8],
      description: 'Botão pré-sináptico, vesículas de neurotransmissores quânticas, fenda sináptica de 20 nm e densidade pós-sináptica (PSD-95).'
    },
    {
      id: 9,
      code: 'TIER_9_ION_CHANNEL',
      name: 'Canal Iônico Voltagem-Dependente (Na+/K+ Channel)',
      rangeMm: [0.6, 0.05],
      cameraDist: 0.45,
      cameraTarget: [0.85, 0.42, 0.1],
      cameraPos: [0.85, 0.43, 0.45],
      description: 'Canais iônicos dependentes de voltagem Nav1.6 e Kv1.2 nos nódulos de Ranvier com influxo e efluxo de íons em escala nanométrica.'
    }
  ];

  // Normalização de campos para compatibilidade universal com UI e HUD
  CNS_STRUCTURES_DATABASE.forEach(s => {
    if (!s.functionText && Array.isArray(s.funcoes)) s.functionText = s.funcoes.join('; ');
    if (!s.clinicalText && Array.isArray(s.doencas)) s.clinicalText = s.doencas.join(', ');
    if (!s.neurotransmitter && Array.isArray(s.neurotransmissores)) s.neurotransmitter = s.neurotransmissores.join(', ');
    if (!s.name && s.estrutura) s.name = s.estrutura;
    if (!s.center && s.coordenadas) s.center = s.coordenadas;
    if (!s.category && s.categoria) s.category = s.categoria;
  });

  // [PT-BR]: Exportação Global do Banco de Dados Científico.
  // [EN-GB]: Global Export of Scientific Database.
  window.MOZOK_DATABASE = {
    structures: CNS_STRUCTURES_DATABASE,
    tracts: TRACTOGRAPHY_CIRCUITS_DATABASE,
    glia: GLIA_CELLS_DATABASE,
    pathologies: PATHOLOGY_EXTENDED_CATALOG,
    tiers: MULTISCALE_TIERS,
    scales: MULTISCALE_TIERS,

    // Métodos de consulta de alta eficiência
    getStructureById(id) {
      return CNS_STRUCTURES_DATABASE.find(s => s.id === id) || null;
    },
    getStructureByCode(code) {
      return CNS_STRUCTURES_DATABASE.find(s => s.code === code) || null;
    },
    getTractById(id) {
      return TRACTOGRAPHY_CIRCUITS_DATABASE.find(t => t.id === id) || null;
    },
    getGliaById(id) {
      return GLIA_CELLS_DATABASE.find(g => g.id === id) || null;
    },
    getPathologyById(id) {
      return PATHOLOGY_EXTENDED_CATALOG[id] || null;
    },
    getTierByDistance(distMm) {
      for (let i = 0; i < MULTISCALE_TIERS.length; i++) {
        const tier = MULTISCALE_TIERS[i];
        if (distMm >= tier.rangeMm[1] && distMm < tier.rangeMm[0]) {
          return tier;
        }
      }
      if (distMm >= 200) return MULTISCALE_TIERS[0];
      return MULTISCALE_TIERS[MULTISCALE_TIERS.length - 1];
    }
  };

})(window);
