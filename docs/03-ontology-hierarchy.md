# RFC 003: Multi-Scale Biological Ontology & Indexing

## 1. Domain Separation
Unlike game engines where meshes are arbitrary assets, in MOZOK every spatial entity corresponds to a typed anatomical or biological concept.

## 2. DAG Ontology Graph (`mozok-atlas`)
Anatomical structures do not form a strict single tree; a cortical area can be categorized both by gross topology (Frontal Lobe $\rightarrow$ Precentral Gyrus) and by functional network (Sensorimotor Network).
- Nodes contain standard ontology IDs (Uberon, NeuroNames, TA2).
- Relationships: `part_of`, `connects_to`, `innervates`, `supplied_by`.
- Bi-directional index linking geometry chunks with semantic tags.

## 3. Real-Time Search & Annotation (`mozok-search`)
The in-memory inverted index allows sub-millisecond query resolution for Latin nomenclature, common English names, anatomical abbreviations (e.g. "FL", "M1", "PFC") and cross-lingual synonyms.
