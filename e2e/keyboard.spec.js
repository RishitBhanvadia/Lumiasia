import { test, expect } from '@playwright/test';

test.describe('Lumiasia Keyboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('should be able to Tab through language buttons', async ({ page }) => {
    // Tab into the page — first focusable elements should be lang buttons
    // Press Tab repeatedly until we reach a language button
    let foundLangBtn = false;
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      const focused = page.locator(':focus');
      const ariaLabel = await focused.getAttribute('aria-label');
      if (ariaLabel && ariaLabel.startsWith('Switch to')) {
        foundLangBtn = true;
        break;
      }
    }
    expect(foundLangBtn).toBe(true);
  });

  test('should activate language button via Enter key', async ({ page }) => {
    // Find GU button and focus it
    const guButton = page.getByRole('button', { name: 'Switch to GU' });
    await guButton.focus();

    // Press Enter to activate
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // Verify GU is now active
    await expect(guButton).toHaveClass(/header__lang-btn--active/, { timeout: 3000 });
  });

  test('should activate category button via Enter key', async ({ page }) => {
    // Focus the Interior button
    const interiorBtn = page.getByRole('button', { name: 'View interior projects' });
    await interiorBtn.focus();

    // Press Enter to navigate
    await page.keyboard.press('Enter');

    // Gallery should appear
    const backBtn = page.getByRole('button', { name: 'Go back to category selection' });
    await expect(backBtn).toBeVisible({ timeout: 20000 });
  });

  test('should show focus-visible indicators on interactive elements', async ({ page }) => {
    // Tab to first interactive element
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const focused = page.locator(':focus');
    const count = await focused.count();
    // At least one element should be focused
    expect(count).toBeGreaterThan(0);

    // Verify the focused element has some visual outline (not outline: none)
    if (count > 0) {
      const outline = await focused.first().evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.outlineStyle;
      });
      // Browser default focus should NOT be 'none' (we haven't disabled it)
      // Accept any non-none value OR check that a box-shadow exists
      const boxShadow = await focused.first().evaluate((el) =>
        window.getComputedStyle(el).boxShadow
      );
      const hasFocusIndicator = outline !== 'none' || boxShadow !== 'none';
      expect(hasFocusIndicator).toBe(true);
    }
  });
});
