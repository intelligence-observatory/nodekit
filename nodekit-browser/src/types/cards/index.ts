import type {ColorHexString, MarkdownString, PlainString, SpatialPoint, SpatialSize, NodeTimePointMsec} from "../common.ts";
import type {Image, Video} from "../assets";

export interface BaseCard<T extends string> {
    card_type: T

    x: SpatialPoint
    y: SpatialPoint

    w: SpatialSize
    h: SpatialSize

    start_msec: NodeTimePointMsec
    end_msec: NodeTimePointMsec | null;
}

export interface ImageCard extends BaseCard<'ImageCard'>{
    image: Image;
}

export interface VideoCard extends BaseCard<'VideoCard'>{
    video: Video;
    muted: boolean;
    loop: boolean;
}

export interface TextCard extends BaseCard<'TextCard'>{
    text: MarkdownString
    font_size: SpatialSize; // The height of the em-box (in Board units)
    justification_horizontal: 'left' | 'center' | 'right';
    justification_vertical: 'top' | 'center' | 'bottom';
    text_color: ColorHexString;
    background_color: ColorHexString
}

export interface SliderCard extends BaseCard<'SliderCard'>{
    num_bins: number;
    orientation: 'horizontal' | 'vertical';
    track_color: ColorHexString;
    thumb_color: ColorHexString;
}

export interface FreeTextEntryCard extends BaseCard<'FreeTextEntryCard'>{
    prompt: PlainString;
    font_size: SpatialSize;
    text_color: ColorHexString;
    background_color: ColorHexString;
    max_length: number | null; // Maximum number of characters allowed
}

export type Card = ImageCard | VideoCard | TextCard | SliderCard | FreeTextEntryCard;