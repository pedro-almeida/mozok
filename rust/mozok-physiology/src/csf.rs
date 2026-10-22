//! Cerebrospinal Fluid (CSF), Ventricular Hydrodynamics, and Perivascular Glymphatic Dynamics.
//!
//! Models pulsatile flow driven by cardiac and respiratory cycles,
//! Aquaporin-4 (AQP4) mediated metabolic clearance, and neurodegenerative diagnostic biomarkers.

use std::f64::consts::PI;

/// Ventricular system and subarachnoid anatomical compartments
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum VentricularCompartment {
    LateralVentricles,
    ForamenOfMonro,
    ThirdVentricle,
    CerebralAqueductOfSylvius,
    FourthVentricle,
    SubarachnoidCisterns,
    PerivascularVirchowRobin,
}

/// Clinical and biochemical CSF biomarkers
#[derive(Debug, Clone)]
pub struct CsfBiomarkers {
    /// Opening lumbar pressure in cm H2O (normal reference: 10.0–20.0, avg ~12.0–15.0)
    pub pressure_cm_h2o: f64,
    /// CSF production rate in mL/day by choroid plexus (normal: ~500.0)
    pub production_rate_ml_day: f64,
    /// Astrocytic endfeet Aquaporin-4 clearance efficiency (0.0 = completely clogged; 1.0 = optimal)
    pub glymphatic_aqp4_efficiency: f64,
    /// 14-3-3 protein concentration in ng/mL (normal < 1.0; marked elevation > 2.0 in rapid prion neurolysis)
    pub protein_14_3_3_ng_ml: f64,
    /// Total Tau protein in pg/mL (normal < 300.0; massive surge > 4000.0 in Creutzfeldt-Jakob Disease)
    pub total_tau_pg_ml: f64,
    /// Real-Time Quaking-Induced Conversion (RT-QuIC) prion amyloid seeding assay
    pub rt_quic_prion_positive: bool,
}

impl Default for CsfBiomarkers {
    fn default() -> Self {
        Self {
            pressure_cm_h2o: 13.5,
            production_rate_ml_day: 500.0,
            glymphatic_aqp4_efficiency: 1.0,
            protein_14_3_3_ng_ml: 0.4,
            total_tau_pg_ml: 180.0,
            rt_quic_prion_positive: false,
        }
    }
}

/// Pulsatile hydrodynamics and flow velocity solver
#[derive(Debug, Clone)]
pub struct CsfHydrodynamics {
    pub time_sec: f64,
    /// Cardiac frequency in Hz (default 1.1 Hz ~ 66 bpm)
    pub heart_rate_hz: f64,
    /// Respiratory frequency in Hz (default 0.25 Hz ~ 15 breaths/min)
    pub respiratory_rate_hz: f64,
    pub biomarkers: CsfBiomarkers,
}

impl Default for CsfHydrodynamics {
    fn default() -> Self {
        Self {
            time_sec: 0.0,
            heart_rate_hz: 1.1,
            respiratory_rate_hz: 0.25,
            biomarkers: CsfBiomarkers::default(),
        }
    }
}

impl CsfHydrodynamics {
    pub fn new() -> Self {
        Self::default()
    }

    /// Advance time in seconds for pulsatile waveforms
    pub fn step(&mut self, dt_sec: f64) {
        self.time_sec += dt_sec;
    }

    /// Instantaneous flow velocity in mm/s based on Navier-Stokes/Windkessel pulsatile proxy:
    /// v(t) = v_basal + A_card * sin(2*pi*f_c*t) + A_resp * sin(2*pi*f_r*t)
    pub fn instantaneous_flow_velocity_mm_s(&self, compartment: VentricularCompartment) -> f64 {
        let (v_basal, a_card, a_resp) = match compartment {
            VentricularCompartment::LateralVentricles => (1.2, 0.8, 0.4),
            VentricularCompartment::ForamenOfMonro => (8.0, 5.0, 2.0),
            VentricularCompartment::ThirdVentricle => (4.5, 3.0, 1.2),
            VentricularCompartment::CerebralAqueductOfSylvius => (32.0, 18.0, 7.0),
            VentricularCompartment::FourthVentricle => (6.0, 4.0, 1.8),
            VentricularCompartment::SubarachnoidCisterns => (2.5, 1.5, 0.8),
            VentricularCompartment::PerivascularVirchowRobin => (0.4, 0.3, 0.2),
        };

        let card_wave = (2.0 * PI * self.heart_rate_hz * self.time_sec).sin();
        let resp_wave = (2.0 * PI * self.respiratory_rate_hz * self.time_sec).sin();

        // Modulated by glymphatic clearance efficiency
        let efficiency_mod = 0.5 + 0.5 * self.biomarkers.glymphatic_aqp4_efficiency;

        (v_basal + a_card * card_wave + a_resp * resp_wave) * efficiency_mod
    }
}
