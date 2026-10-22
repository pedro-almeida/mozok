//! Hierarchical neuro-ontology tree representation.

use crate::region::AnatomicalRegion;
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

    pub fn len(&self) -> usize {
        self.nodes.len()
    }

    pub fn is_empty(&self) -> bool {
        self.nodes.is_empty()
    }
}
