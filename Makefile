# Makefile for NodeKit packaging

build-browser:
	cd nodekit-browser && \
	npm run build && \
	cp -r dist/ ../nodekit/_static

build: build-browser
	rm -rf dist && \
	uv build

lint:
	uvx ruff check --fix && \
	uvx ruff format

check:
	uvx ty check && \
	uvx ruff check && \
	uvx ruff format --check