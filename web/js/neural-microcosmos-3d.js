/**
 * MOZOK v5.0 — Neural Microcosmos 3D (Rede de Neurônios Conectados + Anatomia Celular Completa + Sinapses Químicas)
 * Fidelidade total ao diagrama anatômico do neurônio (image_639597.jpg):
 *  1. Corpo Celular (Soma) translúcido permitindo ver claramente o interior celular
 *  2. Núcleo (Esfera laranja-dourada vibrante + Nucléolo brilhante + Corpúsculos de Nissl no pericário)
 *  3. Dendritos ramificados em múltiplos níveis + Espinhas Dendríticas pós-sinápticas
 *  4. Cone de Implantação (Axon Hillock) e Axônio longo condutor
 *  5. Bainha de Mielina segmentada (translúcida dourada/amarela) + Núcleo da Célula de Schwann / Oligodendrócito (verde-esmeralda na bainha)
 *  6. Nódulos de Ranvier expostos entre cada internodo de mielina (Condução Saltatória de alta velocidade)
 *  7. Terminal do Axônio (Telodendro & Botões Sinápticos) conectando fisicamente AXÔNIO-COM-DENDRITO (Sinapse Axodendrítica) e AXÔNIO-COM-AXÔNIO (Sinapse Axoaxônica)
 *  8. Transmissão Sináptica ao vivo (vesículas e nuvens de neurotransmissores atravessando a fenda sináptica a cada potencial de ação)
 *  9. Sub-peças clicáveis com Âncoras 3D exatas para abrir Caixas Pop-up (HUD Callouts) de cada componente do neurônio
 */

