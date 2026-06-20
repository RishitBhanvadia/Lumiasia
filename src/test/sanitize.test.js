import { describe, it, expect } from 'vitest';
import { sanitize, createSafeHTML } from '../utils/sanitize';

describe('sanitize — DOMPurify wrapper', () => {
  it('should allow safe HTML tags', () => {
    const input = '<p>Hello <strong>world</strong></p>';
    const result = sanitize(input);
    expect(result).toBe('<p>Hello <strong>world</strong></p>');
  });

  it('should strip dangerous script tags', () => {
    const input = '<script>alert("xss")</script><p>Safe</p>';
    const result = sanitize(input);
    expect(result).not.toContain('<script>');
    expect(result).toContain('<p>Safe</p>');
  });

  it('should strip onerror attributes', () => {
    const input = '<img onerror="alert(1)" src="x" />';
    const result = sanitize(input);
    expect(result).not.toContain('onerror');
  });

  it('should strip disallowed tags like iframe', () => {
    const input = '<iframe src="https://evil.com"></iframe><p>OK</p>';
    const result = sanitize(input);
    expect(result).not.toContain('<iframe');
    expect(result).toContain('<p>OK</p>');
  });

  it('should return empty string for non-string input', () => {
    expect(sanitize(null)).toBe('');
    expect(sanitize(undefined)).toBe('');
    expect(sanitize(123)).toBe('');
  });

  it('createSafeHTML should return __html object', () => {
    const result = createSafeHTML('<p>Test</p>');
    expect(result).toHaveProperty('__html');
    expect(result.__html).toBe('<p>Test</p>');
  });
});
