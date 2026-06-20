import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content before rendering via dangerouslySetInnerHTML.
 * Required by PRD §3 — Input Validation & Sanitization.
 * All CMS/translation data must pass through this before DOM injection.
 */
export const sanitize = (dirty) => {
  if (typeof dirty !== 'string') return '';
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'span'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  });
};

/**
 * Create sanitized HTML object for React's dangerouslySetInnerHTML.
 */
export const createSafeHTML = (dirty) => ({
  __html: sanitize(dirty),
});
