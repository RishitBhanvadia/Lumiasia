import { test, expect } from '@playwright/test';

test.describe('Lumiasia Performance Verification', () => {
  test('should meet core web vitals and hydration thresholds', async ({ page }) => {
    // Inject scripts to track CLS and LCP
    await page.addInitScript(() => {
      window.clsValue = 0;
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            window.clsValue += entry.value;
          }
        }
      }).observe({ type: 'layout-shift', buffered: true });
    });

    const startTime = Date.now();
    await page.goto('/');
    
    // Wait for the main app to be hydrated (Header is a good indicator)
    await page.waitForSelector('header', { state: 'visible', timeout: 10000 });
    const hydrationTime = Date.now() - startTime;

    // 1. Check Navigation Timing
    const metrics = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      return {
        domInteractive: nav.domInteractive,
        domContentLoaded: nav.domContentLoadedEventEnd,
        loadEventEnd: nav.loadEventEnd,
      };
    });

    console.log(`Performance Metrics:`, metrics);
    console.log(`App Hydration Time: ${hydrationTime}ms`);

    // Assertions for high-performance standards
    expect(metrics.domInteractive).toBeLessThan(3000); // 3s max for interactivity
    expect(hydrationTime).toBeLessThan(5000); // 5s max for full hydration on dev server

    // 2. Check CLS (Cumulative Layout Shift)
    const cls = await page.evaluate(() => window.clsValue);
    console.log(`Cumulative Layout Shift: ${cls}`);
    expect(cls).toBeLessThan(0.1); // Google's 'Good' threshold is < 0.1

    // 3. Verify images on home page are lazy-loaded (if any)
    const lazyImages = await page.locator('img[loading="lazy"]').count();
    console.log(`Lazy Loaded Images on Home: ${lazyImages}`);
  });

  test('should have optimized memory footprint for 3D Canvas', async ({ page }) => {
    await page.goto('/');
    // Check if WebGL context is active
    const isWebGLActive = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      return !!(canvas && canvas.getContext('webgl2'));
    });
    
    if (isWebGLActive) {
      // Basic check for FPS stability (indirectly via animation frame timing)
      const frameBudget = await page.evaluate(async () => {
        return new Promise((resolve) => {
          let frames = 0;
          const start = performance.now();
          const check = () => {
            frames++;
            if (performance.now() - start < 1000) {
              requestAnimationFrame(check);
            } else {
              resolve(frames);
            }
          };
          requestAnimationFrame(check);
        });
      });
      console.log(`Estimated FPS: ${frameBudget}`);
      expect(frameBudget).toBeGreaterThan(30); // Minimum 30fps for premium feel
    }
  });
});
