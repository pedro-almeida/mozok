/**
 * ============================================================================
 * MOZOK v3.0 — MICROCOSMO NEURAL BIOLUMINESCENTE DE ALTA RESOLUÇÃO (CAMADA V)
 * Neurônios Piramidais de Betz com Afinamento Contínuo (Lei de Rall),
 * Bainha de Mielina Lamelar Translúcida, Sistema Glial e Hodgkin-Huxley
 * ============================================================================
 */

(function (window) {
  'use strict';

  // ==========================================================================
  // 1. MODELO BIOFÍSICO HODGKIN-HUXLEY (CALIBRADO A 37°C)
  // ==========================================================================
  class HodgkinHuxleyModel {
    constructor() {
      this.Cm = 1.0;
      this.gNa = 120.0;
      this.gK = 36.0;
      this.gL = 0.3;

      this.ENa = 55.0;
      this.EK = -85.0;
      this.EL = -65.0;

      this.V = -70.0;
      this.m = 0.0529;
      this.h = 0.5961;
      this.n = 0.3177;

      this.stimulus = 0.0;
      this.isRefractory = false;
      this.phase = 'POTENCIAL DE REPOUSO (-70 mV)';
      this.time = 0.0;

      this.history = [];
      this.maxHistory = 140;
    }

    alphaM(V) {
      const v = V + 40.0;
      return Math.abs(v) < 1e-4 ? 1.0 : (0.1 * v) / (1.0 - Math.exp(-v / 10.0));
    }
    betaM(V) { return 4.0 * Math.exp(-(V + 65.0) / 18.0); }
    alphaH(V) { return 0.07 * Math.exp(-(V + 65.0) / 20.0); }
    betaH(V) { return 1.0 / (1.0 + Math.exp(-(V + 35.0) / 10.0)); }
    alphaN(V) {
      const v = V + 55.0;
      return Math.abs(v) < 1e-4 ? 0.1 : (0.01 * v) / (1.0 - Math.exp(-v / 10.0));
    }
    betaN(V) { return 0.125 * Math.exp(-(V + 65.0) / 80.0); }

    triggerStimulus(current = 18.0) {
      this.stimulus = current;
    }

    step(dtMs = 0.8) {
      this.time += dtMs;
      const subSteps = 20;
      const dt = dtMs / subSteps;

      for (let s = 0; s < subSteps; s++) {
        const aM = this.alphaM(this.V), bM = this.betaM(this.V);
        const aH = this.alphaH(this.V), bH = this.betaH(this.V);
        const aN = this.alphaN(this.V), bN = this.betaN(this.V);

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

      if (this.V > 15.0) {
        this.phase = 'DESPOLARIZAÇÃO PICO (+30 mV)';
      } else if (this.V > -55.0 && this.V <= 15.0) {
        this.phase = 'DESPOLARIZAÇÃO (Influxo Na+)';
      } else if (this.V <= -72.0) {
        this.phase = 'HIPERPOLARIZAÇÃO / REFRATÁRIO';
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
  // 2. GERADOR DE GEOMETRIA TUBULAR COM AFINAMENTO CONTÍNUO (LEI DE RALL)
  // ==========================================================================
  function createTaperedBranchGeometry(curve, radiusStart, radiusEnd, tubularSegments = 28, radialSegments = 12, capsuleEnds = false) {
    const positions = [];
    const indices = [];
    const frames = curve.computeFrenetFrames(tubularSegments, false);

    for (let i = 0; i <= tubularSegments; i++) {
      const u = i / tubularSegments;
      const pt = curve.getPointAt(u);
      const N = frames.normals[i];
      const B = frames.binormals[i];

      let r = radiusStart * (1.0 - u) + radiusEnd * u;
      if (capsuleEnds) {
        // Perfil boleado suave nas extremidades paranodais da bainha de mielina
        const edgeFade = Math.sin(u * Math.PI);
        r *= (0.55 + 0.45 * Math.pow(edgeFade, 0.35));
      }

      for (let j = 0; j <= radialSegments; j++) {
        const v = (j / radialSegments) * Math.PI * 2;
        const cosV = Math.cos(v);
        const sinV = Math.sin(v);

        const nx = cosV * N.x + sinV * B.x;
        const ny = cosV * N.y + sinV * B.y;
        const nz = cosV * N.z + sinV * B.z;

        positions.push(pt.x + r * nx, pt.y + r * ny, pt.z + r * nz);
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
    return geo;
  }

  // ==========================================================================
  // 3. CONSTRUTOR DE NEURÔNIO PIRAMIDAL DE CAMADA V (BETZ) BIOLUMINESCENTE
  // ==========================================================================
  class BiologicalNeuronBuilder {
    static createHeroPyramidalNeuron(seed = 1) {
      const neuronGroup = new THREE.Group();
      neuronGroup.name = `BIOLOGICAL_NEURON_HERO_${seed}`;

      // 1. SOMA PIRAMIDAL EM GOTA ANATÔMICA CONTÍNUA (Zero ruído serrilhado)
      const somaGeo = new THREE.SphereGeometry(1.45, 64, 48);
      const sPos = somaGeo.attributes.position;
      for (let i = 0; i < sPos.count; i++) {
        let x = sPos.getX(i);
        let y = sPos.getY(i);
        let z = sPos.getZ(i);

        if (y > 0) {
          // Afunilamento piramidal cônico suave que se funde ao dendrito apical em y = +2.25
          const u = Math.min(1.0, y / 1.45);
          const taper = Math.pow(1.0 - u, 0.72) * 0.82 + 0.18;
          x *= taper;
          z *= taper;
          y *= 1.55;
        } else {
          // Base piramidal tri-lobada suave e afunilamento no cone de implantação axonal (hillock)
          const u = Math.min(1.0, Math.abs(y) / 1.45);
          const angle = Math.atan2(z, x);
          const basalSkirt = (1.0 - u) * Math.cos(angle * 3.0) * 0.12;
          const hillockTaper = u > 0.55 ? (1.0 - (u - 0.55) / 0.45 * 0.65) : 1.0;
          x *= (1.08 + basalSkirt) * hillockTaper;
          z *= (1.08 + basalSkirt) * hillockTaper;
          y *= 1.15;
        }
        sPos.setXYZ(i, x, y, z);
      }
      somaGeo.computeVertexNormals();

      // Membrana Plasmática Bioluminescente Translúcida (Ciano-Safira com Brilho Dourado Interno)
      const membraneMat = new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        roughness: 0.16,
        metalness: 0.05,
        transmission: 0.72,
        opacity: 0.92,
        transparent: true,
        ior: 1.42,
        clearcoat: 0.90,
        clearcoatRoughness: 0.10,
        emissive: 0x0284c7,
        emissiveIntensity: 0.48,
        sheen: 0.80,
        sheenColor: new THREE.Color(0x00f2fe)
      });
      const somaMesh = new THREE.Mesh(somaGeo, membraneMat);
      somaMesh.name = "Soma_Membrana_Organica";
      neuronGroup.add(somaMesh);

      // Núcleo Eucromático Translúcido e Nucléolo Bioluminescente Dourado
      const nucleusGeo = new THREE.SphereGeometry(0.68, 32, 24);
      nucleusGeo.scale(1.0, 1.12, 1.0);
      const nucleusMat = new THREE.MeshStandardMaterial({
        color: 0x1e3a8a,
        roughness: 0.22,
        transparent: true,
        opacity: 0.88,
        emissive: 0x3b82f6,
        emissiveIntensity: 0.65
      });
      const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
      nucleusMesh.position.set(0.0, -0.05, 0.0);
      neuronGroup.add(nucleusMesh);

      const nucleolusGeo = new THREE.SphereGeometry(0.24, 24, 20);
      const nucleolusMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
      const nucleolusMesh = new THREE.Mesh(nucleolusGeo, nucleolusMat);
      nucleolusMesh.position.set(0.05, -0.02, 0.04);
      neuronGroup.add(nucleolusMesh);

      // 2. ÁRVORE DENDRÍTICA CONTÍNUA AFINADA PELA LEI DE RALL
      const dendriteMat = new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        roughness: 0.24,
        transmission: 0.45,
        transparent: true,
        opacity: 0.95,
        clearcoat: 0.65,
        emissive: 0x0369a1,
        emissiveIntensity: 0.42
      });

      const spinesGroup = new THREE.Group();
      spinesGroup.name = "Dendritic_Spines";
      const spineStalkMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.5
      });
      const spineHeadMat = new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        roughness: 0.2,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.85
      });

      function addMushroomSpinesAlongCurve(curve, count, baseRadius) {
        const frames = curve.computeFrenetFrames(count + 2, false);
        for (let s = 1; s <= count; s++) {
          const u = s / (count + 1);
          const pt = curve.getPointAt(u);
          const N = frames.normals[s];
          const B = frames.binormals[s];
          const angle = (s * 2.39996) % (Math.PI * 2); // Ângulo áureo para distribuição biológica
          const dir = new THREE.Vector3(
            Math.cos(angle) * N.x + Math.sin(angle) * B.x,
            Math.cos(angle) * N.y + Math.sin(angle) * B.y,
            Math.cos(angle) * N.z + Math.sin(angle) * B.z
          ).normalize();

          const localR = baseRadius * (1.0 - u * 0.45);
          const stalkStart = pt.clone().add(dir.clone().multiplyScalar(localR * 0.85));
          const stalkEnd = pt.clone().add(dir.clone().multiplyScalar(localR + 0.22));

          const stalkCurve = new THREE.LineCurve3(stalkStart, stalkEnd);
          const stalkGeo = new THREE.TubeGeometry(stalkCurve, 3, 0.016, 5, false);
          spinesGroup.add(new THREE.Mesh(stalkGeo, spineStalkMat));

          const headGeo = new THREE.SphereGeometry(0.052, 8, 8);
          const headMesh = new THREE.Mesh(headGeo, spineHeadMat);
          headMesh.position.copy(stalkEnd);
          spinesGroup.add(headMesh);
        }
      }

      // Tronco Apical Principal (emerge suavemente do ápice do soma em y = 1.95 até a Camada I em y = 14.5)
      const apicalCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.0, 1.85, 0.0),
        new THREE.Vector3(0.14, 4.8, 0.10),
        new THREE.Vector3(-0.12, 8.2, -0.08),
        new THREE.Vector3(0.16, 11.4, 0.12),
        new THREE.Vector3(0.0, 14.2, 0.0)
      ]);
      const apicalGeo = createTaperedBranchGeometry(apicalCurve, 0.28, 0.11, 44, 14, false);
      neuronGroup.add(new THREE.Mesh(apicalGeo, dendriteMat));
      addMushroomSpinesAlongCurve(apicalCurve, 55, 0.22);

      // Dendritos Oblíquos e Tufo Apical (Camadas II/III e I) com afinamento até 0.018
      const apicalBranches = [
        { u: 0.24, mid: [1.6, 5.4, 0.6], end: [3.2, 6.8, 1.2], r0: 0.13, r1: 0.035 },
        { u: 0.28, mid: [-1.5, 5.8, -0.5], end: [-3.0, 7.2, -1.1], r0: 0.13, r1: 0.035 },
        { u: 0.52, mid: [1.8, 9.2, -0.7], end: [3.5, 11.0, -1.4], r0: 0.11, r1: 0.030 },
        { u: 0.56, mid: [-1.7, 9.6, 0.8], end: [-3.3, 11.4, 1.5], r0: 0.11, r1: 0.030 },
        { u: 0.82, mid: [1.5, 13.0, 0.9], end: [3.4, 15.2, 1.8], r0: 0.095, r1: 0.024 },
        { u: 0.85, mid: [-1.4, 13.2, -0.8], end: [-3.2, 15.5, -1.6], r0: 0.095, r1: 0.024 },
        { u: 0.98, mid: [1.2, 15.4, -0.6], end: [2.6, 17.0, -1.3], r0: 0.085, r1: 0.020 },
        { u: 0.98, mid: [-1.1, 15.5, 0.7], end: [-2.5, 17.2, 1.4], r0: 0.085, r1: 0.020 }
      ];

      apicalBranches.forEach((br, idx) => {
        const startPt = apicalCurve.getPointAt(br.u);
        const midPt = new THREE.Vector3(br.mid[0], br.mid[1], br.mid[2]);
        const endPt = new THREE.Vector3(br.end[0], br.end[1], br.end[2]);
        const bCurve = new THREE.CatmullRomCurve3([startPt, startPt.clone().lerp(midPt, 0.5), midPt, midPt.clone().lerp(endPt, 0.5), endPt]);
        neuronGroup.add(new THREE.Mesh(createTaperedBranchGeometry(bCurve, br.r0, br.r1, 22, 10, false), dendriteMat));
        addMushroomSpinesAlongCurve(bCurve, 14, br.r0);

        // Ramificações Terciárias finas
        const sub1 = endPt.clone().add(new THREE.Vector3((idx % 2 === 0 ? 1.4 : -1.4), 1.6, 0.8));
        const sub2 = endPt.clone().add(new THREE.Vector3((idx % 2 === 0 ? 0.8 : -0.8), 1.8, -0.9));
        [sub1, sub2].forEach(sEnd => {
          const sMid = endPt.clone().lerp(sEnd, 0.5).add(new THREE.Vector3(0, 0.35, 0));
          const sCurve = new THREE.CatmullRomCurve3([endPt, sMid, sEnd]);
          neuronGroup.add(new THREE.Mesh(createTaperedBranchGeometry(sCurve, br.r1, 0.012, 14, 8, false), dendriteMat));
        });
      });

      // 5 Árvores Dendríticas Basais irradiando da saia basal do soma piramidal
      for (let b = 0; b < 5; b++) {
        const angle = (b / 5) * Math.PI * 2 + 0.3;
        const bStart = new THREE.Vector3(Math.cos(angle) * 1.05, -0.85, Math.sin(angle) * 1.05);
        const bMid = new THREE.Vector3(Math.cos(angle) * 2.8, -2.1, Math.sin(angle) * 2.8);
        const bEnd = new THREE.Vector3(Math.cos(angle) * 4.8, -3.6, Math.sin(angle) * 4.8);
        const bCurve = new THREE.CatmullRomCurve3([bStart, bMid, bEnd]);
        neuronGroup.add(new THREE.Mesh(createTaperedBranchGeometry(bCurve, 0.16, 0.04, 20, 10, false), dendriteMat));
        addMushroomSpinesAlongCurve(bCurve, 12, 0.12);

        [-0.45, 0.45].forEach(deltaAng => {
          const subAng = angle + deltaAng;
          const subEnd = bEnd.clone().add(new THREE.Vector3(Math.cos(subAng) * 2.2, -1.4, Math.sin(subAng) * 2.2));
          const subCurve = new THREE.CatmullRomCurve3([bEnd, bEnd.clone().lerp(subEnd, 0.5), subEnd]);
          neuronGroup.add(new THREE.Mesh(createTaperedBranchGeometry(subCurve, 0.04, 0.012, 12, 8, false), dendriteMat));
        });
      }

      neuronGroup.add(spinesGroup);

      // 3. AXÔNIO MIELINIZADO E NÓDULOS DE RANVIER BIOLUMINESCENTES
      const axonCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.0, -1.45, 0.0),
        new THREE.Vector3(0.12, -3.4, 0.08),
        new THREE.Vector3(-0.16, -6.5, -0.12),
        new THREE.Vector3(0.20, -10.2, 0.14),
        new THREE.Vector3(-0.12, -14.2, -0.08),
        new THREE.Vector3(0.16, -18.0, 0.10),
        new THREE.Vector3(0.0, -21.5, 0.0)
      ]);

      const axonCoreGeo = createTaperedBranchGeometry(axonCurve, 0.14, 0.075, 64, 10, false);
      const axonCoreMat = new THREE.MeshStandardMaterial({
        color: 0x00f2fe,
        roughness: 0.20,
        emissive: 0x0284c7,
        emissiveIntensity: 0.75
      });
      neuronGroup.add(new THREE.Mesh(axonCoreGeo, axonCoreMat));

      const internodeCount = 6;
      const myelinSheaths = [];
      const ranvierNodes = [];

      const myelinMat = new THREE.MeshPhysicalMaterial({
        color: 0xe0f2fe,
        roughness: 0.18,
        transmission: 0.68,
        opacity: 0.86,
        transparent: true,
        ior: 1.44,
        clearcoat: 0.85,
        emissive: 0x0369a1,
        emissiveIntensity: 0.22
      });

      const ranvierMat = new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        roughness: 0.12,
        emissive: 0x00f2fe,
        emissiveIntensity: 1.6
      });

      for (let m = 0; m < internodeCount; m++) {
        const uStart = 0.10 + m * 0.135;
        const uEnd = uStart + 0.108;
        const uRanvier = uEnd + 0.0135;

        const subPts = [];
        for (let k = 0; k <= 6; k++) {
          subPts.push(axonCurve.getPointAt(uStart + (k / 6) * (uEnd - uStart)));
        }
        const subCurve = new THREE.CatmullRomCurve3(subPts);
        const mGeo = createTaperedBranchGeometry(subCurve, 0.28, 0.28, 20, 14, true);
        const mMesh = new THREE.Mesh(mGeo, myelinMat.clone());
        mMesh.name = `Myelin_Internode_${m}`;
        neuronGroup.add(mMesh);
        myelinSheaths.push(mMesh);

        if (m < internodeCount - 1 && uRanvier < 0.96) {
          const rPt = axonCurve.getPointAt(uRanvier);
          const rGeo = new THREE.SphereGeometry(0.14, 16, 14);
          rGeo.scale(1.0, 0.65, 1.0);
          const rMesh = new THREE.Mesh(rGeo, ranvierMat.clone());
          rMesh.position.copy(rPt);
          neuronGroup.add(rMesh);
          ranvierNodes.push(rMesh);
        }
      }

      // Arborização Telodendrial e Botões Sinápticos Terminais
      const termOrigin = axonCurve.getPointAt(1.0);
      const boutonMat = new THREE.MeshStandardMaterial({
        color: 0x34d399,
        roughness: 0.22,
        emissive: 0x10b981,
        emissiveIntensity: 0.75
      });
      for (let t = 0; t < 4; t++) {
        const ang = (t / 4) * Math.PI * 2;
        const tEnd = termOrigin.clone().add(new THREE.Vector3(Math.cos(ang) * 1.1, -1.2, Math.sin(ang) * 1.1));
        const tCurve = new THREE.CatmullRomCurve3([
          termOrigin,
          termOrigin.clone().lerp(tEnd, 0.5).add(new THREE.Vector3(0, -0.2, 0)),
          tEnd
        ]);
        neuronGroup.add(new THREE.Mesh(createTaperedBranchGeometry(tCurve, 0.07, 0.025, 10, 8, false), axonCoreMat));
        const bMesh = new THREE.Mesh(new THREE.SphereGeometry(0.18, 14, 12), boutonMat);
        bMesh.scale.set(1.2, 0.85, 1.2);
        bMesh.position.copy(tEnd);
        neuronGroup.add(bMesh);
      }

      const prpcGroup = new THREE.Group();
      const prpscGroup = new THREE.Group();
      prpscGroup.visible = false;
      neuronGroup.add(prpcGroup);
      neuronGroup.add(prpscGroup);

      return {
        group: neuronGroup,
        axonCurve,
        myelinSheaths,
        ranvierNodes,
        spinesGroup,
        somaMesh,
        prpcGroup,
        prpscGroup
      };
    }
  }

  // ==========================================================================
  // 4. SISTEMA GLIAL ORGÂNICO (ASTRÓCITOS, OLIGODENDRÓCITOS, MICRÓGLIA, EPÊNDIMA)
  // ==========================================================================
  class GliaSystemBuilder {
    static buildAllGliaTypes() {
      const gliaGroup = new THREE.Group();
      const gliaCollections = {
        ASTROCYTE: new THREE.Group(),
        OLIGODENDROCYTE: new THREE.Group(),
        MICROGLIA: new THREE.Group(),
        EPENDYMAL: new THREE.Group()
      };
      gliaCollections.EPENDYMAL.visible = false;

      // Capilar Sanguíneo Barreira Hematoencefálica (BHE)
      const capCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-8.5, 6.5, -4.2),
        new THREE.Vector3(-4.2, 3.0, -3.5),
        new THREE.Vector3(0.0, 0.2, -3.2),
        new THREE.Vector3(4.5, -3.8, -3.8),
        new THREE.Vector3(8.8, -7.5, -4.5)
      ]);
      const capMat = new THREE.MeshPhysicalMaterial({
        color: 0xe11d48,
        roughness: 0.20,
        transmission: 0.62,
        opacity: 0.82,
        transparent: true,
        emissive: 0x881337,
        emissiveIntensity: 0.35
      });
      gliaCollections.ASTROCYTE.add(new THREE.Mesh(new THREE.TubeGeometry(capCurve, 36, 0.34, 12, false), capMat));

      // Astrócitos Estrelados Finos
      const astroMat = new THREE.MeshStandardMaterial({
        color: 0x34d399,
        roughness: 0.28,
        transparent: true,
        opacity: 0.85,
        emissive: 0x059669,
        emissiveIntensity: 0.40
      });
      for (let a = 0; a < 4; a++) {
        const cell = new THREE.Group();
        cell.add(new THREE.Mesh(new THREE.SphereGeometry(0.38, 18, 16), astroMat));
        for (let p = 0; p < 8; p++) {
          const phi = Math.acos(2 * ((p * 0.618) % 1) - 1);
          const theta = p * 2.4;
          const endPt = new THREE.Vector3(Math.sin(phi) * Math.cos(theta) * 2.2, Math.sin(phi) * Math.sin(theta) * 2.2, Math.cos(phi) * 2.2);
          const c = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), endPt.clone().multiplyScalar(0.5), endPt]);
          cell.add(new THREE.Mesh(createTaperedBranchGeometry(c, 0.055, 0.012, 10, 6, false), astroMat));
        }
        cell.position.set(-4.8 + a * 3.2, 2.2 - a * 1.8, -2.8);
        gliaCollections.ASTROCYTE.add(cell);
      }

      // Oligodendrócitos Mielinizantes
      const oligoMat = new THREE.MeshStandardMaterial({
        color: 0x818cf8,
        roughness: 0.28,
        emissive: 0x4f46e5,
        emissiveIntensity: 0.45
      });
      for (let o = 0; o < 3; o++) {
        const cell = new THREE.Group();
        cell.add(new THREE.Mesh(new THREE.SphereGeometry(0.34, 16, 14), oligoMat));
        const pos = new THREE.Vector3(2.8, -4.2 - o * 4.2, 1.4);
        cell.position.copy(pos);
        for (let pr = 0; pr < 3; pr++) {
          const targetAxon = new THREE.Vector3(-pos.x, -0.8 + pr * 0.9, -pos.z);
          const c = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), targetAxon.clone().multiplyScalar(0.5), targetAxon]);
          cell.add(new THREE.Mesh(createTaperedBranchGeometry(c, 0.045, 0.018, 10, 6, false), oligoMat));
        }
        gliaCollections.OLIGODENDROCYTE.add(cell);
      }

      // Micróglia Sentinela
      const microMat = new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        roughness: 0.32,
        emissive: 0xd97706,
        emissiveIntensity: 0.42
      });
      for (let m = 0; m < 4; m++) {
        const cell = new THREE.Group();
        cell.add(new THREE.Mesh(new THREE.SphereGeometry(0.24, 14, 12), microMat));
        for (let b = 0; b < 6; b++) {
          const ang = (b / 6) * Math.PI * 2;
          const endPt = new THREE.Vector3(Math.cos(ang) * 1.4, (b % 2 === 0 ? 0.8 : -0.8), Math.sin(ang) * 1.4);
          const c = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), endPt.clone().multiplyScalar(0.5), endPt]);
          cell.add(new THREE.Mesh(createTaperedBranchGeometry(c, 0.032, 0.008, 8, 5, false), microMat));
        }
        cell.position.set((m % 2 === 0 ? -3.6 : 3.6), -1.5 + m * 2.5, 2.2);
        gliaCollections.MICROGLIA.add(cell);
      }

      gliaGroup.add(gliaCollections.ASTROCYTE);
      gliaGroup.add(gliaCollections.OLIGODENDROCYTE);
      gliaGroup.add(gliaCollections.MICROGLIA);
      gliaGroup.add(gliaCollections.EPENDYMAL);

      return {
        group: gliaGroup,
        collections: gliaCollections,
        ciliaList: []
      };
    }
  }

  // ==========================================================================
  // 5. CLASSE PRINCIPAL DO MICROCOSMO NEURAL 3D
  // ==========================================================================
  class NeuralMicrocosmos3D {
    constructor(scene) {
      this.scene = scene;
      this.masterGroup = new THREE.Group();
      this.masterGroup.name = "NEURAL_MICROCOSMOS_BIOLOGICAL_MASTER";
      // Inicia estritamente oculto para que o Mozok sempre abra no Cérebro Macro
      this.masterGroup.visible = false;
      this.scene.add(this.masterGroup);

      this.hhSimulator = new HodgkinHuxleyModel();
      this.heroNeuron = null;
      this.gliaSystem = null;
      this.synapticVesicles = [];
      this.elapsedTime = 0.0;
      this.currentPathology = 'NORMAL';
      this.pulseProgress = 0.0;

      this.gliaVisibility = {
        ASTROCYTE: true,
        OLIGODENDROCYTE: true,
        MICROGLIA: true,
        EPENDYMAL: false
      };

      this.initBiologicalMicrocosm();
    }

    applyLOD(config) {
      if (!config || !this.neighborNeurons) return;
      const targetCount = Math.min(12, config.swcNeuronCount || 10);
      this.neighborNeurons.forEach((n, idx) => {
        n.group.visible = (idx < targetCount);
      });
    }

    initBiologicalMicrocosm() {
      this.heroNeuron = BiologicalNeuronBuilder.createHeroPyramidalNeuron(1);
      this.masterGroup.add(this.heroNeuron.group);

      this.gliaSystem = GliaSystemBuilder.buildAllGliaTypes();
      this.masterGroup.add(this.gliaSystem.group);

      this.initConnectomeBackground();
      this.initSaltatoryConduction();
      this.initSynapticCleftVesicles();
    }

    initConnectomeBackground() {
      this.neighborNeuronsGroup = new THREE.Group();
      this.neighborNeurons = [];

      const bgMat = new THREE.MeshPhysicalMaterial({
        color: 0x0284c7,
        roughness: 0.30,
        transmission: 0.65,
        opacity: 0.48,
        transparent: true,
        emissive: 0x0369a1,
        emissiveIntensity: 0.25
      });

      // 12 neurônios piramidais esbeltos ao fundo formando a minicoluna cortical sem poluir o neurônio principal
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const rad = 7.5 + (i % 3) * 3.2;
        const y = -6.0 + (i % 4) * 3.5;

        const nGroup = new THREE.Group();
        nGroup.position.set(Math.cos(angle) * rad, y, Math.sin(angle) * rad - 3.5);

        const sGeo = new THREE.ConeGeometry(0.65, 1.5, 16);
        nGroup.add(new THREE.Mesh(sGeo, bgMat));

        const apCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 0.7, 0),
          new THREE.Vector3(0.15, 4.5, 0),
          new THREE.Vector3(0, 9.0, 0)
        ]);
        nGroup.add(new THREE.Mesh(createTaperedBranchGeometry(apCurve, 0.12, 0.03, 14, 8, false), bgMat));

        const axCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, -0.7, 0),
          new THREE.Vector3(-0.1, -5.0, 0),
          new THREE.Vector3(0, -10.0, 0)
        ]);
        nGroup.add(new THREE.Mesh(createTaperedBranchGeometry(axCurve, 0.06, 0.025, 12, 6, false), bgMat));

        this.neighborNeuronsGroup.add(nGroup);
        this.neighborNeurons.push({ group: nGroup, pos: nGroup.position.clone() });
      }
      this.masterGroup.add(this.neighborNeuronsGroup);

      // 120 Micropartículas de Íons Extracelulares Suaves
      this.extracellularParticlesGroup = new THREE.Group();
      this.extracellularParticles = [];
      const epGeo = new THREE.SphereGeometry(0.038, 6, 6);
      const epMatCyan = new THREE.MeshBasicMaterial({ color: 0x00f2fe, transparent: true, opacity: 0.65 });
      const epMatAmber = new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.65 });

      for (let p = 0; p < 120; p++) {
        const pMesh = new THREE.Mesh(epGeo, p % 2 === 0 ? epMatCyan : epMatAmber);
        const rad = 2.2 + Math.random() * 11.0;
        const theta = Math.random() * Math.PI * 2;
        const y = (Math.random() - 0.5) * 24.0;
        pMesh.position.set(Math.cos(theta) * rad, y, Math.sin(theta) * rad);
        this.extracellularParticlesGroup.add(pMesh);
        this.extracellularParticles.push({
          mesh: pMesh,
          basePos: pMesh.position.clone(),
          speed: 0.35 + Math.random() * 0.55,
          phase: Math.random() * Math.PI * 2
        });
      }
      this.masterGroup.add(this.extracellularParticlesGroup);

      // 12 Pontes Sinápticas Conectando a Minicoluna
      this.synapseCircuitsGroup = new THREE.Group();
      this.synapses = [];
      for (let s = 0; s < 12; s++) {
        const startPt = new THREE.Vector3(0, -19.5, 0);
        const targetNeuron = this.neighborNeurons[s % this.neighborNeurons.length];
        const endPt = targetNeuron.pos.clone();
        const midPt = startPt.clone().lerp(endPt, 0.5).add(new THREE.Vector3(0, 2.0, 0));
        const curve = new THREE.CatmullRomCurve3([startPt, midPt, endPt]);
        const synMesh = new THREE.Mesh(
          createTaperedBranchGeometry(curve, 0.028, 0.012, 14, 6, false),
          new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.32 })
        );
        this.synapseCircuitsGroup.add(synMesh);
        this.synapses.push({ curve, startPt, endPt });
      }
      this.masterGroup.add(this.synapseCircuitsGroup);
    }

    initSaltatoryConduction() {
      const pulseGeo = new THREE.SphereGeometry(0.26, 16, 16);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: 0xfbbf24,
        transparent: true,
        opacity: 0.95
      });
      this.saltatoryPulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
      this.masterGroup.add(this.saltatoryPulseMesh);
    }

    initSynapticCleftVesicles() {
      this.synapticVesiclesGroup = new THREE.Group();
      this.synapticVesicles = [];
      const pGeo = new THREE.SphereGeometry(0.05, 6, 6);

      for (let i = 0; i < 72; i++) {
        const syn = this.synapses[i % this.synapses.length];
        const colorHex = (i % 2 === 0) ? 0xfbbf24 : 0x00f2fe;
        const mesh = new THREE.Mesh(pGeo, new THREE.MeshBasicMaterial({ color: colorHex }));
        this.synapticVesiclesGroup.add(mesh);
        this.synapticVesicles.push({
          mesh,
          syn,
          u: Math.random(),
          speed: 0.22 + (i % 5) * 0.06
        });
      }
      this.masterGroup.add(this.synapticVesiclesGroup);
    }

    triggerActionPotential(stimulusStrength = 22.0) {
      this.hhSimulator.triggerStimulus(stimulusStrength);
      this.pulseProgress = 0.05;
    }

    setGliaVisibility(type, isVisible) {
      if (this.gliaVisibility[type] !== undefined) {
        this.gliaVisibility[type] = !!isVisible;
        if (this.gliaSystem && this.gliaSystem.collections[type]) {
          this.gliaSystem.collections[type].visible = this.gliaVisibility[type];
        }
      }
    }

    applyPathologyMode(pathologyKey) {
      this.currentPathology = (pathologyKey || 'NORMAL').toUpperCase();
      if (!this.heroNeuron) return;

      if (this.currentPathology === 'MS') {
        this.heroNeuron.myelinSheaths.forEach(m => {
          m.scale.set(0.45, 0.6, 0.45);
          m.material.color.setHex(0xe11d48);
          m.material.opacity = 0.40;
        });
      } else if (this.currentPathology === 'ALZHEIMER') {
        if (this.heroNeuron.spinesGroup) this.heroNeuron.spinesGroup.scale.setScalar(0.45);
        this.heroNeuron.somaMesh.material.color.setHex(0x64748b);
      } else if (this.currentPathology === 'STROKE') {
        this.heroNeuron.somaMesh.scale.setScalar(1.25);
        this.heroNeuron.somaMesh.material.color.setHex(0xef4444);
      } else {
        this.heroNeuron.myelinSheaths.forEach(m => {
          m.scale.set(1.0, 1.0, 1.0);
          m.material.color.setHex(0xe0f2fe);
          m.material.opacity = 0.86;
        });
        if (this.heroNeuron.spinesGroup) this.heroNeuron.spinesGroup.scale.setScalar(1.0);
        this.heroNeuron.somaMesh.scale.setScalar(1.0);
        this.heroNeuron.somaMesh.material.color.setHex(0x38bdf8);
      }
    }

    update(dt) {
      if (!this.masterGroup.visible) return;
      this.elapsedTime += dt;

      const dtMs = dt * 1000.0 * 0.05;
      const vm = this.hhSimulator.step(dtMs);

      const fireInterval = (this.currentPathology === 'EPILEPSY') ? 0.12 : 0.65;
      if (Math.sin(this.elapsedTime * (Math.PI * 2 / fireInterval)) > 0.985) {
        this.hhSimulator.triggerStimulus(18.0);
      }

      // Propagação contínua da onda de potencial de ação ao longo da curva axonal e Nódulos de Ranvier
      if (this.heroNeuron && this.heroNeuron.axonCurve) {
        const speed = (this.currentPathology === 'MS') ? 0.25 : 0.85;
        this.pulseProgress = (this.pulseProgress + dt * speed) % 1.0;
        const pulsePt = this.heroNeuron.axonCurve.getPointAt(this.pulseProgress);
        if (this.saltatoryPulseMesh) {
          this.saltatoryPulseMesh.position.copy(pulsePt);
          const scalePulse = 1.0 + Math.max(0, (vm + 65.0) / 85.0) * 0.65;
          this.saltatoryPulseMesh.scale.setScalar(scalePulse);
        }

        this.heroNeuron.ranvierNodes.forEach((node) => {
          const d = node.position.distanceTo(pulsePt);
          const glow = d < 1.8 ? (2.4 - d) : 1.0;
          node.scale.setScalar(1.0 + (glow - 1.0) * 0.35);
          if (node.material) node.material.emissiveIntensity = glow;
        });
      }

      this.synapticVesicles.forEach(v => {
        v.u = (v.u + v.speed * dt) % 1.0;
        if (v.syn && v.syn.curve) {
          v.mesh.position.copy(v.syn.curve.getPointAt(v.u));
        }
      });

      this.extracellularParticles.forEach(ep => {
        const t = this.elapsedTime * ep.speed + ep.phase;
        ep.mesh.position.x = ep.basePos.x + Math.sin(t) * 0.25;
        ep.mesh.position.y = ep.basePos.y + Math.cos(t * 0.8) * 0.30;
      });
    }

    setVisible(isVisible) {
      this.masterGroup.visible = !!isVisible;
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
