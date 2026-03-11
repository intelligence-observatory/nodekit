import os
from pathlib import Path

import matplotlib
import numpy as np

from nodekit.events import Event, PointerSampledEvent

matplotlib.use("Agg")  # safe for headless render
import matplotlib.pyplot as plt
from matplotlib import animation
from matplotlib.colors import to_rgba


# %%
Color = tuple[float, float, float, float]
ColorSpec = Color | dict[str, Color]


# %%
def make_animation(
    events: dict[str, list[Event]],  # trace_id -> event stream
    savepath: os.PathLike | str,
    accent_rgba: ColorSpec = (
        49 / 255,
        124 / 255,
        245 / 255,
        0.9,
    ),
    neutral_rgba: ColorSpec = (0.1, 0.1, 0.1, 0.3),
    background_color_rgba: Color = (0.0, 0.0, 0.0, 0.0),
    movie_size_px: int = 500,
    movie_time_sec: int = 10,
    time_scale: float = 1.0,
):
    """
    Render multiple pointer streams into a .mov.

    Visual semantics (per trace):
      - DOWN/UP: accent-colored dots; alpha and (UP) size decay over time.
      - Other kinds (e.g., MOVE): no dots, but still drive trails.
      - Persistent trail: path from start to current time, neutral color, no fade, 1/4 width.
      - Following trail: segment from previous sample to the time-interpolated point toward next sample,
        neutral color, fades with the move tau.

    Z-index:
      - Traces are layered by insertion order of `events` (earlier keys are below later keys),
        and this order is fixed for the whole movie. Within each trace: persistent (lowest),
        then following, then DOWN/UP dots (highest).

    Coordinates:
      - Input x,y in pixels, origin at board center; board extent is 1024 x 1024,
        so x,y are in [-512, 512]. Output is a square of size movie_size_px.

    Timing:
      - 60 fps; frames are spaced at 1000/fps ms. Samples outside
        [0, movie_time_sec*1000) ms are ignored after time scaling.
      - Movie time = physical time / time_scale.

    Args:
        events: Mapping from trace id to event sequences. Non-pointer events are ignored.
            Pointer events are sorted by time and filtered to the movie time window.
        savepath: Destination path for the rendered .mov (suffix forced to .mov).
        accent_rgba: RGBA color used for DOWN/UP dots, or a per-trace mapping.
        neutral_rgba: RGBA color used for trails, or a per-trace mapping.
        background_color_rgba: RGBA background color for the output (alpha=0 is transparent).
        movie_size_px: Output movie size in pixels (square).
        movie_time_sec: Output movie length in seconds.
        time_scale: Playback speed multiplier (movie time = physical time / time_scale).

    Raises:
        ValueError: If accent_rgba or neutral_rgba are dicts that do not enumerate all trace ids.
        ValueError: If time_scale is not positive.

    Returns:
        None. Writes a .mov to savepath.
    """

    # ----------------------------
    # Params & scaling
    # ----------------------------
    if time_scale <= 0:
        raise ValueError("time_scale must be > 0")

    board_size_px = 1024.0
    half_board_px = board_size_px / 2.0
    scale = movie_size_px / board_size_px  # baseline-normalized scaling

    fps = 60
    movie_time_ms = int(movie_time_sec * 1000)
    frame_interval_ms = 1000.0 / fps

    # Decays (alpha ~ exp(-dt / tau))
    tau_alpha_ms_move = 500.0
    tau_alpha_ms_down = 700.0
    tau_alpha_ms_up = 600.0
    tau_size_ms_up = tau_alpha_ms_up

    # Sizes (scatter 's' is points^2)
    down_size0 = 90.0 * scale**2
    up_size0 = 400.0 * scale**2

    # Line widths
    linewidth_follow = 10.0 * scale  # following trail
    linewidth_persist = 0.25 * linewidth_follow  # persistent trail

    # Tail window for DOWN/UP visibility
    tail_window_ms = int(6 * max(tau_alpha_ms_move, tau_alpha_ms_down, tau_alpha_ms_up))

    # ----------------------------
    # Normalize & validate color specs
    # ----------------------------
    trace_ids = list(events.keys())  # insertion order retained

    def _normalize_color_spec(spec: ColorSpec, name: str) -> dict[str, Color]:
        if isinstance(spec, dict):
            missing = set(trace_ids) - set(spec.keys())
            extra = set(spec.keys()) - set(trace_ids)
            if missing or extra:
                raise ValueError(
                    f"{name} dict must enumerate exactly all traces. "
                    f"Missing: {sorted(missing)}; Extra: {sorted(extra)}"
                )
            return {k: to_rgba(v) for k, v in spec.items()}
        else:
            rgba = to_rgba(spec)
            return {k: rgba for k in trace_ids}

    per_trace_accent = _normalize_color_spec(accent_rgba, "accent_rgba")
    per_trace_neutral = _normalize_color_spec(neutral_rgba, "neutral_rgba")
    background_rgba = to_rgba(background_color_rgba)
    transparent = background_rgba[3] == 0.0

    # ----------------------------
    # Preprocess per-trace arrays (pointer events only, sorted, filtered to movie window)
    # ----------------------------
    streams = []  # list of dicts, in z-order
    for tid in trace_ids:
        pointer_events = [e for e in events[tid] if isinstance(e, PointerSampledEvent)]
        if not pointer_events:
            # still create an empty stream so z-ordering remains consistent
            streams.append(
                dict(
                    trace_id=tid,
                    kinds=np.array([], dtype=object),
                    xs=np.array([], dtype=float),
                    ys=np.array([], dtype=float),
                    ts=np.array([], dtype=float),
                    accent=per_trace_accent[tid],
                    neutral=per_trace_neutral[tid],
                )
            )
            continue

        pointer_events.sort(key=lambda e: e.t)

        kinds = np.array([e.kind for e in pointer_events], dtype=object)
        xs = np.array([e.x for e in pointer_events], dtype=float)
        ys = np.array([e.y for e in pointer_events], dtype=float)
        ts = np.array([e.t for e in pointer_events], dtype=float) / time_scale

        in_window = (ts >= 0) & (ts < movie_time_ms)
        if not np.any(in_window):
            streams.append(
                dict(
                    trace_id=tid,
                    kinds=np.array([], dtype=object),
                    xs=np.array([], dtype=float),
                    ys=np.array([], dtype=float),
                    ts=np.array([], dtype=float),
                    accent=per_trace_accent[tid],
                    neutral=per_trace_neutral[tid],
                )
            )
            continue

        kinds = kinds[in_window]
        xs = xs[in_window]
        ys = ys[in_window]
        ts = ts[in_window]

        streams.append(
            dict(
                trace_id=tid,
                kinds=kinds,
                xs=xs,
                ys=ys,
                ts=ts,
                accent=per_trace_accent[tid],
                neutral=per_trace_neutral[tid],
            )
        )

    # ----------------------------
    # Figure/axes
    # ----------------------------
    dpi = 100
    fig_inch = movie_size_px / dpi
    fig = plt.figure(figsize=(fig_inch, fig_inch), dpi=dpi)
    ax = plt.axes((0, 0, 1, 1))
    ax.set_xlim(-half_board_px, half_board_px)
    ax.set_ylim(-half_board_px, half_board_px)
    ax.set_aspect("equal", adjustable="box")

    fig.patch.set_facecolor(background_rgba)
    ax.set_facecolor(background_rgba)
    for spine in ax.spines.values():
        spine.set_visible(False)
    ax.set_xticks([])
    ax.set_yticks([])

    # ----------------------------
    # Artists per trace in insertion order (controls z-index)
    # ----------------------------
    # Within each trace: persistent (lowest), following, points (highest)
    trace_artists = []
    for z, stream in enumerate(streams):
        base_z = z * 3  # reserve 3 zorders per trace
        # persistent neutral path
        (persist_line,) = ax.plot(
            [],
            [],
            linewidth=linewidth_persist,
            solid_capstyle="round",
            solid_joinstyle="round",
            zorder=base_z + 0,
        )
        persist_line.set_color(stream["neutral"])

        # following neutral segment (fading)
        (follow_line,) = ax.plot(
            [],
            [],
            linewidth=linewidth_follow,
            solid_capstyle="round",
            solid_joinstyle="round",
            zorder=base_z + 1,
        )
        follow_line.set_color(
            (stream["neutral"][0], stream["neutral"][1], stream["neutral"][2], 0.0)
        )

        # DOWN/UP scatter only
        scatter = ax.scatter([], [], s=[], facecolors=[], edgecolors="none", zorder=base_z + 2)

        trace_artists.append(
            dict(scatter=scatter, persist=persist_line, follow=follow_line, stream=stream)
        )

    # ----------------------------
    # Frames
    # ----------------------------
    num_frames = fps * movie_time_sec
    frame_times_ms = np.arange(num_frames, dtype=float) * frame_interval_ms

    empty_offsets = np.empty((0, 2))
    empty_sizes = np.empty((0,))
    empty_colors = np.empty((0, 4))

    def _clear_scatter(scatter_artist):
        scatter_artist.set_offsets(empty_offsets)
        scatter_artist.set_sizes(empty_sizes)
        scatter_artist.set_facecolors(empty_colors)

    def _clear_follow(line_artist, neutral: Color):
        line_artist.set_data([], [])
        line_artist.set_color((neutral[0], neutral[1], neutral[2], 0.0))

    def init():
        for trace in trace_artists:
            _clear_scatter(trace["scatter"])
            trace["persist"].set_data([], [])
            _clear_follow(trace["follow"], trace["stream"]["neutral"])

        # return a flat tuple of all artists for blitting
        out = []
        for trace in trace_artists:
            out.extend([trace["scatter"], trace["persist"], trace["follow"]])
        return tuple(out)

    def update(frame_idx: int):
        t_now = float(frame_times_ms[frame_idx])

        drawn = []
        for trace in trace_artists:
            stream = trace["stream"]
            kinds, xs, ys, ts = stream["kinds"], stream["xs"], stream["ys"], stream["ts"]
            accent, neutral = stream["accent"], stream["neutral"]

            # --- DOWN/UP points within tail window ---
            if ts.size == 0:
                _clear_scatter(trace["scatter"])
                trace["persist"].set_data([], [])
                _clear_follow(trace["follow"], neutral)
                drawn.extend([trace["scatter"], trace["persist"], trace["follow"]])
                continue
            else:
                idx_next = np.searchsorted(ts, t_now, side="right")
                idx_prev = idx_next - 1

                t_min = max(0.0, t_now - tail_window_ms)
                idx_tail_start = np.searchsorted(ts, t_min, side="left")
                idx_tail_end = idx_next

                if idx_tail_end <= idx_tail_start:
                    _clear_scatter(trace["scatter"])
                else:
                    tail_slice = slice(idx_tail_start, idx_tail_end)
                    dt = t_now - ts[tail_slice]
                    k = kinds[tail_slice]
                    xm = xs[tail_slice]
                    ym = ys[tail_slice]

                    down_mask = k == "down"
                    up_mask = k == "up"
                    keep = down_mask | up_mask

                    if not np.any(keep):
                        _clear_scatter(trace["scatter"])
                    else:
                        dt_keep = dt[keep]
                        down_keep = down_mask[keep]
                        up_keep = up_mask[keep]

                        alpha = np.zeros_like(dt_keep, dtype=float)
                        alpha[down_keep] = np.exp(-dt_keep[down_keep] / tau_alpha_ms_down)
                        alpha[up_keep] = np.exp(-dt_keep[up_keep] / tau_alpha_ms_up)

                        size = np.zeros_like(dt_keep, dtype=float)
                        size[down_keep] = down_size0
                        size[up_keep] = up_size0 * np.exp(-dt_keep[up_keep] / tau_size_ms_up)
                        size = np.clip(size, 0.1, None)

                        colors = np.tile(accent, (len(alpha), 1)).astype(float)
                        colors[:, 3] = np.clip(colors[:, 3] * alpha, 0.0, 1.0)

                        trace["scatter"].set_offsets(np.column_stack([xm[keep], ym[keep]]))
                        trace["scatter"].set_sizes(size)
                        trace["scatter"].set_facecolors(colors)

            # --- Persistent trail: single path up to now (neutral, no fade) ---
            if idx_next == 0:
                trace["persist"].set_data([], [])
            else:
                path_x = xs[:idx_next]
                path_y = ys[:idx_next]
                if idx_next < ts.size:
                    t0 = ts[idx_prev]
                    t1 = ts[idx_next]
                    if t1 > t0:
                        frac = (t_now - t0) / (t1 - t0)
                        x_star = xs[idx_prev] + frac * (xs[idx_next] - xs[idx_prev])
                        y_star = ys[idx_prev] + frac * (ys[idx_next] - ys[idx_prev])
                        path_x = np.concatenate([path_x, [x_star]])
                        path_y = np.concatenate([path_y, [y_star]])

                if path_x.size >= 2:
                    trace["persist"].set_data(path_x, path_y)
                else:
                    trace["persist"].set_data([], [])

            # --- Following trail: single segment prev -> interpolated now (neutral, fades) ---
            _clear_follow(trace["follow"], neutral)
            if idx_prev >= 0 and idx_next < ts.size and idx_next == idx_prev + 1:
                t0, t1 = ts[idx_prev], ts[idx_next]
                x0, y0 = xs[idx_prev], ys[idx_prev]
                x1, y1 = xs[idx_next], ys[idx_next]
                frac = (t_now - t0) / (t1 - t0)
                x_star = x0 + frac * (x1 - x0)
                y_star = y0 + frac * (y1 - y0)

                alpha_line = float(np.exp(-(t_now - t0) / float(tau_alpha_ms_move)))
                rgba = (
                    neutral[0],
                    neutral[1],
                    neutral[2],
                    np.clip(neutral[3] * alpha_line, 0.0, 1.0),
                )

                trace["follow"].set_data([x0, x_star], [y0, y_star])
                trace["follow"].set_color(rgba)

            drawn.extend([trace["scatter"], trace["persist"], trace["follow"]])

        return tuple(drawn)

    anim = animation.FuncAnimation(
        fig,
        update,
        init_func=init,
        frames=num_frames,
        interval=frame_interval_ms,
        blit=True,
    )

    # ----------------------------
    # Save with requested background
    # ----------------------------
    savepath = Path(savepath)
    savepath.parent.mkdir(parents=True, exist_ok=True)
    if savepath.suffix.lower() != ".mov":
        savepath = savepath.with_suffix(".mov")

    try:
        try:
            writer = animation.FFMpegWriter(
                fps=fps,
                codec="prores_ks",
                extra_args=[
                    "-pix_fmt",
                    "yuva444p10le",
                    "-profile:v",
                    "4444",
                    "-vendor",
                    "ap10",
                    "-bits_per_mb",
                    "8000",
                ],
                bitrate=-1,
            )
            anim.save(
                str(savepath),
                writer=writer,
                dpi=dpi,
                savefig_kwargs={"transparent": transparent, "facecolor": background_rgba},
            )
        except Exception:
            writer = animation.FFMpegWriter(
                fps=fps,
                codec="png",
                extra_args=["-pix_fmt", "rgba"],
                bitrate=-1,
            )
            anim.save(
                str(savepath),
                writer=writer,
                dpi=dpi,
                savefig_kwargs={"transparent": transparent, "facecolor": background_rgba},
            )
    finally:
        plt.close(fig)


