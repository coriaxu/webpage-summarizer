import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import ThemeSelector from './components/ThemeSelector.jsx';
import LanguageSelector from './components/LanguageSelector.jsx';
import SummaryLengthControl from './components/SummaryLengthControl.jsx';
import SummaryResult from './components/SummaryResult.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import '../styles/popup.css';

function App() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [summaryLength, setSummaryLength] = useState('medium');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        // 获取当前标签页
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab) {
          throw new Error('无法获取当前标签页');
        }
        //注入content script
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        });
      } catch (err) {
        console.error("Failed to initialize extension:", err);
        setError('Failed to initialize extension.');
      }
    };
    init();
  }, []);

  const handleSummarize = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSummary('');
      
      console.log('Starting summarization...');
      
      // 获取当前标签页
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) {
        throw new Error('无法获取当前标签页');
      }

      console.log('Current tab:', tab.id);

      console.log('Content script injected');

      // 发送消息给content script
      const response = await new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(tab.id, { 
          action: 'getSummary',
          length: summaryLength
        }, response => {
          console.log('Received response from content script:', response);
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(response);
          }
        });
      });

      console.log('Processing response:', response);

      if (!response) {
        throw new Error('无法与页面通信');
      }

      if (!response.success) {
        throw new Error(response.error || '生成摘要失败');
      }

      console.log('Setting summary:', response.summary);
      setSummary(response.summary);
    } catch (err) {
      console.error('Error in handleSummarize:', err);
      setError(err.message || '无法与页面通信。请确保页面已完全加载。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className={`app-container theme-${theme}`}>
        <header className="app-header">
          <h1>网页智能摘要</h1>
          <div className="controls">
            <ThemeSelector value={theme} onChange={setTheme} />
            <LanguageSelector value={language} onChange={setLanguage} />
          </div>
        </header>

        <main className="app-main">
          <SummaryLengthControl value={summaryLength} onChange={setSummaryLength} />
          
          <button 
            className="summarize-button"
            onClick={handleSummarize}
            disabled={isLoading}
          >
            {isLoading ? '正在生成摘要...' : '生成摘要'}
          </button>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <SummaryResult summary={summary} />
        </main>

        <footer className="app-footer">
          <p>Powered by DeepSeek</p>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;