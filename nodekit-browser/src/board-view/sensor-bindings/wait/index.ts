import {SensorBinding} from "../index.ts";
import type {WaitSensor} from "../../../types/sensors";
import type {WaitAction} from "../../../types/actions";

export class WaitSensorBinding extends SensorBinding<WaitSensor>{

    start(){
        setTimeout(
            () => {
                const waitAction: WaitAction = {
                    action_type: "WaitAction",
                    t: this.params.boardView.clock.now()
                }
                this.emit(waitAction)
            },
            this.params.sensor.duration_msec,
        )
    }
}