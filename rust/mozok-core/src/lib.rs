//! MOZOK Core Primitive Types and Math
//!
//! Provides the foundational coordinate types, floating-origin arithmetic,
//! spatial bounding volumes, and dataset abstraction traits.

pub mod coords;
pub mod bounds;
pub mod dataset;

pub use coords::{Point3D, Vec3D, CoordinateFrame, SpatialScale};
pub use bounds::{AABB, BoundingSphere};
pub use dataset::{BrainDatasetReader, DatasetMetadata};
