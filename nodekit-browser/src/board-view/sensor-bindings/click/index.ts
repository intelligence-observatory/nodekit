import type {ClickSensor} from "../../../types/sensors";
import type {PointerSample} from "../../../input-streams/pointer-stream.ts";
import type {ClickAction} from "../../../types/actions.ts";
import {SensorBinding} from "../index.ts";
import {checkPointInRegion} from "../../../utils.ts";

/**
 *
 */
export class ClickSensorBinding extends SensorBinding<ClickSensor> {
    async prepare() {

        const region = this.params.sensor.region;

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
                    action_type: "ClickAction",
                    x: pointerSample.x,
                    y: pointerSample.y,
                };

                this.emit(action)
                return
            }
        }
        this.params.boardView.pointerStream.subscribe(clickCallback);
    }
}