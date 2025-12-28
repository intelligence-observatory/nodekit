Agents can inherit from `nk.agents.BaseAgent`. See `nk.agents.RandomGuesser` for an example implementation.

An Agent is expected to produce a valid `Action` when given a `Node`.

???+ warning "Simulation API is in a work in progress"
    A key shortcoming of the current Simulation API is that Agents cannot disclose their own reaction times; all artificial Agents have a reaction time of 1 millisecond.