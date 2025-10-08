import type {SHA256} from "../common.ts";


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

type Locator = FileSystemPath | ZipArchiveInnerPath | RelativePath;

// Asset
export interface BaseAsset<MT extends string> {
    sha256: SHA256
    media_type: MT
    locator: Locator
}

export interface Image extends BaseAsset<"image/png" | "image/svg+xml"> {}
export interface Video extends BaseAsset<"video/mp4"> {}
export type AssetIdentifier = Image | Video;

// Asset url:
export interface AssetUrl {
    identifier: AssetIdentifier
    url: string
}
