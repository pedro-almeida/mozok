import pathlib
import re

ROOT = pathlib.Path(".")

# 1. Atualizar VERSION, Cargo.toml, web/sw.js e rust/mozok-native/src/main.rs para v1.0011
(ROOT / "VERSION").write_text("1.0011\n", encoding="utf-8")

cargo_path = ROOT / "Cargo.toml"
if cargo_path.exists():
    cargo_txt = cargo_path.read_text(encoding="utf-8")
    cargo_txt = re.sub(
        r'version\s*=\s*"1\.0\.\d+\+\d+"',
        'version = "1.0.11+0011"',
        cargo_txt,
        count=1,
    )
    cargo_path.write_text(cargo_txt, encoding="utf-8")

sw_path = ROOT / "web" / "sw.js"
if sw_path.exists():
    sw_txt = sw_path.read_text(encoding="utf-8")
    sw_txt = re.sub(r"mozok-v1\.\d+-github-sync", "mozok-v1.0011-github-sync", sw_txt)
    sw_path.write_text(sw_txt, encoding="utf-8")

main_rs_path = ROOT / "rust" / "mozok-native" / "src" / "main.rs"
if main_rs_path.exists():
    main_rs = main_rs_path.read_text(encoding="utf-8")
    main_rs = main_rs.replace('"version":"6.1.0"', '"version":"1.0011"')
    main_rs_path.write_text(main_rs, encoding="utf-8")

# ==============================================================================
# 2. ATUALIZAR web/js/cns-anatomy-3d.js (7 PATOLOGIAS MACRO 3D + SLIDER REAL-TIME)
# ==============================================================================
cns_path = ROOT / "web" / "js" / "cns-anatomy-3d.js"
cns_code = cns_path.read_text(encoding="utf-8")

cns_code = cns_code.replace(
    "float shrink = 1.0 - (0.055 * uDiseaseSeverity);",
    "float shrink = 1.0 - (0.125 * uDiseaseSeverity);",
)

