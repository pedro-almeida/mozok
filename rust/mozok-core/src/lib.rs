//! MOZOK Core Primitive Types and Math
//!
//! Provides the foundational coordinate types, floating-origin arithmetic,
//! spatial bounding volumes, dataset abstraction traits, and scientific provenance schemas.

pub mod bounds;
pub mod coords;
pub mod dataset;

pub use bounds::{BoundingSphere, AABB};
pub use coords::{CoordinateFrame, Point3D, SpatialScale, Vec3D};
pub use dataset::{
    BiologicalDatasetReader, BiologicalSystemKind, BrainDatasetReader, DatasetMetadata,
    ScientificProvenance,
};
