# NodeKit Python API Todo

Findings from a wide-ranging Python API review. TypeScript, CSS, and JS issues are intentionally deprioritized here.

## P1: Correctness

- [ ] Fix `save_asset()` fallback behavior in `src/nodekit/_internal/ops/open_asset_save_asset.py`.
  - `os.link()` failures are caught, but the function returns before the streamed-copy fallback runs.
  - This can silently omit assets when source and destination are on different filesystems.

- [ ] Fix `ProductSensor` sampling in `src/nodekit/_internal/ops/simulate/sample_action.py`.
  - Current code uses `sensor[child_id]`, but `ProductSensor` is not subscriptable.
  - Use `sensor.children[child_id]` and add regression coverage.

- [ ] Make default `simulate()` behavior deterministic or explicit.
  - `simulate()` currently uses `RandomGuesser(seed=None)`, despite the docstring and project goals emphasizing determinism.
  - Consider requiring an Agent, using a fixed default seed, or documenting/renaming the stochastic default.

## P2: Schema And Runtime Invariants

- [ ] Revisit `ChildReg` validation in `Graph`.
  - `Reg` and `ChildReg` are currently checked against the parent Graph's `registers`.
  - This forces parent Graphs to declare child register names and weakens subgraph composition boundaries.

- [ ] Add missing `SliderSensor` bounds validation.
  - `initial_bin_index` should be within `[0, num_bins - 1]`.

- [ ] Add `TextEntrySensor` cross-field validation.
  - Reject `max_length < min_length`.

- [ ] Require non-empty choice/child mappings where appropriate.
  - `SelectSensor.choices`
  - `MultiSelectSensor.choices`
  - `ProductSensor.children`
  - `SumSensor.children`

- [ ] Normalize boolean semantics in expression evaluation.
  - `And` and `Or` require booleans.
  - `If` and `Not` currently use Python truthiness.
  - Prefer explicit boolean requirements for deterministic, portable behavior.

- [ ] Align register initial values with runtime `Value`.
  - `Graph.registers` accepts only `LeafValue`.
  - Expression updates can produce full `Value`, including dicts, lists, and `None`.

## P3: API Ergonomics

- [ ] Consider setting `extra="forbid"` on public Pydantic models.
  - Typos in model constructors are currently ignored silently.
  - Strict models would better support declarative, deterministic task specs.

- [ ] Smooth public namespace inconsistencies.
  - `nk.Region` exists, but `nk.values.Region` does not.
  - Consider exporting `Region` from `nodekit.values`.

- [ ] Add public convenience helpers without expanding the core ontology.
  - Graph builders for common sequential and branching patterns.
  - Node constructors for common task screens.
  - Choice, slider, and text-entry helpers.
  - Layout helpers for common Board arrangements.
  - Expression shorthands such as `lit(...)`, `reg(...)`, and `last_action()`.

- [ ] Split heavier optional features into extras.
  - `boto3`, `matplotlib`, and `pandas` appear mostly tied to experimental recruitment, S3, and visualization workflows.
  - Consider package extras for a leaner core install.