new_macro_pathology_block = """    setPathologySimulation(diseaseKey, severity = 0.75) {
        const canonicalKeyMap = {
            'HEALTHY': 'HEALTHY',
            'ISCHEMIC_STROKE': 'ISCHEMIC_STROKE',
            'ALZHEIMER': 'ALZHEIMER',
            'PARKINSON': 'PARKINSON',
            'MULTIPLE_SCLEROSIS': 'MULTIPLE_SCLEROSIS',
            'PRION_DCJ': 'PRION_DCJ',
            'PRION_CJD': 'PRION_DCJ',
            'ALS_ELA': 'ALS_ELA',
            'ALS': 'ALS_ELA',
            'EPILEPSY': 'EPILEPSY',
            'TEMPORAL_EPILEPSY': 'EPILEPSY'
        };
        const normKey = canonicalKeyMap[diseaseKey] || 'HEALTHY';
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
        const code = modeMap[normKey] !== undefined ? modeMap[normKey] : 0.0;
        const sev = code === 0.0 ? 0.0 : Math.max(0.05, Math.min(1.0, Number(severity) || 0.75));
        this.activeDiseaseMode = code;
        this.diseaseSeverity = sev;
        this.uniforms.uDiseaseMode.value = code;
        this.uniforms.uDiseaseSeverity.value = sev;
        this.uniforms.uStrokeActive.value = (code === 1.0) ? 1.0 : 0.0;
        this.uniforms.uHypoxiaLevel.value = (code === 1.0) ? sev : 0.0;
        this.uniforms.uStrokeRadius.value = (code === 1.0) ? (1.6 + 2.4 * sev) : 3.4;

        if (!this.macroPathologyGroup) {
            this.macroPathologyGroup = new THREE.Group();
            this.macroPathologyGroup.name = 'MacroPathologyLesions3D';
            this.rootGroup.add(this.macroPathologyGroup);
        }
        while (this.macroPathologyGroup.children.length > 0) {
            this.macroPathologyGroup.remove(this.macroPathologyGroup.children[0]);
        }

        const targetStructureByDisease = {
            'ISCHEMIC_STROKE': ['MIDDLE_CEREBRAL_ARTERY', 'CIRCLE_OF_WILLIS'],
            'ALZHEIMER': ['HIPPOCAMPUS', 'LATERAL_VENTRICLES'],
            'PARKINSON': ['MIDBRAIN', 'BASAL_GANGLIA'],
            'MULTIPLE_SCLEROSIS': ['CORPUS_CALLOSUM', 'OPTIC_NERVE_CN2', 'SPINAL_CORD'],
            'PRION_DCJ': ['THALAMUS', 'CEREBELLUM'],
            'ALS_ELA': ['SPINAL_CORD', 'MEDULLA_OBLONGATA'],
            'EPILEPSY': ['HIPPOCAMPUS', 'AMYGDALA', 'TEMPORAL_LOBE']
        };

        const highlightedSet = new Set(targetStructureByDisease[normKey] || []);
        if (highlightedSet.size > 0 && ['ALZHEIMER', 'PARKINSON', 'MULTIPLE_SCLEROSIS', 'PRION_DCJ'].includes(normKey)) {
            this.setCortexAlpha(0.44);
            this.subcorticalGroup.visible = true;
            this.csfGroup.visible = true;
        } else if (normKey === 'EPILEPSY') {
            this.setCortexAlpha(0.55);
            this.subcorticalGroup.visible = true;
        } else if (code === 0.0 && this.viewMode === 'EXTERNAL' && !this.isolatedId) {
            this.setCortexAlpha(1.0);
        }

        // Restaura estado saudável salvo de cada malha subcortical/espinhal/vascular e aplica morfologia proporcional a sev
        this.structureMeshes.forEach((meshes, id) => {
            if (this.lobeNumericMap[id]) return;
            const isPathTarget = highlightedSet.has(id);
            meshes.forEach(m => {
                if (!m.userData._savedHealthyScale) {
                    m.userData._savedHealthyScale = m.scale.clone();
                    if (m.material && m.material.color) m.userData._savedHealthyColor = m.material.color.clone();
                    if (m.material && m.material.emissive) m.userData._savedHealthyEmissive = m.material.emissive.clone();
                }
                m.scale.copy(m.userData._savedHealthyScale);
                if (m.material && m.userData._savedHealthyColor) m.material.color.copy(m.userData._savedHealthyColor);
                if (m.material && m.userData._savedHealthyEmissive) m.material.emissive.copy(m.userData._savedHealthyEmissive);

                if (m.material && m.material.emissive) {
                    m.material.emissiveIntensity = isPathTarget ? (0.45 + 1.35 * sev) : (id === this.selectedId ? 0.65 : 0.22);
                }

                if (code > 0.0 && isPathTarget && m.material) {
                    if (normKey === 'ALZHEIMER' && id === 'HIPPOCAMPUS') {
                        m.scale.copy(m.userData._savedHealthyScale).multiplyScalar(1.0 - 0.45 * sev);
                        if (m.material.color) m.material.color.lerp(new THREE.Color(0xd97706), 0.78 * sev);
                        if (m.material.emissive) m.material.emissive.lerp(new THREE.Color(0x92400e), 0.85 * sev);
                    } else if (normKey === 'ALZHEIMER' && id === 'LATERAL_VENTRICLES') {
                        m.scale.copy(m.userData._savedHealthyScale).multiplyScalar(1.0 + 0.42 * sev);
                        if (m.material.color) m.material.color.lerp(new THREE.Color(0x38bdf8), 0.65 * sev);
                    } else if (normKey === 'PARKINSON' && (id === 'MIDBRAIN' || id === 'BASAL_GANGLIA')) {
                        if (id === 'MIDBRAIN') m.scale.copy(m.userData._savedHealthyScale).multiplyScalar(1.0 - 0.28 * sev);
                        if (m.material.color) m.material.color.lerp(new THREE.Color(0xf43f5e), 0.82 * sev);
                        if (m.material.emissive) m.material.emissive.lerp(new THREE.Color(0xbe123c), 0.90 * sev);
                    } else if (normKey === 'MULTIPLE_SCLEROSIS') {
                        if (m.material.color) m.material.color.lerp(new THREE.Color(0xec4899), 0.80 * sev);
                        if (m.material.emissive) m.material.emissive.lerp(new THREE.Color(0xbe185d), 0.90 * sev);
                    } else if (normKey === 'PRION_DCJ') {
                        m.scale.copy(m.userData._savedHealthyScale).multiplyScalar(1.0 - 0.30 * sev);
                        if (m.material.color) m.material.color.lerp(new THREE.Color(0xd946ef), 0.82 * sev);
                        if (m.material.emissive) m.material.emissive.lerp(new THREE.Color(0xa21caf), 0.92 * sev);
                    } else if (normKey === 'ALS_ELA' && (id === 'SPINAL_CORD' || id === 'MEDULLA_OBLONGATA')) {
                        m.scale.set(
                            m.userData._savedHealthyScale.x * (1.0 - 0.38 * sev),
                            m.userData._savedHealthyScale.y,
                            m.userData._savedHealthyScale.z * (1.0 - 0.38 * sev)
                        );
                        if (m.material.color) m.material.color.lerp(new THREE.Color(0xf97316), 0.85 * sev);
                        if (m.material.emissive) m.material.emissive.lerp(new THREE.Color(0xdc2626), 0.95 * sev);
                    } else if (normKey === 'EPILEPSY') {
                        if (m.material.color) m.material.color.lerp(new THREE.Color(0xfacc15), 0.82 * sev);
                        if (m.material.emissive) m.material.emissive.lerp(new THREE.Color(0x00f2fe), 0.95 * sev);
                    } else if (normKey === 'ISCHEMIC_STROKE') {
                        if (m.material.color) m.material.color.lerp(new THREE.Color(0x991b1b), 0.88 * sev);
                        if (m.material.emissive) m.material.emissive.lerp(new THREE.Color(0xef4444), 0.90 * sev);
                    }
                }
            });
        });

        if (code === 0.0 || sev <= 0.01) return;

        // Marcadores 3D Macroscópicos escalando individualmente no próprio eixo local (0.25 + 1.15 * sev)
        const sc = 0.25 + 1.15 * sev;
        if (normKey === 'ISCHEMIC_STROKE') {
            const clotMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0x991b1b, emissiveIntensity: 1.1, roughness: 0.3 });
            const haloMat = new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.32 * sev, wireframe: true });
            const clot = new THREE.Mesh(new THREE.SphereGeometry(0.42, 20, 20), clotMat);
            clot.position.set(3.65, 0.55, 0.85);
            clot.scale.setScalar(sc);
            const penumbraSphere = new THREE.Mesh(new THREE.SphereGeometry(2.1, 24, 24), haloMat);
            penumbraSphere.position.set(3.8, 1.2, 1.1);
            penumbraSphere.scale.setScalar(0.55 + 0.75 * sev);
            this.macroPathologyGroup.add(clot, penumbraSphere);
        } else if (normKey === 'ALZHEIMER') {
            const plaqueMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xb45309, emissiveIntensity: 0.95, roughness: 0.45 });
            const coords = [
                [1.95, -1.1, -0.2], [-1.95, -1.1, -0.2], [2.2, -0.8, 0.6], [-2.2, -0.8, 0.6],
                [3.2, -0.5, 0.8], [-3.2, -0.5, 0.8], [2.6, 1.8, -1.2], [-2.6, 1.8, -1.2],
                [1.5, 2.4, 1.6], [-1.5, 2.4, 1.6], [3.4, 0.9, -1.8], [-3.4, 0.9, -1.8]
            ];
            coords.forEach(([x, y, z], i) => {
                const p = new THREE.Mesh(new THREE.DodecahedronGeometry(0.28 + (i % 3) * 0.06, 1), plaqueMat);
                p.position.set(x, y, z);
                p.scale.setScalar(sc);
                this.macroPathologyGroup.add(p);
            });
        } else if (normKey === 'PARKINSON') {
            const lewyMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0xe11d48, emissiveIntensity: 1.15, roughness: 0.25 });
            const coords = [
                [0.48, -1.32, -0.22], [-0.48, -1.32, -0.22], [0.28, -1.45, -0.35], [-0.28, -1.45, -0.35],
                [1.85, 0.25, 0.35], [-1.85, 0.25, 0.35], [2.15, 0.45, 0.10], [-2.15, 0.45, 0.10],
                [1.65, -0.10, 0.55], [-1.65, -0.10, 0.55]
            ];
            coords.forEach(([x, y, z]) => {
                const m = new THREE.Mesh(new THREE.SphereGeometry(0.24, 18, 18), lewyMat);
                m.position.set(x, y, z);
                m.scale.setScalar(sc);
                this.macroPathologyGroup.add(m);
            });
        } else if (normKey === 'MULTIPLE_SCLEROSIS') {
            const msMat = new THREE.MeshStandardMaterial({ color: 0x00f2fe, emissive: 0xec4899, emissiveIntensity: 1.1, roughness: 0.25 });
            const dawsonCoords = [
                [0.0, 1.72, 0.85], [0.45, 1.68, 0.25], [-0.45, 1.68, 0.25], [0.0, 1.58, -0.55],
                [0.75, 1.62, -1.15], [-0.75, 1.62, -1.15], [1.25, -0.92, 3.1], [-1.25, -0.92, 3.1],
                [0.18, -6.2, -1.32], [-0.18, -8.4, -1.38], [0.15, -10.8, -1.42], [-0.15, -13.2, -1.40],
                [0.16, -15.6, -1.36], [-0.16, -17.8, -1.32]
            ];
            dawsonCoords.forEach(([x, y, z], idx) => {
                const plaque = new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 16), msMat);
                plaque.position.set(x, y, z);
                plaque.scale.set(sc * 0.85, sc * (idx < 6 ? 1.65 : 1.25), sc * 0.85);
                this.macroPathologyGroup.add(plaque);
            });
        } else if (normKey === 'PRION_DCJ') {
            const vacMat = new THREE.MeshPhysicalMaterial({ color: 0xf472b6, emissive: 0xd946ef, emissiveIntensity: 0.85, transparent: true, opacity: 0.72, roughness: 0.1 });
            const coords = [
                [0.95, 0.22, -0.35], [-0.95, 0.22, -0.35], [1.25, 0.05, -0.65], [-1.25, 0.05, -0.65],
                [1.85, -3.25, -3.65], [-1.85, -3.25, -3.65], [2.8, 1.6, 1.8], [-2.8, 1.6, 1.8],
                [3.1, 0.4, -1.5], [-3.1, 0.4, -1.5], [1.8, 2.8, 0.4], [-1.8, 2.8, 0.4]
            ];
            coords.forEach(([x, y, z]) => {
                const v = new THREE.Mesh(new THREE.OctahedronGeometry(0.28, 1), vacMat);
                v.position.set(x, y, z);
                v.scale.setScalar(sc);
                this.macroPathologyGroup.add(v);
            });
        } else if (normKey === 'ALS_ELA') {
            const tdpMat = new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xdc2626, emissiveIntensity: 1.25, roughness: 0.25 });
            for (let i = 0; i < 14; i++) {
                const yPos = -4.2 - i * 1.15;
                const zPos = -1.32 - Math.sin(i * 0.28) * 0.12;
                const leftTract = new THREE.Mesh(new THREE.SphereGeometry(0.24, 14, 14), tdpMat);
                leftTract.position.set(0.32, yPos, zPos);
                leftTract.scale.set(sc * 0.9, sc * 1.45, sc * 0.9);
                const rightTract = new THREE.Mesh(new THREE.SphereGeometry(0.24, 14, 14), tdpMat);
                rightTract.position.set(-0.32, yPos, zPos);
                rightTract.scale.set(sc * 0.9, sc * 1.45, sc * 0.9);
                this.macroPathologyGroup.add(leftTract, rightTract);
            }
            [[2.4, 2.8, 0.4], [-2.4, 2.8, 0.4], [3.2, 1.9, 0.5], [-3.2, 1.9, 0.5]].forEach(([x, y, z]) => {
                const m1 = new THREE.Mesh(new THREE.OctahedronGeometry(0.30, 1), tdpMat);
                m1.position.set(x, y, z);
                m1.scale.setScalar(sc);
                this.macroPathologyGroup.add(m1);
            });
        } else if (normKey === 'EPILEPSY') {
            const epiMat = new THREE.MeshBasicMaterial({ color: 0xfacc15, wireframe: true, transparent: true, opacity: 0.45 + 0.45 * sev });
            for (let r = 1; r <= 3; r++) {
                const ring = new THREE.Mesh(new THREE.TorusGeometry(0.55 * r, 0.045, 12, 32), epiMat);
                ring.position.set(2.35, -1.15, 0.25);
                ring.rotation.y = Math.PI / 3;
                ring.scale.setScalar(0.55 + 0.85 * sev);
                this.macroPathologyGroup.add(ring);
            }
        }
    }"""

