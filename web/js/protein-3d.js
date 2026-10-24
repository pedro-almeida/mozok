/**
 * ============================================================================
 * MOZOK / DCJ — PHOTOREALISTIC MULTIPOLAR CONNECTOME & PRION CASCADE SIMULATOR
 * MOTOR "GTX 1650 UNLEASHED" — 500 NEURÔNIOS 3D, VOZ IA & NEUROPATOLOGIA REAL
 * ============================================================================
 * - Arquitetura Híbrida de 500 Neurônios Corticais 3D Interligados:
 *     * Camada Hero (24 Neurônios Gigantes Multipolares/Piramidais): Pericário
 *       esculpido (SphereGeometry 36x28) com meniscos suaves, membrana translúcida
 *       com shader Fresnel de dois fótons, grande Núcleo Celular DAPI + Nucléolo dourado,
 *       20 organelas citoplasmáticas (10 mitocôndrias + 10 corpúsculos de Nissl),
 *       troncos dendríticos curvos com Trumpet Root-Flare e forquilhas soldadas,
 *       axônio longo com 6 cápsulas de Mielina e Nódulos de Ranvier.
 *     * Camada Macro-Conectoma Denso (476 Neurônios em InstancedMesh GPU):
 *       476 Somas Piramidais/Estrelados, 476 Núcleos Azuis-Violeta e 1.400 Cápsulas
 *       de Mielina renderizados em apenas 3 draw calls; árvores dendríticas reais SWC
 *       (window.SWC_NEURONS_DATA) + fractais curvas em LineSegments com >160.000 segmentos.
 * - 3.500 Espinhas Dendríticas 3D em Cogumelo (THREE.InstancedMesh):
 *     * Distribuídas ao longo dos dendritos com atrofia progressiva por perda sináptica.
 * - 1.400 Pulsos de Potencial de Ação: Condução saltatória rápida pelas fibras.
 * - 60 Fendas Sinápticas Ativas com 2.100 Moléculas de Neurotransmissores:
 *     * Jatos de Glutamato (verde #4ade80) e GABA (azul-ciano #38bdf8), receptores
 *       AMPA/NMDA e influxo excitotóxico de Cálcio (Ca2+ #fbbf24).
 * - Neuropatologia Cirúrgica Fiel à DCJ Humana:
 *     * 45 Vacúolos Espongiformes Reais: microcistos ocos translúcidos de fluido com anel
 *       refrativo interno que acompanha o ângulo da câmera (lookAt), sem bolas vermelhas.
 *     * 35 Placas Amiloides Estreladas Tipo Kuru: feixes radiados de 16 agulhas cruzadas
 *       em vermelho-rubi e âmbar (#dc2626 / #d97706) crescendo nas bifurcações.
 *     * Dano no soma suave e translúcido (tom roxo-acinzentado/âmbar distrófico).
 * - Narrador Médico com Voz Humana Natural (AIMedicalNarrator):
 *     * Web Speech API com seleção inteligente de vozes neurais pt-BR da Microsoft/Google,
 *       sincronizada com o diretor de câmera em 5 Atos cinematográficos.
 * - Escalabilidade de até 5.000 Proteínas (PrPC 3 Hélices/Cu2+ -> PrPSc Beta-Solenoide).
 * ============================================================================
 */

