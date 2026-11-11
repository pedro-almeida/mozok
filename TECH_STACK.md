# MOZOK Unified Technical Stack (v1.0004)

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **3D Rendering Engine** | **WebGL 2.0 / Three.js Custom Shaders** | Real-time rendering of 81,924 MNI152 vertices, custom GLSL cortical/pathology shaders, and multiscale instancing at 60 FPS. |
| **Native Desktop Runtime** | **Rust (`mozok-native` — `tao` + `wry`)** | Native Win32/Linux wrapper binding `GpuPreference=2` (dedicated NVIDIA GPU) and serving the unified `web/` assets on `127.0.0.1:8090`. |
| **Domain & Biophysical Core** | **Rust Workspace (2021 Edition)** | 64-bit spatial coordinates, hierarchical LOD (`mozok-navigation`), Hodgkin-Huxley kinetics (`mozok-physiology`), and neurodegenerative cascades (`mozok-pathology`). |
| **Accessibility & Voice** | **Gemini Neural TTS + Web Audio DSP + VLibras** | Multilingual voice synthesis (PT-BR, EN-GB, ES-ES, IT-IT, UK-UA), cybernetic vocoder DSP, and real-time Brazilian Sign Language (VLibras). |
