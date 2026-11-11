#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Upgrade MOZOK v1.0001:
- Auditoria e correção de todos os botões da interface (i18n, isolamento, corpo translúcido, contador)
- Motor de Zoom Multiescala Contínuo ("Google Earth Biológico"):
  Cérebro (cm) -> Parênquima (mm) -> Neurônios (µm) -> Sinapses (nm) -> Organelas (50nm) -> Átomos (1 Å)
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MICRO_JS = ROOT / "web" / "js" / "neural-microcosmos-3d.js"
CNS_JS = ROOT / "web" / "js" / "cns-anatomy-3d.js"
INDEX_HTML = ROOT / "web" / "index.html"

# 0. Garantir que setBodyShellVisible(true) construa a silhueta corporal sob demanda em cns-anatomy-3d.js
if CNS_JS.exists():
    cns_code = CNS_JS.read_text(encoding="utf-8").replace("\r\n", "\n")
    cns_code = cns_code.replace(
        "// this.buildBioluminescentHumanBodyShell();",
        "this.buildBioluminescentHumanBodyShell();"
    )
    CNS_JS.write_text(cns_code, encoding="utf-8")

# 1. Injetar Organelas 3D e Átomos 3D em web/js/neural-microcosmos-3d.js
micro_code = MICRO_JS.read_text(encoding="utf-8").replace("\r\n", "\n")

ORGANELLE_AND_ATOMIC_CODE = """
        // Grupos Multiescala Profundos: Tier 4 (Organelas Celulares) e Tier 5 (Átomos & Orbitais)
        this.organelleGroup = new THREE.Group();
        this.organelleGroup.name = 'Tier4_Intracellular_Organelles';
        this.organelleGroup.visible = false;
        this.microGroup.add(this.organelleGroup);

        this.atomicGroup = new THREE.Group();
        this.atomicGroup.name = 'Tier5_Atomic_Quantum_Lattice';
        this.atomicGroup.visible = false;
        this.microGroup.add(this.atomicGroup);

        this.electronOrbitals = [];
        this.organelleItems = [];
        this.buildIntracellularOrganelles3D();
        this.buildAtomicQuantumLattice3D();
"""

if "this.buildIntracellularOrganelles3D();" not in micro_code:
    target_anchor = "this.buildActionPotentialPulses();"
    micro_code = micro_code.replace(
        target_anchor,
        target_anchor + "\n" + ORGANELLE_AND_ATOMIC_CODE,
        1
    )

