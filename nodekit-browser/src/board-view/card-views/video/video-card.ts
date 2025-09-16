import './video-card.css'
import {CardView, type ClickableCardView} from "../card-view.ts";
import type {VideoCard} from "../../../types/cards";
import type {AssetManager} from "../../../asset-manager/asset-manager.ts";


export class VideoCardView extends CardView<VideoCard> implements ClickableCardView {

    videoContainer: HTMLDivElement | undefined;
    video: HTMLVideoElement | undefined;

    async load(assetManager: AssetManager) {
        this.videoContainer = document.createElement('div');
        this.videoContainer.classList.add('video-card');
        this.root.appendChild(this.videoContainer);

        this.video = await assetManager.getVideo(
            this.card.video_identifier
        );
        this.video.classList.add('video-card__content');
        this.videoContainer.appendChild(this.video);

        // Set audio:
        this.video.muted = this.card.muted;

        // Set looping
        this.video.loop = this.card.loop;

        // Prevent dragging the video in the browser:
        this.video.draggable = true;
    }

    addClickCallback(callback: (e: MouseEvent) => void) {
        if (!this.videoContainer) {
            throw new Error('Video container not initialized. Did you forget to call load()?');
        }
        this.videoContainer.addEventListener('click', (e: MouseEvent) => {
            callback(e);
        });
    }


    unload() {
        // Remove the video.
        // Source: https://stackoverflow.com/a/28060352
        if (!this.video) {
            throw new Error('Video not initialized. Did you forget to call load()?');
        }
        this.video.removeAttribute('src');
        this.video.load();
    }

    async start() {
        if (!this.video) {
            throw new Error('Video not initialized. Did you forget to call load()?');
        }
        // Timeout after two frames.
        let timeout = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error("Video failed to play within 2 frames!"))
            }, 33);
        });
        // Check if the video is playing.
        let playing = new Promise((resolve, _) => {
            if (!this.video) {
                throw new Error('Video not initialized. Did you forget to call load()?');
            }
           this.video.onplaying = () => {
               resolve(null)
           }
        });
        // Start playing the video now.
        await this.video.play()
        await Promise.race([playing, timeout]);
    }
}
