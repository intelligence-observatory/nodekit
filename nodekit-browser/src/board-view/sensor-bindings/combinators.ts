import {SensorBinding} from "./index.ts";
import type {ProductSensor, Sensor, SumSensor} from "../../types/sensors.ts";
import type {Action, ProductAction, SumAction} from "../../types/actions.ts";
import {createSensorBinding} from "./create-sensor-binding.ts";


export class ProductSensorBinding extends SensorBinding<ProductSensor>{

    private childBindings: Record<string, SensorBinding<Sensor>> = {}

    async prepare() {
        let childActions: Record<string, Action | null> = {}
        for (const [childId, childSensor] of Object.entries(this.params.sensor.children)){
            childActions[childId] = null;

            this.childBindings[childId] = await createSensorBinding(
                childSensor,
                this.params.boardView,
                this.params.assetManager,
            )
            this.childBindings[childId].subscribe(
                (action:Action) => {
                    childActions[childId] = action;
                    let finalAction = this.checkValid(childActions);
                    if (finalAction !==null){
                        this.emit(finalAction)
                    }
                }
            )
        }
    }

    private checkValid(childActions: Record<string, Action | null>): ProductAction | null {
        let childActionsFinal: Record<string, Action> = {}
        for (const sensorId of Object.keys(childActions)){
            const sid = sensorId;
            if (childActions[sid] === null){
                return null
            }
            else{
                childActionsFinal[sid] = childActions[sid]
            }
        }
        return {
            action_type: 'ProductAction',
            action_value: childActionsFinal,
        }
    }

    protected onStart(){
        // Start all children
        for (const [_, childSensorBinding] of Object.entries(this.childBindings)){
            childSensorBinding.start();
        }
    }
}


export class SumSensorBinding extends SensorBinding<SumSensor>{

    private childBindings: Record<string, SensorBinding<Sensor>> = {}

    async prepare() {
        let childActions: Record<string, Action | null> = {}
        let emitted = false;
        for (const [childId, childSensor] of Object.entries(this.params.sensor.children)){
            childActions[childId] = null;
            this.childBindings[childId] = await createSensorBinding(
                childSensor,
                this.params.boardView,
                this.params.assetManager,
            )
            this.childBindings[childId].subscribe(
                (action:Action) => {
                    // Emit immediately
                    const sumAction: SumAction = {
                        action_type: 'SumAction',
                        action_value: [childId, action]
                    }
                    if (!emitted){
                        emitted = true;
                        this.emit(sumAction)
                    }
                }
            )
        }
    }

    protected onStart(){
        // Start all children
        for (const [_, childSensorBinding] of Object.entries(this.childBindings)){
            childSensorBinding.start();
        }
    }
}
