import { test, expect } from '@playwright/test';
import type {ConsoleMessage} from '@playwright/test';

test('has title', async ({ page }) => {
  // Log all console messages.
  let observations: {[key: string]: ConsoleMessage[]} = {};
  page.on('console', message => {
    let s = message.type();
    if (!(s in observations)) {
      observations[s] = [];
    }
    observations[s].push(message);
  });

  await page.goto("file://" + process.env.NODEKIT_INDEX_HTML);

  await page.waitForTimeout(2000);

  Object.entries(observations).forEach(([t, messages]) => {
    console.log(t + ":");
    messages.forEach(m => console.log(m));
    console.log('');
  })

  // Expect a title "to contain" a substring.
  // await expect(page).toHaveTitle(/NodeKit Browser/);
});

