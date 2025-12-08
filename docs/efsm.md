# NodeKit Types

## Values and Expressions
- `Value`. Sum type of `bool`, `int`, `float`, `str`, `list[Value]`, `dict[str, Value]`.
- `Expression<V>`. A computation the interpreter may _evaluate_ to a Value of type `V`, discriminated by `op`. Notable forms:
    - Data access: `reg`, `local`, `la` (last action), `gli` (get list item), `gdv` (get dict value), `lit`.
    - Conditionals and logic: `if`, `not`, variadic `or`/`and`.
    - Comparators: `eq`, `ne`, `gt`, `ge`, `lt`, `le`.
    - Arithmetic: `add`, `sub`, `mul`, `div`.
    - Array ops: `slice`, `map`, `filter`, `fold` (with local bindings for `cur`/`acc` where relevant).

## Graph
A Graph describes a behavioral task as an [extended finite state machine](https://en.wikipedia.org/wiki/Extended_finite-state_machine). The Graph consists of Nodes, the Transitions between them, and a Register file.
  - `.start: NodeId`. The starting Node of the task.
  - `.nodes: Dict[NodeId, Node]`. Nodes are the vertices of the Graph. A `Node` is a description of an atomic unit of an experiment. It is described in further detail below.
  - `.transitions: Dict[NodeId, Transition]`. A Transition describes the outgoing edge(s) from each Node. `Transition` is a sum type: `Go | End | Branch`.
    - `Go { to: NodeId, register_updates?: Dict[RegisterId, Expression] }`
    - `End {}` (terminates the Graph)
    - `Branch { cases: list[{ when: Expression<bool>, then: Go | End }], otherwise?: Go | End }`. Cases are evaluated in order; the first matching case fires its `then`. If none match, `otherwise` is taken (defaults to `End`).
    - `register_updates` live only on `Go` (including those nested inside `Branch` cases). All Expressions are evaluated before any are committed.
  - `.registers: Dict[RegisterId, Value]`. The initial register file of the EFSM.

## Trace
A `Trace` is a description of a single Agent's run of a Graph.
  - `.events: Event[]`. Raw log of everything that happened across the run (e.g. pointer, key, sensor-triggered actions). Events are stored sorted by timestamp. 

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
* `CompositeCard`, which is a container that can contain other Cards.


### Sensor
Sensors are state machines which hold a Sensor state. They "fire" once with an Action, then are disabled after. Leaf Sensors:

* `WaitSensor` — fires after `duration_msec`.
* `ClickSensor` — fires on a pointer click within `region`.
* `KeySensor` — fires on the first valid key in `keys`.
* `SelectSensor` — fires on the first choice selection.
* `MultiSelectSensor` — fires when the `confirm_button` is pressed after meeting `min_selections`/`max_selections` constraints.
* `SliderSensor` — fires when the first slider value is set (`num_bins`, `initial_bin_index`, optional `show_bin_markers`, `orientation`).
* `FreeTextEntrySensor` — fires on Done after a valid text entry (`prompt`, `font_size`, `min_length`, optional `max_length`).

Composite Sensors:
* `ProductSensor` — product of child action sets.
* `SumSensor` — disjoint union; the first child to fire wins.

`type Sensor = LeafSensor | Product<Sensor> | Sum<Sensor>`
