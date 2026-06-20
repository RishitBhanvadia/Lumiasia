import { useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import useAppStore from '../../store/useAppStore';
import GalleryCard from '../GalleryCard/GalleryCard';

/**
 * <JourneyFlow />
 * PRD §6 — Main routing container. Hides overflow during transition.
 * Contains the hero split view with [Interiors] / [Exteriors] hitboxes
 * and transitions to the gallery view on selection.
 */


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 1, ease: [0.85, 0, 0.15, 1] },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.85, 0, 0.15, 1] },
  },
};

function HeroSplit() {
  const { t } = useTranslation();
  const setCategory = useAppStore((s) => s.setCategory);

  return (
    <motion.div
      className="journey__hero"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.h1 className="journey__hero-title" variants={itemVariants}>
        {t('hero.title') || 'Architecture & Design'}
      </motion.h1>

      <motion.p className="journey__hero-subtitle" variants={itemVariants}>
        {t('hero.subtitle') || 'Where vision meets structure'}
      </motion.p>

      <motion.div className="journey__hero-choices" variants={itemVariants}>
        <button
          type="button"
          className="journey__choice journey__choice--interiors"
          onClick={() => setCategory('INTERIOR')}
          aria-label="View interior projects"
        >
          <span className="journey__choice-label">
            {t('hero.interiors') || 'Interiors'}
          </span>
          <span className="journey__choice-line" aria-hidden="true" />
        </button>

        <span className="journey__choice-divider" aria-hidden="true" />

        <button
          type="button"
          className="journey__choice journey__choice--exteriors"
          onClick={() => setCategory('EXTERIOR')}
          aria-label="View exterior projects"
        >
          <span className="journey__choice-label">
            {t('hero.exteriors') || 'Exteriors'}
          </span>
          <span className="journey__choice-line" aria-hidden="true" />
        </button>
      </motion.div>
    </motion.div>
  );
}

function GalleryView() {
  const { t } = useTranslation();
  const { activeCategory, resetState, projects, currentLanguage, isLoadingProjects } = useAppStore();

  const filteredProjects = projects.filter((p) => p.category === activeCategory);

  return (
    <motion.div
      className="journey__gallery"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div className="journey__gallery-header" variants={itemVariants}>
        <button
          type="button"
          className="journey__back-btn"
          onClick={resetState}
          aria-label="Go back to category selection"
        >
          ← Back
        </button>
        <h2 className="journey__gallery-title">
          {activeCategory === 'INTERIOR' ? 'Interior' : 'Exterior'} Projects
        </h2>
      </motion.div>

      <motion.div className="journey__gallery-grid" variants={containerVariants}>
        {isLoadingProjects ? (
          <div style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>Loading projects...</div>
        ) : filteredProjects.length === 0 ? (
          <div style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>No projects found.</div>
        ) : (
          filteredProjects.map((project) => (
            <motion.div key={project.project_id} variants={itemVariants}>
              <GalleryCard
                wireframeImg={project.asset_wireframe_url}
                finalImg={project.asset_final_url}
              />
              <div style={{ 
                marginTop: '1.5rem', 
                textAlign: 'center', 
                fontFamily: 'var(--font-heading)', 
                color: 'var(--color-text-primary)',
                letterSpacing: '0.05em'
              }}>
                {project.title_i18n[currentLanguage.toLowerCase()] || project.title_i18n['en']}
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
}

export default function JourneyFlow() {
  const activeCategory = useAppStore((s) => s.activeCategory);
  const isTransitioning = useAppStore((s) => s.isTransitioning);

  return (
    <main
      className="journey"
      style={{ overflow: isTransitioning ? 'hidden' : 'visible' }}
    >
      <AnimatePresence mode="wait">
        {activeCategory === null ? (
          <HeroSplit key="hero" />
        ) : (
          <GalleryView key="gallery" />
        )}
      </AnimatePresence>
    </main>
  );
}
