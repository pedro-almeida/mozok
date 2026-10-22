# MOZOK License Recommendation & Intellectual Property Strategy

## 1. Executive Recommendation

It is strongly recommended that **MOZOK** adopt a dual-licensing model standard in modern high-performance systems and scientific software:

> **Dual License: Apache License 2.0 OR MIT License**

At the user or distributor's discretion, contributions and usage are covered under:
1. **Apache License, Version 2.0** ([LICENSE-APACHE](http://www.apache.org/licenses/LICENSE-2.0))
2. **MIT License** ([LICENSE-MIT](http://opensource.org/licenses/MIT))

---

## 2. Strategic Rationale

### A. Academic & Scientific Adoption
Neuroscience institutes, medical research facilities, and universities require unambiguous permission to integrate the software into academic workflows, clinical simulations, and educational curricula without restrictive copyleft burdens.

### B. Patent Protection (Apache 2.0)
The Apache 2.0 license includes explicit patent grant and retaliation clauses. This protects contributors and the MOZOK foundation against predatory patent litigation from bad-faith actors while keeping the code freely accessible.

### C. Industry & Ecosystem Compatibility (MIT)
The MIT license is the standard for the Godot and Rust ecosystems (`godot-rust`, Bevy, Cargo crates). Providing MIT parity ensures frictionless inclusion in broader open-source tooling and web deployments.

---

## 3. Dataset & Scientific Asset Licensing

Scientific datasets (such as Allen CCF, Human Connectome Project, NeuroMorpho) often possess their own attribution and open-science licenses (e.g., CC-BY 4.0, ODbL). 

The MOZOK code repository strictly isolates core engine code from scientific datasets:
- **Engine & Core Algorithms:** Dual MIT / Apache 2.0.
- **Third-Party Atlases & Datasets:** External assets pulled on demand under their respective original open licenses with complete academic attribution.
