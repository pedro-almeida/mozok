with open('web/js/cns-anatomy-3d.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update registerSubMesh to support ids
old_reg_sub = """      const registerSubMesh = (codes, mesh) => {
        const codeList = Array.isArray(codes) ? codes : [codes];
        mesh.userData = { structureCode: codeList[0], structureCodes: codeList, baseEmissive: mesh.material.emissive.getHex() };
        this.subcorticalGroup.add(mesh);
        this.subcorticalMeshes.push(mesh);
        codeList.forEach(c => {
          if (!this.subcorticalMeshMap[c]) this.subcorticalMeshMap[c] = [];
          this.subcorticalMeshMap[c].push(mesh);
        });
      };"""

new_reg_sub = """      const registerSubMesh = (codes, mesh, ids) => {
        const codeList = Array.isArray(codes) ? codes : [codes];
        const idList = ids ? (Array.isArray(ids) ? ids : [ids]) : [];
        mesh.userData = {
          structureCode: codeList[0],
          structureCodes: codeList,
          structureId: idList[0] || null,
          structureIds: idList,
          baseEmissive: (mesh.material && mesh.material.emissive) ? mesh.material.emissive.getHex() : 0x000000
        };
        this.subcorticalGroup.add(mesh);
        this.subcorticalMeshes.push(mesh);
        codeList.forEach(c => {
          if (!this.subcorticalMeshMap[c]) this.subcorticalMeshMap[c] = [];
          this.subcorticalMeshMap[c].push(mesh);
        });
        idList.forEach(id => {
          const idKey = String(id);
          if (!this.subcorticalMeshMap[idKey]) this.subcorticalMeshMap[idKey] = [];
          this.subcorticalMeshMap[idKey].push(mesh);
        });
      };"""

assert old_reg_sub in code, "old_reg_sub not found"
code = code.replace(old_reg_sub, new_reg_sub, 1)

# 2. Update registerSpinalMesh
old_reg_spin = """      const registerSpinalMesh = (codes, mesh) => {
        const codeList = Array.isArray(codes) ? codes : [codes];
        mesh.userData = { structureCode: codeList[0], structureCodes: codeList };
        this.spinalGroup.add(mesh);
        this.spinalMeshes.push(mesh);
      };"""

new_reg_spin = """      const registerSpinalMesh = (codes, mesh, ids) => {
        const codeList = Array.isArray(codes) ? codes : [codes];
        const idList = ids ? (Array.isArray(ids) ? ids : [ids]) : [];
        mesh.userData = {
          structureCode: codeList[0],
          structureCodes: codeList,
          structureId: idList[0] || null,
          structureIds: idList
        };
        this.spinalGroup.add(mesh);
        this.spinalMeshes.push(mesh);
      };"""

assert old_reg_spin in code, "old_reg_spin not found"
code = code.replace(old_reg_spin, new_reg_spin, 1)

# 3. Dedicated Globus Pallidus mesh and correct Putamen registration
old_caud_put = """        const putGeo = new THREE.SphereGeometry(0.68, 24, 20);
        putGeo.scale(0.58, 0.88, 1.42);
        const putMesh = new THREE.Mesh(putGeo, createOrganicMat(0xa855f7, 0.90, 0x7e22ce));
        putMesh.position.set(side * 1.92, -0.25, 0.32);
        registerSubMesh(['STRIATUM', 'GLOBUS_PALLIDUS', 'BASAL_GANGLIA'], putMesh);"""

new_caud_put = """        const putGeo = new THREE.SphereGeometry(0.68, 24, 20);
        putGeo.scale(0.58, 0.88, 1.42);
        const putMesh = new THREE.Mesh(putGeo, createOrganicMat(0xa855f7, 0.90, 0x7e22ce));
        putMesh.position.set(side * 1.92, -0.25, 0.32);
        registerSubMesh(['STRIATUM', 'BASAL_GANGLIA'], putMesh, 13);

        // Malha anatômica dedicada para o Globo Pálido (GPi/GPe)
        const gpGeo = new THREE.SphereGeometry(0.50, 22, 18);
        gpGeo.scale(0.52, 0.76, 1.15);
        const gpMesh = new THREE.Mesh(gpGeo, createOrganicMat(0xd97706, 0.94, 0xb45309));
        gpMesh.position.set(side * 1.52, -0.32, 0.20);
        registerSubMesh(['GLOBUS_PALLIDUS', 'BASAL_GANGLIA'], gpMesh, 14);"""

assert old_caud_put in code, "old_caud_put not found"
code = code.replace(old_caud_put, new_caud_put, 1)

# 4. Optic Chiasm registration with ID 18 and Pineal with PINEAL_GLAND
old_pineal = "registerSubMesh(['OPTIC_CHIASM', 'PINEAL_GLAND'], pinealMesh);"
new_pineal = "registerSubMesh(['PINEAL_GLAND', 'EPITHALAMUS'], pinealMesh);"
code = code.replace(old_pineal, new_pineal, 1)

old_optic = "registerSubMesh('OPTIC_CHIASM', new THREE.Mesh(opticGeo, createOrganicMat(0x38bdf8, 0.95, 0x0284c7)));"
new_optic = "registerSubMesh('OPTIC_CHIASM', new THREE.Mesh(opticGeo, createOrganicMat(0x38bdf8, 0.95, 0x0284c7)), 18);"
code = code.replace(old_optic, new_optic, 1)

# 5. Dedicated Cranial Nerves in continuous brainstem
target_decuss = "registerSpinalMesh(['MEDULLA_OBLONGATA', 'BRAINSTEM_MEDULLA', 'CRANIAL_NERVES'], medullaMesh);"
new_cranial_roots = """registerSpinalMesh(['MEDULLA_OBLONGATA', 'BRAINSTEM_MEDULLA'], medullaMesh, 22);

      // Malhas anatômicas 3D dedicadas para os Nervos Cranianos (CRANIAL_NERVES, ID 23)
      const cnMat = new THREE.MeshPhysicalMaterial({ color: 0x34d399, emissive: 0x059669, emissiveIntensity: 0.35, roughness: 0.32 });
      [-1, 1].forEach(side => {
        // NC III (Oculomotor)
        const nc3Curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * 0.18, -2.45, -0.25),
          new THREE.Vector3(side * 0.38, -2.48, 0.45),
          new THREE.Vector3(side * 0.55, -2.35, 1.15)
        ]);
        registerSpinalMesh('CRANIAL_NERVES', new THREE.Mesh(new THREE.TubeGeometry(nc3Curve, 12, 0.05, 8, false), cnMat.clone()), 23);

        // NC V (Trigêmeo calibroso na ponte)
        const nc5Curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * 1.05, -3.45, -0.65),
          new THREE.Vector3(side * 1.55, -3.35, -0.25),
          new THREE.Vector3(side * 1.95, -3.20, 0.25)
        ]);
        registerSpinalMesh('CRANIAL_NERVES', new THREE.Mesh(new THREE.TubeGeometry(nc5Curve, 12, 0.075, 8, false), cnMat.clone()), 23);

        // NC VII/VIII (Facial e Vestibulococlear no ângulo pontocerebelar)
        const nc7Curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * 0.95, -4.15, -0.85),
          new THREE.Vector3(side * 1.48, -4.20, -0.65),
          new THREE.Vector3(side * 1.85, -4.15, -0.35)
        ]);
        registerSpinalMesh('CRANIAL_NERVES', new THREE.Mesh(new THREE.TubeGeometry(nc7Curve, 10, 0.048, 8, false), cnMat.clone()), 23);

        // NC XII (Hipoglosso no bulbo)
        const nc12Curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * 0.32, -4.85, -0.82),
          new THREE.Vector3(side * 0.65, -4.92, -0.55),
          new THREE.Vector3(side * 0.95, -4.88, -0.22)
        ]);
        registerSpinalMesh('CRANIAL_NERVES', new THREE.Mesh(new THREE.TubeGeometry(nc12Curve, 10, 0.042, 8, false), cnMat.clone()), 23);
      });"""

assert target_decuss in code, "target_decuss not found"
code = code.replace(target_decuss, new_cranial_roots, 1)

# 6. Update highlightRegion and isolatePiece
old_highlight = """    highlightRegion(reg) {
      if (!reg) return;
      this.activeStructureCode = reg.code || 'WB_CNS';
      const coords = reg.center || reg.coordenadas || [0, -2.5, 0];
      const col = new THREE.Color(reg.color || '#00f2fe');
      const codeStr = String(reg.code || '');

      if (this.cortexUniforms) {
        if (reg.id === 1) {
          this.cortexUniforms.uHighlightRadius.value = 0.0;
        } else {
          this.cortexUniforms.uHighlightCenter.value.set(coords[0], coords[1], coords[2]);
          this.cortexUniforms.uHighlightRadius.value = reg.radius || 1.85;
          this.cortexUniforms.uHighlightColor.value.copy(col);
        }
      }

      if (this.cerebellumUniforms) {
        this.cerebellumUniforms.uHighlight.value = (codeStr === 'CEREBELLUM' || codeStr === 'CEREBELLUM_FOLIA') ? 1.0 : 0.0;
      }

      if (this.spinalUniforms) {
        if (codeStr.startsWith('SPINAL_') || codeStr.startsWith('PNS_') || codeStr.includes('MIDBRAIN') || codeStr.includes('PONS') || codeStr.includes('MEDULLA')) {
          this.spinalUniforms.uHighlightY.value = coords[1];
          this.spinalUniforms.uHighlightRange.value = 2.8;
        } else {
          this.spinalUniforms.uHighlightRange.value = 0.0;
        }
      }

      this.subcorticalMeshes.forEach(m => {
        if (m.material && m.material.emissive) {
          const codes = (m.userData && m.userData.structureCodes) || [m.userData && m.userData.structureCode];
          const isMatch = codes.includes(codeStr);
          m.material.emissiveIntensity = isMatch ? 0.85 : 0.22;
        }
      });

      this.pnsMeshes.forEach(m => {
        if (m.material && m.material.emissive) {
          const isMatch = m.userData && m.userData.structureCode === codeStr;
          m.material.emissiveIntensity = isMatch ? 0.92 : 0.25;
        }
      });

      this.markerMeshes.forEach(pin => {
        const isCurrent = pin.userData && pin.userData.regionId === reg.id;
        pin.scale.setScalar(isCurrent ? 1.85 : 1.0);
      });
    }"""

new_highlight = """    highlightRegion(reg) {
      if (!reg) return;
      if (typeof reg === 'number') {
        reg = this.getRegions().find(r => r.id === reg) || { id: reg };
      } else if (typeof reg === 'string') {
        reg = this.getRegions().find(r => r.code === reg || String(r.id) === reg) || { code: reg };
      }
      this.activeStructureCode = reg.code || 'WB_CNS';
      const coords = reg.center || reg.coordenadas || [0, -2.5, 0];
      const col = new THREE.Color(reg.color || '#00f2fe');
      const codeStr = String(reg.code || '');
      const regId = reg.id;

      if (this.cortexUniforms) {
        if (regId === 1 || codeStr === 'WB_CNS') {
          this.cortexUniforms.uHighlightRadius.value = 0.0;
        } else {
          this.cortexUniforms.uHighlightCenter.value.set(coords[0], coords[1], coords[2]);
          this.cortexUniforms.uHighlightRadius.value = reg.radius || 1.85;
          this.cortexUniforms.uHighlightColor.value.copy(col);
        }
      }

      if (this.cerebellumUniforms) {
        this.cerebellumUniforms.uHighlight.value = (codeStr === 'CEREBELLUM' || codeStr === 'CEREBELLUM_FOLIA' || regId === 24) ? 1.0 : 0.0;
      }

      if (this.spinalUniforms) {
        if (
          codeStr.startsWith('SPINAL_') ||
          codeStr.startsWith('PNS_') ||
          codeStr.includes('MIDBRAIN') ||
          codeStr.includes('PONS') ||
          codeStr.includes('MEDULLA') ||
          codeStr.includes('CRANIAL') ||
          (regId && [20, 21, 22, 23, 25, 26, 27, 28, 29, 30, 31].includes(regId))
        ) {
          this.spinalUniforms.uHighlightY.value = coords[1];
          this.spinalUniforms.uHighlightRange.value = 2.8;
        } else {
          this.spinalUniforms.uHighlightRange.value = 0.0;
        }
      }

      this.subcorticalMeshes.forEach(m => {
        if (m.material && m.material.emissive) {
          const codes = (m.userData && m.userData.structureCodes) || [m.userData && m.userData.structureCode];
          const ids = (m.userData && m.userData.structureIds) || [m.userData && m.userData.structureId];
          const isMatch = codes.includes(codeStr) || (regId && ids.includes(regId));
          m.material.emissiveIntensity = isMatch ? 0.85 : 0.22;
        }
      });

      this.pnsMeshes.forEach(m => {
        if (m.material && m.material.emissive) {
          const codes = (m.userData && m.userData.structureCodes) || [m.userData && m.userData.structureCode];
          const ids = (m.userData && m.userData.structureIds) || [m.userData && m.userData.structureId];
          const isMatch = codes.includes(codeStr) || (regId && ids.includes(regId));
          m.material.emissiveIntensity = isMatch ? 0.92 : 0.25;
        }
      });

      this.markerMeshes.forEach(pin => {
        const isCurrent = (pin.userData && pin.userData.regionId === regId) || (pin.userData && pin.userData.structureCode === codeStr);
        pin.scale.setScalar(isCurrent ? 1.85 : 1.0);
      });
    }"""

assert old_highlight in code, "old_highlight not found"
code = code.replace(old_highlight, new_highlight, 1)

# 7. Update isolatePiece
old_isolate = """    isolatePiece(structureCode) {
      while (this.isolatedPieceGroup.children.length > 0) {
        this.isolatedPieceGroup.remove(this.isolatedPieceGroup.children[0]);
      }

      const regions = this.getRegions();
      const reg = regions.find(r => r.code === structureCode) || regions[0];
      const code = reg ? reg.code : 'WB_CNS';

      if (code === 'WB_CNS') {
        this.restoreFullCNS();
        return null;
      }

      this.masterGroup.visible = false;
      this.isolatedPieceGroup.visible = true;
      this.isPieceIsolated = true;

      const wrapper = new THREE.Group();

      // 1. Cerebelo completo (Folia 3D + Arbor Vitae interna)
      if ((code === 'CEREBELLUM' || code === 'CEREBELLUM_FOLIA') && this.cerebellumMesh) {
        const cbClone = this.cerebellumMesh.clone();
        if (this.cerebellumUniforms) this.cerebellumUniforms.uOpacity.value = 1.0;
        wrapper.add(cbClone);
        if (this.arborVitaeGroup) wrapper.add(this.arborVitaeGroup.clone(true));
      }
      // 2. Estruturas do Sistema Nervoso Periférico (SNP)
      else if (code.startsWith('PNS_')) {
        this.pnsMeshes.forEach(m => {
          if (m.userData && m.userData.structureCode === code) {
            wrapper.add(m.clone());
          }
        });
        this.spinalMeshes.forEach(m => {
          const cloneS = m.clone();
          if (cloneS.material) {
            cloneS.material = cloneS.material.clone();
            cloneS.material.transparent = true;
            if (cloneS.material.uniforms && cloneS.material.uniforms.uOpacity) {
              cloneS.material.uniforms.uOpacity.value = 0.35;
            } else {
              cloneS.material.opacity = 0.35;
            }
          }
          wrapper.add(cloneS);
        });
      }
      // 3. Tronco Encefálico, Nervos Cranianos ou Medula Espinhal
      else if (
        code.startsWith('BRAINSTEM_') ||
        code.startsWith('SPINAL_') ||
        code === 'MIDBRAIN_SN' ||
        code === 'PONS_VAROLII' ||
        code === 'MEDULLA_OBLONGATA' ||
        code === 'CRANIAL_NERVES'
      ) {
        const matched = this.spinalMeshes.filter(m => {
          const codes = (m.userData && m.userData.structureCodes) || [m.userData && m.userData.structureCode];
          return codes.includes(code);
        });
        const listToClone = matched.length > 0 ? matched : this.spinalMeshes;
        listToClone.forEach(m => wrapper.add(m.clone()));
      }
      // 4. Núcleos Subcorticais, Límbico e Ventrículos
      else if (this.subcorticalMeshMap[code] && this.subcorticalMeshMap[code].length > 0) {
        this.subcorticalMeshMap[code].forEach(m => wrapper.add(m.clone()));
      }"""

new_isolate = """    isolatePiece(structureIdentifier) {
      while (this.isolatedPieceGroup.children.length > 0) {
        this.isolatedPieceGroup.remove(this.isolatedPieceGroup.children[0]);
      }

      const regions = this.getRegions();
      let reg = null;
      if (typeof structureIdentifier === 'number') {
        reg = regions.find(r => r.id === structureIdentifier);
      } else if (typeof structureIdentifier === 'string') {
        reg = regions.find(r => r.code === structureIdentifier || String(r.id) === structureIdentifier);
        if (!reg && window.MOZOK_I18N && window.MOZOK_I18N.codeToIdMap) {
          const mappedId = window.MOZOK_I18N.codeToIdMap[structureIdentifier];
          if (mappedId) reg = regions.find(r => r.id === mappedId);
        }
      } else if (structureIdentifier && typeof structureIdentifier === 'object') {
        reg = structureIdentifier;
      }
      if (!reg) reg = regions[0];
      const code = reg ? reg.code : 'WB_CNS';
      const regId = reg ? reg.id : 1;

      if (code === 'WB_CNS' || regId === 1) {
        this.restoreFullCNS();
        return null;
      }

      this.masterGroup.visible = false;
      this.isolatedPieceGroup.visible = true;
      this.isPieceIsolated = true;

      const wrapper = new THREE.Group();

      // 1. Cerebelo completo (Folia 3D + Arbor Vitae interna)
      if ((code === 'CEREBELLUM' || code === 'CEREBELLUM_FOLIA' || regId === 24) && this.cerebellumMesh) {
        const cbClone = this.cerebellumMesh.clone();
        if (this.cerebellumUniforms) this.cerebellumUniforms.uOpacity.value = 1.0;
        wrapper.add(cbClone);
        if (this.arborVitaeGroup) wrapper.add(this.arborVitaeGroup.clone(true));
      }
      // 2. Estruturas do Sistema Nervoso Periférico (SNP)
      else if (code.startsWith('PNS_') || (regId && regId >= 27) || code === 'BRACHIAL_PLEXUS' || code === 'SCIATIC_LUMBOSACRAL') {
        this.pnsMeshes.forEach(m => {
          const mCode = m.userData && m.userData.structureCode;
          const mId = m.userData && m.userData.structureId;
          if (mCode === code || (mId && mId === regId)) {
            wrapper.add(m.clone());
          }
        });
        this.spinalMeshes.forEach(m => {
          const cloneS = m.clone();
          if (cloneS.material) {
            cloneS.material = cloneS.material.clone();
            cloneS.material.transparent = true;
            if (cloneS.material.uniforms && cloneS.material.uniforms.uOpacity) {
              cloneS.material.uniforms.uOpacity.value = 0.35;
            } else {
              cloneS.material.opacity = 0.35;
            }
          }
          wrapper.add(cloneS);
        });
      }
      // 3. Tronco Encefálico, Nervos Cranianos ou Medula Espinhal
      else if (
        code.startsWith('BRAINSTEM_') ||
        code.startsWith('SPINAL_') ||
        code === 'MIDBRAIN_SN' ||
        code === 'PONS_VAROLII' ||
        code === 'MEDULLA_OBLONGATA' ||
        code === 'CRANIAL_NERVES' ||
        [20, 21, 22, 23, 25, 26].includes(regId)
      ) {
        const matched = this.spinalMeshes.filter(m => {
          const codes = (m.userData && m.userData.structureCodes) || [m.userData && m.userData.structureCode];
          const ids = (m.userData && m.userData.structureIds) || [m.userData && m.userData.structureId];
          return codes.includes(code) || (regId && ids.includes(regId));
        });
        const listToClone = matched.length > 0 ? matched : this.spinalMeshes;
        listToClone.forEach(m => wrapper.add(m.clone()));
      }
      // 4. Núcleos Subcorticais, Límbico e Ventrículos
      else if (
        (this.subcorticalMeshMap[code] && this.subcorticalMeshMap[code].length > 0) ||
        (this.subcorticalMeshMap[String(regId)] && this.subcorticalMeshMap[String(regId)].length > 0)
      ) {
        const list = (this.subcorticalMeshMap[code] && this.subcorticalMeshMap[code].length > 0)
          ? this.subcorticalMeshMap[code]
          : this.subcorticalMeshMap[String(regId)];
        list.forEach(m => wrapper.add(m.clone()));
      }"""

assert old_isolate in code, "old_isolate not found"
code = code.replace(old_isolate, new_isolate, 1)

with open('web/js/cns-anatomy-3d.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated web/js/cns-anatomy-3d.js successfully!")
