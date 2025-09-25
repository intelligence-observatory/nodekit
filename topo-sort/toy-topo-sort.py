from collections import defaultdict, deque
from typing import List, Tuple

# %% Toy Node class that holds sensor information:
class Node:
    def __init__(self, num_sensors: int = None):
        if num_sensors:
            self.sensors = [i for i in range(num_sensors)]
        else:
            self.sensors = []
    
    def __repr__(self):
        return f"{self.sensors}"

# %% Toy Transition class that holds incoming Node, Sensor, and next Node information:
class Transition:
    def __init__(self, node_index: int, sensor_index: int, next_node_index: int):
        self.node_index = node_index
        self.sensor_index = sensor_index
        self.next_node_index = next_node_index

    def __repr__(self):
        return f"({self.node_index}, {self.sensor_index}, {self.next_node_index})"

# %% Toy Graph class which takes lists of Node and Transition instances:
class Graph:
    def __init__(self, nodes: List[Node] = None, transitions: List[Transition] = None):
        self.nodes = nodes if nodes else []
        self.transitions = transitions if transitions else []        

    def get_items(self):
        return [self.nodes, self.transitions]


# %% Kahn's Algorithm implimentation for topographical sorting:
def topological_sort_kahn(nodes: List[Node], transitions: List[Transition], reindex: bool = False):

    node_indices = [i for i, _ in enumerate(nodes)]
    edges = [t for t in sorted(transitions, key = lambda t: t.sensor_index)]

    new_node_indices, sorted_transitions = topo_sort_core(node_indices, edges)
    mapping = {n: i for i, n in enumerate(new_node_indices)}
    reindexed_nodes = [nodes[n] for n in new_node_indices]
    
    for t in sorted_transitions:
        t.node_index = mapping[t.node_index]
        t.next_node_index = mapping[t.next_node_index]
    
    return reindexed_nodes, sorted_transitions

def topo_sort_core(node_indices: List[int], edges: List[Tuple[int, int]]) -> Tuple[List[int], List[Tuple[int, int, int]]]:

    # Get adjacencies and in-degree:
    adjacency = defaultdict(list)
    indegree = {idx: 0 for idx in node_indices}
    for edge in edges:
        adjacency[edge.node_index].append(edge)
        indegree[edge.next_node_index] += 1

    # Functionality to check if all sensors from a Node are used:
    for idx in node_indices:
        all_sensors = set(nodes[idx].sensors)
        used_sensors = {t.sensor_index for t in adjacency[idx]}
        unused = all_sensors - used_sensors
        if unused:
            raise SyntaxError(f"Node {idx} has unused sensors")
    
    # Get the nodes with no incoming connections and place them in a queue:
    sort_queue = deque([node for node, degree_value in indegree.items() if degree_value == 0])

    sorted_nodes = []
    sorted_edges = []
    while sort_queue:

        # Add the nodes with no incoming connections to the sorted nodes list:
        current = sort_queue.popleft()
        sorted_nodes.append(current)

        # Add the transitions of the current node to the sorted transitions list:
        for edge in adjacency[current]:
            sorted_edges.append(edge)
            indegree[edge.next_node_index] -= 1
            
            if indegree[edge.next_node_index] == 0:
                sort_queue.append(edge.next_node_index)

    if len(sorted_nodes) != len(nodes):
        raise IndexError("Loop present in Graph, please reconfigure the structure")
    
    return sorted_nodes, sorted_edges

# %% Example 1:
# Visual structure:
#        2
#      / | \
#     1  4  3
#    / \  \
#   5   0  6
# Sensors indexed at 0 from left to right on all nodes


# Create Graph object:
exp = Graph()

# Create Nodes:
nodes = [          # Node from Visualization:
    Node(1),       # 4
    Node(),        # 6
    Node(2),       # 1
    Node(),        # 3
    Node(),        # 5
    Node(3),       # 2
    Node()         # 0
]

# Define Transitions:
transitions = [
    Transition(5, 1, 0),
    Transition(5, 0, 2),
    Transition(2, 0, 4),
    Transition(5, 2, 3),
    Transition(0, 0, 1),
    Transition(2, 1, 6)
]

print("pre-sorting")
print(nodes, transitions)

sorted_nodes, sorted_transitions = topological_sort_kahn(nodes, transitions)

print("post-sorting")
print(sorted_nodes, sorted_transitions)

# %% Example 2:
# Visual structure:
#         5
#      /  |  \
#     2   0 - 4
#         |    \
#         1     3
# Sensors indexed at 0 from left to right on all nodes

# Create Graph object:
exp = Graph()

# Create Nodes:
nodes = [          # Node from Visualization:
    Node(2),       # 0
    Node(1),       # 4
    Node(),        # 3
    Node(),        # 2
    Node(3),       # 5
    Node()         # 1
]

# Define Transitions:
transitions = [
    Transition(4, 2, 1),
    Transition(4, 1, 0),
    Transition(1, 0, 2),
    Transition(0, 1, 1),
    Transition(0, 0, 5),
    Transition(4, 0, 3),
]

print("pre-sorting")
print(nodes, transitions)

sorted_nodes, sorted_transitions = topological_sort_kahn(nodes, transitions)

print("post-sorting")
print(sorted_nodes, sorted_transitions)