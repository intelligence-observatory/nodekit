import nodekit as nk

from pathlib import Path

graph = nk.Graph.model_validate_json(Path("graph.json").read_text())

# %%
trace = nk.play(graph)
