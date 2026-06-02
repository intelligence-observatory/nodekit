# nodekit-server

`nodekit-server` is the optional FastAPI backend for hosting NodeKit Sites, storing Assets, and collecting participant Runs.

The packaged server source lives in `src/nodekit_server/`. Local Docker support lives at the repository root in `Dockerfile.server`.

## Local Docker Server

Start the local server from the repository root:

```bash
make server-run
```

This builds the `nodekit-server:local` Docker image and starts an ephemeral API on <http://localhost:8000>.

Local state is stored inside the container:

- `/tmp/nodekit-server.db`: SQLite database
- `/tmp/nodekit-server-assets`: filesystem Asset store

Because `docker run --rm` is used and no repository volume is mounted, stopping the container deletes this local state.

The default development API token is `dev-token`. Override local run settings with Make variables:

```bash
make server-run SERVER_PORT=8010 SERVER_API_TOKEN=my-token
```

## Build Only

```bash
make server-build
```

The Dockerfile lives at `Dockerfile.server`, and the build context is the repository root so the image can include the local `src/nodekit` and `src/nodekit_server` packages plus the root lockfile.

Persistent local deployments and production deployments should provide environment variables through their own Docker invocation, compose file, deployment repo, or host-level service manager.

## Asset Storage

The local Docker server uses filesystem Asset storage by default:

```bash
NODEKIT_SERVER_ASSET_STORE_BACKEND=filesystem
NODEKIT_SERVER_ASSET_STORE_DIR=/asset-store
```

For S3-backed storage, configure the backend and a public base URL:

```bash
NODEKIT_SERVER_ASSET_STORE_BACKEND=s3
NODEKIT_SERVER_S3_BUCKET_NAME=my-nodekit-assets
NODEKIT_SERVER_S3_REGION_NAME=us-east-1
NODEKIT_SERVER_S3_PREFIX=assets
NODEKIT_SERVER_S3_PUBLIC_BASE_URL=https://my-nodekit-assets.s3.us-east-1.amazonaws.com
```

Uploaded Assets are stored under content-addressed S3 keys such as `assets/<sha256>`. Participant requests to `/assets/<sha256>` redirect to the configured public URL. Bucket permissions, CORS, and public-read or CDN configuration are deployment responsibilities.

## Frozen Site Artifacts

By default, participant Sites are frozen to the local filesystem:

```bash
NODEKIT_SERVER_SITE_HOSTING_BACKEND=filesystem
NODEKIT_SERVER_SITE_STORE_DIR=/site-store
```

For S3-backed frozen Site artifact hosting:

```bash
NODEKIT_SERVER_SITE_HOSTING_BACKEND=s3
NODEKIT_SERVER_S3_SITE_BUCKET_NAME=my-nodekit-sites
NODEKIT_SERVER_S3_REGION_NAME=us-east-1
NODEKIT_SERVER_S3_SITE_PREFIX=nodekit-artifacts
NODEKIT_SERVER_S3_SITE_PUBLIC_BASE_URL=https://my-nodekit-sites.s3.us-east-1.amazonaws.com
```

The canonical participant URL remains `/s/<site_id>`. The server checks archive status, forwards all incoming query parameters, adds or updates `nodekitSubmitTo`, and redirects to the frozen artifact URL. Frozen Site artifacts reference immutable runtime objects such as `runtime/nodekit.<sha256>.js`.
