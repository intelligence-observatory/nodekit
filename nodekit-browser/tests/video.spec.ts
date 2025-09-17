import {expect} from '@playwright/test';
import {nodeGraphTest} from "./fixtures";

nodeGraphTest('video', async ({ nodeGraphPage }) => {
   await nodeGraphPage.goto("video.html");
   await nodeGraphPage.page.waitForTimeout(2000);
   let video = nodeGraphPage.page.locator('video').first();
   await expect(video).toBeVisible();
   await video.click();
   await nodeGraphPage.expectNodeGraphEnded();
});

