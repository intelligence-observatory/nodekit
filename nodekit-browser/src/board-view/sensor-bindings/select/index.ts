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
    private choiceCardViews: CardView[] = [];

    async prepare() {

        // Prepare choices views
        const cardViewMap: Record<string, CardView> = {};
        let choiceIds = [];

        for (const [choiceId, choiceCard] of Object.entries(this.params.sensor.choices)){
            const cardView = await createCardView(choiceCard, this.params.boardView, this.params.assetManager);
            cardView.setHoverable(true);
            cardViewMap[choiceId] = cardView;
            choiceIds.push(choiceId);
            this.choiceCardViews.push(cardViewMap[choiceId]);
        }
        choiceIds.sort()

        let currentSelection: string | null = null;

        const pointerCallback = (pointerSample: PointerSample) => {
            if (pointerSample.sampleType !== 'down') {
                return;
            }

            // Track which card should end up selected after this event
            let nextSelection: string | null = null;
            let selectionMade = false;

            for (const choiceId of choiceIds) {
                const cardView = cardViewMap[choiceId];

                const inside = cardView.checkPointInCard(
                    pointerSample.x,
                    pointerSample.y,
                );

                if (!inside) {
                    continue;
                }

                // Pointer is inside this card on a down event
                if (currentSelection === choiceId) {
                    // Already selected; no-op
                    selectionMade = false;
                    break;
                }

                cardView.setSelectedState(true);
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
                break;
            }

            // Deselect all others when a new selection is made
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

    start() {
        for (const cardView of this.choiceCardViews) {
            cardView.onStart();
        }
    }
}
