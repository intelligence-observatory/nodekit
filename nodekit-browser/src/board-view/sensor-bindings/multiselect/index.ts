import type {MultiSelectSensor} from "../../../types/sensors.ts";
import {SensorBinding} from "../index.ts";
import type {MultiSelectAction} from "../../../types/actions.ts";
import type {PointerSample} from "../../../input-streams/pointer-stream.ts";
import {createCardView} from "../../card-views/create.ts";
import type {CardView} from "../../card-views/card-view.ts";

/**
 *
 */
export class MultiSelectSensorBinding extends SensorBinding<MultiSelectSensor> {
    private choiceCardViews: CardView[] = [];
    private confirmCardView: CardView | null = null;
    private choiceIds: string[] = [];
    private cardViewMap: Record<string, CardView> = {};

    async prepare() {
        const minSelections = this.params.sensor.min_selections;
        const maxSelections = this.params.sensor.max_selections ?? Object.keys(this.params.sensor.choices).length;

        const currentSelections: Set<string> = new Set();

        // Place choice cards
        for (const [choiceId, choiceCard] of Object.entries(this.params.sensor.choices)){
            const cardView= await createCardView(
                choiceCard,
                this.params.boardView,
                this.params.assetManager,
            )
            cardView.setHoverable(true);
            this.cardViewMap[choiceId] = cardView;

            this.choiceIds.push(choiceId)
            this.choiceCardViews.push(this.cardViewMap[choiceId]);
        }
        this.choiceIds.sort()

        // Place confirm card
        const confirmCardView = await createCardView(
            this.params.sensor.confirm_button,
            this.params.boardView,
            this.params.assetManager,
        )
        this.confirmCardView = confirmCardView;
        const affirmedOpacity = 0.5;
        confirmCardView.setOpacity(0.1)
        let canConfirm = false;
        let confirmed = false;

        const refreshChoiceViews = () => {
            const atMax = currentSelections.size >= maxSelections;
            for (const choiceId of this.choiceIds) {
                const cardView = this.cardViewMap[choiceId];
                const isSelected = currentSelections.has(choiceId);
                cardView.setSelectedState(isSelected);

                if (atMax && !isSelected) {
                    cardView.setOpacity(0.25);
                    cardView.setHoverable(false);
                } else {
                    cardView.setOpacity(1);
                    cardView.setHoverable(true);
                }
            }
        };

        const emitSelection = () => {
            const sensorValue: MultiSelectAction = {
                action_type: "MultiSelectAction",
                action_value: Array.from(currentSelections),
            };
            this.emit(sensorValue);
        };

        const applyConfirmedDim = () => {
            for (const cardId of this.choiceIds) {
                const cardView = this.cardViewMap[cardId];
                cardView.setOpacity(affirmedOpacity);
                cardView.setHoverable(false);
            }
            this.confirmCardView?.setOpacity(affirmedOpacity);
        };

        const pointerCallback = (pointerSample: PointerSample) => {
            if (confirmed){
                return
            }

            // Return early if not pointer down
            if (pointerSample.sampleType !== 'down'){
                return
            }

            const atMax = currentSelections.size >= maxSelections;
            let changed = false;

            for (const cardId of this.choiceIds) {
                const cardView = this.cardViewMap[cardId];

                const inside = cardView.checkPointInCard(
                    pointerSample.x,
                    pointerSample.y,
                );

                if (!inside) {
                    continue;
                }


                const isSelected = currentSelections.has(cardId);

                // Hover logic: when at max, unselected cards are visually "disabled"
                if (atMax && !isSelected) {
                    cardView.setHoverable(false);
                } else {
                    cardView.setHoverable(true);
                }

                if (pointerSample.sampleType === "down") {
                    if (isSelected) {
                        currentSelections.delete(cardId);
                        changed = true;
                    }
                    else {
                        if (currentSelections.size < maxSelections) {
                            currentSelections.add(cardId);
                            changed = true;
                        }
                    }
                }
            }

            if (changed) {
                refreshChoiceViews();
                canConfirm = currentSelections.size >= minSelections;
            }

            if (canConfirm) {
                confirmCardView.setOpacity(1);
                const inside = confirmCardView.checkPointInCard(
                    pointerSample.x,
                    pointerSample.y,
                );

                if (inside) {
                    if (pointerSample.sampleType === "down") {
                        emitSelection()
                        confirmed = true;
                        confirmCardView.setOpacity(affirmedOpacity)
                        applyConfirmedDim();
                    }
                }
            }
            else{
                confirmCardView.setOpacity(0.1)
            }
        };

        this.params.boardView.pointerStream.subscribe(pointerCallback);
    }

    protected onStart(){
        for (const cardView of this.choiceCardViews) {
            cardView.onStart();
        }
        this.confirmCardView?.onStart();
    }
}
