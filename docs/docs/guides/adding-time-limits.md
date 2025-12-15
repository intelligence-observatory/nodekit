Many task designs impose time limits on the agent. 
These limits come in at least two forms:

- A **minimum time duration**: i.e., the minimal amount of time the agent must spend in a certain phase of the task
- A **maximum time duration**: the amount of time the agent has to do something before the phase "times out"


In NodeKit, these designs are expressed by combining WaitSensor, ProductSensor, and SumSensor.  