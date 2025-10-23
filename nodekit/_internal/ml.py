import zmq
from nodekit_rs_client import (graph as graph_rs,
                               click, key_press,
                               noop,
                               serialize_payload,
                               deserialize_response,
                               Payload, Response)
from nodekit._internal.types.graph import Graph


def graph(g: Graph) -> Payload:
    return graph_rs(g.model_dump_json())

class Client:
    def __init__(self, endpoint: str):
        context = zmq.Context()
        self.socket = context.socket(zmq.REQ)
        self.socket.connect(endpoint)

    def tick(self, payload: Payload) -> Response:
        self.socket.send(serialize_payload(payload))
        serialized = self.socket.recv_multipart()[0]
        return deserialize_response(serialized)


__all__ = [graph, click, key_press, noop, Payload, Client]