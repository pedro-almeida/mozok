/**
 * ============================================================================
 * MOZOK v1.0 BETA — MOTOR MULTIESCALA DE PATOLOGIAS DO SNC & SNP
 * ============================================================================
 */
(function (window) {
  'use strict';

  class PathologyEngine {
    constructor(cnsAnatomy, neuralMicrocosmos) {
      this.cnsAnatomy = cnsAnatomy;
      this.neuralMicrocosmos = neuralMicrocosmos;
      this.activeDisease = 'HEALTHY';
      this.severity = 0.75;
      this.lang = 'pt-BR';
      this.injectPathologySelectorUI();
    }

    injectPathologySelectorUI() {
      const targetPane = document.getElementById('pathology-tab-pane') || document.querySelector('.hud-right');
      if (!targetPane || document.getElementById('hud-card-pathologies')) return;

      const box = document.createElement('div');
      box.id = 'hud-card-pathologies';
      box.style.cssText = 'display: flex; flex-direction: column; gap: 6px;';
      box.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:10px; font-weight:700; color:#f43f5e;">
          <span>SIMULADOR CLÍNICO (7 DOENÇAS)</span>
          <span id="pathology-active-badge" style="color:#10b981; font-family:'JetBrains Mono',monospace;">SAUDÁVEL</span>
        </div>
        <select id="select-pathology-mode" style="width:100%; background:rgba(15,23,42,0.92); color:#f1f5f9; border:1px solid rgba(244,63,94,0.45); border-radius:6px; padding:6px 8px; font-size:11px; font-weight:600; cursor:pointer; outline:none;">
          <option value="HEALTHY">🟢 SNC & SNP Saudável (Fisiológico)</option>
          <option value="ISCHEMIC_STROKE">🩸 AVC Isquêmico Agudo (Trombose ACM)</option>
          <option value="PRION_DCJ">🧬 Doença Priônica (Creutzfeldt-Jakob / DCJ)</option>
          <option value="ALZHEIMER">🟣 Doença de Alzheimer (Placas Aβ + Tau)</option>
          <option value="PARKINSON">🟡 Doença de Parkinson (Depleção Substância Negra)</option>
          <option value="MULTIPLE_SCLEROSIS">🔵 Esclerose Múltipla (Desmielinização Autoimune)</option>
          <option value="ALS_ELA">🟠 Esclerose Lateral Amiotrófica (ELA / Motoneurônios)</option>
          <option value="EPILEPSY">⚡ Epilepsia Focal (Hipersincronia Paroxística)</option>
        </select>
        <div style="display:flex; align-items:center; justify-content:space-between; font-size:10px; color:#94a3b8;">
          <span>Estágio / Gravidade Clínica:</span>
          <span id="pathology-severity-label" style="color:#fbbf24; font-family:'JetBrains Mono',monospace; font-weight:700;">75%</span>
        </div>
        <input type="range" id="slider-pathology-severity" min="10" max="100" value="75" style="width:100%; accent-color:#f43f5e; cursor:pointer;">
        <div id="pathology-clinical-summary" style="font-size:10px; color:#cbd5e1; line-height:1.35; background:rgba(2,6,23,0.65); padding:6px 8px; border-radius:6px; border-left:2px solid #10b981;">
          Homeostase sináptica preservada, fluxo liquórico laminar (32.4 mm/s) e condução saltatória íntegra.
        </div>
        <div style="display:flex; gap:6px;">
          <button id="btn-sim-focal-stroke" class="btn-action" style="flex:1; justify-content:center; padding:5px 8px; font-size:10px; background:rgba(239,68,68,0.22); border-color:rgba(239,68,68,0.6); color:#f87171;">
            🩸 Disparar AVC
          </button>
          <button id="btn-sim-reset-healthy" class="btn-action" style="flex:1; justify-content:center; padding:5px 8px; font-size:10px; background:rgba(16,185,129,0.22); border-color:rgba(16,185,129,0.6); color:#34d399;">
            ↺ Restaurar
          </button>
        </div>
      `;

      targetPane.prepend(box);

      const sel = box.querySelector('#select-pathology-mode');
      const slider = box.querySelector('#slider-pathology-severity');
      const sevLbl = box.querySelector('#pathology-severity-label');
      const btnStroke = box.querySelector('#btn-sim-focal-stroke');
      const btnReset = box.querySelector('#btn-sim-reset-healthy');

      if (sel) {
        sel.addEventListener('change', (e) => {
          this.applyDiseaseMode(e.target.value, this.severity);
        });
      }
      if (slider) {
        slider.addEventListener('input', (e) => {
          this.severity = parseInt(e.target.value, 10) / 100.0;
          if (sevLbl) sevLbl.textContent = `${e.target.value}%`;
          if (this.activeDisease !== 'HEALTHY') {
            this.applyDiseaseMode(this.activeDisease, this.severity);
          }
        });
      }
      if (btnStroke) {
        btnStroke.addEventListener('click', () => {
          if (sel) sel.value = 'ISCHEMIC_STROKE';
          this.triggerFocalStrokeSimulation([4.15, 0.55, 1.45]);
        });
      }
      if (btnReset) {
        btnReset.addEventListener('click', () => {
          if (sel) sel.value = 'HEALTHY';
          this.resetDiseaseSimulation();
        });
      }
    }

    applyDiseaseMode(diseaseKey, severity = 0.75) {
      this.activeDisease = diseaseKey;
      this.severity = severity;

      const badge = document.getElementById('pathology-active-badge');
      const summary = document.getElementById('pathology-clinical-summary');
      const prpc = document.getElementById('metric-prpc');
      const prpsc = document.getElementById('metric-prpsc');
      const tau = document.getElementById('metric-tau');
      const p1433 = document.getElementById('metric-1433');
      const rtquic = document.getElementById('metric-rtquic');

      if (diseaseKey === 'HEALTHY') {
        this.resetDiseaseSimulation();
        return;
      }

      const modeMap = {
        PRION_DCJ: {
          code: 1,
          badge: 'DCJ (PRÍON)',
          color: '#a855f7',
          desc: 'Conversão conformacional PrP^C → PrP^Sc com espongiose cortical vacúolar, astrogliose severa e perda de espinhas dendríticas.',
          prpc: `${Math.round(100 - severity * 65)}%`,
          prpsc: (severity * 8.4).toFixed(2),
          tau: `${Math.round(180 + severity * 4200)} pg/mL`,
          p1433: 'POSITIVO (++)',
          rtquic: 'POSITIVO (99%)'
        },
        ISCHEMIC_STROKE: {
          code: 2,
          badge: 'AVC ISQUÊMICO',
          color: '#ef4444',
          desc: 'Oclusão tromboembólica arterial com núcleo necrótico central, zona de penumbra isquêmica pulsátil e falha da bomba Na+/K+-ATPase.',
          prpc: '94%',
          prpsc: '0.00',
          tau: `${Math.round(180 + severity * 1400)} pg/mL`,
          p1433: '1.80 ng/mL',
          rtquic: 'NEGATIVO'
        },
        ALZHEIMER: {
          code: 3,
          badge: 'ALZHEIMER',
          color: '#c084fc',
          desc: 'Atrofia cortical e hipocampal com placas senis de Beta-Amiloide (Aβ42) e emaranhados neurofibrilares de proteína Tau hiperfosforilada.',
          prpc: '88%',
          prpsc: '0.00',
          tau: `${Math.round(180 + severity * 980)} pg/mL`,
          p1433: '0.95 ng/mL',
          rtquic: 'NEGATIVO'
        },
        PARKINSON: {
          code: 4,
          badge: 'PARKINSON',
          color: '#eab308',
          desc: 'Degeneração dos neurônios dopaminérgicos da Substância Negra Pars Compacta (via nigroestriatal) e corpos de Lewy de alfa-sinucleína.',
          prpc: '96%',
          prpsc: '0.00',
          tau: '240 pg/mL',
          p1433: '0.50 ng/mL',
          rtquic: 'α-Syn RT-QuIC (+)'
        },
        MULTIPLE_SCLEROSIS: {
          code: 5,
          badge: 'ESCLEROSE MÚLTIPLA',
          color: '#38bdf8',
          desc: 'Desmielinização autoimune dos oligodendrócitos no SNC com bloqueio da condução saltatória nos Nódulos de Ranvier.',
          prpc: '98%',
          prpsc: '0.00',
          tau: '310 pg/mL',
          p1433: 'Bandas Oligoclonais (+)',
          rtquic: 'NEGATIVO'
        },
        ALS_ELA: {
          code: 6,
          badge: 'ELA (MOTONEURÔNIO)',
          color: '#f97316',
          desc: 'Degeneração combinada dos motoneurônios superiores (Camada V) e inferiores (corno ventral medular) por excitotoxicidade glutamatérgica.',
          prpc: '95%',
          prpsc: '0.00',
          tau: '520 pg/mL',
          p1433: 'NfL Elevado (+++)',
          rtquic: 'NEGATIVO'
        },
        EPILEPSY: {
          code: 7,
          badge: 'EPILEPSIA FOCAL',
          color: '#fbbf24',
          desc: 'Disparos paroxísticos hipersincrônicos de alta frequência por desequilíbrio excitatório/inibitório (Glutamato vs GABA).',
          prpc: '100%',
          prpsc: '0.00',
          tau: '210 pg/mL',
          p1433: '0.45 ng/mL',
          rtquic: 'NEGATIVO'
        }
      };

      const cfg = modeMap[diseaseKey] || modeMap.PRION_DCJ;
      if (badge) {
        badge.textContent = cfg.badge;
        badge.style.color = cfg.color;
      }
      if (summary) {
        summary.textContent = cfg.desc;
        summary.style.borderLeftColor = cfg.color;
      }
      if (prpc) prpc.textContent = cfg.prpc;
      if (prpsc) prpsc.textContent = cfg.prpsc;
      if (tau) tau.textContent = cfg.tau;
      if (p1433) p1433.textContent = cfg.p1433;
      if (rtquic) rtquic.textContent = cfg.rtquic;

      if (this.cnsAnatomy && this.cnsAnatomy.cortexUniforms) {
        this.cnsAnatomy.cortexUniforms.uDiseaseMode.value = cfg.code;
        this.cnsAnatomy.cortexUniforms.uDiseaseSeverity.value = severity;
        if (diseaseKey === 'ISCHEMIC_STROKE') {
          this.cnsAnatomy.cortexUniforms.uLesionCenter.value.set(3.85, 0.50, 1.45);
          this.cnsAnatomy.cortexUniforms.uLesionRadius.value = 1.65 * (0.6 + 0.5 * severity);
        } else {
          this.cnsAnatomy.cortexUniforms.uLesionRadius.value = 0.0;
        }
      }

      const microMap = {
        HEALTHY: 'NORMAL',
        ISCHEMIC_STROKE: 'STROKE',
        PRION_DCJ: 'CJD',
        ALZHEIMER: 'ALZHEIMER',
        PARKINSON: 'PARKINSON',
        MULTIPLE_SCLEROSIS: 'MS',
        ALS_ELA: 'ALS',
        EPILEPSY: 'EPILEPSY'
      };
      const mappedKey = microMap[diseaseKey] || 'NORMAL';

      if (this.neuralMicrocosmos) {
        if (typeof this.neuralMicrocosmos.applyPathologyMode === 'function') {
          this.neuralMicrocosmos.applyPathologyMode(mappedKey, severity);
        } else if (typeof this.neuralMicrocosmos.setPathologyState === 'function') {
          this.neuralMicrocosmos.setPathologyState(mappedKey, severity);
        }
      }

      if (this.cnsAnatomy && this.cnsAnatomy.tractography && typeof this.cnsAnatomy.tractography.setPathologyImpact === 'function') {
        this.cnsAnatomy.tractography.setPathologyImpact(mappedKey);
      }
    }

    triggerFocalStrokeSimulation(coords = [3.85, 0.50, 1.45]) {
      this.applyDiseaseMode('ISCHEMIC_STROKE', this.severity);
      if (this.cnsAnatomy && this.cnsAnatomy.cortexUniforms && Array.isArray(coords)) {
        this.cnsAnatomy.cortexUniforms.uLesionCenter.value.set(coords[0], coords[1], coords[2]);
        this.cnsAnatomy.cortexUniforms.uLesionRadius.value = 1.85;
      }
    }

    resetDiseaseSimulation() {
      this.activeDisease = 'HEALTHY';
      const badge = document.getElementById('pathology-active-badge');
      const summary = document.getElementById('pathology-clinical-summary');
      if (badge) {
        badge.textContent = 'SAUDÁVEL';
        badge.style.color = '#10b981';
      }
      if (summary) {
        summary.textContent = 'Homeostase sináptica preservada, fluxo liquórico laminar (32.4 mm/s) e condução saltatória íntegra.';
        summary.style.borderLeftColor = '#10b981';
      }
      const prpc = document.getElementById('metric-prpc');
      const prpsc = document.getElementById('metric-prpsc');
      const tau = document.getElementById('metric-tau');
      const p1433 = document.getElementById('metric-1433');
      const rtquic = document.getElementById('metric-rtquic');
      if (prpc) prpc.textContent = '100%';
      if (prpsc) prpsc.textContent = '0.00';
      if (tau) tau.textContent = '180 pg/mL';
      if (p1433) p1433.textContent = '0.40 ng/mL';
      if (rtquic) rtquic.textContent = 'NEGATIVO';

      if (this.cnsAnatomy && typeof this.cnsAnatomy.restoreHealthyTissue === 'function') {
        this.cnsAnatomy.restoreHealthyTissue();
      }
      if (this.neuralMicrocosmos) {
        if (typeof this.neuralMicrocosmos.applyPathologyMode === 'function') {
          this.neuralMicrocosmos.applyPathologyMode('NORMAL', 0.0);
        } else if (typeof this.neuralMicrocosmos.setPathologyState === 'function') {
          this.neuralMicrocosmos.setPathologyState('NORMAL', 0.0);
        }
      }
      if (this.cnsAnatomy && this.cnsAnatomy.tractography && typeof this.cnsAnatomy.tractography.setPathologyImpact === 'function') {
        this.cnsAnatomy.tractography.setPathologyImpact('NORMAL');
      }
    }

    setLanguage(lang) {
      this.lang = lang;
    }
  }

  window.PathologyEngine = PathologyEngine;
})(window);
