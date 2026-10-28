//! Hierarchical neuro-ontology tree representation.

use crate::region::{AnatomicalRegion, Hemisphere};
use mozok_core::coords::{Point3D, SpatialScale};
use mozok_core::dataset::ScientificProvenance;
use std::collections::HashMap;

#[derive(Debug, Clone)]
pub struct BrainRegionNode {
    pub region: AnatomicalRegion,
    pub parent_id: Option<u32>,
    pub children_ids: Vec<u32>,
}

#[derive(Debug, Default)]
pub struct OntologyTree {
    nodes: HashMap<u32, BrainRegionNode>,
    root_ids: Vec<u32>,
}

impl OntologyTree {
    pub fn new() -> Self {
        Self {
            nodes: HashMap::new(),
            root_ids: Vec::new(),
        }
    }

    pub fn insert_region(&mut self, region: AnatomicalRegion, parent_id: Option<u32>) {
        let id = region.id;
        let node = BrainRegionNode {
            region,
            parent_id,
            children_ids: Vec::new(),
        };

        self.nodes.insert(id, node);

        if let Some(pid) = parent_id {
            if let Some(parent) = self.nodes.get_mut(&pid) {
                parent.children_ids.push(id);
            }
        } else {
            self.root_ids.push(id);
        }
    }

    pub fn get_node(&self, id: u32) -> Option<&BrainRegionNode> {
        self.nodes.get(&id)
    }

    pub fn get_region(&self, id: u32) -> Option<&AnatomicalRegion> {
        self.nodes.get(&id).map(|node| &node.region)
    }

    pub fn len(&self) -> usize {
        self.nodes.len()
    }

    pub fn is_empty(&self) -> bool {
        self.nodes.is_empty()
    }