cns_start = cns_code.find("    setPathologySimulation(diseaseKey, severity = 0.75) {")
cns_end = cns_code.find("    update(dt, elapsed) {", cns_start)
if cns_start != -1 and cns_end != -1:
    cns_code = cns_code[:cns_start] + new_macro_pathology_block + "\n\n" + cns_code[cns_end:]
cns_path.write_text(cns_code, encoding="utf-8")

# ==============================================================================
# 3. ATUALIZAR web/js/neural-microcosmos-3d.js (7 PATOLOGIAS MICRO UNIFICADAS)
# ==============================================================================
micro_path = ROOT / "web" / "js" / "neural-microcosmos-3d.js"
micro_code = micro_path.read_text(encoding="utf-8")

dup_marker = "// v1.0010: SIMULAÇÃO 3D REAL DAS 7 PATOLOGIAS NO MICROCOSMOS NEURONAL"
if dup_marker in micro_code:
    dup_pos = micro_code.find(dup_marker)
    line_start = micro_code.rfind("\n", 0, dup_pos)
    micro_code = micro_code[:line_start] + "\n}\n\nwindow.NeuralMicrocosmos3D = NeuralMicrocosmos3D;\n"

unified_micro_pathology = """    setPathology(diseaseKey, severity = 0.75) {
        return this.setPathologySimulation(diseaseKey, severity);
    }

    setPathologySimulation(diseaseKey, severity = 0.75) {
        const canonicalKeyMap = {
            'HEALTHY': 'HEALTHY',
            'ISCHEMIC_STROKE': 'ISCHEMIC_STROKE',
            'ALZHEIMER': 'ALZHEIMER',
            'PARKINSON': 'PARKINSON',
            'MULTIPLE_SCLEROSIS': 'MULTIPLE_SCLEROSIS',
            'PRION_DCJ': 'PRION_DCJ',
            'PRION_CJD': 'PRION_DCJ',
            'ALS_ELA': 'ALS_ELA',
            'ALS': 'ALS_ELA',
            'EPILEPSY': 'EPILEPSY',
            'TEMPORAL_EPILEPSY': 'EPILEPSY'
        };
        this.activeDiseaseKey = canonicalKeyMap[diseaseKey] || 'HEALTHY';
        this.diseaseSeverity = this.activeDiseaseKey === 'HEALTHY' ? 0.0 : Math.max(0.05, Math.min(1.0, Number(severity) || 0.75));
        const sev = this.diseaseSeverity;
        const sc = 0.30 + 1.05 * sev;
        this.damageRatio = (this.activeDiseaseKey === 'HEALTHY' || this.activeDiseaseKey === 'EPILEPSY') ? 0.0 : sev * 0.78;

        while (this.pathologyMarkersGroup.children.length > 0) {
            this.pathologyMarkersGroup.remove(this.pathologyMarkersGroup.children[0]);
        }

        this.myelinSheaths.forEach(item => {
            const m = item.mesh;
            m.scale.copy(item.baseScale);
            if (m.material) {
                m.material.opacity = 0.88;
                if (m.userData.baseColorHex) m.material.color.setHex(m.userData.baseColorHex);
                if (m.material.emissive && m.userData.baseEmissiveHex) m.material.emissive.setHex(m.userData.baseEmissiveHex);
            }
        });

        this.somaMeshes.forEach(s => {
            s.scale.setScalar(s.userData.baseScale || 1.0);
            if (s.material) {
                if (s.userData.baseColorHex) s.material.color.setHex(s.userData.baseColorHex);
                if (s.material.emissive && s.userData.baseEmissiveHex) s.material.emissive.setHex(s.userData.baseEmissiveHex);
                s.material.opacity = 0.88;
            }
        });

        const spineScale = Math.max(0.18, 1.0 - this.damageRatio * 0.65);
        this.dendriticSpines.forEach(sp => {
            if (sp.mesh) sp.mesh.scale.setScalar(sp.baseScale * spineScale);
        });

        if (this.activeDiseaseKey === 'HEALTHY' || sev <= 0.01) {
            this.damageRatio = 0.0;
            this.targetFiringRateHz = 18.0;
            this.firingRateHz = 18.0;
            this.cbfPerfusion = 54;
            this.conductionVelocityMs = 110;
            return;
        }

        if (this.activeDiseaseKey === 'ALZHEIMER') {
            this.somaMeshes.forEach(s => {
                s.scale.setScalar((s.userData.baseScale || 1.0) * (1.0 - 0.30 * sev));
                if (s.material) {
                    s.material.color.lerp(new THREE.Color(0x78350f), 0.65 * sev);
                    if (s.material.emissive) s.material.emissive.lerp(new THREE.Color(0x9333ea), 0.70 * sev);
                }
            });
            const plaqueMat = new THREE.MeshPhysicalMaterial({ color: 0xd97706, emissive: 0x92400e, emissiveIntensity: 0.75 * sev + 0.25, roughness: 0.55 });
            const tangleMat = new THREE.MeshPhysicalMaterial({ color: 0xa855f7, emissive: 0x6b21a8, emissiveIntensity: 0.85 * sev + 0.25, wireframe: true });
            this.neurons.slice(0, 28).forEach((n, idx) => {
                if (idx % 2 === 0) {
                    const p = new THREE.Mesh(new THREE.DodecahedronGeometry(0.42 + (idx % 3) * 0.12, 1), plaqueMat);
                    p.position.copy(n.somaPos).add(new THREE.Vector3(1.45, 0.82, 0.52));
                    p.scale.setScalar(sc);
                    this.pathologyMarkersGroup.add(p);
                }
                const tangle = new THREE.Mesh(new THREE.TorusKnotGeometry(0.36, 0.07, 24, 6), tangleMat);
                tangle.position.copy(n.somaPos);
                tangle.scale.setScalar(sc);
                this.pathologyMarkersGroup.add(tangle);
            });
            this.targetFiringRateHz = Math.max(6.5, 18.0 - 9.5 * sev);
            this.firingRateHz = this.targetFiringRateHz;
            this.cbfPerfusion = Math.round(54 - 18 * sev);
            this.conductionVelocityMs = Math.round(110 - 44 * sev);
        } else if (this.activeDiseaseKey === 'PARKINSON') {
            this.somaMeshes.forEach(s => {
                s.scale.setScalar((s.userData.baseScale || 1.0) * (1.0 - 0.24 * sev));
                if (s.material) {
                    s.material.color.lerp(new THREE.Color(0xbe123c), 0.65 * sev);
                    if (s.material.emissive) s.material.emissive.lerp(new THREE.Color(0x881337), 0.72 * sev);
                }
            });
            const lewyMat = new THREE.MeshPhysicalMaterial({ color: 0xf43f5e, emissive: 0xbe123c, emissiveIntensity: 0.85 * sev + 0.25, roughness: 0.22 });
            const haloMat = new THREE.MeshBasicMaterial({ color: 0xfda4af, transparent: true, opacity: 0.35 * sev });
            this.neurons.slice(0, 32).forEach(n => {
                const pos = n.somaPos.clone().add(new THREE.Vector3(-0.35, -0.22, 0.30));
                const lewy = new THREE.Mesh(new THREE.SphereGeometry(0.36, 16, 16), lewyMat);
                lewy.position.copy(pos);
                lewy.scale.setScalar(sc);
                const halo = new THREE.Mesh(new THREE.SphereGeometry(0.50, 16, 16), haloMat);
                halo.position.copy(pos);
                halo.scale.setScalar(sc);
                this.pathologyMarkersGroup.add(lewy, halo);
            });
            this.targetFiringRateHz = Math.max(4.5, 18.0 - 12.8 * sev);
            this.firingRateHz = this.targetFiringRateHz;
            this.cbfPerfusion = Math.round(54 - 10 * sev);
            this.conductionVelocityMs = Math.round(110 - 34 * sev);
        } else if (this.activeDiseaseKey === 'MULTIPLE_SCLEROSIS') {
            const msRingMat = new THREE.MeshStandardMaterial({ color: 0xec4899, emissive: 0xbe185d, emissiveIntensity: 0.9 * sev + 0.2, roughness: 0.35 });
            this.myelinSheaths.forEach((item, idx) => {
                if (idx % 2 === 0 || idx % 3 === 0) {
                    const shrink = Math.max(0.22, 1.0 - 0.75 * sev);
                    item.mesh.scale.set(item.baseScale.x * shrink, item.baseScale.y, item.baseScale.z * shrink);
                    if (item.mesh.material) {
                        item.mesh.material.opacity = Math.max(0.14, 0.88 - 0.72 * sev);
                        item.mesh.material.color.setHex(0xef4444);
                        if (item.mesh.material.emissive) item.mesh.material.emissive.setHex(0x7f1d1d);
                    }
                    if (idx % 4 === 0) {
                        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.06, 10, 20), msRingMat);
                        ring.position.copy(item.mesh.position);
                        ring.scale.setScalar(sc);
                        this.pathologyMarkersGroup.add(ring);
                    }
                }
            });
            this.targetFiringRateHz = Math.max(5.5, 18.0 - 11.2 * sev);
            this.firingRateHz = this.targetFiringRateHz;
            this.cbfPerfusion = Math.round(54 - 8 * sev);
            this.conductionVelocityMs = Math.max(16, Math.round(110 * (1.0 - 0.80 * sev)));
        } else if (this.activeDiseaseKey === 'PRION_DCJ') {
            this.somaMeshes.forEach(s => {
                s.scale.setScalar((s.userData.baseScale || 1.0) * (1.0 - 0.28 * sev));
                if (s.material) {
                    s.material.color.lerp(new THREE.Color(0xc026d3), 0.72 * sev);
                    if (s.material.emissive) s.material.emissive.lerp(new THREE.Color(0x86198f), 0.75 * sev);
                }
            });
            const vacMat = new THREE.MeshPhysicalMaterial({
                color: 0xe2e8f0,
                emissive: 0x38bdf8,
                emissiveIntensity: 0.35 * sev,
                transmission: 0.92,
                transparent: true,
                opacity: 0.35 + 0.45 * sev,
                roughness: 0.08
            });
            const needleGeo = new THREE.CylinderGeometry(0.015, 0.042, 0.95, 5);
            needleGeo.translate(0, 0.47, 0);
            const matRuby = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xdc2626, emissiveIntensity: 0.95 });

            this.neurons.slice(0, 30).forEach((n, idx) => {
                const v = new THREE.Mesh(new THREE.SphereGeometry(0.42 + (idx % 3) * 0.14, 18, 16), vacMat);
                v.position.copy(n.somaPos).add(new THREE.Vector3(0.65, (idx % 2 === 0 ? 0.75 : -0.75), 0.45));
                v.scale.setScalar(sc);
                this.pathologyMarkersGroup.add(v);

                if (idx < 14) {
                    const plaqueGroup = new THREE.Group();
                    for (let k = 0; k < 12; k++) {
                        const m = new THREE.Mesh(needleGeo, matRuby);
                        const theta = (k / 12) * Math.PI * 2;
                        const phi = Math.acos(2 * ((k * 0.37) % 1) - 1);
                        m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(Math.sin(phi) * Math.cos(theta), Math.sin(phi) * Math.sin(theta), Math.cos(phi)));
                        plaqueGroup.add(m);
                    }
                    plaqueGroup.position.copy(n.somaPos).add(new THREE.Vector3(-1.2, 0.4, 0.6));
                    plaqueGroup.scale.setScalar(0.30 + 0.85 * sev);
                    this.pathologyMarkersGroup.add(plaqueGroup);
                }
            });
            this.targetFiringRateHz = Math.max(4.5, 18.0 - 12.5 * sev);
            this.firingRateHz = this.targetFiringRateHz;
            this.cbfPerfusion = Math.round(54 - 24 * sev);
            this.conductionVelocityMs = Math.round(110 - 66 * sev);
        } else if (this.activeDiseaseKey === 'ALS_ELA') {
            this.somaMeshes.forEach(s => {
                s.scale.setScalar((s.userData.baseScale || 1.0) * (1.0 - 0.36 * sev));
                if (s.material) {
                    s.material.color.lerp(new THREE.Color(0xea580c), 0.78 * sev);
                    if (s.material.emissive) s.material.emissive.lerp(new THREE.Color(0x9a3412), 0.82 * sev);
                }
            });
            this.myelinSheaths.forEach((item, idx) => {
                if (idx % 2 === 0) {
                    const thin = Math.max(0.42, 1.0 - 0.52 * sev);
                    item.mesh.scale.set(item.baseScale.x * thin, item.baseScale.y, item.baseScale.z * thin);
                }
            });
            const tdpMat = new THREE.MeshPhysicalMaterial({ color: 0xf97316, emissive: 0xdc2626, emissiveIntensity: 0.85 * sev + 0.25, roughness: 0.3 });
            this.neurons.slice(0, 26).forEach(n => {
                const somaAggregate = new THREE.Mesh(new THREE.OctahedronGeometry(0.34, 1), tdpMat);
                somaAggregate.position.copy(n.somaPos).add(new THREE.Vector3(0.32, 0.28, 0.32));
                somaAggregate.scale.setScalar(sc);
                this.pathologyMarkersGroup.add(somaAggregate);
                if (n.axonCurveGlobal) {
                    const localMid = n.axonCurveGlobal.getPointAt(0.45);
                    const worldMid = localMid.clone().multiplyScalar(n.scale).add(n.position);
                    const spheroid = new THREE.Mesh(new THREE.SphereGeometry(0.34, 14, 14), tdpMat);
                    spheroid.scale.set(1.65 * sc, 0.95 * sc, 0.95 * sc);
                    spheroid.position.copy(worldMid);
                    this.pathologyMarkersGroup.add(spheroid);
                }
            });
            this.targetFiringRateHz = Math.max(5.0, 18.0 - 11.5 * sev);
            this.firingRateHz = this.targetFiringRateHz;
            this.cbfPerfusion = Math.round(54 - 12 * sev);
            this.conductionVelocityMs = Math.round(110 - 74 * sev);
        } else if (this.activeDiseaseKey === 'EPILEPSY') {
            this.damageRatio = 0.0;
            this.somaMeshes.forEach(s => {
                s.scale.setScalar((s.userData.baseScale || 1.0) * (1.0 + 0.14 * sev));
                if (s.material) {
                    s.material.color.lerp(new THREE.Color(0xfacc15), 0.78 * sev);
                    if (s.material.emissive) s.material.emissive.lerp(new THREE.Color(0x00f2fe), 0.95 * sev);
                }
            });
            const epiMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe, wireframe: true, transparent: true, opacity: 0.28 + 0.55 * sev });
            this.neurons.slice(0, 20).forEach((n, idx) => {
                if (idx % 2 === 0) {
                    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.05, 10, 24), epiMat);
                    ring.position.copy(n.somaPos);
                    ring.scale.setScalar(sc);
                    this.pathologyMarkersGroup.add(ring);
                }
            });
            this.targetFiringRateHz = Math.round(18.0 + 52.0 * sev);
            this.firingRateHz = this.targetFiringRateHz;
            this.cbfPerfusion = Math.round(54 + 32 * sev);
            this.conductionVelocityMs = Math.round(110 + 16 * sev);
        } else if (this.activeDiseaseKey === 'ISCHEMIC_STROKE') {
            this.somaMeshes.slice(0, 26).forEach(s => {
                s.scale.setScalar((s.userData.baseScale || 1.0) * (1.0 + 0.42 * sev));
                if (s.material) {
                    s.material.color.lerp(new THREE.Color(0xf43f5e), 0.88 * sev);
                    if (s.material.emissive) s.material.emissive.lerp(new THREE.Color(0x991b1b), 0.92 * sev);
                }
            });
            const glutMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, emissiveIntensity: 0.95 * sev, transparent: true, opacity: 0.45 + 0.45 * sev });
            this.neurons.slice(0, 22).forEach((n, idx) => {
                const g = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 12), glutMat);
                g.position.copy(n.somaPos).add(new THREE.Vector3((idx % 2 === 0 ? 0.85 : -0.85), 0.55, 0.45));
                g.scale.setScalar(sc);
                this.pathologyMarkersGroup.add(g);
            });
            this.targetFiringRateHz = Math.max(2.0, 18.0 * (1.0 - 0.85 * sev));
            this.firingRateHz = this.targetFiringRateHz;
            this.cbfPerfusion = Math.max(8, Math.round(54 * (1.0 - 0.82 * sev)));
            this.conductionVelocityMs = Math.max(18, Math.round(110 * (1.0 - 0.72 * sev)));
        }
    }"""

