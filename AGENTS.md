# Repository Guidelines

## Project Goals
NodeKit is a task-description language and execution engine for behavioral and cognitive-science tasks.
Its purpose is to let researchers specify experiments as deterministic, portable, declarative graphs that run identically across:
- humans (in browser)
- AI agents (via headless Python environments)

### Core goals of NodeKit
1. Determinism: No hidden state. No implicit randomness. All behavior arises from explicit Node, Graph, and Transition definitions.
2. Portability: A task defined once in NodeKit must run identically in Python and TypeScript runtimes.
3. Minimalism: NodeKit should constantly strive for containing the smallest possible set of concepts. Expressivity should come through _composition_, not by introducing new members to the ontology.

### Why NodeKit exists
Traditional psych tasks are implemented as bespoke spaghetti code: ad-hoc state machines scattered across JS callbacks, inconsistent timing behavior, and non-portable logic. NodeKit provides:
- a single canonical representation of a task
- predictable execution
- an object model suitable for AI agents to interact with

## Project Structure & Module Organization
- Product source lives under `src/`.
- Core Python package lives in `src/nodekit/` (Pydantic models for cards/sensors/actions/events/expressions, ops such as play/build, kernel evaluator). Generated browser assets land in `src/nodekit/_static`.
- `src/nodekit-browser/` (npm) builds the front-end bundle feeding `_static`.
- `src/nodekit/server/` contains shared public server/client API types, values, and pagination contracts. These are importable by the Python client and by `nodekit-server`.
- `src/nodekit_server/` is the optional packaged backend service for turning Graphs into hosted participant-facing Sites, storing submissions/runs, and managing Assets. Top-level `Dockerfile.server`, `.env.nodekit-server.example`, and `NODEKIT_SERVER.md` support local server deployment. The server may depend on `nodekit`, but DB, storage, FastAPI, and deployment concerns must not leak into the core NodeKit ontology.
- `examples/` holds runnable tasks; `docs/` contains EFSM and board notes; `tests/` stores pytest; `dist/` is build output. Config roots: `pyproject.toml`, `uv.lock`, `Makefile`.
- The `_static` directory contains builds of `nodekit-browser`; these should not be inspected by the Agent.

## NodeKit Server Principles
- `nodekit-server` exists to support deploying Graphs to participants, collecting `SiteSubmission` payloads, storing Runs, and serving or locating Assets. It should be boring, explicit infrastructure around NodeKit rather than a new task ontology.
- Use the term **Site** for a frozen, hosted, participant-facing page for running a Graph. Use **Run** for one participant attempt through a Site.
- Use normalized Tags for low-semantics grouping/filtering of Sites. Avoid committing early to semantic grouping nouns such as Project or Study.
- Keep platform recruitment orchestration (polling Prolific/MTurk, approvals, payouts, quota management) adjacent to the core service. The core service should store validated facts about Sites, Runs, submissions, and Assets; platform workers can consume those facts later.
- Prefer a Python-client-first auth model based on API tokens. Browser participant flows are separate from researcher/admin auth and should align with current `nk.build_site` semantics, especially the `nodekitSubmitTo` query parameter and existing `SiteSubmission` model.
- The server should own Asset ingestion during Site creation. A client can upload a `.nkg`; the server should load the Graph, verify Asset bytes, store missing Assets, rewrite Asset locators to server-owned URLs, and store the frozen Graph snapshot.
- Asset bytes should sit behind a storage boundary. Filesystem storage should work for local/simple installs; S3 or S3-compatible storage can be used for production. FastAPI routes may stream bytes, redirect to storage/CDN URLs, or write direct CDN URLs into the frozen Graph.
- Deferred nice-to-have: support client-side materialization of Run Traces for local analysis. The server may return Traces whose Graph Asset locators point at server URLs; a later Python client helper can download missing Assets into a local content-addressed cache and return a copied Trace whose Graph Asset locators point at local filesystem paths. Asset identity should remain content-based (`sha256`, `media_type`); locators are contextual.
- Prefer the FastAPI + SQLModel stack for the server. Use `SQLModel.metadata.create_all(...)` and schema check/export/import tooling for the canonical current schema rather than Alembic migration history in this repo.
- Public server/client API contracts belong under `nodekit.server` (`types.py`, `values.py`, `pagination.py`) because both the Python client and backend service need them. SQLModel records belong in `src/nodekit_server/`; DB, storage, and FastAPI concerns should stay server-local and must not leak into the core NodeKit ontology.
- This repo should carry the canonical current `nodekit-server` schema and tooling compatible with the current NodeKit version, not a long historical migration chain. Long-lived personal or production deployments may keep their own Alembic migrations or equivalent upgrade history in a separate ops/deployment repo, then use server schema checks/export/import tools to reconcile with the canonical app schema.

