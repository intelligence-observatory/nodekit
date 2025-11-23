import type {MultiSelectSensor} from "../../../types/sensors";
import {SensorBinding} from "../index.ts";
import type {MultiSelectAction} from "../../../types/actions";
import type {PointerSample} from "../../../input-streams/pointer-stream.ts";
import {checkPointInRegion} from "../../../utils.ts";
import {createCardView} from "../../card-views/create.ts";
import type {CardView} from "../../card-views/card-view.ts";

/**
 *
 */
export class MultiSelectSensorBinding extends SensorBinding<MultiSelectSensor> {
    async prepare() {
        const choiceCardIds = this.params.sensor.choices;
        const minSelections = this.params.sensor.min_selections ?? 0;
        const maxSelections = this.params.sensor.max_selections ?? choiceCardIds.length;

        const currentSelections: Set<string> = new Set();

        // Place choice cards
        const cardViewMap: Record<string, CardView> = {};
        let choiceIds = [];
        for (const [choiceId, choiceCard] of Object.entries(this.params.sensor.choices)){
            cardViewMap[choiceId] = await createCardView(
                choiceCard,
                this.params.boardView,
                this.params.assetManager,
            )
            choiceIds.push(choiceId)
        }
        choiceIds.sort()

        // Place confirm card
        const confirmCardView = await createCardView(
            this.params.sensor.confirm_button,
            this.params.boardView,
            this.params.assetManager,
        )
        confirmCardView.setOpacity(0.1)
        let canConfirm = false;
        let confirmed = false;

        const updateCardViews = () => {
            const atMax = currentSelections.size >= maxSelections;

            for (const choiceId of choiceIds) {
                const cardView = cardViewMap[choiceId];
                const isSelected = currentSelections.has(choiceId);

                cardView.setSelectedState(isSelected);

                if (atMax && !isSelected) {
                    cardView.setOpacity(0.25);
                } else {
                    cardView.setOpacity(1);
                }
            }
        };

        const emitMultiSelectValue = () => {
            const sensorValue: MultiSelectAction = {
                action_type: "MultiSelectAction",
                t: this.params.boardView.clock.now(),
                selections: Array.from(currentSelections),
            };
            this.emit(sensorValue);
        };

        const pointerCallback = (pointerSample: PointerSample) => {
            if (confirmed){
                return
            }
            const atMax = currentSelections.size >= maxSelections;
            let changed = false;

            for (const cardId of choiceIds) {
                const cardView = cardViewMap[cardId];

                const inside = checkPointInRegion(
                    pointerSample.x,
                    pointerSample.y,
                    cardView.card.region,
                );

                if (!inside) {
                    cardView.setHoverState(false);
                    continue;
                }

                const isSelected = currentSelections.has(cardId);

                // Hover logic: when at max, unselected cards are visually "disabled"
                if (atMax && !isSelected) {
                    cardView.setHoverState(false);
                } else {
                    cardView.setHoverState(true);
                }

                if (pointerSample.sampleType === "down") {
                    if (isSelected) {
                        currentSelections.delete(cardId);
                        changed = true;
                    } else {
                        if (currentSelections.size < maxSelections) {
                            currentSelections.add(cardId);
                            changed = true;
                        }
                    }
                }
            }

            if (changed) {
                updateCardViews();
                if (currentSelections.size >= minSelections){
                    canConfirm = true;
                }
                else{
                    canConfirm = false;
                }
            }

            if (canConfirm) {
                confirmCardView.setOpacity(1);
                const inside = checkPointInRegion(
                    pointerSample.x,
                    pointerSample.y,
                    confirmCardView.card.region,
                );

                if (inside) {
                    confirmCardView.setHoverState(true);
                    if (pointerSample.sampleType === "down") {
                        emitMultiSelectValue()
                        confirmed = true;
                        confirmCardView.setOpacity(0.5)
                        confirmCardView.setSelectedState(true)
                    }
                } else {
                    confirmCardView.setHoverState(false);
                }

            }
            else{
                confirmCardView.setOpacity(0.1)
            }
        };

        this.params.boardView.pointerStream.subscribe(pointerCallback);
    }
}