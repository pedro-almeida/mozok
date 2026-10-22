# MOZOK Technical Stack Specification

## 1. Core Technology Selection

| Domain | Selected Technology | Alternative Considered | Selection Rationale |
| :--- | :--- | :--- | :--- |
| **Presentation Engine** | **Godot 4.x** | Unity, Unreal Engine 5, Bevy, Three.js | Godot 4 is lightweight (~100MB editor, tiny runtime overhead), fully open-source (MIT), has zero telemetry, runs reliably on low-end hardware, supports Desktop/Android/Web, and features an official C-ABI extension mechanism (GDExtension). |
| **Domain Logic & Math** | **Rust (2021 Edition)** | C++, Zig, Python, C# | Rust provides guaranteed memory safety, no garbage collection pauses, top-tier performance, SIMD auto-vectorization, fearless multi-threading (Rayon, crossbeam), and a package ecosystem for spatial indexing. |
| **Engine Interop** | **GDExtension (godot-rust)** | GDScript, C#, Custom C FFI | GDExtension allows Rust code to compile into native dynamic libraries (`.dll`, `.so`, `.dylib`) or `.wasm` that link directly into Godot's C++ virtual methods with zero runtime VM overhead. |

---

## 2. Target Platforms & Graphics Backends

| Platform | Primary Architecture | Rendering Backend | Target Profile |
| :--- | :--- | :--- | :--- |
| **Windows** | x86_64 | Vulkan / Direct3D 12 (via Forward+) | Desktop high-fidelity / GTX 1650+ |
| **Linux** | x86_64, AArch64 | Vulkan (Forward+ or Mobile) | Desktop scientific workstations & compute nodes |
| **Android** | ARM64 (v8a, v9a) | Vulkan / OpenGL ES 3.0 (Mobile / Compatibility) | Mid-range smartphones and tablets |
| **Web** | WebAssembly (wasm32) | WebGPU / WebGL 2.0 (Compatibility) | Zero-install educational web portal |

---

## 3. Data Representation & Formats (Future Ingestion)

The project separates data interfaces from concrete file formats. Initial supported schemas will include:

1. **Macroscopic Volumetric & Surface Data:**
   - **NIfTI-1/2 (`.nii`, `.nii.gz`):** Standard neuroimaging format for anatomical MRI and voxel atlases.
   - **GIFTI (`.gii`):** Surface mesh representation for cortical geometry.
   - **Standard Mesh (`.obj`, `.gltf`):** Precomputed anatomical boundary surfaces.
2. **Microscopic Morphology Data:**
   - **SWC (`.swc`):** Standard 3D tree description format for neuronal reconstructions (soma, axon, dendrites, apical dendrites).
3. **Ultra-Scale Out-of-Core Volumes:**
   - **Neuroglancer Precomputed:** Multi-resolution chunked image and segmentation format.
   - **OME-Zarr / Zarr:** Cloud-optimized multi-scale bioimaging format.

---

## 4. Hardware Optimization Strategy

To maintain smooth 60 FPS performance on modest hardware:
- **Spatial Octree & Chunk Culling:** Non-visible or occluded structures are never dispatched to the GPU.
- **Hierarchical Level of Detail (HLOD):** Structures far from the camera render simplified proxy hulls; deep structures render progressively as the camera nears.
- **GPU Instancing:** Millions of repetitive cylindrical segments in axonal and dendritic branches are rendered using hardware instancing (`MultiMeshInstance3D`) instead of individual mesh nodes.
- **Asynchronous Decompression:** Chunk decoding runs on background worker threads via Rust, preventing frame drops on the main render thread.
