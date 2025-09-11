import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto("file://" + process.env.NODEKIT_INDEX_HTML);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/NodeKit Browser/);
});