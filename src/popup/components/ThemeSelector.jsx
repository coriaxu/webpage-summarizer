import React from 'react';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import { useLanguage } from '../../contexts/LanguageContext.jsx';

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();
  const { language } = useLanguage();

  const themes = [
    { id: 'light', icon: '☀️', label: { zh: '浅色', en: 'Light' } },
    { id: 'dark', icon: '🌙', label: { zh: '深色', en: 'Dark' } },
  ];

  return (
    <div className="selector theme-selector">
      {themes.map(({ id, icon, label }) => (
        <button
          key={id}
          className={`selector-option ${theme === id ? 'active' : ''}`}
          onClick={() => setTheme(id)}
          title={label[language === 'zh' ? 'zh' : 'en']}
        >
          <span className="selector-icon">{icon}</span>
          <span className="selector-label">
            {label[language === 'zh' ? 'zh' : 'en']}
          </span>
        </button>
      ))}
    </div>
  );
};

export default ThemeSelector;