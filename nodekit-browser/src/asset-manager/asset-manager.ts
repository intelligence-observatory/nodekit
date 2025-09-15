import type {AssetIdentifier, AssetUrl, ImageIdentifier, VideoIdentifier} from "../types/assets";
import type {SHA256} from "../types/common.ts";

/** * The AssetManager provides methods to retrieve asset URLs, cache assets, and preload assets.
 */

type AssetKey = `${SHA256}|${string}`; // string is the mime type

export class AssetManager {
    private urlLookup: Record<AssetKey, AssetUrl> = {};

    private getKey(sha256: SHA256, mimeType: string): AssetKey {
        return `${sha256}|${mimeType}`;
    }

    registerAsset(assetUrl: AssetUrl): void {
        let sha256 = assetUrl.identifier.sha256;
        let mimeType = assetUrl.identifier.mime_type;
        // Create the lookup key.
        let key = this.getKey(sha256, mimeType);
        // Register the asset URL.
        this.urlLookup[key] = assetUrl;
    }

    private lookupAssetUrl(assetIdentifier: AssetIdentifier): AssetUrl {
        let key = this.getKey(assetIdentifier.sha256, assetIdentifier.mime_type);
        let url = this.urlLookup[key];
        if (!url) {
            throw new Error(`Asset not found: ${assetIdentifier.sha256} (${assetIdentifier.mime_type})`);
        }
        return url
    }

    async getImage(imageIdentifier: ImageIdentifier): Promise<HTMLImageElement> {
        // Lookup:
        let imageUrl = this.lookupAssetUrl(imageIdentifier);

        // Ensure the image is loaded, and return it as an HTMLImageElement.
        let element = new Image();
        element.src = imageUrl.url;
        return new Promise((resolve, reject) => {
                element.onload = () => resolve(element);
                element.onerror = (error) => reject(error);
            }
        )
    }

    async getVideo(videoIdentifier: VideoIdentifier): Promise<HTMLVideoElement> {
        let videoUrl = this.lookupAssetUrl(videoIdentifier);

        // Preload the video asset and return the HTMLVideoElement.
        let element = document.createElement("video");
        // Disable all video controls.
        element.controls = false;
        // Subscribe to events prior to assign the source URL to prevent events from triggering prior to assignment:
        let promise: Promise<HTMLVideoElement> = new Promise((resolve, reject) => {
            element.oncanplaythrough = () => {
                console.log('oncanplaythrough fired')
                resolve(element)
            };
            element.onerror = (error) => reject(error);
        });
        // ...And now, assign the source URL:
        element.src = videoUrl.url;
        // Reset the element to its initial state.
        element.load();
        return promise;
    }
}