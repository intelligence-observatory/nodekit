import type {ColorHexString, MarkdownString, NodeTimePointMsec, PlainString, SpatialPoint, SpatialSize} from "../common.ts";
import type {Image, Video} from "../assets";

export interface BaseCard<T extends string> {
    card_type: T

    x: SpatialPoint
    y: SpatialPoint
    z_index: number | null;

    w: SpatialSize
    h: SpatialSize

    start_msec: NodeTimePointMsec
    end_msec: NodeTimePointMsec | null;
}

export interface SelectableMixin {
    selectable: boolean; // If true, adds hover and selection effects to the Card
}

export interface ImageCard extends BaseCard<'ImageCard'>{
    image: Image;
}

export interface VideoCard extends BaseCard<'VideoCard'>{
    video: Video;
    muted: boolean;
    loop: boolean;
    start: boolean;
}

export interface SliderCard extends BaseCard<'SliderCard'>{
    num_bins: number;
    show_bin_markers: boolean;
    initial_bin_index: number;
    orientation: 'horizontal' | 'vertical';
}

export interface TextCard extends BaseCard<'TextCard'>, SelectableMixin{
    text: MarkdownString
    font_size: SpatialSize; // The height of the em-box (in Board units)
    justification_horizontal: 'left' | 'center' | 'right';
    justification_vertical: 'top' | 'center' | 'bottom';
    text_color: ColorHexString;
    background_color: ColorHexString
}

export interface FreeTextEntryCard extends BaseCard<'FreeTextEntryCard'>{
    prompt: PlainString;
    font_size: SpatialSize;
    text_color: ColorHexString;
    background_color: ColorHexString;
    max_length: number | null; // Maximum number of characters allowed
}

export type Card = ImageCard | VideoCard | TextCard | FreeTextEntryCard | SliderCard;