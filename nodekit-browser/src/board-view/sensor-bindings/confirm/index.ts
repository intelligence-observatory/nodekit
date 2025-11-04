import {SensorBinding} from "../index.ts";
import type {ConfirmSensor} from "../../../types/sensors";
import {BoardCoordinateSystem, type BoardView} from "../../board-view.ts";
import {TextCardView} from "../../card-views/text/text-card-view.ts";
import type {TextCard} from "../../../types/cards";
import type {ColorHexString, MarkdownString, SpatialSize} from "../../../types/common.ts";
import type {ConfirmAction} from "../../../types/actions";

export class ConfirmSensorBinding extends SensorBinding<ConfirmSensor>{
    prepare(
        boardView: BoardView
    ) {
        const confirmView = new ConfirmSensorView(
            this.sensor,
            boardView.getCoordinateSystem(),
        )

        // Subscribe to click events
        confirmView.subscribeSelections(
            (selected:boolean) => {
                if(selected){
                    const confirm: ConfirmAction = {
                        action_type: 'ConfirmAction'
                    }
                    this.emit(confirm)
                }
            }
        )

        // Bind SensorView to Board
        boardView.root.appendChild(confirmView.root);
    }
}

class ConfirmSensorView extends TextCardView{

    constructor(
        sensor: ConfirmSensor,
        boardCoords: BoardCoordinateSystem,
    ){

        // Assemble the TextCard
        const card: TextCard = {
            card_type: 'TextCard',
            text: 'Submit' as MarkdownString,
            font_size: 0.02 as SpatialSize,
            justification_horizontal: 'center',
            justification_vertical: 'center',
            text_color: '#000000' as ColorHexString,
            background_color: '#c5c5c5' as ColorHexString,
            region: sensor.region,
        }

        super(
            card,
            boardCoords,
        )

        this.setHoverability(true);
        this.setSelectability(true);
        this.prepare();
    }

}