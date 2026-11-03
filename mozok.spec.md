# Especificação Técnica e Científica — MOZOK v7.2 (Spec-First)

## 1. Contratos de Interface e Endpoints Locais (`127.0.0.1:8090`)
- `GET /health`: Retorna `{"status":"ok","engine":"mozok-native","port":8090}`.
- `GET /api/gemini-tts?text=<url_encoded>&lang=<pt-BR|en-GB|es-ES|it-IT|uk-UA>&voice=<Aoede|Kore>`:
  - Lê `gemini_api_key` de `credentials.json` (ou variável `GEMINI_API_KEY`).
  - Sintetiza áudio PCM16 24kHz mono via `gemini-2.5-flash-preview-tts` na língua selecionada, encapsula em WAV RIFF (44 bytes header) e salva em `web/assets/audio_cache/{lang}_{hash}.wav`.
- `POST /api/gemini-translate`:
  - Recebe JSON `{"targetLang": "en-GB"|"es-ES"|"it-IT"|"uk-UA", "payload": {...}}`.
  - Traduz com terminologia neuroanatômica internacional (Terminologia Anatomica / FIPAT) via `gemini-2.5-flash` e retorna JSON estruturado.

## 2. Invariantes Científicas Auditadas
1. **Lateralidade Hemisférica MNI152:** Eixo $+Z$ = Anterior (Frontal), $-Z$ = Posterior (Occipital), $+Y$ = Superior (Dorsal), $+X$ = Hemisfério Esquerdo, $-X$ = Hemisfério Direito. Oclusão da ACM Esquerda (`ISCHEMIC_STROKE`) e áreas da linguagem (`BROCA_AREA_BA44_45`, `WERNICKE_AREA_BA22`, `ARCUATE_FASCICULUS_BA39_40`) situam-se em $X > 0$ (Hemisfério Esquerdo dominante).
2. **Histologia da Mielinização:** Oligodendrócitos no SNC (1 célula mieliniza até 50 internodos axonais; alvo da Esclerose Múltipla) vs. Células de Schwann no SNP (relação 1:1 por internodo, presença de neurilema e lâmina basal formando Bandas de Büngner; alvo de Guillain-Barré e Charcot-Marie-Tooth).
3. **Morfologia Dendrítica e Biofísica:** Lei de potência de Rall ($d_{\text{pai}}^{3/2} = \sum d_{\text{filho}}^{3/2} \Rightarrow r_{\text{filho}} \approx 0.63\,r_{\text{pai}}$) em árvores de 5ª ordem, potencial de repouso em $-70\text{ mV}$, limiar em $-55\text{ mV}$ no AIS ($Na_v1.6$), pico a $+40\text{ mV}$ e pós-hiperpolarização a $-84\text{ mV}$.

