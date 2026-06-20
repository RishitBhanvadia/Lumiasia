import { describe, it, expect } from 'vitest';
import i18n from '../i18n';

describe('i18n — Localization', () => {
  it('should initialize with EN as default language', () => {
    expect(i18n.language).toBe('EN');
  });

  it('should have EN, GU, and HI resources loaded', () => {
    expect(i18n.hasResourceBundle('EN', 'translation')).toBe(true);
    expect(i18n.hasResourceBundle('GU', 'translation')).toBe(true);
    expect(i18n.hasResourceBundle('HI', 'translation')).toBe(true);
  });

  it('should switch language to GU', async () => {
    await i18n.changeLanguage('GU');
    expect(i18n.language).toBe('GU');
  });

  it('should switch language to HI', async () => {
    await i18n.changeLanguage('HI');
    expect(i18n.language).toBe('HI');
  });

  it('should fall back to EN for unknown language', async () => {
    await i18n.changeLanguage('FR');
    // Fallback should still work
    expect(i18n.t('common.loading')).toBe('Loading...');
  });

  it('should have expected translation keys in EN', () => {
    const enTranslations = i18n.getResourceBundle('EN', 'translation');
    expect(enTranslations).toHaveProperty('hero');
    expect(enTranslations).toHaveProperty('gallery');
    expect(enTranslations).toHaveProperty('welcome');
    expect(enTranslations).toHaveProperty('common');
  });
});
