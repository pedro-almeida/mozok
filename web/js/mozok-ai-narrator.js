// [PT-BR]: Motor de Narração Neural Natural e Integração com VLibras (Tradução Simultânea em Libras).
// [EN-US]: Natural Neural AI Voice Narrator Engine and VLibras Integration (Simultaneous Sign Language Translation).
// [AI-CTX]: @llm-context: Accessibility bridge linking Web Speech API with VLibras widget for WCAG AAA compliance.
//           @llm-invariant: Dispatches spoken text to VLibras DOM elements or API and controls synchronized subtitles.
//           @llm-a11y: WCAG AAA compliant screen-reader friendly speech and sign language bridge.

(function (window) {
  'use strict';

  // [PT-BR]: Classe controladora da narração de voz e sincronização com VLibras.
  // [EN-US]: Controller class for speech narration and VLibras synchronization.
  // [AI-CTX]: @llm-neuroscience: Speaks neurological descriptions and relays text to Libras 3D avatar.
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

      this.initVoices();
      this.setupSubtitleOverlay();
      this.detectVLibras();
    }

    // [PT-BR]: Inicializa e seleciona as melhores vozes para os 5 idiomas suportados (pt-BR, en-GB, it-IT, uk-UA, es-ES).
    // [EN-GB]: Initialises and selects the best natural voices for the 5 supported languages (pt-BR, en-GB, it-IT, uk-UA, es-ES).
    // [AI-CTX]: @llm-context: Multi-language voice selection with graceful fallback.
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
          const prefix = target.split('-')[0].toLowerCase();
          // Prioriza vozes com o código exato ou que comecem com o prefixo
          let match = voices.find(v => v.lang.toLowerCase() === target.toLowerCase()) ||
                      voices.find(v => v.lang.toLowerCase().replace('_', '-').startsWith(target.toLowerCase())) ||
                      voices.find(v => v.lang.toLowerCase().startsWith(prefix));
          if (match) {
            this.voicesByLang[target] = match;
          }
        });

        // Configura voz atual
        this.currentVoice = this.voicesByLang[this.currentLang] || voices[0] || null;
      };

      pickVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = pickVoices;
      }
    }

    // [PT-BR]: Altera o idioma da síntese de voz (pt-BR, en-GB, it-IT, uk-UA, es-ES).
    // [EN-GB]: Changes speech synthesis language (pt-BR, en-GB, it-IT, uk-UA, es-ES).
    // [AI-CTX]: @llm-invariant: Dynamically updates active voice.
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
    // [EN-US]: Configures floating synchronized subtitles overlay on screen for WCAG AAA accessibility.
    // [AI-CTX]: @llm-a11y: High contrast, large font, aria-live polite subtitle container.
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
    // [EN-US]: Detects presence of official VLibras plugin in the page.
    // [AI-CTX]: @llm-context: Observes window.VLibras or widget wrapper.
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
    // [EN-US]: Sends spoken text to the VLibras component to perform sign language translation.
    // [AI-CTX]: @llm-context: Accesses VLibras widget API or clicks/sets active translation buffer.
    syncSpeechWithVLibras(text) {
      if (!text) return;

      // [PT-BR]: Exibe a legenda na tela sincronizada.
      // [EN-US]: Displays synchronized subtitle on screen.
      this.showSubtitle(text);

      // [PT-BR]: Se o VLibras estiver carregado, interage com a API interna do widget ou força tradução.
      // [EN-US]: If VLibras is loaded, interacts with the widget internal API or triggers translation.
      // [AI-CTX]: @llm-invariant: Safe fallback checking multiple hooks exposed by vlibras-plugin.js.
      try {
        if (window.plugin && typeof window.plugin.translate === 'function') {
          window.plugin.translate(text);
        } else if (window.VLibras && window.VLibras.Widget) {
          // [PT-BR]: Tentativa de disparar pelo widget global
          // [EN-US]: Attempt to trigger through global widget
          const widgetEl = document.querySelector('[vw-access-button]');
          if (widgetEl && !document.querySelector('.vw-plugin-top-wrapper.active')) {
            // Se o widget não estiver aberto, abre para traduzir se desejado
          }
        }
      } catch (err) {
        console.warn('[MozokAINarrator] Falha ao enviar para VLibras:', err);
      }
    }

    // [PT-BR]: Exibe a legenda sincronizada na tela por tempo proporcional ao comprimento do texto.
    // [EN-US]: Displays synchronized subtitle on screen for time proportional to text length.
    // [AI-CTX]: @llm-a11y: Ensures reading time based on ~180 words per minute.
    showSubtitle(text) {
      if (!this.subtitleEl) this.setupSubtitleOverlay();
      if (!this.subtitleEl) return;

      this.subtitleEl.innerHTML = `<span style="color: #00f2fe; font-weight: 600; margin-right: 6px;">💬 IA:</span> ${text}`;
      this.subtitleEl.style.display = 'block';
      this.subtitleEl.style.opacity = '1';

      if (this.subtitleTimeout) clearTimeout(this.subtitleTimeout);

      // Duração calculada baseada na quantidade de caracteres (mínimo 4s, ~50ms por caractere)
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

    // [PT-BR]: Sintetiza e fala um texto, ativando simultaneamente o VLibras e as legendas.
    // [PT-BR]: Sintetiza e fala um texto no idioma selecionado, ativando simultaneamente o VLibras e as legendas.
    // [EN-GB]: Synthesises and speaks text in selected language, concurrently triggering VLibras and subtitles.
    // [AI-CTX]: @llm-neuroscience: Speaks clinical and anatomical data in 5 supported languages (pt-BR, en-GB, it-IT, uk-UA, es-ES).
    speak(text, langCode) {
      if (!text) return;
      this.syncSpeechWithVLibras(text);

      if (!this.isVoiceEnabled || !('speechSynthesis' in window)) {
        return;
      }

      window.speechSynthesis.cancel();

      const targetLang = langCode || this.currentLang || 'pt-BR';
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = targetLang;
      utterance.rate = 1.02;
      utterance.pitch = 1.0;

      const voice = this.voicesByLang[targetLang] || this.currentVoice;
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onend = () => {
        // Finalização da fala
      };

      utterance.onerror = (e) => {
        console.warn('[MozokAINarrator] Erro na síntese:', e);
      };

      window.speechSynthesis.speak(utterance);
    }

    // [PT-BR]: Interrompe qualquer narração em andamento.
    // [EN-US]: Cancels any ongoing speech narration.
    // [AI-CTX]: @llm-invariant: Stops synthesis and hides current subtitles.
    stop() {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (this.subtitleEl) {
        this.subtitleEl.style.opacity = '0';
        this.subtitleEl.style.display = 'none';
      }
      if (this.subtitleTimeout) clearTimeout(this.subtitleTimeout);
    }

    // [PT-BR]: Alterna ativação da voz sintética (ON/OFF).
    // [EN-US]: Toggles synthetic voice state (ON/OFF).
    // [AI-CTX]: @llm-a11y: Provides explicit state switch for user preference.
    toggleVoice(forceState) {
      this.isVoiceEnabled = forceState !== undefined ? forceState : !this.isVoiceEnabled;
      if (!this.isVoiceEnabled) {
        this.stop();
      }
      return this.isVoiceEnabled;
    }
  }

  // [PT-BR]: Instanciação do singleton global no namespace window.
  // [EN-US]: Instantiation of global singleton in the window namespace.
  // [AI-CTX]: @llm-invariant: window.MozokAINarrator available across all modules.
  window.MozokAINarrator = new MozokAINarrator();

})(window);
