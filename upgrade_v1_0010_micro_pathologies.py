import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent
JS_PATH = ROOT / "web" / "js" / "neural-microcosmos-3d.js"

txt = JS_PATH.read_text(encoding="utf-8")

# Localizar o fechamento da classe NeuralMicrocosmos3D (logo antes de `window.NeuralMicrocosmos3D = NeuralMicrocosmos3D;`)
marker = "window.NeuralMicrocosmos3D = NeuralMicrocosmos3D;"
if marker not in txt:
    raise RuntimeError("Marcador window.NeuralMicrocosmos3D nao encontrado em neural-microcosmos-3d.js")

pathology_methods = """
    // =========================================================================
    // MOTOR FISIOPATOLOGICO 3D REAL DAS 7 PATOLOGIAS NO MICROCOSMOS NEURONAL
    // =========================================================================
    ensurePathology3DGroups() {
        if (!this.rootGroup) this.rootGroup = this.microGroup;
        if (this.pathologyGroup) return;

        this.pathologyGroup = new THREE.Group();
        this.pathologyGroup.name = "MozokMicroPathologyGroup";
        // Centraliza ao redor do Soma do Neuronio Piramidal Principal (Hero Neuron #0 em 0, 2.2, 0)
        this.pathologyGroup.position.set(0.0, 2.2, 0.0);
        this.pathologyGroup.scale.setScalar(2.15);
        this.microGroup.add(this.pathologyGroup);

        // 1. Placas Amiloides (Abeta42) & Emaranhados Tau (Alzheimer)
        this.alzheimerGroup = new THREE.Group();
        const amyloidMat = new THREE.MeshStandardMaterial({
            color: 0xd97706, emissive: 0x78350f, emissiveIntensity: 0.65,
            roughness: 0.45, metalness: 0.15
        });
        const tauMat = new THREE.MeshStandardMaterial({
            color: 0x9333ea, emissive: 0x581c87, emissiveIntensity: 0.75,
            roughness: 0.3, wireframe: true
        });
        const plaqueOffsets = [
            [1.65, 1.05, 0.9], [-1.75, 0.85, -1.0], [1.25, -1.45, -1.15],
            [-1.35, 2.15, 0.75], [1.95, 0.25, -1.2], [-1.95, -0.75, 1.1]
        ];
        plaqueOffsets.forEach((pos, idx) => {
            const plaque = new THREE.Mesh(new THREE.IcosahedronGeometry(0.40 + (idx % 2) * 0.14, 1), amyloidMat);
            plaque.position.set(pos[0], pos[1], pos[2]);
            this.alzheimerGroup.add(plaque);
        });
        for (let i = 0; i < 4; i++) {
            const tangle = new THREE.Mesh(new THREE.TorusKnotGeometry(0.46, 0.075, 44, 8), tauMat);
            tangle.position.set((i - 1.5) * 0.42, (i % 2 === 0 ? 0.25 : -0.35), (i % 2 === 0 ? 0.25 : -0.25));
            tangle.rotation.set(i * 0.8, i * 1.1, 0);
            this.alzheimerGroup.add(tangle);
        }
        this.alzheimerGroup.visible = false;
        this.pathologyGroup.add(this.alzheimerGroup);

        // 2. Corpos de Lewy (alfa-sinucleina) (Parkinson)
        this.parkinsonGroup = new THREE.Group();
        const lewyMat = new THREE.MeshStandardMaterial({
            color: 0xef4444, emissive: 0x991b1b, emissiveIntensity: 0.95,
            roughness: 0.2
        });
        const lewyHaloMat = new THREE.MeshBasicMaterial({
            color: 0xfca5a5, transparent: true, opacity: 0.42
        });
        [[0.45, 0.12, 0.35], [-0.45, -0.35, -0.25], [0.1, 0.55, -0.45]].forEach((p, idx) => {
            const core = new THREE.Mesh(new THREE.SphereGeometry(0.32 - idx * 0.04, 18, 18), lewyMat);
            core.position.set(p[0], p[1], p[2]);
            const halo = new THREE.Mesh(new THREE.SphereGeometry(0.44 - idx * 0.05, 18, 18), lewyHaloMat);
            halo.position.copy(core.position);
            this.parkinsonGroup.add(core);
            this.parkinsonGroup.add(halo);
        });
        this.parkinsonGroup.visible = false;
        this.pathologyGroup.add(this.parkinsonGroup);

        // 3. Desmielinizacao Autoimune & Placas Inflamatorias (Esclerose Multipla)
        this.msLesionGroup = new THREE.Group();
        const msMat = new THREE.MeshStandardMaterial({
            color: 0x0ea5e9, emissive: 0xe11d48, emissiveIntensity: 0.92,
            transparent: true, opacity: 0.85, roughness: 0.25
        });
        for (let i = 0; i < 6; i++) {
            const ring = new THREE.Mesh(new THREE.TorusGeometry(0.55 + (i % 2) * 0.16, 0.085, 14, 28), msMat);
            ring.position.set((i % 2 === 0 ? 0.28 : -0.22), -0.8 - i * 0.48, -0.2 - i * 0.25);
            ring.rotation.x = Math.PI / 2.2;
            this.msLesionGroup.add(ring);
        }
        this.msLesionGroup.visible = false;
        this.pathologyGroup.add(this.msLesionGroup);

        // 4. Vacuolos Espongiformes & Placas PrPSc (Doenca Prionica / DCJ)
        this.prionGroup = new THREE.Group();
        const vacMat = new THREE.MeshPhysicalMaterial({
            color: 0xf472b6, emissive: 0xbe185d, emissiveIntensity: 0.55,
            transparent: true, opacity: 0.52, roughness: 0.12
        });
        for (let i = 0; i < 14; i++) {
            const a = (i / 14) * Math.PI * 2;
            const vac = new THREE.Mesh(new THREE.SphereGeometry(0.26 + (i % 3) * 0.12, 16, 16), vacMat);
            vac.position.set(Math.cos(a) * 1.15, (i % 4 - 1.5) * 0.6, Math.sin(a) * 1.15);
            this.prionGroup.add(vac);
        }
        this.prionGroup.visible = false;
        this.pathologyGroup.add(this.prionGroup);

        // 5. Edema Citotoxico & Nuvem de Excitotoxicidade Glutamatergica (AVC Isquemico)
        this.strokeGroup = new THREE.Group();
        const excCount = 160;
        const excPos = new Float32Array(excCount * 3);
        for (let i = 0; i < excCount; i++) {
            const r = 1.1 + Math.random() * 2.4;
            const th = Math.random() * Math.PI * 2;
            const ph = Math.acos(2 * Math.random() - 1);
            excPos[i * 3] = r * Math.sin(ph) * Math.cos(th);
            excPos[i * 3 + 1] = r * Math.cos(ph);
            excPos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
        }
        const excGeo = new THREE.BufferGeometry();
        excGeo.setAttribute("position", new THREE.BufferAttribute(excPos, 3));
        const excMat = new THREE.PointsMaterial({
            color: 0xff2a2a, size: 0.28, transparent: true, opacity: 0.90, blending: THREE.AdditiveBlending, depthWrite: false
        });
        this.strokeCloud = new THREE.Points(excGeo, excMat);
        this.strokeGroup.add(this.strokeCloud);
        this.strokeGroup.visible = false;
        this.pathologyGroup.add(this.strokeGroup);

        // 6. Agregados de Proteina TDP-43 em Motoneuronios (ELA / ALS)
        this.alsGroup = new THREE.Group();
        const tdpMat = new THREE.MeshStandardMaterial({
            color: 0xf97316, emissive: 0xc2410c, emissiveIntensity: 0.9
        });
        for (let i = 0; i < 9; i++) {
            const agg = new THREE.Mesh(new THREE.OctahedronGeometry(0.24, 0), tdpMat);
            agg.position.set((Math.sin(i * 1.9)) * 0.9, (i - 4) * 0.42, (Math.cos(i * 2.1)) * 0.9);
            this.alsGroup.add(agg);
        }
        this.alsGroup.visible = false;
        this.pathologyGroup.add(this.alsGroup);

        // 7. Aura Eletrica de Hipersincronia Paroxistica (Epilepsia Temporal)
        this.epilepsyGroup = new THREE.Group();
        const epMat = new THREE.MeshBasicMaterial({
            color: 0x00f2fe, transparent: true, opacity: 0.42, wireframe: true
        });
        this.epilepsyShell = new THREE.Mesh(new THREE.SphereGeometry(2.35, 24, 18), epMat);
        this.epilepsyGroup.add(this.epilepsyShell);
        this.epilepsyGroup.visible = false;
        this.pathologyGroup.add(this.epilepsyGroup);
    }

    isPathologyAuxiliaryObject(obj) {
        let p = obj;
        while (p) {
            if (p === this.pathologyGroup || p === this.pathologyMarkersGroup || p === this.organelleGroup || p === this.atomicGroup) {
                return true;
            }
            p = p.parent;
        }
        return false;
    }

    setPathology(pathologyId, severity = 0.75) {
        this.ensurePathology3DGroups();
        const rawId = String(pathologyId || "HEALTHY").toUpperCase();
        const aliasMap = {
            "PRION_CJD": "PRION_DCJ",
            "ALS": "ALS_ELA",
            "TEMPORAL_EPILEPSY": "EPILEPSY"
        };
        const id = aliasMap[rawId] || rawId;
        this.activePathologyId = id;
        this.activeDiseaseKey = id;
        const rawSev = Number(severity);
        const sev = id === "HEALTHY" ? 0.0 : Math.max(0.05, Math.min(1.0, Number.isFinite(rawSev) ? (rawSev > 1.5 ? rawSev / 100.0 : rawSev) : 0.75));
        this.activePathologySeverity = sev;
        this.diseaseSeverity = sev;
        this.damageRatio = id === "HEALTHY" ? 0.0 : sev * 0.78;

        // Oculta todos os grupos especificos antes de ativar o escolhido
        [
            this.alzheimerGroup, this.parkinsonGroup, this.msLesionGroup,
            this.prionGroup, this.strokeGroup, this.alsGroup, this.epilepsyGroup
        ].forEach(g => { if (g) g.visible = false; });

        if (this.pathologyMarkersGroup) {
            while (this.pathologyMarkersGroup.children.length > 0) {
                this.pathologyMarkersGroup.remove(this.pathologyMarkersGroup.children[0]);
            }
        }

        // Restaura materiais e escalas originais de todas as partes neuronais do conectoma
        this.microGroup.traverse((child) => {
            if (!child.isMesh || this.isPathologyAuxiliaryObject(child)) return;
            const ud = child.userData || {};
            if (!ud._origSaved) {
                ud._origSaved = true;
                ud.origColorHex = child.material && child.material.color ? child.material.color.getHex() : null;
                ud.origEmissiveHex = child.material && child.material.emissive ? child.material.emissive.getHex() : null;
                ud.origEmissiveInt = child.material && child.material.emissiveIntensity !== undefined ? child.material.emissiveIntensity : 0.2;
                ud.origOpacity = child.material ? child.material.opacity : 1.0;
                ud.origScale = child.scale.clone();
            }
            if (child.material) {
                if (ud.origColorHex !== null && child.material.color) child.material.color.setHex(ud.origColorHex);
                if (ud.origEmissiveHex !== null && child.material.emissive) {
                    child.material.emissive.setHex(ud.origEmissiveHex);
                    child.material.emissiveIntensity = ud.origEmissiveInt;
                }
                child.material.opacity = ud.origOpacity;
            }
            if (ud.origScale) child.scale.copy(ud.origScale);
        });

        this.myelinSheaths.forEach(item => {
            const m = item.mesh;
            m.scale.copy(item.baseScale);
            if (m.material) {
                m.material.opacity = 0.88;
                if (m.userData.baseColorHex) m.material.color.setHex(m.userData.baseColorHex);
                if (m.material.emissive && m.userData.baseEmissiveHex) m.material.emissive.setHex(m.userData.baseEmissiveHex);
            }
        });

        const spineScale = Math.max(0.18, 1.0 - this.damageRatio * 0.65);
        this.dendriticSpines.forEach(sp => {
            if (sp.mesh) sp.mesh.scale.setScalar(sp.baseScale * spineScale);
        });

        if (id === "HEALTHY" || sev <= 0.01) {
            this.damageRatio = 0.0;
            this.targetFiringRateHz = 18.0;
            this.firingRateHz = 18.0;
            this.cbfPerfusion = 54;
            this.conductionVelocityMs = 110;
            return;
        }

        // Aplica alteracoes visuais 3D morfologicas e cromaticas reais para cada patologia
        this.microGroup.traverse((child) => {
            if (!child.isMesh || !child.material || this.isPathologyAuxiliaryObject(child)) return;
            const ud = child.userData || {};
            const partId = ud.neuronPartId || ud.subPartId || "";

            if (id === "ISCHEMIC_STROKE") {
                if (partId === "NEURON_SOMA") {
                    child.material.color.setHex(0x991b1b);
                    if (child.material.emissive) {
                        child.material.emissive.setHex(0xdc2626);
                        child.material.emissiveIntensity = 0.45 + sev * 0.7;
                    }
                    if (ud.origScale) child.scale.copy(ud.origScale).multiplyScalar(1.0 + 0.26 * sev);
                } else if (partId === "NEURON_DENDRITES" || partId === "NEURON_DENDRITE") {
                    child.material.color.setHex(0xb91c1c);
                }
            } else if (id === "ALZHEIMER") {
                if (partId === "NEURON_DENDRITES" || partId === "NEURON_DENDRITE") {
                    if (ud.origScale) child.scale.copy(ud.origScale).multiplyScalar(Math.max(0.45, 1.0 - 0.28 * sev));
                    child.material.color.setHex(0x78716c);
                } else if (partId === "NEURON_SOMA") {
                    if (ud.origScale) child.scale.copy(ud.origScale).multiplyScalar(Math.max(0.65, 1.0 - 0.22 * sev));
                    child.material.color.setHex(0xa8a29e);
                    if (child.material.emissive) child.material.emissive.setHex(0x78350f);
                }
            } else if (id === "PARKINSON") {
                if (partId === "NEURON_SOMA") {
                    child.material.color.setHex(0xf43f5e);
                    if (child.material.emissive) {
                        child.material.emissive.setHex(0xbe123c);
                        child.material.emissiveIntensity = 0.4 + sev * 0.55;
                    }
                }
            } else if (id === "MULTIPLE_SCLEROSIS") {
                if (partId === "NEURON_MYELIN") {
                    child.material.opacity = Math.max(0.14, 0.88 - 0.68 * sev);
                    child.material.transparent = true;
                    child.material.color.setHex(0xef4444);
                    if (child.material.emissive) child.material.emissive.setHex(0x991b1b);
                    if (ud.origScale) child.scale.copy(ud.origScale).multiplyScalar(Math.max(0.32, 1.0 - 0.62 * sev));
                }
            } else if (id === "PRION_DCJ") {
                if (partId === "NEURON_SOMA") {
                    child.material.color.setHex(0xf472b6);
                    if (child.material.emissive) child.material.emissive.setHex(0xbe185d);
                }
            } else if (id === "ALS_ELA") {
                if (partId === "NEURON_SOMA" || partId === "NEURON_AXON") {
                    if (ud.origScale) child.scale.copy(ud.origScale).multiplyScalar(Math.max(0.55, 1.0 - 0.28 * sev));
                    child.material.color.setHex(0xfb923c);
                    if (child.material.emissive) child.material.emissive.setHex(0x9a3412);
                }
            } else if (id === "EPILEPSY") {
                if (partId === "NEURON_SOMA" || partId === "NEURON_AXON" || partId === "NEURON_RANVIER") {
                    child.material.color.setHex(0x38bdf8);
                    if (child.material.emissive) {
                        child.material.emissive.setHex(0x00f2fe);
                        child.material.emissiveIntensity = 0.8 + sev * 1.4;
                    }
                }
            }
        });

        // Ativa o marcador 3D correspondente sobre o Hero Neuron + marcadores nos neuronios vizinhos + telemetria
        if (id === "ALZHEIMER" && this.alzheimerGroup) {
            this.alzheimerGroup.visible = true;
            this.alzheimerGroup.scale.setScalar(0.65 + sev * 0.6);
            const plaqueMat = new THREE.MeshPhysicalMaterial({ color: 0xd97706, emissive: 0x92400e, emissiveIntensity: 0.65, roughness: 0.55 });
            const tangleMat = new THREE.MeshPhysicalMaterial({ color: 0x9333ea, emissive: 0x581c87, emissiveIntensity: 0.72, wireframe: true });
            this.neurons.slice(0, 28).forEach((n, idx) => {
                if (idx % 2 === 0) {
                    const p = new THREE.Mesh(new THREE.DodecahedronGeometry(0.46 + (idx % 3) * 0.16, 1), plaqueMat);
                    p.position.copy(n.somaPos).add(new THREE.Vector3(1.5, 0.85, 0.55));
                    this.pathologyMarkersGroup.add(p);
                }
                const tangle = new THREE.Mesh(new THREE.TorusKnotGeometry(0.38, 0.08, 24, 6), tangleMat);
                tangle.position.copy(n.somaPos);
                this.pathologyMarkersGroup.add(tangle);
            });
            this.targetFiringRateHz = Math.max(6.5, 18.0 - 9.5 * sev);
            this.firingRateHz = this.targetFiringRateHz;
            this.cbfPerfusion = Math.round(54 - 18 * sev);
            this.conductionVelocityMs = Math.round(110 - 44 * sev);
        } else if (id === "PARKINSON" && this.parkinsonGroup) {
            this.parkinsonGroup.visible = true;
            this.parkinsonGroup.scale.setScalar(0.65 + sev * 0.65);
            const lewyMat = new THREE.MeshPhysicalMaterial({ color: 0xf43f5e, emissive: 0xbe123c, emissiveIntensity: 0.85, roughness: 0.22 });
            this.neurons.slice(0, 32).forEach(n => {
                const lewy = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 16), lewyMat);
                lewy.position.copy(n.somaPos).add(new THREE.Vector3(-0.38, -0.25, 0.32));
                this.pathologyMarkersGroup.add(lewy);
            });
            this.targetFiringRateHz = 5.2;
            this.firingRateHz = 5.2;
            this.cbfPerfusion = Math.round(54 - 10 * sev);
            this.conductionVelocityMs = Math.round(110 - 34 * sev);
        } else if (id === "MULTIPLE_SCLEROSIS" && this.msLesionGroup) {
            this.msLesionGroup.visible = true;
            this.myelinSheaths.forEach((item, idx) => {
                if (idx % 2 === 0 || idx % 5 === 0) {
                    const shrink = Math.max(0.30, 1.0 - 0.66 * sev);
                    item.mesh.scale.set(item.baseScale.x * shrink, item.baseScale.y, item.baseScale.z * shrink);
                    if (item.mesh.material) {
                        item.mesh.material.opacity = Math.max(0.14, 0.88 - 0.66 * sev);
                        item.mesh.material.color.setHex(0xef4444);
                        if (item.mesh.material.emissive) item.mesh.material.emissive.setHex(0x7f1d1d);
                    }
                }
            });
            this.targetFiringRateHz = Math.max(5.5, 18.0 - 11.2 * sev);
            this.firingRateHz = this.targetFiringRateHz;
            this.cbfPerfusion = Math.round(54 - 8 * sev);
            this.conductionVelocityMs = Math.max(16, Math.round(110 * (1.0 - 0.80 * sev)));
        } else if (id === "PRION_DCJ" && this.prionGroup) {
            this.prionGroup.visible = true;
            this.prionGroup.scale.setScalar(0.70 + sev * 0.6);
            const vacMat = new THREE.MeshPhysicalMaterial({
                color: 0xe2e8f0, emissive: 0xf472b6, emissiveIntensity: 0.35,
                transmission: 0.90, transparent: true, opacity: 0.58, roughness: 0.08
            });
            const needleGeo = new THREE.CylinderGeometry(0.018, 0.048, 0.98, 5);
            needleGeo.translate(0, 0.47, 0);
            const matRuby = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xdc2626, emissiveIntensity: 0.95 });
            this.neurons.slice(0, 30).forEach((n, idx) => {
                const v = new THREE.Mesh(new THREE.SphereGeometry(0.46 + (idx % 3) * 0.16, 18, 16), vacMat);
                v.position.copy(n.somaPos).add(new THREE.Vector3(0.65, (idx % 2 === 0 ? 0.75 : -0.75), 0.45));
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
                    plaqueGroup.scale.setScalar(0.85 * sev);
                    this.pathologyMarkersGroup.add(plaqueGroup);
                }
            });
            this.targetFiringRateHz = Math.max(4.5, 18.0 - 12.5 * sev);
            this.firingRateHz = this.targetFiringRateHz;
            this.cbfPerfusion = Math.round(54 - 24 * sev);
            this.conductionVelocityMs = Math.round(110 - 66 * sev);
        } else if (id === "ISCHEMIC_STROKE" && this.strokeGroup) {
            this.strokeGroup.visible = true;
            this.targetFiringRateHz = Math.max(2.0, 18.0 * (1.0 - 0.85 * sev));
            this.firingRateHz = this.targetFiringRateHz;
            this.cbfPerfusion = Math.max(8, Math.round(54 * (1.0 - 0.82 * sev)));
            this.conductionVelocityMs = Math.max(18, Math.round(110 * (1.0 - 0.72 * sev)));
        } else if (id === "ALS_ELA" && this.alsGroup) {
            this.alsGroup.visible = true;
            const tdpMat = new THREE.MeshPhysicalMaterial({ color: 0xf97316, emissive: 0x9a3412, emissiveIntensity: 0.78 });
            this.neurons.slice(0, 24).forEach(n => {
                if (n.axonCurveGlobal) {
                    const localMid = n.axonCurveGlobal.getPointAt(0.45);
                    const worldMid = localMid.clone().multiplyScalar(n.scale).add(n.position);
                    const spheroid = new THREE.Mesh(new THREE.SphereGeometry(0.36, 14, 14), tdpMat);
                    spheroid.scale.set(1.6, 0.9, 0.9);
                    spheroid.position.copy(worldMid);
                    this.pathologyMarkersGroup.add(spheroid);
                }
            });
            this.targetFiringRateHz = Math.max(5.0, 18.0 - 11.5 * sev);
            this.firingRateHz = this.targetFiringRateHz;
            this.cbfPerfusion = Math.round(54 - 12 * sev);
            this.conductionVelocityMs = Math.round(110 - 74 * sev);
        } else if (id === "EPILEPSY" && this.epilepsyGroup) {
            this.epilepsyGroup.visible = true;
            this.damageRatio = 0.0;
            this.targetFiringRateHz = Math.round(18.0 + 52.0 * sev);
            this.firingRateHz = this.targetFiringRateHz;
            this.cbfPerfusion = Math.round(54 + 32 * sev);
            this.conductionVelocityMs = Math.round(110 + 16 * sev);
        }
    }
}

"""

