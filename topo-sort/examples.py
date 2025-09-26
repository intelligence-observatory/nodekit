from topo_sort import Node, Transition, Graph, topological_sort_kahn

# %% Example 1:
# Visual structure:
#        2
#      / | \
#     1  4  3
#    / \  \
#   5   0  6
# Sensors indexed at 0 from left to right on all nodes

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

print("Example 1:")
print(topological_sort_kahn(nodes, transitions))

# %% Example 2 Failiure case:
# Visual structure:
#         5 ---
#      /  |  \|
#     2   0   4
#         |    \
#         1     3
# Sensors indexed at 0 from left to right on all nodes

# Create Nodes:
nodes = [          # Node from Visualization:
    Node(2),       # 0
    Node(2),       # 4
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
    Transition(1, 1, 4),
    Transition(0, 1, 1),
    Transition(0, 0, 5),
    Transition(4, 0, 3)
]

print("Example 2 (should fail):")
print(topological_sort_kahn(nodes, transitions))
