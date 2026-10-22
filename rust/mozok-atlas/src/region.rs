//! Anatomical region descriptors, coordinates, and scientific provenance.

use mozok_core::bounds::AABB;
use mozok_core::coords::{Point3D, SpatialScale};
use mozok_core::dataset::ScientificProvenance;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Hemisphere {
    Left,
    Right,
    Bilateral,
    Midline,
}

#[derive(Debug, Clone)]
pub struct AnatomicalRegion {
    pub id: u32,
    pub acronym: String,
    pub name: String,
    pub hemisphere: Hemisphere,
    pub scale_tier: SpatialScale,
    pub bounding_box: Option<AABB>,
    pub center_mni: Point3D,
    pub optimal_view_distance_mm: f64,
    pub provenance: Option<ScientificProvenance>,
    pub color_rgb: [u8; 3],
}

impl AnatomicalRegion {
    pub fn new(
        id: u32,
        acronym: impl Into<String>,
        name: impl Into<String>,
        hemisphere: Hemisphere,
    ) -> Self {
        Self {
            id,
            acronym: acronym.into(),
            name: name.into(),
            hemisphere,
            scale_tier: SpatialScale::MacroLobes,
            bounding_box: None,
            center_mni: Point3D::ORIGIN,
            optimal_view_distance_mm: 50.0,
            provenance: None,
            color_rgb: [128, 128, 128],
        }
    }

    pub fn with_coordinates(
        mut self,
        center: Point3D,
        radius_mm: f64,
        scale: SpatialScale,
    ) -> Self {
        self.center_mni = center;
        self.scale_tier = scale;
        self.bounding_box = Some(AABB::new(
            Point3D::new(
                center.x - radius_mm,
                center.y - radius_mm,
                center.z - radius_mm,
            ),
            Point3D::new(
                center.x + radius_mm,
                center.y + radius_mm,
                center.z + radius_mm,
            ),
        ));
        self
    }

    pub fn with_optimal_distance(mut self, distance_mm: f64) -> Self {
        self.optimal_view_distance_mm = distance_mm;
        self
    }

    pub fn with_provenance(mut self, prov: ScientificProvenance) -> Self {
        self.provenance = Some(prov);
        self
    }

    pub fn with_color(mut self, r: u8, g: u8, b: u8) -> Self {
        self.color_rgb = [r, g, b];
        self
    }
}
