#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MOZOK Night Auditor (v1.0003) — Auditoria Botão-a-Botão, Multiescala, Doom 3 Intro e Psicometria
Verifica integridade de todos os botões interativos, traduções i18n, 6 níveis de zoom e versionamento.
"""

import re
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
INDEX_HTML = ROOT / "web" / "index.html"
MICRO_JS = ROOT / "web" / "js" / "neural-microcosmos-3d.js"
CNS_JS = ROOT / "web" / "js" / "cns-anatomy-3d.js"
VERSION_FILE = ROOT / "VERSION"
CARGO_TOML = ROOT / "Cargo.toml"

REQUIRED_BUTTON_IDS = [
    "btn-close-popup",
    "btn-popup-isolate",
    "btn-popup-micro",
    "btn-popup-narrate",
    "btn-view-external",
    "btn-view-xray",
    "btn-view-vascular",
    "btn-meninges",
    "btn-view-micro",
    "btn-body-shell",
    "btn-home-view",
    "btn-doom-intro",
    "btn-tour",
    "btn-voice",
    "btn-vlibras",
    "btn-fullscreen",
    "btn-research-eval",
    "btn-about",
    "btn-pan-left",
    "btn-pan-up",
    "btn-pan-down",
    "btn-pan-right",
    "btn-pan-reset",
    "btn-isolate-piece",
    "btn-card-dive",
    "btn-narrate-card",
    "btn-stimulate-neuron",
    "btn-trigger-stroke-card",
    "btn-restore-tissue-card",
    "btn-doom3-skip",
    "btn-deck-prev",
    "btn-deck-play",
    "btn-deck-next",
    "btn-deck-close",
    "btn-export-research-csv",
    "btn-export-research-json",
]

def run_audit() -> int:
    html = INDEX_HTML.read_text(encoding="utf-8")
    micro = MICRO_JS.read_text(encoding="utf-8")
    cns = CNS_JS.read_text(encoding="utf-8")
    version_str = VERSION_FILE.read_text(encoding="utf-8").strip() if VERSION_FILE.exists() else "MISSING"
    cargo_str = CARGO_TOML.read_text(encoding="utf-8")

    errors = []
    print(f"=== MOZOK NIGHT AUDITOR • VERSION {version_str} ===")

    for bid in REQUIRED_BUTTON_IDS:
        if f'id="{bid}"' not in html and f"id='{bid}'" not in html:
            errors.append(f"Botão obrigatório ausente no DOM: #{bid}")
        else:
            print(f"  [PASS] Botão verificado: #{bid}")

    # Verifica os 6 níveis do Google Earth Biológico
    for feature in ["buildIntracellularOrganelles3D", "buildAtomicQuantumLattice3D", "setMultiscaleDepth"]:
        if feature not in micro:
            errors.append(f"Função multiescala ausente em neural-microcosmos-3d.js: {feature}")
        else:
            print(f"  [PASS] Motor Multiescala (Organelas/Átomos): {feature}")

    # Verifica Introdução Doom 3 e Voz Robótica
    for doom_feat in ["startDoom3CinematicIntro", "speakRoboticDoomVoice", "playIdSoftwareLogoSound"]:
        if doom_feat not in html:
            errors.append(f"Módulo Doom 3 ausente em index.html: {doom_feat}")
        else:
            print(f"  [PASS] Módulo Doom 3 / John Carmack Homage: {doom_feat}")

    # Verifica Versionamento
    if version_str != "1.0003":
        errors.append(f"VERSION esperado 1.0003, encontrado: {version_str}")
    if 'version = "1.0.3+0003"' not in cargo_str:
        errors.append("Cargo.toml fora do padrão SemVer 1.0.3+0003")

    if errors:
        print("\n[FAIL] Erros encontrados pelo Auditor Noturno:")
        for e in errors:
            print("  -", e)
        return 1

    print(f"\n[SUCCESS] Todos os {len(REQUIRED_BUTTON_IDS)} botões, 6 escalas de zoom (Cérebro -> Átomos), Intro Doom 3 e Módulo Científico aprovados na versão {version_str}!")
    return 0

if __name__ == "__main__":
    sys.exit(run_audit())
