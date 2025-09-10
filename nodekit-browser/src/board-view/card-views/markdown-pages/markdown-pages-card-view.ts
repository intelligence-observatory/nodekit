import "./markdown-pages-card-view.css"

import {UIElementBase} from "../../../ui/shell-ui/base.ts";
import {CardView, type DoneableCardView} from "../card-view.ts";
import type {MarkdownPagesCard} from "../../../types/cards";
import type {SpatialSize} from "../../../types/common.ts";
import {renderTextContent} from "../text/text-card-view.ts";
import {BoardView} from "../../board-view.ts";


export class MarkdownPagesCardView extends CardView implements DoneableCardView {
    viewerDiv: HTMLDivElement
    navButtons: NavButtonsTray;
    doneButton: Button;
    pageIndex: number = 0;

    onPressDone: (() => void) | null = null;

    contentPages: HTMLDivElement[]

    constructor(
        card: MarkdownPagesCard,
        boardView: BoardView,
    ) {
        super(card, boardView);

        if (card.card_parameters.pages.length === 0) {
            throw new Error("No markdown pages provided to MarkdownPagesViewer");
        }

        // Create root
        const viewerContainer = document.createElement('div');
        viewerContainer.classList.add('markdown-pages-viewer');
        this.root.appendChild(viewerContainer);
        this.viewerDiv = document.createElement('div')
        this.viewerDiv.classList.add('markdown-pages-viewer__window')
        viewerContainer.appendChild(this.viewerDiv)

        // Assemble all content pages:
        this.contentPages = [];
        for (const page of card.card_parameters.pages) {
            const divCur = renderTextContent(
                page,
                (fontSize: SpatialSize) => {
                    const boardCoords = this.boardView.getCoordinateSystem()
                    const sizePx = boardCoords.getSizePx(fontSize)
                    return sizePx + 'px';
                }
            )
            // Turn off visibility:
            this.contentPages.push(divCur);
        }

        // Create a flex container for navigation buttons and continue button
        let buttonTrayDiv = document.createElement('div');
        buttonTrayDiv.classList.add('nav-tray')
        viewerContainer.appendChild(buttonTrayDiv);

        // NavButtons (center column of tray)
        this.navButtons = new NavButtonsTray();
        this.navButtons.mount(buttonTrayDiv);

        // Continue button (right column of tray)
        this.doneButton = new Button('Done');
        this.doneButton.mount(buttonTrayDiv);

        // Render initial markdown page
        this.goToPage(0);

        // Wire in event listeners for navigation buttons
        this.navButtons.addButtonPressListeners(
            () => this.handleBack(),
            () => this.handleNext()
        );

        this.doneButton.addButtonPressListener(() => this.handleDone())
    }

    private goToPage(pageIndex: number) {
        // Set visible page
        const numPages = this.contentPages.length;
        if (pageIndex < 0 || pageIndex >= numPages) {
            throw new Error(`goToPage: index ${pageIndex} outside [0, ${numPages - 1}]`);
        }

        // Lazily attach any pages that are not yet in the DOM.
        for (const pageDiv of this.contentPages) {
            if (!pageDiv.isConnected) {
                /* insertBefore keeps the tray (nav+done) as the last child */
                this.viewerDiv.insertBefore(pageDiv, this.viewerDiv.lastElementChild);
            }
        }

        // Show the requested page and hide all others.
        this.contentPages.forEach((div, idx) => {
            div.style.display = idx === pageIndex ? "block" : "none";
        });

        this.pageIndex = pageIndex;
        this.setButtonStates();

    }

    private handleBack() {
        if (this.pageIndex > 0) {
            this.goToPage(this.pageIndex - 1);
        }

    }

    private handleNext() {
        if (this.pageIndex < this.contentPages.length - 1) {
            this.goToPage(this.pageIndex + 1);
        }
    }

    private handleDone() {
        this.onPressDone?.();
    }

    private setButtonStates() {
        // Enables / disables navigation buttons based on current page index
        const numPages = this.contentPages.length;
        this.navButtons.setButtonStates(
            this.pageIndex > 0, // Back button enabled if not on first page
            this.pageIndex < numPages - 1 // Next button enabled if not on last page
        );
        // Enable the Done button only if on the last page
        if (this.pageIndex === numPages - 1) {
            this.doneButton.enable();
        } else {
            this.doneButton.disable();
        }

    }

    public addDoneCallback(callback: () => void): void {
        this.onPressDone = () => {
            callback();
        };

    }
}

class NavButtonsTray extends UIElementBase {
    root: HTMLDivElement;

    nextButton: Button;
    lastButton: Button

    constructor() {
        super();

        // Create flex container for navigation buttons
        this.root = document.createElement('div');

        // Mount lastButton first (to ensure it appears on the left)
        this.lastButton = new Button('←');
        this.lastButton.mount(this.root)

        // Mount nextButton second
        this.nextButton = new Button('→');
        this.nextButton.mount(this.root);
    }

    addButtonPressListeners(lastCallback: () => void, nextCallback: () => void): void {
        if (!this.nextButton || !this.lastButton) {
            throw new Error("Navigation button(s) not found");
        }

        this.nextButton.addButtonPressListener(nextCallback);
        this.lastButton.addButtonPressListener(lastCallback);
    }

    setButtonStates(backButtonEnabled: boolean, nextButtonEnabled: boolean) {
        if (backButtonEnabled) {
            this.lastButton.enable()
        } else {
            this.lastButton.disable()
        }

        if (nextButtonEnabled) {
            this.nextButton.enable()
        } else {
            this.nextButton.disable()
        }
    }
}


export class Button extends UIElementBase {
    root: HTMLButtonElement;

    constructor(buttonText: string) {
        super();
        const button = document.createElement('button');
        button.className = 'nav-tray__button';
        button.textContent = buttonText;
        this.root = button;
    }

    addButtonPressListener(callback: () => void): void {
        this._registerEventListener(this.root, 'click', callback);
    }
}