    /// Factory loading the canonical Alpha v0.1.0 seed ontology.
    /// Honors Ukrainian scientific contributions (Volodymyr Bets) and standardized MNI152 neuroanatomy.
    pub fn create_alpha_brain_seed() -> Self {
        let mut tree = Self::new();

        // 1. Whole Human Brain (Мозок)
        let whole_brain = AnatomicalRegion::new(
            1,
            "WB",
            "Whole Human Brain (Мозок)",
            Hemisphere::Bilateral,
        )
        .with_coordinates(
            Point3D::new(0.0, 0.0, 0.0),
            90.0,
            SpatialScale::MacroWholeBrain,
        )
        .with_optimal_distance(220.0)
        .with_color(180, 190, 210)
        .with_provenance(ScientificProvenance {
            doi: Some("10.1016/j.neuroimage.2009.04.041".into()),
            authors: "Fonov et al. (ICBM / MNI Consortium)".into(),
            year: 2011,
            citation:
                "Unbiased average, symmetric atlas for multi-spectral human brain MRI in MNI152-space"
                    .into(),
            license: "CC-BY-4.0".into(),
            specimen_context: "MNI152 nonlinear 6th generation average MRI template".into(),
            is_peer_reviewed: true,
        });
        tree.insert_region(whole_brain, None);

        // 2. Frontal Lobe (Parent: 1)
        let frontal_lobe = AnatomicalRegion::new(2, "FL", "Frontal Lobe", Hemisphere::Bilateral)
            .with_coordinates(
                Point3D::new(0.0, 40.0, 20.0),
                55.0,
                SpatialScale::MacroLobes,
            )
            .with_optimal_distance(90.0)
            .with_color(70, 130, 240);
        tree.insert_region(frontal_lobe, Some(1));

        // 3. Temporal Lobe (Parent: 1)
        let temporal_lobe = AnatomicalRegion::new(3, "TL", "Temporal Lobe", Hemisphere::Bilateral)
            .with_coordinates(
                Point3D::new(50.0, -15.0, -15.0),
                45.0,
                SpatialScale::MacroLobes,
            )
            .with_optimal_distance(85.0)
            .with_color(220, 150, 60);
        tree.insert_region(temporal_lobe, Some(1));

        // 4. Precentral Gyrus / Primary Motor Cortex M1 (Parent: 2)
        let precentral_gyrus = AnatomicalRegion::new(
            4,
            "PrG",
            "Precentral Gyrus (Primary Motor Cortex - M1)",
            Hemisphere::Left,
        )
        .with_coordinates(
            Point3D::new(-38.0, -14.0, 52.0),
            18.0,
            SpatialScale::MesoStructures,
        )
        .with_optimal_distance(25.0)
        .with_color(230, 80, 80);
        tree.insert_region(precentral_gyrus, Some(2));

        // 5. Hippocampus / Cornu Ammonis (Parent: 3)
        let hippocampus = AnatomicalRegion::new(
            5,
            "HIP",
            "Hippocampus (Cornu Ammonis)",
            Hemisphere::Bilateral,
        )
        .with_coordinates(
            Point3D::new(-28.0, -20.0, -14.0),
            12.0,
            SpatialScale::MesoStructures,
        )
        .with_optimal_distance(18.0)
        .with_color(160, 90, 210);
        tree.insert_region(hippocampus, Some(3));

        // 6. Substantia Nigra pars compacta (Parent: 1)
        let substantia_nigra = AnatomicalRegion::new(
            6,
            "SNc",
            "Substantia Nigra pars compacta",
            Hemisphere::Bilateral,
        )
        .with_coordinates(
            Point3D::new(-10.0, -18.0, -12.0),
            8.0,
            SpatialScale::MesoStructures,
        )
        .with_optimal_distance(12.0)
        .with_color(40, 40, 45);
        tree.insert_region(substantia_nigra, Some(1));

        // 7. Cortical Layer V (Parent: 4)
        let layer_5 = AnatomicalRegion::new(
            7,
            "L5-M1",
            "Cortical Layer V (Internal Pyramidal Layer)",
            Hemisphere::Left,
        )
        .with_coordinates(
            Point3D::new(-38.0, -14.0, 52.0),
            1.2,
            SpatialScale::MesoTissue,
        )
        .with_optimal_distance(1.8)
        .with_color(240, 120, 100);
        tree.insert_region(layer_5, Some(4));

        // 8. Giant Pyramidal Cell of Betz (Parent: 7) - Volodymyr Bets (Kyiv, 1874)
        let betz_cell = AnatomicalRegion::new(
            8,
            "BETZ",
            "Giant Pyramidal Cell of Betz (Volodymyr Bets, Kyiv 1874)",
            Hemisphere::Left,
        )
        .with_coordinates(
            Point3D::new(-38.1, -14.0, 52.1),
            0.08,
            SpatialScale::MicroNeurons,
        )
        .with_optimal_distance(0.12)
        .with_color(80, 220, 120)
        .with_provenance(ScientificProvenance {
            doi: Some("10.1038/s41586-021-03950-0".into()),
            authors: "BRAIN Initiative Cell Census Network (BICCN)".into(),
            year: 2021,
            citation: "A multimodal cell census and atlas of the mammalian primary motor cortex"
                .into(),
            license: "CC-BY-4.0".into(),
            specimen_context: "Human primary motor cortex L5 Betz giant pyramidal neurons".into(),
            is_peer_reviewed: true,
        });
        tree.insert_region(betz_cell, Some(7));

        // 9. Corticospinal Glutamatergic Synapse (Parent: 8)
        let synapse = AnatomicalRegion::new(
            9,
            "SYN-M1",
            "Corticospinal Glutamatergic Synapse",
            Hemisphere::Left,
        )
        .with_coordinates(
            Point3D::new(-38.102, -14.001, 52.101),
            0.001,
            SpatialScale::MicroSynapses,
        )
        .with_optimal_distance(0.002)
        .with_color(255, 215, 0)
        .with_provenance(ScientificProvenance {
            doi: Some("10.1126/science.adk4858".into()),
            authors: "Shapson-Coe et al. (Harvard / Google Connectomics)".into(),
            year: 2024,
            citation:
                "A petavoxel fragment of human cerebral cortex reconstructed at nanoscale resolution"
                    .into(),
            license: "CC-BY-4.0".into(),
            specimen_context:
                "Post-synaptic density and vesicle pools at 4nm voxel EM resolution".into(),
            is_peer_reviewed: true,
        });
        tree.insert_region(synapse, Some(8));

        // 10. Lateral Ventricles & Choroid Plexus (CSF) (Parent: 1)
        let ventricles = AnatomicalRegion::new(
            10,
            "VENT-LAT",
            "Lateral Ventricles & Choroid Plexus (CSF)",
            Hemisphere::Bilateral,
        )
        .with_coordinates(
            Point3D::new(0.0, -10.0, 15.0),
            30.0,
            SpatialScale::MesoStructures,
        )
        .with_optimal_distance(35.0)
        .with_color(30, 200, 220)
        .with_provenance(ScientificProvenance {
            doi: Some("10.1126/science.1234098".into()),
            authors: "Nedergaard et al. (Glymphatic System Discovery)".into(),
            year: 2013,
            citation: "Sleep drives metabolite clearance from the adult brain via glymphatic flow"
                .into(),
            license: "CC-BY-4.0".into(),
            specimen_context:
                "Macroscopic ventricular volume and perivascular Virchow-Robin spaces".into(),
            is_peer_reviewed: true,
        });
        tree.insert_region(ventricles, Some(1));

        // 11. Cerebral Aqueduct of Sylvius (Parent: 1)
        let aqueduct = AnatomicalRegion::new(
            11,
            "AQUEDUCT",
            "Cerebral Aqueduct of Sylvius (CSF Flow)",
            Hemisphere::Midline,
        )
        .with_coordinates(
            Point3D::new(0.0, -28.0, -8.0),
            6.0,
            SpatialScale::MesoStructures,
        )
        .with_optimal_distance(15.0)
        .with_color(50, 180, 255);
        tree.insert_region(aqueduct, Some(1));

        // 12. Pulvinar & Medial Thalamus (Parent: 1) - Classic "Hockey-Stick" / Pulvinar sign in CJD
        let thalamus = AnatomicalRegion::new(
            12,
            "PULV",
            "Pulvinar & Medial Thalamus (CJD Target)",
            Hemisphere::Bilateral,
        )
        .with_coordinates(
            Point3D::new(-12.0, -24.0, 6.0),
            12.0,
            SpatialScale::MesoStructures,
        )
        .with_optimal_distance(20.0)
        .with_color(190, 70, 140)
        .with_provenance(ScientificProvenance {
            doi: Some("10.1016/S1474-4422(09)70291-1".into()),
            authors: "Zerr et al. (European CJD Surveillance Consortium)".into(),
            year: 2009,
            citation: "Updated clinical diagnostic criteria for sporadic Creutzfeldt-Jakob disease"
                .into(),
            license: "CC-BY-4.0".into(),
            specimen_context:
                "Bilateral pulvinar and hockey-stick high-signal intensity on MRI DWI/FLAIR".into(),
            is_peer_reviewed: true,
        });
        tree.insert_region(thalamus, Some(1));

        tree
    }
}
