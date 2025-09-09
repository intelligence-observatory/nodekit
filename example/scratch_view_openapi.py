import fastapi
from nodekit import NodeGraph
from nodekit import Node
app = fastapi.FastAPI()


@app.get("/node_graph")
def site(
        request: Node,
) -> fastapi.Response:
    return fastapi.responses.Response(status_code=200)