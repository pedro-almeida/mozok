//! Inverted search index for neuroanatomy nomenclature and synonyms.

use mozok_atlas::region::AnatomicalRegion;

#[derive(Debug, Clone)]
pub struct SearchResult {
    pub region_id: u32,
    pub primary_name: String,
    pub acronym: String,
    pub score: f32,
}

#[derive(Default)]
pub struct SearchIndex {
    entries: Vec<(u32, String, String, Vec<String>)>,
}

impl SearchIndex {
    pub fn new() -> Self {
        Self {
            entries: Vec::new(),
        }
    }

    pub fn index_region(&mut self, region: &AnatomicalRegion, synonyms: Vec<String>) {
        self.entries.push((
            region.id,
            region.name.to_lowercase(),
            region.acronym.to_lowercase(),
            synonyms.into_iter().map(|s| s.to_lowercase()).collect(),
        ));
    }

    /// Substring and acronym search across indexed anatomical structures
    pub fn search(&self, query: &str) -> Vec<SearchResult> {
        let q = query.trim().to_lowercase();
        if q.is_empty() {
            return Vec::new();
        }

        let mut results = Vec::new();

        for (id, name, acronym, synonyms) in &self.entries {
            let mut score = 0.0f32;

            if acronym == &q {
                score += 100.0;
            } else if acronym.contains(&q) {
                score += 50.0;
            }

            if name == &q {
                score += 90.0;
            } else if name.starts_with(&q) {
                score += 40.0;
            } else if name.contains(&q) {
                score += 20.0;
            }

            for syn in synonyms {
                if syn == &q {
                    score += 85.0;
                } else if syn.contains(&q) {
                    score += 15.0;
                }
            }

            if score > 0.0 {
                results.push(SearchResult {
                    region_id: *id,
                    primary_name: name.clone(),
                    acronym: acronym.clone(),
                    score,
                });
            }
        }

        results.sort_by(|a, b| b.score.partial_cmp(&a.score).unwrap());
        results
    }
}
