import { expect, test } from '@playwright/test';

test('Google Sign In redirection', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button').nth(2).click();
  await page.getByRole('menuitem', { name: 'Log in' }).click();
  await page.getByRole('button', { name: 'Sign in with Google' }).click();

  await expect(page).toHaveURL(/^https:\/\/accounts\.google\.com\/.+/);
});