## Build, Test, and Development Commands
- `uv sync --dev` installs Python deps with lock enforcement.
- `make build-browser`: build `src/nodekit-browser/` and copy bundle to `_static`.
- `make build`: rebuild browser assets and run `uv build` for the package.
- `make lint`: Ruff lint/format with fixes.
- Use `make lint` to autofix lint/format issues instead of manual formatting.
- After making code or documentation edits in a turn, run `make lint` once after all edits are complete.
- `make check`: type-check (`ty`), Ruff lint, and formatting verification.
- After code changes, run `make check` to verify type-checking and lint compliance.
- `uv run pytest`: run tests in `tests/`; add `-k <pattern>` to scope.
- `make set-version VERSION=x.y.z`: updates the Python and browser package versions together. This is a human release workflow command and should not be run automatically by the Agent.

## Coding Style, Schemas & Naming
- Python >=3.12, PEP 8 (4-space indent, snake_case identifiers, PascalCase classes). Modules stay lower_snake.
- Ruff is the formatting/linting authority; keep `make check` clean before PRs.
- Python docstrings use Google style.
- Public Python functions and ops must have Google-style docstrings, especially functions exported from `nodekit.__init__`.
- Prefer PEP 604 union syntax (`Foo | Bar`) over `typing.Union`.
- Do not hand-edit `_static` outputs—modify `src/nodekit-browser/` and rebuild.
- Schema guards: coordinate/size fields are bounded (-0.5–0.5 points, 0–1 sizes), hex colors normalized to `#rrggbbaa`, assets require valid MIME and SHA-256, multi-select `max_selections >= min_selections`, waits > 0, sliders `num_bins > 1`. Expression evaluator enforces operand types, container types, bounds, and division-by-zero checks.
- In Python, use # %% delimeters to block out sections of modules. 
- In Python examples, the recommended import style is: `import nodekit as nk`, not `from nodekit import ...`. Python examples should also never reference the `nodekit._internal` namespace.
- In comments, Node, Graph, et al should be referred to as proper nouns. e.g., "Node", not "node"

## Testing Guidelines
- Tests reside in `tests/` and follow `test_*.py`. Mirror module structure and add regression coverage for each bug fix.
- Keep unit tests fast by default; mark slow/integration if introduced. Cover new invariants (schema validation, topo checks, expression type errors) when extending behavior.

## Commit & Pull Request Guidelines
- Commit titles: short, imperative, concise (history favors lowercase summaries). Keep commits focused.
- PRs: describe changes, link issues, call out API/behavior impacts, and list commands/tests run. Add screenshots/logs for UI/behavioral shifts.

## Security & Configuration Tips
- Never commit secrets; use env vars or ignored local config.
- Keep `uv.lock` and `package-lock.json` aligned with dependency updates; rerun `make build-browser` after front-end changes.


## Documentation style:

### Tutorials
- Start with a short purpose statement, then a clear “by the end” outcome and a target Graph image.
- Organize as steps (`## Step N:`) with small sub-steps (“Define…”, “Wire…”), each with a concrete goal.
- Use first-person plural, friendly instructional tone (“we’ll”, “let’s”, “now”), short paragraphs, frequent line breaks.
- Introduce new concepts at point of use with plain-language explanations and minimal jargon.
- Use explicit imperative cues before code (“Add the following code”, “Now let’s write…”, “Begin by…”).
- Prefer full, evolving code blocks over diffs; include `hl_lines` and `linenums` in examples.
- Use MkDocs-style admonitions (`??? tip`, `???+ question`) for side notes, defaults, and rationale.
- Call out defaults and customization opportunities (“By default…”, “In general…”) and highlight key terms with **bold** or *italics*.
- Keep examples concrete and tied to UI/behavior (“press the right arrow key”, “white background”).
- Treat NodeKit concepts as proper nouns (Node, Graph, Transition) and emphasize explicit, deterministic flow.