(function () {
  'use strict';

  /**
   * GERENCIADOR DE VOZ HUMANA NATURAL IA (Web Speech API)
   */
  class AIMedicalNarrator {
    constructor() {
      this.synth = (typeof window !== 'undefined' && 'speechSynthesis' in window) ? window.speechSynthesis : null;
      this.enabled = true;
      this.voices = [];
      this.selectedVoice = null;
      this.currentUtterance = null;

      if (this.synth) {
        this.loadVoices();
        if (this.synth.onvoiceschanged !== undefined) {
          this.synth.onvoiceschanged = () => this.loadVoices();
        }
      }
    }

    loadVoices() {
      if (!this.synth) return;
      this.voices = this.synth.getVoices() || [];
      this.selectedVoice = this.selectBestPortugueseVoice();
    }

    selectBestPortugueseVoice() {
      if (!this.voices || this.voices.length === 0) return null;

      // 1º Prioridade: Vozes Neurais Naturais da Microsoft (pt-BR / pt)
      const msNatural = this.voices.find(v =>
        v.name && v.name.toLowerCase().includes('natural') && (v.lang.startsWith('pt') || v.lang.includes('PT'))
      );
      if (msNatural) return msNatural;

      // 2º Prioridade: Google português do Brasil ou Luciana / Daniel / Maria / Heloisa
      const googlePt = this.voices.find(v =>
        v.name && (v.name.includes('Google') || v.name.includes('Luciana') || v.name.includes('Daniel') || v.name.includes('Maria') || v.name.includes('Heloisa')) &&
        (v.lang.startsWith('pt') || v.lang.includes('PT'))
      );
      if (googlePt) return googlePt;

      // 3º Prioridade: Qualquer voz declarada pt-BR
      const ptBr = this.voices.find(v => v.lang === 'pt-BR' || v.lang.replace('_', '-').startsWith('pt-BR'));
      if (ptBr) return ptBr;

      // 4º Prioridade: Qualquer voz lusófona
      const anyPt = this.voices.find(v => v.lang && v.lang.toLowerCase().startsWith('pt'));
      if (anyPt) return anyPt;

      return this.voices[0] || null;
    }

    /**
     * // [PT-BR]: Sintetiza a narração por voz humana IA e despacha para legendas acessíveis e avatar VLibras.
     * // [EN-US]: Synthesizes human AI voice narration and dispatches to accessible subtitles and VLibras avatar.
     * // [AI-CTX]: @llm-context Web Speech API bridge with synchronous dispatch to window.syncSpeechWithVLibras.
     * @param {string} text - Texto a ser narrado.
     * @param {Function} [onComplete] - Callback executado ao término da fala.
     */
    speak(text, onComplete) {
      // Disparo universal sincronizado com legendas de alto contraste e VLibras
      if (typeof window !== 'undefined' && typeof window.syncSpeechWithVLibras === 'function') {
        window.syncSpeechWithVLibras(text);
      }

      if (!this.enabled || !this.synth) {
        if (onComplete) onComplete();
        return;
      }

      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      if (!this.selectedVoice) {
        this.selectedVoice = this.selectBestPortugueseVoice();
      }
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }
      utterance.lang = 'pt-BR';
      utterance.rate = 1.04;
      utterance.pitch = 0.98;

      let completed = false;
      const finish = () => {
        if (!completed) {
          completed = true;
          this.currentUtterance = null;
          if (onComplete) onComplete();
        }
      };

      utterance.onend = finish;
      utterance.onerror = finish;

      // Safety timeout para navegadores que suspendem o áudio
      const approxDurationMs = Math.max(3000, (text.length / 14) * 1000 + 4500);
      setTimeout(() => {
        if (!completed) finish();
      }, approxDurationMs);

      this.currentUtterance = utterance;
      try {
        this.synth.speak(utterance);
      } catch (e) {
        finish();
      }
    }

    stop() {
      if (this.synth) {
        try {
          this.synth.cancel();
        } catch (e) {}
      }
      this.currentUtterance = null;
    }

    toggle() {
      this.enabled = !this.enabled;
      if (!this.enabled) {
        this.stop();
      }
      return this.enabled;
    }
  }

  class PrionNeuropilSimulator3D {
    constructor(containerId, engineInstance) {
      this.container = document.getElementById(containerId);
      if (!this.container || typeof THREE === 'undefined') return;

      this.width = this.container.clientWidth || 720;
      this.height = this.container.clientHeight || 440;

      this.engine = null;
      this.totalPrions = 250;
      this.damageRatio = 0.0;
      this.elapsed = 0;
      this.clock = new THREE.Clock();

      // Estruturas celulares e moleculares
      this.prions = [];
      this.shockwaves = [];
      this.vacuoles = [];
      this.amyloidPlaques = [];
      this.csfBiomarkers = [];
      this.neurons = [];
      this.myelinSheaths = [];
      this.synapseLinks = [];
      this.actionPulses = [];
      this.branchSegmentsForPuncta = [];
      this.spineMetadata = [];
      this.synapticClefts = [];

      // Sistema de Narração Humana IA & Controle da Apresentação
      this.narrator = new AIMedicalNarrator();
      this.guidedTourActive = false;
      this.currentAct = 1;
      this.actTime = 0;
      this.speechFinished = false;
      this.guidedBtnElement = null;
      this.guidedInoculated = false;

      // Paleta Brainbow & Microscopia Confocal Multifóton
      this.brainbowPalette = [
        new THREE.Color(0x00f2fe), // Ciano Elétrico
        new THREE.Color(0x38bdf8), // Azul Bioluminescente
        new THREE.Color(0x10b981), // Verde GFP Confocal
        new THREE.Color(0xd946ef), // Magenta Brainbow
        new THREE.Color(0xf59e0b), // Âmbar / Ouro Fluorescente
        new THREE.Color(0xf43f5e), // Coral / Rodamina
        new THREE.Color(0x8b5cf6), // Violeta Córtex
        new THREE.Color(0x84cc16)  // Verde-Lima Dendrítico
      ];

      this.initScene();
      this.buildSoftGlowTexture();
      this.buildSharedMolecularGeometries();
      this.buildBackgroundSpiderwebNeuropil();
      this.buildAnatomicalMultipolarNeurons();
      this.buildDenseMacroConnectome();
      this.build3DDendriticSpines();
      this.buildActiveSynapticNeurotransmitters();
      this.buildAmyloidPlaques();
      this.buildConfocalSynapticPuncta();
      this.buildActionPotentialPulses();
      this.buildSpongiformVacuoles();
      this.buildCSFBiomarkers();
      this.buildGuidedTourBanner();
      this.rebuildPopulation(this.totalPrions, 0.0);
      this.bindInteraction();

      if (engineInstance || window.simEngine) {
        this.attachEngine(engineInstance || window.simEngine);
      }

      this.onResize();
      this.animate();
    }

    attachEngine(engine) {
      if (!engine) return;
      this.engine = engine;
      if (typeof engine.registerPhysicsController === 'function') {
        engine.registerPhysicsController(this);
      }
      if (engine.totalProteins && engine.totalProteins !== this.totalPrions) {
        this.rebuildPopulation(engine.totalProteins, engine.damageRatio || 0.0);
      }
    }

    initScene() {
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x02050c);
      this.scene.fog = new THREE.FogExp2(0x02050c, 0.0065);

      this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 0.2, 420);
      this.camera.position.set(0, 9, 48);

      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
        alpha: false
      });
      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.48; // Calibração para GPU GTX 1650

      const oldCanvas = this.container.querySelector('canvas');
      if (oldCanvas) oldCanvas.remove();
      this.container.insertBefore(this.renderer.domElement, this.container.firstChild);

      if (typeof THREE.OrbitControls !== 'undefined') {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.06;
        this.controls.minDistance = 2.5;
        this.controls.maxDistance = 140.0;
        this.controls.target.set(0, 0, 0);
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.35;
      }

      // Iluminação Fisiológica Tridimensional de Três Pontos
      const ambientLight = new THREE.AmbientLight(0x0d1b2a, 1.45);
      this.scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0x38bdf8, 2.3);
      keyLight.position.set(24, 45, 32);
      this.scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0x818cf8, 1.6);
      fillLight.position.set(-28, -25, -20);
      this.scene.add(fillLight);

      const rimLight = new THREE.PointLight(0x10b981, 2.6, 120);
      rimLight.position.set(0, 32, -35);
      this.scene.add(rimLight);

      // Grupos Hierárquicos de Renderização
      this.connectomeGroup = new THREE.Group();
      this.prionPopulationGroup = new THREE.Group();
      this.molecularCSFGroup = new THREE.Group();
      this.confocalGroup = new THREE.Group();
      this.effectsGroup = new THREE.Group();

      this.scene.add(this.connectomeGroup);
      this.scene.add(this.prionPopulationGroup);
      this.scene.add(this.molecularCSFGroup);
      this.scene.add(this.confocalGroup);
      this.scene.add(this.effectsGroup);
    }

    buildSoftGlowTexture() {
      const size = 128;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      grad.addColorStop(0.0, 'rgba(255,255,255,1.0)');
      grad.addColorStop(0.2, 'rgba(224,242,254,0.85)');
      grad.addColorStop(0.5, 'rgba(56,189,248,0.4)');
      grad.addColorStop(0.8, 'rgba(14,165,233,0.12)');
      grad.addColorStop(1.0, 'rgba(2,6,23,0.0)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);

      this.glowTexture = new THREE.CanvasTexture(canvas);
      this.glowTexture.generateMipmaps = true;
    }

    buildSharedMolecularGeometries() {
      const buildHelixPts = (radius, pitch, turns, samples, axis = 'y') => {
        const pts = [];
        for (let i = 0; i <= samples; i++) {
          const u = i / samples;
          const theta = u * Math.PI * 2 * turns;
          const h = (u - 0.5) * pitch * turns;
          if (axis === 'y') pts.push(new THREE.Vector3(Math.cos(theta) * radius, h, Math.sin(theta) * radius));
          else if (axis === 'x') pts.push(new THREE.Vector3(h, Math.cos(theta) * radius, Math.sin(theta) * radius));
          else pts.push(new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, h));
        }
        return pts;
      };

      // 1. Geometria PrPC Saudável: 3 Alfa-Hélices (H1, H2, H3) + Cauda N-Terminal com 4 Cu2+
      const h1Curve = new THREE.CatmullRomCurve3(buildHelixPts(0.19, 0.45, 3.2, 36, 'y'));
      const h2Curve = new THREE.CatmullRomCurve3(buildHelixPts(0.18, 0.42, 3.0, 34, 'x'));
      const h3Curve = new THREE.CatmullRomCurve3(buildHelixPts(0.18, 0.40, 2.8, 32, 'z'));

      this.geoPrPC_H1 = new THREE.TubeGeometry(h1Curve, 28, 0.054, 7, false);
      this.geoPrPC_H2 = new THREE.TubeGeometry(h2Curve, 26, 0.052, 7, false);
      this.geoPrPC_H3 = new THREE.TubeGeometry(h3Curve, 24, 0.052, 7, false);

      const tailPts = [
        new THREE.Vector3(-0.35, -0.52, 0.12),
        new THREE.Vector3(-0.25, -0.78, -0.1),
        new THREE.Vector3(-0.42, -1.05, 0.14),
        new THREE.Vector3(-0.32, -1.32, 0.0)
      ];
      this.geoPrPC_Tail = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(tailPts), 16, 0.034, 5, false);

      this.cuIonPositions = [
        new THREE.Vector3(-0.35, -0.52, 0.12),
        new THREE.Vector3(-0.25, -0.78, -0.1),
        new THREE.Vector3(-0.42, -1.05, 0.14),
        new THREE.Vector3(-0.32, -1.32, 0.0)
      ];

      this.matPrPC = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x059669,
        emissiveIntensity: 0.85,
        roughness: 0.14,
        metalness: 0.18
      });
      this.matPrPC_H2 = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        emissive: 0x0891b2,
        emissiveIntensity: 0.85,
        roughness: 0.14,
        metalness: 0.18
      });
      this.matCuIon = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      this.geoCuIon = new THREE.SphereGeometry(0.068, 8, 8);

      // 2. Geometria "Em Conversão": Espiral parcialmente aberta em ouro incandescente
      const convPts = [];
      for (let i = 0; i <= 22; i++) {
        const u = i / 22;
        const angle = u * Math.PI * 3.4;
        const zig = (i % 2 === 0 ? 0.15 : -0.15) * u;
        convPts.push(new THREE.Vector3(
          Math.cos(angle) * 0.24 + zig,
          (u - 0.5) * 0.95,
          Math.sin(angle) * 0.24 - zig
        ));
      }
      this.geoConverting = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(convPts), 22, 0.068, 7, false);
      this.matConverting = new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        emissive: 0xf59e0b,
        emissiveIntensity: 1.5,
        roughness: 0.15,
        metalness: 0.3
      });

      // 3. Geometria PrPSc: Fita Pregueada Beta-Solenoide Cryo-EM em Tripla Fita Empilhada
      const buildBetaRung = (offsetZ) => {
        const betaPts = [];
        const rungs = 12;
        for (let i = 0; i <= rungs; i++) {
          const u = i / rungs;
          const x = (i % 2 === 0 ? -0.26 : 0.26);
          const y = (u - 0.5) * 0.95;
          const z = offsetZ + Math.sin(u * Math.PI * 2.0) * 0.08;
          betaPts.push(new THREE.Vector3(x, y, z));
        }
        return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(betaPts), 28, 0.058, 6, false);
      };

      this.geoPrPSc_R1 = buildBetaRung(-0.16);
      this.geoPrPSc_R2 = buildBetaRung(0.0);
      this.geoPrPSc_R3 = buildBetaRung(0.16);

      this.matPrPSc = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        emissive: 0xdc2626,
        emissiveIntensity: 1.15,
        roughness: 0.18,
        metalness: 0.35
      });

      // Onda de Choque 3D para Impacto/Inoculação
      this.geoShockwave = new THREE.RingGeometry(0.18, 0.32, 28);
      this.matShockwave = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
        depthWrite: false
      });
    }

    buildBackgroundSpiderwebNeuropil() {
      const filamentCount = 1400;
      const positions = [];
      const colors = [];

      for (let i = 0; i < filamentCount; i++) {
        const r1 = 8.0 + Math.random() * 60.0;
        const theta1 = Math.random() * Math.PI * 2;
        const phi1 = Math.acos(2 * Math.random() - 1);

        const r2 = r1 + (Math.random() - 0.5) * 14.0;
        const theta2 = theta1 + (Math.random() - 0.5) * 0.7;
        const phi2 = phi1 + (Math.random() - 0.5) * 0.5;

        const x1 = r1 * Math.sin(phi1) * Math.cos(theta1);
        const y1 = r1 * Math.sin(phi1) * Math.sin(theta1) * 0.65;
        const z1 = r1 * Math.cos(phi1);

        const x2 = r2 * Math.sin(phi2) * Math.cos(theta2);
        const y2 = r2 * Math.sin(phi2) * Math.sin(theta2) * 0.65;
        const z2 = r2 * Math.cos(phi2);

        positions.push(x1, y1, z1, x2, y2, z2);

        const c = this.brainbowPalette[i % this.brainbowPalette.length];
        const alpha = 0.22 + Math.random() * 0.35;
        colors.push(c.r * alpha, c.g * alpha, c.b * alpha, c.r * alpha * 0.7, c.g * alpha * 0.7, c.b * alpha * 0.7);
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

      this.spiderwebMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.44,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      this.spiderwebLines = new THREE.LineSegments(geo, this.spiderwebMat);
      this.connectomeGroup.add(this.spiderwebLines);
    }

    appendTaperedTube(curve, tubularSegments, radialSegments, rStart, rEnd, color, outPos, outNorm, outCol, outIdx, isPrimaryTrunk = false) {
      const frames = curve.computeFrenetFrames(tubularSegments, false);
      const baseVertex = outPos.length / 3;

      for (let i = 0; i <= tubularSegments; i++) {
        const u = i / tubularSegments;
        const pt = curve.getPointAt(u);
        const N = frames.normals[i];
        const B = frames.binormals[i];

        const flare = isPrimaryTrunk ? (rStart * 1.5 * Math.exp(-5.0 * u)) : 0;
        const radius = rStart * Math.pow(rEnd / Math.max(0.003, rStart), u) + flare;
        const shade = 1.0 - u * 0.22;

        for (let j = 0; j <= radialSegments; j++) {
          const v = (j / radialSegments) * Math.PI * 2;
          const sin = Math.sin(v);
          const cos = -Math.cos(v);

          const nx = cos * N.x + sin * B.x;
          const ny = cos * N.y + sin * B.y;
          const nz = cos * N.z + sin * B.z;

          outPos.push(pt.x + radius * nx, pt.y + radius * ny, pt.z + radius * nz);
          outNorm.push(nx, ny, nz);
          outCol.push(color.r * shade, color.g * shade, color.b * shade);
        }
      }

      const stride = radialSegments + 1;
      for (let i = 0; i < tubularSegments; i++) {
        for (let j = 0; j < radialSegments; j++) {
          const a = baseVertex + i * stride + j;
          const b = baseVertex + (i + 1) * stride + j;
          const c = baseVertex + (i + 1) * stride + (j + 1);
          const d = baseVertex + i * stride + (j + 1);
          outIdx.push(a, b, d, b, c, d);
        }
      }
    }

    /**
     * // [PT-BR]: Camada Hero: 32 neurônios piramidais e multipolares esculpidos no volume central com malhas detalhadas e bainhas cilíndricas.
     * // [EN-US]: Hero Layer: 32 multipolar/pyramidal sculpted neurons in the central volume with detailed meshes and cylindrical sheaths.
     * // [AI-CTX]: @llm-context Hero layer (32 neurons) with individual soma groups, Ranvier rings, and true cylindrical myelin.
     */
    buildAnatomicalMultipolarNeurons() {
      const heroCount = 32;

      const tubePositions = [];
      const tubeNormals = [];
      const tubeColors = [];
      const tubeIndices = [];

      const fineArborPositions = [];
      const fineArborColors = [];

      const ranvierRingGeo = new THREE.TorusGeometry(0.34, 0.048, 8, 16);
      const ranvierRingMat = new THREE.MeshStandardMaterial({
        color: 0x00f2fe,
        emissive: 0x00f2fe,
        emissiveIntensity: 1.35,
        roughness: 0.1
      });

      for (let n = 0; n < heroCount; n++) {
        const angle = (n / heroCount) * Math.PI * 2;
        const radius = 6.2 + (n % 5) * 4.6; // 6.2 a 24.6
        const elev = ((n % 6) - 2.5) * 3.2;
        const center = new THREE.Vector3(
          Math.cos(angle) * radius * 1.15,
          elev,
          Math.sin(angle) * radius
        );

        const color = this.brainbowPalette[n % this.brainbowPalette.length].clone();
        const somaGroup = new THREE.Group();
        somaGroup.position.copy(center);

        const axonDir = new THREE.Vector3(
          Math.cos((n + 1) / heroCount * Math.PI * 2) - Math.cos((n / heroCount) * Math.PI * 2),
          -0.35,
          Math.sin((n + 1) / heroCount * Math.PI * 2) - Math.sin((n / heroCount) * Math.PI * 2)
        ).normalize();

        const dendriteDirs = [];
        const dendriteCount = 6;
        for (let d = 0; d < dendriteCount; d++) {
          const dTheta = (d / dendriteCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.35;
          const dPhi = Math.PI * 0.35 + (d % 2) * 0.45;
          const dir = new THREE.Vector3(
            Math.sin(dPhi) * Math.cos(dTheta),
            Math.cos(dPhi),
            Math.sin(dPhi) * Math.sin(dTheta)
          ).normalize();
          dendriteDirs.push(dir);
        }

        // 1. Soma Esculpido em Alta Resolução (SphereGeometry 36x28) com Meniscos
        const somaBaseRadius = 2.25;
        const somaGeo = new THREE.SphereGeometry(somaBaseRadius, 36, 28);
        const posAttr = somaGeo.attributes.position;
        const vertex = new THREE.Vector3();

        for (let i = 0; i < posAttr.count; i++) {
          vertex.fromBufferAttribute(posAttr, i);
          const u = vertex.clone().normalize();
          let protrusion = 0;

          const dotAxon = Math.max(0, u.dot(axonDir));
          protrusion += Math.pow(dotAxon, 3.0) * 0.7;

          for (let d = 0; d < dendriteDirs.length; d++) {
            const dotDend = Math.max(0, u.dot(dendriteDirs[d]));
            protrusion += Math.pow(dotDend, 3.0) * 0.6;
          }

          vertex.addScaledVector(u, protrusion);
          posAttr.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }
        somaGeo.computeVertexNormals();

        // Material com Shader Fresnel de Borda Injetado
        const somaMat = new THREE.MeshPhysicalMaterial({
          color: color,
          emissive: color,
          emissiveIntensity: 0.52,
          roughness: 0.16,
          metalness: 0.05,
          transparent: true,
          opacity: 0.78,
          transmission: 0.38
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
            gl_FragColor.rgb += gl_FragColor.rgb * fresnel * 0.85 + vec3(0.08, 0.22, 0.35) * fresnel;
            #endif
            `
          );
        };

        const somaMesh = new THREE.Mesh(somaGeo, somaMat);
        somaGroup.add(somaMesh);

        // Halo Bioluminescente Suave
        const spriteMat = new THREE.SpriteMaterial({
          map: this.glowTexture,
          color: color,
          transparent: true,
          opacity: 0.45,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.scale.setScalar(somaBaseRadius * 4.6);
        somaGroup.add(sprite);

        // 2. Núcleo DAPI + Nucléolo Dourado
        const nucleusRadius = somaBaseRadius * 0.5;
        const nucleusGeo = new THREE.SphereGeometry(nucleusRadius, 24, 20);
        const nucleusMat = new THREE.MeshStandardMaterial({
          color: 0x4338ca,
          emissive: 0x312e81,
          emissiveIntensity: 0.85,
          roughness: 0.28
        });
        const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
        somaGroup.add(nucleusMesh);

        const nucleolusGeo = new THREE.SphereGeometry(nucleusRadius * 0.38, 14, 14);
        const nucleolusMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
        const nucleolusMesh = new THREE.Mesh(nucleolusGeo, nucleolusMat);
        nucleolusMesh.position.set(nucleusRadius * 0.22, nucleusRadius * 0.18, nucleusRadius * 0.2);
        somaGroup.add(nucleolusMesh);

        // 20 Organelas Citoplasmáticas Internas: 10 Mitocôndrias + 10 Corpúsculos de Nissl
        const mitoGeo = new THREE.SphereGeometry(0.12, 8, 8);
        mitoGeo.scale(0.85, 1.8, 0.85);
        const mitoMat = new THREE.MeshStandardMaterial({
          color: 0xf97316,
          emissive: 0xea580c,
          emissiveIntensity: 0.8,
          roughness: 0.25
        });
        for (let m = 0; m < 10; m++) {
          const mMesh = new THREE.Mesh(mitoGeo, mitoMat);
          const dist = nucleusRadius * 1.25 + Math.random() * (somaBaseRadius - nucleusRadius * 1.35);
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          mMesh.position.set(dist * Math.sin(phi) * Math.cos(theta), dist * Math.sin(phi) * Math.sin(theta), dist * Math.cos(phi));
          mMesh.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
          somaGroup.add(mMesh);
        }

        const nisslGeo = new THREE.SphereGeometry(0.11, 8, 8);
        const nisslMat = new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          emissive: 0x0284c7,
          emissiveIntensity: 0.75,
          roughness: 0.3
        });
        for (let k = 0; k < 10; k++) {
          const nMesh = new THREE.Mesh(nisslGeo, nisslMat);
          const dist = nucleusRadius * 1.25 + Math.random() * (somaBaseRadius - nucleusRadius * 1.35);
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          nMesh.position.set(dist * Math.sin(phi) * Math.cos(theta), dist * Math.sin(phi) * Math.sin(theta), dist * Math.cos(phi));
          somaGroup.add(nMesh);
        }

        this.connectomeGroup.add(somaGroup);

        const neuronRecord = {
          id: n,
          isHero: true,
          center,
          color,
          baseColor: color.clone(),
          axonDir,
          somaGroup,
          somaMat,
          nucleusMat,
          spriteMat,
          myelinMeshes: [],
          health: 1.0
        };
        this.neurons.push(neuronRecord);

        // 3. Axônio Longo com Bainhas Cilíndricas Anatômicas e Nódulos de Ranvier
        const axonLen = 13.5;
        const axonP0 = center.clone().addScaledVector(axonDir, somaBaseRadius * 0.35);
        const axonMid1 = axonP0.clone().addScaledVector(axonDir, axonLen * 0.35).add(new THREE.Vector3(
          (Math.random() - 0.5) * 1.8,
          (Math.random() - 0.5) * 1.8,
          (Math.random() - 0.5) * 1.8
        ));
        const axonMid2 = axonP0.clone().addScaledVector(axonDir, axonLen * 0.7).add(new THREE.Vector3(
          (Math.random() - 0.5) * 1.8,
          (Math.random() - 0.5) * 1.8,
          (Math.random() - 0.5) * 1.8
        ));
        const axonP3 = axonP0.clone().addScaledVector(axonDir, axonLen);

        const axonCurve = new THREE.CatmullRomCurve3([axonP0, axonMid1, axonMid2, axonP3]);
        const axonPts = axonCurve.getPoints(18);

        this.synapseLinks.push({ pts: axonPts, colorA: color, colorB: color });

        this.appendTaperedTube(
          axonCurve, 18, 8, 0.24, 0.11, color,
          tubePositions, tubeNormals, tubeColors, tubeIndices,
          true
        );

        // 6 Bainhas de Mielina Cilíndricas Anatômicas Reais (Zero ovais/balões)
        const myelinCount = 6;
        const internodeLen = axonLen / myelinCount;
        const axonR = 0.22;
        const cylMyelinGeo = new THREE.CylinderGeometry(axonR * 1.18, axonR * 1.18, internodeLen * 0.82, 12, 1, false);

        for (let m = 0; m < myelinCount; m++) {
          const tCenter = (m + 0.5) / myelinCount;
          const pos = axonCurve.getPointAt(tCenter);
          const tangent = axonCurve.getTangentAt(tCenter).normalize();

          const matMyelin = new THREE.MeshStandardMaterial({
            color: 0xe0f2fe,
            emissive: 0x0284c7,
            emissiveIntensity: 0.38,
            roughness: 0.18,
            metalness: 0.1,
            transparent: true,
            opacity: 0.86
          });

          const mMesh = new THREE.Mesh(cylMyelinGeo, matMyelin);
          mMesh.position.copy(pos);
          mMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);

          this.connectomeGroup.add(mMesh);
          neuronRecord.myelinMeshes.push(mMesh);
          this.myelinSheaths.push({ mesh: mMesh, baseScale: mMesh.scale.clone(), neuronId: n });

          if (m < myelinCount - 1) {
            const tNode = (m + 1.0) / myelinCount;
            const nodePos = axonCurve.getPointAt(tNode);
            const nodeTangent = axonCurve.getTangentAt(tNode).normalize();
            const rRing = new THREE.Mesh(ranvierRingGeo, ranvierRingMat);
            rRing.position.copy(nodePos);
            rRing.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), nodeTangent);
            this.connectomeGroup.add(rRing);
          }
        }

        // Telodendro Terminal com 4 Ramos e Bulbos Sinápticos
        const bulboGeo = new THREE.SphereGeometry(0.26, 10, 8);
        const bulboMat = new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          emissive: 0x0284c7,
          emissiveIntensity: 0.85
        });

        for (let t = 0; t < 4; t++) {
          const tDir = axonDir.clone().add(new THREE.Vector3(
            (Math.random() - 0.5) * 1.2,
            (Math.random() - 0.5) * 1.2,
            (Math.random() - 0.5) * 1.2
          )).normalize();
          const tEnd = axonP3.clone().addScaledVector(tDir, 1.8);
          const tCurve = new THREE.CatmullRomCurve3([axonP3, tEnd]);
          this.appendTaperedTube(
            tCurve, 4, 6, 0.1, 0.03, color,
            tubePositions, tubeNormals, tubeColors, tubeIndices
          );

          const bMesh = new THREE.Mesh(bulboGeo, bulboMat);
          bMesh.position.copy(tEnd);
          this.connectomeGroup.add(bMesh);
        }

        // 4. Coroa Dendrítica com 5 Pontos de Controle e Juntas Soldadas
        const growDendriteTree = (startPt, startDir, length, rStart, order, maxOrder) => {
          const isPrimary = (order === 1);
          const rEnd = rStart * 0.52;

          const segLen = length * 0.25;
          const dev1 = new THREE.Vector3((Math.random() - 0.5) * 0.45, (Math.random() - 0.5) * 0.45, (Math.random() - 0.5) * 0.45);
          const dev2 = new THREE.Vector3((Math.random() - 0.5) * 0.52, (Math.random() - 0.5) * 0.52, (Math.random() - 0.5) * 0.52);
          const dev3 = new THREE.Vector3((Math.random() - 0.5) * 0.52, (Math.random() - 0.5) * 0.52, (Math.random() - 0.5) * 0.52);

          const p1 = startPt.clone().addScaledVector(startDir, segLen).add(dev1);
          const dir1 = p1.clone().sub(startPt).normalize();
          const p2 = p1.clone().addScaledVector(dir1, segLen).add(dev2);
          const dir2 = p2.clone().sub(p1).normalize();
          const p3 = p2.clone().addScaledVector(dir2, segLen).add(dev3);
          const dir3 = p3.clone().sub(p2).normalize();
          const p4 = p3.clone().addScaledVector(dir3, segLen);

          const curve = new THREE.CatmullRomCurve3([startPt, p1, p2, p3, p4]);

          if (order <= 4) {
            const tubSegs = isPrimary ? 14 : 9;
            const radSegs = isPrimary ? 12 : 7;
            this.appendTaperedTube(
              curve, tubSegs, radSegs, rStart, rEnd, color,
              tubePositions, tubeNormals, tubeColors, tubeIndices,
              isPrimary
            );
          }

          const sampled = curve.getPoints(7);
          for (let s = 0; s < sampled.length - 1; s++) {
            const a = sampled[s];
            const b = sampled[s + 1];
            const tangent = b.clone().sub(a).normalize();
            this.branchSegmentsForPuncta.push({
              a, b, color, order, neuronId: n, tangent, radius: (rStart + rEnd) * 0.5
            });

            if (order >= 3) {
              fineArborPositions.push(a.x, a.y, a.z, b.x, b.y, b.z);
              const bright = 0.88;
              fineArborColors.push(
                color.r * bright, color.g * bright, color.b * bright,
                color.r * bright * 0.8, color.g * bright * 0.8, color.b * bright * 0.8
              );
            }
          }

          if (order < maxOrder) {
            // Solda esférica suave no nó de bifurcação para fechar 100% qualquer fresta
            const weldRadius = rEnd * 0.98;
            const wBase = tubePositions.length / 3;
            const wRings = 4;
            const wSlices = 6;
            for (let wi = 0; wi <= wRings; wi++) {
              const uW = wi / wRings;
              const thetaW = uW * Math.PI;
              const sinW = Math.sin(thetaW);
              const cosW = Math.cos(thetaW);
              for (let wj = 0; wj <= wSlices; wj++) {
                const vW = (wj / wSlices) * Math.PI * 2;
                const wx = p4.x + weldRadius * sinW * Math.cos(vW);
                const wy = p4.y + weldRadius * cosW;
                const wz = p4.z + weldRadius * sinW * Math.sin(vW);
                tubePositions.push(wx, wy, wz);
                tubeNormals.push(sinW * Math.cos(vW), cosW, sinW * Math.sin(vW));
                tubeColors.push(color.r * 0.92, color.g * 0.92, color.b * 0.92);
              }
            }
            const wStride = wSlices + 1;
            for (let wi = 0; wi < wRings; wi++) {
              for (let wj = 0; wj < wSlices; wj++) {
                const wa = wBase + wi * wStride + wj;
                const wb = wBase + (wi + 1) * wStride + wj;
                const wc = wBase + (wi + 1) * wStride + (wj + 1);
                const wd = wBase + wi * wStride + (wj + 1);
                tubeIndices.push(wa, wb, wd, wb, wc, wd);
              }
            }

            const children = 2;
            const rChildStart = rEnd * 0.96;
            for (let c = 0; c < children; c++) {
              const spread = 0.38 + order * 0.08;
              const ortho = new THREE.Vector3(
                Math.random() - 0.5,
                Math.random() - 0.5,
                Math.random() - 0.5
              ).normalize();
              const nextDir = dir3.clone().addScaledVector(ortho, spread).normalize();
              // Iniciar ligeiramente recuado dentro do final do ramo pai com sobreposição de raio
              const childStart = p4.clone().addScaledVector(dir3, -rEnd * 0.85);
              growDendriteTree(childStart, nextDir, length * 0.72, rChildStart, order + 1, maxOrder);
            }
          }
        };

        dendriteDirs.forEach((dir, dIdx) => {
          const origin = center.clone().addScaledVector(dir, somaBaseRadius * 0.35);
          const len = 6.2 + (dIdx % 2) * 1.6;
          const r0 = 0.48;
          growDendriteTree(origin, dir, len, r0, 1, 3);
        });
      }

      // Malha Tubular Contínua Unificada com Shader Fresnel
      const mergedTubeGeo = new THREE.BufferGeometry();
      mergedTubeGeo.setAttribute('position', new THREE.Float32BufferAttribute(tubePositions, 3));
      mergedTubeGeo.setAttribute('normal', new THREE.Float32BufferAttribute(tubeNormals, 3));
      mergedTubeGeo.setAttribute('color', new THREE.Float32BufferAttribute(tubeColors, 3));
      mergedTubeGeo.setIndex(tubeIndices);

      this.dendriteTubeMat = new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.26,
        metalness: 0.12,
        emissive: new THREE.Color(0x0a1526),
        emissiveIntensity: 0.45
      });
      this.dendriteTubeMat.onBeforeCompile = (shader) => {
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <dithering_fragment>',
          `
          #include <dithering_fragment>
          #ifdef USE_NORMAL
          vec3 fNorm = normalize(vNormal);
          vec3 fVDir = normalize(-vViewPosition);
          float fresnel = pow(clamp(1.0 - abs(dot(fNorm, fVDir)), 0.0, 1.0), 2.2);
          gl_FragColor.rgb += gl_FragColor.rgb * fresnel * 0.75;
          #endif
          `
        );
      };

      this.dendriteTubeMesh = new THREE.Mesh(mergedTubeGeo, this.dendriteTubeMat);
      this.connectomeGroup.add(this.dendriteTubeMesh);

      // Pontes Sinápticas Inter-Neuronais Curvas
      for (let i = 0; i < this.neurons.length; i++) {
        for (let j = i + 1; j < this.neurons.length; j++) {
          const dist = this.neurons[i].center.distanceTo(this.neurons[j].center);
          if (dist < 26.0 && Math.random() < 0.65) {
            const pA = this.neurons[i].center;
            const pB = this.neurons[j].center;
            const mid1 = pA.clone().lerp(pB, 0.33).add(new THREE.Vector3((Math.random() - 0.5) * 3.2, (Math.random() - 0.5) * 3.2, (Math.random() - 0.5) * 3.2));
            const mid2 = pA.clone().lerp(pB, 0.66).add(new THREE.Vector3((Math.random() - 0.5) * 3.2, (Math.random() - 0.5) * 3.2, (Math.random() - 0.5) * 3.2));

            const bridgeCurve = new THREE.CatmullRomCurve3([pA, mid1, mid2, pB]);
            const sampledPts = bridgeCurve.getPoints(14);
            const cA = this.neurons[i].color;
            const cB = this.neurons[j].color;

            for (let k = 0; k < sampledPts.length - 1; k++) {
              const a = sampledPts[k];
              const b = sampledPts[k + 1];
              fineArborPositions.push(a.x, a.y, a.z, b.x, b.y, b.z);
              const col = cA.clone().lerp(cB, k / (sampledPts.length - 1));
              fineArborColors.push(col.r, col.g, col.b, col.r, col.g, col.b);
            }

            this.synapseLinks.push({ pts: sampledPts, colorA: cA, colorB: cB });
          }
        }
      }

      const arborGeo = new THREE.BufferGeometry();
      arborGeo.setAttribute('position', new THREE.Float32BufferAttribute(fineArborPositions, 3));
      arborGeo.setAttribute('color', new THREE.Float32BufferAttribute(fineArborColors, 3));

      this.arborMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.88,
        blending: THREE.AdditiveBlending
      });

      this.arborMesh = new THREE.LineSegments(arborGeo, this.arborMat);
      this.connectomeGroup.add(this.arborMesh);
    }

    /**
     * // [PT-BR]: Construtor de Arquétipos Completos de Neurônios Multopolares/Piramidais 3D fundidos em geometria contínua.
     * // [EN-US]: Generator of Complete 3D Multipolar/Pyramidal Neuron Archetypes fused into continuous BufferGeometry.
     * // [AI-CTX]: @llm-context Builds one of 5 cortical archetypes with root-flare soma, CatmullRom Rall dendrites, mushroom spines, and concentric Ranvier-separated myelin cylinders.
     * @param {number} seed - Semente pseudoaleatória para variação procedural.
     * @param {number} variantIndex - Índice do arquétipo (0: Piramidal Betz V, 1: Piramidal III, 2: Estrelado Espinhoso, 3: Multipolar Associativo, 4: Candelabro/Basket).
     * @returns {THREE.BufferGeometry} Geometria contínua fundida com posições e normais calculadas.
     */
    buildCompleteNeuronArchetypeGeometry(seed, variantIndex) {
      // Função interna de mesclagem de geometrias Three.js sem dependências externas
      function mergeBufferGeometries(geos) {
        let totalPos = 0, totalNorm = 0, totalIdx = 0;
        for (let i = 0; i < geos.length; i++) {
          const g = geos[i];
          totalPos += g.attributes.position.array.length;
          if (g.attributes.normal) totalNorm += g.attributes.normal.array.length;
          if (g.index) totalIdx += g.index.array.length;
          else totalIdx += g.attributes.position.count;
        }
        const posArray = new Float32Array(totalPos);
        const normArray = totalNorm > 0 ? new Float32Array(totalNorm) : null;
        const idxArray = new Uint32Array(totalIdx);

        let pOffset = 0, nOffset = 0, iOffset = 0, vOffset = 0;
        for (let i = 0; i < geos.length; i++) {
          const g = geos[i];
          const pos = g.attributes.position.array;
          posArray.set(pos, pOffset);
          pOffset += pos.length;

          if (normArray && g.attributes.normal) {
            const norm = g.attributes.normal.array;
            normArray.set(norm, nOffset);
            nOffset += norm.length;
          }

          if (g.index) {
            const idx = g.index.array;
            for (let j = 0; j < idx.length; j++) {
              idxArray[iOffset + j] = idx[j] + vOffset;
            }
            iOffset += idx.length;
          } else {
            const cnt = g.attributes.position.count;
            for (let j = 0; j < cnt; j++) {
              idxArray[iOffset + j] = j + vOffset;
            }
            iOffset += cnt;
          }
          vOffset += g.attributes.position.count;
        }

        const merged = new THREE.BufferGeometry();
        merged.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        if (normArray) merged.setAttribute('normal', new THREE.BufferAttribute(normArray, 3));
        merged.setIndex(new THREE.BufferAttribute(idxArray, 1));
        return merged;
      }

      // Função geradora de tubos afilados por curvatura suave e Lei de Rall
      function appendTubeGeom(curve, tubularSegs, radialSegs, rStart, rEnd, subGeos) {
        const frames = curve.computeFrenetFrames(tubularSegs, false);
        const positions = [];
        const normals = [];
        const indices = [];

        for (let i = 0; i <= tubularSegs; i++) {
          const u = i / tubularSegs;
          const pt = curve.getPointAt(u);
          const N = frames.normals[i];
          const B = frames.binormals[i];
          // Lei de Rall: afinamento progressivo contínuo d_filho = d_pai * (rEnd/rStart)^u
          const r = rStart * Math.pow(Math.max(0.001, rEnd) / Math.max(0.001, rStart), u);

          for (let j = 0; j <= radialSegs; j++) {
            const v = (j / radialSegs) * Math.PI * 2;
            const sin = Math.sin(v);
            const cos = -Math.cos(v);
            const nx = cos * N.x + sin * B.x;
            const ny = cos * N.y + sin * B.y;
            const nz = cos * N.z + sin * B.z;

            positions.push(pt.x + r * nx, pt.y + r * ny, pt.z + r * nz);
            normals.push(nx, ny, nz);
          }
        }

        const stride = radialSegs + 1;
        for (let i = 0; i < tubularSegs; i++) {
          for (let j = 0; j < radialSegs; j++) {
            const a = i * stride + j;
            const b = (i + 1) * stride + j;
            const c = (i + 1) * stride + (j + 1);
            const d = i * stride + (j + 1);
            indices.push(a, b, d, b, c, d);
          }
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        geo.setIndex(indices);
        subGeos.push(geo);
      }

      const subGeos = [];

      // 5 Arquétipos Morfológicos Corticais
      const somaRadiusList = [2.35, 1.95, 1.75, 1.85, 1.65];
      const somaRadius = somaRadiusList[variantIndex] || 2.0;

      // 1. Soma Piramidal/Multipolar Esculpido com root-flare hiperbólico nos polos
      const somaGeo = new THREE.SphereGeometry(somaRadius, 14, 12);
      const pAttr = somaGeo.attributes.position;
      const v = new THREE.Vector3();
      const apicalDir = (variantIndex === 2) ? new THREE.Vector3(0.2, 0.9, 0).normalize() : new THREE.Vector3(0, 1, 0);
      const axonDir = new THREE.Vector3(0, -1, 0);

      for (let i = 0; i < pAttr.count; i++) {
        v.fromBufferAttribute(pAttr, i);
        const u = v.clone().normalize();
        let flare = 0;
        flare += Math.pow(Math.max(0, u.dot(apicalDir)), 3.0) * (somaRadius * 0.45);
        flare += Math.pow(Math.max(0, u.dot(axonDir)), 3.2) * (somaRadius * 0.38);
        const basalAngleMod = (variantIndex === 2) ? 6 : 5;
        const radialDot = Math.max(0, -u.y);
        flare += Math.pow(radialDot, 2.5) * Math.sin(Math.atan2(u.z, u.x) * basalAngleMod) * (somaRadius * 0.12);

        v.addScaledVector(u, Math.max(0, flare));
        pAttr.setXYZ(i, v.x, v.y, v.z);
      }
      somaGeo.computeVertexNormals();
      subGeos.push(somaGeo);

      // Núcleo celular interno
      const nucGeo = new THREE.SphereGeometry(somaRadius * 0.46, 8, 8);
      subGeos.push(nucGeo);

      // Nucléolo interno
      const nclGeo = new THREE.SphereGeometry(somaRadius * 0.18, 6, 6);
      nclGeo.translate(somaRadius * 0.14, somaRadius * 0.14, somaRadius * 0.14);
      subGeos.push(nclGeo);

      // 2. Tronco Dendrítico Apical Longo com ramificações até a 4ª ordem (Rall)
      const apicalHeight = [16.0, 13.5, 9.5, 12.0, 10.5][variantIndex];
      const pA0 = apicalDir.clone().multiplyScalar(somaRadius * 0.9);
      const pA1 = pA0.clone().add(new THREE.Vector3(0.3, apicalHeight * 0.35, 0.2));
      const pA2 = pA1.clone().add(new THREE.Vector3(-0.4, apicalHeight * 0.35, -0.2));
      const pA3 = pA2.clone().add(new THREE.Vector3(0.2, apicalHeight * 0.3, 0.1));
      const cApical = new THREE.CatmullRomCurve3([pA0, pA1, pA2, pA3]);
      appendTubeGeom(cApical, 8, 6, 0.46, 0.22, subGeos);

      // Ramificações apicais de 2ª, 3ª e 4ª ordem (Lei de Rall: d_filho = d_pai * 2^(-2/3) ≈ 0.63)
      const rTuft1 = 0.22 * 0.63;
      const rTuft2 = rTuft1 * 0.63;
      const rTuft3 = rTuft2 * 0.63;

      const tuftDirs = [
        new THREE.Vector3(0.65, 0.75, 0.2).normalize(),
        new THREE.Vector3(-0.65, 0.75, -0.2).normalize()
      ];
      for (let td = 0; td < tuftDirs.length; td++) {
        const tEnd2 = pA3.clone().addScaledVector(tuftDirs[td], 3.2);
        const cT2 = new THREE.CatmullRomCurve3([pA3, tEnd2]);
        appendTubeGeom(cT2, 5, 5, 0.22, rTuft1, subGeos);

        const subTuftDirs = [
          tuftDirs[td].clone().add(new THREE.Vector3(0.2, 0.1, -0.3)).normalize(),
          tuftDirs[td].clone().add(new THREE.Vector3(-0.2, 0.1, 0.3)).normalize()
        ];
        for (let std = 0; std < subTuftDirs.length; std++) {
          const tEnd3 = tEnd2.clone().addScaledVector(subTuftDirs[std], 2.4);
          const cT3 = new THREE.CatmullRomCurve3([tEnd2, tEnd3]);
          appendTubeGeom(cT3, 4, 4, rTuft1, rTuft2, subGeos);

          const tEnd4 = tEnd3.clone().addScaledVector(subTuftDirs[std], 1.8);
          const cT4 = new THREE.CatmullRomCurve3([tEnd3, tEnd4]);
          appendTubeGeom(cT4, 3, 4, rTuft2, rTuft3, subGeos);
        }
      }

      // 3. 5 a 7 Árvores Dendríticas Basais Curvas em 3D ramificando até 3ª/4ª ordem
      const basalCount = [6, 5, 7, 6, 5][variantIndex];
      for (let b = 0; b < basalCount; b++) {
        const bAngle = (b / basalCount) * Math.PI * 2 + (seed * 0.4);
        const bElevation = -0.32 - (b % 3) * 0.12;
        const bDir = new THREE.Vector3(Math.cos(bAngle), bElevation, Math.sin(bAngle)).normalize();

        const b0 = bDir.clone().multiplyScalar(somaRadius * 0.85);
        const b1 = b0.clone().addScaledVector(bDir, 2.6).add(new THREE.Vector3(Math.sin(b) * 0.3, 0.2, Math.cos(b) * 0.3));
        const b2 = b1.clone().addScaledVector(bDir, 2.6);
        const cB1 = new THREE.CatmullRomCurve3([b0, b1, b2]);
        const rBasal0 = 0.38;
        const rBasal1 = rBasal0 * 0.63;
        appendTubeGeom(cB1, 5, 5, rBasal0, rBasal1, subGeos);

        const bForkDirs = [
          bDir.clone().add(new THREE.Vector3(0.35, 0.2, -0.35)).normalize(),
          bDir.clone().add(new THREE.Vector3(-0.35, 0.2, 0.35)).normalize()
        ];
        for (let f = 0; f < bForkDirs.length; f++) {
          const b3 = b2.clone().addScaledVector(bForkDirs[f], 2.2);
          const cB2 = new THREE.CatmullRomCurve3([b2, b3]);
          const rBasal2 = rBasal1 * 0.63;
          appendTubeGeom(cB2, 4, 4, rBasal1, rBasal2, subGeos);

          const b4 = b3.clone().addScaledVector(bForkDirs[f], 1.8);
          const cB3 = new THREE.CatmullRomCurve3([b3, b4]);
          const rBasal3 = rBasal2 * 0.63;
          appendTubeGeom(cB3, 3, 4, rBasal2, rBasal3, subGeos);
        }
      }

      // 4. Espinhos Dendríticos Reais (Dendritic Spines) brotando perpendicularmente
      const spineCount = 18;
      for (let s = 0; s < spineCount; s++) {
        const uS = 0.15 + (s / spineCount) * 0.78;
        const spineOrigin = cApical.getPointAt(uS);
        const spineTangent = cApical.getTangentAt(uS).normalize();
        const spinePerp = new THREE.Vector3(
          Math.sin(s * 2.1),
          Math.cos(s * 1.7),
          Math.sin(s * 3.3)
        ).cross(spineTangent).normalize();

        const neckLen = 0.32;
        const headPt = spineOrigin.clone().addScaledVector(spinePerp, neckLen);

        const spNeck = new THREE.CylinderGeometry(0.038, 0.046, neckLen, 5, 1, false);
        const neckMat = new THREE.Matrix4().makeRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), spinePerp));
        neckMat.setPosition(spineOrigin.clone().addScaledVector(spinePerp, neckLen * 0.5));
        spNeck.applyMatrix4(neckMat);
        subGeos.push(spNeck);

        const spHead = new THREE.SphereGeometry(0.11, 6, 6);
        spHead.applyMatrix4(new THREE.Matrix4().makeScale(1.15, 0.85, 1.15));
        spHead.applyMatrix4(new THREE.Matrix4().setPosition(headPt));
        subGeos.push(spHead);
      }

      // 5. Axônio Longo com Bainhas de Mielina Cilíndricas Anatômicas Reais
      const axonLen = 16.0;
      const a0 = axonDir.clone().multiplyScalar(somaRadius * 0.85);
      const a1 = a0.clone().add(new THREE.Vector3(0.25, -axonLen * 0.33, 0.1));
      const a2 = a1.clone().add(new THREE.Vector3(-0.25, -axonLen * 0.33, -0.1));
      const a3 = a2.clone().add(new THREE.Vector3(0.1, -axonLen * 0.34, 0.05));
      const cAxon = new THREE.CatmullRomCurve3([a0, a1, a2, a3]);
      const axonRadius = 0.22;
      appendTubeGeom(cAxon, 10, 6, axonRadius, axonRadius * 0.65, subGeos);

      // Bainhas de Mielina Cilíndricas Reais e Nódulos de Ranvier
      const internodes = 5;
      const internodeLen = axonLen / internodes;
      for (let m = 0; m < internodes; m++) {
        const tCenter = (m + 0.5) / internodes;
        const mPos = cAxon.getPointAt(tCenter);
        const mTangent = cAxon.getTangentAt(tCenter).normalize();

        const myelinRadius = axonRadius * 1.32;
        const cylLen = internodeLen * 0.82; // Separação anatômica no nódulo de Ranvier
        const cylGeo = new THREE.CylinderGeometry(myelinRadius, myelinRadius, cylLen, 8, 1, false);

        const cylMat = new THREE.Matrix4().makeRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), mTangent));
        cylMat.setPosition(mPos);
        cylGeo.applyMatrix4(cylMat);
        subGeos.push(cylGeo);
      }

      return mergeBufferGeometries(subGeos);
    }

    /**
     * // [PT-BR]: Conectoma Denso: 468 Neurônios Completos Ramificados em 5 Grupos de InstancedMesh por Arquétipo (Totalizando 500 neurônios reais!).
     * // [EN-US]: Dense Connectome: 468 Complete Branched Neurons across 5 Archetype InstancedMeshes (Totaling exactly 500 real neurons!).
     * // [AI-CTX]: @llm-context Zero balloon meshes, zero floating spheres; 5 full-mesh InstancedMeshes with Brainbow colors and complete morphology.
     */
    buildDenseMacroConnectome() {
      const macroCount = 468;
      const totalNeuronsTarget = 32 + macroCount; // Exatamente 500 neurônios reais e completos!

      // 1. Gerar os 5 arquétipos morfológicos completos
      const archetypes = [0, 1, 2, 3, 4].map(idx => this.buildCompleteNeuronArchetypeGeometry(idx * 2.3, idx));

      // 2. Dividir os 468 neurônios uniformemente entre os 5 arquétipos
      const archetypeMeshes = [];
      const archetypeGroupCounts = [94, 94, 94, 93, 93]; // 94+94+94+93+93 = 468

      const baseNeuronMat = new THREE.MeshStandardMaterial({
        roughness: 0.28,
        metalness: 0.12,
        transparent: true,
        opacity: 0.84,
        emissive: new THREE.Color(0x0a1526),
        emissiveIntensity: 0.45
      });

      for (let a = 0; a < 5; a++) {
        const count = archetypeGroupCounts[a];
        const instMesh = new THREE.InstancedMesh(archetypes[a], baseNeuronMat.clone(), count);
        instMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        archetypeMeshes.push(instMesh);
        this.connectomeGroup.add(instMesh);
      }

      this.archetypeInstancedMeshes = archetypeMeshes;

      const dummy = new THREE.Object3D();
      const linePositions = [];
      const lineColors = [];

      const swcAvailable = typeof window !== 'undefined' && Array.isArray(window.SWC_NEURONS_DATA) && window.SWC_NEURONS_DATA.length > 0;
      let globalIndex = 0;

      for (let a = 0; a < 5; a++) {
        const groupCount = archetypeGroupCounts[a];
        const instMesh = archetypeMeshes[a];

        for (let k = 0; k < groupCount; k++) {
          const neuronId = 32 + globalIndex;
          const angle = (globalIndex / macroCount) * Math.PI * 2 * 7.0 + 0.45;
          const radius = 18.0 + (globalIndex % 14) * 3.6;
          const elev = ((globalIndex % 11) - 5) * 4.2;

          const center = new THREE.Vector3(
            Math.cos(angle) * radius * 1.12,
            elev,
            Math.sin(angle) * radius
          );

          const color = this.brainbowPalette[(globalIndex + 3) % this.brainbowPalette.length];
          const sScale = 0.72 + (globalIndex % 5) * 0.12;

          // Rotação orgânica e posicionamento 3D do neurônio completo
          dummy.position.copy(center);
          dummy.scale.set(sScale, sScale, sScale);
          dummy.rotation.set((globalIndex % 3) * 0.35, angle, (globalIndex % 4) * 0.25);
          dummy.updateMatrix();

          instMesh.setMatrixAt(k, dummy.matrix);
          instMesh.setColorAt(k, color);

          const axonDir = new THREE.Vector3(
            (Math.random() - 0.5) * 2.0,
            -0.65 - Math.random() * 0.45,
            (Math.random() - 0.5) * 2.0
          ).normalize();

          // 4. Árvores Dendríticas e Axonais Reais (SWC) e Fractais de Interconexão
          if (swcAvailable && (globalIndex < 60)) {
            const swc = window.SWC_NEURONS_DATA[globalIndex % window.SWC_NEURONS_DATA.length];
            const segs = swc.segments || [];
            const swcMat = new THREE.Matrix4().compose(center, dummy.quaternion, new THREE.Vector3(1.35, 1.35, 1.35));

            for (let s = 0; s < segs.length; s++) {
              const seg = segs[s];
              const vA = new THREE.Vector3(seg[0], seg[1], seg[2]).applyMatrix4(swcMat);
              const vB = new THREE.Vector3(seg[3], seg[4], seg[5]).applyMatrix4(swcMat);

              linePositions.push(vA.x, vA.y, vA.z, vB.x, vB.y, vB.z);
              const isAxon = (seg[7] === 2);
              const bright = isAxon ? 0.92 : 0.72;
              lineColors.push(color.r * bright, color.g * bright, color.b * bright, color.r * bright * 0.8, color.g * bright * 0.8, color.b * bright * 0.8);

              if (s % 18 === 0) {
                this.branchSegmentsForPuncta.push({
                  a: vA, b: vB, color, order: 2, neuronId, tangent: vB.clone().sub(vA).normalize(), radius: 0.2
                });
              }
            }
          } else {
            // Fibras de Interconexão Dendrítica Cortical
            const branches = 4;
            for (let b = 0; b < branches; b++) {
              const bAngle = (b / branches) * Math.PI * 2 + (globalIndex * 0.15);
              let curPt = center.clone();
              let curDir = new THREE.Vector3(Math.cos(bAngle), (b % 2 === 0 ? 0.6 : -0.5), Math.sin(bAngle)).normalize();

              for (let seg = 0; seg < 4; seg++) {
                const segLen = 3.2 * Math.pow(0.75, seg);
                const jitter = new THREE.Vector3((Math.random() - 0.5) * 1.2, (Math.random() - 0.5) * 1.2, (Math.random() - 0.5) * 1.2);
                const nextPt = curPt.clone().addScaledVector(curDir, segLen).add(jitter);

                linePositions.push(curPt.x, curPt.y, curPt.z, nextPt.x, nextPt.y, nextPt.z);
                const bright = 0.82 - seg * 0.12;
                lineColors.push(color.r * bright, color.g * bright, color.b * bright, color.r * bright * 0.8, color.g * bright * 0.8, color.b * bright * 0.8);

                if (seg <= 2) {
                  this.branchSegmentsForPuncta.push({
                    a: curPt.clone(), b: nextPt.clone(), color, order: seg + 1, neuronId, tangent: nextPt.clone().sub(curPt).normalize(), radius: 0.22 - seg * 0.04
                  });
                }

                curPt = nextPt;
                curDir.add(new THREE.Vector3((Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.6)).normalize();
              }
            }
          }

          // Registro completo do neurônio
          this.neurons.push({
            id: neuronId,
            isHero: false,
            center,
            color,
            baseColor: color.clone(),
            axonDir,
            archetypeIndex: a,
            instanceIndex: k,
            health: 1.0
          });

          globalIndex++;
        }

        instMesh.instanceMatrix.needsUpdate = true;
        if (instMesh.instanceColor) instMesh.instanceColor.needsUpdate = true;
      }

      // Malha unificada de todas as ramificações densas
      const denseArborGeo = new THREE.BufferGeometry();
      denseArborGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
      denseArborGeo.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

      const denseArborMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.76,
        blending: THREE.AdditiveBlending
      });

      this.denseArborMesh = new THREE.LineSegments(denseArborGeo, denseArborMat);
      this.connectomeGroup.add(this.denseArborMesh);
    }

    /**
     * 3.500 ESPINHAS DENDRÍTICAS 3D EM FORMATO DE COGUMELO (THREE.InstancedMesh)
     */
    build3DDendriticSpines() {
      const spineCount = 3500; // Escalado para 3.500 espinhas!

      const neckGeo = new THREE.CylinderGeometry(0.042, 0.052, 0.38, 7);
      neckGeo.translate(0, 0.19, 0);

      const headGeo = new THREE.SphereGeometry(0.12, 8, 8);
      headGeo.scale(1.2, 0.88, 1.2);
      headGeo.translate(0, 0.42, 0);

      const p1 = neckGeo.attributes.position.array;
      const n1 = neckGeo.attributes.normal.array;
      const p2 = headGeo.attributes.position.array;
      const n2 = headGeo.attributes.normal.array;

      const mergedPos = new Float32Array(p1.length + p2.length);
      mergedPos.set(p1, 0);
      mergedPos.set(p2, p1.length);

      const mergedNorm = new Float32Array(n1.length + n2.length);
      mergedNorm.set(n1, 0);
      mergedNorm.set(n2, n1.length);

      const spineGeo = new THREE.BufferGeometry();
      spineGeo.setAttribute('position', new THREE.BufferAttribute(mergedPos, 3));
      spineGeo.setAttribute('normal', new THREE.BufferAttribute(mergedNorm, 3));

      this.spineMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.65,
        roughness: 0.22,
        metalness: 0.15
      });

      this.dendriticSpinesMesh = new THREE.InstancedMesh(spineGeo, this.spineMat, spineCount);
      this.dendriticSpinesMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

      const eligibleBranches = this.branchSegmentsForPuncta.filter(s => s.order <= 3);
      const branchPoolLen = Math.max(1, eligibleBranches.length);

      const dummy = new THREE.Object3D();
      this.spineMetadata = [];

      for (let i = 0; i < spineCount; i++) {
        const seg = eligibleBranches[i % branchPoolLen];
        const frac = Math.random();
        const pt = seg.a.clone().lerp(seg.b, frac);

        const T = seg.tangent || new THREE.Vector3(0, 1, 0);
        let ortho = Math.abs(T.y) < 0.9
          ? new THREE.Vector3(0, 1, 0).cross(T).normalize()
          : new THREE.Vector3(1, 0, 0).cross(T).normalize();

        const angle = Math.random() * Math.PI * 2;
        ortho.applyAxisAngle(T, angle);

        const rBranch = Math.max(0.12, seg.radius || 0.22);
        const spinePos = pt.clone().addScaledVector(ortho, rBranch * 0.95);

        dummy.position.copy(spinePos);
        dummy.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), ortho);
        const randomScale = 0.85 + Math.random() * 0.35;
        dummy.scale.set(randomScale, randomScale, randomScale);
        dummy.updateMatrix();

        this.dendriticSpinesMesh.setMatrixAt(i, dummy.matrix);
        this.dendriticSpinesMesh.setColorAt(i, seg.color || new THREE.Color(0x38bdf8));

        this.spineMetadata.push({
          initialMatrix: dummy.matrix.clone(),
          threshold: (i / spineCount) * 0.85,
          neuronId: seg.neuronId
        });
      }

      this.dendriticSpinesMesh.instanceMatrix.needsUpdate = true;
      if (this.dendriticSpinesMesh.instanceColor) {
        this.dendriticSpinesMesh.instanceColor.needsUpdate = true;
      }

      this.connectomeGroup.add(this.dendriticSpinesMesh);
    }

    /**
     * // [PT-BR]: 60 fendas sinápticas ativas com 2.100 moléculas neurotransmissoras (Glutamato e GABA).
     * // [EN-US]: 60 active synaptic clefts with 2,100 neurotransmitter molecules (Glutamate and GABA).
     * // [AI-CTX]: @llm-context Pre- and post-synaptic cleft sites with exocytosis bursts and excitotoxic calcium influx.
     */
    buildActiveSynapticNeurotransmitters() {
      this.synapticClefts = [];
      const cleftCount = 60; // 60 Fendas ativas
      const particlesPerCleft = 35;
      const totalParticles = cleftCount * particlesPerCleft; // 2.100 moléculas

      const ntPositions = new Float32Array(totalParticles * 3);
      const ntColors = new Float32Array(totalParticles * 3);

      const colorGlutamate = new THREE.Color(0x4ade80); // Verde Esmeralda/Limão (70%)
      const colorGABA = new THREE.Color(0x38bdf8);      // Azul Ciano (30%)

      const boutonGeo = new THREE.SphereGeometry(0.24, 10, 8);
      const receptorGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.08, 10);

      for (let c = 0; c < cleftCount; c++) {
        const hero = this.neurons[c % 32];
        const partner = this.neurons[(c + 5) % this.neurons.length];

        const prePos = hero.center.clone().addScaledVector(hero.axonDir || new THREE.Vector3(1, 0, 0), 6.5);
        const cleftDir = partner.center.clone().sub(prePos).normalize();
        const cleftDist = 1.6;
        const postPos = prePos.clone().addScaledVector(cleftDir, cleftDist);

        const isGlutamate = (c % 10 < 7);
        const baseColor = isGlutamate ? colorGlutamate : colorGABA;

        const matBouton = new THREE.MeshStandardMaterial({
          color: 0x0284c7,
          emissive: baseColor,
          emissiveIntensity: 0.6,
          roughness: 0.2
        });
        const boutonMesh = new THREE.Mesh(boutonGeo, matBouton);
        boutonMesh.position.copy(prePos);
        this.connectomeGroup.add(boutonMesh);

        const matReceptor = new THREE.MeshStandardMaterial({
          color: 0x1e293b,
          emissive: baseColor,
          emissiveIntensity: 0.7,
          roughness: 0.2
        });
        const receptorMesh = new THREE.Mesh(receptorGeo, matReceptor);
        receptorMesh.position.copy(postPos);
        receptorMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), cleftDir);
        this.connectomeGroup.add(receptorMesh);

        const cleftData = {
          id: c,
          prePos,
          postPos,
          cleftDir,
          cleftDist,
          isGlutamate,
          baseColor,
          receptorMat: matReceptor,
          flashIntensity: 0.7,
          startIndex: c * particlesPerCleft,
          particles: []
        };

        for (let p = 0; p < particlesPerCleft; p++) {
          const globalIdx = c * particlesPerCleft + p;
          const progress = Math.random();
          const jitter = new THREE.Vector3((Math.random() - 0.5) * 0.35, (Math.random() - 0.5) * 0.35, (Math.random() - 0.5) * 0.35);
          const pos = prePos.clone().lerp(postPos, progress).add(jitter);

          ntPositions[globalIdx * 3] = pos.x;
          ntPositions[globalIdx * 3 + 1] = pos.y;
          ntPositions[globalIdx * 3 + 2] = pos.z;

          ntColors[globalIdx * 3] = baseColor.r;
          ntColors[globalIdx * 3 + 1] = baseColor.g;
          ntColors[globalIdx * 3 + 2] = baseColor.b;

          cleftData.particles.push({
            progress,
            speed: 0.65 + Math.random() * 0.95,
            lateralJitter: (Math.random() - 0.5) * 0.25,
            isCalcium: false
          });
        }

        this.synapticClefts.push(cleftData);
      }

      const ntGeo = new THREE.BufferGeometry();
      ntGeo.setAttribute('position', new THREE.BufferAttribute(ntPositions, 3));
      ntGeo.setAttribute('color', new THREE.BufferAttribute(ntColors, 3));

      this.ntParticlesMat = new THREE.PointsMaterial({
        size: 0.62,
        map: this.glowTexture,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      this.ntPointsMesh = new THREE.Points(ntGeo, this.ntParticlesMat);
      this.confocalGroup.add(this.ntPointsMesh);
    }

    /**
     * 35 PLACAS AMILOIDES ESTRELADAS TIPO KURU (OURIÇOS DE 16 AGULHAS CRUZADAS)
     */
    buildAmyloidPlaques() {
      const plaqueCount = 35; // 35 Placas Amiloides
      const needleGeo = new THREE.CylinderGeometry(0.012, 0.035, 0.88, 5);
      needleGeo.translate(0, 0.44, 0);

      const matRuby = new THREE.MeshStandardMaterial({
        color: 0xdc2626,
        emissive: 0x991b1b,
        emissiveIntensity: 0.75,
        roughness: 0.35,
        metalness: 0.1
      });

      const matAmber = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.82,
        roughness: 0.3,
        metalness: 0.12
      });

      this.amyloidPlaques = [];

      for (let i = 0; i < plaqueCount; i++) {
        const plaqueGroup = new THREE.Group();
        const needleCount = 16; // 16 agulhas cruzadas

        for (let k = 0; k < needleCount; k++) {
          const mat = (k % 3 === 0) ? matAmber : matRuby;
          const needleMesh = new THREE.Mesh(needleGeo, mat);

          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const dir = new THREE.Vector3(
            Math.sin(phi) * Math.cos(theta),
            Math.sin(phi) * Math.sin(theta),
            Math.cos(phi)
          ).normalize();

          needleMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
          const nLen = 0.75 + Math.random() * 0.45;
          needleMesh.scale.set(1.0, nLen, 1.0);
          plaqueGroup.add(needleMesh);
        }

        const seg = this.branchSegmentsForPuncta[(i * 31 + 7) % Math.max(1, this.branchSegmentsForPuncta.length)];
        if (seg) {
          plaqueGroup.position.copy(seg.a).add(new THREE.Vector3(
            (Math.random() - 0.5) * 0.35,
            (Math.random() - 0.5) * 0.35,
            (Math.random() - 0.5) * 0.35
          ));
        } else {
          plaqueGroup.position.set((Math.random() - 0.5) * 32, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 32);
        }

        plaqueGroup.scale.setScalar(0.001);
        plaqueGroup.visible = false;
        this.connectomeGroup.add(plaqueGroup);

        this.amyloidPlaques.push({
          mesh: plaqueGroup,
          baseScale: 0.75 + Math.random() * 0.45,
          threshold: 0.20 + (i / plaqueCount) * 0.65
        });
      }
    }

    buildConfocalSynapticPuncta() {
      const punctaPositions = [];
      const punctaColors = [];

      const cGreenGFP = new THREE.Color(0x22c55e);
      const cRedRhodamine = new THREE.Color(0xef4444);
      const cCyanBouton = new THREE.Color(0x38bdf8);
      const cYellowMerge = new THREE.Color(0xfacc15);

      const totalSegs = this.branchSegmentsForPuncta.length;
      const step = Math.max(1, Math.floor(totalSegs / 2600));

      for (let i = 0; i < totalSegs; i += step) {
        const seg = this.branchSegmentsForPuncta[i];
        const pos = seg.a.clone().lerp(seg.b, Math.random());
        pos.x += (Math.random() - 0.5) * 0.25;
        pos.y += (Math.random() - 0.5) * 0.25;
        pos.z += (Math.random() - 0.5) * 0.25;

        punctaPositions.push(pos.x, pos.y, pos.z);

        const r = Math.random();
        let pCol = cGreenGFP;
        if (r < 0.28) pCol = cRedRhodamine;
        else if (r < 0.54) pCol = cCyanBouton;
        else if (r < 0.76) pCol = cYellowMerge;

        punctaColors.push(pCol.r, pCol.g, pCol.b);
      }

      const punctaGeo = new THREE.BufferGeometry();
      punctaGeo.setAttribute('position', new THREE.Float32BufferAttribute(punctaPositions, 3));
      punctaGeo.setAttribute('color', new THREE.Float32BufferAttribute(punctaColors, 3));

      this.punctaMat = new THREE.PointsMaterial({
        size: 0.52,
        map: this.glowTexture,
        vertexColors: true,
        transparent: true,
        opacity: 0.88,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      this.punctaCloud = new THREE.Points(punctaGeo, this.punctaMat);
      this.confocalGroup.add(this.punctaCloud);
    }

    /**
     * 1.400 PULSOS DE POTENCIAL DE AÇÃO
     */
    buildActionPotentialPulses() {
      const pulseCount = 1400; // Escalado para 1.400 pulsos!
      const positions = new Float32Array(pulseCount * 3);
      const colors = new Float32Array(pulseCount * 3);

      for (let i = 0; i < pulseCount; i++) {
        const link = this.synapseLinks[i % Math.max(1, this.synapseLinks.length)];
        this.actionPulses.push({
          link,
          t: Math.random(),
          speed: 0.35 + Math.random() * 0.65
        });

        colors[i * 3] = 0.85;
        colors[i * 3 + 1] = 0.98;
        colors[i * 3 + 2] = 1.0;
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      this.pulseMat = new THREE.PointsMaterial({
        size: 1.35,
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

    /**
     * 45 VACÚOLOS ESPONGIFORMES REAIS (MICROCISTOS OCOS TRANSLÚCIDOS DE FLUIDO)
     */
    buildSpongiformVacuoles() {
      const vacuoleCount = 45; // 45 microcistos ocos
      const cystGeo = new THREE.SphereGeometry(0.38, 18, 14);
      const cystMat = new THREE.MeshPhysicalMaterial({
        color: 0xe2e8f0,
        emissive: 0x38bdf8,
        emissiveIntensity: 0.15,
        transparent: true,
        opacity: 0.22,
        roughness: 0.05,
        metalness: 0.1,
        transmission: 0.85,
        depthWrite: false
      });

      const ringGeo = new THREE.RingGeometry(0.32, 0.38, 18);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.48,
        side: THREE.DoubleSide,
        depthWrite: false
      });

      this.vacuoles = [];

      for (let i = 0; i < vacuoleCount; i++) {
        const group = new THREE.Group();

        const cystMesh = new THREE.Mesh(cystGeo, cystMat);
        group.add(cystMesh);

        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        group.add(ringMesh);

        const seg = this.branchSegmentsForPuncta[(i * 23 + 11) % Math.max(1, this.branchSegmentsForPuncta.length)];
        if (seg) {
          group.position.copy(seg.a).add(new THREE.Vector3(
            (Math.random() - 0.5) * 0.3,
            (Math.random() - 0.5) * 0.3,
            (Math.random() - 0.5) * 0.3
          ));
        } else {
          group.position.set((Math.random() - 0.5) * 32, (Math.random() - 0.5) * 18, (Math.random() - 0.5) * 32);
        }

        group.scale.setScalar(0.001);
        group.visible = false;
        this.connectomeGroup.add(group);

        this.vacuoles.push({
          group,
          ringMesh,
          maxScale: 0.50 + Math.random() * 0.45,
          threshold: (i / vacuoleCount) * 0.78
        });
      }
    }

    buildCSFBiomarkers() {
      const biomarkerCount = 145;

      const mat1433 = new THREE.MeshStandardMaterial({
        color: 0xc084fc,
        emissive: 0x9333ea,
        emissiveIntensity: 1.15,
        roughness: 0.2
      });

      const matTau = new THREE.MeshStandardMaterial({
        color: 0xfde047,
        emissive: 0xd97706,
        emissiveIntensity: 1.15,
        roughness: 0.22
      });

      const matExosome = new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.65,
        transparent: true,
        opacity: 0.62,
        roughness: 0.1
      });

      const geo1433 = new THREE.TorusGeometry(0.16, 0.048, 8, 16, Math.PI * 1.45);
      const geoTau = new THREE.CylinderGeometry(0.035, 0.035, 0.6, 6);
      const geoExo = new THREE.SphereGeometry(0.16, 10, 10);

      for (let i = 0; i < biomarkerCount; i++) {
        let mesh;
        let type;
        if (i % 3 === 0) {
          mesh = new THREE.Mesh(geo1433, mat1433);
          type = '14-3-3';
        } else if (i % 3 === 1) {
          mesh = new THREE.Mesh(geoTau, matTau);
          type = 'tau';
        } else {
          mesh = new THREE.Mesh(geoExo, matExosome);
          type = 'exosome';
        }

        const r = 1.5 + Math.random() * 22.0;
        const t = Math.random() * Math.PI * 2;
        const p = Math.acos(2 * Math.random() - 1);
        mesh.position.set(
          r * Math.sin(p) * Math.cos(t),
          r * Math.sin(p) * Math.sin(t) * 0.85,
          r * Math.cos(p)
        );
        mesh.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);

        this.molecularCSFGroup.add(mesh);
        this.csfBiomarkers.push({
          mesh,
          type,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    spawnCollisionShockwave(position, colorHex) {
      if (this.shockwaves.length > 35) return;
      const mat = this.matShockwave.clone();
      if (colorHex) mat.color.setHex(colorHex);
      const ring = new THREE.Mesh(this.geoShockwave, mat);
      ring.position.copy(position);
      ring.lookAt(this.camera.position);
      this.effectsGroup.add(ring);
      this.shockwaves.push({ mesh: ring, age: 0, maxAge: 0.75 });
    }

    /**
     * RECONSTRUÇÃO DA POPULAÇÃO PRIÔNICA COM SUPORTE A ATÉ 5.000 PROTEÍNAS
     */
    rebuildPopulation(count, initialPrionRatio) {
      this.totalPrions = count || 250;

      while (this.prionPopulationGroup.children.length > 0) {
        this.prionPopulationGroup.remove(this.prionPopulationGroup.children[0]);
      }
      this.prions = [];

      const visualCap = Math.min(this.totalPrions, 800); // 800 objetos detalhados completos
      const ratio = THREE.MathUtils.clamp(initialPrionRatio || 0.0, 0, 1);
      const initialPrPScVisual = Math.round(visualCap * ratio);

      for (let i = 0; i < visualCap; i++) {
        const holder = new THREE.Group();

        // 1. Grupo PrPC Completo (3 Hélices + 4 Cu2+)
        const groupPrPC = new THREE.Group();
        const meshH1 = new THREE.Mesh(this.geoPrPC_H1, this.matPrPC);
        const meshH2 = new THREE.Mesh(this.geoPrPC_H2, this.matPrPC_H2);
        const meshH3 = new THREE.Mesh(this.geoPrPC_H3, this.matPrPC);
        const meshTail = new THREE.Mesh(this.geoPrPC_Tail, this.matPrPC);

        groupPrPC.add(meshH1);
        groupPrPC.add(meshH2);
        groupPrPC.add(meshH3);
        groupPrPC.add(meshTail);

        for (let c = 0; c < 4; c++) {
          const cu = new THREE.Mesh(this.geoCuIon, this.matCuIon);
          cu.position.copy(this.cuIonPositions[c]);
          groupPrPC.add(cu);
        }

        // 2. Mesh Converting
        const meshConv = new THREE.Mesh(this.geoConverting, this.matConverting);
        meshConv.visible = false;

        // 3. Grupo PrPSc Beta-Solenoide
        const groupPrPSc = new THREE.Group();
        const rung1 = new THREE.Mesh(this.geoPrPSc_R1, this.matPrPSc);
        const rung2 = new THREE.Mesh(this.geoPrPSc_R2, this.matPrPSc);
        const rung3 = new THREE.Mesh(this.geoPrPSc_R3, this.matPrPSc);
        groupPrPSc.add(rung1);
        groupPrPSc.add(rung2);
        groupPrPSc.add(rung3);
        groupPrPSc.visible = false;

        holder.add(groupPrPC);
        holder.add(meshConv);
        holder.add(groupPrPSc);

        const r = 2.0 + Math.random() * 26.0;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        holder.position.set(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta) * 0.75,
          r * Math.cos(phi)
        );
        holder.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
        holder.scale.setScalar(1.0);

        const speed = 0.45 + Math.random() * 0.75;
        const vel = new THREE.Vector3(
          (Math.random() - 0.5) * speed,
          (Math.random() - 0.5) * speed * 0.6,
          (Math.random() - 0.5) * speed
        );

        let state = 'healthy';
        if (i < initialPrPScVisual) {
          state = 'prion';
          groupPrPC.visible = false;
          groupPrPSc.visible = true;
          holder.scale.setScalar(1.4);
        }

        this.prionPopulationGroup.add(holder);

        this.prions.push({
          holder,
          groupPrPC,
          meshConv,
          groupPrPSc,
          state,
          velocity: vel,
          baseVelocity: vel.clone(),
          spin: new THREE.Vector3((Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 1.5),
          convertingTimer: 0,
          targetNeuronPos: null
        });
      }

      this.syncWithEngine();
    }

    inoculatePrion() {
      this.inoculateBurst(12, new THREE.Vector3(0, 0, 0));
    }

    inoculateBurst(burstCount = 12, origin = null) {
      const center = origin || (this.neurons[0] ? this.neurons[0].center : new THREE.Vector3(0, 0, 0));
      let converted = 0;

      for (let i = 0; i < this.prions.length && converted < burstCount; i++) {
        const p = this.prions[i];
        if (p.state === 'healthy') {
          p.state = 'prion';
          p.groupPrPC.visible = false;
          p.meshConv.visible = false;
          p.groupPrPSc.visible = true;
          p.holder.scale.setScalar(1.45);
          p.holder.position.copy(center).add(new THREE.Vector3(
            (Math.random() - 0.5) * 3.5,
            (Math.random() - 0.5) * 2.5,
            (Math.random() - 0.5) * 3.5
          ));
          converted++;
        }
      }

      this.spawnCollisionShockwave(center, 0xef4444);
      this.syncWithEngine();
    }

    inoculatePrPScSeed(hitPoint) {
      let nearest = null;
      let minDist = Infinity;

      for (let i = 0; i < this.prions.length; i++) {
        const d = this.prions[i].holder.position.distanceTo(hitPoint);
        if (d < minDist) {
          minDist = d;
          nearest = this.prions[i];
        }
      }

      if (nearest && nearest.state !== 'prion') {
        nearest.state = 'prion';
        nearest.groupPrPC.visible = false;
        nearest.meshConv.visible = false;
        nearest.groupPrPSc.visible = true;
        nearest.holder.scale.setScalar(1.45);
        this.spawnCollisionShockwave(nearest.holder.position, 0xdc2626);
        this.syncWithEngine();
      } else {
        this.inoculateBurst(4, hitPoint);
      }
    }

    updatePrionPhysics(dt, isRunning) {
      const bounds = 32.0;

      for (let i = 0; i < this.prions.length; i++) {
        const p = this.prions[i];
        const pos = p.holder.position;

        if (isRunning) {
          pos.addScaledVector(p.velocity, dt * 2.8);
          p.holder.rotation.x += p.spin.x * dt;
          p.holder.rotation.y += p.spin.y * dt;
          p.holder.rotation.z += p.spin.z * dt;

          if (pos.x > bounds || pos.x < -bounds) p.velocity.x *= -1;
          if (pos.y > bounds * 0.7 || pos.y < -bounds * 0.7) p.velocity.y *= -1;
          if (pos.z > bounds || pos.z < -bounds) p.velocity.z *= -1;
        }

        if (p.state === 'converting') {
          p.convertingTimer += dt;
          p.holder.rotation.y += dt * 7.5;

          if (p.convertingTimer > 1.2) {
            p.state = 'prion';
            p.meshConv.visible = false;
            p.groupPrPSc.visible = true;
            p.holder.scale.setScalar(1.42);
            this.spawnCollisionShockwave(pos, 0xdc2626);
          }
        } else if (p.state === 'prion' && isRunning) {
          let nearestHealthy = null;
          let minD = 5.2;

          for (let j = 0; j < this.prions.length; j++) {
            const other = this.prions[j];
            if (other.state === 'healthy') {
              const d = pos.distanceTo(other.holder.position);
              if (d < minD) {
                minD = d;
                nearestHealthy = other;
              }
            }
          }

          if (nearestHealthy) {
            const pull = nearestHealthy.holder.position.clone().sub(pos).normalize();
            p.velocity.lerp(pull.multiplyScalar(1.6), dt * 1.8);

            if (minD < 1.05) {
              nearestHealthy.state = 'converting';
              nearestHealthy.convertingTimer = 0;
              nearestHealthy.groupPrPC.visible = false;
              nearestHealthy.meshConv.visible = true;
              nearestHealthy.meshPrPSc.visible = false;
              nearestHealthy.holder.scale.setScalar(1.28);

              const midImpact = pos.clone().lerp(nearestHealthy.holder.position, 0.5);
              this.spawnCollisionShockwave(midImpact, 0xf59e0b);
            }
          }
        }
      }

      if (isRunning) {
        this.syncWithEngine();
      }
    }

    /**
     * // [PT-BR]: Atualiza a cinética dos neurotransmissores, exocitose vesicular e redução de disparo sináptico com a infecção priônica.
     * // [EN-US]: Updates neurotransmitter kinetics, vesicular exocytosis, and reduces synaptic firing frequency during prion cascade.
     * // [AI-CTX]: @llm-context Dampens firing rate (pt.speed * firingRateScale) with increasing damageRatio and converts particles to yellow Ca2+.
     * @param {number} dt - Intervalo de tempo diferencial.
     * @param {boolean} isRunning - Indicador de simulação ativa.
     */
    updateNeurotransmitters(dt, isRunning) {
      if (!this.ntPointsMesh || this.synapticClefts.length === 0) return;

      const posAttr = this.ntPointsMesh.geometry.getAttribute('position');
      const colAttr = this.ntPointsMesh.geometry.getAttribute('color');
      const colorCalcium = new THREE.Color(0xfbbf24);

      // Redução progressiva da frequência e velocidade de disparo com o avanço da neurodegeneração
      const firingRateScale = Math.max(0.12, 1.0 - this.damageRatio * 0.88);

      for (let c = 0; c < this.synapticClefts.length; c++) {
        const cleft = this.synapticClefts[c];
        const isDamaged = (this.damageRatio > 0.25);

        if (cleft.flashIntensity > 0.7) {
          cleft.flashIntensity -= dt * 2.8;
          cleft.receptorMat.emissiveIntensity = cleft.flashIntensity;
        }

        for (let p = 0; p < cleft.particles.length; p++) {
          const pt = cleft.particles[p];
          const globalIdx = cleft.startIndex + p;

          pt.progress += dt * pt.speed * firingRateScale * (isRunning ? 1.4 : 0.6);

          if (pt.progress >= 1.0) {
            pt.progress = 0;
            cleft.flashIntensity = 2.4 * firingRateScale;
            cleft.receptorMat.emissiveIntensity = cleft.flashIntensity;
            pt.isCalcium = isDamaged && (Math.random() < this.damageRatio * 0.85);
          }

          const basePt = cleft.prePos.clone().lerp(cleft.postPos, pt.progress);
          const lateralSpread = Math.sin(pt.progress * Math.PI) * pt.lateralJitter;
          basePt.x += lateralSpread;
          basePt.y += Math.cos(this.elapsed * 4 + p) * 0.08;
          basePt.z += Math.sin(this.elapsed * 4 + p) * 0.08;

          posAttr.setXYZ(globalIdx, basePt.x, basePt.y, basePt.z);
          const curCol = pt.isCalcium ? colorCalcium : cleft.baseColor;
          colAttr.setXYZ(globalIdx, curCol.r, curCol.g, curCol.b);
        }
      }

      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
    }

    syncWithEngine() {
      const visualLen = Math.max(1, this.prions.length);
      let vHealthy = 0;
      let vConv = 0;
      let vPrion = 0;

      for (let i = 0; i < this.prions.length; i++) {
        const st = this.prions[i].state;
        if (st === 'healthy') vHealthy++;
        else if (st === 'converting') vConv++;
        else vPrion++;
      }

      const scale = this.totalPrions / visualLen;
      const totalPrionsScaled = Math.round(vPrion * scale);
      const totalConvScaled = Math.round(vConv * scale);
      const totalHealthyScaled = Math.max(0, this.totalPrions - totalPrionsScaled - totalConvScaled);

      const dmgRatio = THREE.MathUtils.clamp(
        (totalPrionsScaled + totalConvScaled * 0.5) / Math.max(1, this.totalPrions),
        0,
        1
      );
      this.damageRatio = dmgRatio;
      this.updateNeuronalDamageVisuals(dmgRatio);

      if (this.engine && typeof this.engine.syncCountsFromPhysics === 'function') {
        this.engine.syncCountsFromPhysics(totalHealthyScaled, totalConvScaled, totalPrionsScaled);
      }
    }

    setStage(stageIdx) {
      const stageDmgMap = [0.0, 0.25, 0.60, 1.0];
      const targetRatio = stageDmgMap[stageIdx] !== undefined ? stageDmgMap[stageIdx] : 0.0;
      this.damageRatio = targetRatio;
      this.updateNeuronalDamageVisuals(targetRatio);
    }

    updateNeuronalDamageVisuals(dmgRatio) {
      // 1. Inflar vacúolos espongiformes ocos no neurópilo
      for (let i = 0; i < this.vacuoles.length; i++) {
        const v = this.vacuoles[i];
        if (dmgRatio > v.threshold) {
          v.group.visible = true;
          const progress = THREE.MathUtils.clamp((dmgRatio - v.threshold) / 0.25, 0.05, 1.0);
          v.group.scale.setScalar(v.maxScale * progress);
        } else {
          v.group.visible = false;
        }
      }

      // 2. Crescimento e deposição de Placas Amiloides Fibrilares Tipo Kuru
      for (let i = 0; i < this.amyloidPlaques.length; i++) {
        const pl = this.amyloidPlaques[i];
        if (dmgRatio > pl.threshold) {
          pl.mesh.visible = true;
          const p = THREE.MathUtils.clamp((dmgRatio - pl.threshold) / 0.35, 0.05, 1.0);
          pl.mesh.scale.setScalar(pl.baseScale * p);
        } else {
          pl.mesh.visible = false;
        }
      }

      // 3. Desmielinização Axonal Progressiva
      for (let i = 0; i < this.myelinSheaths.length; i++) {
        const item = this.myelinSheaths[i];
        const mMesh = item.mesh;
        const loss = THREE.MathUtils.clamp(dmgRatio * 1.35, 0, 0.85);
        mMesh.scale.x = item.baseScale.x * (1.0 - loss * 0.65);
        mMesh.scale.z = item.baseScale.z * (1.0 - loss * 0.65);
        mMesh.scale.y = item.baseScale.y * (1.0 - loss * 0.45);
        mMesh.material.opacity = 0.86 * (1.0 - loss * 0.5);
        if (dmgRatio > 0.4) {
          mMesh.material.color.lerpColors(new THREE.Color(0xe0f2fe), new THREE.Color(0xf87171), (dmgRatio - 0.4) * 1.4);
        }
      }

      // [PT-BR]: Degeneração do Soma Neuronal nos 32 Neurônios Hero (pericário translúcido em estresse oxidativo)
      // [EN-US]: Neuronal Soma Degeneration across 32 Hero Neurons (translucent pericaryon under oxidative stress)
      // [AI-CTX]: @llm-context Shifts color to slate gray and amber dystrophic glow without red sphere artifacts.
      for (let i = 0; i < this.neurons.length; i++) {
        const nr = this.neurons[i];
        if (!nr.isHero) continue;

        const neuronThreshold = (i / 32) * 0.85;
        if (dmgRatio > neuronThreshold) {
          const stress = THREE.MathUtils.clamp((dmgRatio - neuronThreshold) / 0.3, 0, 1);
          nr.somaMat.opacity = THREE.MathUtils.lerp(0.78, 0.50, stress);
          nr.somaMat.color.copy(nr.baseColor).lerp(new THREE.Color(0x64748b), stress * 0.65);
          nr.somaMat.emissive.copy(nr.baseColor).lerp(new THREE.Color(0x78350f), stress * 0.55);
          nr.somaMat.emissiveIntensity = THREE.MathUtils.lerp(0.52, 0.40, stress);
        } else {
          nr.somaMat.opacity = 0.78;
          nr.somaMat.color.copy(nr.baseColor);
          nr.somaMat.emissive.copy(nr.baseColor);
          nr.somaMat.emissiveIntensity = 0.52;
        }
      }

      // [PT-BR]: Degeneração e estresse nos 468 neurônios completos instanciados por arquétipos
      // [EN-US]: Degeneration and stress on the 468 complete archetype-instanced neurons
      // [AI-CTX]: @llm-context Updates instance materials and colors under prion cascade.
      if (this.archetypeInstancedMeshes) {
        for (let a = 0; a < this.archetypeInstancedMeshes.length; a++) {
          const instMesh = this.archetypeInstancedMeshes[a];
          if (instMesh && instMesh.material) {
            const stress = THREE.MathUtils.clamp(dmgRatio * 1.25, 0, 1);
            instMesh.material.opacity = THREE.MathUtils.lerp(0.84, 0.48, stress);
            instMesh.material.emissiveIntensity = THREE.MathUtils.lerp(0.45, 0.75, stress);
            if (dmgRatio > 0.35) {
              instMesh.material.emissive.lerp(new THREE.Color(0x78350f), (dmgRatio - 0.35) * 0.8);
            }
          }
        }
      }

      // 5. Atrofia e Encolhimento das 3.500 Espinhas Dendríticas 3D (Perda Sináptica)
      if (this.dendriticSpinesMesh && this.spineMetadata) {
        const dummyMat = new THREE.Matrix4();
        const pos = new THREE.Vector3();
        const rot = new THREE.Quaternion();
        const scale = new THREE.Vector3();

        for (let i = 0; i < this.spineMetadata.length; i++) {
          const meta = this.spineMetadata[i];
          meta.initialMatrix.decompose(pos, rot, scale);
          const currScale = Math.max(0.04, 1.0 - dmgRatio * 0.94);
          scale.setScalar(currScale);
          dummyMat.compose(pos, rot, scale);
          this.dendriticSpinesMesh.setMatrixAt(i, dummyMat);
        }
        this.dendriticSpinesMesh.instanceMatrix.needsUpdate = true;
      }

      // 6. Aumento e liberação de Biomarcadores no Líquor (Tau e 14-3-3)
      for (let i = 0; i < this.csfBiomarkers.length; i++) {
        const b = this.csfBiomarkers[i];
        if (b.type === '14-3-3' || b.type === 'tau') {
          b.mesh.scale.setScalar(0.45 + dmgRatio * 1.35);
        }
      }
    }

    /**
     * // [PT-BR]: Adapta o Microcosmo do Slide 4 para as 5 patologias neurológicas (Alzheimer, Parkinson, AVC, Esclerose Múltipla, DCJ).
     * // [EN-US]: Adapts Slide 4 Microcosm to the 5 neurological pathologies (Alzheimer's, Parkinson's, Stroke, Multiple Sclerosis, CJD).
     * // [AI-CTX]: @llm-neuroscience: Configures amyloid plaques, alpha-synuclein Lewy bodies, glutamate excitotoxicity, demyelination and prions.
     */
    applyPathologyMode(pathologyKey) {
      const pKey = (pathologyKey || 'NORMAL').toUpperCase();

      if (pKey === 'ALZHEIMER') {
        this.updateNeuronalDamageVisuals(0.75);
        // Exibe placas senis A-Beta42 e retração sináptica
        for (let i = 0; i < this.amyloidPlaques.length; i++) {
          this.amyloidPlaques[i].mesh.visible = true;
          this.amyloidPlaques[i].mesh.scale.setScalar(this.amyloidPlaques[i].baseScale * 1.3);
        }
        // Fendas colinérgicas com liberação deprimida
        this.synapticClefts.forEach(c => {
          c.particles.forEach(pt => {
            pt.speed = 0.35;
          });
        });
      } else if (pKey === 'PARKINSON') {
        this.updateNeuronalDamageVisuals(0.65);
        // Desacelera fendas dopaminérgicas (lentificação motora)
        this.synapticClefts.forEach(c => {
          c.particles.forEach(pt => {
            pt.speed = 0.25;
          });
        });
      } else if (pKey === 'STROKE') {
        this.updateNeuronalDamageVisuals(0.92);
        // Excitotoxicidade por glutamato maciço e influxo de cálcio
        this.synapticClefts.forEach(c => {
          c.particles.forEach(pt => {
            pt.speed = 2.8;
            pt.isCalcium = true;
          });
        });
      } else if (pKey === 'MS') {
        this.updateNeuronalDamageVisuals(0.5);
        // Desmielinização axonal grave com inflamação das bainhas
        for (let i = 0; i < this.myelinSheaths.length; i++) {
          const m = this.myelinSheaths[i].mesh;
          m.scale.set(this.myelinSheaths[i].baseScale.x * 0.25, this.myelinSheaths[i].baseScale.y * 0.4, this.myelinSheaths[i].baseScale.z * 0.25);
          m.material.color.setHex(0xe11d48);
          m.material.opacity = 0.55;
        }
      } else if (pKey === 'CJD') {
        this.updateNeuronalDamageVisuals(1.0);
        // Ativação de vacúolos e placas priônicas
        for (let i = 0; i < this.vacuoles.length; i++) {
          this.vacuoles[i].group.visible = true;
          this.vacuoles[i].group.scale.setScalar(this.vacuoles[i].maxScale * 1.2);
        }
        for (let i = 0; i < this.amyloidPlaques.length; i++) {
          this.amyloidPlaques[i].mesh.visible = true;
          this.amyloidPlaques[i].mesh.scale.setScalar(this.amyloidPlaques[i].baseScale * 1.1);
        }
      } else {
        // NORMAL / HIGIDO
        this.updateNeuronalDamageVisuals(0.0);
        for (let i = 0; i < this.vacuoles.length; i++) {
          this.vacuoles[i].group.visible = false;
        }
        for (let i = 0; i < this.amyloidPlaques.length; i++) {
          this.amyloidPlaques[i].mesh.visible = false;
        }
        for (let i = 0; i < this.myelinSheaths.length; i++) {
          const item = this.myelinSheaths[i];
          item.mesh.scale.copy(item.baseScale);
          item.mesh.material.color.setHex(0xe0f2fe);
          item.mesh.material.opacity = 0.86;
        }
        this.synapticClefts.forEach(c => {
          c.particles.forEach(pt => {
            pt.speed = 0.85;
            pt.isCalcium = false;
          });
        });
      }
    }

    updateMultiScaleZoomLOD() {
      if (!this.camera || !this.controls) return;
      const dist = this.camera.position.distanceTo(this.controls.target);

      const scaleBadge = document.getElementById('zoom-scale-badge');
      const hudLabel = document.getElementById('hud-scale-label');
      const hudUm = document.getElementById('hud-scale-um');

      const microFactor = THREE.MathUtils.clamp((48 - dist) / 32, 0.22, 1.4);
      this.prionPopulationGroup.scale.setScalar(0.65 + microFactor * 0.55);
      this.molecularCSFGroup.scale.setScalar(0.6 + microFactor * 0.55);

      if (this.punctaMat) {
        this.punctaMat.size = THREE.MathUtils.lerp(0.35, 0.7, microFactor);
      }

      const approxFieldUm = Math.round(dist * 5.2);
      const barUm = Math.max(2, Math.round(approxFieldUm / 5));

      if (hudUm) hudUm.textContent = barUm + ' µm';

      if (dist > 36) {
        if (scaleBadge) {
          scaleBadge.textContent = 'ESCALA MESO (' + approxFieldUm + ' µm): 500 NEURÔNIOS, MIELINA & TEIA CORTICAL';
          scaleBadge.style.color = '#38bdf8';
        }
        if (hudLabel) hudLabel.textContent = 'Visão Panorâmica: Conectoma de 500 Neurônios (~' + approxFieldUm + ' µm)';
      } else if (dist > 16) {
        if (scaleBadge) {
          scaleBadge.textContent = 'ESCALA CONFOCAL (' + approxFieldUm + ' µm): 60 FENDAS SINÁPTICAS, MIELINA & RANVIER';
          scaleBadge.style.color = '#10b981';
        }
        if (hudLabel) hudLabel.textContent = 'Visão Confocal: 60 Fendas Sinápticas, Mielina & Nódulos de Ranvier (~' + approxFieldUm + ' µm)';
      } else {
        if (scaleBadge) {
          scaleBadge.textContent = 'IMERSÃO NO LÍQUOR (' + approxFieldUm + ' µm): PrPᶜ (3 HÉLICES/Cu²⁺) → PrPˢᶜ (BETA-SOLENOIDE)';
          scaleBadge.style.color = '#f59e0b';
        }
        if (hudLabel) hudLabel.textContent = 'Imersão no Líquido Cefalorraquidiano (LCR) & Cascata Priônica (~' + approxFieldUm + ' µm)';
      }
    }

    buildGuidedTourBanner() {
      let banner = document.getElementById('guided-tour-banner');
      if (!banner) {
        banner = document.createElement('div');
        banner.id = 'guided-tour-banner';
        banner.className = 'guided-tour-banner';
        this.container.appendChild(banner);
      }
      this.tourBanner = banner;
    }

    toggleVoice() {
      if (!this.narrator) return false;
      const on = this.narrator.toggle();
      const voiceBtn = document.getElementById('sim-btn-voice');
      if (voiceBtn) {
        voiceBtn.classList.toggle('active', on);
        voiceBtn.innerHTML = `<span>🔊 Voz IA: ${on ? 'ON' : 'OFF'}</span>`;
      }
      return on;
    }

    /**
     * MODO "🎬 INICIAR APRESENTAÇÃO" — NARRADOR DE IA EM 5 ATOS SINCRONIZADOS
     */
    toggleGuidedPresentation(btnElement) {
      if (this.guidedTourActive) {
        this.stopGuidedPresentation(btnElement);
      } else {
        this.startGuidedPresentation(btnElement);
      }
    }

    startGuidedPresentation(btnElement) {
      this.guidedTourActive = true;
      this.guidedBtnElement = btnElement;
      this.guidedInoculated = false;
      this.currentAct = 1;
      this.actTime = 0;
      this.speechFinished = false;

      if (btnElement) {
        btnElement.classList.add('guided-active');
        btnElement.innerHTML = '<span>⏹ Parar Apresentação</span>';
      }

      if (this.tourBanner) {
        this.tourBanner.classList.add('visible');
      }

      if (this.engine) {
        this.engine.reset();
        this.engine.setSpeed(1.0);
      }

      if (this.controls) {
        this.controls.autoRotate = false;
      }

      this.playAct(1);
    }

    playAct(actIndex) {
      this.currentAct = actIndex;
      this.actTime = 0;
      this.speechFinished = false;

      let bannerText = '';
      let speechText = '';

      switch (actIndex) {
        case 1:
          bannerText = '1/5 • REDE CORTICAL VIVA (500 NEURÔNIOS): Células Translúcidas, Núcleo DAPI e Condução Saltatória na Mielina';
          speechText = 'Observamos uma rede cortical viva com quinhentos neurônios interligados. Note o corpo celular translúcido exibindo o núcleo e o nucléolo, e os potenciais de ação saltando pelos nódulos de Ranvier na bainha de mielina.';
          break;
        case 2:
          bannerText = '2/5 • FENDAS SINÁPTICAS & NEUROTRANSMISSORES: Exocitose de Glutamato (Verde) e GABA (Azul) nas Espinhas 3D';
          speechText = 'Nas fendas sinápticas, a chegada do impulso elétrico dispara a exocitose de neurotransmissores. Partículas verdes de glutamato e azuis de GABA atravessam a fenda e ativam os receptores nas espinhas dendríticas.';
          break;
        case 3:
          bannerText = '3/5 • IMERSÃO NO LÍQUOR (LCR): Proteína Saudável PrPᶜ com 3 Hélices Alfa e Íons Cu²⁺';
          speechText = 'Mergulhando no líquido cefalorraquidiano, vemos em verde a proteína priônica celular saudável, P-R-P-C, formada por três hélices alfa ligadas a íons de cobre, essenciais para a proteção sináptica.';
          break;
        case 4:
          bannerText = '4/5 • INOCULAÇÃO & CONVERSÃO EM CADEIA: PrPˢᶜ (Folhas-Beta) Força o Desdobramento em Efeito Dominó';
          speechText = 'Agora inoculamos o príon patogênico P-R-P-S-C, em vermelho. Ao colidir fisicamente com a proteína saudável, ele atua como um molde infeccioso, convertendo as hélices em folhas-beta rígidas e insolúveis em efeito dominó.';
          if (!this.guidedInoculated) {
            this.guidedInoculated = true;
            if (this.engine) {
              this.engine.inoculatePrion();
            } else {
              this.inoculateBurst(14, new THREE.Vector3(0, 0, 0));
            }
          }
          break;
        case 5:
          bannerText = '5/5 • EXCITOTOXICIDADE, ESPONGIOSE & ATROFIA: Cálcio Ca²⁺, Retração de Espinhas, Placas Amiloides e Lise';
          speechText = 'Os príons hiperativam os receptores NMDA, gerando um influxo tóxico de cálcio que retrai as espinhas dendríticas. Formam-se placas amiloides estreladas e microcistos ocos de espongiose, liberando proteínas Tau e quatorze-três-três no líquor enquanto o hemisfério cerebral esquerdo sofre atrofia severa.';
          if (this.engine) {
            this.engine.setSpeed(2.0);
          }
          break;
      }

      if (this.tourBanner) {
        this.tourBanner.textContent = bannerText;
      }

      if (this.narrator && this.narrator.enabled) {
        this.narrator.speak(speechText, () => {
          this.speechFinished = true;
        });
      } else {
        this.speechFinished = true;
      }
    }

    stopGuidedPresentation(btnElement) {
      this.guidedTourActive = false;
      this.currentAct = 1;
      this.actTime = 0;
      this.speechFinished = false;

      if (this.narrator) {
        this.narrator.stop();
      }

      const btn = btnElement || this.guidedBtnElement;
      if (btn) {
        btn.classList.remove('guided-active');
        btn.innerHTML = '<span>🎬 Iniciar Apresentação</span>';
      }

      if (this.tourBanner) {
        this.tourBanner.textContent = 'Apresentação Concluída — Navegação Livre Reativada';
        setTimeout(() => {
          if (!this.guidedTourActive && this.tourBanner) {
            this.tourBanner.classList.remove('visible');
          }
        }, 3200);
      }

      if (this.controls) {
        this.controls.autoRotate = true;
      }
    }

    updateGuidedPresentation(dt) {
      if (!this.guidedTourActive) return;

      this.actTime += dt;
      const t = this.actTime;
      const hero0 = this.neurons[0];
      const heroTarget = hero0 ? hero0.center : new THREE.Vector3(0, 0, 0);

      if (this.currentAct === 1) {
        const angle = t * 0.22;
        const camPos = new THREE.Vector3(
          Math.sin(angle) * 38.0,
          10.0 + Math.sin(t * 0.3) * 4.0,
          Math.cos(angle) * 38.0
        );
        this.camera.position.lerp(camPos, 0.04);
        if (this.controls) this.controls.target.lerp(new THREE.Vector3(0, 2, 0), 0.05);

        if (t >= 7.5 && (this.speechFinished || !this.narrator.enabled)) {
          this.playAct(2);
        }
      } else if (this.currentAct === 2) {
        const targetCleft = (this.synapticClefts[0] && this.synapticClefts[0].prePos) ? this.synapticClefts[0].prePos : heroTarget;
        const camDesired = targetCleft.clone().add(new THREE.Vector3(1.6, 0.9, 3.4));
        this.camera.position.lerp(camDesired, 0.045);
        if (this.controls) this.controls.target.lerp(targetCleft, 0.05);

        if (t >= 7.5 && (this.speechFinished || !this.narrator.enabled)) {
          this.playAct(3);
        }
      } else if (this.currentAct === 3) {
        const angle = t * 0.32;
        const camDesired = heroTarget.clone().add(new THREE.Vector3(
          Math.sin(angle) * 6.5,
          1.2,
          Math.cos(angle) * 6.5
        ));
        this.camera.position.lerp(camDesired, 0.04);
        if (this.controls) this.controls.target.lerp(heroTarget, 0.05);

        if (t >= 7.5 && (this.speechFinished || !this.narrator.enabled)) {
          this.playAct(4);
        }
      } else if (this.currentAct === 4) {
        const angle = t * 0.38;
        const camDesired = new THREE.Vector3(
          Math.sin(angle) * 14.0,
          4.2,
          Math.cos(angle) * 14.0
        );
        this.camera.position.lerp(camDesired, 0.035);
        if (this.controls) this.controls.target.lerp(new THREE.Vector3(0, 0, 0), 0.04);

        if (t >= 8.0 && (this.speechFinished || !this.narrator.enabled)) {
          this.playAct(5);
        }
      } else if (this.currentAct === 5) {
        const angle = t * 0.25;
        const camDesired = new THREE.Vector3(
          Math.sin(angle) * 24.0,
          7.5,
          Math.cos(angle) * 24.0
        );
        this.camera.position.lerp(camDesired, 0.03);
        if (this.controls) this.controls.target.lerp(new THREE.Vector3(0, 0, 0), 0.04);

        if (t >= 9.5 && (this.speechFinished || !this.narrator.enabled)) {
          this.stopGuidedPresentation();
        }
      }
    }

    bindInteraction() {
      let downPos = { x: 0, y: 0 };

      this.renderer.domElement.addEventListener('pointerdown', (e) => {
        downPos = { x: e.clientX, y: e.clientY };
      });

      this.renderer.domElement.addEventListener('pointerup', (e) => {
        const dx = e.clientX - downPos.x;
        const dy = e.clientY - downPos.y;
        if (Math.hypot(dx, dy) < 6 && e.button === 0) {
          const rect = this.renderer.domElement.getBoundingClientRect();
          const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          const ndcY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

          const vec = new THREE.Vector3(ndcX, ndcY, 0.5);
          vec.unproject(this.camera);
          const dir = vec.sub(this.camera.position).normalize();
          const targetDist = Math.min(18, this.camera.position.length() * 0.65);
          const hitPoint = this.camera.position.clone().addScaledVector(dir, targetDist);

          this.inoculatePrPScSeed(hitPoint);
        }
      });

      window.addEventListener('resize', () => this.onResize());
    }

    onResize() {
      if (!this.container || !this.renderer || !this.camera) return;
      this.width = this.container.clientWidth || 720;
      this.height = this.container.clientHeight || 440;
      this.camera.aspect = this.width / Math.max(1, this.height);
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
    }

    animate() {
      requestAnimationFrame(() => this.animate());

      const dt = Math.min(0.05, this.clock.getDelta());
      this.elapsed += dt;

      const isRunning = this.engine ? this.engine.isRunning : false;

      // 1. Atualizar física molecular priônica e neurotransmissores
      this.updatePrionPhysics(dt, isRunning);
      this.updateNeurotransmitters(dt, isRunning);

      if (this.guidedTourActive) {
        this.updateGuidedPresentation(dt);
      }

      if (this.controls) {
        this.controls.update();
      }

      this.updateMultiScaleZoomLOD();

      // 2. Animar Condução Saltatória de Potenciais de Ação (1.400 Pulsos)
      if (this.pulsePoints && this.synapseLinks.length > 0) {
        if (this.pulseMat) {
          this.pulseMat.size = 1.35 + Math.sin(this.elapsed * 7.5) * 0.22;
        }
        const posAttr = this.pulsePoints.geometry.getAttribute('position');
        const speedMult = Math.max(0.12, 1.0 - this.damageRatio * 0.85);

        for (let i = 0; i < this.actionPulses.length; i++) {
          const pulse = this.actionPulses[i];
          pulse.t = (pulse.t + dt * pulse.speed * speedMult) % 1.0;

          const pts = pulse.link.pts;
          const totalSegs = pts.length - 1;
          const scaledT = pulse.t * totalSegs;
          const idx = Math.min(totalSegs - 1, Math.floor(scaledT));
          const frac = scaledT - idx;

          const p = pts[idx].clone().lerp(pts[idx + 1], frac);
          posAttr.setXYZ(i, p.x, p.y, p.z);
        }
        posAttr.needsUpdate = true;
      }

      // 3. Animar Ondas de Choque Priônicas
      for (let i = this.shockwaves.length - 1; i >= 0; i--) {
        const sw = this.shockwaves[i];
        sw.age += dt;
        const progress = sw.age / sw.maxAge;
        if (progress >= 1.0) {
          this.effectsGroup.remove(sw.mesh);
          sw.mesh.material.dispose();
          this.shockwaves.splice(i, 1);
        } else {
          const s = 1.0 + progress * 6.5;
          sw.mesh.scale.setScalar(s);
          sw.mesh.material.opacity = (1.0 - progress) * 0.85;
          sw.mesh.lookAt(this.camera.position);
        }
      }

      // 4. Animar anéis refrativos dos vacúolos ocos voltados para a câmera
      for (let i = 0; i < this.vacuoles.length; i++) {
        const v = this.vacuoles[i];
        if (v.group && v.group.visible && v.ringMesh) {
          v.ringMesh.lookAt(this.camera.position);
        }
      }

      // 5. Animar Biomarcadores do Líquor (Proteína 14-3-3, Tau e Exossomos)
      for (let i = 0; i < this.csfBiomarkers.length; i++) {
        const b = this.csfBiomarkers[i];
        b.mesh.rotation.x += dt * 0.65;
        b.mesh.rotation.z += dt * 0.85;
        b.mesh.position.y += Math.sin(this.elapsed * 1.3 + b.phase) * 0.008;
      }

      this.renderer.render(this.scene, this.camera);
    }
  }

  window.PrionNeuropilSimulator3D = PrionNeuropilSimulator3D;

  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('canvas-protein-3d');
    if (container && !window.proteinSim) {
      window.proteinSim = new PrionNeuropilSimulator3D('canvas-protein-3d', window.simEngine);
    }
  });
})();
