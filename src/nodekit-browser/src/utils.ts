import type {ColorHexString, MarkdownString, PixelSize} from "./types/values.ts";
import {marked} from "marked";
import DOMPurify from "dompurify";


export interface TextContentParameters {
    text: MarkdownString
    textColor: ColorHexString
    fontSize: PixelSize // The height of the em-box, in Board units
    justificationHorizontal: 'left' | 'center' | 'right'
    justificationVertical: 'top' | 'center' | 'bottom'
}


export function renderTextContent(
    textContentParameters: TextContentParameters,
    fontSizeToCSS: (fontSize: PixelSize) => string
): HTMLDivElement {
    const textDiv = document.createElement('div');
    textDiv.classList.add('text-content');

    // Set styles based on textContent parameters:
    textDiv.style.color = textContentParameters.textColor;
    textDiv.style.textAlign = textContentParameters.justificationHorizontal;
    switch (textContentParameters.justificationVertical) {
        case 'top':
            textDiv.style.justifyContent = 'flex-start';
            break;
        case 'center':
            textDiv.style.justifyContent = 'center';
            break;
        case 'bottom':
            textDiv.style.justifyContent = 'flex-end';
            break;
        default:
            throw new Error(`Unknown vertical justification: ${textContentParameters.justificationVertical}`);
    }

    // Process font size
    textDiv.style.fontSize = fontSizeToCSS(textContentParameters.fontSize);

    // Render markdown to HTML
    let parsed = marked.parse(textContentParameters.text);
    // If a promise, wait for it to resolve
    if (parsed instanceof Promise) {
        parsed.then((result) => {
            textDiv.innerHTML = DOMPurify.sanitize(result);
        }).catch(err => console.error('markdown render failed', err))
    } else {
        textDiv.innerHTML = DOMPurify.sanitize(parsed);
    }

    return textDiv
}


export class Deferred<T> {
    public readonly promise: Promise<T>
    private resolveFunc!: (value: T) => void;
    private alreadyCalled: boolean = false;

    constructor() {
        this.promise = new Promise<T>(
            res => {
                this.resolveFunc = res;
            }
        )
    }

    resolve(value: T) {
        if (this.alreadyCalled) {
            console.warn("Warning: DeferredValue.resolve called multiple times; ignoring subsequent calls.", value);
            return
        }
        this.alreadyCalled = true;
        this.resolveFunc(value);
    }
}