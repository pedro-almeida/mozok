# MOZOK Unified Architecture Specification (v1.0004)

## 1. Single Source of Truth Principle (Web & Native Desktop Parity)
MOZOK operates on a **single unified codebase** across Web, PWA, and Native Desktop (`mozok-native.exe`):
- **Sovereign Rust Workspace (`rust/`):** Provides domain math (`mozok-core`), ontology DAG (`mozok-atlas`), 6-DOF logarithmic camera & LOD math (`mozok-navigation`), synaptic/CSF biophysics (`mozok-physiology`), disease models (`mozok-pathology`), and the zero-overhead Win32 native runtime (`mozok-native` via `tao` + `wry` WebView2 with dedicated GPU acceleration `NvOptimusEnablement` on port `8090`).
- **Unified WebGL2 / Three.js Presentation Engine (`web/`):** Renders the real 81,924-vertex McGill BrainBrowser MNI152 cortical surface (`cns-anatomy-3d.js`), 45 CNS/PNS structures, 7 pathophysiological simulations, and the multiscale cellular/sub-cellular engine (`neural-microcosmos-3d.js`) spanning from macroscopic lobes down to Layer V Betz pyramidal neurons, synapses, intracellular organelles, and atomic quantum orbitals.
