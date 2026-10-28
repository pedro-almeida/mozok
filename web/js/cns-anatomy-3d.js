/**
 * MOZOK v5.0 — CNS & PNS Photorealistic 3D Anatomy + Bioluminescent Human Body Shell ("Água-Viva")
 * - Córtex Humano Real McGill BrainBrowser MNI152 (81.924 vértices / 163.840 triângulos) com coloração biológica real de tecido cortical humano vivo (sem listras artificiais)
 * - Cerebelo esculpido com folia horizontais delicadas, fissura prima, vérmis e árvore da vida (Arbor Vitae)
 * - Corpo Humano Translúcido Bioluminescente ("Água-Viva" Fresnel Ciano-Azul) envolvendo Crânio, Face, Pescoço, Tórax, Braços/Mãos, Pelve e Pernas/Pés
 * - Sistema Nervoso Central (SNC) e Sistema Nervoso Periférico (SNP) de corpo inteiro + Âncoras 3D exatas para Caixas Pop-up (HUD Callouts)
 */

class CNSAnatomy3D {
    constructor(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;

        this.rootGroup = new THREE.Group();
        this.scene.add(this.rootGroup);

        this.bodyShellGroup = new THREE.Group();
        this.cortexGroup = new THREE.Group();
        this.subcorticalGroup = new THREE.Group();
        this.cerebellumGroup = new THREE.Group();
        this.brainstemGroup = new THREE.Group();
        this.spinalGroup = new THREE.Group();
        this.pnsGroup = new THREE.Group();
        this.vascularGroup = new THREE.Group();
        this.csfGroup = new THREE.Group();

        this.rootGroup.add(this.bodyShellGroup);
        this.rootGroup.add(this.cortexGroup);
        this.rootGroup.add(this.subcorticalGroup);
        this.rootGroup.add(this.cerebellumGroup);
        this.rootGroup.add(this.brainstemGroup);
        this.rootGroup.add(this.spinalGroup);
        this.rootGroup.add(this.pnsGroup);
        this.rootGroup.add(this.vascularGroup);
        this.rootGroup.add(this.csfGroup);

        this.structureMeshes = new Map();
        this.structureAnchors = new Map(); // Coordenadas 3D exatas para as Caixas Pop-up
        this.interactiveMeshes = [];
        this.pnsPulseCurves = [];
        this.csfCurveData = [];

        this.viewMode = 'EXTERNAL'; // EXTERNAL | XRAY | VASCULAR | ISOLATED
        this.bodyShellVisible = true;
        this.selectedId = null;
        this.isolatedId = null;
        this.hoveredId = null;

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
            uStrokeCenter: { value: new THREE.Vector3(-4.0, 1.5, 0.8) },
            uStrokeRadius: { value: 3.5 },
            uHypoxiaLevel: { value: 0.0 },
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
        const hemiLight = new THREE.HemisphereLight(0xfff5f0, 0x101c30, 0.95);
        hemiLight.position.set(0, 28, 0);
        this.scene.add(hemiLight);

        const keyLight = new THREE.DirectionalLight(0xfff2ea, 1.25);
        keyLight.position.set(16, 22, 20);
        this.scene.add(keyLight);

        const fillLight = new THREE.DirectionalLight(0x60a5fa, 0.65);
        fillLight.position.set(-18, 6, -14);
        this.scene.add(fillLight);

        const rimLight = new THREE.DirectionalLight(0x00f2fe, 0.75);
        rimLight.position.set(0, -22, -18);
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
        this.buildSculptedCerebellum();
        this.buildSubcorticalAndLimbic();
        this.buildBrainstemAndSpinalCord();
        this.buildCranialAndPeripheralNerves();
        this.buildBioluminescentHumanBodyShell();
        this.buildCerebrovascularTree();
        this.buildVentricularCSFSystem();
    }

    // =========================================================================
    // 1. CÓRTEX HUMANO REAL (McGill MNI152 - 81.924 Vértices) COM COR DE CÉREBRO REAL
    // =========================================================================
    classifyMniVertexLobe(x, y, z) {
        const absX = Math.abs(x);
        if (absX < 2.35 && y > -1.4 && y < 1.9 && z > -2.3 && z < 2.2) {
            return 5.0; // INSULAR_CORTEX
        }
        if (y < 0.15 && z > -3.4 && z < 2.6 && absX > 2.05) {
            return 3.0; // TEMPORAL_LOBE
        }
        if (z < -3.05) {
            return 4.0; // OCCIPITAL_LOBE
        }
        const centralSulcusZ = 0.45 - (y * 0.22);
        if (z >= centralSulcusZ) {
            return 1.0; // FRONTAL_LOBE
        }
        return 2.0; // PARIETAL_LOBE
    }

