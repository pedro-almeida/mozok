//! MOZOK GDExtension Entry Point & Bridge
//! Exposes the sovereign Rust neurobiology and LOD engine to the Godot 4 scene graph.

use godot::prelude::*;
use mozok_core::coords::Point3D;
use mozok_navigation::camera::NeuroCamera;

struct MozokExtension;

#[gdextension]
unsafe impl ExtensionLibrary for MozokExtension {}

/// Custom Node3D providing high-precision coordinates, continuous zoom, and LOD streaming.
#[derive(GodotClass)]
#[class(base = Node3D)]
pub struct MozokViewerController {
    base: Base<Node3D>,
    camera: Option<NeuroCamera>,
}

#[godot_api]
impl INode3D for MozokViewerController {
    fn init(base: Base<Node3D>) -> Self {
        godot_print!("[MOZOK] Native GDExtension initialized successfully.");
        Self {
            base,
            camera: Some(NeuroCamera::new(Point3D::new(0.0, 0.0, 200.0))),
        }
    }

    fn process(&mut self, _delta: f64) {
        if let Some(cam) = &mut self.camera {
            if cam.needs_origin_recenter() {
                let shift = cam.recenter_origin();
                godot_print!("[MOZOK] Floating origin recentered by delta: {:?}", shift);
            }
        }
    }
}
