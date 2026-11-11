#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MOZOK v8.0 — Bridge Unificado de Tradução e Síntese Vocal Neural Gemini TTS (5 Idiomas: pt-BR, en-GB, es-ES, it-IT, uk-UA)
- Camada 1A: Google Gemini REST TTS com Rotação Persistente de Chaves e Modelos
  (gemini-2.5-flash-preview-tts, gemini-3.8-flash-tts, gemini-3.8-flash-lite-tts, gemini-3.1-flash-tts-preview — voz Aoede)
- Camada 1B: Google Gemini Live WebSocket BidiGenerateContent (models/gemini-2.5-flash-native-audio-preview-12-2025 — voz Aoede)
- Conversão nativa PCM16 24kHz -> MP3 (libmp3lame 64kbps via ffmpeg) e WAV RIFF.
"""

import os
import sys
import json
import struct
import base64
import asyncio
import argparse
import subprocess
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

LANGUAGE_NAMES = {
    "pt-BR": "Português do Brasil",
    "en-GB": "British English",
    "es-ES": "Español",
    "it-IT": "Italiano",
    "uk-UA": "Українська мова (Ukrainian)",
}

LANG_SHORT = {
    "pt-BR": "pt",
    "en-GB": "en",
    "es-ES": "es",
    "it-IT": "it",
    "uk-UA": "uk",
}

NEURAL_VOICES = {
    "pt-BR": "pt-BR-FranciscaNeural",
    "en-GB": "en-GB-SoniaNeural",
    "es-ES": "es-ES-ElviraNeural",
    "it-IT": "it-IT-ElsaNeural",
    "uk-UA": "uk-UA-PolinaNeural",
}

REST_TTS_MODELS = [
    "gemini-2.5-flash-preview-tts",
    "gemini-3.8-flash-tts",
    "gemini-3.8-flash-lite-tts",
    "gemini-3.1-flash-tts-preview",
]

LIVE_WS_MODEL = "models/gemini-2.5-flash-native-audio-preview-12-2025"

_gemini_key_index = 0
_bad_keys = set()


def load_gemini_api_keys() -> list:
    keys = []
    for env_name in ("GEMINI_API_KEY", "GOOGLE_API_KEY"):
        val = os.getenv(env_name)
        if val and val.strip():
            keys.append(val.strip())

    exe_dir = Path(__file__).resolve().parent.parent
    candidates = [
        exe_dir / "credentials.json",
        exe_dir.parent / "credentials.json",
        Path("credentials.json"),
        Path("C:/mriya/mriya/credentials.json"),
        Path("C:/mozok/credentials.json"),
        Path("C:/zorya/credentials.json"),
        Path("C:/zorya/zorya.toml"),
        Path("C:/var/www/mcp-server/credentials/credentials.json"),
        Path("/var/www/mcp-server/credentials/credentials.json"),
        Path(os.path.expanduser("~/.config/svitlo/credentials.json")),
        exe_dir / ".env",
        exe_dir.parent / ".env",
    ]

    for path in candidates:
        if path.exists() and path.is_file():
            try:
                raw = path.read_text(encoding="utf-8", errors="ignore")
                if path.suffix.lower() == ".json":
                    data = json.loads(raw)
                    if isinstance(data.get("gemini"), dict):
                        for k, v in data["gemini"].items():
                            if isinstance(v, str) and (
                                v.startswith("AIza") or v.startswith("AQ.")
                            ):
                                keys.append(v.strip())
                    for k in (
                        "gemini_api_key",
                        "GEMINI_API_KEY",
                        "api_key",
                        "google_api_key",
                    ):
                        if data.get(k) and (
                            str(data[k]).strip().startswith("AIza")
                            or str(data[k]).strip().startswith("AQ.")
                        ):
                            keys.append(str(data[k]).strip())
                    for sec in ("jobs", "svitanok", "svitlo", "aggressor"):
                        if isinstance(data.get(sec), dict):
                            val = data[sec].get("gemini_key") or data[sec].get(
                                "api_key"
                            )
                            if val and (
                                str(val).strip().startswith("AIza")
                                or str(val).strip().startswith("AQ.")
                            ):
                                keys.append(str(val).strip())
                else:
                    for line in raw.splitlines():
                        if (
                            "gemini" in line.lower()
                            or "google_api_key" in line.lower()
                        ) and "=" in line:
                            v = line.split("=", 1)[1].strip().strip("\"'")
                            if v.startswith("AIza") or v.startswith("AQ."):
                                keys.append(v)
            except Exception:
                continue

    return [k for k in dict.fromkeys(keys) if k not in _bad_keys]


def _rotation_state_path() -> Path:
    exe_dir = Path(__file__).resolve().parent.parent
    p = exe_dir / "web" / "assets" / "audio_cache" / ".key_rotation_state.json"
    p.parent.mkdir(parents=True, exist_ok=True)
    return p


def _get_and_advance_slot(total_slots: int) -> int:
    if total_slots <= 0:
        return 0
    st_path = _rotation_state_path()
    slot = 0
    try:
        if st_path.exists():
            obj = json.loads(st_path.read_text(encoding="utf-8"))
            slot = int(obj.get("slot", 0)) % total_slots
    except Exception:
        slot = 0
    try:
        st_path.write_text(
            json.dumps({"slot": (slot + 1) % total_slots}), encoding="utf-8"
        )
    except Exception:
        pass
    return slot


def load_gemini_api_key() -> str:
    global _gemini_key_index
    keys = load_gemini_api_keys()
    if not keys:
        return ""
    slot = _get_and_advance_slot(len(keys))
    return keys[slot % len(keys)]


def gtx_translate_text(text: str, target_lang: str) -> str:
    if not text or not text.strip() or target_lang == "pt-BR":
        return text
    tl = LANG_SHORT.get(target_lang, target_lang.split("-")[0].lower())
    try:
        url = (
            "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto"
            f"&tl={urllib.parse.quote(tl)}&dt=t&q={urllib.parse.quote(text)}"
        )
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=12) as resp:
            arr = json.loads(resp.read().decode("utf-8"))
            if isinstance(arr, list) and arr and isinstance(arr[0], list):
                translated = "".join(seg[0] for seg in arr[0] if seg and seg[0])
                if translated.strip():
                    return translated.strip()
    except Exception:
        pass
    return text


def translate_payload(payload_dict: dict, target_lang: str, api_key: str) -> dict:
    if target_lang == "pt-BR" or not isinstance(payload_dict, dict):
        return payload_dict

    all_keys = load_gemini_api_keys()
    if api_key and api_key not in all_keys:
        all_keys.insert(0, api_key)

    lang_desc = LANGUAGE_NAMES.get(target_lang, target_lang)
    prompt = (
        f"Translate all values of the following neuroanatomy JSON object into {lang_desc} ({target_lang}) "
        f"with medical precision. Keep the exact same JSON keys. Keep 'latin' in Latin. Return ONLY valid JSON:\n\n"
        f"{json.dumps(payload_dict, ensure_ascii=False)}"
    )
    req_body = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.1,
            "responseMimeType": "application/json",
        },
    }

    start_idx = _get_and_advance_slot(max(1, len(all_keys)))
    for offset in range(min(4, len(all_keys))):
        k = all_keys[(start_idx + offset) % len(all_keys)]
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={k}"
            req = urllib.request.Request(
                url,
                data=json.dumps(req_body).encode("utf-8"),
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=15) as resp:
                resp_data = json.loads(resp.read().decode("utf-8"))
                text_out = resp_data["candidates"][0]["content"]["parts"][0]["text"]
                parsed = json.loads(text_out)
                if isinstance(parsed, dict) and (
                    parsed.get("name") or parsed.get("summary") or parsed.get("items")
                ):
                    return parsed
        except Exception:
            continue

    result = dict(payload_dict)
    for key in ("name", "badge", "summary", "clinical", "note", "stage"):
        if isinstance(result.get(key), str) and result[key]:
            result[key] = gtx_translate_text(result[key], target_lang)

    if isinstance(result.get("functions"), list) and result["functions"]:
        joined = " ||| ".join(str(x) for x in result["functions"])
        tr_joined = gtx_translate_text(joined, target_lang)
        parts = [p.strip() for p in tr_joined.split("|||") if p.strip()]
        if len(parts) == len(result["functions"]):
            result["functions"] = parts
        else:
            result["functions"] = [
                gtx_translate_text(str(x), target_lang) for x in result["functions"]
            ]

    if (
        isinstance(result.get("neurotransmitters"), list)
        and result["neurotransmitters"]
    ):
        joined_nt = " ||| ".join(str(x) for x in result["neurotransmitters"])
        tr_nt = gtx_translate_text(joined_nt, target_lang)
        parts_nt = [p.strip() for p in tr_nt.split("|||") if p.strip()]
        if len(parts_nt) == len(result["neurotransmitters"]):
            result["neurotransmitters"] = parts_nt

    if isinstance(result.get("items"), dict):
        keys_list = list(result["items"].keys())
        lines = []
        for k in keys_list:
            v = result["items"][k]
            if isinstance(v, dict):
                name = v.get("name", "")
                badge = v.get("badge", "")
                lines.append(f"{name} ||| {badge}")
            elif isinstance(v, str):
                lines.append(v)
            else:
                lines.append("")
        batch_str = "\n".join(lines)
        try:
            tr_batch = gtx_translate_text(batch_str, target_lang).splitlines()
        except Exception:
            tr_batch = []
        out_items = {}
        for idx, k in enumerate(keys_list):
            orig_v = result["items"][k]
            if idx < len(tr_batch) and tr_batch[idx].strip():
                tr_line = tr_batch[idx].strip()
                if "|||" in tr_line and isinstance(orig_v, dict):
                    parts = tr_line.split("|||")
                    out_items[k] = {
                        "name": parts[0].strip(),
                        "badge": parts[1].strip()
                        if len(parts) > 1
                        else orig_v.get("badge", ""),
                    }
                elif isinstance(orig_v, dict):
                    out_items[k] = {
                        "name": tr_line,
                        "badge": orig_v.get("badge", ""),
                    }
                else:
                    out_items[k] = tr_line
            else:
                out_items[k] = orig_v
        result["items"] = out_items

    return result


def pcm16_to_wav_bytes(
    pcm_bytes: bytes,
    sample_rate: int = 24000,
    channels: int = 1,
    bits_per_sample: int = 16,
) -> bytes:
    byte_rate = sample_rate * channels * (bits_per_sample // 8)
    block_align = channels * (bits_per_sample // 8)
    data_size = len(pcm_bytes)
    header = struct.pack(
        "<4sI4s4sIHHIIHH4sI",
        b"RIFF",
        36 + data_size,
        b"WAVE",
        b"fmt ",
        16,
        1,
        channels,
        sample_rate,
        byte_rate,
        block_align,
        bits_per_sample,
        b"data",
        data_size,
    )
    return header + pcm_bytes


def pcm16_to_mp3_bytes(pcm_bytes: bytes, sample_rate: int = 24000) -> bytes:
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
        "64k",
        "-f",
        "mp3",
        "pipe:1",
    ]
    res = subprocess.run(cmd, input=pcm_bytes, capture_output=True, timeout=25)
    if res.returncode == 0 and len(res.stdout) > 200:
        return res.stdout
    raise RuntimeError(
        f"ffmpeg failed: {res.stderr.decode('utf-8', errors='ignore')}"
    )


async def _live_ws_tts_pcm16(
    spoken_text: str, lang: str, voice: str, api_key: str
) -> bytes:
    import websockets

    lang_desc = LANGUAGE_NAMES.get(lang, lang)
    ws_url = f"wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key={api_key}"
    async with websockets.connect(
        ws_url, open_timeout=10, close_timeout=5, max_size=16 * 1024 * 1024
    ) as ws:
        setup_msg = {
            "setup": {
                "model": LIVE_WS_MODEL,
                "generationConfig": {
                    "responseModalities": ["AUDIO"],
                    "speechConfig": {
                        "voiceConfig": {
                            "prebuiltVoiceConfig": {"voiceName": voice or "Aoede"}
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


def synthesize_gemini_pcm16(
    spoken_text: str, lang: str, voice: str = "Aoede", all_keys: list = None
) -> bytes:
    if not all_keys:
        all_keys = load_gemini_api_keys()
    if not all_keys:
        return b""

    lang_desc = LANGUAGE_NAMES.get(lang, lang)
    tts_prompt = spoken_text.strip()

    slots = [(k, m) for m in REST_TTS_MODELS for k in all_keys if k not in _bad_keys]
    start_slot = _get_and_advance_slot(len(slots))

    # 1. Tenta REST TTS rotacionando entre todas as chaves e modelos
    for offset in range(len(slots)):
        key_candidate, model_name = slots[(start_slot + offset) % len(slots)]
        if key_candidate in _bad_keys:
            continue
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={key_candidate}"
            req_body = {
                "systemInstruction": {"parts": [{"text": f"Read the user text verbatim in {lang_desc} ({lang}). Do not add any introductory words or meta-commentary."}]},
                "contents": [{"parts": [{"text": tts_prompt}]}],
                "generationConfig": {
                    "responseModalities": ["AUDIO"],
                    "speechConfig": {
                        "voiceConfig": {
                            "prebuiltVoiceConfig": {"voiceName": voice or "Aoede"}
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
                        if len(raw_audio) > 400:
                            return raw_audio
        except urllib.error.HTTPError as e:
            if e.code in (401, 403):
                _bad_keys.add(key_candidate)
            continue
        except Exception:
            continue

    # 2. Fallback Gemini Live API WebSocket (BidiGenerateContent — ilimitado nas chaves ativas)
    ws_keys = [k for k in all_keys if k not in _bad_keys]
    ws_start = _get_and_advance_slot(len(ws_keys))
    for offset in range(len(ws_keys)):
        key_candidate = ws_keys[(ws_start + offset) % len(ws_keys)]
        try:
            pcm_bytes = asyncio.run(
                _live_ws_tts_pcm16(spoken_text, lang, voice, key_candidate)
            )
            if len(pcm_bytes) > 400:
                return pcm_bytes
        except Exception:
            continue

    return b""


def synthesize_speech(
    text: str, lang: str, voice: str, output_path: Path, api_key: str = ""
) -> bool:
    if not text or not text.strip():
        return False

    spoken_text = text.strip()
    all_keys = load_gemini_api_keys()
    if api_key and api_key not in all_keys:
        all_keys.insert(0, api_key)

    pcm_bytes = synthesize_gemini_pcm16(spoken_text, lang, voice, all_keys)
    if len(pcm_bytes) > 400:
        output_path.parent.mkdir(parents=True, exist_ok=True)
        if output_path.suffix.lower() == ".mp3":
            mp3_bytes = pcm16_to_mp3_bytes(pcm_bytes, 24000)
            output_path.write_bytes(mp3_bytes)
        else:
            wav_bytes = pcm16_to_wav_bytes(pcm_bytes, 24000)
            output_path.write_bytes(wav_bytes)
            try:
                mp3_companion = output_path.with_suffix(".mp3")
                mp3_companion.write_bytes(pcm16_to_mp3_bytes(pcm_bytes, 24000))
            except Exception:
                pass
        return True

    # Fallback Neural Secundário caso sem internet para Google API
    neural_voice = NEURAL_VOICES.get(lang, "pt-BR-FranciscaNeural")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    try:
        import edge_tts

        async def _run_edge():
            comm = edge_tts.Communicate(spoken_text, neural_voice, rate="+0%")
            await comm.save(str(output_path))

        asyncio.run(_run_edge())
        if output_path.exists() and output_path.stat().st_size > 100:
            return True
    except Exception:
        pass

    return False


def main():
    try:
        if hasattr(sys.stdout, "reconfigure"):
            sys.stdout.reconfigure(encoding="utf-8")
        if hasattr(sys.stderr, "reconfigure"):
            sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

    parser = argparse.ArgumentParser(
        description="MOZOK v8.0 Gemini & Neural TTS/Translation Bridge"
    )
    parser.add_argument("--mode", choices=["tts", "translate"], required=True)
    parser.add_argument("--lang", default="pt-BR")
    parser.add_argument("--voice", default="Aoede")
    parser.add_argument("--text", default="")
    parser.add_argument("--input-json", default="")
    parser.add_argument("--output", default="")
    args = parser.parse_args()

    api_key = load_gemini_api_key()

    if args.mode == "translate":
        raw_json = (
            Path(args.input_json).read_text(encoding="utf-8")
            if args.input_json
            else sys.stdin.read()
        )
        req_obj = json.loads(raw_json)
        target_lang = (
            req_obj.get("targetLang") or req_obj.get("target_lang") or args.lang
        )
        inner = req_obj.get("payload") or req_obj.get("data") or req_obj
        translated = translate_payload(inner, target_lang, api_key)
        out_str = json.dumps(
            {"status": "ok", "translated": translated}, ensure_ascii=False
        )
        if args.output:
            Path(args.output).write_text(out_str, encoding="utf-8")
        else:
            sys.stdout.write(out_str)
        sys.exit(0)

    elif args.mode == "tts":
        out_path = Path(args.output)
        if out_path.exists() and out_path.stat().st_size > 200:
            sys.exit(0)
        ok = synthesize_speech(args.text, args.lang, args.voice, out_path, api_key)
        sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
