import {SensorBinding} from "../index.ts";
import type {WaitSensor} from "../../../types/sensors";
import type {BoardView} from "../../board-view.ts";
import type {WaitAction} from "../../../types/actions";
import type {Clock} from "../../../clock.ts";

export class WaitSensorBinding extends SensorBinding<WaitSensor>{
    private clock!: Clock
    prepare(
        boardView: BoardView
    ) {
        this.clock = boardView.clock;
    }

    start(){
        // Set a timeout
        setTimeout(
            () => {
                const waitAction: WaitAction = {
                    action_type: "WaitAction",
                    t: this.clock.now()
                }
                this.emit(waitAction)
            },
            this.sensor.timeout_msec,
        )

    }
}