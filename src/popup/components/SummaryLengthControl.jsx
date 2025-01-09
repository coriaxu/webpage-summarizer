import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext.jsx';

const SummaryLengthControl = ({ value, onChange }) => {
  const { language } = useLanguage();

  const lengths = [
    { id: 'short', label: { zh: '简短', en: 'Short' } },
    { id: 'medium', label: { zh: '中等', en: 'Medium' } },
    { id: 'long', label: { zh: '详细', en: 'Long' } }
  ];

  return (
    <div className="summary-length-control">
      <label>摘要长度：</label>
      <div className="length-options">
        {lengths.map(({ id, label }) => (
          <button
            key={id}
            className={`length-option ${value === id ? 'active' : ''}`}
            onClick={() => onChange(id)}
          >
            {label[language === 'zh' ? 'zh' : 'en']}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SummaryLengthControl;