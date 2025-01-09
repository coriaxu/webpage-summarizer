import React from 'react';

const themes = [
  { id: 'blue', name: '蓝色' },
  { id: 'green', name: '绿色' },
  { id: 'orange', name: '橙色' }
];

function ThemeSelector({ value, onChange }) {
  return (
    <div className="theme-selector">
      <label>主题：</label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="theme-select"
      >
        {themes.map(theme => (
          <option key={theme.id} value={theme.id}>
            {theme.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ThemeSelector;
