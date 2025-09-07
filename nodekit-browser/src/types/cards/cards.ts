import type {BaseCard} from "./base.ts";
import type {ColorHexString, NullParameters, TextContent} from "../common.ts";
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
}

export interface VideoCard extends BaseCard<'VideoCard', VideoCardParameters>{}

// Union type for all card types
export type Card = FixationPointCard | ImageCard | TextCard | MarkdownPagesCard | VideoCard;