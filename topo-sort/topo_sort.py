import hashlib
from pydantic import BaseModel, Field
from collections import defaultdict, deque
from typing import List, Tuple, Callable, Optional, Self, Literal

# %% Toy Node class that holds sensor information:
class Node(BaseModel):

    sensors: List[int] = Field(default_factory=list)
    
    @classmethod
    def sensors_from_num(cls, num_sensors: int = 0) -> Self:
        return cls(sensors=list(range(num_sensors)))

    def __repr__(self):
        return f"{self.sensors}"

# %% Toy Transition class that holds incoming Node, Sensor, and next Node information:
class Transition(BaseModel):
    
    node_index: int | Literal['START']
    sensor_index: int | None
    next_node_index: int | Literal['END']

    @classmethod
    def make_transition(cls, node_index, sensor_index, next_node_index) -> Self:
        return cls(
            node_index = node_index,
            sensor_index = sensor_index,
            next_node_index = next_node_index
        )
    
    def __repr__(self):
        return f"({self.node_index}, {self.sensor_index}, {self.next_node_index})"

# %% Toy Graph class which takes lists of Node and Transition instances:
class Graph(BaseModel):
    nodes: List[Node] = Field(default_factory=list)
    transitions: List[Transition] = Field(default_factory=list)

    def get_items(self):
        return [self.nodes, self.transitions]


# %% Tie-break function using SHA256 has as the key
def node_hash(node: Node, idx: int) -> Tuple[str, int]:
    json_str = node.model_dump_json()
    digest = hashlib.sha256(json_str.encode("utf-8")).hexdigest()
    return digest, idx

# %% Kahn's Algorithm implimentation for topographical sorting:
def topological_sort(nodes: List[Node], transitions: List[Transition]) -> List[int]:

    node_indices = [i for i, _ in enumerate(nodes)]
    edges = [(t.node_index, t.next_node_index) for t in transitions]
    print(edges)

    def tie_break(idx: int) -> Tuple[str, int]:
        return node_hash(nodes[idx], idx)

    ranks = topo_sort_core_kahn(node_indices, edges, tie_break=tie_break)
    return ranks


def topo_sort_core_kahn(
    node_indices: List[int],
    edges: List[Tuple[int | str, int | str]],
    tie_break: Optional[Callable[[int], Tuple[str, int]]] = None
) -> List[int]:
    """
    Return the topological rank for each node in the graph.

    Args:
        node_indices: List of node indices.
        edges: List of (node_index, next_node_index).
        tie_break: Optional sorting function for breaking ties.

    Returns:
        ranks: List where ranks[i] is the topological depth of node i.
    """

    # Create the adjacency and indegree dictionaries
    adjacency = defaultdict(list)
    indegree = {idx: 0 for idx in node_indices}
    # Build adjacency and indegree, ignoring START/END
    for src, dst in edges:
        if isinstance(src, int) and isinstance(dst, int):
            adjacency[src].append(dst)
            indegree[dst] += 1
        elif src == "START" and isinstance(dst, int):
            # START → dst means dst is a root candidate
            indegree[dst] += 0
        elif isinstance(src, int) and dst == "END":
            # src → END
            adjacency[src].append("END")

    # Initialize a list of ranks
    ranks = [-1] * len(node_indices)

    # Apply the tie-break and get the nodes with zero in-degree
    zero_indegree = [n for n, deg in indegree.items() if deg == 0]
    zero_indegree.sort(key=tie_break or (lambda x: x))
    sort_queue = deque(zero_indegree)

    current_rank = 0
    while sort_queue:
        level_size = len(sort_queue)
        for _ in range(level_size):
            current = sort_queue.popleft()
            ranks[current] = current_rank

            for neighbor in adjacency[current]:
                if isinstance(neighbor, int):  # only update real nodes
                    indegree[neighbor] -= 1
                    if indegree[neighbor] == 0:
                        sort_queue.append(neighbor)

        sort_queue = deque(sorted(sort_queue, key=tie_break or (lambda x: x)))
        current_rank += 1

    if any(rank == -1 for rank in ranks):
        raise ValueError("Loop present in Graph, please reconfigure the structure")

    return ranks


def find_unwired_sensors(nodes: List[Node], transitions: List[Transition]) -> List[Tuple[int, int]]:
    """
    Return a list of (node_index, sensor_index) pairs for sensors that do not appear in any transition.
    """
    # Collect all (node_index, sensor_index) used in transitions
    wired = set()
    for t in transitions:
        if isinstance(t.node_index, int) and t.sensor_index is not None:
            wired.add((t.node_index, t.sensor_index))

    unwired = []
    for node_idx, node in enumerate(nodes):
        for sensor_idx in node.sensors:
            if (node_idx, sensor_idx) not in wired:
                unwired.append((node_idx, sensor_idx))

    return unwired