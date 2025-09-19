import type {ColorHexString, ISO8601, MarkdownString, SpatialPoint, SpatialSize} from "./types/common.ts";
import {marked} from "marked";
import DOMPurify from "dompurify";
import type {Region} from "./types/regions";

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

/**
 * Check if a point (x, y) is inside a given region on the Board.
 * @param x SpatialPoint
 * @param y SpatialPoint
 * @param region Region
 * @returns boolean - true if the point is inside the region, false otherwise
 */
export function checkPointInRegion(
    x: SpatialPoint,
    y: SpatialPoint,
    region: Region
): boolean {
    if (region.region_type !== 'ShapeRegion'){
        throw new Error(`Region type ${region.region_type} not implemented in checkPointInRegion`);
    }
    // There's only one Region type: ShapeRegion

    switch (region.shape) {
        case 'rectangle':
            const left = region.x - region.w / 2;
            const right = region.x + region.w / 2;
            const top = region.y + region.h / 2;
            const bottom = region.y - region.h / 2;
            return (x >= left) &&
                (x <= right) &&
                (y >= bottom) &&
                (y <= top);
        case 'ellipse':
            const radius_x = region.w / 2;
            const radius_y = region.h / 2;
            const delta_x = x - region.x;
            const delta_y = y - region.y;

            return (
                (delta_x * delta_x) / (radius_x * radius_x) +
                (delta_y * delta_y) / (radius_y * radius_y) <=
                1
            );
        default:
            throw new Error(`Unknown region type: ${region['region_type']}`);
    }
}