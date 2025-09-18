import './video-card.css'
import {CardView} from "../card-view.ts";
import type {VideoCard} from "../../../types/cards";
import type {AssetManager} from "../../../asset-manager/asset-manager.ts";


export class VideoCardView extends CardView<VideoCard> {

    videoContainer: HTMLDivElement | undefined;
    video: HTMLVideoElement | undefined;

    async prepare(assetManager: AssetManager) {
        this.videoContainer = document.createElement('div');
        this.videoContainer.classList.add('video-card');
        this.root.appendChild(this.videoContainer);

        this.video = await assetManager.getVideo(
            this.card.video
        );
        this.video.classList.add('video-card__content');
        this.videoContainer.appendChild(this.video);

        // Set audio:
        this.video.muted = this.card.muted;

        // Set looping:
        this.video.loop = this.card.loop;

        // Prevent dragging the video in the browser:
        this.video.draggable = true;

        // Play the video then
    }

    onStart() {
        if (!this.video) {
            throw new Error('Video not initialized. Did you forget to call load()?');
        }

        // Timeout after two frames:
        let timeout = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error("Video failed to play within 2 frames!"))
            }, 33);
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
        this.video.play()
        let startedSuccessfully = Promise.race([playing, timeout]);

        // Catch a playback error, but just keep going:
        startedSuccessfully.catch((e) => {
            console.error(e);
        })
    }

    onStop() {
        if (!this.video) {
            return
        }
        // If started again, the video will restart from the beginning:
        this.video.pause();
        this.video.currentTime = 0;
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
