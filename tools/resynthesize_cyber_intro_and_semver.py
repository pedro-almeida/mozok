import asyncio
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(".").resolve()
sys.path.insert(0, str(ROOT / "tools"))

from generate_audio_mp3_cache import _ws_live_tts, pcm16_to_mp3_48k
from gemini_tts_bridge import load_gemini_api_keys

# 1. Versionamento SemVer 2.0.0: 1.1.0+build.12 (substitui 1.0011 estagnado)
NEW_SEMVER = "1.1.0+build.12"
NEW_SHORT_VER = "v1.1.0"

(ROOT / "VERSION").write_text(NEW_SEMVER + "\n", encoding="utf-8")

cargo_path = ROOT / "Cargo.toml"
if cargo_path.exists():
    c = cargo_path.read_text(encoding="utf-8")
    c = re.sub(r'version\s*=\s*"[^"]+"', f'version = "{NEW_SEMVER}"', c, count=1)
    cargo_path.write_text(c, encoding="utf-8")

sw_path = ROOT / "web" / "sw.js"
if sw_path.exists():
    sw = sw_path.read_text(encoding="utf-8")
    sw = re.sub(r"mozok-v[^'\"]+", f"mozok-{NEW_SHORT_VER}-build12", sw)
    sw_path.write_text(sw, encoding="utf-8")

main_rs = ROOT / "rust" / "mozok-native" / "src" / "main.rs"
if main_rs.exists():
    rs = main_rs.read_text(encoding="utf-8")
    rs = re.sub(r'"version":"[^"]+"', f'"version":"{NEW_SEMVER}"', rs)
    main_rs.write_text(rs, encoding="utf-8")

html_path = ROOT / "web" / "index.html"
html = html_path.read_text(encoding="utf-8")
html = re.sub(r"v1\.00\d+", NEW_SHORT_VER, html)
html = re.sub(r'title="SemVer [^"]+"', f'title="SemVer {NEW_SEMVER}"', html)

# Cache-buster nos MP3s de abertura e priorização do MP3 local recém-sintetizado
new_candidates_block = f"""const candidateUrls = [
                    `assets/audio/${{lang}}/CYBER_INTRO_${{segmentIndex + 1}}.mp3?v={NEW_SEMVER}`,
                    `/api/gemini-tts?text=${{encodeURIComponent(segmentText)}}&lang=${{encodeURIComponent(lang)}}&voice=Aoede`,
                    `assets/audio/pt-BR/CYBER_INTRO_${{segmentIndex + 1}}.mp3?v={NEW_SEMVER}`
                ];"""
html = re.sub(
    r"const candidateUrls = \[\s*[\s\S]*?\];",
    new_candidates_block,
    html,
    count=1,
)
html_path.write_text(html, encoding="utf-8")

# Atualizar tools/night_auditor_buttons.py para suportar SemVer 2.0.0
auditor_path = ROOT / "tools" / "night_auditor_buttons.py"
if auditor_path.exists():
    aud = auditor_path.read_text(encoding="utf-8")
    aud = re.sub(
        r'if not version_str\.startswith\("1\.00"\):[\s\S]*?errors\.append\(f"Cargo\.toml fora do padrão SemVer para \{version_str\}"\)',
        f'if not re.match(r"^\\\\d+\\\\.\\\\d+\\\\.\\\\d+(\\\\+build\\\\.\\\\d+)?$", version_str):\\n        errors.append(f"VERSION fora do padrão SemVer 2.0.0, encontrado: {{version_str}}")\\n    if f\'version = "{{version_str}}"\' not in cargo_str:\\n        errors.append(f"Cargo.toml fora do padrão SemVer para {{version_str}}")',
        aud
    )
    auditor_path.write_text(aud, encoding="utf-8")

# 2. Registrar regra permanente de SemVer 2.0.0 no AGENTS.md
agents_path = ROOT / "AGENTS.md"
semver_rule = """
## Política Obrigatória de Versionamento (SemVer 2.0.0 + Build Metadata)
- Formato oficial em `VERSION`, `Cargo.toml`, `web/sw.js`, `web/index.html` e `rust/mozok-native/src/main.rs`: `MAJOR.MINOR.PATCH+build.<N>` (ex: `1.1.0+build.12`).
- Ao concluir qualquer alteração no repositório, o agente DEVE avaliar o escopo e atualizar a versão automaticamente:
  - `MAJOR`: mudança incompatível na API/arquitetura.
  - `MINOR`: nova funcionalidade (ex: novos slides, modos 3D, idiomas, workflows).
  - `PATCH`: correção de bug, ajuste visual ou hotfix.
  - `+build.<N>`: sempre incrementar o número sequencial de build (`+build.12` -> `+build.13`, etc.) a cada release/commit.
"""
if agents_path.exists():
    ag = agents_path.read_text(encoding="utf-8")
    if "Política Obrigatória de Versionamento" not in ag:
        agents_path.write_text(ag.rstrip() + "\n" + semver_rule, encoding="utf-8")
else:
    agents_path.write_text(semver_rule.lstrip(), encoding="utf-8")

# 3. Extrair INTRO_SEGMENTS_I18N de web/index.html e re-sintetizar CYBER_INTRO_1..5.mp3 nos 5 idiomas
m = re.search(r"const INTRO_SEGMENTS_I18N = (\{[\s\S]*?\});", html)
if not m:
    raise RuntimeError("INTRO_SEGMENTS_I18N não encontrado em web/index.html")

segments_by_lang = json.loads(m.group(1))
keys = load_gemini_api_keys()
if not keys:
    raise RuntimeError("Nenhuma chave Gemini encontrada em credentials.json / ambiente!")

PRONOUNCE_MNI = {
    "pt-BR": "M N I cento e cinquenta e dois",
    "en-GB": "M N I one fifty two",
    "es-ES": "M N I ciento cincuenta y dos",
    "it-IT": "M N I centocinquantadue",
    "uk-UA": "M N I сто п'ятдесят два",
}

async def synthesize_all():
    key_idx = 0
    for lang, segs in segments_by_lang.items():
        out_dir = ROOT / "web" / "assets" / "audio" / lang
        out_dir.mkdir(parents=True, exist_ok=True)
        for idx, raw_text in enumerate(segs, start=1):
            spoken = raw_text.replace("MNI152", PRONOUNCE_MNI.get(lang, "MNI152"))
            out_file = out_dir / f"CYBER_INTRO_{idx}.mp3"
            success = False
            for attempt in range(len(keys)):
                api_key = keys[key_idx % len(keys)]
                key_idx += 1
                try:
                    pcm = await _ws_live_tts(spoken, lang, api_key)
                    mp3 = pcm16_to_mp3_48k(pcm)
                    out_file.write_bytes(mp3)
                    print(f"[OK] {lang}/CYBER_INTRO_{idx}.mp3 ({len(mp3)} bytes)")
                    success = True
                    break
                except Exception as e:
                    print(f"[RETRY] {lang} seg {idx} tentativa {attempt+1} falhou: {e}")
                    await asyncio.sleep(0.5)
            if not success:
                raise RuntimeError(f"Falha ao sintetizar {lang}/CYBER_INTRO_{idx}.mp3")

asyncio.run(synthesize_all())
print(f"Re-síntese concluída e versão atualizada para {NEW_SEMVER}!")
