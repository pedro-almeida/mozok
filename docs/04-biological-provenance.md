# RFC 004: Scientific Provenance, Citations & Validation Workflows

## 1. The Imperative of Truth
In alignment with the Kantian duty of truthfulness, every anatomical structure, cell morphology, and tractographic pathway rendered in MOZOK must be traceable to primary peer-reviewed scientific literature.

## 2. Provenance Metadata Schema
Every biological dataset registered in MOZOK carries:
- `doi`: Digital Object Identifier linking directly to the primary paper (e.g. `doi:10.1038/s41586-021-03950-0`).
- `authors`: Primary investigators and publishing consortium.
- `publication_year`: Year of release.
- `specimen_context`: Specimen details (e.g. post-mortem human, resolution, fixation technique).
- `curator_verification`: Digital signature or attestation from the scientific validation team.
- `license`: Open data license (CC-BY, CC0, Open Data Commons).

## 3. Peer-Review Contribution Pipeline
Community submissions of new models (e.g. cardiac conduction system, renal glomeruli) must undergo formal scientific review before ingestion into default distribution tiers.
