/**
 * ============================================================================
 * MOZOK v8.0 — NeuralMicrocosmos3D (MOTOR NEURONAL FOTORREALISTA DA DCJ)
 * RECONSTRUÇÃO IDÊNTICA AO SIMULADOR DA DCJ: NEURÔNIO PIRAMIDAL ÂMBAR-DOURADO
 * CAMADA V, AXÔNIO MIELINIZADO ORGÂNICO, NÓDULOS DE RANVIER (#00f2fe),
 * VIZINHOS EM AZUL-CIANO & ÂMBAR E 24 SINAPSES FÍSICAS BIDIRECIONAIS
 * ============================================================================
 * // [PT-BR]: Motor microscópico neuronal e sináptico unificado entre o Simulador
 * //          da DCJ (js/protein-3d.js) e o MOZOK (web/js/neural-microcosmos-3d.js).
 * //          Inclui Soma Piramidal com Root-Flares hiperbólicos nos 8 polos,
 * //          Subsurface Scattering (SSS), núcleo escuro interno, árvores dendríticas
 * //          de 5ª ordem (Lei de Rall d^(3/2)), 5 bainhas de mielina contornadas,
 * //          Nódulos de Ranvier azul-elétrico (#00f2fe), 24 sinapses químicas com
 * //          fluxo bidirecional (Glutamato/GABA anterógrado + 2-AG/NO/EAAT2 retrógrado)
 * //          e citações científicas indexadas com DOI.
 * // [EN-GB]: Unified microscopic neuronal and synaptic engine shared between the
 * //          CJD Simulator (js/protein-3d.js) and MOZOK (web/js/neural-microcosmos-3d.js).
 * // [AI-CTX]: @llm-context Photorealistic Firefly Layer V pyramidal neuron connectome
 * //          with full 9-part raycast picking, 7-disease pathology visuals, and DOIs.
 * ============================================================================
 */

function fbm3D(x, y, z) {
    let total = 0.0;
    let amp = 0.5;
    let freq = 1.0;
    for (let i = 0; i < 4; i++) {
        total += amp * (
            Math.sin(x * freq * 1.8 + y * freq * 0.9) *
            Math.cos(y * freq * 1.6 + z * freq * 1.1) *
            Math.sin(z * freq * 1.7 + x * freq * 0.8)
        );
        freq *= 2.05;
        amp *= 0.5;
    }
    return total;
}

function createRadialGlowTexture() {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const half = size / 2;
    const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
    grad.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
    grad.addColorStop(0.22, 'rgba(180, 248, 255, 0.85)');
    grad.addColorStop(0.55, 'rgba(0, 210, 255, 0.32)');
    grad.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
}

class NeuralMicrocosmos3D {
    constructor(scene, renderer = null) {
        this.scene = scene;
        this.renderer = renderer;

        this.microGroup = new THREE.Group();
        this.microGroup.visible = false;
        this.scene.add(this.microGroup);

        this.connectomeGroup = new THREE.Group();
        this.microGroup.add(this.connectomeGroup);

        this.confocalGroup = new THREE.Group();
        this.microGroup.add(this.confocalGroup);

        this.pathologyMarkersGroup = new THREE.Group();
        this.microGroup.add(this.pathologyMarkersGroup);

        this.glowTexture = createRadialGlowTexture();

        this.neurons = [];
        this.myelinSheaths = [];
        this.myelinMeshes = [];
        this.somaMeshes = [];
        this.ranvierNodes = [];
        this.dendriticSpines = [];
        this.synapseBridges = [];
        this.synapticVesicles = [];
        this.retrogradeParticles = [];
        this.actionPulses = [];
        this.vacuoles = [];
        this.amyloidPlaques = [];

        this.interactiveParts = [];
        this.partAnchors = new Map();
        this.selectedPartId = 'NEURON_SOMA';
        this.activeTargetStructure = 'FRONTAL_LOBE';
        this.activeDiseaseKey = 'HEALTHY';
        this.diseaseSeverity = 0.0;
        this.damageRatio = 0.0;

        this.firingRateHz = 18.0;
        this.targetFiringRateHz = 18.0;
        this.cbfPerfusion = 54;
        this.conductionVelocityMs = 110;
        this.membranePotentialMv = -70.0;
        this.spikePhase = 0.0;
        this.autoSpikeTimer = 0.0;

        this.gpuTierInfo = this.detectDeviceGpuPower();
        this.targetNeuronCount = this.gpuTierInfo.recommendedNeurons;

        // Ontologia Científica das 9 Sub-Peças do Neurônio com Artigos Revisados por Pares e DOI
        this.neuronPartsOntology = {
            'NEURON_SOMA': {
                id: 'NEURON_SOMA',
                name: 'Corpo Celular Piramidal (Soma / Pericário — Camada V)',
                latin: 'Soma Neuronale Pyramidale / Perikaryon (Lamina V)',
                category: 'Citoarquitetura Neuronal',
                badge: 'CENTRO METABÓLICO E INTEGRADOR SINÁPTICO',
                summary: 'Centro trófico, genômico e metabólico do neurônio piramidal da Camada V neocortical (Célula de Betz), esculpido com cones de emergência dendrítica hiperbólicos (Root-Flares) e Subsurface Scattering âmbar-dourado. Integra todos os potenciais pós-sinápticos excitatórios (PEPS) e inibitórios (PIPS) antes de disparar no Cone de Implantação.',
                functions: [
                    'Integração espacial e temporal algébrica de potenciais pós-sinápticos (PEPS glutamatérgicos e PIPS GABAérgicos)',
                    'Síntese proteica contínua nos Corpúsculos de Nissl (retículo endoplasmático rugoso) e Complexo de Golgi',
                    'Manutenção do potencial de repouso transmembrana em -70 mV via bomba eletrogênica Na+/K+-ATPase (3 Na+ para fora / 2 K+ para dentro)'
                ],
                neurotransmitters: ['Glutamato (Síntese)', 'GABA (Inibição Perissomática)', 'ATP Mitocondrial', 'Na+/K+-ATPase'],
                clinical: 'Cromatólise central após axotomia; acúmulo intracelular de Corpos de Lewy (α-sinucleína no Parkinson), emaranhados neurofibrilares de Tau hiperfosforilada (Alzheimer), vacúolos espongiformes (DCJ) e agregados de TDP-43 (ELA).',
                citation: 'Spruston, N. Pyramidal neurons: dendritic structure and synaptic integration. Nat. Rev. Neurosci. 9, 206–221 (2008).',
                doi: '10.1038/nrn2286'
            },
            'NEURON_NUCLEUS': {
                id: 'NEURON_NUCLEUS',
                name: 'Núcleo Eucromático, Nucléolo & Halo Perinuclear',
                latin: 'Nucleus Neuronalis, Nucleolus & Substantia Chromatophilica',
                category: 'Citoarquitetura Neuronal',
                badge: 'GENOMA, TRANSCRIÇÃO EPIGENÉTICA E ORGANELAS',
                summary: 'Grande núcleo esférico central de eucromatina descondensada visível no interior translúcido do soma por espalhamento subsuperficial (SSS), dotado de nucléolo proeminente para biogênese ribossômica intensa.',
                functions: [
                    'Transcrição rápida de genes de expressão imediata (c-Fos, BDNF, Arc, Zif268) induzida por Ca2+/CREB durante a Potenciação de Longa Duração (LTP)',
                    'Biogênese de subunidades ribossômicas no nucléolo para tradução local de receptores AMPA/NMDA e canais iônicos',
                    'Coordenação bioenergética mitocondrial para sustentar o transporte axoplasmático anterógrado e retrógrado'
                ],
                neurotransmitters: ['pCREB (Fator de Transcrição)', 'BDNF (Neurotrofina)', 'mRNA Dendrítico'],
                clinical: 'Inclusões intranucleares neuronais em doenças por expansão de poliglutaminas CAG (Doença de Huntington e Ataxias Espinocerebelares) e perda da homeostase nuclear de TDP-43 na ELA e Demência Frontotemporal.',
                citation: 'Yap, E. L. & Greenberg, M. E. Activity-Regulated Transcription: Bridging the Gap between Neural Activity and Behavior. Neuron 100, 330–348 (2018).',
                doi: '10.1016/j.neuron.2018.09.044'
            },
            'NEURON_DENDRITES': {
                id: 'NEURON_DENDRITES',
                name: 'Árvore Dendrítica de 5ª Ordem (Lei de Rall) & Espinhas',
                latin: 'Arbor Dendritica & Spinae Dendriticae',
                category: 'Recepção Sináptica (Input)',
                badge: 'ARBORIZAÇÃO RECEPTORA MULTINÍVEL (LEI DE RALL)',
                summary: 'Arborizações citoplasmáticas apicais e basais que bifurcam até a 5ª ordem obedecendo rigorosamente à Lei Potencial de 3/2 de Wilfrid Rall (d_pai^(3/2) = Σ d_filho^(3/2), razão de afinamento ≈ 0,63), recobertas por espinhas dendríticas pós-sinápticas.',
                functions: [
                    'Casamento de impedância eletrotônica ao longo das bifurcações dendríticas segundo a Lei de Rall (1959)',
                    'Recepção de neurotransmissores em receptores ionotrópicos (AMPA, NMDA, Kainato, GABA-A) e metabotrópicos (mGluR)',
                    'Remodelamento actínico das espinhas dendríticas durante a Potenciação de Longa Duração (LTP) e Depressão de Longa Duração (LTD)'
                ],
                neurotransmitters: ['Glutamato (Receptores AMPA/NMDA)', 'GABA (Receptores GABA-A/B)', 'CaMKII & PSD-95'],
                clinical: 'Retração e perda precoce de espinhas dendríticas induzida por oligômeros de Aβ42 na Doença de Alzheimer e por príons PrPSc na Doença de Creutzfeldt-Jakob (DCJ).',
                citation: "Rall, W. Branching dendritic trees and motoneuron membrane resistivity (Rall's 3/2 Power Law). Exp. Neurol. 1, 491–527 (1959).",
                doi: '10.1016/0014-4886(59)90046-9'
            },
            'NEURON_AXON': {
                id: 'NEURON_AXON',
                name: 'Cone de Implantação (Axon Hillock) & Axônio Inicial (AIS)',
                latin: 'Collis Axonis & Segmentum Initiale Axonis',
                category: 'Condução Bioelétrica (Output)',
                badge: 'ZONA DE GATILHO Nav1.6 E TRANSPORTE AXOPLASMÁTICO',
                summary: 'Prolongamento cilíndrico único que emerge da base do soma através do Cone de Implantação afunilado e do Segmento Inicial do Axônio (AIS), onde a altíssima densidade de canais de sódio Nav1.6 ancorados à Anquirina-G dispara o Potencial de Ação.',
                functions: [
                    'Disparo do Potencial de Ação tudo-ou-nada quando o Segmento Inicial (AIS) atinge o limiar de -55 mV',
                    'Condução bioelétrica ortodrômica regenerativa (+40 mV) sem atenuação ao longo da fibra nervosa',
                    'Transporte axoplasmático rápido anterógrado (mediado por Cinesina) e retrógrado (mediado por Dineína) sobre microtúbulos estabilizados por proteína Tau'
                ],
                neurotransmitters: ['Canais Nav1.6 (Influxo de Na+)', 'Canais Kv1.1/1.2 (Repolarização K+)', 'Anquirina-G & Proteína Tau'],
                clinical: 'Lesão Axonal Difusa (LAD) por cisalhamento em traumatismo cranioencefálico, desintegração de microtúbulos por Tau hiperfosforilada no Alzheimer e esferoides axonais na ELA.',
                citation: 'Kole, M. H. P. et al. Action potential generation requires a high sodium channel density in the axon initial segment. Nat. Neurosci. 11, 178–186 (2008).',
                doi: '10.1038/nn2040'
            },
            'NEURON_MYELIN': {
                id: 'NEURON_MYELIN',
                name: 'Bainha de Mielina Multilamelar Contornada',
                latin: 'Vagina Myelinica Internodalis',
                category: 'Isolamento Dielétrico & Velocidade',
                badge: 'ISOLANTE LIPOPROTEICO DE ALTA VELOCIDADE',
                summary: 'Envoltório espiralado compacto (80% lipídios — esfingomielina e galactocerebrosídeos — e 20% proteínas MBP e PLP1) dividido em internodos orgânicos contornados que isolam eletricamente o axônio.',
                functions: [
                    'Redução drástica da capacitância transversa da membrana axonal e aumento da resistência elétrica transmembrana',
                    'Aceleração da velocidade de condução nervosa de ~1 m/s (fibras amielínicas) para até 120 m/s (fibras mielinizadas Aα)',
                    'Economia metabólica de ATP ao confinar as correntes iônicas regenerativas exclusivamente aos Nódulos de Ranvier'
                ],
                neurotransmitters: ['Proteína Básica da Mielina (MBP)', 'Proteína Proteolipídica (PLP1)', 'MOG & MAG'],
                clinical: 'Alvo direto do ataque autoimune desmielinizante na Esclerose Múltipla (SNC), na Neuromielite Óptica e na Síndrome de Guillain-Barré (SNP).',
                citation: 'Nave, K. A. & Werner, H. B. Myelination of the nervous system: mechanisms and functions. Annu. Rev. Cell Dev. Biol. 30, 503–533 (2014).',
                doi: '10.1146/annurev-cellbio-100913-013101'
            },
            'NEURON_SCHWANN': {
                id: 'NEURON_SCHWANN',
                name: 'Oligodendrócito (SNC) / Célula de Schwann (SNP)',
                latin: 'Oligodendrocytus / Neurolemmocytus (Schwann)',
                category: 'Glia Mielinizante & Suporte Trófico',
                badge: 'CÉLULA GLIAL PRODUTORA DE MIELINA E LACTATO',
                summary: 'Célula glial especializada cujo núcleo repousa junto ao neurilema externo da bainha de mielina, realizando a mielinização espiralada e o acoplamento metabólico glia-axônio.',
                functions: [
                    'Mielinização de múltiplos internodos axonais no SNC (Oligodendrócito) ou de um único internodo no SNP (Célula de Schwann)',
                    'Shuttle metabólico de L-Lactato para o axônio através dos transportadores de monocarboxilato MCT1 e MCT2 para síntese axonal de ATP',
                    'Formação das Bandas de Büngner pelas Células de Schwann para guiar o brotamento regenerativo axonal no SNP'
                ],
                neurotransmitters: ['Neuregulina-1 (NRG1 / ErbB)', 'L-Lactato (MCT1/MCT2)', 'GDNF & BDNF'],
                clinical: 'Apoptose de oligodendrócitos na Esclerose Múltipla e Leucoencefalopatia Multifocal Progressiva (LMP); Schwannoma Vestibular no VIII par craniano e doença de Charcot-Marie-Tooth.',
                citation: 'Fünfschilling, U. et al. Glycolytic oligodendrocytes maintain myelin and long-term axonal integrity. Nature 485, 517–521 (2012).',
                doi: '10.1038/nature11007'
            },
            'NEURON_RANVIER': {
                id: 'NEURON_RANVIER',
                name: 'Nódulo de Ranvier em Azul-Elétrico (Condução Saltatória)',
                latin: 'Nodus Neurofibrae (Nodus Ranvieri)',
                category: 'Condução Saltatória Bioelétrica',
                badge: 'REGENERADOR DE POTENCIAL DE AÇÃO (>1.200 Nav1.6/µm²)',
                summary: 'Interrupção periódica amielínica de 1–2 µm entre dois internodos de mielina consecutivos, iluminada em azul-elétrico (#00f2fe), onde a altíssima concentração de canais Nav1.6 regenera explosivamente o Potencial de Ação.',
                functions: [
                    'Condução Saltatória: o circuito de corrente local salta de um Nódulo de Ranvier ao seguinte em frações de milissegundo',
                    'Influxo regenerativo maciço de Na+ pelos canais Nav1.6 nodais, flanqueado por junções paranodais Caspr/Contactina/Neurofascina-155',
                    'Repolarização rápida pelos canais de K+ (Kv1.1 e Kv1.2) concentrados na região justaparanodal'
                ],
                neurotransmitters: ['Canais Nav1.6 Nodais', 'Canais Kv1.1/Kv1.2 Justaparanodais', 'Caspr / Contactina-1 / Neurofascina-186'],
                clinical: 'A desmielinização paranodal na Esclerose Múltipla e nas nodopatias autoimunes expõe os canais Kv1 justaparanodais e dissipa a corrente capacitiva, provocando bloqueio de condução.',
                citation: 'Rasband, M. N. & Peles, E. Mechanisms of node of Ranvier assembly. Nat. Rev. Neurosci. 22, 7–20 (2021).',
                doi: '10.1038/s41583-020-00406-8'
            },
            'NEURON_TERMINAL': {
                id: 'NEURON_TERMINAL',
                name: 'Telodendro & Botão Terminal Pré-Sináptico',
                latin: 'Telodendria & Bouton Terminalis Praesynapticus',
                category: 'Transmissão Pré-Sináptica',
                badge: 'ARBORIZAÇÃO TERMINAL, CANAIS Cav2.1 E COMPLEXO SNARE',
                summary: 'Ramificação distal tripla do axônio (telodendria) que termina em botões sinápticos piriformes repletos de mitocôndrias, canais de Ca2+ dependentes de voltagem (Cav2.1 P/Q e Cav2.2 N) e vesículas sinápticas ancoradas na Zona Ativa.',
                functions: [
                    'Abertura de canais de Ca2+ (Cav2.1/2.2) despolarizados pela chegada do Potencial de Ação ao botão terminal',
                    'Ligação cooperativa de 4 íons Ca2+ ao sensor vesicular Sinaptotagmina-1 em menos de 200 microssegundos',
                    'Fusão da bicamada lipídica vesicular na Zona Ativa catalisada pelo complexo helicoidal SNARE (Sinaptobrevina/VAMP, Sintaxina-1 e SNAP-25)'
                ],
                neurotransmitters: ['Íons Ca2+ (Gatilho de Exocitose)', 'Complexo SNARE & Sinaptotagmina-1', 'Vesículas Sinápticas (VGLUT / VGAT)'],
                clinical: 'Síndrome Miastênica de Lambert-Eaton (autoanticorpos contra canais pré-sinápticos Cav2.1) e clivagem proteolítica do complexo SNARE pelas neurotoxinas Botulínica e Tetânica.',
                citation: 'Südhof, T. C. Neurotransmitter release: the last millisecond in the life of a synaptic vesicle. Neuron 80, 675–690 (2013).',
                doi: '10.1016/j.neuron.2013.10.022'
            },
            'NEURON_SYNAPSE': {
                id: 'NEURON_SYNAPSE',
                name: '24 Sinapses Químicas Físicas & Fluxo Bidirecional',
                latin: 'Synapsis Chimica Bidirectionalis (Fenda de 20 nm)',
                category: 'Conectoma Sináptico Bidirecional',
                badge: 'EXOCITOSE ANTERÓGRADA (GLU/GABA) & SINALIZAÇÃO RETRÓGRADA (2-AG/NO)',
                summary: '24 pontes sinápticas físicas visíveis (~20 nm de fenda iluminada em #00f2fe) interligando os terminais axonais às espinhas dendríticas vizinhas, com tráfego bidirecional contínuo de neurotransmissores indo e voltando.',
                functions: [
                    'Fluxo Anterógrado (Pré -> Pós): exocitose quantal de L-Glutamato (#fbbf24, excitatório AMPA/NMDA) e GABA (#38bdf8, inibitório GABA-A)',
                    'Fluxo Retrógrado (Pós -> Pré): difusão retrógrada de Endocanabinoides (2-Araquidonoilglicerol / 2-AG e Anandamida via receptores CB1) e Óxido Nítrico (NO #34d399) modulando a probabilidade de liberação pré-sináptica (DSI/DSE)',
                    'Recaptação de Alta Afinidade: depuração rápida do glutamato pelos transportadores astrocitários EAAT2 (GLT-1 #fef08a) e do GABA por GAT-1, prevenindo excitotoxicidade'
                ],
                neurotransmitters: ['L-Glutamato (#fbbf24 — Anterógrado)', 'GABA (#38bdf8 — Anterógrado)', 'Endocanabinoide 2-AG & NO (#34d399 — Retrógrado)', 'Recaptação EAAT2/GAT-1 (#fef08a)'],
                clinical: 'Falência da recaptação EAAT2 e hiperativação NMDA causam excitotoxicidade cálcica no AVC Isquêmico e na ELA; perda sináptica precoce no Alzheimer e bloqueio da fenda por agregados PrPSc na DCJ.',
                citation: 'Kano, M. et al. Endocannabinoid-mediated control of synaptic transmission. Physiol. Rev. 89, 309–380 (2009).',
                doi: '10.1152/physrev.00019.2008'
            }
        };

        this.buildCompleteConnectedNeuronNetwork(this.targetNeuronCount);
    }

