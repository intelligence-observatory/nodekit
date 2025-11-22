import type {MultiSelectSensor} from "../../../types/sensors";
import {type BoardView} from "../../board-view.ts";
import {SensorBinding} from "../index.ts";
import type {MultiSelectAction} from "../../../types/actions";
import type {CardViewMap} from "../../../node-play";
import type {CardId} from "../../../types/common.ts";
import type {PointerSample} from "../../../input-streams/pointer-stream.ts";
import {checkPointInRegion} from "../../../utils.ts";

/**
 *
 */
export class MultiSelectSensorBinding extends SensorBinding<MultiSelectSensor> {
    prepare(
        boardView: BoardView,
        cardViewMap: CardViewMap,
    ) {
        const choiceCardIds = this.sensor.choices;
        const confirmCardId = this.sensor.confirm_button;
        const minSelections = this.sensor.min_selections ?? 0;
        const maxSelections = this.sensor.max_selections ?? choiceCardIds.length;

        const currentSelections: Set<CardId> = new Set();

        const confirmCard = cardViewMap[confirmCardId]
        confirmCard.setOpacity(0.1)
        let canConfirm = false;

        const updateCardViews = () => {
            const atMax = currentSelections.size >= maxSelections;

            for (const cardId of choiceCardIds) {
                const cardView = cardViewMap[cardId as CardId];
                const isSelected = currentSelections.has(cardId);

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
                t: boardView.clock.now(),
                selections: Array.from(currentSelections),
            };
            this.emit(sensorValue);
        };

        const pointerCallback = (pointerSample: PointerSample) => {
            const atMax = currentSelections.size >= maxSelections;
            let changed = false;

            for (const cardId of choiceCardIds) {
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
                confirmCard.setOpacity(1);
                const inside = checkPointInRegion(
                    pointerSample.x,
                    pointerSample.y,
                    confirmCard.card.region,
                );

                if (inside) {
                    confirmCard.setHoverState(true);
                } else {
                    confirmCard.setHoverState(false);
                }
                if (pointerSample.sampleType === "down") {
                    emitMultiSelectValue()
                }
            }
            else{
                confirmCard.setOpacity(0.1)
            }
        };

        boardView.pointerStream.subscribe(pointerCallback);
    }
}