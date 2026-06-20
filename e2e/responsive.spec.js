import { test, expect } from '@playwright/test';

test.describe('Lumiasia Responsive Layout', () => {
  test.describe('Mobile Viewport (iPhone 14 — 390×844)', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test('should render header and logo on mobile', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      const logo = page.locator('.header__logo-text').first();
      await expect(logo).toBeVisible();
      await expect(logo).toContainText('LUMIASIA');
    });

    test('should stack category buttons vertically on mobile', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      const choices = page.locator('.journey__hero-choices');
      await expect(choices).toBeVisible();

      // On mobile (≤768px), flex-direction should be column
      const flexDir = await choices.evaluate((el) =>
        window.getComputedStyle(el).flexDirection
      );
      expect(flexDir).toBe('column');
    });

    test('should show single-column gallery grid on mobile', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // Navigate to gallery
      const interiorBtn = page.getByRole('button', { name: 'View interior projects' });
      await interiorBtn.click();

      const backBtn = page.getByRole('button', { name: 'Go back to category selection' });
      await expect(backBtn).toBeVisible({ timeout: 20000 });

      const grid = page.locator('.journey__gallery-grid');
      const cols = await grid.evaluate((el) =>
        window.getComputedStyle(el).gridTemplateColumns
      );
      // Single column means only one column value
      const colCount = cols.split(' ').filter((c) => c !== '').length;
      expect(colCount).toBe(1);
    });

    test('should have all language buttons accessible on mobile', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      for (const lang of ['EN', 'GU', 'HI']) {
        const btn = page.getByRole('button', { name: `Switch to ${lang}` });
        await expect(btn).toBeVisible();
      }
    });
  });

  test.describe('Tablet Viewport (iPad — 768×1024)', () => {
    test.use({ viewport: { width: 768, height: 1024 } });

    test('should render correctly at tablet breakpoint boundary', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      const logo = page.locator('.header__logo-text').first();
      await expect(logo).toBeVisible();

      const interiorBtn = page.getByRole('button', { name: 'View interior projects' });
      const exteriorBtn = page.getByRole('button', { name: 'View exterior projects' });
      await expect(interiorBtn).toBeVisible();
      await expect(exteriorBtn).toBeVisible();
    });
  });
});
