import type {ColorHexString, MarkdownString, SpatialSize} from "../common.ts";
import type {Image, Video} from "../assets";
import type {Region} from "../region";

export interface BaseCard<T extends string> {
    card_type: T
}

export interface ImageCard extends BaseCard<'ImageCard'>{
    image: Image;
    region: Region

}

export interface VideoCard extends BaseCard<'VideoCard'>{
    video: Video;
    loop: boolean;
    start: boolean;
    region: Region

}

export interface TextCard extends BaseCard<'TextCard'>{
    text: MarkdownString
    font_size: SpatialSize; // The height of the em-box (in Board units)
    justification_horizontal: 'left' | 'center' | 'right';
    justification_vertical: 'top' | 'center' | 'bottom';
    text_color: ColorHexString;
    background_color: ColorHexString
    region: Region
}

export interface CompositeCard extends BaseCard<'CompositeCard'>{
    children: Record<string, Card>
}

export type Card = ImageCard | VideoCard | TextCard | CompositeCard;