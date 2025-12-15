
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


