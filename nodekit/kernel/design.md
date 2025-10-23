## Invariants

* Sensors MAY _own_ a visual projection (SliderSensor; FreeTextEntrySensor), but the loose requirement is that such Sensors' visual projection is specific to the way in which they are triggered, and hold no other typical use.
* All Sensors MUST retain their "last fired state" only. In turn, Sensor states MUST either be submittable or not.
* A Node MAY have zero or more Sensors.
* A Node MAY have zero or more Cards.
* Nodes MAY end when all Sensor states are submittable.
  * It MUST end if there is no submit button. 
  * It MUST end if all Sensor states are submittable and the submit button is pressed.
* Nodes MUST end if the `timeout_msec` is reached for the Node.

## Data representations

Here is a working model of a single NodeCompletedEvent, which is a "rolled up" projection of the event stream, along with an optional annotation. Under the standard analysis path, users simply filter the Event Stream to NodeCompletedEvents,
and load them up directly into their analysis pipelines.

The idea is that users may supply arbitrary JSON as an Annotation that aids them later in the analysis. No information gained by the participant completing the Trace is lost if annotations are thrown away.

```javascript
let x = {
    "node_id": "choice-node",
    "node": {
        "cards": {},
        "sensors": {},
        "effects": [],
        "background_color": "blue",
        "timeout_msec": 10000,
        "annotations": null,
    },
    "actions": { // Encodes last commits of Sensors. 
        "category-choice": {
            "action_type": "SelectAction",
            "selections": [
                'my-choice-card' // CardId
            ],
            "t": 30021
        },
        "confidence-value": {
            "action_type": "SliderAction",
            "tick_index": 0,
            "normalized_slider_value": 0.32,
            "t": 31234 // Time of last firing
        },
      "user-feedback": {
            "action_type":"FreeTextEntryAction",
            "text": "I hate this task", 
            "t": 31112,
      }
    },
    "timed_out": false,  
    "t_entered": 29023, // Time of Node entry
    "t_exited": 32322
}
```

## Todo:

- [ ] `MarkSensor` / `GridSelectSensor`; targets a Card. 
- [ ] Sensors need to have arming predicates. E.g., if a SelectSensor is meant to implement the submit flow, we have: 
  - All other Sensors are in submittable state. 
  - Any time guards have elapsed.
  - Then, the targeted card indicates it is 'selectable'.