import type {SelectSensor} from "../../../types/sensors";
import {SensorBinding} from "../index.ts";
import type {SelectAction} from "../../../types/actions";
import type {PointerSample} from "../../../input-streams/pointer-stream.ts";
import type {CardView} from "../../card-views/card-view.ts";
import {createCardView} from "../../card-views/create.ts";

/**
 *
 */
export class SelectSensorBinding extends SensorBinding<SelectSensor> {
    async prepare() {

        // Prepare choices views
        const cardViewMap: Record<string, CardView> = {};
        let choiceIds = [];

        for (const [choiceId, choiceCard] of Object.entries(this.params.sensor.choices)){
            cardViewMap[choiceId] = await createCardView(choiceCard, this.params.boardView, this.params.assetManager);
            choiceIds.push(choiceId);
        }
        choiceIds.sort()

        let currentSelection: string | null = null;

        const pointerCallback = (pointerSample: PointerSample) => {
            // Track which card should end up selected after this event
            let nextSelection: string | null = null;
            let selectionMade= false;

            for (const choiceId of choiceIds) {
                const cardView = cardViewMap[choiceId];

                const inside = cardView.checkPointInCard(
                    pointerSample.x,
                    pointerSample.y,
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
                    nextSelection = choiceId;

                    currentSelection = choiceId;
                    selectionMade = true;


                    // Emit selection
                    const sensorValue: SelectAction = {
                        action_type: 'SelectAction',
                        t: this.params.boardView.clock.now(),
                        selection: choiceId,
                    };
                    this.emit(sensorValue);
                }
                if (currentSelection !== choiceId){
                    cardView.setHoverState(true);
                }
            }

            // Deselect all others (and optionally clear selection if click on empty space)
            if (selectionMade) {
                for (const choiceId of choiceIds) {
                    if (choiceId === nextSelection) continue;
                    const cardView = cardViewMap[choiceId];
                    cardView.setSelectedState(false);
                }
            }
        };

        this.params.boardView.pointerStream.subscribe(pointerCallback);


    }
}