import './video-card.css'
import {CardView, type ClickableCardView} from "../card-view.ts";
import type {VideoCard} from "../../../types/cards";
import type {BoardView} from "../../board-view.ts";


export class VideoCardView extends CardView implements ClickableCardView {

    videoContainer!: HTMLDivElement;
    video!: HTMLVideoElement;

    private readonly videoLoadedPromise: Promise<void>;

    constructor(
        card: VideoCard,
        boardView: BoardView,
    ) {
        super(card, boardView);
        this.videoContainer = document.createElement('div');
        this.videoContainer.classList.add('video-card');
        this.root.appendChild(this.videoContainer);

        //
        this.videoLoadedPromise = (async () => {
            this.video = await boardView.assetManager.getVideo(
                card.video_identifier
            );
            this.video.classList.add('video-card__content');
            this.videoContainer.appendChild(this.video);

            // Mute the video:
            this.video.muted = card.muted;

            // Prevent dragging the video in the browser:
            this.video.draggable = false;

        })();
    }

    addClickCallback(callback: (e: MouseEvent) => void) {
        this.videoContainer.addEventListener('click', (e: MouseEvent) => {
            callback(e);
        });
    }

    async load() {
        return this.videoLoadedPromise
    }

    unload() {
        super.unload();
        // Remove the video.
        // Source: https://stackoverflow.com/a/28060352
        this.video.removeAttribute('src');
        this.video.load();
    }

    async start() {
        await super.start();
        // Timeout after two frames.
        let timeout = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error("Video failed to play!"))
            }, 33);
        });
        // Check if the video is playing.
        let playing = new Promise((resolve, _) => {
           this.video.onplaying = () => {
               resolve(null)
           }
        });
        // Start playing the video now.
        await this.video.play()
        await Promise.race([playing, timeout]);
    }
}
