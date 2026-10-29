// MOZOK v7.0 — NeuralMicrocosmos3D (54-180 Connected Neurons, Axo-Dendritic & Axo-Axonic Synapses, 7 Pathologies)
class NeuralMicrocosmos3D {
    constructor(scene, renderer = null) {
        this.scene = scene;
        this.renderer = renderer;
        this.microGroup = new THREE.Group();
        this.microGroup.visible = false;
        this.scene.add(this.microGroup);
        this.networkGroup = new THREE.Group();
        this.microGroup.add(this.networkGroup);
        this.pathologyMarkersGroup = new THREE.Group();
        this.microGroup.add(this.pathologyMarkersGroup);
        this.neurons = [];
        this.synapseConnections = [];
        this.myelinMeshes = [];
        this.somaMeshes = [];
        this.interactiveParts = [];
        this.partAnchors = new Map();
        this.selectedPartId = 'NEURON_SOMA';
        this.activeTargetStructure = 'FRONTAL_LOBE';
        this.activeDiseaseKey = 'HEALTHY';
        this.diseaseSeverity = 0.0;
        this.firingRateHz = 18.0;
        this.targetFiringRateHz = 18.0;
        this.cbfPerfusion = 54;
        this.conductionVelocityMs = 110;
        this.membranePotentialMv = -70.0;
        this.spikePhase = 0.0;
        this.autoSpikeTimer = 0.0;
        this.gpuTierInfo = this.detectDeviceGpuPower();
        this.targetNeuronCount = this.gpuTierInfo.recommendedNeurons;
        this.neuronPartsOntology = {
            'NEURON_SOMA': {
                id: 'NEURON_SOMA',
                name: 'Corpo Celular (Soma / Pericário)',
                latin: 'Soma Neuronale / Perikaryon',
                category: 'Citoarquitetura Neuronal',
                badge: 'CENTRO METABÓLICO E INTEGRADOR',
                summary: 'Centro trófico e metabólico do neurônio que integra todos os potenciais pós-sinápticos excitatórios (PEPS) e inibitórios (PIPS) vindos da árvore dendrítica antes de disparar no Cone de Implantação.',
                functions: [
                    'Integração espacial e temporal de potenciais pós-sinápticos (PEPS e PIPS)',
                    'Síntese proteica intensa nos Corpúsculos de Nissl (retículo endoplasmático rugoso) e Complexo de Golgi',
                    'Manutenção do potencial de repouso em -70 mV via bomba Na+/K+-ATPase com suporte mitocondrial'
                ],
                neurotransmitters: ['Glutamato (Síntese)', 'GABA', 'Acetilcolina', 'Dopamina'],
                clinical: 'Cromatólise central após lesão axonal; acúmulo intracelular de Corpos de Lewy (alfa-sinucleína no Parkinson), emaranhados neurofibrilares de Tau (Alzheimer) e agregados de TDP-43 (ELA).'
            },
            'NEURON_NUCLEUS': {
                id: 'NEURON_NUCLEUS',
                name: 'Núcleo Neuronal, Nucléolo & Corpúsculos de Nissl',
                latin: 'Nucleus Neuronalis, Nucleolus & Substantia Chromatophilica',
                category: 'Citoarquitetura Neuronal',
                badge: 'GENOMA, TRANSCRIÇÃO E ORGANELAS',
                summary: 'Grande núcleo esférico central de eucromatina ativa com nucléolo proeminente, rodeado por Corpúsculos de Nissl (RER) e mitocôndrias que abastecem toda a árvore axodendrítica.',
                functions: [
                    'Transcrição de genes imediatos (c-Fos, BDNF, Arc) durante a Potenciação de Longa Duração (LTP)',
                    'Biogênese intensa de ribossomos no nucléolo para tradução de canais iônicos e receptores',
                    'Fornecimento de ATP mitocondrial para sustentar o transporte axonal anterógrado e retrógrado'
                ],
                neurotransmitters: ['CREB (Fator de Transcrição)', 'BDNF (Neurotrofina)', 'ATP Mitocondrial'],
                clinical: 'Inclusões intranucleares neuronais em doenças por expansão de poliglutaminas (Doença de Huntington e Ataxias Espinocerebelares) e falência bioenergética mitocondrial no AVC.'
            },
            'NEURON_DENDRITES': {
                id: 'NEURON_DENDRITES',
                name: 'Dendritos Ramificados & Espinhas Dendríticas',
                latin: 'Dendriti & Spinae Dendriticae',
                category: 'Recepção Sináptica (Input)',
                badge: 'ÁRVORE RECEPTORA MULTINÍVEL',
                summary: 'Arborizações citoplasmáticas fractais cobertas por milhares de espinhas dendríticas pós-sinápticas que recebem botões terminais de dezenas de neurônios vizinhos na rede.',
                functions: [
                    'Recepção de neurotransmissores em receptores ionotrópicos (AMPA, NMDA, GABA-A) e metabotrópicos',
                    'Condução eletrotônica de potenciais graduados (PEPS e PIPS) rumo ao soma neuronal',
                    'Plasticidade estrutural das espinhas dendríticas (base anatômica da memória e aprendizagem)'
                ],
                neurotransmitters: ['Glutamato (Receptores AMPA/NMDA)', 'GABA (Receptores GABA-A/B)'],
                clinical: 'Retração e perda de espinhas dendríticas na Doença de Alzheimer, encefalopatias priônicas (DCJ) e estresse crônico hiperglutamatérgico.'
            },
            'NEURON_AXON': {
                id: 'NEURON_AXON',
                name: 'Axônio & Cone de Implantação (Zona de Gatilho)',
                latin: 'Axon & Collis Axonis',
                category: 'Condução Bioelétrica (Output)',
                badge: 'CABO DE TRANSMISSÃO E TRANSPORTE AXOPLASMÁTICO',
                summary: 'Prolongamento cilíndrico único que emerge do Cone de Implantação (altíssima densidade de canais Nav1.6) para conduzir o Potencial de Ação tudo-ou-nada até os neurônios-alvo.',
                functions: [
                    'Geração do Potencial de Ação quando o Cone de Implantação cruza o limiar de -55 mV',
                    'Condução bioelétrica ortodrômica rápida (+40 mV) sem atenuação de amplitude',
                    'Transporte axoplasmático rápido anterógrado (cinesina) e retrógrado (dineína) sobre microtúbulos estabilizados por proteína Tau'
                ],
                neurotransmitters: ['Íons Na+ (Influxo Rápido Nav1.6)', 'Íons K+ (Efluxo Repolarizante Kv1)'],
                clinical: 'Lesão Axonal Difusa (LAD) em traumatismo cranioencefálico, desintegração de microtúbulos por Tau hiperfosforilada no Alzheimer e degeneração axonal motora na ELA.'
            },
            'NEURON_MYELIN': {
                id: 'NEURON_MYELIN',
                name: 'Bainha de Mielina Multilamelar',
                latin: 'Vagina Myelinica',
                category: 'Isolamento Elétrico & Velocidade',
                badge: 'ISOLANTE LIPOPROTEICO DE ALTA VELOCIDADE',
                summary: 'Envoltório espiralado compacto (80% lipídios, 20% proteínas MBP/PLP) que isola eletricamente os internodos axonais, reduzindo a capacitância de membrana e impedindo vazamento de corrente.',
                functions: [
                    'Isolamento dielétrico de alta resistência ao longo de cada segmento internodal do axônio',
                    'Multiplicação da velocidade de condução nervosa de ~1 m/s para até 120 m/s',
                    'Economia metabólica drástica de ATP ao restringir os fluxos iônicos aos Nódulos de Ranvier'
                ],
                neurotransmitters: ['Proteína Básica da Mielina (MBP)', 'Proteína Proteolipídica (PLP)', 'Esfingomielina'],
                clinical: 'Alvo direto do ataque autoimune na Esclerose Múltipla (SNC) e na Síndrome de Guillain-Barré (SNP), causando lentificação ou bloqueio de condução.'
            },
            'NEURON_SCHWANN': {
                id: 'NEURON_SCHWANN',
                name: 'Célula de Schwann / Oligodendrócito',
                latin: 'Neurolemmocytus / Oligodendrocytus',
                category: 'Glia Mielinizante',
                badge: 'CÉLULA GLIAL PRODUTORA DE MIELINA',
                summary: 'Célula glial especializada cujo núcleo verde-esmeralda repousa na camada externa (neurilema) da bainha de mielina, fornecendo suporte trófico de lactato ao axônio.',
                functions: [
                    'Enrolamento espiralado de dezenas de lamelas lipoproteicas ao redor do axônio',
                    'Acoplamento metabólico glia-axônio (transporte de lactato via transportadores MCT1/MCT2)',
                    'Formação das Bandas de Büngner para guiar a regeneração axonal periférica após lesão'
                ],
                neurotransmitters: ['Neuregulina-1 (NRG1)', 'Fator Neurotrófico Derivado da Glia (GDNF)'],
                clinical: 'Destruição de oligodendrócitos na Esclerose Múltipla, Schwannomas vestibulares (VIII par) e neuropatias hereditárias de Charcot-Marie-Tooth.'
            },
            'NEURON_RANVIER': {
                id: 'NEURON_RANVIER',
                name: 'Nódulo de Ranvier (Condução Saltatória)',
                latin: 'Nodus Neurofibrae (Ranvieri)',
                category: 'Condução Saltatória',
                badge: 'REGENERADOR DE POTENCIAL DE AÇÃO',
                summary: 'Interrupção periódica amielínica entre dois internodos de mielina onde a densidade de canais de Na+ dependentes de voltagem supera 1.200 canais/µm², gerando o salto do impulso.',
                functions: [
                    'Regeneração explosiva do Potencial de Ação de nó em nó (Condução Saltatória)',
                    'Influxo maciço de Na+ (Nav1.6) no nódulo e repolarização por canais de K+ (Kv1.1/1.2) justaparanodais',
                    'Sincronização temporal de alta precisão entre redes neuronais distantes'
                ],
                neurotransmitters: ['Canais Nav1.6', 'Canais Kv1.1 / Kv1.2', 'Complexo Caspr / Contactina / Neurofascina-186'],
                clinical: 'Exposição de canais de K+ paranodais após desmielinização (Esclerose Múltipla) dissipa a corrente local e provoca bloqueio da condução saltatória.'
            },
            'NEURON_TERMINAL': {
                id: 'NEURON_TERMINAL',
                name: 'Terminal do Axônio (Telodendro & Botões Sinápticos)',
                latin: 'Telodendria & Terminatio Axonis',
                category: 'Transmissão Pré-Sináptica',
                badge: 'ARBORIZAÇÃO TERMINAL E EXOCITOSE',
                summary: 'Ramificação distal múltipla do axônio (telodendro) terminando em botões sinápticos repletos de mitocôndrias, canais de Ca2+ (Cav2.1/2.2) e vesículas sinápticas ancoradas na zona ativa.',
                functions: [
                    'Transdução do Potencial de Ação elétrico em liberação química quantal de neurotransmissores',
                    'Influxo de Ca2+ ativado por voltagem acionando a proteína sensora Sinaptotagmina',
                    'Fusão de vesículas na membrana pré-sináptica pelo complexo SNARE (Sinaptobrevina, Sintaxina-1, SNAP-25)'
                ],
                neurotransmitters: ['Íons Ca2+ (Gatilho de Exocitose)', 'Complexo SNARE', 'Vesículas Sinápticas'],
                clinical: 'Bloqueio pré-sináptico na Síndrome Miastênica de Lambert-Eaton (autoanticorpos anti-Cav2.1) e clivagem do complexo SNARE por neurotoxinas botulínica e tetânica.'
            },
            'NEURON_SYNAPSE': {
                id: 'NEURON_SYNAPSE',
                name: 'Sinapses Conectadas (Axodendrítica & Axoaxônica)',
                latin: 'Synapsis Chimica (Axodendritica & Axoaxonica)',
                category: 'Conectoma Interneuronal',
                badge: 'CONEXÃO AXÔNIO-DENDRITO E AXÔNIO-AXÔNIO',
                summary: 'Junções comunicantes (~20 nm) que interligam todos os 50+ neurônios da rede: terminais axonais conectam-se diretamente às espinhas dendríticas (sinapse axodendrítica) ou ao axônio vizinho (sinapse axoaxônica).',
                functions: [
                    'Sinapse Axodendrítica: transmissão excitatória (Glutamato -> PEPS) ou inibitória (GABA -> PIPS) para os dendritos do neurônio seguinte',
                    'Sinapse Axoaxônica: modulação pré-sináptica direta sobre o cone ou terminal axonal de outro neurônio, regulando a liberação de vesículas',
                    'Propagação em cascata de ondas de disparo ao longo de toda a rede neuronal tridimensional'
                ],
                neurotransmitters: ['Glutamato', 'GABA', 'Dopamina', 'Acetilcolina', 'Serotonina', 'Noradrenalina'],
                clinical: 'Hiperexcitabilidade paroxística na Epilepsia, excitotoxicidade glutamatérgica no AVC e na ELA, e perda sináptica precoce na Doença de Alzheimer.'
            }
        };
        this.initSharedMaterials();
        this.buildCompleteConnectedNeuronNetwork(this.targetNeuronCount);
    }
    detectDeviceGpuPower() {
        let gpuRenderer = 'WebGL2 GPU';
        let tier = 'HIGH';
        let recommendedNeurons = 90;
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
            const highPerfRegex = /NVIDIA|GeForce|RTX|GTX|Radeon RX|Apple M[1-9]|Arc A[57]/i;
            const lowPerfRegex = /Mali|Adreno|PowerVR|Intel\(R\) HD|UHD Graphics 6/i;
            if (highPerfRegex.test(gpuRenderer) && !isMobileScreen) {
                tier = 'ULTRA (GPU Dedicada)';
                recommendedNeurons = 135;
            } else if (isMobileScreen || lowPerfRegex.test(gpuRenderer) || cores <= 4 || mem <= 4) {
                tier = 'ADAPTATIVO (Mínimo 54 Neurônios)';
                recommendedNeurons = 54; // Estritamente >= 50 neurônios mesmo em celulares/integrada!
            } else {
                tier = 'ALTO (Desktop)';
                recommendedNeurons = 90;
            }
        } catch (_) {
            recommendedNeurons = 75;
        }
        return {
            tier,
            gpuRenderer,
            recommendedNeurons: Math.max(50, recommendedNeurons)
        };
    }
    initSharedMaterials() {
        this.materials = {
            somaMat: new THREE.MeshPhysicalMaterial({
                color: 0xa855f7,
                emissive: 0x581c87,
                emissiveIntensity: 0.38,
                roughness: 0.18,
                metalness: 0.02,
                transmission: 0.68,
                transparent: true,
                opacity: 0.52,
                depthWrite: false,
                clearcoat: 0.9,
                side: THREE.DoubleSide
            }),
            nucleusMat: new THREE.MeshPhysicalMaterial({
                color: 0xff6b00,
                emissive: 0xea580c,
                emissiveIntensity: 0.72,
                roughness: 0.24,
                clearcoat: 0.85
            }),
            nucleolusMat: new THREE.MeshBasicMaterial({
                color: 0xfef08a
            }),
            nisslMat: new THREE.MeshBasicMaterial({
                color: 0x38bdf8,
                transparent: true,
                opacity: 0.82
            }),
            dendriteMat: new THREE.MeshPhysicalMaterial({
                color: 0xc084fc,
                emissive: 0x6b21a8,
                emissiveIntensity: 0.34,
                roughness: 0.26,
                clearcoat: 0.75
            }),
            spineMat: new THREE.MeshPhysicalMaterial({
                color: 0xe879f9,
                emissive: 0xa21caf,
                emissiveIntensity: 0.48,
                roughness: 0.22
            }),
            axonCoreMat: new THREE.MeshPhysicalMaterial({
                color: 0xe2e8f0,
                emissive: 0x38bdf8,
                emissiveIntensity: 0.40,
                roughness: 0.22,
                clearcoat: 0.8
            }),
            myelinMat: new THREE.MeshPhysicalMaterial({
                color: 0xfacc15,
                emissive: 0xca8a04,
                emissiveIntensity: 0.34,
                roughness: 0.22,
                transmission: 0.45,
                transparent: true,
                opacity: 0.82,
                clearcoat: 0.85
            }),
            schwannNucleusMat: new THREE.MeshPhysicalMaterial({
                color: 0x10b981,
                emissive: 0x059669,
                emissiveIntensity: 0.58,
                roughness: 0.25,
                clearcoat: 0.8
            }),
            ranvierMat: new THREE.MeshBasicMaterial({
                color: 0x00f2fe,
                transparent: true,
                opacity: 0.94
            }),
            terminalMat: new THREE.MeshPhysicalMaterial({
                color: 0xf472b6,
                emissive: 0xdb2777,
                emissiveIntensity: 0.48,
                roughness: 0.25,
                clearcoat: 0.8
            })
        };
    }
    registerNeuronPart(partId, meshOrGroup, anchorVec = null) {
        meshOrGroup.userData.neuronPartId = partId;
        meshOrGroup.userData.structureId = partId;
        if (meshOrGroup.isMesh) {
            this.interactiveParts.push(meshOrGroup);
        }
        if (meshOrGroup.children) {
            meshOrGroup.children.forEach(c => {
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
        return new THREE.Vector3(0, 0, 0);
    }
    setNeuronCount(count) {
        const clamped = Math.max(50, Math.min(200, Math.round(Number(count) || 54)));
        if (clamped === this.targetNeuronCount && this.neurons.length === clamped) return clamped;
        this.targetNeuronCount = clamped;
        this.buildCompleteConnectedNeuronNetwork(clamped);
        if (this.activeDiseaseKey !== 'HEALTHY') {
            this.setPathologySimulation(this.activeDiseaseKey, this.diseaseSeverity);
        }
        return clamped;
    }
    buildCompleteConnectedNeuronNetwork(totalCount = 90) {
        const count = Math.max(50, totalCount);
        while (this.networkGroup.children.length > 0) {
            this.networkGroup.remove(this.networkGroup.children[0]);
        }
        this.neurons = [];
        this.synapseConnections = [];
        this.myelinMeshes = [];
        this.somaMeshes = [];
        this.interactiveParts = [];
        this.partAnchors.clear();
        this.buildHeroDetailedNeuron({
            index: 0,
            isPrimary: true,
            somaPos: new THREE.Vector3(-6.2, 0.4, 0.0),
            axonPoints: [
                new THREE.Vector3(-5.1, 0.35, 0.0),
                new THREE.Vector3(-3.2, 0.15, 0.25),
                new THREE.Vector3(-1.1, 0.28, -0.15),
                new THREE.Vector3(1.0, 0.12, 0.18),
                new THREE.Vector3(2.8, 0.22, 0.0)
            ],
            dendriteTargets: [
                new THREE.Vector3(-8.6, 2.8, 1.2),
                new THREE.Vector3(-9.1, 1.1, -1.4),
                new THREE.Vector3(-8.8, -1.6, 0.9),
                new THREE.Vector3(-7.4, -2.5, -1.1),
                new THREE.Vector3(-6.6, 3.1, -0.8),
                new THREE.Vector3(-5.8, -2.4, 1.4)
            ],
            terminalBranches: [
                {
                    type: 'AXODENDRITIC',
                    targetNeuronIndex: 1,
                    points: [
                        new THREE.Vector3(2.8, 0.22, 0.0),
                        new THREE.Vector3(3.85, 1.15, 0.35),
                        new THREE.Vector3(4.65, 1.65, 0.22)
                    ]
                },
                {
                    type: 'AXODENDRITIC',
                    targetNeuronIndex: 1,
                    points: [
                        new THREE.Vector3(2.8, 0.22, 0.0),
                        new THREE.Vector3(3.95, 0.35, -0.35),
                        new THREE.Vector3(4.82, 0.55, -0.28)
                    ]
                },
                {
                    type: 'AXODENDRITIC',
                    targetNeuronIndex: 1,
                    points: [
                        new THREE.Vector3(2.8, 0.22, 0.0),
                        new THREE.Vector3(3.75, -0.65, 0.25),
                        new THREE.Vector3(4.58, -0.45, 0.12)
                    ]
                }
            ]
        });
        this.buildHeroDetailedNeuron({
            index: 1,
            isPrimary: false,
            somaPos: new THREE.Vector3(6.8, 0.65, -0.15),
            axonPoints: [
                new THREE.Vector3(7.85, 0.60, -0.15),
                new THREE.Vector3(9.45, 0.35, 0.25),
                new THREE.Vector3(11.15, 0.15, -0.10)
            ],
            dendriteTargets: [
                new THREE.Vector3(4.68, 1.65, 0.22),
                new THREE.Vector3(4.85, 0.55, -0.28),
                new THREE.Vector3(4.61, -0.45, 0.12),
                new THREE.Vector3(6.95, 3.15, 0.95),
                new THREE.Vector3(6.55, -2.05, -0.85)
            ],
            terminalBranches: [
                {
                    type: 'AXODENDRITIC',
                    targetNeuronIndex: 3,
                    points: [
                        new THREE.Vector3(11.15, 0.15, -0.10),
                        new THREE.Vector3(12.05, 0.85, 0.35)
                    ]
                },
                {
                    type: 'AXODENDRITIC',
                    targetNeuronIndex: 4,
                    points: [
                        new THREE.Vector3(11.15, 0.15, -0.10),
                        new THREE.Vector3(12.10, -0.55, -0.35)
                    ]
                }
            ]
        });
        this.buildHeroDetailedNeuron({
            index: 2,
            isPrimary: false,
            somaPos: new THREE.Vector3(-1.4, 4.65, -1.05),
            axonPoints: [
                new THREE.Vector3(-0.85, 3.85, -0.85),
                new THREE.Vector3(0.45, 2.55, -0.45),
                new THREE.Vector3(1.65, 1.35, -0.15)
            ],
            dendriteTargets: [
                new THREE.Vector3(-3.25, 6.15, -0.45),
                new THREE.Vector3(-1.55, 6.45, -2.15),
                new THREE.Vector3(0.25, 5.95, -0.75)
            ],
            terminalBranches: [
                {
                    type: 'AXOAXONIC',
                    targetNeuronIndex: 0,
                    points: [
                        new THREE.Vector3(1.65, 1.35, -0.15),
                        new THREE.Vector3(2.25, 0.72, -0.05),
                        new THREE.Vector3(2.55, 0.32, 0.0)
                    ]
                }
            ]
        });
        this.buildConnectedCorticalEnsemble(count - 3);
    }
    buildHeroDetailedNeuron(cfg) {
        const { index, isPrimary, somaPos, axonPoints, dendriteTargets, terminalBranches } = cfg;
        const materials = this.materials;
        const nGroup = new THREE.Group();
        const somaGroup = new THREE.Group();
        const somaGeo = new THREE.SphereGeometry(1.18, 42, 42);
        const sPos = somaGeo.attributes.position;
        for (let i = 0; i < sPos.count; i++) {
            let x = sPos.getX(i);
            let y = sPos.getY(i);
            let z = sPos.getZ(i);
            if (x > 0.25) {
                x *= 1.30;
                y *= (1.0 - (x / 2.2) * 0.25);
                z *= (1.0 - (x / 2.2) * 0.25);
            }
            sPos.setXYZ(i, x, y, z);
        }
        somaGeo.computeVertexNormals();
        const somaMesh = new THREE.Mesh(somaGeo, materials.somaMat.clone());
        somaMesh.position.copy(somaPos);
        somaGroup.add(somaMesh);
        this.somaMeshes.push(somaMesh);
        nGroup.add(somaGroup);
        this.registerNeuronPart('NEURON_SOMA', somaGroup, isPrimary ? somaPos.clone().add(new THREE.Vector3(0, 1.25, 0)) : null);
        const nucGroup = new THREE.Group();
        const nucleusMesh = new THREE.Mesh(new THREE.SphereGeometry(0.54, 32, 32), materials.nucleusMat);
        nucleusMesh.position.copy(somaPos);
        nucGroup.add(nucleusMesh);
        const nucleolusMesh = new THREE.Mesh(new THREE.SphereGeometry(0.20, 20, 20), materials.nucleolusMat);
        nucleolusMesh.position.copy(somaPos).add(new THREE.Vector3(0.12, 0.10, 0.18));
        nucGroup.add(nucleolusMesh);
        for (let k = 0; k < 12; k++) {
            const angle = (k / 12) * Math.PI * 2;
            const nissl = new THREE.Mesh(new THREE.SphereGeometry(0.085, 10, 10), materials.nisslMat);
            nissl.scale.set(1.65, 0.72, 0.92);
            nissl.position.copy(somaPos).add(new THREE.Vector3(
                Math.cos(angle) * 0.76,
                Math.sin(angle) * 0.68,
                Math.sin(angle * 2.0) * 0.45
            ));
            nucGroup.add(nissl);
        }
        nGroup.add(nucGroup);
        this.registerNeuronPart('NEURON_NUCLEUS', nucGroup, isPrimary ? somaPos.clone() : null);
        const dendGroup = new THREE.Group();
        dendriteTargets.forEach((targetPt, dIdx) => {
            const dir = targetPt.clone().sub(somaPos);
            const mid1 = somaPos.clone().add(dir.clone().multiplyScalar(0.38)).add(new THREE.Vector3(0, (dIdx % 2 === 0 ? 0.35 : -0.35), 0.2));
            const mid2 = somaPos.clone().add(dir.clone().multiplyScalar(0.72)).add(new THREE.Vector3(0, (dIdx % 2 === 0 ? -0.22 : 0.25), -0.18));
            const dCurve = new THREE.CatmullRomCurve3([somaPos.clone(), mid1, mid2, targetPt.clone()]);
            const dGeo = new THREE.TubeGeometry(dCurve, 28, 0.14, 12, false);
            const dPos = dGeo.attributes.position;
            for (let i = 0; i < dPos.count; i++) {
                const vx = dPos.getX(i), vy = dPos.getY(i), vz = dPos.getZ(i);
                const distFromSoma = somaPos.distanceTo(new THREE.Vector3(vx, vy, vz));
                const maxLen = somaPos.distanceTo(targetPt);
                const t = Math.min(1.0, distFromSoma / Math.max(0.1, maxLen));
                const ptOnCurve = dCurve.getPointAt(t);
                const shrink = 1.0 - t * 0.65;
                dPos.setXYZ(
                    i,
                    ptOnCurve.x + (vx - ptOnCurve.x) * shrink,
                    ptOnCurve.y + (vy - ptOnCurve.y) * shrink,
                    ptOnCurve.z + (vz - ptOnCurve.z) * shrink
                );
            }
            dGeo.computeVertexNormals();
            dendGroup.add(new THREE.Mesh(dGeo, materials.dendriteMat));
            [0.35, 0.58, 0.78].forEach((branchT, bSub) => {
                const startSub = dCurve.getPointAt(branchT);
                const subEnd = startSub.clone().add(new THREE.Vector3(
                    (bSub % 2 === 0 ? -0.62 : -0.42),
                    (dIdx % 2 === 0 ? 0.72 : -0.72) * (bSub === 1 ? -0.65 : 1.0),
                    (bSub === 0 ? 0.52 : -0.52)
                ));
                const subCurve = new THREE.CatmullRomCurve3([startSub, subEnd]);
                dendGroup.add(new THREE.Mesh(new THREE.TubeGeometry(subCurve, 12, 0.052, 8, false), materials.dendriteMat));
                const spine = new THREE.Mesh(new THREE.SphereGeometry(0.078, 10, 10), materials.spineMat);
                spine.position.copy(subEnd);
                dendGroup.add(spine);
            });
        });
        nGroup.add(dendGroup);
        this.registerNeuronPart('NEURON_DENDRITES', dendGroup, isPrimary ? dendriteTargets[0].clone() : null);
        const axonCurve = new THREE.CatmullRomCurve3(axonPoints);
        const axonGroup = new THREE.Group();
        const axonMesh = new THREE.Mesh(new THREE.TubeGeometry(axonCurve, 56, 0.12, 14, false), materials.axonCoreMat);
        axonGroup.add(axonMesh);
        nGroup.add(axonGroup);
        this.registerNeuronPart('NEURON_AXON', axonGroup, isPrimary ? axonCurve.getPointAt(0.12) : null);
        const myelinGroup = new THREE.Group();
        const schwannGroup = new THREE.Group();
        const ranvierGroup = new THREE.Group();
        const numSegments = isPrimary ? 5 : 3;
        const segSpan = 0.80 / numSegments;
        const gapSpan = 0.045;
        for (let s = 0; s < numSegments; s++) {
            const tStart = 0.12 + s * (segSpan + gapSpan);
            const tEnd = Math.min(0.94, tStart + segSpan);
            if (tEnd <= tStart) continue;
            const subPts = [];
            for (let k = 0; k <= 10; k++) {
                subPts.push(axonCurve.getPointAt(tStart + (tEnd - tStart) * (k / 10)));
            }
            const segCurve = new THREE.CatmullRomCurve3(subPts);
            const segGeo = new THREE.TubeGeometry(segCurve, 20, 0.28, 18, false);
            const segMesh = new THREE.Mesh(segGeo, materials.myelinMat.clone());
            myelinGroup.add(segMesh);
            this.myelinMeshes.push(segMesh);
            const midT = (tStart + tEnd) * 0.5;
            const midPt = axonCurve.getPointAt(midT);
            const schwannNuc = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 14), materials.schwannNucleusMat);
            schwannNuc.scale.set(1.65, 0.85, 0.95);
            schwannNuc.position.copy(midPt).add(new THREE.Vector3(0, (s % 2 === 0 ? 0.25 : -0.25), 0.14));
            schwannGroup.add(schwannNuc);
            if (s < numSegments - 1) {
                const nodeT = tEnd + gapSpan * 0.5;
                const nodePt = axonCurve.getPointAt(Math.min(0.98, nodeT));
                const tangent = axonCurve.getTangentAt(Math.min(0.98, nodeT));
                const nodeRing = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.045, 10, 20), materials.ranvierMat);
                nodeRing.position.copy(nodePt);
                nodeRing.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent.normalize());
                ranvierGroup.add(nodeRing);
                if (isPrimary && s === 1) {
                    this.partAnchors.set('NEURON_RANVIER', nodePt.clone());
                }
            }
            if (isPrimary && s === 2) {
                this.partAnchors.set('NEURON_MYELIN', midPt.clone().add(new THREE.Vector3(0, 0.32, 0)));
                this.partAnchors.set('NEURON_SCHWANN', schwannNuc.position.clone());
            }
        }
        nGroup.add(myelinGroup);
        nGroup.add(schwannGroup);
        nGroup.add(ranvierGroup);
        this.registerNeuronPart('NEURON_MYELIN', myelinGroup);
        this.registerNeuronPart('NEURON_SCHWANN', schwannGroup);
        this.registerNeuronPart('NEURON_RANVIER', ranvierGroup);
        const terminalGroup = new THREE.Group();
        const synapseGroup = new THREE.Group();
        terminalBranches.forEach((branch, bIdx) => {
            const bCurve = new THREE.CatmullRomCurve3(branch.points);
            const bGeo = new THREE.TubeGeometry(bCurve, 20, 0.085, 10, false);
            terminalGroup.add(new THREE.Mesh(bGeo, materials.terminalMat));
            const tipPt = branch.points[branch.points.length - 1];
            const bouton = new THREE.Mesh(new THREE.SphereGeometry(0.19, 16, 16), materials.terminalMat);
            bouton.scale.set(1.25, 0.95, 0.95);
            bouton.position.copy(tipPt);
            terminalGroup.add(bouton);
            const cleftHalo = new THREE.Mesh(
                new THREE.RingGeometry(0.12, 0.34, 20),
                new THREE.MeshBasicMaterial({
                    color: branch.type === 'AXOAXONIC' ? 0x38bdf8 : 0xfacc15,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.80
                })
            );
            cleftHalo.position.copy(tipPt);
            cleftHalo.rotation.y = Math.PI / 2;
            synapseGroup.add(cleftHalo);
            const vCount = 12;
            const vPos = new Float32Array(vCount * 3);
            for (let v = 0; v < vCount; v++) {
                vPos[v * 3] = tipPt.x + (Math.random() - 0.5) * 0.35;
                vPos[v * 3 + 1] = tipPt.y + (Math.random() - 0.5) * 0.35;
                vPos[v * 3 + 2] = tipPt.z + (Math.random() - 0.5) * 0.35;
            }
            const vGeo = new THREE.BufferGeometry();
            vGeo.setAttribute('position', new THREE.BufferAttribute(vPos, 3));
            const vPoints = new THREE.Points(vGeo, new THREE.PointsMaterial({
                color: branch.type === 'AXOAXONIC' ? 0x00f2fe : 0xfde047,
                size: 0.14,
                transparent: true,
                opacity: 0.92,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            }));
            synapseGroup.add(vPoints);
            this.synapseConnections.push({
                type: branch.type,
                sourceNeuronIndex: index,
                targetNeuronIndex: branch.targetNeuronIndex !== undefined ? branch.targetNeuronIndex : ((index + 1) % 3),
                center: tipPt.clone(),
                halo: cleftHalo,
                vesicles: vPoints,
                burstIntensity: 0.0
            });
            if (isPrimary && bIdx === 0) {
                this.partAnchors.set('NEURON_TERMINAL', branch.points[1].clone());
                this.partAnchors.set('NEURON_SYNAPSE', tipPt.clone());
            }
        });
        nGroup.add(terminalGroup);
        nGroup.add(synapseGroup);
        this.registerNeuronPart('NEURON_TERMINAL', terminalGroup);
        this.registerNeuronPart('NEURON_SYNAPSE', synapseGroup);
        const apGlow = new THREE.Mesh(
            new THREE.SphereGeometry(0.26, 16, 16),
            new THREE.MeshBasicMaterial({
                color: 0x00f2fe,
                transparent: true,
                opacity: 0.95,
                blending: THREE.AdditiveBlending
            })
        );
        apGlow.position.copy(axonPoints[0]);
        nGroup.add(apGlow);
        this.neurons.push({
            index,
            isPrimary,
            somaPos: somaPos.clone(),
            group: nGroup,
            axonCurve,
            apGlow,
            baseSpeed: index === 0 ? 0.58 : 0.48,
            apProgress: index === 0 ? 0.0 : (index === 2 ? 0.45 : 0.72),
            apSpeed: index === 0 ? 0.58 : 0.48
        });
        this.networkGroup.add(nGroup);
    }
    buildConnectedCorticalEnsemble(extraCount) {
        const numExtra = Math.max(47, extraCount);
        const materials = this.materials;
        const sharedSomaGeo = new THREE.SphereGeometry(0.88, 22, 18);
        const sPos = sharedSomaGeo.attributes.position;
        for (let i = 0; i < sPos.count; i++) {
            let x = sPos.getX(i), y = sPos.getY(i), z = sPos.getZ(i);
            if (x > 0.2) {
                x *= 1.28;
                y *= (1.0 - (x / 1.8) * 0.24);
                z *= (1.0 - (x / 1.8) * 0.24);
            }
            sPos.setXYZ(i, x, y, z);
        }
        sharedSomaGeo.computeVertexNormals();
        const sharedNucGeo = new THREE.SphereGeometry(0.40, 16, 14);
        const sharedNucleolusGeo = new THREE.SphereGeometry(0.15, 10, 10);
        const sharedNisslGeo = new THREE.SphereGeometry(0.068, 8, 8);
        const sharedSpineGeo = new THREE.SphereGeometry(0.065, 8, 8);
        const sharedSchwannGeo = new THREE.SphereGeometry(0.09, 10, 10);
        const sharedRanvierGeo = new THREE.TorusGeometry(0.125, 0.036, 8, 14);
        const sharedBoutonGeo = new THREE.SphereGeometry(0.15, 12, 12);
        const sharedHaloGeo = new THREE.RingGeometry(0.09, 0.26, 16);
        const sharedApGeo = new THREE.SphereGeometry(0.21, 12, 12);
        const nodePositions = [];
        for (let i = 0; i < numExtra; i++) {
            const goldenAngle = i * 2.3999632;
            const layerIdx = i % 6;
            const radiusXZ = 7.5 + (i % 9) * 2.25 + (layerIdx * 0.65);
            const x = Math.cos(goldenAngle) * radiusXZ * 1.35;
            const y = -8.5 + (layerIdx * 3.4) + Math.sin(i * 1.7) * 1.45;
            const z = -2.8 - Math.abs(Math.sin(goldenAngle)) * 12.5 + (i % 3 === 0 ? 4.2 : -1.5);
            nodePositions.push(new THREE.Vector3(x, y, z));
        }
        for (let i = 0; i < numExtra; i++) {
            const globalIdx = i + 3;
            const somaPos = nodePositions[i];
            let bestTargetIdx = 0;
            let bestTargetPos = this.neurons[0].somaPos;
            let minDist = Infinity;
            for (let j = 0; j < numExtra; j++) {
                if (i === j) continue;
                const d = somaPos.distanceTo(nodePositions[j]);
                if (d > 4.2 && d < 14.5 && d < minDist) {
                    minDist = d;
                    bestTargetIdx = j + 3;
                    bestTargetPos = nodePositions[j];
                }
            }
            if (!Number.isFinite(minDist)) {
                const fallbackIdx = (i + 1) % numExtra;
                bestTargetIdx = fallbackIdx + 3;
                bestTargetPos = nodePositions[fallbackIdx];
            }
            const isAxoAxonic = (i % 5 === 0);
            const dirToTarget = bestTargetPos.clone().sub(somaPos);
            const distToTarget = Math.max(3.5, dirToTarget.length());
            const unitDir = dirToTarget.clone().normalize();
            const synapseContactPt = isAxoAxonic
                ? bestTargetPos.clone().add(unitDir.clone().multiplyScalar(-1.05)).add(new THREE.Vector3(0.25, 0.18, 0))
                : bestTargetPos.clone().add(unitDir.clone().multiplyScalar(-1.65)).add(new THREE.Vector3(0, (i % 2 === 0 ? 0.55 : -0.55), 0.25));
            const nGroup = new THREE.Group();
            const somaMesh = new THREE.Mesh(sharedSomaGeo, materials.somaMat.clone());
            somaMesh.position.copy(somaPos);
            somaMesh.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), unitDir);
            somaMesh.userData.neuronPartId = 'NEURON_SOMA';
            nGroup.add(somaMesh);
            this.somaMeshes.push(somaMesh);
            this.interactiveParts.push(somaMesh);
            const nucMesh = new THREE.Mesh(sharedNucGeo, materials.nucleusMat);
            nucMesh.position.copy(somaPos);
            nucMesh.userData.neuronPartId = 'NEURON_NUCLEUS';
            nGroup.add(nucMesh);
            this.interactiveParts.push(nucMesh);
            const nucleolusMesh = new THREE.Mesh(sharedNucleolusGeo, materials.nucleolusMat);
            nucleolusMesh.position.copy(somaPos).add(new THREE.Vector3(0.09, 0.08, 0.12));
            nGroup.add(nucleolusMesh);
            for (let k = 0; k < 5; k++) {
                const ang = (k / 5) * Math.PI * 2;
                const nissl = new THREE.Mesh(sharedNisslGeo, materials.nisslMat);
                nissl.scale.set(1.5, 0.7, 0.9);
                nissl.position.copy(somaPos).add(new THREE.Vector3(Math.cos(ang) * 0.55, Math.sin(ang) * 0.52, Math.sin(ang * 2) * 0.35));
                nGroup.add(nissl);
            }
            const dendOffsets = [
                new THREE.Vector3(-unitDir.x * 1.8 + 0.8, 1.45, 0.75),
                new THREE.Vector3(-unitDir.x * 1.8 - 0.7, -1.35, -0.85),
                new THREE.Vector3(-unitDir.x * 1.5, 1.25, -1.25),
                new THREE.Vector3(-unitDir.x * 1.6, -1.15, 1.15)
            ];
            dendOffsets.forEach((dOff, dIdx) => {
                const dEnd = somaPos.clone().add(dOff);
                const dMid = somaPos.clone().lerp(dEnd, 0.52).add(new THREE.Vector3(0, dIdx % 2 === 0 ? 0.28 : -0.28, 0.18));
                const dCurve = new THREE.CatmullRomCurve3([somaPos.clone(), dMid, dEnd]);
                const dMesh = new THREE.Mesh(new THREE.TubeGeometry(dCurve, 10, 0.075, 7, false), materials.dendriteMat);
                dMesh.userData.neuronPartId = 'NEURON_DENDRITES';
                nGroup.add(dMesh);
                this.interactiveParts.push(dMesh);
                const spine = new THREE.Mesh(sharedSpineGeo, materials.spineMat);
                spine.position.copy(dEnd);
                nGroup.add(spine);
            });
            if (!isAxoAxonic) {
                const postMid = bestTargetPos.clone().lerp(synapseContactPt, 0.55).add(new THREE.Vector3(0, 0.22, -0.15));
                const postDendCurve = new THREE.CatmullRomCurve3([bestTargetPos.clone(), postMid, synapseContactPt.clone()]);
                const postDendMesh = new THREE.Mesh(new THREE.TubeGeometry(postDendCurve, 10, 0.078, 7, false), materials.dendriteMat);
                postDendMesh.userData.neuronPartId = 'NEURON_DENDRITES';
                nGroup.add(postDendMesh);
            }
            const axonStart = somaPos.clone().add(unitDir.clone().multiplyScalar(0.82));
            const axonEndPreTerminal = somaPos.clone().lerp(synapseContactPt, 0.82);
            const perpArch = new THREE.Vector3(-unitDir.y * 0.65, unitDir.x * 0.65 + (i % 2 === 0 ? 0.45 : -0.45), (i % 3 - 1) * 0.55);
            const axonMid1 = axonStart.clone().lerp(axonEndPreTerminal, 0.35).add(perpArch);
            const axonMid2 = axonStart.clone().lerp(axonEndPreTerminal, 0.70).sub(perpArch.clone().multiplyScalar(0.5));
            const axonCurve = new THREE.CatmullRomCurve3([axonStart, axonMid1, axonMid2, axonEndPreTerminal, synapseContactPt.clone()]);
            const axonCoreMesh = new THREE.Mesh(new THREE.TubeGeometry(axonCurve, 24, 0.075, 8, false), materials.axonCoreMat);
            axonCoreMesh.userData.neuronPartId = 'NEURON_AXON';
            nGroup.add(axonCoreMesh);
            this.interactiveParts.push(axonCoreMesh);
            const numSegs = 3;
            const segSpan = 0.68 / numSegs;
            const gapSpan = 0.05;
            for (let s = 0; s < numSegs; s++) {
                const t0 = 0.08 + s * (segSpan + gapSpan);
                const t1 = Math.min(0.82, t0 + segSpan);
                const pts = [
                    axonCurve.getPointAt(t0),
                    axonCurve.getPointAt((t0 + t1) * 0.5),
                    axonCurve.getPointAt(t1)
                ];
                const mCurve = new THREE.CatmullRomCurve3(pts);
                const mMesh = new THREE.Mesh(new THREE.TubeGeometry(mCurve, 8, 0.18, 10, false), materials.myelinMat.clone());
                mMesh.userData.neuronPartId = 'NEURON_MYELIN';
                nGroup.add(mMesh);
                this.myelinMeshes.push(mMesh);
                this.interactiveParts.push(mMesh);
                const midPt = axonCurve.getPointAt((t0 + t1) * 0.5);
                const schwann = new THREE.Mesh(sharedSchwannGeo, materials.schwannNucleusMat);
                schwann.scale.set(1.5, 0.85, 0.9);
                schwann.position.copy(midPt).add(new THREE.Vector3(0, (s % 2 === 0 ? 0.17 : -0.17), 0.10));
                schwann.userData.neuronPartId = 'NEURON_SCHWANN';
                nGroup.add(schwann);
                if (s < numSegs - 1) {
                    const rT = t1 + gapSpan * 0.5;
                    const rPt = axonCurve.getPointAt(rT);
                    const rTan = axonCurve.getTangentAt(rT);
                    const rRing = new THREE.Mesh(sharedRanvierGeo, materials.ranvierMat);
                    rRing.position.copy(rPt);
                    rRing.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), rTan.normalize());
                    rRing.userData.neuronPartId = 'NEURON_RANVIER';
                    nGroup.add(rRing);
                }
            }
            const bouton = new THREE.Mesh(sharedBoutonGeo, materials.terminalMat);
            bouton.position.copy(synapseContactPt);
            bouton.userData.neuronPartId = 'NEURON_TERMINAL';
            nGroup.add(bouton);
            this.interactiveParts.push(bouton);
            const halo = new THREE.Mesh(
                sharedHaloGeo,
                new THREE.MeshBasicMaterial({
                    color: isAxoAxonic ? 0x38bdf8 : 0xfacc15,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.72
                })
            );
            halo.position.copy(synapseContactPt);
            halo.lookAt(bestTargetPos);
            halo.userData.neuronPartId = 'NEURON_SYNAPSE';
            nGroup.add(halo);
            this.synapseConnections.push({
                type: isAxoAxonic ? 'AXOAXONIC' : 'AXODENDRITIC',
                sourceNeuronIndex: globalIdx,
                targetNeuronIndex: bestTargetIdx,
                center: synapseContactPt.clone(),
                halo: halo,
                vesicles: null,
                burstIntensity: 0.0
            });
            const apGlow = new THREE.Mesh(
                sharedApGeo,
                new THREE.MeshBasicMaterial({
                    color: isAxoAxonic ? 0x38bdf8 : 0x00f2fe,
                    transparent: true,
                    opacity: 0.92,
                    blending: THREE.AdditiveBlending
                })
            );
            const initProgress = (i * 0.137) % 1.0;
            apGlow.position.copy(axonCurve.getPointAt(initProgress));
            nGroup.add(apGlow);
            const baseSpd = 0.36 + (i % 7) * 0.045;
            this.neurons.push({
                index: globalIdx,
                isPrimary: false,
                somaPos: somaPos.clone(),
                group: nGroup,
                axonCurve,
                apGlow,
                baseSpeed: baseSpd,
                apProgress: initProgress,
                apSpeed: baseSpd,
                targetNeuronIndex: bestTargetIdx
            });
            this.networkGroup.add(nGroup);
        }
    }
    setVisible(visible, targetStructureId = null) {
        this.microGroup.visible = visible;
        if (targetStructureId) {
            this.activeTargetStructure = targetStructureId;
        }
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
    triggerManualSpike() {
        this.spikePhase = 0.01;
        this.firingRateHz = Math.min(95.0, this.targetFiringRateHz + 24.0);
        this.neurons.forEach((n, idx) => {
            if (idx < 12) {
                n.apProgress = 0.02 + (idx * 0.03);
            }
        });
        this.synapseConnections.forEach(syn => {
            syn.burstIntensity = 1.0;
        });
    }
    setPathologySimulation(diseaseKey, severity = 0.75) {
        this.activeDiseaseKey = diseaseKey || 'HEALTHY';
        this.diseaseSeverity = this.activeDiseaseKey === 'HEALTHY' ? 0.0 : Math.max(0.05, Math.min(1.0, Number(severity) || 0.75));
        const sev = this.diseaseSeverity;
        while (this.pathologyMarkersGroup.children.length > 0) {
            this.pathologyMarkersGroup.remove(this.pathologyMarkersGroup.children[0]);
        }
        this.myelinMeshes.forEach(m => {
            m.scale.set(1, 1, 1);
            if (m.material) {
                m.material.opacity = 0.82;
                m.material.color.setHex(0xfacc15);
                if (m.material.emissive) m.material.emissive.setHex(0xca8a04);
            }
        });
        this.somaMeshes.forEach(s => {
            s.scale.set(1, 1, 1);
            if (s.material) {
                s.material.color.setHex(0xa855f7);
                s.material.opacity = 0.52;
            }
        });
        this.neurons.forEach(n => {
            n.apSpeed = n.baseSpeed || 0.48;
            n.apGlow.material.color.setHex(0x00f2fe);
            n.apGlow.visible = true;
        });
        if (this.activeDiseaseKey === 'HEALTHY' || sev <= 0.01) {
            this.targetFiringRateHz = 18.0;
            this.firingRateHz = 18.0;
            this.cbfPerfusion = 54;
            this.conductionVelocityMs = 110;
            return;
        }
        if (this.activeDiseaseKey === 'ALZHEIMER') {
            const plaqueMat = new THREE.MeshPhysicalMaterial({
                color: 0xd97706,
                emissive: 0x92400e,
                emissiveIntensity: 0.55,
                roughness: 0.6
            });
            const tangleMat = new THREE.MeshPhysicalMaterial({
                color: 0xef4444,
                emissive: 0x7f1d1d,
                emissiveIntensity: 0.65,
                wireframe: true
            });
            this.neurons.slice(0, 28).forEach((n, idx) => {
                if (idx % 2 === 0) {
                    const p = new THREE.Mesh(new THREE.DodecahedronGeometry(0.28 + (idx % 3) * 0.09, 1), plaqueMat);
                    p.position.copy(n.somaPos).add(new THREE.Vector3(1.1, 0.65, 0.45));
                    this.pathologyMarkersGroup.add(p);
                }
                const tangle = new THREE.Mesh(new THREE.TorusKnotGeometry(0.28, 0.06, 24, 6), tangleMat);
                tangle.position.copy(n.somaPos);
                this.pathologyMarkersGroup.add(tangle);
            });
            this.somaMeshes.forEach(s => s.scale.setScalar(1.0 - 0.18 * sev));
            this.neurons.forEach(n => { n.apSpeed = n.baseSpeed * (1.0 - 0.42 * sev); });
            this.targetFiringRateHz = Math.max(6.5, 18.0 - 9.5 * sev);
            this.firingRateHz = this.targetFiringRateHz;
            this.cbfPerfusion = Math.round(54 - 18 * sev);
            this.conductionVelocityMs = Math.round(110 - 44 * sev);
        } else if (this.activeDiseaseKey === 'PARKINSON') {
            const lewyMat = new THREE.MeshPhysicalMaterial({
                color: 0xf43f5e,
                emissive: 0xbe123c,
                emissiveIntensity: 0.78,
                roughness: 0.22
            });
            this.neurons.slice(0, 32).forEach(n => {
                const lewy = new THREE.Mesh(new THREE.SphereGeometry(0.30, 16, 16), lewyMat);
                lewy.position.copy(n.somaPos).add(new THREE.Vector3(-0.32, -0.22, 0.28));
                this.pathologyMarkersGroup.add(lewy);
            });
            this.neurons.forEach(n => {
                n.apSpeed = n.baseSpeed * (1.0 - 0.45 * sev);
                n.apGlow.material.color.setHex(0xfb923c);
            });
            this.targetFiringRateHz = 5.2; // Frequência clássica do tremor parkinsoniano em repouso (4–6 Hz)
            this.firingRateHz = 5.2;
            this.cbfPerfusion = Math.round(54 - 10 * sev);
            this.conductionVelocityMs = Math.round(110 - 34 * sev);
        } else if (this.activeDiseaseKey === 'MULTIPLE_SCLEROSIS') {
            this.myelinMeshes.forEach((m, idx) => {
                if (idx % 2 === 0 || idx % 5 === 0) {
                    const shrink = Math.max(0.32, 1.0 - 0.65 * sev);
                    m.scale.set(1.0, shrink, shrink);
                    if (m.material) {
                        m.material.opacity = Math.max(0.16, 0.82 - 0.62 * sev);
                        m.material.color.setHex(0xef4444);
                        if (m.material.emissive) m.material.emissive.setHex(0x7f1d1d);
                    }
                }
            });
            this.neurons.forEach((n, idx) => {
                n.apSpeed = n.baseSpeed * Math.max(0.18, 1.0 - 0.76 * sev);
                n.apGlow.material.color.setHex(0x38bdf8);
                if (sev > 0.6 && idx % 4 === 0) {
                    n.apGlow.visible = false; // Bloqueio completo de condução em axônios severamente desmielinizados
                }
            });
            this.targetFiringRateHz = Math.max(5.5, 18.0 - 11.2 * sev);
            this.firingRateHz = this.targetFiringRateHz;
            this.cbfPerfusion = Math.round(54 - 8 * sev);
            this.conductionVelocityMs = Math.max(16, Math.round(110 * (1.0 - 0.80 * sev)));
        } else if (this.activeDiseaseKey === 'PRION_DCJ') {
            const vacMat = new THREE.MeshPhysicalMaterial({
                color: 0xe879f9,
                emissive: 0x701a75,
                emissiveIntensity: 0.45,
                transmission: 0.82,
                transparent: true,
                opacity: 0.58,
                roughness: 0.12
            });
            this.neurons.slice(0, 30).forEach((n, idx) => {
                const v = new THREE.Mesh(new THREE.SphereGeometry(0.34 + (idx % 3) * 0.12, 16, 16), vacMat);
                v.position.copy(n.somaPos).add(new THREE.Vector3(0.45, (idx % 2 === 0 ? 0.55 : -0.55), 0.35));
                this.pathologyMarkersGroup.add(v);
            });
            this.somaMeshes.forEach(s => s.scale.setScalar(1.0 - 0.24 * sev));
            this.neurons.forEach(n => {
                n.apSpeed = n.baseSpeed * (1.0 - 0.58 * sev);
                n.apGlow.material.color.setHex(0xe879f9);
            });
            this.targetFiringRateHz = Math.max(4.5, 18.0 - 12.5 * sev);
            this.firingRateHz = this.targetFiringRateHz;
            this.cbfPerfusion = Math.round(54 - 24 * sev);
            this.conductionVelocityMs = Math.round(110 - 66 * sev);
        } else if (this.activeDiseaseKey === 'ALS_ELA') {
            const tdpMat = new THREE.MeshPhysicalMaterial({
                color: 0xf97316,
                emissive: 0x9a3412,
                emissiveIntensity: 0.65
            });
            this.myelinMeshes.forEach((m, idx) => {
                if (idx % 2 === 1 && m.material) {
                    m.material.color.setHex(0xf97316);
                    m.material.opacity = Math.max(0.28, 0.82 - 0.48 * sev);
                }
            });
            this.neurons.slice(0, 25).forEach(n => {
                const spheroid = new THREE.Mesh(new THREE.SphereGeometry(0.26, 14, 14), tdpMat);
                spheroid.scale.set(1.6, 0.9, 0.9);
                spheroid.position.copy(n.axonCurve.getPointAt(0.45));
                this.pathologyMarkersGroup.add(spheroid);
            });
            this.neurons.forEach(n => {
                n.apSpeed = n.baseSpeed * (1.0 - 0.62 * sev);
                n.apGlow.material.color.setHex(0xf97316);
            });
            this.targetFiringRateHz = Math.max(5.0, 18.0 - 11.5 * sev);
            this.firingRateHz = this.targetFiringRateHz;
            this.cbfPerfusion = Math.round(54 - 12 * sev);
            this.conductionVelocityMs = Math.round(110 - 74 * sev);
        } else if (this.activeDiseaseKey === 'EPILEPSY') {
            this.neurons.forEach(n => {
                n.apSpeed = n.baseSpeed * (1.0 + 1.65 * sev);
                n.apGlow.material.color.setHex(0xfacc15);
            });
            this.targetFiringRateHz = Math.round(18.0 + 52.0 * sev);
            this.firingRateHz = this.targetFiringRateHz;
            this.cbfPerfusion = Math.round(54 + 32 * sev); // Hiperperfusão ictal
            this.conductionVelocityMs = Math.round(110 + 16 * sev);
        } else if (this.activeDiseaseKey === 'ISCHEMIC_STROKE') {
            this.somaMeshes.forEach(s => {
                if (s.material) {
                    s.material.color.setHex(0xf43f5e);
                    s.material.opacity = 0.68;
                }
            });
            this.neurons.forEach(n => {
                n.apSpeed = n.baseSpeed * Math.max(0.12, 1.0 - 0.82 * sev);
                n.apGlow.material.color.setHex(0xf43f5e);
            });
            this.targetFiringRateHz = Math.max(2.0, 18.0 * (1.0 - 0.85 * sev));
            this.firingRateHz = this.targetFiringRateHz;
            this.cbfPerfusion = Math.max(8, Math.round(54 * (1.0 - 0.82 * sev)));
            this.conductionVelocityMs = Math.max(18, Math.round(110 * (1.0 - 0.72 * sev)));
        }
    }
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
        this.neurons.forEach((n, idx) => {
            n.apProgress += dt * n.apSpeed;
            if (n.apProgress >= 1.0) {
                n.apProgress = 0.0;
                if (n.isPrimary) {
                    this.spikePhase = 0.01;
                }
                for (let s = 0; s < this.synapseConnections.length; s++) {
                    const syn = this.synapseConnections[s];
                    if (syn.sourceNeuronIndex === idx) {
                        syn.burstIntensity = 1.0;
                    }
                }
            }
            const pt = n.axonCurve.getPointAt(n.apProgress);
            n.apGlow.position.copy(pt);
            const saltatoryPulse = 0.95 + 0.48 * Math.abs(Math.sin(n.apProgress * Math.PI * (n.isPrimary ? 5.0 : 3.0)));
            n.apGlow.scale.setScalar(saltatoryPulse);
        });
        for (let idx = 0; idx < this.synapseConnections.length; idx++) {
            const syn = this.synapseConnections[idx];
            syn.burstIntensity = Math.max(0.18, syn.burstIntensity - dt * 1.5);
            const haloScale = 0.85 + 0.55 * syn.burstIntensity + 0.14 * Math.sin(elapsed * 7.5 + idx);
            syn.halo.scale.setScalar(haloScale);
            if (syn.vesicles) {
                const posAttr = syn.vesicles.geometry.attributes.position;
                for (let v = 0; v < posAttr.count; v++) {
                    const angle = elapsed * 4.8 + v * 1.1;
                    const radius = (0.08 + ((elapsed * 0.45 + v * 0.07) % 0.36)) * (0.7 + 0.6 * syn.burstIntensity);
                    posAttr.setXYZ(
                        v,
                        syn.center.x + Math.cos(angle) * radius,
                        syn.center.y + Math.sin(angle * 1.3) * radius,
                        syn.center.z + Math.sin(angle * 0.8) * radius
                    );
                }
                posAttr.needsUpdate = true;
            }
        }
    }
}
window.NeuralMicrocosmos3D = NeuralMicrocosmos3D;
