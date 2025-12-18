import {SensorBinding} from "../index.ts";
import type {WaitSensor} from "../../../types/sensors.ts";
import type {WaitAction} from "../../../types/actions.ts";

export class WaitSensorBinding extends SensorBinding<WaitSensor>{

    start(){
        setTimeout(
            () => {
                const waitAction: WaitAction = {
                    action_type: "WaitAction",
                    action_value: null,
                }
                this.emit(waitAction)
            },
            this.params.sensor.duration_msec,
        )
    }
}