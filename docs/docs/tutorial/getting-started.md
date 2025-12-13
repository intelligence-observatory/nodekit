## Install NodeKit

NodeKit uses the [uv](https://docs.astral.sh/uv/) Python package and project manager. 

=== "macOS and Linux"

    Install uv (if you don’t have it yet):

    ```bash
    curl -LsSf https://astral.sh/uv/install.sh | sh
    ```

    Install NodeKit in your project:

    ```bash
    uv init  # optional: creates pyproject.toml and a virtualenv
    uv add nodekit
    ```

=== "Windows"

    Install uv (if you don't have it yet):

    ```powershell
    irm https://astral.sh/uv/install.ps1 | iex
    ```

    Install NodeKit in your project:

    ```powershell
    uv init  # optional: creates pyproject.toml and a virtualenv
    uv add nodekit

    ```

## A brief primer

NodeKit describes tasks as a **Graph** of **Nodes**. Here's an example **Graph** which describes a task consisting of one match-to-sample trial: 

![An example NodeKit Graph](example-graph.png)


### What is a **Node**?
 A Node is conceptually simple. It can be understood as the combination of two things:

1. A __Stimulus__ that the agent views, which might be an image, some text, a video, or a combination of such things. 
2. An __Action Set__, such as a set of legal keypresses, a set of slider values, or even the set of all text strings under length `n`. 

A Node is completed when the agent makes a selection from the Action Set – that is, a _Node ends when the Agent performs an Action_ from the Node's Action Set.

### What is a **Graph**?

By "wiring" such Nodes together, one can express a variety of tasks from psychology and beyond. In short, a Graph is: 

1. A set of **Nodes**. 
2. A set of **Transitions** between those Nodes – i.e. "arrows" that connect different Nodes to each other. 

Perhaps one can imagine "dropping" an agent onto a Graph, then seeing the agent move around different Nodes as it performs Actions. 
Of course, this cannot (should not) go on forever – a Graph is completed when the Agent reaches a special  **End** Transition. 

## Write your first task

In NodeKit, writing a task means writing a Graph. We'll begin by writing the simplest possible Graph, which is a Graph consisting of one Node.  

```python
import nodekit as nk
```

??? tip "See the full code"
```python
print("hello")
```


## Play your task locally

## Deploy to Mechanical Turk
