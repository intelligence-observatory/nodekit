
This tutorial showcased the core concepts of NodeKit: the **Node** and the **Graph**. Most of the code one will write when using NodeKit concerns the creation of Nodes and Graphs.
We wrote a fairly simple Graph in this tutorial, but more is possible:

- Stimuli involving **images or video**, or **combinations thereof**
- More ActionSets, like the **WaitSensor**, **SliderSensor**, **SelectSensor**, and **TextEntrySensor**.
- Describing logic like **performance-gated blocks** using Graph Registers
- Building a **website you can deploy to Mechanical Turk** from a Graph


## Convenience methods
### Sequencing via `nk.concat`

The Graph we have written expresses a single trial. One can combine multiple Graphs into a single "mega Graph" which executes them sequentially. While this could be done manually, NodeKit offers a `nk.concat` operation to avoid having to wire Nodes together:

```python
import nodekit as nk
my_task = nk.concat([trial1, trial2, trial3])
```

### Branching

Up to this point, all the Graphs have involved _linear sequencing_ of Nodes, where Nodes are administered to the agent one after the other.

But many tasks involve branching. (todo)
