import importlib.resources
from functools import lru_cache

import pydantic
from nodekit._internal.utils.hashing import hash_string
from nodekit._internal.types.common import SHA256

# %%
class NodeKitBrowserBundle(pydantic.BaseModel):
    css: str
    css_sha256: SHA256

    js: str
    js_sha256: SHA256


@lru_cache(maxsize=1)
def get_browser_bundle() -> NodeKitBrowserBundle:
    css_file = importlib.resources.files("nodekit") / "_static" / "nodekit.css"
    js_file = importlib.resources.files("nodekit") / "_static" / "nodekit.js"

    css_string = css_file.read_text()
    js_string = js_file.read_text()

    # Compute hashes:
    css_sha256 = hash_string(css_string)
    js_sha256 = hash_string(js_string)

    return NodeKitBrowserBundle(
        css=css_string,
        css_sha256=css_sha256,
        js=js_string,
        js_sha256=js_sha256,
    )
