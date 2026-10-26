/**
 * ============================================================================
 * MOZOK v4.0 / DCJ — PHOTOREALISTIC FIREFLY LAYER V MOTOR CORTEX NEUROBIOLOGY
 * RECONSTRUÇÃO IDÊNTICA AO SLIDE DA DCJ: NEURÔNIO PIRAMIDAL ÂMBAR-DOURADO,
 * AXÔNIO MIELINIZADO, NÓDULOS DE RANVIER (#00f2fe), 16 VIZINHOS ESPAÇADOS,
 * 24 SINAPSES FÍSICAS BIDIRECIONAIS, PLACAS KURU, VACÚOLOS E HODGKIN-HUXLEY
 * ============================================================================
 */

(function (window) {
  'use strict';

  function fbm3D(x, y, z) {
    const o1 = Math.sin(x * 1.0 + y * 0.8) * Math.cos(z * 0.9 + x * 0.35);
    const o2 = Math.sin(x * 2.1 - z * 1.9) * Math.cos(y * 2.0 + z * 1.1) * 0.5;
    const o3 = Math.sin(y * 4.2 + z * 3.8) * Math.cos(x * 4.1 - y * 3.1) * 0.25;
    const o4 = Math.sin(x * 8.3 + y * 7.9) * Math.cos(z * 8.1 + x * 4.5) * 0.125;
    return (o1 + o2 + o3 + o4) / 1.875;
  }

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
      this.phase = 'POTENCIAL DE REPOUSO (-70 mV)';
      this.time = 0.0;
      this.history = [];
      this.maxHistory = 140;
    }

    alphaM(V) { const v = V + 40.0; return Math.abs(v) < 1e-4 ? 1.0 : (0.1 * v) / (1.0 - Math.exp(-v / 10.0)); }
    betaM(V) { return 4.0 * Math.exp(-(V + 65.0) / 18.0); }
    alphaH(V) { return 0.07 * Math.exp(-(V + 65.0) / 20.0); }
    betaH(V) { return 1.0 / (1.0 + Math.exp(-(V + 35.0) / 10.0)); }
    alphaN(V) { const v = V + 55.0; return Math.abs(v) < 1e-4 ? 0.1 : (0.01 * v) / (1.0 - Math.exp(-v / 10.0)); }
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
        if (this.stimulus > 0) this.stimulus = Math.max(0, this.stimulus - 8.0 * dt);
      }
      if (this.V > 15.0) this.phase = 'DESPOLARIZAÇÃO PICO (+30 mV)';
      else if (this.V > -55.0) this.phase = 'DESPOLARIZAÇÃO (Influxo Na+)';
      else if (this.V <= -72.0) this.phase = 'HIPERPOLARIZAÇÃO / REFRATÁRIO';
      else this.phase = 'POTENCIAL DE REPOUSO (-70 mV)';

      this.history.push({ t: this.time, v: this.V, phase: this.phase });
      if (this.history.length > this.maxHistory) this.history.shift();
      return this.V;
    }
  }

  class NeuralMicrocosmos3D {
    constructor(scene) {
      this.scene = scene;
      this.masterGroup = new THREE.Group();
      this.masterGroup.name = 'NEURAL_MICROCOSMOS_DCJ_FIREFLY_MASTER';
      this.masterGroup.visible = false;
      this.scene.add(this.masterGroup);

      this.connectomeGroup = new THREE.Group();
      this.confocalGroup = new THREE.Group();
      this.gliaGroup = new THREE.Group();
      this.masterGroup.add(this.connectomeGroup);
      this.masterGroup.add(this.confocalGroup);
      this.masterGroup.add(this.gliaGroup);

      // Iluminação Confocal Two-Photon dedicada do Microcosmo DCJ
      const rimLight = new THREE.PointLight(0x00f2fe, 2.8, 120);
      rimLight.position.set(0, 28, -25);
      this.masterGroup.add(rimLight);

      const goldLight = new THREE.PointLight(0xfef08a, 2.2, 120);
      goldLight.position.set(22, 35, 28);
      this.masterGroup.add(goldLight);

      this.hhSimulator = new HodgkinHuxleyModel();
      this.neurons = [];
      this.myelinSheaths = [];
      this.ranvierNodes = [];
      this.dendriticSpines = [];
      this.synapseBridges = [];
      this.synapticVesicles = [];
      this.retrogradeParticles = [];
      this.actionPulses = [];
      this.amyloidPlaques = [];
      this.vacuoles = [];
      this.elapsedTime = 0.0;
      this.damageRatio = 0.0;
      this.currentPathology = 'NORMAL';

      this.gliaVisibility = {
        ASTROCYTE: true,
        OLIGODENDROCYTE: true,
        MICROGLIA: true,
        EPENDYMAL: true
      };

      this.buildSoftGlowTexture();
      this.buildFireflyLayerVConnectome();
      this.build24PhysicalSynapsesAndNeurotransmitters();
      this.buildActionPotentialPulses();
      this.buildAmyloidPlaques();
      this.buildSpongiformVacuoles();
      this.buildGliaOverlays();

      this.heroNeuron = this.neurons[0] || null;
    }

    buildSoftGlowTexture() {
      const size = 128;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (ctx && typeof ctx.createRadialGradient === 'function') {
        const grad = ctx.createRadialGradient(size / 2, size / 2, 2, size / 2, size / 2, size / 2);
        grad.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
        grad.addColorStop(0.25, 'rgba(125, 211, 252, 0.85)');
        grad.addColorStop(0.6, 'rgba(2, 132, 199, 0.28)');
        grad.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);
      }
      this.glowTexture = new THREE.CanvasTexture(canvas);
      this.glowTexture.generateMipmaps = true;
    }

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

      const dendritePoles = [
        new THREE.Vector3(0.0, 1.0, 0.1).normalize(),
        new THREE.Vector3(-0.78, 0.72, 0.35).normalize(),
        new THREE.Vector3(0.82, 0.68, 0.28).normalize(),
        new THREE.Vector3(-0.92, 0.32, -0.25).normalize(),
        new THREE.Vector3(0.95, 0.28, -0.22).normalize(),
        new THREE.Vector3(-0.55, -0.42, 0.52).normalize(),
        new THREE.Vector3(0.58, -0.38, 0.48).normalize(),
        new THREE.Vector3(0.05, -0.52, -0.62).normalize()
      ];

      const axonHillockDir = isHero
        ? new THREE.Vector3(-0.18, -1.0, 0.08).normalize()
        : (axonTarget ? axonTarget.clone().sub(position).normalize() : new THREE.Vector3(0.15, -1.0, -0.1).normalize());

      // a) SOMA PIRAMIDAL COM ROOT-FLARES HIPERBÓLICOS E MICRO-TEXTURA FBM 3D (IDÊNTICO AO DCJ)
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
      group.add(somaMesh);

      // NÚCLEO CELULAR ESFÉRICO ESCURO + HALO PERINUCLEAR LUMINOSO + BOKEH SPRITE
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

      // b) ÁRVORES DENDRÍTICAS TUBULARES DE 5ª ORDEM (LEI DE RALL)
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

      // Semente pseudoaleatória determinística para morfologia idêntica e limpa
      let seedVal = (id + 1) * 1337;
      const nextRand = () => {
        seedVal = (seedVal * 16807) % 2147483647;
        return (seedVal - 1) / 2147483646;
      };

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
          curDir.add(new THREE.Vector3((nextRand() - 0.5) * 0.3, (nextRand() - 0.5) * 0.3, (nextRand() - 0.5) * 0.3)).normalize();

          if (order >= 2 && s % 2 === 0 && nextRand() < 0.65) {
            const spGeo = new THREE.SphereGeometry(0.09, 8, 8);
            const spMat = new THREE.MeshStandardMaterial({
              color: isAmber ? 0xf59e0b : 0x0ea5e9,
              emissive: isAmber ? 0xd97706 : 0x0284c7,
              emissiveIntensity: 0.45,
              roughness: 0.32
            });
            const spMesh = new THREE.Mesh(spGeo, spMat);
            const orthoJitter = new THREE.Vector3(nextRand() - 0.5, nextRand() - 0.5, nextRand() - 0.5).normalize().multiplyScalar(rEnd * 2.2);
            spMesh.position.copy(cur).add(orthoJitter);
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
          terminalTips.push({ localPt: endPt, worldPt: worldEndPt, dir: curDir, neuronId: id, isAmber });
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

      // c) AXÔNIO DESCENDENTE COM 5 BAINHAS DE MIELINA BOLEADAS E NÓDULOS DE RANVIER (#00f2fe)
      let axonCurveGlobal = null;
      const axonSheaths = [];
      const axonRanvierMeshes = [];

      if (isHero || hasVisibleMyelin) {
        const axonP0 = axonHillockDir.clone().multiplyScalar(somaRadius * 0.98);
        const axonTargetPt = isHero
          ? new THREE.Vector3(-2.6, -13.5, 1.2).sub(position).divideScalar(scale)
          : (axonTarget ? axonTarget.clone().sub(position).divideScalar(scale) : axonP0.clone().add(new THREE.Vector3(0.5, -12.0, -0.2)));

        const aMid1 = axonP0.clone().lerp(axonTargetPt, 0.33).add(new THREE.Vector3(-0.4, -0.6, 0.3));
        const aMid2 = axonP0.clone().lerp(axonTargetPt, 0.66).add(new THREE.Vector3(0.3, -0.4, -0.2));
        const axonCurve = new THREE.CatmullRomCurve3([axonP0, aMid1, aMid2, axonTargetPt]);
        axonCurveGlobal = axonCurve;

        const axTubeGeo = new THREE.TubeGeometry(axonCurve, 32, 0.16, 8, false);
        const axTubeMat = new THREE.MeshStandardMaterial({
          color: matBaseColor,
          emissive: matEmissive,
          emissiveIntensity: 0.5,
          roughness: 0.28
        });
        group.add(new THREE.Mesh(axTubeGeo, axTubeMat));

        const myelinCount = 5;
        const axonR = 0.16;

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
          group.add(mMesh);
          axonSheaths.push(mMesh);
          this.myelinSheaths.push({ mesh: mMesh, baseScale: mMesh.scale.clone(), neuronId: id });

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
            axonRanvierMeshes.push({ mesh: rRingMesh, sprite: rSprite, worldPos: worldNodePos, tNode, neuronId: id });
            this.ranvierNodes.push({ mesh: rRingMesh, sprite: rSprite, worldPos: worldNodePos, neuronId: id });
          }
        }
      }

      this.connectomeGroup.add(group);
      const record = {
        id, isHero, isAmber, position, scale, group, somaMesh, somaMat,
        nucleusMesh, nucleusMat, haloMesh, sprite, dendriteMesh, dendriteMat,
        terminalTips, axonSheaths, axonRanvierMeshes, axonCurveGlobal, health: 1.0
      };
      this.neurons.push(record);
      return record;
    }

    buildFireflyLayerVConnectome() {
      // 17 Neurônios Esculpidos Exatos do Slide da DCJ (1 Hero Âmbar Central + 7 Vizinhos Próximos + 9 Camada de Profundidade)
      this.buildFireflyLayerVNeuronMesh({ id: 0, isHero: true, isAmber: true, position: new THREE.Vector3(0.0, 2.2, 0.0), scale: 1.0, hasVisibleMyelin: true });
      this.buildFireflyLayerVNeuronMesh({ id: 1, isHero: false, isAmber: false, position: new THREE.Vector3(-9.8, 3.6, -2.5), scale: 0.68, hasVisibleMyelin: true });
      this.buildFireflyLayerVNeuronMesh({ id: 2, isHero: false, isAmber: false, position: new THREE.Vector3(-7.5, -5.8, 2.2), scale: 0.78, axonTarget: new THREE.Vector3(2.5, -7.5, 1.0), hasVisibleMyelin: true });
      this.buildFireflyLayerVNeuronMesh({ id: 3, isHero: false, isAmber: true, position: new THREE.Vector3(-8.2, -1.6, -5.5), scale: 0.48, hasVisibleMyelin: false });
      this.buildFireflyLayerVNeuronMesh({ id: 4, isHero: false, isAmber: true, position: new THREE.Vector3(1.8, -4.5, -5.2), scale: 0.55, hasVisibleMyelin: true });
      this.buildFireflyLayerVNeuronMesh({ id: 5, isHero: false, isAmber: false, position: new THREE.Vector3(9.4, 4.2, -3.0), scale: 0.65, hasVisibleMyelin: true });
      this.buildFireflyLayerVNeuronMesh({ id: 6, isHero: false, isAmber: true, position: new THREE.Vector3(7.8, 3.0, -2.2), scale: 0.45, hasVisibleMyelin: false });
      this.buildFireflyLayerVNeuronMesh({ id: 7, isHero: false, isAmber: true, position: new THREE.Vector3(8.4, -4.8, -2.0), scale: 0.52, hasVisibleMyelin: true });

      const distantPositions = [
        new THREE.Vector3(-14.5, 6.5, -12.0),
        new THREE.Vector3(-12.0, -7.2, -14.5),
        new THREE.Vector3(-5.5, 8.5, -16.0),
        new THREE.Vector3(-2.0, -9.0, -13.5),
        new THREE.Vector3(4.5, 8.0, -17.5),
        new THREE.Vector3(12.5, 7.5, -15.0),
        new THREE.Vector3(13.8, -1.5, -18.0),
        new THREE.Vector3(11.5, -8.5, -13.0),
        new THREE.Vector3(0.0, 10.5, -21.0)
      ];
      for (let d = 0; d < 9; d++) {
        this.buildFireflyLayerVNeuronMesh({
          id: 8 + d,
          isHero: false,
          isAmber: (d % 3 === 0),
          position: distantPositions[d],
          scale: 0.32 + (d % 3) * 0.08,
          hasVisibleMyelin: false
        });
      }
    }

    build24PhysicalSynapsesAndNeurotransmitters() {
      const hero = this.neurons[0];
      const neighbors = this.neurons.slice(1, 8);

      const boutonGeo = new THREE.SphereGeometry(0.22, 10, 8);
      boutonGeo.scale(1.2, 0.85, 0.85);
      const cleftDiskGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.04, 12);
      const spineGeo = new THREE.SphereGeometry(0.18, 8, 8);
      spineGeo.scale(0.9, 1.25, 0.9);

      let bridgeCount = 0;
      const targetBridges = 24;

      for (let n = 0; n < neighbors.length && bridgeCount < targetBridges; n++) {
        const neighbor = neighbors[n];
        const connectionsPerNeighbor = (n < 3) ? 4 : 3;

        for (let c = 0; c < connectionsPerNeighbor && bridgeCount < targetBridges; c++) {
          const heroTip = hero.terminalTips[(bridgeCount * 3 + c) % hero.terminalTips.length];
          const neighTip = neighbor.terminalTips[(c * 4 + bridgeCount) % neighbor.terminalTips.length];
          if (!heroTip || !neighTip) continue;

          const pPre = heroTip.worldPt;
          const pPost = neighTip.worldPt;
          const cleftCenter = pPre.clone().lerp(pPost, 0.5);
          const cleftDir = pPost.clone().sub(pPre).normalize();

          const boutonMesh = new THREE.Mesh(boutonGeo, new THREE.MeshStandardMaterial({
            color: 0x0284c7, emissive: 0x0369a1, emissiveIntensity: 0.6, roughness: 0.25
          }));
          boutonMesh.position.copy(cleftCenter).addScaledVector(cleftDir, -0.22);
          boutonMesh.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), cleftDir);
          this.connectomeGroup.add(boutonMesh);

          const cleftMesh = new THREE.Mesh(cleftDiskGeo, new THREE.MeshBasicMaterial({
            color: 0x00f2fe, transparent: true, opacity: 0.72, blending: THREE.AdditiveBlending, depthWrite: false
          }));
          cleftMesh.position.copy(cleftCenter);
          cleftMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), cleftDir);
          this.connectomeGroup.add(cleftMesh);

          const spineMesh = new THREE.Mesh(spineGeo, new THREE.MeshStandardMaterial({
            color: 0xd97706, emissive: 0xf59e0b, emissiveIntensity: 0.55, roughness: 0.3
          }));
          spineMesh.position.copy(cleftCenter).addScaledVector(cleftDir, 0.22);
          spineMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), cleftDir);
          this.connectomeGroup.add(spineMesh);

          const bridgeCurve = new THREE.CatmullRomCurve3([pPre, cleftCenter, pPost]);
          const bridgeTubeMesh = new THREE.Mesh(
            new THREE.TubeGeometry(bridgeCurve, 8, 0.045, 6, false),
            new THREE.MeshStandardMaterial({ color: 0x0284c7, emissive: 0x0369a1, emissiveIntensity: 0.4, transparent: true, opacity: 0.75 })
          );
          this.connectomeGroup.add(bridgeTubeMesh);

          this.synapseBridges.push({
            id: bridgeCount, prePt: pPre, postPt: pPost, cleftCenter, cleftDir,
            boutonMesh, cleftMesh, spineMesh, bridgeTubeMesh,
            isGlutamate: (bridgeCount % 3 !== 0)
          });
          bridgeCount++;
        }
      }

      // Fluxo Anterógrado (Glutamato #fbbf24 / GABA #38bdf8)
      const anteroCount = bridgeCount * 22;
      const anteroPos = new Float32Array(anteroCount * 3);
      const anteroCol = new Float32Array(anteroCount * 3);
      const colGlutamate = new THREE.Color(0xfbbf24);
      const colGABA = new THREE.Color(0x38bdf8);

      for (let i = 0; i < anteroCount; i++) {
        const bIdx = Math.floor(i / 22);
        const bridge = this.synapseBridges[bIdx];
        const prog = Math.random();
        const baseCol = bridge.isGlutamate ? colGlutamate : colGABA;
        const p = bridge.prePt.clone().lerp(bridge.postPt, prog);
        anteroPos[i * 3] = p.x; anteroPos[i * 3 + 1] = p.y; anteroPos[i * 3 + 2] = p.z;
        anteroCol[i * 3] = baseCol.r; anteroCol[i * 3 + 1] = baseCol.g; anteroCol[i * 3 + 2] = baseCol.b;
        this.synapticVesicles.push({ bridgeIndex: bIdx, progress: prog, speed: 0.65 + Math.random() * 0.65 });
      }
      const anteroGeo = new THREE.BufferGeometry();
      anteroGeo.setAttribute('position', new THREE.BufferAttribute(anteroPos, 3));
      anteroGeo.setAttribute('color', new THREE.BufferAttribute(anteroCol, 3));
      this.anteroPoints = new THREE.Points(anteroGeo, new THREE.PointsMaterial({
        size: 0.55, map: this.glowTexture, vertexColors: true, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false
      }));
      this.confocalGroup.add(this.anteroPoints);

      // Fluxo Retrógrado (2-AG/NO #34d399 + EAAT2 #fef08a)
      const retroCount = bridgeCount * 14;
      const retroPos = new Float32Array(retroCount * 3);
      const retroCol = new Float32Array(retroCount * 3);
      const colEndo = new THREE.Color(0x34d399);
      const colEAAT2 = new THREE.Color(0xfef08a);

      for (let i = 0; i < retroCount; i++) {
        const bIdx = Math.floor(i / 14);
        const bridge = this.synapseBridges[bIdx];
        const prog = Math.random();
        const curCol = (i % 2 === 0) ? colEndo : colEAAT2;
        const p = bridge.postPt.clone().lerp(bridge.prePt, prog);
        retroPos[i * 3] = p.x; retroPos[i * 3 + 1] = p.y; retroPos[i * 3 + 2] = p.z;
        retroCol[i * 3] = curCol.r; retroCol[i * 3 + 1] = curCol.g; retroCol[i * 3 + 2] = curCol.b;
        this.retrogradeParticles.push({ bridgeIndex: bIdx, progress: prog, speed: 0.55 + Math.random() * 0.55 });
      }
      const retroGeo = new THREE.BufferGeometry();
      retroGeo.setAttribute('position', new THREE.BufferAttribute(retroPos, 3));
      retroGeo.setAttribute('color', new THREE.BufferAttribute(retroCol, 3));
      this.retroPoints = new THREE.Points(retroGeo, new THREE.PointsMaterial({
        size: 0.48, map: this.glowTexture, vertexColors: true, transparent: true, opacity: 0.92, blending: THREE.AdditiveBlending, depthWrite: false
      }));
      this.confocalGroup.add(this.retroPoints);
    }

    buildActionPotentialPulses() {
      const pulseCount = 180;
      const positions = new Float32Array(pulseCount * 3);
      const colors = new Float32Array(pulseCount * 3);
      const myelinatedNeurons = this.neurons.filter(n => n.axonCurveGlobal !== null);

      for (let i = 0; i < pulseCount; i++) {
        const nr = myelinatedNeurons[i % myelinatedNeurons.length];
        this.actionPulses.push({ neuron: nr, t: Math.random(), speed: 0.45 + Math.random() * 0.65 });
        colors[i * 3] = 0.0; colors[i * 3 + 1] = 0.95; colors[i * 3 + 2] = 1.0;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      this.pulsePoints = new THREE.Points(geo, new THREE.PointsMaterial({
        size: 1.45, map: this.glowTexture, vertexColors: true, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false
      }));
      this.connectomeGroup.add(this.pulsePoints);
    }

    buildAmyloidPlaques() {
      const needleGeo = new THREE.CylinderGeometry(0.012, 0.038, 0.92, 5);
      needleGeo.translate(0, 0.46, 0);
      const matRuby = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xdc2626, emissiveIntensity: 0.95, roughness: 0.28 });
      const matAmber = new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xea580c, emissiveIntensity: 0.92, roughness: 0.26 });

      for (let i = 0; i < 18; i++) {
        const plaqueGroup = new THREE.Group();
        for (let k = 0; k < 16; k++) {
          const mesh = new THREE.Mesh(needleGeo, (k % 3 === 0) ? matAmber : matRuby);
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(Math.sin(phi) * Math.cos(theta), Math.sin(phi) * Math.sin(theta), Math.cos(phi)));
          plaqueGroup.add(mesh);
        }
        if (this.synapseBridges[i % Math.max(1, this.synapseBridges.length)]) {
          plaqueGroup.position.copy(this.synapseBridges[i % this.synapseBridges.length].cleftCenter);
        }
        plaqueGroup.visible = false;
        this.connectomeGroup.add(plaqueGroup);
        this.amyloidPlaques.push(plaqueGroup);
      }
    }

    buildSpongiformVacuoles() {
      const cystGeo = new THREE.SphereGeometry(0.42, 20, 16);
      const cystMat = new THREE.MeshPhysicalMaterial({
        color: 0xe2e8f0, emissive: 0x38bdf8, emissiveIntensity: 0.18,
        transparent: true, opacity: 0.45, roughness: 0.06, transmission: 0.92, ior: 1.333, depthWrite: false
      });
      for (let i = 0; i < 20; i++) {
        const m = new THREE.Mesh(cystGeo, cystMat);
        const r = 2.0 + (i % 6) * 1.8;
        const theta = (i / 20) * Math.PI * 2;
        m.position.set(Math.cos(theta) * r, (i % 5 - 2) * 1.8, Math.sin(theta) * (r * 0.5));
        m.visible = false;
        this.connectomeGroup.add(m);
        this.vacuoles.push(m);
      }
    }

    buildGliaOverlays() {
      this.gliaCollections = {
        ASTROCYTE: new THREE.Group(),
        OLIGODENDROCYTE: new THREE.Group(),
        MICROGLIA: new THREE.Group(),
        EPENDYMAL: new THREE.Group()
      };
      this.gliaGroup.add(this.gliaCollections.ASTROCYTE);
      this.gliaGroup.add(this.gliaCollections.OLIGODENDROCYTE);
      this.gliaGroup.add(this.gliaCollections.MICROGLIA);
      this.gliaGroup.add(this.gliaCollections.EPENDYMAL);
    }

    applyLOD() {}

    triggerActionPotential(stimulusStrength = 22.0) {
      this.hhSimulator.triggerStimulus(stimulusStrength);
    }

    setGliaVisibility(type, isVisible) {
      if (this.gliaVisibility[type] !== undefined) {
        this.gliaVisibility[type] = !!isVisible;
        if (this.gliaCollections && this.gliaCollections[type]) {
          this.gliaCollections[type].visible = this.gliaVisibility[type];
        }
      }
    }

    applyPathologyMode(pathologyKey) {
      this.currentPathology = (pathologyKey || 'NORMAL').toUpperCase();
      const isPrionOrAD = (this.currentPathology === 'PRION' || this.currentPathology === 'CJD' || this.currentPathology === 'ALZHEIMER');
      const isMS = (this.currentPathology === 'MS');

      this.amyloidPlaques.forEach(p => { p.visible = isPrionOrAD; });
      this.vacuoles.forEach(v => { v.visible = (this.currentPathology === 'PRION' || this.currentPathology === 'CJD'); });

      this.myelinSheaths.forEach(m => {
        m.mesh.scale.setScalar(isMS ? 0.45 : 1.0);
        m.mesh.material.opacity = isMS ? 0.35 : 0.88;
      });
    }

    update(dt) {
      if (!this.masterGroup.visible) return;
      this.elapsedTime += dt;

      const dtMs = dt * 1000.0 * 0.05;
      this.hhSimulator.step(dtMs);

      const fireInterval = (this.currentPathology === 'EPILEPSY') ? 0.12 : 0.55;
      if (Math.sin(this.elapsedTime * (Math.PI * 2 / fireInterval)) > 0.985) {
        this.hhSimulator.triggerStimulus(18.0);
      }

      // 1. Animar Pulsos Saltatórios nos Axônios Mielinizados
      if (this.pulsePoints && this.actionPulses.length > 0) {
        const posAttr = this.pulsePoints.geometry.getAttribute('position');
        for (let i = 0; i < this.actionPulses.length; i++) {
          const pulse = this.actionPulses[i];
          pulse.t = (pulse.t + dt * pulse.speed) % 1.0;
          const nr = pulse.neuron;
          if (nr && nr.axonCurveGlobal) {
            const localPt = nr.axonCurveGlobal.getPointAt(pulse.t);
            const worldPt = localPt.clone().multiplyScalar(nr.scale).add(nr.position);
            posAttr.setXYZ(i, worldPt.x, worldPt.y, worldPt.z);
          }
        }
        posAttr.needsUpdate = true;
      }

      // 2. Animar Neurotransmissores Anterógrados e Retrógrados nas 24 Sinapses
      if (this.anteroPoints && this.synapseBridges.length > 0) {
        const aAttr = this.anteroPoints.geometry.getAttribute('position');
        for (let i = 0; i < this.synapticVesicles.length; i++) {
          const v = this.synapticVesicles[i];
          v.progress = (v.progress + dt * v.speed) % 1.0;
          const b = this.synapseBridges[v.bridgeIndex];
          if (b) {
            const p = b.prePt.clone().lerp(b.postPt, v.progress);
            aAttr.setXYZ(i, p.x, p.y, p.z);
          }
        }
        aAttr.needsUpdate = true;
      }

      if (this.retroPoints && this.synapseBridges.length > 0) {
        const rAttr = this.retroPoints.geometry.getAttribute('position');
        for (let i = 0; i < this.retrogradeParticles.length; i++) {
          const v = this.retrogradeParticles[i];
          v.progress = (v.progress + dt * v.speed) % 1.0;
          const b = this.synapseBridges[v.bridgeIndex];
          if (b) {
            const p = b.postPt.clone().lerp(b.prePt, v.progress);
            rAttr.setXYZ(i, p.x, p.y, p.z);
          }
        }
        rAttr.needsUpdate = true;
      }
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

})(window);
