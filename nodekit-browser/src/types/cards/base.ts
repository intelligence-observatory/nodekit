import type {BoardLocation, BoardRectangle, CardId, Timespan} from "../fields.ts";

export interface BaseCard<T extends string, P> {
    card_id: CardId
    card_type: T
    card_parameters: P
    card_shape: BoardRectangle
    card_location: BoardLocation
    card_timespan: Timespan
}