//! MOZOK Core Primitive Types and Math
//!
//! Provides the foundational coordinate types, floating-origin arithmetic,
//! spatial bounding volumes, and dataset abstraction traits.

pub mod bounds;
pub mod coords;
pub mod dataset;

pub use bounds::{BoundingSphere, AABB};
pub use coords::{CoordinateFrame, Point3D, SpatialScale, Vec3D};
pub use dataset::{BrainDatasetReader, DatasetMetadata};
