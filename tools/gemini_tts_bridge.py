#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MOZOK v7.2 - Bridge de Sintese Vocal e Traducao Neuroanatomica via Google Gemini API (credentials.json)
Suporta os 5 idiomas canonicos: pt-BR, en-GB, es-ES, it-IT e uk-UA.
Gera WAV RIFF 24kHz 16-bit mono a partir do PCM inlineData do modelo gemini-2.5-flash-preview-tts.
"""

import os
import sys
import json
import struct
import base64
import argparse
import urllib.request
import urllib.error
from pathlib import Path

LANGUAGE_NAMES = {
    "pt-BR": "Portugues do Brasil (Brazilian Portuguese)",
    "en-GB": "Ingles Britanico (British English)",
    "es-ES": "Espanhol (Spanish)",
    "it-IT": "Italiano (Italian)",
    "uk-UA": "Ucraniano (Ukrainian - Українська мова)"
}

def load_gemini_api_key() -> str:
    env_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if env_key and env_key.strip():
        return env_key.strip()

    exe_dir = Path(__file__).resolve().parent.parent
    candidates = [
        exe_dir / "credentials.json",
        exe_dir.parent / "credentials.json",
        Path("credentials.json"),
        Path("/var/www/mcp-server/credentials/credentials.json"),
        Path("C:/var/www/mcp-server/credentials/credentials.json"),
        Path(os.path.expanduser("~/.config/svitlo/credentials.json")),
        exe_dir / "zorya.toml",
    ]

    for path in candidates:
        if path.exists() and path.is_file():
            try:
                raw = path.read_text(encoding="utf-8")
                if path.suffix.lower() == ".json":
                    data = json.loads(raw)
                    for k in ("gemini_api_key", "GEMINI_API_KEY", "api_key", "google_api_key"):
                        if data.get(k):
                            return str(data[k]).strip()
                    if isinstance(data.get("gemini"), dict) and data["gemini"].get("api_key"):
                        return str(data["gemini"]["api_key"]).strip()
                elif path.suffix.lower() == ".toml":
                    for line in raw.splitlines():
                        if "gemini" in line.lower() and "=" in line:
                            val = line.split("=", 1)[1].strip().strip('"\'')
                            if val:
                                return val
            except Exception:
                continue
    return ""

def pcm16_to_wav_bytes(pcm_bytes: bytes, sample_rate: int = 24000, channels: int = 1, bits_per_sample: int = 16) -> bytes:
    byte_rate = sample_rate * channels * (bits_per_sample // 8)
    block_align = channels * (bits_per_sample // 8)
    data_size = len(pcm_bytes)
    riff_size = 36 + data_size
    header = struct.pack(
        "<4sI4s4sIHHIIHH4sI",
        b"RIFF",
        riff_size,
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
        data_size
    )
    return header + pcm_bytes

def gemini_translate_json(payload_dict: dict, target_lang: str, api_key: str) -> dict:
    if target_lang == "pt-BR" or not api_key:
        return payload_dict

    lang_desc = LANGUAGE_NAMES.get(target_lang, target_lang)
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    prompt = (
        f"You are an expert university neuroanatomy professor. Translate all values of the following JSON object "
        f"into {lang_desc} ({target_lang}) with strict medical and neurophysiological precision. "
        f"Keep the exact same JSON keys and array structures. Keep the 'latin' key in official Latin Terminologia Anatomica. "
        f"Return ONLY valid JSON.\n\n{json.dumps(payload_dict, ensure_ascii=False)}"
    )
    req_body = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.15,
            "responseMimeType": "application/json"
        }
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(req_body).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    with urllib.request.urlopen(req, timeout=25) as resp:
        resp_data = json.loads(resp.read().decode("utf-8"))
        text_out = resp_data["candidates"][0]["content"]["parts"][0]["text"]
        return json.loads(text_out)

def gemini_synthesize_speech(text: str, lang: str, voice: str, output_wav: Path, api_key: str) -> bool:
    if not api_key:
        return False

    lang_desc = LANGUAGE_NAMES.get(lang, lang)
    tts_prompt = (
        f"Narrate the following neuroanatomy explanation clearly, with the warm, didactic, and authoritative tone "
        f"of a university neurophysiology professor speaking natively in {lang_desc} ({lang}). "
        f"If any sentence below is not yet in {lang_desc}, translate it simultaneously and speak ONLY in {lang_desc}:\n\n{text}"
    )

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key={api_key}"
    req_body = {
        "contents": [{"parts": [{"text": tts_prompt}]}],
        "generationConfig": {
            "responseModalities": ["AUDIO"],
            "speechConfig": {
                "voiceConfig": {
                    "prebuiltVoiceConfig": {
                        "voiceName": voice or "Aoede"
                    }
                }
            }
        }
    }

    req = urllib.request.Request(
        url,
        data=json.dumps(req_body).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    with urllib.request.urlopen(req, timeout=35) as resp:
        resp_data = json.loads(resp.read().decode("utf-8"))
        parts = resp_data["candidates"][0]["content"]["parts"]
        for part in parts:
            inline = part.get("inlineData") or part.get("inline_data")
            if inline and inline.get("data"):
                raw_audio = base64.b64decode(inline["data"])
                if raw_audio[:4] == b"RIFF":
                    wav_bytes = raw_audio
                else:
                    wav_bytes = pcm16_to_wav_bytes(raw_audio, sample_rate=24000)
                output_wav.parent.mkdir(parents=True, exist_ok=True)
                output_wav.write_bytes(wav_bytes)
                return True
    return False

def main():
    parser = argparse.ArgumentParser(description="MOZOK Gemini TTS & Translation Bridge")
    parser.add_argument("--mode", choices=["tts", "translate"], required=True)
    parser.add_argument("--lang", default="pt-BR")
    parser.add_argument("--voice", default="Aoede")
    parser.add_argument("--text", default="")
    parser.add_argument("--input-json", default="")
    parser.add_argument("--output", default="")
    args = parser.parse_args()

    api_key = load_gemini_api_key()
    if not api_key:
        sys.stderr.write("ERRO: Chave GEMINI_API_KEY nao encontrada em credentials.json.\n")
        sys.exit(2)

    if args.mode == "translate":
        raw_json = Path(args.input_json).read_text(encoding="utf-8") if args.input_json else sys.stdin.read()
        payload = json.loads(raw_json)
        translated = gemini_translate_json(payload, args.lang, api_key)
        out_str = json.dumps(translated, ensure_ascii=False)
        if args.output:
            Path(args.output).write_text(out_str, encoding="utf-8")
        else:
            sys.stdout.write(out_str)
        sys.exit(0)

    elif args.mode == "tts":
        out_path = Path(args.output)
        if out_path.exists() and out_path.stat().st_size > 100:
            sys.exit(0)
        ok = gemini_synthesize_speech(args.text, args.lang, args.voice, out_path, api_key)
        sys.exit(0 if ok else 1)

if __name__ == "__main__":
    main()