class NeuralMicrocosmos3D {
    constructor(scene) {
        this.scene = scene;
        this.microGroup = new THREE.Group();
        this.microGroup.visible = false;
        this.scene.add(this.microGroup);

        this.neurons = [];
        this.synapseConnections = [];
        this.actionPotentials = [];
        this.interactiveParts = [];
        this.partAnchors = new Map();
        this.selectedPartId = 'NEURON_SOMA';

        this.activeTargetStructure = 'FRONTAL_LOBE';
        this.firingRateHz = 18.0;
        this.membranePotentialMv = -70.0;
        this.spikePhase = 0.0;

        // Dicionário Anatômico e Fisiológico Completo de Cada Peça do Neurônio (para as Caixas Pop-up)
        this.neuronPartsOntology = {
            'NEURON_SOMA': {
                id: 'NEURON_SOMA',
                name: 'Corpo Celular (Soma / Pericário)',
                latin: 'Soma Neuronale / Perikaryon',
                category: 'Citoarquitetura Neuronal',
                badge: 'CENTRO METABÓLICO E INTEGRADOR',
                summary: 'Centro trófico e metabólico do neurônio que integra todos os potenciais pós-sinápticos excitatórios (PEPS) e inibitórios (PIPS) vindos dos dendritos.',
                functions: ['Integração espacial e temporal de potenciais pós-sinápticos', 'Síntese proteica intensa nos Corpúsculos de Nissl (retículo endoplasmático rugoso)', 'Manutenção do potencial de repouso em -70 mV via bomba Na+/K+ ATPase'],
                neurotransmitters: ['Glutamato (Síntese)', 'GABA', 'Acetilcolina', 'Dopamina'],
                clinical: 'Cromatólise central após lesão axonal; acúmulo de corpos de inclusão (Corpos de Lewy no Parkinson, emaranhados neurofibrilares de proteína Tau no Alzheimer).'
            },
            'NEURON_NUCLEUS': {
                id: 'NEURON_NUCLEUS',
                name: 'Núcleo Neuronal & Nucléolo',
                latin: 'Nucleus Neuronalis & Nucleolus',
                category: 'Citoarquitetura Neuronal',
                badge: 'GENOMA E PLASTICIDADE',
                summary: 'Grande núcleo esférico central de cromatina frouxa (eucromatina ativa) com nucléolo proeminente, comandando a transcrição de canais iônicos, receptores e proteínas sinápticas.',
                functions: ['Transcrição de genes imediatos (c-Fos, BDNF, Arc) durante a Potenciação de Longa Duração (LTP)', 'Produção intensa de subunidades ribossomais no nucléolo para sustentar o axônio', 'Regulação epigenética da memória de longo prazo'],
                neurotransmitters: ['CREB (Fator de Transcrição)', 'BDNF (Neurotrofina)'],
                clinical: 'Alterações nucleares e nucleolares precoces em doenças neurodegenerativas por expansão de poliglutaminas (Doença de Huntington e Ataxias Espinocerebelares).'
            },
            'NEURON_DENDRITES': {
                id: 'NEURON_DENDRITES',
                name: 'Dendritos & Espinhas Dendríticas',
                latin: 'Dendriti & Spinae Dendriticae',
                category: 'Recepção Sináptica (Input)',
                badge: 'ÁRVORE RECEPTORA DE SINAIS',
                summary: 'Arborizações citoplasmáticas ricamente ramificadas cobertas por milhares de espinhas dendríticas que funcionam como antenas receptoras de sinapses excitatórias e inibitórias.',
                functions: ['Recepção de neurotransmissores em receptores AMPA, NMDA e GABA-A', 'Geração de potenciais graduados (PEPS e PIPS) conduzidos eletrotonicamente até o soma', 'Remodelamento estrutural das espinhas dendríticas (base física do aprendizado e memória)'],
                neurotransmitters: ['Glutamato (Receptores AMPA/NMDA)', 'GABA (Receptores GABA-A/B)'],
                clinical: 'Poda sináptica excessiva ou dismorfia de espinhas dendríticas na Esquizofrenia, Transtorno do Espectro Autista (TEA) e Doença de Alzheimer.'
            },
            'NEURON_AXON': {
                id: 'NEURON_AXON',
                name: 'Axônio & Cone de Implantação',
                latin: 'Axon & Collis Axonis',
                category: 'Condução Bioelétrica (Output)',
                badge: 'CABO DE TRANSMISSÃO BIOELÉTRICA',
                summary: 'Prolongamento cilíndrico único que nasce no Cone de Implantação (zona de gatilho com altíssima densidade de canais Nav1.6) e conduz o Potencial de Ação tudo-ou-nada.',
                functions: ['Disparo do Potencial de Ação quando o Cone de Implantação atinge o limiar de -55 mV', 'Condução bioelétrica unidirecional (ortodrômica) de +40 mV sem perda de amplitude', 'Transporte axonal anterógrado (cinesina) e retrógrado (dineína) sobre microtúbulos'],
                neurotransmitters: ['Íons Na+ (Influxo Rápido)', 'Íons K+ (Efluxo Repolarizante)'],
                clinical: 'Lesão Axonal Difusa (LAD) por cisalhamento em traumatismo cranioencefálico (TCE) e neuropatias axonais tóxicas ou metabólicas (diabetes).'
            },
            'NEURON_MYELIN': {
                id: 'NEURON_MYELIN',
                name: 'Bainha de Mielina',
                latin: 'Vagina Myelinica',
                category: 'Isolamento Elétrico & Velocidade',
                badge: 'ISOLANTE LIPOPROTEICO MULTILAMELAR',
                summary: 'Envoltório espiralado de múltiplas camadas lipoproteicas (80% lipídios, 20% proteínas como MBP e PLP) que reduz a capacitância da membrana axonal e impede o vazamento iônico.',
                functions: ['Isolamento elétrico de alta resistência ao longo dos segmentos internodais', 'Aumento da velocidade de condução nervosa de ~1 m/s (fibras amielínicas) para até 120 m/s', 'Economia drástica de ATP pela restrição do fluxo de íons aos Nódulos de Ranvier'],
                neurotransmitters: ['Proteína Básica da Mielina (MBP)', 'Esfingomielina & Galactocerebrosídeo'],
                clinical: 'Desmielinização autoimune no SNC na Esclerose Múltipla (placas desmielinizantes) e no SNP na Síndrome de Guillain-Barré.'
            },
            'NEURON_SCHWANN': {
                id: 'NEURON_SCHWANN',
                name: 'Célula de Schwann / Oligodendrócito',
                latin: 'Neurolemmocytus / Oligodendrocytus',
                category: 'Glia Mielinizante',
                badge: 'CÉLULA GLIAL PRODUTORA DE MIELINA',
                summary: 'No SNP, cada Célula de Schwann envolve um único internodo axonal (exibindo seu núcleo periférico no neurilema); no SNC, cada Oligodendrócito mieliniza até 50 axônios simultaneamente.',
                functions: ['Síntese e manutenção contínua das lamelas da bainha de mielina', 'Suporte metabólico ao axônio via transporte de lactato e piruvato', 'Guiamento da regeneração axonal pós-lesão no Sistema Nervoso Periférico (Bandas de Büngner)'],
                neurotransmitters: ['Neuregulina-1 (NRG1)', 'Fator de Crescimento Nervoso (NGF)'],
                clinical: 'Schwannomas (ex.: Schwannoma Vestibular do VIII par craniano), Doença de Charcot-Marie-Tooth e Leucodistrofias.'
            },
            'NEURON_RANVIER': {
                id: 'NEURON_RANVIER',
                name: 'Nódulo de Ranvier',
                latin: 'Nodus Neurofibrae (Ranvieri)',
                category: 'Condução Saltatória',
                badge: 'REGENERADOR DE POTENCIAL DE AÇÃO',
                summary: 'Interrupção periódica nua entre dois segmentos de mielina onde se concentram mais de 1.000 canais de Na+ dependentes de voltagem por µm², permitindo a Condução Saltatória.',
                functions: ['Regeneração explosiva do Potencial de Ação a cada internodo (Condução Saltatória)', 'Influxo rápido de Na+ seguido de repolarização por canais de K+ paranodais', 'Aceleração da transmissão sináptica em tratos corticoespinhais e nervos periféricos'],
                neurotransmitters: ['Canais Nav1.6', 'Canais Kv1.1 / Kv1.2', 'Caspr / Contactina'],
                clinical: 'Nodopatias e paranodopatias autoimunes (anticorpos anti-NF155 e anti-Contactina-1) que bloqueiam a condução saltatória reversivelmente.'
            },
            'NEURON_TERMINAL': {
                id: 'NEURON_TERMINAL',
                name: 'Terminal do Axônio (Telodendro)',
                latin: 'Telodendria & Terminatio Axonis',
                category: 'Transmissão Pré-Sináptica',
                badge: 'ARBORIZAÇÃO TERMINAL E BOTÕES SINÁPTICOS',
                summary: 'Ramificação distal do axônio (telodendro) cujas extremidades dilatadas (botões sinápticos) contêm mitocôndrias, canais de Ca2+ dependentes de voltagem e centenas de vesículas sinápticas.',
                functions: ['Conversão do sinal elétrico (Potencial de Ação) em sinal químico (Exocitose)', 'Abertura de canais Cav2.1/2.2 pelo potencial de ação com influxo de Ca2+', 'Fusão vesicular mediada pelo complexo proteico SNARE (Sinaptobrevina, Sintaxina, SNAP-25) e Sinaptotagmina'],
                neurotransmitters: ['Íons Ca2+ (Gatilho de Exocitose)', 'Complexo SNARE'],
                clinical: 'Alvo das neurotoxinas clostridiais (Toxina Botulínica e Toxina Tetânica, que clivam proteínas SNARE) e da Síndrome Miastênica de Lambert-Eaton (anticorpos contra canais de Ca2+).'
            },
            'NEURON_SYNAPSE': {
                id: 'NEURON_SYNAPSE',
                name: 'Sinapse (Axodendrítica & Axoaxônica)',
                latin: 'Synapsis Chimica (Axodendritica & Axoaxonica)',
                category: 'Comunicação Interneuronal',
                badge: 'FENDA SINÁPTICA E NEUROTRANSMISSÃO',
                summary: 'Junção funcional especializada (~20 nm) onde o terminal axonal pré-sináptico libera neurotransmissores sobre os dendritos (axodendrítica) ou sobre o axônio/terminal (axoaxônica) do neurônio seguinte.',
                functions: ['Sinapse Axodendrítica: excitação (Glutamato -> despolarização) ou inibição (GABA -> hiperpolarização) direta da árvore dendrítica pós-sináptica', 'Sinapse Axoaxônica: modulação pré-sináptica (facilitação ou inibição pré-sináptica da quantidade de neurotransmissor liberado)', 'Recaptação e degradação enzimática na fenda sináptica para encerrar o sinal com precisão de milissegundos'],
                neurotransmitters: ['Glutamato', 'GABA', 'Dopamina', 'Serotonina', 'Acetilcolina', 'Noradrenalina'],
                clinical: 'Principal sítio de ação da psicofarmacologia e neurologia clínica: ISRS (fluoxetina/sertralina), benzodiazepínicos, antipsicóticos, anticonvulsivantes e antiparkinsonianos.'
            }
        };

        this.buildCompleteConnectedNeuronNetwork();
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

    buildCompleteConnectedNeuronNetwork() {
        // =====================================================================
        // Materiais de Alta Fidelidade Biológica (inspirados diretamente na imagem de referência image_639597.jpg)
        // =====================================================================
        // 1. Soma Translúcido Roxo-Ametista / Lilás Bioluminescente (permite ver o Núcleo Laranja lá dentro!)
        const somaMat = new THREE.MeshPhysicalMaterial({
            color: 0xa855f7,
            emissive: 0x581c87,
            emissiveIntensity: 0.35,
            roughness: 0.18,
            metalness: 0.02,
            transmission: 0.68,
            transparent: true,
            opacity: 0.54,
            depthWrite: false,
            clearcoat: 0.9,
            side: THREE.DoubleSide
        });

        // 2. Núcleo Neuronal Laranja-Dourado Vibrante + Nucléolo Amarelo-Brilhante (visível dentro do Soma)
        const nucleusMat = new THREE.MeshPhysicalMaterial({
            color: 0xff6b00,
            emissive: 0xea580c,
            emissiveIntensity: 0.65,
            roughness: 0.25,
            clearcoat: 0.85
        });

        const nucleolusMat = new THREE.MeshBasicMaterial({
            color: 0xfef08a
        });

        // 3. Dendritos e Espinhas Dendríticas (Violeta-Rosado luminoso)
        const dendriteMat = new THREE.MeshPhysicalMaterial({
            color: 0xc084fc,
            emissive: 0x6b21a8,
            emissiveIntensity: 0.32,
            roughness: 0.26,
            clearcoat: 0.75
        });

        // 4. Axônio Condutor Central (Feixe Axoplasmático Ciano-Prateado visível nos Nódulos de Ranvier e sob a Mielina)
        const axonCoreMat = new THREE.MeshPhysicalMaterial({
            color: 0xe2e8f0,
            emissive: 0x38bdf8,
            emissiveIntensity: 0.38,
            roughness: 0.22,
            clearcoat: 0.8
        });

        // 5. Bainha de Mielina Dourada/Amarela Translúcida (exatamente como no diagrama image_639597.jpg)
        const myelinMat = new THREE.MeshPhysicalMaterial({
            color: 0xfacc15,
            emissive: 0xca8a04,
            emissiveIntensity: 0.32,
            roughness: 0.22,
            transmission: 0.45,
            transparent: true,
            opacity: 0.82,
            clearcoat: 0.85
        });

        // 6. Núcleo da Célula de Schwann / Oligodendrócito (Verde-Esmeralda vivo sobre cada bainha de mielina)
        const schwannNucleusMat = new THREE.MeshPhysicalMaterial({
            color: 0x10b981,
            emissive: 0x059669,
            emissiveIntensity: 0.55,
            roughness: 0.25,
            clearcoat: 0.8
        });

        // 7. Anéis dos Nódulos de Ranvier (Ciano Elétrico onde o impulso salta)
        const ranvierMat = new THREE.MeshBasicMaterial({
            color: 0x00f2fe,
            transparent: true,
            opacity: 0.92
        });

        // 8. Terminais do Axônio e Botões Sinápticos (Rosa-Coral / Âmbar Brilhante)
        const terminalMat = new THREE.MeshPhysicalMaterial({
            color: 0xf472b6,
            emissive: 0xdb2777,
            emissiveIntensity: 0.45,
            roughness: 0.25,
            clearcoat: 0.8
        });

        // =====================================================================
        // DEFINIÇÃO DA REDE DE 3 NEURÔNIOS INTERCONECTADOS:
        // - Neurônio 0 (Principal / Em Foco Central): Soma em (-6.2, 0.4, 0.0) -> Axônio longo horizontal até (+2.6, 0.2, 0.0)
        // - Neurônio 1 (Pós-Sináptico Alvo — Conexão AXÔNIO-DENDRITO): Soma em (+6.8, 1.2, -0.4), cujos dendritos recebem diretamente os botões terminais do Neurônio 0!
        // - Neurônio 2 (Interneurônio Modulador — Conexão AXÔNIO-AXÔNIO): Soma em (-1.8, 4.8, -1.6), cujo axônio desce e faz sinapse axoaxônica direta sobre o segmento inicial/terminal axonal do Neurônio 0!
        // =====================================================================
        this.buildSingleDetailedNeuron({
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
                    points: [
                        new THREE.Vector3(2.8, 0.22, 0.0),
                        new THREE.Vector3(3.85, 1.15, 0.35),
                        new THREE.Vector3(4.65, 1.65, 0.22) // Toca o dendrito superior do Neurônio 1
                    ]
                },
                {
                    type: 'AXODENDRITIC',
                    points: [
                        new THREE.Vector3(2.8, 0.22, 0.0),
                        new THREE.Vector3(3.95, 0.35, -0.35),
                        new THREE.Vector3(4.82, 0.55, -0.28) // Toca o dendrito médio do Neurônio 1
                    ]
                },
                {
                    type: 'AXODENDRITIC',
                    points: [
                        new THREE.Vector3(2.8, 0.22, 0.0),
                        new THREE.Vector3(3.75, -0.65, 0.25),
                        new THREE.Vector3(4.58, -0.45, 0.12) // Toca o dendrito inferior do Neurônio 1
                    ]
                }
            ],
            materials: { somaMat, nucleusMat, nucleolusMat, dendriteMat, axonCoreMat, myelinMat, schwannNucleusMat, ranvierMat, terminalMat }
        });

