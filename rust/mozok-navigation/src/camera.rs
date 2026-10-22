//! 6-DOF Multi-scale Camera and floating-origin translation.

use mozok_core::coords::{Point3D, Vec3D};

#[derive(Debug, Clone)]
pub struct NeuroCamera {
    /// Absolute world-space position in 64-bit precision (millimeters)
    pub world_position: Point3D,
    /// Active orbital/focal target point in world coordinates (MNI space)
    pub target: Point3D,
    /// Distance from camera to target in millimeters (spans 500 mm down to nanometers)
    pub distance_mm: f64,
    /// Horizontal orbit angle in radians
    pub yaw_rad: f64,
    /// Vertical orbit angle in radians (clamped to prevent gimbal lock)
    pub pitch_rad: f64,
    /// Minimum allowed navigation distance (0.00005 mm = 50 nm)
    pub min_distance_mm: f64,
    /// Maximum allowed navigation distance (500.0 mm = 0.5 m)
    pub max_distance_mm: f64,
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
        let target = Point3D::ORIGIN;
        let distance_mm = 250.0;
        let yaw_rad = 0.0;
        let pitch_rad = 0.0;
        let min_distance_mm = 0.00005; // 50 nanometers
        let max_distance_mm = 500.0; // 0.5 meter

        let mut cam = Self {
            world_position: Point3D::new(0.0, 0.0, distance_mm),
            target,
            distance_mm,
            yaw_rad,
            pitch_rad,
            min_distance_mm,
            max_distance_mm,
            forward: Vec3D::new(0.0, 0.0, -1.0),
            up: Vec3D::new(0.0, 1.0, 0.0),
            floating_origin: Point3D::ORIGIN,
            origin_recenter_threshold: 50.0,
        };
        cam.update_vectors_from_spherical();
        cam
    }
}

impl NeuroCamera {
    pub fn new(pos: Point3D) -> Self {
        let dist = pos.distance_to(&Point3D::ORIGIN);
        let mut cam = Self {
            world_position: pos,
            distance_mm: dist.max(0.00005),
            ..Default::default()
        };
        cam.update_vectors_from_spherical();
        cam
    }

    /// Internal update converting spherical yaw/pitch/distance around target to world_position & direction
    fn update_vectors_from_spherical(&mut self) {
        let cos_pitch = self.pitch_rad.cos();
        let sin_pitch = self.pitch_rad.sin();
        let cos_yaw = self.yaw_rad.cos();
        let sin_yaw = self.yaw_rad.sin();

        // Direction from target to camera eye
        let dir_x = sin_yaw * cos_pitch;
        let dir_y = sin_pitch;
        let dir_z = cos_yaw * cos_pitch;

        self.world_position = Point3D::new(
            self.target.x + dir_x * self.distance_mm,
            self.target.y + dir_y * self.distance_mm,
            self.target.z + dir_z * self.distance_mm,
        );

        self.forward = Vec3D::new(-dir_x, -dir_y, -dir_z).normalize();
        self.up = Vec3D::new(0.0, 1.0, 0.0);
    }

    /// Continuous logarithmic zoom scaling distance multiplicatively
    pub fn zoom_logarithmic(&mut self, scroll_delta: f64) {
        // Multiplicative logarithmic step: smooth over 7 orders of magnitude
        let factor = (-scroll_delta * 0.15).exp();
        self.distance_mm =
            (self.distance_mm * factor).clamp(self.min_distance_mm, self.max_distance_mm);
        self.update_vectors_from_spherical();
    }

    /// Orbit around the current target (delta_yaw, delta_pitch in radians)
    pub fn orbit(&mut self, delta_yaw: f64, delta_pitch: f64) {
        self.yaw_rad += delta_yaw;
        // Limit pitch to prevent gimbal lock at zenith / nadir (+- 89 degrees)
        let max_pitch = 89.0_f64.to_radians();
        self.pitch_rad = (self.pitch_rad + delta_pitch).clamp(-max_pitch, max_pitch);
        self.update_vectors_from_spherical();
    }

    /// Focus camera on a new anatomical target point at an optimal viewing distance
    pub fn focus_on(&mut self, new_target: Point3D, optimal_distance_mm: f64) {
        self.target = new_target;
        self.distance_mm = optimal_distance_mm.clamp(self.min_distance_mm, self.max_distance_mm);
        self.update_vectors_from_spherical();
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
