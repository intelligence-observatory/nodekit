# Makefile for NodeKit packaging

build-browser:
	cd nodekit-browser && \
	npm run build && \
	cp -r dist/ ../nodekit/_static

build: build-browser
	rm -rf dist && \
	uv build

lint:
	uv run ruff check --fix && \
	uv run ruff format

check:
	uv run ty check && \
	uv run ruff check && \
	uv run ruff format --check