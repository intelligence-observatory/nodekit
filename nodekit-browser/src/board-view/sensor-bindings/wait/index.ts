import {SensorBinding} from "../index.ts";
import type {WaitSensor} from "../../../types/sensors";
import type {WaitAction} from "../../../types/actions.ts";

export class WaitSensorBinding extends SensorBinding<WaitSensor>{

    start(){
        setTimeout(
            () => {
                const waitAction: WaitAction = {
                    action_type: "WaitAction",
                }
                this.emit(waitAction)
            },
            this.params.sensor.duration_msec,
        )
    }
}