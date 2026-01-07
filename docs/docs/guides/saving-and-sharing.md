# Saving and sharing Graphs and Traces

This guide shows how to serialize a Graph into a portable `.nkg` file and how to serialize a Trace into JSON so you can share or archive results.

## Before you start (Graphs)

- You have a Graph object.
- You have a destination path that ends in `.nkg`, and its parent directory exists.
- Any Assets referenced by the Graph are available on disk.

## 1. Save a Graph to a `.nkg` file

Use `nk.save_graph` to pack a Graph and its Assets into a single file:

```python hl_lines="1-4" linenums="1"
import nodekit as nk

graph = nk.Graph(...)  # your Graph here
nk.save_graph(graph, "my-task.nkg")
```

???+ tip "The path must end in .nkg"
    `nk.save_graph` requires a `.nkg` filename and an existing parent directory.

???+ tip ".nkg files are self-contained"
    A `.nkg` file is a zip archive containing `graph.json` plus any Assets used by the Graph. Sharing the `.nkg` file is enough for someone else to load and run the Graph.

## 2. Load a Graph from a `.nkg` file

Load the Graph back with `nk.load_graph`:

```python hl_lines="1-3" linenums="1"
import nodekit as nk

graph = nk.load_graph("my-task.nkg")
```

???+ tip "Keep the file around"
    The loaded Graph reads Assets from inside the `.nkg` archive, so do not move or edit the file while the Graph is in use.

## Before you start (Traces)

- You have a Trace from `nk.play` or `nk.simulate`.
- You have a path where you want to save the JSON Trace.
- If you plan to load a Trace, you have the JSON file on disk.

## 3. Save a Trace to JSON

Traces are Pydantic models, so you can serialize them with `model_dump_json`:

```python hl_lines="1-7" linenums="1"
import nodekit as nk
from pathlib import Path

graph = nk.Graph(...)
trace = nk.play(graph)

Path("my-trace.json").write_text(trace.model_dump_json(indent=2))
```

## 4. Load a Trace from JSON

If you want to read the Trace later, validate the JSON back into a `Trace`:

```python hl_lines="1-4" linenums="1"
import nodekit as nk
from pathlib import Path

trace = nk.Trace.model_validate_json(Path("my-trace.json").read_text())
```
