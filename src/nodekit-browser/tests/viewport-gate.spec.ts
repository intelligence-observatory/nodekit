import {expect, test} from '@playwright/test';
import type {Page} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

const nodeKitScriptPath = fileURLToPath(new URL('../dist/nodekit.js', import.meta.url));
const nodeKitCssPath = fileURLToPath(new URL('../dist/nodekit.css', import.meta.url));
const packageJsonPath = fileURLToPath(new URL('../package.json', import.meta.url));
const {version} = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {version: string};

const graph = {
    type: 'Graph',
    nodekit_version: version,
    nodes: {
        trial: {
            type: 'Node',
            card: null,
            sensor: {
                sensor_type: 'WaitSensor',
                duration_msec: 500,
            },
            board_color: '#ffffffff',
            hide_pointer: false,
            annotation: null,
        },
    },
    transitions: {},
    start: 'trial',
    registers: {},
    annotation: null,
};

async function launchGraph(page: Page) {
    await page.setContent('<!doctype html><html><body></body></html>');
    await page.addStyleTag({path: nodeKitCssPath});
    await page.addScriptTag({path: nodeKitScriptPath});
    await page.evaluate((playGraph) => {
        (window as Window & { __events?: unknown[] }).__events = [];
        void (window as Window & {
            NodeKit: {
                play: (graph: unknown, onEventCallback: (event: unknown) => void) => Promise<void>;
            };
        }).NodeKit.play(
            playGraph,
            (event) => {
                (window as Window & { __events: unknown[] }).__events.push(event);
            },
        );
    }, graph);
}

test.describe('viewport gate', () => {
    test('allows startup immediately when the viewport is large enough', async ({page, isMobile}) => {
        test.skip(isMobile, 'NodeKit only supports desktop browsers.');

        await page.setViewportSize({width: 1100, height: 1100});
        await launchGraph(page);

        await expect(page.locator('#console-message-overlay.overlay--visible-state')).toHaveCount(0);
        await expect(page.locator('#session-started-overlay.overlay--visible-state .confirm-button')).toHaveCount(1);

        expect(await page.evaluate(() => (window as Window & { __events: unknown[] }).__events.length)).toBe(0);

        await page.getByRole('button', {name: 'Start →'}).click();
        await page.waitForFunction(() => (window as Window & { __events: unknown[] }).__events.length > 0);
    });

    test('re-blocks startup if the viewport becomes too small before start', async ({page, isMobile}) => {
        test.skip(isMobile, 'NodeKit only supports desktop browsers.');

        await page.setViewportSize({width: 1100, height: 1100});
        await launchGraph(page);

        await expect(page.locator('#session-started-overlay.overlay--visible-state .confirm-button')).toHaveCount(1);

        await page.setViewportSize({width: 900, height: 900});

        await expect(page.locator('#console-message-overlay.overlay--visible-state')).toHaveCount(1);
        await expect(page.getByText('Viewport too small')).toBeVisible();
        await expect(page.locator('#session-started-overlay.overlay--visible-state')).toHaveCount(0);

        expect(await page.evaluate(() => (window as Window & { __events: unknown[] }).__events.length)).toBe(0);

        await page.setViewportSize({width: 1024, height: 1024});

        await expect(page.locator('#console-message-overlay.overlay--visible-state')).toHaveCount(0);
        await expect(page.locator('#session-started-overlay.overlay--visible-state .confirm-button')).toHaveCount(1);

        await page.getByRole('button', {name: 'Start →'}).click();
        await page.waitForFunction(() => (window as Window & { __events: unknown[] }).__events.length > 0);
    });

    test('blocks startup until the viewport is resized to the minimum', async ({page, isMobile}) => {
        test.skip(isMobile, 'NodeKit only supports desktop browsers.');

        await page.setViewportSize({width: 900, height: 900});
        await launchGraph(page);

        await expect(page.locator('#console-message-overlay.overlay--visible-state')).toHaveCount(1);
        await expect(page.getByText('Viewport too small')).toBeVisible();
        await expect(page.locator('#session-started-overlay.overlay--visible-state')).toHaveCount(0);

        expect(await page.evaluate(() => (window as Window & { __events: unknown[] }).__events.length)).toBe(0);

        await page.setViewportSize({width: 1024, height: 1024});

        await expect(page.locator('#console-message-overlay.overlay--visible-state')).toHaveCount(0);
        await expect(page.locator('#session-started-overlay.overlay--visible-state .confirm-button')).toHaveCount(1);

        expect(await page.evaluate(() => (window as Window & { __events: unknown[] }).__events.length)).toBe(0);

        await page.getByRole('button', {name: 'Start →'}).click();
        await page.waitForFunction(() => (window as Window & { __events: unknown[] }).__events.length > 0);
    });
});
