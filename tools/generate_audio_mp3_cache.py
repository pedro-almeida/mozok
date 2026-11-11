#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MOZOK v8.0 — Gerador em Lote de Áudios MP3 da Voz Neural Gemini TTS (Aoede)
com Rotação Inteligente de Chaves (19 chaves) e Modelos (REST TTS + Live WebSocket BidiGenerateContent).
Salva em: web/assets/audio/<lang>/<ID>.mp3 para os 5 idiomas (pt-BR, en-GB, es-ES, it-IT, uk-UA).
"""

import asyncio
import base64
import json
import subprocess
import sys
import threading
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
import websockets

sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from gemini_tts_bridge import LANGUAGE_NAMES, REST_TTS_MODELS, LIVE_WS_MODEL, load_gemini_api_keys

I18N_CACHE_PATH = ROOT / "web" / "assets" / "i18n_cache.json"
AUDIO_OUT_DIR = ROOT / "web" / "assets" / "audio"

CLINICAL_PREFIX = {
    "pt-BR": "Correlação clínica: ",
    "en-GB": "Clinical correlation: ",
    "es-ES": "Correlación clínica: ",
    "it-IT": "Correlazione clinica: ",
    "uk-UA": "Клінічна кореляція: ",
}

ABOUT_NARRATION = {
    "pt-BR": "MOZOK, do ucraniano мозок, que significa cérebro. Atlas neuroanatômico tridimensional multiescala e simulador neurofisiológico e clínico aberto do Sistema Nervoso Central e Periférico. Fundamentado na ética deontológica de Immanuel Kant, o conhecimento sobre o cérebro humano pertence inalienavelmente a toda a humanidade. Homenagem imortal à ciência ucraniana de Volodymyr Bets, descobridor das células piramidais gigantes da camada cinco em Kyiv, Ilya Mechnikov, Mykola Amosov e Oleksandr Bogomolets. Slava Ukraini! Heroiam Slava!",
    "en-GB": "MOZOK, from the Ukrainian word мозок, meaning brain. An open-source multiscale three-dimensional neuroanatomical atlas and clinical neurophysiological simulator of the Central and Peripheral Nervous Systems. Grounded in Immanuel Kant’s deontological ethics, knowledge of the human brain belongs inalienably to all humanity. Immortal tribute to Ukrainian science: Volodymyr Bets, discoverer of the Layer five giant pyramidal cells in Kyiv, Ilya Mechnikov, Mykola Amosov, and Oleksandr Bogomolets. Slava Ukraini! Heroiam Slava!",
    "es-ES": "MOZOK, del ucraniano мозок, que significa cerebro. Atlas neuroanatómico tridimensional multiescala y simulador neurofisiológico y clínico abierto del Sistema Nervioso Central y Periférico. Fundamentado en la ética deontológica de Immanuel Kant, el conocimiento sobre el cerebro humano pertenece inalienablemente a toda la humanidad. Homenaje inmortal a la ciencia ucraniana de Volodymyr Bets, descubridor de las células piramidales gigantes de la capa cinco en Kyiv, Ilya Mechnikov, Mykola Amosov y Oleksandr Bogomolets. Slava Ukraini! Heroiam Slava!",
    "it-IT": "MOZOK, dall’ucraino мозок, che significa cervello. Atlante neuroanatomico tridimensionale multiscala e simulatore neurofisiologico e clinico aperto del Sistema Nervoso Centrale e Periferico. Fondato sull’etica deontologica di Immanuel Kant, il sapere sul cervello umano appartiene inalienabilmente a tutta l’umanità. Omaggio immortale alla scienza ucraina di Volodymyr Bets, scopritore delle cellule piramidali giganti dello strato quinto a Kyiv, Ilya Mechnikov, Mykola Amosov e Oleksandr Bogomolets. Slava Ukraini! Heroiam Slava!",
    "uk-UA": "МОЗОК — багатомасштабний тривимірний нейроанатомічний атлас і нейрофізіологічний симулятор центральної та периферичної нервової системи з відкритим вихідним кодом. Ґрунтуючись на деонтологічній етиці Іммануїла Канта, знання про людський мозок невід’ємно належать усьому людству. Безсмертна шана українській науці: Володимиру Бецу, першовідкривачу гігантських пірамідних клітин п’ятого шару кори в Києві, Іллі Мечникову, Миколі Амосову та Олександру Богомольцю. Слава Україні! Героям слава!",
}

_lock = threading.Lock()
_rest_slot_idx = 0
_ws_key_idx = 0
_bad_keys = set()
_exhausted_rest_slots = set()


def pcm16_to_mp3_48k(pcm_bytes: bytes, sample_rate: int = 24000) -> bytes:
    cmd = [
        "ffmpeg",
        "-hide_banner",
        "-loglevel",
        "error",
        "-f",
        "s16le",
        "-ar",
        str(sample_rate),
        "-ac",
        "1",
        "-i",
        "pipe:0",
        "-codec:a",
        "libmp3lame",
        "-b:a",
        "48k",
        "-f",
        "mp3",
        "pipe:1",
    ]
    res = subprocess.run(cmd, input=pcm_bytes, capture_output=True, timeout=25)
    if res.returncode == 0 and len(res.stdout) > 200:
        return res.stdout
    raise RuntimeError(f"ffmpeg error: {res.stderr.decode('utf-8', errors='ignore')}")


async def _ws_live_tts(spoken_text: str, lang: str, api_key: str) -> bytes:
    lang_desc = LANGUAGE_NAMES.get(lang, lang)
    ws_url = f"wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key={api_key}"
    async with websockets.connect(
        ws_url, open_timeout=10, close_timeout=4, max_size=16 * 1024 * 1024
    ) as ws:
        setup_msg = {
            "setup": {
                "model": LIVE_WS_MODEL,
                "generationConfig": {
                    "responseModalities": ["AUDIO"],
                    "speechConfig": {
                        "voiceConfig": {
                            "prebuiltVoiceConfig": {"voiceName": "Aoede"}
                        }
                    },
                },
                "systemInstruction": {
                    "parts": [
                        {
                            "text": (
                                f"You are a professional university neuroanatomy narrator speaking natively in {lang_desc} ({lang}). "
                                "Read the exact text provided by the user verbatim, clearly and naturally, without adding any introductory words, greetings, or commentary."
                            )
                        }
                    ]
                },
            }
        }
        await ws.send(json.dumps(setup_msg))
        await asyncio.wait_for(ws.recv(), timeout=10)

        client_msg = {
            "clientContent": {
                "turns": [
                    {
                        "role": "user",
                        "parts": [{"text": spoken_text}],
                    }
                ],
                "turnComplete": True,
            }
        }
        await ws.send(json.dumps(client_msg))
        pcm_chunks = []
        while True:
            raw = await asyncio.wait_for(ws.recv(), timeout=45)
            msg = json.loads(raw)
            sc = msg.get("serverContent", {})
            mt = sc.get("modelTurn", {})
            for p in mt.get("parts", []):
                inl = p.get("inlineData") or p.get("inline_data")
                if inl and inl.get("data"):
                    pcm_chunks.append(base64.b64decode(inl["data"]))
            if sc.get("turnComplete"):
                break
        return b"".join(pcm_chunks)


def synthesize_one_mp3(lang: str, item_id: str, spoken_text: str, all_keys: list) -> str:
    global _rest_slot_idx, _ws_key_idx
    out_file = AUDIO_OUT_DIR / lang / f"{item_id}.mp3"
    if out_file.exists() and out_file.stat().st_size > 1500:
        return "CACHED"

    lang_desc = LANGUAGE_NAMES.get(lang, lang)
    tts_prompt = spoken_text.strip()

    all_rest_slots = [(k, m) for m in REST_TTS_MODELS for k in all_keys]

    # 1. Try available REST (key, model) slots first (up to 6 quick tries before switching to Live WS)
    for _ in range(6):
        with _lock:
            avail = [s for s in all_rest_slots if s[0] not in _bad_keys and s not in _exhausted_rest_slots]
            if not avail:
                break
            slot = avail[_rest_slot_idx % len(avail)]
            _rest_slot_idx += 1
        key_candidate, model_name = slot
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={key_candidate}"
            req_body = {
                "systemInstruction": {"parts": [{"text": f"Read the user text verbatim in {lang_desc} ({lang}). Do not add any introductory words or meta-commentary."}]},
                "contents": [{"parts": [{"text": tts_prompt}]}],
                "generationConfig": {
                    "responseModalities": ["AUDIO"],
                    "speechConfig": {
                        "voiceConfig": {
                            "prebuiltVoiceConfig": {"voiceName": "Aoede"}
                        }
                    },
                },
            }
            req = urllib.request.Request(
                url,
                data=json.dumps(req_body).encode("utf-8"),
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=16) as resp:
                resp_data = json.loads(resp.read().decode("utf-8"))
                parts = resp_data["candidates"][0]["content"]["parts"]
                for part in parts:
                    inline = part.get("inlineData") or part.get("inline_data")
                    if inline and inline.get("data"):
                        raw_audio = base64.b64decode(inline["data"])
                        if raw_audio[:4] == b"RIFF":
                            raw_audio = raw_audio[44:]
                        if len(raw_audio) > 800:
                            mp3_bytes = pcm16_to_mp3_48k(raw_audio, 24000)
                            out_file.parent.mkdir(parents=True, exist_ok=True)
                            out_file.write_bytes(mp3_bytes)
                            return f"REST:{model_name}"
        except urllib.error.HTTPError as e:
            with _lock:
                if e.code in (401, 403):
                    _bad_keys.add(key_candidate)
                elif e.code == 429:
                    _exhausted_rest_slots.add(slot)
            continue
        except Exception:
            continue

    # 2. Gemini Live WebSocket BidiGenerateContent rotating across keys
    for _ in range(len(all_keys)):
        with _lock:
            valid_keys = [k for k in all_keys if k not in _bad_keys]
            if not valid_keys:
                break
            key_candidate = valid_keys[_ws_key_idx % len(valid_keys)]
            _ws_key_idx += 1
        try:
            pcm_bytes = asyncio.run(_ws_live_tts(spoken_text, lang, key_candidate))
            if len(pcm_bytes) > 800:
                mp3_bytes = pcm16_to_mp3_48k(pcm_bytes, 24000)
                out_file.parent.mkdir(parents=True, exist_ok=True)
                out_file.write_bytes(mp3_bytes)
                return "LIVE_WS:Aoede"
        except Exception as e:
            err_s = str(e)
            if "401" in err_s or "403" in err_s or "API key not valid" in err_s:
                with _lock:
                    _bad_keys.add(key_candidate)
            continue

    return "FAILED"


def main():
    all_keys = load_gemini_api_keys()
    print(f"[MOZOK TTS] Loaded {len(all_keys)} Gemini API keys for rotation.")
    i18n_data = json.loads(I18N_CACHE_PATH.read_text(encoding="utf-8"))

    tasks = []
    for lang in ["pt-BR", "en-GB", "es-ES", "it-IT", "uk-UA"]:
        lang_items = i18n_data.get(lang, {})
        prefix = CLINICAL_PREFIX.get(lang, "Clinical correlation: ")
        for item_id, meta in lang_items.items():
            spoken = f"{meta['name']}. {meta['summary']} {prefix}{meta['clinical']}"
            tasks.append((lang, item_id, spoken))
        tasks.append((lang, "ABOUT_MOZOK", ABOUT_NARRATION[lang]))

    total = len(tasks)
    print(f"[MOZOK TTS] Total target MP3 files across 5 languages: {total}")

    t0 = time.time()
    done_count = 0
    stats = {}

    with ThreadPoolExecutor(max_workers=14) as pool:
        future_map = {
            pool.submit(synthesize_one_mp3, lang, item_id, spoken, all_keys): (lang, item_id)
            for (lang, item_id, spoken) in tasks
        }
        for fut in as_completed(future_map):
            lang, item_id = future_map[fut]
            done_count += 1
            try:
                res = fut.result()
            except Exception as e:
                res = f"ERR:{e}"
            stats[res] = stats.get(res, 0) + 1
            if done_count % 15 == 0 or done_count == total or res == "FAILED":
                elapsed = time.time() - t0
                print(
                    f"[{done_count}/{total}] ({elapsed:.1f}s) Last: {lang}/{item_id}.mp3 -> {res} | Stats: {stats}",
                    flush=True,
                )

    print(f"\n[MOZOK TTS] Finished in {time.time() - t0:.1f}s. Final summary: {stats}")


if __name__ == "__main__":
    main()

