## Node

A Node consists of a single `Stimulus` and a single `Sensor`. Conceptually:

* the `Stimulus` describes the context provided to the Agent (e.g. an image, a pair of images, a video and a piece of text...).
* the `Sensor` describes the action set (and associated selection procedure) that the Agent will be presented with in the Node.

A Node ends when the Sensor is triggered by an `Action`.

Additional presentation/behavior fields:

* `board_color`: background color for the Node (defaults to `#808080ff`).
* `hide_pointer`: whether to hide the pointer during this Node.

### Stimulus

A `Stimulus` is described using a type called a `Card`.

### Card

Cards represent a visual element on the Board. There are four Card types in NodeKit:

* `ImageCard`
* `VideoCard`
* `TextCard`
* `CompositeCard`, which is a container that can contain other Cards. This should be used whenever the Stimulus cannot be expressed using a single Card, and/or when the user would like to organize Cards by group or ID.

### Sensor

Sensors are state machines which hold a Sensor state. They "fire" once with an Action, then are disabled after. Leaf Sensors:

* `WaitSensor` — fires after `duration_msec`.
* `ClickSensor` — fires on a pointer click within `region`.
* `KeySensor` — fires on the first valid key in `keys`.
* `SelectSensor` — fires on the first choice selection.
* `MultiSelectSensor` — fires when the `confirm_button` is pressed after meeting `min_selections`/`max_selections` constraints.
* `SliderSensor` — fires when the first slider value is set (`num_bins`, `initial_bin_index`, optional `show_bin_markers`, `orientation`).
* `TextEntrySensor` — fires on Done after a valid text entry (`prompt`, `font_size`, `min_length`, optional `max_length`).

Composite Sensors:

* `ProductSensor` — product of child action sets.
* `SumSensor` — disjoint union; the first child to fire wins.

`type Sensor = LeafSensor | Product<Sensor> | Sum<Sensor>`

## Graph

A Graph describes a behavioral task as an [extended finite state machine](https://en.wikipedia.org/wiki/Extended_finite-state_machine). The Graph consists of Nodes, the Transitions between them, and a Register file.

- `.start: NodeId`. The starting Node of the task.
- `.nodes: Dict[NodeId, Node]`. Nodes are the vertices of the Graph. A `Node` is a description of an atomic unit of an experiment. It is described in further detail below.
- `.transitions: Dict[NodeId, Transition]`. A Transition describes the outgoing edge(s) from each Node. `Transition` is a sum type: `Go | End | IfThenElse | Switch`.
    - `Go { to: NodeId, register_updates?: Dict[RegisterId, Expression] }`
    - `End {}` (terminates the Graph)
    - `IfThenElse { if: Expression<bool>, then: Go | End, else: Go | End }` (binary guard; `else_` defaults to `End`)
    - `Switch { on: Expression<LeafValue>, cases: Dict[LeafValue, Go | End], default?: Go | End }` (value-based dispatch; no fallthrough, `default` defaults to `End`)
    - `register_updates` live only on `Go` (including those nested inside `IfThenElse`/`Switch` branches). All Expressions are evaluated before any are committed.
- `.registers: Dict[RegisterId, Value]`. The initial register file of the EFSM.

## Trace

A `Trace` is a description of a single Agent's run of a Graph.

- `.events: Event[]`. Raw log of everything that happened across the run (e.g. pointer, key, sensor-triggered actions). Events are stored sorted by timestamp.

## Board

The Board is NodeKit's name for the region of the Agent's display where visual content is rendered. Points on the Board are described using _Board coordinates_, where: 

* (0, 0) is the center of the Agent's display.
* Positive increases in the first coordinate (x) causes movement in the **rightward** direction.
* Positive increases in the second coordinate (y) causes movement in the **upward** direction. 
* Units are normatively specified as **reference pixels**. A reference pixel is a unit of _visual angle_ defined in the [W3C specification](https://www.w3.org/TR/css-values-3/#reference-pixel) as the visual angle of one pixel on a
  device with 96 [dpi](https://en.wikipedia.org/wiki/Dots_per_inch) at an arm's length. Given an arm's length of 28 inches, a reference pixel is ~0.0213° of visual angle. In practice, NodeKit interprets Board units as _CSS pixels_, which the W3C spec _recommends_ be mapped by the browser [1:1 with reference pixels](https://www.w3.org/TR/css-values-3/#absolute-lengths). Note that this mapping is always
  approximate, in that the browser 1) does not know the Agent's viewing position, and 2) does not know the physical size of _device pixels_.


Thus, a Board coordinate of (100, 100) would indicate a point that is 100 pixels to the right, and 100 pixels up from the Agent's display.

The NodeKit Board is 1024 x 1024 _reference pixels_. A 1024 x 1024 region corresponds to ~21.81° x 21.81° of the Agent's visual field, given the assumptions above, and when viewed straight on.
