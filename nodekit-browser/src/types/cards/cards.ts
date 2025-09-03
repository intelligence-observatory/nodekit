import type {BaseCard} from "./base.ts";
import type {NullParameters} from "../base.ts";
import type {ColorHexString, TextContent} from "../fields.ts";
import type {ImageLink, VideoLink} from "../assets/link.ts";

// FixationPointCard
export interface FixationPointCard extends BaseCard<'FixationPointCard', NullParameters>{}

// PagesViewCard
interface MarkdownPagesCardParameters {
    pages: TextContent[];
}
export interface MarkdownPagesCard extends BaseCard<'MarkdownPagesCard', MarkdownPagesCardParameters>{}


// ImageCard
interface ImageCardParameters {
    image_link: ImageLink;
}

export interface ImageCard extends BaseCard<'ImageCard', ImageCardParameters>{}

// TextCard
interface TextCardParameters {
    content: TextContent;
    background_color: ColorHexString
}
export interface TextCard extends BaseCard<'TextCard', TextCardParameters>{}

// VideoCard
interface VideoCardParameters {
    video_link: VideoLink;
    play_audio: boolean;
}

export interface VideoCard extends BaseCard<'VideoCard', VideoCardParameters>{}

// Union type for all card types
export type Card = FixationPointCard | ImageCard | TextCard | MarkdownPagesCard | VideoCard;