import type {MonetaryAmountUsd} from "../common.ts";
import type {Card} from "../cards";

export interface Outcome {
    cards: Card[],
    bonus_amount_usd: MonetaryAmountUsd,
}