METHODS_TO_APPEND = """
    // =========================================================================
    // TIER 4: ORGANELAS INTRACELULARES 3D (NÚCLEO, MITOCÔNDRIAS, RER, GOLGI, MICROTÚBULOS)
    // =========================================================================
    buildIntracellularOrganelles3D() {
        const center = new THREE.Vector3(0, 0.5, 0);

        // 1. Envelope Nuclear Fenestrado + Cromatina + Nucléolo
        const nucMat = new THREE.MeshPhysicalMaterial({
            color: 0xa855f7,
            emissive: 0x6b21a8,
            emissiveIntensity: 0.45,
            roughness: 0.25,
            transmission: 0.72,
            transparent: true,
            opacity: 0.78,
            wireframe: false
        });
        const nucleusShell = new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 28), nucMat);
        nucleusShell.position.copy(center);
        this.organelleGroup.add(nucleusShell);

        const nucleolusMat = new THREE.MeshStandardMaterial({
            color: 0xfacc15,
            emissive: 0xd97706,
            emissiveIntensity: 0.85,
            roughness: 0.2
        });
        const nucleolus = new THREE.Mesh(new THREE.SphereGeometry(0.16, 24, 20), nucleolusMat);
        nucleolus.position.copy(center);
        this.organelleGroup.add(nucleolus);

        // Poros Nucleares (Complexos NPC em anel octogonal)
        const poreGeo = new THREE.TorusGeometry(0.032, 0.008, 8, 16);
        const poreMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.8 });
        for (let i = 0; i < 26; i++) {
            const phi = Math.acos(1 - 2 * (i + 0.5) / 26);
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;
            const px = 0.42 * Math.sin(phi) * Math.cos(theta);
            const py = 0.42 * Math.sin(phi) * Math.sin(theta);
            const pz = 0.42 * Math.cos(phi);
            const pore = new THREE.Mesh(poreGeo, poreMat);
            pore.position.set(center.x + px, center.y + py, center.z + pz);
            pore.lookAt(center);
            this.organelleGroup.add(pore);
        }

        // 2. Mitocôndrias Neurais com Cristas Internas (Síntese de ATP para Na+/K+ ATPase)
        const mitoOuterMat = new THREE.MeshPhysicalMaterial({
            color: 0xf97316,
            emissive: 0xc2410c,
            emissiveIntensity: 0.52,
            roughness: 0.3,
            transmission: 0.55,
            transparent: true,
            opacity: 0.85
        });
        const cristaMat = new THREE.MeshStandardMaterial({
            color: 0xfde047,
            emissive: 0xeab308,
            emissiveIntensity: 0.75,
            wireframe: true
        });
        const mitoOffsets = [
            new THREE.Vector3(0.65, 0.18, 0.25),
            new THREE.Vector3(-0.62, -0.15, 0.32),
            new THREE.Vector3(0.35, 0.62, -0.35),
            new THREE.Vector3(-0.42, -0.58, -0.28),
            new THREE.Vector3(0.18, -0.65, 0.48),
            new THREE.Vector3(-0.55, 0.45, -0.18)
        ];
        mitoOffsets.forEach((off, idx) => {
            const mGroup = new THREE.Group();
            const outer = new THREE.Mesh(new THREE.SphereGeometry(0.11, 20, 16), mitoOuterMat);
            outer.scale.set(1.85, 0.85, 0.85);
            const inner = new THREE.Mesh(new THREE.TorusKnotGeometry(0.065, 0.015, 32, 6, 2, 3), cristaMat);
            inner.scale.set(1.5, 0.7, 0.7);
            mGroup.add(outer);
            mGroup.add(inner);
            mGroup.position.copy(center).add(off);
            mGroup.rotation.set(idx * 0.7, idx * 1.1, idx * 0.4);
            this.organelleGroup.add(mGroup);
            this.organelleItems.push(mGroup);
        });

        // 3. Retículo Endoplasmático Rugoso (Corpúsculos de Nissl) & Complexo de Golgi
        const rerMat = new THREE.MeshPhysicalMaterial({
            color: 0x06b6d4,
            emissive: 0x0e7490,
            emissiveIntensity: 0.48,
            roughness: 0.35,
            transparent: true,
            opacity: 0.82,
            side: THREE.DoubleSide
        });
        for (let r = 0; r < 4; r++) {
            const radius = 0.48 + r * 0.045;
            const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.016, 12, 40, Math.PI * 1.25), rerMat);
            ring.position.copy(center);
            ring.rotation.set(0.4 * r, 0.8 * r, 0.2);
            this.organelleGroup.add(ring);
        }

        // 4. Feixes de Microtúbulos Citoesqueléticos (Transporte Axonal Kinesina/Dineína)
        const mtMat = new THREE.MeshStandardMaterial({
            color: 0x10b981,
            emissive: 0x059669,
            emissiveIntensity: 0.55
        });
        for (let m = 0; m < 8; m++) {
            const angle = (m / 8) * Math.PI * 2;
            const p1 = center.clone().add(new THREE.Vector3(Math.cos(angle) * 0.45, Math.sin(angle) * 0.45, -0.2));
            const p2 = center.clone().add(new THREE.Vector3(Math.cos(angle) * 1.15, Math.sin(angle) * 1.15, 0.35));
            const curve = new THREE.LineCurve3(p1, p2);
            const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 8, 0.009, 8, false), mtMat);
            this.organelleGroup.add(tube);
        }
    }

    // =========================================================================
    // TIER 5: REDE ATÔMICA E ORBITAIS QUÂNTICOS 3D (ESCALA DE ANGSTROMS — C, N, O, P, Na+, K+)
    // =========================================================================
    buildAtomicQuantumLattice3D() {
        const center = new THREE.Vector3(0, 0.5, 0);

        // Cores CPK científicas: Carbono (Ciano-Grafite), Oxigênio (Vermelho), Nitrogênio (Azul), Fósforo (Âmbar), Sódio/Potássio (Violeta Elétrico)
        const atomSpecs = [
            { name: 'Phosphorus (P) — Fosfolipídio de Membrana', pos: new THREE.Vector3(0.0, 0.0, 0.0), color: 0xf59e0b, radius: 0.036, electrons: 5 },
            { name: 'Oxygen (O) — Grupo Fosfato', pos: new THREE.Vector3(0.11, 0.08, 0.04), color: 0xf43f5e, radius: 0.028, electrons: 4 },
            { name: 'Oxygen (O) — Ligação Éster', pos: new THREE.Vector3(-0.11, 0.07, -0.05), color: 0xf43f5e, radius: 0.028, electrons: 4 },
            { name: 'Carbon (Cα) — Cadeia Acil Lipídica', pos: new THREE.Vector3(0.04, -0.13, 0.08), color: 0x38bdf8, radius: 0.030, electrons: 4 },
            { name: 'Nitrogen (N+) — Cabeça Colina Hidrofílica', pos: new THREE.Vector3(-0.05, 0.16, 0.09), color: 0x60a5fa, radius: 0.031, electrons: 4 },
            { name: 'Sodium Ion (Na+) — Canal Nav1.6', pos: new THREE.Vector3(0.17, -0.04, -0.11), color: 0xc084fc, radius: 0.034, electrons: 6 },
            { name: 'Potassium Ion (K+) — Poros Kv', pos: new THREE.Vector3(-0.16, -0.09, 0.12), color: 0x34d399, radius: 0.038, electrons: 6 }
        ];

        const bondMat = new THREE.MeshStandardMaterial({
            color: 0x94a3b8,
            emissive: 0x38bdf8,
            emissiveIntensity: 0.45,
            roughness: 0.2
        });

        const orbitalRingMat = new THREE.MeshBasicMaterial({
            color: 0x00f2fe,
            transparent: true,
            opacity: 0.32,
            side: THREE.DoubleSide
        });

        const electronMat = new THREE.MeshBasicMaterial({
            color: 0xfacc15
        });

        atomSpecs.forEach((spec, idx) => {
            const atomNode = new THREE.Group();
            atomNode.position.copy(center).add(spec.pos);

            // Núcleo Atômico (Prótons + Nêutrons em cluster subatômico)
            const nucMat = new THREE.MeshStandardMaterial({
                color: spec.color,
                emissive: spec.color,
                emissiveIntensity: 0.95,
                roughness: 0.15
            });
            const nucleus = new THREE.Mesh(new THREE.IcosahedronGeometry(spec.radius, 2), nucMat);
            atomNode.add(nucleus);

            // Nuvem de Probabilidade Quântica (Halo translúcido s/p)
            const cloudMat = new THREE.MeshPhysicalMaterial({
                color: spec.color,
                emissive: spec.color,
                emissiveIntensity: 0.35,
                transparent: true,
                opacity: 0.22,
                roughness: 0.1
            });
            const cloud = new THREE.Mesh(new THREE.SphereGeometry(spec.radius * 2.4, 20, 16), cloudMat);
            atomNode.add(cloud);

            // Anéis Orbitais e Elétrons em Movimento Quântico
            for (let e = 0; e < spec.electrons; e++) {
                const orbitRadius = spec.radius * (1.8 + (e % 2) * 0.65);
                const ring = new THREE.Mesh(new THREE.RingGeometry(orbitRadius - 0.002, orbitRadius + 0.002, 32), orbitalRingMat);
                ring.rotation.set((e * 1.1) + idx * 0.4, (e * 0.8), e * 0.5);
                atomNode.add(ring);

                const elec = new THREE.Mesh(new THREE.SphereGeometry(0.0065, 10, 10), electronMat);
                atomNode.add(elec);
                this.electronOrbitals.push({
                    mesh: elec,
                    radius: orbitRadius,
                    speed: 6.5 + e * 2.2,
                    phase: e * 1.57 + idx,
                    tiltX: ring.rotation.x,
                    tiltY: ring.rotation.y
                });
            }

            this.atomicGroup.add(atomNode);

            // Ligações Covalentes com o átomo central (Índice 0)
            if (idx > 0 && idx < 5) {
                const p0 = center.clone().add(atomSpecs[0].pos);
                const p1 = center.clone().add(spec.pos);
                const curve = new THREE.LineCurve3(p0, p1);
                const bond = new THREE.Mesh(new THREE.TubeGeometry(curve, 6, 0.0055, 8, false), bondMat);
                this.atomicGroup.add(bond);
            }
        });
    }

    // =========================================================================
    // CONTROLADOR DE PROFUNDIDADE MULTIESCALA (TRANSIÇÃO SUAVE NEURÔNIO -> ORGANELAS -> ÁTOMOS)
    // =========================================================================
    setMultiscaleDepth(cameraDistance) {
        // Visibilidade das Organelas (Tier 4: d < 1.35) e Átomos (Tier 5: d < 0.52)
        const showOrganelles = (cameraDistance < 1.35 && cameraDistance > 0.32);
        const showAtoms = (cameraDistance <= 0.52);

        if (this.organelleGroup) {
            this.organelleGroup.visible = showOrganelles;
        }
        if (this.atomicGroup) {
            this.atomicGroup.visible = showAtoms;
        }

        // Torna a membrana do Soma translúcida quando a câmera entra dentro da célula (d < 1.35)
        if (this.somaMeshes && this.somaMeshes.length > 0) {
            const mainSoma = this.somaMeshes[0];
            if (mainSoma && mainSoma.material) {
                if (cameraDistance < 0.52) {
                    mainSoma.material.opacity = 0.12;
                    mainSoma.material.depthWrite = false;
                } else if (cameraDistance < 1.35) {
                    mainSoma.material.opacity = 0.28;
                    mainSoma.material.depthWrite = false;
                } else {
                    mainSoma.material.opacity = 0.88;
                    mainSoma.material.depthWrite = true;
                }
            }
        }
    }
"""

