//! Brain dataset abstractions.
//! Allows zero-cost decoupling from specific neuroimaging formats (NIfTI, SWC, Zarr, etc.)

use crate::bounds::AABB;
use crate::coords::{CoordinateFrame, SpatialScale};

#[derive(Debug, Clone)]
pub struct DatasetMetadata {
    pub name: String,
    pub description: String,
    pub frame: CoordinateFrame,
    pub bounds: AABB,
    pub native_scale: SpatialScale,
    pub resolution_um: f64,
}

/// Core interface for out-of-core neuroimaging dataset access
pub trait BrainDatasetReader: Send + Sync {
    /// Retrieve dataset header and bounding volume metadata
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
