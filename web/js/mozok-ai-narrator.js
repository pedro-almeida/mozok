// [PT-BR]: Motor de Narração Neural Natural em 3 Camadas e Integração com VLibras (Tradução Simultânea em Libras).
// [EN-GB]: 3-Tier Natural Neural AI Voice Narrator Engine and VLibras Integration (Simultaneous Sign Language Translation).
// [AI-CTX]: @llm-context: Accessibility bridge linking Edge-TTS/Zorya Local, Web Speech API (natural voices), and VLibras for WCAG AAA compliance.
//           @llm-invariant: 3-tier voice synthesis (Tier 1: Zorya/Svitlo Neural HTTP; Tier 2: Edge/Chrome Natural voices with 140ms respiratory pauses; Tier 3: Subtitles + VLibras).
//           @llm-neuroscience: Natural human prosody for clinical and anatomical neurobiology explanations.
//           @llm-a11y: WCAG AAA compliant screen-reader friendly speech and sign language bridge.

(function (window) {
  'use strict';

  // [PT-BR]: Classe controladora da narração neural e sincronização com VLibras.
  // [EN-GB]: Controller class for neural voice narration and VLibras synchronization.
  class MozokAINarrator {
    constructor() {
      // [PT-BR]: Estado de ativação de voz, legendas, VLibras e idioma ativo (5 idiomas suportados).
      // [EN-GB]: State of voice synthesis, subtitles, VLibras activation, and active language (5 supported languages).
      // [AI-CTX]: @llm-invariant: Default voice on, subtitles on, initial language pt-BR.
      this.isVoiceEnabled = true;
      this.isVLibrasActive = false;
      this.currentLang = 'pt-BR';
      this.currentVoice = null;
      this.voicesByLang = {};
      this.subtitleEl = null;
      this.subtitleTimeout = null;
      this.sentenceTimeout = null;
      this.currentAudio = null;

      // [PT-BR]: Cache em memória de ObjectURLs para síntese neural instantânea (Tier 1).
      // [EN-GB]: In-memory cache of ObjectURLs for instant neural synthesis (Tier 1).
      this.audioCache = new Map();

      // [PT-BR]: Endpoints neurais oficiais locais e remotos para síntese de alta fidelidade.
      // [EN-GB]: Official local and remote neural endpoints for high-fidelity speech synthesis.
      this.neuralEndpoints = [
        'http://127.0.0.1:8085/api/v1/voice/tts',
        'https://svitlo.espectroipe.com.br/api/v1/svitlo/tts/explain'
      ];

      // [PT-BR]: Vozes neurais oficiais por código de idioma.
      // [EN-GB]: Official neural voices per language code.
      this.neuralVoices = {
        'pt-BR': 'pt-BR-FranciscaNeural',
        'en-GB': 'en-GB-SoniaNeural',
        'it-IT': 'it-IT-ElsaNeural',
        'uk-UA': 'uk-UA-PolinaNeural',
        'es-ES': 'es-ES-ElviraNeural'
      };

      this.initVoices();
      this.setupSubtitleOverlay();
      this.detectVLibras();
    }

    // [PT-BR]: Pontua a qualidade da voz no navegador, priorizando estritamente vozes neurais/online (Francisca, Natural, etc.).
    // [EN-GB]: Scores browser voice quality, strictly prioritising neural/online natural voices (Francisca, Natural, etc.).
    // [AI-CTX]: @llm-invariant: Eliminates robotic metallic voices in favor of Microsoft Natural and Google online voices.
    scoreVoice(v, targetLang) {
      if (!v || !v.name || !v.lang) return -1;
      const vName = v.name.toLowerCase();
      const vLang = v.lang.toLowerCase().replace('_', '-');
      const target = targetLang.toLowerCase();
      const prefix = target.split('-')[0];

      let score = 0;
      if (vLang === target) {
        score += 40;
      } else if (vLang.startsWith(prefix)) {
        score += 20;
      } else {
        return -1;
      }

      // Critérios estritos de naturalidade e prosódia humana
      if (vName.includes('natural')) score += 60;
      if (vName.includes('online')) score += 45;
      if (vName.includes('francisca')) score += 40;
      if (vName.includes('antonio') || vName.includes('thalita')) score += 35;
      if (vName.includes('sonia') || vName.includes('elsa') || vName.includes('polina') || vName.includes('elvira')) score += 35;
      if (vName.includes('google')) score += 30;
      if (vName.includes('neural')) score += 25;

      return score;
    }

    // [PT-BR]: Inicializa e seleciona as melhores vozes neurais para os 5 idiomas suportados.
    // [EN-GB]: Initialises and selects the best natural voices for the 5 supported languages.
    initVoices() {
      if (!('speechSynthesis' in window)) {
        console.warn('[MozokAINarrator] Web Speech API não suportada neste navegador.');
        return;
      }

      const pickVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (!voices || voices.length === 0) return;

        const langTargets = ['pt-BR', 'en-GB', 'it-IT', 'uk-UA', 'es-ES'];
        langTargets.forEach(target => {
          let bestVoice = null;
          let bestScore = -1;

          voices.forEach(v => {
            const score = this.scoreVoice(v, target);
            if (score > bestScore) {
              bestScore = score;
              bestVoice = v;
            }
          });

          if (bestVoice) {
            this.voicesByLang[target] = bestVoice;
          }
        });

        this.currentVoice = this.voicesByLang[this.currentLang] || voices[0] || null;
      };

      pickVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = pickVoices;
      }
    }

    // [PT-BR]: Altera o idioma da síntese de voz (pt-BR, en-GB, it-IT, uk-UA, es-ES).
    // [EN-GB]: Changes speech synthesis language (pt-BR, en-GB, it-IT, uk-UA, es-ES).
    setLanguage(langCode) {
      if (!langCode) return;
      this.currentLang = langCode;
      if (this.voicesByLang[langCode]) {
        this.currentVoice = this.voicesByLang[langCode];
      } else if ('speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices();
        const prefix = langCode.split('-')[0].toLowerCase();
        this.currentVoice = voices.find(v => v.lang.toLowerCase().startsWith(prefix)) || null;
      }
    }

    // [PT-BR]: Configura contêiner de legendas flutuantes sincronizadas na tela para acessibilidade WCAG AAA.
    // [EN-GB]: Configures floating synchronized subtitles overlay on screen for WCAG AAA accessibility.
    setupSubtitleOverlay() {
      if (document.getElementById('mozok-subtitles-overlay')) {
        this.subtitleEl = document.getElementById('mozok-subtitles-overlay');
        return;
      }

      const sub = document.createElement('div');
      sub.id = 'mozok-subtitles-overlay';
      sub.setAttribute('role', 'status');
      sub.setAttribute('aria-live', 'polite');
      sub.style.cssText = `
        position: fixed;
        bottom: 84px;
        left: 50%;
        transform: translateX(-50%);
        max-width: 800px;
        width: 90%;
        background: rgba(6, 9, 17, 0.92);
        backdrop-filter: blur(16px);
        border: 1px solid rgba(0, 242, 254, 0.4);
        border-radius: 12px;
        padding: 12px 20px;
        color: #ffffff;
        font-family: 'Inter', system-ui, sans-serif;
        font-size: 15px;
        line-height: 1.5;
        text-align: center;
        z-index: 9999;
        display: none;
        box-shadow: 0 10px 40px rgba(0,0,0,0.8), 0 0 20px rgba(0,242,254,0.25);
        pointer-events: none;
        transition: opacity 0.3s ease;
      `;
      document.body.appendChild(sub);
      this.subtitleEl = sub;
    }

    // [PT-BR]: Detecta a presença do plugin oficial VLibras na página.
    // [EN-GB]: Detects presence of official VLibras plugin in the page.
    detectVLibras() {
      const check = () => {
        if (window.VLibras || document.querySelector('[vw]') || document.querySelector('.vw-plugin-wrapper')) {
          this.isVLibrasActive = true;
        }
      };
      check();
      setTimeout(check, 2000);
      setTimeout(check, 5000);
    }

    // [PT-BR]: Envia texto falado para o componente VLibras executar a tradução em Libras.
    // [EN-GB]: Sends spoken text to the VLibras component to perform sign language translation.
    syncSpeechWithVLibras(text) {
      if (!text) return;
      this.showSubtitle(text);

      try {
        if (window.plugin && typeof window.plugin.translate === 'function') {
          window.plugin.translate(text);
        } else if (window.VLibras && window.VLibras.Widget) {
          const widgetEl = document.querySelector('[vw-access-button]');
          if (widgetEl && !document.querySelector('.vw-plugin-top-wrapper.active')) {
            // Widget ready
          }
        }
      } catch (err) {
        console.warn('[MozokAINarrator] Falha ao enviar para VLibras:', err);
      }
    }

    // [PT-BR]: Exibe a legenda sincronizada na tela por tempo proporcional ao comprimento do texto.
    // [EN-GB]: Displays synchronized subtitle on screen for time proportional to text length.
    showSubtitle(text) {
      if (!this.subtitleEl) this.setupSubtitleOverlay();
      if (!this.subtitleEl) return;

      this.subtitleEl.innerHTML = `<span style="color: #00f2fe; font-weight: 600; margin-right: 6px;">💬 IA:</span> ${text}`;
      this.subtitleEl.style.display = 'block';
      this.subtitleEl.style.opacity = '1';

      if (this.subtitleTimeout) clearTimeout(this.subtitleTimeout);

      const durationMs = Math.max(4000, text.length * 65);
      this.subtitleTimeout = setTimeout(() => {
        if (this.subtitleEl) {
          this.subtitleEl.style.opacity = '0';
          setTimeout(() => {
            if (this.subtitleEl) this.subtitleEl.style.display = 'none';
          }, 300);
        }
      }, durationMs);
    }

    // [PT-BR]: Camada 1: Tenta sintetizar áudio via Servidor Neural Local (Zorya) ou Edge-TTS HTTP com timeout de 2500ms.
    // [EN-GB]: Tier 1: Attempts neural audio synthesis via Local Neural Server (Zorya) or Edge-TTS HTTP with 2500ms timeout.
    // [AI-CTX]: @llm-context: High-fidelity natural speech using official neural voices (Francisca, Sonia, Elsa, Polina, Elvira).
    async trySynthesizeNeural(text, langCode) {
      const cacheKey = `${langCode}:${text}`;
      if (this.audioCache.has(cacheKey)) {
        return this.audioCache.get(cacheKey);
      }

      const voice = this.neuralVoices[langCode] || this.neuralVoices['pt-BR'];

      for (const endpoint of this.neuralEndpoints) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);

        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, voice, lang: langCode }),
            signal: controller.signal
          });
          clearTimeout(timeoutId);

          if (response.ok) {
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            this.audioCache.set(cacheKey, objectUrl);
            return objectUrl;
          }
        } catch (err) {
          clearTimeout(timeoutId);
          // Continua para o próximo endpoint ou fallback
        }
      }

      return null;
    }

    // [PT-BR]: Camada 2: Fallback Web Speech API com segmentação por frases e pausas respiratórias de 140ms.
    // [EN-GB]: Tier 2: Web Speech API fallback with sentence segmentation and 140ms natural respiratory pauses.
    speakWebSpeechFallback(text, targetLang) {
      if (!('speechSynthesis' in window)) return;

      window.speechSynthesis.cancel();
      if (this.sentenceTimeout) clearTimeout(this.sentenceTimeout);

      // Divide em períodos mantendo a pontuação final (. ? ! ; :)
      const rawSentences = text.match(/[^.?!;:]+[.?!;:]+/g) || [text];
      const sentences = rawSentences.map(s => s.trim()).filter(s => s.length > 0);

      let idx = 0;
      const speakNextSentence = () => {
        if (!this.isVoiceEnabled || idx >= sentences.length) return;
        const sentence = sentences[idx];
        idx++;

        const utterance = new SpeechSynthesisUtterance(sentence);
        utterance.lang = targetLang;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        const voice = this.voicesByLang[targetLang] || this.currentVoice;
        if (voice) {
          utterance.voice = voice;
        }

        utterance.onend = () => {
          // [PT-BR]: Pausa respiratória natural de 140ms entre períodos
          // [EN-GB]: Natural 140ms respiratory pause between sentences
          this.sentenceTimeout = setTimeout(() => {
            speakNextSentence();
          }, 140);
        };

        utterance.onerror = (e) => {
          console.warn('[MozokAINarrator] Erro na oração Web Speech:', e);
          speakNextSentence();
        };

        window.speechSynthesis.speak(utterance);
      };

      speakNextSentence();
    }

    // [PT-BR]: Sintetiza e fala o texto em 3 camadas determinísticas com sincronização integral de legendas e VLibras.
    // [EN-GB]: Synthesises and speaks text across 3 deterministic tiers with full subtitles and VLibras synchronization.
    // [AI-CTX]: @llm-neuroscience: Speaks clinical, neurophysiological, and anatomical data with natural human prosody.
    async speak(text, langCode) {
      if (!text) return;
      const targetLang = langCode || this.currentLang || 'pt-BR';

      // Sincroniza legendas WCAG AAA e avatar VLibras
      this.syncSpeechWithVLibras(text);

      if (!this.isVoiceEnabled) return;

      this.stopAudioOnly();

      // Camada 1: Servidor Neural Local / Zorya / Edge-TTS HTTP
      try {
        const neuralUrl = await this.trySynthesizeNeural(text, targetLang);
        if (neuralUrl) {
          const audio = new Audio(neuralUrl);
          this.currentAudio = audio;
          audio.playbackRate = 1.0;
          await audio.play();
          return;
        }
      } catch (err) {
        console.warn('[MozokAINarrator] Falha no Tier 1 Neural, acionando Tier 2 Web Speech:', err);
      }

      // Camada 2: Fallback Web Speech API com vozes neurais e pausas de 140ms
      this.speakWebSpeechFallback(text, targetLang);
    }

    // [PT-BR]: Interrompe a reprodução de áudio sem apagar as legendas imediatamente.
    // [EN-GB]: Stops audio playback without clearing subtitles immediately.
    stopAudioOnly() {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (this.sentenceTimeout) {
        clearTimeout(this.sentenceTimeout);
        this.sentenceTimeout = null;
      }
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio = null;
      }
    }

    // [PT-BR]: Interrompe qualquer narração em andamento e fecha as legendas.
    // [EN-GB]: Cancels any ongoing speech narration and hides subtitles.
    stop() {
      this.stopAudioOnly();
      if (this.subtitleEl) {
        this.subtitleEl.style.opacity = '0';
        this.subtitleEl.style.display = 'none';
      }
      if (this.subtitleTimeout) clearTimeout(this.subtitleTimeout);
    }

    // [PT-BR]: Alterna ativação da voz sintética (ON/OFF).
    // [EN-GB]: Toggles synthetic voice state (ON/OFF).
    toggleVoice(forceState) {
      this.isVoiceEnabled = forceState !== undefined ? forceState : !this.isVoiceEnabled;
      if (!this.isVoiceEnabled) {
        this.stop();
      }
      return this.isVoiceEnabled;
    }
  }

  // [PT-BR]: Instanciação do singleton global no namespace window.
  // [EN-GB]: Instantiation of global singleton in the window namespace.
  // [AI-CTX]: @llm-invariant: window.MozokAINarrator available across all modules.
  window.MozokAINarrator = new MozokAINarrator();

})(window);
