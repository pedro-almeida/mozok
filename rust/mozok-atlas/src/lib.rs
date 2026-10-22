//! MOZOK Atlas & Neuro-Ontology Subsystem
//!
//! Provides Directed Acyclic Graph (DAG) structures for anatomical region hierarchies,
//! standardized ontological IDs, and spatial volume references.

pub mod ontology;
pub mod region;

pub use ontology::{OntologyTree, BrainRegionNode};
pub use region::{AnatomicalRegion, Hemisphere};
