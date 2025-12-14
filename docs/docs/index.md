# NodeKit: a Python library for behavioral tasks 

NodeKit is a Python library for writing behavioral tasks that can be run on humans or models.

Tasks written with NodeKit can be built into static websites (for humans) or Python simulation environments (for models).

### 1. Write your task in Python 

```python
import nodekit as nk
graph = ...
```

### 2. Get behavior from humans or models

Play your task in your web browser: 
```python
run = nk.play(graph)
```

Treat your task as a model environment:
```python
run = nk.simulate(graph, model)
```

Build your task into a ready-to-deploy static website for Mechanical Turk:  
```python
nk.build_site(graph, 'my-task')
```


## Why NodeKit?

- **No HTML/JavaScript/CSS.** Instead, do everything in Python.
- **Share reproducible tasks**, not Methods sections and website source code
- **Fair comparisons between models and humans.** 

## Why not NodeKit?

- **No HTML/JavaScript/CSS.**
- No audio


