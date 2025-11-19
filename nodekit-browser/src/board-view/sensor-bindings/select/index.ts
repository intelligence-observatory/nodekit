import type {SelectSensor} from "../../../types/sensors";
import type {BoardView} from "../../board-view.ts";
import {SensorBinding} from "../index.ts";
import type {SelectSensorValue} from "../../../types/actions";

/**
 *
 */
export class SelectSensorBinding extends SensorBinding<SelectSensor> {
    prepare(
        boardView: BoardView
    ) {
        const cardIds = this.sensor.choices;

        const sensorValue: SelectSensorValue = {
            sensor_value_type: 'SelectSensorValue',
            selection: cardIds[0],
            t: boardView.clock.now()
        }
        this.emit(sensorValue)
    }
}