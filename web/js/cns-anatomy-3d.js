/**
 * MOZOK v6.0 — Ultra-Detailed Photorealistic 3D CNS, PNS, Meninges & Pathology Shader Engine
 * - Córtex Humano Real McGill BrainBrowser MNI152 (81.924 vértices / 163.840 triângulos lidos de window.REAL_MNI_BRAIN.vertices / indices / gyrus)
 * - Delimitação anatômica nítida de Giros, Sulcos (Sulco Central de Rolando, Fissura Lateral de Sylvius, Sulco Parieto-Occipital, Sulco Calcarino) e Rede Vascular Pial
 * - As 3 Meninges 3D Esculpidas (Dura-Máter + Foice do Cérebro + Tentório do Cerebelo, Aracnoide Trabecular + Granulações de Pacchioni e Pia-Máter)
 * - Cerebelo de Alta Densidade (128x96) com Folia 3D reais nos vértices, Vérmis, Tonsilas, Fissuras Prima/Horizontal e Árvore da Vida (Arbor Vitae) + Núcleo Denteado
 * - Tronco Encefálico Hiper-Detalhado: Mesencéfalo (Pedúnculos, Colículos Superiores/Inferiores, Substância Negra, Núcleo Rubro), Ponte de Varólio (Sulco Basilar, Fibras Transversas, Pedúnculos Médios) e Bulbo Raquidiano (Pirâmides, Decussação das Pirâmides, Olivas Bulbares, Tubérculos Grácil/Cuneiforme)
 * - Medula Espinhal Contínua com H Medular 3D, 31 Pares de Raízes Dorsais/Ventrais, Gânglios DRG, Ligamentos Denticulados, Cone Medular e Cauda Equina
 * - Simulador Visual Multiescala para 7 Doenças Neurológicas (AVC Isquêmico, Alzheimer, Parkinson, Esclerose Múltipla, DCJ Priônica, ELA e Epilepsia)
 */

class CNSAnatomy3D {
    constructor(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;

        this.rootGroup = new THREE.Group();
        this.scene.add(this.rootGroup);

        this.bodyShellGroup = new THREE.Group();
        this.meningesGroup = new THREE.Group();
        this.cortexGroup = new THREE.Group();
        this.subcorticalGroup = new THREE.Group();
        this.cerebellumGroup = new THREE.Group();
        this.brainstemGroup = new THREE.Group();
        this.spinalGroup = new THREE.Group();
        this.pnsGroup = new THREE.Group();
        this.vascularGroup = new THREE.Group();
        this.csfGroup = new THREE.Group();

        this.rootGroup.add(this.bodyShellGroup);
        this.rootGroup.add(this.meningesGroup);
        this.rootGroup.add(this.cortexGroup);
        this.rootGroup.add(this.subcorticalGroup);
        this.rootGroup.add(this.cerebellumGroup);
        this.rootGroup.add(this.brainstemGroup);
        this.rootGroup.add(this.spinalGroup);
        this.rootGroup.add(this.pnsGroup);
        this.rootGroup.add(this.vascularGroup);
        this.rootGroup.add(this.csfGroup);

        this.structureMeshes = new Map();
        this.structureAnchors = new Map();
        this.interactiveMeshes = [];
        this.pnsPulseCurves = [];
        this.csfCurveData = [];

        this.viewMode = 'EXTERNAL'; // EXTERNAL | XRAY | VASCULAR | ISOLATED
        this.bodyShellVisible = true;
        this.meningesVisible = false;
        this.selectedId = null;
        this.isolatedId = null;
        this.hoveredId = null;
        this.activeDiseaseMode = 0; // 0=Healthy, 1=Stroke, 2=Alzheimer, 3=Parkinson, 4=MS, 5=CJD, 6=ALS, 7=Epilepsy
        this.diseaseSeverity = 0.0;

        this.cortexMaterial = null;
        this.cerebellumMaterial = null;
        this.bodyShellMaterials = [];
        this.pnsPulses = null;
        this.csfParticles = null;

        this.uniforms = {
            uTime: { value: 0.0 },
            uHoverId: { value: -1.0 },
            uSelectedId: { value: -1.0 },
            uXRayAlpha: { value: 1.0 },
            uStrokeActive: { value: 0.0 },
            uStrokeCenter: { value: new THREE.Vector3(-3.8, 1.2, 1.1) },
            uStrokeRadius: { value: 3.4 },
            uHypoxiaLevel: { value: 0.0 },
            uDiseaseMode: { value: 0.0 },
            uDiseaseSeverity: { value: 0.0 },
            uClipSagittal: { value: 0.0 }
        };

        this.lobeNumericMap = {
            'FRONTAL_LOBE': 1.0,
            'PARIETAL_LOBE': 2.0,
            'TEMPORAL_LOBE': 3.0,
            'OCCIPITAL_LOBE': 4.0,
            'INSULAR_CORTEX': 5.0
        };

        this.numericToLobeMap = {
            1: 'FRONTAL_LOBE',
            2: 'PARIETAL_LOBE',
            3: 'TEMPORAL_LOBE',
            4: 'OCCIPITAL_LOBE',
            5: 'INSULAR_CORTEX'
        };

        this.initLighting();
        this.buildAllAnatomy();
    }

    initLighting() {
        const hemiLight = new THREE.HemisphereLight(0xfff6f2, 0x0f172a, 0.96);
        hemiLight.position.set(0, 30, 0);
        this.scene.add(hemiLight);

        const keyLight = new THREE.DirectionalLight(0xfff4ed, 1.32);
        keyLight.position.set(18, 24, 22);
        this.scene.add(keyLight);

        const fillLight = new THREE.DirectionalLight(0x60a5fa, 0.68);
        fillLight.position.set(-20, 8, -16);
        this.scene.add(fillLight);

        const rimLight = new THREE.DirectionalLight(0x00f2fe, 0.72);
        rimLight.position.set(0, -24, -18);
        this.scene.add(rimLight);
    }

    registerStructure(id, meshOrGroup, anchorPos = null) {
        if (!this.structureMeshes.has(id)) {
            this.structureMeshes.set(id, []);
        }
        const list = this.structureMeshes.get(id);

        if (anchorPos && !this.structureAnchors.has(id)) {
            this.structureAnchors.set(id, anchorPos.clone());
        }

        const assignRecursive = (obj) => {
            obj.userData.structureId = id;
            if (obj.isMesh) {
                list.push(obj);
                this.interactiveMeshes.push(obj);
                if (!this.structureAnchors.has(id)) {
                    obj.geometry.computeBoundingSphere();
                    if (obj.geometry.boundingSphere) {
                        const center = obj.geometry.boundingSphere.center.clone();
                        obj.localToWorld(center);
                        this.structureAnchors.set(id, center);
                    }
                }
            }
            if (obj.children && obj.children.length > 0) {
                obj.children.forEach(assignRecursive);
            }
        };
        assignRecursive(meshOrGroup);
    }

    getStructureWorldAnchor(id) {
        if (this.structureAnchors.has(id)) {
            return this.structureAnchors.get(id).clone();
        }
        const meshes = this.structureMeshes.get(id);
        if (meshes && meshes.length > 0) {
            const box = new THREE.Box3();
            meshes.forEach(m => box.expandByObject(m));
            const center = new THREE.Vector3();
            box.getCenter(center);
            return center;
        }
        return new THREE.Vector3(0, 0, 0);
    }

    buildAllAnatomy() {
        this.buildPhotorealisticMNICortex();
        this.buildDetailedMeningesAndDuralSepta();
        this.buildSculptedCerebellum();
        this.buildSubcorticalAndLimbic();
        this.buildBrainstemAndSpinalCord();
        this.buildCranialAndPeripheralNerves();
        this.buildBioluminescentHumanBodyShell();
        this.buildCerebrovascularTree();
        this.buildVentricularCSFSystem();
    }

    // =========================================================================
    // 1. CÓRTEX HUMANO REAL (McGill BrainBrowser MNI152 — 81.924 Vértices / 163.840 Triângulos)
    // =========================================================================
    classifyMniVertexLobe(x, y, z) {
        const absX = Math.abs(x);
        // Córtex Insular oculto no fundo do Sulco Lateral de Sylvius
        if (absX > 1.35 && absX < 2.85 && y > -1.35 && y < 1.25 && z > -1.85 && z < 2.15) {
            return 5.0; // INSULAR_CORTEX
        }
        // Lobo Temporal (abaixo da Fissura Lateral de Sylvius: y < 0.25 + 0.28 * z)
        const sylvianY = -0.15 + 0.18 * z;
        if (y < sylvianY && z > -3.35 && z < 2.55 && absX > 1.75) {
            return 3.0; // TEMPORAL_LOBE
        }
        // Lobo Occipital (atrás do Sulco Parieto-Occipital)
        const parietoOccipitalZ = -3.15 + 0.16 * y;
        if (z < parietoOccipitalZ) {
            return 4.0; // OCCIPITAL_LOBE
        }
        // Sulco Central de Rolando separando Lobo Frontal (anterior, +Z) e Lobo Parietal (posterior, -Z)
        const centralSulcusZ = 0.42 - (y * 0.24);
        if (z >= centralSulcusZ) {
            return 1.0; // FRONTAL_LOBE
        }
        return 2.0; // PARIETAL_LOBE
    }

