//! Creutzfeldt-Jakob Disease (CJD) and Prion Pathology Simulation.
//!
//! Implements the coupled Heterodimer Autocatalytic Conversion & Fisher-Kolmogorov
//! Network Diffusion Model:
//!   d(PrP^Sc)/dt = k * PrP^C * PrP^Sc - clearance(AQP4) * PrP^Sc + beta * sum_j(W_ij * (PrP^Sc_j - PrP^Sc_i))
//!
//! Simulates microscopic spongiform vacuolation, reactive astrogliosis, synaptic loss,
//! cortical ribboning DWI hyperintensity proxy, and CSF biomarker surge (14-3-3, total-tau, RT-QuIC).

use mozok_physiology::csf::CsfHydrodynamics;
use std::collections::HashMap;

/// Pathological state tracked per anatomical region node
#[derive(Debug, Clone)]
pub struct RegionPathologyState {
    pub region_id: u32,
    /// Normal cellular prion protein (PrP^C) concentration (starts normalized at 1.0)
    pub prp_c_normal: f64,
    /// Pathogenic beta-sheet misfolded prion protein (PrP^Sc) concentration
    pub prp_sc_scrapie: f64,
    /// Microscopic spongiform vacuole density (0.0 to 1.0 — 5 to 50 µm neuropil cavities)
    pub spongiform_vacuole_density: f64,
    /// Reactive astrogliosis index (0.0 to 1.0 — GFAP-positive astrocyte hypertrophy)
    pub astrogliosis_index: f64,
    /// Neuronal survival fraction (1.0 = normal cellular density; degrades towards 0.0)
    pub neuronal_survival: f64,
}

impl RegionPathologyState {
    pub fn new(region_id: u32) -> Self {
        Self {
            region_id,
            prp_c_normal: 1.0,
            prp_sc_scrapie: 0.0,
            spongiform_vacuole_density: 0.0,
            astrogliosis_index: 0.0,
            neuronal_survival: 1.0,
        }
    }
}

/// Creutzfeldt-Jakob Disease (sCJD / vCJD / fCJD) Multi-Scale Simulator
#[derive(Debug, Clone)]
pub struct CjdSimulator {
    /// Autocatalytic conversion rate constant k (PrP^C + PrP^Sc -> 2 PrP^Sc)
    pub conversion_rate_k: f64,
    /// Network connectome diffusion coefficient beta
    pub network_diffusion_beta: f64,
    /// Elapsed clinical progression time in days
    pub elapsed_days: f64,
    /// Regional pathology states keyed by anatomical region ID
    pub nodes: HashMap<u32, RegionPathologyState>,
    /// Structural connectome graph edges: (source_id, target_id, axonal_weight)
    pub adjacency: Vec<(u32, u32, f64)>,
}

impl Default for CjdSimulator {
    fn default() -> Self {
        Self {
            conversion_rate_k: 0.08, // Rapid exponential conversion typical of CJD
            network_diffusion_beta: 0.035,
            elapsed_days: 0.0,
            nodes: HashMap::new(),
            adjacency: Vec::new(),
        }
    }
}

impl CjdSimulator {
    pub fn new() -> Self {
        Self::default()
    }

    /// Add an anatomical node to the simulator
    pub fn add_region(&mut self, region_id: u32) {
        self.nodes
            .entry(region_id)
            .or_insert_with(|| RegionPathologyState::new(region_id));
    }

    /// Add a directional structural connectome edge between anatomical nodes
    pub fn add_connectome_edge(&mut self, from_id: u32, to_id: u32, weight: f64) {
        self.add_region(from_id);
        self.add_region(to_id);
        self.adjacency.push((from_id, to_id, weight));
    }

    /// Seed sporadic or acquired CJD infection in an anatomical structure (e.g. Thalamus or Cortex)
    pub fn seed_sporadic_cjd(&mut self, origin_region_id: u32, initial_prp_sc: f64) {
        self.add_region(origin_region_id);
        if let Some(node) = self.nodes.get_mut(&origin_region_id) {
            node.prp_sc_scrapie = initial_prp_sc;
            node.prp_c_normal = (node.prp_c_normal - initial_prp_sc).max(0.0);
        }
    }

