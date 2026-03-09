import json
import re
import sys
from pathlib import Path


# %%
ROOT = Path(__file__).resolve().parent.parent


# %%
def _replace_once(path: Path, pattern: str, replacement: str) -> None:
    text = path.read_text()
    updated_text, count = re.subn(pattern, replacement, text, count=1, flags=re.MULTILINE)
    if count != 1:
        raise RuntimeError(f"Expected exactly one replacement in {path}")
    path.write_text(updated_text)


# %%
def _validate_version(version: str) -> None:
    if not re.fullmatch(r"\d+\.\d+\.\d+(?:[a-zA-Z0-9.-]*)?", version):
        raise ValueError(
            "Version must look like x.y.z or x.y.z<suffix>, "
            f"for example 0.2.5 or 0.2.5.dev1. Got: {version}"
        )


# %%
def _update_package_lock(path: Path, version: str) -> None:
    package_lock = json.loads(path.read_text())
    package_lock["version"] = version
    package_lock["packages"][""]["version"] = version
    path.write_text(json.dumps(package_lock, indent=2) + "\n")


# %%
def main(version: str) -> None:
    _validate_version(version)

    _replace_once(
        ROOT / "pyproject.toml",
        r'^version = "[^"]+"$',
        f'version = "{version}"',
    )
    _replace_once(
        ROOT / "nodekit/_internal/version.py",
        r'^VERSION = "[^"]+"$',
        f'VERSION = "{version}"',
    )

    package_json_path = ROOT / "nodekit-browser/package.json"
    package_json = json.loads(package_json_path.read_text())
    package_json["version"] = version
    package_json_path.write_text(json.dumps(package_json, indent=2) + "\n")

    _update_package_lock(ROOT / "nodekit-browser/package-lock.json", version)


# %%
if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("Usage: uv run python scripts/set_version.py x.y.z")
    main(sys.argv[1])
