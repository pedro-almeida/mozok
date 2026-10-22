//! MOZOK Living Physiology Subsystem
//!
//! Encompasses macroscopic Cerebrospinal Fluid (CSF) ventricular hydrodynamics,
//! perivascular glymphatic clearance, and micro/nanoscale active synaptic neurotransmission.

pub mod csf;
pub mod synapse;

pub use csf::{CsfBiomarkers, CsfHydrodynamics, VentricularCompartment};
pub use synapse::SynapticCleftState;
