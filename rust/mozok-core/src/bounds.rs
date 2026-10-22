//! Axis-Aligned Bounding Boxes (AABB) and Bounding Spheres for spatial culling.

use crate::coords::Point3D;

#[derive(Debug, Clone, Copy, PartialEq)]
pub struct AABB {
    pub min: Point3D,
    pub max: Point3D,
}

impl AABB {
    pub fn new(min: Point3D, max: Point3D) -> Self {
        Self { min, max }
    }

    pub fn center(&self) -> Point3D {
        Point3D {
            x: (self.min.x + self.max.x) * 0.5,
            y: (self.min.y + self.max.y) * 0.5,
            z: (self.min.z + self.max.z) * 0.5,
        }
    }

    pub fn extents(&self) -> Point3D {
        Point3D {
            x: (self.max.x - self.min.x) * 0.5,
            y: (self.max.y - self.min.y) * 0.5,
            z: (self.max.z - self.min.z) * 0.5,
        }
    }

    pub fn contains(&self, p: &Point3D) -> bool {
        p.x >= self.min.x
            && p.x <= self.max.x
            && p.y >= self.min.y
            && p.y <= self.max.y
            && p.z >= self.min.z
            && p.z <= self.max.z
    }
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub struct BoundingSphere {
    pub center: Point3D,
    pub radius: f64,
}

impl BoundingSphere {
    pub fn new(center: Point3D, radius: f64) -> Self {
        Self { center, radius }
    }

    pub fn intersects(&self, other: &BoundingSphere) -> bool {
        let dist = self.center.distance_to(&other.center);
        dist <= (self.radius + other.radius)
    }
}
