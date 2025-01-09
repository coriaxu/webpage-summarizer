import React from 'react';

const SummaryResult = ({ summary, error, isLoading, language }) => {
  if (isLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner" />
        <span>{language === 'zh' ? '正在生成摘要...' : 'Generating summary...'}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <svg className="error-icon" viewBox="0 0 24 24" width="20" height="20">
          <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        <span>{error}</span>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="empty-state">
        <svg className="empty-icon" viewBox="0 0 24 24" width="48" height="48">
          <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
        <p>{language === 'zh' ? '等待生成摘要...' : 'Waiting for summary...'}</p>
      </div>
    );
  }

  return (
    <div className="summary-container">
      <div className="summary-header">
        <svg className="summary-icon" viewBox="0 0 24 24" width="20" height="20">
          <path fill="currentColor" d="M14 17H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2zM19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
        </svg>
        <h2>{language === 'zh' ? '摘要内容' : 'Summary'}</h2>
      </div>
      <p className="summary-text">{summary}</p>
      <div className="summary-footer">
        <span className="summary-info">
          {language === 'zh' ? '由 DeepSeek 提供支持' : 'Powered by DeepSeek'}
        </span>
      </div>
    </div>
  );
};

export default SummaryResult;