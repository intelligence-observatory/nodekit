import {expect, test} from '@playwright/test';
import type {ConsoleMessage} from '@playwright/test';

test('video', async ({ page }) => {
   // Get page errors.
   let errors: Error[] = [];
   page.on('pageerror', (error) => {
      errors.push(error);
   });

   // Log all console messages.
   const logs: {[key: string]: string[]} = {};
   page.on('console', message => {
      let t = message.type();
      if (!(t in logs)) {
            logs[t] = [];
      }
      let location = message.location();
      let simpleMessage = message.text() + " line: " + location.lineNumber + " column: " + location.columnNumber
      logs[t].push(simpleMessage);
   });

   await page.goto("./video.html");
   await page.waitForLoadState('domcontentloaded');
   expect(errors).toHaveLength(0);
   await page.waitForTimeout(2000);

   // TODO make this quiet.
   expect(logs).not.toHaveProperty('error');
});

