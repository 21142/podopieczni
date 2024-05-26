import { expect, test } from '@playwright/test';

test('Google Sign In redirection', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) {
    await page.getByRole('button', { name: 'Toggle navigation menu' }).click();
  }
  await page.getByRole('button', { name: 'Log in dropdown' }).click();
  await page.getByRole('menuitem', { name: 'Log in' }).click();
  await page.getByRole('button', { name: 'Google' }).click();

  await expect(page).toHaveURL(/^https:\/\/accounts\.google\.com\/.+/);
});

test('Redirect to landing page from welcome page if not signed in', async ({
  page,
}) => {
  await page.goto('/welcome');

  await expect(page).toHaveURL('/');
});

test('Redirect to landing page from dashboard page if not signed in', async ({
  page,
}) => {
  await page.goto('/welcome');

  await expect(page).toHaveURL('/');
});