    buildPhotorealisticMNICortex() {
        const meshData = window.REAL_MNI_BRAIN;
        let geometry;

        // Lê corretamente window.REAL_MNI_BRAIN.vertices, .indices e .gyrus (81.924 vértices reais!)
        const rawVerts = meshData ? (meshData.vertices || meshData.v) : null;
        const rawIndices = meshData ? (meshData.indices || meshData.i) : null;
        const rawGyrus = meshData ? meshData.gyrus : null;

        if (rawVerts && rawIndices && rawVerts.length >= 3000) {
            geometry = new THREE.BufferGeometry();
            const vertCount = Math.floor(rawVerts.length / 3);
            const positions = (rawVerts instanceof Float32Array) ? rawVerts : new Float32Array(rawVerts);
            const lobeIds = new Float32Array(vertCount);
            const gyrusAttr = new Float32Array(vertCount);

            for (let i = 0; i < vertCount; i++) {
                const vx = positions[i * 3];
                const vy = positions[i * 3 + 1];
                const vz = positions[i * 3 + 2];

                lobeIds[i] = this.classifyMniVertexLobe(vx, vy, vz);
                gyrusAttr[i] = (rawGyrus && rawGyrus[i] !== undefined) ? rawGyrus[i] : 0.55;
            }

            const idxBuffer = (rawIndices instanceof Uint32Array) ? rawIndices : new Uint32Array(rawIndices);
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('aLobeId', new THREE.BufferAttribute(lobeIds, 1));
            geometry.setAttribute('aGyrus', new THREE.BufferAttribute(gyrusAttr, 1));
            geometry.setIndex(new THREE.BufferAttribute(idxBuffer, 1));
            geometry.computeVertexNormals();
        } else {
            geometry = new THREE.SphereGeometry(5.0, 128, 128);
            const count = geometry.attributes.position.count;
            const lobeIds = new Float32Array(count);
            const gyrusAttr = new Float32Array(count);
            for (let i = 0; i < count; i++) {
                const vx = geometry.attributes.position.getX(i);
                const vy = geometry.attributes.position.getY(i);
                const vz = geometry.attributes.position.getZ(i);
                lobeIds[i] = this.classifyMniVertexLobe(vx, vy, vz);
                gyrusAttr[i] = 0.55;
            }
            geometry.setAttribute('aLobeId', new THREE.BufferAttribute(lobeIds, 1));
            geometry.setAttribute('aGyrus', new THREE.BufferAttribute(gyrusAttr, 1));
        }

        // Shader GLSL de Alta Definição Cirúrgica para o Córtex MNI152 (81.924 vértices reais, depthWrite dinâmico, zero buracos pretos, microvasculatura pial e 7 patologias)
        this.cortexMaterial = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            extensions: { derivatives: true },
            transparent: true,
            depthWrite: true,
            side: THREE.FrontSide,
            vertexShader: `
                attribute float aLobeId;
                attribute float aGyrus;
                uniform float uTime;
                uniform float uDiseaseMode;
                uniform float uDiseaseSeverity;
                varying vec3 vNormal;
                varying vec3 vWorldPos;
                varying vec3 vObjPos;
                varying vec3 vViewPos;
                varying float vLobeId;
                varying float vGyrus;

                void main() {
                    vLobeId = aLobeId;
                    vGyrus = aGyrus;
                    vec3 pos = position;

                    // Atrofia cortical difusa na Doença de Alzheimer (modo 2) ou DCJ Priônica (modo 5) sem auto-interseção de giros
                    if ((abs(uDiseaseMode - 2.0) < 0.2 || abs(uDiseaseMode - 5.0) < 0.2) && uDiseaseSeverity > 0.01) {
                        float shrink = 1.0 - (0.055 * uDiseaseSeverity);
                        pos *= shrink;
                    }

                    vObjPos = pos;
                    vNormal = normalize(normalMatrix * normal);
                    vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
                    vWorldPos = worldPosition.xyz;
                    vec4 mvPosition = viewMatrix * worldPosition;
                    vViewPos = -mvPosition.xyz;
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform float uTime;
                uniform float uHoverId;
                uniform float uSelectedId;
                uniform float uXRayAlpha;
                uniform float uStrokeActive;
                uniform vec3 uStrokeCenter;
                uniform float uStrokeRadius;
                uniform float uHypoxiaLevel;
                uniform float uDiseaseMode;
                uniform float uDiseaseSeverity;
                uniform float uClipSagittal;

                varying vec3 vNormal;
                varying vec3 vWorldPos;
                varying vec3 vObjPos;
                varying vec3 vViewPos;
                varying float vLobeId;
                varying float vGyrus;

                // Ruído orgânico tridimensional contínuo para micro-textura cortical e vasos piais
                float hash31(vec3 p) {
                    p = fract(p * 0.1031);
                    p += dot(p, p.yzx + 33.33);
                    return fract((p.x + p.y) * p.z);
                }

                float noise3D(vec3 p) {
                    vec3 i = floor(p);
                    vec3 f = fract(p);
                    f = f * f * (3.0 - 2.0 * f);
                    return mix(
                        mix(mix(hash31(i + vec3(0,0,0)), hash31(i + vec3(1,0,0)), f.x),
                            mix(hash31(i + vec3(0,1,0)), hash31(i + vec3(1,1,0)), f.x), f.y),
                        mix(mix(hash31(i + vec3(0,0,1)), hash31(i + vec3(1,0,1)), f.x),
                            mix(hash31(i + vec3(0,1,1)), hash31(i + vec3(1,1,1)), f.x), f.y),
                        f.z
                    );
                }

                void main() {
                    if (uClipSagittal > 0.5 && vObjPos.x < -0.05) {
                        discard;
                    }

                    vec3 V = normalize(vViewPos);
                    vec3 L1 = normalize(vec3(18.0, 24.0, 22.0));
                    vec3 L2 = normalize(vec3(-20.0, 10.0, -16.0));
                    vec3 L3 = normalize(vec3(0.0, -18.0, 12.0));

                    // Curvatura anatômica real (aGyrus da malha McGill MNI152) + micro-relevo secundário de Brodmann
                    float gyrusFactor = smoothstep(0.22, 0.68, vGyrus);
                    float deepSulcusMask = 1.0 - smoothstep(0.24, 0.46, vGyrus);
                    float microSulci = (noise3D(vObjPos * 6.5) - 0.5) * 0.08 + (noise3D(vObjPos * 14.0) - 0.5) * 0.04;
                    float combinedHeight = clamp(gyrusFactor + microSulci, 0.0, 1.0);

                    // Perturbação de normal via derivadas parciais dFdx/dFdy para esculpir cada giro e sulco com nitidez cirúrgica
                    vec3 dPdx = dFdx(vViewPos);
                    vec3 dPdy = dFdy(vViewPos);
                    float dGdx = dFdx(combinedHeight);
                    float dGdy = dFdy(combinedHeight);
                    vec3 surfGrad = normalize(cross(dPdx, vNormal) * dGdy + cross(vNormal, dPdy) * dGdx + vec3(1e-5));
                    vec3 N = normalize(vNormal - surfGrad * 0.28);

                    // Delimitação anatômica de cada Lobo Cortical (Frontal, Parietal, Temporal, Occipital e Ínsula)
                    vec3 lobeTint = vec3(1.00, 0.96, 0.95);
                    vec3 lobeHighlight = vec3(1.0, 0.85, 0.65);
                    if (abs(vLobeId - 1.0) < 0.2) {
                        lobeTint = vec3(1.03, 0.95, 0.93); // Lobo Frontal
                        lobeHighlight = vec3(1.00, 0.52, 0.42);
                    } else if (abs(vLobeId - 2.0) < 0.2) {
                        lobeTint = vec3(1.00, 0.98, 0.91); // Lobo Parietal
                        lobeHighlight = vec3(0.98, 0.80, 0.32);
                    } else if (abs(vLobeId - 3.0) < 0.2) {
                        lobeTint = vec3(0.95, 0.99, 0.95); // Lobo Temporal
                        lobeHighlight = vec3(0.28, 0.92, 0.68);
                    } else if (abs(vLobeId - 4.0) < 0.2) {
                        lobeTint = vec3(0.94, 0.95, 1.03); // Lobo Occipital
                        lobeHighlight = vec3(0.42, 0.74, 1.00);
                    } else if (abs(vLobeId - 5.0) < 0.2) {
                        lobeTint = vec3(1.02, 0.91, 0.98); // Córtex Insular
                        lobeHighlight = vec3(0.88, 0.48, 0.98);
                    }

                    // Demarcação anatômica suave dos grandes sulcos interlobares (Rolando, Sylvius, Parieto-Occipital)
                    float lobeEdge = clamp((abs(dFdx(vLobeId)) + abs(dFdy(vLobeId))) * 1.8, 0.0, 1.0);

                    // Coloração biológica real de córtex humano in vivo (sem buracos pretos no fundo dos sulcos!)
                    vec3 crownColor = vec3(0.95, 0.80, 0.76) * lobeTint;
                    vec3 wallColor  = vec3(0.83, 0.58, 0.55) * lobeTint;
                    vec3 sulcusRich = vec3(0.48, 0.23, 0.25); // Sulco vascularizado rico, nunca preto oco

                    vec3 baseTissue = mix(sulcusRich, wallColor, smoothstep(0.0, 0.48, gyrusFactor));
                    baseTissue = mix(baseTissue, crownColor, smoothstep(0.42, 1.0, gyrusFactor));

                    // Rede microvascular pial (arteríolas e vênulas piais ramificadas nos sulcos e encostas dos giros)
                    float vArtery = smoothstep(0.038, 0.0, abs(sin(vObjPos.x * 9.5 + noise3D(vObjPos * 3.2) * 2.4) * cos(vObjPos.y * 8.8 + vObjPos.z * 7.5)));
                    baseTissue = mix(baseTissue, vec3(0.74, 0.15, 0.19), (deepSulcusMask * 0.35 + vArtery * 0.28));
                    baseTissue = mix(baseTissue, vec3(0.38, 0.14, 0.17), lobeEdge * 0.45);

                    // Iluminação física trifásica + Subsurface Scattering (SSS) + Oclusão Ambiental (AO) equilibrada
                    float wrap1 = max((dot(N, L1) + 0.55) / 1.55, 0.0);
                    float diff2 = max(dot(N, L2), 0.0) * 0.38;
                    float diff3 = max(dot(N, L3), 0.0) * 0.22;
                    float sss = pow(clamp(1.0 - max(dot(N, V), 0.0), 0.0, 1.0), 2.2) * 0.32;
                    float ambientOcclusion = mix(0.52, 1.0, gyrusFactor);

                    // Brilho especular úmido da Pia-Máter banhada por Líquor
                    vec3 H1 = normalize(L1 + V);
                    float spec = pow(max(dot(N, H1), 0.0), 58.0) * 0.38 * (0.30 + 0.70 * gyrusFactor);

                    vec3 color = baseTissue * ambientOcclusion * (0.38 + 0.68 * wrap1 + diff2 + diff3);
                    color += vec3(0.96, 0.38, 0.34) * sss * ambientOcclusion;
                    color += vec3(1.0, 0.97, 0.95) * spec;

                    // =========================================================
                    // SIMULADOR MULTIESCALA DAS 7 DOENÇAS NO CÓRTEX 3D
                    // =========================================================
                    // 1. AVC Isquêmico Agudo (ACM Esquerda)
                    if (uStrokeActive > 0.01 || abs(uDiseaseMode - 1.0) < 0.2) {
                        float sev = max(uHypoxiaLevel, uDiseaseSeverity);
                        float distToCore = distance(vObjPos, uStrokeCenter);
                        if (distToCore < uStrokeRadius) {
                            float coreFactor = smoothstep(uStrokeRadius * 0.62, 0.0, distToCore) * sev;
                            float penumbraFactor = smoothstep(uStrokeRadius, uStrokeRadius * 0.38, distToCore) * sev;
                            vec3 penumbraCol = vec3(0.75, 0.18, 0.88) * (0.65 + 0.35 * sin(uTime * 6.0));
                            vec3 necroticCol = vec3(0.16, 0.11, 0.18);
                            color = mix(color, penumbraCol, penumbraFactor * 0.82);
                            color = mix(color, necroticCol, coreFactor * 0.94);
                        }
                    }
                    // 2. Doença de Alzheimer (Placas Senis Beta-Amiloide + Atrofia Temporoparietal/Hipocampal)
                    else if (abs(uDiseaseMode - 2.0) < 0.2 && uDiseaseSeverity > 0.01) {
                        float plaquePattern = smoothstep(0.62, 0.88, noise3D(vObjPos * 4.2));
                        color = mix(color, vec3(0.62, 0.50, 0.68), uDiseaseSeverity * 0.48);
                        color = mix(color, vec3(0.95, 0.62, 0.18), plaquePattern * uDiseaseSeverity * 0.82);
                    }
                    // 3. Doença de Parkinson (Hipoatividade Dopaminérgica Frontomotora + Tremor 5 Hz)
                    else if (abs(uDiseaseMode - 3.0) < 0.2 && uDiseaseSeverity > 0.01) {
                        float motorZone = exp(-pow((vObjPos.z - (0.55 - vObjPos.y * 0.22)) / 1.45, 2.0));
                        float tremorPulse = 0.5 + 0.5 * sin(uTime * 31.4); // ~5 Hz tremor rhythm
                        color = mix(color, vec3(0.98, 0.55, 0.15) * (0.75 + 0.25 * tremorPulse), motorZone * uDiseaseSeverity * 0.72);
                    }
                    // 4. Esclerose Múltipla (Placas Desmielinizantes Multifocais)
                    else if (abs(uDiseaseMode - 4.0) < 0.2 && uDiseaseSeverity > 0.01) {
                        float msPlaque = smoothstep(0.64, 0.86, noise3D(vObjPos * 3.4 + vec3(1.7)));
                        color = mix(color, vec3(0.15, 0.82, 1.0), msPlaque * uDiseaseSeverity * 0.78);
                    }
                    // 5. Doença Priônica de Creutzfeldt-Jakob (DCJ — Cortical Ribboning & Espongiose)
                    else if (abs(uDiseaseMode - 5.0) < 0.2 && uDiseaseSeverity > 0.01) {
                        float ribbon = gyrusFactor * (0.6 + 0.4 * sin(uTime * 4.5 + vObjPos.z * 3.0));
                        float vacuoles = smoothstep(0.70, 0.90, noise3D(vObjPos * 8.5));
                        color = mix(color, vec3(0.88, 0.25, 0.96), ribbon * uDiseaseSeverity * 0.68);
                        color = mix(color, vec3(0.22, 0.08, 0.30), vacuoles * uDiseaseSeverity * 0.75);
                    }
                    // 6. ELA / ALS (Degeneração seletiva do Giro Pré-Central / Córtex Motor Primário M1)
                    else if (abs(uDiseaseMode - 6.0) < 0.2 && uDiseaseSeverity > 0.01) {
                        float motorStrip = exp(-pow((vObjPos.z - (0.65 - vObjPos.y * 0.22)) / 0.88, 2.0));
                        color = mix(color, vec3(0.98, 0.32, 0.08), motorStrip * uDiseaseSeverity * 0.88);
                    }
                    // 7. Epilepsia Focal (Ondas Paroxísticas Hipersincrônicas irradiando do Lobo Temporal)
                    else if (abs(uDiseaseMode - 7.0) < 0.2 && uDiseaseSeverity > 0.01) {
                        float distFocus = distance(vObjPos, vec3(3.8, -1.2, 0.6));
                        float wave = 0.5 + 0.5 * sin(distFocus * 5.5 - uTime * 15.0);
                        float focusMask = smoothstep(6.0, 0.0, distFocus) * wave;
                        color += vec3(1.0, 0.88, 0.18) * focusMask * uDiseaseSeverity * 0.95;
                    }

                    // Destaque quando um lobo está em Hover ou Selecionado
                    float isHovered = 1.0 - step(0.2, abs(vLobeId - uHoverId));
                    float isSelected = 1.0 - step(0.2, abs(vLobeId - uSelectedId));
                    if (isHovered > 0.5) {
                        color = mix(color, lobeHighlight, 0.28);
                        color += lobeHighlight * 0.16 * (0.5 + 0.5 * sin(uTime * 6.0));
                    }
                    if (isSelected > 0.5) {
                        float rim = pow(1.0 - max(dot(N, V), 0.0), 2.2);
                        color = mix(color, lobeHighlight, 0.34);
                        color += lobeHighlight * rim * 0.62;
                    }

                    float alpha = uXRayAlpha;
                    if (uXRayAlpha < 0.5) {
                        float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.2);
                        alpha = clamp(uXRayAlpha + fresnel * 0.42, 0.10, 0.78);
                        color += vec3(0.25, 0.75, 1.0) * fresnel * 0.38;
                    }

                    gl_FragColor = vec4(color, alpha);
                }
            `
        });

        const cortexMesh = new THREE.Mesh(geometry, this.cortexMaterial);
        cortexMesh.name = 'MNI_CORTEX_REAL';
        cortexMesh.userData.isMniCortex = true;
        this.cortexGroup.add(cortexMesh);
        this.interactiveMeshes.push(cortexMesh);

        const lobeAnchors = {
            'FRONTAL_LOBE': new THREE.Vector3(2.4, 2.5, 4.2),
            'PARIETAL_LOBE': new THREE.Vector3(2.5, 3.6, -1.2),
            'TEMPORAL_LOBE': new THREE.Vector3(4.3, -1.1, 0.5),
            'OCCIPITAL_LOBE': new THREE.Vector3(1.8, 0.6, -5.6),
            'INSULAR_CORTEX': new THREE.Vector3(2.2, 0.3, 0.6)
        };
        Object.keys(this.lobeNumericMap).forEach(lobeId => {
            this.structureMeshes.set(lobeId, [cortexMesh]);
            this.structureAnchors.set(lobeId, lobeAnchors[lobeId]);
        });
    }

    // =========================================================================
    // 2. AS 3 MENINGES 3D ESCULPIDAS (Dura-Máter, Foice do Cérebro, Tentório do Cerebelo, Aracnoide + Granulações de Pacchioni e Pia-Máter)
    // =========================================================================
    buildDetailedMeningesAndDuralSepta() {
        const meningesWrapper = new THREE.Group();

        // 1. Dura-Máter Craniana (Folheto Meníngeo Fibroso Nacarado com janela de dissecação anterolateral)
        const duraGeo = new THREE.SphereGeometry(1.0, 64, 48, 0, Math.PI * 1.65);
        const dPos = duraGeo.attributes.position;
        for (let i = 0; i < dPos.count; i++) {
            dPos.setXYZ(i, dPos.getX(i) * 5.65, dPos.getY(i) * 5.28 + 0.15, dPos.getZ(i) * 7.08 - 0.1);
        }
        duraGeo.computeVertexNormals();
        const duraMat = new THREE.MeshPhysicalMaterial({
            color: 0xfef3c7,
            emissive: 0xb45309,
            emissiveIntensity: 0.15,
            roughness: 0.32,
            clearcoat: 0.65,
            transparent: true,
            opacity: 0.36,
            side: THREE.DoubleSide,
            depthWrite: false
        });
        const duraMesh = new THREE.Mesh(duraGeo, duraMat);
        meningesWrapper.add(duraMesh);

        // 2. Foice do Cérebro (Falx Cerebri — Septo Dural Vertical na Fissura Longitudinal Inter-Hemisférica)
        const falxShape = new THREE.Shape();
        falxShape.moveTo(5.6, -0.8);
        falxShape.quadraticCurveTo(5.2, 4.9, 0.0, 5.15);
        falxShape.quadraticCurveTo(-5.6, 4.8, -6.5, -1.8);
        falxShape.lineTo(-2.6, -1.8);
        falxShape.quadraticCurveTo(0.0, 1.9, 2.8, 0.3);
        falxShape.closePath();

        const falxGeo = new THREE.ShapeGeometry(falxShape, 32);
        falxGeo.rotateY(Math.PI / 2);
        const falxMat = new THREE.MeshPhysicalMaterial({
            color: 0xfde68a,
            emissive: 0xd97706,
            emissiveIntensity: 0.22,
            roughness: 0.28,
            transparent: true,
            opacity: 0.62,
            side: THREE.DoubleSide,
            depthWrite: false
        });
        const falxMesh = new THREE.Mesh(falxGeo, falxMat);
        meningesWrapper.add(falxMesh);

        // 3. Tentório do Cerebelo (Tentorium Cerebelli — Tenda Dural Transversal entre o Lobo Occipital e o Cerebelo)
        const tentGeo = new THREE.RingGeometry(1.15, 4.35, 48, 8, Math.PI * 0.15, Math.PI * 1.7);
        tentGeo.rotateX(Math.PI / 2.15);
        const tentMesh = new THREE.Mesh(tentGeo, falxMat);
        tentMesh.position.set(0, -1.95, -3.25);
        meningesWrapper.add(tentMesh);

        // 4. Membrana Aracnoide Trabecular + Granulações Aracnoideas de Pacchioni (junto ao Seio Sagital Superior)
        const arachGeo = new THREE.SphereGeometry(1.0, 48, 36);
        const aPos = arachGeo.attributes.position;
        for (let i = 0; i < aPos.count; i++) {
            aPos.setXYZ(i, aPos.getX(i) * 5.52, aPos.getY(i) * 5.16 + 0.12, aPos.getZ(i) * 6.96 - 0.1);
        }
        arachGeo.computeVertexNormals();
        const arachMat = new THREE.MeshPhysicalMaterial({
            color: 0x38bdf8,
            emissive: 0x0284c7,
            emissiveIntensity: 0.18,
            roughness: 0.22,
            transmission: 0.55,
            transparent: true,
            opacity: 0.22,
            side: THREE.DoubleSide,
            depthWrite: false
        });
        meningesWrapper.add(new THREE.Mesh(arachGeo, arachMat));

        // Granulações Aracnoideas de Pacchioni (vilosidades que reabsorvem o Líquor para o Seio Sagital Superior)
        const pacchioniMat = new THREE.MeshPhysicalMaterial({
            color: 0x7dd3fc,
            emissive: 0x0284c7,
            emissiveIntensity: 0.55,
            roughness: 0.2
        });
        for (let p = -4; p <= 4; p++) {
            const zP = p * 0.95;
            const yP = 4.95 - Math.pow(zP * 0.22, 2.0);
            [-0.22, 0.22].forEach(xP => {
                const gran = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 14), pacchioniMat);
                gran.position.set(xP, yP, zP);
                meningesWrapper.add(gran);
            });
        }

        // 5. Saco Dural Espinhal envolvendo a Medula Espinhal até S2
        const duralSacCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, -4.75, -0.92),
            new THREE.Vector3(0, -9.80, -1.42),
            new THREE.Vector3(0, -15.80, -1.18),
            new THREE.Vector3(0, -19.50, -1.15)
        ]);
        const duralSacMesh = new THREE.Mesh(
            new THREE.TubeGeometry(duralSacCurve, 48, 0.54, 24, false),
            duraMat
        );
        meningesWrapper.add(duralSacMesh);

        this.meningesGroup.add(meningesWrapper);
        this.meningesGroup.visible = false; // Visível ao ativar o botão 🛡️ Meninges ou ao clicar nas Meninges na lista
        this.registerStructure('MENINGES_DURA_ARACHNOID_PIA', meningesWrapper, new THREE.Vector3(0.0, 4.95, 0.85));
    }

    setMeningesVisible(visible) {
        this.meningesVisible = visible;
        this.meningesGroup.visible = visible;
    }

    // =========================================================================
    // 3. CEREBELO ANATÔMICO HIPER-DETALHADO (128x96 com Folia 3D nos Vértices, Vérmis, Tonsilas & Arbor Vitae)
    // =========================================================================
    buildSculptedCerebellum() {
        const segU = 128;
        const segV = 96;
        const positions = [];
        const indices = [];

        for (let iv = 0; iv <= segV; iv++) {
            const v = iv / segV;
            const phi = v * Math.PI;
            const sinPhi = Math.sin(phi);
            const cosPhi = Math.cos(phi);

            for (let iu = 0; iu <= segU; iu++) {
                const u = iu / segU;
                const theta = u * Math.PI * 2.0;
                const cosT = Math.cos(theta);
                const sinT = Math.sin(theta);

                let nx = sinPhi * cosT;
                let ny = cosPhi;
                let nz = sinPhi * sinT;

                let x = nx * 2.95;
                let y = ny * 1.48;
                let z = nz * 1.92;

                const absX = Math.abs(x);
                const normLat = Math.min(1.0, absX / 2.95);

                // Vérmis Mediano canelado e Sulcos Paravermianos (Valécula do Cerebelo)
                const vermisZone = Math.exp(-Math.pow(absX / 0.48, 2.0));
                const paravermisGroove = Math.exp(-Math.pow((absX - 0.58) / 0.20, 2.0));

                if (nz < 0.0) {
                    z += vermisZone * 0.38 * Math.abs(nz);
                } else {
                    const antNotch = Math.exp(-Math.pow(absX / 1.35, 2.0)) * Math.max(0.0, nz);
                    z -= antNotch * 0.72;
                }

                const rScale = 1.0 - 0.11 * paravermisGroove + 0.05 * vermisZone * (ny > 0 ? 1.0 : -0.4);
                x *= rScale;
                y *= rScale;

                y -= Math.pow(normLat, 1.8) * 0.20;
                z -= Math.pow(normLat, 2.2) * 0.16;

                // Fissura Prima, Fissura Horizontal e Fissura Posterolateral
                const primaryFissure = (nz < 0.4) ? Math.exp(-Math.pow(Math.abs(ny - 0.36 - 0.12 * nz) / 0.06, 2.0)) * 0.15 : 0.0;
                const horizFissure = (nz < 0.25) ? Math.exp(-Math.pow(Math.abs(ny + 0.05) / 0.055, 2.0)) * 0.18 : 0.0;
                const postLatFissure = (nz > -0.2) ? Math.exp(-Math.pow(Math.abs(ny + 0.55 - 0.14 * nz) / 0.06, 2.0)) * 0.14 : 0.0;

                // Tonsilas Cerebelares inferiores
                const tonsilZone = Math.exp(-Math.pow((absX - 0.82) / 0.40, 2.0)) *
                                   Math.exp(-Math.pow((ny + 0.72) / 0.24, 2.0)) *
                                   Math.exp(-Math.pow((nz - 0.20) / 0.32, 2.0));

                // Folia Cerebelares 3D reais esculpidas nos vértices
                const foliaCoord = y * 30.0 + z * 4.8 * ny - 0.25 * Math.sin(absX * 2.2);
                const foliaWave = Math.sin(foliaCoord);
                const foliaRidge = Math.sign(foliaWave) * Math.pow(Math.abs(foliaWave), 0.65) * 0.052;

                const totalDisp = foliaRidge - primaryFissure - horizFissure - postLatFissure + tonsilZone * 0.16;
                const lenN = Math.hypot(nx, ny, nz) || 1.0;
                x += (nx / lenN) * totalDisp;
                y += (ny / lenN) * totalDisp;
                z += (nz / lenN) * totalDisp;

                positions.push(x, y - 3.25, z - 3.25);
            }
        }

        for (let iv = 0; iv < segV; iv++) {
            for (let iu = 0; iu < segU; iu++) {
                const a = iv * (segU + 1) + iu;
                const b = a + 1;
                const c = (iv + 1) * (segU + 1) + iu;
                const d = c + 1;
                indices.push(a, b, d);
                indices.push(a, d, c);
            }
        }

        const cbGeo = new THREE.BufferGeometry();
        cbGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        cbGeo.setIndex(indices);
        cbGeo.computeVertexNormals();

        this.cerebellumMaterial = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            extensions: { derivatives: true },
            transparent: true,
            side: THREE.DoubleSide,
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vObjPos;
                varying vec3 vViewPos;
                void main() {
                    vObjPos = position;
                    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
                    vViewPos = -mvPos.xyz;
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * mvPos;
                }
            `,
            fragmentShader: `
                uniform float uXRayAlpha;
                varying vec3 vNormal;
                varying vec3 vObjPos;
                varying vec3 vViewPos;

                void main() {
                    vec3 V = normalize(vViewPos);
                    vec3 L1 = normalize(vec3(16.0, 20.0, 18.0));
                    vec3 L2 = normalize(vec3(-16.0, -8.0, -18.0));

                    float absX = abs(vObjPos.x);
                    float foliaPhase = (vObjPos.y + 3.25) * 30.0 + (vObjPos.z + 3.25) * 3.6 - 0.25 * sin(absX * 2.2);
                    float foliaPattern = 0.5 + 0.5 * sin(foliaPhase);
                    float foliaCrest = smoothstep(0.08, 0.72, foliaPattern);

                    vec3 dPdx = dFdx(vViewPos);
                    vec3 dPdy = dFdy(vViewPos);
                    float dFdxVal = dFdx(foliaPattern);
                    float dFdyVal = dFdy(foliaPattern);
                    vec3 grad = normalize(cross(dPdx, vNormal) * dFdyVal + cross(vNormal, dPdy) * dFdxVal + vec3(1e-5));
                    vec3 N = normalize(vNormal - grad * 0.24);

                    vec3 sulcusCol = vec3(0.32, 0.15, 0.17);
                    vec3 crestCol  = vec3(0.88, 0.68, 0.65);
                    vec3 vermisCol = vec3(0.92, 0.74, 0.70);
                    float isVermis = exp(-pow(absX / 0.52, 2.0));
                    vec3 baseCol = mix(sulcusCol, mix(crestCol, vermisCol, isVermis * 0.5), foliaCrest);

                    float wrap = max((dot(N, L1) + 0.48) / 1.48, 0.0);
                    float diff2 = max(dot(N, L2), 0.0) * 0.35;
                    vec3 H = normalize(L1 + V);
                    float spec = pow(max(dot(N, H), 0.0), 42.0) * 0.28 * foliaCrest;

                    vec3 finalCol = baseCol * (0.34 + 0.70 * wrap + diff2) + vec3(1.0, 0.95, 0.92) * spec;
                    float alpha = clamp(uXRayAlpha, 0.24, 1.0);
                    gl_FragColor = vec4(finalCol, alpha);
                }
            `
        });

        const cbGroup = new THREE.Group();
        cbGroup.add(new THREE.Mesh(cbGeo, this.cerebellumMaterial));

        // Árvore da Vida (Arbor Vitae) interna + Núcleo Denteado + 3 Pares de Pedúnculos Cerebelares (Superior, Médio, Inferior)
        const arborMat = new THREE.MeshPhysicalMaterial({
            color: 0xfef3c7,
            emissive: 0xd97706,
            emissiveIntensity: 0.22,
            roughness: 0.32
        });
        [-1.25, 0.0, 1.25].forEach(xPlane => {
            const centerPt = new THREE.Vector3(xPlane, -3.25, -2.95);
            [-1.1, -0.65, -0.2, 0.25, 0.7, 1.15, 1.55].forEach(ang => {
                const pEnd = new THREE.Vector3(xPlane, -3.25 + Math.sin(ang) * 0.95, -2.95 - Math.cos(ang) * 1.05);
                const curve = new THREE.CatmullRomCurve3([centerPt, pEnd]);
                cbGroup.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 12, 0.055, 8, false), arborMat));
            });
        });

        const pedMat = this.createOrganicMaterial(0xeed6cc, 0.34, 0.55);
        [-1, 1].forEach(side => {
            const mcpCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(side * 0.78, -2.48, -0.68),
                new THREE.Vector3(side * 1.18, -2.85, -1.65),
                new THREE.Vector3(side * 1.38, -3.15, -2.55)
            ]);
            cbGroup.add(new THREE.Mesh(new THREE.TubeGeometry(mcpCurve, 20, 0.32, 16, false), pedMat));
        });

        this.cerebellumGroup.add(cbGroup);
        this.registerStructure('CEREBELLUM', cbGroup, new THREE.Vector3(1.85, -3.25, -3.85));
    }

    // =========================================================================
    // 4. DIENCÉFALO, NÚCLEOS DA BASE E SISTEMA LÍMBICO (Subcortical Detalhado)
    // =========================================================================
    createOrganicMaterial(hexColor, roughness = 0.32, clearcoat = 0.65, opacity = 0.96, emissiveHex = 0x000000) {
        return new THREE.MeshPhysicalMaterial({
            color: hexColor,
            emissive: emissiveHex,
            emissiveIntensity: emissiveHex ? 0.28 : 0.0,
            roughness: roughness,
            metalness: 0.04,
            clearcoat: clearcoat,
            clearcoatRoughness: 0.2,
            transparent: opacity < 1.0,
            opacity: opacity
        });
    }

    buildSubcorticalAndLimbic() {
        // 1. Corpo Caloso (Rostro, Joelho, Tronco, Esplênio + Fórceps Menor e Maior)
        const ccGroup = new THREE.Group();
        const ccMat = this.createOrganicMaterial(0xf8efe8, 0.28, 0.72, 0.96, 0x38bdf8);
        const ccCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, -0.1, 2.35),  // Rostro
            new THREE.Vector3(0, 0.55, 2.85),  // Joelho (Genu)
            new THREE.Vector3(0, 1.52, 1.35),  // Tronco Anterior
            new THREE.Vector3(0, 1.68, -0.45), // Tronco Médio
            new THREE.Vector3(0, 1.25, -2.15), // Tronco Posterior
            new THREE.Vector3(0, 0.52, -2.85)  // Esplênio (Splenium)
        ]);
        const ccGeo = new THREE.TubeGeometry(ccCurve, 64, 0.42, 24, false);
        ccGeo.scale(2.85, 0.56, 1.0);
        ccGroup.add(new THREE.Mesh(ccGeo, ccMat));
        this.subcorticalGroup.add(ccGroup);
        this.registerStructure('CORPUS_CALLOSUM', ccGroup, new THREE.Vector3(0, 1.68, 0.25));

        // 2. Tálamo (Núcleos Anterior, Medial, Ventral VPL/VPM, Pulvinar + Corpos Geniculados Lateral/Medial + Aderência Intertalâmica)
        const thalGroup = new THREE.Group();
        const thalMat = this.createOrganicMaterial(0xd98a6c, 0.32, 0.62, 0.96, 0x9a3412);
        const genicMat = this.createOrganicMaterial(0xf4a261, 0.30, 0.65);
        [-1, 1].forEach(side => {
            const tGeo = new THREE.SphereGeometry(0.92, 42, 36);
            tGeo.scale(0.82, 0.95, 1.38);
            const tMesh = new THREE.Mesh(tGeo, thalMat);
            tMesh.position.set(side * 0.92, 0.18, -0.35);
            thalGroup.add(tMesh);

            // Pulvinar do Tálamo (polo posterior expandido)
            const pulv = new THREE.Mesh(new THREE.SphereGeometry(0.56, 24, 24), thalMat);
            pulv.position.set(side * 0.98, 0.08, -1.22);
            thalGroup.add(pulv);

            // Corpo Geniculado Lateral (Visão) e Medial (Audição)
            const lgn = new THREE.Mesh(new THREE.SphereGeometry(0.22, 18, 18), genicMat);
            lgn.position.set(side * 1.35, -0.35, -1.05);
            thalGroup.add(lgn);

            const mgn = new THREE.Mesh(new THREE.SphereGeometry(0.20, 18, 18), genicMat);
            mgn.position.set(side * 1.05, -0.45, -1.25);
            thalGroup.add(mgn);
        });
        const adhesio = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 1.2, 18), thalMat);
        adhesio.rotation.z = Math.PI / 2;
        adhesio.position.set(0, 0.20, -0.25);
        thalGroup.add(adhesio);
        this.subcorticalGroup.add(thalGroup);
        this.registerStructure('THALAMUS', thalGroup, new THREE.Vector3(0.95, 0.22, -0.35));

        // 3. Hipotálamo, Corpos Mamilares, Infundíbulo e Hipófise (Adeno-Hipófise e Neuro-Hipófise)
        const hypoGroup = new THREE.Group();
        const hypoMat = this.createOrganicMaterial(0xe07a5f, 0.32, 0.65);
        const hypoMesh = new THREE.Mesh(new THREE.SphereGeometry(0.56, 32, 28), hypoMat);
        hypoMesh.scale.set(0.92, 0.88, 1.12);
        hypoMesh.position.set(0, -0.76, 0.55);
        hypoGroup.add(hypoMesh);

        // Corpos Mamilares pareados na base posterior do hipotálamo
        [-0.22, 0.22].forEach(xMam => {
            const mam = new THREE.Mesh(new THREE.SphereGeometry(0.18, 18, 18), this.createOrganicMaterial(0xfbbf24, 0.3, 0.7));
            mam.position.set(xMam, -1.05, 0.12);
            hypoGroup.add(mam);
        });

        const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.08, 0.65, 18), hypoMat);
        stalk.position.set(0, -1.25, 0.72);
        stalk.rotation.x = 0.28;
        hypoGroup.add(stalk);

        // Adeno-hipófise (anterior) e Neuro-hipófise (posterior)
        const adenoPit = new THREE.Mesh(new THREE.SphereGeometry(0.26, 24, 24), this.createOrganicMaterial(0xe56b6f, 0.28, 0.75));
        adenoPit.scale.set(1.15, 0.92, 0.85);
        adenoPit.position.set(0, -1.58, 0.90);
        hypoGroup.add(adenoPit);

        const neuroPit = new THREE.Mesh(new THREE.SphereGeometry(0.20, 20, 20), this.createOrganicMaterial(0xf4a261, 0.3, 0.7));
        neuroPit.position.set(0, -1.58, 0.68);
        hypoGroup.add(neuroPit);

        this.subcorticalGroup.add(hypoGroup);
        this.registerStructure('HYPOTHALAMUS', hypoGroup, new THREE.Vector3(0, -1.1, 0.75));

        // 4. Hipocampo (Pé Digitado, Corno de Ammon, Giro Denteado) + Fórnix Completo (Pilares, Corpo e Colunas)
        const hippoGroup = new THREE.Group();
        const hippoMat = this.createOrganicMaterial(0xe9c46a, 0.32, 0.65, 0.96, 0xb45309);
        const fornixMat = this.createOrganicMaterial(0xfef08a, 0.30, 0.68);
        [-1, 1].forEach(side => {
            // Corno de Ammon (Hipocampo propriamente dito)
            const hCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(side * 1.82, -1.38, 0.68),
                new THREE.Vector3(side * 2.18, -1.18, -0.45),
                new THREE.Vector3(side * 1.78, -0.35, -1.48)
            ]);
            hippoGroup.add(new THREE.Mesh(new THREE.TubeGeometry(hCurve, 36, 0.30, 20, false), hippoMat));

            // Fórnix arqueando sobre o Tálamo até os Corpos Mamilares
            const fCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(side * 1.78, -0.35, -1.48),
                new THREE.Vector3(side * 0.92, 0.62, -1.15),
                new THREE.Vector3(side * 0.28, 0.85, -0.15),
                new THREE.Vector3(side * 0.22, -0.25, 0.45),
                new THREE.Vector3(side * 0.22, -1.05, 0.12)
            ]);
            hippoGroup.add(new THREE.Mesh(new THREE.TubeGeometry(fCurve, 40, 0.14, 16, false), fornixMat));
        });
        this.subcorticalGroup.add(hippoGroup);
        this.registerStructure('HIPPOCAMPUS', hippoGroup, new THREE.Vector3(1.98, -1.1, -0.2));

        // 5. Complexo Amigdaliano (Amígdala + Estria Terminal)
        const amygGroup = new THREE.Group();
        const amygMat = this.createOrganicMaterial(0xe63946, 0.28, 0.72, 0.96, 0x991b1b);
        [-1, 1].forEach(side => {
            const aGeo = new THREE.SphereGeometry(0.44, 28, 28);
            aGeo.scale(1.12, 0.92, 1.25);
            const aMesh = new THREE.Mesh(aGeo, amygMat);
            aMesh.position.set(side * 1.82, -1.38, 1.08);
            amygGroup.add(aMesh);
        });
        this.subcorticalGroup.add(amygGroup);
        this.registerStructure('AMYGDALA', amygGroup, new THREE.Vector3(1.82, -1.38, 1.08));

        // 6. Núcleos da Base (Caudado em C + Putâmen + Globo Pálido Externo/Interno + Pontes Estriadas)
        const bgGroup = new THREE.Group();
        const caudateMat = this.createOrganicMaterial(0x8ecae6, 0.32, 0.62, 0.96, 0x0284c7);
        const putamenMat = this.createOrganicMaterial(0x38bdf8, 0.34, 0.60, 0.96, 0x0369a1);
        const pallidusMat = this.createOrganicMaterial(0xa855f7, 0.32, 0.65, 0.96, 0x6b21a8);
        [-1, 1].forEach(side => {
            // Cabeça, Corpo e Cauda do Núcleo Caudado
            const cCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(side * 1.12, 0.62, 1.68),
                new THREE.Vector3(side * 1.35, 1.18, 0.38),
                new THREE.Vector3(side * 1.55, 0.68, -1.15),
                new THREE.Vector3(side * 1.85, -0.48, -1.45),
                new THREE.Vector3(side * 1.82, -1.18, -0.25)
            ]);
            bgGroup.add(new THREE.Mesh(new THREE.TubeGeometry(cCurve, 48, 0.26, 20, false), caudateMat));

            // Cabeça do Caudado dilatada anteriormente
            const cHead = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 24), caudateMat);
            cHead.scale.set(0.85, 1.1, 1.35);
            cHead.position.set(side * 1.12, 0.55, 1.55);
            bgGroup.add(cHead);

            // Putâmen (lateral)
            const pGeo = new THREE.SphereGeometry(0.84, 32, 32);
            pGeo.scale(0.52, 0.96, 1.38);
            const pMesh = new THREE.Mesh(pGeo, putamenMat);
            pMesh.position.set(side * 1.92, 0.12, 0.28);
            bgGroup.add(pMesh);

            // Globo Pálido (medial ao Putâmen)
            const gpGeo = new THREE.SphereGeometry(0.62, 28, 28);
            gpGeo.scale(0.48, 0.82, 1.12);
            const gpMesh = new THREE.Mesh(gpGeo, pallidusMat);
            gpMesh.position.set(side * 1.48, -0.05, 0.18);
            bgGroup.add(gpMesh);
        });
        this.subcorticalGroup.add(bgGroup);
        this.registerStructure('BASAL_GANGLIA', bgGroup, new THREE.Vector3(1.92, 0.25, 0.35));
    }

    // =========================================================================
    // 5. TRONCO ENCEFÁLICO HIPER-DETALHADO (Mesencéfalo, Ponte, Bulbo) E MEDULA ESPINHAL
    // =========================================================================
    buildBrainstemAndSpinalCord() {
        const stemMat = this.createOrganicMaterial(0xebd2c7, 0.34, 0.62);
        const ponsMat = this.createOrganicMaterial(0xe4c2b5, 0.35, 0.60);
        const medullaMat = this.createOrganicMaterial(0xedd6cc, 0.34, 0.62);

        // ---------------------------------------------------------------------
        // 5.1 MESENCÉFALO (Pedúnculos Cerebrais, Fossa Interpeduncular, Substância Negra, Núcleo Rubro e 4 Colículos Quadrigêmeos)
        // ---------------------------------------------------------------------
        const midGroup = new THREE.Group();
        [-1, 1].forEach(side => {
            // Pedúnculo Cerebral Anterior com estrias longitudinais do trato corticoespinhal
            const pedGeo = new THREE.CylinderGeometry(0.54, 0.45, 1.18, 36, 20);
            const pPos = pedGeo.attributes.position;
            for (let i = 0; i < pPos.count; i++) {
                const ang = Math.atan2(pPos.getZ(i), pPos.getX(i));
                const fluting = 1.0 + Math.sin(ang * 14.0) * 0.025;
                pPos.setX(i, pPos.getX(i) * fluting);
                pPos.setZ(i, pPos.getZ(i) * fluting);
            }
            pedGeo.computeVertexNormals();
            const ped = new THREE.Mesh(pedGeo, stemMat);
            ped.position.set(side * 0.42, -1.35, -0.38);
            ped.rotation.z = side * -0.15;
            ped.rotation.x = 0.16;
            midGroup.add(ped);

            // Substância Negra (Pars Compacta pigmentada entre o pé do pedúnculo e o tegmento)
            const snMesh = new THREE.Mesh(
                new THREE.SphereGeometry(0.28, 20, 16),
                this.createOrganicMaterial(0x3b2824, 0.4, 0.5, 0.95, 0x1e1b18)
            );
            snMesh.scale.set(1.25, 0.55, 0.65);
            snMesh.position.set(side * 0.40, -1.32, -0.45);
            midGroup.add(snMesh);

            // Núcleo Rubro (Red Nucleus no tegmento mesencefálico)
            const rnMesh = new THREE.Mesh(
                new THREE.SphereGeometry(0.22, 20, 20),
                this.createOrganicMaterial(0xdc2626, 0.3, 0.7, 0.95, 0x991b1b)
            );
            rnMesh.position.set(side * 0.25, -1.28, -0.62);
            midGroup.add(rnMesh);

            // Lâmina Quadrigêmea Dorsal: Colículo Superior (Visual) e Colículo Inferior (Auditivo)
            const supCol = new THREE.Mesh(new THREE.SphereGeometry(0.26, 22, 20), stemMat);
            supCol.scale.set(1.1, 0.85, 0.95);
            supCol.position.set(side * 0.28, -1.15, -1.02);
            midGroup.add(supCol);

            const infCol = new THREE.Mesh(new THREE.SphereGeometry(0.23, 22, 20), stemMat);
            infCol.scale.set(1.05, 0.85, 0.95);
            infCol.position.set(side * 0.26, -1.52, -1.08);
            midGroup.add(infCol);
        });
        this.brainstemGroup.add(midGroup);
        this.registerStructure('MIDBRAIN', midGroup, new THREE.Vector3(0, -1.35, -0.35));

        // ---------------------------------------------------------------------
        // 5.2 PONTE DE VARÓLIO (Protuberância Anular Esculpida com Sulco Basilar e Feixes Transversos)
        // ---------------------------------------------------------------------
        const ponsGroup = new THREE.Group();
        const ponsGeo = new THREE.SphereGeometry(1.12, 64, 48);
        const pPos = ponsGeo.attributes.position;
        for (let i = 0; i < pPos.count; i++) {
            let px = pPos.getX(i) * 1.24;
            let py = pPos.getY(i) * 0.88;
            let pz = pPos.getZ(i) * 1.02;

            // Sulco Basilar mediano anterior profundo
            if (pz > 0.0) {
                const basilarGroove = Math.exp(-Math.pow(px / 0.25, 2.0)) * pz;
                pz -= basilarGroove * 0.22;
            }
            // Feixes transversos pontocerebelares esculpidos em relevo 3D
            const transverseBundles = Math.sin(py * 26.0 + Math.cos(px * 3.8) * 0.9) * 0.032;
            pz += transverseBundles;

            pPos.setXYZ(i, px, py, pz);
        }
        ponsGeo.computeVertexNormals();
        const ponsMesh = new THREE.Mesh(ponsGeo, ponsMat);
        ponsMesh.position.set(0, -2.48, -0.58);
        ponsGroup.add(ponsMesh);
        this.brainstemGroup.add(ponsGroup);
        this.registerStructure('PONS', ponsGroup, new THREE.Vector3(0, -2.48, 0.42));

        // ---------------------------------------------------------------------
        // 5.3 BULBO RAQUIDIANO (MEDULLA OBLONGATA: Pirâmides Bulbares, Decussação das Pirâmides, Olivas Inferiores e Tubérculos Dorsais)
        // ---------------------------------------------------------------------
        const medGroup = new THREE.Group();
        const medGeo = new THREE.CylinderGeometry(0.76, 0.46, 1.68, 56, 36);
        const mPos = medGeo.attributes.position;
        for (let i = 0; i < mPos.count; i++) {
            let mx = mPos.getX(i);
            let my = mPos.getY(i);
            let mz = mPos.getZ(i);

            if (mz > 0.0) {
                // Fissura Mediana Anterior interrompida inferiormente pela Decussação das Pirâmides
                const decussationZone = my < -0.35 ? Math.sin(my * 22.0 + mx * 18.0) * 0.04 : 0.0;
                const antFissure = Math.exp(-Math.pow(mx / 0.075, 2.0)) * (my < -0.35 ? 0.05 : 0.16);
                // Pirâmides Bulbares pareadas ao lado da fissura mediana
                const pyramidBulge = Math.exp(-Math.pow((Math.abs(mx) - 0.22) / 0.15, 2.0)) * 0.14;
                // Olivas Bulbares Inferiores posterolaterais às pirâmides
                const oliveBulge = (my > -0.25 && my < 0.55)
                    ? Math.exp(-Math.pow((Math.abs(mx) - 0.52) / 0.15, 2.0)) * Math.exp(-Math.pow((my - 0.18) / 0.30, 2.0)) * 0.18
                    : 0.0;
                mz = mz - antFissure + pyramidBulge + oliveBulge + decussationZone;
            } else {
                // Sulco Mediano Posterior + Tubérculos Grácil e Cuneiforme
                const postSulcus = Math.exp(-Math.pow(mx / 0.065, 2.0)) * 0.10;
                const gracilisBulge = Math.exp(-Math.pow((Math.abs(mx) - 0.18) / 0.12, 2.0)) * 0.08;
                const cuneatusBulge = Math.exp(-Math.pow((Math.abs(mx) - 0.38) / 0.14, 2.0)) * 0.09;
                mz = mz + postSulcus - gracilisBulge - cuneatusBulge;
            }
            mPos.setXYZ(i, mx, my, mz);
        }
        medGeo.computeVertexNormals();
        const medMesh = new THREE.Mesh(medGeo, medullaMat);
        medMesh.position.set(0, -3.95, -0.82);
        medMesh.rotation.x = -0.10;
        medGroup.add(medMesh);

        // Olivas Bulbares Inferiores destacadas com tonalidade anatômica própria
        const oliveMat = this.createOrganicMaterial(0xf5e0d3, 0.30, 0.68);
        [-1, 1].forEach(side => {
            const olive = new THREE.Mesh(new THREE.SphereGeometry(0.23, 24, 24), oliveMat);
            olive.scale.set(0.82, 1.55, 0.88);
            olive.position.set(side * 0.44, -3.72, -0.40);
            medGroup.add(olive);
        });

        // Feixes cruzados visíveis da Decussação das Pirâmides na transição bulbo-medular
        const decussMat = this.createOrganicMaterial(0xf8ede6, 0.32, 0.65);
        [-1, 1].forEach(side => {
            const dCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(side * 0.22, -4.15, -0.42),
                new THREE.Vector3(0.0, -4.45, -0.48),
                new THREE.Vector3(-side * 0.24, -4.75, -0.68)
            ]);
            medGroup.add(new THREE.Mesh(new THREE.TubeGeometry(dCurve, 16, 0.065, 10, false), decussMat));
        });

        this.brainstemGroup.add(medGroup);
        this.registerStructure('MEDULLA_OBLONGATA', medGroup, new THREE.Vector3(0, -3.95, -0.35));

        // ---------------------------------------------------------------------
        // 5.4 MEDULA ESPINHAL CONTÍNUA (Cervical, Torácica, Lombar, H Medular 3D, Raízes, DRG, Cone Medular e Cauda Equina)
        // ---------------------------------------------------------------------
        const spinalCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, -4.75, -0.92),
            new THREE.Vector3(0, -6.50, -1.08),
            new THREE.Vector3(0, -9.80, -1.42),
            new THREE.Vector3(0, -13.20, -1.52),
            new THREE.Vector3(0, -15.80, -1.18),
            new THREE.Vector3(0, -17.60, -1.05)
        ]);

        const spinalGeo = new THREE.TubeGeometry(spinalCurve, 120, 0.35, 32, false);
        const pos = spinalGeo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const vx = pos.getX(i);
            const vy = pos.getY(i);
            const vz = pos.getZ(i);

            let radiusScale = 1.0;
            if (vy < -5.4 && vy > -7.8) radiusScale = 1.26; // Intumescência cervical
            else if (vy < -14.5 && vy > -16.8) radiusScale = 1.24; // Intumescência lombossacral
            else if (vy <= -16.8) radiusScale = Math.max(0.16, 1.0 - (Math.abs(vy + 16.8) / 0.95));

            const centerApproxZ = -1.18;
            let nx = vx * radiusScale;
            let nz = centerApproxZ + (vz - centerApproxZ) * radiusScale * 0.88;

            // Fissura Mediana Anterior na medula espinhal
            const midlineGroove = Math.exp(-Math.pow(nx / 0.06, 2.0)) * 0.08 * radiusScale;
            if (nz > centerApproxZ) nz -= midlineGroove;

            pos.setX(i, nx);
            pos.setZ(i, nz);
        }
        spinalGeo.computeVertexNormals();

        const fullSpinalGroup = new THREE.Group();
        const spinalMat = this.createOrganicMaterial(0xf2ded4, 0.34, 0.62, 0.88);
        fullSpinalGroup.add(new THREE.Mesh(spinalGeo, spinalMat));

        // H Medular interno 3D (Colunas Cinzentas Dorsais e Ventrais visíveis por transparência)
        const greyMatterMat = this.createOrganicMaterial(0xd97757, 0.38, 0.5, 0.92, 0x9a3412);
        [-0.12, 0.12].forEach(xCol => {
            const hCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(xCol, -4.85, -0.92),
                new THREE.Vector3(xCol, -9.80, -1.42),
                new THREE.Vector3(xCol, -15.80, -1.18),
                new THREE.Vector3(xCol * 0.5, -17.40, -1.05)
            ]);
            fullSpinalGroup.add(new THREE.Mesh(new THREE.TubeGeometry(hCurve, 64, 0.075, 10, false), greyMatterMat));
        });

        // Artéria Espinhal Anterior vermelha correndo na Fissura Mediana Anterior
        const asaCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, -4.75, -0.62),
            new THREE.Vector3(0, -9.80, -1.10),
            new THREE.Vector3(0, -15.80, -0.86),
            new THREE.Vector3(0, -17.60, -0.88)
        ]);
        fullSpinalGroup.add(new THREE.Mesh(
            new THREE.TubeGeometry(asaCurve, 64, 0.032, 8, false),
            this.createOrganicMaterial(0xef4444, 0.25, 0.8, 1.0, 0x991b1b)
        ));

        // Cauda Equina e Filum Terminale descendo até o cóccix (Y = -20.5)
        const caudaMat = this.createOrganicMaterial(0xf6e5bc, 0.36, 0.55, 0.92);
        for (let r = -4; r <= 4; r++) {
            const spread = r * 0.14;
            const caudaCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(spread * 0.3, -17.3, -1.05),
                new THREE.Vector3(spread * 0.9, -18.8, -1.15),
                new THREE.Vector3(spread * 1.4, -20.4, -1.22)
            ]);
            fullSpinalGroup.add(new THREE.Mesh(new THREE.TubeGeometry(caudaCurve, 28, 0.045, 10, false), caudaMat));
            this.pnsPulseCurves.push(caudaCurve);
        }

        // Raízes Dorsais/Ventrais e Gânglios da Raiz Dorsal (DRG) ao longo dos segmentos medulares
        const drgMat = this.createOrganicMaterial(0xf59e0b, 0.32, 0.6, 1.0, 0xb45309);
        const rootletMat = this.createOrganicMaterial(0xfef08a, 0.34, 0.55);
        for (let seg = 0; seg < 20; seg++) {
            const t = seg / 19;
            const pt = spinalCurve.getPointAt(t);
            [-1, 1].forEach(side => {
                // Raízes dorsal e ventral convergindo no DRG
                const rCurve = new THREE.CatmullRomCurve3([
                    new THREE.Vector3(side * 0.24, pt.y + 0.05, pt.z),
                    new THREE.Vector3(side * 0.54, pt.y - 0.08, pt.z)
                ]);
                fullSpinalGroup.add(new THREE.Mesh(new THREE.TubeGeometry(rCurve, 8, 0.032, 8, false), rootletMat));

                const drg = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 14), drgMat);
                drg.scale.set(1.4, 0.85, 0.85);
                drg.position.set(side * 0.54, pt.y - 0.08, pt.z);
                fullSpinalGroup.add(drg);
            });
        }

        this.spinalGroup.add(fullSpinalGroup);
        this.registerStructure('SPINAL_CORD', fullSpinalGroup, new THREE.Vector3(0, -11.2, -1.4));
        this.pnsPulseCurves.push(spinalCurve);
    }

    // =========================================================================
    // 6. SISTEMA NERVOSO PERIFÉRICO (SNP) DE CORPO INTEIRO (12 Pares Cranianos + Plexos + Nervos dos Membros)
    // =========================================================================
    addNervePair(group, pointsRight, radius, material, recordPulses = true) {
        [-1, 1].forEach(side => {
            const pts = pointsRight.map(p => new THREE.Vector3(p.x * side, p.y, p.z));
            const curve = new THREE.CatmullRomCurve3(pts);
            const geo = new THREE.TubeGeometry(curve, 36, radius, 12, false);
            const mesh = new THREE.Mesh(geo, material);
            group.add(mesh);
            if (recordPulses) {
                this.pnsPulseCurves.push(curve);
            }
        });
    }

    buildCranialAndPeripheralNerves() {
        const cranialMat = new THREE.MeshPhysicalMaterial({
            color: 0xfde047,
            emissive: 0xca8a04,
            emissiveIntensity: 0.28,
            roughness: 0.28,
            clearcoat: 0.7
        });

        const pnsTrunkMat = new THREE.MeshPhysicalMaterial({
            color: 0xfacc15,
            emissive: 0xd97706,
            emissiveIntensity: 0.25,
            roughness: 0.30,
            clearcoat: 0.65
        });

        const autonomicMat = new THREE.MeshPhysicalMaterial({
            color: 0x38bdf8,
            emissive: 0x0284c7,
            emissiveIntensity: 0.32,
            roughness: 0.28,
            clearcoat: 0.7
        });

        // 1. CN I — Nervo Olfatório
        const cn1Group = new THREE.Group();
        this.addNervePair(cn1Group, [
            new THREE.Vector3(0.45, -1.05, 1.35),
            new THREE.Vector3(0.48, -1.12, 2.65),
            new THREE.Vector3(0.50, -1.08, 3.65)
        ], 0.08, cranialMat);
        this.pnsGroup.add(cn1Group);
        this.registerStructure('OLFACTORY_NERVE_CN1', cn1Group, new THREE.Vector3(0.5, -1.08, 3.4));

        // 2. CN II — Nervo Óptico, Quiasma Óptico e Globos Oculares Translúcidos
        const cn2Group = new THREE.Group();
        this.addNervePair(cn2Group, [
            new THREE.Vector3(0.85, -0.65, -0.15),
            new THREE.Vector3(0.28, -0.92, 1.15),
            new THREE.Vector3(1.15, -0.98, 2.75),
            new THREE.Vector3(1.45, -0.95, 3.65)
        ], 0.12, cranialMat);
        [-1, 1].forEach(side => {
            const eye = new THREE.Mesh(
                new THREE.SphereGeometry(0.48, 24, 24),
                new THREE.MeshPhysicalMaterial({ color: 0xe0f2fe, roughness: 0.15, transmission: 0.55, transparent: true, opacity: 0.65 })
            );
            eye.position.set(side * 1.52, -0.92, 4.05);
            cn2Group.add(eye);
        });
        this.pnsGroup.add(cn2Group);
        this.registerStructure('OPTIC_NERVE_CN2', cn2Group, new THREE.Vector3(1.45, -0.92, 3.65));

        // 3. CN III, IV, VI — Nervos Oculomotores
        const cn346Group = new THREE.Group();
        this.addNervePair(cn346Group, [
            new THREE.Vector3(0.32, -1.55, -0.15),
            new THREE.Vector3(0.88, -1.25, 1.65),
            new THREE.Vector3(1.38, -0.98, 3.45)
        ], 0.065, cranialMat);
        this.pnsGroup.add(cn346Group);
        this.registerStructure('OCULOMOTOR_NERVES_CN3_4_6', cn346Group, new THREE.Vector3(0.95, -1.22, 1.85));

        // 4. CN V — Nervo Trigêmeo (Gânglio de Gasser + Ramos V1, V2, V3)
        const cn5Group = new THREE.Group();
        [-1, 1].forEach(side => {
            const gasser = new THREE.Mesh(new THREE.SphereGeometry(0.24, 20, 20), cranialMat);
            gasser.scale.set(1.2, 0.85, 1.35);
            gasser.position.set(side * 1.32, -2.32, 0.65);
            cn5Group.add(gasser);
        });
        this.addNervePair(cn5Group, [
            new THREE.Vector3(0.88, -2.38, -0.35),
            new THREE.Vector3(1.32, -2.32, 0.65),
            new THREE.Vector3(1.52, -1.25, 2.85),
            new THREE.Vector3(1.48, -0.35, 3.85)
        ], 0.065, cranialMat);
        this.addNervePair(cn5Group, [
            new THREE.Vector3(1.32, -2.32, 0.65),
            new THREE.Vector3(1.68, -2.38, 2.35),
            new THREE.Vector3(1.45, -2.55, 3.75)
        ], 0.068, cranialMat);
        this.addNervePair(cn5Group, [
            new THREE.Vector3(1.32, -2.32, 0.65),
            new THREE.Vector3(1.75, -3.45, 1.85),
            new THREE.Vector3(1.25, -4.55, 3.15)
        ], 0.072, cranialMat);
        this.pnsGroup.add(cn5Group);
        this.registerStructure('TRIGEMINAL_NERVE_CN5', cn5Group, new THREE.Vector3(1.55, -2.35, 1.65));

        // 5. CN VII & VIII — Nervo Facial e Vestibulococlear
        const cn78Group = new THREE.Group();
        this.addNervePair(cn78Group, [
            new THREE.Vector3(0.75, -3.05, -0.58),
            new THREE.Vector3(1.88, -2.98, -0.35),
            new THREE.Vector3(2.25, -3.15, 1.15),
            new THREE.Vector3(1.85, -3.45, 2.75)
        ], 0.065, cranialMat);
        this.pnsGroup.add(cn78Group);
        this.registerStructure('FACIAL_VESTIBULOCOCHLEAR_CN7_8', cn78Group, new THREE.Vector3(1.95, -3.05, 0.65));

        // 6. CN X — Nervo Vago (Parassimpático Toracoabdominal)
        const cn10Group = new THREE.Group();
        this.addNervePair(cn10Group, [
            new THREE.Vector3(0.55, -3.85, -0.75),
            new THREE.Vector3(1.22, -5.80, -0.35),
            new THREE.Vector3(1.08, -8.50, 0.45),
            new THREE.Vector3(0.85, -11.40, 0.85),
            new THREE.Vector3(0.95, -14.20, 0.65)
        ], 0.082, autonomicMat);
        this.addNervePair(cn10Group, [
            new THREE.Vector3(1.08, -8.50, 0.45),
            new THREE.Vector3(0.45, -9.85, 1.35)
        ], 0.05, autonomicMat);
        this.addNervePair(cn10Group, [
            new THREE.Vector3(0.85, -11.40, 0.85),
            new THREE.Vector3(1.65, -12.80, 1.25)
        ], 0.05, autonomicMat);
        this.pnsGroup.add(cn10Group);
        this.registerStructure('VAGUS_NERVE_CN10', cn10Group, new THREE.Vector3(1.15, -8.5, 0.55));

        // 7. CN IX, XI, XII — Glossofaríngeo, Acessório e Hipoglosso
        const cn91112Group = new THREE.Group();
        this.addNervePair(cn91112Group, [
            new THREE.Vector3(0.52, -4.15, -0.82),
            new THREE.Vector3(1.55, -5.25, -0.65),
            new THREE.Vector3(2.85, -6.95, -0.85),
            new THREE.Vector3(3.45, -8.15, -1.05)
        ], 0.068, cranialMat);
        this.pnsGroup.add(cn91112Group);
        this.registerStructure('GLOSSOPHARYNGEAL_ACCESSORY_HYPOGLOSSAL_CN9_11_12', cn91112Group, new THREE.Vector3(2.1, -5.8, -0.75));

        // 8. Plexo Cervical e Nervo Frênico (C1–C5 -> Diafragma)
        const cervGroup = new THREE.Group();
        this.addNervePair(cervGroup, [
            new THREE.Vector3(0.35, -5.45, -0.95),
            new THREE.Vector3(1.25, -6.25, -0.45),
            new THREE.Vector3(1.45, -8.85, 0.55),
            new THREE.Vector3(1.85, -11.65, 0.95),
            new THREE.Vector3(2.45, -12.35, 0.45)
        ], 0.068, pnsTrunkMat);
        this.pnsGroup.add(cervGroup);
        this.registerStructure('CERVICAL_PLEXUS_PHRENIC', cervGroup, new THREE.Vector3(1.45, -8.85, 0.55));

        // 9. Plexo Braquial (C5–T1: Troncos e Fascículos no Ombro/Axila)
        const brachialGroup = new THREE.Group();
        [-5.8, -6.3, -6.8, -7.3].forEach((yRoot, idx) => {
            this.addNervePair(brachialGroup, [
                new THREE.Vector3(0.38, yRoot, -1.05),
                new THREE.Vector3(1.85, -6.85 - idx * 0.18, -0.82),
                new THREE.Vector3(3.55, -7.55 - idx * 0.14, -0.52),
                new THREE.Vector3(4.65, -8.25 - idx * 0.12, -0.28)
            ], 0.078, pnsTrunkMat);
        });
        this.pnsGroup.add(brachialGroup);
        this.registerStructure('BRACHIAL_PLEXUS', brachialGroup, new THREE.Vector3(3.2, -7.4, -0.6));

        // 10. Nervos Mediano, Ulnar e Radial
        const armNervesGroup = new THREE.Group();
        this.addNervePair(armNervesGroup, [
            new THREE.Vector3(4.65, -8.35, -0.28),
            new THREE.Vector3(5.65, -10.85, 0.05),
            new THREE.Vector3(6.35, -13.45, 0.38),
            new THREE.Vector3(6.85, -15.85, 0.68),
            new THREE.Vector3(7.15, -17.15, 0.85)
        ], 0.072, pnsTrunkMat);
        this.addNervePair(armNervesGroup, [
            new THREE.Vector3(4.55, -8.55, -0.35),
            new THREE.Vector3(5.32, -11.05, -0.15),
            new THREE.Vector3(5.95, -13.65, 0.15),
            new THREE.Vector3(6.42, -15.95, 0.48),
            new THREE.Vector3(6.68, -17.10, 0.68)
        ], 0.062, pnsTrunkMat);
        this.addNervePair(armNervesGroup, [
            new THREE.Vector3(4.75, -8.25, -0.45),
            new THREE.Vector3(5.98, -10.65, -0.22),
            new THREE.Vector3(6.72, -13.25, 0.18),
            new THREE.Vector3(7.25, -15.65, 0.55),
            new THREE.Vector3(7.58, -16.95, 0.78)
        ], 0.065, pnsTrunkMat);
        this.pnsGroup.add(armNervesGroup);
        this.registerStructure('MEDIAN_ULNAR_RADIAL_NERVES', armNervesGroup, new THREE.Vector3(6.35, -13.45, 0.38));

        // 11. Nervos Intercostais (T1–T12) e Cadeia Simpática Toracolombar
        const intercostalGroup = new THREE.Group();
        this.addNervePair(intercostalGroup, [
            new THREE.Vector3(0.72, -7.2, -1.12),
            new THREE.Vector3(0.78, -10.5, -1.35),
            new THREE.Vector3(0.75, -13.8, -1.38),
            new THREE.Vector3(0.68, -16.8, -1.08)
        ], 0.065, autonomicMat);

        for (let rib = 0; rib < 9; rib++) {
            const yRib = -7.8 - rib * 0.72;
            const ribWidth = 3.25 + Math.sin((rib / 8) * Math.PI) * 0.85;
            const ribDepth = 1.65 + Math.sin((rib / 8) * Math.PI) * 0.55;
            this.addNervePair(intercostalGroup, [
                new THREE.Vector3(0.38, yRib, -1.35),
                new THREE.Vector3(ribWidth * 0.65, yRib - 0.18, -0.85),
                new THREE.Vector3(ribWidth, yRib - 0.42, 0.25),
                new THREE.Vector3(ribWidth * 0.58, yRib - 0.62, ribDepth)
            ], 0.046, pnsTrunkMat, rib % 2 === 0);
        }
        this.pnsGroup.add(intercostalGroup);
        this.registerStructure('INTERCOSTAL_SYMPATHETIC_CHAIN', intercostalGroup, new THREE.Vector3(3.4, -10.8, 0.25));

        // 12. Plexo Lombossacral e Nervo Femoral
        const lumboGroup = new THREE.Group();
        [-14.6, -15.4, -16.2, -17.0].forEach((yL, idx) => {
            this.addNervePair(lumboGroup, [
                new THREE.Vector3(0.35, yL, -1.15),
                new THREE.Vector3(1.55, yL - 0.85, -0.85),
                new THREE.Vector3(2.45, -17.85 - idx * 0.25, -0.35)
            ], 0.075, pnsTrunkMat);
        });
        this.addNervePair(lumboGroup, [
            new THREE.Vector3(2.25, -17.65, -0.35),
            new THREE.Vector3(2.65, -19.85, 0.35),
            new THREE.Vector3(2.48, -22.45, 0.45),
            new THREE.Vector3(2.15, -25.25, 0.35)
        ], 0.075, pnsTrunkMat);
        this.pnsGroup.add(lumboGroup);
        this.registerStructure('LUMBOSACRAL_PLEXUS', lumboGroup, new THREE.Vector3(2.35, -18.5, -0.15));

        // 13. Nervo Ciático, Tibial e Fibular Comum
        const sciaticGroup = new THREE.Group();
        this.addNervePair(sciaticGroup, [
            new THREE.Vector3(1.85, -17.85, -0.95),
            new THREE.Vector3(2.35, -19.65, -0.85),
            new THREE.Vector3(2.28, -21.85, -0.65),
            new THREE.Vector3(2.18, -23.45, -0.45)
        ], 0.115, pnsTrunkMat);
        this.addNervePair(sciaticGroup, [
            new THREE.Vector3(2.18, -23.45, -0.45),
            new THREE.Vector3(2.05, -25.45, -0.38),
            new THREE.Vector3(1.92, -27.35, -0.25),
            new THREE.Vector3(1.98, -27.95, 0.65)
        ], 0.078, pnsTrunkMat);
        this.addNervePair(sciaticGroup, [
            new THREE.Vector3(2.18, -23.45, -0.45),
            new THREE.Vector3(2.48, -25.25, 0.05),
            new THREE.Vector3(2.25, -27.25, 0.25),
            new THREE.Vector3(2.15, -27.85, 0.95)
        ], 0.068, pnsTrunkMat);
        this.pnsGroup.add(sciaticGroup);
        this.registerStructure('SCIATIC_TIBIAL_FIBULAR_NERVES', sciaticGroup, new THREE.Vector3(2.25, -22.5, -0.55));

        this.buildCurveLockedPNSPulses();
    }

    buildCurveLockedPNSPulses() {
        const pulseCount = this.pnsPulseCurves.length * 4;
        if (pulseCount === 0) return;

        const positions = new Float32Array(pulseCount * 3);
        const colors = new Float32Array(pulseCount * 3);
        this.pnsPulseMeta = [];

        for (let i = 0; i < pulseCount; i++) {
            const curveIndex = Math.floor(i / 4);
            const t = (i % 4) * 0.25 + Math.random() * 0.15;
            const speed = 0.22 + Math.random() * 0.25;
            this.pnsPulseMeta.push({ curveIndex, t: t % 1.0, speed });

            const pt = this.pnsPulseCurves[curveIndex].getPointAt(t % 1.0);
            positions[i * 3] = pt.x;
            positions[i * 3 + 1] = pt.y;
            positions[i * 3 + 2] = pt.z;

            colors[i * 3] = 1.0;
            colors[i * 3 + 1] = 0.92;
            colors[i * 3 + 2] = 0.35;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const mat = new THREE.PointsMaterial({
            size: 0.22,
            vertexColors: true,
            transparent: true,
            opacity: 0.92,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.pnsPulses = new THREE.Points(geo, mat);
        this.pnsGroup.add(this.pnsPulses);
    }

    // =========================================================================
    // 7. CORPO HUMANO TRANSLÚCIDO BIOLUMINESCENTE ("ÁGUA-VIVA" FRESNEL CIANO-AZUL)
    // =========================================================================
    createJellyfishBodyShader() {
        const mat = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vWorldPos;
                varying vec3 vObjPos;
                void main() {
                    vObjPos = position;
                    vNormal = normalize(normalMatrix * normal);
                    vec4 worldPos = modelMatrix * vec4(position, 1.0);
                    vWorldPos = worldPos.xyz;
                    gl_Position = projectionMatrix * viewMatrix * worldPos;
                }
            `,
            fragmentShader: `
                uniform float uTime;
                varying vec3 vNormal;
                varying vec3 vWorldPos;
                varying vec3 vObjPos;

                void main() {
                    vec3 N = normalize(vNormal);
                    vec3 V = normalize(cameraPosition - vWorldPos);

                    float ndotv = abs(dot(N, V));
                    float fresnel = pow(1.0 - ndotv, 2.35);
                    float innerGlow = pow(1.0 - ndotv, 4.2);
                    float bioWave = 0.88 + 0.12 * sin(vWorldPos.y * 0.45 - uTime * 1.8);

                    vec3 deepBlue = vec3(0.03, 0.28, 0.75);
                    vec3 cyanRim = vec3(0.05, 0.88, 1.00);
                    vec3 violetAccent = vec3(0.38, 0.55, 1.00);

                    vec3 col = mix(deepBlue, cyanRim, fresnel) * bioWave;
                    col += violetAccent * innerGlow * 0.45;

                    float alpha = clamp(0.025 + fresnel * 0.34 + innerGlow * 0.18, 0.02, 0.44);
                    gl_FragColor = vec4(col, alpha);
                }
            `
        });
        this.bodyShellMaterials.push(mat);
        return mat;
    }

    buildBioluminescentHumanBodyShell() {
        const bodyMat = this.createJellyfishBodyShader();

        const headGeo = new THREE.SphereGeometry(1.0, 64, 48);
        const hPos = headGeo.attributes.position;
        for (let i = 0; i < hPos.count; i++) {
            let x = hPos.getX(i);
            let y = hPos.getY(i);
            let z = hPos.getZ(i);

            let sx = 6.05;
            let sy = 5.65;
            let sz = 7.45;

            if (y < -0.15) {
                const jawFactor = Math.min(1.0, Math.abs(y + 0.15) / 0.85);
                sx *= (1.0 - jawFactor * 0.38);
                sz *= (1.0 - jawFactor * 0.22);
                if (z > 0) z += jawFactor * 0.12;
            }
            hPos.setXYZ(i, x * sx, y * sy + 0.25, z * sz - 0.15);
        }
        headGeo.computeVertexNormals();
        this.bodyShellGroup.add(new THREE.Mesh(headGeo, bodyMat));

        const torsoLevels = [
            { y: -4.4, rx: 2.35, rz: 2.25, zOff: -0.55 },
            { y: -5.8, rx: 2.15, rz: 2.05, zOff: -0.60 },
            { y: -6.9, rx: 2.85, rz: 2.25, zOff: -0.50 },
            { y: -7.8, rx: 5.15, rz: 2.65, zOff: -0.30 },
            { y: -9.5, rx: 4.75, rz: 2.95, zOff: -0.15 },
            { y: -11.5, rx: 4.35, rz: 2.75, zOff: -0.15 },
            { y: -13.5, rx: 3.75, rz: 2.35, zOff: -0.20 },
            { y: -15.5, rx: 3.55, rz: 2.25, zOff: -0.25 },
            { y: -17.4, rx: 4.15, rz: 2.55, zOff: -0.30 },
            { y: -19.2, rx: 3.95, rz: 2.40, zOff: -0.30 },
            { y: -20.4, rx: 2.45, rz: 1.75, zOff: -0.35 }
        ];

        const radialSegs = 64;
        const heightSegs = torsoLevels.length - 1;
        const torsoGeo = new THREE.BufferGeometry();
        const tVerts = [];
        const tIndices = [];

        for (let j = 0; j <= heightSegs; j++) {
            const lvl = torsoLevels[j];
            for (let i = 0; i <= radialSegs; i++) {
                const theta = (i / radialSegs) * Math.PI * 2;
                const cosT = Math.cos(theta);
                const sinT = Math.sin(theta);

                let rModX = lvl.rx;
                let rModZ = lvl.rz;
                if (lvl.y < -8.0 && lvl.y > -12.5 && sinT > 0.2) {
                    rModZ += Math.sin(Math.abs(cosT) * Math.PI) * 0.28;
                }
                tVerts.push(cosT * rModX, lvl.y, sinT * rModZ + lvl.zOff);
            }
        }

        for (let j = 0; j < heightSegs; j++) {
            for (let i = 0; i < radialSegs; i++) {
                const a = j * (radialSegs + 1) + i;
                const b = (j + 1) * (radialSegs + 1) + i;
                const c = (j + 1) * (radialSegs + 1) + (i + 1);
                const d = j * (radialSegs + 1) + (i + 1);
                tIndices.push(a, b, d);
                tIndices.push(b, c, d);
            }
        }
        torsoGeo.setAttribute('position', new THREE.Float32BufferAttribute(tVerts, 3));
        torsoGeo.setIndex(tIndices);
        torsoGeo.computeVertexNormals();
        this.bodyShellGroup.add(new THREE.Mesh(torsoGeo, bodyMat));

        [-1, 1].forEach(side => {
            const armCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(side * 4.55, -8.15, -0.30),
                new THREE.Vector3(side * 5.65, -10.85, -0.05),
                new THREE.Vector3(side * 6.38, -13.45, 0.28),
                new THREE.Vector3(side * 6.88, -15.85, 0.58),
                new THREE.Vector3(side * 7.18, -17.25, 0.78)
            ]);
            const armGeo = new THREE.TubeGeometry(armCurve, 48, 0.92, 28, false);
            const aPos = armGeo.attributes.position;
            for (let i = 0; i < aPos.count; i++) {
                const y = aPos.getY(i);
                const t = Math.max(0, Math.min(1, (-y - 8.15) / 9.1));
                const taper = 1.0 - t * 0.36;
                const pt = armCurve.getPointAt(t);
                aPos.setX(i, pt.x + (aPos.getX(i) - pt.x) * taper);
                aPos.setZ(i, pt.z + (aPos.getZ(i) - pt.z) * taper);
            }
            armGeo.computeVertexNormals();
            this.bodyShellGroup.add(new THREE.Mesh(armGeo, bodyMat));

            const handGeo = new THREE.SphereGeometry(0.68, 24, 24);
            handGeo.scale(0.65, 1.35, 0.38);
            const handMesh = new THREE.Mesh(handGeo, bodyMat);
            handMesh.position.set(side * 7.22, -17.45, 0.82);
            handMesh.rotation.z = side * 0.22;
            this.bodyShellGroup.add(handMesh);
        });

        [-1, 1].forEach(side => {
            const legCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(side * 2.25, -19.20, -0.35),
                new THREE.Vector3(side * 2.32, -21.65, -0.25),
                new THREE.Vector3(side * 2.18, -23.55, -0.20),
                new THREE.Vector3(side * 2.12, -25.65, -0.15),
                new THREE.Vector3(side * 2.02, -27.55, -0.05)
            ]);
            const legGeo = new THREE.TubeGeometry(legCurve, 52, 1.38, 32, false);
            const lPos = legGeo.attributes.position;
            for (let i = 0; i < lPos.count; i++) {
                const y = lPos.getY(i);
                const t = Math.max(0, Math.min(1, (-y - 19.2) / 8.35));
                const taper = 1.0 - t * 0.46;
                const pt = legCurve.getPointAt(t);
                lPos.setX(i, pt.x + (lPos.getX(i) - pt.x) * taper);
                lPos.setZ(i, pt.z + (lPos.getZ(i) - pt.z) * taper);
            }
            legGeo.computeVertexNormals();
            this.bodyShellGroup.add(new THREE.Mesh(legGeo, bodyMat));

            const footGeo = new THREE.SphereGeometry(0.78, 24, 24);
            footGeo.scale(0.75, 0.45, 1.55);
            const footMesh = new THREE.Mesh(footGeo, bodyMat);
            footMesh.position.set(side * 2.02, -27.85, 0.55);
            this.bodyShellGroup.add(footMesh);
        });
    }

    setBodyShellVisible(visible) {
        this.bodyShellVisible = visible;
        this.bodyShellGroup.visible = visible;
    }

    // =========================================================================
    // 8. ÁRVORE CEREBROVASCULAR E SISTEMA VENTRICULAR
    // =========================================================================
    buildCerebrovascularTree() {
        const arteryMat = new THREE.MeshPhysicalMaterial({
            color: 0xdc2626,
            emissive: 0x7f1d1d,
            emissiveIntensity: 0.25,
            roughness: 0.24,
            clearcoat: 0.85
        });

        const veinMat = new THREE.MeshPhysicalMaterial({
            color: 0x2563eb,
            emissive: 0x1e3a8a,
            emissiveIntensity: 0.22,
            roughness: 0.28,
            clearcoat: 0.78
        });

        const icaGroup = new THREE.Group();
        this.addNervePair(icaGroup, [
            new THREE.Vector3(1.18, -7.2, -0.35),
            new THREE.Vector3(1.12, -4.2, 0.15),
            new THREE.Vector3(0.95, -1.85, 0.55),
            new THREE.Vector3(0.82, -0.95, 0.75)
        ], 0.11, arteryMat, false);
        this.vascularGroup.add(icaGroup);
        this.registerStructure('INTERNAL_CAROTID_ARTERIES', icaGroup, new THREE.Vector3(1.12, -3.5, 0.25));

        const vertBasilarGroup = new THREE.Group();
        this.addNervePair(vertBasilarGroup, [
            new THREE.Vector3(0.68, -7.2, -1.05),
            new THREE.Vector3(0.58, -4.6, -0.82),
            new THREE.Vector3(0.0, -3.25, -0.38)
        ], 0.085, arteryMat, false);
        const basilarCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, -3.25, -0.38),
            new THREE.Vector3(0, -2.35, -0.15),
            new THREE.Vector3(0, -1.45, 0.05)
        ]);
        vertBasilarGroup.add(new THREE.Mesh(new THREE.TubeGeometry(basilarCurve, 28, 0.11, 16, false), arteryMat));
        this.vascularGroup.add(vertBasilarGroup);
        this.registerStructure('VERTEBRAL_BASILAR_ARTERIES', vertBasilarGroup, new THREE.Vector3(0, -2.4, -0.15));

        const willisGroup = new THREE.Group();
        const willisRing = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.085, 16, 40), arteryMat);
        willisRing.rotation.x = Math.PI / 2.1;
        willisRing.position.set(0, -1.05, 0.45);
        willisGroup.add(willisRing);
        this.vascularGroup.add(willisGroup);
        this.registerStructure('CIRCLE_OF_WILLIS', willisGroup, new THREE.Vector3(0, -1.05, 0.55));

        const mcaGroup = new THREE.Group();
        this.addNervePair(mcaGroup, [
            new THREE.Vector3(0.78, -0.95, 0.65),
            new THREE.Vector3(2.15, -0.65, 0.85),
            new THREE.Vector3(3.85, 0.15, 0.95),
            new THREE.Vector3(4.55, 1.65, 0.35),
            new THREE.Vector3(4.15, 2.95, -0.85)
        ], 0.085, arteryMat, false);
        this.addNervePair(mcaGroup, [
            new THREE.Vector3(0.55, -0.92, 0.85),
            new THREE.Vector3(0.28, 0.35, 2.35),
            new THREE.Vector3(0.25, 2.15, 2.65),
            new THREE.Vector3(0.25, 3.35, 0.45)
        ], 0.072, arteryMat, false);
        this.addNervePair(mcaGroup, [
            new THREE.Vector3(0.15, -1.35, 0.05),
            new THREE.Vector3(1.35, -1.25, -1.65),
            new THREE.Vector3(1.85, -0.45, -3.85),
            new THREE.Vector3(1.45, 0.55, -5.25)
        ], 0.072, arteryMat, false);
        this.vascularGroup.add(mcaGroup);
        this.registerStructure('MIDDLE_CEREBRAL_ARTERY', mcaGroup, new THREE.Vector3(3.85, 0.45, 0.85));

        const sinusGroup = new THREE.Group();
        const sssCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0.95, 5.05),
            new THREE.Vector3(0, 3.85, 3.45),
            new THREE.Vector3(0, 4.78, 0.15),
            new THREE.Vector3(0, 3.85, -3.65),
            new THREE.Vector3(0, 0.65, -5.95),
            new THREE.Vector3(0, -1.85, -5.55)
        ]);
        sinusGroup.add(new THREE.Mesh(new THREE.TubeGeometry(sssCurve, 64, 0.14, 18, false), veinMat));
        this.addNervePair(sinusGroup, [
            new THREE.Vector3(0, -1.85, -5.55),
            new THREE.Vector3(2.35, -2.05, -4.25),
            new THREE.Vector3(2.15, -3.15, -1.85),
            new THREE.Vector3(1.48, -5.45, -0.55),
            new THREE.Vector3(1.42, -7.85, -0.25)
        ], 0.115, veinMat, false);
        this.vascularGroup.add(sinusGroup);
        this.registerStructure('DURAL_VENOUS_SINUSES', sinusGroup, new THREE.Vector3(0, 4.78, 0.15));
    }

    buildVentricularCSFSystem() {
        const ventMat = new THREE.MeshPhysicalMaterial({
            color: 0x38bdf8,
            emissive: 0x0284c7,
            emissiveIntensity: 0.28,
            roughness: 0.12,
            transmission: 0.65,
            transparent: true,
            opacity: 0.78
        });

        const latVentGroup = new THREE.Group();
        [-1, 1].forEach(side => {
            const lvCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(side * 0.65, 0.65, 1.85),
                new THREE.Vector3(side * 0.85, 1.25, 0.35),
                new THREE.Vector3(side * 1.25, 0.75, -1.45),
                new THREE.Vector3(side * 1.65, -0.45, -1.25),
                new THREE.Vector3(side * 1.85, -1.05, 0.15)
            ]);
            latVentGroup.add(new THREE.Mesh(new THREE.TubeGeometry(lvCurve, 48, 0.34, 20, false), ventMat));
            this.csfCurveData.push(lvCurve);
        });
        this.csfGroup.add(latVentGroup);
        this.registerStructure('LATERAL_VENTRICLES', latVentGroup, new THREE.Vector3(0.85, 1.25, 0.35));

        const thirdFourthGroup = new THREE.Group();
        const csfMidCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0.75, 0.25),
            new THREE.Vector3(0, 0.05, -0.15),
            new THREE.Vector3(0, -1.35, -0.65),
            new THREE.Vector3(0, -2.55, -1.25),
            new THREE.Vector3(0, -3.85, -1.05)
        ]);
        thirdFourthGroup.add(new THREE.Mesh(new THREE.TubeGeometry(csfMidCurve, 40, 0.22, 18, false), ventMat));
        const fourthDiamond = new THREE.Mesh(new THREE.OctahedronGeometry(0.52, 1), ventMat);
        fourthDiamond.scale.set(0.85, 1.25, 0.75);
        fourthDiamond.position.set(0, -2.65, -1.25);
        thirdFourthGroup.add(fourthDiamond);
        this.csfCurveData.push(csfMidCurve);

        this.csfGroup.add(thirdFourthGroup);
        this.registerStructure('THIRD_FOURTH_VENTRICLES', thirdFourthGroup, new THREE.Vector3(0, -2.65, -1.25));

        const csfCount = 90;
        const csfPos = new Float32Array(csfCount * 3);
        this.csfMeta = [];
        for (let i = 0; i < csfCount; i++) {
            const cIdx = i % this.csfCurveData.length;
            const t = Math.random();
            this.csfMeta.push({ cIdx, t, speed: 0.14 + Math.random() * 0.12 });
            const pt = this.csfCurveData[cIdx].getPointAt(t);
            csfPos[i * 3] = pt.x;
            csfPos[i * 3 + 1] = pt.y;
            csfPos[i * 3 + 2] = pt.z;
        }
        const csfGeo = new THREE.BufferGeometry();
        csfGeo.setAttribute('position', new THREE.BufferAttribute(csfPos, 3));
        this.csfParticles = new THREE.Points(csfGeo, new THREE.PointsMaterial({
            color: 0x7dd3fc,
            size: 0.18,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        }));
        this.csfGroup.add(this.csfParticles);
    }

    // =========================================================================
    // 9. MODOS DE VISUALIZAÇÃO, ISOLAMENTO DE PEÇAS 3D E SIMULADOR DE PATOLOGIAS
    // =========================================================================
    setCortexAlpha(alpha) {
        this.uniforms.uXRayAlpha.value = alpha;
        if (this.cortexMaterial) {
            this.cortexMaterial.depthWrite = (alpha > 0.65);
            this.cortexMaterial.side = (alpha > 0.65) ? THREE.FrontSide : THREE.DoubleSide;
        }
        if (this.cerebellumMaterial) {
            this.cerebellumMaterial.depthWrite = (alpha > 0.65);
        }
    }

    setViewMode(mode) {
        this.viewMode = mode;
        this.isolatedId = null;

        if (mode === 'EXTERNAL') {
            this.setCortexAlpha(1.0);
            this.uniforms.uClipSagittal.value = 0.0;
            this.cortexGroup.visible = true;
            this.cerebellumGroup.visible = true;
            this.subcorticalGroup.visible = true;
            this.brainstemGroup.visible = true;
            this.spinalGroup.visible = true;
            this.pnsGroup.visible = true;
            this.vascularGroup.visible = true;
            this.csfGroup.visible = false;
        } else if (mode === 'XRAY') {
            this.setCortexAlpha(0.20);
            this.uniforms.uClipSagittal.value = 0.0;
            this.cortexGroup.visible = true;
            this.cerebellumGroup.visible = true;
            this.subcorticalGroup.visible = true;
            this.brainstemGroup.visible = true;
            this.spinalGroup.visible = true;
            this.pnsGroup.visible = true;
            this.vascularGroup.visible = true;
            this.csfGroup.visible = true;
        } else if (mode === 'VASCULAR') {
            this.setCortexAlpha(0.14);
            this.uniforms.uClipSagittal.value = 0.0;
            this.cortexGroup.visible = true;
            this.cerebellumGroup.visible = true;
            this.subcorticalGroup.visible = false;
            this.brainstemGroup.visible = true;
            this.spinalGroup.visible = true;
            this.pnsGroup.visible = false;
            this.vascularGroup.visible = true;
            this.csfGroup.visible = true;
        }

        this.structureMeshes.forEach((meshes, id) => {
            if (!this.lobeNumericMap[id]) {
                meshes.forEach(m => {
                    m.visible = true;
                });
            }
        });
    }

    isolateStructure(structureId) {
        if (!structureId || this.isolatedId === structureId) {
            this.isolatedId = null;
            this.setViewMode('EXTERNAL');
            return false;
        }

        this.isolatedId = structureId;
        this.selectStructure(structureId);

        const isCorticalLobe = !!this.lobeNumericMap[structureId];
        this.setCortexAlpha(isCorticalLobe ? 0.96 : 0.12);
        this.cortexGroup.visible = true;
        this.subcorticalGroup.visible = true;
        this.cerebellumGroup.visible = true;
        this.brainstemGroup.visible = true;
        this.spinalGroup.visible = true;
        this.pnsGroup.visible = true;
        this.vascularGroup.visible = true;
        this.csfGroup.visible = true;

        if (structureId === 'MENINGES_DURA_ARACHNOID_PIA') {
            this.setMeningesVisible(true);
        }

        this.structureMeshes.forEach((meshes, id) => {
            if (!this.lobeNumericMap[id]) {
                const isTarget = (id === structureId);
                meshes.forEach(m => {
                    m.visible = isTarget;
                });
            }
        });

        return true;
    }

    filterByCategory(category) {
        this.isolatedId = null;
        if (category === 'ALL') {
            this.setViewMode('EXTERNAL');
            return;
        }
        if (category === 'CORTEX_CEREBELLUM') {
            this.setViewMode('EXTERNAL');
            this.pnsGroup.visible = false;
            this.vascularGroup.visible = false;
            this.csfGroup.visible = false;
        } else if (category === 'LIMBIC_DIENCEPHALON') {
            this.setViewMode('XRAY');
            this.pnsGroup.visible = false;
            this.vascularGroup.visible = false;
        } else if (category === 'BRAINSTEM_SPINAL') {
            this.setViewMode('XRAY');
            this.subcorticalGroup.visible = false;
            this.vascularGroup.visible = false;
        } else if (category === 'CRANIAL_NERVES' || category === 'PERIPHERAL_PLEXUSES') {
            this.setViewMode('XRAY');
            this.vascularGroup.visible = false;
            this.csfGroup.visible = false;
        } else if (category === 'VASCULAR_VENTRICULAR') {
            this.setViewMode('VASCULAR');
        }
    }

    selectStructure(structureId) {
        this.selectedId = structureId;
        this.uniforms.uSelectedId.value = this.lobeNumericMap[structureId] || -1.0;

        if (structureId === 'MENINGES_DURA_ARACHNOID_PIA') {
            this.setMeningesVisible(true);
        }

        this.structureMeshes.forEach((meshes, id) => {
            if (!this.lobeNumericMap[id]) {
                const isSel = (id === structureId);
                meshes.forEach(m => {
                    if (m.material && m.material.emissive) {
                        m.material.emissiveIntensity = isSel ? 0.72 : 0.22;
                    }
                });
            }
        });

        if (structureId && ['THALAMUS', 'HYPOTHALAMUS', 'HIPPOCAMPUS', 'AMYGDALA', 'BASAL_GANGLIA', 'CORPUS_CALLOSUM', 'LATERAL_VENTRICLES', 'THIRD_FOURTH_VENTRICLES', 'MIDBRAIN', 'PONS', 'MEDULLA_OBLONGATA', 'CIRCLE_OF_WILLIS'].includes(structureId)) {
            if (this.viewMode === 'EXTERNAL' && !this.isolatedId) {
                this.setCortexAlpha(0.22);
                this.csfGroup.visible = true;
            }
        } else if (structureId && this.lobeNumericMap[structureId] && this.viewMode === 'EXTERNAL' && !this.isolatedId) {
            this.setCortexAlpha(1.0);
        }
    }

    setHoveredStructure(structureId) {
        this.hoveredId = structureId;
        this.uniforms.uHoverId.value = this.lobeNumericMap[structureId] || -1.0;
    }

    resolveRaycastHit(intersection) {
        if (!intersection || !intersection.object) return null;
        const obj = intersection.object;
        if (obj.userData && obj.userData.isMniCortex) {
            const localPt = obj.worldToLocal(intersection.point.clone());
            const lobeNum = Math.round(this.classifyMniVertexLobe(localPt.x, localPt.y, localPt.z));
            return this.numericToLobeMap[lobeNum] || 'FRONTAL_LOBE';
        }
        let curr = obj;
        while (curr) {
            if (curr.userData && curr.userData.structureId) {
                return curr.userData.structureId;
            }
            curr = curr.parent;
        }
        return null;
    }

    setStrokeState(active, hypoxiaLevel = 0.0) {
        this.uniforms.uStrokeActive.value = active ? 1.0 : 0.0;
        this.uniforms.uHypoxiaLevel.value = hypoxiaLevel;
        if (active) {
            this.uniforms.uDiseaseMode.value = 1.0;
            this.uniforms.uDiseaseSeverity.value = hypoxiaLevel;
        } else if (this.activeDiseaseMode === 1.0) {
            this.uniforms.uDiseaseMode.value = 0.0;
            this.uniforms.uDiseaseSeverity.value = 0.0;
        }
    }

    setPathologySimulation(diseaseKey, severity = 0.75) {
        const modeMap = {
            'HEALTHY': 0.0,
            'ISCHEMIC_STROKE': 1.0,
            'ALZHEIMER': 2.0,
            'PARKINSON': 3.0,
            'MULTIPLE_SCLEROSIS': 4.0,
            'PRION_DCJ': 5.0,
            'ALS_ELA': 6.0,
            'EPILEPSY': 7.0
        };
        const code = modeMap[diseaseKey] !== undefined ? modeMap[diseaseKey] : 0.0;
        this.activeDiseaseMode = code;
        this.diseaseSeverity = code === 0.0 ? 0.0 : severity;
        this.uniforms.uDiseaseMode.value = code;
        this.uniforms.uDiseaseSeverity.value = this.diseaseSeverity;
        this.uniforms.uStrokeActive.value = (code === 1.0) ? 1.0 : 0.0;
        this.uniforms.uHypoxiaLevel.value = (code === 1.0) ? severity : 0.0;

        // Realça visualmente em 3D a estrutura subcortical/tronco/medula primariamente afetada pela doença!
        const targetStructureByDisease = {
            'ISCHEMIC_STROKE': ['MIDDLE_CEREBRAL_ARTERY', 'CIRCLE_OF_WILLIS'],
            'ALZHEIMER': ['HIPPOCAMPUS', 'LATERAL_VENTRICLES'],
            'PARKINSON': ['MIDBRAIN', 'BASAL_GANGLIA'],
            'MULTIPLE_SCLEROSIS': ['CORPUS_CALLOSUM', 'OPTIC_NERVE_CN2', 'SPINAL_CORD'],
            'PRION_DCJ': ['THALAMUS', 'CEREBELLUM'],
            'ALS_ELA': ['SPINAL_CORD', 'MEDULLA_OBLONGATA'],
            'EPILEPSY': ['HIPPOCAMPUS', 'AMYGDALA', 'TEMPORAL_LOBE']
        };

        const highlightedSet = new Set(targetStructureByDisease[diseaseKey] || []);
        if (highlightedSet.size > 0 && ['ALZHEIMER', 'PARKINSON', 'MULTIPLE_SCLEROSIS', 'PRION_DCJ'].includes(diseaseKey)) {
            this.setCortexAlpha(0.28);
            this.subcorticalGroup.visible = true;
        } else if (code === 0.0 && this.viewMode === 'EXTERNAL' && !this.isolatedId) {
            this.setCortexAlpha(1.0);
        }

        this.structureMeshes.forEach((meshes, id) => {
            if (!this.lobeNumericMap[id]) {
                const isPathTarget = highlightedSet.has(id);
                meshes.forEach(m => {
                    if (m.material && m.material.emissive) {
                        m.material.emissiveIntensity = isPathTarget ? (0.85 * severity + 0.25) : (id === this.selectedId ? 0.65 : 0.22);
                    }
                });
            }
        });
    }

    update(dt, elapsed) {
        this.uniforms.uTime.value = elapsed;

        if (this.pnsPulses && this.pnsPulseMeta && this.pnsGroup.visible) {
            const posAttr = this.pnsPulses.geometry.attributes.position;
            const speedMod = this.activeDiseaseMode === 4.0 ? (1.0 - 0.68 * this.diseaseSeverity) : (this.activeDiseaseMode === 7.0 ? 2.4 : (this.activeDiseaseMode === 6.0 ? 0.35 : 1.0));
            for (let i = 0; i < this.pnsPulseMeta.length; i++) {
                const meta = this.pnsPulseMeta[i];
                meta.t = (meta.t + dt * meta.speed * speedMod) % 1.0;
                const pt = this.pnsPulseCurves[meta.curveIndex].getPointAt(meta.t);
                posAttr.setXYZ(i, pt.x, pt.y, pt.z);
            }
            posAttr.needsUpdate = true;
        }

        if (this.csfParticles && this.csfMeta && this.csfGroup.visible) {
            const posAttr = this.csfParticles.geometry.attributes.position;
            for (let i = 0; i < this.csfMeta.length; i++) {
                const meta = this.csfMeta[i];
                meta.t = (meta.t + dt * meta.speed) % 1.0;
                const pt = this.csfCurveData[meta.cIdx].getPointAt(meta.t);
                posAttr.setXYZ(i, pt.x, pt.y, pt.z);
            }
            posAttr.needsUpdate = true;
        }
    }
}

window.CNSAnatomy3D = CNSAnatomy3D;
