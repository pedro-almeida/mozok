# Contributing to MOZOK

Thank you for your interest in contributing to **MOZOK**. As an open-source scientific visualization platform, we hold our code, documentation, and architectural designs to high standards of excellence, scientific accuracy, and long-term maintainability.

---

## 1. Guiding Principles

- **Separation of Concerns:** Rust code remains sovereign and free of Godot-specific assumptions where possible. Godot remains a presentation and UI client.
- **Out-of-Core Design:** Never assume infinite memory. Any data pipeline must support chunking, streaming, and bounded cache eviction.
- **Scientific Rigor:** Ensure that coordinates, spatial metrics, and anatomical labels adhere to standardized neuroscientific vocabularies.
- **Quality over Speed:** Clear, documented interfaces and comprehensive unit tests take precedence over rushed implementations.

---

## 2. Development Setup

### Prerequisites
- **Git** (with LFS support for potential future binary test fixtures).
- **Rust Toolchain:** Stable channel (Rust 1.75+ or newer, 2021 edition).
- **Godot Engine 4.x:** Standard version (4.2+ recommended).
- **C/C++ Build Tools:** Visual Studio C++ Build Tools (Windows), GCC/Clang (Linux/macOS), or Android NDK (for mobile exports).

### Workspace Validation
```bash
# Check all Rust crates
cd rust
cargo check --workspace
cargo test --workspace
```

---

## 3. Commit Guidelines

We enforce the [Conventional Commits](https://www.conventionalcommits.org/) specification to keep the Git history readable and automatable.

Format:
```text
<type>(<scope>): <short description>
```

Common types:
- `feat`: A new feature or capability.
- `fix`: A bug fix.
- `docs`: Documentation updates or architectural specs.
- `refactor`: Code reorganization with no change in external behavior.
- `perf`: A performance optimization or memory reduction.
- `build`: Build system or dependency updates.
- `test`: Adding or updating test suites.
- `ci`: CI/CD automation modifications.

Examples:
- `docs: add spatial coordinate transformation specification`
- `core: implement 64-bit floating origin translation in mozok-core`
- `build: configure GDExtension export presets for Godot 4`

---

## 4. Pull Request Process

1. Fork the repository and create your feature branch from `main`:
   ```bash
   git checkout -b feat/octree-chunking
   ```
2. Write clean code following idiomatic Rust guidelines (`cargo fmt` and `cargo clippy`).
3. Add unit tests verifying your algorithms.
4. Ensure all CI checks and tests pass locally.
5. Submit a Pull Request detailing the purpose, changes, and scientific/technical considerations.
