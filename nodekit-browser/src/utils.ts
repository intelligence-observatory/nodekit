import type {ColorHexString, ISO8601, MarkdownString, SpatialSize} from "./types/common.ts";
import {marked} from "marked";
import DOMPurify from "dompurify";

export function performanceNowToISO8601(
    performanceNowMsec: DOMHighResTimeStamp // as returned by performance.now()
): ISO8601 {
    const timestampMsec = performance.timeOrigin + performanceNowMsec;
    return new Date(timestampMsec).toISOString() as ISO8601;
}

export interface TextContentParameters {
    text: MarkdownString
    textColor: ColorHexString
    fontSize: SpatialSize // The height of the em-box, in Board units
    justificationHorizontal: 'left' | 'center' | 'right'
    justificationVertical: 'top' | 'center' | 'bottom'
}

export function renderTextContent(
    textContentParameters: TextContentParameters,
    fontSizeToCSS: (fontSize: SpatialSize) => string
): HTMLDivElement {
    // Function which renders the text content of a TextCard into a div.

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
        })
    } else {
        textDiv.innerHTML = DOMPurify.sanitize(parsed);
    }

    return textDiv
}
