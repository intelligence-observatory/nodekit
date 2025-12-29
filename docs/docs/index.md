# NodeKit: a Python library for behavioral tasks 

NodeKit is a Python library for writing behavioral tasks. Any task written using NodeKit can be run in the browser (for people) or in Python (for models).

![An example NodeKit Graph](tutorial/PNG/afc-trial-graph.png)


## Why use NodeKit? 

- **No HTML/JavaScript/CSS.** Instead, write tasks with Python.
- **Humans and models do the same task.** One NodeKit task can feed model simulations *and* web browser experiments. 
- **A task is one JSON document**. A task is fully specified in a single file, with no  dependencies on external libraries or plugins.
 

## Why not use NodeKit?

- **No HTML/JavaScript/CSS.** Arbitrary logic and visual customizability are not accessible in NodeKit.
- **Fixed layout philosophy.** NodeKit tasks are intended to be pixel-for-pixel reproducible, and do not react to window resizing or device type.
- **No audio support.** NodeKit focuses on purely visual tasks.


## Project roadmap

NodeKit is in active, early development. Current goals in progress include: 

* Refining and expanding the documentation site
* Improving determinism in the web browser
* Enriching the model simulator so it can yield rasterized graphics

