from functools import lru_cache
from pathlib import Path

import jinja2

from nodekit._internal.types.node_graph import NodeGraph
import pydantic
import importlib.resources


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



# %%
def to_html(
        node_graph: NodeGraph,
) -> str:
    # Load the JS and CSS resources
    assets = get_browser_bundle()

    # Render the node sequence using a Jinja2 template
    template_location = Path(__file__).parent / 'node_graph_site_template.j2'
    template = jinja2.Environment(loader=jinja2.FileSystemLoader(template_location.parent)).get_template(template_location.name)

    html_string = template.render(
        dict(
            node_graph=node_graph.model_dump(mode='json'),
            javascript_source=assets.js,
            css_source=assets.css,
        )
    )

    return html_string


if __name__ == '__main__':
    assets = get_browser_bundle()
    print(assets.js)
