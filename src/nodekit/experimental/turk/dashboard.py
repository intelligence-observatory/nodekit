import datetime
import errno
import html
import socket
import threading
from collections.abc import Iterable, Sequence
from dataclasses import dataclass
from decimal import Decimal
from typing import Any

import uvicorn
from fastapi import FastAPI, Query
from fastapi.responses import HTMLResponse, PlainTextResponse

from nodekit.experimental.turk.models import Assignment, BonusPayment, HIT
from nodekit.experimental.turk.recruiter import HitRecord, MturkRecruiterClient
from nodekit.experimental.turk.values import CacheRefreshPolicy, HitId


# %% Constants
HITS_PER_PAGE = 20
ASSIGNMENTS_PER_PAGE = 20
DEFAULT_DASHBOARD_PORT = 8765
LOCAL_DASHBOARD_HOSTS = {"127.0.0.1", "localhost", "::1"}


# %% Handles
@dataclass(frozen=True)
class DashboardHandle:
    """Handle for a non-blocking MTurk recruiter dashboard server."""

    url: str
    host: str
    port: int
    server: uvicorn.Server
    thread: threading.Thread

    def stop(self, *, timeout_sec: float = 5.0) -> None:
        """Stop the dashboard server."""

        self.server.should_exit = True
        self.thread.join(timeout=timeout_sec)


# %% App
def create_dashboard_app(
    recruiter: MturkRecruiterClient,
    *,
    default_refresh: CacheRefreshPolicy = "auto",
) -> FastAPI:
    """Create a read-only MTurk recruiter dashboard app."""

    app = FastAPI(title="NodeKit MTurk Dashboard")

    @app.get("/", response_class=HTMLResponse)
    def index(
        page: int = Query(default=1, ge=1),
        refresh: CacheRefreshPolicy | None = None,
    ) -> HTMLResponse:
        refresh_policy = refresh or default_refresh
        records = sorted(
            recruiter.iter_hits(refresh=refresh_policy, include_closed=True),
            key=lambda record: record.timestamp_created,
            reverse=True,
        )
        visible, pagination = _paginate(records, page=page, per_page=HITS_PER_PAGE)
        balance = _try_account_balance(recruiter)

        rows = []
        for record in visible:
            hit = record.hit
            rows.append(
                _row(
                    [
                        _link(record.hit_id, f"/hits/{_escape(record.hit_id)}"),
                        _text(record.title),
                        _text(hit.HITStatus if hit is not None else ""),
                        _number(hit.NumberOfAssignmentsCompleted if hit is not None else None),
                        _number(hit.NumberOfAssignmentsPending if hit is not None else None),
                        _number(hit.NumberOfAssignmentsAvailable if hit is not None else None),
                        _number(hit.MaxAssignments if hit is not None else None),
                        _money(hit.Reward if hit is not None else None),
                        _datetime(record.timestamp_created),
                        _datetime(record.timestamp_refreshed),
                    ]
                )
            )

        body = [
            "<h1>MTurk Dashboard</h1>",
            _metadata(
                [
                    ("Account balance", balance),
                    ("Cache", str(recruiter.cache.root)),
                    ("Refresh", refresh_policy),
                ]
            ),
            '<nav><a href="/?refresh=always">Refresh from MTurk</a></nav>',
            _table(
                headings=[
                    "HIT",
                    "Title",
                    "Status",
                    "Completed",
                    "Pending",
                    "Available",
                    "Max",
                    "Reward",
                    "Created",
                    "Refreshed",
                ],
                rows=rows,
                empty="No cached HITs.",
            ),
            _pagination(
                current_page=pagination.current_page,
                total_pages=pagination.total_pages,
                base_path="/",
                page_param="page",
                extra_params={"refresh": refresh} if refresh is not None else {},
            ),
        ]
        return HTMLResponse(_page("MTurk Dashboard", body))

    @app.get("/hits/{hit_id}", response_class=HTMLResponse)
    def hit_detail(
        hit_id: HitId,
        assignments_page: int = Query(default=1, ge=1),
        refresh: CacheRefreshPolicy | None = None,
    ) -> HTMLResponse:
        refresh_policy = refresh or default_refresh
        record = recruiter.get_hit(hit_id, refresh=refresh_policy)
        assignments = list(recruiter.iter_assignments(hit_id, refresh=refresh_policy))
        visible_assignments, assignment_pagination = _paginate(
            assignments,
            page=assignments_page,
            per_page=ASSIGNMENTS_PER_PAGE,
        )
        bonus_payments = list(recruiter.iter_bonus_payments(hit_id=hit_id, refresh=refresh_policy))

        body = [
            '<nav><a href="/">HITs</a></nav>',
            f"<h1>{_escape(record.title)}</h1>",
            _metadata(_hit_metadata(record=record, hit=record.hit, refresh_policy=refresh_policy)),
            '<nav><a href="?refresh=always">Refresh from MTurk</a></nav>',
            "<h2>Assignments</h2>",
            _table(
                headings=[
                    "Assignment",
                    "Worker",
                    "Status",
                    "Accepted",
                    "Submitted",
                    "Approved",
                    "Rejected",
                    "Deadline",
                ],
                rows=[_assignment_row(assignment) for assignment in visible_assignments],
                empty="No assignments.",
            ),
            _pagination(
                current_page=assignment_pagination.current_page,
                total_pages=assignment_pagination.total_pages,
                base_path=f"/hits/{_escape(hit_id)}",
                page_param="assignments_page",
                extra_params={"refresh": refresh} if refresh is not None else {},
            ),
            "<h2>Bonus Payments</h2>",
            _table(
                headings=["Worker", "Assignment", "Amount", "Reason", "Granted"],
                rows=[_bonus_payment_row(bonus_payment) for bonus_payment in bonus_payments],
                empty="No bonus payments.",
            ),
        ]
        return HTMLResponse(_page(record.title, body))

    @app.get("/health", response_class=PlainTextResponse)
    def health() -> PlainTextResponse:
        return PlainTextResponse("ok")

    return app


