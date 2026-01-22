lint:
	uv run ruff check --fix && \
	uv run ruff format

check:
	uv run ty check && \
	uv run ruff check && \
	uv run ruff format --check

test:
	uv run pytest tests

build-browser:
	cd nodekit-browser && \
	npm run build && \
	cp dist/nodekit.js dist/nodekit.css ../nodekit/_static

build-docs:
	cd docs && \
	uv run mkdocs build --strict

install-maturin:
	uv tool install maturin

build-rs: install-maturin
	maturin develop --manifest-path nodekit-rs/Cargo.toml --release --uv

nodekit-rs-stub-gen:
	cd nodekit-rs && \
	cargo run --example stub_gen && \
	python3 fix_pyi.py

build: lint check test build-browser build-docs build-rs
	rm -rf dist && \
	uv build

view-docs: build-docs
	cd docs && \
	uv run mkdocs serve --livereload
