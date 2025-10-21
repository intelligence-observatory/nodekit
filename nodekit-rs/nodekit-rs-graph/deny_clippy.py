from pathlib import Path
import re

"""
Lightly edit the Rust code so that clippy ignores it.
"""

path = Path("src/lib.rs")
lib = path.read_text(encoding='utf-8')
lib = re.sub(r'(#!\[allow\(.*?\)])', '', lib).strip()
lib = '#![deny(clippy::all)]\n\n' + lib
path.write_text(lib)
