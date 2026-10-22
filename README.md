# MOZOK

> **Open-Source Interactive Neuroanatomy Platform**  
> *"A Google Earth for the Human Brain"*

[![License](https://img.shields.io/badge/License-Apache%202.0%20%2F%20MIT-blue.svg)](LICENSE_RECOMMENDATION.md)
[![Rust](https://img.shields.io/badge/Rust-2021%20Edition-orange.svg)](https://www.rust-lang.org)
[![Engine](https://img.shields.io/badge/Godot-4.x-478cbf.svg)](https://godotengine.org)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Linux%20%7C%20Android%20%7C%20Wasm-lightgrey.svg)](#target-platforms)

---

## 1. What is MOZOK?

**MOZOK** (Ukrainian: *Мозок* — "Brain") is an open-source, scientific visualization and educational exploration platform designed to render the human brain across vast hierarchical scales.

Unlike static 3D anatomical atlases or traditional neuroimaging viewers confined to orthogonal 2D slice cuts, MOZOK aims to offer continuous, scale-independent navigation through the central nervous system:

$$\text{Whole Brain} \longrightarrow \text{Lobes} \longrightarrow \text{Structures} \longrightarrow \text{Tissue} \longrightarrow \text{Neuronal Clusters} \longrightarrow \text{Individual Neurons} \longrightarrow \text{Synapses}$$

This is **not a video game**. MOZOK is engineered strictly for **neuroscience, clinical medicine, academic research, medical education, and scientific communication**.

---

## 2. Why MOZOK Exists

Modern neuroscience suffers from a spatial disconnect:
- **Macro-scale tools** (MRI/fMRI viewers like FreeSurfer, FSL, ITK-SNAP) operate at millimeter resolution ($10^{-3}\,\text{m}$).
- **Meso-scale tools** (histology, tractography, tissue clearing) operate at micrometer resolution ($10^{-6}\,\text{m}$).
- **Micro-scale tools** (electron microscopy, connectomics like Neuroglancer) operate at nanometer resolution ($10^{-9}\,\text{m}$).

Researchers, educators, and clinicians are forced to jump between disjoint tools with disparate coordinate systems. MOZOK is built to bridge these regimes into a single, cohesive, interactive digital universe—retaining spatial context and topological coherence across 6 orders of spatial magnitude.

---

## 3. Long-Term Vision

Our vision is to build the definitive **"Google Earth for the Human Brain"**:
- **Seamless Hierarchical LOD (Level of Detail):** Smooth zooming and view-dependent streaming from global cortical folds down to individual synaptic clefts and postsynaptic densities.
- **Multimodal Dataset Fusion:** Overlaying anatomical reference atlases, diffusion MRI tractography streamlines, spatial transcriptomics, single-cell morphometry (SWC), and electron microscopy connectomes.
- **Pathology & Disease Modules:** Visualizing progressive degeneration and pathophysiology in neurodegenerative and cerebrovascular diseases (Alzheimer's, Parkinson's, Prion diseases, Multiple Sclerosis, and Ischemic/Hemorrhagic Stroke).

---

## 4. Technology Stack & Philosophy

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Presentation & UI** | [Godot 4](https://godotengine.org) | Lightweight, cross-platform scene graph, Vulkan/Forward+/Mobile renderers, high-performance UI system, zero licensing friction. |
| **Core Architecture** | [Rust](https://www.rust-lang.org) | Zero-cost abstractions, memory safety without GC latency, predictable performance, fearless concurrency for streaming & spatial indexing. |
| **Interoperability** | GDExtension / C-FFI / Wasm | Decoupled core logic enabling presentation layers to evolve independently from dataset parsing and streaming algorithms. |

### Architectural Philosophy
1. **Never load everything at once:** The human brain comprises $\sim 86$ billion neurons and $\sim 100$ trillion synapses. The system must operate under an out-of-core, streaming-first paradigm inspired by Cesium 3D Tiles, Neuroglancer, and geospatial indexing (Octrees, BVH, Hilbert curves).
2. **Open Source & Open Knowledge:** Transparent open science. Unencumbered by proprietary formats.
3. **Hardware Accessibility:** Must run smoothly on standard consumer PCs (e.g., GTX 1650 tier), mid-range mobile devices (Android), and browsers via WebAssembly.

---

## 5. Target Platforms

- **Desktop:** Windows (x86_64), Linux (x86_64, aarch64)
- **Mobile:** Android (ARM64)
- **Web:** WebAssembly + WebGPU / WebGL2

---

## 6. Project Structure

```text
/
├── .github/              # CI/CD workflows and repository standards
├── assets/               # Godot theme definitions and visual tokens
├── core/                 # Shared data definitions and contracts
├── datasets/             # Directory structure for cached/imported datasets
├── docs/                 # Extended technical architecture & design specs
├── models/               # 3D assets and procedural mesh definitions
├── plugins/              # Godot editor plugins & custom extensions
├── rust/                 # Sovereign Rust workspace
│   ├── mozok-core/       # Math, coordinate transforms, memory pools
│   ├── mozok-atlas/      # Atlas hierarchies, brain regions, ontologies
│   ├── mozok-navigation/ # Spatial camera, LOD calculation, frustum culling
│   ├── mozok-streaming/  # Chunk caching, asynchronous out-of-core loader
│   └── mozok-search/     # Anatomical name resolution, fuzzy ontology search
├── scenes/               # Godot 4 scene tree hierarchies
├── scripts/              # Godot GDScript glue and controller layer
├── tests/                # Integration and verification test suites
├── tools/                # Pipeline converters, data verification scripts
├── ui/                   # Modular UI controls, HUD, navigation widgets
├── ARCHITECTURE.md       # Full architectural specification
├── CONTRIBUTING.md       # Contribution guidelines
├── DEVELOPMENT_ROADMAP.md# Phased execution milestones
├── PROJECT_VISION.md     # Manifesto and scientific principles
└── TECH_STACK.md         # Detailed technology evaluation & strategy
```

---

## 7. Roadmap Overview

- **Phase 1: Foundation** — Architecture baseline, Rust workspace, Godot GDExtension skeleton, spatial coordinates.
- **Phase 2: Navigation** — Continuous 6-DOF camera, spatial LOD controller, Octree chunking.
- **Phase 3: Atlas Integration** — Hierarchical ontology indexing (Allen Brain Atlas, Desikan-Killiany, Julich Brain).
- **Phase 4: Neuron Visualization** — SWC/morphology streaming, GPU instancing for neuronal arbors.
- **Phase 5: Synapse Visualization** — Ultra-scale density streaming, nanometer-level point/mesh structures.
- **Phase 6: Educational Features** — Guided anatomical tours, dissection modes, clinical cross-sections.
- **Phase 7: Disease Modules** — Alzheimer's, Parkinson's, Creutzfeldt-Jakob, Multiple Sclerosis, and Stroke.

See [DEVELOPMENT_ROADMAP.md](DEVELOPMENT_ROADMAP.md) for detailed deliverables.

---

## 8. References & Architectural Inspiration

- [Godot Engine](https://github.com/godotengine/godot) — Modern, extensible scene graph and rendering pipeline.
- [Google Neuroglancer](https://github.com/google/neuroglancer) — WebGL-based viewer for petascale volume and connectomic data.
- [BrainGlobe Atlas API](https://github.com/brainglobe/brainglobe-atlasapi) — Unified Python API for neuroanatomical atlases.
- [BrainRender](https://github.com/brainglobe/brainrender) — Python package for 3D neuroanatomical visualization.
- [MorphAPI](https://github.com/brainglobe/morphapi) — Computational morphology downloader and parser.

---

## 9. License

See [LICENSE_RECOMMENDATION.md](LICENSE_RECOMMENDATION.md) for license details (dual-license recommendation: Apache-2.0 or MIT).
