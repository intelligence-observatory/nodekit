# NodeKit: a Python library for behavioral tasks 

NodeKit is a Python library for writing behavioral tasks. Any task written in NodeKit can be run in the browser (for humans) or in Python (for models).


### 1. Write your task in Python 

```python
import nodekit as nk
graph = ...
```

### 2. Get behavior from humans or models

Play your task in your web browser: 
```python
behavior = nk.play(graph)
```

Treat your task as a model environment:
```python
behavior = nk.simulate(graph, model)
```

Build your task into a ready-to-deploy static website:  
```python
site = nk.build_site(graph, 'my-task')
```


## Why NodeKit?

- **No HTML/JavaScript/CSS.** Instead, do everything in Python.
- **Share reproducible tasks** instead of Methods sections and website source code
- **Run fair comparisons between models and humans** 

## Why not NodeKit?

- **No HTML/JavaScript/CSS.**
- No audio


