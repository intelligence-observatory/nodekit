import networkx
from nodekit import Node
from nodek

NodeId = str

class MyGraph:

    def add_node(
            self,
            node_id: NodeId, # User-supplied handle
            node: Node,
    ):
        ...

    def add_transition(
            self,
            node_id: NodeId,
            sensor_index: SensorIndex,
            next_node_id: NodeId,
    ):
        ...


    def set_start(self, node_id: NodeId):
        ...