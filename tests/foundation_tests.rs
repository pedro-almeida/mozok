use mozok_core::coords::{Point3D, SpatialScale};
use mozok_core::bounds::BoundingSphere;
use mozok_navigation::camera::NeuroCamera;
use mozok_navigation::lod::{LodSelector, LodEvaluation};
use mozok_atlas::region::{AnatomicalRegion, Hemisphere};
use mozok_atlas::ontology::OntologyTree;
use mozok_search::index::SearchIndex;
use mozok_streaming::chunk::{SpatialChunkKey, ChunkPayload};
use mozok_streaming::cache::ChunkCacheGovernor;
use mozok_core::bounds::AABB;

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
    assert_eq!(selector.resolve_scale_tier(200.0), SpatialScale::MacroWholeBrain);
    assert_eq!(selector.resolve_scale_tier(0.01), SpatialScale::MicroSynapses);
}

#[test]
fn test_atlas_ontology_and_search() {
    let mut tree = OntologyTree::new();
    let mut search = SearchIndex::new();

    let frontal_lobe = AnatomicalRegion::new(1, "FL", "Frontal Lobe", Hemisphere::Bilateral);
    let precentral_gyrus = AnatomicalRegion::new(2, "PrG", "Precentral Gyrus", Hemisphere::Left);

    search.index_region(&frontal_lobe, vec!["Frontal Cortex".into()]);
    search.index_region(&precentral_gyrus, vec!["Primary Motor Cortex".into(), "M1".into()]);

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
