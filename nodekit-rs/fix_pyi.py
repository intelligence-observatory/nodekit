from pathlib import Path
import re

"""
Fix the .pyi in ways that are difficult/impossible to do with pyo3-stub-gen.
"""

path = Path(__file__).parent.joinpath("nodekit_rs.pyi")
text = path.read_text(encoding="utf-8")
# Mark `Renderer.empty_board()` as a static function.
text = re.sub(
    r"(def empty_board\()self(\) -> numpy\.typing\.NDArray\[numpy\.uint8]:)",
    r"@staticmethod\n    \1\2",
    text,
)
# Fix hide_pointer.
hide_pointer = 'hide_pointer: builtins.bool'
text = text.replace(hide_pointer, f'{hide_pointer} = False')

path.write_text(text)
