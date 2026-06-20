import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Lumiasia Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('Home page should not have any automatically detectable accessibility issues', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Gallery page should not have any automatically detectable accessibility issues', async ({ page }) => {
    // Navigate to gallery using stable aria-label
    const interiorBtn = page.getByRole('button', { name: 'View interior projects' });
    await interiorBtn.click();

    // Wait for gallery to fully mount
    const backBtn = page.getByRole('button', { name: 'Go back to category selection' });
    await expect(backBtn).toBeVisible({ timeout: 20000 });

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
