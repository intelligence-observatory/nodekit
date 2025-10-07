import type {SHA256} from "../common.ts";



// Asset identifiers:
export interface BaseAssetIdentifier<MT extends string> {
    sha256: SHA256
    media_type: MT
}

export interface ImageIdentifier extends BaseAssetIdentifier<"image/png"> {}
export interface VideoIdentifier extends BaseAssetIdentifier<"video/mp4"> {}
export type AssetIdentifier = ImageIdentifier | VideoIdentifier;

// Asset url:
export interface AssetUrl {
    identifier: AssetIdentifier
    url: string
}
