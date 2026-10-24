/**
 * ============================================================================
 * MOZOK v2.0 — MOTOR 3D DE TRACTOGRAFIA E VIAS NEURAIS REAIS
 * Visualização Dinâmica de 9 Circuitos Neurais com DTI e Propagação de Sinal
 * ============================================================================
 * Circuitos:
 * 1. Via Corticoespinhal (Trato Piramidal)
 * 2. Fascículo Arqueado (Circuito da Linguagem Broca-Wernicke)
 * 3. Via Visual (Radiações Ópticas de Gratiolet)
 * 4. Via Auditiva (Lemnisco Lateral e Radiação Acústica)
 * 5. Circuito de Papez (Consolidação de Memória Límbica)
 * 6. Via Nigroestriatal (Dopamina Motora SNc -> Putâmen/Caudado)
 * 7. Via Mesolímbica (Dopamina de Recompensa VTA -> NAcc/Amígdala)
 * 8. Via Mesocortical (Dopamina Cognitiva VTA -> DLPFC)
 * 9. Vias Serotoninérgicas (Núcleos da Rafe -> Projeções Difusas)
 * ============================================================================
 */

(function (window) {
  'use strict';

  class Tractography3D {
    constructor(scene, options = {}) {
      this.scene = scene;
      this.masterGroup = new THREE.Group();
      this.masterGroup.name = "TRACTOGRAPHY_3D_MASTER_GROUP";
      this.scene.add(this.masterGroup);

      this.circuits = new Map();
      this.activeCircuits = new Set();
      this.actionPulses = [];
      this.elapsedTime = 0;
      this.pathologyImpact = 'NORMAL';

      this.initCircuits();
    }

    initCircuits() {
      const db = window.MOZOK_DATABASE ? window.MOZOK_DATABASE.tracts : [];
      if (!db || db.length === 0) return;

      db.forEach(circuitDef => {
        const circuitObj = this.buildCircuitMesh(circuitDef);
        this.masterGroup.add(circuitObj.group);
        this.circuits.set(circuitDef.id, circuitObj);
        this.activeCircuits.add(circuitDef.id);
      });
    }

    buildCircuitMesh(def) {
      const group = new THREE.Group();
      group.name = `TRACT_${def.id}`;

      // Pontos MNI152 escalonados para a cena (* 1.0 ou * SCALE conforme montagem)
      const pts = def.roiPath.map(p => new THREE.Vector3(p[0], p[1], p[2]));
      const curve = new THREE.CatmullRomCurve3(pts);
      curve.curveType = 'centripetal';
      curve.tension = 0.45;

      const baseColor = new THREE.Color(def.color);

      // [PT-BR]: 1. Feixe Principal Fino em escala canônica MNI152 (r = 0.05, sem espaguetes gigantes)
      // [EN-GB]: 1. Fine Main Bundle in canonical MNI152 scale (r = 0.05, zero giant spaghetti)
      // [AI-CTX]: @llm-invariant: Strictly r = 0.04 to 0.08, visible inside brain volume.
      const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.055, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: baseColor,
        roughness: 0.35,
        metalness: 0.25,
        transparent: true,
        opacity: 0.88,
        emissive: baseColor,
        emissiveIntensity: 0.45
      });
      const mainTube = new THREE.Mesh(tubeGeo, tubeMat);
      mainTube.name = `Tube_${def.id}`;
      group.add(mainTube);

      // [PT-BR]: 2. Fibras Periféricas Finas (Streamlines DTI sutis com r = 0.022)
      // [EN-GB]: 2. Subtle Peripheral Streamlines (DTI streamlines with r = 0.022)
      // [AI-CTX]: @llm-context: Multi-filament biological bundle within brain volume.
      const fiberCount = 5;
      const strandMeshes = [];
      for (let f = 0; f < fiberCount; f++) {
        const offsetAngle = (f / fiberCount) * Math.PI * 2;
        const offsetRad = 0.045 + (f % 2) * 0.025;

        // Gera curva ligeiramente perturbada
        const offsetPts = pts.map(p => {
          const perpX = Math.cos(offsetAngle) * offsetRad;
          const perpZ = Math.sin(offsetAngle) * offsetRad;
          return new THREE.Vector3(p.x + perpX, p.y + (Math.sin(offsetAngle * 2) * 0.015), p.z + perpZ);
        });
        const strandCurve = new THREE.CatmullRomCurve3(offsetPts);
        const strandGeo = new THREE.TubeGeometry(strandCurve, 48, 0.022, 5, false);
        const strandMat = new THREE.MeshStandardMaterial({
          color: baseColor.clone().offsetHSL(0.04 * (f - 2), 0, 0.1),
          roughness: 0.4,
          transparent: true,
          opacity: 0.65,
          emissive: baseColor,
          emissiveIntensity: 0.25
        });
        const strandMesh = new THREE.Mesh(strandGeo, strandMat);
        group.add(strandMesh);
        strandMeshes.push(strandMesh);
      }

      // [PT-BR]: 3. Pulsos luminosos sutis nos tratos
      // [EN-GB]: 3. Subtle luminous action potential pulses along tract
      const pulsesPerTract = 4;
      const pulses = [];
      const pulseGeo = new THREE.SphereGeometry(0.065, 8, 8);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.95
      });

      for (let p = 0; p < pulsesPerTract; p++) {
        const pMesh = new THREE.Mesh(pulseGeo, pulseMat.clone());
        pMesh.material.color.setHex(0xffffff);
        pMesh.visible = true;
        group.add(pMesh);

        pulses.push({
          mesh: pMesh,
          progress: (p / pulsesPerTract),
          speed: (def.velocidade / 100.0) * 0.18 + 0.05
        });
      }

      return {
        def,
        group,
        curve,
        mainTube,
        strandMeshes,
        pulses,
        isActive: true
      };
    }

    // [PT-BR]: Ativa ou desativa a exibição tridimensional de um circuito específico.
    // [EN-GB]: Toggles 3D display of a specific neural circuit.
    setCircuitActive(circuitId, isActive) {
      const c = this.circuits.get(circuitId);
      if (!c) return;

      c.isActive = !!isActive;
      c.group.visible = c.isActive;

      if (c.isActive) {
        this.activeCircuits.add(circuitId);
      } else {
        this.activeCircuits.delete(circuitId);
      }
    }

    // [PT-BR]: Ativa ou desativa todos os 9 circuitos simultaneamente.
    // [EN-GB]: Toggles all 9 circuits simultaneously.
    setAllCircuitsActive(isActive) {
      this.circuits.forEach((c, id) => {
        this.setCircuitActive(id, isActive);
      });
    }

    // [PT-BR]: Destaca um circuito selecionado, aumentando sua emissividade e opacidade.
    // [EN-GB]: Highlights a selected circuit, boosting its emissive intensity and opacity.
    highlightCircuit(circuitId) {
      this.circuits.forEach((c, id) => {
        if (!c.isActive) return;
        if (id === circuitId) {
          c.mainTube.material.opacity = 1.0;
          c.mainTube.material.emissiveIntensity = 0.95;
          c.group.scale.set(1.08, 1.08, 1.08);
        } else {
          c.mainTube.material.opacity = 0.35;
          c.mainTube.material.emissiveIntensity = 0.15;
          c.group.scale.set(1.0, 1.0, 1.0);
        }
      });
    }

    // [PT-BR]: Remove o destaque de circuitos, restaurando os valores normais.
    // [EN-GB]: Clears circuit highlights, restoring standard values.
    clearHighlight() {
      this.circuits.forEach(c => {
        if (!c.isActive) return;
        c.mainTube.material.opacity = 0.88;
        c.mainTube.material.emissiveIntensity = 0.45;
        c.group.scale.set(1.0, 1.0, 1.0);
      });
    }

    // [PT-BR]: Aplica o impacto fisiopatológico da doença sobre os circuitos de tractografia.
    // [EN-GB]: Applies pathophysiological impact of disease over tractography circuits.
    setPathologyImpact(pathologyKey) {
      this.pathologyImpact = (pathologyKey || 'NORMAL').toUpperCase();

      this.circuits.forEach((c, id) => {
        // Redefine padrão hígido
        c.mainTube.material.color.set(c.def.color);
        c.mainTube.material.emissive.set(c.def.color);
        c.mainTube.material.opacity = 0.88;

        if (this.pathologyImpact === 'MS') {
          // Esclerose Múltipla afeta o trato corticoespinhal e vias do tronco
          if (id === 'CORTICOSPINAL') {
            c.mainTube.material.color.setHex(0xe11d48);
            c.mainTube.material.opacity = 0.45;
            c.pulses.forEach(p => p.speed = 0.02); // Lentificação extrema
          }
        } else if (this.pathologyImpact === 'STROKE') {
          // AVC afeta via corticoespinhal e fascículo arqueado
          if (id === 'CORTICOSPINAL' || id === 'ARCUATE') {
            c.mainTube.material.color.setHex(0x991b1b);
            c.mainTube.material.opacity = 0.30;
            c.pulses.forEach(p => p.speed = 0.0); // Parada de condução
          }
        } else if (this.pathologyImpact === 'PARKINSON') {
          // Degeneração da via nigroestriatal
          if (id === 'NIGROSTRIATAL') {
            c.mainTube.material.color.setHex(0x78716c);
            c.mainTube.material.opacity = 0.35;
            c.pulses.forEach(p => p.speed = 0.03);
          }
        } else if (this.pathologyImpact === 'ALS') {
          // ELA ataca especificamente o trato corticoespinhal
          if (id === 'CORTICOSPINAL') {
            c.mainTube.material.color.setHex(0xb91c1c);
            c.mainTube.material.opacity = 0.25;
            c.pulses.forEach(p => p.speed = 0.01);
          }
        } else if (this.pathologyImpact === 'EPILEPSY') {
          // Hiperatividade sincrônica rápida em todos os tratos
          c.mainTube.material.emissiveIntensity = 0.85;
          c.pulses.forEach(p => p.speed = 0.35);
        } else {
          // Fisiologia normal
          c.pulses.forEach((p, idx) => {
            p.speed = (c.def.velocidade / 100.0) * 0.18 + 0.05;
          });
        }
      });
    }

    // [PT-BR]: Atualização contínua dos pulsos de potenciais de ação propagando-se pelos tratos.
    // [EN-GB]: Continuous update of action potential pulses propagating along the tracts.
    update(dt) {
      this.elapsedTime += dt;

      this.circuits.forEach(c => {
        if (!c.isActive) return;

        c.pulses.forEach(p => {
          p.progress += p.speed * dt;
          if (p.progress > 1.0) p.progress -= 1.0;

          // Obtém posição e tangente da curva
          const pos = c.curve.getPointAt(p.progress);
          if (pos) {
            p.mesh.position.copy(pos);
            // Pulso pisca conforme avança
            const pulseGlow = 0.65 + Math.sin(this.elapsedTime * 12.0 + p.progress * Math.PI * 4) * 0.35;
            p.mesh.scale.setScalar(pulseGlow);
          }
        });
      });
    }

    // [PT-BR]: Retorna o estado atual dos circuitos para a interface de controle.
    // [EN-GB]: Returns current circuit states for control interface.
    getStatus() {
      const result = [];
      this.circuits.forEach((c, id) => {
        result.push({
          id,
          nome: c.def.nome,
          name: c.def.name,
          color: c.def.color,
          categoria: c.def.categoria,
          isActive: c.isActive,
          velocidade: c.def.velocidade,
          funcao: c.def.funcao
        });
      });
      return result;
    }
  }

  window.Tractography3D = Tractography3D;
})(window);
