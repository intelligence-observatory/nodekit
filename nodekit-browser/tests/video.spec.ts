import {expect, test} from '@playwright/test';
import {play} from '../src/main';

test('hello world', async ({ page }) => {
    await page.goto("./index.html");
    await page.evaluate(() => {
        let nodeGraph = {
            "base_payment_usd": "0.01",
            "bonus_rules": [],
            "description": "Test task",
            "keywords": [],
            "max_duration_sec": 600,
            "nodes": [
                {
                    "node_id": "acee5f9b-996c-448d-9d3d-f9fc8e4b0c8d",
                    "board": {
                        "board_width_px": 768,
                        "board_height_px": 768
                    },
                    "cards": [
                        {
                            "card_id": "3b6f3e51-437b-495f-b1bf-9437e8dcdb25",
                            "card_type": "VideoCard",
                            "card_parameters": {
                                "video_link": {
                                    "mime_type": "video/mp4",
                                    "sha256": "44abfe9cd09734aa445799fb98653f855ea2af0d6d7de0fff1e61a36da358b4e",
                                    "asset_url": "https://ia803409.us.archive.org/18/items/mp4_20210502/mp4.ia.mp4"
                                }
                            },
                            "card_shape": {
                                "width": 0.5,
                                "height": 0.5
                            },
                            "card_location": {
                                "x": 0,
                                "y": 0
                            },
                            "card_timespan": {
                                "start_time_msec": 0,
                                "end_time_msec": null
                            }
                        }
                    ],
                    "sensors": [
                        {
                            "sensor_id": "60f7ce63-0e0e-431c-945b-07570e98d7e4",
                            "sensor_type": "ClickSensor",
                            "sensor_parameters": {},
                            "sensor_timespan": {
                                "start_time_msec": 0,
                                "end_time_msec": null
                            },
                            "card_id": "3b6f3e51-437b-495f-b1bf-9437e8dcdb25"
                        }
                    ],
                    "reinforcer_maps": [],
                    "effects": []
                }
            ],
            "title": "Test task (sandbox)"
        };

        window.focus();

    window.onload = async () => {
        // Add focus
        let events = await play(
            nodeGraph,
            (event) => {
                console.log(event);
            }
        )
        console.log(events)
    };
    })
});

