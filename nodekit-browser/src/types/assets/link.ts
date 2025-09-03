interface BaseAssetLink<MT=string>{
    mime_type: MT;
    sha256: string;
    asset_url: string;
}


export interface ImageLink extends BaseAssetLink<"image/png"> {}
export interface VideoLink extends BaseAssetLink<"video/mp4"> {}
