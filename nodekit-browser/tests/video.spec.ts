import {expect} from '@playwright/test';
import {NodeGraphPage, nodeGraphTest} from "./fixtures";

async function runTest(nodeGraphPage: NodeGraphPage) {
    try {
        await nodeGraphPage.goto('video.html');

        const video = nodeGraphPage.page.locator('video').first();
        await expect(video).toBeVisible();

        // Click the video to trigger the SelectSensor and end the node.
        await nodeGraphPage.click();
        await expect(video).not.toBeVisible();

        await nodeGraphPage.expectNodeGraphEnded();

        const trace = await nodeGraphPage.getTrace();
        const eventTypes = trace.events.map((e: { event_type: string }) => e.event_type);
        expect(eventTypes).toContain("TraceStartedEvent");
        expect(eventTypes).toContain("ActionTakenEvent");
        expect(eventTypes).toContain("NodeEndedEvent");
        expect(eventTypes).toContain("TraceEndedEvent");

        await nodeGraphPage.page.close();
    } catch (e) {
        nodeGraphPage.errors.push(e as Error);
    }

    nodeGraphPage.end();
}

nodeGraphTest('video (no throttle)', async ({ noThrottle }) => {
    await runTest(noThrottle);
});

nodeGraphTest('video (GPRS)', async ({ gprs }) => {
    await runTest(gprs);
});

nodeGraphTest('video (2G)', async ({ twoG }) => {
    await runTest(twoG);
});

nodeGraphTest('video (3G)', async ({ threeG }) => {
    await runTest(threeG);
});

nodeGraphTest('video (4G)', async ({ fourG }) => {
    await runTest(fourG);
});

nodeGraphTest('video (WiFi)', async ({ wifi }) => {
    await runTest(wifi);
});
