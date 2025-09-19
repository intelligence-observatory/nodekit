import {test, expect} from '@playwright/test';
import type {Page} from "@playwright/test";

abstract class TestPage {
    public readonly page: Page;
    protected readonly errors: Error[] = [];
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
    private readonly networkName: string;
    private readonly latency: number;

    constructor(page: Page, networkName: string, latency: number) {
        super(page);
        this.networkName = networkName;
        this.latency = latency;
    }

    async goto(filename: string) {
        // Throttle the network.
        console.log("Network speed: " + this.networkName)
        await this.page.context().route("**", async (route) => {
            // Add delay before continuing the request
            await new Promise(resolve => setTimeout(resolve, this.latency));
            await route.continue();
        })
        // Go to a local file page:
        await this.page.goto('./tests/' + filename);
        await this.page.setViewportSize({width: 800, height: 800});
        // Load everything:
        await this.page.waitForLoadState('load');
        expect(this.errors).toHaveLength(0);
        // Click the start button:
        await this.page.locator('.start-button').first().click();
    }

    // Expect the submit button to be visible:
    async expectNodeGraphEnded()  {
        await this.page.waitForTimeout(500);
        expect(this.page.locator('.submit-button').first().isVisible()).toBeTruthy();
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
    networkName: string,
    latency: number,
    page: Page,
    use: (r: NodeGraphPage) => Promise<void>
) {
    let nodeGraphPage =  new NodeGraphPage(page, networkName, latency);
    await use(nodeGraphPage);
}

export const nodeGraphTest = test.extend<Fixtures>({
    offlinePage: async({ page }, use) => {
        console.log("Offline:")
        let offlinePage = new OfflineNodeGraphPage(page);
        await use(offlinePage);
    },
    noThrottle: async({ page }, use) => {
        await testNodeGraphPage("No throttle", 0, page, use);
    },
    gprs: async({ page }, use) => {
        await testNodeGraphPage("GPRS", 500, page, use);
    },
    twoG: async({ page }, use) => {
        await testNodeGraphPage("2G", 300, page, use);
    },
    threeG: async({ page }, use) => {
        await testNodeGraphPage("3G", 100, page, use);
    },
    fourG: async({ page }, use) => {
        await testNodeGraphPage("4G", 20, page, use);
    },
    wifi: async({ page }, use) => {
        await testNodeGraphPage("WiFi", 2, page, use);
    },
});