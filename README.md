# 网页智能摘要 Chrome 扩展

一个基于React和DeepSeek API的Chrome扩展，可以智能生成网页内容的摘要。

## 功能特点

- 支持三种摘要长度：简短、中等、详细
- 支持深色/浅色主题切换
- 支持中文/英文界面切换
- 智能提取网页主要内容
- 使用DeepSeek API生成高质量摘要

## 技术栈

- React 18
- Vite
- Chrome Extensions API
- DeepSeek API

## 项目结构

```
webpage-summarizer/
├── src/
│   ├── popup/          # 弹出窗口相关组件
│   ├── background/     # 后台脚本
│   ├── content/        # 内容脚本
│   ├── contexts/       # React Context
│   ├── hooks/          # 自定义Hooks
│   ├── styles/         # 样式文件
│   └── utils/          # 工具函数
├── _locales/          # 国际化文件
├── assets/            # 静态资源
└── manifests/         # 浏览器清单文件
```

## 配置

1. 复制配置文件模板：
```bash
cp src/config/config.example.js src/config/config.js
```

2. 在`src/config/config.js`中配置你的DeepSeek API密钥：
```javascript
export const DEEPSEEK_CONFIG = {
  API_KEY: 'your-api-key-here', // 替换为你的API密钥
  // ...其他配置
};
```

## 已知问题和改进计划

### 1. 错误处理和用户体验

- **问题**：目前的错误处理机制不够清晰，有时会将正常的流程控制消息显示为错误。
- **改进计划**：
  - 区分真正的错误和正常的流程控制消息
  - 使用不同的UI组件和样式来显示不同类型的消息
  - 添加更友好的加载状态指示器

### 2. 代码组织和状态管理

- **问题**：组件之间的状态管理和通信机制可以更优化。
- **改进计划**：
  - 考虑引入Redux或MobX进行状态管理
  - 优化消息传递机制
  - 改进错误边界的处理

### 3. 性能优化

- **问题**：content script的注入和页面内容提取可能影响性能。
- **改进计划**：
  - 优化content script的注入时机
  - 改进页面内容提取算法
  - 添加内容缓存机制

### 4. 安全性

- **问题**：需要更好的API密钥管理机制。
- **改进计划**：
  - 实现更安全的API密钥存储
  - 添加请求频率限制
  - 实现用户认证机制

## 开发指南

1. 安装依赖：
```bash
npm install
```

2. 开发模式：
```bash
npm run dev
```

3. 构建：
```bash
npm run build
```

4. 在Chrome中加载扩展：
- 打开Chrome扩展管理页面 (chrome://extensions)
- 启用"开发者模式"
- 点击"加载已解压的扩展"
- 选择项目的根目录

## 贡献指南

1. Fork本仓库
2. 创建你的特性分支
3. 提交你的改动
4. 推送到分支
5. 创建Pull Request

## 许可证

MIT