    buildPhotorealisticMNICortex() {
        const meshData = window.REAL_MNI_BRAIN;
        let geometry;

        if (meshData && meshData.v && meshData.i) {
            geometry = new THREE.BufferGeometry();
            const vertCount = meshData.v.length / 3;
            const positions = new Float32Array(meshData.v.length);
            const lobeIds = new Float32Array(vertCount);
            const gyrusAttr = new Float32Array(vertCount);

            for (let i = 0; i < vertCount; i++) {
                const vx = meshData.v[i * 3];
                const vy = meshData.v[i * 3 + 1];
                const vz = meshData.v[i * 3 + 2];

                positions[i * 3] = vx;
                positions[i * 3 + 1] = vy;
                positions[i * 3 + 2] = vz;

                lobeIds[i] = this.classifyMniVertexLobe(vx, vy, vz);
                gyrusAttr[i] = (meshData.gyrus && meshData.gyrus[i] !== undefined) ? meshData.gyrus[i] : 0.65;
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('aLobeId', new THREE.BufferAttribute(lobeIds, 1));
            geometry.setAttribute('aGyrus', new THREE.BufferAttribute(gyrusAttr, 1));
            geometry.setIndex(new THREE.BufferAttribute(meshData.i, 1));
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
                gyrusAttr[i] = 0.65;
            }
            geometry.setAttribute('aLobeId', new THREE.BufferAttribute(lobeIds, 1));
            geometry.setAttribute('aGyrus', new THREE.BufferAttribute(gyrusAttr, 1));
        }

        // Shader de Tecido Cortical Humano Vivo (Sem listras artificiais, usando a profundidade real dos sulcos aGyrus do MNI152)
        this.cortexMaterial = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            transparent: true,
            side: THREE.DoubleSide,
            vertexShader: `
                attribute float aLobeId;
                attribute float aGyrus;
                varying vec3 vNormal;
                varying vec3 vWorldPos;
                varying vec3 vObjPos;
                varying float vLobeId;
                varying float vGyrus;

                void main() {
                    vLobeId = aLobeId;
                    vGyrus = aGyrus;
                    vObjPos = position;
                    vNormal = normalize(normalMatrix * normal);
                    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                    vWorldPos = worldPosition.xyz;
                    gl_Position = projectionMatrix * viewMatrix * worldPosition;
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
                uniform float uClipSagittal;

                varying vec3 vNormal;
                varying vec3 vWorldPos;
                varying vec3 vObjPos;
                varying float vLobeId;
                varying float vGyrus;

                // Micro-textura orgânica suave 3D (apenas para granulação celular sutil da pia-máter, sem listras)
                float hash31(vec3 p) {
                    p = fract(p * 0.1031);
                    p += dot(p, p.yzx + 33.33);
                    return fract((p.x + p.y) * p.z);
                }

                void main() {
                    if (uClipSagittal > 0.5 && vObjPos.x < -0.05) {
                        discard;
                    }

                    vec3 N = normalize(vNormal);
                    vec3 V = normalize(cameraPosition - vWorldPos);
                    vec3 L1 = normalize(vec3(16.0, 22.0, 20.0));
                    vec3 L2 = normalize(vec3(-16.0, 8.0, -14.0));

                    // Profundidade anatômica real dos giros (1.0 = topo do giro, 0.0 = fundo do sulco)
                    float gyrusFactor = smoothstep(0.08, 0.88, vGyrus);
                    float microGrain = (hash31(floor(vObjPos * 18.0)) - 0.5) * 0.018;

                    // Cores reais de tecido cortical humano in vivo:
                    // Topo do Giro: bege-rosado cremoso quente (substância cinzenta hidratada sob pia-máter)
                    // Transição do Giro: salmão-rosado vascularizado
                    // Fundo do Sulco: sombra anatômica profundo-avermelhada (onde correm as vênulas e arteríolas piais)
                    vec3 crownColor = vec3(0.93, 0.79, 0.75) + microGrain;
                    vec3 slopeColor = vec3(0.84, 0.62, 0.59);
                    vec3 sulcusColor = vec3(0.46, 0.24, 0.25);

                    vec3 baseTissue = mix(sulcusColor, slopeColor, smoothstep(0.0, 0.55, gyrusFactor));
                    baseTissue = mix(baseTissue, crownColor, smoothstep(0.45, 1.0, gyrusFactor));

                    // Tonalidade sutil de atlas somente quando selecionado ou em hover
                    vec3 lobeHighlight = vec3(1.0, 0.85, 0.65);
                    if (abs(vLobeId - 1.0) < 0.2) lobeHighlight = vec3(1.00, 0.58, 0.48); // Frontal
                    else if (abs(vLobeId - 2.0) < 0.2) lobeHighlight = vec3(0.98, 0.82, 0.38); // Parietal
                    else if (abs(vLobeId - 3.0) < 0.2) lobeHighlight = vec3(0.35, 0.90, 0.68); // Temporal
                    else if (abs(vLobeId - 4.0) < 0.2) lobeHighlight = vec3(0.45, 0.72, 1.00); // Occipital
                    else if (abs(vLobeId - 5.0) < 0.2) lobeHighlight = vec3(0.85, 0.52, 0.98); // Ínsula

                    // Iluminação difusa + Subsurface Scattering (SSS) de tecido vivo
                    float diff1 = max(dot(N, L1), 0.0);
                    float diff2 = max(dot(N, L2), 0.0) * 0.35;
                    float wrap1 = max((dot(N, L1) + 0.55) / 1.55, 0.0);
                    float sss = pow(clamp(1.0 - max(dot(N, V), 0.0), 0.0, 1.0), 2.3) * 0.32;

                    // Oclusão ambiental anatômica real nos sulcos
                    float ambientOcclusion = mix(0.42, 1.0, gyrusFactor);

                    // Reflexo especular úmido da membrana pia-máter + líquor
                    vec3 H1 = normalize(L1 + V);
                    float spec = pow(max(dot(N, H1), 0.0), 56.0) * 0.36 * (0.4 + 0.6 * gyrusFactor);

                    vec3 color = baseTissue * ambientOcclusion * (0.36 + 0.68 * wrap1 + diff2);
                    color += vec3(0.95, 0.38, 0.34) * sss * ambientOcclusion;
                    color += vec3(1.0, 0.97, 0.95) * spec;

                    // Simulação de Isquemia / Penumbra (AVC na Artéria Cerebral Média Esquerda)
                    if (uStrokeActive > 0.01) {
                        float distToCore = distance(vObjPos, uStrokeCenter);
                        if (distToCore < uStrokeRadius) {
                            float coreFactor = smoothstep(uStrokeRadius * 0.65, 0.0, distToCore) * uHypoxiaLevel;
                            float penumbraFactor = smoothstep(uStrokeRadius, uStrokeRadius * 0.4, distToCore) * uHypoxiaLevel;
                            vec3 penumbraCol = vec3(0.55, 0.22, 0.75) * (0.7 + 0.3 * sin(uTime * 5.0));
                            vec3 necroticCol = vec3(0.14, 0.12, 0.16);
                            color = mix(color, penumbraCol, penumbraFactor * 0.75);
                            color = mix(color, necroticCol, coreFactor * 0.92);
                        }
                    }

                    // Destaque quando um lobo específico está em Hover ou Selecionado
                    float isHovered = 1.0 - step(0.2, abs(vLobeId - uHoverId));
                    float isSelected = 1.0 - step(0.2, abs(vLobeId - uSelectedId));
                    if (isHovered > 0.5) {
                        color = mix(color, lobeHighlight, 0.28);
                        color += lobeHighlight * 0.16 * (0.5 + 0.5 * sin(uTime * 6.0));
                    }
                    if (isSelected > 0.5) {
                        float rim = pow(1.0 - max(dot(N, V), 0.0), 2.2);
                        color = mix(color, lobeHighlight, 0.35);
                        color += lobeHighlight * rim * 0.65;
                    }

                    float alpha = uXRayAlpha;
                    if (uXRayAlpha < 0.5) {
                        float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.2);
                        alpha = clamp(uXRayAlpha + fresnel * 0.42, 0.08, 0.78);
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

        // Registra os 5 Lobos Corticais e suas Âncoras 3D exatas para as Caixas Pop-up
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
    // 2. CEREBELO ESCULPIDO REALISTA (Folia Horizontais Finas, Vérmis & Arbor Vitae)
    // =========================================================================
    buildSculptedCerebellum() {
        this.cerebellumMaterial = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            transparent: true,
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vWorldPos;
                varying vec3 vObjPos;
                void main() {
                    vObjPos = position;
                    // Micro-relevo sutil das folia horizontais do cerebelo
                    float foliaWave = sin(position.y * 28.0 + sin(position.x * 4.0) * 1.5) * 0.032;
                    vec3 displaced = position + normal * foliaWave;
                    vNormal = normalize(normalMatrix * normal);
                    vec4 worldPosition = modelMatrix * vec4(displaced, 1.0);
                    vWorldPos = worldPosition.xyz;
                    gl_Position = projectionMatrix * viewMatrix * worldPosition;
                }
            `,
            fragmentShader: `
                uniform float uXRayAlpha;
                uniform float uSelectedId;
                varying vec3 vNormal;
                varying vec3 vWorldPos;
                varying vec3 vObjPos;

                void main() {
                    vec3 N = normalize(vNormal);
                    vec3 V = normalize(cameraPosition - vWorldPos);
                    vec3 L = normalize(vec3(14.0, 18.0, 18.0));

                    // Lâminas horizontais delicadas (Folia do Cerebelo) com cor biológica real
                    float foliaPattern = 0.5 + 0.5 * sin(vObjPos.y * 32.0 + sin(vObjPos.x * 5.0) * 1.4);
                    float foliaCrest = smoothstep(0.22, 0.85, foliaPattern);

                    // Fissura Prima e Fissura Horizontal
                    float primaryFissure = 1.0 - 0.35 * exp(-pow((vObjPos.y - 0.25) * 6.5, 2.0));

                    vec3 crestColor = vec3(0.86, 0.67, 0.64); // Rosa-acinzentado cerebelar real
                    vec3 sulcusColor = vec3(0.52, 0.31, 0.32); // Sulco fino entre as folia
                    vec3 baseCol = mix(sulcusColor, crestColor, foliaCrest) * primaryFissure;

                    float wrap = max((dot(N, L) + 0.5) / 1.5, 0.0);
                    vec3 H = normalize(L + V);
                    float spec = pow(max(dot(N, H), 0.0), 42.0) * 0.28 * foliaCrest;
                    float sss = pow(1.0 - max(dot(N, V), 0.0), 2.4) * 0.22;

                    vec3 finalCol = baseCol * (0.38 + 0.68 * wrap) + vec3(0.92, 0.42, 0.38) * sss + vec3(1.0, 0.95, 0.92) * spec;
                    float alpha = clamp(uXRayAlpha, 0.22, 1.0);
                    gl_FragColor = vec4(finalCol, alpha);
                }
            `
        });

        const cbGroup = new THREE.Group();

        // Hemisférios Cerebelares Esquerdo e Direito com formato anatômico bilobado
        [-1, 1].forEach(side => {
            const hemiGeo = new THREE.SphereGeometry(1.78, 72, 56);
            const pos = hemiGeo.attributes.position;
            for (let i = 0; i < pos.count; i++) {
                let x = pos.getX(i) * 1.18;
                let y = pos.getY(i) * 0.76;
                let z = pos.getZ(i) * 0.96;
                // Achata levemente a face superior (tentório do cerebelo) e arredonda a face posterior
                if (y > 0.3) y *= 0.82;
                pos.setXYZ(i, x, y, z);
            }
            hemiGeo.computeVertexNormals();
            const hemiMesh = new THREE.Mesh(hemiGeo, this.cerebellumMaterial);
            hemiMesh.position.set(side * 1.48, -3.15, -3.45);
            cbGroup.add(hemiMesh);
        });

        // Vérmis Cerebelar Mediano
        const vermisGeo = new THREE.CylinderGeometry(0.62, 0.58, 2.35, 36, 28);
        vermisGeo.rotateX(Math.PI * 0.14);
        const vermisMesh = new THREE.Mesh(vermisGeo, this.cerebellumMaterial);
        vermisMesh.position.set(0, -3.15, -3.38);
        cbGroup.add(vermisMesh);

        // Pedúnculos Cerebelares (Superior, Médio e Inferior conectando à Ponte)
        const peduncleMat = new THREE.MeshPhysicalMaterial({
            color: 0xeed8cf,
            roughness: 0.38,
            clearcoat: 0.45
        });
        [-1, 1].forEach(side => {
            const pedGeo = new THREE.CylinderGeometry(0.36, 0.42, 1.6, 20);
            pedGeo.rotateX(Math.PI / 2.3);
            pedGeo.rotateZ(side * -0.25);
            const pedMesh = new THREE.Mesh(pedGeo, peduncleMat);
            pedMesh.position.set(side * 0.85, -3.05, -2.05);
            cbGroup.add(pedMesh);
        });

        this.cerebellumGroup.add(cbGroup);
        this.registerStructure('CEREBELLUM', cbGroup, new THREE.Vector3(1.8, -3.15, -4.2));
    }

    // =========================================================================
    // 3. DIENCÉFALO, NÚCLEOS DA BASE E SISTEMA LÍMBICO (Subcortical)
    // =========================================================================
    createOrganicMaterial(hexColor, roughness = 0.35, clearcoat = 0.6, opacity = 0.96) {
        return new THREE.MeshPhysicalMaterial({
            color: hexColor,
            roughness: roughness,
            metalness: 0.04,
            clearcoat: clearcoat,
            clearcoatRoughness: 0.22,
            transparent: opacity < 1.0,
            opacity: opacity
        });
    }

    buildSubcorticalAndLimbic() {
        // 1. Corpo Caloso
        const ccCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0.2, 2.5),
            new THREE.Vector3(0, 1.45, 1.3),
            new THREE.Vector3(0, 1.65, -0.4),
            new THREE.Vector3(0, 1.15, -2.2),
            new THREE.Vector3(0, 0.45, -2.75)
        ]);
        const ccGeo = new THREE.TubeGeometry(ccCurve, 56, 0.42, 24, false);
        ccGeo.scale(2.8, 0.55, 1.0);
        const ccMat = this.createOrganicMaterial(0xf5e8df, 0.32, 0.65);
        const ccMesh = new THREE.Mesh(ccGeo, ccMat);
        this.subcorticalGroup.add(ccMesh);
        this.registerStructure('CORPUS_CALLOSUM', ccMesh, new THREE.Vector3(0, 1.65, 0.2));

        // 2. Tálamo (Bilateral + Aderência Intertalâmica)
        const thalGroup = new THREE.Group();
        const thalMat = this.createOrganicMaterial(0xd99b84, 0.35, 0.55);
        [-1, 1].forEach(side => {
            const tGeo = new THREE.SphereGeometry(0.92, 36, 36);
            tGeo.scale(0.82, 0.95, 1.35);
            const tMesh = new THREE.Mesh(tGeo, thalMat);
            tMesh.position.set(side * 0.92, 0.15, -0.35);
            thalGroup.add(tMesh);
        });
        const adhesio = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 1.2, 16), thalMat);
        adhesio.rotation.z = Math.PI / 2;
        adhesio.position.set(0, 0.18, -0.25);
        thalGroup.add(adhesio);
        this.subcorticalGroup.add(thalGroup);
        this.registerStructure('THALAMUS', thalGroup, new THREE.Vector3(0.92, 0.2, -0.35));

        // 3. Hipotálamo e Hipófise (Pituitária)
        const hypoGroup = new THREE.Group();
        const hypoMat = this.createOrganicMaterial(0xe07a5f, 0.34, 0.6);
        const hypoMesh = new THREE.Mesh(new THREE.SphereGeometry(0.55, 28, 28), hypoMat);
        hypoMesh.scale.set(0.9, 0.85, 1.1);
        hypoMesh.position.set(0, -0.78, 0.55);
        hypoGroup.add(hypoMesh);

        const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.08, 0.65, 16), hypoMat);
        stalk.position.set(0, -1.25, 0.72);
        stalk.rotation.x = 0.28;
        hypoGroup.add(stalk);

        const pituitary = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 24), this.createOrganicMaterial(0xe56b6f, 0.3, 0.7));
        pituitary.scale.set(1.2, 0.9, 1.0);
        pituitary.position.set(0, -1.58, 0.82);
        hypoGroup.add(pituitary);
        this.subcorticalGroup.add(hypoGroup);
        this.registerStructure('HYPOTHALAMUS', hypoGroup, new THREE.Vector3(0, -1.1, 0.75));

        // 4. Hipocampo e Fórnix
        const hippoGroup = new THREE.Group();
        const hippoMat = this.createOrganicMaterial(0xe9c46a, 0.36, 0.6);
        [-1, 1].forEach(side => {
            const hCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(side * 1.85, -1.35, 0.65),
                new THREE.Vector3(side * 2.15, -1.15, -0.45),
                new THREE.Vector3(side * 1.75, -0.35, -1.45),
                new THREE.Vector3(side * 0.95, 0.55, -1.15),
                new THREE.Vector3(side * 0.35, 0.75, -0.15)
            ]);
            const hGeo = new THREE.TubeGeometry(hCurve, 48, 0.28, 20, false);
            const hMesh = new THREE.Mesh(hGeo, hippoMat);
            hippoGroup.add(hMesh);
        });
        this.subcorticalGroup.add(hippoGroup);
        this.registerStructure('HIPPOCAMPUS', hippoGroup, new THREE.Vector3(1.95, -1.1, -0.2));

        // 5. Amígdala Cerebral
        const amygGroup = new THREE.Group();
        const amygMat = this.createOrganicMaterial(0xe63946, 0.3, 0.7);
        [-1, 1].forEach(side => {
            const aGeo = new THREE.SphereGeometry(0.42, 28, 28);
            aGeo.scale(1.1, 0.9, 1.25);
            const aMesh = new THREE.Mesh(aGeo, amygMat);
            aMesh.position.set(side * 1.82, -1.38, 1.05);
            amygGroup.add(aMesh);
        });
        this.subcorticalGroup.add(amygGroup);
        this.registerStructure('AMYGDALA', amygGroup, new THREE.Vector3(1.82, -1.38, 1.05));

        // 6. Núcleos da Base (Caudado, Putâmen e Globo Pálido)
        const bgGroup = new THREE.Group();
        const caudateMat = this.createOrganicMaterial(0x8ecae6, 0.36, 0.58);
        const putamenMat = this.createOrganicMaterial(0x5fa8d3, 0.38, 0.55);
        [-1, 1].forEach(side => {
            const cCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(side * 1.15, 0.65, 1.65),
                new THREE.Vector3(side * 1.35, 1.15, 0.35),
                new THREE.Vector3(side * 1.55, 0.65, -1.15),
                new THREE.Vector3(side * 1.85, -0.45, -1.45)
            ]);
            const cGeo = new THREE.TubeGeometry(cCurve, 44, 0.26, 18, false);
            bgGroup.add(new THREE.Mesh(cGeo, caudateMat));

            const pGeo = new THREE.SphereGeometry(0.82, 32, 32);
            pGeo.scale(0.55, 0.95, 1.35);
            const pMesh = new THREE.Mesh(pGeo, putamenMat);
            pMesh.position.set(side * 1.85, 0.12, 0.25);
            bgGroup.add(pMesh);
        });
        this.subcorticalGroup.add(bgGroup);
        this.registerStructure('BASAL_GANGLIA', bgGroup, new THREE.Vector3(1.85, 0.25, 0.35));
    }

    // =========================================================================
    // 4. TRONCO ENCEFÁLICO ESCULPIDO E MEDULA ESPINHAL ATÉ O CONE MEDULAR
    // =========================================================================
    buildBrainstemAndSpinalCord() {
        const stemMat = this.createOrganicMaterial(0xebd2c7, 0.36, 0.58);

        // 1. Mesencéfalo (Pedúnculos Cerebrais + Teto/Colículos)
        const midGroup = new THREE.Group();
        [-1, 1].forEach(side => {
            const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.44, 1.15, 28), stemMat);
            ped.position.set(side * 0.38, -1.35, -0.42);
            ped.rotation.z = side * -0.14;
            ped.rotation.x = 0.16;
            midGroup.add(ped);
        });
        this.brainstemGroup.add(midGroup);
        this.registerStructure('MIDBRAIN', midGroup, new THREE.Vector3(0, -1.35, -0.35));

        // 2. Ponte de Varólio (Protuberância Anular com fibras transversas suaves)
        const ponsGroup = new THREE.Group();
        const ponsGeo = new THREE.SphereGeometry(1.08, 42, 36);
        ponsGeo.scale(1.22, 0.96, 1.05);
        const ponsMesh = new THREE.Mesh(ponsGeo, this.createOrganicMaterial(0xe6c8bc, 0.38, 0.55));
        ponsMesh.position.set(0, -2.48, -0.58);
        ponsGroup.add(ponsMesh);
        this.brainstemGroup.add(ponsGroup);
        this.registerStructure('PONS', ponsGroup, new THREE.Vector3(0, -2.48, 0.35));

        // 3. Bulbo Raquidiano (Medula Oblonga com Pirâmides e Olivas Bulbares)
        const medGroup = new THREE.Group();
        const medGeo = new THREE.CylinderGeometry(0.68, 0.44, 1.65, 36, 20);
        const medMesh = new THREE.Mesh(medGeo, stemMat);
        medMesh.position.set(0, -3.95, -0.82);
        medMesh.rotation.x = -0.10;
        medGroup.add(medMesh);

        [-1, 1].forEach(side => {
            const olive = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 20), stemMat);
            olive.scale.set(0.8, 1.5, 0.85);
            olive.position.set(side * 0.42, -3.72, -0.42);
            medGroup.add(olive);
        });
        this.brainstemGroup.add(medGroup);
        this.registerStructure('MEDULLA_OBLONGATA', medGroup, new THREE.Vector3(0, -3.95, -0.4));

        // 4. Medula Espinhal Completa (Cervical, Torácica, Lombar, Cone Medular e Cauda Equina)
        const spinalCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, -4.75, -0.92),
            new THREE.Vector3(0, -6.50, -1.08),  // Intumescência Cervical (C4-T1)
            new THREE.Vector3(0, -9.80, -1.42),  // Cifose Torácica Alta
            new THREE.Vector3(0, -13.20, -1.52), // Torácica Baixa
            new THREE.Vector3(0, -15.80, -1.18), // Intumescência Lombossacral (L1-S3)
            new THREE.Vector3(0, -17.60, -1.05)  // Cone Medular (L1/L2)
        ]);

        const spinalGeo = new THREE.TubeGeometry(spinalCurve, 96, 0.34, 28, false);
        const pos = spinalGeo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const y = pos.getY(i);
            let radiusScale = 1.0;
            // Intumescência cervical
            if (y < -5.4 && y > -7.8) radiusScale = 1.24;
            // Intumescência lombossacral
            else if (y < -14.5 && y > -16.8) radiusScale = 1.22;
            // Afilamento do Cone Medular
            else if (y <= -16.8) radiusScale = Math.max(0.18, 1.0 - (Math.abs(y + 16.8) / 0.95));

            const centerApproxZ = -1.15;
            pos.setX(i, pos.getX(i) * radiusScale);
            pos.setZ(i, centerApproxZ + (pos.getZ(i) - centerApproxZ) * radiusScale * 0.85);
        }
        spinalGeo.computeVertexNormals();

        const spinalMat = this.createOrganicMaterial(0xf0dbd0, 0.34, 0.62);
        const spinalMesh = new THREE.Mesh(spinalGeo, spinalMat);

        const fullSpinalGroup = new THREE.Group();
        fullSpinalGroup.add(spinalMesh);

        // Cauda Equina e Filum Terminale descendo até o cóccix (Y = -20.5)
        const caudaMat = this.createOrganicMaterial(0xf6e5bc, 0.38, 0.5, 0.9);
        for (let r = -4; r <= 4; r++) {
            const spread = r * 0.14;
            const caudaCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(spread * 0.3, -17.3, -1.05),
                new THREE.Vector3(spread * 0.9, -18.8, -1.15),
                new THREE.Vector3(spread * 1.4, -20.4, -1.22)
            ]);
            const caudaGeo = new THREE.TubeGeometry(caudaCurve, 28, 0.045, 10, false);
            fullSpinalGroup.add(new THREE.Mesh(caudaGeo, caudaMat));
            this.pnsPulseCurves.push(caudaCurve);
        }

        // Gânglios da Raiz Dorsal (DRG) ao longo da coluna
        const drgMat = this.createOrganicMaterial(0xf4a261, 0.35, 0.55);
        for (let seg = 0; seg < 18; seg++) {
            const t = seg / 17;
            const pt = spinalCurve.getPointAt(t);
            [-1, 1].forEach(side => {
                const drg = new THREE.Mesh(new THREE.SphereGeometry(0.12, 14, 14), drgMat);
                drg.scale.set(1.4, 0.85, 0.85);
                drg.position.set(side * 0.52, pt.y, pt.z);
                fullSpinalGroup.add(drg);
            });
        }

        this.spinalGroup.add(fullSpinalGroup);
        this.registerStructure('SPINAL_CORD', fullSpinalGroup, new THREE.Vector3(0, -11.2, -1.4));
        this.pnsPulseCurves.push(spinalCurve);
    }

    // =========================================================================
    // 5. SISTEMA NERVOSO PERIFÉRICO (SNP) DE CORPO INTEIRO (12 Pares Cranianos + Plexos + Nervos dos Membros)
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
        // V1 Oftálmico, V2 Maxilar, V3 Mandibular
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
        // Ramos cardíacos, pulmonares e gástricos do Vago
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

        // 10. Nervos Mediano, Ulnar e Radial (Descendo pelos Braços, Antebraços e Mãos)
        const armNervesGroup = new THREE.Group();
        // Nervo Mediano (Central no braço/antebraço até os dedos)
        this.addNervePair(armNervesGroup, [
            new THREE.Vector3(4.65, -8.35, -0.28),
            new THREE.Vector3(5.65, -10.85, 0.05),
            new THREE.Vector3(6.35, -13.45, 0.38),
            new THREE.Vector3(6.85, -15.85, 0.68),
            new THREE.Vector3(7.15, -17.15, 0.85)
        ], 0.072, pnsTrunkMat);
        // Nervo Ulnar (Medial)
        this.addNervePair(armNervesGroup, [
            new THREE.Vector3(4.55, -8.55, -0.35),
            new THREE.Vector3(5.32, -11.05, -0.15),
            new THREE.Vector3(5.95, -13.65, 0.15),
            new THREE.Vector3(6.42, -15.95, 0.48),
            new THREE.Vector3(6.68, -17.10, 0.68)
        ], 0.062, pnsTrunkMat);
        // Nervo Radial (Lateral/Posterior + Ramos Digitais na Mão)
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
        // Troncos Simpáticos Paravertebrais com Gânglios
        this.addNervePair(intercostalGroup, [
            new THREE.Vector3(0.72, -7.2, -1.12),
            new THREE.Vector3(0.78, -10.5, -1.35),
            new THREE.Vector3(0.75, -13.8, -1.38),
            new THREE.Vector3(0.68, -16.8, -1.08)
        ], 0.065, autonomicMat);

        // 9 pares de arcos intercostais abraçando a caixa torácica
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

        // 12. Plexo Lombossacral e Nervo Femoral (L1–S4 -> Pelve e Coxa Anterior)
        const lumboGroup = new THREE.Group();
        [-14.6, -15.4, -16.2, -17.0].forEach((yL, idx) => {
            this.addNervePair(lumboGroup, [
                new THREE.Vector3(0.35, yL, -1.15),
                new THREE.Vector3(1.55, yL - 0.85, -0.85),
                new THREE.Vector3(2.45, -17.85 - idx * 0.25, -0.35)
            ], 0.075, pnsTrunkMat);
        });
        // Nervo Femoral e Nervo Safeno (Coxa anterior/medial)
        this.addNervePair(lumboGroup, [
            new THREE.Vector3(2.25, -17.65, -0.35),
            new THREE.Vector3(2.65, -19.85, 0.35),
            new THREE.Vector3(2.48, -22.45, 0.45),
            new THREE.Vector3(2.15, -25.25, 0.35)
        ], 0.075, pnsTrunkMat);
        this.pnsGroup.add(lumboGroup);
        this.registerStructure('LUMBOSACRAL_PLEXUS', lumboGroup, new THREE.Vector3(2.35, -18.5, -0.15));

        // 13. Nervo Ciático (Isquiático), Nervo Tibial e Fibular Comum (Descendo até os Pés)
        const sciaticGroup = new THREE.Group();
        // Tronco do Nervo Ciático (o maior nervo do corpo humano)
        this.addNervePair(sciaticGroup, [
            new THREE.Vector3(1.85, -17.85, -0.95),
            new THREE.Vector3(2.35, -19.65, -0.85),
            new THREE.Vector3(2.28, -21.85, -0.65),
            new THREE.Vector3(2.18, -23.45, -0.45)
        ], 0.115, pnsTrunkMat);
        // Divisão no Joelho: Nervo Tibial (Posterior da perna até a planta do pé)
        this.addNervePair(sciaticGroup, [
            new THREE.Vector3(2.18, -23.45, -0.45),
            new THREE.Vector3(2.05, -25.45, -0.38),
            new THREE.Vector3(1.92, -27.35, -0.25),
            new THREE.Vector3(1.98, -27.95, 0.65)
        ], 0.078, pnsTrunkMat);
        // Nervo Fibular Comum (Lateral/Anterior da perna até o dorso do pé)
        this.addNervePair(sciaticGroup, [
            new THREE.Vector3(2.18, -23.45, -0.45),
            new THREE.Vector3(2.48, -25.25, 0.05),
            new THREE.Vector3(2.25, -27.25, 0.25),
            new THREE.Vector3(2.15, -27.85, 0.95)
        ], 0.068, pnsTrunkMat);
        this.pnsGroup.add(sciaticGroup);
        this.registerStructure('SCIATIC_TIBIAL_FIBULAR_NERVES', sciaticGroup, new THREE.Vector3(2.25, -22.5, -0.55));

        // 14. Partículas Bioelétricas Rigorosamente Confinadas dentro dos Nervos do SNP
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
    // 6. CORPO HUMANO TRANSLÚCIDO BIOLUMINESCENTE ("ÁGUA-VIVA" FRESNEL CIANO-AZUL)
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

                    // Efeito Fresnel de "Água-Viva" Bioluminescente: interior quase invisível e bordas ciano-azuladas brilhantes
                    float ndotv = abs(dot(N, V));
                    float fresnel = pow(1.0 - ndotv, 2.35);
                    float innerGlow = pow(1.0 - ndotv, 4.2);

                    // Ondas bioelétricas suaves percorrendo a epiderme translúcida
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

        // 1. Crânio e Contorno Facial Translúcido (envolvendo o encéfalo MNI152 sem ocultá-lo)
        const headGeo = new THREE.SphereGeometry(1.0, 64, 48);
        const hPos = headGeo.attributes.position;
        for (let i = 0; i < hPos.count; i++) {
            let x = hPos.getX(i);
            let y = hPos.getY(i);
            let z = hPos.getZ(i);

            // Escala craniana envolvendo X:[-5.6, 5.6], Y:[-5.0, 5.6], Z:[-7.2, 7.2]
            let sx = 6.05;
            let sy = 5.65;
            let sz = 7.45;

            // Afinamento para mandíbula / queixo / face inferior
            if (y < -0.15) {
                const jawFactor = Math.min(1.0, Math.abs(y + 0.15) / 0.85);
                sx *= (1.0 - jawFactor * 0.38);
                sz *= (1.0 - jawFactor * 0.22);
                if (z > 0) z += jawFactor * 0.12; // Contorno suave do queixo/nariz
            }
            hPos.setXYZ(i, x * sx, y * sy + 0.25, z * sz - 0.15);
        }
        headGeo.computeVertexNormals();
        const headMesh = new THREE.Mesh(headGeo, bodyMat);
        this.bodyShellGroup.add(headMesh);

        // 2. Pescoço, Ombros, Tórax, Abdômen e Pelve (Malha Anatômica Contínua Esculpida)
        const torsoLevels = [
            { y: -4.4, rx: 2.35, rz: 2.25, zOff: -0.55 }, // Base do crânio / Pescoço superior
            { y: -5.8, rx: 2.15, rz: 2.05, zOff: -0.60 }, // Pescoço médio
            { y: -6.9, rx: 2.85, rz: 2.25, zOff: -0.50 }, // Base do pescoço / Trapézio
            { y: -7.8, rx: 5.15, rz: 2.65, zOff: -0.30 }, // Ombros / Clavículas
            { y: -9.5, rx: 4.75, rz: 2.95, zOff: -0.15 }, // Peitoral superior
            { y: -11.5, rx: 4.35, rz: 2.75, zOff: -0.15 }, // Caixa torácica média
            { y: -13.5, rx: 3.75, rz: 2.35, zOff: -0.20 }, // Cintura / Epigástrio
            { y: -15.5, rx: 3.55, rz: 2.25, zOff: -0.25 }, // Abdômen médio
            { y: -17.4, rx: 4.15, rz: 2.55, zOff: -0.30 }, // Crista Ilíaca / Pelve superior
            { y: -19.2, rx: 3.95, rz: 2.40, zOff: -0.30 }, // Quadril
            { y: -20.4, rx: 2.45, rz: 1.75, zOff: -0.35 }  // Base pélvica
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

                // Contorno anatômico peitoral/dorsal suave
                let rModX = lvl.rx;
                let rModZ = lvl.rz;
                if (lvl.y < -8.0 && lvl.y > -12.5 && sinT > 0.2) {
                    rModZ += Math.sin(Math.abs(cosT) * Math.PI) * 0.28; // Relevo peitoral
                }
                const vx = cosT * rModX;
                const vy = lvl.y;
                const vz = sinT * rModZ + lvl.zOff;
                tVerts.push(vx, vy, vz);
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

        // 3. Membros Superiores Translúcidos (Ombros, Braços, Antebraços e Mãos envolvendo os Nervos Mediano/Ulnar/Radial)
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
                const taper = 1.0 - t * 0.36; // Afila suavemente do deltoide ao punho
                const pt = armCurve.getPointAt(t);
                aPos.setX(i, pt.x + (aPos.getX(i) - pt.x) * taper);
                aPos.setZ(i, pt.z + (aPos.getZ(i) - pt.z) * taper);
            }
            armGeo.computeVertexNormals();
            this.bodyShellGroup.add(new THREE.Mesh(armGeo, bodyMat));

            // Mão translúcida na extremidade
            const handGeo = new THREE.SphereGeometry(0.68, 24, 24);
            handGeo.scale(0.65, 1.35, 0.38);
            const handMesh = new THREE.Mesh(handGeo, bodyMat);
            handMesh.position.set(side * 7.22, -17.45, 0.82);
            handMesh.rotation.z = side * 0.22;
            this.bodyShellGroup.add(handMesh);
        });

        // 4. Membros Inferiores Translúcidos (Coxas, Joelhos, Pernas e Pés envolvendo os Nervos Femoral/Ciático/Tibial/Fibular)
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
                const taper = 1.0 - t * 0.46; // Afila da coxa ao tornozelo
                const pt = legCurve.getPointAt(t);
                lPos.setX(i, pt.x + (lPos.getX(i) - pt.x) * taper);
                lPos.setZ(i, pt.z + (lPos.getZ(i) - pt.z) * taper);
            }
            legGeo.computeVertexNormals();
            this.bodyShellGroup.add(new THREE.Mesh(legGeo, bodyMat));

            // Pé translúcido
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
    // 7. ÁRVORE CEREBROVASCULAR (Polígono de Willis, Carótidas, Vertebrais, Basilar, ACM, ACA, ACP e Seios Venosos)
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

        // 1. Artérias Carótidas Internas
        const icaGroup = new THREE.Group();
        this.addNervePair(icaGroup, [
            new THREE.Vector3(1.18, -7.2, -0.35),
            new THREE.Vector3(1.12, -4.2, 0.15),
            new THREE.Vector3(0.95, -1.85, 0.55),
            new THREE.Vector3(0.82, -0.95, 0.75)
        ], 0.11, arteryMat, false);
        this.vascularGroup.add(icaGroup);
        this.registerStructure('INTERNAL_CAROTID_ARTERIES', icaGroup, new THREE.Vector3(1.12, -3.5, 0.25));

        // 2. Artérias Vertebrais e Artéria Basilar
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

        // 3. Polígono de Willis
        const willisGroup = new THREE.Group();
        const willisRing = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.085, 16, 40), arteryMat);
        willisRing.rotation.x = Math.PI / 2.1;
        willisRing.position.set(0, -1.05, 0.45);
        willisGroup.add(willisRing);
        this.vascularGroup.add(willisGroup);
        this.registerStructure('CIRCLE_OF_WILLIS', willisGroup, new THREE.Vector3(0, -1.05, 0.55));

        // 4. Artérias Cerebrais Médias (ACM), Anteriores (ACA) e Posteriores (ACP)
        const mcaGroup = new THREE.Group();
        // ACM (Irrigando a face lateral do córtex)
        this.addNervePair(mcaGroup, [
            new THREE.Vector3(0.78, -0.95, 0.65),
            new THREE.Vector3(2.15, -0.65, 0.85),
            new THREE.Vector3(3.85, 0.15, 0.95),
            new THREE.Vector3(4.55, 1.65, 0.35),
            new THREE.Vector3(4.15, 2.95, -0.85)
        ], 0.085, arteryMat, false);
        // ACA (Fissura inter-hemisférica)
        this.addNervePair(mcaGroup, [
            new THREE.Vector3(0.55, -0.92, 0.85),
            new THREE.Vector3(0.28, 0.35, 2.35),
            new THREE.Vector3(0.25, 2.15, 2.65),
            new THREE.Vector3(0.25, 3.35, 0.45)
        ], 0.072, arteryMat, false);
        // ACP (Lobo Occipital)
        this.addNervePair(mcaGroup, [
            new THREE.Vector3(0.15, -1.35, 0.05),
            new THREE.Vector3(1.35, -1.25, -1.65),
            new THREE.Vector3(1.85, -0.45, -3.85),
            new THREE.Vector3(1.45, 0.55, -5.25)
        ], 0.072, arteryMat, false);
        this.vascularGroup.add(mcaGroup);
        this.registerStructure('MIDDLE_CEREBRAL_ARTERY', mcaGroup, new THREE.Vector3(3.85, 0.45, 0.85));

        // 5. Seio Sagital Superior, Seio Transverso e Veias Jugulares Internas
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
        // Seios Transversos/Sigmoides + Veias Jugulares Internas
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

    // =========================================================================
    // 8. SISTEMA VENTRICULAR E FLUXO DO LÍQUOR (CSF) CONFINADO NAS CAVIDADES
    // =========================================================================
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

        // 1. Ventrículos Laterais (Cornos Frontal, Temporal e Occipital)
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

        // 2. Terceiro Ventrículo, Aqueduto de Sylvius e Quarto Ventrículo
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

        // Partículas do Líquor (CSF) estritamente dentro dos ventrículos
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
    // 9. MODOS DE VISUALIZAÇÃO, ISOLAMENTO DE PEÇAS 3D E FILTROS DE CATEGORIA
    // =========================================================================
    setViewMode(mode) {
        this.viewMode = mode;
        this.isolatedId = null;

        if (mode === 'EXTERNAL') {
            this.uniforms.uXRayAlpha.value = 1.0;
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
            this.uniforms.uXRayAlpha.value = 0.20;
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
            this.uniforms.uXRayAlpha.value = 0.14;
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

        // Restaura opacidade das malhas não-corticais
        this.structureMeshes.forEach((meshes, id) => {
            if (!this.lobeNumericMap[id]) {
                meshes.forEach(m => {
                    m.visible = true;
                    if (m.material && m.material.opacity !== undefined && m.material !== this.cerebellumMaterial) {
                        m.material.opacity = 0.95;
                    }
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
        this.uniforms.uXRayAlpha.value = isCorticalLobe ? 0.92 : 0.12;
        this.cortexGroup.visible = true;
        this.subcorticalGroup.visible = true;
        this.cerebellumGroup.visible = true;
        this.brainstemGroup.visible = true;
        this.spinalGroup.visible = true;
        this.pnsGroup.visible = true;
        this.vascularGroup.visible = true;
        this.csfGroup.visible = true;

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

        this.structureMeshes.forEach((meshes, id) => {
            if (!this.lobeNumericMap[id]) {
                const isSel = (id === structureId);
                meshes.forEach(m => {
                    if (m.material && m.material.emissive) {
                        m.material.emissiveIntensity = isSel ? 0.65 : 0.22;
                    }
                });
            }
        });

        if (structureId && ['THALAMUS', 'HYPOTHALAMUS', 'HIPPOCAMPUS', 'AMYGDALA', 'BASAL_GANGLIA', 'CORPUS_CALLOSUM', 'LATERAL_VENTRICLES', 'THIRD_FOURTH_VENTRICLES'].includes(structureId)) {
            if (this.viewMode === 'EXTERNAL' && !this.isolatedId) {
                this.uniforms.uXRayAlpha.value = 0.24;
                this.csfGroup.visible = true;
            }
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
    }

    update(dt, elapsed) {
        this.uniforms.uTime.value = elapsed;

        // Atualiza os impulsos bioelétricos rigorosamente ao longo das curvas dos nervos periféricos
        if (this.pnsPulses && this.pnsPulseMeta && this.pnsGroup.visible) {
            const posAttr = this.pnsPulses.geometry.attributes.position;
            for (let i = 0; i < this.pnsPulseMeta.length; i++) {
                const meta = this.pnsPulseMeta[i];
                meta.t = (meta.t + dt * meta.speed) % 1.0;
                const pt = this.pnsPulseCurves[meta.curveIndex].getPointAt(meta.t);
                posAttr.setXYZ(i, pt.x, pt.y, pt.z);
            }
            posAttr.needsUpdate = true;
        }

        // Atualiza a circulação do Líquor (CSF) dentro dos ventrículos
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
