use mozok_atlas::ontology::OntologyTree;
use mozok_atlas::region::{AnatomicalRegion, Hemisphere};
use mozok_core::bounds::BoundingSphere;
use mozok_core::bounds::AABB;
use mozok_core::coords::{Point3D, SpatialScale};
use mozok_navigation::camera::NeuroCamera;
use mozok_navigation::lod::{LodEvaluation, LodSelector};
use mozok_search::index::SearchIndex;
use mozok_streaming::cache::ChunkCacheGovernor;
use mozok_streaming::chunk::{ChunkPayload, SpatialChunkKey};

#[test]
fn test_floating_origin_recentering() {
    let mut camera = NeuroCamera::new(Point3D::new(0.0, 0.0, 200.0));
    assert!(camera.needs_origin_recenter());

    let delta = camera.recenter_origin();
    assert_eq!(delta.z, 200.0);
    assert!(!camera.needs_origin_recenter());
    assert_eq!(camera.local_render_position().z, 0.0);
}

#[test]
fn test_hierarchical_lod_evaluation() {
    let selector = LodSelector::new(4.0, 1080.0);
    let camera = NeuroCamera::new(Point3D::new(0.0, 0.0, 100.0));

    let sphere = BoundingSphere::new(Point3D::ORIGIN, 10.0);

    // High geometric error at 100mm distance should trigger refinement
    let eval = selector.evaluate(&camera, &sphere, 5.0);
    assert_eq!(eval, LodEvaluation::Refine);

    // Small geometric error should render directly
    let eval_render = selector.evaluate(&camera, &sphere, 0.1);
    assert_eq!(eval_render, LodEvaluation::Render);

    // Verify distance to scale resolution
    assert_eq!(
        selector.resolve_scale_tier(200.0),
        SpatialScale::MacroWholeBrain
    );
    assert_eq!(
        selector.resolve_scale_tier(0.01),
        SpatialScale::MicroSynapses
    );
}

#[test]
fn test_atlas_ontology_and_search() {
    let mut tree = OntologyTree::new();
    let mut search = SearchIndex::new();

    let frontal_lobe = AnatomicalRegion::new(1, "FL", "Frontal Lobe", Hemisphere::Bilateral);
    let precentral_gyrus = AnatomicalRegion::new(2, "PrG", "Precentral Gyrus", Hemisphere::Left);

    search.index_region(&frontal_lobe, vec!["Frontal Cortex".into()]);
    search.index_region(
        &precentral_gyrus,
        vec!["Primary Motor Cortex".into(), "M1".into()],
    );

    tree.insert_region(frontal_lobe, None);
    tree.insert_region(precentral_gyrus, Some(1));

    assert_eq!(tree.len(), 2);
    assert_eq!(tree.get_node(1).unwrap().children_ids, vec![2]);

    // Test search functionality
    let results = search.search("Motor");
    assert!(!results.is_empty());
    assert_eq!(results[0].region_id, 2);

    let acronym_results = search.search("FL");
    assert_eq!(acronym_results[0].region_id, 1);
}

#[test]
fn test_cache_governor_bounded_eviction() {
    // Budget: 1000 bytes
    let mut cache = ChunkCacheGovernor::new(1000);

    let chunk1 = ChunkPayload {
        key: SpatialChunkKey::new(0, 0, 0, 0),
        bounds: AABB::new(Point3D::ORIGIN, Point3D::new(1.0, 1.0, 1.0)),
        byte_size: 600,
        data: vec![0u8; 600],
    };

    let chunk2 = ChunkPayload {
        key: SpatialChunkKey::new(0, 1, 0, 0),
        bounds: AABB::new(Point3D::ORIGIN, Point3D::new(1.0, 1.0, 1.0)),
        byte_size: 600,
        data: vec![1u8; 600],
    };

    cache.insert(chunk1);
    assert_eq!(cache.metrics().total_allocated_bytes, 600);
    assert_eq!(cache.metrics().active_chunks, 1);

    // Adding chunk2 exceeds 1000 bytes, triggering LRU eviction of chunk1
    cache.insert(chunk2);
    assert_eq!(cache.metrics().evictions, 1);
    assert_eq!(cache.metrics().active_chunks, 1);
    assert_eq!(cache.metrics().total_allocated_bytes, 600);

    // Chunk1 was evicted
    assert!(cache.get(&SpatialChunkKey::new(0, 0, 0, 0)).is_none());
    // Chunk2 is present
    assert!(cache.get(&SpatialChunkKey::new(0, 1, 0, 0)).is_some());
}

