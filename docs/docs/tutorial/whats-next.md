
These tutorials showcased the core workflow of NodeKit. To recap, NodeKit is used by:

1. Defining a set of **Nodes**, each of which consists of a Cards and a Sensor.
2. Wiring those Nodes together into a **Graph**, using Transitions.
3. Deploying that Graph (to your local machine, as a static website, or as a Python simulation) and **getting behavior** from agent(s).



## Next steps

At this point, considering checking out the [Examples](../examples/index.md) to see a gallery of behavioral tasks written in NodeKit.

Alternatively, consider browsing the user guides and the API reference manual, depending on your goals. For example:

- [How to deploy Graphs to Mechanical Turk or Prolific](../guides/mechanical-turk-and-prolific.md)
- [How to save and load Graphs and Traces](../guides/saving-and-sharing.md) from disk
- [An overview of all Card types](../reference/cards.md), including the _VideoCard_ and _CompositeCard_
- [An overview of all Sensor types](../reference/sensors.md), including the _SliderSensor_ ,  _TextEntrySensor_, and _ProductSensor_

You might also consider cloning the [GitHub repository for NodeKit](https://github.com/intelligence-observatory/nodekit) on your local machine, have your favorite coding agent read it, then ask it any questions you still have about the project. (Or have it use NodeKit for you). 


## Advanced topics
Certain advanced topics that are **not needed** for many tasks were not covered in these tutorials. For example: 

- The use of **Graph Registers** which are needed to describe experimental designs like _performance-gated blocks_ and _staircases_. 
- The full set of **Events** which are recorded in the Trace, such as key/pointer samples and page suspends, that enable finer-grained analysis 


