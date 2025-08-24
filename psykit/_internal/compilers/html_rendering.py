from pathlib import Path

import jinja2

from psykit._internal.models.node_engine.node_graph import NodeGraph
import pydantic


# %%
class CompileHtmlOptions(pydantic.BaseModel):
    event_submission_url: str | None = pydantic.Field(
        description='An endpoint to which Events will be sent. If None, the Events will simply be shown at the end of the Run.',
        default = None,
    )
    start_node_execution_index: int

    run_id: str


def html(
        node_graph: NodeGraph,
        options: CompileHtmlOptions | None = None,
) -> str:
    if options is None:
        options = CompileHtmlOptions(
            event_submission_url=None,
            start_node_execution_index=0,
            run_id='',
        )

    # Render the node sequence using a Jinja2 template
    template_location = Path(__file__).parent / 'node_graph_site_template.j2'
    template = jinja2.Environment(loader=jinja2.FileSystemLoader(template_location.parent)).get_template(template_location.name)

    html_string = template.render(
        dict(
            node_graph=node_graph.model_dump(mode='json'),
            options=options.model_dump(mode='json'),
        )
    )

    return html_string