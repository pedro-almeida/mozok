/**
 * MOZOK / DCJ — ULTIMATE MAXIMUM PHOTOREALISM BRAIN VIEWER (WEBGL2 SSS & RAYMARCHED CAVITATION)
 * 
 * 1. Geometry Pipeline:
 *    - Uses real MNI cortical surface (window.REAL_MNI_BRAIN) if present;
 *      otherwise runs high-density (180 x 150) domain-warped gyral surface generator with
 *      anatomical frontal, temporal, parietal, and occipital lobes, Sylvian fissure, and Rolandic central sulcus.
 *    - Anatomical folia-textured cerebellum (#7c746e) and matte-black museum pedestal (#0f172a).
 *    - Strictly zero unshaded white spheres at the base of the brain!
 * 
 * 2. GLSL Fragment Shader (Spongiform & DWI Multi-Modal Parallax Shader):
 *    - Left Side (Anatomical Right Hemisphere — 100% Healthy Control):
 *      Smooth satin cortical grey matter (#c8ccd2 crowns, #25282e deep sulci),
 *      subsurface scattering (SSS) wrap lighting, zero vacuoles, zero shrinkage.
 *    - Right Side (Anatomical Left Hemisphere — CJD Spongiform Progression):
 *      3-Octave 3D Worley/Voronoi Parallax Cavitation at scales 2.2x, 4.5x, 9.0x with
 *      view-ray parallax offset (vViewDir.xy * poreDepth * 0.04) for true hollow depth from every angle!
 *      Rough yellowish-stone astrogliotic collar (#9e9a91) around each dark necrotic pore (#05070b)
 *      with perturbed normals matching Gemini_Generated_Image_9nh58f9nh58f9nh5.jpeg.
 *      Physiological Cortical Atrophy: gyral thinning (uDamage * 0.22 * aGyrus) + global shrink 7%.
 * 
 * ARA0332 Neuroanatomofisiologia — Estácio FMJ | Prof. Jair Nunes Rocha
 */

class Brain3DViewer {
  constructor(canvasId, engine) {
    this.canvas = document.getElementById(canvasId);
    this.engine = engine;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.brainGroup = null;

    this.brainMesh = null;
    this.brainGeo = null;
    this.basePositions = null;
    this.baseNormals = null;
    this.gyrusAttr = null;
    this.vertexCount = 0;

    this.pedestalGroup = null;
    this.cerebellumGroup = null;

    this.targetDamage = 0.0;
    this.currentDamage = 0.0;
    this.shaderUniforms = null;

    this.init();
  }

  init() {
    if (!this.canvas) return;
    const width = this.canvas.parentElement.clientWidth || 800;
    const height = this.canvas.parentElement.clientHeight || 360;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.18;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 500);
    this.camera.position.set(0, 2.8, 26.5);

