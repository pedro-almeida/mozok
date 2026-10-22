# RFC 002: Spatial Octree Streaming & Hierarchical LOD

## 1. Principles
Full human brain connectomes or ultra-high-resolution volumetric histologies exceed hundreds of gigabytes or terabytes. The system strictly forbids loading monolithic assets into system RAM or VRAM.

## 2. Screen-Space Error (SSE) Metric
Selection between level-of-detail tiers follows an explicit projective geometric error bound:
$$\text{SSE} = \frac{\delta \cdot H}{2 \cdot D \cdot \tan(\theta / 2)}$$
Where:
- $\delta$: Maximum geometric deviation / voxel resolution in world space.
- $H$: Viewport vertical pixel resolution.
- $D$: Euclidean distance between camera and bounding volume center.
- $\theta$: Camera vertical Field of View (FOV).

If $\text{SSE} > \tau$ (threshold, default $4.0$ pixels), the node must be refined into its sub-chunks; if $\text{SSE} \le \tau$, the current LOD level is rendered.

## 3. LRU Bounded Cache Governor
`ChunkCacheGovernor` in `mozok-streaming` enforces a strict memory ceiling (e.g. 512 MB on Android, 2 GB on GTX 1650). When budget is exceeded, least recently requested spatial chunks are pruned asynchronously without stalling the rendering thread.
