
## Sensor factory function spaghetti

Like I do for instantiating the `CompositeCard`, the `createSensorBinding` function should be responsible for recursing and creating bindings for the `ProductSensor` and `SumSensor`, not having the *Binding classes do this themselves. Limit recursion into `createSensorBinding`.


## Determinism

A replay of the full Trace should be possible by only considering the InputEvents.

## Sensor emissions

Right now, the Sensor emits the final Action. For visual Sensors, mutations to their state should be emitted to the event stream, not just their final Action.