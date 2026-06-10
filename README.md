# Mailbird 邮件助手

场景化 AI 邮件生成微信小程序 MVP。**不做自由聊天，只做固定场景邮件生成**——「表单 + 模板 + AI 改写」模式。

```
选场景 → 选子场景 → 填关键信息 → 一键生成 → 改写优化 → 复制发送
```

## 功能（MVP v0.1）

- **3 大场景 × 15 个子场景**：外贸/商务（报价、催款、跟单、投诉回复、询盘回复）、求职/留学（求职信、面试跟进、套磁、推荐信请求、拒 Offer）、日常职场（请假、辞职、感谢、道歉、会议邀约）
- **动态表单**：每个子场景的字段由 [scenes.js](miniprogram/data/scenes.js) 配置驱动，新增场景零页面开发
- **语气选择**（正式/友好/简洁）+ **中英文切换**（外贸/求职默认英文）
- **再次改写**：更正式 / 更友好 / 更简短 / 更详细 / 翻译英文 / 换个说法
- **历史记录**：自动保存最近 50 条，支持搜索、删除、重新查看
- **免费额度**：每日 5 次（MVP 本地计数）
- **离线可跑**：后端不可用 / 未配置 LLM 时自动降级本地模板，全流程依然走得通

## 项目结构

```
mailbird-miniapp/
├── project.config.json        # 微信开发者工具配置（miniprogramRoot 指向 miniprogram/）
├── miniprogram/               # 小程序前端（原生）
│   ├── data/scenes.js         # ★ 场景配置中心：15 个子场景的表单字段定义
│   ├── services/api.js        # API 层（后端优先，失败降级本地模板）
│   ├── utils/                 # mockGen 本地生成 / history 历史 / quota 配额
│   └── pages/                 # index 首页 / category 分类 / form 动态表单
│                              # result 结果（复制/改写/重新生成）/ history / profile
└── server/                    # Node.js 后端
    ├── app.js                 # POST /api/generate · POST /api/rewrite · GET /api/history
    ├── prompts/scenePrompts.js# ★ 场景化 prompt 中心（生成质量的核心资产）
    ├── services/llm.js        # OpenAI-compatible 适配层（DeepSeek/通义/智谱均可）
    └── .env.example           # LLM 配置示例
```

## 快速开始

### 1. 小程序（无需后端即可体验）

用微信开发者工具导入本目录（AppID 选测试号）。后端未启动时走本地模板生成，全流程可跑。

### 2. 后端（接入真实 LLM）

```bash
cd server
npm install
cp .env.example .env   # 填入 LLM_API_KEY / LLM_BASE_URL / LLM_MODEL
npm start              # http://localhost:3000，未配置 .env 则运行在 mock-mode
```

验证：`curl http://localhost:3000/health`

小程序端 `services/api.js` 的 `BASE_URL` 默认 `http://127.0.0.1:3000`，开发者工具需勾选「不校验合法域名」。

## API

| 接口 | 说明 |
|---|---|
| `POST /api/generate` | `{scene, formData}` → `{title, content, via}` |
| `POST /api/rewrite` | `{email:{title,content}, adjustment}` → `{title, content, via}` |
| `GET /api/history` | 最近生成记录（内存，MVP） |

## AI-mode Ready（设计说明）

本项目按「原子接口 + 字段契约」组织，为接入**微信小程序 AI 开发模式**预留了平滑路径：

- `data/scenes.js` 的字段定义 ≈ 未来 `mcp.json` 的 `inputSchema`（label/required/placeholder 可直接转 description）
- `generate / rewrite` 即未来 skill 的原子接口；改写枚举即 `adjustment` 参数
- 接入后用户在微信 AI 对话框说「给 ABC 公司催 5000 美金，逾期 15 天」，由微信 AI 从自然语言提取字段替代表单填写，复用同一后端

## 上线前必做（MVP 未含）

- [ ] 微信登录（openid）+ 服务端按用户配额（现为本地计数，可被清缓存绕过）
- [ ] 历史记录入库（MySQL/Supabase，现为本地 storage + 服务端内存）
- [ ] 微信支付 + 会员体系（现为占位弹窗）
- [ ] 内容安全：生成内容过 `msgSecCheck`，并关注生成式 AI 备案/深度合成标识要求
- [ ] `BASE_URL` 换为已备案 https 域名并配置 request 合法域名

## 路线图

v0.2 会员支付 → v0.3 收藏模板/自定义模板 → v0.4 微信 AI 开发模式接入（对话式生成）→ v1.0 邮箱直发（Gmail/Outlook）、催款跟单序列