def start_dashboard(
    recruiter: MturkRecruiterClient,
    *,
    host: str = "127.0.0.1",
    port: int = DEFAULT_DASHBOARD_PORT,
    refresh: CacheRefreshPolicy = "auto",
    print_url: bool = True,
    allow_remote: bool = False,
) -> DashboardHandle:
    """Start a non-blocking read-only dashboard for an MTurk recruiter."""

    if not allow_remote and host not in LOCAL_DASHBOARD_HOSTS:
        raise ValueError("Dashboard host must be local unless allow_remote=True.")

    app = create_dashboard_app(recruiter, default_refresh=refresh)
    sock = _bind_dashboard_socket(host=host, port=port)
    actual_port = int(sock.getsockname()[1])
    sock.listen(128)

    config = uvicorn.Config(
        app,
        host=host,
        port=actual_port,
        log_level="warning",
        access_log=False,
    )
    server = uvicorn.Server(config)
    thread = threading.Thread(
        target=server.run,
        kwargs={"sockets": [sock]},
        daemon=True,
        name="nodekit-mturk-dashboard",
    )
    thread.start()

    url = f"http://{_url_host(host)}:{actual_port}"
    if print_url:
        print(f"MTurk dashboard: {url}")
    return DashboardHandle(url=url, host=host, port=actual_port, server=server, thread=thread)


# %% Rendering
def _bind_dashboard_socket(*, host: str, port: int) -> socket.socket:
    try:
        return _bind_socket(host=host, port=port)
    except OSError as error:
        if port == 0 or error.errno != errno.EADDRINUSE:
            raise
        return _bind_socket(host=host, port=0)


