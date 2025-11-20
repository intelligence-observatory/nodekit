import type {SelectSensor} from "../../../types/sensors";
import type {BoardView} from "../../board-view.ts";
import {SensorBinding} from "../index.ts";
import type {SelectSensorValue} from "../../../types/actions";
import type {CardViewMap} from "../../../node-play";
import type {CardId} from "../../../types/common.ts";

/**
 *
 */
export class SelectSensorBinding extends SensorBinding<SelectSensor> {
    prepare(
        boardView: BoardView,
        cardViewMap: CardViewMap,
    ) {

        const cardIds = this.sensor.choices;

        for (const cardId of cardIds){
            let cardView= cardViewMap[cardId as CardId]
            cardView.setSelectability(true);
            cardView.setHoverability(true);

            cardView.subscribeSelections(
                (selected:boolean) =>{
                    if (!selected) return
                    const sensorValue: SelectSensorValue = {
                        sensor_value_type: 'SelectSensorValue',
                        selection: cardId,
                        t: boardView.clock.now()
                    }
                    this.emit(sensorValue)
                }
            )
        }

    }
}