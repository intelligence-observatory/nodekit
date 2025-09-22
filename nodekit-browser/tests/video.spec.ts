import {expect} from '@playwright/test';
import {NodeGraphPage, nodeGraphTest} from "./fixtures";

// Load a video and then click it:
nodeGraphTest('video (offline)', async ({ offlinePage }) => {
   const filename = 'video.html';
   await offlinePage.goto(filename);
   await offlinePage.end();
});

async function runTest(nodeGraphPage: NodeGraphPage) {
   try {
      await nodeGraphPage.goto('video.html');
      // Find the video:
      let video = nodeGraphPage.page.locator('video').first();
      await expect(video).toBeVisible();
      // Click twice:
      await nodeGraphPage.clickTwice();
      // Clicked the video:
      await expect(video).not.toBeVisible();
      // There is only one node so the whole graph should be done:
      await nodeGraphPage.expectNodeGraphEnded();
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



