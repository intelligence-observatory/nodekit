# Repository Guidelines

## Project Goals
NodeKit is a task-description language and execution engine for behavioral and cognitive-science tasks.
Its purpose is to let researchers specify experiments as deterministic, portable, declarative graphs that run identically across:
- humans (in browser)
- AI agents (via headless Python environments)

### Core goals of NodeKit
1. Determinism: No hidden state. No implicit randomness. All behavior arises from explicit Node, Graph, and Transition definitions.
2. Portability: A task defined once in NodeKit must run identically in Python and TypeScript runtimes.
3. Declarativity: NodeKit describes what the task _is_, not how to execute it.
4. Minimalism: NodeKit should constantly strive for containing the smallest possible set of concepts. Expressivity should come through _composition_, not by introducing new members to the ontology.

### Why NodeKit exists
Traditional psych tasks are implemented as bespoke spaghetti code: ad-hoc state machines scattered across JS callbacks, inconsistent timing behavior, and non-portable logic. NodeKit provides:
- a single canonical representation of a task
- predictable execution
- an object model suitable for AI agents to interact with

## Project Structure & Module Organization
- Core Python package lives in `nodekit/` (Pydantic models for cards/sensors/actions/events/expressions, ops such as play/build, kernel evaluator). Generated browser assets land in `nodekit/_static`.
- `nodekit-browser/` (npm) builds the front-end bundle feeding `_static`.
- `examples/` holds runnable tasks; `docs/` contains EFSM and board notes; `tests/` stores pytest; `dist/` is build output. Config roots: `pyproject.toml`, `uv.lock`, `Makefile`.
- The `_static` directory contains builds of `nodekit-browser`; these should not be inspected by the Agent.

## Build, Test, and Development Commands
- `uv sync --dev` installs Python deps with lock enforcement.
- `make build-browser`: build `nodekit-browser/` and copy bundle to `_static`.
- `make build`: rebuild browser assets and run `uv build` for the package.
- `make lint`: Ruff lint/format with fixes.
- Use `make lint` to autofix lint/format issues instead of manual formatting.
- `make check`: type-check (`ty`), Ruff lint, and formatting verification.
- After code changes, run `make check` to verify type-checking and lint compliance.
- `uv run pytest`: run tests in `tests/`; add `-k <pattern>` to scope.

## Coding Style, Schemas & Naming
- Python >=3.12, PEP 8 (4-space indent, snake_case identifiers, PascalCase classes). Modules stay lower_snake.
- Ruff is the formatting/linting authority; keep `make check` clean before PRs.
- Do not hand-edit `_static` outputs—modify `nodekit-browser/` and rebuild.
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
