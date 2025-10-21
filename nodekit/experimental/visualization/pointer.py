import os
from pathlib import Path
from typing import Tuple, List

import matplotlib
import numpy as np

from nodekit.events import PointerSampledEvent

# import matplotlib
matplotlib.use("Agg")  # safe for headless render
import matplotlib.pyplot as plt
from matplotlib import animation
from matplotlib.colors import to_rgba

from typing import Dict
def make_animation(
        events: Dict[str, List[PointerSampledEvent]],  # trace_id -> event stream
        accent_rgba: Tuple[float, float, float, float] | Dict[str, Tuple[float, float, float, float]],
        neutral_rgba: Tuple[float, float, float, float] | Dict[str, Tuple[float, float, float, float]],
        savepath: os.PathLike | str,
        movie_size_px: int = 768,
        movie_time_sec: int = 10,
):
    """
    Render multiple pointer streams in a single transparent .mov.

    Visual semantics (per trace):
      - MOVE: no dots (only influences trails).
      - DOWN/UP: accent-colored dots; alpha and (UP) size decay over time.
      - Persistent trail: single path from start → 'now'; ALWAYS neutral color; no fade; 1/2 width.
      - Following trail: single segment from previous sample → time-interpolated point toward next sample;
        ALWAYS neutral color; fades with the move tau.

    Z-index:
      - Traces are layered by insertion order of `events` (earlier keys are below later keys),
        and this order is fixed for the whole movie. Within each trace: persistent trail (lowest),
        then following trail, then DOWN/UP dots (highest).

    Coordinates:
      - Input x,y in (-0.5, 0.5), right is +x, up is +y. Output is a square of size movie_size_px.

    Timing:
      - 60 fps, length = movie_time_sec. Samples outside [0, movie_time_sec*1000) ms are ignored.
    """

    # ----------------------------
    # Params & scaling
    # ----------------------------
    scale = movie_size_px / 768.0  # baseline-normalized scaling

    fps = 60
    T_ms = int(movie_time_sec * 1000)

    # Decays (alpha ~ exp(-dt / tau))
    tau_alpha_ms_move = 500.0
    tau_alpha_ms_down = 700.0
    tau_alpha_ms_up   = 600.0
    tau_size_ms_up = tau_alpha_ms_up

    # Sizes (scatter 's' is points^2)
    down_size0 = 180.0 * scale ** 2
    up_size0   = 800.0 * scale ** 2


    # Line widths
    linewidth_follow   = 10.0 * scale           # following trail
    linewidth_persist  = 0.25 * linewidth_follow # persistent trail

    # Tail window for DOWN/UP visibility
    tail_window_ms = int(6 * max(tau_alpha_ms_move, tau_alpha_ms_down, tau_alpha_ms_up))

    # ----------------------------
    # Normalize & validate color specs
    # ----------------------------
    trace_ids = list(events.keys())  # insertion order retained

    def _normalize_color_spec(spec, name: str) -> Dict[str, Tuple[float, float, float, float]]:
        if isinstance(spec, dict):
            missing = set(trace_ids) - set(spec.keys())
            extra   = set(spec.keys()) - set(trace_ids)
            if missing or extra:
                raise ValueError(
                    f"{name} dict must enumerate exactly all traces. "
                    f"Missing: {sorted(missing)}; Extra: {sorted(extra)}"
                )
            return {k: to_rgba(v) for k, v in spec.items()}
        else:
            rgba = to_rgba(spec)
            return {k: rgba for k in trace_ids}

    per_trace_accent  = _normalize_color_spec(accent_rgba,  "accent_rgba")
    per_trace_neutral = _normalize_color_spec(neutral_rgba, "neutral_rgba")

    # ----------------------------
    # Preprocess per-trace arrays (sorted, filtered to movie window)
    # ----------------------------
    streams = []  # list of dicts, in z-order
    for tid in trace_ids:
        ev = [e for e in events[tid] if 0 <= e.t < T_ms]
        if not ev:
            # still create an empty stream so z-ordering remains consistent
            streams.append(dict(
                trace_id=tid,
                kinds=np.array([], dtype=object),
                xs=np.array([], dtype=float),
                ys=np.array([], dtype=float),
                ts=np.array([], dtype=int),
                is_down=np.array([], dtype=bool),
                is_up=np.array([], dtype=bool),
                accent=per_trace_accent[tid],
                neutral=per_trace_neutral[tid],
            ))
            continue

        ev.sort(key=lambda e: e.t)

        kinds = np.array([e.kind for e in ev], dtype=object)
        xs    = np.array([e.x    for e in ev], dtype=float)
        ys    = np.array([e.y    for e in ev], dtype=float)
        ts    = np.array([e.t    for e in ev], dtype=int)

        is_down = (kinds == "down")
        is_up   = (kinds == "up")

        streams.append(dict(
            trace_id=tid,
            kinds=kinds, xs=xs, ys=ys, ts=ts,
            is_down=is_down, is_up=is_up,
            accent=per_trace_accent[tid],
            neutral=per_trace_neutral[tid],
        ))

    # ----------------------------
    # Figure/axes
    # ----------------------------
    dpi = 100
    fig_inch = movie_size_px / dpi
    fig = plt.figure(figsize=(fig_inch, fig_inch), dpi=dpi)
    ax = plt.axes([0, 0, 1, 1])
    ax.set_xlim(-0.5, 0.5)
    ax.set_ylim(-0.5, 0.5)
    ax.set_aspect("equal", adjustable="box")

    fig.patch.set_alpha(0.0)
    ax.set_facecolor((0, 0, 0, 0))
    for spine in ax.spines.values():
        spine.set_visible(False)
    ax.set_xticks([]); ax.set_yticks([])

    # ----------------------------
    # Artists per trace in insertion order (controls z-index)
    # ----------------------------
    # Within each trace: persistent (lowest), following, points (highest)
    trace_artists = []
    for z, S in enumerate(streams):
        base_z = z * 3  # reserve 3 zorders per trace
        # persistent neutral path
        persist_line, = ax.plot([], [],
                                linewidth=linewidth_persist,
                                solid_capstyle="round", solid_joinstyle="round",
                                zorder=base_z + 0)
        persist_line.set_color(S["neutral"])

        # following neutral segment (fading)
        follow_line, = ax.plot([], [],
                               linewidth=linewidth_follow,
                               solid_capstyle="round", solid_joinstyle="round",
                               zorder=base_z + 1)
        follow_line.set_color((S["neutral"][0], S["neutral"][1], S["neutral"][2], 0.0))

        # DOWN/UP scatter only
        scatter = ax.scatter([], [], s=[], facecolors=[], edgecolors='none', zorder=base_z + 2)

        trace_artists.append(dict(scatter=scatter, persist=persist_line, follow=follow_line, stream=S))

    # ----------------------------
    # Frames
    # ----------------------------
    num_frames = fps * movie_time_sec
    frame_times = np.arange(num_frames, dtype=int) * int(1000 / fps)

    def init():
        for A in trace_artists:
            A["scatter"].set_offsets(np.empty((0, 2)))
            A["scatter"].set_sizes(np.empty((0,)))
            A["scatter"].set_facecolors(np.empty((0, 4)))

            A["persist"].set_data([], [])
            # persist color already set per trace

            A["follow"].set_data([], [])
            n = A["stream"]["neutral"]
            A["follow"].set_color((n[0], n[1], n[2], 0.0))

        # return a flat tuple of all artists for blitting
        out = []
        for A in trace_artists:
            out.extend([A["scatter"], A["persist"], A["follow"]])
        return tuple(out)

    def update(frame_idx: int):
        t_now = int(frame_times[frame_idx])

        drawn = []
        for A in trace_artists:
            S = A["stream"]
            kinds, xs, ys, ts = S["kinds"], S["xs"], S["ys"], S["ts"]
            is_down, is_up = S["is_down"], S["is_up"]
            accent, neutral = S["accent"], S["neutral"]

            # --- DOWN/UP points within tail window ---
            if ts.size == 0:
                A["scatter"].set_offsets(np.empty((0, 2)))
                A["scatter"].set_sizes(np.empty((0,)))
                A["scatter"].set_facecolors(np.empty((0, 4)))
            else:
                t_min = max(0, t_now - tail_window_ms)
                m = (ts >= t_min) & (ts <= t_now)
                if not np.any(m):
                    A["scatter"].set_offsets(np.empty((0, 2)))
                    A["scatter"].set_sizes(np.empty((0,)))
                    A["scatter"].set_facecolors(np.empty((0, 4)))
                else:
                    dt = (t_now - ts[m]).astype(float)
                    k  = kinds[m]
                    xm = xs[m]
                    ym = ys[m]

                    down_mask = (k == "down")
                    up_mask   = (k == "up")

                    alpha = np.zeros_like(dt, dtype=float)
                    alpha[down_mask] = np.exp(-dt[down_mask] / tau_alpha_ms_down)
                    alpha[up_mask]   = np.exp(-dt[up_mask]   / tau_alpha_ms_up)

                    size = np.zeros_like(dt, dtype=float)
                    size[down_mask] = down_size0
                    size[up_mask]   = up_size0 * np.exp(-dt[up_mask] / tau_size_ms_up)
                    size = np.clip(size, 0.1, None)

                    keep = down_mask | up_mask
                    xm, ym, size, alpha_keep = xm[keep], ym[keep], size[keep], alpha[keep]

                    colors = np.tile(accent, (len(alpha_keep), 1)).astype(float)
                    colors[:, 3] = np.clip(colors[:, 3] * alpha_keep, 0.0, 1.0)

                    if xm.size == 0:
                        A["scatter"].set_offsets(np.empty((0, 2)))
                        A["scatter"].set_sizes(np.empty((0,)))
                        A["scatter"].set_facecolors(np.empty((0, 4)))
                    else:
                        A["scatter"].set_offsets(np.column_stack([xm, ym]))
                        A["scatter"].set_sizes(size)
                        A["scatter"].set_facecolors(colors)

            # --- Persistent trail: single path up to now (neutral, no fade) ---
            if ts.size >= 1:
                vx, vy = [], []
                for i in range(ts.size):
                    if ts[i] > t_now:
                        break
                    if i == ts.size - 1:
                        vx.append(xs[i]); vy.append(ys[i])
                    else:
                        t0, t1 = ts[i], ts[i+1]
                        x0, y0 = xs[i], ys[i]
                        x1, y1 = xs[i+1], ys[i+1]
                        vx.append(x0); vy.append(y0)
                        if t0 <= t_now < t1:
                            frac = (t_now - t0) / (t1 - t0)
                            vx.append(x0 + frac*(x1 - x0))
                            vy.append(y0 + frac*(y1 - y0))
                            break
                        else:
                            vx.append(x1); vy.append(y1)

                if len(vx) >= 2:
                    A["persist"].set_data(vx, vy)
                    A["persist"].set_color(neutral)
                else:
                    A["persist"].set_data([], [])
            else:
                A["persist"].set_data([], [])

            # --- Following trail: single segment prev -> interpolated now (neutral, fades) ---
            A["follow"].set_data([], [])
            A["follow"].set_color((neutral[0], neutral[1], neutral[2], 0.0))
            if ts.size >= 2:
                idx_prev = np.searchsorted(ts, t_now, side="right") - 1
                if 0 <= idx_prev < ts.size - 1 and ts[idx_prev] <= t_now < ts[idx_prev + 1]:
                    t0, t1 = ts[idx_prev], ts[idx_prev + 1]
                    x0, y0 = xs[idx_prev], ys[idx_prev]
                    x1, y1 = xs[idx_prev + 1], ys[idx_prev + 1]
                    frac = (t_now - t0) / (t1 - t0)
                    x_star = x0 + frac * (x1 - x0)
                    y_star = y0 + frac * (y1 - y0)

                    alpha_line = float(np.exp(-(t_now - t0) / float(tau_alpha_ms_move)))
                    rgba = (neutral[0], neutral[1], neutral[2], np.clip(neutral[3] * alpha_line, 0.0, 1.0))

                    A["follow"].set_data([x0, x_star], [y0, y_star])
                    A["follow"].set_color(rgba)

            drawn.extend([A["scatter"], A["persist"], A["follow"]])

        return tuple(drawn)

    anim = animation.FuncAnimation(
        fig,
        update,
        init_func=init,
        frames=fps * movie_time_sec,
        interval=1000 / fps,
        blit=True,
    )

    # ----------------------------
    # Save with transparent background
    # ----------------------------
    savepath = Path(savepath)
    savepath.parent.mkdir(parents=True, exist_ok=True)
    if savepath.suffix.lower() != ".mov":
        savepath = savepath.with_suffix(".mov")

    try:
        writer = animation.FFMpegWriter(
            fps=fps,
            codec="prores_ks",
            extra_args=[
                "-pix_fmt", "yuva444p10le",
                "-profile:v", "4444",
                "-vendor", "ap10",
                "-bits_per_mb", "8000",
            ],
            bitrate=-1,
        )
        anim.save(
            str(savepath),
            writer=writer,
            dpi=dpi,
            savefig_kwargs={"transparent": True, "facecolor": (0, 0, 0, 0)},
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
            savefig_kwargs={"transparent": True, "facecolor": (0, 0, 0, 0)},
        )

    plt.close(fig)

# %%
if __name__ == '__main__':
    import json
    payload = json.loads(Path('example_pointer_events.json').read_text()) # hit_id: List[PointerSampledEvent]

    pointer_events = {
        hit_id: [PointerSampledEvent.model_validate(ev) for ev in payload[hit_id]] for hit_id in sorted(payload.keys())
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

    movie_time_sec = min(10, max_t_grand/1000)
    make_animation(
        events=pointer_events,
        accent_rgba=(49/255, 124/255, 245/255, 0.9),
        neutral_rgba=(0.1, 0.1, 0.1, 0.3),
        savepath='movie.mov',
        movie_size_px=500,
        movie_time_sec=movie_time_sec,
    )