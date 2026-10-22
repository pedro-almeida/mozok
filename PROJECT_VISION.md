# MOZOK Project Vision & Manifesto

## 1. The Grand Challenge

The human brain is often described as the most complex known structure in the universe: approximately 86 billion neurons interconnected through more than 100 trillion synaptic contacts, organized across intricate spatial and functional hierarchies.

Despite decades of technological progress, exploring the brain remains fragmented:
- Neurosurgeons examine patient-specific DICOM/NIfTI volumes in 2D slices.
- Neurobiologists inspect single-cell dendritic spines in isolated confocal microscopy stacks.
- Connectomic researchers navigate terabyte-scale electron microscopy volumes via web interfaces detached from macroscopic neuroanatomy.
- Medical students memorize static 2D anatomical drawings that fail to convey true spatial relationships and depth.

**MOZOK** is created to resolve this fragmentation.

---

## 2. The Metaphor: "Google Earth for the Human Brain"

Google Earth transformed geography by uniting planetary satellite imagery, topographical elevation, street-level panoramas, and vector street maps into a singular, seamless continuum.

MOZOK applies this paradigm to neurobiology:
1. **Orbital View:** The cortical surface, gyri, sulci, and gross hemispheric architecture.
2. **Continental View:** Deep subcortical nuclei (thalamus, basal ganglia, hippocampus, amygdala), brainstem, and cerebellum.
3. **Regional View:** Cytoarchitectonic boundaries, cortical columns, and layered laminae (Layers I–VI).
4. **Neighborhood View:** Cellular clusters, microvasculature, astrocytic networks, and oligodendrocyte myelin sheaths.
5. **Street View:** Individual neuronal morphologies, axonal arborizations, dendritic arborizations, and dendritic spines.
6. **Molecular/Structural View:** The synaptic cleft, neurotransmitter receptor clusters, and postsynaptic densities.

---

## 3. Core Values & Principles

### Open Source & Public Good
Scientific knowledge belongs to humanity. MOZOK is licensed openly to guarantee that researchers, students, and institutions across the globe can access, inspect, contribute to, and build upon its foundation without paywalls or restrictive commercial licenses.

### Scientific Integrity & Precision
MOZOK is designed as an accurate scientific and medical instrument:
- Visualizations must respect validated anatomical nomenclature (e.g., Terminologia Neuroanatomica, Federative International Programme on Anatomical Terminologies).
- Coordinate systems must align with standard neuroimaging spaces (MNI152, CCFv3).
- Data abstractions must reflect physical spatial units (millimeters down to nanometers).

### Universality & Accessibility
Software that only runs on $5,000 multi-GPU workstations fails 95% of the world's students and doctors. MOZOK is engineered for high performance on accessible, consumer-tier hardware:
- Modest discrete GPUs (such as NVIDIA GTX 1650).
- Standard consumer laptops and PCs.
- Mid-range Android smartphones and tablets for distributed clinical education in developing nations.
- Modern Web browsers through WebAssembly and WebGPU.

### Extensibility & Modularity
The codebase avoids monolithic lock-in. By decoupling the Rust core from the presentation layer (Godot 4), MOZOK ensures that the platform can outlive any single rendering technology, graphics API, or UI paradigm.