    detectDeviceGpuPower() {
        let gpuRenderer = 'WebGL2 GPU';
        let tier = 'HIGH';
        let recommendedNeurons = 192;
        try {
            const cores = navigator.hardwareConcurrency || 4;
            const mem = navigator.deviceMemory || 8;
            const isMobileScreen = window.innerWidth <= 900 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent || '');
            if (this.renderer) {
                const gl = this.renderer.getContext();
                const dbg = gl.getExtension('WEBGL_debug_renderer_info');
                if (dbg) {
                    gpuRenderer = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || gpuRenderer;
                }
            }
            const rtxRegex = /RTX|Radeon RX 7|Apple M[2-4] Max|Arc A7/i;
            const gtxRegex = /NVIDIA|GeForce|GTX|Radeon RX|Apple M[1-9]|Arc A[57]/i;
            const lowPerfRegex = /Mali|Adreno|PowerVR|Intel\(R\) HD|UHD Graphics 6/i;

            if (rtxRegex.test(gpuRenderer) && !isMobileScreen) {
                tier = 'ULTRA (RTX / High-End)';
                recommendedNeurons = 360;
            } else if (gtxRegex.test(gpuRenderer) && !isMobileScreen) {
                tier = 'DEDICADA (GTX 1650)';
                recommendedNeurons = 240;
            } else if (isMobileScreen || lowPerfRegex.test(gpuRenderer) || cores <= 4 || mem <= 4) {
                tier = 'ECONÔMICO (Mobile / Integrada)';
                recommendedNeurons = 60;
            } else {
                tier = 'MÉDIO (Desktop Padrão)';
                recommendedNeurons = 120;
            }
        } catch (_) {
            recommendedNeurons = 120;
        }
        return {
            tier,
            gpuRenderer,
            recommendedNeurons: Math.max(50, Math.min(500, recommendedNeurons))
        };
    }

    registerNeuronPart(partId, meshOrGroup, anchorVec = null) {
        if (!meshOrGroup) return;
        meshOrGroup.userData.neuronPartId = partId;
        meshOrGroup.userData.structureId = partId;
        if (meshOrGroup.isMesh) {
            this.interactiveParts.push(meshOrGroup);
        }
        if (meshOrGroup.children && meshOrGroup.children.length > 0) {
            meshOrGroup.traverse(c => {
                c.userData.neuronPartId = partId;
                c.userData.structureId = partId;
                if (c.isMesh) this.interactiveParts.push(c);
            });
        }
        if (anchorVec && !this.partAnchors.has(partId)) {
            this.partAnchors.set(partId, anchorVec.clone());
        }
    }

    getPartWorldAnchor(partId) {
        if (this.partAnchors.has(partId)) {
            return this.partAnchors.get(partId).clone();
        }
        return new THREE.Vector3(0.0, 2.2, 0.0);
    }

    getPartMetadata(partId) {
        return this.neuronPartsOntology[partId] || this.neuronPartsOntology['NEURON_SOMA'];
    }

    resolveRaycastHit(intersection) {
        if (!intersection || !intersection.object) return null;
        let curr = intersection.object;
        while (curr) {
            if (curr.userData && curr.userData.neuronPartId) {
                return curr.userData.neuronPartId;
            }
            curr = curr.parent;
        }
        return 'NEURON_SOMA';
    }

    setNeuronCount(count) {
        const clamped = Math.max(50, Math.min(500, Math.round(Number(count) || 120)));
        if (clamped === this.targetNeuronCount && this.neurons.length === clamped) return clamped;
        this.targetNeuronCount = clamped;
        this.buildCompleteConnectedNeuronNetwork(clamped);
        if (this.activeDiseaseKey !== 'HEALTHY') {
            this.setPathologySimulation(this.activeDiseaseKey, this.diseaseSeverity);
        }
        return clamped;
    }

    /**
     * RECONSTRUÇÃO COMPLETA DA REDE NEURONAL FOTORREALISTA DA DCJ (FIREFLY LAYER V)
     */
    buildCompleteConnectedNeuronNetwork(totalCount = 192) {
        const count = Math.max(50, totalCount);

        while (this.connectomeGroup.children.length > 0) {
            this.connectomeGroup.remove(this.connectomeGroup.children[0]);
        }
        while (this.confocalGroup.children.length > 0) {
            this.confocalGroup.remove(this.confocalGroup.children[0]);
        }
        while (this.pathologyMarkersGroup.children.length > 0) {
            this.pathologyMarkersGroup.remove(this.pathologyMarkersGroup.children[0]);
        }

        this.neurons = [];
        this.myelinSheaths = [];
        this.myelinMeshes = [];
        this.somaMeshes = [];
        this.ranvierNodes = [];
        this.dendriticSpines = [];
        this.synapseBridges = [];
        this.synapticVesicles = [];
        this.retrogradeParticles = [];
        this.actionPulses = [];
        this.interactiveParts = [];
        this.partAnchors.clear();

        // 1. Constrói os 8 Neurônios Esculpidos Principais do Simulador da DCJ (Hero Âmbar + 7 Vizinhos)
        //    + os (count - 8) Neurônios do Ensemble Cortical Conectado
        this.buildFireflyLayerVConnectome(count);

        // 2. Constrói as 24 Sinapses Químicas Físicas e Partículas Bidirecionais (Glutamato/GABA + 2-AG/NO/EAAT2)
        this.build24PhysicalSynapsesAndNeurotransmitters();

        // 3. Constrói os 384 Pulsos de Condução Saltatória nos Nódulos de Ranvier (#00f2fe)
        this.buildActionPotentialPulses();
    }

    /**
     * ESCULTURA FOTORREALISTA DO NEURÔNIO PIRAMIDAL DA CAMADA V (IDÊNTICO AO SIMULADOR DA DCJ)
     */
    buildFireflyLayerVNeuronMesh(config) {
        const {
            id,
            isHero = false,
            isAmber = true,
            position = new THREE.Vector3(0, 0, 0),
            scale = 1.0,
            axonTarget = null,
            hasVisibleMyelin = false
        } = config;

        const group = new THREE.Group();
        group.position.copy(position);
        group.scale.set(scale, scale, scale);

        const somaRadius = isHero ? 2.35 : 1.75;

        // 8 Polos de Emergência Dendrítica (5 superiores/laterais e 3 basais)
        const dendritePoles = [
            new THREE.Vector3(0.0, 1.0, 0.1).normalize(),        // Apical principal
            new THREE.Vector3(-0.78, 0.72, 0.35).normalize(),   // Apical lateral esquerdo
            new THREE.Vector3(0.82, 0.68, 0.28).normalize(),    // Apical lateral direito
            new THREE.Vector3(-0.92, 0.32, -0.25).normalize(),  // Lateral oblíquo esquerdo
            new THREE.Vector3(0.95, 0.28, -0.22).normalize(),   // Lateral oblíquo direito
            new THREE.Vector3(-0.55, -0.42, 0.52).normalize(),  // Basal inferior esquerdo
            new THREE.Vector3(0.58, -0.38, 0.48).normalize(),   // Basal inferior direito
            new THREE.Vector3(0.05, -0.52, -0.62).normalize()   // Basal posterior
        ];

        const axonHillockDir = isHero
            ? new THREE.Vector3(-0.18, -1.0, 0.08).normalize()
            : (axonTarget ? axonTarget.clone().sub(position).normalize() : new THREE.Vector3(0.15, -1.0, -0.1).normalize());

        // a) SOMA PIRAMIDAL COM ROOT-FLARES HIPERBÓLICOS E MICRO-TEXTURA FBM 3D
        const somaGeo = new THREE.SphereGeometry(somaRadius, 64, 48);
        const posAttr = somaGeo.attributes.position;
        const v = new THREE.Vector3();

        for (let i = 0; i < posAttr.count; i++) {
            v.fromBufferAttribute(posAttr, i);
            const u = v.clone().normalize();
            let flare = 0;

            for (let p = 0; p < dendritePoles.length; p++) {
                const dot = Math.max(0, u.dot(dendritePoles[p]));
                flare += Math.pow(dot, 3.4) * (somaRadius * 0.58);
            }

            const dotAxon = Math.max(0, u.dot(axonHillockDir));
            flare += Math.pow(dotAxon, 2.35) * (somaRadius * 0.95);

            const noise = fbm3D(v.x * 3.5, v.y * 3.5, v.z * 3.5) * 0.085;
            v.addScaledVector(u, flare + noise);
            posAttr.setXYZ(i, v.x, v.y, v.z);
        }
        somaGeo.computeVertexNormals();

        const matBaseColor = isAmber ? new THREE.Color(0xf59e0b) : new THREE.Color(0x0369a1);
        const matEmissive = isAmber ? new THREE.Color(0xf59e0b) : new THREE.Color(0x0284c7);
        const fresnelColor = isAmber ? new THREE.Color(0xfef08a) : new THREE.Color(0x7dd3fc);

        const somaMat = new THREE.MeshPhysicalMaterial({
            color: matBaseColor,
            emissive: matEmissive,
            emissiveIntensity: isHero ? 0.65 : 0.48,
            roughness: 0.28,
            metalness: 0.05,
            transmission: 0.42,
            transparent: true,
            opacity: 0.88,
            depthWrite: true
        });

        somaMat.onBeforeCompile = (shader) => {
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <dithering_fragment>',
                `
                #include <dithering_fragment>
                #ifdef USE_NORMAL
                vec3 fNorm = normalize(vNormal);
                vec3 fVDir = normalize(-vViewPosition);
                float fresnel = pow(clamp(1.0 - abs(dot(fNorm, fVDir)), 0.0, 1.0), 2.2);
                vec3 fCol = vec3(${fresnelColor.r.toFixed(3)}, ${fresnelColor.g.toFixed(3)}, ${fresnelColor.b.toFixed(3)});
                gl_FragColor.rgb += fCol * fresnel * 0.95;
                #endif
                `
            );
        };

        const somaMesh = new THREE.Mesh(somaGeo, somaMat);
        somaMesh.userData.baseColorHex = isAmber ? 0xf59e0b : 0x0369a1;
        somaMesh.userData.baseEmissiveHex = isAmber ? 0xf59e0b : 0x0284c7;
        group.add(somaMesh);
        this.somaMeshes.push(somaMesh);
        this.registerNeuronPart('NEURON_SOMA', somaMesh, isHero ? position.clone().add(new THREE.Vector3(0, 1.6, 0)) : null);

        // b) NÚCLEO CELULAR ESFÉRICO ESCURO + HALO PERINUCLEAR LUMINOSO
        const nucleusRadius = somaRadius * 0.46;
        const nucleusGeo = new THREE.SphereGeometry(nucleusRadius, 32, 28);
        const nucleusMat = new THREE.MeshStandardMaterial({
            color: isAmber ? 0x78350f : 0x0c4a6e,
            emissive: isAmber ? 0x92400e : 0x075985,
            emissiveIntensity: 0.65,
            roughness: 0.45
        });
        const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
        nucleusMesh.position.set(0, 0.08 * somaRadius, 0);
        group.add(nucleusMesh);
        this.registerNeuronPart('NEURON_NUCLEUS', nucleusMesh, isHero ? position.clone().add(new THREE.Vector3(0, 0.2, 0)) : null);

        const haloGeo = new THREE.SphereGeometry(nucleusRadius * 1.15, 24, 20);
        const haloMat = new THREE.MeshBasicMaterial({
            color: isAmber ? 0xfbbf24 : 0x38bdf8,
            transparent: true,
            opacity: 0.28,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const haloMesh = new THREE.Mesh(haloGeo, haloMat);
        haloMesh.position.copy(nucleusMesh.position);
        group.add(haloMesh);

        const spriteMat = new THREE.SpriteMaterial({
            map: this.glowTexture,
            color: isAmber ? 0xf59e0b : 0x0284c7,
            transparent: true,
            opacity: isHero ? 0.52 : 0.35,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.scale.setScalar(somaRadius * 4.2);
        group.add(sprite);

        // c) ÁRVORES DENDRÍTICAS TUBULARES SOLDADAS DE 5ª ORDEM (LEI DE RALL)
        const tubePositions = [];
        const tubeNormals = [];
        const tubeColors = [];
        const tubeIndices = [];
        const terminalTips = [];

        const appendTubeSegment = (curve, tubularSegs, radialSegs, rStart, rEnd, branchColor) => {
            const frames = curve.computeFrenetFrames(tubularSegs, false);
            const baseVertex = tubePositions.length / 3;

            for (let i = 0; i <= tubularSegs; i++) {
                const u = i / tubularSegs;
                const pt = curve.getPointAt(u);
                const N = frames.normals[i];
                const B = frames.binormals[i];
                const r = rStart * Math.pow(Math.max(0.002, rEnd) / Math.max(0.002, rStart), u);

                for (let j = 0; j <= radialSegs; j++) {
                    const phi = (j / radialSegs) * Math.PI * 2;
                    const sinP = Math.sin(phi);
                    const cosP = -Math.cos(phi);

                    const nx = cosP * N.x + sinP * B.x;
                    const ny = cosP * N.y + sinP * B.y;
                    const nz = cosP * N.z + sinP * B.z;

                    const noiseVal = fbm3D(pt.x * 3.2, pt.y * 3.2, pt.z * 3.2) * 0.045;
                    const rFin = r * (1.0 + noiseVal);

                    tubePositions.push(pt.x + rFin * nx, pt.y + rFin * ny, pt.z + rFin * nz);
                    tubeNormals.push(nx, ny, nz);
                    tubeColors.push(branchColor.r, branchColor.g, branchColor.b);
                }
            }

            const stride = radialSegs + 1;
            for (let i = 0; i < tubularSegs; i++) {
                for (let j = 0; j < radialSegs; j++) {
                    const a = baseVertex + i * stride + j;
                    const b = baseVertex + (i + 1) * stride + j;
                    const c = baseVertex + (i + 1) * stride + (j + 1);
                    const d = baseVertex + i * stride + (j + 1);
                    tubeIndices.push(a, b, d, b, c, d);
                }
            }
        };

        const spGeoShared = new THREE.SphereGeometry(0.09, 8, 8);
        const spMatShared = new THREE.MeshStandardMaterial({
            color: isAmber ? 0xf59e0b : 0x0ea5e9,
            emissive: isAmber ? 0xd97706 : 0x0284c7,
            emissiveIntensity: 0.45,
            roughness: 0.32
        });

        const growBranchTree = (startPt, startDir, length, rStart, order, maxOrder) => {
            const rEnd = Math.max(0.025, rStart * 0.63);
            const segCount = 4;
            const pts = [startPt.clone()];
            let cur = startPt.clone();
            let curDir = startDir.clone();

            for (let s = 1; s <= segCount; s++) {
                const segLen = length / segCount;
                const jitter = new THREE.Vector3(
                    (Math.sin(cur.x * 2.5 + s * 1.8) - 0.5) * 0.32,
                    (Math.cos(cur.y * 2.3 + s * 1.5) - 0.5) * 0.28,
                    (Math.sin(cur.z * 2.7 + s * 1.6) - 0.5) * 0.32
                );
                cur = cur.clone().addScaledVector(curDir, segLen).add(jitter);
                pts.push(cur);
                curDir.add(new THREE.Vector3(
                    (Math.sin(order * 4.1 + s * 2.3) - 0.5) * 0.26,
                    (Math.cos(order * 3.7 + s * 1.9) - 0.5) * 0.26,
                    (Math.sin(order * 2.9 + s * 3.1) - 0.5) * 0.26
                )).normalize();

                if (order >= 2 && s % 2 === 0 && ((order + s) % 2 === 0)) {
                    const spMesh = new THREE.Mesh(spGeoShared, spMatShared);
                    const orthoJitter = new THREE.Vector3(
                        Math.sin(cur.x * 5.1 + s),
                        Math.cos(cur.y * 4.7 + order),
                        Math.sin(cur.z * 5.3 + s)
                    ).normalize().multiplyScalar(rEnd * 2.4);
                    spMesh.position.copy(cur).add(orthoJitter);
                    spMesh.userData.neuronPartId = 'NEURON_DENDRITES';
                    group.add(spMesh);
                    this.dendriticSpines.push({ mesh: spMesh, baseScale: 1.0 });
                }
            }

            const curve = new THREE.CatmullRomCurve3(pts);
            const tubSegs = (order === 1) ? 10 : 6;
            const radSegs = (order === 1) ? 8 : 6;
            appendTubeSegment(curve, tubSegs, radSegs, rStart, rEnd, matBaseColor);

            const endPt = pts[pts.length - 1];

            if (order < maxOrder) {
                for (let c = 0; c < 2; c++) {
                    const spread = 0.42 + order * 0.08;
                    const ortho = new THREE.Vector3(
                        Math.sin(order * 3.1 + c * 2.4),
                        Math.cos(order * 2.7 + c * 1.8),
                        Math.sin(order * 1.9 + c * 3.3)
                    ).cross(curDir).normalize();
                    const sign = (c === 0 ? 1 : -1);
                    const nextDir = curDir.clone().addScaledVector(ortho, spread * sign).normalize();
                    growBranchTree(endPt, nextDir, length * 0.74, rEnd, order + 1, maxOrder);
                }
            } else {
                const worldEndPt = endPt.clone().multiplyScalar(scale).add(position);
                terminalTips.push({
                    localPt: endPt,
                    worldPt: worldEndPt,
                    dir: curDir,
                    neuronId: id,
                    isAmber
                });
            }
        };

        dendritePoles.forEach((dir, pIdx) => {
            const trunkStart = dir.clone().multiplyScalar(somaRadius * 0.95);
            const trunkLen = (pIdx === 0) ? (isHero ? 7.8 : 5.4) : (isHero ? 5.8 : 4.2);
            const rInitial = isHero ? 0.42 : 0.32;
            growBranchTree(trunkStart, dir, trunkLen, rInitial, 1, 5);
        });

        const tubeGeo = new THREE.BufferGeometry();
        tubeGeo.setAttribute('position', new THREE.Float32BufferAttribute(tubePositions, 3));
        tubeGeo.setAttribute('normal', new THREE.Float32BufferAttribute(tubeNormals, 3));
        tubeGeo.setAttribute('color', new THREE.Float32BufferAttribute(tubeColors, 3));
        tubeGeo.setIndex(tubeIndices);

        const dendriteMat = new THREE.MeshStandardMaterial({
            color: matBaseColor,
            emissive: matEmissive,
            emissiveIntensity: isHero ? 0.45 : 0.35,
            roughness: 0.34,
            metalness: 0.06
        });
        const dendriteMesh = new THREE.Mesh(tubeGeo, dendriteMat);
        group.add(dendriteMesh);
        this.registerNeuronPart('NEURON_DENDRITES', dendriteMesh, isHero ? position.clone().add(new THREE.Vector3(-1.8, 5.2, 0.5)) : null);

        // d) AXÔNIO MIELINIZADO DIRECIONADO À REDE + 5 BAINHAS DE MIELINA ORGÂNICAS + NÓDULOS DE RANVIER (#00f2fe) + TELODENDRIA
        let axonCurveGlobal = null;
        const axonSheaths = [];
        const axonRanvierMeshes = [];
        const axonTerminals = [];

        if (isHero || hasVisibleMyelin) {
            const axonP0 = axonHillockDir.clone().multiplyScalar(somaRadius * 0.98);
            const defaultHeroTarget = new THREE.Vector3(1.2, -3.6, -3.8);
            const targetWorld = axonTarget ? axonTarget.clone() : (isHero ? defaultHeroTarget : position.clone().add(new THREE.Vector3(0.5, -10.0, -0.2)));
            const axonTargetPt = targetWorld.clone().sub(position).divideScalar(scale);

            const aMid1 = axonP0.clone().lerp(axonTargetPt, 0.33).add(new THREE.Vector3(-0.45, -0.55, 0.35));
            const aMid2 = axonP0.clone().lerp(axonTargetPt, 0.68).add(new THREE.Vector3(0.35, -0.35, -0.25));

            const axonCurve = new THREE.CatmullRomCurve3([axonP0, aMid1, aMid2, axonTargetPt]);
            axonCurveGlobal = axonCurve;

            const axTubeGeo = new THREE.TubeGeometry(axonCurve, 32, 0.16, 8, false);
            const axTubeMat = new THREE.MeshStandardMaterial({
                color: matBaseColor,
                emissive: matEmissive,
                emissiveIntensity: 0.5,
                roughness: 0.28
            });
            const axTubeMesh = new THREE.Mesh(axTubeGeo, axTubeMat);
            group.add(axTubeMesh);
            const hillockWorldPos = axonCurve.getPointAt(0.08).clone().multiplyScalar(scale).add(position);
            this.registerNeuronPart('NEURON_AXON', axTubeMesh, isHero ? hillockWorldPos : null);

            const myelinCount = 5;
            const axonR = 0.16;
            const schwannMat = new THREE.MeshPhysicalMaterial({
                color: 0x10b981,
                emissive: 0x059669,
                emissiveIntensity: 0.65,
                roughness: 0.25,
                clearcoat: 0.8
            });

            for (let m = 0; m < myelinCount; m++) {
                const uStart = (m / myelinCount) + 0.028;
                const uEnd = ((m + 1) / myelinCount) - 0.028;
                const segSteps = 12;
                const internodePts = [];

                for (let s = 0; s <= segSteps; s++) {
                    const uG = uStart + (s / segSteps) * (uEnd - uStart);
                    internodePts.push(axonCurve.getPointAt(uG));
                }

                const cInt = new THREE.CatmullRomCurve3(internodePts);
                const frames = cInt.computeFrenetFrames(segSteps, false);
                const mPos = [];
                const mNorm = [];
                const mIdx = [];
                const radSegs = 10;

                for (let s = 0; s <= segSteps; s++) {
                    const uL = s / segSteps;
                    const pt = cInt.getPointAt(uL);
                    const N = frames.normals[s];
                    const B = frames.binormals[s];

                    const sinTerm = Math.pow(Math.max(0, Math.sin(Math.PI * uL)), 0.38);
                    const noiseTerm = fbm3D(pt.x * 3.5, pt.y * 3.5, pt.z * 3.5) * 0.06;
                    const rMyelin = axonR * (1.0 + 0.62 * sinTerm) * (1.0 + noiseTerm);

                    for (let j = 0; j <= radSegs; j++) {
                        const phi = (j / radSegs) * Math.PI * 2;
                        const sinP = Math.sin(phi);
                        const cosP = -Math.cos(phi);
                        const nx = cosP * N.x + sinP * B.x;
                        const ny = cosP * N.y + sinP * B.y;
                        const nz = cosP * N.z + sinP * B.z;

                        mPos.push(pt.x + rMyelin * nx, pt.y + rMyelin * ny, pt.z + rMyelin * nz);
                        mNorm.push(nx, ny, nz);
                    }
                }

                const stride = radSegs + 1;
                for (let s = 0; s < segSteps; s++) {
                    for (let j = 0; j < radSegs; j++) {
                        const a = s * stride + j;
                        const b = (s + 1) * stride + j;
                        const c = (s + 1) * stride + (j + 1);
                        const d = s * stride + (j + 1);
                        mIdx.push(a, b, d, b, c, d);
                    }
                }

                const mGeo = new THREE.BufferGeometry();
                mGeo.setAttribute('position', new THREE.Float32BufferAttribute(mPos, 3));
                mGeo.setAttribute('normal', new THREE.Float32BufferAttribute(mNorm, 3));
                mGeo.setIndex(mIdx);

                const mMat = new THREE.MeshPhysicalMaterial({
                    color: isAmber ? 0xfef3c7 : 0xe0f2fe,
                    emissive: isAmber ? 0xd97706 : 0x0284c7,
                    emissiveIntensity: 0.35,
                    roughness: 0.30,
                    metalness: 0.06,
                    transmission: 0.48,
                    transparent: true,
                    opacity: 0.88
                });

                const mMesh = new THREE.Mesh(mGeo, mMat);
                mMesh.userData.baseColorHex = isAmber ? 0xfef3c7 : 0xe0f2fe;
                mMesh.userData.baseEmissiveHex = isAmber ? 0xd97706 : 0x0284c7;
                group.add(mMesh);
                axonSheaths.push(mMesh);
                this.myelinSheaths.push({ mesh: mMesh, baseScale: mMesh.scale.clone(), neuronId: id });
                this.myelinMeshes.push(mMesh);

                const midInternodeLocal = cInt.getPointAt(0.5);
                const midInternodeWorld = midInternodeLocal.clone().multiplyScalar(scale).add(position);
                this.registerNeuronPart('NEURON_MYELIN', mMesh, (isHero && m === 1) ? midInternodeWorld : null);

                // Núcleo Glial (Oligodendrócito / Célula de Schwann) aderido ao neurilema externo
                const schwannNuc = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 12), schwannMat);
                schwannNuc.scale.set(1.6, 0.85, 0.95);
                schwannNuc.position.copy(midInternodeLocal).add(new THREE.Vector3(m % 2 === 0 ? 0.24 : -0.24, 0.08, 0.14));
                group.add(schwannNuc);
                const schwannWorld = schwannNuc.position.clone().multiplyScalar(scale).add(position);
                this.registerNeuronPart('NEURON_SCHWANN', schwannNuc, (isHero && m === 2) ? schwannWorld : null);

                // NÓDULOS DE RANVIER EM AZUL-ELÉTRICO (#00f2fe)
                if (m < myelinCount - 1) {
                    const tNode = (m + 1.0) / myelinCount;
                    const nodePos = axonCurve.getPointAt(tNode);
                    const nodeTan = axonCurve.getTangentAt(tNode).normalize();

                    const ranvierRingGeo = new THREE.TorusGeometry(axonR * 1.45, 0.048, 8, 16);
                    const ranvierRingMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe });
                    const rRingMesh = new THREE.Mesh(ranvierRingGeo, ranvierRingMat);
                    rRingMesh.position.copy(nodePos);
                    rRingMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), nodeTan);
                    group.add(rRingMesh);

                    const rSpriteMat = new THREE.SpriteMaterial({
                        map: this.glowTexture,
                        color: 0x00f2fe,
                        transparent: true,
                        opacity: 0.95,
                        blending: THREE.AdditiveBlending,
                        depthWrite: false
                    });
                    const rSprite = new THREE.Sprite(rSpriteMat);
                    rSprite.position.copy(nodePos);
                    rSprite.scale.set(1.75, 1.75, 1.75);
                    group.add(rSprite);

                    const worldNodePos = nodePos.clone().multiplyScalar(scale).add(position);
                    this.registerNeuronPart('NEURON_RANVIER', rRingMesh, (isHero && m === 1) ? worldNodePos : null);
                    axonRanvierMeshes.push({ mesh: rRingMesh, sprite: rSprite, worldPos: worldNodePos, tNode, neuronId: id });
                    this.ranvierNodes.push({ mesh: rRingMesh, sprite: rSprite, worldPos: worldNodePos, neuronId: id });
                }
            }

            // Segmento Inicial do Axônio (AIS) — Nódulo pré-mielina logo abaixo do Cone de Implantação
            const posAIS = axonCurve.getPointAt(0.024);
            const tanAIS = axonCurve.getTangentAt(0.024).normalize();
            const rAISRing = new THREE.Mesh(new THREE.TorusGeometry(axonR * 1.5, 0.05, 8, 16), new THREE.MeshBasicMaterial({ color: 0x00f2fe }));
            rAISRing.position.copy(posAIS);
            rAISRing.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tanAIS);
            group.add(rAISRing);
            this.registerNeuronPart('NEURON_AXON', rAISRing);

            const rAISSprite = new THREE.Sprite(new THREE.SpriteMaterial({
                map: this.glowTexture,
                color: 0x00f2fe,
                transparent: true,
                opacity: 0.95,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            }));
            rAISSprite.position.copy(posAIS);
            rAISSprite.scale.set(1.9, 1.9, 1.9);
            group.add(rAISSprite);

            const worldAISPos = posAIS.clone().multiplyScalar(scale).add(position);
            axonRanvierMeshes.unshift({ mesh: rAISRing, sprite: rAISSprite, worldPos: worldAISPos, tNode: 0.024, neuronId: id });
            this.ranvierNodes.push({ mesh: rAISRing, sprite: rAISSprite, worldPos: worldAISPos, neuronId: id });

            // Arborização Terminal Axonal (Telodendria): 3 colaterais pré-sinápticos conectando aos dendritos vizinhos
            const endTan = axonCurve.getTangentAt(1.0).normalize();
            const colOffsets = [
                new THREE.Vector3(-1.35, -0.85, 0.65),
                new THREE.Vector3(1.45, -0.75, -0.55),
                new THREE.Vector3(0.15, -1.35, 1.15)
            ];
            for (let kb = 0; kb < colOffsets.length; kb++) {
                const branchEnd = axonTargetPt.clone().add(colOffsets[kb]);
                const branchMid = axonTargetPt.clone().lerp(branchEnd, 0.5).addScaledVector(endTan, 0.55);
                const colCurve = new THREE.CatmullRomCurve3([axonTargetPt.clone(), branchMid, branchEnd]);
                const colGeo = new THREE.TubeGeometry(colCurve, 12, 0.085, 6, false);
                const colMesh = new THREE.Mesh(colGeo, axTubeMat);
                group.add(colMesh);

                const worldColEnd = branchEnd.clone().multiplyScalar(scale).add(position);
                this.registerNeuronPart('NEURON_TERMINAL', colMesh, (isHero && kb === 0) ? worldColEnd : null);

                const tipEntry = {
                    localPt: branchEnd,
                    worldPt: worldColEnd,
                    dir: branchEnd.clone().sub(axonTargetPt).normalize(),
                    neuronId: id,
                    isAmber,
                    isAxonTerminal: true
                };
                axonTerminals.push(tipEntry);
                terminalTips.push(tipEntry);
            }
        }

        this.connectomeGroup.add(group);

        const record = {
            id,
            index: id,
            isHero,
            isPrimary: isHero,
            isAmber,
            position,
            somaPos: position.clone(),
            scale,
            group,
            somaMesh,
            somaMat,
            nucleusMesh,
            nucleusMat,
            haloMesh,
            sprite,
            dendriteMesh,
            dendriteMat,
            terminalTips,
            axonSheaths,
            axonRanvierMeshes,
            axonTerminals,
            axonCurveGlobal,
            health: 1.0
        };

        this.neurons.push(record);
        return record;
    }

    /**
     * DISTRIBUIÇÃO ESPACIAL DOS NEURÔNIOS ESCULPIDOS DO SIMULADOR DA DCJ
     */
    buildFireflyLayerVConnectome(totalCount = 192) {
        this.buildFireflyLayerVNeuronMesh({
            id: 0,
            isHero: true,
            isAmber: true,
            position: new THREE.Vector3(0.0, 2.2, 0.0),
            scale: 1.0,
            axonTarget: new THREE.Vector3(1.2, -3.6, -3.8),
            hasVisibleMyelin: true
        });

        this.buildFireflyLayerVNeuronMesh({
            id: 1,
            isHero: false,
            isAmber: false,
            position: new THREE.Vector3(-9.8, 3.6, -2.5),
            scale: 0.68,
            axonTarget: new THREE.Vector3(-2.2, 1.8, -0.5),
            hasVisibleMyelin: true
        });

        this.buildFireflyLayerVNeuronMesh({
            id: 2,
            isHero: false,
            isAmber: false,
            position: new THREE.Vector3(-7.5, -5.8, 2.2),
            scale: 0.78,
            axonTarget: new THREE.Vector3(1.2, -4.4, -4.2),
            hasVisibleMyelin: true
        });

        this.buildFireflyLayerVNeuronMesh({
            id: 3,
            isHero: false,
            isAmber: true,
            position: new THREE.Vector3(-8.2, -1.6, -5.5),
            scale: 0.48,
            axonTarget: new THREE.Vector3(-7.2, -5.0, 1.5),
            hasVisibleMyelin: true
        });

        this.buildFireflyLayerVNeuronMesh({
            id: 4,
            isHero: false,
            isAmber: true,
            position: new THREE.Vector3(1.8, -4.5, -5.2),
            scale: 0.55,
            axonTarget: new THREE.Vector3(7.6, -4.5, -2.2),
            hasVisibleMyelin: true
        });

        this.buildFireflyLayerVNeuronMesh({
            id: 5,
            isHero: false,
            isAmber: false,
            position: new THREE.Vector3(9.4, 4.2, -3.0),
            scale: 0.65,
            axonTarget: new THREE.Vector3(2.2, 2.0, -0.5),
            hasVisibleMyelin: true
        });

        this.buildFireflyLayerVNeuronMesh({
            id: 6,
            isHero: false,
            isAmber: true,
            position: new THREE.Vector3(7.8, 3.0, -2.2),
            scale: 0.45,
            axonTarget: new THREE.Vector3(8.1, -4.0, -2.0),
            hasVisibleMyelin: true
        });

        this.buildFireflyLayerVNeuronMesh({
            id: 7,
            isHero: false,
            isAmber: true,
            position: new THREE.Vector3(8.4, -4.8, -2.0),
            scale: 0.52,
            axonTarget: new THREE.Vector3(1.8, 0.8, -0.4),
            hasVisibleMyelin: true
        });

        const extraCount = Math.max(42, totalCount - 8);
        this.buildConnectedCorticalEnsemble88(extraCount);
    }

    /**
     * ENSEMBLE CORTICAL DE NEURÔNIOS CONECTADOS VIA VBOs COMPARTILHADOS (IDÊNTICO AO DCJ)
     */
    buildConnectedCorticalEnsemble88(extraCount = 184) {
        const sharedSomaGeo = new THREE.SphereGeometry(0.95, 24, 20);
        const sPos = sharedSomaGeo.attributes.position;
        const sharedPoles = [
            new THREE.Vector3(0.0, 1.0, 0.1).normalize(),
            new THREE.Vector3(-0.78, 0.72, 0.35).normalize(),
            new THREE.Vector3(0.82, 0.68, 0.28).normalize(),
            new THREE.Vector3(-0.92, 0.32, -0.25).normalize(),
            new THREE.Vector3(0.95, 0.28, -0.22).normalize(),
            new THREE.Vector3(-0.55, -0.42, 0.52).normalize(),
            new THREE.Vector3(0.58, -0.38, 0.48).normalize(),
            new THREE.Vector3(0.0, -1.0, 0.0).normalize()
        ];
        const tmpV = new THREE.Vector3();
        for (let i = 0; i < sPos.count; i++) {
            tmpV.fromBufferAttribute(sPos, i);
            const u = tmpV.clone().normalize();
            let flare = 0.0;
            for (let p = 0; p < sharedPoles.length; p++) {
                const dot = Math.max(0.0, u.dot(sharedPoles[p]));
                flare += Math.pow(dot, 3.2) * 0.42;
            }
            const noise = fbm3D(tmpV.x * 2.5, tmpV.y * 2.5, tmpV.z * 2.5) * 0.08;
            tmpV.addScaledVector(u, flare + noise);
            sPos.setXYZ(i, tmpV.x, tmpV.y, tmpV.z);
        }
        sharedSomaGeo.computeVertexNormals();

        const sharedNucGeo = new THREE.SphereGeometry(0.42, 14, 12);
        const sharedSpineGeo = new THREE.SphereGeometry(0.075, 6, 6);
        const sharedRanvierGeo = new THREE.TorusGeometry(0.14, 0.038, 6, 12);
        const sharedBoutonGeo = new THREE.SphereGeometry(0.17, 8, 8);
        sharedBoutonGeo.scale(1.2, 0.85, 0.85);
        const sharedCleftGeo = new THREE.CylinderGeometry(0.19, 0.19, 0.035, 10);

        const matNucAmber = new THREE.MeshStandardMaterial({ color: 0x78350f, emissive: 0x92400e, emissiveIntensity: 0.55 });
        const matNucCyan = new THREE.MeshStandardMaterial({ color: 0x0c4a6e, emissive: 0x075985, emissiveIntensity: 0.55 });
        const matNeuriteAmber = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xb45309, emissiveIntensity: 0.38, roughness: 0.32 });
        const matNeuriteCyan = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, emissive: 0x0284c7, emissiveIntensity: 0.38, roughness: 0.32 });
        const matRanvier = new THREE.MeshBasicMaterial({ color: 0x00f2fe });
        const matCleft = new THREE.MeshBasicMaterial({ color: 0x00f2fe, transparent: true, opacity: 0.78, blending: THREE.AdditiveBlending, depthWrite: false });

        const nodePositions = [];
        for (let i = 0; i < extraCount; i++) {
            const goldenAngle = i * 2.399963229728653;
            const ringIdx = Math.floor(i / 16);
            const layerY = (i % 8);
            const radiusXY = 9.2 + ringIdx * 1.85 + (i % 4) * 0.75;
            const x = Math.cos(goldenAngle) * radiusXY * 1.32;
            const y = -12.6 + layerY * 3.55 + Math.sin(i * 1.9) * 1.35;
            const z = -3.2 - (ringIdx * 1.95) - Math.abs(Math.sin(goldenAngle * 0.5)) * 4.2;
            nodePositions.push(new THREE.Vector3(x, y, z));
        }

        for (let i = 0; i < extraCount; i++) {
            const id = 8 + i;
            const pos = nodePositions[i];
            const isAmber = (i % 2 === 0);
            const scale = 0.44 + (i % 4) * 0.06;

            let bestTargetPos = this.neurons[i % 8].position;
            let minDist = Infinity;

            for (let h = 0; h < 8; h++) {
                const dH = pos.distanceTo(this.neurons[h].position);
                if (dH > 4.2 && dH < 13.5 && dH < minDist) {
                    minDist = dH;
                    bestTargetPos = this.neurons[h].position;
                }
            }
            for (let j = 0; j < extraCount; j++) {
                if (i === j) continue;
                const dE = pos.distanceTo(nodePositions[j]);
                if (dE > 3.8 && dE < 12.8 && dE < minDist) {
                    minDist = dE;
                    bestTargetPos = nodePositions[j];
                }
            }

            const group = new THREE.Group();
            group.position.copy(pos);

            const somaMat = new THREE.MeshPhysicalMaterial({
                color: isAmber ? 0xf59e0b : 0x0369a1,
                emissive: isAmber ? 0xd97706 : 0x0284c7,
                emissiveIntensity: 0.46,
                roughness: 0.28,
                transmission: 0.38,
                transparent: true,
                opacity: 0.86
            });
            const nucMat = isAmber ? matNucAmber : matNucCyan;
            const neuriteMat = isAmber ? matNeuriteAmber : matNeuriteCyan;
            const myelinMat = new THREE.MeshPhysicalMaterial({
                color: isAmber ? 0xfef3c7 : 0xe0f2fe,
                emissive: isAmber ? 0xd97706 : 0x0284c7,
                emissiveIntensity: 0.32,
                transparent: true,
                opacity: 0.84,
                roughness: 0.3
            });

            const somaMesh = new THREE.Mesh(sharedSomaGeo, somaMat);
            somaMesh.scale.setScalar(scale);
            somaMesh.userData.baseColorHex = isAmber ? 0xf59e0b : 0x0369a1;
            somaMesh.userData.baseEmissiveHex = isAmber ? 0xd97706 : 0x0284c7;
            somaMesh.userData.neuronPartId = 'NEURON_SOMA';
            group.add(somaMesh);
            this.somaMeshes.push(somaMesh);
            this.interactiveParts.push(somaMesh);

            const nucleusMesh = new THREE.Mesh(sharedNucGeo, nucMat);
            nucleusMesh.scale.setScalar(scale);
            nucleusMesh.userData.neuronPartId = 'NEURON_NUCLEUS';
            group.add(nucleusMesh);

            const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
                map: this.glowTexture,
                color: isAmber ? 0xf59e0b : 0x0284c7,
                transparent: true,
                opacity: 0.32,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            }));
            sprite.scale.setScalar(scale * 4.2);
            group.add(sprite);

            const dirToTarget = bestTargetPos.clone().sub(pos);
            const unitDir = dirToTarget.clone().normalize();
            const terminalTips = [];

            const dendDirs = [
                new THREE.Vector3(-unitDir.x * 0.7 + 0.4, 0.85, 0.35).normalize(),
                new THREE.Vector3(-unitDir.x * 0.7 - 0.4, 0.65, -0.45).normalize(),
                new THREE.Vector3(unitDir.x * 0.5, -0.75, 0.50).normalize(),
                new THREE.Vector3(-unitDir.y * 0.6, -0.60, -0.45).normalize()
            ];

            for (let dIdx = 0; dIdx < dendDirs.length; dIdx++) {
                const dDir = dendDirs[dIdx];
                const dLen = (2.2 + (dIdx % 2) * 0.75) * scale;
                const dMid = dDir.clone().multiplyScalar(dLen * 0.52).add(new THREE.Vector3(0, (dIdx % 2 === 0 ? 0.25 : -0.25) * scale, 0.15 * scale));
                const dEnd = dDir.clone().multiplyScalar(dLen);
                const dCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), dMid, dEnd]);
                const dMesh = new THREE.Mesh(new THREE.TubeGeometry(dCurve, 8, 0.065 * scale, 5, false), neuriteMat);
                dMesh.userData.neuronPartId = 'NEURON_DENDRITES';
                group.add(dMesh);

                const spMesh = new THREE.Mesh(sharedSpineGeo, neuriteMat);
                spMesh.position.copy(dEnd);
                spMesh.userData.neuronPartId = 'NEURON_DENDRITES';
                group.add(spMesh);
                this.dendriticSpines.push({ mesh: spMesh, baseScale: 1.0 });

                terminalTips.push({
                    localPt: dEnd,
                    worldPt: dEnd.clone().add(pos),
                    dir: dDir,
                    neuronId: id,
                    isAmber,
                    isAxonTerminal: false
                });
            }

            const worldContactPt = bestTargetPos.clone().addScaledVector(unitDir, -1.35);
            const localContactPt = worldContactPt.clone().sub(pos);

            const localTargetCenter = bestTargetPos.clone().sub(pos);
            const postMid = localTargetCenter.clone().lerp(localContactPt, 0.55).add(new THREE.Vector3(0, 0.22 * scale, -0.15 * scale));
            const postDendCurve = new THREE.CatmullRomCurve3([localTargetCenter, postMid, localContactPt]);
            const postDendMesh = new THREE.Mesh(new THREE.TubeGeometry(postDendCurve, 8, 0.058 * scale, 5, false), neuriteMat);
            postDendMesh.userData.neuronPartId = 'NEURON_DENDRITES';
            group.add(postDendMesh);

            const axonStart = unitDir.clone().multiplyScalar(0.75 * scale);
            const orthoArch = new THREE.Vector3(-unitDir.y, unitDir.x, (i % 3 - 1) * 0.4).normalize().multiplyScalar(0.85 * scale);
            const axMid1 = axonStart.clone().lerp(localContactPt, 0.34).add(orthoArch);
            const axMid2 = axonStart.clone().lerp(localContactPt, 0.68).addScaledVector(orthoArch, -0.45);
            const axonCurve = new THREE.CatmullRomCurve3([axonStart, axMid1, axMid2, localContactPt]);

            const axMesh = new THREE.Mesh(new THREE.TubeGeometry(axonCurve, 18, 0.062 * scale, 6, false), neuriteMat);
            axMesh.userData.neuronPartId = 'NEURON_AXON';
            group.add(axMesh);

            const axonSheaths = [];
            const axonRanvierMeshes = [];
            const numSegs = 3;
            const segSpan = 0.72 / numSegs;
            const gapSpan = 0.055;

            for (let s = 0; s < numSegs; s++) {
                const t0 = 0.08 + s * (segSpan + gapSpan);
                const t1 = Math.min(0.86, t0 + segSpan);
                const mCurve = new THREE.CatmullRomCurve3([
                    axonCurve.getPointAt(t0),
                    axonCurve.getPointAt((t0 + t1) * 0.5),
                    axonCurve.getPointAt(t1)
                ]);
                const mMesh = new THREE.Mesh(new THREE.TubeGeometry(mCurve, 7, 0.145 * scale, 7, false), myelinMat);
                mMesh.userData.baseColorHex = isAmber ? 0xfef3c7 : 0xe0f2fe;
                mMesh.userData.baseEmissiveHex = isAmber ? 0xd97706 : 0x0284c7;
                mMesh.userData.neuronPartId = 'NEURON_MYELIN';
                group.add(mMesh);
                axonSheaths.push(mMesh);
                this.myelinSheaths.push({ mesh: mMesh, baseScale: mMesh.scale.clone(), neuronId: id });
                this.myelinMeshes.push(mMesh);

                if (s < numSegs - 1) {
                    const rT = t1 + gapSpan * 0.5;
                    const rPt = axonCurve.getPointAt(rT);
                    const rTan = axonCurve.getTangentAt(rT).normalize();
                    const rRing = new THREE.Mesh(sharedRanvierGeo, matRanvier);
                    rRing.scale.setScalar(scale * 1.15);
                    rRing.position.copy(rPt);
                    rRing.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), rTan);
                    rRing.userData.neuronPartId = 'NEURON_RANVIER';
                    group.add(rRing);

                    const rSprite = new THREE.Sprite(new THREE.SpriteMaterial({
                        map: this.glowTexture,
                        color: 0x00f2fe,
                        transparent: true,
                        opacity: 0.88,
                        blending: THREE.AdditiveBlending,
                        depthWrite: false
                    }));
                    rSprite.position.copy(rPt);
                    rSprite.scale.setScalar(1.15 * scale);
                    group.add(rSprite);

                    const wNodePos = rPt.clone().add(pos);
                    axonRanvierMeshes.push({ mesh: rRing, sprite: rSprite, worldPos: wNodePos, tNode: rT, neuronId: id });
                    this.ranvierNodes.push({ mesh: rRing, sprite: rSprite, worldPos: wNodePos, neuronId: id });
                }
            }

            const endTan = axonCurve.getTangentAt(1.0).normalize();
            const boutonMesh = new THREE.Mesh(sharedBoutonGeo, neuriteMat);
            boutonMesh.scale.setScalar(scale * 1.15);
            boutonMesh.position.copy(localContactPt);
            boutonMesh.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), endTan);
            boutonMesh.userData.neuronPartId = 'NEURON_TERMINAL';
            group.add(boutonMesh);

            const cleftMesh = new THREE.Mesh(sharedCleftGeo, matCleft);
            cleftMesh.scale.setScalar(scale * 1.15);
            cleftMesh.position.copy(localContactPt);
            cleftMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), endTan);
            cleftMesh.userData.neuronPartId = 'NEURON_SYNAPSE';
            group.add(cleftMesh);

            const axonTipEntry = {
                localPt: localContactPt,
                worldPt: worldContactPt,
                dir: endTan,
                neuronId: id,
                isAmber,
                isAxonTerminal: true
            };
            terminalTips.push(axonTipEntry);

            this.connectomeGroup.add(group);

            this.neurons.push({
                id,
                index: id,
                isHero: false,
                isPrimary: false,
                isAmber,
                position: pos,
                somaPos: pos.clone(),
                scale: 1.0,
                group,
                somaMesh,
                somaMat,
                nucleusMesh,
                nucleusMat: nucMat,
                haloMesh: null,
                sprite,
                dendriteMesh: postDendMesh,
                dendriteMat: neuriteMat,
                terminalTips,
                axonSheaths,
                axonRanvierMeshes,
                axonTerminals: [axonTipEntry],
                axonCurveGlobal: axonCurve,
                health: 1.0
            });
        }
    }

    /**
     * 24 SINAPSES FÍSICAS REAIS VISÍVEIS COM FLUXO BIDIRECIONAL (IDÊNTICO AO SIMULADOR DA DCJ)
     */
    build24PhysicalSynapsesAndNeurotransmitters() {
        this.synapseBridges = [];
        this.synapticVesicles = [];
        this.retrogradeParticles = [];

        const boutonGeo = new THREE.SphereGeometry(0.24, 12, 10);
        boutonGeo.scale(1.25, 0.88, 0.88);

        const cleftDiskGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.045, 14);
        const spineGeo = new THREE.SphereGeometry(0.20, 10, 10);
        spineGeo.scale(0.95, 1.3, 0.95);

        const usedPairs = new Set();
        let bridgeCount = 0;

        const connectNeuronPair = (neuronA, neuronB, maxLinks, preferAxonFromA = false) => {
            if (!neuronA || !neuronB || !neuronA.terminalTips.length || !neuronB.terminalTips.length) return;

            const candidates = [];
            const sourceTips = (preferAxonFromA && neuronA.axonTerminals && neuronA.axonTerminals.length > 0)
                ? neuronA.axonTerminals
                : neuronA.terminalTips;

            for (let i = 0; i < sourceTips.length; i++) {
                const tipA = sourceTips[i];
                for (let j = 0; j < neuronB.terminalTips.length; j++) {
                    const tipB = neuronB.terminalTips[j];
                    if (tipB.isAxonTerminal) continue;
                    const d = tipA.worldPt.distanceTo(tipB.worldPt);
                    candidates.push({ tipA, tipB, i, j, d });
                }
            }

            candidates.sort((a, b) => a.d - b.d);

            let created = 0;
            const usedA = new Set();
            const usedB = new Set();

            for (let k = 0; k < candidates.length && created < maxLinks; k++) {
                const cand = candidates[k];
                if (usedA.has(cand.i) || usedB.has(cand.j)) continue;
                const pairKey = `${neuronA.id}_${cand.i}_${neuronB.id}_${cand.j}`;
                if (usedPairs.has(pairKey)) continue;

                usedPairs.add(pairKey);
                usedA.add(cand.i);
                usedB.add(cand.j);
                created++;

                const pPre = cand.tipA.worldPt.clone();
                const pPost = cand.tipB.worldPt.clone();
                const dist = pPre.distanceTo(pPost);
                const cleftDir = pPost.clone().sub(pPre).normalize();

                const dirA = cand.tipA.dir ? cand.tipA.dir.clone().normalize() : cleftDir.clone();
                const dirB = cand.tipB.dir ? cand.tipB.dir.clone().normalize() : cleftDir.clone().negate();
                const handleLen = Math.min(2.2, dist * 0.28);

                const ctrl1 = pPre.clone().addScaledVector(dirA, handleLen).lerp(pPost, 0.22);
                const ctrl2 = pPost.clone().addScaledVector(dirB, handleLen).lerp(pPre, 0.22);
                const midArc = ctrl1.clone().lerp(ctrl2, 0.5);
                midArc.y += Math.sin(bridgeCount * 1.7) * 0.28;

                const bridgeCurve = new THREE.CatmullRomCurve3([pPre, ctrl1, midArc, ctrl2, pPost]);
                const cleftCenter = bridgeCurve.getPointAt(0.5);
                const cleftTangent = bridgeCurve.getTangentAt(0.5).normalize();

                const isAmberPre = cand.tipA.isAmber;
                const matBouton = new THREE.MeshStandardMaterial({
                    color: isAmberPre ? 0xf59e0b : 0x0284c7,
                    emissive: isAmberPre ? 0xd97706 : 0x0369a1,
                    emissiveIntensity: 0.72,
                    roughness: 0.24
                });
                const boutonMesh = new THREE.Mesh(boutonGeo, matBouton);
                boutonMesh.position.copy(bridgeCurve.getPointAt(0.46));
                boutonMesh.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), cleftTangent);
                boutonMesh.userData.neuronPartId = 'NEURON_TERMINAL';
                this.connectomeGroup.add(boutonMesh);
                this.interactiveParts.push(boutonMesh);

                const matCleft = new THREE.MeshBasicMaterial({
                    color: 0x00f2fe,
                    transparent: true,
                    opacity: 0.85,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false
                });
                const cleftMesh = new THREE.Mesh(cleftDiskGeo, matCleft);
                cleftMesh.position.copy(cleftCenter);
                cleftMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), cleftTangent);
                cleftMesh.userData.neuronPartId = 'NEURON_SYNAPSE';
                this.connectomeGroup.add(cleftMesh);
                this.interactiveParts.push(cleftMesh);

                if (bridgeCount === 0) {
                    this.partAnchors.set('NEURON_SYNAPSE', cleftCenter.clone());
                    this.partAnchors.set('NEURON_TERMINAL', boutonMesh.position.clone());
                }

                const isAmberPost = cand.tipB.isAmber;
                const matSpine = new THREE.MeshStandardMaterial({
                    color: isAmberPost ? 0xd97706 : 0x0ea5e9,
                    emissive: isAmberPost ? 0xf59e0b : 0x0284c7,
                    emissiveIntensity: 0.65,
                    roughness: 0.28
                });
                const spineMesh = new THREE.Mesh(spineGeo, matSpine);
                spineMesh.position.copy(bridgeCurve.getPointAt(0.54));
                spineMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), cleftTangent);
                spineMesh.userData.neuronPartId = 'NEURON_SYNAPSE';
                this.connectomeGroup.add(spineMesh);
                this.interactiveParts.push(spineMesh);

                const bridgeTubeGeo = new THREE.TubeGeometry(bridgeCurve, 18, 0.082, 7, false);
                const bridgeTubeMat = new THREE.MeshStandardMaterial({
                    color: isAmberPre ? 0xf59e0b : 0x0ea5e9,
                    emissive: isAmberPre ? 0xb45309 : 0x0369a1,
                    emissiveIntensity: 0.52,
                    transparent: true,
                    opacity: 0.88,
                    roughness: 0.28
                });
                const bridgeTubeMesh = new THREE.Mesh(bridgeTubeGeo, bridgeTubeMat);
                bridgeTubeMesh.userData.neuronPartId = 'NEURON_SYNAPSE';
                this.connectomeGroup.add(bridgeTubeMesh);

                const isGlutamate = (bridgeCount % 3 !== 0);

                this.synapseBridges.push({
                    id: bridgeCount,
                    prePt: pPre,
                    postPt: pPost,
                    bridgeCurve,
                    cleftCenter,
                    cleftDir: cleftTangent,
                    boutonMesh,
                    cleftMesh,
                    spineMesh,
                    bridgeTubeMesh,
                    isGlutamate,
                    targetNeuron: neuronB,
                    activityTimer: Math.random() * 2.0,
                    pulseWave: 0.0
                });
                bridgeCount++;
            }
        };

        const n = this.neurons;
        connectNeuronPair(n[0], n[4], 2, true);
        connectNeuronPair(n[0], n[2], 1, true);
        connectNeuronPair(n[1], n[0], 2, true);
        connectNeuronPair(n[2], n[4], 2, true);
        connectNeuronPair(n[3], n[2], 2, true);
        connectNeuronPair(n[4], n[7], 2, true);
        connectNeuronPair(n[5], n[0], 2, true);
        connectNeuronPair(n[6], n[7], 2, true);
        connectNeuronPair(n[7], n[0], 2, true);

        for (let idx = 1; idx <= 7; idx++) {
            connectNeuronPair(n[0], n[idx], 2, false);
        }

        connectNeuronPair(n[1], n[3], 2, false);
        connectNeuronPair(n[3], n[2], 1, false);
        connectNeuronPair(n[2], n[4], 1, false);
        connectNeuronPair(n[4], n[7], 1, false);
        connectNeuronPair(n[7], n[6], 2, false);
        connectNeuronPair(n[6], n[5], 2, false);
        if (n.length > 15) {
            connectNeuronPair(n[1], n[8], 1, false);
            connectNeuronPair(n[2], n[9], 1, false);
            connectNeuronPair(n[0], n[10], 1, false);
            connectNeuronPair(n[5], n[13], 1, false);
            connectNeuronPair(n[7], n[15], 1, false);
        }

        // Neurotransmissores de Fluxo de Ida (Anterógrado: Glutamato #fbbf24 / GABA #38bdf8)
        const anteroCount = Math.max(1, bridgeCount) * 22;
        const anteroPos = new Float32Array(anteroCount * 3);
        const anteroCol = new Float32Array(anteroCount * 3);

        const colGlutamate = new THREE.Color(0xfbbf24);
        const colGABA = new THREE.Color(0x38bdf8);

        for (let i = 0; i < anteroCount; i++) {
            const bIdx = Math.floor(i / 22);
            const bridge = this.synapseBridges[bIdx];
            if (!bridge) continue;
            const prog = (i % 22) / 22.0;
            const baseCol = bridge.isGlutamate ? colGlutamate : colGABA;

            const p = bridge.prePt.clone().lerp(bridge.postPt, prog);
            anteroPos[i * 3] = p.x;
            anteroPos[i * 3 + 1] = p.y;
            anteroPos[i * 3 + 2] = p.z;

            anteroCol[i * 3] = baseCol.r;
            anteroCol[i * 3 + 1] = baseCol.g;
            anteroCol[i * 3 + 2] = baseCol.b;

            this.synapticVesicles.push({
                bridgeIndex: bIdx,
                progress: prog,
                speed: 0.85 + (i % 7) * 0.14,
                lateralJitter: ((i % 5) - 2) * 0.045
            });
        }

        const anteroGeo = new THREE.BufferGeometry();
        anteroGeo.setAttribute('position', new THREE.BufferAttribute(anteroPos, 3));
        anteroGeo.setAttribute('color', new THREE.BufferAttribute(anteroCol, 3));

        this.anteroMat = new THREE.PointsMaterial({
            size: 0.55,
            map: this.glowTexture,
            vertexColors: true,
            transparent: true,
            opacity: 0.95,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        this.anteroPoints = new THREE.Points(anteroGeo, this.anteroMat);
        this.confocalGroup.add(this.anteroPoints);

        // Neurotransmissores de Fluxo de Volta (Retrógrado & Recaptação: 2-AG/NO #34d399 + EAAT2/GAT #fef08a)
        const retroCount = Math.max(1, bridgeCount) * 14;
        const retroPos = new Float32Array(retroCount * 3);
        const retroCol = new Float32Array(retroCount * 3);

        const colEndocannabinoid = new THREE.Color(0x34d399);
        const colEAAT2 = new THREE.Color(0xfef08a);

        for (let i = 0; i < retroCount; i++) {
            const bIdx = Math.floor(i / 14);
            const bridge = this.synapseBridges[bIdx];
            if (!bridge) continue;
            const prog = (i % 14) / 14.0;
            const isEndo = (i % 2 === 0);
            const curCol = isEndo ? colEndocannabinoid : colEAAT2;

            const p = bridge.postPt.clone().lerp(bridge.prePt, prog);
            retroPos[i * 3] = p.x;
            retroPos[i * 3 + 1] = p.y;
            retroPos[i * 3 + 2] = p.z;

            retroCol[i * 3] = curCol.r;
            retroCol[i * 3 + 1] = curCol.g;
            retroCol[i * 3 + 2] = curCol.b;

            this.retrogradeParticles.push({
                bridgeIndex: bIdx,
                progress: prog,
                speed: 0.72 + (i % 5) * 0.15,
                isEndo,
                lateralJitter: ((i % 5) - 2) * 0.04
            });
        }

        const retroGeo = new THREE.BufferGeometry();
        retroGeo.setAttribute('position', new THREE.BufferAttribute(retroPos, 3));
        retroGeo.setAttribute('color', new THREE.BufferAttribute(retroCol, 3));

        this.retroMat = new THREE.PointsMaterial({
            size: 0.48,
            map: this.glowTexture,
            vertexColors: true,
            transparent: true,
            opacity: 0.92,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        this.retroPoints = new THREE.Points(retroGeo, this.retroMat);
        this.confocalGroup.add(this.retroPoints);
    }

    /**
     * CONDUÇÃO SALTATÓRIA NOS NÓDULOS DE RANVIER (#00f2fe)
     */
    buildActionPotentialPulses() {
        const pulseCount = 384;
        const positions = new Float32Array(pulseCount * 3);
        const colors = new Float32Array(pulseCount * 3);

        this.actionPulses = [];
        const myelinatedNeurons = this.neurons.filter(n => n.axonCurveGlobal !== null);
        const mLen = Math.max(1, myelinatedNeurons.length);

        for (let i = 0; i < pulseCount; i++) {
            const nr = myelinatedNeurons[i % mLen];
            const tInit = (i * 0.173) % 1.0;
            this.actionPulses.push({
                neuron: nr,
                t: tInit,
                speed: 0.85 + (i % 7) * 0.16
            });

            const localPt = nr.axonCurveGlobal.getPointAt(tInit);
            const worldPt = localPt.clone().multiplyScalar(nr.scale).add(nr.position);
            positions[i * 3] = worldPt.x;
            positions[i * 3 + 1] = worldPt.y;
            positions[i * 3 + 2] = worldPt.z;

            colors[i * 3] = 0.0;
            colors[i * 3 + 1] = 0.95;
            colors[i * 3 + 2] = 1.0;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        this.pulseMat = new THREE.PointsMaterial({
            size: 1.45,
            map: this.glowTexture,
            vertexColors: true,
            transparent: true,
            opacity: 0.95,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        this.pulsePoints = new THREE.Points(geo, this.pulseMat);
        this.connectomeGroup.add(this.pulsePoints);
    }

    setVisible(visible, targetStructureId = null) {
        this.microGroup.visible = visible;
        if (targetStructureId) {
            this.activeTargetStructure = targetStructureId;
        }
    }

    triggerManualSpike() {
        this.spikePhase = 0.01;
        this.firingRateHz = Math.min(95.0, this.targetFiringRateHz + 24.0);
        for (let b = 0; b < this.synapseBridges.length; b++) {
            const br = this.synapseBridges[b];
            if (br.spineMesh && br.spineMesh.material) br.spineMesh.material.emissiveIntensity = 1.4;
            if (br.boutonMesh && br.boutonMesh.material) br.boutonMesh.material.emissiveIntensity = 1.3;
        }
    }

    /**
     * SIMULADOR FISIOPATOLÓGICO MICROSCÓPICO DAS 7 DOENÇAS NEUROLÓGICAS
     */
    setPathologySimulation(diseaseKey, severity = 0.75) {
        this.activeDiseaseKey = diseaseKey || 'HEALTHY';
        this.diseaseSeverity = this.activeDiseaseKey === 'HEALTHY' ? 0.0 : Math.max(0.05, Math.min(1.0, Number(severity) || 0.75));
        const sev = this.diseaseSeverity;
        this.damageRatio = this.activeDiseaseKey === 'HEALTHY' ? 0.0 : sev * 0.78;

        while (this.pathologyMarkersGroup.children.length > 0) {
            this.pathologyMarkersGroup.remove(this.pathologyMarkersGroup.children[0]);
        }

        // Restaura estado basal fotorrealista Âmbar / Ciano
        this.myelinSheaths.forEach(item => {
            const m = item.mesh;
            m.scale.copy(item.baseScale);
            if (m.material) {
                m.material.opacity = 0.88;
                if (m.userData.baseColorHex) m.material.color.setHex(m.userData.baseColorHex);
                if (m.material.emissive && m.userData.baseEmissiveHex) m.material.emissive.setHex(m.userData.baseEmissiveHex);
            }
        });

        this.somaMeshes.forEach(s => {
            s.scale.setScalar(s.userData.baseScale || 1.0);
            if (s.material) {
                if (s.userData.baseColorHex) s.material.color.setHex(s.userData.baseColorHex);
                if (s.material.emissive && s.userData.baseEmissiveHex) s.material.emissive.setHex(s.userData.baseEmissiveHex);
                s.material.opacity = 0.88;
            }
        });

        const spineScale = Math.max(0.18, 1.0 - this.damageRatio * 0.65);
        this.dendriticSpines.forEach(sp => {
            if (sp.mesh) sp.mesh.scale.setScalar(sp.baseScale * spineScale);
        });

        if (this.activeDiseaseKey === 'HEALTHY' || sev <= 0.01) {
            this.damageRatio = 0.0;
            this.targetFiringRateHz = 18.0;
            this.firingRateHz = 18.0;
            this.cbfPerfusion = 54;
            this.conductionVelocityMs = 110;
            return;
        }

        if (this.activeDiseaseKey === 'ALZHEIMER') {
            const plaqueMat = new THREE.MeshPhysicalMaterial({ color: 0xd97706, emissive: 0x92400e, emissiveIntensity: 0.65, roughness: 0.55 });
            const tangleMat = new THREE.MeshPhysicalMaterial({ color: 0xef4444, emissive: 0x7f1d1d, emissiveIntensity: 0.72, wireframe: true });
            this.neurons.slice(0, 28).forEach((n, idx) => {
                if (idx % 2 === 0) {
                    const p = new THREE.Mesh(new THREE.DodecahedronGeometry(0.42 + (idx % 3) * 0.14, 1), plaqueMat);
                    p.position.copy(n.somaPos).add(new THREE.Vector3(1.5, 0.85, 0.55));
                    this.pathologyMarkersGroup.add(p);
                }
                const tangle = new THREE.Mesh(new THREE.TorusKnotGeometry(0.36, 0.07, 24, 6), tangleMat);
                tangle.position.copy(n.somaPos);
                this.pathologyMarkersGroup.add(tangle);
            });
            this.targetFiringRateHz = Math.max(6.5, 18.0 - 9.5 * sev);
            this.firingRateHz = this.targetFiringRateHz;
            this.cbfPerfusion = Math.round(54 - 18 * sev);
            this.conductionVelocityMs = Math.round(110 - 44 * sev);
        } else if (this.activeDiseaseKey === 'PARKINSON') {
            const lewyMat = new THREE.MeshPhysicalMaterial({ color: 0xf43f5e, emissive: 0xbe123c, emissiveIntensity: 0.82, roughness: 0.22 });
            this.neurons.slice(0, 32).forEach(n => {
                const lewy = new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 16), lewyMat);
                lewy.position.copy(n.somaPos).add(new THREE.Vector3(-0.38, -0.25, 0.32));
                this.pathologyMarkersGroup.add(lewy);
            });
            this.targetFiringRateHz = 5.2;
            this.firingRateHz = 5.2;
            this.cbfPerfusion = Math.round(54 - 10 * sev);
            this.conductionVelocityMs = Math.round(110 - 34 * sev);
        } else if (this.activeDiseaseKey === 'MULTIPLE_SCLEROSIS') {
            this.myelinSheaths.forEach((item, idx) => {
                if (idx % 2 === 0 || idx % 5 === 0) {
                    const shrink = Math.max(0.32, 1.0 - 0.65 * sev);
                    item.mesh.scale.set(item.baseScale.x * shrink, item.baseScale.y, item.baseScale.z * shrink);
                    if (item.mesh.material) {
                        item.mesh.material.opacity = Math.max(0.16, 0.88 - 0.65 * sev);
                        item.mesh.material.color.setHex(0xef4444);
                        if (item.mesh.material.emissive) item.mesh.material.emissive.setHex(0x7f1d1d);
                    }
                }
            });
            this.targetFiringRateHz = Math.max(5.5, 18.0 - 11.2 * sev);
            this.firingRateHz = this.targetFiringRateHz;
            this.cbfPerfusion = Math.round(54 - 8 * sev);
            this.conductionVelocityMs = Math.max(16, Math.round(110 * (1.0 - 0.80 * sev)));
        } else if (this.activeDiseaseKey === 'PRION_DCJ') {
            // Vacúolos espongiformes translúcidos + placas amiloides Kuru em estrela (idênticos ao simulador da DCJ!)
            const vacMat = new THREE.MeshPhysicalMaterial({
                color: 0xe2e8f0,
                emissive: 0x38bdf8,
                emissiveIntensity: 0.24,
                transmission: 0.92,
                transparent: true,
                opacity: 0.55,
                roughness: 0.08
            });
            const needleGeo = new THREE.CylinderGeometry(0.015, 0.042, 0.95, 5);
            needleGeo.translate(0, 0.47, 0);
            const matRuby = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xdc2626, emissiveIntensity: 0.95 });

            this.neurons.slice(0, 30).forEach((n, idx) => {
                const v = new THREE.Mesh(new THREE.SphereGeometry(0.45 + (idx % 3) * 0.16, 18, 16), vacMat);
                v.position.copy(n.somaPos).add(new THREE.Vector3(0.65, (idx % 2 === 0 ? 0.75 : -0.75), 0.45));
                this.pathologyMarkersGroup.add(v);

                if (idx < 14) {
                    const plaqueGroup = new THREE.Group();
                    for (let k = 0; k < 12; k++) {
                        const m = new THREE.Mesh(needleGeo, matRuby);
                        const theta = (k / 12) * Math.PI * 2;
                        const phi = Math.acos(2 * ((k * 0.37) % 1) - 1);
                        m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(Math.sin(phi) * Math.cos(theta), Math.sin(phi) * Math.sin(theta), Math.cos(phi)));
                        plaqueGroup.add(m);
                    }
                    plaqueGroup.position.copy(n.somaPos).add(new THREE.Vector3(-1.2, 0.4, 0.6));
                    plaqueGroup.scale.setScalar(0.85 * sev);
                    this.pathologyMarkersGroup.add(plaqueGroup);
                }
            });
            this.targetFiringRateHz = Math.max(4.5, 18.0 - 12.5 * sev);
            this.firingRateHz = this.targetFiringRateHz;
            this.cbfPerfusion = Math.round(54 - 24 * sev);
            this.conductionVelocityMs = Math.round(110 - 66 * sev);
        } else if (this.activeDiseaseKey === 'ALS_ELA') {
            const tdpMat = new THREE.MeshPhysicalMaterial({ color: 0xf97316, emissive: 0x9a3412, emissiveIntensity: 0.72 });
            this.neurons.slice(0, 24).forEach(n => {
                if (n.axonCurveGlobal) {
                    const localMid = n.axonCurveGlobal.getPointAt(0.45);
                    const worldMid = localMid.clone().multiplyScalar(n.scale).add(n.position);
                    const spheroid = new THREE.Mesh(new THREE.SphereGeometry(0.32, 14, 14), tdpMat);
                    spheroid.scale.set(1.6, 0.9, 0.9);
                    spheroid.position.copy(worldMid);
                    this.pathologyMarkersGroup.add(spheroid);
                }
            });
            this.targetFiringRateHz = Math.max(5.0, 18.0 - 11.5 * sev);
            this.firingRateHz = this.targetFiringRateHz;
            this.cbfPerfusion = Math.round(54 - 12 * sev);
            this.conductionVelocityMs = Math.round(110 - 74 * sev);
        } else if (this.activeDiseaseKey === 'EPILEPSY') {
            this.damageRatio = 0.0;
            this.targetFiringRateHz = Math.round(18.0 + 52.0 * sev);
            this.firingRateHz = this.targetFiringRateHz;
            this.cbfPerfusion = Math.round(54 + 32 * sev);
            this.conductionVelocityMs = Math.round(110 + 16 * sev);
        } else if (this.activeDiseaseKey === 'ISCHEMIC_STROKE') {
            this.somaMeshes.slice(0, 20).forEach(s => {
                if (s.material) {
                    s.material.color.setHex(0xf43f5e);
                    if (s.material.emissive) s.material.emissive.setHex(0x991b1b);
                }
            });
            this.targetFiringRateHz = Math.max(2.0, 18.0 * (1.0 - 0.85 * sev));
            this.firingRateHz = this.targetFiringRateHz;
            this.cbfPerfusion = Math.max(8, Math.round(54 * (1.0 - 0.82 * sev)));
            this.conductionVelocityMs = Math.max(18, Math.round(110 * (1.0 - 0.72 * sev)));
        }
    }

    /**
     * ATUALIZAÇÃO EM TEMPO REAL DO POTENCIAL DE AÇÃO, NEUROTRANSMISSORES BIDIRECIONAIS E CONDUÇÃO SALTATÓRIA
     */
    update(dt, elapsed) {
        const sev = this.diseaseSeverity;
        const mode = this.activeDiseaseKey;
        const spikeInterval = mode === 'EPILEPSY' ? 0.22 : (mode === 'PARKINSON' ? 0.32 : (mode === 'ISCHEMIC_STROKE' ? 2.4 : 0.95));

        this.autoSpikeTimer += dt;
        if (this.autoSpikeTimer >= spikeInterval && this.spikePhase === 0.0) {
            this.autoSpikeTimer = 0.0;
            this.spikePhase = 0.01;
        }

        if (mode === 'ISCHEMIC_STROKE' && sev > 0.05) {
            const anoxicBase = -70.0 + 46.0 * sev;
            this.membranePotentialMv = anoxicBase + Math.sin(elapsed * 7.5) * (4.5 * (1.0 - 0.5 * sev));
        } else if (mode === 'EPILEPSY' && sev > 0.05) {
            const burstEnv = Math.sin(elapsed * 4.5);
            if (burstEnv > -0.2) {
                this.membranePotentialMv = -45.0 + Math.sin(elapsed * 55.0) * 48.0 * sev + 18.0 * burstEnv;
            } else {
                this.membranePotentialMv = -78.0 + Math.sin(elapsed * 8.0) * 4.0;
            }
        } else if (mode === 'PARKINSON' && sev > 0.05) {
            const tremorWave = Math.sin(elapsed * 31.4);
            if (tremorWave > 0.35) {
                this.membranePotentialMv = -55.0 + Math.sin(elapsed * 95.0) * 38.0;
            } else {
                this.membranePotentialMv = -72.0 + tremorWave * 5.0;
            }
        } else if (mode === 'PRION_DCJ' && sev > 0.05) {
            const pswcPhase = (elapsed * 1.4) % 1.0;
            if (pswcPhase < 0.18) {
                this.membranePotentialMv = -70.0 + Math.sin((pswcPhase / 0.18) * Math.PI) * 95.0;
            } else if (pswcPhase < 0.32) {
                this.membranePotentialMv = -86.0;
            } else {
                this.membranePotentialMv = -70.0 + Math.sin(elapsed * 12.0) * 3.5;
            }
        } else {
            const speedMul = (mode === 'MULTIPLE_SCLEROSIS' || mode === 'ALS_ELA') ? (1.0 - 0.45 * sev) : 1.0;
            const peakAttenuation = (mode === 'ALZHEIMER' || mode === 'MULTIPLE_SCLEROSIS') ? (1.0 - 0.32 * sev) : 1.0;
            if (this.spikePhase > 0.0) {
                this.spikePhase += dt * 3.8 * speedMul;
                if (this.spikePhase < 0.25) {
                    this.membranePotentialMv = -70.0 + (this.spikePhase / 0.25) * (110.0 * peakAttenuation);
                } else if (this.spikePhase < 0.60) {
                    const tRep = (this.spikePhase - 0.25) / 0.35;
                    const peakMv = -70.0 + 110.0 * peakAttenuation;
                    this.membranePotentialMv = peakMv - tRep * (peakMv - (-84.0));
                } else if (this.spikePhase < 1.0) {
                    const tRest = (this.spikePhase - 0.60) / 0.40;
                    this.membranePotentialMv = -84.0 + tRest * 14.0;
                } else {
                    this.membranePotentialMv = -70.0;
                    this.spikePhase = 0.0;
                }
            } else {
                this.membranePotentialMv = -70.0 + Math.sin(elapsed * 4.5) * 1.6;
            }
        }

        this.firingRateHz += (this.targetFiringRateHz - this.firingRateHz) * Math.min(1.0, dt * 3.5);

        if (!this.microGroup.visible) return;

        const firingRateScale = mode === 'EPILEPSY'
            ? (1.35 + 0.85 * sev)
            : Math.max(0.18, 1.0 - this.damageRatio * 0.75);

        // 1. Fluxo Anterógrado (Pré -> Pós: L-Glutamato #fbbf24 e GABA #38bdf8)
        if (this.anteroPoints && this.synapticVesicles.length > 0) {
            const posAttr = this.anteroPoints.geometry.getAttribute('position');
            const colAttr = this.anteroPoints.geometry.getAttribute('color');
            const colGold = new THREE.Color(0xfbbf24);
            const colCyan = new THREE.Color(0x38bdf8);
            const colPathBlock = new THREE.Color(0xdc2626);

            for (let i = 0; i < this.synapticVesicles.length; i++) {
                const v = this.synapticVesicles[i];
                const bridge = this.synapseBridges[v.bridgeIndex];
                if (!bridge) continue;

                v.progress += dt * v.speed * firingRateScale;
                if (v.progress >= 1.0) {
                    v.progress = 0.0;
                    if (bridge.spineMesh && bridge.spineMesh.material) {
                        bridge.spineMesh.material.emissiveIntensity = 1.35 * firingRateScale;
                    }
                }

                const basePt = bridge.bridgeCurve
                    ? bridge.bridgeCurve.getPointAt(THREE.MathUtils.clamp(v.progress, 0, 1))
                    : bridge.prePt.clone().lerp(bridge.postPt, v.progress);
                basePt.x += Math.sin(v.progress * Math.PI) * v.lateralJitter;
                basePt.y += Math.sin(elapsed * 4.0 + i) * 0.04;

                posAttr.setXYZ(i, basePt.x, basePt.y, basePt.z);

                const isBlocked = (this.damageRatio > 0.35) && (Math.sin(i * 1.7 + elapsed) > 0.3);
                const c = isBlocked ? colPathBlock : (bridge.isGlutamate ? colGold : colCyan);
                colAttr.setXYZ(i, c.r, c.g, c.b);
            }
            posAttr.needsUpdate = true;
            colAttr.needsUpdate = true;
        }

        // 2. Fluxo Retrógrado & Recaptação (Pós -> Pré: Endocanabinoides 2-AG/NO #34d399 e EAAT2 #fef08a)
        if (this.retroPoints && this.retrogradeParticles.length > 0) {
            const rPosAttr = this.retroPoints.geometry.getAttribute('position');
            const rColAttr = this.retroPoints.geometry.getAttribute('color');
            const colEndo = new THREE.Color(0x34d399);
            const colEAAT2 = new THREE.Color(0xfef08a);

            for (let i = 0; i < this.retrogradeParticles.length; i++) {
                const r = this.retrogradeParticles[i];
                const bridge = this.synapseBridges[r.bridgeIndex];
                if (!bridge) continue;

                r.progress += dt * r.speed * firingRateScale;
                if (r.progress >= 1.0) {
                    r.progress = 0.0;
                    if (bridge.boutonMesh && bridge.boutonMesh.material) {
                        bridge.boutonMesh.material.emissiveIntensity = 1.15 * firingRateScale;
                    }
                }

                const basePt = bridge.bridgeCurve
                    ? bridge.bridgeCurve.getPointAt(THREE.MathUtils.clamp(1.0 - r.progress, 0, 1))
                    : bridge.postPt.clone().lerp(bridge.prePt, r.progress);
                basePt.x += Math.sin(r.progress * Math.PI) * r.lateralJitter;
                basePt.z += Math.cos(elapsed * 3.5 + i) * 0.04;

                rPosAttr.setXYZ(i, basePt.x, basePt.y, basePt.z);
                const c = r.isEndo ? colEndo : colEAAT2;
                rColAttr.setXYZ(i, c.r, c.g, c.b);
            }
            rPosAttr.needsUpdate = true;
            rColAttr.needsUpdate = true;
        }

        // 3. Condução Saltatória nos Nódulos de Ranvier (#00f2fe)
        const isHealthyNeuropil = (this.damageRatio < 0.2);
        const saltatorySpeedMult = mode === 'EPILEPSY'
            ? (1.4 + 0.9 * sev)
            : (isHealthyNeuropil ? 1.0 : Math.max(0.08, Math.pow(1.0 - this.damageRatio, 1.6)));

        if (this.pulsePoints && this.actionPulses.length > 0) {
            const posAttr = this.pulsePoints.geometry.getAttribute('position');
            const colAttr = this.pulsePoints.geometry.getAttribute('color');

            for (let i = 0; i < this.actionPulses.length; i++) {
                const pulse = this.actionPulses[i];
                const nr = pulse.neuron;
                if (!nr || !nr.axonCurveGlobal) continue;

                pulse.t = (pulse.t + dt * pulse.speed * saltatorySpeedMult * 0.38) % 1.0;
                const localPt = nr.axonCurveGlobal.getPointAt(pulse.t);
                const worldPt = localPt.clone().multiplyScalar(nr.scale).add(nr.position);
                posAttr.setXYZ(i, worldPt.x, worldPt.y, worldPt.z);

                if (colAttr) {
                    if (isHealthyNeuropil) {
                        colAttr.setXYZ(i, 0.0, 0.95, 1.0);
                    } else {
                        const rCol = THREE.MathUtils.lerp(0.0, 0.94, this.damageRatio);
                        const gCol = THREE.MathUtils.lerp(0.95, 0.27, this.damageRatio);
                        const bCol = THREE.MathUtils.lerp(1.0, 0.27, this.damageRatio);
                        colAttr.setXYZ(i, rCol, gCol, bCol);
                    }
                }
            }
            posAttr.needsUpdate = true;
            if (colAttr) colAttr.needsUpdate = true;
        }

        // 4. Pulsação rítmica dos Nódulos de Ranvier (#00f2fe)
        for (let r = 0; r < this.ranvierNodes.length; r++) {
            const node = this.ranvierNodes[r];
            const ranvierDim = Math.max(0.18, 1.0 - this.damageRatio * 0.82);
            const healthRhythm = isHealthyNeuropil
                ? (0.82 + 0.32 * Math.sin(elapsed * 12.0 + r * 1.5))
                : (0.55 + 0.22 * Math.sin(elapsed * 3.0 + r));
            if (node.sprite && node.sprite.material) {
                node.sprite.material.opacity = Math.min(1.0, 0.95 * ranvierDim * healthRhythm);
            }
        }
    }
}

window.NeuralMicrocosmos3D = NeuralMicrocosmos3D;
