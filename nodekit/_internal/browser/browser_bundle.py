import importlib.resources
from functools import lru_cache

import pydantic


# %%

class NodeKitBrowserBundle(pydantic.BaseModel):
    css: str
    js: str


@lru_cache(maxsize=1)
def get_browser_bundle() -> NodeKitBrowserBundle:
    css_file = importlib.resources.files("nodekit") / "_static" / "nodekit.css"
    js_file = importlib.resources.files("nodekit") / "_static" / "nodekit.js"

    return NodeKitBrowserBundle(
        css=css_file.read_text(),
        js=js_file.read_text()
    )

