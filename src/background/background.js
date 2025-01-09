import { DEEPSEEK_CONFIG } from '../config/index.js';

// 监听扩展安装事件
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
  // 设置默认配置
  chrome.storage.sync.set({
    theme: 'light',
    language: 'zh',
    summaryLength: 'medium'
  });
});

// 配置信息
const SUMMARY_LENGTH_CONFIG = {
  short: {
    max_tokens: 150,
    temperature: 0.3
  },
  medium: {
    max_tokens: 500,
    temperature: 0.3
  },
  long: {
    max_tokens: 800,
    temperature: 0.3
  }
};

// 监听来自popup的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request);

  if (request.action === 'summarize') {
    (async () => {
      try {
        console.log('Starting summarization with content:', request.content.substring(0, 100) + '...');
        
        // 获取当前语言
        const { language } = await chrome.storage.sync.get('language');
        
        // 构建提示词
        const prompt = language === 'zh' 
          ? `请对以下内容进行摘要总结：\n\n${request.content}`
          : `Please summarize the following content:\n\n${request.content}`;

        // 调用API生成摘要
        const response = await fetch(`${DEEPSEEK_CONFIG.API_BASE_URL}${DEEPSEEK_CONFIG.ENDPOINT}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DEEPSEEK_CONFIG.API_KEY}`
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ],
            ...SUMMARY_LENGTH_CONFIG[request.length]
          })
        });

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
          throw new Error('Invalid API response format');
        }

        sendResponse({
          success: true,
          summary: data.choices[0].message.content.trim()
        });
      } catch (error) {
        console.error('Error in background script:', error);
        sendResponse({
          success: false,
          error: error.message || '生成摘要时发生错误'
        });
      }
    })();

    return true; // 保持消息通道打开
  }
});