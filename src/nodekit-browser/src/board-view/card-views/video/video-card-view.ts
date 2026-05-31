import './video-card.css'
import {LeafCardView} from "../card-view.ts";
import type {VideoCard} from "../../../types/cards";
import type {AssetManager} from "../../../asset-manager";


export class VideoCardView extends LeafCardView<VideoCard> {

    videoContainer: HTMLDivElement | undefined;
    video: HTMLVideoElement | undefined;

    async prepare(assetManager: AssetManager) {
        this.videoContainer = document.createElement('div');
        this.videoContainer.classList.add('video-card');
        this.root.appendChild(this.videoContainer);

        this.video = await assetManager.getVideoElement(
            this.card.video
        );
        this.video.classList.add('video-card__content');
        this.videoContainer.appendChild(this.video);

        // Set audio:
        this.video.muted = true;

        // Set looping:
        this.video.loop = this.card.loop;

        // Prevent dragging the video in the browser:
        this.video.draggable = true;

    }

    onStart() {
        if (!this.video) {
            throw new Error('Video not initialized. Did you forget to call load()?');
        }

        // Timeout after two frames:
        let timeout = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error("Video failed to play within 4 frames!"))
            }, 66);
        });
        // Check if the video is playing:
        let playing = new Promise((resolve, _) => {
            if (!this.video) {
                throw new Error('Video not initialized. Did you forget to call load()?');
            }
           this.video.onplaying = () => {
               resolve(null)
           }
        });
        // Start playing the video now. Throw an error if it doesn't start within two frames:
        // todo: remove this hack and expose start/stop/scrub public methods on VideoCard
        this.video.play()
        let startedSuccessfully = Promise.race([playing, timeout]);

        // Catch a playback error, but just keep going:
        startedSuccessfully.catch((e) => {
            console.error(e);
        })
    }

    onDestroy() {
        if (!this.video) {
            return
        }
        // Destroy the video element; see https://stackoverflow.com/a/28060352
        this.video.removeAttribute('src');
        this.video.load();
    }
}
