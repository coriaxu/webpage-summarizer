import React from 'react';

const lengthOptions = [
  { id: 'short', name: '简短' },
  { id: 'medium', name: '中等' },
  { id: 'long', name: '详细' }
];

function SummaryLengthControl({ value, onChange }) {
  return (
    <div className="summary-length-control">
      <label>摘要长度：</label>
      <div className="length-options">
        {lengthOptions.map(option => (
          <button
            key={option.id}
            className={`length-option ${value === option.id ? 'active' : ''}`}
            onClick={() => onChange(option.id)}
          >
            {option.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SummaryLengthControl;
