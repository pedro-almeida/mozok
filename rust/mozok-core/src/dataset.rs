//! Biological and anatomical dataset abstractions.
//! Allows zero-cost decoupling from specific scientific data formats (NIfTI, SWC, Zarr, DICOM, etc.)
//! Supports rigorous scientific provenance, DOIs, and multi-system human biology.

use crate::bounds::AABB;
use crate::coords::{CoordinateFrame, SpatialScale};

/// Categorization of human anatomical and physiological systems.
/// "The brain is only the beginning."
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum BiologicalSystemKind {
    /// Central and Peripheral Nervous System (Pilot Module)
    Nervous,
    /// Heart, vasculature, and hemodynamics
    Cardiovascular,
    /// Lungs, bronchial tree, and gas exchange
    Respiratory,
    /// Gastrointestinal tract, liver, and pancreas
    Digestive,
    /// Skeleton, joints, and musculature
    Musculoskeletal,
    /// Pituitary, thyroid, adrenal, and endocrine signaling
    Endocrine,
    /// Lymph nodes, spleen, and cellular immune system
    Lymphatic,
    /// Reproductive organs and embryological development
    Reproductive,
    /// Fundamental cellular and sub-cellular organelle biology
    CellularMolecular,
}

/// Scientific provenance ensuring factual traceability (Kantian duty of truth).
#[derive(Debug, Clone)]
pub struct ScientificProvenance {
    /// Digital Object Identifier (e.g. "10.1038/s41586-021-03950-0")
    pub doi: Option<String>,
    /// Authors, laboratory, or research consortium
    pub authors: String,
    /// Year of publication or dataset curation
    pub year: u16,
    /// Primary literature reference / publication title
    pub citation: String,
    /// Open data license (e.g. "CC-BY-4.0", "CC0", "Open Data Commons")
    pub license: String,
    /// Biological specimen context (e.g. "Post-mortem human, male, 45y, fixation 4% PFA")
    pub specimen_context: String,
    /// Peer-review scientific validation status
    pub is_peer_reviewed: bool,
}

#[derive(Debug, Clone)]
pub struct DatasetMetadata {
    pub name: String,
    pub description: String,
    pub system_kind: BiologicalSystemKind,
    pub frame: CoordinateFrame,
    pub bounds: AABB,
    pub native_scale: SpatialScale,
    pub resolution_um: f64,
    pub provenance: Option<ScientificProvenance>,
}

/// Universal interface for out-of-core biological dataset access across all human organ systems.
pub trait BiologicalDatasetReader: Send + Sync {
    /// Retrieve dataset header, bounding volume, and scientific provenance metadata
    fn metadata(&self) -> &DatasetMetadata;

    /// Test if a spatial bounding box intersects valid dataset domains
    fn intersects(&self, region: &AABB) -> bool {
        let b = &self.metadata().bounds;
        !(region.max.x < b.min.x
            || region.min.x > b.max.x
            || region.max.y < b.min.y
            || region.min.y > b.max.y
            || region.max.z < b.min.z
            || region.min.z > b.max.z)
    }

    /// Read raw byte chunks or streaming structures for a spatial region
    fn read_chunk(&self, chunk_id: u64) -> Result<Vec<u8>, String>;
}

/// Backwards-compatible alias for the pilot module
pub trait BrainDatasetReader: BiologicalDatasetReader {}
impl<T: BiologicalDatasetReader> BrainDatasetReader for T {}
