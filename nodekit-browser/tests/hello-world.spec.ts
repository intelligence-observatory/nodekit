import {expect, test} from '@playwright/test';

test('hello world', async ({ page }) => {
  await page.goto("./hello-world.html");
  await expect(page).toHaveTitle(/Hello World/);
});

