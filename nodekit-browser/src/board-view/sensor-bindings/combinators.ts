import {SensorBinding} from "./index.ts";
import type {ProductSensor, Sensor, SumSensor} from "../../types/sensors";
import type {BoardView} from "../board-view.ts";
import type {Action, ProductAction, SumAction} from "../../types/actions";
import type {Clock} from "../../clock.ts";
import {createSensorBinding} from "./create-sensor-binding.ts";


export class ProductSensorBinding extends SensorBinding<ProductSensor>{
    private childActions: Record<string, Action | null> = {}

    async prepare() {
        for (const [childId, childSensor] of Object.entries(this.params.sensor.children)){
            this.childActions[childId] = null;

            let sensorBinding = await createSensorBinding(
                childSensor,
                this.params.boardView,
                this.params.assetManager,
            )
            sensorBinding.subscribe(
                (action:Action) => {
                    this.childActions[childId] = action;
                    let finalAction = this.checkValid();
                    if (finalAction !==null){
                        this.emit(finalAction)
                    }
                }
            )
        }
    }

    checkValid(): ProductAction | null {
        let childActionsFinal: Record<string, Action> = {}
        for (const sensorId of Object.keys(this.childActions)){
            const sid = sensorId;
            if (this.childActions[sid] === null){
                return null
            }
            else{
                childActionsFinal[sid] = this.childActions[sid]
            }
        }
        return {
            action_type: 'ProductAction',
            child_actions: childActionsFinal,
            t: this.params.boardView.clock.now()
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