def _bind_socket(*, host: str, port: int) -> socket.socket:
    sock = socket.socket(socket.AF_INET6 if ":" in host else socket.AF_INET, socket.SOCK_STREAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    try:
        sock.bind((host, port))
    except Exception:
        sock.close()
        raise
    return sock


@dataclass(frozen=True)
class _Pagination:
    current_page: int
    total_pages: int


def _paginate[T](
    items: Sequence[T], *, page: int, per_page: int
) -> tuple[Sequence[T], _Pagination]:
    total_pages = max(1, (len(items) + per_page - 1) // per_page)
    current_page = min(max(page, 1), total_pages)
    start = (current_page - 1) * per_page
    end = start + per_page
    return items[start:end], _Pagination(current_page=current_page, total_pages=total_pages)


def _page(title: str, body: Iterable[str]) -> str:
    return "\n".join(
        [
            "<!doctype html>",
            '<html lang="en">',
            "<head>",
            '<meta charset="utf-8">',
            '<meta name="viewport" content="width=device-width, initial-scale=1">',
            f"<title>{_escape(title)}</title>",
            "<style>",
            "body { font-family: system-ui, sans-serif; line-height: 1.4; margin: 2rem; }",
            "main { max-width: 1200px; }",
            "table { border-collapse: collapse; width: 100%; margin-block: 1rem; }",
            "th, td { border: 1px solid currentColor; padding: 0.35rem 0.5rem; text-align: left; vertical-align: top; }",
            "th { font-weight: 600; }",
            "td, dd { word-break: break-word; }",
            "dl { display: grid; grid-template-columns: max-content 1fr; gap: 0.35rem 1rem; }",
            "dt { font-weight: 600; }",
            "dd { margin: 0; }",
            "nav { margin-block: 1rem; }",
            "nav a, nav span { margin-right: 0.75rem; }",
            "h1, h2 { line-height: 1.2; }",
            "@media (max-width: 760px) { body { margin: 1rem; } table { display: block; overflow-x: auto; } dl { display: block; } dd { margin-block-end: 0.5rem; } }",
            "</style>",
            "</head>",
            "<body>",
            "<main>",
            *body,
            "</main>",
            "</body>",
            "</html>",
        ]
    )


def _metadata(items: Iterable[tuple[str, Any]]) -> str:
    lines = ["<dl>"]
    for label, value in items:
        lines.append(f"<dt>{_escape(label)}</dt><dd>{_escape(_display(value))}</dd>")
    lines.append("</dl>")
    return "\n".join(lines)


def _hit_metadata(
    *,
    record: HitRecord,
    hit: HIT | None,
    refresh_policy: CacheRefreshPolicy,
) -> list[tuple[str, Any]]:
    items: list[tuple[str, Any]] = [
        ("HIT ID", record.hit_id),
        ("URL", record.url),
        ("Refresh", refresh_policy),
        ("Created", _display_datetime(record.timestamp_created)),
        ("Refreshed", _display_datetime(record.timestamp_refreshed)),
        ("Qualification Type IDs", ", ".join(record.qualification_type_ids) or ""),
    ]
    if hit is None:
        return items
    return [
        *items,
        ("Status", hit.HITStatus),
        ("Completed", hit.NumberOfAssignmentsCompleted),
        ("Pending", hit.NumberOfAssignmentsPending),
        ("Available", hit.NumberOfAssignmentsAvailable),
        ("Max Assignments", hit.MaxAssignments),
        ("Reward", _display_money(hit.Reward)),
        ("Expires", _display_datetime(hit.Expiration)),
    ]


def _table(*, headings: list[str], rows: list[str], empty: str) -> str:
    if not rows:
        return f"<p>{_escape(empty)}</p>"
    return "\n".join(
        [
            "<table>",
            "<thead>",
            _row([_escape(heading) for heading in headings], heading=True),
            "</thead>",
            "<tbody>",
            *rows,
            "</tbody>",
            "</table>",
        ]
    )


def _row(cells: list[str], *, heading: bool = False) -> str:
    tag = "th" if heading else "td"
    rendered_cells = "".join(f"<{tag}>{cell}</{tag}>" for cell in cells)
    return f"<tr>{rendered_cells}</tr>"


def _assignment_row(assignment: Assignment) -> str:
    return _row(
        [
            _text(assignment.AssignmentId),
            _text(assignment.WorkerId),
            _text(assignment.AssignmentStatus),
            _datetime(assignment.AcceptTime),
            _datetime(assignment.SubmitTime),
            _datetime(assignment.ApprovalTime),
            _datetime(assignment.RejectionTime),
            _datetime(assignment.Deadline),
        ]
    )


def _bonus_payment_row(bonus_payment: BonusPayment) -> str:
    return _row(
        [
            _text(bonus_payment.WorkerId),
            _text(bonus_payment.AssignmentId),
            _money(bonus_payment.BonusAmount),
            _text(bonus_payment.Reason),
            _datetime(bonus_payment.GrantTime),
        ]
    )


def _pagination(
    *,
    current_page: int,
    total_pages: int,
    base_path: str,
    page_param: str,
    extra_params: dict[str, str | None],
) -> str:
    if total_pages <= 1:
        return ""
    links = ["<nav>"]
    if current_page > 1:
        links.append(
            _link(
                "Previous",
                _page_url(
                    base_path=base_path,
                    page_param=page_param,
                    page=current_page - 1,
                    extra_params=extra_params,
                ),
            )
        )
    else:
        links.append("<span>Previous</span>")
    links.append(f"<span>Page {current_page} of {total_pages}</span>")
    if current_page < total_pages:
        links.append(
            _link(
                "Next",
                _page_url(
                    base_path=base_path,
                    page_param=page_param,
                    page=current_page + 1,
                    extra_params=extra_params,
                ),
            )
        )
    else:
        links.append("<span>Next</span>")
    links.append("</nav>")
    return "".join(links)


def _page_url(
    *,
    base_path: str,
    page_param: str,
    page: int,
    extra_params: dict[str, str | None],
) -> str:
    params = {page_param: str(page), **{key: value for key, value in extra_params.items() if value}}
    query = "&".join(f"{_escape(key)}={_escape(value)}" for key, value in params.items())
    return f"{base_path}?{query}"


def _link(label: str, href: str) -> str:
    return f'<a href="{_escape(href)}">{_escape(label)}</a>'


def _text(value: Any) -> str:
    return _escape(_display(value))


def _number(value: int | None) -> str:
    return "" if value is None else _escape(str(value))


def _money(value: Decimal | None) -> str:
    return "" if value is None else _escape(_display_money(value))


def _datetime(value: datetime.datetime | None) -> str:
    return _escape(_display_datetime(value))


def _display(value: Any) -> str:
    if value is None:
        return ""
    return str(value)


def _display_money(value: Decimal) -> str:
    return f"${value:.2f}"


def _display_datetime(value: datetime.datetime | None) -> str:
    if value is None:
        return ""
    return value.astimezone(datetime.timezone.utc).isoformat(timespec="seconds")


def _escape(value: Any) -> str:
    return html.escape(str(value), quote=True)


def _try_account_balance(recruiter: MturkRecruiterClient) -> str:
    try:
        return _display_money(recruiter.get_account_balance())
    except Exception as error:
        return f"Unavailable: {error}"


def _url_host(host: str) -> str:
    if ":" in host and not host.startswith("["):
        return f"[{host}]"
    return host
