//! Hierarchical Level of Detail (LOD) and Screen-Space Error (SSE) evaluation.

use mozok_core::bounds::BoundingSphere;
use mozok_core::coords::SpatialScale;
use crate::camera::NeuroCamera;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum LodEvaluation {
    /// Node is too coarse; refine children
    Refine,
    /// Node detail is optimal; render this level
    Render,
    /// Node is outside frustum or sub-pixel; cull completely
    Cull,
}

pub struct LodSelector {
    /// Maximum allowed geometric error in screen pixels before refinement is triggered
    pub max_screen_space_error: f64,
    pub viewport_height_px: f64,
}

impl Default for LodSelector {
    fn default() -> Self {
        Self {
            max_screen_space_error: 4.0, // 4 pixels default tolerance
            viewport_height_px: 1080.0,
        }
    }
}

impl LodSelector {
    pub fn new(max_sse: f64, viewport_h: f64) -> Self {
        Self {
            max_screen_space_error: max_sse,
            viewport_height_px: viewport_h,
        }
    }

    /// Evaluates if a bounding sphere should be refined, rendered, or culled
    pub fn evaluate(&self, camera: &NeuroCamera, sphere: &BoundingSphere, geometric_error_mm: f64) -> LodEvaluation {
        let distance = camera.world_position.distance_to(&sphere.center) - sphere.radius;
        if distance <= 0.0 {
            // Camera is inside or penetrating the bounding volume
            return LodEvaluation::Refine;
        }

        // Project geometric error onto viewport screen pixels
        // SSE = (geometric_error / distance) * (viewport_height / (2 * tan(fov / 2)))
        let sse = (geometric_error_mm / distance) * self.viewport_height_px;

        if sse < 0.5 {
            LodEvaluation::Cull
        } else if sse > self.max_screen_space_error {
            LodEvaluation::Refine
        } else {
            LodEvaluation::Render
        }
    }

    /// Resolve nominal SpatialScale from physical viewing distance (in mm)
    pub fn resolve_scale_tier(&self, distance_mm: f64) -> SpatialScale {
        if distance_mm > 150.0 {
            SpatialScale::MacroWholeBrain
        } else if distance_mm > 50.0 {
            SpatialScale::MacroLobes
        } else if distance_mm > 10.0 {
            SpatialScale::MesoStructures
        } else if distance_mm > 1.0 {
            SpatialScale::MesoTissue
        } else if distance_mm > 0.05 {
            SpatialScale::MicroNeurons
        } else {
            SpatialScale::MicroSynapses
        }
    }
}
