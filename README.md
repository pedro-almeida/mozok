# MOZOK (МОЗОК)

> **Open-Source Interactive Atlas of the Human Body**  
> *"A Google Earth for Human Biology — The Brain is Only the Beginning"*

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Rust](https://img.shields.io/badge/Rust-2021%20Edition-orange.svg)](https://www.rust-lang.org)
[![Engine](https://img.shields.io/badge/Godot-4.x-478cbf.svg)](https://godotengine.org)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Linux%20%7C%20Android%20%7C%20Wasm-lightgrey.svg)](#5-target-platforms)
[![Manifesto](https://img.shields.io/badge/Manifesto-Read%20Here-green.svg)](MANIFESTO.md)

---

## 1. What is MOZOK?

**MOZOK** (Ukrainian: *Мозок* — "Brain") is an open-source, scientifically validated, interactive visualization platform designed to explore the human body across vast hierarchical scales: from whole-body organ systems down to individual cells, organelles, and molecular processes.

The project launches with the human brain as its pilot module, but its sovereign architecture is engineered from the ground up to encompass **every biological system of the human body**:

$$\text{Whole Organism} \longrightarrow \text{Organ Systems} \longrightarrow \text{Organs} \longrightarrow \text{Tissues} \longrightarrow \text{Cells} \longrightarrow \text{Organelles} \longrightarrow \text{Molecular Structures}$$

MOZOK is **not a video game**. It is an open public utility built for **medical education, clinical research, neuroscience, anatomy, and scientific literacy**.

---

## 2. Ethical Foundation: Kantian Deontology & Ukrainian Heritage

Read the full [MOZOK Manifesto (MANIFESTO.md)](MANIFESTO.md).

### The Philosophy of Immanuel Kant
1. **Good Will (*Der gute Wille*):** Knowledge about the human body is shared unconditionally because it is intrinsically good to do so. We reject paywalls and artificial data monopolies.
2. **The Categorical Imperative (*Kategorischer Imperativ*):** We assert as a universal maxim: *"Should scientific understanding of the human body be universally accessible to all people without barrier?"* MOZOK answers with an absolute yes.
3. **Humanity as an End in Itself:** Every student, clinician, and curious mind is an autonomous human being deserving access to truth, never a monetization metric.

### Tribute to Ukrainian Scientific Resilience
The name **MOZOK** honors Ukrainian linguistic sovereignty and its monumental contributions to world medicine and biology:
- **Volodymyr Bets (Kyiv, 1834–1894):** Discovered the giant pyramidal neurons (Betz cells) in the motor cortex, pioneering functional cytoarchitecture.
- **Ilya Mechnikov (Kharkiv region, 1845–1916):** Father of innate cellular immunology and phagocytosis, 1908 Nobel Laureate.
- **Mykola Amosov (Kyiv, 1913–2002):** World pioneer in cardiovascular surgery, artificial heart valves, and physiological cybernetics.

Keeping Ukrainian culture, language, and scientific courage alive is an integral commitment of this project.

---

## 3. Scope: The Whole Human Body

While initial execution focuses on the central nervous system, MOZOK's data model and streaming engine are organ-agnostic:

* **Nervous System (Pilot Focus):** Whole brain, lobes, nuclei, cortical layers, neuronal reconstructions (SWC), connectomes, synapses.
* **Cardiovascular System:** Heart chambers, coronary vasculature, microcirculation, systemic hemodynamics.
* **Respiratory System:** Tracheobronchial tree, alveolar gas exchange, respiratory mechanics.
* **Digestive System:** Gastrointestinal tracts, hepatic lobules, pancreatic acini.
* **Musculoskeletal System:** Osteoarticular geometry, muscle fascicles, sarcomeres.
* **Endocrine & Lymphatic Systems:** Glands, hormonal cascades, lymph nodes, cellular immune response.
* **Cellular & Molecular Biology:** Organelles, lipid bilayers, receptor complexes.

---

## 4. Architecture: Presentation Decoupled from Core Logic

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Presentation & UI** | [Godot 4](https://godotengine.org) | Viewport rendering (Forward+/Mobile), input dispatch, scene graph, UI/HUD. |
| **Core Architecture** | [Rust](https://www.rust-lang.org) | 64-bit spatial math, LOD evaluation, out-of-core streaming, ontologies, search. |
| **Integration Bridge** | GDExtension (`mozok-godot`) | Direct C-ABI bridge exposing Rust core nodes to Godot without GC latency. |

### Architectural Invariants
1. **Never load everything at once:** Out-of-core chunk streaming with bounded LRU memory budgets (`mozok-streaming`).
2. **Kantian Hardware Accessibility:** Must maintain fluid 60 FPS navigation on modest consumer hardware (e.g., GTX 1650, standard laptops, mid-range Android devices).
3. **Scientific Provenance:** Every biological structure carries DOI links, literature citations, and peer-review validation.

---

## 5. Target Platforms

- **Desktop:** Windows (x86_64), Linux (x86_64, aarch64)
- **Mobile:** Android (ARM64)
- **Web:** WebAssembly + WebGPU

---

## 6. Repository Layout

```text
mozok/
├── Cargo.toml                  # Sovereign Rust workspace
├── LICENSE                     # Apache License 2.0
├── MANIFESTO.md                # Ethics, Kantian Deontology & Ukrainian Tribute
├── README.md                   # Project overview and quickstart
├── ARCHITECTURE.md             # Full engineering and LOD specification
├── DEVELOPMENT_ROADMAP.md      # Phased execution milestones
├── docs/                       # Technical RFCs (coordinates, streaming, ontologies, DOIs)
├── rust/                       # Native Rust crates
│   ├── mozok-core/             # 64-bit coordinates, scales, biological datasets
│   ├── mozok-atlas/            # Anatomical ontologies (DAG), regions
│   ├── mozok-navigation/       # Floating-origin camera, LOD evaluators
│   ├── mozok-streaming/        # Out-of-core chunk caching and LRU governor
│   ├── mozok-search/           # Fuzzy inverted index for anatomical terms
│   └── mozok-godot/            # GDExtension entry point and native bindings
├── project.godot               # Godot 4 project configuration
├── mozok.gdextension           # GDExtension manifest
├── scenes/                     # Godot scene trees (main.tscn)
└── scripts/                    # Godot GDScript presentation controllers
```

---

## 7. License

Licensed under the **Apache License, Version 2.0** ([LICENSE](LICENSE)). Free for academic, clinical, educational, and commercial use.
