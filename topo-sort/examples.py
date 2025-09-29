from topo_sort import Node, Transition, topological_sort, find_unwired_sensors

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
    Node.sensors_from_num(1),       # 4
    Node.sensors_from_num(),        # 6
    Node.sensors_from_num(2),       # 1
    Node.sensors_from_num(),        # 3
    Node.sensors_from_num(),        # 5
    Node.sensors_from_num(3),       # 2
    Node.sensors_from_num()         # 0
]

# Define Transitions:
transitions = [
    Transition.make_transition(5, 1, 0),
    Transition.make_transition(5, 0, 2),
    Transition.make_transition(2, 0, 4),
    Transition.make_transition(5, 2, 3),
    Transition.make_transition(0, 0, 1),
    Transition.make_transition(2, 1, 6)
]

print("Example 1:")
print(topological_sort(nodes, transitions))
print(find_unwired_sensors(nodes, transitions))

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
    Node.sensors_from_num(2),       # 0
    Node.sensors_from_num(2),       # 4
    Node.sensors_from_num(),        # 3
    Node.sensors_from_num(),        # 2
    Node.sensors_from_num(3),       # 5
    Node.sensors_from_num()         # 1
]

# Define Transitions:
transitions = [
    Transition.make_transition(4, 2, 1),
    Transition.make_transition(4, 1, 0),
    Transition.make_transition(1, 0, 2),
    Transition.make_transition(1, 1, 4),
    Transition.make_transition(0, 1, 1),
    Transition.make_transition(0, 0, 5),
    Transition.make_transition(4, 0, 3)
]

print("Example 2 (should fail):")
print(topological_sort(nodes, transitions))
