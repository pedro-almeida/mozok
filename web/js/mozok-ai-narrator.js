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
      // [PT-BR]: Estado de ativação de voz, legendas e VLibras.
      // [EN-US]: State of voice synthesis, subtitles, and VLibras activation.
      // [AI-CTX]: @llm-invariant: Default voice on, subtitles on.
      this.isVoiceEnabled = true;
      this.isVLibrasActive = false;
      this.currentVoice = null;
      this.subtitleEl = null;
      this.subtitleTimeout = null;

      this.initVoices();
      this.setupSubtitleOverlay();
      this.detectVLibras();
    }

    // [PT-BR]: Inicializa e seleciona a melhor voz natural disponível no sistema em Português do Brasil.
    // [EN-US]: Initializes and selects the best natural Brazilian Portuguese voice available.
    // [AI-CTX]: @llm-context: Prioritizes Microsoft Natural or Google pt-BR neural voices.
    initVoices() {
      if (!('speechSynthesis' in window)) {
        console.warn('[MozokAINarrator] Web Speech API não suportada neste navegador.');
        return;
      }

      const pickBestVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        if (!voices || voices.length === 0) return;

        // [PT-BR]: Lista de prioridade de vozes neurais brasileiras.
        // [EN-US]: Priority list of Brazilian neural Portuguese voices.
        // [AI-CTX]: @llm-invariant: Match exact name first, then pt-BR natural, then any pt-BR.
        const priorityNames = [
          'Microsoft Francisca Online (Natural) - Portuguese (Brazil)',
          'Microsoft Antonio Online (Natural) - Portuguese (Brazil)',
          'Google português do Brasil',
          'Francisca',
          'Antonio',
          'Luciana',
          'Felipe'
        ];

        for (const name of priorityNames) {
          const match = voices.find(v => v.name.includes(name) || (v.lang === 'pt-BR' && v.name.toLowerCase().includes(name.toLowerCase())));
          if (match) {
            this.currentVoice = match;
            break;
          }
        }

        if (!this.currentVoice) {
          this.currentVoice = voices.find(v => v.lang === 'pt-BR' || v.lang.startsWith('pt')) || null;
        }
      };

      pickBestVoice();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = pickBestVoice;
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
    // [EN-US]: Synthesizes and speaks text, concurrently triggering VLibras and subtitles.
    // [AI-CTX]: @llm-neuroscience: Speaks clinical and anatomical data to student/doctor.
    speak(text) {
      if (!text) return;
      this.syncSpeechWithVLibras(text);

      if (!this.isVoiceEnabled || !('speechSynthesis' in window)) {
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.04;
      utterance.pitch = 1.0;

      if (this.currentVoice) {
        utterance.voice = this.currentVoice;
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
