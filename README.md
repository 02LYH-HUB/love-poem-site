# PoemForTwo 💌

中英双语 AI 情诗生成器。选择关系、讲述故事、生成专属情诗。

## 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/02LYH-HUB/love-poem-site&project-name=poemfortwo&repository-name=love-poem-site)

点击上方按钮 → 用 GitHub 登录 Vercel → Vercel 自动导入仓库 → 添加环境变量 `DEEPSEEK_API_KEY` → 部署

部署后在 Vercel 项目设置 → Domains 添加 `poem.hajimijob.top`

## 技术栈

- 前端：HTML + CSS + JavaScript（纯静态）
- 后端：Vercel Serverless Functions
- AI：DeepSeek API
- 支付：PayPal

## 本地开发

```bash
# 安装 Vercel CLI
npm install -g vercel

# 本地运行
vercel dev
```

## 部署

1. Fork / Push 到 GitHub
2. 在 [vercel.com](https://vercel.com) 导入仓库
3. 设置环境变量 `DEEPSEEK_API_KEY`
4. 可选：设置 `PAYPAL_CLIENT_ID`（在 index.html 中替换）

## 环境变量

| 变量 | 必填 | 说明 |
|------|------|------|
| `DEEPSEEK_API_KEY` | ✅ | DeepSeek API Key |
| `PAYPAL_CLIENT_ID` | ❌ | PayPal 商户 Client ID |

## 关系类型

支持 16 种关系：热恋、已婚、异地、暗恋、订婚、重逢、父母、子女、手足、祖孙、友人、灵魂伴侣、宠物、自己、纪念、师恩。

每种关系有独立的 prompt 风格和诗句长度。
