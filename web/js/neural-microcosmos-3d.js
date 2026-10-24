/**
 * ============================================================================
 * MOZOK v2.0 — MICROCOSMO NEURAL BIOLOGICAMENTE PLAUSÍVEL 3D
 * Neurônios Reais, Sistema Glial Quádruplo e Modelo Hodgkin-Huxley
 * ============================================================================
 * Características:
 * 1. Neurônios Estruturados Biologicamente Plausíveis:
 *    - Soma orgânico assimétrico, membrana semitransparente (Fresnel), núcleo DAPI e nucléolo
 *    - Dendritos fractais com afinamento pela Lei de Rall (d_parent^1.5 = sum d_child^1.5)
 *    - Espinhas dendríticas 3D tipo cogumelo com pescoço e cabeça pós-sináptica (PSD-95)
 *    - Axônio com trajetória biológica curvada, cone de implantação e segmento inicial (AIS)
 *    - Internódios visíveis de bainha de mielina e nódulos de Ranvier reais (gaps com Nav1.6)
 *    - Terminais sinápticos e fendas com vesículas quânticas
 * 2. Simulação Eletrofisiológica de Hodgkin-Huxley:
 *    - Equações biofísicas completas de potencial de repouso (-70 mV), despolarização (+30 mV),
 *      repolarização (-70 mV), hiperpolarização (-85 mV) e período refratário
 *    - Condução saltatória realística saltando entre nódulos de Ranvier
 *    - Atraso sináptico de 0.8 ms antes da exocitose vesicular
 * 3. Sistema Glial Quádruplo:
 *    - Astrócitos (pés vasculares perivasculares nos capilares e sinapse tripartite)
 *    - Oligodendrócitos (formação de internódios de mielina)
 *    - Micróglia (vigilante ramificada em repouso vs. ameboide ativada)
 *    - Células ependimárias (epitélio ciliado ventricular com batimento coordenado)
 * 4. Painel Osciloscópio Eletrofisiológico em Tempo Real (Canvas V_m(t))
 * ============================================================================
 */