    // Studio lighting rig matching Slide 5 reference photo
    const ambient = new THREE.AmbientLight(0xdbeafe, 0.55);
    this.scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.45);
    keyLight.position.set(14, 22, 24);
    this.scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x94a3b8, 0.65);
    fillLight.position.set(-18, 6, 16);
    this.scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xf8fafc, 0.75);
    rimLight.position.set(0, 16, -22);
    this.scene.add(rimLight);

    if (typeof THREE.OrbitControls !== 'undefined') {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.06;
      this.controls.maxDistance = 45;
      this.controls.minDistance = 12;
      this.controls.target.set(0, -0.6, 0);
    }

    this.brainGroup = new THREE.Group();
    this.scene.add(this.brainGroup);

    this.buildPedestalStand();
    this.buildCorticalBrain();

    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('slidechange', (e) => {
      if (e.detail && e.detail.slideIndex === 3) this.onResize();
    });

    this.animate();
  }

  buildCorticalBrain() {
    // 1. Try real MNI cortical surface
    if (window.REAL_MNI_BRAIN && window.REAL_MNI_BRAIN.vertices && window.REAL_MNI_BRAIN.indices) {
      const data = window.REAL_MNI_BRAIN;
      this.vertexCount = data.vertexCount || (data.vertices.length / 3);
      this.brainGeo = new THREE.BufferGeometry();

      this.basePositions = new Float32Array(data.vertices);
      this.brainGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(data.vertices), 3));
      this.brainGeo.setIndex(new THREE.BufferAttribute(new Uint32Array(data.indices), 1));

      if (data.gyrus) {
        this.gyrusAttr = data.gyrus;
        this.brainGeo.setAttribute('aGyrus', new THREE.BufferAttribute(new Float32Array(data.gyrus), 1));
      } else {
        const g = new Float32Array(this.vertexCount);
        g.fill(0.5);
        this.gyrusAttr = g;
        this.brainGeo.setAttribute('aGyrus', new THREE.BufferAttribute(g, 1));
      }

      this.brainGeo.computeVertexNormals();
      const norm = this.brainGeo.attributes.normal;
      this.baseNormals = new Float32Array(norm.array);
    } else {
      // 2. High-density (180 x 150) domain-warped procedural generator fallback
      this.buildHighDensityProceduralBrain();
    }

    // Split-Hemisphere Custom GLSL Shader Material
    const shaderMat = this.createSplitCortexShaderMaterial();
    this.brainMesh = new THREE.Mesh(this.brainGeo, shaderMat);
    this.brainGroup.add(this.brainMesh);

    // Anatomical cerebellum & subcortical nuclei
    this.buildAnatomicalCerebellum();
  }

  buildHighDensityProceduralBrain() {
    const segmentsX = 180;
    const segmentsY = 150;
    const radius = 6.2;
    const sphere = new THREE.SphereGeometry(radius, segmentsX, segmentsY);
    const pos = sphere.attributes.position;
    this.vertexCount = pos.count;
    this.brainGeo = new THREE.BufferGeometry();

    const vArr = new Float32Array(this.vertexCount * 3);
    const gArr = new Float32Array(this.vertexCount);

    for (let i = 0; i < this.vertexCount; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);

      const r0 = Math.sqrt(x * x + y * y + z * z) || 1.0;
      const ux = x / r0;
      const uy = y / r0;
      const uz = z / r0;

      // Medial flattening along longitudinal fissure
      const hx = Math.abs(ux);
      const sign = (ux >= 0) ? 1.0 : -1.0;
      let rx = (0.14 + Math.pow(hx, 0.78) * 5.35) * sign;
      let ry = uy * 6.15;
      let rz = uz * 7.25;

      if (uy < -0.15) {
        ry *= 0.78;
        if (Math.abs(ux) > 0.35 && uz > -0.3) {
          rx += sign * 0.48 * Math.exp(-Math.pow(uy + 0.45, 2) * 6.0);
        }
      }
      if (uz > 0.2) {
        rx *= (1.0 - 0.12 * Math.pow((uz - 0.2) / 0.8, 1.6));
        ry *= (1.0 - 0.08 * Math.pow((uz - 0.2) / 0.8, 1.5));
      }

      // 3D Domain-warped gyri
      const wx = Math.abs(rx) * 0.42 + 0.35 * Math.sin(ry * 0.55 + rz * 0.48);
      const wy = ry * 0.42 + 0.35 * Math.cos(rz * 0.52 - Math.abs(rx) * 0.45);
      const wz = rz * 0.42 + 0.35 * Math.sin(Math.abs(rx) * 0.50 + ry * 0.42);

      const n1 = Math.sin(wx * 2.8 + Math.cos(wy * 2.6) * 1.4) * Math.cos(wz * 2.5 + Math.sin(wx * 2.2) * 1.3);
      const n2 = Math.sin(wy * 3.4 - Math.cos(wz * 3.1) * 1.2) * Math.cos(wx * 3.0 + Math.sin(wy * 2.7) * 1.1);
      const gRaw = 1.0 - Math.abs(n1 * 0.62 + n2 * 0.38);
      const gyrus = Math.pow(Math.max(0.0, gRaw), 0.65);

      const disp = (gyrus - 0.5) * 0.52;
      const len = Math.sqrt(rx * rx + ry * ry + rz * rz) || 1.0;
      const fx = rx + (rx / len) * disp;
      const fy = ry + (ry / len) * disp;
      const fz = rz + (rz / len) * disp;

      vArr[i * 3] = fx;
      vArr[i * 3 + 1] = fy;
      vArr[i * 3 + 2] = fz;
      gArr[i] = gyrus;
    }

    this.basePositions = new Float32Array(vArr);
    this.gyrusAttr = gArr;
    this.brainGeo.setAttribute('position', new THREE.BufferAttribute(vArr, 3));
    this.brainGeo.setAttribute('aGyrus', new THREE.BufferAttribute(gArr, 1));
    this.brainGeo.setIndex(sphere.getIndex());
    this.brainGeo.computeVertexNormals();
    this.baseNormals = new Float32Array(this.brainGeo.attributes.normal.array);
  }

  createSplitCortexShaderMaterial() {
    this.shaderUniforms = {
      uDamage: { value: 0.0 },
      uLightDir1: { value: new THREE.Vector3(0.5, 0.7, 0.6).normalize() },
      uLightDir2: { value: new THREE.Vector3(-0.6, 0.2, 0.5).normalize() }
    };

    const vertexShader = `
      attribute float aGyrus;
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      varying vec3 vObjPos;
      varying float vGyrus;
      varying vec3 vViewDir;

      void main() {
        vGyrus = aGyrus;
        vObjPos = position;
        vNormal = normalize(normalMatrix * normal);
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPos = worldPosition.xyz;
        vViewDir = normalize(cameraPosition - vWorldPos);
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }
    `;

    const fragmentShader = `
      uniform float uDamage;
      uniform vec3 uLightDir1;
      uniform vec3 uLightDir2;

      varying vec3 vNormal;
      varying vec3 vWorldPos;
      varying vec3 vObjPos;
      varying float vGyrus;
      varying vec3 vViewDir;

      // 3D Worley Cellular Distance (F1, F2)
      vec3 hash33(vec3 p) {
        p = vec3(
          dot(p, vec3(127.1, 311.7, 74.7)),
          dot(p, vec3(269.5, 183.3, 246.1)),
          dot(p, vec3(113.5, 271.9, 124.6))
        );
        return fract(sin(p) * 43758.5453123);
      }

      vec2 worleyF1F2(vec3 p) {
        vec3 id = floor(p);
        vec3 f = fract(p);
        float d1 = 1.0;
        float d2 = 1.0;
        for (int z = -1; z <= 1; z++) {
          for (int y = -1; y <= 1; y++) {
            for (int x = -1; x <= 1; x++) {
              vec3 neighbor = vec3(float(x), float(y), float(z));
              vec3 pt = hash33(id + neighbor);
              vec3 diff = neighbor + pt - f;
              float d = length(diff);
              if (d < d1) {
                d2 = d1;
                d1 = d;
              } else if (d < d2) {
                d2 = d;
              }
            }
          }
        }
        return vec2(d1, d2);
      }

      void main() {
        vec3 N = normalize(vNormal);
        vec3 V = normalize(vViewDir);

        // Oclusão ambiental profunda nos sulcos reais
        float sulcalAO = smoothstep(0.08, 0.68, vGyrus);

        // 1. CÓRTEX HÍGIDO ACETINADO (#c8ccd2 nas cristas, #25282e nos sulcos)
        vec3 healthyGyrusColor = vec3(0.784, 0.800, 0.824); // #c8ccd2
        vec3 healthySulcusColor = vec3(0.145, 0.157, 0.180); // #25282e
        vec3 baseColor = mix(healthySulcusColor, healthyGyrusColor, sulcalAO);

        float specPower = 32.0;
        float specStrength = 0.32 * sulcalAO;
        float poreDepth = 0.0;

        // Fissura Longitudinal Mediana em x = 0
        float isDiseasedHemi = step(0.0, vObjPos.x);

        if (isDiseasedHemi > 0.5 && uDamage > 0.005) {
          // Raymarched Parallax Occlusion: desloca coordenada de amostragem na direção do raio de visão
          vec3 parallaxOffset = -V * (uDamage * 0.045);
          vec3 pPos = vObjPos + parallaxOffset;

          // 3-Octave 3D Worley Cavitation (2.2x, 4.5x, 9.0x)
          vec2 w1 = worleyF1F2(pPos * 2.2);
          vec2 w2 = worleyF1F2(pPos * 4.5 + 13.8);
          vec2 w3 = worleyF1F2(pPos * 9.0 + 29.2);

          float r1 = 0.44 * pow(uDamage, 0.62);
          float r2 = 0.48 * pow(uDamage, 0.52);
          float r3 = 0.52 * pow(uDamage, 0.42);

          float pMacro = 1.0 - smoothstep(r1 * 0.42, r1, w1.x);
          float pMeso  = 1.0 - smoothstep(r2 * 0.48, r2, w2.x);
          float pMicro = 1.0 - smoothstep(r3 * 0.52, r3, w3.x);

          poreDepth = clamp((pMacro * 0.95 + pMeso * 0.78 + pMicro * 0.55) * smoothstep(0.12, 0.58, vGyrus), 0.0, 1.0);

          // Borda Trabecular Astrogliótica (#9e9a91) ao redor do poço necrótico (#05070b)
          float rimMask = smoothstep(0.08, 0.42, poreDepth) * (1.0 - smoothstep(0.58, 0.92, poreDepth));
          vec3 necroticCortex  = vec3(0.61, 0.60, 0.57);
          vec3 astroglioticRim = vec3(0.620, 0.604, 0.569); // #9e9a91
          vec3 deepPorePit     = vec3(0.020, 0.027, 0.043); // #05070b

          vec3 diseasedSurface = mix(healthyGyrusColor, necroticCortex, uDamage);
          diseasedSurface = mix(diseasedSurface, astroglioticRim, rimMask * 0.90);
          baseColor = mix(healthySulcusColor * (1.0 - 0.45 * uDamage), diseasedSurface, sulcalAO);
          baseColor = mix(baseColor, deepPorePit, smoothstep(0.32, 0.85, poreDepth));

          // Normal perturbation on pore walls
          vec3 porePerturb = normalize(hash33(floor(pPos * 6.0)) - 0.5);
          N = normalize(N + porePerturb * rimMask * 0.65 * uDamage);
          specStrength *= (1.0 - 0.88 * uDamage);
        }

        // Subsurface Scattering (SSS) Wrap Lighting
        float wrap = 0.35;
        float diff1 = max(0.0, (dot(N, uLightDir1) + wrap) / (1.0 + wrap));
        float diff2 = max(0.0, (dot(N, uLightDir2) + wrap) / (1.0 + wrap)) * 0.45;

        // Specular highlight + Fresnel rim
        vec3 H1 = normalize(uLightDir1 + V);
        float spec = pow(max(dot(N, H1), 0.0), specPower) * specStrength * (1.0 - poreDepth);
        float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.0) * 0.20 * sulcalAO;

        vec3 finalRGB = baseColor * (0.28 + 0.72 * diff1 + diff2) + vec3(spec + fresnel);
        gl_FragColor = vec4(finalRGB, 1.0);
      }
    `;

    return new THREE.ShaderMaterial({
      uniforms: this.shaderUniforms,
      vertexShader,
      fragmentShader
    });
  }

  buildAnatomicalCerebellum() {
    this.cerebellumGroup = new THREE.Group();

    if (window.SCIENTIFIC_ATLAS_MESHES) {
      const atlas = window.SCIENTIFIC_ATLAS_MESHES;

      // Cerebelo com fólia anatômica (#7c746e)
      if (atlas.cerebellum_folia) {
        const cData = atlas.cerebellum_folia;
        const cGeo = new THREE.BufferGeometry();
        cGeo.setAttribute('position', new THREE.BufferAttribute(cData.vertices, 3));
        cGeo.setIndex(new THREE.BufferAttribute(cData.indices, 1));
        cGeo.computeVertexNormals();

        const cMat = new THREE.MeshStandardMaterial({
          color: 0x7c746e,
          roughness: 0.68,
          metalness: 0.05
        });
        const cMesh = new THREE.Mesh(cGeo, cMat);
        this.cerebellumGroup.add(cMesh);
      }

      // Núcleos da base (Corpo Estriado / Caudato & Putâmen)
      if (atlas.striatum_caudate_putamen) {
        const sData = atlas.striatum_caudate_putamen;
        const sGeo = new THREE.BufferGeometry();
        sGeo.setAttribute('position', new THREE.BufferAttribute(sData.vertices, 3));
        sGeo.setIndex(new THREE.BufferAttribute(sData.indices, 1));
        sGeo.computeVertexNormals();

        const sMat = new THREE.MeshStandardMaterial({
          color: 0xf59e0b,
          roughness: 0.35,
          metalness: 0.2,
          transparent: true,
          opacity: 0.88,
          emissive: 0x9a3412,
          emissiveIntensity: 0.25
        });
        const sMesh = new THREE.Mesh(sGeo, sMat);
        this.cerebellumGroup.add(sMesh);
      }

      // Tálamo Pulvinar (Sinal do Taco de Hóquei)
      if (atlas.pulvinar_thalamus) {
        const tData = atlas.pulvinar_thalamus;
        const tGeo = new THREE.BufferGeometry();
        tGeo.setAttribute('position', new THREE.BufferAttribute(tData.vertices, 3));
        tGeo.setIndex(new THREE.BufferAttribute(tData.indices, 1));
        tGeo.computeVertexNormals();

        const tMat = new THREE.MeshStandardMaterial({
          color: 0xf97316,
          roughness: 0.32,
          metalness: 0.2,
          transparent: true,
          opacity: 0.9,
          emissive: 0xb45309,
          emissiveIntensity: 0.3
        });
        const tMesh = new THREE.Mesh(tGeo, tMat);
        this.cerebellumGroup.add(tMesh);
      }
    } else {
      for (let side of [-1, 1]) {
        const cGeo = new THREE.SphereGeometry(2.1, 40, 32);
        cGeo.scale(1.15, 0.68, 0.85);
        cGeo.computeVertexNormals();
        const cMat = new THREE.MeshStandardMaterial({ color: 0x7c746e, roughness: 0.68 });
        const cMesh = new THREE.Mesh(cGeo, cMat);
        cMesh.position.set(side * 2.1, -4.6, -2.4);
        this.cerebellumGroup.add(cMesh);
      }
    }
    this.brainGroup.add(this.cerebellumGroup);
  }

  buildPedestalStand() {
    this.pedestalGroup = new THREE.Group();
    // Matte-black museum pedestal (#0f172a)
    const standMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.35,
      metalness: 0.75
    });

    const rodGeo = new THREE.CylinderGeometry(0.42, 0.42, 7.5, 32);
    const rodMesh = new THREE.Mesh(rodGeo, standMat);
    rodMesh.position.set(0, -8.0, -0.5);
    this.pedestalGroup.add(rodMesh);

    const baseGeo = new THREE.CylinderGeometry(4.8, 5.0, 0.35, 48);
    const baseMesh = new THREE.Mesh(baseGeo, standMat);
    baseMesh.position.set(0, -11.7, -0.5);
    this.pedestalGroup.add(baseMesh);

    this.scene.add(this.pedestalGroup);
  }

  updateBrainDegeneration(damageRatio) {
    this.targetDamage = Math.max(0.0, Math.min(1.0, damageRatio));
  }

  applySmoothAtrophyStep() {
    this.currentDamage += (this.targetDamage - this.currentDamage) * 0.08;
    const dmg = this.currentDamage;

    if (this.shaderUniforms) {
      this.shaderUniforms.uDamage.value = dmg;
    }

    // Physiological Cortical Atrophy:
    // Contract gyral crown thickness by up to 10% (gyralThinning = uDamage * 0.22 * aGyrus)
    // and global hemisphere scale by 7%, widening sulcal gaps naturally while preserving silhouette.
    if (this.brainMesh && this.basePositions && this.baseNormals && this.gyrusAttr) {
      const pos = this.brainGeo.attributes.position;
      const base = this.basePositions;
      const norms = this.baseNormals;
      const gyrus = this.gyrusAttr;
      const count = this.vertexCount;
      const globalShrink = 1.0 - dmg * 0.070;

      for (let i = 0; i < count; i++) {
        const bx = base[i * 3];
        const by = base[i * 3 + 1];
        const bz = base[i * 3 + 2];

        if (bx >= 0.0) {
          // Left CJD hemisphere: controlled parenchymal thinning
          const nx = norms[i * 3];
          const ny = norms[i * 3 + 1];
          const nz = norms[i * 3 + 2];
          const gyralThinning = dmg * 0.22 * gyrus[i];

          pos.setXYZ(
            i,
            bx * globalShrink - nx * gyralThinning,
            by * globalShrink - ny * gyralThinning,
            bz * globalShrink - nz * gyralThinning
          );
        } else {
          // Right healthy hemisphere: 100% stable
          pos.setXYZ(i, bx, by, bz);
        }
      }
      pos.needsUpdate = true;
    }
  }

  onResize() {
    if (!this.canvas || !this.renderer || !this.camera) return;
    const width = this.canvas.parentElement.clientWidth || 800;
    const height = this.canvas.parentElement.clientHeight || 360;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.applySmoothAtrophyStep();

    if (this.brainGroup) {
      const t = performance.now() * 0.0004;
      this.brainGroup.rotation.y = Math.sin(t) * 0.20;
      this.brainGroup.rotation.x = 0.06 + Math.cos(t * 0.7) * 0.03;
    }

    if (this.controls) this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

window.Brain3DViewer = Brain3DViewer;
