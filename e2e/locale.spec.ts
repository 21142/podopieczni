import { expect, test } from '@playwright/test';

test.describe('Locale with en loads English translations', () => {
  test.use({ locale: 'en' });

  test('Page loads in English', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.locator('html[lang=en]').waitFor({ state: 'attached' });
    {
      const locator = page.getByText('Search adoptable pets by location:', {
        exact: true,
      });
      expect(await locator.count()).toEqual(1);
    }

    {
      const locator = page.getByText('Szukaj dostępnych podopiecznych:', {
        exact: true,
      });
      expect(await locator.count()).toEqual(0);
    }
  });
});

test.describe('Locale with pl loads Polish translations', () => {
  test.use({ locale: 'pl' });

  test('Page loads in Polish', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.locator('html[lang=pl]').waitFor({ state: 'attached' });
    {
      const locator = page.getByText('Szukaj dostępnych podopiecznych:');
      expect(await locator.count()).toEqual(1);
    }

    {
      const locator = page.getByText('Search adoptable pets by location:');
      expect(await locator.count()).toEqual(0);
    }
  });
});