if "buildIntracellularOrganelles3D()" not in micro_code:
    last_brace_idx = micro_code.rfind("}\n\nwindow.NeuralMicrocosmos3D")
    if last_brace_idx == -1:
        last_brace_idx = micro_code.rfind("}")
    micro_code = micro_code[:last_brace_idx] + METHODS_TO_APPEND + "\n" + micro_code[last_brace_idx:]

# Animar os elétrons e organelas dentro do método update(dt, elapsed) de NeuralMicrocosmos3D
ELECTRON_UPDATE_SNIPPET = """
        // 5. Animação de Orbitais Quânticos (Tier 5) e Organelas (Tier 4)
        if (this.atomicGroup && this.atomicGroup.visible && this.electronOrbitals.length > 0) {
            for (let i = 0; i < this.electronOrbitals.length; i++) {
                const eo = this.electronOrbitals[i];
                const angle = elapsed * eo.speed + eo.phase;
                const lx = Math.cos(angle) * eo.radius;
                const ly = Math.sin(angle) * eo.radius * Math.cos(eo.tiltX);
                const lz = Math.sin(angle) * eo.radius * Math.sin(eo.tiltX);
                eo.mesh.position.set(lx, ly, lz);
            }
        }
        if (this.organelleGroup && this.organelleGroup.visible && this.organelleItems.length > 0) {
            for (let i = 0; i < this.organelleItems.length; i++) {
                const org = this.organelleItems[i];
                org.rotation.y += dt * 0.35;
            }
        }
"""

