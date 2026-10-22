# MOZOK Architecture Specification

## 1. Executive Architectural Principles

The architecture of MOZOK is built on three immutable laws:

1. **Separation of Presentation from Sovereign Logic:**  
   The rendering, user interaction, and platform abstraction layers are managed by **Godot 4**. The core domain logic—including spatial coordinate transformations, hierarchical level-of-detail (LOD) indexing, out-of-core streaming, dataset ingestion, and anatomical ontology graphs—is implemented purely in **Rust**. Godot can be replaced, updated, or repurposed without touching core neurocomputational algorithms.
2. **Out-of-Core by Invariant:**  
   The human brain contains $\sim 8.6 \times 10^{10}$ neurons and $\sim 10^{14}$ synapses. Even a single cubic millimeter of cortical tissue imaged via serial section electron microscopy (ssEM) generates tens of terabytes of voxel and connectomic data. The software must strictly operate with bounded memory constraints, dynamic memory pools, priority queues, and spatial chunk streaming (similar to Google Earth, Cesium, and Neuroglancer).
3. **Continuous Multi-Scale Coordinate Systems:**  
   Spatial navigation spans 6 orders of magnitude:
   - Macro: $10^{-1}\,\text{m}$ to $10^{-3}\,\text{m}$ (Lobes, Gyri, Sulci, Nuclei)
   - Meso: $10^{-3}\,\text{m}$ to $10^{-5}\,\text{m}$ (Cortical columns, layers, neuronal clusters)
   - Micro: $10^{-5}\,\text{m}$ to $10^{-8}\,\text{m}$ (Soma, dendritic trees, spines, synaptic junctions)

To avoid floating-point jitter and 32-bit depth-buffer breakdown at micro-scales, navigation coordinates use 64-bit floating point (`f64`) world space or hierarchical local floating-point origins (Floating Origin Pattern).

```
                      +------------------------------------------+
                      |         Godot 4 Presentation Layer       |
                      |  - Vulkan / Forward+ / Mobile Renderer   |
                      |  - Scene Graph (MeshInstance3D, MultiMesh)|
                      |  - Input System & Camera Trajectory      |
                      |  - UI Controls & Annotation HUD          |
                      +------------------------------------------+
                                           |
                                  GDExtension / C-ABI
                                           |
+------------------------------------------------------------------------------------+
|                               MOZOK Rust Workspace                                 |
|                                                                                    |
|  +------------------+     +--------------------+     +--------------------------+  |
|  |   mozok-core     | <---|  mozok-navigation  | <---|      mozok-search        |  |
|  | - Precision Math |     | - Camera 6-DOF     |     | - Ontology query engine  |  |
|  | - Floating Origin|     | - Frustum culling  |     | - Fuzzy string index     |  |
|  | - Memory pools   |     | - LOD calculation  |     | - Spatial search         |  |
|  +------------------+     +--------------------+     +--------------------------+  |
|           ^                         |                             |                |
|           |                         v                             |                |
|  +------------------+     +--------------------+                  |                |
|  |   mozok-atlas    | <---+  mozok-streaming   | <----------------+                |
|  | - Neuro-ontology |     | - LRU / Memory Cache|                                  |
|  | - Coordinate Map |     | - Thread Pool (Rayon)|                                 |
|  | - Region Registry|     | - Out-of-core loader |                                 |
|  +------------------+     +--------------------+                                   |
+------------------------------------------------------------------------------------+
                                           |
                                I/O & Network Drivers
                                           |
                      +------------------------------------------+
                      |       Storage / Remote Repositories      |
                      | - HDF5 / Zarr / NIfTI (Macro)            |
                      | - SWC / MorphML (Morphometry)            |
                      | - Precomputed / Neuroglancer Shards (EM) |
                      +------------------------------------------+
```

---

## 2. Layered Responsibilities

### 2.1 Presentation Layer (Godot 4)
- **Role:** Display device outputs, capture user inputs, render UI, and manage shaders.
- **Constraints:**
  - Must contain zero anatomical domain logic or hardcoded dataset schemas.
  - Receives renderable primitive commands from the Rust core: mesh buffers, transform matrices, shader parameter tables, and instance buffers (`MultiMeshInstance3D`).
  - Reports camera frustum, viewport dimensions, screen-space error metrics, and user interactions back to the Rust core.

### 2.2 Navigation Layer (`mozok-navigation`)
- **Role:** Computes camera state across astronomical and microscopic zoom ranges.
- **Floating Origin Manager:** Translates the local origin of the scene graph whenever the camera moves beyond a configured threshold ($\Delta d$), preventing precision degradation in the 32-bit GPU vertex pipeline.
- **Hierarchical LOD Evaluator:** Given the camera field of view, distance, and maximum acceptable screen-space error (SSE), determines which nodes of the spatial Octree must be refined, rendered, or culled.

### 2.3 Streaming Layer (`mozok-streaming`)
- **Role:** Out-of-core chunk fetcher and memory governor.
- **Architecture:**
  - **Budget Governor:** Enforces hard caps on RAM (e.g., 1.5 GB on mobile, 4 GB on desktop) and VRAM.
  - **Priority Task Queue:** Prioritizes chunks closest to the camera center-of-gaze using spatial Hilbert/Morton curves.
  - **Asynchronous Worker Pool:** Decouples file I/O and decompression (gzip, blosc, zstd) from rendering frames.
  - **Eviction Strategy:** Dual-stage Least Recently Used (LRU) with predictive prefetching along camera trajectory vectors.

### 2.4 Atlas & Ontology Layer (`mozok-atlas`)
- **Role:** Topological knowledge graph and coordinate space broker.
- **Supported Reference Spaces:**
  - MNI152 (Montreal Neurological Institute standard space)
  - Talairach coordinate space
  - Allen Mouse/Human Reference Atlas Space (CCF)
- **Hierarchical Tree Structure:**
  Structures are represented as directed acyclic graphs (DAGs) representing ontology relationships (e.g., *Precentral Gyrus $\subset$ Frontal Lobe $\subset$ Telencephalon $\subset$ Forebrain*).

### 2.5 Search Engine (`mozok-search`)
- **Role:** Fast anatomical query interface.
- **Features:** Substring matching, synonym resolution (e.g., *Broca's area* $\leftrightarrow$ *Brodmann area 44/45*), and spatial reverse-geocoding (coordinate $\to$ structure ID).

### 2.6 Core Primitives (`mozok-core`)
- **Role:** Primitive data types, SIMD-accelerated math, bounding volume hierarchies (AABB, OBB, Bounding Spheres), and custom allocation arenas.

---

## 3. Communication Interface: Godot $\longleftrightarrow$ Rust (GDExtension)

The bridge between Godot and Rust uses `godot-rust` (via GDExtension C-ABI bindings):
1. **Low Frequency Control Plane:**
   - Property inspection, configuration, user toggle events, selection requests.
   - Handled via GDExtension method invocations.
2. **High Frequency Data Plane:**
   - Raw vertex/index arrays, instance transform arrays, and direct buffer writes.
   - Bypasses variant boxing where possible, passing raw slice pointers directly into Godot `RenderingServer` or `ArrayMesh` buffers to eliminate serialization overhead.

---

## 4. Scalability & Future Extensibility

- **Dataset Abstraction:** Every dataset implements the `BrainDatasetReader` trait, allowing zero-friction addition of new file formats (NIfTI-1/2, Gifti, SWC, HDF5, Neuroglancer Precomputed, OME-Zarr).
- **Disease Simulation Pipeline:** Future disease modules tap into the streaming pipeline via dynamic shader attributes and morphological degradation filters without requiring engine re-architecture.
