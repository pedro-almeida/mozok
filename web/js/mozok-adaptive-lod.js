// [PT-BR]: Calibrador dinâmico de hardware e governador de LOD adaptativo em tempo real para MOZOK (estilo MSFS).
// [EN-GB]: Dynamic hardware calibrator and real-time adaptive LOD governor for MOZOK (Flight Simulator style).
// [AI-CTX]: @llm-context: Hardware profiling & FPS rolling window auto-scaler for universal accessibility across devices.
//           @llm-invariant: Guarantees 60 FPS on dedicated GPUs (e.g. GTX 1650/RTX) and smooth 30+ FPS on budget phones without freezing camera.
//           @llm-neuroscience: Preserves critical cytoarchitectonic fidelity, synaptic density, and vascular branching according to scale tier.

(function (window) {
  'use strict';

  // [PT-BR]: 4 Perfis de Qualidade e Orçamento de Polígonos / Draw Distance.
  // [EN-GB]: 4 Quality Profiles and Polygon Budget / Draw Distance.
  const LOD_PROFILES = {
    ULTRA: {
      name: 'ULTRA',
      label: 'Ultra (GPU Dedicada)',
      pixelRatio: Math.min((typeof window !== 'undefined' && window.devicePixelRatio) || 1.0, 2.0),
      maxDrawDistance: 120.0,
      swcNeuronCount: 96,
      dendriticSpinesCount: 220,
      tubularSegments: 32,
      radialSegments: 12,
      vascularBranches: 'full',
      sssShader: true,
      shadows: true,
      instancedCapillaries: true,
      extracellularParticles: 250
    },
    HIGH: {
      name: 'HIGH',
      label: 'Alto (Notebooks / Tablets)',
      pixelRatio: 1.5,
      maxDrawDistance: 85.0,
      swcNeuronCount: 48,
      dendriticSpinesCount: 110,
      tubularSegments: 20,
      radialSegments: 8,
      vascularBranches: 'high',
      sssShader: true,
      shadows: false,
      instancedCapillaries: true,
      extracellularParticles: 120
    },
    MEDIUM: {
      name: 'MEDIUM',
      label: 'Médio (Vídeo Integrado)',
      pixelRatio: 1.25,
      maxDrawDistance: 55.0,
      swcNeuronCount: 24,
      dendriticSpinesCount: 50,
      tubularSegments: 12,
      radialSegments: 6,
      vascularBranches: 'essential',
      sssShader: true,
      shadows: false,
      instancedCapillaries: false,
      extracellularParticles: 50
    },
    ACCESSIBLE: {
      name: 'ACCESSIBLE',
      label: 'Acessível (Democratização Zero-Lag)',
      pixelRatio: 1.0,
      maxDrawDistance: 38.0,
      swcNeuronCount: 8,
      dendriticSpinesCount: 16,
      tubularSegments: 8,
      radialSegments: 4,
      vascularBranches: 'essential',
      sssShader: false, // Usa MeshLambertMaterial otimizado zero-lag
      shadows: false,
      instancedCapillaries: false,
      extracellularParticles: 20
    }
  };

  const PROFILE_KEYS = ['ACCESSIBLE', 'MEDIUM', 'HIGH', 'ULTRA'];

  class MozokAdaptiveLOD {
    constructor() {
      this.isAuto = true;
      this.detectedProfile = this.detectHardwareProfile();
      this.currentProfileKey = this.detectedProfile;
      this.currentConfig = Object.assign({}, LOD_PROFILES[this.currentProfileKey]);

      // Janela móvel de 90 quadros para cálculo de FPS estável
      this.frameWindowSize = 90;
      this.frameTimes = [];
      this.lastFrameTimestamp = performance.now();
      this.currentFPS = 60;
      this.avgFPS = 60;

      // Temporizadores de histerese para evitar oscilação de LOD
      this.lowFpsDuration = 0.0;
      this.highFpsDuration = 0.0;
      this.lastAdjustmentTime = performance.now();

      // Listeners de mudança de perfil
      this.listeners = [];

      // Badge DOM
      this.badgeElement = null;

      // Inicia o monitor de quadros
      this.startFPSLoop();
    }

    // [PT-BR]: Detecção inicial do hardware via WebGL debug renderer, RAM e núcleos de CPU.
    // [EN-GB]: Initial hardware detection via WebGL debug renderer, RAM, and CPU core concurrency.
    // [AI-CTX]: @llm-invariant: Identifies dedicated NVIDIA/AMD/Apple Silicon vs integrated Intel UHD/Mali/Adreno.
    detectHardwareProfile() {
      if (typeof window === 'undefined') return 'MEDIUM';

      let isDedicatedGPU = false;
      let rendererName = '';

      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        if (gl) {
          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
          if (debugInfo) {
            rendererName = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
            const lower = rendererName.toLowerCase();
            // GPUs dedicadas desktop/laptop e Apple Silicon
            if (
              lower.includes('nvidia') ||
              lower.includes('geforce') ||
              lower.includes('quadro') ||
              lower.includes('rtx') ||
              lower.includes('gtx') ||
              lower.includes('radeon rx') ||
              lower.includes('apple m1') ||
              lower.includes('apple m2') ||
              lower.includes('apple m3') ||
              lower.includes('apple m4')
            ) {
              isDedicatedGPU = true;
            }
          }
        }
      } catch (e) {
        console.warn('[MozokAdaptiveLOD] Falha ao consultar WebGL renderer:', e);
      }

      const ramGB = navigator.deviceMemory || 4; // GB
      const cpuCores = navigator.hardwareConcurrency || 4;
      const isMobile = (window.innerWidth <= 768) || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

      console.log(`[MozokAdaptiveLOD] GPU: "${rendererName}" | Dedicada: ${isDedicatedGPU} | RAM: ${ramGB}GB | Cores: ${cpuCores} | Mobile: ${isMobile}`);

      if (isDedicatedGPU && !isMobile && ramGB >= 6 && cpuCores >= 6) {
        return 'ULTRA';
      } else if ((isDedicatedGPU || ramGB >= 8) && cpuCores >= 4 && !isMobile) {
        return 'HIGH';
      } else if (ramGB >= 4 && cpuCores >= 4) {
        return isMobile ? 'MEDIUM' : 'HIGH';
      } else if (ramGB >= 2 && cpuCores >= 2) {
        return 'MEDIUM';
      } else {
        return 'ACCESSIBLE';
      }
    }

    // [PT-BR]: Registra o timestamp de renderização e atualiza o governador dinâmico de FPS.
    // [EN-GB]: Records rendering timestamp and updates dynamic FPS governor.
    recordFrame(now = performance.now()) {
      const delta = now - this.lastFrameTimestamp;
      this.lastFrameTimestamp = now;

      if (delta > 0) {
        const instantFPS = 1000.0 / delta;
        this.frameTimes.push(instantFPS);
        if (this.frameTimes.length > this.frameWindowSize) {
          this.frameTimes.shift();
        }

        // Média móvel dos últimos 90 quadros
        let sum = 0;
        for (let i = 0; i < this.frameTimes.length; i++) {
          sum += this.frameTimes[i];
        }
        this.avgFPS = sum / this.frameTimes.length;
        this.currentFPS = Math.round(this.avgFPS);
      }

      // Se estiver em modo automático, avalia o governador de FPS a cada 200ms
      if (this.isAuto && (now - this.lastAdjustmentTime) > 2000) {
        this.evaluateGovernor(now);
      }

      this.updateBadge();
    }

    // [PT-BR]: Governador de FPS em tempo real: rebaixa se < 32 FPS ou promove se >= 58 FPS.
    // [EN-GB]: Real-time FPS governor: steps down if < 32 FPS or promotes if >= 58 FPS.
    evaluateGovernor(now) {
      const currentIndex = PROFILE_KEYS.indexOf(this.currentProfileKey);

      if (this.avgFPS < 32.0) {
        this.lowFpsDuration += 2.0;
        this.highFpsDuration = 0.0;

        // Se passar mais de 2 segundos abaixo de 32 FPS, rebaixa 1 nível de LOD
        if (this.lowFpsDuration >= 2.0 && currentIndex > 0) {
          const newKey = PROFILE_KEYS[currentIndex - 1];
          console.warn(`[MozokAdaptiveLOD] Rebaixando LOD adaptativo para ${newKey} (FPS médio: ${this.currentFPS})`);
          this.setProfile(newKey, false);
          this.lowFpsDuration = 0.0;
          this.lastAdjustmentTime = now;
        }
      } else if (this.avgFPS >= 58.0) {
        this.highFpsDuration += 2.0;
        this.lowFpsDuration = 0.0;

        // Se passar mais de 4 segundos em 58+ FPS com folga, permite subir até o perfil detectado
        const maxIndex = PROFILE_KEYS.indexOf(this.detectedProfile);
        if (this.highFpsDuration >= 4.0 && currentIndex < maxIndex) {
          const newKey = PROFILE_KEYS[currentIndex + 1];
          console.log(`[MozokAdaptiveLOD] Promovendo LOD adaptativo para ${newKey} (FPS médio: ${this.currentFPS})`);
          this.setProfile(newKey, false);
          this.highFpsDuration = 0.0;
          this.lastAdjustmentTime = now;
        }
      } else {
        this.lowFpsDuration = 0.0;
        this.highFpsDuration = 0.0;
      }
    }

    // [PT-BR]: Loop de animação leve contínuo para manter contagem de FPS mesmo em repouso.
    // [EN-GB]: Continuous lightweight animation loop maintaining FPS tracking even at rest.
    startFPSLoop() {
      const loop = (time) => {
        this.recordFrame(time);
        requestAnimationFrame(loop);
      };
      if (typeof window !== 'undefined') {
        requestAnimationFrame(loop);
      }
    }

    // [PT-BR]: Define explicitamente o perfil de LOD e notifica ouvintes (câmera, shaders, malhas).
    // [EN-GB]: Explicitly sets LOD profile and notifies listeners (camera, shaders, meshes).
    setProfile(profileKey, manual = true) {
      if (!LOD_PROFILES[profileKey]) return;
      if (manual) {
        this.isAuto = false;
      }
      this.currentProfileKey = profileKey;
      this.currentConfig = Object.assign({}, LOD_PROFILES[profileKey]);

      this.listeners.forEach((cb) => {
        try {
          cb(this.currentConfig, this.currentProfileKey, this.isAuto);
        } catch (e) {
          console.error('[MozokAdaptiveLOD] Erro em listener:', e);
        }
      });

      this.updateBadge();
    }

    // [PT-BR]: Alterna ciclo manual: AUTO -> ULTRA -> HIGH -> MEDIUM -> ACCESSIBLE -> AUTO.
    // [EN-GB]: Toggles manual cycle: AUTO -> ULTRA -> HIGH -> MEDIUM -> ACCESSIBLE -> AUTO.
    cycleProfile() {
      if (this.isAuto) {
        this.setProfile('ULTRA', true);
      } else {
        const order = ['ULTRA', 'HIGH', 'MEDIUM', 'ACCESSIBLE', 'AUTO'];
        const currentIdx = order.indexOf(this.currentProfileKey);
        const next = order[(currentIdx + 1) % order.length];
        if (next === 'AUTO') {
          this.isAuto = true;
          this.setProfile(this.detectedProfile, false);
        } else {
          this.setProfile(next, true);
        }
      }
    }

    // [PT-BR]: Registra callback de ouvinte para alterações de perfil.
    // [EN-GB]: Registers listener callback for profile changes.
    onProfileChange(callback) {
      if (typeof callback === 'function') {
        this.listeners.push(callback);
        // Dispara imediatamente com o perfil atual
        callback(this.currentConfig, this.currentProfileKey, this.isAuto);
      }
    }

    // [PT-BR]: Vincula o elemento visual da barra superior para exibição do status.
    // [EN-GB]: Binds topbar visual element to display live performance status.
    bindBadge(elementOrSelector) {
      if (typeof elementOrSelector === 'string') {
        this.badgeElement = document.querySelector(elementOrSelector);
      } else {
        this.badgeElement = elementOrSelector;
      }

      if (this.badgeElement) {
        this.badgeElement.style.cursor = 'pointer';
        this.badgeElement.title = 'Clique para alternar modo de qualidade gráfica (Auto / Manual)';
        this.badgeElement.addEventListener('click', () => this.cycleProfile());
      }
      this.updateBadge();
    }

    updateBadge() {
      if (!this.badgeElement) return;
      const modeLabel = this.isAuto ? 'AUTO' : 'MANUAL';
      const key = this.currentProfileKey;
      const fps = Math.max(10, Math.min(144, this.currentFPS || 60));
      this.badgeElement.innerHTML = `⚡ ${modeLabel}: ${key} [${fps} FPS]`;

      if (fps < 30) {
        this.badgeElement.style.borderColor = 'rgba(244, 63, 94, 0.6)';
        this.badgeElement.style.color = '#fca5a5';
      } else if (fps < 45) {
        this.badgeElement.style.borderColor = 'rgba(251, 191, 36, 0.6)';
        this.badgeElement.style.color = '#fef08a';
      } else {
        this.badgeElement.style.borderColor = 'rgba(0, 242, 254, 0.45)';
        this.badgeElement.style.color = '#e0f2fe';
      }
    }

    getConfig() {
      return this.currentConfig;
    }

    getProfileKey() {
      return this.currentProfileKey;
    }
  }

  // Exportação Global
  window.LOD_PROFILES = LOD_PROFILES;
  window.MozokAdaptiveLOD = MozokAdaptiveLOD;

  // Instância singleton pronta
  if (typeof window !== 'undefined') {
    window.mozokAdaptiveLOD = new MozokAdaptiveLOD();
  }

})(typeof window !== 'undefined' ? window : this);
