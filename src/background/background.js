import { DEEPSEEK_CONFIG, API_ERROR_MESSAGES } from '../config/index.js';

// 监听扩展安装事件
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
  // 设置默认配置
  chrome.storage.sync.set({
    theme: 'blue',
    language: 'zh-CN',
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

// 监听来自content script的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request);

  if (request.action === 'summarize') {
    const tabId = sender.tab?.id;
    if (!tabId) {
      sendResponse({ success: false, error: '无法获取标签页ID' });
      return true;
    }

    (async () => {
      try {
        console.log(`Starting ${request.length} summarization process...`);
        
        // 获取当前语言
        const currentLanguage = await getCurrentLanguage();
        console.log('Current language:', currentLanguage);

        // 打印内容长度和前200个字符用于调试
        console.log('Content length in background:', request.content.length);
        console.log('First 200 characters in background:', request.content.substring(0, 200));

        const lengthConfig = SUMMARY_LENGTH_CONFIG[request.length] || SUMMARY_LENGTH_CONFIG.medium;

        // 构造API请求
        const apiUrl = `${DEEPSEEK_CONFIG.API_BASE_URL}${DEEPSEEK_CONFIG.ENDPOINT}`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DEEPSEEK_CONFIG.API_KEY}`
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              {
                role: 'system',
                content: currentLanguage === 'zh' ?
                  '你是一个专业的文章摘要生成器。请生成一个简洁、准确的摘要，突出文章的主要观点和关键信息。' :
                  'You are a professional article summarizer. Please generate a concise and accurate summary that highlights the main points and key information of the article.'
              },
              {
                role: 'user',
                content: request.content
              }
            ],
            max_tokens: lengthConfig.max_tokens,
            temperature: lengthConfig.temperature
          })
        });

        if (!response.ok) {
          throw new Error('API请求失败');
        }

        const data = await response.json();
        console.log('API response:', data);

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
          throw new Error('API响应格式错误');
        }

        const summary = data.choices[0].message.content.trim();
        console.log('Generated summary:', summary);

        sendResponse({
          success: true,
          summary: summary
        });
      } catch (error) {
        console.error('Error in background script:', error);
        sendResponse({
          success: false,
          error: error.message
        });
      }
    })();

    return true;
  }
});

// 获取当前语言
function getCurrentLanguage() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['language'], (result) => {
      resolve(result.language || 'zh');
    });
  });
};