#[test]
fn test_scientific_provenance_and_multi_system_dataset() {
    use mozok_core::coords::CoordinateFrame;
    use mozok_core::dataset::{BiologicalSystemKind, DatasetMetadata, ScientificProvenance};

    let provenance = ScientificProvenance {
        doi: Some("10.1038/s41586-021-03950-0".into()),
        authors: "BRAIN Initiative Cell Census Network (BICCN)".into(),
        year: 2021,
        citation: "A multimodal cell census and atlas of the mammalian primary motor cortex".into(),
        license: "CC-BY-4.0".into(),
        specimen_context: "Human primary motor cortex (M1), post-mortem".into(),
        is_peer_reviewed: true,
    };

    let dataset = DatasetMetadata {
        name: "Human Betz Cells & Pyramidal Layer V".into(),
        description: "Morphological and transcriptomic mapping of giant Betz cells".into(),
        system_kind: BiologicalSystemKind::Nervous,
        frame: CoordinateFrame::MNI152,
        bounds: AABB::new(
            Point3D::new(-50.0, -20.0, 40.0),
            Point3D::new(50.0, 20.0, 80.0),
        ),
        native_scale: SpatialScale::MicroNeurons,
        resolution_um: 0.3,
        provenance: Some(provenance),
    };

    assert_eq!(dataset.system_kind, BiologicalSystemKind::Nervous);
    assert!(dataset.provenance.as_ref().unwrap().is_peer_reviewed);
    assert_eq!(
        dataset.provenance.as_ref().unwrap().doi.as_deref(),
        Some("10.1038/s41586-021-03950-0")
    );
}

#[test]
fn test_alpha_seed_ontology_and_logarithmic_camera() {
    let tree = OntologyTree::create_alpha_brain_seed();
    assert_eq!(tree.len(), 12);

    // Verify Whole Brain (ID 1)
    let wb = tree.get_region(1).expect("Whole Brain node must exist");
    assert_eq!(wb.acronym, "WB");
    assert_eq!(wb.scale_tier, SpatialScale::MacroWholeBrain);
    assert_eq!(wb.optimal_view_distance_mm, 220.0);

    // Verify Betz Cell (ID 8) with Volodymyr Bets tribute and DOI provenance
    let betz = tree.get_region(8).expect("Betz Cell node must exist");
    assert_eq!(betz.acronym, "BETZ");
    assert_eq!(betz.scale_tier, SpatialScale::MicroNeurons);
    assert!(betz.name.contains("Volodymyr Bets, Kyiv 1874"));
    let prov = betz
        .provenance
        .as_ref()
        .expect("Betz cell must have scientific provenance");
    assert_eq!(prov.doi.as_deref(), Some("10.1038/s41586-021-03950-0"));
    assert!(prov.is_peer_reviewed);

    // Verify Synapse (ID 9)
    let synapse = tree.get_region(9).expect("Synapse node must exist");
    assert_eq!(synapse.acronym, "SYN-M1");
    assert_eq!(synapse.scale_tier, SpatialScale::MicroSynapses);
    assert_eq!(synapse.optimal_view_distance_mm, 0.002);

    // Verify Logarithmic Camera navigation across all spatial scale brackets
    let mut camera = NeuroCamera::default();
    let selector = LodSelector::default();

    // Starts at Macro scale (250 mm)
    assert_eq!(
        selector.resolve_scale_tier(camera.distance_mm),
        SpatialScale::MacroWholeBrain
    );

    // Focus on Precentral Gyrus M1
    let prg = tree.get_region(4).unwrap();
    camera.focus_on(prg.center_mni, prg.optimal_view_distance_mm);
    assert_eq!(camera.target, prg.center_mni);
    assert_eq!(
        selector.resolve_scale_tier(camera.distance_mm),
        SpatialScale::MesoStructures
    );

    // Continuous logarithmic zoom in towards Betz cell
    for _ in 0..40 {
        camera.zoom_logarithmic(1.0);
    }
    assert!(camera.distance_mm < 0.5);
    assert_eq!(
        selector.resolve_scale_tier(camera.distance_mm),
        SpatialScale::MicroNeurons
    );

    // Zoom down to Synaptic Cleft
    for _ in 0..40 {
        camera.zoom_logarithmic(1.0);
    }
    assert!(camera.distance_mm <= 0.001);
    assert_eq!(
        selector.resolve_scale_tier(camera.distance_mm),
        SpatialScale::MicroSynapses
    );

    // Zoom back out to Macro (> 150mm)
    for _ in 0..150 {
        camera.zoom_logarithmic(-1.0);
    }
    assert!(camera.distance_mm > 150.0);
    assert_eq!(
        selector.resolve_scale_tier(camera.distance_mm),
        SpatialScale::MacroWholeBrain
    );
}

