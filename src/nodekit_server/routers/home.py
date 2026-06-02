"""Homepage route for nodekit-server."""

import textwrap

import fastapi
from fastapi.responses import HTMLResponse

from nodekit import VERSION


# %% Router
router = fastapi.APIRouter()


# %% Homepage
@router.get("/", include_in_schema=False)
def get_home() -> HTMLResponse:
    """Return a simple operational homepage."""

    html = textwrap.dedent(
        """
        <!doctype html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>NodeKit Server</title>
            <style>
                :root {
                    color-scheme: light;
                    --ink: #171717;
                    --muted: #5f6368;
                    --line: #d8dee4;
                    --surface: #f7f8fa;
                    --accent: #88d4b5;
                    --ok: #1a7f37;
                }
                * {
                    box-sizing: border-box;
                }
                body {
                    margin: 0;
                    min-height: 100vh;
                    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
                        "Segoe UI", sans-serif;
                    color: var(--ink);
                    background: #ffffff;
                }
                main {
                    width: min(920px, calc(100vw - 40px));
                    margin: 0 auto;
                    padding: 64px 0;
                }
                header {
                    display: grid;
                    gap: 14px;
                    padding-bottom: 28px;
                    border-bottom: 1px solid var(--line);
                }
                .meta {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    gap: 10px;
                }
                .status {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    width: fit-content;
                    padding: 5px 9px;
                    border: 1px solid #b7e2c2;
                    border-radius: 6px;
                    color: var(--ok);
                    background: #f0fff4;
                    font-size: 14px;
                    font-weight: 600;
                }
                .version {
                    color: var(--muted);
                    font-size: 13px;
                }
                .dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: var(--ok);
                }
                h1 {
                    margin: 0;
                    font-size: 40px;
                    line-height: 1.05;
                    letter-spacing: 0;
                }
                p {
                    max-width: 680px;
                    margin: 0;
                    color: var(--muted);
                    font-size: 17px;
                    line-height: 1.55;
                }
                nav {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
                    gap: 12px;
                    margin-top: 28px;
                }
                a {
                    display: block;
                    min-height: 96px;
                    padding: 16px;
                    border: 1px solid var(--line);
                    border-radius: 8px;
                    color: var(--ink);
                    text-decoration: none;
                    background: var(--surface);
                }
                a:hover {
                    border-color: var(--accent);
                    background: #ffffff;
                }
                strong {
                    display: block;
                    margin-bottom: 8px;
                    font-size: 15px;
                }
                span {
                    display: block;
                    color: var(--muted);
                    font-size: 14px;
                    line-height: 1.4;
                }
                code {
                    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
                    font-size: 0.95em;
                }
                @media (max-width: 560px) {
                    main {
                        width: min(100vw - 28px, 920px);
                        padding: 40px 0;
                    }
                    h1 {
                        font-size: 32px;
                    }
                    p {
                        font-size: 16px;
                    }
                }
            </style>
        </head>
        <body>
            <main>
                <header>
                    <div class="meta">
                        <div class="status"><span class="dot"></span>Online</div>
                        <div class="version">v__NODEKIT_VERSION__</div>
                    </div>
                    <h1>NodeKit Server</h1>
                    <p>
                        A deployment service for hosting NodeKit Sites, resolving Assets,
                        and collecting participant Runs.
                    </p>
                </header>
                <nav aria-label="Server links">
                    <a href="/health">
                        <strong>Health</strong>
                        <span>Read the server liveness response.</span>
                    </a>
                    <a href="/docs">
                        <strong>API Docs</strong>
                        <span>Open the FastAPI reference for researcher and admin routes.</span>
                    </a>
                </nav>
            </main>
        </body>
        </html>
        """
    ).strip()
    html = html.replace("__NODEKIT_VERSION__", VERSION)
    return HTMLResponse(content=html)
