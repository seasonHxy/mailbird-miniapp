// LLM 适配层：对接任意 OpenAI-compatible 接口（国内可用 DeepSeek / 通义 / 智谱等）。
// 未配置 LLM_API_KEY 时返回 null，由调用方降级到模板生成——保证开箱即跑。
const API_KEY = process.env.LLM_API_KEY || ''
const BASE_URL = (process.env.LLM_BASE_URL || '').replace(/\/$/, '')
const MODEL = process.env.LLM_MODEL || ''

const enabled = !!(API_KEY && BASE_URL && MODEL)

async function chat(system, user) {
  if (!enabled) return null
  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ],
      temperature: 0.7
    })
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`LLM ${res.status}: ${text.slice(0, 200)}`)
  }
  const data = await res.json()
  return (data.choices && data.choices[0] && data.choices[0].message.content) || ''
}

// 解析模型输出为 {title, content}；容忍模型包了 ```json 代码块的情况
function parseEmail(raw) {
  if (!raw) return null
  const cleaned = raw.replace(/^```(json)?\s*/i, '').replace(/```\s*$/, '').trim()
  try {
    const obj = JSON.parse(cleaned)
    if (obj.title && obj.content) return { title: obj.title, content: obj.content }
  } catch (e) {}
  // 兜底：第一行当标题，其余当正文
  const lines = cleaned.split('\n')
  return { title: lines[0].slice(0, 80), content: lines.slice(1).join('\n').trim() || cleaned }
}

module.exports = { enabled, chat, parseEmail }
