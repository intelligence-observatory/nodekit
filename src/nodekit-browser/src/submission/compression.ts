import type {Trace} from "../types/node.ts";

function base64EncodeBytes(bytes: Uint8Array): string {
    let binary = "";
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    return btoa(binary);
}

export async function compressTrace(trace: Trace): Promise<string> {
    const json = JSON.stringify(trace);
    const stream = new Blob([json]).stream().pipeThrough(new CompressionStream("gzip"));
    const compressed = new Uint8Array(await new Response(stream).arrayBuffer());
    return base64EncodeBytes(compressed);
}
