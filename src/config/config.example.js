// DeepSeek API配置
export const DEEPSEEK_CONFIG = {
  API_BASE_URL: 'https://api.deepseek.com',
  ENDPOINT: '/v1/chat/completions',
  API_KEY: 'your-api-key-here', // 替换为你的API密钥
  MODEL: 'deepseek-chat'
};

// 摘要长度配置
export const SUMMARY_LENGTH_CONFIG = {
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
