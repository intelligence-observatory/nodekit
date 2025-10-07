# Makefile for NodeKit packaging

build-browser:
	cd nodekit-browser && \
	npm run build && \
	cp -r dist/ ../nodekit/_static

build: build-browser
	rm -rf dist && \
	uv build

check:
	ty check && \
	ruff check && \
	ruff format --check