import zmq
from nodekit_rs_client import graph, key_press, mouse, noop, Response


class Client:
    def __init__(self, endpoint: str):
        context = zmq.Context()
        self.socket = context.socket(zmq.REQ)
        self.socket.connect(endpoint)

    def tick(self, request: bytes) -> Response:
        """
        Send `request` to the simulator.
        This assumes that `request` is a valid message.
        For valid messages, see the other functions in this import path, e.g. `mouse` and `noop`.

        Returns a `Response` received from the simulator.
        """

        self.socket.send(request)
        response = self.socket.recv_multipart()[0]
        return Response(response)


__all__ = [Client, graph, key_press, mouse, noop, Response]
