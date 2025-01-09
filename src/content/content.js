// 监听来自popup的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('Content script received message:', request);

  if (request.action === 'getSummary') {
    handleSummarize(request)
      .then(response => {
        sendResponse(response);
      })
      .catch(error => {
        console.error('Error in content script:', error);
        sendResponse({
          success: false,
          error: error.message || '生成摘要失败'
        });
      });

    return true; // 保持消息通道打开
  }
});

// 处理摘要请求
async function handleSummarize(request) {
  console.log('Handling summarize request:', request);

  // 提取页面内容
  const content = extractPageContent();
  
  if (!content) {
    throw new Error('无法提取页面内容');
  }

  console.log('Extracted content length:', content.length);
  console.log('First 200 characters:', content.substring(0, 200));

  // 发送消息给background script
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({
      action: 'summarize',
      content: content.substring(0, 2000), // 截取前2000个字符
      length: request.length
    }, response => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else if (!response) {
        reject(new Error('无响应'));
      } else {
        resolve(response);
      }
    });
  });
}

// 提取页面主要内容
function extractPageContent() {
  console.log('Starting content extraction...');

  // 检查document.body是否存在
  if (!document.body) {
    console.error('document.body is not available');
    return null;
  }

  // 创建一个临时div来存放克隆的内容
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = document.body.innerHTML;

  // 移除不需要的元素
  const elementsToRemove = [
    'script',
    'style',
    'iframe',
    'header',
    'footer',
    'nav',
    'aside',
    '.ad',
    '.advertisement',
    '.social-share',
    '.comments'
  ];

  console.log('Removing unnecessary elements:', elementsToRemove);

  elementsToRemove.forEach(selector => {
    const elements = tempDiv.querySelectorAll(selector);
    elements.forEach(element => {
      console.log('Removing element:', element.tagName);
      element.remove();
    });
  });

  // 获取所有文本段落
  const paragraphs = Array.from(tempDiv.querySelectorAll('p, h1, h2, h3, h4, h5, h6'))
    .map(element => element.textContent.trim())
    .filter(text => text.length > 20); // 只保留有意义的段落

  // 如果没有找到足够的段落，尝试其他选择器
  if (paragraphs.length === 0) {
    console.log('No paragraphs found, trying alternative selectors');
    
    // 尝试获取article元素的内容
    const article = tempDiv.querySelector('article');
    if (article) {
      return article.textContent.trim();
    }
    
    // 尝试获取main元素的内容
    const main = tempDiv.querySelector('main');
    if (main) {
      return main.textContent.trim();
    }
    
    // 如果都没有找到，获取所有文本节点
    const textNodes = Array.from(tempDiv.querySelectorAll('*'))
      .map(element => element.textContent.trim())
      .filter(text => text.length > 50);
    
    if (textNodes.length > 0) {
      return textNodes.join('\n');
    }
    
    return null;
  }

  // 合并所有段落
  const content = paragraphs.join('\n');
  console.log('Final content length:', content.length);

  return content;
}