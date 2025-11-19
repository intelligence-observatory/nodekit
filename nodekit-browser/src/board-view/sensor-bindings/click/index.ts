import type {ClickSensor} from "../../../types/sensors";
import {type BoardView, checkPointInRegion} from "../../board-view.ts";
import type {PointerSample} from "../../../input-streams/pointer-stream.ts";
import type {ClickSensorValue} from "../../../types/actions";
import {SensorBinding} from "../index.ts";

/**
 *
 */
export class ClickSensorBinding extends SensorBinding<ClickSensor> {

    prepare(
        boardView: BoardView
    ) {

        const region = this.sensor.region;

        const clickCallback = (pointerSample: PointerSample) => {
            if (pointerSample.sampleType !== 'down') {
                return;
            }

            const inside = checkPointInRegion(
                pointerSample.x,
                pointerSample.y,
                region,
            );
            if (inside) {
                const action: ClickSensorValue = {
                    t: pointerSample.t,
                    sensor_value_type: "ClickSensorValue",
                    x: pointerSample.x,
                    y: pointerSample.y,
                };

                this.emit(action)
                return
            }
        }
        boardView.pointerStream.subscribe(clickCallback);
    }

}