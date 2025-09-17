import {test, expect} from '@playwright/test';
import type {Page} from "@playwright/test";

export class NodeGraphPage {
    public readonly page: Page;
    private readonly errors: Error[] = [];
    private readonly logs: {[key: string]: string[]} = {};

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

    async goto(filename: string) {
        // Go to a local file page:
        await this.page.goto('./' + filename);
        await this.page.setViewportSize({width: 800, height: 800})
        // Load everything:
        await this.page.waitForLoadState('load');
        // Click the start button:
        await this.page.locator('.start-button').first().click();
    }

    // Expect the submit button to be visible:
    async expectNodeGraphEnded()  {
        await this.page.waitForTimeout(500);
        expect(this.page.locator('.submit-button').first().isVisible()).toBeTruthy();
    }

    async end() {
        // Print logged messages:
        let observations = Object.entries(this.logs).map(([t, messages]) => {
            return [t + ":"].concat(messages).join("\n");
        }).join("\n\n");
        console.log(observations);

        // Check for thrown errors:
        expect(this.errors).toHaveLength(0);
        // Checked for logged errors:
        expect(this.logs).not.toHaveProperty('error');
    }
}

type Fixtures = {
    nodeGraphPage: NodeGraphPage,
}

export const nodeGraphTest = test.extend<Fixtures>({
    nodeGraphPage: async({ page }, use) => {
        let nodeGraphPage =  new NodeGraphPage(page);
        await use(nodeGraphPage);
        await nodeGraphPage.end();
    }
});