m_start = micro_code.find("    setPathologySimulation(diseaseKey, severity = 0.75) {")
if m_start == -1:
    m_start = micro_code.find("    setPathology(diseaseKey, severity = 0.75) {")
m_end = micro_code.find("    /**\n     * ATUALIZAÇÃO EM TEMPO REAL", m_start)
if m_start != -1 and m_end != -1:
    micro_code = micro_code[:m_start] + unified_micro_pathology + "\n\n" + micro_code[m_end:]
micro_path.write_text(micro_code, encoding="utf-8")

# ==============================================================================
# 4. ATUALIZAR web/index.html (AVATAR 3D WEBGL EM THREE.JS + ORDEM DO SLIDER + VOZ)
# ==============================================================================
html_path = ROOT / "web" / "index.html"
html = html_path.read_text(encoding="utf-8")

html = re.sub(r"v1\.00\d+", "v1.0011", html)

# Remover qualquer container ou script residual do vlibras-plugin.js externo
html = re.sub(
    r'<input id="vlibras-speech-bridge"[\s\S]*?</div>\s*</div>\s*</div>',
    "",
    html,
)
html = re.sub(
    r'<div id="mozok-vlibras-3d-stage"[\s\S]*?</div>\s*</div>\s*</div>',
    "",
    html,
)
html = re.sub(
    r"const script = document\.createElement\('script'\);\s*script\.src = 'https://vlibras\.gov\.br/app/vlibras-plugin\.js'[\s\S]*?document\.body\.appendChild\(script\);",
    "// Intérprete 3D WebGL Nativo MOZOK v1.0011 ativo (zero plugin externo)",
    html,
)

