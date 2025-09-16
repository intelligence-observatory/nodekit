import {expect, test} from '@playwright/test';

test('video', async ({ page }) => {
   let errors: Error[] = [];
   page.on('pageerror', (error) => {
      errors.push(error);
    });
   await page.goto("./video.html");
   await page.waitForLoadState('domcontentloaded');
   expect(errors).toHaveLength(0);
});