if "Animação de Orbitais Quânticos (Tier 5)" not in micro_code:
    ranvier_anchor = "node.sprite.material.opacity = Math.min(1.0, 0.95 * ranvierDim * healthRhythm);\n            }\n        }"
    micro_code = micro_code.replace(
        ranvier_anchor,
        ranvier_anchor + "\n" + ELECTRON_UPDATE_SNIPPET,
        1
    )

MICRO_JS.write_text(micro_code, encoding="utf-8")
print("[OK] web/js/neural-microcosmos-3d.js atualizado com Organelas 3D (Tier 4) e Átomos/Orbitais (Tier 5).")

# 2. Atualizar web/index.html:
# - Versão v1.0001 no topo
# - Botão #btn-body-shell visível e traduzido nos 5 idiomas
# - Correção dos bugs de tradução em resetIsolateButtonsUI() e #cat-chip-all
# - Motor de Zoom Contínuo Google Earth (controls.minDistance = 0.14 + Régua de Escala Biológica HUD)
html_code = INDEX_HTML.read_text(encoding="utf-8").replace("\r\n", "\n")

# 2.1 Badge de versão v1.0001
html_code = html_code.replace(
    '<span class="brand-preset-tag">BETA</span>',
    '<span class="brand-preset-tag" id="brand-version-badge" title="SemVer 1.0.1+0001">v1.0001</span>'
)

