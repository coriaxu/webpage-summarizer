import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import ThemeSelector from './components/ThemeSelector.jsx';
import LanguageSelector from './components/LanguageSelector.jsx';
import SummaryLengthControl from './components/SummaryLengthControl.jsx';
import SummaryResult from './components/SummaryResult.jsx';

function App() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [summaryLength, setSummaryLength] = useState('medium');

  const generateSummary = async () => {
    setIsLoading(true);
    setError('');
    setSummary('');

    try {
      // 获取当前标签页
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // 发送消息到content script获取页面内容
      const response = await chrome.runtime.sendMessage({
        action: 'summarize',
        content: await chrome.tabs.sendMessage(tab.id, { action: 'getContent' }),
        length: summaryLength
      });

      if (response.success) {
        setSummary(response.summary);
      } else {
        setError(response.error || '生成摘要时发生错误');
      }
    } catch (err) {
      setError(err.message || '生成摘要时发生错误');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateSummary();
  }, []);

  return (
    <div className={`app-container theme-${theme}`}>
      <header className="app-header">
        <h1>{language === 'zh' ? '网页智能摘要' : 'Smart Page Summary'}</h1>
        <div className="controls">
          <ThemeSelector />
          <LanguageSelector />
        </div>
      </header>

      <main className="main-content">
        <div className="toolbar">
          <SummaryLengthControl
            value={summaryLength}
            onChange={setSummaryLength}
          />
          <button 
            className="button refresh-button"
            onClick={generateSummary}
            disabled={isLoading}
          >
            {language === 'zh' ? '重新生成' : 'Refresh'}
          </button>
        </div>

        <SummaryResult
          summary={summary}
          error={error}
          isLoading={isLoading}
          language={language}
        />
      </main>
    </div>
  );
}

export default App;