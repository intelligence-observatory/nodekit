lint:
	uv run ruff check --fix && \
	uv run ruff format

check:
	uv run ty check && \
	uv run ruff check && \
	uv run ruff format --check

test:
	uv run pytest tests

set-version:
	@test -n "$(VERSION)" || (echo "Usage: make set-version VERSION=x.y.z" && exit 1)
	uv run python scripts/set_version.py "$(VERSION)"

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
	cd nodekit-rs && \
    ./build_video.sh && \
	maturin develop --release --uv

nodekit-rs-stub-gen:
	cd nodekit-rs && \
	./build_video.sh && \
	cargo run --example stub_gen && \
	python3 fix_pyi.py

build: lint check test build-browser build-docs build-rs
	rm -rf dist && \
	uv build

view-docs: build-docs
	cd docs && \
	uv run mkdocs serve --livereload


publish:
	@version="$$(uv version --short)"; \
	case "$$version" in \
		*.dev*) ;; \
		*) \
			printf "Version %s does not include .dev. Continue? [y/N] " "$$version"; \
			read -r answer; \
			case "$$answer" in \
				y|Y) ;; \
				*) echo "Aborted."; exit 1 ;; \
			esac ;; \
	esac; \
	rm -rf dist && \
	uv build && \
	uv publish
