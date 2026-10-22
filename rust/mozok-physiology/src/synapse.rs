//! Micro/Nanoscale Active Synaptic Neurotransmission.
//!
//! Models calcium-mediated vesicular exocytosis, neurotransmitter release across the 20 nm cleft,
//! AMPA/NMDA postsynaptic conductance, and synaptic toxicity degradation.

#[derive(Debug, Clone)]
pub struct SynapticCleftState {
    /// Cleft width in nanometers (physiological baseline: 20.0 nm)
    pub cleft_width_nm: f64,
    /// Readily releasable presynaptic vesicle pool count
    pub presynaptic_vesicle_pool: u32,
    /// Presynaptic free calcium concentration in micromoles (µmol)
    pub calcium_influx_umol: f64,
    /// Cleft glutamate concentration in micromoles (µmol)
    pub glutamate_concentration_umol: f64,
    /// Postsynaptic AMPA/NMDA receptor conductance (0.0 = closed/desensitized; 1.0 = fully open)
    pub postsynaptic_ampa_nmda_conductance: f64,
    /// Structural synaptic integrity (1.0 = pristine healthy spine; 0.0 = completely degraded/ablated)
    pub structural_integrity: f64,
}

impl Default for SynapticCleftState {
    fn default() -> Self {
        Self {
            cleft_width_nm: 20.0,
            presynaptic_vesicle_pool: 200,
            calcium_influx_umol: 0.1,
            glutamate_concentration_umol: 0.0,
            postsynaptic_ampa_nmda_conductance: 0.0,
            structural_integrity: 1.0,
        }
    }
}

impl SynapticCleftState {
    pub fn new() -> Self {
        Self::default()
    }

    /// Trigger an action potential arrival at the presynaptic terminal
    pub fn trigger_action_potential(&mut self) {
        if self.structural_integrity < 0.1 || self.presynaptic_vesicle_pool == 0 {
            return;
        }

        // Action potential triggers transient calcium influx through voltage-gated Ca2+ channels
        self.calcium_influx_umol += 12.0 * self.structural_integrity;

        // Vesicles fuse and exocytose neurotransmitter
        let released =
            (5.0 * self.structural_integrity).min(self.presynaptic_vesicle_pool as f64) as u32;
        self.presynaptic_vesicle_pool = self.presynaptic_vesicle_pool.saturating_sub(released);

        // Instantaneous glutamate pulse in the narrow synaptic cleft (~1000 µmol peak)
        self.glutamate_concentration_umol += released as f64 * 200.0;
    }

    /// Step synaptic kinetics, glutamate reuptake/diffusion (EAAT), and neurodegenerative toxicity
    pub fn step_kinetics(&mut self, dt_sec: f64, prion_toxicity: f64) {
        // Fast calcium clearance by pumps and buffers (tau ~ 2 ms)
        let ca_decay = (-dt_sec / 0.002).exp();
        self.calcium_influx_umol = (self.calcium_influx_umol - 0.1) * ca_decay + 0.1;

        // Astrocytic and neuronal glutamate clearance via EAAT transporters (tau ~ 1.5 ms)
        let glu_decay = (-dt_sec / 0.0015).exp();
        self.glutamate_concentration_umol *= glu_decay;

        // Postsynaptic conductance responds to glutamate concentration, gated by structural integrity
        let target_conductance = (self.glutamate_concentration_umol
            / (self.glutamate_concentration_umol + 100.0))
            * self.structural_integrity;
        let cond_rate = 1.0 - (-dt_sec / 0.003).exp();
        self.postsynaptic_ampa_nmda_conductance +=
            (target_conductance - self.postsynaptic_ampa_nmda_conductance) * cond_rate;

        // Slow vesicle pool replenishment
        if self.presynaptic_vesicle_pool < 200 {
            let refill = (dt_sec * 10.0 * self.structural_integrity) as u32;
            self.presynaptic_vesicle_pool =
                (self.presynaptic_vesicle_pool + refill.max(1)).min(200);
        }

        // Structural degradation under toxic oligomeric misfolded prion/amyloid load
        if prion_toxicity > 0.1 {
            let degradation_rate = 0.005 * (prion_toxicity - 0.1);
            self.structural_integrity =
                (self.structural_integrity - degradation_rate * dt_sec).max(0.0);
            // Pathological cleft distortion/widening
            self.cleft_width_nm = 20.0 + (1.0 - self.structural_integrity) * 15.0;
        }
    }
}
