import type {Card} from "../../cards/cards.ts";

export interface Reinforcer {
    // Configures stimulus delivery in Reinforcement phase:
    reinforcer_cards: Card[],
}