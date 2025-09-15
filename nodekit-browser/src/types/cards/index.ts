import type {CardId, ColorHexString, MarkdownString, SpatialPoint, SpatialSize, TimePointMsec} from "../common.ts";
import type {ImageIdentifier, VideoIdentifier} from "../assets";


export interface BaseCard<T extends string> {
    card_id: CardId
    card_type: T

    x: SpatialPoint
    y: SpatialPoint

    w: SpatialSize
    h: SpatialSize

    t_start: TimePointMsec
    t_end: TimePointMsec | null; // null if the card is open-ended
}

//
export interface TextFormattingOptions {
    text_color: ColorHexString;
    font_size: SpatialSize; // The height of the em-box (in Board units)
    justification_horizontal: 'left' | 'center' | 'right';
    justification_vertical: 'top' | 'center' | 'bottom';
}

// FixationPointCard
export interface FixationPointCard extends BaseCard<'FixationPointCard'>{}

// PagesViewCard
export interface MarkdownPagesCard extends BaseCard<'MarkdownPagesCard'>, TextFormattingOptions{
    pages: MarkdownString[]
}

// ImageCard
export interface ImageCard extends BaseCard<'ImageCard'>{
    image_identifier: ImageIdentifier;
}

// VideoCard
export interface VideoCard extends BaseCard<'VideoCard'>{
    video_identifier: VideoIdentifier;
    muted: boolean;
}

// TextCard
export interface TextCard extends BaseCard<'TextCard'>, TextFormattingOptions{
    text: MarkdownString
    background_color: ColorHexString
}

// BlankCard
export interface BlankCard extends BaseCard<'BlankCard'>{
    color: ColorHexString
}

// Union type for all card types
export type Card = FixationPointCard | ImageCard | TextCard | MarkdownPagesCard | VideoCard | BlankCard;