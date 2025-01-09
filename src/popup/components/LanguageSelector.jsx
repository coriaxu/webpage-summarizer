import React from 'react';

const languages = [
  { id: 'zh-CN', name: '中文' },
  { id: 'en', name: 'English' }
];

function LanguageSelector({ value, onChange }) {
  return (
    <div className="language-selector">
      <label>语言：</label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="language-select"
      >
        {languages.map(lang => (
          <option key={lang.id} value={lang.id}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default LanguageSelector;
