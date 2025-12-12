from pathlib import Path
import re

"""
Mark `Renderer.empty_board()` as a static function.
"""

path = Path(__file__).parent.joinpath("nodekit_rs.pyi")
text = path.read_text(encoding="utf-8")
text = re.sub(
    r"(def empty_board\()self(\) -> numpy\.typing\.NDArray\[numpy\.uint8]:)",
    r"@staticmethod\n    \1\2",
    text,
)
path.write_text(text)
