import type {SHA256} from "../value.ts";


// Locator
interface BaseLocator<LT extends string>{
    locator_type: LT
}

export interface FileSystemPath extends BaseLocator<"FileSystemPath"> {
    path: string
}

export interface ZipArchiveInnerPath extends BaseLocator<"ZipArchiveInnerPath"> {
    zip_archive_path: string
    inner_path: string
}

export interface RelativePath extends BaseLocator<"RelativePath"> {
    relative_path: string
}

export interface URL extends BaseLocator<"URL"> {
    url: string
}

type Locator = FileSystemPath | ZipArchiveInnerPath | RelativePath | URL;

// Asset
export interface BaseAsset<MT extends string> {
    sha256: SHA256
    media_type: MT
    locator: Locator
}

export interface Image extends BaseAsset<"image/png" | "image/svg+xml" | "image/gif"> {}
export interface Video extends BaseAsset<"video/mp4"> {}
export type Asset = Image | Video;
