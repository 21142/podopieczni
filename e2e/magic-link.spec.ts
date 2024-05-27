import { expect, test } from '@playwright/test';

test.describe('Verify magic link for logging in is sent', () => {
  test('Test email link login flow', async ({ page, browser }) => {
    const email = 'podopieczni.testing@mail7.io';

    await page.goto('/signin');
    await page.fill('#email', email);
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Sign in with email' }).click();
    await page.waitForLoadState('networkidle');

    await expect(
      page.getByRole('heading', { name: 'Check your email inbox' })
    ).toBeVisible();

    const mail7Inbox = await browser.newPage();

    await mail7Inbox.goto(
      `https://console.mail7.io/admin/inbox/inbox?username=${email}`,
      {
        waitUntil: 'domcontentloaded',
      }
    );

    await mail7Inbox.waitForTimeout(15000);
    await mail7Inbox.getByRole('button', { name: 'Refresh' }).click();
    await mail7Inbox.waitForLoadState('networkidle');

    await mail7Inbox.waitForSelector(
      '.subject:has-text("Witamy w podopieczni")'
    );

    await mail7Inbox.click('.subject:has-text("Witamy w podopieczni")');

    const emailIframe = await mail7Inbox.waitForSelector('.message iframe');
    const emailIframeContent = await emailIframe.contentFrame();

    if (!emailIframeContent) {
      throw new Error('message iframe is null!');
    }

    await expect(emailIframeContent.textContent('a')).resolves.toMatch(
      'Zaloguj się i zaczynajmy!'
    );

    const magicLinkElement = await emailIframeContent.$(
      'a:has-text("Zaloguj się i zaczynajmy!")'
    );

    if (!magicLinkElement) {
      throw new Error('Magic link not found in the email!');
    }

    const magicLinkUrl = await magicLinkElement.getAttribute('href');

    if (!magicLinkUrl) {
      throw new Error('Magic link URL is not available!');
    }

    await page.goto(magicLinkUrl);

    await page.reload();
    await page.waitForLoadState();

    await expect(
      page.getByRole('heading', {
        name: 'Find your new best friend, discover your perfect match.',
      })
    ).toBeVisible();

    await page.goto('/user/favorites');

    await page.context().storageState({ path: 'e2e/.auth/user.json' });

    await expect(page.getByText('No favorites yet')).toBeVisible();
  });
});