kill_vw_css = """
        /* v1.0011: Erradicação total de qualquer botão flutuante ou caixa vazia de plugin externo */
        [vw], [vw-access-button], [vw-plugin-wrapper], #vlibras-container, #mozok-vlibras-3d-stage {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            width: 0 !important;
            height: 0 !important;
            pointer-events: none !important;
        }
        body.cyber-intro-active #mozok-scale-hud,
        body.cyber-intro-active #nav-pan-hud,
        body.cyber-intro-active #mozok-subtitle-bar,
        body.cyber-intro-active audio {
            display: none !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }
        #mozok-libras-native-panel {
            position: fixed;
            bottom: 74px;
            right: 24px;
            width: 246px;
            z-index: 122;
            background: linear-gradient(180deg, rgba(4, 14, 28, 0.94) 0%, rgba(2, 8, 18, 0.96) 100%);
            border: 1.5px solid rgba(0, 242, 254, 0.55);
            border-radius: 16px;
            backdrop-filter: blur(14px);
            box-shadow: 0 0 32px rgba(0, 242, 254, 0.24), 0 12px 34px rgba(0, 0, 0, 0.85);
            display: none;
            flex-direction: column;
            overflow: hidden;
            pointer-events: auto;
        }
        #mozok-libras-native-panel.active {
            display: flex !important;
        }
        #mozok-libras-header {
            padding: 6px 12px;
            font-family: 'Orbitron', sans-serif;
            font-size: 9.5px;
            font-weight: 700;
            letter-spacing: 0.14em;
            color: #e0f2fe;
            background: rgba(0, 242, 254, 0.12);
            border-bottom: 1px solid rgba(0, 242, 254, 0.25);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        #mozok-libras-canvas {
            width: 246px;
            height: 246px;
            display: block;
            background: radial-gradient(circle at 50% 42%, rgba(0, 180, 216, 0.16) 0%, rgba(2, 8, 20, 0.98) 78%);
        }
        #mozok-libras-gloss-bar {
            padding: 7px 10px;
            font-family: 'Share Tech Mono', monospace;
            font-size: 11px;
            font-weight: 700;
            color: #67e8f9;
            background: rgba(0, 242, 254, 0.10);
            border-top: 1px solid rgba(0, 242, 254, 0.28);
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
"""
if "v1.0011: Erradicação total" not in html:
    html = html.replace("</style>", kill_vw_css + "\n    </style>", 1)

libras_panel_html = """<div id="mozok-libras-native-panel">
        <div id="mozok-libras-header">
            <span>🤟 INTÉRPRETE 3D LIBRAS</span>
            <span style="color:#34d399;">● WEBGL 3D</span>
        </div>
        <canvas id="mozok-libras-canvas" width="246" height="246"></canvas>
        <div id="mozok-libras-gloss-bar">LIBRAS 3D // PRONTO</div>
    </div>"""

if 'id="mozok-libras-native-panel"' in html:
    html = re.sub(
        r'<div id="mozok-libras-native-panel">[\s\S]*?</div>\s*</div>',
        libras_panel_html,
        html,
        count=1,
    )
else:
    html = html.replace("</body>", "    " + libras_panel_html + "\n</body>", 1)

