//! MOZOK Multi-Scale Pathophysiology & Disease Simulation Engine.
//!
//! Provides mathematical models of progressive neurological disorders, featuring
//! Creutzfeldt-Jakob Disease (Prion Heterodimer & Network Diffusion), alongside
//! baseline definitions for Alzheimer's Disease and Parkinson's Disease.

pub mod prion_cjd;

pub use prion_cjd::{CjdSimulator, RegionPathologyState};

/// Major neurological disease processes modeled by MOZOK
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum DiseaseKind {
    /// Physiological baseline
    Healthy,
    /// Creutzfeldt-Jakob Disease (Prion PrP^Sc spongiform encephalopathy)
    CreutzfeldtJakobPrion,
    /// Alzheimer's Disease (Extracellular Amyloid-beta & Intracellular Hyperphosphorylated Tau)
    AlzheimersTauAmyloid,
    /// Parkinson's Disease (Alpha-synuclein Lewy body pathology in Substantia Nigra)
    ParkinsonsAlphaSynuclein,
}
