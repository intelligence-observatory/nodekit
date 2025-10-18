import type {Asset, Image, Video} from "../types/assets";

export class AssetManager {

    private resolveAssetUrl(asset: Asset): string {
        // Throw an error if the Asset.locator is not a URL
        if (asset.locator.locator_type == "URL") {
            return asset.locator.url;
        }
        else if (asset.locator.locator_type == "RelativePath") {
            // Resolve relative to the current document location.
            let baseUrl = document.baseURI;
            const rawPath = asset.locator.relative_path.replace(/\\/g, "/"); // just in case
            const safePath = rawPath
                .split("/")
                .map(seg => encodeURIComponent(seg))
                .join("/");

            const fullUrl = new URL(safePath, baseUrl).toString();
            console.log('fullUrl', fullUrl)
            return fullUrl
        }

        throw new Error('Unsupported locator for the browser environment. Found:' + JSON.stringify(asset));
    }

    async getImageElement(image: Image): Promise<HTMLImageElement> {
        // Lookup:
        let imageUrl = this.resolveAssetUrl(image);

        // Ensure the image is loaded, and return it as an HTMLImageElement.
        let element = new Image();
        element.src = imageUrl;
        return new Promise(
            (resolve, reject) => {
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