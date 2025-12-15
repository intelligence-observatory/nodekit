
## A brief primer on NodeKit

NodeKit describes tasks as a **Graph** consisting of **Nodes** and arrows which connect them. For example, here's a task consisting of a few AFC ("alternative forced choice") trials, expressed as a Graph:

![An example NodeKit Graph](example-graph.png)
 
 

### What is a **Node**?
 
Nodes are the central object in NodeKit, and can be understood as a sort of minimal "task atom". A Node has two parts:

1. A __Stimulus__ that the agent views, such as an image, a video, text, or a combination of such things. 
2. An __ActionSet__, such as a set of legal keypresses, a set of slider values, or even the set of all text strings under length `n`. 

A Node is completed when the agent makes a selection from the ActionSet – that is, a _Node ends when the Agent performs an Action_ from the Node's Action Set.

### What is a **Graph**?

A Graph is a set of Nodes, and the "arrows" that connect them together. Specifically, a Graph has: 

1. A set of Nodes. 
2. A set of **Transitions** ("arrows") between those Nodes
3. A designated **start** Node.

Perhaps one can imagine "dropping" an agent onto the start Node, then seeing the agent move around different Nodes as it performs Actions and follows Transition arrows. 
Of course, this cannot (should not) go on forever – a Graph is completed when the Agent reaches a special  **End** Transition.


## Write your first task

In NodeKit, writing a task means writing a Graph. This tutorial will walk through how to write the simplest possible Graph, which is a Graph consisting of a single Node.  

### Writing a Node 

After installing NodeKit, one begins by importing `nodekit`, which is conventionally done as:

```python hl_lines="1" linenums="1"
import nodekit as nk
```

Next, a Node can be assembled. This Node's **Stimulus** is a piece of text. The **ActionSet** is the `f` keypress and `j` keypress.

```python hl_lines="3-6" linenums="1"
import nodekit as nk 

node = nk.Node(
    stimulus=nk.cards.TextCard(text="Hello world! Press f or j to continue."),
    sensor=nk.sensors.KeySensor(keys=['f', 'j'])
)
```

### Writing a Graph

Now that a Node is written, we will assemble a Graph. 
The Graph will have a single Node, which we will name `my-first-node`. As there is no other choice, `my-first-node` will be designated the **start** Node of the Graph. Moreover, once the agent completes this Node, the Graph will end, as `my-first-node`'s associated Transition is the **End** transition. 

```python hl_lines="8-16" linenums="1"
import nodekit as nk 

node = nk.Node(
    stimulus=nk.cards.TextCard(text="Hello world! Press f or j to continue."),
    sensor=nk.sensors.KeySensor(keys=['f', 'j'])
)

graph = nk.Graph(
    start='my-first-node',
    nodes={'my-first-node': node},
    transitions={'my-first-node': nk.transitions.End()},
)
```


