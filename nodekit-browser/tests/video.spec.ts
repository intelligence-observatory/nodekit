import {expect, test} from '@playwright/test';

test('video', async ({ page }) => {
   await page.goto("./video.html");
   await page.waitForLoadState('domcontentloaded');
   await page.waitForTimeout(2000);
   await expect(page).toHaveTitle(/Video Test/);
});

