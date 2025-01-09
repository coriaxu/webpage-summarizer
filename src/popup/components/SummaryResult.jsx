import React from 'react';

function SummaryResult({ summary, isLoading }) {
  if (isLoading) {
    return (
      <div className="summary-result loading">
        <div className="loading-spinner"></div>
        <p>正在生成摘要，请稍候...</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="summary-result empty">
        <p>点击"生成摘要"按钮开始分析当前页面</p>
      </div>
    );
  }

  return (
    <div className="summary-result">
      <div className="summary-content">
        {summary}
      </div>
      <div className="summary-actions">
        <button
          className="action-button"
          onClick={() => navigator.clipboard.writeText(summary)}
        >
          复制到剪贴板
        </button>
      </div>
    </div>
  );
}

export default SummaryResult;
