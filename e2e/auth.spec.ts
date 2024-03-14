import { expect, test } from '@playwright/test';

test('Google Sign In redirection', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) {
    await page.getByRole('button', { name: 'Toggle navigation menu' }).click();
  }
  await page.getByRole('button', { name: 'Log in dropdown' }).click();
  await page.getByRole('menuitem', { name: 'Log in' }).click();
  await page.getByRole('button', { name: 'Sign in with Google' }).click();

  await expect(page).toHaveURL(/^https:\/\/accounts\.google\.com\/.+/);
});
