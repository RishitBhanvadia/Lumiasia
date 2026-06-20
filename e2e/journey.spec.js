import { test, expect } from '@playwright/test';

test.describe('Lumiasia E2E Journey', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate and wait for app to fully hydrate
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Extra wait for 3D canvas and React hydration
    await page.waitForTimeout(2000);
  });

  test('App loads and Interior gallery transitions correctly', async ({ page }) => {
    // Check header elements
    const logo = page.locator('.header__logo-text').first();
    await expect(logo).toBeVisible();

    // Check Hero sections exist via aria-label
    const interiorBtn = page.getByRole('button', { name: 'View interior projects' });
    const exteriorBtn = page.getByRole('button', { name: 'View exterior projects' });

    await expect(interiorBtn).toBeVisible();
    await expect(exteriorBtn).toBeVisible();

    // Click on Interior to navigate to Gallery
    await interiorBtn.click();

    // Wait for AnimatePresence exit (1s) + gallery entry animation (0.3+0.8s)
    // The back button proves the gallery view has fully mounted
    const backBtn = page.getByRole('button', { name: 'Go back to category selection' });
    await expect(backBtn).toBeVisible({ timeout: 20000 });

    // Verify heading text
    const heading = page.locator('h2');
    await expect(heading).toContainText('Interior');
  });

  test('Exterior path loads gallery correctly', async ({ page }) => {
    // Click on Exterior
    const exteriorBtn = page.getByRole('button', { name: 'View exterior projects' });
    await expect(exteriorBtn).toBeVisible();
    await exteriorBtn.click();

    // Wait for the back button to prove the gallery has mounted
    const backBtn = page.getByRole('button', { name: 'Go back to category selection' });
    await expect(backBtn).toBeVisible({ timeout: 20000 });

    // Verify heading text
    const heading = page.locator('h2');
    await expect(heading).toContainText('Exterior');
  });

  test('Back button returns to hero split view', async ({ page }) => {
    // Navigate to Interior gallery
    const interiorBtn = page.getByRole('button', { name: 'View interior projects' });
    await interiorBtn.click();

    // Wait for gallery to load
    const backBtn = page.getByRole('button', { name: 'Go back to category selection' });
    await expect(backBtn).toBeVisible({ timeout: 20000 });

    // Click the back button
    await backBtn.click();

    // Verify we're back at the hero split
    await expect(page.getByRole('button', { name: 'View interior projects' })).toBeVisible({ timeout: 20000 });
    await expect(page.getByRole('button', { name: 'View exterior projects' })).toBeVisible();
  });

  test('Language switching updates active button state', async ({ page }) => {
    // Find the GU language button and click it
    const guButton = page.getByRole('button', { name: 'Switch to GU' });
    await expect(guButton).toBeVisible();
    await guButton.click();

    // Wait for React state update to propagate
    await page.waitForTimeout(1000);

    // Verify GU button has the active class
    await expect(guButton).toHaveClass(/header__lang-btn--active/, { timeout: 5000 });

    // Verify EN button no longer has the active class
    const enButton = page.getByRole('button', { name: 'Switch to EN' });
    await expect(enButton).not.toHaveClass(/header__lang-btn--active/);
  });
});
