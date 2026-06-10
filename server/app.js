// Mailbird 后端：POST /api/generate、POST /api/rewrite、GET /api/history
// MVP 说明：
// - LLM 通过环境变量配置（见 .env.example），未配置时自动降级模板生成；
// - 历史记录为内存存储，重启即失；正式版换 MySQL/Supabase + openid 鉴权；
// - 生产环境需加：openid 登录态、按用户配额、内容安全审核（msgSecCheck）。
const express = require('express')
const llm = require('./services/llm.js')
const { mockGenerate, mockRewrite } = require('./services/mockGen.js')
const { buildGeneratePrompt, buildRewritePrompt } = require('./prompts/scenePrompts.js')

const app = express()
app.use(express.json({ limit: '256kb' }))

// 内存历史（MVP）
const historyStore = []

app.get('/health', (_req, res) => {
  res.json({ ok: true, llm: llm.enabled ? 'enabled' : 'mock-mode' })
})

app.post('/api/generate', async (req, res) => {
  const { scene, formData } = req.body || {}
  if (!scene || !formData) return res.status(400).json({ error: '缺少 scene 或 formData' })

  const prompt = buildGeneratePrompt(scene, formData)
  if (!prompt) return res.status(400).json({ error: '未知场景: ' + scene })

  try {
    let email
    if (llm.enabled) {
      const raw = await llm.chat(prompt.system, prompt.user)
      email = { ...llm.parseEmail(raw), via: 'llm' }
    } else {
      email = mockGenerate(scene, formData)
    }
    historyStore.unshift({ scene, title: email.title, content: email.content, createdAt: new Date().toISOString() })
    if (historyStore.length > 200) historyStore.pop()
    res.json(email)
  } catch (e) {
    console.error('[generate]', e.message)
    res.status(500).json({ error: '生成失败：' + e.message })
  }
})

app.post('/api/rewrite', async (req, res) => {
  const { email, adjustment } = req.body || {}
  if (!email || !email.content || !adjustment) {
    return res.status(400).json({ error: '缺少 email 或 adjustment' })
  }

  const prompt = buildRewritePrompt(email, adjustment)
  if (!prompt) return res.status(400).json({ error: '未知改写类型: ' + adjustment })

  try {
    if (llm.enabled) {
      const raw = await llm.chat(prompt.system, prompt.user)
      return res.json({ ...llm.parseEmail(raw), via: 'llm' })
    }
    res.json(mockRewrite(email, adjustment))
  } catch (e) {
    console.error('[rewrite]', e.message)
    res.status(500).json({ error: '改写失败：' + e.message })
  }
})

app.get('/api/history', (_req, res) => {
  res.json({ list: historyStore.slice(0, 50) })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`[mailbird-server] listening on :${PORT}  (llm: ${llm.enabled ? 'enabled' : 'mock-mode，配置 .env 后启用真实生成'})`)
})
