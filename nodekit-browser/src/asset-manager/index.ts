import type {Asset, Image, Video} from "../types/assets";

export class AssetManager {

    private resolveAssetUrl(asset: Asset): string {
        // Throw an error if the Asset.locator is not a URL
        if (asset.locator.locator_type !== "URL") {
            throw new Error(`Only URL locators are supported in the browser environment. Found: ${asset.locator.locator_type}`);
        }
        return asset.locator.url;
    }

    async getImageElement(image: Image): Promise<HTMLImageElement> {
        // Lookup:
        let imageUrl = this.resolveAssetUrl(image);

        // Ensure the image is loaded, and return it as an HTMLImageElement.
        let element = new Image();
        element.src = imageUrl;
        return new Promise((resolve, reject) => {
                element.onload = () => resolve(element);
                element.onerror = (error) => reject(error);
            }
        )
    }

    async getVideoElement(video: Video): Promise<HTMLVideoElement> {
        let videoUrl = this.resolveAssetUrl(video)

        // Preload the video asset and return the HTMLVideoElement.
        let element = document.createElement("video");
        // Disable all video controls.
        element.controls = false;
        // Subscribe to events prior to assign the source URL to prevent events from triggering prior to assignment:
        let promise: Promise<HTMLVideoElement> = new Promise((resolve, reject) => {
            element.oncanplaythrough = () => {
                resolve(element)
            };
            element.onerror = (error) => reject(error);
        });
        // ...And now, assign the source URL:
        element.src = videoUrl;
        // Reset the element to its initial state.
        element.load();
        return promise;
    }
}