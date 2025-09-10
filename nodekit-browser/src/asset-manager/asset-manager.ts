import type {ImageLink, VideoLink} from "../types/assets/link.ts";


/** * AssetManager provides methods to retrieve asset URLs, cache assets, and preload assets.
 */
export class AssetManager {
    async loadImageAsset(imageLink: ImageLink): Promise<HTMLImageElement> {
        // Preload the image asset and return the HTMLImageElement.
        let element = new Image();
        element.src = imageLink.asset_url;
        return new Promise((resolve, reject) => {
            element.onload = () => resolve(element);
            element.onerror = (error) => reject(error);
        }
        )
    }

    async loadVideoAsset(videoLink: VideoLink): Promise<HTMLVideoElement> {
        // Preload the video asset and return the HTMLVideoElement.
        let element = document.createElement("video");
        // Subscribe to events prior to assign the source URL to prevent events from triggering prior to assignment:
        let promise: Promise<HTMLVideoElement> = new Promise((resolve, reject) => {
            element.oncanplaythrough = () => {
                resolve(element)
            };
            element.onerror = (error) => reject(error);
        });
        // ...And now, assign the source URL:
        element.src = videoLink.asset_url;
        // Reset the element to its initial state.
        element.load();
        return promise;
    }
}