# 2.2 Mostrar #btn-body-shell com data-i18n="btn_body_shell"
html_code = html_code.replace(
    '<button class="hud-btn" id="btn-body-shell" style="display:none;">🫧 Corpo Translúcido</button>',
    '<button class="hud-btn" id="btn-body-shell" data-i18n="btn_body_shell" title="Exibir/Ocultar Silhueta Corporal Bioluminescente">🫧 Corpo Translúcido</button>'
)

# 2.3 Adicionar btn_body_shell nos 5 dicionários de idioma (pt-BR, en-GB, es-ES, it-IT, uk-UA)
html_code = html_code.replace(
    "btn_micro: '🔬 Microcosmos Neuronal',\n                    btn_center: '🎯 Centralizar',",
    "btn_micro: '🔬 Microcosmos Neuronal',\n                    btn_body_shell: '🫧 Corpo Translúcido',\n                    btn_center: '🎯 Centralizar',"
).replace(
    "btn_micro: '🔬 Neuronal Microcosmos',\n                    btn_center: '🎯 Recentre',",
    "btn_micro: '🔬 Neuronal Microcosmos',\n                    btn_body_shell: '🫧 Translucent Body',\n                    btn_center: '🎯 Recentre',"
).replace(
    "btn_micro: '🔬 Microcosmos Neuronal',\n                    btn_center: '🎯 Centrar',",
    "btn_micro: '🔬 Microcosmos Neuronal',\n                    btn_body_shell: '🫧 Cuerpo Translúcido',\n                    btn_center: '🎯 Centrar',"
).replace(
    "btn_micro: '🔬 Microcosmo Neuronale',\n                    btn_center: '🎯 Ricentra',",
    "btn_micro: '🔬 Microcosmo Neuronale',\n                    btn_body_shell: '🫧 Corpo Traslucido',\n                    btn_center: '🎯 Ricentra',"
).replace(
    "btn_micro: '🔬 Нейронний мікрокосмос',\n                    btn_center: '🎯 Центрувати',",
    "btn_micro: '🔬 Нейронний мікрокосмос',\n                    btn_body_shell: '🫧 Напівпрозоре тіло',\n                    btn_center: '🎯 Центрувати',"
)

# 2.4 Reduzir controls.minDistance de 2.2 para 0.14 para permitir zoom contínuo até Átomos
html_code = html_code.replace(
    "controls.minDistance = 2.2;",
    "controls.minDistance = 0.14;"
)

# 2.5 Corrigir #cat-chip-all em applyLanguage para preservar (45)
html_code = html_code.replace(
    "else el.textContent = dict[key];",
    "else if (el.id === 'cat-chip-all') el.textContent = `${dict[key]} (${MOZOK_ONTOLOGY.length})`;\n                        else el.textContent = dict[key];"
)

# 2.6 Corrigir resetIsolateButtonsUI() e botões de isolamento para usar UI_I18N[currentLang]
OLD_RESET_ISOLATE = """            function resetIsolateButtonsUI() {
                document.getElementById('btn-isolate-piece').classList.remove('active');
                document.getElementById('btn-isolate-piece').textContent = '🧩 Isolar Peça 3D';
                if (!isMicroMode) {
                    btnPopupIsolate.textContent = '🧩 Isolar Peça 3D';
                }
            }"""

