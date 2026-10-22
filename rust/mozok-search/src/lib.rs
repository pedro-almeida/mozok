//! MOZOK Anatomical Search & Query Engine
//!
//! Provides fuzzy name matching, anatomical synonym resolution, and spatial reverse-geocoding.

pub mod index;

pub use index::{SearchIndex, SearchResult};
