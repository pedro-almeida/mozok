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
    assert_eq!(tree.len(), 9);

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
