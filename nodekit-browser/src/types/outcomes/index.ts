import type {MonetaryAmountUsd} from "../common.ts";
import type {Card} from "../cards";
import type {SensorId} from "../common.ts";

export interface Outcome {
    sensor_id: SensorId,
    cards: Card[],
    bonus_amount_usd: MonetaryAmountUsd,
}