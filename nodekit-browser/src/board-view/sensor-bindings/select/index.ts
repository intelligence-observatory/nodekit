import type {SelectSensor} from "../../../types/sensors";
import {type BoardView} from "../../board-view.ts";
import {SensorBinding} from "../index.ts";
import type {SelectAction} from "../../../types/actions";
import type {CardViewMap} from "../../../node-play";
import type {CardId} from "../../../types/common.ts";
import type {PointerSample} from "../../../input-streams/pointer-stream.ts";
import {checkPointInRegion} from "../../../utils.ts";

/**
 *
 */
export class SelectSensorBinding extends SensorBinding<SelectSensor> {
    prepare(
        boardView: BoardView,
        cardViewMap: CardViewMap,
    ) {

        const cardIds = this.sensor.choices;

        let currentSelection: CardId | null = null;

        const pointerCallback = (pointerSample: PointerSample) => {
            // Track which card should end up selected after this event
            let nextSelection: CardId | null = null;
            let selectionMade= false;

            for (const cardId of cardIds) {
                const cardView = cardViewMap[cardId as CardId];

                const inside = checkPointInRegion(
                    pointerSample.x,
                    pointerSample.y,
                    cardView.card.region,
                );

                if (!inside) {
                    cardView.setHoverState(false);
                    continue;
                }

                // Pointer is inside this card
                if (pointerSample.sampleType === 'down') {
                    // Select this card
                    cardView.setSelectedState(true);
                    cardView.setHoverState(false);
                    nextSelection = cardId;

                    currentSelection = cardId;
                    selectionMade = true;


                    // Emit selection
                    const sensorValue: SelectAction = {
                        sensor_value_type: 'SelectAction',
                        t: boardView.clock.now(),
                        selection: cardId,
                    };
                    this.emit(sensorValue);
                }
                if (currentSelection !== cardId){
                    cardView.setHoverState(true);
                }
            }

            // Deselect all others (and optionally clear selection if click on empty space)
            if (selectionMade) {
                for (const cardId of cardIds) {
                    if (cardId === nextSelection) continue;
                    const cardView = cardViewMap[cardId as CardId];
                    cardView.setSelectedState(false);
                }
            }
        };

        boardView.pointerStream.subscribe(pointerCallback);


    }
}