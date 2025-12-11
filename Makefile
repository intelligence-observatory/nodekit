build-browser:
	cd nodekit-browser && \
	npm run build && \
	cp dist/nodekit.js dist/nodekit.css ../nodekit/_static

build-docs:
	cd docs && \
	uv run mkdocs build --strict

build: build-browser build-docs
	rm -rf dist && \
	uv build

lint:
	uv run ruff check --fix && \
	uv run ruff format

check:
	uv run ty check && \
	uv run ruff check && \
	uv run ruff format --check

view-docs: build-docs
	cd docs && \
	uv run mkdocs serve --livereload
