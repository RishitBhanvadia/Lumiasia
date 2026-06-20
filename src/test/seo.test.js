import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * SEO & Security Meta Tag Tests
 * Validates that index.html contains all required meta tags
 * for search engine optimization and Content Security Policy.
 */

const htmlContent = readFileSync(
  resolve(__dirname, '../../index.html'),
  'utf-8'
);

describe('SEO Meta Tags', () => {
  it('should have a descriptive <title> tag', () => {
    expect(htmlContent).toMatch(/<title>[^<]*Lumiasia[^<]+<\/title>/);
  });

  it('should have a meta description', () => {
    expect(htmlContent).toMatch(/<meta\s+name="description"\s+content="[^"]{50,}"/);
  });

  it('should have meta keywords', () => {
    expect(htmlContent).toMatch(/<meta\s+name="keywords"\s+content="[^"]+"/);
  });

  it('should have a meta author', () => {
    expect(htmlContent).toMatch(/<meta\s+name="author"\s+content="[^"]+"/);
  });

  it('should have a viewport meta tag', () => {
    expect(htmlContent).toMatch(/<meta\s+name="viewport"/);
  });

  it('should have charset set to UTF-8', () => {
    expect(htmlContent).toMatch(/<meta\s+charset="UTF-8"/i);
  });
});

describe('Open Graph Tags', () => {
  it('should have og:type', () => {
    expect(htmlContent).toMatch(/<meta\s+property="og:type"\s+content="website"/);
  });

  it('should have og:title', () => {
    expect(htmlContent).toMatch(/<meta\s+property="og:title"\s+content="[^"]+"/);
  });

  it('should have og:description', () => {
    expect(htmlContent).toMatch(/<meta\s+property="og:description"\s+content="[^"]+"/);
  });

  it('should have og:image', () => {
    expect(htmlContent).toMatch(/<meta\s+property="og:image"\s+content="[^"]+"/);
  });
});

describe('Twitter Card Tags', () => {
  it('should have twitter:card set to summary_large_image', () => {
    expect(htmlContent).toMatch(/<meta\s+property="twitter:card"\s+content="summary_large_image"/);
  });

  it('should have twitter:title', () => {
    expect(htmlContent).toMatch(/<meta\s+property="twitter:title"\s+content="[^"]+"/);
  });

  it('should have twitter:description', () => {
    expect(htmlContent).toMatch(/<meta\s+property="twitter:description"\s+content="[^"]+"/);
  });

  it('should have twitter:image', () => {
    expect(htmlContent).toMatch(/<meta\s+property="twitter:image"\s+content="[^"]+"/);
  });
});

describe('Security Headers', () => {
  it('should have a Content-Security-Policy meta tag', () => {
    expect(htmlContent).toMatch(/<meta\s+http-equiv="Content-Security-Policy"/);
  });

  it('should restrict script-src in CSP', () => {
    expect(htmlContent).toMatch(/script-src\s+'self'/);
  });

  it('should restrict connect-src in CSP', () => {
    expect(htmlContent).toMatch(/connect-src\s+'self'/);
  });
});

describe('HTML Semantic Structure', () => {
  it('should have lang attribute on html tag', () => {
    expect(htmlContent).toMatch(/<html\s+lang="en"/);
  });

  it('should have a #root mount point', () => {
    expect(htmlContent).toMatch(/id="root"/);
  });

  it('should load main.jsx as module', () => {
    expect(htmlContent).toMatch(/<script\s+type="module"\s+src="\/src\/main\.jsx"/);
  });
});
