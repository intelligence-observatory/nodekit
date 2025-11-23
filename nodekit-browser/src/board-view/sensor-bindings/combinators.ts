import {SensorBinding} from "./index.ts";
import type {ProductSensor, Sensor, SumSensor} from "../../types/sensors";
import type {BoardView} from "../board-view.ts";
import type {CardViewMap} from "../../node-play";
import type {SensorId} from "../../types/common.ts";
import type {Action, ProductAction, SumAction} from "../../types/actions";
import type {Clock} from "../../clock.ts";


export class ProductSensorBinding extends SensorBinding<ProductSensor>{
    private childBindings: Record<SensorId, SensorBinding<Sensor>>;
    private currentSensorStates: Record<SensorId, Action | null> = {}
    private clock!: Clock
    constructor(
        sensor: ProductSensor,
        childBindings: Record<SensorId, SensorBinding<Sensor>>
    ) {
        this.childBindings=childBindings;
        for (const [sensorId, sensorBinding] of Object.entries(this.childBindings)){
            this.currentSensorStates[sensorId as SensorId] = null;
            sensorBinding.subscribe(
                (action:Action) => {
                    this.currentSensorStates[sensorId as SensorId] = action;
                    let finalAction = this.checkValid();
                    if (finalAction !==null){
                        this.emit(finalAction)
                    }
                }
            )
        }
    }

    prepare(
        boardView: BoardView,
        _cardViewMap: CardViewMap
    ) {
        this.clock = boardView.clock;
    }

    checkValid(): ProductAction | null {
        let finalSensorStates: Record<SensorId, Action> = {}
        for (const sensorId of Object.keys(this.childBindings)){
            const sid = sensorId as SensorId;
            if (this.currentSensorStates[sid] === null){
                return null
            }
            else{
                finalSensorStates[sid] = this.currentSensorStates[sid]
            }
        }
        return {
            action_type: 'ProductAction',
            child_actions: finalSensorStates,
            t: this.clock.now()
        }
    }
}


export class SumSensorBinding extends SensorBinding<SumSensor>{
    private childBindings: Record<SensorId, SensorBinding<Sensor>>;
    private currentSensorStates: Record<SensorId, Action | null> = {}
    private clock!: Clock
    constructor(
        sensor: SumSensor,
        childBindings: Record<SensorId, SensorBinding<Sensor>>
    ) {
        super(sensor);
        this.childBindings=childBindings;
        for (const [sensorId, sensorBinding] of Object.entries(this.childBindings)){
            this.currentSensorStates[sensorId as SensorId] = null;
            sensorBinding.subscribe(
                (action:Action) => {
                    // First one wins
                    const sumAction: SumAction = {
                        action_type: 'SumAction',
                        t: this.clock.now(),
                        winner_id: sensorId as SensorId,
                        winner_action: action,
                    }
                    this.emit(sumAction)

                }
            )
        }
    }

    prepare(
        boardView: BoardView,
        _cardViewMap: CardViewMap
    ) {
        this.clock = boardView.clock;
    }

}