NEW_RESET_ISOLATE = """            function resetIsolateButtonsUI() {
                const hudDict = UI_I18N[currentLang] || UI_I18N['pt-BR'];
                const isoTxt = hudDict.btn_isolate || '🧩 Isolar Peça 3D';
                document.getElementById('btn-isolate-piece').classList.remove('active');
                document.getElementById('btn-isolate-piece').textContent = isoTxt;
                if (!isMicroMode) {
                    btnPopupIsolate.textContent = isoTxt;
                }
            }"""

html_code = html_code.replace(OLD_RESET_ISOLATE, NEW_RESET_ISOLATE)

OLD_ISOLATE_CLICK_HANDLERS = """            btnPopupIsolate.addEventListener('click', () => {
                if (isMicroMode) {
                    neuralMicro.triggerManualSpike();
                } else {
                    const isolated = cnsAnatomy.isolateStructure(selectedStructureId);
                    btnPopupIsolate.textContent = isolated ? '🔄 Mostrar Tudo' : '🧩 Isolar Peça 3D';
                    document.getElementById('btn-isolate-piece').textContent = isolated ? '🔄 Mostrar Tudo' : '🧩 Isolar Peça 3D';
                    document.getElementById('btn-isolate-piece').classList.toggle('active', isolated);
                }
            });

            btnPopupMicro.addEventListener('click', () => {
                setMicrocosmosMode(!isMicroMode);
            });

            document.getElementById('btn-popup-narrate').addEventListener('click', narrateCurrentSelection);

            // Botões do Painel Direito
            document.getElementById('btn-isolate-piece').addEventListener('click', (e) => {
                if (isMicroMode) setMicrocosmosMode(false);
                const isolated = cnsAnatomy.isolateStructure(selectedStructureId);
                e.currentTarget.classList.toggle('active', isolated);
                e.currentTarget.textContent = isolated ? '🔄 Mostrar Tudo' : '🧩 Isolar Peça 3D';
                btnPopupIsolate.textContent = isolated ? '🔄 Mostrar Tudo' : '🧩 Isolar Peça 3D';
            });"""

NEW_ISOLATE_CLICK_HANDLERS = """            btnPopupIsolate.addEventListener('click', () => {
                if (isMicroMode) {
                    neuralMicro.triggerManualSpike();
                } else {
                    const hudDict = UI_I18N[currentLang] || UI_I18N['pt-BR'];
                    const isolated = cnsAnatomy.isolateStructure(selectedStructureId);
                    const labelTxt = isolated ? (hudDict.btn_restore || '🔄 Mostrar Tudo') : (hudDict.btn_isolate || '🧩 Isolar Peça 3D');
                    btnPopupIsolate.textContent = labelTxt;
                    document.getElementById('btn-isolate-piece').textContent = labelTxt;
                    document.getElementById('btn-isolate-piece').classList.toggle('active', isolated);
                }
            });

            btnPopupMicro.addEventListener('click', () => {
                setMicrocosmosMode(!isMicroMode);
            });

            document.getElementById('btn-popup-narrate').addEventListener('click', narrateCurrentSelection);

            // Botões do Painel Direito
            document.getElementById('btn-isolate-piece').addEventListener('click', (e) => {
                if (isMicroMode) setMicrocosmosMode(false);
                const hudDict = UI_I18N[currentLang] || UI_I18N['pt-BR'];
                const isolated = cnsAnatomy.isolateStructure(selectedStructureId);
                const labelTxt = isolated ? (hudDict.btn_restore || '🔄 Mostrar Tudo') : (hudDict.btn_isolate || '🧩 Isolar Peça 3D');
                e.currentTarget.classList.toggle('active', isolated);
                e.currentTarget.textContent = labelTxt;
                btnPopupIsolate.textContent = labelTxt;
            });"""

html_code = html_code.replace(OLD_ISOLATE_CLICK_HANDLERS, NEW_ISOLATE_CLICK_HANDLERS)

