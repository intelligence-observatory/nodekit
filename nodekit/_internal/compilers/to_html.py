from pathlib import Path

import jinja2

from nodekit._internal.models.node_engine.node_graph import NodeGraph


def html(
        node_graph: NodeGraph,
) -> str:

    # Render the node sequence using a Jinja2 template
    template_location = Path(__file__).parent / 'node_engine_template.j2'
    template = jinja2.Environment(loader=jinja2.FileSystemLoader(template_location.parent)).get_template(template_location.name)

    html_string = template.render(
        dict(
            node_graph=node_graph.model_dump(mode='json'),
        )
    )

    return html_string