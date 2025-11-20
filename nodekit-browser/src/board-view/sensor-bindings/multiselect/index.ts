import type {MultiSelectSensor} from "../../../types/sensors";
import {type BoardView} from "../../board-view.ts";
import {SensorBinding} from "../index.ts";
import type {MultiSelectSensorValue} from "../../../types/actions";
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
        const cardIds = this.sensor.choices;
        const minSelections = this.sensor.min_selections ?? 0;
        const maxSelections = this.sensor.max_selections ?? cardIds.length;

        const currentSelections: Set<CardId> = new Set();

        const updateCardViews = () => {
            const atMax = currentSelections.size >= maxSelections;

            for (const cardId of cardIds) {
                const cardView = cardViewMap[cardId as CardId];
                const isSelected = currentSelections.has(cardId);

                cardView.setSelectedState(isSelected);

                if (atMax && !isSelected) {
                    cardView.setOpacity(0.5);
                } else {
                    cardView.setOpacity(1);
                }
            }
        };

        const emitMultiSelectValue = () => {
            const sensorValue: MultiSelectSensorValue = {
                sensor_value_type: "MultiSelectSensorValue",
                t: boardView.clock.now(),
                selections: Array.from(currentSelections),
            };
            this.emit(sensorValue);
        };

        const pointerCallback = (pointerSample: PointerSample) => {
            const atMax = currentSelections.size >= maxSelections;
            let changed = false;

            for (const cardId of cardIds) {
                const cardView = cardViewMap[cardId as CardId];

                const inside = checkPointInRegion(
                    pointerSample.x,
                    pointerSample.y,
                    cardView.card.region,
                );

                if (!inside) {
                    // Not under pointer: no hover
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
                        // Deselect, respecting minSelections
                        if (currentSelections.size > minSelections) {
                            currentSelections.delete(cardId);
                            changed = true;
                        }
                    } else {
                        // Select, respecting maxSelections
                        if (currentSelections.size < maxSelections) {
                            currentSelections.add(cardId);
                            changed = true;
                        }
                        // If already at max, click on disabled card does nothing
                    }
                }
            }

            if (changed) {
                updateCardViews();
                emitMultiSelectValue();
            }
        };

        boardView.pointerStream.subscribe(pointerCallback);
    }
}