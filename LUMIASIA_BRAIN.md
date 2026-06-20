# Lumiasia — Technical Brain & Architecture

This document serves as the master architectural map for the Lumiasia platform. It distills the "intelligence" of the codebase, explaining the *why* behind the implementation details.

---

## 1. Core Architecture

Lumiasia is a "Hybrid Canvas" application. It seamlessly blends a **persistent 3D WebGL background** with a **React-driven DOM foreground**.

- **Framework**: Vite + React (SPA)
- **State**: Zustand (`useAppStore.js`)
- **3D**: Three.js + React Three Fiber + Drei
- **Animations**: GSAP (Timeline/Scroll) + Framer Motion (Transitions)

---

## 2. Animation Philosophy

### The "Perspective Shift" (Hero)
- **Logic**: The Hero screen is not a static page; it's a window into the 3D scene. 
- **Trigger**: Clicking "INTERIOR" or "EXTERIOR" updates `activeCategory`.
- **Movement**: 
  - `INTERIOR`: Zoom-in (Z -50).
  - `EXTERIOR`: Pan-out (Z +50, Y +10).
- **Implementation**: GSAP handles the `camera.position` lerping, while Framer Motion's `AnimatePresence` handles the UI exit/entry.

### The "Blueprint Wipe" (Gallery)
- **Logic**: Visualizing the transition from concept (wireframe) to reality (render).
- **Implementation**: Two overlapping `<img>` tags in `GalleryCard.jsx`.
- **Effect**: GSAP `scrollTrigger` animates the `clip-path: inset(...)` of the top layer, revealing the photorealistic render as the user scrolls.

---

## 3. Localization Strategy (i18n)

- **Library**: `react-i18next`
- **Structure**: `src/i18n/locales/[en|gu|hi].json`
- **Verification**: `i18nCompleteness.test.js` ensures that every key added to `en.json` is also present and non-empty in `gu.json` and `hi.json`.
- **Sanitization**: All localized strings are passed through `DOMPurify` to allow safe HTML entities without XSS risk.

---

## 4. Testing & Verification Hierarchy

Lumiasia uses a multi-layered verification strategy:

1. **Unit (Vitest)**: Fast, isolated tests for state logic, sanitization, and component structure.
2. **E2E (Playwright)**: Full browser journeys.
   - **Sequential Execution**: Tests run with `workers: 1` to prevent race conditions during 3D initialization.
   - **Hydration Wait**: `e2e/a11y.spec.js` and others include a 2s delay to ensure the 3D canvas is hydrated before scanning.
3. **Performance**: Automated LCP/CLS checks in `e2e/performance.spec.js`.
4. **Accessibility**: Axe-core scans integrated into Playwright.

---

## 5. Security & Stability

- **CSP**: Strict Content Security Policy in `index.html` restricts script execution to `'self'`.
- **Error Handling**: A global `ErrorBoundary` wraps the app to provide a branded recovery UI if the 3D context or React tree crashes.
- **WebGL Fallback**: `HeroCanvas.jsx` checks for support via `utils/webglCheck.js`. If missing, it renders a high-fidelity 2D gradient background.

---

## 6. Project Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Local development server |
| `npm run build` | Production build (Vite) |
| `npm run test` | Run all unit tests (Vitest) |
| `npx playwright test` | Run all E2E tests |
| `npx playwright show-report` | View E2E results |

---

## 7. Mental Model for Future Maintenance

When adding a new feature:
1. **Update `PRD-Lumiasia.md`** first.
2. **Implement State** in `useAppStore.js` if global logic changes.
3. **Add Strings** to all three i18n JSONs (Verification will fail otherwise).
4. **Run Unit Tests** to catch breaking UI changes.
5. **Run E2E Tests** to verify the journey still works.
