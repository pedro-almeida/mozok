//! Spatial chunk keying and payload abstractions.

use mozok_core::bounds::AABB;

/// Unique spatial identifier for an Octree node or volumetric block
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct SpatialChunkKey {
    pub level: u8,
    pub x: u32,
    pub y: u32,
    pub z: u32,
}

impl SpatialChunkKey {
    pub fn new(level: u8, x: u32, y: u32, z: u32) -> Self {
        Self { level, x, y, z }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ChunkState {
    Unloaded,
    Queued,
    Loading,
    Ready,
    Evicted,
}

#[derive(Debug, Clone)]
pub struct ChunkPayload {
    pub key: SpatialChunkKey,
    pub bounds: AABB,
    pub byte_size: usize,
    pub data: Vec<u8>,
}
