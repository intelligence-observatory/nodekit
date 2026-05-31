# nodekit-server

`nodekit-server` is the optional FastAPI backend for hosting NodeKit Sites, storing Assets, and collecting participant Runs.

## Local Docker Server

Start the local server from the repository root:

```bash
make server-run
```

The first run creates `.env.nodekit-server` from `nodekit-server/.env.example`, builds the `nodekit-server:local` Docker image, and starts the API on <http://localhost:8000>.

Local state is persisted under `.nodekit-server/`:

- `.nodekit-server/data`: SQLite database
- `.nodekit-server/assets`: filesystem Asset store

The default development API token is `dev-token`. Override settings by editing `.env.nodekit-server` or by passing Make variables:

```bash
make server-run SERVER_PORT=8010 SERVER_ENV_FILE=.env.nodekit-server
```

## Build Only

```bash
make server-build
```

The Dockerfile lives at `nodekit-server/Dockerfile`, but the build context is still the repository root so the image can include the local `nodekit` package and root lockfile.
