//! High-precision 64-bit spatial coordinate representations and neuro-spatial scales.

/// 3D Point represented in 64-bit floating point for millimeter-to-nanometer stability.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Point3D {
    pub x: f64,
    pub y: f64,
    pub z: f64,
}

impl Point3D {
    pub const ORIGIN: Self = Self { x: 0.0, y: 0.0, z: 0.0 };

    pub fn new(x: f64, y: f64, z: f64) -> Self {
        Self { x, y, z }
    }

    pub fn distance_to(&self, other: &Point3D) -> f64 {
        let dx = self.x - other.x;
        let dy = self.y - other.y;
        let dz = self.z - other.z;
        (dx * dx + dy * dy + dz * dz).sqrt()
    }

    pub fn to_local_origin(&self, origin: &Point3D) -> Vec3D {
        Vec3D {
            x: self.x - origin.x,
            y: self.y - origin.y,
            z: self.z - origin.z,
        }
    }
}

/// 3D Directional Vector
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Vec3D {
    pub x: f64,
    pub y: f64,
    pub z: f64,
}

impl Vec3D {
    pub fn new(x: f64, y: f64, z: f64) -> Self {
        Self { x, y, z }
    }

    pub fn length(&self) -> f64 {
        (self.x * self.x + self.y * self.y + self.z * self.z).sqrt()
    }

    pub fn normalize(&self) -> Self {
        let len = self.length();
        if len > 0.0 {
            Self {
                x: self.x / len,
                y: self.y / len,
                z: self.z / len,
            }
        } else {
            *self
        }
    }
}

/// Standard Neuroanatomical Coordinate Frames
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum CoordinateFrame {
    /// Montreal Neurological Institute standard stereotaxic space (millimeter)
    MNI152,
    /// Talairach & Tournoux stereotaxic space
    Talairach,
    /// Common Coordinate Framework (Allen Institute)
    AllenCCF,
    /// Arbitrary physical microscope space (micrometers / nanometers)
    MicroscopicPhysical,
}

/// Continuous spatial hierarchy levels
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub enum SpatialScale {
    /// Whole brain hemisphere envelopes (10^-1 m)
    MacroWholeBrain,
    /// Lobes, main gyri and sulci (10^-2 m)
    MacroLobes,
    /// Subcortical nuclei, hippocampus, amygdala (10^-3 m)
    MesoStructures,
    /// Cortical columns and laminar bands (10^-4 m)
    MesoTissue,
    /// Neuronal somas and dendritic trees (10^-5 m)
    MicroNeurons,
    /// Synaptic vesicles, postsynaptic densities (10^-7 to 10^-9 m)
    MicroSynapses,
}
