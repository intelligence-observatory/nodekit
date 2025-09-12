import {expect, test} from '@playwright/test';
import {play} from '../src/main';
import type {NodeGraph, NodeId} from "../src/types/node-graph";
import type {CardId, SensorId, SpatialPoint, SpatialSize, TimePointMsec} from "../src/types/common";

test('hello world', async ({ page }) => {
    const context = page.context();

    const html = `<!doctype html>
    <html lang="en">
    <head>
        <link rel="icon" href="data:,">
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>NodeKit Browser</title>
    </head>
    <body>
    <div id="app"></div>
    <script type="module" src="../dist/nodekit.js"></script>
    </body>
    </html>
    `;
    await page.setContent(html);

    await context.exposeFunction("play", play);

    await page.evaluate(async () => {
        console.log(document);
        let nodeGraph: NodeGraph = {
            bonus_rules: [],
            nodes: [
                {
                    node_id: "acee5f9b-996c-448d-9d3d-f9fc8e4b0c8d" as NodeId,
                    board: {
                        "board_width_px": 768,
                        "board_height_px": 768
                    },
                    cards: [
                        {
                            card_id: "3b6f3e51-437b-495f-b1bf-9437e8dcdb25" as CardId,
                            card_type: "VideoCard",
                            card_parameters: {
                                video_link: {
                                    mime_type: "video/mp4",
                                    sha256: "44abfe9cd09734aa445799fb98653f855ea2af0d6d7de0fff1e61a36da358b4e",
                                    asset_url: "https://ia803409.us.archive.org/18/items/mp4_20210502/mp4.ia.mp4"
                                }
                            },
                            card_shape: {
                                width: 0.5 as SpatialSize,
                                height: 0.5 as SpatialSize
                            },
                            card_location: {
                                x: 0 as SpatialPoint,
                                y: 0 as SpatialPoint
                            },
                            card_timespan: {
                                start_time_msec: 0 as TimePointMsec,
                                end_time_msec: null
                            }
                        }
                    ],
                    sensors: [
                        {
                            sensor_id: "60f7ce63-0e0e-431c-945b-07570e98d7e4" as SensorId,
                            sensor_type: "ClickSensor",
                            sensor_parameters: {},
                            sensor_timespan: {
                                start_time_msec: 0 as TimePointMsec,
                                end_time_msec: null
                            },
                            card_id: "3b6f3e51-437b-495f-b1bf-9437e8dcdb25" as CardId
                        }
                    ],
                    reinforcer_maps: [],
                    effects: []
                }
            ],
            title: "Test task (sandbox)"
        };

        // Add focus
        let events = await play(
            nodeGraph,
            (event) => {
                console.log(event);
            }
        )
        console.log(events)
    });
});

