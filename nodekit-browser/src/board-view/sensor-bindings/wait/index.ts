import {SensorBinding} from "../index.ts";
import type {WaitSensor} from "../../../types/sensors";
import type {BoardView} from "../../board-view.ts";
import type {NodeTimePointMsec} from "../../../types/common.ts";
import type {WaitAction} from "../../../types/actions";

export class WaitSensorBinding extends SensorBinding{
    private firesAt!: NodeTimePointMsec;

    prepare(
        _sensor: WaitSensor,
        _boardView: BoardView
    ) {
        // Cache the time offset at which this sensor should fire
        this.firesAt = _sensor.until_msec;
    }

    onStart() {
        // Schedule a sensor "completion" event based on the configured delay

        window.setTimeout(() => {
            const waited: WaitAction = {
                action_type: 'WaitAction'
            }
            this.emit(waited);
        }, this.firesAt);
    }

}