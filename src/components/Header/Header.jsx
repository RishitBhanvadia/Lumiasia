import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import useAppStore from '../../store/useAppStore';

const LANGUAGES = ['EN', 'GU', 'HI'];

/**
 * <Header />
 * PRD §6 — Fixed top bar with absolute-positioned language toggle.
 * mix-blend-mode: difference for contrast against any background.
 */
export default function Header() {
  const { i18n } = useTranslation();
  const { currentLanguage, setLanguage } = useAppStore();

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <motion.header
      className="header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.85, 0, 0.15, 1] }}
    >
      <div className="header__logo">
        <span className="header__logo-text">LUMIASIA</span>
      </div>

      <nav className="header__lang-toggle" aria-label="Language selection">
        {LANGUAGES.map((lang, index) => (
          <span key={lang} className="header__lang-item">
            <button
              type="button"
              className={`header__lang-btn ${
                currentLanguage === lang ? 'header__lang-btn--active' : ''
              }`}
              onClick={() => handleLanguageChange(lang)}
              aria-current={currentLanguage === lang ? 'true' : undefined}
              aria-label={`Switch to ${lang}`}
            >
              {lang}
            </button>
            {index < LANGUAGES.length - 1 && (
              <span className="header__lang-separator" aria-hidden="true">|</span>
            )}
          </span>
        ))}
      </nav>
    </motion.header>
  );
}
