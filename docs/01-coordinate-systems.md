# RFC 001: Coordinate Systems & Floating Origin

## 1. Scope & Challenges
MOZOK bridges macroscopic neuroanatomy ($10^{-1}\,\text{m}$) down to synaptic clefts ($10^{-9}\,\text{m}$). 
Standard 32-bit floating point IEEE 754 numbers (`f32`) have 24 bits of mantissa, providing roughly 7 decimal digits of precision. Over a distance of $0.15\,\text{m}$, precision degrades to $\sim 10^{-8}\,\text{m}$, leading to visible jittering, vertex swimming, and Z-fighting at microscopic zoom levels.

## 2. Mathematical Solution: Hierarchical Floating Origin
The core simulation runs in 64-bit precision (`f64`). 
- **World Space (`f64`):** Absolute stereotaxic coordinates (MNI152, CCFv3, physical microns).
- **Camera Anchor (`Point3D`):** When the camera moves beyond a spatial threshold ($\delta_{\text{recenter}} = 100.0\,\text{mm}$ or local cluster threshold), the engine recenters the local rendering origin:
  $$\mathbf{P}_{\text{local}} = \mathbf{P}_{\text{world}} - \mathbf{C}_{\text{origin}}$$
- **Render Space (`f32`):** Only relative vectors within the immediate view-frustum are cast to `f32` for GPU rasterization, preserving sub-millimeter and nanometer stability.

## 3. Coordinate Frames Supported
- `MNI152`: Standard human brain stereotaxic space (millimeter scale).
- `Talairach`: Classical stereotaxic reference.
- `AllenCCFv3`: Allen Institute Common Coordinate Framework (mouse and comparative models).
- `MicroscopicPhysical`: Arbitrary microtomography and serial electron microscopy (EM) bounding boxes.
