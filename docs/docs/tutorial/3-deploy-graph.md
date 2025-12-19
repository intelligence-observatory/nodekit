
 This tutorial will walk through the three different ways to get behavioral data using NodeKit: 

1. `nk.play`: run your Graph locally in your web browser (to get behavior from yourself)
2. `nk.simulate`: run your Graph in Python (to get behavior from a NodeKit-compliant agent)
3. `nk.build_site`: convert your Graph into a static site which can be deployed to platforms like Mechanical Turk or Prolific

This tutorial requires that you have a Graph, ready-to-go. In the last tutorial, a simple Graph was written:

```python
import nodekit as nk
graph = nk.Graph(...)
```



## Play your task locally

Once a Graph is written, one can play it locally by calling the `nk.play` function. This will launch the task on your `localhost`, at [http://127.0.0.1:7651](http://127.0.0.1:7651).

```python hl_lines="14-16" linenums="1"
import nodekit as nk 
trace = nk.play(graph)
```

Navigate to the page, and you can play the Graph. Once the Graph completes, the `nk.play` call will return, and return a **Trace** containing your behavioral data. Let's view the data:

```json
{
  "yo": 'yo'
}
```

## Simulation


## Build your task for Mechanical Turk