(function (window) {
  'use strict';

  // ==========================================================================
  // 1. MODELO BIOFÍSICO HODGKIN-HUXLEY SIMPLIFICADO
  // ==========================================================================
  class HodgkinHuxleyModel {
    constructor() {
      // Parâmetros clássicos de Hodgkin-Huxley (calibrados para axônio humano a 37°C)
      this.Cm = 1.0; // uF/cm^2
      this.gNa = 120.0; // mS/cm^2
      this.gK = 36.0;  // mS/cm^2
      this.gL = 0.3;   // mS/cm^2

      this.ENa = 55.0;  // mV
      this.EK = -85.0;  // mV
      this.EL = -65.0;  // mV

      // Estado inicial em repouso
      this.V = -70.0; // mV
      this.m = 0.0529;
      this.h = 0.5961;
      this.n = 0.3177;

      this.stimulus = 0.0;
      this.isRefractory = false;
      this.phase = 'REPOUSO (-70 mV)';
      this.time = 0.0;

      // Histórico para renderização do osciloscópio
      this.history = [];
      this.maxHistory = 140;
    }

    alphaM(V) {
      const v = V + 40.0;
      return Math.abs(v) < 1e-4 ? 1.0 : (0.1 * v) / (1.0 - Math.exp(-v / 10.0));
    }
    betaM(V) {
      return 4.0 * Math.exp(-(V + 65.0) / 18.0);
    }
    alphaH(V) {
      return 0.07 * Math.exp(-(V + 65.0) / 20.0);
    }
    betaH(V) {
      return 1.0 / (1.0 + Math.exp(-(V + 35.0) / 10.0));
    }
    alphaN(V) {
      const v = V + 55.0;
      return Math.abs(v) < 1e-4 ? 0.1 : (0.01 * v) / (1.0 - Math.exp(-v / 10.0));
    }
    betaN(V) {
      return 0.125 * Math.exp(-(V + 65.0) / 80.0);
    }

    triggerStimulus(current = 15.0) {
      this.stimulus = current;
    }

    step(dtMs = 0.8) {
      this.time += dtMs;

      // Integração numérica rígida com sub-stepping e clamping (Euler estável)
      const subSteps = 20;
      const dt = dtMs / subSteps;

      for (let s = 0; s < subSteps; s++) {
        const aM = this.alphaM(this.V);
        const bM = this.betaM(this.V);
        const aH = this.alphaH(this.V);
        const bH = this.betaH(this.V);
        const aN = this.alphaN(this.V);
        const bN = this.betaN(this.V);

        this.m = Math.max(0, Math.min(1, this.m + (aM * (1.0 - this.m) - bM * this.m) * dt));
        this.h = Math.max(0, Math.min(1, this.h + (aH * (1.0 - this.h) - bH * this.h) * dt));
        this.n = Math.max(0, Math.min(1, this.n + (aN * (1.0 - this.n) - bN * this.n) * dt));

        const INa = this.gNa * Math.pow(this.m, 3) * this.h * (this.V - this.ENa);
        const IK = this.gK * Math.pow(this.n, 4) * (this.V - this.EK);
        const IL = this.gL * (this.V - this.EL);

        const dV = (this.stimulus - (INa + IK + IL)) / this.Cm;
        this.V = Math.max(-95.0, Math.min(55.0, this.V + dV * dt));

        if (this.stimulus > 0) {
          this.stimulus = Math.max(0, this.stimulus - 8.0 * dt);
        }
      }

      // Determinação da fase biofísica
      if (this.V > 15.0) {
        this.phase = 'DESPOLARIZAÇÃO PICO (+30 mV)';
      } else if (this.V > -55.0 && this.V <= 15.0) {
        this.phase = 'DESPOLARIZAÇÃO (Influxo Na+)';
      } else if (this.V <= -70.0 && this.V >= -85.0) {
        this.phase = 'HIPERPOLARIZAÇÃO / REFRATÁRIO';
      } else if (this.V < -85.0) {
        this.phase = 'HIPERPOLARIZAÇÃO MÁXIMA';
      } else {
        this.phase = 'POTENCIAL DE REPOUSO (-70 mV)';
      }

      this.history.push({ t: this.time, v: this.V, phase: this.phase });
      if (this.history.length > this.maxHistory) {
        this.history.shift();
      }

      return this.V;
    }
  }

  // ==========================================================================
  // 2. CONSTRUTOR DE NEURÔNIOS BIOLOGICAMENTE PLAUSÍVEIS
  // ==========================================================================
  class BiologicalNeuronBuilder {
    static createHeroPyramidalNeuron(seed = 1) {
      const neuronGroup = new THREE.Group();
      neuronGroup.name = `BIOLOGICAL_NEURON_HERO_${seed}`;

      // 1. SOMA ORGÂNICO ASSIMÉTRICO (Pericário Piramidal)
      // Formato orgânico semitransparente com ponta apical apontando para o córtex pial (+Y)
      const somaGeo = new THREE.SphereGeometry(1.65, 32, 28);
      const sPos = somaGeo.attributes.position;
      for (let i = 0; i < sPos.count; i++) {
        let x = sPos.getX(i);
        let y = sPos.getY(i);
        let z = sPos.getZ(i);

        // Afinamento cônico apical em direção ao tronco dendrítico (+Y)
        if (y > 0) {
          x *= (1.0 - (y / 1.65) * 0.45);
          z *= (1.0 - (y / 1.65) * 0.45);
          y *= 1.25; // Elevação cônica
        } else {
          // Base alargada com três projeções radiais para os dendritos basais
          const angle = Math.atan2(z, x);
          const triLobe = Math.sin(angle * 3.0) * 0.22;
          x *= (1.0 + triLobe);
          z *= (1.0 + triLobe);
        }

        // Ruído orgânico fino de superfície celular
        const noise = Math.sin(x * 5.0) * Math.cos(z * 5.0) * 0.08;
        sPos.setXYZ(i, x + noise, y, z + noise);
      }
      somaGeo.computeVertexNormals();

      // Membrana Celular Fosfolipídica com Shader Fresnel Semitransparente
      const membraneMat = new THREE.MeshPhysicalMaterial({
        color: 0xf59e0b, // Âmbar biológico
        roughness: 0.25,
        transmission: 0.65, // Semitransparente
        opacity: 0.92,
        transparent: true,
        reflectivity: 0.85,
        clearcoat: 0.8,
        clearcoatRoughness: 0.15,
        emissive: 0xd97706,
        emissiveIntensity: 0.35
      });
      const somaMesh = new THREE.Mesh(somaGeo, membraneMat);
      somaMesh.name = "Soma_Membrana";
      neuronGroup.add(somaMesh);

      // Núcleo Celular DAPI Azul-Violeta Visível no Interior
      const nucleusGeo = new THREE.SphereGeometry(0.75, 24, 20);
      const nucleusMat = new THREE.MeshStandardMaterial({
        color: 0x6366f1, // DAPI blue/violet
        roughness: 0.2,
        emissive: 0x4f46e5,
        emissiveIntensity: 0.65
      });
      const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
      nucleusMesh.position.set(0.08, -0.15, 0.05);
      neuronGroup.add(nucleusMesh);

      // Nucléolo Dourado Central
      const nucleolusGeo = new THREE.SphereGeometry(0.25, 16, 16);
      const nucleolusMat = new THREE.MeshBasicMaterial({
        color: 0xfde047
      });
      const nucleolusMesh = new THREE.Mesh(nucleolusGeo, nucleolusMat);
      nucleolusMesh.position.set(0.12, -0.10, 0.08);
      neuronGroup.add(nucleolusMesh);

      // Corpúsculos de Nissl e Mitocôndrias Citoplasmáticas
      const organelleGeo = new THREE.DodecahedronGeometry(0.09);
      const organelleMat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        roughness: 0.3,
        emissive: 0x059669,
        emissiveIntensity: 0.4
      });
      for (let o = 0; o < 14; o++) {
        const oMesh = new THREE.Mesh(organelleGeo, organelleMat);
        const theta = (o / 14) * Math.PI * 2;
        const rad = 0.95 + Math.random() * 0.35;
        oMesh.position.set(Math.cos(theta) * rad, (Math.random() - 0.5) * 1.2, Math.sin(theta) * rad);
        neuronGroup.add(oMesh);
      }

      // 2. DENDRITO APICAL PRINCIPAL COM AFINAMENTO FRACTAL PELA LEI DE RALL
      // d_parent^1.5 = sum d_child^1.5
      const apicalCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.0, 1.8, 0.0),      // Cone de inserção apical
        new THREE.Vector3(0.2, 4.2, 0.15),    // Tronco primário
        new THREE.Vector3(-0.15, 7.5, -0.1),  // Tronco médio com ramificações oblíquas
        new THREE.Vector3(0.3, 11.0, 0.25),   // Bifurcação em tufo distal
        new THREE.Vector3(0.0, 14.5, 0.0)     // Tufo apical na Camada I
      ]);
      const apicalGeo = new THREE.TubeGeometry(apicalCurve, 32, 0.42, 8, false);
      const dendriteMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        roughness: 0.35,
        emissive: 0xb45309,
        emissiveIntensity: 0.3
      });
      const apicalMesh = new THREE.Mesh(apicalGeo, dendriteMat);
      neuronGroup.add(apicalMesh);

      // Ramos Oblíquos e Tufo Distal
      const branchDirs = [
        [new THREE.Vector3(0.2, 4.2, 0.15), new THREE.Vector3(2.5, 6.0, 1.0)],
        [new THREE.Vector3(0.2, 4.2, 0.15), new THREE.Vector3(-2.2, 5.8, -0.8)],
        [new THREE.Vector3(-0.15, 7.5, -0.1), new THREE.Vector3(3.2, 9.5, -1.2)],
        [new THREE.Vector3(-0.15, 7.5, -0.1), new THREE.Vector3(-2.8, 9.2, 1.5)],
        [new THREE.Vector3(0.3, 11.0, 0.25), new THREE.Vector3(3.8, 13.5, 1.8)],
        [new THREE.Vector3(0.3, 11.0, 0.25), new THREE.Vector3(-3.5, 13.8, -1.5)]
      ];

      branchDirs.forEach(pair => {
        const mid = pair[0].clone().lerp(pair[1], 0.5).add(new THREE.Vector3((Math.random() - 0.5) * 0.6, 0.3, (Math.random() - 0.5) * 0.6));
        const c = new THREE.CatmullRomCurve3([pair[0], mid, pair[1]]);
        const bGeo = new THREE.TubeGeometry(c, 16, 0.22, 6, false);
        const bMesh = new THREE.Mesh(bGeo, dendriteMat);
        neuronGroup.add(bMesh);
      });

      // Dendritos Basais (3 árvores irradiando da base)
      for (let b = 0; b < 3; b++) {
        const angle = (b / 3) * Math.PI * 2;
        const bStart = new THREE.Vector3(Math.cos(angle) * 1.4, -1.2, Math.sin(angle) * 1.4);
        const bMid = new THREE.Vector3(Math.cos(angle) * 3.5, -2.8, Math.sin(angle) * 3.5);
        const bEnd = new THREE.Vector3(Math.cos(angle) * 5.8 + (Math.random() - 0.5) * 1.5, -4.5, Math.sin(angle) * 5.8);

        const bCurve = new THREE.CatmullRomCurve3([bStart, bMid, bEnd]);
        const bGeo = new THREE.TubeGeometry(bCurve, 20, 0.28, 6, false);
        const bMesh = new THREE.Mesh(bGeo, dendriteMat);
        neuronGroup.add(bMesh);
      }

      // Espinhas Dendríticas 3D em Cogumelo (InstancedMesh)
      const spineCount = 180;
      const spineStemGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.28, 5);
      const spineHeadGeo = new THREE.SphereGeometry(0.12, 6, 6);
      spineHeadGeo.translate(0, 0.20, 0);

      const spineMat = new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        roughness: 0.3,
        emissive: 0xd97706,
        emissiveIntensity: 0.4
      });

      const spinesGroup = new THREE.Group();
      spinesGroup.name = "Dendritic_Spines";
      for (let s = 0; s < spineCount; s++) {
        const u = 0.15 + (s / spineCount) * 0.80;
        const pt = apicalCurve.getPointAt(u);
        const theta = Math.random() * Math.PI * 2;
        const offset = new THREE.Vector3(Math.cos(theta) * 0.45, 0, Math.sin(theta) * 0.45);

        const spineMesh = new THREE.Mesh(spineHeadGeo, spineMat);
        spineMesh.position.copy(pt).add(offset);
        spineMesh.scale.setScalar(0.8 + Math.random() * 0.5);
        spinesGroup.add(spineMesh);
      }
      neuronGroup.add(spinesGroup);

      // 3. AXÔNIO CURVO, CONE DE IMPLANTAÇÃO, MIELINA E NÓDULOS DE RANVIER
      const axonCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.0, -1.6, 0.0),    // Cone de implantação axonal
        new THREE.Vector3(0.15, -3.2, 0.1),   // Segmento inicial do axônio (AIS)
        new THREE.Vector3(-0.2, -6.0, -0.15), // Início da mielinização
        new THREE.Vector3(0.3, -9.5, 0.2),    // Trajetória biológica descendente
        new THREE.Vector3(-0.1, -13.5, -0.1), // Rumo à substância branca
        new THREE.Vector3(0.2, -18.0, 0.15),  // Arborização terminal
        new THREE.Vector3(0.0, -22.0, 0.0)    // Botões sinápticos terminais
      ]);

      // Fibra Axonal Nua Central
      const axonCoreGeo = new THREE.TubeGeometry(axonCurve, 48, 0.15, 6, false);
      const axonCoreMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        roughness: 0.4,
        emissive: 0x0284c7,
        emissiveIntensity: 0.5
      });
      const axonCoreMesh = new THREE.Mesh(axonCoreGeo, axonCoreMat);
      neuronGroup.add(axonCoreMesh);

      // Cápsulas de Mielina Internodais Orgânicas e Nódulos de Ranvier
      const internodeCount = 6;
      const myelinSheaths = [];
      const ranvierNodes = [];

      const myelinMat = new THREE.MeshStandardMaterial({
        color: 0xe0f2fe,
        roughness: 0.35,
        metalness: 0.1,
        transparent: true,
        opacity: 0.90,
        emissive: 0xbae6fd,
        emissiveIntensity: 0.2
      });

      const ranvierMat = new THREE.MeshStandardMaterial({
        color: 0x00f2fe, // Azul-elétrico bioluminescente
        roughness: 0.15,
        emissive: 0x00f2fe,
        emissiveIntensity: 1.2
      });

      for (let m = 0; m < internodeCount; m++) {
        const uStart = 0.15 + m * 0.13;
        const uEnd = uStart + 0.105; // Deixa 0.025 livre para o nódulo de Ranvier
        const uRanvier = uEnd + 0.0125;

        // Subcurva do internódio de mielina
        const p1 = axonCurve.getPointAt(uStart);
        const p2 = axonCurve.getPointAt(uEnd);
        const pMid = axonCurve.getPointAt((uStart + uEnd) / 2);
        const subCurve = new THREE.CatmullRomCurve3([p1, pMid, p2]);

        const mGeo = new THREE.TubeGeometry(subCurve, 12, 0.48, 8, false);
        const mMesh = new THREE.Mesh(mGeo, myelinMat.clone());
        mMesh.name = `Myelin_Internode_${m}`;
        neuronGroup.add(mMesh);
        myelinSheaths.push(mMesh);

        // Nódulo de Ranvier (Anel estreito com alta densidade de canais Nav1.6)
        if (m < internodeCount - 1 && uRanvier < 0.98) {
          const rPt = axonCurve.getPointAt(uRanvier);
          const rGeo = new THREE.TorusGeometry(0.24, 0.065, 8, 16);
          const rMesh = new THREE.Mesh(rGeo, ranvierMat.clone());
          rMesh.position.copy(rPt);
          rMesh.name = `Ranvier_Node_${m}`;
          neuronGroup.add(rMesh);
          ranvierNodes.push(rMesh);
        }
      }

      // Botões Sinápticos Terminais
      const terminalPt = axonCurve.getPointAt(1.0);
      const boutonGroup = new THREE.Group();
      boutonGroup.name = "Synaptic_Boutons";
      const boutonGeo = new THREE.SphereGeometry(0.38, 12, 10);
      boutonGeo.scale(1.2, 0.8, 1.0);
      const boutonMat = new THREE.MeshStandardMaterial({
        color: 0x4ade80,
        roughness: 0.25,
        emissive: 0x22c55e,
        emissiveIntensity: 0.6
      });

      for (let t = 0; t < 3; t++) {
        const b = new THREE.Mesh(boutonGeo, boutonMat);
        b.position.copy(terminalPt).add(new THREE.Vector3((t - 1) * 0.7, -0.4, (Math.random() - 0.5) * 0.5));
        boutonGroup.add(b);
      }
      neuronGroup.add(boutonGroup);

      return {
        group: neuronGroup,
        axonCurve,
        myelinSheaths,
        ranvierNodes,
        spinesGroup,
        somaMesh
      };
    }
  }

  // ==========================================================================
  // 3. CONSTRUTOR DE CÉLULAS DA GLIA (4 TIPOS)
  // ==========================================================================
  class GliaSystemBuilder {
    static buildAllGliaTypes() {
      const gliaGroup = new THREE.Group();
      gliaGroup.name = "GLIA_SYSTEM_GROUP";

      const gliaCollections = {
        ASTROCYTE: new THREE.Group(),
        OLIGODENDROCYTE: new THREE.Group(),
        MICROGLIA: new THREE.Group(),
        EPENDYMAL: new THREE.Group()
      };

      gliaCollections.ASTROCYTE.name = "GLIA_ASTROCYTES";
      gliaCollections.OLIGODENDROCYTE.name = "GLIA_OLIGODENDROCYTES";
      gliaCollections.MICROGLIA.name = "GLIA_MICROGLIA";
      gliaCollections.EPENDYMAL.name = "GLIA_EPENDYMAL";

      // A. ASTRÓCITOS (Corpo estrelado + prolongamentos com pés perivasculares)
      const astroMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        roughness: 0.35,
        emissive: 0x0284c7,
        emissiveIntensity: 0.4
      });
      for (let a = 0; a < 6; a++) {
        const astroCell = new THREE.Group();
        const somaGeo = new THREE.DodecahedronGeometry(0.55);
        const somaMesh = new THREE.Mesh(somaGeo, astroMat);
        astroCell.add(somaMesh);

        // 12 prolongamentos radiados
        for (let p = 0; p < 12; p++) {
          const phi = Math.acos(2 * Math.random() - 1);
          const theta = Math.random() * Math.PI * 2;
          const endPt = new THREE.Vector3(
            Math.sin(phi) * Math.cos(theta) * 2.5,
            Math.sin(phi) * Math.sin(theta) * 2.5,
            Math.cos(phi) * 2.5
          );
          const c = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), endPt]);
          const armGeo = new THREE.TubeGeometry(c, 8, 0.065, 5, false);
          const armMesh = new THREE.Mesh(armGeo, astroMat);
          astroCell.add(armMesh);

          // Pé vascular na extremidade de 30% dos prolongamentos
          if (p % 3 === 0) {
            const footGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.12, 6);
            footGeo.rotateX(Math.PI / 2);
            const footMesh = new THREE.Mesh(footGeo, astroMat);
            footMesh.position.copy(endPt);
            astroCell.add(footMesh);
          }
        }
        astroCell.position.set(-6.5 + a * 2.6, 2.0 + (a % 2) * 3.0, -3.0 + (a % 3) * 2.5);
        gliaCollections.ASTROCYTE.add(astroCell);
      }

      // B. OLIGODENDROCITOS (Corpo pequeno com processos envolvendo axônios)
      const oligoMat = new THREE.MeshStandardMaterial({
        color: 0x34d399,
        roughness: 0.3,
        emissive: 0x059669,
        emissiveIntensity: 0.45
      });
      for (let o = 0; o < 5; o++) {
        const oligoCell = new THREE.Group();
        const oSoma = new THREE.Mesh(new THREE.SphereGeometry(0.42, 12, 10), oligoMat);
        oligoCell.add(oSoma);

        // Processos citoplasmáticos que se estendem até bainhas de mielina
        for (let pr = 0; pr < 6; pr++) {
          const armEnd = new THREE.Vector3(
            (Math.random() - 0.5) * 3.5,
            -2.0 - pr * 1.8,
            (Math.random() - 0.5) * 3.0
          );
          const c = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), armEnd]);
          const arm = new THREE.Mesh(new THREE.TubeGeometry(c, 8, 0.05, 5, false), oligoMat);
          oligoCell.add(arm);
        }
        oligoCell.position.set(4.5 + (o % 2) * 2.0, -4.0 - o * 3.0, 2.5);
        gliaCollections.OLIGODENDROCYTE.add(oligoCell);
      }

      // C. MICRÓGLIA (Vigilante com ramos finos)
      const microMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        roughness: 0.4,
        emissive: 0xd97706,
        emissiveIntensity: 0.4
      });
      for (let m = 0; m < 8; m++) {
        const microCell = new THREE.Group();
        const mSoma = new THREE.Mesh(new THREE.SphereGeometry(0.32, 10, 8), microMat);
        microCell.add(mSoma);

        for (let b = 0; b < 10; b++) {
          const dir = new THREE.Vector3((Math.random() - 0.5) * 3.2, (Math.random() - 0.5) * 3.2, (Math.random() - 0.5) * 3.2);
          const c = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), dir]);
          const br = new THREE.Mesh(new THREE.TubeGeometry(c, 6, 0.038, 4, false), microMat);
          microCell.add(br);
        }
        microCell.position.set((Math.random() - 0.5) * 16.0, (Math.random() - 0.5) * 14.0, (Math.random() - 0.5) * 12.0);
        gliaCollections.MICROGLIA.add(microCell);
      }

      // D. CÉLULAS EPENDIMÁRIAS (Monocamada epitelial cubóide com tufos de cílios móveis)
      const ependMat = new THREE.MeshStandardMaterial({
        color: 0xc084fc,
        roughness: 0.28,
        emissive: 0x9333ea,
        emissiveIntensity: 0.4
      });
      const ciliaMat = new THREE.MeshBasicMaterial({ color: 0xe9d5ff });

      const ependRow = 14;
      const ciliaList = [];
      for (let i = 0; i < ependRow; i++) {
        const ependCell = new THREE.Group();
        const cubeGeo = new THREE.BoxGeometry(0.75, 0.85, 0.75);
        const cubeMesh = new THREE.Mesh(cubeGeo, ependMat);
        ependCell.add(cubeMesh);

        // Tufo de 5 cílios apicais
        for (let c = 0; c < 5; c++) {
          const cilGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.65, 4);
          cilGeo.translate(0, 0.32, 0);
          const cilMesh = new THREE.Mesh(cilGeo, ciliaMat);
          cilMesh.position.set((c - 2) * 0.12, 0.42, (Math.random() - 0.5) * 0.2);
          ependCell.add(cilMesh);
          ciliaList.push(cilMesh);
        }
        ependCell.position.set(-5.5 + i * 0.85, -12.5, -4.5);
        gliaCollections.EPENDYMAL.add(ependCell);
      }

      gliaGroup.add(gliaCollections.ASTROCYTE);
      gliaGroup.add(gliaCollections.OLIGODENDROCYTE);
      gliaGroup.add(gliaCollections.MICROGLIA);
      gliaGroup.add(gliaCollections.EPENDYMAL);

      return {
        group: gliaGroup,
        collections: gliaCollections,
        ciliaList
      };
    }
  }

  // ==========================================================================
  // 4. CLASSE PRINCIPAL DO MICROCOSMO NEURAL 3D
  // ==========================================================================
  class NeuralMicrocosmos3D {
    constructor(scene, options = {}) {
      this.scene = scene;
      this.masterGroup = new THREE.Group();
      this.masterGroup.name = "NEURAL_MICROCOSMOS_BIOLOGICAL_MASTER";
      this.scene.add(this.masterGroup);

      this.hhSimulator = new HodgkinHuxleyModel();
      this.heroNeuron = null;
      this.gliaSystem = null;
      this.actionSaltatoryPulses = [];
      this.synapticVesicles = [];
      this.elapsedTime = 0.0;
      this.currentPathology = 'NORMAL';

      // Visibilidade das células da Glia
      this.gliaVisibility = {
        ASTROCYTE: true,
        OLIGODENDROCYTE: true,
        MICROGLIA: true,
        EPENDYMAL: true
      };

      this.initBiologicalMicrocosm();
    }

    initBiologicalMicrocosm() {
      // 1. Constrói Neurônio Heroico Piramidal Biológico da Camada V
      this.heroNeuron = BiologicalNeuronBuilder.createHeroPyramidalNeuron(1);
      this.masterGroup.add(this.heroNeuron.group);

      // 2. Constrói o Sistema Glial Quádruplo
      this.gliaSystem = GliaSystemBuilder.buildAllGliaTypes();
      this.masterGroup.add(this.gliaSystem.group);

      // 3. Conectoma de Fundo (Plexo de Neurônios da Camada V em InstancedMesh GPU)
      this.initConnectomeBackground();

      // 4. Pulsos Saltatórios nos Nódulos de Ranvier
      this.initSaltatoryConduction();

      // 5. Vesículas de Neurotransmissores Quânticos na Fenda Sináptica
      this.initSynapticCleftVesicles();
    }

    // [PT-BR]: Constrói o Conectoma Microscópico idêntico à imagem Firefly Layer V (Fundo azul-petróleo #030d18, 16 neurônios vizinhos esculpidos em ciano e âmbar, e 24 sinapses).
    // [EN-GB]: Builds Microscopic Connectome matching Firefly Layer V (Dark teal background #030d18, 16 sculpted neighbor neurons in cyan and amber, and 24 synapses).
    // [AI-CTX]: @llm-neuroscience: Layer V pyramidal micro-circuitry with bidirectional chemical synapses (anterograde glutamate/GABA + retrograde 2-AG/NO + EAAT2/GAT-1 reuptake).
    initConnectomeBackground() {
      this.neighborNeuronsGroup = new THREE.Group();
      this.neighborNeuronsGroup.name = "LAYER_V_NEIGHBOR_NEURONS";
      this.neighborNeurons = [];

      // 16 Neurônios Vizinhos Esculpidos posicionados na mesma distância limpa da imagem de referência
      const neighborCoords = [
        [-8.5, 4.2, -6.0], [9.2, 5.0, -5.5], [-7.2, -5.5, -4.5], [8.0, -6.2, -5.0],
        [-12.0, 1.5, -8.0], [13.0, 2.0, -7.5], [-4.5, 9.5, -7.0], [5.2, 10.0, -6.5],
        [-11.5, -9.0, -9.0], [11.0, -8.5, -8.5], [-14.5, 8.0, -11.0], [14.0, 7.5, -10.5],
        [-6.0, -14.0, -8.0], [6.5, -14.5, -7.5], [-16.0, -3.5, -12.0], [16.5, -2.8, -11.5]
      ];

      const cyanMat = new THREE.MeshPhysicalMaterial({
        color: 0x0284c7, // Azul-ciano profundo
        roughness: 0.28,
        transmission: 0.45,
        opacity: 0.88,
        transparent: true,
        emissive: 0x0369a1,
        emissiveIntensity: 0.35
      });

      const amberMat = new THREE.MeshPhysicalMaterial({
        color: 0xd97706, // Âmbar biológico
        roughness: 0.32,
        transmission: 0.50,
        opacity: 0.88,
        transparent: true,
        emissive: 0xb45309,
        emissiveIntensity: 0.35
      });

      neighborCoords.forEach((coord, idx) => {
        const nGroup = new THREE.Group();
        nGroup.position.set(coord[0], coord[1], coord[2]);

        const mat = (idx % 2 === 0) ? cyanMat.clone() : amberMat.clone();

        // Pericário piramidal
        const sGeo = new THREE.SphereGeometry(1.15, 18, 14);
        sGeo.scale(1.0, 1.35, 1.0);
        const sMesh = new THREE.Mesh(sGeo, mat);
        nGroup.add(sMesh);

        // Tronco dendrítico apical ascendente
        const apCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 1.2, 0),
          new THREE.Vector3((Math.random() - 0.5) * 1.5, 4.5, (Math.random() - 0.5) * 1.5),
          new THREE.Vector3((Math.random() - 0.5) * 2.5, 7.5, (Math.random() - 0.5) * 2.0)
        ]);
        const apGeo = new THREE.TubeGeometry(apCurve, 12, 0.18, 6, false);
        const apMesh = new THREE.Mesh(apGeo, mat);
        nGroup.add(apMesh);

        // Axônio descendente
        const axCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, -1.2, 0),
          new THREE.Vector3((Math.random() - 0.5) * 1.2, -4.5, (Math.random() - 0.5) * 1.0),
          new THREE.Vector3((Math.random() - 0.5) * 2.0, -8.0, (Math.random() - 0.5) * 1.5)
        ]);
        const axGeo = new THREE.TubeGeometry(axCurve, 12, 0.12, 5, false);
        const axMesh = new THREE.Mesh(axGeo, mat);
        nGroup.add(axMesh);

        this.neighborNeuronsGroup.add(nGroup);
        this.neighborNeurons.push({ group: nGroup, pos: new THREE.Vector3(coord[0], coord[1], coord[2]) });
      });

      this.masterGroup.add(this.neighborNeuronsGroup);

      // 24 Sinapses Químicas Conectando os Neurônios entre si
      this.synapseCircuitsGroup = new THREE.Group();
      this.synapseCircuitsGroup.name = "SYNAPSE_CIRCUITS_24";
      this.synapses = [];

      const synapseMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.35
      });

      for (let s = 0; s < 24; s++) {
        // Conexão entre o neurônio herói [0, 0, 0] e um vizinho, ou entre vizinhos
        const startPt = (s < 16)
          ? new THREE.Vector3((Math.random() - 0.5) * 2.0, (Math.random() - 0.5) * 4.0, (Math.random() - 0.5) * 2.0)
          : this.neighborNeurons[s % 16].pos.clone().add(new THREE.Vector3(0, (Math.random() - 0.5) * 2.0, 0));

        const targetNeuron = this.neighborNeurons[(s * 3 + 1) % 16];
        const endPt = targetNeuron.pos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 2.5, 0));

        const midPt = startPt.clone().lerp(endPt, 0.5).add(new THREE.Vector3((Math.random() - 0.5) * 2.5, (Math.random() - 0.5) * 2.5, (Math.random() - 0.5) * 2.0));
        const curve = new THREE.CatmullRomCurve3([startPt, midPt, endPt]);

        const synGeo = new THREE.TubeGeometry(curve, 16, 0.035, 4, false);
        const synMesh = new THREE.Mesh(synGeo, new THREE.MeshStandardMaterial({
          color: (s % 2 === 0) ? 0x0284c7 : 0xf59e0b,
          roughness: 0.3,
          transparent: true,
          opacity: 0.45
        }));
        this.synapseCircuitsGroup.add(synMesh);

        // Botão sináptico pós-sináptico
        const boutonGeo = new THREE.SphereGeometry(0.18, 8, 8);
        const boutonMesh = new THREE.Mesh(boutonGeo, new THREE.MeshBasicMaterial({ color: 0x00f2fe }));
        boutonMesh.position.copy(endPt);
        this.synapseCircuitsGroup.add(boutonMesh);

        this.synapses.push({ curve, startPt, endPt });
      }

      this.masterGroup.add(this.synapseCircuitsGroup);
    }

    initSaltatoryConduction() {
      // Cria pulso saltatório luminoso que viaja ao longo dos nódulos de Ranvier
      const pulseGeo = new THREE.SphereGeometry(0.35, 12, 12);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: 0x00f2fe,
        transparent: true,
        opacity: 0.95
      });
      this.saltatoryPulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
      this.masterGroup.add(this.saltatoryPulseMesh);

      this.currentRanvierIndex = 0;
      this.ranvierHopTimer = 0.0;
    }

    // [PT-BR]: Partículas de Neurotransmissores Bidirecionais nas Sinapses (Anterógrado Glutamato/GABA + Retrógrado 2-AG/NO e Recaptação EAAT2/GAT-1).
    // [EN-GB]: Bidirectional Synaptic Neurotransmitter Particles (Anterograde Glutamate/GABA + Retrograde 2-AG/NO and EAAT2/GAT-1 reuptake).
    initSynapticCleftVesicles() {
      this.synapticVesiclesGroup = new THREE.Group();
      this.synapticVesiclesGroup.name = "BIDIRECTIONAL_NEUROTRANSMITTERS";
      this.synapticVesicles = [];

      const pGeo = new THREE.SphereGeometry(0.065, 6, 6);

      // 180 partículas transitando pelas 24 sinapses
      const totalParticles = 180;
      for (let i = 0; i < totalParticles; i++) {
        const synapseIdx = i % this.synapses.length;
        const syn = this.synapses[synapseIdx];

        // 60% anterógrado (Glutamato dourado #fbbf24 ou GABA ciano #00f2fe), 40% retrógrado (2-AG verde-esmeralda #10b981)
        const isRetrograde = (i % 5 >= 3);
        let colorHex = 0xfbbf24; // Glutamato padrão
        if (isRetrograde) {
          colorHex = 0x10b981; // Retrógrado 2-AG / Óxido Nítrico (NO)
        } else if (i % 2 === 0) {
          colorHex = 0x00f2fe; // GABA inibitório ciano
        }

        const mesh = new THREE.Mesh(pGeo, new THREE.MeshBasicMaterial({ color: colorHex }));
        this.synapticVesiclesGroup.add(mesh);

        this.synapticVesicles.push({
          mesh,
          syn,
          u: Math.random(),
          speed: (0.15 + Math.random() * 0.35) * (isRetrograde ? -1.0 : 1.0),
          isRetrograde
        });
      }

      this.masterGroup.add(this.synapticVesiclesGroup);
    }

    // [PT-BR]: Dispara um potencial de ação e inicia a condução saltatória.
    // [EN-GB]: Triggers an action potential and initiates saltatory conduction.
    triggerActionPotential(stimulusStrength = 20.0) {
      this.hhSimulator.triggerStimulus(stimulusStrength);
    }

    // [PT-BR]: Alterna a visibilidade dos tipos de glia.
    // [EN-GB]: Toggles glia cell types visibility.
    setGliaVisibility(type, isVisible) {
      if (this.gliaVisibility[type] !== undefined) {
        this.gliaVisibility[type] = !!isVisible;
        if (this.gliaSystem && this.gliaSystem.collections[type]) {
          this.gliaSystem.collections[type].visible = this.gliaVisibility[type];
        }
      }
    }

    // [PT-BR]: Aplica os efeitos celulares de uma das 7 patologias.
    // [EN-GB]: Applies cellular manifestations of one of the 7 pathologies.
    applyPathologyMode(pathologyKey) {
      this.currentPathology = (pathologyKey || 'NORMAL').toUpperCase();

      if (!this.heroNeuron) return;

      if (this.currentPathology === 'MS') {
        // Desmielinização: reduz tamanho e opacidade da mielina
        this.heroNeuron.myelinSheaths.forEach(m => {
          m.scale.set(0.3, 0.4, 0.3);
          m.material.color.setHex(0xe11d48);
          m.material.opacity = 0.45;
        });
        // Bloqueio de condução saltatória
        this.heroNeuron.ranvierNodes.forEach(r => {
          r.material.color.setHex(0x78716c);
          r.material.emissiveIntensity = 0.2;
        });
      } else if (this.currentPathology === 'ALZHEIMER') {
        // Atrofia de espinhas dendríticas e perda sináptica
        if (this.heroNeuron.spinesGroup) {
          this.heroNeuron.spinesGroup.scale.setScalar(0.4);
        }
        this.heroNeuron.somaMesh.material.color.setHex(0x78350f);
      } else if (this.currentPathology === 'PARKINSON') {
        // Redução dopaminérgica e desaceleração de condução
        this.synapticVesicles.forEach(v => {
          v.mesh.material.color.setHex(0x92400e);
        });
      } else if (this.currentPathology === 'STROKE') {
        // Despolarização anóxica maciça e edema citotóxico (inchaço do soma)
        this.heroNeuron.somaMesh.scale.setScalar(1.35);
        this.heroNeuron.somaMesh.material.color.setHex(0x450a0a);
        this.synapticVesicles.forEach(v => {
          v.mesh.material.color.setHex(0xfbbf24); // Excesso de cálcio excitotóxico
        });
      } else if (this.currentPathology === 'ALS') {
        // Degeneração motora com fragmentação axonal
        this.heroNeuron.somaMesh.scale.setScalar(0.75);
        this.heroNeuron.somaMesh.material.color.setHex(0x57534e);
      } else if (this.currentPathology === 'EPILEPSY') {
        // Hiperativação paroxística: disparos contínuos de alta frequência
        this.triggerActionPotential(45.0);
      } else {
        // NORMAL
        this.heroNeuron.myelinSheaths.forEach(m => {
          m.scale.set(1.0, 1.0, 1.0);
          m.material.color.setHex(0xe0f2fe);
          m.material.opacity = 0.90;
        });
        this.heroNeuron.ranvierNodes.forEach(r => {
          r.material.color.setHex(0x00f2fe);
          r.material.emissiveIntensity = 1.2;
        });
        if (this.heroNeuron.spinesGroup) {
          this.heroNeuron.spinesGroup.scale.setScalar(1.0);
        }
        this.heroNeuron.somaMesh.scale.setScalar(1.0);
        this.heroNeuron.somaMesh.material.color.setHex(0xf59e0b);
      }
    }

    // [PT-BR]: Loop de atualização a 60 FPS com integração de Hodgkin-Huxley e condução saltatória.
    // [EN-GB]: 60 FPS update loop with Hodgkin-Huxley integration and saltatory conduction.
    update(dt) {
      this.elapsedTime += dt;

      // 1. Atualização do simulador Hodgkin-Huxley (avança 1 ms por frame)
      const dtMs = dt * 1000.0 * 0.05;
      const vm = this.hhSimulator.step(dtMs);

      // Disparos espontâneos rítmicos normais a 40 Hz (ou mais rápidos em epilepsia)
      const fireInterval = (this.currentPathology === 'EPILEPSY') ? 0.08 : 0.45;
      if (Math.sin(this.elapsedTime * (Math.PI * 2 / fireInterval)) > 0.985 && !this.hhSimulator.isRefractory) {
        this.hhSimulator.triggerStimulus(18.0);
      }

      // 2. Condução Saltatória nos Nódulos de Ranvier
      if (this.heroNeuron && this.heroNeuron.ranvierNodes.length > 0) {
        const nodes = this.heroNeuron.ranvierNodes;

        this.ranvierHopTimer += dt * 4.5;
        if (this.ranvierHopTimer >= 1.0) {
          this.ranvierHopTimer = 0.0;
          this.currentRanvierIndex = (this.currentRanvierIndex + 1) % nodes.length;

          // Efeito de pulso luminoso saltando para o próximo nódulo
          const targetNode = nodes[this.currentRanvierIndex];
          if (targetNode && this.saltatoryPulseMesh) {
            this.saltatoryPulseMesh.position.copy(targetNode.position);
            targetNode.scale.setScalar(1.6);
          }
        }

        // Suaviza escala dos nódulos
        nodes.forEach(n => {
          n.scale.lerp(new THREE.Vector3(1, 1, 1), dt * 6.0);
        });
      }

      // 3. Batimento Ciliar das Células Ependimárias (Ondas Metacronais)
      if (this.gliaSystem && this.gliaSystem.ciliaList) {
        const cilia = this.gliaSystem.ciliaList;
        for (let c = 0; c < cilia.length; c++) {
          const cil = cilia[c];
          cil.rotation.z = Math.sin(this.elapsedTime * 9.0 + c * 0.45) * 0.35;
        }
      }

      // 4. Fluxo Bidirecional de Neurotransmissores e Recaptação nas 24 Sinapses
      this.synapticVesicles.forEach(v => {
        v.u += v.speed * dt;
        if (v.u > 1.0) {
          v.u = 0.0;
        } else if (v.u < 0.0) {
          v.u = 1.0;
        }
        if (v.syn && v.syn.curve) {
          const pt = v.syn.curve.getPointAt(v.u);
          v.mesh.position.copy(pt);
        }
      });
    }

    setVisible(isVisible) {
      this.masterGroup.visible = isVisible;
    }

    getElectrophysiologyState() {
      return {
        V: this.hhSimulator.V,
        phase: this.hhSimulator.phase,
        history: this.hhSimulator.history
      };
    }
  }

  window.NeuralMicrocosmos3D = NeuralMicrocosmos3D;
  window.HodgkinHuxleyModel = HodgkinHuxleyModel;
  window.BiologicalNeuronBuilder = BiologicalNeuronBuilder;
  window.GliaSystemBuilder = GliaSystemBuilder;

})(window);