# %%
if __name__ == "__main__":
    import json

    payload = json.loads(
        Path("example_pointer_events.json").read_text()
    )  # hit_id: List[PointerSampledEvent]
    # payload = json.loads(Path('/Users/mjl/Library/Application Support/JetBrains/PyCharm2025.1/scratches/nodekit-turk/fitts-law-pointers-example_pointer_events.json').read_text()) # hit_id: List[PointerSampledEvent]
    pointer_events = {
        hit_id: [PointerSampledEvent.model_validate(ev) for ev in payload[hit_id]]
        for hit_id in sorted(payload.keys())
    }

    # Get minimum time and left shift everything
    max_t_grand = 0
    for hit_id in pointer_events.keys():
        min_t = min([ev.t for ev in pointer_events[hit_id]])
        max_t = max([ev.t for ev in pointer_events[hit_id]])
        if max_t > max_t_grand:
            max_t_grand = max_t

        for ev in pointer_events[hit_id]:
            ev.t -= min_t

    movie_time_sec = int(min(10, max_t_grand / 1000))
    make_animation(
        events=pointer_events,
        accent_rgba=(49 / 255, 124 / 255, 245 / 255, 0.9),
        neutral_rgba=(0.1, 0.1, 0.1, 0.3),
        savepath="movie.mov",
        movie_size_px=500,
        movie_time_sec=movie_time_sec,
    )