        // Neurônio 1: Pós-Sináptico (seus dendritos esquerdos se encontram exatamente nos botões sinápticos do Neurônio 0!)
        this.buildSingleDetailedNeuron({
            index: 1,
            isPrimary: false,
            somaPos: new THREE.Vector3(6.8, 0.65, -0.15),
            axonPoints: [
                new THREE.Vector3(7.85, 0.60, -0.15),
                new THREE.Vector3(9.45, 0.35, 0.25),
                new THREE.Vector3(11.15, 0.15, -0.10)
            ],
            dendriteTargets: [
                new THREE.Vector3(4.68, 1.65, 0.22),  // Sinapse Axodendrítica 1 com Neurônio 0!
                new THREE.Vector3(4.85, 0.55, -0.28), // Sinapse Axodendrítica 2 com Neurônio 0!
                new THREE.Vector3(4.61, -0.45, 0.12), // Sinapse Axodendrítica 3 com Neurônio 0!
                new THREE.Vector3(6.95, 3.15, 0.95),
                new THREE.Vector3(6.55, -2.05, -0.85)
            ],
            terminalBranches: [
                {
                    type: 'AXODENDRITIC',
                    points: [
                        new THREE.Vector3(11.15, 0.15, -0.10),
                        new THREE.Vector3(12.05, 0.85, 0.35)
                    ]
                },
                {
                    type: 'AXODENDRITIC',
                    points: [
                        new THREE.Vector3(11.15, 0.15, -0.10),
                        new THREE.Vector3(12.10, -0.55, -0.35)
                    ]
                }
            ],
            materials: { somaMat, nucleusMat, nucleolusMat, dendriteMat, axonCoreMat, myelinMat, schwannNucleusMat, ranvierMat, terminalMat }
        });