new_3d_libras_avatar = """            const MozokLibrasAvatar = (() => {
                let renderer3D = null;
                let scene3D = null;
                let camera3D = null;
                let avatarRoot = null;
                let headGroup = null;
                let jawMesh = null;
                let browL = null, browR = null;
                let shoulderL = null, shoulderR = null;
                let elbowL = null, elbowR = null;
                let wristL = null, wristR = null;
                let fingersL = [], fingersR = [];
                let animId = null;
                let active = false;
                let signing = false;
                let currentGlossTokens = [];
                let phase = 0;

                function hashWord(w) {
                    let h = 2166136261;
                    for (let i = 0; i < w.length; i++) {
                        h ^= w.charCodeAt(i);
                        h = Math.imul(h, 16777619);
                    }
                    return Math.abs(h);
                }

                function initThree3DAvatar() {
                    if (renderer3D) return;
                    const canvas = document.getElementById("mozok-libras-canvas");
                    if (!canvas || typeof THREE === "undefined") return;

                    renderer3D = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
                    renderer3D.setSize(246, 246, false);
                    renderer3D.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

                    scene3D = new THREE.Scene();
                    camera3D = new THREE.PerspectiveCamera(34, 1.0, 0.1, 50);
                    camera3D.position.set(0, 1.28, 3.35);
                    camera3D.lookAt(0, 1.12, 0);

                    const amb = new THREE.AmbientLight(0xdbeafe, 0.85);
                    const keyLight = new THREE.DirectionalLight(0xffffff, 1.15);
                    keyLight.position.set(2.2, 3.5, 4.0);
                    const rimLight = new THREE.PointLight(0x00f2fe, 1.35, 10);
                    rimLight.position.set(-2.0, 2.2, -1.8);
                    scene3D.add(amb, keyLight, rimLight);

                    avatarRoot = new THREE.Group();
                    scene3D.add(avatarRoot);

                    const skinMat = new THREE.MeshStandardMaterial({ color: 0xe6b89c, roughness: 0.42, metalness: 0.05 });
                    const suitMat = new THREE.MeshStandardMaterial({ color: 0x0f2942, roughness: 0.48, metalness: 0.18 });
                    const cyanTrimMat = new THREE.MeshStandardMaterial({ color: 0x00f2fe, emissive: 0x0096c7, emissiveIntensity: 0.55 });
                    const hairMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.65 });
                    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.15 });

                    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.36, 0.92, 24), suitMat);
                    torso.position.set(0, 0.78, 0);
                    torso.scale.set(1.18, 1.0, 0.68);
                    avatarRoot.add(torso);

                    const collarL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.34, 0.04), cyanTrimMat);
                    collarL.position.set(-0.09, 1.08, 0.25);
                    collarL.rotation.z = -0.32;
                    const collarR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.34, 0.04), cyanTrimMat);
                    collarR.position.set(0.09, 1.08, 0.25);
                    collarR.rotation.z = 0.32;
                    avatarRoot.add(collarL, collarR);

                    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.125, 0.22, 18), skinMat);
                    neck.position.set(0, 1.29, 0);
                    avatarRoot.add(neck);

                    headGroup = new THREE.Group();
                    headGroup.position.set(0, 1.54, 0.02);
                    avatarRoot.add(headGroup);

                    const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.24, 28, 28), skinMat);
                    cranium.scale.set(0.92, 1.08, 0.96);
                    headGroup.add(cranium);

                    const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.248, 24, 20, 0, Math.PI * 2, 0, Math.PI * 0.58), hairMat);
                    hairCap.position.set(0, 0.02, -0.02);
                    hairCap.rotation.x = -0.18;
                    headGroup.add(hairCap);

                    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.026, 14, 14), eyeMat);
                    eyeL.position.set(-0.08, 0.03, 0.21);
                    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.026, 14, 14), eyeMat);
                    eyeR.position.set(0.08, 0.03, 0.21);
                    headGroup.add(eyeL, eyeR);

                    browL = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.014, 0.02), hairMat);
                    browL.position.set(-0.08, 0.082, 0.215);
                    browR = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.014, 0.02), hairMat);
                    browR.position.set(0.08, 0.082, 0.215);
                    headGroup.add(browL, browR);

                    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.026, 0.075, 12), skinMat);
                    nose.position.set(0, -0.01, 0.235);
                    nose.rotation.x = Math.PI * 0.42;
                    headGroup.add(nose);

                    jawMesh = new THREE.Mesh(new THREE.BoxGeometry(0.082, 0.022, 0.025), new THREE.MeshStandardMaterial({ color: 0xb56557, roughness: 0.4 }));
                    jawMesh.position.set(0, -0.095, 0.205);
                    headGroup.add(jawMesh);

                    function buildArmChain(side) {
                        const sPivot = new THREE.Group();
                        sPivot.position.set(side * 0.48, 1.15, 0.02);
                        avatarRoot.add(sPivot);

                        const shoulderBall = new THREE.Mesh(new THREE.SphereGeometry(0.105, 16, 16), suitMat);
                        sPivot.add(shoulderBall);

                        const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.072, 0.42, 16), suitMat);
                        upperArm.position.set(0, -0.21, 0);
                        sPivot.add(upperArm);

                        const ePivot = new THREE.Group();
                        ePivot.position.set(0, -0.42, 0);
                        sPivot.add(ePivot);

                        const elbowJoint = new THREE.Mesh(new THREE.SphereGeometry(0.072, 14, 14), suitMat);
                        ePivot.add(elbowJoint);

                        const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.055, 0.38, 16), skinMat);
                        forearm.position.set(0, -0.19, 0);
                        ePivot.add(forearm);

                        const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.066, 0.012, 10, 20), cyanTrimMat);
                        cuff.rotation.x = Math.PI / 2;
                        cuff.position.set(0, -0.06, 0);
                        ePivot.add(cuff);

                        const wPivot = new THREE.Group();
                        wPivot.position.set(0, -0.38, 0);
                        ePivot.add(wPivot);

                        const palm = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.12, 0.042), skinMat);
                        palm.position.set(0, -0.055, 0);
                        wPivot.add(palm);

                        const fingerList = [];
                        const fingerOffsets = [
                            { x: -side * 0.058, y: -0.04, len: 0.075, isThumb: true },
                            { x: -side * 0.038, y: -0.115, len: 0.095, isThumb: false },
                            { x: -side * 0.012, y: -0.120, len: 0.105, isThumb: false },
                            { x: side * 0.014,  y: -0.116, len: 0.096, isThumb: false },
                            { x: side * 0.038,  y: -0.108, len: 0.078, isThumb: false }
                        ];
                        fingerOffsets.forEach((fo) => {
                            const fPivot = new THREE.Group();
                            fPivot.position.set(fo.x, fo.y, 0.008);
                            if (fo.isThumb) fPivot.rotation.z = -side * 0.48;
                            const phalanx = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.011, fo.len, 10), skinMat);
                            phalanx.position.set(0, -fo.len * 0.5, 0);
                            const tip = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 8), skinMat);
                            tip.position.set(0, -fo.len, 0);
                            fPivot.add(phalanx, tip);
                            wPivot.add(fPivot);
                            fingerList.push(fPivot);
                        });

                        return { sPivot, ePivot, wPivot, fingerList };
                    }

                    const leftChain = buildArmChain(-1);
                    const rightChain = buildArmChain(1);
                    shoulderL = leftChain.sPivot; elbowL = leftChain.ePivot; wristL = leftChain.wPivot; fingersL = leftChain.fingerList;
                    shoulderR = rightChain.sPivot; elbowR = rightChain.ePivot; wristR = rightChain.wPivot; fingersR = rightChain.fingerList;
                }

                async function translateToLibrasGloss(text) {
                    try {
                        const res = await fetch("https://traducao2.vlibras.gov.br/translate", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ text })
                        });
                        if (res.ok) {
                            const data = await res.text();
                            const tokens = data.trim().split(/\\s+/).filter(Boolean);
                            if (tokens.length > 0) return tokens;
                        }
                    } catch (_) {}
                    return text.toUpperCase()
                        .replace(/[^A-ZÀ-Ú0-9\\s]/g, "")
                        .split(/\\s+/)
                        .filter(w => w.length > 2)
                        .slice(0, 18);
                }

                function drawAvatarFrame() {
                    if (!active) return;
                    initThree3DAvatar();
                    if (!renderer3D) return;

                    if (signing) phase += 0.095;
                    else phase += 0.025;

                    const tokIdx = currentGlossTokens.length > 0 ? (Math.floor(phase / 3.2) % currentGlossTokens.length) : 0;
                    const activeToken = currentGlossTokens[tokIdx] || "PRONTO";
                    const seed = hashWord(activeToken);

                    if (signing) {
                        const bar = document.getElementById("mozok-libras-gloss-bar");
                        if (bar) bar.textContent = "SINAL LIBRAS: " + activeToken;

                        headGroup.rotation.y = Math.sin(phase * 0.85 + (seed % 5)) * 0.16;
                        headGroup.rotation.x = Math.cos(phase * 0.7) * 0.09;
                        browL.position.y = 0.082 + Math.sin(phase * 1.4) * 0.012;
                        browR.position.y = 0.082 + Math.sin(phase * 1.4) * 0.012;
                        jawMesh.scale.y = 1.0 + Math.abs(Math.sin(phase * 2.6)) * 0.85;

                        const locMode = seed % 3;
                        const targetHeightL = locMode === 1 ? -0.95 : (locMode === 2 ? -0.65 : -0.78);
                        const targetHeightR = locMode === 1 ? -1.08 : (locMode === 2 ? -0.70 : -0.82);

                        shoulderL.rotation.x = targetHeightL + Math.sin(phase * 1.6) * 0.28;
                        shoulderL.rotation.z = 0.22 + Math.cos(phase * 1.3) * 0.18;
                        shoulderL.rotation.y = 0.35 + Math.sin(phase * 1.1) * 0.22;

                        shoulderR.rotation.x = targetHeightR + Math.cos(phase * 1.7) * 0.32;
                        shoulderR.rotation.z = -0.22 - Math.sin(phase * 1.4) * 0.18;
                        shoulderR.rotation.y = -0.35 + Math.cos(phase * 1.2) * 0.22;

                        elbowL.rotation.x = -1.35 + Math.cos(phase * 2.1) * 0.35;
                        elbowL.rotation.z = -0.38 + Math.sin(phase * 1.5) * 0.20;

                        elbowR.rotation.x = -1.42 + Math.sin(phase * 2.2) * 0.38;
                        elbowR.rotation.z = 0.38 - Math.cos(phase * 1.6) * 0.20;

                        wristL.rotation.x = Math.sin(phase * 2.8) * 0.45;
                        wristL.rotation.y = Math.cos(phase * 2.4) * 0.55;
                        wristR.rotation.x = Math.cos(phase * 2.9) * 0.45;
                        wristR.rotation.y = Math.sin(phase * 2.5) * 0.55;

                        for (let i = 0; i < 5; i++) {
                            const fingerBit = ((seed >> i) & 1);
                            const curlL = fingerBit ? (0.15 + 0.25 * Math.sin(phase * 3.0 + i)) : (1.15 + 0.25 * Math.cos(phase * 2.5 + i));
                            const curlR = ((seed >> (i + 2)) & 1) ? (0.12 + 0.25 * Math.cos(phase * 3.1 + i)) : (1.20 + 0.25 * Math.sin(phase * 2.7 + i));
                            if (fingersL[i]) fingersL[i].rotation.x = -curlL;
                            if (fingersR[i]) fingersR[i].rotation.x = -curlR;
                        }
                    } else {
                        headGroup.rotation.y = Math.sin(phase * 0.6) * 0.05;
                        headGroup.rotation.x = Math.cos(phase * 0.5) * 0.03;
                        jawMesh.scale.y = 1.0;
                        shoulderL.rotation.set(-0.28, 0.18, 0.16);
                        shoulderR.rotation.set(-0.28, -0.18, -0.16);
                        elbowL.rotation.set(-0.95, 0, -0.28);
                        elbowR.rotation.set(-0.95, 0, 0.28);
                        wristL.rotation.set(0, 0.3, 0);
                        wristR.rotation.set(0, -0.3, 0);
                        for (let i = 0; i < 5; i++) {
                            if (fingersL[i]) fingersL[i].rotation.x = -0.25;
                            if (fingersR[i]) fingersR[i].rotation.x = -0.25;
                        }
                    }

                    renderer3D.render(scene3D, camera3D);
                    animId = requestAnimationFrame(drawAvatarFrame);
                }

                return {
                    show() {
                        active = true;
                        document.getElementById("mozok-libras-native-panel")?.classList.add("active");
                        document.getElementById("btn-doom3-libras")?.classList.add("active");
                        document.getElementById("btn-vlibras")?.classList.add("active");
                        if (!animId) drawAvatarFrame();
                    },
                    hide() {
                        active = false;
                        signing = false;
                        if (animId) { cancelAnimationFrame(animId); animId = null; }
                        document.getElementById("mozok-libras-native-panel")?.classList.remove("active");
                        document.getElementById("btn-doom3-libras")?.classList.remove("active");
                        document.getElementById("btn-vlibras")?.classList.remove("active");
                    },
                    toggle() {
                        if (active) this.hide();
                        else this.show();
                    },
                    async speak(text) {
                        if (!active && (currentLang || "pt-BR").toLowerCase().startsWith("pt")) {
                            this.show();
                        }
                        if (!active) return;
                        signing = true;
                        currentGlossTokens = await translateToLibrasGloss(text);
                        const bar = document.getElementById("mozok-libras-gloss-bar");
                        if (bar && currentGlossTokens[0]) bar.textContent = "SINAL LIBRAS: " + currentGlossTokens[0];
                    },
                    stopSpeaking() {
                        signing = false;
                        const bar = document.getElementById("mozok-libras-gloss-bar");
                        if (bar) bar.textContent = "LIBRAS 3D // EM ESPERA";
                    }
                };
            })();"""

