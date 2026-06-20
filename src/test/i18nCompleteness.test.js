import { describe, it, expect } from 'vitest';
import en from '../i18n/locales/en.json';
import gu from '../i18n/locales/gu.json';
import hi from '../i18n/locales/hi.json';

/**
 * i18n Completeness Tests
 * Ensures all locale files have identical key structures
 * and that no translation values are left empty.
 */

/**
 * Recursively extract all dot-notation keys from a nested object.
 * e.g., { hero: { title: "x" } } → ["hero.title"]
 */
function flattenKeys(obj, prefix = '') {
  return Object.entries(obj).reduce((keys, [key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return keys.concat(flattenKeys(value, fullKey));
    }
    return keys.concat(fullKey);
  }, []);
}

/**
 * Recursively check that no leaf values are empty strings.
 */
function findEmptyValues(obj, prefix = '') {
  const empties = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      empties.push(...findEmptyValues(value, fullKey));
    } else if (value === '') {
      empties.push(fullKey);
    }
  }
  return empties;
}

describe('i18n Locale Completeness', () => {
  const enKeys = flattenKeys(en).sort();
  const guKeys = flattenKeys(gu).sort();
  const hiKeys = flattenKeys(hi).sort();

  it('should have identical key structure across EN, GU, and HI', () => {
    expect(guKeys).toEqual(enKeys);
    expect(hiKeys).toEqual(enKeys);
  });

  it('EN locale should have no empty translation values', () => {
    const empties = findEmptyValues(en);
    expect(empties).toEqual([]);
  });

  it('GU locale should have no empty translation values', () => {
    const empties = findEmptyValues(gu);
    expect(empties).toEqual([]);
  });

  it('HI locale should have no empty translation values', () => {
    const empties = findEmptyValues(hi);
    expect(empties).toEqual([]);
  });

  it('should have at least 10 translation keys per locale', () => {
    expect(enKeys.length).toBeGreaterThanOrEqual(10);
    expect(guKeys.length).toBeGreaterThanOrEqual(10);
    expect(hiKeys.length).toBeGreaterThanOrEqual(10);
  });

  it('GU locale should contain Gujarati script characters', () => {
    const guString = JSON.stringify(gu);
    // Gujarati Unicode range: U+0A80–U+0AFF
    expect(guString).toMatch(/[\u0A80-\u0AFF]/);
  });

  it('HI locale should contain Devanagari script characters', () => {
    const hiString = JSON.stringify(hi);
    // Devanagari Unicode range: U+0900–U+097F
    expect(hiString).toMatch(/[\u0900-\u097F]/);
  });
});
