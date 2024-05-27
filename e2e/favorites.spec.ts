import { expect, test } from '@playwright/test';

test.describe('Testing logged in state', () => {
  test.use({ storageState: 'e2e/.auth/user.json' });
  test('Open favorites page when signed in', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(
      page.getByRole('heading', {
        name: 'Find your new best friend, discover your perfect match.',
      })
    ).toBeVisible();

    await page.goto('/user/favorites');

    await expect(page.getByText('No favorites yet')).toBeVisible();
  });
});

test.describe('Testing logged out state', () => {
  test('Open favorites page when not signed in', async ({ page }) => {
    await page.goto('/user/favorites');

    await expect(
      page.getByText(
        'Please login to your account or create one to access this page'
      )
    ).toBeVisible();
  });
});
