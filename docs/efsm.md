# NodeKit Types

## Values and Expressions
- `Value`. A Value is a sum type of `str`, `bool`, `int`, and `Container`. Container is a recursive type, in that it contains other `Values` as children. 
- `Expression<V>`. An `Expression` denotes a computation which the interpreter may _evaluate_ to a Value of type `V`. 
    - There are all the usual arithmetic and logical Expressions one would expect (`Add`, `Sub`, `Lit`, `Not`, ...)
    - `Var {register_id: RegisterId}`. Evaluates to the `Value` stored in a Graph register.
    - `Get {container: Expression<Container>, key: ContainerKey}`. Evaluate an item in a Container. 
    - `ActionField {key: ContainerKey}`. Evaluates a field of the last Action in the _last_ completed Node.

## Graph
A Graph describes a behavioral task as an [extended finite state machine](https://en.wikipedia.org/wiki/Extended_finite-state_machine). The Graph consists of nodes, the transitions between them, and a register file.
  - `.start: NodeId`. The starting Node of the task.
  - `.nodes: Dict[NodeId, Node]`. Nodes are the vertices of the Graph. A `Node` is a description of an atomic unit of an experiment. It is described in further detail below.
  - `.transitions: Dict[NodeId, List[Transition]]`. The list of edges emanating from each Node. Evaluated left-to-right. Each `Transition` has: 
    - `.when: Expression<bool>`. Note in practice, this tends to be an Expression involving `ActionField`. For certain sophisticated flows (e.g. psychophysical staircases), Graph registers are also used.
    - `.to: NodeId`. Which Node to transition to, assuming `.when` is True.
    - `.register_updates: Dict[RegisterId, Expression]`. Effectuated only if this Transition is taken. All Expressions are evaluated first, then all are committed. In practice, this tends to be used rarely.
  - `.registers: Dict[RegisterId, Value]`. The initial register file of the EFSM.

## Trace
A `Trace` is a description of a single Agent's run of a Graph. It contains:
  -  `.events: Event[]`. Raw log of everything that happened across the run, such as all pointer and key inputs. 
  - `.node_outcomes: NodeOutcome[]`. A `NodeOutcome` is a projection of `.events` and the `Graph`, used for analysis. 
      -  `.node: Node`. The Node. 
      -  `.action: Action`.
      - `.t_start`
      - `.t_end`

## Node
A Node consists of a single `Stimulus` and a single `Sensor`. Conceptually: 
* the `Stimulus` describes the context provided to the Agent (e.g. an image, a pair of images, a video and a piece of text...). 
* the `Sensor` describes the action set (and associated selection procedure) that the Agent will be presented with in the Node.

A Node ends when the Sensor is triggered by an `Action`.

### Stimulus

A `Stimulus` is just an alias for `Card`. i.e. `type Stimulus = Card`.

### Card

Cards represent a visual element on the Board. They have a state which describes their visual appearance. There are three fundamental Card types in NodeKit: 
* `ImageCard`
* `VideoCard`
* `TextCard`

A Card can be expressed as a product of these basic types, using the `GroupCard`; e.g. `type GroupCard where { items: Record<str, Card>}`

`type Card = ImageCard | VideoCard | TextCard | GroupCard`


### Sensor
Sensors are state machines which hold a Sensor state. They "fire" once with an Action, then are disabled after. There are six leaf Sensors:

* `WaitSensor`. Fires when the time has elapsed.
* `SelectSensor`. Fires when the first selection is made.
* `MultiSelectSensor`. Fires when the Done button is pressed.
* `KeySensor`. Fires when the first valid key is pressed.
* `TextEntrySensor`. Fires when the in-line Done button is pressed.
* `SliderSensor`. Fires when the first slider is set, or if the optional Done button is pressed.

Sensors are algebraic data types; i.e. `type Sensor = LeafSensor | Product<Sensor> | Sum<Sensor>`:

`type Sensor = ... | Product<Sensor> | Sum<Sensor>`

* A `Sum<Sensor>` is a Sensor consisting of a disjoint union between constituent Sensors; the first one to fire .
* A `Product<Sensor>` is a Sensor consisting of a product of all of its child Action Sets.

# Future

### Confirm flows

Multiple child Sensors, one confirm button. 

### Animations (future)
An Animation describes how a Card changes across time. An Animation denotes a pure function `t -> Card` which describes the Card's intended visual state at time `t: NodeTimepointMsec`. Without an Animations, one can consider the Card's visual appearance to be static across the NodePlay Common animation rules:
- `Step`
- `Linear`
- `Boxcar`
- `SquareWave`
- `Ramp` 


When Animations are introduced, the `VideoCard` should be adjusted so playback is explicitly controlled by an Animation.