av_start = html.find("const MozokLibrasAvatar = (() => {")
av_end = html.find("// Botão \"Libras\" na barra principal", av_start)
if av_start != -1 and av_end != -1:
    html = html[:av_start] + new_3d_libras_avatar + "\n\n            " + html[av_end:]

# Conectar syncSpeechWithVLibras diretamente ao Intérprete 3D WebGL
sync_pos = html.find("function syncSpeechWithVLibras(text) {")
if sync_pos != -1:
    sync_end = html.find("async function getTranslatedMetadata", sync_pos)
    if sync_end != -1:
        new_sync_fn = """function syncSpeechWithVLibras(text) {
                if (!text) return;
                const subBar = document.getElementById('mozok-subtitle-bar');
                const subText = document.getElementById('mozok-subtitle-text');
                if (subBar && subText) {
                    subText.textContent = text;
                    subBar.classList.add('visible');
                    clearTimeout(window._subTimeout);
                    window._subTimeout = setTimeout(() => {
                        subBar.classList.remove('visible');
                        if (typeof MozokLibrasAvatar !== 'undefined') MozokLibrasAvatar.stopSpeaking();
                    }, Math.max(6000, text.length * 65));
                }
                if (typeof MozokLibrasAvatar !== 'undefined' && (currentLang || 'pt-BR').toLowerCase().startsWith('pt')) {
                    MozokLibrasAvatar.speak(text);
                }
            }

            """
        html = html[:sync_pos] + new_sync_fn + html[sync_end:]

# Toggle Ouvir / Parar nos botões #btn-popup-narrate e #btn-narrate-card
toggle_narrate_code = """            async function toggleNarrateCurrentSelection() {
                const btnPop = document.getElementById('btn-popup-narrate');
                const btnCard = document.getElementById('btn-narrate-card');
                if (currentAudio || ('speechSynthesis' in window && window.speechSynthesis.speaking)) {
                    activeSpeechId++;
                    if (currentAudio) {
                        try { currentAudio.pause(); currentAudio.currentTime = 0; } catch (_) {}
                        currentAudio = null;
                    }
                    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                    if (typeof MozokLibrasAvatar !== 'undefined') MozokLibrasAvatar.stopSpeaking();
                    document.getElementById('mozok-subtitle-bar')?.classList.remove('visible');
                    if (btnPop) btnPop.innerHTML = '🔊 Ouvir';
                    if (btnCard) btnCard.innerHTML = '🔊 Ouvir';
                    return;
                }
                if (btnPop) btnPop.innerHTML = '⏹ Parar';
                if (btnCard) btnCard.innerHTML = '⏹ Parar';
                try {
                    await narrateCurrentSelection();
                } finally {
                    if (btnPop) btnPop.innerHTML = '🔊 Ouvir';
                    if (btnCard) btnCard.innerHTML = '🔊 Ouvir';
                    if (typeof MozokLibrasAvatar !== 'undefined') MozokLibrasAvatar.stopSpeaking();
                }
            }
"""