    /// Step simulation forward by delta_days, updating regional pathology and coupling with CSF dynamics
    pub fn step_days(&mut self, delta_days: f64, csf: &mut CsfHydrodynamics) {
        self.elapsed_days += delta_days;

        // 1. Calculate network diffusion deltas along connectome edges
        let mut diffusion_flux: HashMap<u32, f64> = HashMap::new();
        for &(u, v, weight) in &self.adjacency {
            let sc_u = self.nodes.get(&u).map(|n| n.prp_sc_scrapie).unwrap_or(0.0);
            let sc_v = self.nodes.get(&v).map(|n| n.prp_sc_scrapie).unwrap_or(0.0);

            // Fickian gradient across structural axon bundle
            let flux = self.network_diffusion_beta * weight * (sc_u - sc_v);
            *diffusion_flux.entry(v).or_insert(0.0) += flux;
            *diffusion_flux.entry(u).or_insert(0.0) -= flux;
        }

        let aqp4_clearance = csf.biomarkers.glymphatic_aqp4_efficiency * 0.012;
        let mut total_brain_prp_sc = 0.0;
        let mut max_regional_prp_sc = 0.0;

        // 2. Autocatalytic conversion, clearance, and cellular damage per region
        for (id, node) in &mut self.nodes {
            let diff = diffusion_flux.get(id).copied().unwrap_or(0.0);

            // Heterodimer reaction: dPrP_Sc = k * PrP_C * PrP_Sc - clearance * PrP_Sc + diffusion
            let converted = (self.conversion_rate_k * node.prp_c_normal * node.prp_sc_scrapie)
                .min(node.prp_c_normal);
            let cleared = node.prp_sc_scrapie * aqp4_clearance;

            node.prp_c_normal = (node.prp_c_normal - converted * delta_days).max(0.0);
            node.prp_sc_scrapie =
                (node.prp_sc_scrapie + (converted - cleared + diff) * delta_days).clamp(0.0, 10.0);

            // Spongiform vacuolation accumulates with pathogenic prion load
            let vacuole_rate = 0.04 * node.prp_sc_scrapie;
            node.spongiform_vacuole_density =
                (node.spongiform_vacuole_density + vacuole_rate * delta_days).clamp(0.0, 1.0);

            // Reactive astrogliosis
            let astro_rate = 0.035 * node.prp_sc_scrapie;
            node.astrogliosis_index =
                (node.astrogliosis_index + astro_rate * delta_days).clamp(0.0, 1.0);

            // Neuronal apoptosis and dendritic retraction
            let death_rate = 0.035 * node.spongiform_vacuole_density;
            node.neuronal_survival =
                (node.neuronal_survival - death_rate * delta_days).clamp(0.0, 1.0);

            total_brain_prp_sc += node.prp_sc_scrapie;
            if node.prp_sc_scrapie > max_regional_prp_sc {
                max_regional_prp_sc = node.prp_sc_scrapie;
            }
        }

        // 3. Couple with CSF physiology and clinical biomarkers
        let mean_prp_sc = if !self.nodes.is_empty() {
            total_brain_prp_sc / (self.nodes.len() as f64)
        } else {
            0.0
        };

        // Astrocytic endfeet detachment impairs glymphatic clearance
        csf.biomarkers.glymphatic_aqp4_efficiency =
            (1.0 - 0.7 * mean_prp_sc.min(1.0)).clamp(0.15, 1.0);

        // RT-QuIC diagnostic assay turns positive once pathogenic seeds cross detection sensitivity threshold
        if max_regional_prp_sc > 0.15 {
            csf.biomarkers.rt_quic_prion_positive = true;
        }

        // Damage metric driven by both peak regional neurolysis and mean loss
        let max_cell_loss = self
            .nodes
            .values()
            .map(|n| 1.0 - n.neuronal_survival)
            .fold(0.0, f64::max);
        let mean_cell_loss = 1.0 - self.mean_neuronal_survival();
        let neurolysis_index = (max_cell_loss * 0.7 + mean_cell_loss * 0.3).clamp(0.0, 1.0);

        // Protein 14-3-3 spills into CSF during rapid cortical neurolysis (diagnostic threshold > 2.0 ng/mL)
        csf.biomarkers.protein_14_3_3_ng_ml = 0.4 + 5.0 * neurolysis_index;

        // Total Tau surges drastically in CJD (> 4000 pg/mL) due to acute axonal disintegration
        csf.biomarkers.total_tau_pg_ml = 180.0 + 12000.0 * neurolysis_index;
    }

    /// Average neuronal survival fraction across all monitored regions
    pub fn mean_neuronal_survival(&self) -> f64 {
        if self.nodes.is_empty() {
            return 1.0;
        }
        let total: f64 = self.nodes.values().map(|n| n.neuronal_survival).sum();
        total / (self.nodes.len() as f64)
    }
}
