
 This tutorial will outline the three different ways to get behavioral data using NodeKit: 

1. `nk.play`: run your Graph locally in your web browser (to get behavior from yourself)
2. `nk.simulate`: run your Graph in Python (to get behavior from a NodeKit-compatible agent)
3. `nk.build_site`: convert your Graph into a deployable site which you can serve for users on platforms like Mechanical Turk and Prolific

This tutorial requires that you have a Graph, ready-to-go. Any Graph is suitable; here is a simple one below: 

```python
import nodekit as nk

node = nk.Node(
    card=nk.cards.TextCard(text="Hello world! Press f or j to continue."),
    sensor=nk.sensors.KeySensor(keys=['f', 'j'])
)

graph = nk.Graph(
    start='my-first-node',
    nodes={'my-first-node': node},
    transitions={'my-first-node': nk.transitions.End()},
)
```



## 1. Play your Graph locally

Once a Graph is written, one can play it locally by using the `nk.play` function: 
```python hl_lines="14-16" linenums="1"
import nodekit as nk
graph = nk.Graph(...) # Insert your Graph here
trace = nk.play(graph) # Launch Graph on your local machine
```

You should see a message appear in your Python console with a link to a URL on `localhost` (by default, at port [7651](http://127.0.0.1:7651)).

Navigate to the page, then play the Graph. Once the Graph completes, the `nk.play` call will return, and return your behavioral **Trace**. 


## 2. Simulate your Graph in Python

A key feature of NodeKit is that artificial agents can play your Graph – not just humans. We'll use an agent that ships with NodeKit – the `RandomGuesser`.

To do so, use the `nk.simulate` function: 

```python hl_lines="14-16" linenums="1"
import nodekit as nk
graph = nk.Graph(...) # Insert your Graph here
agent = nk.agents.RandomGuesser(seed=0) # Instantiate agent
trace = nk.simulate(graph, agent) # Run Graph on agent and get its behavioral trace
```

To write your own Agent, see the [Writing Agents Guide](../guides/writing-agents.md).

## 3. Build your Graph into a deployable site

Graphs can be "built" into a static site which may be hosted on a web server, such as S3. To do so, call the `nk.build_site` function, supplying your Graph and a directory where you'd like to save the static site contents.

Below, a static site will be generated at `./my-built-site`:

```python hl_lines="3" linenums="1"
import nodekit as nk
graph = nk.Graph(...) # Insert your Graph here
result = nk.build_site(graph, savedir='my-built-site')
```

You should see a new folder called `my-built-site` wherever your Python code was run on your filesystem. 

Notice that the `nk.build_site` function returns a `result`. The `result` contains information about the site, including where the "entrypoint" HTML file is located within the site folder. Let's print that entrypoint out now:


```python hl_lines="4" linenums="1"
import nodekit as nk
graph = nk.Graph(...) # Insert your Graph here
result = nk.build_site(graph, savedir='my-built-site')
print(result.entrypoint)
```

If you'd like, you can open up the directory and launch the `index.html` file in your web browser. 


??? question "How is `nk.build_site` different from `nk.play`?"

    The `nk.build_site` function results in a deployable website that can be uploaded for viewing by others, whereas `nk.play` simply plays the Graph on your local machine.
    
    While you could certainly use `nk.build_site` to preview your Graph, it doesn't automatically collect and return your data, and it also adds stuff to your file system.


Deploying this site to users on Mechanical Turk, Prolific, or similar platforms is a topic which is discussed in the [Deployment Guide](../guides/mechanical-turk-and-prolific.md).
