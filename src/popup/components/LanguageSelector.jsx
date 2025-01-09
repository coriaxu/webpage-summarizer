import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext.jsx';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { id: 'zh', icon: '🇨🇳', label: '中文' },
    { id: 'en', icon: '🇺🇸', label: 'English' },
  ];

  return (
    <div className="selector language-selector">
      {languages.map(({ id, icon, label }) => (
        <button
          key={id}
          className={`selector-option ${language === id ? 'active' : ''}`}
          onClick={() => setLanguage(id)}
          title={label}
        >
          <span className="selector-icon">{icon}</span>
          <span className="selector-label">{label}</span>
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;