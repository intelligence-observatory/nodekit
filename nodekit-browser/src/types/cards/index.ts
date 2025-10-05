import type {ColorHexString, MarkdownString, SpatialPoint, SpatialSize, NodeTimePointMsec} from "../common.ts";
import type {ImageIdentifier, VideoIdentifier} from "../assets";

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
    image: ImageIdentifier;
}

export interface VideoCard extends BaseCard<'VideoCard'>{
    video: VideoIdentifier;
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

export type Card = ImageCard | TextCard | VideoCard;