// 监听来自popup的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('Content script received message:', request);

  if (request.action === 'getContent') {
    try {
      const content = extractPageContent();
      console.log('Extracted content length:', content.length);
      sendResponse(content);
    } catch (error) {
      console.error('Error extracting content:', error);
      sendResponse('');
    }
    return true; // 保持消息通道打开
  }
});

// 提取页面主要内容
function extractPageContent() {
  // 获取页面标题
  const title = document.title;

  // 获取meta description
  const metaDescription = document.querySelector('meta[name="description"]')?.content || '';

  // 获取主要内容
  const article = document.querySelector('article');
  let mainContent = '';

  if (article) {
    // 如果找到article标签，使用它的内容
    mainContent = article.textContent;
  } else {
    // 否则尝试找到页面的主要内容区域
    const possibleContentElements = [
      document.querySelector('main'),
      document.querySelector('#main'),
      document.querySelector('.main'),
      document.querySelector('#content'),
      document.querySelector('.content'),
      document.body
    ];

    // 使用第一个非空的内容元素
    const contentElement = possibleContentElements.find(element => element && element.textContent.trim());
    
    if (contentElement) {
      // 排除导航、页脚等无关内容
      const elementsToExclude = contentElement.querySelectorAll('nav, header, footer, #header, #footer, .header, .footer, script, style, [role="navigation"]');
      elementsToExclude.forEach(element => element.remove());
      
      mainContent = contentElement.textContent;
    }
  }

  // 清理文本内容
  mainContent = mainContent
    .replace(/[\n\r]+/g, ' ') // 替换换行为空格
    .replace(/\s+/g, ' ') // 合并多个空格
    .trim(); // 移除首尾空格

  // 组合内容，限制长度
  const combinedContent = `标题：${title}\n\n${mainContent}`;
  return combinedContent.substring(0, 2000); // 限制长度为2000字符
}