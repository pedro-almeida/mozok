# MOZOK Architectural Specification — v1.0001 (SemVer 1.0.1+0001)

## 1. Versioning Policy
- **Baseline:** `v1.0.0` (`1.0`) frozen via annotated Git tag.
- **Sequential Release Track:** Human-readable build counter `1.0001`, `1.0002`, `1.0003` stored in `/VERSION` and displayed in `#brand-version-badge`, paired with strict Cargo SemVer `1.0.X+000X` in `Cargo.toml`.

## 2. Night Auditor Button-by-Button Fixes
1. `#cat-chip-all` & `#structure-count-pill`: Preserves dynamic count `(45)` across all 5 languages (`pt-BR`, `en-GB`, `es-ES`, `it-IT`, `uk-UA`).
2. `#btn-isolate-piece` & `#btn-popup-isolate`: Strictly localized via `UI_I18N[currentLang]` instead of hardcoded Portuguese strings.
3. `#btn-body-shell`: Enabled in Topbar (`display: inline-flex`) with full 5-language localization so the bioluminescent body silhouette can be toggled at any time.
4. `#btn-stimulate-neuron`: Works in both Macro and Micro modes (triggers visual synaptic pulse and highlights active cortical pathway).

## 3. Continuous Multiscale Zoom Engine ("Biological Google Earth" — 6 Tiers)
Replaces the hard OrbitControls stop (`minDistance = 2.2`) with a continuous logarithmic scale controller (`window.MozokScaleEngine`) spanning 9 orders of magnitude:
- **Tier 0 (`15 cm` | Distance `85.0 -> 11.5`):** Macroscopic CNS/PNS MNI152 Encephalon.
- **Tier 1 (`10 mm` | Distance `11.5 -> 6.2`):** Cortical Parenchyma Penetration (smooth cortical alpha translucency fade from `1.0` to `0.10`, revealing internal cytoarchitecture).
- **Tier 2 (`100 µm` | Distance `6.2 -> 2.4`):** Layer V Pyramidal Neuronal Network (Betz cells and dendritic arbors appear automatically via scroll zoom without requiring manual button clicks).
- **Tier 3 (`500 nm` | Distance `2.4 -> 1.15`):** Synaptic Cleft & Bidirectional Neurotransmitter Vesicles (Glutamate, GABA, 2-AG).
- **Tier 4 (`50 nm` | Distance `1.15 -> 0.45`):** Intracellular Organelles inside the Neuronal Soma (Nucleus with nuclear pores, Mitochondria with ATP cristae, Rough ER, Golgi Apparatus, Microtubules).
- **Tier 5 (`1 Å / 0.1 nm` | Distance `0.45 -> 0.12`):** Sub-Nanometer Atomic & Quantum Orbital Lattice (Carbon, Nitrogen, Oxygen, Phosphorus, and Na+/K+ ions with animated 3D electron probability clouds and covalent bonds).
