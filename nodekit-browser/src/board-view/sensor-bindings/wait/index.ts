import {SensorBinding} from "../index.ts";
import type {WaitSensor} from "../../../types/sensors";
import type {BoardView} from "../../board-view.ts";

export class WaitSensorBinding extends SensorBinding<WaitSensor>{
    prepare(
        _boardView: BoardView
    ) {}
}