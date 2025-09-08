# Node

## Board

## Cards

## Sensors 

## ReinforcerMaps

A **ReinforcerMap** is a pure function `f: Tuple[Node, Action] -> [Card]` evaluated at fire time. The list of **Cards** it produces are played on a new Timespan which begins the moment the **Action** was detected.


## Effects