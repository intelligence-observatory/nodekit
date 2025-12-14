
## A brief primer on NodeKit

NodeKit describes tasks as a **Graph** of **Nodes**. Here's an example **Graph** which describes a task consisting of one match-to-sample trial: 

![An example NodeKit Graph](example-graph.png)


### What is a **Node**?
 A Node is conceptually simple. It can be understood as the combination of two things:

1. A __Stimulus__ that the agent views, which might be an image, some text, a video, or a combination of such things. 
2. An __ActionSet__, such as a set of legal keypresses, a set of slider values, or even the set of all text strings under length `n`. 

A Node is completed when the agent makes a selection from the ActionSet – that is, a _Node ends when the Agent performs an Action_ from the Node's Action Set.

### What is a **Graph**?

By "wiring" such Nodes together, one can express a variety of tasks from psychology and beyond. In short, a Graph is: 

1. A set of **Nodes**. 
2. A set of **Transitions** between those Nodes – i.e. "arrows" that connect different Nodes to each other. 
3. A designated **start** Node.

Perhaps one can imagine "dropping" an agent onto the start Node, then seeing the agent move around different Nodes as it performs Actions. 
Of course, this cannot (should not) go on forever – a Graph is completed when the Agent reaches a special  **End** Transition. 

### What is a **Run**?

An Agent 


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

### Sequencing Nodes and Graphs

The Graph we have written expresses a single trial. One can combine multiple Graphs into a single "mega Graph" which executes them sequentially. While this could be done manually, NodeKit offers a `nk.concat` operation to avoid having to wire Nodes together: 

```python
import nodekit as nk
my_task = nk.concat([trial1, trial2, trial3])
```


## Play your task locally

Once a Graph is written, one can play it locally by calling the `nk.play` function. This will launch the task on your `localhost`, at [http://127.0.0.1:7651](http://127.0.0.1:7651). 

```python hl_lines="14-16" linenums="1"
import nodekit as nk 
trace = nk.play(graph)
```

Navigate to the page, and you can play the Graph. Once the Graph completes, the `nk.play` call will return, and return a **Trace** containing your behavioral data.
