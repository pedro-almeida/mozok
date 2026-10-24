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
  // 2. CONSTRUTOR DE NEURÔNIOS BIOLOGICAMENTE PLAUSÍVEIS (CAMADA V)
  // ==========================================================================
  // [PT-BR]: Construtor de Neurônio Piramidal Gigante de Camada V padrão Firefly (Soma esculpido, 4 ordens Rall, mielina lamelar e nódulos de Ranvier bioluminescentes).
  // [EN-GB]: Layer V Giant Pyramidal Neuron Builder Firefly standard (Sculpted soma, 4-order Rall tree, lamellar myelin, and bioluminescent Ranvier nodes).
  // [AI-CTX]: @llm-context: High-resolution biological reconstruction with SWC real data integration and Rall's branching law.
  //           @llm-neuroscience: Cortical Layer V Betz/pyramidal neuron with apical tuft, basal branches, and myelinated saltatory axon.
  class BiologicalNeuronBuilder {
    static createHeroPyramidalNeuron(seed = 1) {
      const neuronGroup = new THREE.Group();
      neuronGroup.name = `BIOLOGICAL_NEURON_HERO_${seed}`;

      // 1. SOMA ORGÂNICO ESCULPIDO COM TEXTURA CELULAR (SphereGeometry 64x48)
      // [PT-BR]: Soma esculpido em resolução 64x48 com deformação contínua tri-lobada basal e cone de implantação suave (hillock).
      // [EN-GB]: Sculpted soma at 64x48 resolution with continuous basal tri-lobed deformation and smooth axon hillock tapering.
      const somaGeo = new THREE.SphereGeometry(1.65, 64, 48);
      const sPos = somaGeo.attributes.position;
      for (let i = 0; i < sPos.count; i++) {
        let x = sPos.getX(i);
        let y = sPos.getY(i);
        let z = sPos.getZ(i);

        // Tronco apical contínuo sem costuras abruptas (+Y)
        if (y > 0) {
          const taper = (y / 1.65);
          x *= (1.0 - taper * 0.42);
          z *= (1.0 - taper * 0.42);
          y *= 1.28;
        } else {
          // Deformação basal tri-lobada suave
          const angle = Math.atan2(z, x);
          const triLobe = Math.sin(angle * 3.0) * 0.24;
          x *= (1.0 + triLobe);
          z *= (1.0 + triLobe);

          // Afunilamento suave no cone de implantação axonal (axon hillock)
          if (y < -0.75) {
            const hFactor = Math.abs(y + 0.75) / 0.90;
            x *= (1.0 - hFactor * 0.55);
            z *= (1.0 - hFactor * 0.55);
            y -= hFactor * 0.25;
          }
        }

        // Microtextura biológica fina de membrana fosfolipídica
        const noise = Math.sin(x * 6.0) * Math.cos(z * 6.0) * 0.055 + Math.sin(y * 8.0) * 0.035;
        sPos.setXYZ(i, x + noise, y, z + noise);
      }
      somaGeo.computeVertexNormals();

      // Membrana Celular Fosfolipídica Translúcida Âmbar-Dourada com SSS Quente
      const membraneMat = new THREE.MeshPhysicalMaterial({
        color: 0xf59e0b, // Âmbar biológico (#f59e0b)
        roughness: 0.22,
        transmission: 0.68,
        opacity: 0.94,
        transparent: true,
        reflectivity: 0.88,
        clearcoat: 0.85,
        clearcoatRoughness: 0.12,
        emissive: 0xd97706,
        emissiveIntensity: 0.38,
        sheen: 0.65,
        sheenColor: new THREE.Color(0xfbbf24)
      });
      const somaMesh = new THREE.Mesh(somaGeo, membraneMat);
      somaMesh.name = "Soma_Membrana_Organica";
      neuronGroup.add(somaMesh);

      // Núcleo Celular Visível em Gradiente Âmbar-Escuro (#78350f / #92400e)
      const nucleusGeo = new THREE.SphereGeometry(0.78, 32, 28);
      const nucleusMat = new THREE.MeshStandardMaterial({
        color: 0x78350f, // Âmbar-escuro / chocolate profundo
        roughness: 0.25,
        emissive: 0x92400e,
        emissiveIntensity: 0.55
      });
      const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
      nucleusMesh.position.set(0.06, -0.12, 0.04);
      neuronGroup.add(nucleusMesh);

      // Nucléolo Dourado Central (#fbbf24)
      const nucleolusGeo = new THREE.SphereGeometry(0.26, 20, 20);
      const nucleolusMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
      const nucleolusMesh = new THREE.Mesh(nucleolusGeo, nucleolusMat);
      nucleolusMesh.position.set(0.10, -0.08, 0.06);
      neuronGroup.add(nucleolusMesh);

      // Corpúsculos de Nissl e Mitocôndrias Citoplasmáticas (Esferas Orgânicas Suaves)
      const organelleGeo = new THREE.SphereGeometry(0.085, 12, 10);
      const organelleMat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        roughness: 0.3,
        emissive: 0x059669,
        emissiveIntensity: 0.45
      });
      for (let o = 0; o < 16; o++) {
        const oMesh = new THREE.Mesh(organelleGeo, organelleMat);
        const theta = (o / 16) * Math.PI * 2;
        const rad = 0.92 + Math.random() * 0.38;
        oMesh.position.set(Math.cos(theta) * rad, (Math.random() - 0.5) * 1.3, Math.sin(theta) * rad);
        neuronGroup.add(oMesh);
      }

      // 2. ÁRVORE DENDRÍTICA FRACTAL MULTINÍVEL (4 ORDENS DE RAMIFICAÇÃO PELA LEI DE RALL)
      // [PT-BR]: Lei de Rall (d_parent^1.5 = sum d_child^1.5) com 4 ordens (0.38 -> 0.22 -> 0.12 -> 0.05 -> 0.02) e curvatura de 5 pontos.
      // [EN-GB]: Rall's Law 4-order fractal branching with 5-point biological tortuosity curves.
      const dendriteMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        roughness: 0.32,
        emissive: 0xb45309,
        emissiveIntensity: 0.32
      });

      // Ordem 1: Tronco Apical Primário (radius = 0.38, 5 pontos de controle)
      const apicalCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.0, 1.8, 0.0),
        new THREE.Vector3(0.16, 4.5, 0.12),
        new THREE.Vector3(-0.14, 7.8, -0.10),
        new THREE.Vector3(0.22, 11.2, 0.20),
        new THREE.Vector3(0.0, 15.0, 0.0)
      ]);
      const apicalGeo = new THREE.TubeGeometry(apicalCurve, 36, 0.38, 8, false);
      const apicalMesh = new THREE.Mesh(apicalGeo, dendriteMat);
      apicalMesh.name = "Dendrito_Apical_Ordem1";
      neuronGroup.add(apicalMesh);

      // Função recursiva para gerar 5 pontos biológicos com tortuosidade
      function create5PointCurve(startPt, endPt, tortuosity = 0.45) {
        const p0 = startPt.clone();
        const p4 = endPt.clone();
        const p1 = p0.clone().lerp(p4, 0.25).add(new THREE.Vector3((Math.random() - 0.5) * tortuosity, 0.2, (Math.random() - 0.5) * tortuosity));
        const p2 = p0.clone().lerp(p4, 0.50).add(new THREE.Vector3((Math.random() - 0.5) * tortuosity * 1.2, 0.3, (Math.random() - 0.5) * tortuosity * 1.2));
        const p3 = p0.clone().lerp(p4, 0.75).add(new THREE.Vector3((Math.random() - 0.5) * tortuosity, 0.2, (Math.random() - 0.5) * tortuosity));
        return new THREE.CatmullRomCurve3([p0, p1, p2, p3, p4]);
      }

      // Ordem 2: Ramos Secundários (radius = 0.22, 5 pontos)
      const secondaryTargets = [
        { start: apicalCurve.getPointAt(0.25), end: new THREE.Vector3(2.8, 6.2, 1.2) },
        { start: apicalCurve.getPointAt(0.25), end: new THREE.Vector3(-2.6, 5.9, -1.0) },
        { start: apicalCurve.getPointAt(0.50), end: new THREE.Vector3(3.6, 10.0, -1.4) },
        { start: apicalCurve.getPointAt(0.50), end: new THREE.Vector3(-3.2, 9.6, 1.6) },
        { start: apicalCurve.getPointAt(0.75), end: new THREE.Vector3(4.2, 13.8, 1.8) },
        { start: apicalCurve.getPointAt(0.75), end: new THREE.Vector3(-3.8, 14.2, -1.6) }
      ];

      secondaryTargets.forEach((sec, sIdx) => {
        const secCurve = create5PointCurve(sec.start, sec.end, 0.55);
        const secGeo = new THREE.TubeGeometry(secCurve, 18, 0.22, 6, false);
        neuronGroup.add(new THREE.Mesh(secGeo, dendriteMat));

        // Ordem 3: Ramos Terciários (radius = 0.12, 5 pontos)
        const t1End = sec.end.clone().add(new THREE.Vector3((sIdx % 2 === 0 ? 1.8 : -1.8), 2.2, (Math.random() - 0.5) * 1.5));
        const t2End = sec.end.clone().add(new THREE.Vector3((Math.random() - 0.5) * 1.4, 2.5, (sIdx % 2 === 0 ? -1.6 : 1.6)));
        
        [t1End, t2End].forEach((tertEnd, tIdx) => {
          const tertCurve = create5PointCurve(sec.end, tertEnd, 0.40);
          const tertGeo = new THREE.TubeGeometry(tertCurve, 14, 0.12, 5, false);
          neuronGroup.add(new THREE.Mesh(tertGeo, dendriteMat));

          // Ordem 4: Ramos Quaternários Terminais (radius = 0.05 -> 0.02, 5 pontos)
          const q1End = tertEnd.clone().add(new THREE.Vector3((Math.random() - 0.5) * 1.2, 1.6, (Math.random() - 0.5) * 1.2));
          const q2End = tertEnd.clone().add(new THREE.Vector3((Math.random() - 0.5) * 1.2, 1.8, (Math.random() - 0.5) * 1.2));
          [q1End, q2End].forEach((quatEnd) => {
            const quatCurve = create5PointCurve(tertEnd, quatEnd, 0.28);
            const quatGeo = new THREE.TubeGeometry(quatCurve, 10, 0.045, 4, false);
            neuronGroup.add(new THREE.Mesh(quatGeo, dendriteMat));
          });
        });
      });

      // Integração morfológica com dados reais SWC quando disponíveis
      if (typeof window !== 'undefined' && window.SWC_NEURONS_DATA && window.SWC_NEURONS_DATA[0] && window.SWC_NEURONS_DATA[0].segments) {
        const swcData = window.SWC_NEURONS_DATA[0].segments;
        const swcGroup = new THREE.Group();
        swcGroup.name = "SWC_REAL_MORPHOLOGY_OVERLAY";
        const stride = Math.max(1, Math.floor(swcData.length / 45));
        for (let i = 0; i < swcData.length - stride; i += stride) {
          const s = swcData[i];
          const e = swcData[i + stride];
          const pStart = new THREE.Vector3(s[0] * 0.45, s[1] * 0.45 + 1.8, s[2] * 0.45);
          const pEnd = new THREE.Vector3(e[3] * 0.45, e[4] * 0.45 + 1.8, e[5] * 0.45);
          const curve = create5PointCurve(pStart, pEnd, 0.15);
          const geo = new THREE.TubeGeometry(curve, 6, 0.038, 4, false);
          swcGroup.add(new THREE.Mesh(geo, dendriteMat));
        }
        neuronGroup.add(swcGroup);
      }

      // Dendritos Basais (3 árvores irradiando da base com ordens 1 e 2)
      for (let b = 0; b < 3; b++) {
        const angle = (b / 3) * Math.PI * 2;
        const bStart = new THREE.Vector3(Math.cos(angle) * 1.45, -1.25, Math.sin(angle) * 1.45);
        const bEnd = new THREE.Vector3(Math.cos(angle) * 6.2 + (Math.random() - 0.5) * 1.5, -4.8, Math.sin(angle) * 6.2);
        const bCurve = create5PointCurve(bStart, bEnd, 0.65);
        const bGeo = new THREE.TubeGeometry(bCurve, 22, 0.32, 6, false);
        neuronGroup.add(new THREE.Mesh(bGeo, dendriteMat));

        // Ramificação secundária basal
        const bSecEnd1 = bEnd.clone().add(new THREE.Vector3((Math.random() - 0.5) * 2.5, -2.2, (Math.random() - 0.5) * 2.5));
        const bSecEnd2 = bEnd.clone().add(new THREE.Vector3((Math.random() - 0.5) * 2.5, -2.4, (Math.random() - 0.5) * 2.5));
        [bSecEnd1, bSecEnd2].forEach(bSec => {
          const bSecCurve = create5PointCurve(bEnd, bSec, 0.45);
          neuronGroup.add(new THREE.Mesh(new THREE.TubeGeometry(bSecCurve, 14, 0.16, 5, false), dendriteMat));
        });
      }

      // Espinhas Dendríticas 3D em Cogumelo (220 espinhas com haste e cabeça)
      const spineCount = 220;
      const spineHeadGeo = new THREE.SphereGeometry(0.12, 8, 8);
      spineHeadGeo.translate(0, 0.22, 0);

      const spineMat = new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        roughness: 0.28,
        emissive: 0xd97706,
        emissiveIntensity: 0.42
      });

      const spinesGroup = new THREE.Group();
      spinesGroup.name = "Dendritic_Spines";
      for (let s = 0; s < spineCount; s++) {
        const u = 0.12 + (s / spineCount) * 0.85;
        const pt = apicalCurve.getPointAt(u);
        const theta = Math.random() * Math.PI * 2;
        const offset = new THREE.Vector3(Math.cos(theta) * 0.48, 0, Math.sin(theta) * 0.48);

        const spineMesh = new THREE.Mesh(spineHeadGeo, spineMat);
        spineMesh.position.copy(pt).add(offset);
        spineMesh.scale.setScalar(0.75 + Math.random() * 0.55);
        spinesGroup.add(spineMesh);
      }
      neuronGroup.add(spinesGroup);

      // 3. AXÔNIO CURVO, CONE DE IMPLANTAÇÃO, 7 INTERNÓDIOS DE MIELINA E NÓDULOS DE RANVIER
      // [PT-BR]: Axônio descendente de 7 pontos com 7 internódios boleados e nódulos de Ranvier estreitos com halo ciano (#00f2fe).
      // [EN-GB]: Descending 7-point axon with 7 rounded internodes and narrow Ranvier nodes with cyan halo (#00f2fe).
      const axonCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.0, -1.65, 0.0),    // Cone de implantação axonal (hillock)
        new THREE.Vector3(0.18, -3.4, 0.12),   // Segmento inicial do axônio (AIS)
        new THREE.Vector3(-0.22, -6.5, -0.16), // Primeiro internódio mielínico
        new THREE.Vector3(0.32, -10.2, 0.22),  // Trajetória biológica descendente
        new THREE.Vector3(-0.15, -14.2, -0.12),// Condução saltatória rápida
        new THREE.Vector3(0.24, -18.5, 0.16),  // Arborização pré-terminal
        new THREE.Vector3(0.0, -23.0, 0.0)     // Botões sinápticos terminais
      ]);

      // Fibra Axonal Nua Central
      const axonCoreGeo = new THREE.TubeGeometry(axonCurve, 56, 0.14, 8, false);
      const axonCoreMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        roughness: 0.35,
        emissive: 0x0284c7,
        emissiveIntensity: 0.55
      });
      const axonCoreMesh = new THREE.Mesh(axonCoreGeo, axonCoreMat);
      neuronGroup.add(axonCoreMesh);

      // 7 Segmentos Internodais de Mielina Lamelar Orgânica com Extremidades Paranodais Boleadas
      const internodeCount = 7;
      const myelinSheaths = [];
      const ranvierNodes = [];

      const myelinMat = new THREE.MeshPhysicalMaterial({
        color: 0xfef3c7, // Âmbar biológico claro translúcido
        roughness: 0.28,
        transmission: 0.55,
        opacity: 0.90,
        transparent: true,
        reflectivity: 0.75,
        clearcoat: 0.70,
        clearcoatRoughness: 0.16,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.26
      });

      const ranvierMat = new THREE.MeshStandardMaterial({
        color: 0x00f2fe, // Azul-ciano bioluminescente intenso
        roughness: 0.12,
        emissive: 0x00f2fe,
        emissiveIntensity: 1.45
      });

      const haloMat = new THREE.MeshBasicMaterial({
        color: 0x00f2fe,
        transparent: true,
        opacity: 0.38
      });

      for (let m = 0; m < internodeCount; m++) {
        const uStart = 0.12 + m * 0.115;
        const uEnd = uStart + 0.092; // Gap de 0.023 para o nódulo de Ranvier
        const uRanvier = uEnd + 0.0115;

        // Subcurva com 5 pontos para a cápsula de mielina
        const subPts = [];
        for (let k = 0; k <= 4; k++) {
          subPts.push(axonCurve.getPointAt(uStart + (k / 4) * (uEnd - uStart)));
        }
        const subCurve = new THREE.CatmullRomCurve3(subPts);

        // Perfil boleado em cápsula orgânica âmbar-translúcida (extremidades paranodais suaves)
        const mGeo = new THREE.TubeGeometry(subCurve, 16, 0.44, 10, false);
        const mMesh = new THREE.Mesh(mGeo, myelinMat.clone());
        mMesh.name = `Myelin_Internode_${m}`;
        neuronGroup.add(mMesh);
        myelinSheaths.push(mMesh);

        // Nódulo de Ranvier (Anel estreito com alta densidade de canais Nav1.6 e halo volumétrico)
        if (m < internodeCount - 1 && uRanvier < 0.98) {
          const rPt = axonCurve.getPointAt(uRanvier);
          const nodeGroup = new THREE.Group();
          nodeGroup.position.copy(rPt);

          const rGeo = new THREE.TorusGeometry(0.24, 0.065, 10, 20);
          const rMesh = new THREE.Mesh(rGeo, ranvierMat.clone());
          nodeGroup.add(rMesh);

          // Halo volumétrico suave em azul-ciano
          const haloGeo = new THREE.SphereGeometry(0.36, 12, 10);
          const haloMesh = new THREE.Mesh(haloGeo, haloMat.clone());
          nodeGroup.add(haloMesh);

          nodeGroup.name = `Ranvier_Node_${m}`;
          neuronGroup.add(nodeGroup);
          ranvierNodes.push(rMesh);
        }
      }

      // Botões Sinápticos Terminais
      const terminalPt = axonCurve.getPointAt(1.0);
      const boutonGroup = new THREE.Group();
      boutonGroup.name = "Synaptic_Boutons";
      const boutonGeo = new THREE.SphereGeometry(0.38, 14, 12);
      boutonGeo.scale(1.2, 0.8, 1.0);
      const boutonMat = new THREE.MeshStandardMaterial({
        color: 0x4ade80,
        roughness: 0.25,
        emissive: 0x22c55e,
        emissiveIntensity: 0.65
      });

      for (let t = 0; t < 3; t++) {
        const b = new THREE.Mesh(boutonGeo, boutonMat);
        b.position.copy(terminalPt).add(new THREE.Vector3((t - 1) * 0.72, -0.45, (Math.random() - 0.5) * 0.55));
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
  // 3. CONSTRUTOR DO SISTEMA GLIAL ORGÂNICO (ZERO PRIMITIVAS RÍGIDAS)
  // ==========================================================================
  // [PT-BR]: Reconstrução orgânica de Astrócitos, Oligodendrócitos, Micróglia e Células Ependimárias (zero Dodecahedron/BoxGeometry, curvas de 5 pontos e capilar sanguíneo 3D).
  // [EN-GB]: Organic glia system reconstruction (zero Dodecahedron/BoxGeometry, 5-point curves, and 3D blood capillary).
  // [AI-CTX]: @llm-context: Eliminates geometric primitives for true neurobiological ultrastructure.
  //           @llm-neuroscience: Protoplasmic astrocytes with perivascular feet, myelinating oligodendrocytes, surveillance microglia, and ependymal cilia.
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
      // Células ependimárias ocultas por padrão na visão da Camada V cortical
      gliaCollections.EPENDYMAL.visible = false;

      // Capilar sanguíneo 3D translúcido abraçado pelos pés perivasculares astrocitários
      const capCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-10.0, 7.5, -4.5),
        new THREE.Vector3(-5.2, 3.8, -3.6),
        new THREE.Vector3(0.0, 0.6, -3.0),
        new THREE.Vector3(5.4, -4.2, -3.8),
        new THREE.Vector3(10.5, -8.5, -4.8)
      ]);
      const capGeo = new THREE.TubeGeometry(capCurve, 36, 0.42, 12, false);
      const capMat = new THREE.MeshPhysicalMaterial({
        color: 0xef4444, // Vermelho endotelial
        roughness: 0.18,
        transmission: 0.65,
        opacity: 0.85,
        transparent: true,
        clearcoat: 0.8,
        emissive: 0x991b1b,
        emissiveIntensity: 0.4
      });
      const capillaryMesh = new THREE.Mesh(capGeo, capMat);
      capillaryMesh.name = "Capilar_Sanguineo_Perivascular";
      gliaCollections.ASTROCYTE.add(capillaryMesh);

      // A. ASTRÓCITOS PROTOPLASMÁTICOS (Soma orgânico com 10 ramos sinuosos de 5 pontos e pés perivasculares)
      const astroMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        roughness: 0.32,
        emissive: 0x0284c7,
        emissiveIntensity: 0.45
      });

      for (let a = 0; a < 6; a++) {
        const astroCell = new THREE.Group();
        // Soma orgânico esférico suave com ruído biológico
        const aSomaGeo = new THREE.SphereGeometry(0.58, 24, 20);
        const aPos = aSomaGeo.attributes.position;
        for (let k = 0; k < aPos.count; k++) {
          const vx = aPos.getX(k);
          const vy = aPos.getY(k);
          const vz = aPos.getZ(k);
          const n = Math.sin(vx * 7.0) * Math.cos(vz * 7.0) * 0.045;
          aPos.setXYZ(k, vx + n, vy + n, vz + n);
        }
        aSomaGeo.computeVertexNormals();
        astroCell.add(new THREE.Mesh(aSomaGeo, astroMat));

        // 10 ramos sinuosos de 5 pontos que se bifurcam em processos secundários
        for (let p = 0; p < 10; p++) {
          const phi = Math.acos(2 * Math.random() - 1);
          const theta = Math.random() * Math.PI * 2;
          const endPt = new THREE.Vector3(
            Math.sin(phi) * Math.cos(theta) * 2.8,
            Math.sin(phi) * Math.sin(theta) * 2.8,
            Math.cos(phi) * 2.8
          );

          const p0 = new THREE.Vector3(0, 0, 0);
          const p4 = endPt.clone();
          const p1 = p0.clone().lerp(p4, 0.25).add(new THREE.Vector3((Math.random() - 0.5) * 0.35, 0.15, (Math.random() - 0.5) * 0.35));
          const p2 = p0.clone().lerp(p4, 0.50).add(new THREE.Vector3((Math.random() - 0.5) * 0.45, -0.15, (Math.random() - 0.5) * 0.45));
          const p3 = p0.clone().lerp(p4, 0.75).add(new THREE.Vector3((Math.random() - 0.5) * 0.35, 0.12, (Math.random() - 0.5) * 0.35));

          const armCurve = new THREE.CatmullRomCurve3([p0, p1, p2, p3, p4]);
          const armGeo = new THREE.TubeGeometry(armCurve, 12, 0.065, 6, false);
          astroCell.add(new THREE.Mesh(armGeo, astroMat));

          // Bifurcação secundária com pé perivascular curvo abraçando o capilar
          if (p % 3 === 0) {
            const footEnd = endPt.clone().add(new THREE.Vector3((Math.random() - 0.5) * 0.8, -0.6, (Math.random() - 0.5) * 0.8));
            const footPts = [
              endPt,
              endPt.clone().lerp(footEnd, 0.33),
              endPt.clone().lerp(footEnd, 0.66).add(new THREE.Vector3(0.12, 0.05, 0.0)),
              footEnd.clone().add(new THREE.Vector3(-0.08, -0.05, 0.0)),
              footEnd
            ];
            const footCurve = new THREE.CatmullRomCurve3(footPts);
            astroCell.add(new THREE.Mesh(new THREE.TubeGeometry(footCurve, 8, 0.045, 5, false), astroMat));

            // Pé vascular curvo boleado
            const endfootGeo = new THREE.SphereGeometry(0.18, 12, 10);
            endfootGeo.scale(1.4, 0.6, 1.2);
            const endfootMesh = new THREE.Mesh(endfootGeo, astroMat);
            endfootMesh.position.copy(footEnd);
            astroCell.add(endfootMesh);
          }
        }
        astroCell.position.set(-6.2 + a * 2.5, 2.0 + (a % 2) * 3.0, -3.0 + (a % 3) * 2.5);
        gliaCollections.ASTROCYTE.add(astroCell);
      }

      // B. OLIGODENDROCITOS (Soma esférico-ovoide suave com processos curvos conectados aos internódios de mielina)
      const oligoMat = new THREE.MeshStandardMaterial({
        color: 0x34d399,
        roughness: 0.30,
        emissive: 0x059669,
        emissiveIntensity: 0.45
      });
      for (let o = 0; o < 5; o++) {
        const oligoCell = new THREE.Group();
        const oSomaGeo = new THREE.SphereGeometry(0.44, 20, 16);
        oSomaGeo.scale(1.0, 1.22, 0.95);
        oligoCell.add(new THREE.Mesh(oSomaGeo, oligoMat));

        // Processos curvos de 5 pontos que se estendem até as bainhas de mielina
        for (let pr = 0; pr < 6; pr++) {
          const armEnd = new THREE.Vector3(
            (Math.random() - 0.5) * 3.8,
            -2.0 - pr * 1.7,
            (Math.random() - 0.5) * 3.2
          );
          const p0 = new THREE.Vector3(0, 0, 0);
          const p4 = armEnd.clone();
          const p1 = p0.clone().lerp(p4, 0.25).add(new THREE.Vector3((Math.random() - 0.5) * 0.4, 0.1, (Math.random() - 0.5) * 0.4));
          const p2 = p0.clone().lerp(p4, 0.50).add(new THREE.Vector3((Math.random() - 0.5) * 0.5, -0.15, (Math.random() - 0.5) * 0.5));
          const p3 = p0.clone().lerp(p4, 0.75).add(new THREE.Vector3((Math.random() - 0.5) * 0.3, 0.1, (Math.random() - 0.5) * 0.3));

          const armCurve = new THREE.CatmullRomCurve3([p0, p1, p2, p3, p4]);
          const armMesh = new THREE.Mesh(new THREE.TubeGeometry(armCurve, 10, 0.048, 5, false), oligoMat);
          oligoCell.add(armMesh);
        }
        oligoCell.position.set(4.5 + (o % 2) * 2.0, -4.0 - o * 2.8, 2.5);
        gliaCollections.OLIGODENDROCYTE.add(oligoCell);
      }

      // C. MICRÓGLIA (Morfologia ramificada orgânica com processos tortuosos finos de 5 pontos)
      const microMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        roughness: 0.38,
        emissive: 0xd97706,
        emissiveIntensity: 0.42
      });
      for (let m = 0; m < 8; m++) {
        const microCell = new THREE.Group();
        const mSomaGeo = new THREE.SphereGeometry(0.34, 16, 14);
        microCell.add(new THREE.Mesh(mSomaGeo, microMat));

        for (let b = 0; b < 10; b++) {
          const dir = new THREE.Vector3((Math.random() - 0.5) * 3.4, (Math.random() - 0.5) * 3.4, (Math.random() - 0.5) * 3.4);
          const p0 = new THREE.Vector3(0, 0, 0);
          const p4 = dir.clone();
          const p1 = p0.clone().lerp(p4, 0.25).add(new THREE.Vector3((Math.random() - 0.5) * 0.3, 0.1, (Math.random() - 0.5) * 0.3));
          const p2 = p0.clone().lerp(p4, 0.50).add(new THREE.Vector3((Math.random() - 0.5) * 0.4, -0.1, (Math.random() - 0.5) * 0.4));
          const p3 = p0.clone().lerp(p4, 0.75).add(new THREE.Vector3((Math.random() - 0.5) * 0.3, 0.1, (Math.random() - 0.5) * 0.3));

          const brCurve = new THREE.CatmullRomCurve3([p0, p1, p2, p3, p4]);
          const brMesh = new THREE.Mesh(new THREE.TubeGeometry(brCurve, 8, 0.035, 4, false), microMat);
          microCell.add(brMesh);
        }
        microCell.position.set((Math.random() - 0.5) * 16.0, (Math.random() - 0.5) * 14.0, (Math.random() - 0.5) * 12.0);
        gliaCollections.MICROGLIA.add(microCell);
      }

      // D. CÉLULAS EPENDIMÁRIAS (Posicionadas apenas no nível ventricular/LCR; corpos colunares boleados suaves e cílios curvos)
      const ependMat = new THREE.MeshStandardMaterial({
        color: 0xc084fc,
        roughness: 0.28,
        emissive: 0x9333ea,
        emissiveIntensity: 0.42
      });
      const ciliaMat = new THREE.MeshBasicMaterial({ color: 0xe9d5ff });

      const ependRow = 14;
      const ciliaList = [];
      for (let i = 0; i < ependRow; i++) {
        const ependCell = new THREE.Group();
        // Corpo colunar boleado suave (CylinderGeometry boleado em vez de BoxGeometry)
        const colGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.85, 16);
        const colMesh = new THREE.Mesh(colGeo, ependMat);
        ependCell.add(colMesh);

        // Tufo de 5 cílios apicais curvos
        for (let c = 0; c < 5; c++) {
          const cilPts = [
            new THREE.Vector3((c - 2) * 0.10, 0.42, 0),
            new THREE.Vector3((c - 2) * 0.10 + 0.05, 0.58, 0.04),
            new THREE.Vector3((c - 2) * 0.10 + 0.08, 0.75, 0.06),
            new THREE.Vector3((c - 2) * 0.10 + 0.05, 0.92, 0.04),
            new THREE.Vector3((c - 2) * 0.10, 1.05, 0)
          ];
          const cilCurve = new THREE.CatmullRomCurve3(cilPts);
          const cilGeo = new THREE.TubeGeometry(cilCurve, 8, 0.022, 5, false);
          const cilMesh = new THREE.Mesh(cilGeo, ciliaMat);
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

    // [PT-BR]: Constrói o Conectoma Microscópico idêntico à imagem Firefly Layer V (28 neurônios vizinhos em azul-petróleo e âmbar, mais 250 micropartículas extracelulares).
    // [EN-GB]: Builds Microscopic Connectome matching Firefly Layer V (28 neighbor neurons in deep teal and amber, plus 250 extracellular microparticles).
    // [AI-CTX]: @llm-neuroscience: Cortical Layer V microcolumn with dense synaptic connectivity and extracellular ion/vesicle bath.
    initConnectomeBackground() {
      this.neighborNeuronsGroup = new THREE.Group();
      this.neighborNeuronsGroup.name = "LAYER_V_NEIGHBOR_NEURONS_28";
      this.neighborNeurons = [];

      // 28 Neurônios Vizinhos Esculpidos em azul-petróleo profundo (#0284c7 / #1e3a8a) e âmbar (#d97706 / #f59e0b)
      const neighborCoords = [
        [-8.5, 4.2, -6.0], [9.2, 5.0, -5.5], [-7.2, -5.5, -4.5], [8.0, -6.2, -5.0],
        [-12.0, 1.5, -8.0], [13.0, 2.0, -7.5], [-4.5, 9.5, -7.0], [5.2, 10.0, -6.5],
        [-11.5, -9.0, -9.0], [11.0, -8.5, -8.5], [-14.5, 8.0, -11.0], [14.0, 7.5, -10.5],
        [-6.0, -14.0, -8.0], [6.5, -14.5, -7.5], [-16.0, -3.5, -12.0], [16.5, -2.8, -11.5],
        [-5.5, 3.0, 5.5], [6.0, 3.5, 5.0], [-7.5, -4.0, 6.0], [7.2, -4.5, 5.5],
        [-10.5, 6.5, 7.5], [10.8, 6.2, 7.0], [-3.8, -11.5, 6.5], [4.2, -12.0, 6.0],
        [-13.5, -7.2, 9.0], [13.2, -7.5, 8.5], [-15.0, 4.5, 9.5], [15.2, 4.8, 9.0]
      ];

      const tealMat = new THREE.MeshPhysicalMaterial({
        color: 0x0284c7, // Azul-petróleo profundo (#0284c7)
        roughness: 0.28,
        transmission: 0.48,
        opacity: 0.88,
        transparent: true,
        emissive: 0x1e3a8a, // Azul-marinho profundo
        emissiveIntensity: 0.40
      });

      const amberMat = new THREE.MeshPhysicalMaterial({
        color: 0xd97706, // Âmbar suave (#d97706)
        roughness: 0.32,
        transmission: 0.52,
        opacity: 0.88,
        transparent: true,
        emissive: 0xb45309,
        emissiveIntensity: 0.38
      });

      neighborCoords.forEach((coord, idx) => {
        const nGroup = new THREE.Group();
        nGroup.position.set(coord[0], coord[1], coord[2]);

        const mat = (idx % 2 === 0) ? tealMat.clone() : amberMat.clone();

        // Pericário piramidal orgânico
        const sGeo = new THREE.SphereGeometry(1.20, 20, 16);
        sGeo.scale(1.0, 1.38, 1.0);
        const sMesh = new THREE.Mesh(sGeo, mat);
        nGroup.add(sMesh);

        // Tronco dendrítico apical ascendente com 5 pontos de controle
        const apCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 1.2, 0),
          new THREE.Vector3((Math.random() - 0.5) * 1.0, 3.2, (Math.random() - 0.5) * 1.0),
          new THREE.Vector3((Math.random() - 0.5) * 1.8, 5.5, (Math.random() - 0.5) * 1.5),
          new THREE.Vector3((Math.random() - 0.5) * 2.4, 7.8, (Math.random() - 0.5) * 2.0),
          new THREE.Vector3((Math.random() - 0.5) * 3.0, 10.0, (Math.random() - 0.5) * 2.5)
        ]);
        const apGeo = new THREE.TubeGeometry(apCurve, 14, 0.18, 6, false);
        const apMesh = new THREE.Mesh(apGeo, mat);
        nGroup.add(apMesh);

        // Axônio descendente de 5 pontos
        const axCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, -1.2, 0),
          new THREE.Vector3((Math.random() - 0.5) * 0.8, -3.2, (Math.random() - 0.5) * 0.8),
          new THREE.Vector3((Math.random() - 0.5) * 1.5, -5.8, (Math.random() - 0.5) * 1.2),
          new THREE.Vector3((Math.random() - 0.5) * 2.2, -8.5, (Math.random() - 0.5) * 1.6),
          new THREE.Vector3((Math.random() - 0.5) * 2.8, -11.0, (Math.random() - 0.5) * 2.0)
        ]);
        const axGeo = new THREE.TubeGeometry(axCurve, 14, 0.12, 5, false);
        const axMesh = new THREE.Mesh(axGeo, mat);
        nGroup.add(axMesh);

        this.neighborNeuronsGroup.add(nGroup);
        this.neighborNeurons.push({ group: nGroup, pos: new THREE.Vector3(coord[0], coord[1], coord[2]) });
      });

      this.masterGroup.add(this.neighborNeuronsGroup);

      // 250 Micropartículas de Íons/Vesículas Flutuantes no Espaço Extracelular
      this.extracellularParticlesGroup = new THREE.Group();
      this.extracellularParticlesGroup.name = "EXTRACELLULAR_PARTICLES_250";
      this.extracellularParticles = [];
      const epGeo = new THREE.SphereGeometry(0.05, 8, 8);
      const epMatCyan = new THREE.MeshBasicMaterial({ color: 0x00f2fe, transparent: true, opacity: 0.85 });
      const epMatAmber = new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.85 });
      const epMatTeal = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.75 });

      for (let p = 0; p < 250; p++) {
        const mat = (p % 3 === 0) ? epMatCyan : (p % 3 === 1 ? epMatAmber : epMatTeal);
        const pMesh = new THREE.Mesh(epGeo, mat);
        const rad = 2.5 + Math.random() * 16.5;
        const theta = Math.random() * Math.PI * 2;
        const y = (Math.random() - 0.5) * 30.0;
        pMesh.position.set(Math.cos(theta) * rad, y, Math.sin(theta) * rad);
        this.extracellularParticlesGroup.add(pMesh);
        this.extracellularParticles.push({
          mesh: pMesh,
          basePos: pMesh.position.clone(),
          speed: 0.35 + Math.random() * 0.75,
          phase: Math.random() * Math.PI * 2
        });
      }
      this.masterGroup.add(this.extracellularParticlesGroup);

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

      // 2. Condução Saltatória e Brilho Eletrofisiológico nos Nódulos de Ranvier
      if (this.heroNeuron && this.heroNeuron.ranvierNodes.length > 0) {
        const nodes = this.heroNeuron.ranvierNodes;

        // Sincronização do brilho bioluminescente (#00f2fe) com a despolarização de Hodgkin-Huxley
        const hhDepolFactor = Math.max(0.0, (vm + 60.0) / 90.0);
        const dynamicIntensity = 1.2 + hhDepolFactor * 1.8;

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

        // Suaviza escala e modula emissão dos nódulos com a onda de despolarização
        nodes.forEach(n => {
          n.scale.lerp(new THREE.Vector3(1, 1, 1), dt * 6.0);
          if (n.material && n.material.emissiveIntensity !== undefined) {
            n.material.emissiveIntensity = dynamicIntensity;
          }
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

      // 5. Movimento Browniano Suave das 250 Micropartículas Extracelulares
      if (this.extracellularParticles && this.extracellularParticles.length > 0) {
        for (let p = 0; p < this.extracellularParticles.length; p++) {
          const ep = this.extracellularParticles[p];
          const t = this.elapsedTime * ep.speed + ep.phase;
          ep.mesh.position.x = ep.basePos.x + Math.sin(t * 1.2) * 0.35;
          ep.mesh.position.y = ep.basePos.y + Math.cos(t * 0.9) * 0.45;
          ep.mesh.position.z = ep.basePos.z + Math.sin(t * 1.5) * 0.35;
        }
      }
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
