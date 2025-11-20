import type {ClickSensor} from "../../../types/sensors";
import {type BoardView} from "../../board-view.ts";
import type {PointerSample} from "../../../input-streams/pointer-stream.ts";
import type {ClickAction} from "../../../types/actions";
import {SensorBinding} from "../index.ts";
import {checkPointInRegion} from "../../../utils.ts";

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
                const action: ClickAction = {
                    t: pointerSample.t,
                    action_type: "ClickAction",
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