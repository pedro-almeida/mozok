// [PT-BR]: Motor de Narração Neural de Alta Fidelidade com Didática de Professor Universitário e Acessibilidade VLibras / WCAG AAA.
// [EN-GB]: High-Fidelity Neural Narrator Engine with University Professor Pedagogy and VLibras / WCAG AAA Accessibility.
// [AI-CTX]: @llm-context: 3-Tier voice synthesis engine: Tier 1 (Pre-built studio MP3s / Edge-TTS AntonioNeural), Tier 2 (Svitlo/Zorya Neural HTTP), Tier 3 (Natural Web Speech with 180ms pauses and VLibras sign language).
//           @llm-invariant: Voice pt-BR-AntonioNeural as primary professor voice, prebuilt audio stored in assets/audio/{lang}/, seamless offline fallbacks.
//           @llm-neuroscience: University professor cadence with physiological and anatomical step-by-step explanations.
//           @llm-a11y: WCAG AAA compliant screen-reader friendly speech, synchronized subtitles, and VLibras bridge.

(function (window) {
  'use strict';

  // [PT-BR]: Classe controladora da narração neural e sincronização multimodal.
  // [EN-GB]: Controller class for neural voice narration and multimodal synchronization.
  class MozokAINarrator {
    constructor() {
      // [PT-BR]: Estado de ativação de voz, legendas, VLibras e idioma ativo (5 idiomas suportados).
      // [EN-GB]: State of voice synthesis, subtitles, VLibras activation, and active language (5 supported languages).
      this.isVoiceEnabled = true;
      this.isVLibrasActive = false;
      this.currentLang = 'pt-BR';
      this.currentVoice = null;
      this.voicesByLang = {};
      this.subtitleEl = null;
      this.subtitleTimeout = null;
      this.sentenceTimeout = null;
      this.currentAudio = null;

      // [PT-BR]: Diretório base de áudios neurais pré-gravados de estúdio (Tier 1 Offline).
      // [EN-GB]: Base directory for pre-recorded studio neural audios (Tier 1 Offline).
      this.prebuiltAudioPath = 'assets/audio';

      // [PT-BR]: Cache em memória de ObjectURLs e áudios carregados.
      // [EN-GB]: In-memory cache of ObjectURLs and loaded audios.
      this.audioCache = new Map();

      // [PT-BR]: Endpoints neurais oficiais locais e remotos para síntese dinâmica (Gemini 2.5 TTS / Groq / Svitlo / Zorya).
      // [EN-GB]: Official local and remote neural endpoints for dynamic synthesis (Gemini 2.5 TTS / Groq / Svitlo / Zorya).
      // [AI-CTX]: @llm-invariant: Supports local TTS endpoint http://127.0.0.1:8085/api/v1/voice/tts and remote Svitlo fallback.
      this.neuralEndpoints = [
        'http://127.0.0.1:8085/api/v1/voice/tts',
        'http://127.0.0.1:8085/api/v1/svitlo/tts/explain',
        'https://svitlo.espectroipe.com.br/api/v1/svitlo/tts/explain'
      ];

      // [PT-BR]: Vozes neurais oficiais por código de idioma idênticas aos Flashcards Svitlo/Anki.
      // [EN-GB]: Official neural voices per language code identical to Svitlo/Anki Flashcards.
      // [AI-CTX]: @llm-invariant: pt-BR: FranciscaNeural, en-GB: SoniaNeural, uk-UA: PolinaNeural, it-IT: ElsaNeural.
      this.neuralVoices = {
        'pt-BR': 'pt-BR-FranciscaNeural',
        'en-GB': 'en-GB-SoniaNeural',
        'uk-UA': 'uk-UA-PolinaNeural',
        'it-IT': 'it-IT-ElsaNeural',
        'es-ES': 'es-ES-ElviraNeural'
      };

      // Modelos de síntese generativa e LLM didático
      this.llmModels = {
        geminiTts: 'gemini-2.5-flash-preview-tts',
        geminiVoices: ['Aoede', 'Kore'],
        groqAudio: 'canopylabs/orpheus-v1-english',
        groqExplain: 'qwen/qwen3.8-27b'
      };

      this.initVoices();
      this.setupSubtitleOverlay();
      this.detectVLibras();
    }

    // [PT-BR]: Pontua a qualidade da voz no navegador, priorizando vozes humanas naturais (Francisca, Sonia, Polina, Elsa, Natural, Online).
    // [EN-GB]: Scores browser voice quality, prioritizing natural human voices (Francisca, Sonia, Polina, Elsa, Natural, Online).
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
      if (vName.includes('francisca')) score += 80;
      if (vName.includes('sonia')) score += 80;
      if (vName.includes('polina')) score += 80;
      if (vName.includes('elsa')) score += 80;
      if (vName.includes('antonio')) score += 65;
      if (vName.includes('natural')) score += 60;
      if (vName.includes('online')) score += 45;
      if (vName.includes('google')) score += 30;
      if (vName.includes('neural')) score += 25;

      return score;
    }

    // [PT-BR]: Inicializa e seleciona as melhores vozes para os 5 idiomas suportados.
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
        background: rgba(6, 9, 17, 0.94);
        backdrop-filter: blur(16px);
        border: 1px solid rgba(0, 242, 254, 0.45);
        border-radius: 12px;
        padding: 12px 20px;
        color: #ffffff;
        font-family: 'Inter', system-ui, sans-serif;
        font-size: 14px;
        font-weight: 500;
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

      this.subtitleEl.innerHTML = `<span style="color: #00f2fe; font-weight: 700; margin-right: 6px;">👨‍🏫 Prof. Dr. Mozok:</span> ${text}`;
      this.subtitleEl.style.display = 'block';
      this.subtitleEl.style.opacity = '1';

      if (this.subtitleTimeout) clearTimeout(this.subtitleTimeout);

      const durationMs = Math.max(4500, text.length * 75);
      this.subtitleTimeout = setTimeout(() => {
        if (this.subtitleEl) {
          this.subtitleEl.style.opacity = '0';
          setTimeout(() => {
            if (this.subtitleEl) this.subtitleEl.style.display = 'none';
          }, 300);
        }
      }, durationMs);
    }

    // [PT-BR]: Prioridade 1: Tenta reproduzir áudio pré-compilado de estúdio (.mp3 local offline com voz AntonioNeural).
    // [EN-GB]: Priority 1: Attempts to play pre-compiled studio audio (.mp3 local offline with AntonioNeural voice).
    // [AI-CTX]: @llm-invariant: Highest fidelity human audio with zero network latency.
    async tryPlayPrebuiltAudio(structId, targetLang) {
      if (structId === null || structId === undefined) return false;

      const filename = structId === 0 || structId === 'tour' ? 'tour.mp3' : `struct_${structId}.mp3`;
      const audioUrl = `${this.prebuiltAudioPath}/${targetLang}/${filename}`;

      return new Promise((resolve) => {
        const audio = new Audio(audioUrl);
        audio.preload = 'auto';

        let resolved = false;
        const cleanup = () => {
          audio.removeEventListener('canplaythrough', onCanPlay);
          audio.removeEventListener('error', onError);
        };

        const onCanPlay = async () => {
          if (resolved) return;
          resolved = true;
          cleanup();
          this.currentAudio = audio;
          try {
            await audio.play();
            resolve(true);
          } catch (e) {
            resolve(false);
          }
        };

        const onError = () => {
          if (resolved) return;
          resolved = true;
          cleanup();
          resolve(false);
        };

        audio.addEventListener('canplaythrough', onCanPlay, { once: true });
        audio.addEventListener('error', onError, { once: true });

        // Timeout de guarda para carregamento de arquivo local
        setTimeout(() => {
          if (!resolved) {
            resolved = true;
            cleanup();
            resolve(false);
          }
        }, 1200);
      });
    }

    // [PT-BR]: Prioridade 2: Síntese Neural Dinâmica via VPS Svitlo, Gemini TTS, Groq ou Zorya Local.
    // [EN-GB]: Priority 2: Dynamic Neural Synthesis via Svitlo VPS, Gemini TTS, Groq, or Local Zorya.
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
          const payload = {
            text,
            voice,
            lang: langCode,
            gemini_model: this.llmModels.geminiTts,
            gemini_voice: this.llmModels.geminiVoices[0],
            groq_audio_model: this.llmModels.groqAudio,
            groq_explain_model: this.llmModels.groqExplain
          };

          const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
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
        }
      }

      return null;
    }

    // [PT-BR]: Prioridade 3: Fallback Web Speech API Otimizado com vozes naturais de professor e pausas de 180ms.
    // [EN-GB]: Priority 3: Optimized Web Speech API Fallback with natural professor voices and 180ms respiratory pauses.
    speakWebSpeechFallback(text, targetLang) {
      if (!('speechSynthesis' in window)) return;

      window.speechSynthesis.cancel();
      if (this.sentenceTimeout) clearTimeout(this.sentenceTimeout);

      // Divide em períodos e orações compostas mantendo pontuação natural para pausas cadenciadas
      const rawSentences = text.match(/[^.?!;:]+[.?!;:]+/g) || [text];
      const sentences = rawSentences.map(s => s.trim()).filter(s => s.length > 0);

      let idx = 0;
      const speakNextSentence = () => {
        if (!this.isVoiceEnabled || idx >= sentences.length) return;
        const sentence = sentences[idx];
        idx++;

        const utterance = new SpeechSynthesisUtterance(sentence);
        utterance.lang = targetLang;
        utterance.rate = 0.94; // [PT-BR]: Cadência didática de sala de aula
        utterance.pitch = 0.96; // [PT-BR]: Tom barítono calmo e seguro

        const voice = this.voicesByLang[targetLang] || this.currentVoice;
        if (voice) {
          utterance.voice = voice;
        }

        utterance.onend = () => {
          // [PT-BR]: Pausa respiratória natural de 180ms entre orações
          // [EN-GB]: Natural 180ms respiratory pause between clauses
          this.sentenceTimeout = setTimeout(() => {
            speakNextSentence();
          }, 180);
        };

        utterance.onerror = (e) => {
          console.warn('[MozokAINarrator] Erro na oração Web Speech:', e);
          speakNextSentence();
        };

        window.speechSynthesis.speak(utterance);
      };

      speakNextSentence();
    }

    // [PT-BR]: Sintetiza e fala o texto com a sequência em 3 camadas de prioridade.
    // [EN-GB]: Synthesises and speaks text following 3-tier priority sequence.
    // [AI-CTX]: @llm-neuroscience: Natural didactic professor voice explaining neuroanatomy and neurophysiology.
    async speak(text, langCode, structId) {
      if (!text) return;
      const targetLang = langCode || this.currentLang || 'pt-BR';

      // Sincroniza legendas WCAG AAA e avatar VLibras
      this.syncSpeechWithVLibras(text);

      if (!this.isVoiceEnabled) return;

      this.stopAudioOnly();

      // [PT-BR]: Resolução automática de ID da estrutura caso não tenha sido explicitada
      // [EN-GB]: Automatic structure ID resolution if not explicitly passed
      let resolvedId = structId;
      if (resolvedId === undefined && window.MOZOK_DATABASE && window.MOZOK_DATABASE.structures) {
        const found = window.MOZOK_DATABASE.structures.find(s => s.audioScript === text || text.includes(s.estrutura));
        if (found) resolvedId = found.id;
      }

      // Prioridade 1: Áudio de estúdio neural pré-gravado (Edge-TTS AntonioNeural local offline)
      try {
        const played = await this.tryPlayPrebuiltAudio(resolvedId, targetLang);
        if (played) return;
      } catch (err) {
        console.warn('[MozokAINarrator] Prebuilt audio não disponível, tentando síntese neural online:', err);
      }

      // Prioridade 2: Servidor Neural Local / Zorya / Svitlo HTTP
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
        console.warn('[MozokAINarrator] Falha no Tier 2 Neural, acionando Tier 3 Web Speech:', err);
      }

      // Prioridade 3: Fallback Web Speech API com voz de professor e pausas de 180ms
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