# 2.7 Injetar Régua de Escala Biológica ("Google Earth Scale Bar") e Motor de Transição Automática por Zoom
SCALE_HUD_CSS = """
        /* RÉGUA MULTIESCALA ESTILO GOOGLE EARTH BIOLÓGICO (6 ESCALAS: CÉREBRO -> ÁTOMO) */
        #mozok-scale-hud {
            position: fixed;
            bottom: 18px;
            right: 402px;
            z-index: 25;
            background: rgba(8, 15, 30, 0.88);
            backdrop-filter: blur(14px);
            border: 1px solid rgba(0, 242, 254, 0.35);
            border-radius: 12px;
            padding: 8px 12px;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 8px 28px rgba(0, 0, 0, 0.6);
            font-size: 11px;
        }
        @media screen and (max-width: 1180px) {
            #mozok-scale-hud {
                right: 14px;
                bottom: 64px;
            }
        }
        .scale-tier-badge {
            padding: 3px 8px;
            border-radius: 6px;
            background: rgba(0, 242, 254, 0.16);
            border: 1px solid #00f2fe;
            color: #00f2fe;
            font-weight: 800;
            letter-spacing: 0.5px;
            min-width: 155px;
            text-align: center;
        }
        #mozok-scale-slider {
            width: 130px;
            accent-color: #00f2fe;
            cursor: pointer;
        }
"""

if "#mozok-scale-hud" not in html_code:
    html_code = html_code.replace("</style>", SCALE_HUD_CSS + "\n    </style>", 1)

SCALE_HUD_HTML = """
    <!-- RÉGUA DE ESCALA MULTIESCALA ("GOOGLE EARTH BIOLÓGICO") -->
    <div id="mozok-scale-hud" title="Role o mouse (Scroll) ou arraste para mergulhar do Cérebro até os Neurônios, Organelas e Átomos">
        <span style="color:#94a3b8; font-weight:700;">🔭 Escala:</span>
        <span class="scale-tier-badge" id="scale-tier-label">15 cm • Macro SNC</span>
        <input type="range" id="mozok-scale-slider" min="0" max="100" step="1" value="18" />
    </div>
"""

if 'id="mozok-scale-hud"' not in html_code:
    html_code = html_code.replace('<aside class="left-sidebar"', SCALE_HUD_HTML + '\n    <aside class="left-sidebar"', 1)

