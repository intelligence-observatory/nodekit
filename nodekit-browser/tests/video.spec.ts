import {expect, test} from '@playwright/test';
import {nodeGraphTest} from "./fixtures";

nodeGraphTest('video', async ({ nodeGraphPage }) => {
   await nodeGraphPage.goto("video.html");
   await nodeGraphPage.page.waitForTimeout(2000);
   //await nodeGraphPage.page.locator('video').first().click();
   //await nodeGraphPage.expectNodeGraphEnded();
});

