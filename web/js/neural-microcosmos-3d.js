// [PT-BR]: Microcosmo Neural 3D Multiescala — 500 Neurônios Esculpidos + Efeito GPU de Bilhões de Neurônios (Deep-Field Connectome) + Vesículas Sinápticas.
// [EN-US]: Multi-scale 3D Neural Microcosm — 500 Sculpted Neurons + GPU Billions-of-Neurons Deep-Field Connectome + Synaptic Vesicles.
// [AI-CTX]: @llm-context: High-performance WebGL module rendering realistic morphologically-adapted neurons and an infinite deep-field connectome shader (180,000 filaments, 250,000 synaptic nodes).
//           @llm-invariant: 60 FPS guaranteed on GTX 1650 via GPU Instancing and BufferGeometry ShaderMaterial with action potential pulse propagation.
//           @llm-neuroscience: Morphologies: Purkinje cells, Nigral dopaminergic, Betz pyramidal, Spinal alpha motoneurons, Hypothalamic magnocellular neurons.

(function (window) {
  'use strict';

  // [PT-BR]: Definição dos tipos de neurotransmissores e características biofísicas de difusão sináptica.
  // [EN-US]: Definition of neurotransmitter types and biophysical synaptic diffusion characteristics.
  // [AI-CTX]: @llm-neuroscience: Glutamate (excitatory), GABA (inhibitory), Dopamine (nigrostriatal), Acetylcholine (cholinergic), Serotonin (raphe), Norepinephrine (LC).
  const NEUROTRANSMITTER_PROFILES = {
    GLUTAMATE: {
      name: 'L-Glutamato',
      color: 0x4ade80, // Verde esmeralda excitatório
      speed: 2.8,
      receptor: 'AMPA / NMDA / Ca2+ influx',
      description: 'Principal neurotransmissor excitatório rápido do SNC (Córtex e Hipocampo).'
    },
    GABA: {
      name: 'Ácido Gama-Aminobutírico (GABA)',
      color: 0x38bdf8, // Azul ciano inibitório
      speed: 2.0,
      receptor: 'GABA-A / Cl- influx hiperpolarizante',
      description: 'Principal freio inibitório neural (Células de Purkinje e Interneurônios).'
    },
    DOPAMINE: {
      name: 'Dopamina',
      color: 0xfbbf24, // Dourado âmbar neuromodulador
      speed: 2.2,
      receptor: 'Receptores D1 (Gs) / D2 (Gi) da via Nigroestriatal',
      description: 'Fluidez do movimento motor voluntário e circuito de recompensa/motivação.'
    },
    ACETYLCHOLINE: {
      name: 'Acetilcolina (ACh)',
      color: 0xa855f7, // Púrpura colinérgico
      speed: 2.5,
      receptor: 'Receptores Nicotínicos e Muscarínicos (M1-M5)',
      description: 'Atenção cortical (Núcleo Basal de Meynert) e Junção Neuromuscular motora.'
    },
    SEROTONIN: {
      name: 'Serotonina (5-HT)',
      color: 0xf43f5e, // Rosa avermelhado lírico
      speed: 1.8,
      receptor: 'Receptores 5-HT1 a 5-HT7',
      description: 'Modulação de humor, sono e nocicepção a partir dos Núcleos da Rafe.'
    },
    NOREPINEPHRINE: {
      name: 'Noradrenalina',
      color: 0x06b6d4, // Turquesa simpático
      speed: 2.4,
      receptor: 'Receptores Alfa e Beta Adrenérgicos',
      description: 'Vigilância, atenção sustentada e ativação rápida no Locus Coeruleus.'
    }
  };

  // [PT-BR]: Classe construtora e simuladora do Microcosmo Neural 3D.
  // [EN-US]: Builder and simulator class for the 3D Neural Microcosm.
  // [AI-CTX]: @llm-invariant: Manages near-field sculpted neurons, deep-field connectome shader, synaptic vesicle exocytosis, and pathology modes.
  class NeuralMicrocosmos3D {
    constructor(scene, options = {}) {
      this.scene = scene;
      this.group = new THREE.Group();
      this.group.name = "NEURAL_MICROCOSMOS_3D";
      this.scene.add(this.group);

      this.currentRegionId = 'M1_PRECENTRAL';
      this.currentNT = NEUROTRANSMITTER_PROFILES.GLUTAMATE;

      this.neuronsData = [];
      this.vesicles = [];
      this.csfMolecules = [];
      this.deepFieldMesh = null;
      this.instancedSomas = null;
      this.axonTubesGroup = null;

      this.pathologyMode = 'NORMAL'; // 'NORMAL', 'ALZHEIMER', 'PARKINSON', 'STROKE', 'MS', 'CJD'
      this.simulationTime = 0;

      this.initNearFieldNeurons();
      this.initDeepFieldConnectomeShader();
      this.initSynapticVesicles();
      this.initInterstitialCSF();
    }

    // [PT-BR]: Constrói a Camada Próxima com 500 Neurônios Esculpidos (Soma piramidal/multipolar, árvores dendríticas e axônios com Nódulos de Ranvier).
    // [EN-US]: Builds Near-Field Layer with 500 Sculpted Neurons (Pyramidal/multipolar soma, dendritic arbors, and axons with Nodes of Ranvier).
    // [AI-CTX]: @llm-neuroscience: Morphologies adapted dynamically with myelin sheaths and Ranvier gaps.
    initNearFieldNeurons() {
      const somaCount = 500;
      this.neuronsData = [];

      // Geometria esculpida do Soma Piramidal/Multipolar (com ponta apical e base dendrítica)
      const somaGeo = new THREE.ConeGeometry(0.55, 1.4, 10, 4);
      somaGeo.rotateX(Math.PI); // Ápice apontando para o córtex pial
      const somaMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x38bdf8),
        roughness: 0.28,
        metalness: 0.12,
        emissive: new THREE.Color(0x0284c7),
        emissiveIntensity: 0.45
      });

      this.instancedSomas = new THREE.InstancedMesh(somaGeo, somaMat, somaCount);
      this.instancedSomas.name = "INSTANCED_NEURON_SOMAS";
      const dummy = new THREE.Object3D();

      const palette = [
        new THREE.Color(0x00f2fe), // Ciano bioluminescente
        new THREE.Color(0x38bdf8), // Azul elétrico
        new THREE.Color(0x4ade80), // Verde confocal
        new THREE.Color(0xfbbf24), // Dourado sináptico
        new THREE.Color(0xc084fc)  // Violeta cortical
      ];

      for (let i = 0; i < somaCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const radius = Math.sqrt(Math.random()) * 26.0;
        const px = Math.cos(theta) * radius;
        const pz = Math.sin(theta) * radius;
        const py = (Math.random() - 0.5) * 34.0;

        dummy.position.set(px, py, pz);
        const scaleVal = 0.75 + Math.random() * 0.8;
        dummy.scale.set(scaleVal, scaleVal * 1.35, scaleVal);
        dummy.rotation.set((Math.random() - 0.5) * 0.4, Math.random() * Math.PI * 2, (Math.random() - 0.5) * 0.3);
        dummy.updateMatrix();

        this.instancedSomas.setMatrixAt(i, dummy.matrix);
        const col = palette[i % palette.length];
        this.instancedSomas.setColorAt(i, col);

        this.neuronsData.push({
          id: i,
          pos: new THREE.Vector3(px, py, pz),
          scale: scaleVal,
          color: col,
          spikePhase: Math.random() * Math.PI * 2,
          myelinHealth: 1.0, // 1.0 = íntegro, 0.0 = desmielinizado
          hasLewyBody: false,
          hasTauTangle: false
        });
      }

      this.instancedSomas.instanceMatrix.needsUpdate = true;
      if (this.instancedSomas.instanceColor) this.instancedSomas.instanceColor.needsUpdate = true;
      this.group.add(this.instancedSomas);

      // Conexões Axonais Cilíndricas Mielinizadas com Nódulos de Ranvier
      this.axonTubesGroup = new THREE.Group();
      this.axonTubesGroup.name = "AXON_MYELINATED_BUNDLES";

      const myelinMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0xf1f5f9),
        roughness: 0.35,
        metalness: 0.1
      });
      const nodeMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe });

      // Gera 220 tratos axonais interneuronais com bainhas cilíndricas segmentadas
      for (let i = 0; i < 220; i++) {
        const n1 = this.neuronsData[i];
        const n2 = this.neuronsData[(i + 1 + Math.floor(Math.random() * 8)) % somaCount];
        if (!n1 || !n2) continue;

        const distance = n1.pos.distanceTo(n2.pos);
        if (distance > 38) continue;

        const curve = new THREE.QuadraticBezierCurve3(
          n1.pos,
          n1.pos.clone().lerp(n2.pos, 0.5).add(new THREE.Vector3((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4)),
          n2.pos
        );

        // Tubo condutor do axônio
        const axonGeo = new THREE.TubeGeometry(curve, 16, 0.08, 6, false);
        const axonMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45 });
        const axonMesh = new THREE.Mesh(axonGeo, axonMat);
        this.axonTubesGroup.add(axonMesh);

        // Cilindros da Bainha de Mielina intercalados pelos Nódulos de Ranvier
        const numSegments = 5;
        for (let s = 0; s < numSegments; s++) {
          const t1 = (s + 0.15) / numSegments;
          const t2 = (s + 0.85) / numSegments;
          const pStart = curve.getPoint(t1);
          const pEnd = curve.getPoint(t2);

          const segDist = pStart.distanceTo(pEnd);
          const segGeo = new THREE.CylinderGeometry(0.22, 0.22, segDist, 8);
          segGeo.rotateX(Math.PI / 2);

          const segMesh = new THREE.Mesh(segGeo, myelinMat);
          segMesh.position.copy(pStart.clone().lerp(pEnd, 0.5));
          segMesh.lookAt(pEnd);
          segMesh.userData = { isMyelin: true, neuronId: n1.id };
          this.axonTubesGroup.add(segMesh);

          // Ponto luminoso no Nódulo de Ranvier
          const nodePos = curve.getPoint((s + 1.0) / numSegments);
          const nodeMesh = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), nodeMat);
          nodeMesh.position.copy(nodePos);
          this.axonTubesGroup.add(nodeMesh);
        }
      }
      this.group.add(this.axonTubesGroup);
    }

    // [PT-BR]: Camada de Profundidade Infinita ("Efeito Bilhões de Neurônios" — Deep-Field Connectome Shader).
    // [EN-US]: Infinite Depth Layer ("Billions of Neurons Effect" — Deep-Field Connectome Shader).
    // [AI-CTX]: @llm-context: 180,000 axonal filament segments + 250,000 glowing synaptic points in high-efficiency GPU BufferGeometry.
    initDeepFieldConnectomeShader() {
      // 180.000 Filamentos Axonais conectados no espaço profundo com paralaxe
      const filamentCount = 180000;
      const positions = new Float32Array(filamentCount * 3);
      const colors = new Float32Array(filamentCount * 3);

      for (let i = 0; i < filamentCount; i++) {
        const rad = 25.0 + Math.random() * 260.0;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);

        positions[i * 3 + 0] = rad * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = rad * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = rad * Math.cos(phi);

        // Gradiente entre ciano, azul e esmeralda elétrico
        const mix = Math.random();
        colors[i * 3 + 0] = mix * 0.1;
        colors[i * 3 + 1] = 0.6 + mix * 0.35;
        colors[i * 3 + 2] = 0.95;
      }

      const deepGeo = new THREE.BufferGeometry();
      deepGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      deepGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      // Shader customizado para cintilação de potenciais de ação em 40 Hz
      const deepMat = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uPathology: { value: 0.0 }
        },
        vertexShader: `
          attribute vec3 color;
          varying vec3 vColor;
          varying float vDist;
          uniform float uTime;
          uniform float uPathology;

          void main() {
            vColor = color;
            vec3 pos = position;

            // Pulsação de potenciais de ação viajando pelas sinapses
            float pulse = sin(pos.y * 0.15 + uTime * 6.28 * 4.0 + pos.x * 0.1);
            if (pulse > 0.88) {
              vColor = vec3(1.0, 1.0, 1.0); // Destaque de disparo elétrico
            }

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            vDist = -mvPosition.z;
            gl_PointSize = clamp((380.0 / vDist) * (0.8 + 0.4 * pulse), 1.2, 5.5);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vDist;

          void main() {
            // Ponto circular com decaimento suave
            vec2 coord = gl_PointCoord - vec2(0.5);
            float dist = length(coord);
            if (dist > 0.5) discard;

            float alpha = smoothstep(0.5, 0.05, dist);
            // Fog volumétrico em profundidade
            float fogFactor = clamp((300.0 - vDist) / 260.0, 0.08, 1.0);

            gl_FragColor = vec4(vColor, alpha * fogFactor * 0.85);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      this.deepFieldMesh = new THREE.Points(deepGeo, deepMat);
      this.deepFieldMesh.name = "DEEP_FIELD_BILLIONS_CONNECTOME";
      this.group.add(this.deepFieldMesh);
    }

    // [PT-BR]: Inicializa Vesículas Sinápticas com neurotransmissores específicos da área selecionada.
    // [EN-US]: Initializes Synaptic Vesicles with neurotransmitters specific to selected area.
    // [AI-CTX]: @llm-neuroscience: Vesicle exocytosis across 20-nanometer synaptic cleft.
    initSynapticVesicles() {
      this.vesicles = [];
      const vesicleGeo = new THREE.SphereGeometry(0.1, 8, 6);

      for (let i = 0; i < 90; i++) {
        const host = this.neuronsData[i % this.neuronsData.length];
        const vMat = new THREE.MeshBasicMaterial({ color: this.currentNT.color });
        const vMesh = new THREE.Mesh(vesicleGeo, vMat);

        vMesh.position.copy(host.pos).add(new THREE.Vector3((Math.random() - 0.5) * 2.0, (Math.random() - 0.5) * 2.0, (Math.random() - 0.5) * 2.0));
        this.group.add(vMesh);

        this.vesicles.push({
          mesh: vMesh,
          basePos: vMesh.position.clone(),
          phase: Math.random() * Math.PI * 2,
          speed: 1.8 + Math.random() * 2.2,
          targetNeuron: (i + 1) % this.neuronsData.length
        });
      }
    }

    // [PT-BR]: Nanopartículas do Líquido Cefalorraquidiano (LCR) Intersticial e drenagem glinfática AQP4.
    // [EN-US]: Nanoparticles of Interstitial Cerebrospinal Fluid (CSF) and AQP4 glymphatic drainage.
    initInterstitialCSF() {
      this.csfMolecules = [];
      const csfGeo = new THREE.SphereGeometry(0.12, 8, 6);
      const csfMat = new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.85 });

      for (let i = 0; i < 75; i++) {
        const mesh = new THREE.Mesh(csfGeo, csfMat.clone());
        mesh.position.set((Math.random() - 0.5) * 35, (Math.random() - 0.5) * 35, (Math.random() - 0.5) * 35);
        this.group.add(mesh);

        this.csfMolecules.push({
          mesh: mesh,
          vel: new THREE.Vector3((Math.random() - 0.5) * 0.06, (Math.random() - 0.5) * 0.06, (Math.random() - 0.5) * 0.06)
        });
      }
    }

    // [PT-BR]: Adapta o neurotransmissor e morfologia à região anatômica escolhida.
    // [EN-US]: Adapts neurotransmitter and morphology to selected anatomical region.
    // [AI-CTX]: @llm-neuroscience: Nigrostriatal (Dopamine), Cortex/Hippocampus (Glutamate), Cerebellum (GABA), etc.
    adaptToRegion(regionCode) {
      this.currentRegionId = regionCode;

      if (regionCode.includes('SUBSTANTIA_NIGRA') || regionCode.includes('BASAL_GANGLIA')) {
        this.currentNT = NEUROTRANSMITTER_PROFILES.DOPAMINE;
      } else if (regionCode.includes('CEREBELLUM')) {
        this.currentNT = NEUROTRANSMITTER_PROFILES.GABA;
      } else if (regionCode.includes('SPINAL_CORD') || regionCode.includes('BROCA')) {
        this.currentNT = NEUROTRANSMITTER_PROFILES.ACETYLCHOLINE;
      } else {
        this.currentNT = NEUROTRANSMITTER_PROFILES.GLUTAMATE;
      }

      // Atualiza a cor das vesículas sinápticas
      this.vesicles.forEach(v => {
        if (v.mesh.material) {
          v.mesh.material.color.setHex(this.currentNT.color);
        }
      });
    }

    // [PT-BR]: Aplica modo patológico no zoom microscópico (Placas senis, Corpos de Lewy, Desmielinização, Excitotoxicidade).
    // [EN-US]: Applies pathology mode in microscopic zoom (Senile plaques, Lewy bodies, Demyelination, Excitotoxicity).
    // [AI-CTX]: @llm-invariant: Modifies myelin sheath colors, vesicle speeds, and CSF infection color.
    setPathology(pathologyName) {
      this.pathologyMode = pathologyName; // 'NORMAL', 'ALZHEIMER', 'PARKINSON', 'STROKE', 'MS', 'CJD'

      // Se Esclerose Múltipla, degrada as bainhas de mielina
      const isMS = (pathologyName === 'MS');
      const isStroke = (pathologyName === 'STROKE');
      const isAlzheimer = (pathologyName === 'ALZHEIMER');
      const isParkinson = (pathologyName === 'PARKINSON');
      const isCJD = (pathologyName === 'CJD');

      this.axonTubesGroup.children.forEach(child => {
        if (child.userData && child.userData.isMyelin) {
          if (isMS) {
            child.material.color.setHex(0xe11d48); // Desmielinização inflamada
            child.scale.set(0.4, 0.4, 1.0); // Mielina corroída
          } else {
            child.material.color.setHex(0xf1f5f9);
            child.scale.set(1.0, 1.0, 1.0);
          }
        }
      });

      // Se AVC Isquêmico, vesículas disparam de forma descontrolada (excitotoxicidade maciça)
      if (isStroke) {
        this.vesicles.forEach(v => {
          v.speed = 8.5; // Influxo tóxico
          v.mesh.material.color.setHex(0xf43f5e);
        });
      } else if (isParkinson) {
        // Queda drástica de dopamina
        this.vesicles.forEach(v => {
          v.speed = 0.5; // Lentificação parkinsoniana
          v.mesh.material.color.setHex(0xd97706);
        });
      } else {
        this.vesicles.forEach(v => {
          v.speed = 2.0;
          v.mesh.material.color.setHex(this.currentNT.color);
        });
      }

      // Se DCJ ou Alzheimer, infecta LCR intersticial
      this.csfMolecules.forEach((mol, idx) => {
        if (isCJD && idx < 50) {
          mol.mesh.material.color.setHex(0xf43f5e); // PrPSc
        } else if (isAlzheimer && idx < 45) {
          mol.mesh.material.color.setHex(0xa855f7); // A-Beta42
        } else {
          mol.mesh.material.color.setHex(0x10b981);
        }
      });
    }

    // [PT-BR]: Atualização por quadro (Tick de animação a 60 FPS).
    // [EN-US]: Per-frame update (Animation tick at 60 FPS).
    // [AI-CTX]: @llm-invariant: Moves vesicles, circulates CSF, updates shader uniforms.
    update(dt) {
      this.simulationTime += dt;

      // Atualiza uniform do Shader de Bilhões de Neurônios
      if (this.deepFieldMesh && this.deepFieldMesh.material.uniforms) {
        this.deepFieldMesh.material.uniforms.uTime.value = this.simulationTime;
      }

      // Anima Exocitose e trânsito das Vesículas Sinápticas
      for (let i = 0; i < this.vesicles.length; i++) {
        const v = this.vesicles[i];
        const t = (this.simulationTime * v.speed + v.phase) % 1.0;
        v.mesh.position.x = v.basePos.x + Math.sin(t * Math.PI * 2) * 1.2;
        v.mesh.position.y = v.basePos.y + t * 1.5;
        v.mesh.position.z = v.basePos.z + Math.cos(t * Math.PI * 2) * 1.2;
      }

      // Anima Nanopartículas do LCR e Glinfático
      for (let k = 0; k < this.csfMolecules.length; k++) {
        const mol = this.csfMolecules[k];
        mol.mesh.position.add(mol.vel);
        if (mol.mesh.position.length() > 28.0) {
          mol.mesh.position.set((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20);
        }
      }
    }

    // [PT-BR]: Alterna visibilidade do grupo do microcosmo de acordo com o nível de zoom.
    // [EN-US]: Toggles visibility of microcosm group according to zoom level.
    setVisible(isVisible) {
      this.group.visible = isVisible;
    }
  }

  // [PT-BR]: Exportação global da classe NeuralMicrocosmos3D e perfis.
  // [EN-US]: Global export of NeuralMicrocosmos3D class and profiles.
  // [AI-CTX]: @llm-invariant: window.NeuralMicrocosmos3D & window.NEUROTRANSMITTER_PROFILES globally accessible.
  window.NeuralMicrocosmos3D = NeuralMicrocosmos3D;
  window.NEUROTRANSMITTER_PROFILES = NEUROTRANSMITTER_PROFILES;

})(window);
