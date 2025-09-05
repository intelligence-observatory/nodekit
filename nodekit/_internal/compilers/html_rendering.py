from pathlib import Path

import jinja2

from nodekit._internal.models.node_engine.node_graph import NodeGraph
import pydantic


# %%
class NodeKitBrowserManifest(pydantic.BaseModel):
    name: str = pydantic.Field(
        description='The name of the `npm` package.'
    )
    version: str = pydantic.Field(
        description='The semantic version of the `npm` package.'
    )
    iife: str = pydantic.Field(
        description='The location of the IIFE entrypoint for nodekit-browser.'
    )
    css: str = pydantic.Field(
        description='The location of the CSS file for nodekit-browser.'
    )


NODEKIT_BROWSER_MANIFEST = NodeKitBrowserManifest(
    name='nodekit-browser',
    version='0.0.1-alpha.2',
    iife='dist/nodekit.js',
    css='dist/nodekit.css',
)

# %%
def html(
        node_graph: NodeGraph,
) -> str:
    # Render the node sequence using a Jinja2 template
    template_location = Path(__file__).parent / 'node_graph_site_template.j2'
    template = jinja2.Environment(loader=jinja2.FileSystemLoader(template_location.parent)).get_template(template_location.name)

    html_string = template.render(
        dict(
            node_graph=node_graph.model_dump(mode='json'),
        )
    )

    return html_string