//! Anatomical region descriptors and hemispheric lateralization.

use mozok_core::bounds::AABB;
use mozok_core::coords::SpatialScale;

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
    pub color_rgb: [u8; 3],
}

impl AnatomicalRegion {
    pub fn new(id: u32, acronym: impl Into<String>, name: impl Into<String>, hemisphere: Hemisphere) -> Self {
        Self {
            id,
            acronym: acronym.into(),
            name: name.into(),
            hemisphere,
            scale_tier: SpatialScale::MacroLobes,
            bounding_box: None,
            color_rgb: [128, 128, 128],
        }
    }
}
