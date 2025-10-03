import {expect} from '@playwright/test';
import {NodeGraphPage, nodeGraphTest} from "./fixtures";

// Load a video and then click it:
nodeGraphTest('video (offline)', async ({ offlinePage }) => {
   const filename = 'video.html';
   await offlinePage.goto(filename);
   await offlinePage.end();
});

// Wait for `delay` ms. Then press `key`. Then, wait 50 ms. Then, depress `key`.
async function keyPress(nodeGraphPage: NodeGraphPage, key: string, delay: number) : Promise<void> {
   await nodeGraphPage.page.waitForTimeout(delay);
   await nodeGraphPage.page.keyboard.down(key);
   await nodeGraphPage.page.waitForTimeout(50);
   await nodeGraphPage.page.keyboard.up(key);
}

async function runTest(nodeGraphPage: NodeGraphPage) {
   try {
      // Start the test:
      await nodeGraphPage.goto('video.html');
      // Find the video:
      let video = nodeGraphPage.page.locator('video').first();
      await expect(video).toBeVisible();
      // Await a timeout, and await some key presses:
      let events: Promise<void>[] = [
          nodeGraphPage.page.waitForTimeout(5000),
          keyPress(nodeGraphPage, "a", 1000),
          keyPress(nodeGraphPage, "b", 1100),
          keyPress(nodeGraphPage, "c", 1200),
      ];
      // Click twice:
      await nodeGraphPage.clickTwice();
      // Clicked the video:
      await expect(video).not.toBeVisible();
      // There is only one node so the whole graph should be done:
      await nodeGraphPage.expectNodeGraphEnded();
      // Await the events:
      await Promise.all(events);
      // Close the page:
      await nodeGraphPage.page.close();
   }
   catch (e) {
      nodeGraphPage.errors.push(e as Error);
   }

   nodeGraphPage.end();
}

nodeGraphTest('video (no throttle)', async ({ noThrottle }) => {
   await runTest(noThrottle)
});

nodeGraphTest('video (GPRS)', async ({ gprs }) => {
   await runTest(gprs)
});

nodeGraphTest('video (2G)', async ({ twoG }) => {
   await runTest(twoG)
});

nodeGraphTest('video (3G)', async ({ threeG }) => {
   await runTest(threeG)
});

nodeGraphTest('video (4G)', async ({ fourG }) => {
   await runTest(fourG)
});

nodeGraphTest('video (WiFi)', async ({ wifi }) => {
   await runTest(wifi)
});



