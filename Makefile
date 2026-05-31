SERVER_IMAGE_NAME ?= nodekit-server
SERVER_PORT ?= 8000
SERVER_API_TOKEN ?= dev-token

lint:
	uv run ruff check --fix && \
	uv run ruff format

check:
	uv run ty check && \
	uv run ruff check && \
	uv run ruff format --check

test:
	uv run pytest tests

run-example:
	uv run python examples/cor-task/my_cor_task.py

set-version:
	@test -n "$(VERSION)" || (echo "Usage: make set-version VERSION=x.y.z" && exit 1)
	uv run python scripts/set_version.py "$(VERSION)"

build-browser:
	cd src/nodekit-browser && \
	npm run build && \
	cp dist/nodekit.js dist/nodekit.css ../nodekit/_static

build-docs:
	cd docs && \
	uv run mkdocs build --strict

build: lint check test build-browser build-docs
	rm -rf dist && \
	uv build

view-docs: build-docs
	cd docs && \
	uv run mkdocs serve --livereload

server-build:
	docker build -f Dockerfile.server -t $(SERVER_IMAGE_NAME):local .

server-run: server-build
	docker run --rm \
		-p $(SERVER_PORT):8000 \
		-e NODEKIT_SERVER_DATABASE_URL=sqlite:////tmp/nodekit-server.db \
		-e NODEKIT_SERVER_ASSET_STORE_DIR=/tmp/nodekit-server-assets \
		-e NODEKIT_SERVER_BOOTSTRAP_ADMIN_API_TOKEN=$(SERVER_API_TOKEN) \
		$(SERVER_IMAGE_NAME):local

publish: build
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
	uv publish
