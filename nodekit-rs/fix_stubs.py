from pathlib import Path
import re

"""
Rust/pyo3 isn't smart enough to understand that the code stub for `Vec<u8>` should be `bytes`.
We'll fix that, with the power of string replacement.
"""

path = Path('nodekit_rs_client.pyi')
text = path.read_text()
text = text.replace('def buffer(self) -> builtins.list[builtins.int]:',
                    'def buffer(self) -> builtins.bytes:')
path.write_text(text)