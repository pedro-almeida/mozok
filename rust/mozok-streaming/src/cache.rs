//! Memory budget governor and LRU eviction policy.

use crate::chunk::{ChunkPayload, SpatialChunkKey};
use std::collections::HashMap;

#[derive(Debug, Clone, Copy, Default)]
pub struct CacheMetrics {
    pub total_allocated_bytes: usize,
    pub active_chunks: usize,
    pub hits: u64,
    pub misses: u64,
    pub evictions: u64,
}

pub struct ChunkCacheGovernor {
    /// Bounded memory ceiling in bytes (e.g. 1.5 GB on mobile, 4 GB on desktop)
    max_memory_budget_bytes: usize,
    current_memory_bytes: usize,
    store: HashMap<SpatialChunkKey, (ChunkPayload, u64)>,
    access_counter: u64,
    metrics: CacheMetrics,
}

impl ChunkCacheGovernor {
    pub fn new(budget_bytes: usize) -> Self {
        Self {
            max_memory_budget_bytes: budget_bytes,
            current_memory_bytes: 0,
            store: HashMap::new(),
            access_counter: 0,
            metrics: CacheMetrics::default(),
        }
    }

    pub fn get(&mut self, key: &SpatialChunkKey) -> Option<&ChunkPayload> {
        self.access_counter += 1;
        if let Some((payload, last_access)) = self.store.get_mut(key) {
            *last_access = self.access_counter;
            self.metrics.hits += 1;
            Some(payload)
        } else {
            self.metrics.misses += 1;
            None
        }
    }

    pub fn insert(&mut self, payload: ChunkPayload) {
        let size = payload.byte_size;

        // Evict until memory fits inside budget
        while self.current_memory_bytes + size > self.max_memory_budget_bytes
            && !self.store.is_empty()
        {
            self.evict_lru();
        }

        self.access_counter += 1;
        let key = payload.key;
        self.current_memory_bytes += size;
        self.store.insert(key, (payload, self.access_counter));

        self.metrics.active_chunks = self.store.len();
        self.metrics.total_allocated_bytes = self.current_memory_bytes;
    }

    fn evict_lru(&mut self) {
        let mut oldest_key = None;
        let mut oldest_access = u64::MAX;

        for (key, (_, access)) in &self.store {
            if *access < oldest_access {
                oldest_access = *access;
                oldest_key = Some(*key);
            }
        }

        if let Some(key) = oldest_key {
            if let Some((removed, _)) = self.store.remove(&key) {
                self.current_memory_bytes =
                    self.current_memory_bytes.saturating_sub(removed.byte_size);
                self.metrics.evictions += 1;
            }
        }
    }

    pub fn metrics(&self) -> &CacheMetrics {
        &self.metrics
    }
}