GOOGLE_EARTH_ZOOM_ENGINE = """
            // =====================================================================
            // MOTOR DE ZOOM CONTÍNUO MULTIESCALA ("GOOGLE EARTH BIOLÓGICO" — 6 NÍVEIS)
            // =====================================================================
            const scaleTierLabel = document.getElementById('scale-tier-label');
            const scaleSlider = document.getElementById('mozok-scale-slider');
            let autoZoomMicroTriggered = false;

            function evaluateContinuousMultiscaleZoom() {
                const dist = camera.position.distanceTo(controls.target);

                // Calcula porcentagem de profundidade logarítmica (dist de 45.0 até 0.16)
                const minD = 0.16, maxD = 45.0;
                const clampedD = Math.max(minD, Math.min(maxD, dist));
                const depthPct = Math.round((1.0 - (Math.log(clampedD) - Math.log(minD)) / (Math.log(maxD) - Math.log(minD))) * 100);
                if (scaleSlider && document.activeElement !== scaleSlider) {
                    scaleSlider.value = String(Math.max(0, Math.min(100, depthPct)));
                }

                // Transição contínua Macro <-> Micro pelo scroll do mouse (limiar em dist = 6.2)
                if (!isMicroMode && dist < 8.8 && dist >= 5.2) {
                    // Fase de penetração cortical: torna o córtex progressivamente translúcido
                    const alpha = THREE.MathUtils.clamp((dist - 5.2) / (8.8 - 5.2), 0.12, 1.0);
                    cnsAnatomy.setCortexAlpha(alpha);
                } else if (!isMicroMode && dist < 5.2) {
                    // Mergulho automático para dentro da rede neuronal da Camada V!
                    autoZoomMicroTriggered = true;
                    isMicroMode = true;
                    cnsAnatomy.rootGroup.visible = false;
                    neuralMicro.setVisible(true, selectedStructureId);
                    document.getElementById('neuron-parts-bar').classList.add('visible');
                    setActiveTopViewBtn('btn-view-micro');
                    const meta = neuralMicro.getPartMetadata(selectedNeuronPartId || 'NEURON_SOMA');
                    updateHUDAndPopup(meta, false);
                } else if (isMicroMode && autoZoomMicroTriggered && dist > 6.4) {
                    // Retorno suave ao Córtex Macroscópico ao afastar o zoom (scroll out)
                    autoZoomMicroTriggered = false;
                    isMicroMode = false;
                    cnsAnatomy.rootGroup.visible = true;
                    neuralMicro.setVisible(false);
                    cnsAnatomy.setCortexAlpha(1.0);
                    document.getElementById('neuron-parts-bar').classList.remove('visible');
                    setActiveTopViewBtn('btn-view-external');
                    const meta = ontologyMap.get(selectedStructureId) || MOZOK_ONTOLOGY[0];
                    updateHUDAndPopup(meta, false);
                }

                // Atualiza visibilidade de Organelas (Tier 4) e Átomos (Tier 5)
                if (isMicroMode && typeof neuralMicro.setMultiscaleDepth === 'function') {
                    neuralMicro.setMultiscaleDepth(dist);
                }

                // Atualiza rótulo da Régua Biológica (6 Escalas)
                if (scaleTierLabel) {
                    if (dist > 11.5) {
                        scaleTierLabel.textContent = '15 cm • Macro SNC';
                        scaleTierLabel.style.borderColor = '#00f2fe';
                        scaleTierLabel.style.color = '#00f2fe';
                    } else if (dist > 5.2) {
                        scaleTierLabel.textContent = '10 mm • Parênquima Cortical';
                        scaleTierLabel.style.borderColor = '#38bdf8';
                        scaleTierLabel.style.color = '#38bdf8';
                    } else if (dist > 2.2) {
                        scaleTierLabel.textContent = '100 µm • Neurônios Camada V';
                        scaleTierLabel.style.borderColor = '#facc15';
                        scaleTierLabel.style.color = '#facc15';
                    } else if (dist > 1.35) {
                        scaleTierLabel.textContent = '500 nm • Fenda Sináptica';
                        scaleTierLabel.style.borderColor = '#34d399';
                        scaleTierLabel.style.color = '#34d399';
                    } else if (dist > 0.52) {
                        scaleTierLabel.textContent = '50 nm • Organelas Celulares';
                        scaleTierLabel.style.borderColor = '#c084fc';
                        scaleTierLabel.style.color = '#c084fc';
                    } else {
                        scaleTierLabel.textContent = '1 Å (0.1 nm) • Átomos & Orbitais';
                        scaleTierLabel.style.borderColor = '#f43f5e';
                        scaleTierLabel.style.color = '#f43f5e';
                    }
                }
            }

            if (scaleSlider) {
                scaleSlider.addEventListener('input', (e) => {
                    const pct = parseFloat(e.target.value) || 0;
                    const minD = 0.16, maxD = 45.0;
                    const targetDist = Math.exp(Math.log(maxD) - (pct / 100.0) * (Math.log(maxD) - Math.log(minD)));
                    const dir = camera.position.clone().sub(controls.target).normalize();
                    if (dir.lengthSq() < 0.0001) dir.set(0, 0.08, 1).normalize();
                    if (pct >= 58) {
                        controls.target.set(0, 0.5, 0);
                    }
                    camera.position.copy(controls.target).addScaledVector(dir, targetDist);
                    controls.update();
                    evaluateContinuousMultiscaleZoom();
                });
            }
"""

if "evaluateContinuousMultiscaleZoom()" not in html_code:
    html_code = html_code.replace(
        "controls.update();\n                cnsAnatomy.update(dt, elapsed);",
        "controls.update();\n                evaluateContinuousMultiscaleZoom();\n                cnsAnatomy.update(dt, elapsed);",
        1
    )
    html_code = html_code.replace(
        "const clock = new THREE.Clock();",
        GOOGLE_EARTH_ZOOM_ENGINE + "\n            const clock = new THREE.Clock();",
        1
    )

INDEX_HTML.write_text(html_code, encoding="utf-8")
print("[OK] web/index.html atualizado para v1.0001 com Google Earth Zoom e correções do Auditor Noturno.")

