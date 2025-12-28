
??? tip "Do the previous tutorial first!"
    This tutorial assumes you completed the [previous tutorial](2-first-graph.md), which gives an overview of Graphs, Nodes, and Transitions.


In this tutorial, we will write a Graph that describes a "real" behavioral task, with instructions and classification trials. 

Along the way, you'll get exposed to more features of NodeKit. By the end, you'll have written a Graph that looks like this: 

![An instructions Graph](PNG/nested-graph.png)

???+ question "Why does this Graph look different?"
    In the picture above, one can notice something new: a _Graph made up of Graphs_. This enables one to write a Graph _hierarchically_, using smaller organizational units of one's choosing (such as "trials" and "blocks").
    
    This new concept will be introduced later in this tutorial. 
       

## Step 1: Create instructions Graph

We'll begin by writing an "instructions Graph" which consists of two pages of instructions. At the end of this step, we'll have a Graph that looks like this: 


![Instructions Graph](AFC-graph/instructions-subgraph.png)

As in the previous tutorial, we'll start by defining a set of Nodes, then wiring them together into the Graph. 


### Define instruction Nodes

First, add the following code to write the first page of instructions:

```python hl_lines="1-16" linenums="1" 
import nodekit as nk 

instructions_page_1 = nk.Node(
    card=nk.cards.TextCard(
        text=("# Welcome!"
              "\n\n"
              "This is the first page of the instructions. "
              "Press the right arrow key to continue."),
        justification_horizontal='left',
    ), 
    sensor=nk.sensors.KeySensor(
        keys=['ArrowRight']
    ),
    board_color='#ffffffff', # white background
)
```

Notice we are setting the `justification_horizontal` field in the `TextCard` to `left`. In general, the TextCard has many default parameters which may be overridden to customize the appearance of the TextCard. 

???+ tip "TextCards accept Markdown syntax"

    You might have noticed we used [Markdown formatting](https://www.markdownguide.org/basic-syntax/) in the `text` field of the TextCard. Here, we wrote `# Welcome!` to define a header element.

    In NodeKit, **TextCards accept Markdown syntax.** This allows one to easily bold and italicize text, create lists, and more. 



???+ tip "Coloring the background of the Node"

    You might have also noticed we set the `board_color` parameter of the Node. By default, the background color in NodeKit is gray. Here, we've changed it to white. 

    NodeKit uses [8 digit hex encoding](https://en.wikipedia.org/wiki/Web_colors#Hex_triplet) of colors, which enables one to specify (R, G, B, A).




Now let's write the second page of instructions, which will be another Node that looks quite similar to the first one. 
 
```python hl_lines="16-29" linenums="1" 
import nodekit as nk

instructions_page_1 = nk.Node(
    card=nk.cards.TextCard(
        text=("# Welcome!"
              "\n\n"
              "This is the first page of the instructions. "
              "Press the right arrow key to continue."),
        justification_horizontal='left',
    ),
    sensor=nk.sensors.KeySensor(
        keys=['ArrowRight']
    ), 
    board_color='#ffffffff', # white
)

instructions_page_2 = nk.Node(
    card=nk.cards.TextCard(
        text=("This is the **second** page. "
              "Press the right arrow key to continue."),
        font_size=20, 
        justification_horizontal='left',
    ), 
    sensor=nk.sensors.KeySensor(
        keys=['ArrowRight']
    ),
    board_color='#ffffffff', # white background
)
```


### Wire Nodes together into instruction Graph
Now it's time to "wire" these two Nodes together into a Graph. Add the following lines of code:

```python hl_lines="30-40" linenums="1" 
import nodekit as nk

instructions_page_1 = nk.Node(
    card=nk.cards.TextCard(
        text=("# Welcome!"
              "\n\n"
              "This is the first page of the instructions. "
              "Press the right arrow key to continue."),
        justification_horizontal='left',
    ),
    sensor=nk.sensors.KeySensor(
        keys=['ArrowRight']
    ),
    board_color='#ffffffff', # white background
)

instructions_page_2 = nk.Node(
    card=nk.cards.TextCard(
        text=("This is the **second** page. "
              "Press the right arrow key to continue."),
        font_size=20, 
        justification_horizontal='left',
    ), 
    sensor=nk.sensors.KeySensor(
        keys=['ArrowRight']
    ),
    board_color='#ffffffff', # white background
)

instructions_graph = nk.Graph(
    start='page1',
    nodes={
        'page1': instructions_page_1, 
        'page2': instructions_page_2,
    },
    transitions={
        'page1': nk.transitions.Go(to='page2'),
        'page2': nk.transitions.End()
    }
)
```

As in the previous tutorial, we assigned an ID to each Node (`page1` and `page2`). Naturally, we have the Graph *start* on `page1`. You might also recognize the **End Transition**, which declares the Graph will end after the agent takes an Action in `page2`.

But we have not seen this new **Go Transition**, which is attached to `page1`. The Go Transition here means: after the agent takes an Action in `page1`, **_go to_** `page2`.


We're now down with the instructions Graph. If you'd like, try calling `nk.play` on the instructions Graph to inspect how it looks.


## Step 2: Write the AFC Graphs

Let's now turn our attention to writing an alternative forced choice image classification trial. A single trial has a Graph which looks like this:

![AFC Graph](AFC-graph/afc-trial-subgraph.png)

In plain words, this Graph proceeds through the following phases: 

1. **Fixation:** Showing the agent a fixation point which they must click
2. **Stimulus:** Showing the agent a stimulus for a fixed duration of time
3. **Choice:** Showing the agent an array of choices, of which the agent must choose 1
4. **Feedback**: Delivering a "reward" **OR** "punish" screen, based on some notion of correctness


### Define Nodes
Begin by picking an image. They should be PNG or JPEG; NodeKit does not support other image formats. 



### Set up feedback logic with the `IfThenElse` Transition


## Step 3: Make a Graph of Graphs 

### Save time by using `nk.concat`

## Step 4: Play the Graph

## Step 5: View and save the Trace 


Because `Trace` is a `pydantic.BaseModel`, you can save it as a JSON file by using Pydantic's [.model_dump_json](https://docs.pydantic.dev/latest/concepts/serialization/#json-mode) instance method. 

Save the Trace you generated by running the following line: 

```python
import nodekit as nk
from pathlib import Path 

trace: nk.Trace

Path('my-trace.json').write_text(trace.model_dump_json())
```

## Summary

## What's next?

