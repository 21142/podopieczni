import { expect, test } from '@playwright/test';

test.describe('Testing shelter dashboard', () => {
  test.use({ storageState: 'e2e/.auth/user.json' });
  test('Go to shelter dashboard', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.goto('/about');
    await page.getByRole('link', { name: 'Shelter', exact: true }).click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText('Adoptions raport')).toBeVisible();
  });
});
