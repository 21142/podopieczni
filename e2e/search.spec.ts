import { expect, test } from '@playwright/test';

test.describe('Testing search functionality', () => {
  test('Search for dogs', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Dogs', exact: true }).click();

    await page.waitForLoadState('networkidle');

    await page.waitForSelector('#card');

    const petCards = await page.$$('[id="card"]');
    expect(petCards.length).toBeGreaterThan(0);
  });

  test('Search for cats', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Cats', exact: true }).click();

    await page.waitForLoadState('networkidle');

    await page.waitForSelector('#card');

    const petCards = await page.$$('[id="card"]');
    expect(petCards.length).toBeGreaterThan(0);
  });

  test('Search for pets in Warszawa', async ({ page }) => {
    await page.goto('/');

    await page.getByPlaceholder('Warszawa or 04-123').fill('Warszawa');
    await page.getByRole('button', { name: 'Search button' }).click();

    await page.waitForLoadState('networkidle');

    await page.waitForSelector('#card');

    const petCards = await page.$$('[id="card"]');
    expect(petCards.length).toBeGreaterThan(0);
  });

  test('Search for shelters', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Shelters', exact: true }).click();

    await page.waitForLoadState('networkidle');

    await page.waitForSelector('#card');

    const petCards = await page.$$('[id="card"]');
    expect(petCards.length).toBeGreaterThan(0);
  });
});
