import { expect, test } from '@playwright/test';

test('Change Theme To Dark', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Toggle theme' }).click();
  await page.getByRole('menuitem', { name: 'Dark' }).click();
  const darkModeClass = await page.getAttribute('html', 'class');
  expect(darkModeClass).toContain('dark');
});

test('Change Theme To Dark and then to Light', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Toggle theme' }).click();
  await page.getByRole('menuitem', { name: 'Dark' }).click();
  await page.getByRole('button', { name: 'Toggle theme' }).click();
  await page.getByRole('menuitem', { name: 'Light' }).click();
  const darkModeClass = await page.getAttribute('html', 'class');
  expect(darkModeClass).toContain('light');
});
