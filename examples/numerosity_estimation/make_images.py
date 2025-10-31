from typing import Tuple
import random
from pathlib import Path
import html
import math


def circles_svg(
    count: int, rng: random.Random, color: Tuple[int, int, int] = (0, 0, 0)
) -> str:
    """
    Return a square SVG (100x100) with `count` circles placed uniformly at random (seeded).
    - Circle radius is 5% of image height (r = 5).
    - Circles are fully inside the image bounds.
    - Filled with the given (R,G,B) color; no border.
    """
    size = 100
    r = int(size * 0.025)  # 5% of height
    # Clamp & sanitize inputs
    count = max(0, int(count))
    R, G, B = (max(0, min(255, int(c))) for c in color)

    # Choose centers in [r, size - r] so circles stay fully inside
    coords = [
        (rng.uniform(r, size - r), rng.uniform(r, size - r)) for _ in range(count)
    ]

    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 {size} {size}">',
    ]
    fill = f"rgb({R},{G},{B})"
    for cx, cy in coords:
        parts.append(
            f'<circle cx="{cx:.3f}" cy="{cy:.3f}" r="{r}" fill="{html.escape(fill)}" stroke="none" />'
        )
    parts.append("</svg>")
    return "\n".join(parts)


def sample_log_uniform(rng: random.Random, low: float = 1, high: float = 300) -> int:
    """
    Sample an integer between `low` and `high` (inclusive) on a log-uniform scale.
    """
    log_low = math.log(low)
    log_high = math.log(high)
    value = math.exp(rng.uniform(log_low, log_high))
    return int(round(value))


# %%
if __name__ == "__main__":
    num_images = 20
    rng = random.Random(42)

    for i_image in range(num_images):
        num = sample_log_uniform(rng)
        svg = circles_svg(num, rng)
        savepath = Path(f"./images/image{i_image:03d}_count{num:03d}.svg")
        if not savepath.parent.exists():
            savepath.parent.mkdir(parents=True)

        savepath.write_text(svg, encoding="utf-8")