        // Neurônio 2: Interneurônio Superior fazendo SINAPSE AXOAXÔNICA (Axônio com Axônio) sobre o Neurônio 0!
        this.buildSingleDetailedNeuron({
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
                    points: [
                        new THREE.Vector3(1.65, 1.35, -0.15),
                        new THREE.Vector3(2.25, 0.72, -0.05),
                        new THREE.Vector3(2.55, 0.32, 0.0) // Sinapse Axoaxônica direta sobre o Axônio/Terminal do Neurônio 0!
                    ]
                }
            ],
            materials: { somaMat, nucleusMat, nucleolusMat, dendriteMat, axonCoreMat, myelinMat, schwannNucleusMat, ranvierMat, terminalMat }
        });
    }

    buildSingleDetailedNeuron(cfg) {
        const { index, isPrimary, somaPos, axonPoints, dendriteTargets, terminalBranches, materials } = cfg;
        const nGroup = new THREE.Group();

        // 1. CORPO CELULAR (SOMA) TRANSLÚCIDO + CONE DE IMPLANTAÇÃO (AXON HILLOCK)
        const somaGroup = new THREE.Group();
        const somaGeo = new THREE.SphereGeometry(1.18, 48, 48);
        const sPos = somaGeo.attributes.position;
        for (let i = 0; i < sPos.count; i++) {
            let x = sPos.getX(i);
            let y = sPos.getY(i);
            let z = sPos.getZ(i);
            // Alonga suavemente em direção ao Cone de Implantação (Axon Hillock) à direita
            if (x > 0.25) {
                x *= 1.28;
                y *= (1.0 - (x / 2.2) * 0.25);
                z *= (1.0 - (x / 2.2) * 0.25);
            }
            sPos.setXYZ(i, x, y, z);
        }
        somaGeo.computeVertexNormals();
        const somaMesh = new THREE.Mesh(somaGeo, materials.somaMat);
        somaMesh.position.copy(somaPos);
        somaGroup.add(somaMesh);
        nGroup.add(somaGroup);
        this.registerNeuronPart('NEURON_SOMA', somaGroup, isPrimary ? somaPos.clone().add(new THREE.Vector3(0, 1.25, 0)) : null);

        // 2. NÚCLEO (ESFERA LARANJA-DOURADA VIBRANTE) + NUCLÉOLO + CORPÚSCULOS DE NISSL (Visíveis através do Soma!)
        const nucGroup = new THREE.Group();
        const nucleusMesh = new THREE.Mesh(new THREE.SphereGeometry(0.54, 36, 36), materials.nucleusMat);
        nucleusMesh.position.copy(somaPos);
        nucGroup.add(nucleusMesh);

        const nucleolusMesh = new THREE.Mesh(new THREE.SphereGeometry(0.20, 24, 24), materials.nucleolusMat);
        nucleolusMesh.position.copy(somaPos).add(new THREE.Vector3(0.12, 0.10, 0.18));
        nucGroup.add(nucleolusMesh);

        // Corpúsculos de Nissl (Retículo Endoplasmático Rugoso) e Mitocôndrias ao redor do núcleo
        const nisslMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.75 });
        for (let k = 0; k < 10; k++) {
            const angle = (k / 10) * Math.PI * 2;
            const nissl = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), nisslMat);
            nissl.scale.set(1.6, 0.7, 0.9);
            nissl.position.copy(somaPos).add(new THREE.Vector3(
                Math.cos(angle) * 0.75,
                Math.sin(angle) * 0.68,
                Math.sin(angle * 2.0) * 0.45
            ));
            nucGroup.add(nissl);
        }
        nGroup.add(nucGroup);
        this.registerNeuronPart('NEURON_NUCLEUS', nucGroup, isPrimary ? somaPos.clone() : null);

        // 3. DENDRITOS ARBORIZADOS EM 3 NÍVEIS + ESPINHAS DENDRÍTICAS
        const dendGroup = new THREE.Group();
        dendriteTargets.forEach((targetPt, dIdx) => {
            const dir = targetPt.clone().sub(somaPos);
            const mid1 = somaPos.clone().add(dir.clone().multiplyScalar(0.38)).add(new THREE.Vector3(0, (dIdx % 2 === 0 ? 0.35 : -0.35), 0.2));
            const mid2 = somaPos.clone().add(dir.clone().multiplyScalar(0.72)).add(new THREE.Vector3(0, (dIdx % 2 === 0 ? -0.22 : 0.25), -0.18));

            const dCurve = new THREE.CatmullRomCurve3([somaPos.clone(), mid1, mid2, targetPt.clone()]);
            const dGeo = new THREE.TubeGeometry(dCurve, 32, 0.14, 14, false);
            // Afila suavemente do Soma até a ponta dendrítica
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

            // Ramificações Dendríticas Secundárias + Espinhas Dendríticas
            [0.45, 0.72].forEach((branchT, bSub) => {
                const startSub = dCurve.getPointAt(branchT);
                const subEnd = startSub.clone().add(new THREE.Vector3(
                    (bSub === 0 ? -0.65 : -0.45),
                    (dIdx % 2 === 0 ? 0.75 : -0.75) * (bSub === 0 ? 1 : -0.7),
                    (bSub === 0 ? 0.55 : -0.55)
                ));
                const subCurve = new THREE.CatmullRomCurve3([startSub, subEnd]);
                dendGroup.add(new THREE.Mesh(new THREE.TubeGeometry(subCurve, 14, 0.055, 8, false), materials.dendriteMat));

                // Espinhas Dendríticas (pequenos botões pós-sinápticos)
                const spine = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 10), materials.dendriteMat);
                spine.position.copy(subEnd);
                dendGroup.add(spine);
            });
        });
        nGroup.add(dendGroup);
        this.registerNeuronPart('NEURON_DENDRITES', dendGroup, isPrimary ? dendriteTargets[0].clone() : null);

        // 4. AXÔNIO CENTRAL + BAINHAS DE MIELINA + CÉLULAS DE SCHWANN + NÓDULOS DE RANVIER
        const axonCurve = new THREE.CatmullRomCurve3(axonPoints);
        const axonGroup = new THREE.Group();
        const axonMesh = new THREE.Mesh(new THREE.TubeGeometry(axonCurve, 64, 0.12, 16, false), materials.axonCoreMat);
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
            for (let k = 0; k <= 12; k++) {
                subPts.push(axonCurve.getPointAt(tStart + (tEnd - tStart) * (k / 12)));
            }
            const segCurve = new THREE.CatmullRomCurve3(subPts);
            const segGeo = new THREE.TubeGeometry(segCurve, 24, 0.28, 20, false);
            const segMesh = new THREE.Mesh(segGeo, materials.myelinMat);
            myelinGroup.add(segMesh);

            // Núcleo Verde-Esmeralda da Célula de Schwann / Oligodendrócito aderido à superfície da Bainha de Mielina
            const midT = (tStart + tEnd) * 0.5;
            const midPt = axonCurve.getPointAt(midT);
            const schwannNuc = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), materials.schwannNucleusMat);
            schwannNuc.scale.set(1.65, 0.85, 0.95);
            schwannNuc.position.copy(midPt).add(new THREE.Vector3(0, (s % 2 === 0 ? 0.25 : -0.25), 0.14));
            schwannGroup.add(schwannNuc);

            // Nódulo de Ranvier entre este internodo e o próximo
            if (s < numSegments - 1) {
                const nodeT = tEnd + gapSpan * 0.5;
                const nodePt = axonCurve.getPointAt(Math.min(0.98, nodeT));
                const tangent = axonCurve.getTangentAt(Math.min(0.98, nodeT));
                const nodeRing = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.045, 12, 24), materials.ranvierMat);
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

        // 5. TERMINAL DO AXÔNIO (TELODENDRO) + BOTÕES SINÁPTICOS + FENDAS SINÁPTICAS (Axodendríticas e Axoaxônicas)
        const terminalGroup = new THREE.Group();
        const synapseGroup = new THREE.Group();

        terminalBranches.forEach((branch, bIdx) => {
            const bCurve = new THREE.CatmullRomCurve3(branch.points);
            const bGeo = new THREE.TubeGeometry(bCurve, 24, 0.085, 12, false);
            terminalGroup.add(new THREE.Mesh(bGeo, materials.terminalMat));

            const tipPt = branch.points[branch.points.length - 1];
            // Botão Terminal Pré-Sináptico
            const bouton = new THREE.Mesh(new THREE.SphereGeometry(0.19, 20, 20), materials.terminalMat);
            bouton.scale.set(1.25, 0.95, 0.95);
            bouton.position.copy(tipPt);
            terminalGroup.add(bouton);

            // Halo da Fenda Sináptica + Vesículas de Neurotransmissores atravessando a sinapse
            const cleftHalo = new THREE.Mesh(
                new THREE.RingGeometry(0.12, 0.34, 24),
                new THREE.MeshBasicMaterial({
                    color: branch.type === 'AXOAXONIC' ? 0x38bdf8 : 0xfacc15,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.78
                })
            );
            cleftHalo.position.copy(tipPt);
            cleftHalo.rotation.y = Math.PI / 2;
            synapseGroup.add(cleftHalo);

            // Cria nuvem de 14 vesículas/moléculas de neurotransmissores animadas nesta fenda sináptica
            const vCount = 14;
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

        // 6. Pulso Luminoso do Potencial de Ação Saltatório ao longo do Axônio deste Neurônio
        const apGlow = new THREE.Mesh(
            new THREE.SphereGeometry(0.26, 20, 20),
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
            group: nGroup,
            axonCurve,
            apGlow,
            apProgress: index === 0 ? 0.0 : (index === 2 ? 0.45 : 0.72),
            apSpeed: index === 0 ? 0.58 : 0.48
        });

        this.microGroup.add(nGroup);
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
        this.firingRateHz = Math.min(85.0, this.firingRateHz + 18.0);
        if (this.neurons.length > 0) {
            this.neurons[0].apProgress = 0.02;
        }
        this.synapseConnections.forEach(syn => {
            syn.burstIntensity = 1.0;
        });
    }

    update(dt, elapsed) {
        if (!this.microGroup.visible) return;

        // 1. Anima a Condução Saltatória do Potencial de Ação ao longo dos axônios e Nódulos de Ranvier
        this.neurons.forEach(n => {
            n.apProgress += dt * n.apSpeed;
            if (n.apProgress >= 1.0) {
                n.apProgress = 0.0;
                // Quando o potencial de ação chega ao Terminal do Axônio, dispara liberação sináptica!
                this.synapseConnections.forEach(syn => {
                    syn.burstIntensity = 1.0;
                });
                if (n.isPrimary) {
                    this.spikePhase = 0.01;
                }
            }
            const pt = n.axonCurve.getPointAt(n.apProgress);
            n.apGlow.position.copy(pt);
            // Efeito saltatório: pulsa mais forte ao passar pelos Nódulos de Ranvier
            const saltatoryPulse = 1.0 + 0.45 * Math.abs(Math.sin(n.apProgress * Math.PI * 5.0));
            n.apGlow.scale.setScalar(saltatoryPulse);
        });

        // 2. Anima as Vesículas de Neurotransmissores atravessando as Fendas Sinápticas (Axodendríticas e Axoaxônicas)
        this.synapseConnections.forEach((syn, idx) => {
            syn.burstIntensity = Math.max(0.18, syn.burstIntensity - dt * 1.4);
            const haloScale = 0.85 + 0.55 * syn.burstIntensity + 0.15 * Math.sin(elapsed * 8.0 + idx);
            syn.halo.scale.setScalar(haloScale);

            const posAttr = syn.vesicles.geometry.attributes.position;
            for (let v = 0; v < posAttr.count; v++) {
                const angle = elapsed * 4.5 + v * 1.1;
                const radius = (0.08 + ((elapsed * 0.45 + v * 0.07) % 0.38)) * (0.7 + 0.6 * syn.burstIntensity);
                posAttr.setXYZ(
                    v,
                    syn.center.x + Math.cos(angle) * radius,
                    syn.center.y + Math.sin(angle * 1.3) * radius,
                    syn.center.z + Math.sin(angle * 0.8) * radius
                );
            }
            posAttr.needsUpdate = true;
        });

        // 3. Atualiza a curva fisiológica do Potencial de Ação (mV) para o Osciloscópio
        if (this.spikePhase > 0.0) {
            this.spikePhase += dt * 3.8;
            if (this.spikePhase < 0.25) {
                // Fase 1: Despolarização rápida (Influxo de Na+) de -70 mV até +40 mV
                this.membranePotentialMv = -70.0 + (this.spikePhase / 0.25) * 110.0;
            } else if (this.spikePhase < 0.60) {
                // Fase 2: Repolarização (Efluxo de K+) de +40 mV até -85 mV
                const tRep = (this.spikePhase - 0.25) / 0.35;
                this.membranePotentialMv = 40.0 - tRep * 125.0;
            } else if (this.spikePhase < 1.0) {
                // Fase 3: Hiperpolarização pós-potencial e retorno ao repouso (-70 mV via Na+/K+ ATPase)
                const tRest = (this.spikePhase - 0.60) / 0.40;
                this.membranePotentialMv = -85.0 + tRest * 15.0;
            } else {
                this.membranePotentialMv = -70.0;
                this.spikePhase = 0.0;
            }
        } else {
            this.membranePotentialMv = -70.0 + Math.sin(elapsed * 4.0) * 1.5;
        }
        this.firingRateHz = Math.max(14.0, this.firingRateHz - dt * 2.5);
    }
}

window.NeuralMicrocosmos3D = NeuralMicrocosmos3D;