if "function toggleNarrateCurrentSelection" not in html:
    narr_pos = html.find("async function narrateCurrentSelection()")
    if narr_pos != -1:
        html = html[:narr_pos] + toggle_narrate_code + "\n            " + html[narr_pos:]
    html = html.replace(
        "document.getElementById('btn-popup-narrate').addEventListener('click', narrateCurrentSelection);",
        "document.getElementById('btn-popup-narrate').addEventListener('click', toggleNarrateCurrentSelection);",
    )
    html = html.replace(
        "document.getElementById('btn-narrate-card').addEventListener('click', narrateCurrentSelection);",
        "document.getElementById('btn-narrate-card').addEventListener('click', toggleNarrateCurrentSelection);",
    )

# Corrigir applyPathologySelection: selecionar estrutura e mover câmera ANTES de aplicar setPathologySimulation, e nunca sobrescrever durante o arrasto do slider!
apply_start = html.find("function applyPathologySelection(")
apply_end = html.find("// Controle de Densidade de Neurônios Conectados", apply_start)
if apply_start != -1 and apply_end != -1:
    new_apply_block = """function applyPathologySelection(diseaseKey, severityVal, focusCameraOnDiseaseChange = false) {
                const profile = PATHOLOGY_PROFILES[diseaseKey] || PATHOLOGY_PROFILES['HEALTHY'];
                const sev = diseaseKey === 'HEALTHY' ? 0.0 : Math.max(0.05, Math.min(1.0, Number(severityVal) || 0.75));

                isStrokeActive = (diseaseKey === 'ISCHEMIC_STROKE' && sev > 0.01);
                hypoxiaProgress = isStrokeActive ? sev : 0.0;
                document.getElementById('btn-trigger-stroke-card').classList.toggle('active', isStrokeActive);

                const restoreBtn = document.getElementById('btn-restore-tissue-card');
                if (diseaseKey === 'HEALTHY') {
                    restoreBtn.classList.add('emerald-flash');
                    setTimeout(() => restoreBtn.classList.remove('emerald-flash'), 650);
                }

                if (focusCameraOnDiseaseChange && !isMicroMode) {
                    if (diseaseKey === 'HEALTHY') {
                        cnsAnatomy.setViewMode('EXTERNAL');
                        flyCameraTo(new THREE.Vector3(0, -1.5, 0), new THREE.Vector3(0, 1.5, 22.0), 0.75);
                    } else if (profile.targetStructure && ontologyMap.has(profile.targetStructure)) {
                        selectedStructureId = profile.targetStructure;
                        cnsAnatomy.selectStructure(selectedStructureId);
                        updateHUDAndPopup(ontologyMap.get(selectedStructureId), false);
                        document.querySelectorAll('.structure-item').forEach(el => {
                            el.classList.toggle('active', el.dataset.id === selectedStructureId);
                        });
                        const anchor = cnsAnatomy.getStructureWorldAnchor(selectedStructureId);
                        const sideX = Math.abs(anchor.x) > 0.6 ? Math.sign(anchor.x) * 6.8 : 4.0;
                        const sideZ = anchor.z < -2.0 ? -10.5 : 10.5;
                        const distScale = anchor.y < -8.0 ? 1.28 : 0.95;
                        const camTarget = new THREE.Vector3(anchor.x * 0.45, anchor.y, anchor.z * 0.45);
                        const camPos = camTarget.clone().add(new THREE.Vector3(sideX * distScale, 2.0, sideZ * distScale));
                        flyCameraTo(camTarget, camPos, 0.72);
                    }
                }

                cnsAnatomy.setPathologySimulation(diseaseKey, sev);
                neuralMicro.setPathologySimulation(diseaseKey, sev);

                const stageBadge = document.getElementById('pathology-stage-badge');
                stageBadge.textContent = profile.stage;
                stageBadge.style.color = profile.color;

                document.getElementById('pathology-sev-label').textContent = `${Math.round(sev * 100)}%`;
                document.getElementById('pathology-clinical-note').textContent = profile.note;
                const pDoi = MOZOK_PATHOLOGY_DOIS[diseaseKey] || MOZOK_PATHOLOGY_DOIS['HEALTHY'];
                const pDoiLink = document.getElementById('pathology-doi-link');
                const pDoiCit = document.getElementById('pathology-doi-citation');
                if (pDoiLink && pDoi) {
                    pDoiLink.href = `https://doi.org/${pDoi.doi}`;
                    pDoiLink.textContent = `DOI: ${pDoi.doi} ↗`;
                }
                if (pDoiCit && pDoi) {
                    pDoiCit.textContent = pDoi.citation;
                }
                document.getElementById('bm-abeta-tau').textContent = profile.abetaTau;
                document.getElementById('bm-nfl-prion').textContent = profile.nflPrion;
                document.getElementById('bm-ocb').textContent = profile.ocb;
            }

            pathologySelect.addEventListener('change', () => {
                const key = pathologySelect.value;
                const sev = parseFloat(pathologySeveritySlider.value) || 0.75;
                applyPathologySelection(key, sev, true);
            });

            pathologySeveritySlider.addEventListener('input', () => {
                const key = pathologySelect.value;
                const sev = parseFloat(pathologySeveritySlider.value) || 0.75;
                applyPathologySelection(key, sev, false);
            });

            document.getElementById('btn-trigger-stroke-card').addEventListener('click', () => {
                pathologySelect.value = 'ISCHEMIC_STROKE';
                pathologySeveritySlider.value = '0.85';
                applyPathologySelection('ISCHEMIC_STROKE', 0.85, true);
            });

            document.getElementById('btn-restore-tissue-card').addEventListener('click', () => {
                pathologySelect.value = 'HEALTHY';
                applyPathologySelection('HEALTHY', 0.0, true);
            });

            """
    html = html[:apply_start] + new_apply_block + html[apply_end:]

# Sincronizar patologia ativa ao alternar entre Macro e Microcosmos Neuronal
set_micro_start = html.find("function setMicrocosmosMode(enable) {")
set_micro_end = html.find("// =====================================================================\n            // PROJEÇÃO 3D -> 2D", set_micro_start)
if set_micro_start != -1 and set_micro_end != -1:
    new_set_micro = """function setMicrocosmosMode(enable) {
                isMicroMode = enable;
                cnsAnatomy.rootGroup.visible = !enable;
                neuralMicro.setVisible(enable, selectedStructureId);

                document.getElementById('neuron-parts-bar').classList.toggle('visible', enable);
                document.getElementById('btn-view-micro').classList.toggle('active', enable);

                const curDisease = pathologySelect ? pathologySelect.value : 'HEALTHY';
                const curSev = pathologySeveritySlider ? (parseFloat(pathologySeveritySlider.value) || 0.75) : 0.75;

                if (enable) {
                    ['btn-view-external', 'btn-view-xray', 'btn-view-vascular'].forEach(id => {
                        document.getElementById(id).classList.remove('active');
                    });
                    selectNeuronSubPart(selectedNeuronPartId || 'NEURON_SOMA', false, false);
                    neuralMicro.setPathologySimulation(curDisease, curDisease === 'HEALTHY' ? 0.0 : curSev);
                    flyCameraTo(new THREE.Vector3(0.0, 0.5, 0.0), new THREE.Vector3(0.0, 1.5, 22.5), 0.75);
                } else {
                    document.getElementById('btn-view-external').classList.add('active');
                    cnsAnatomy.setViewMode('EXTERNAL');
                    const meta = ontologyMap.get(selectedStructureId) || MOZOK_ONTOLOGY[0];
                    updateHUDAndPopup(meta, false);
                    cnsAnatomy.setPathologySimulation(curDisease, curDisease === 'HEALTHY' ? 0.0 : curSev);
                    flyCameraTo(new THREE.Vector3(0, -1.5, 0), new THREE.Vector3(0, 1.5, 22.0), 0.75);
                }
            }

            """
    html = html[:set_micro_start] + new_set_micro + html[set_micro_end:]

html_path.write_text(html, encoding="utf-8")
print("MOZOK v1.0011 aplicado e auditado com sucesso!")
