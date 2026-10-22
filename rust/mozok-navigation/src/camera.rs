//! 6-DOF Multi-scale Camera and floating-origin translation.

use mozok_core::coords::{Point3D, Vec3D};

#[derive(Debug, Clone)]
pub struct NeuroCamera {
    /// Absolute world-space position in 64-bit precision (millimeters)
    pub world_position: Point3D,
    /// Forward directional orientation vector
    pub forward: Vec3D,
    /// Up vector
    pub up: Vec3D,
    /// Active local origin offset for 32-bit GPU rendering stabilization
    pub floating_origin: Point3D,
    /// Maximum distance threshold before the floating origin shifts
    pub origin_recenter_threshold: f64,
}

impl Default for NeuroCamera {
    fn default() -> Self {
        Self {
            world_position: Point3D::new(0.0, 0.0, 250.0),
            forward: Vec3D::new(0.0, 0.0, -1.0),
            up: Vec3D::new(0.0, 1.0, 0.0),
            floating_origin: Point3D::ORIGIN,
            origin_recenter_threshold: 50.0,
        }
    }
}

impl NeuroCamera {
    pub fn new(pos: Point3D) -> Self {
        Self {
            world_position: pos,
            ..Default::default()
        }
    }

    /// Check if camera has drifted far enough from the floating origin to warrant recentering
    pub fn needs_origin_recenter(&self) -> bool {
        self.world_position.distance_to(&self.floating_origin) > self.origin_recenter_threshold
    }

    /// Recenter floating origin to current world position, returning the delta
    pub fn recenter_origin(&mut self) -> Vec3D {
        let delta = self.world_position.to_local_origin(&self.floating_origin);
        self.floating_origin = self.world_position;
        delta
    }

    /// Get position relative to the floating origin for GPU vertex buffers
    pub fn local_render_position(&self) -> Vec3D {
        self.world_position.to_local_origin(&self.floating_origin)
    }
}

#[derive(Debug, Clone)]
pub struct CameraFrustum {
    pub fov_degrees: f64,
    pub aspect_ratio: f64,
    pub near_plane: f64,
    pub far_plane: f64,
}
