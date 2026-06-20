Product Requirements

Document

Luxury Architecture & Interior Design Platform

Comprehensive Technical Specification
Status: Ready for AI Agent Ingestion
Build Phase: Empty Shell Generation


1. System Architecture & Tech Stack

This document serves as the master blueprint for generating the foundational shell of the platform. The
system must be initialized with placeholders for all media and textual content.
Frontend Framework: React.js (Functional components, Hooks).
3D Engine: Three.js wrapped in @react-three/fiber and @react-three/drei.
Animation Engine: Framer Motion (for DOM routing/UI) and GSAP (for scroll-linked 3D Canvas
timeline control).
Styling: Tailwind CSS customized via tailwind.config.js tokens.
Localization: react-i18next initialized with empty dictionaries for EN, GU, and HI.

2. Database Architecture & Data Mapping

The frontend will be decoupled from a Headless CMS/Database (e.g., Sanity, Supabase). The application
state must map to the following exact JSON schema structure. The UI must render empty states if these fields
are null.
2.1 Schema: Projects Collection
Field Type Description / Mapping target
project_id UUID Unique identifier.
category Enum INTERIOR | EXTERIOR. Drives routing.
title_i18n Object { en: "", gu: "", hi: "" }
asset_wireframe_url String URL to the technical sketch/blueprint.
asset_final_url String URL to the photorealistic 3D render.
model_3d_url String Optional .glb/.gltf for canvas injection.

2.2 State Management
Implement a global context (Zustand or React Context) to manage:


interface AppState {
activeCategory: 'INTERIOR' | 'EXTERIOR' | null;
currentLanguage: 'EN' | 'GU' | 'HI';
scrollProgress: number; // 0.0 to 1.0
isTransitioning: boolean;
}

3. Security Protocols

Although currently an empty shell, the scaffolding must include the following security implementations
standard for production.
Content Security Policy (CSP): Configure headers to only allow WebGL execution from the same
origin. script-src 'self'; worker-src 'self' blob:;
CORS Configuration: Set up API utility fetchers with strict CORS headers restricting requests to the
future CMS origin.
Input Validation & Sanitization: Any data ingested from the translation JSONs or CMS must be
sanitized using DOMPurify before being rendered via dangerouslySetInnerHTML.
Rate Limiting: Prepare Axios interceptors to handle 429 Too Many Requests gracefully with a fallback
UI state.

4. UI/UX Design System (Exact Specs)

4.1 CSS Variables & Theming
Inject these exactly into the root CSS or Tailwind configuration.


:root {
--color-bg-base: #F9F8F6; /* Luxurious Cream */
--color-bg-surface: #F2F0EB; /* Slightly darker cream for depth */
--color-text-primary: #2C2A29; /* Soft Charcoal */
--color-text-muted: #757371; /* Subtle text */
--color-accent-gold: #D4AF37; /* Warm Gold */
--font-heading: 'Georgia', serif; /* Placeholder for premium serif */
--font-body: 'Helvetica Neue', sans-serif;
--spacing-xs: 0.5rem;
--spacing-xl: 6rem;
--spacing-section: 12rem; /* Massive breathing room */
}

4.2 Textures & Overlays
The screen must have a continuous, subtle noise texture over the entire DOM (pointer-events: none; z-index:
9999) to simulate physical architectural paper. Opacity: 0.03, Mix-blend-mode: multiply.

5. Core Animations, Transitions &
Movements

5.1 The "Perspective Shift" Hero Element
Initial State: Center screen split. Two empty interactive hitboxes: [Interiors] and [Exteriors].
Movement - Interiors Click:
Camera Object in Three.js transitions: Z-axis -50 (Zoom inward).
Easing: CustomBezier(0.85, 0, 0.15, 1) (Cinematic ease-in-out).
Duration: 2.4s.
DOM Action: Hero UI fades out (opacity 1 to 0 over 1s). "Welcome" section fades in.
Movement - Exteriors Click:
Camera Object transitions: Z-axis +50, Y-axis +10 (Pan outward and slightly up).
Easing: CustomBezier(0.85, 0, 0.15, 1).
Duration: 2.4s.

5.2 Blueprint-to-Reality Scroll Transition
Implemented in the Gallery Component via IntersectionObserver + GSAP.
Trigger: Top of element hits 70% viewport height.
Layer 1 (Wireframe): Renders first. filter: grayscale(100%) opacity(0.8);
Layer 2 (Reality): Overlaid directly on top. Initial state: clip-path: inset(100% 0 0 0);
Scroll Movement: As user scrolls through the 100vh container, the clip-path on Layer 2 animates
to inset(0% 0 0 0), creating a smooth vertical wipe effect revealing the photorealistic render over
the sketch.

6. Component Specifications

Generate these exact React components with empty div placeholders.
<Header />: Fixed top. Contains absolute positioned language toggle (EN|GU|HI). Mix-blend-mode:
difference.
<HeroCanvas />: The persistent Three.js context spanning 100vw/100vh fixed behind the DOM.
<JourneyFlow />: The main routing container. Hides overflow during transition.
<GalleryCard />: The dual-layer image component for the blueprint transition. Must accept props:
wireframeImg, finalImg.

7. Build & Post-Build Implementation
Plan

7.1 Phase 1: Core Shell Construction (Current AI Task)
The AI must output the folder structure, package dependencies, React scaffolding, global state handlers, and
empty components mapped to the exact CSS variables and animation logic listed above. No hardcoded
content should be present.
7.2 Phase 2: Post-Build Integration (Future Manual Steps)
Content Injection: Connect the Headless CMS API to populate the Projects global state.
Asset Loading: Replace the <mesh /> placeholders in the Three.js canvas with optimized .glb
architecture models.


Performance Optimization: Implement WebGL fallback for low-end devices. Run Lighthouse audits
focusing on Cumulative Layout Shift (CLS) due to custom fonts and large images.