#[test]
fn test_cjd_prion_progression_and_csf_biomarkers() {
    use mozok_pathology::prion_cjd::CjdSimulator;
    use mozok_physiology::csf::{CsfHydrodynamics, VentricularCompartment};
    use mozok_physiology::synapse::SynapticCleftState;

    let mut csf = CsfHydrodynamics::new();
    let mut cjd = CjdSimulator::new();

    // Verify basal CSF flow velocities and pulsatility
    let vel_aqueduct_0 =
        csf.instantaneous_flow_velocity_mm_s(VentricularCompartment::CerebralAqueductOfSylvius);
    assert!(vel_aqueduct_0 > 25.0 && vel_aqueduct_0 < 60.0);
    csf.step(0.25);
    let vel_aqueduct_t =
        csf.instantaneous_flow_velocity_mm_s(VentricularCompartment::CerebralAqueductOfSylvius);
    assert_ne!(vel_aqueduct_0, vel_aqueduct_t);

    // Setup network connectome topology:
    // Thalamus (12) -> Frontal Lobe (2) -> Motor Cortex Betz Cells (8)
    cjd.add_connectome_edge(12, 2, 1.2);
    cjd.add_connectome_edge(2, 8, 1.0);

    // Seed sporadic CJD in Thalamus (Pulvinar)
    cjd.seed_sporadic_cjd(12, 0.45);
    assert_eq!(cjd.nodes.get(&12).unwrap().prp_sc_scrapie, 0.45);
    assert_eq!(cjd.nodes.get(&8).unwrap().prp_sc_scrapie, 0.0);

    // Initial biomarkers should be normal
    assert!(!csf.biomarkers.rt_quic_prion_positive);
    assert!(csf.biomarkers.total_tau_pg_ml < 300.0);
    assert!(csf.biomarkers.protein_14_3_3_ng_ml < 1.0);

    // Advance 60 days of disease progression
    for _ in 0..60 {
        cjd.step_days(1.0, &mut csf);
    }

    // 1. Assert PrP^Sc propagation across connected nodes
    let prp_sc_betz = cjd.nodes.get(&8).unwrap().prp_sc_scrapie;
    assert!(
        prp_sc_betz > 0.05,
        "PrP^Sc must propagate through connectome to Betz cells"
    );

    // 2. Assert microscopic spongiform vacuole accumulation
    let vacuole_thalamus = cjd.nodes.get(&12).unwrap().spongiform_vacuole_density;
    assert!(
        vacuole_thalamus > 0.25,
        "Spongiform vacuoles must exceed 0.25 in CJD target"
    );

    // 3. Assert neuronal survival degradation
    let survival_thalamus = cjd.nodes.get(&12).unwrap().neuronal_survival;
    assert!(
        survival_thalamus < 0.85,
        "Neuronal survival must degrade in infected region"
    );

    // 4. Assert CSF biomarkers reflect severe neurolysis & positive RT-QuIC
    assert!(
        csf.biomarkers.rt_quic_prion_positive,
        "RT-QuIC must detect pathogenic prion seeding"
    );
    assert!(
        csf.biomarkers.total_tau_pg_ml > 4000.0,
        "Total Tau must surge > 4000 pg/mL in CJD"
    );
    assert!(
        csf.biomarkers.protein_14_3_3_ng_ml > 2.0,
        "14-3-3 protein must exceed 2.0 ng/mL in CJD"
    );
    assert!(
        csf.biomarkers.glymphatic_aqp4_efficiency < 0.85,
        "Glymphatic clearance must be impaired"
    );

    // 5. Assert synaptic degeneration under prion load
    let mut synapse = SynapticCleftState::new();
    synapse.trigger_action_potential();
    assert!(synapse.glutamate_concentration_umol > 500.0);
    // Apply chronic toxic prion load
    for _ in 0..100 {
        synapse.step_kinetics(0.01, prp_sc_betz);
    }
    assert!(
        synapse.structural_integrity < 1.0,
        "Synaptic integrity must degrade under prion toxicity"
    );
    assert!(
        synapse.cleft_width_nm > 20.0,
        "Synaptic cleft must pathologically widen"
    );
}
