#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MOZOK Beta — Bridge Unificado de Tradução e Síntese Vocal Neural (5 Idiomas: pt-BR, en-GB, es-ES, it-IT, uk-UA)
- Camada 1: Google Gemini API via credentials.json (gemini-2.5-flash + gemini-2.5-flash-preview-tts voz Aoede)
- Camada 2 (Fallback Garantido): Google Translate GTX JSON + Microsoft Edge Neural TTS (Francisca, Sonia, Elvira, Elsa, Polina)
"""

import os
import sys
import json
import struct
import base64
import asyncio
import argparse
import subprocess
import urllib.parse
import urllib.request
from pathlib import Path

LANGUAGE_NAMES = {
    "pt-BR": "Português do Brasil",
    "en-GB": "British English",
    "es-ES": "Español",
    "it-IT": "Italiano",
    "uk-UA": "Українська мова (Ukrainian)"
}

LANG_SHORT = {
    "pt-BR": "pt",
    "en-GB": "en",
    "es-ES": "es",
    "it-IT": "it",
    "uk-UA": "uk"
}

NEURAL_VOICES = {
    "pt-BR": "pt-BR-FranciscaNeural",
    "en-GB": "en-GB-SoniaNeural",
    "es-ES": "es-ES-ElviraNeural",
    "it-IT": "it-IT-ElsaNeural",
    "uk-UA": "uk-UA-PolinaNeural"
}

def load_gemini_api_key() -> str:
    for env_name in ("GEMINI_API_KEY", "GOOGLE_API_KEY"):
        val = os.getenv(env_name)
        if val and val.strip():
            return val.strip()

    exe_dir = Path(__file__).resolve().parent.parent
    candidates = [
        exe_dir / "credentials.json",
        exe_dir.parent / "credentials.json",
        Path("credentials.json"),
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
                    for k in ("gemini_api_key", "GEMINI_API_KEY", "api_key", "google_api_key"):
                        if data.get(k) and str(data[k]).strip().startswith("AIza"):
                            return str(data[k]).strip()
                    if isinstance(data.get("gemini"), dict) and data["gemini"].get("api_key"):
                        return str(data["gemini"]["api_key"]).strip()
                else:
                    for line in raw.splitlines():
                        if ("gemini" in line.lower() or "google_api_key" in line.lower()) and "=" in line:
                            v = line.split("=", 1)[1].strip().strip('"\'')
                            if v.startswith("AIza"):
                                return v
            except Exception:
                continue
    return ""

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

    # 1. Tenta tradução estruturada com Gemini 2.5 Flash se houver chave válida
    if api_key:
        try:
            lang_desc = LANGUAGE_NAMES.get(target_lang, target_lang)
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
            prompt = (
                f"Translate all values of the following neuroanatomy JSON object into {lang_desc} ({target_lang}) "
                f"with medical precision. Keep the exact same JSON keys. Keep 'latin' in Latin. Return ONLY valid JSON:\n\n"
                f"{json.dumps(payload_dict, ensure_ascii=False)}"
            )
            req_body = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"temperature": 0.1, "responseMimeType": "application/json"}
            }
            req = urllib.request.Request(
                url,
                data=json.dumps(req_body).encode("utf-8"),
                headers={"Content-Type": "application/json"},
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=15) as resp:
                resp_data = json.loads(resp.read().decode("utf-8"))
                text_out = resp_data["candidates"][0]["content"]["parts"][0]["text"]
                parsed = json.loads(text_out)
                if isinstance(parsed, dict) and (parsed.get("name") or parsed.get("summary") or parsed.get("items")):
                    return parsed
        except Exception:
            pass

    # 2. Fallback Garantido via Google Translate GTX (traduz todos os campos instantaneamente)
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
            result["functions"] = [gtx_translate_text(str(x), target_lang) for x in result["functions"]]

    if isinstance(result.get("neurotransmitters"), list) and result["neurotransmitters"]:
        joined_nt = " ||| ".join(str(x) for x in result["neurotransmitters"])
        tr_nt = gtx_translate_text(joined_nt, target_lang)
        parts_nt = [p.strip() for p in tr_nt.split("|||") if p.strip()]
        if len(parts_nt) == len(result["neurotransmitters"]):
            result["neurotransmitters"] = parts_nt

    if isinstance(result.get("items"), dict):
        # Tradução em lote de títulos/badges da lista lateral
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
                        "badge": parts[1].strip() if len(parts) > 1 else orig_v.get("badge", "")
                    }
                elif isinstance(orig_v, dict):
                    out_items[k] = {"name": tr_line, "badge": orig_v.get("badge", "")}
                else:
                    out_items[k] = tr_line
            else:
                out_items[k] = orig_v
        result["items"] = out_items

    return result

def pcm16_to_wav_bytes(pcm_bytes: bytes, sample_rate: int = 24000, channels: int = 1, bits_per_sample: int = 16) -> bytes:
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
        data_size
    )
    return header + pcm_bytes

def synthesize_speech(text: str, lang: str, voice: str, output_path: Path, api_key: str) -> bool:
    if not text or not text.strip():
        return False

    # Garante que o texto esteja no idioma selecionado antes de sintetizar a voz!
    spoken_text = gtx_translate_text(text.strip(), lang) if lang != "pt-BR" else text.strip()

    # 1. Camada 1: Gemini 2.5 Flash TTS via credentials.json
    if api_key:
        try:
            lang_desc = LANGUAGE_NAMES.get(lang, lang)
            tts_prompt = (
                f"Narrate clearly with the warm, natural voice of a university neuroanatomy professor "
                f"speaking natively in {lang_desc} ({lang}):\n\n{spoken_text}"
            )
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key={api_key}"
            req_body = {
                "contents": [{"parts": [{"text": tts_prompt}]}],
                "generationConfig": {
                    "responseModalities": ["AUDIO"],
                    "speechConfig": {
                        "voiceConfig": {
                            "prebuiltVoiceConfig": {"voiceName": voice or "Aoede"}
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
            with urllib.request.urlopen(req, timeout=25) as resp:
                resp_data = json.loads(resp.read().decode("utf-8"))
                parts = resp_data["candidates"][0]["content"]["parts"]
                for part in parts:
                    inline = part.get("inlineData") or part.get("inline_data")
                    if inline and inline.get("data"):
                        raw_audio = base64.b64decode(inline["data"])
                        wav_bytes = raw_audio if raw_audio[:4] == b"RIFF" else pcm16_to_wav_bytes(raw_audio, 24000)
                        output_path.parent.mkdir(parents=True, exist_ok=True)
                        output_path.write_bytes(wav_bytes)
                        return True
        except Exception:
            pass

    # 2. Camada 2 (Fallback Neural Garantido): Microsoft Edge Neural TTS no idioma selecionado!
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

    try:
        cmd = [
            sys.executable, "-m", "edge_tts",
            "--voice", neural_voice,
            "--text", spoken_text,
            "--write-media", str(output_path)
        ]
        res = subprocess.run(cmd, capture_output=True, text=True, timeout=25)
        if res.returncode == 0 and output_path.exists() and output_path.stat().st_size > 100:
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

    parser = argparse.ArgumentParser(description="MOZOK Beta Gemini & Neural TTS/Translation Bridge")
    parser.add_argument("--mode", choices=["tts", "translate"], required=True)
    parser.add_argument("--lang", default="pt-BR")
    parser.add_argument("--voice", default="Aoede")
    parser.add_argument("--text", default="")
    parser.add_argument("--input-json", default="")
    parser.add_argument("--output", default="")
    args = parser.parse_args()

    api_key = load_gemini_api_key()

    if args.mode == "translate":
        raw_json = Path(args.input_json).read_text(encoding="utf-8") if args.input_json else sys.stdin.read()
        req_obj = json.loads(raw_json)
        target_lang = req_obj.get("targetLang") or req_obj.get("target_lang") or args.lang
        inner = req_obj.get("payload") or req_obj.get("data") or req_obj
        translated = translate_payload(inner, target_lang, api_key)
        out_str = json.dumps({"status": "ok", "translated": translated}, ensure_ascii=False)
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
