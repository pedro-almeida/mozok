//! MOZOK Navigation & Continuous Zoom Subsystem
//!
//! Handles 6-DOF camera math, floating origin management for micro-scale stability,
//! and screen-space error (SSE) hierarchical Level of Detail (LOD) selection.

pub mod camera;
pub mod lod;

pub use camera::{NeuroCamera, CameraFrustum};
pub use lod::{LodSelector, LodEvaluation};
