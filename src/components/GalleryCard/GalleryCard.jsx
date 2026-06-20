import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * <GalleryCard />
 * PRD §5.2 — Blueprint-to-Reality Scroll Transition
 * PRD §6 — Dual-layer image component.
 *
 * Props:
 *   wireframeImg (string) — URL to technical sketch/blueprint
 *   finalImg (string) — URL to photorealistic 3D render
 *
 * Behaviour:
 *   Layer 1 (Wireframe): Renders first with grayscale + reduced opacity.
 *   Layer 2 (Reality): Overlaid, revealed via clip-path wipe on scroll.
 *   Trigger: Top of element hits 70% viewport height.
 *   Scroll through 100vh container wipes clip-path from inset(100% 0 0 0) → inset(0% 0 0 0).
 */
export default function GalleryCard({ wireframeImg = '', finalImg = '' }) {
  const containerRef = useRef(null);
  const realityLayerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !realityLayerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        realityLayerRef.current,
        {
          clipPath: 'inset(100% 0 0 0)',
        },
        {
          clipPath: 'inset(0% 0 0 0)',
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const hasWireframe = wireframeImg && wireframeImg.length > 0;
  const hasFinal = finalImg && finalImg.length > 0;

  return (
    <div className="gallery-card" ref={containerRef}>
      {/* Layer 1 — Wireframe (sketch/blueprint) */}
      <div className="gallery-card__wireframe">
        {hasWireframe ? (
          <img
            src={wireframeImg}
            alt="Architectural wireframe"
            className="gallery-card__img gallery-card__img--wireframe"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="gallery-card__placeholder gallery-card__placeholder--wireframe">
            <svg
              viewBox="0 0 200 150"
              className="gallery-card__placeholder-svg"
              aria-hidden="true"
            >
              {/* Blueprint-style grid lines */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                </pattern>
              </defs>
              <rect width="200" height="150" fill="url(#grid)" />
              {/* Abstract building outline */}
              <rect x="60" y="30" width="30" height="90" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
              <rect x="95" y="50" width="45" height="70" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
              <line x1="40" y1="120" x2="160" y2="120" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
            </svg>
            <span className="gallery-card__placeholder-text">Blueprint</span>
          </div>
        )}
      </div>

      {/* Layer 2 — Reality (photorealistic render) */}
      <div className="gallery-card__reality" ref={realityLayerRef}>
        {hasFinal ? (
          <img
            src={finalImg}
            alt="Photorealistic render"
            className="gallery-card__img gallery-card__img--reality"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="gallery-card__placeholder gallery-card__placeholder--reality">
            <svg
              viewBox="0 0 200 150"
              className="gallery-card__placeholder-svg"
              aria-hidden="true"
            >
              {/* Solid architectural shape */}
              <rect x="60" y="30" width="30" height="90" fill="currentColor" opacity="0.15" />
              <rect x="95" y="50" width="45" height="70" fill="currentColor" opacity="0.1" />
              <rect x="40" y="118" width="120" height="4" fill="currentColor" opacity="0.08" />
            </svg>
            <span className="gallery-card__placeholder-text">Reality</span>
          </div>
        )}
      </div>
    </div>
  );
}
