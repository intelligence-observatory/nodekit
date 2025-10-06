import hashlib
from pydantic import BaseModel, Field
from collections import defaultdict, deque
from typing import List, Tuple, Self, Literal

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
    """
    Generate a deterministic tie-break key for a node using its JSON
    representation and SHA256 hashing.

    Args:
        node (Node): The Node object to be hashed.
        idx (int): The index of the node in the original node list,
                   used as a secondary key (in case the object has the 
                   same JSON representation).

    Returns:
        Tuple[str, int]: A tuple containing the SHA256 hash of the node's 
        JSON representation as a hex string and the node's index, to break
        ties if two nodes produce the same hash.
    """
    json_str = node.model_dump_json()
    digest = hashlib.sha256(json_str.encode("utf-8")).hexdigest()
    return digest, idx

# %% Kahn's Algorithm implementation for topographical sorting:
def topological_sort(nodes: List[Node], transitions: List[Transition]) -> List[int]:
    """
    Return a list of node indices arranged in a topologically sorted order.
    Tie-breaking used here (currently uses SHA256).
    
    Args:
        nodes (List[Node]): List of Node objects
        transitions (List[Transition]): List of Transition objects

    Returns:
        List[int]: List of node indicies in topological order, with tie-break 
        applied to nodes on the same rank
    """

    node_indices = list(range(len(nodes)))
    edges = [(t.node_index, t.next_node_index) for t in transitions]

    # Get ranks from topo sort core:
    ranks = topo_sort_core_kahn(node_indices, edges)
    print(f"Ranks list for the node objects: {ranks}")
    print(f"Sensor checks: {check_node_sensors(nodes, transitions)}")

    # Define tie-breaker function:
    def tie_break(idx: int) -> Tuple[str, int]:
        return node_hash(nodes[idx], idx)

    # Group by rank and apply tie-breaker:
    rank_groups = defaultdict(list)
    for idx, rank in enumerate(ranks):
        rank_groups[rank].append(idx)

    ordered = []
    for rank in sorted(rank_groups.keys()):
        group = rank_groups[rank]
        group.sort(key=tie_break)
        ordered.extend(group)

    return ordered


def topo_sort_core_kahn(
    node_indices: List[int],
    edges: List[Tuple[int | str, int | str]],
) -> List[int]:
    """
    Return the topological rank for each node in the graph.

    Args:
        node_indices: List of node indices.
        edges: List of (node_index, next_node_index).

    Returns:
        ranks: List[int] specifying the rank for each Node in the Graph.
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

        sort_queue = deque(sort_queue)
        current_rank += 1

    if any(rank == -1 for rank in ranks):
        raise ValueError("Loop present in Graph, please reconfigure the structure")

    return ranks


def check_node_sensors(nodes: List[Node], transitions: List[Transition]) -> dict[str, list]:
    """ 
    Check node sensors and return unwired sensors, non-terminating
    nodes and sensorless nodes.

    Args:
        nodes (List[Node]): List of Node objects
        transitions (List[Transition]): List of Transition objects

    Returns:
        dict[str, list]: Lists of unwired sensors and sensorless nodes
    """

    wired = set()
    for t in transitions:
        if isinstance(t.node_index, int) and t.sensor_index is not None:
            wired.add((t.node_index, t.sensor_index))

    unwired_sensors = []
    sensorless_nodes = []

    for node_idx, node in enumerate(nodes):
        if not node.sensors:
            sensorless_nodes.append(node_idx)
            continue  # skip other checks

        for sensor_idx in node.sensors:
            if (node_idx, sensor_idx) not in wired:
                unwired_sensors.append((node_idx, sensor_idx))

    return {
        "unwired_sensors": unwired_sensors,
        "sensorless_nodes": sensorless_nodes,
    }
