import type {Asset, Image, Video} from "../types/assets";

export class AssetManager {

    private resolveAssetUrl(asset: Asset): string {
        if (asset.locator.locator_type == "URL") {
            return asset.locator.url;
        }
        else if (asset.locator.locator_type == "RelativePath") {
            // Resolve relative to the current document location.
            let baseUrl = document.baseURI;

            const rawPath = asset.locator.relative_path.replace(/\\/g, "/"); // just in case
            // S3/CDN often require '+' to be percent-encoded; local dev generally does not.
            const shouldEncodeSegments = baseUrl.includes("amazonaws.com");
            const safePath = shouldEncodeSegments
                ? rawPath
                    .split("/")
                    .map(seg => encodeURIComponent(seg))
                    .join("/")
                : rawPath;

            return new URL(safePath, baseUrl).toString();
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
                element.onerror = (error) => reject(new Error(`Failed to load image ${imageUrl}: ${error}`));
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
