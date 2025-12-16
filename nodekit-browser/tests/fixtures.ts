import {test, expect} from '@playwright/test';
import type {Page} from "@playwright/test";
import {fileURLToPath, pathToFileURL} from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

abstract class TestPage {
    public readonly page: Page;
    public readonly errors: Error[] = [];
    protected readonly logs: {[key: string]: string[]} = {};

    constructor(page: Page) {
        this.page = page;

        // Get page errors:
        page.on('pageerror', (error) => {
            this.errors.push(error);
        });

        // Log all console messages:
       page.on('console', message => {
          let t = message.type();
          if (!(t in this.logs)) {
                this.logs[t] = [];
          }
          let location = message.location();
          // Simplify the messages, because the full dictionary is hard to read:
          let simpleMessage = message.text() + " line: " + location.lineNumber + " column: " + location.columnNumber
          this.logs[t].push(simpleMessage);
       });
    }

    abstract goto(filename: string) : Promise<void>;

    end() {
        // Print logged messages:
        console.log(JSON.stringify(this.logs, null, 4));
    }
}

export class NodeGraphPage extends TestPage {
    private readonly latency: number;

    constructor(page: Page, latency: number) {
        super(page);
        this.latency = latency;
    }

    async goto(filename: string) {
        // Throttle the network for HTTP(S) requests.
        await this.page.context().route("**", async (route) => {
            if (route.request().url().startsWith("http")) {
                await new Promise(resolve => setTimeout(resolve, this.latency));
            }
            await route.continue();
        });

        const fileUrl = pathToFileURL(path.join(__dirname, filename)).href;
        try {
            await this.page.goto(fileUrl);
            await this.page.setViewportSize({width: 1024, height: 768});
            // Load everything:
            await this.page.waitForLoadState('load');
            await expect(this.errors).toHaveLength(0);
            // Click the start button:
            await this.page.getByRole('button', {name: /press to start/i}).click();
        }
        catch (e) {
            this.errors.push(e as Error);
        }
    }

    // Expect the submit button to be visible:
    async expectNodeGraphEnded()  {
        const submitButton = this.page.locator('.submit-button').first();
        await expect(submitButton).toBeVisible();
        await submitButton.click();
    }

    // Click the center of the screen:
    async click() {
      // Click the video, which triggers the ClickSensor, which ends the node:
      let size = this.page.viewportSize();
      expect(size).not.toBeNull();
      await this.page.waitForTimeout(1000);
      // Appease the null check:
      if (size) {
          // Click in the center of the screen:
          await this.page.mouse.click(size.width / 2, size.height / 2);
      }
    }

    async getTrace() {
        await this.page.waitForFunction(() => (window as any).__trace !== null || (window as any).__error);
        const traceOrError = await this.page.evaluate(() => ({trace: (window as any).__trace, error: (window as any).__error}));
        if (traceOrError.error) {
            throw traceOrError.error;
        }
        return traceOrError.trace;
    }

    end() {
        super.end();
        // Check for thrown errors:
        expect(this.errors).toHaveLength(0);
        // Checked for logged errors:
        expect(this.logs).not.toHaveProperty('error');
    }
}

export class OfflineNodeGraphPage extends TestPage {
    async goto(filename: string) {
        await this.page.context().setOffline(true);
        // Fail to go to a local file page:
        try {
            await this.page.goto('./tests/' + filename);
        }
        catch(e) {
            if (e instanceof Error) {
                this.errors.push(e);
            }
        }
    }

    async end() {
        super.end();
        expect(this.errors.length).toBeGreaterThan(0);
        await this.page.context().setOffline(false);
    }
}

type Fixtures = {
    offlinePage: OfflineNodeGraphPage,
    noThrottle: NodeGraphPage,
    gprs: NodeGraphPage,
    twoG: NodeGraphPage,
    threeG: NodeGraphPage,
    fourG: NodeGraphPage,
    wifi: NodeGraphPage,
}

async function testNodeGraphPage(
    latency: number,
    page: Page,
    use: (r: NodeGraphPage) => Promise<void>
) {
    let nodeGraphPage =  new NodeGraphPage(page, latency);
    await use(nodeGraphPage);
}

export const nodeGraphTest = test.extend<Fixtures>({
    offlinePage: async({ page }, use) => {
        let offlinePage = new OfflineNodeGraphPage(page);
        await use(offlinePage);
    },
    noThrottle: async({ page }, use) => {
        await testNodeGraphPage( 0, page, use);
    },
    gprs: async({ page }, use) => {
        await testNodeGraphPage(500, page, use);
    },
    twoG: async({ page }, use) => {
        await testNodeGraphPage(300, page, use);
    },
    threeG: async({ page }, use) => {
        await testNodeGraphPage(100, page, use);
    },
    fourG: async({ page }, use) => {
        await testNodeGraphPage(20, page, use);
    },
    wifi: async({ page }, use) => {
        await testNodeGraphPage(2, page, use);
    },
});
