import {expect} from '@playwright/test';
import {nodeGraphTest} from "./fixtures";

// Load a video and then click it:
nodeGraphTest('video', async ({ nodeGraphPage }) => {
   await nodeGraphPage.goto("video.html");
   // Find the video:
   let video = nodeGraphPage.page.locator('video').first();
   await expect(video).toBeVisible();
   // Wait slightly longer than needed for the video to load, in case Playwright introduces latency:
   await nodeGraphPage.page.waitForTimeout(99);
   // Click the video, which triggers the ClickSensor, which ends the node:
   await video.click();
   // There is only one node so the whole graph should be done:
   await nodeGraphPage.expectNodeGraphEnded();
});