# Redirecionar setPathologySimulation para chamar setPathology (compatibilidade total)
old_sim_idx = txt.find("    setPathologySimulation(diseaseKey, severity = 0.75) {")
update_idx = txt.find("    /**\n     * ATUALIZAÇÃO EM TEMPO REAL")
if update_idx == -1:
    update_idx = txt.find("    update(dt, elapsed) {")

if old_sim_idx != -1 and update_idx != -1 and old_sim_idx < update_idx:
    txt = (
        txt[:old_sim_idx]
        + "    setPathologySimulation(diseaseKey, severity = 0.75) {\n        return this.setPathology(diseaseKey, severity);\n    }\n\n"
        + txt[update_idx:]
    )

# Inserir animacao das patologias dentro do loop update(dt, elapsed)
target_update_line = "        this.firingRateHz += (this.targetFiringRateHz - this.firingRateHz) * Math.min(1.0, dt * 3.5);"
anim_injection = target_update_line + """

        if (this.pathologyGroup && this.activePathologyId && this.activePathologyId !== "HEALTHY") {
            if (this.epilepsyGroup && this.epilepsyGroup.visible && this.epilepsyShell) {
                const s = 1.0 + Math.sin(elapsed * 14.0) * 0.14;
                this.epilepsyShell.scale.set(s, s, s);
                this.epilepsyShell.rotation.y += dt * 1.8;
            }
            if (this.strokeGroup && this.strokeGroup.visible) {
                this.strokeGroup.rotation.y += dt * 0.45;
            }
            if (this.prionGroup && this.prionGroup.visible) {
                this.prionGroup.rotation.y -= dt * 0.25;
            }
            if (this.alzheimerGroup && this.alzheimerGroup.visible) {
                this.alzheimerGroup.rotation.y += dt * 0.18;
            }
        }"""

if target_update_line in txt and "this.epilepsyShell" not in txt:
    txt = txt.replace(target_update_line, anim_injection, 1)

# Inserir os metodos ensurePathology3DGroups, isPathologyAuxiliaryObject e setPathology antes do fechamento da classe
close_class_idx = txt.rfind("}\n\n" + marker)
if close_class_idx == -1:
    close_class_idx = txt.rfind("}\r\n\r\n" + marker)
if close_class_idx == -1:
    close_class_idx = txt.rfind(marker)
    close_class_idx = txt.rfind("}", 0, close_class_idx)

if close_class_idx == -1:
    raise RuntimeError("Nao foi possivel localizar o fechamento da classe NeuralMicrocosmos3D")

txt = txt[:close_class_idx] + pathology_methods + txt[close_class_idx + 1:]

JS_PATH.write_text(txt, encoding="utf-8")
print("[OK] neural-microcosmos-3d.js atualizado com simulacao 3D real das 7 patologias (v1.0010).")

