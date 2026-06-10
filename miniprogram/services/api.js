// API 层：优先走后端（真实 LLM 生成），失败时自动降级到本地模板。
// 上线前把 BASE_URL 换成已备案的 https 域名并在小程序后台配置 request 合法域名。
const { mockGenerate, mockRewrite } = require('../utils/mockGen.js')

const BASE_URL = 'http://127.0.0.1:3000'

function request(path, method, data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + path,
      method,
      data,
      timeout: 20000,
      success: res => {
        if (res.statusCode === 200 && res.data && !res.data.error) resolve(res.data)
        else reject(new Error((res.data && res.data.error) || 'HTTP ' + res.statusCode))
      },
      fail: err => reject(err)
    })
  })
}

// 生成邮件：返回 { title, content, via: 'llm' | 'mock' }
async function generateEmail(scene, formData) {
  try {
    const r = await request('/api/generate', 'POST', { scene, formData })
    return { ...r, via: r.via || 'llm' }
  } catch (e) {
    console.warn('[api] 后端不可用，降级本地模板:', e.message || e)
    return mockGenerate(scene, formData)
  }
}

// 改写邮件：adjustment ∈ formal/friendly/shorter/detailed/translate/rephrase
async function rewriteEmail(email, adjustment) {
  try {
    const r = await request('/api/rewrite', 'POST', { email, adjustment })
    return { ...r, via: r.via || 'llm' }
  } catch (e) {
    console.warn('[api] 后端不可用，降级本地改写:', e.message || e)
    return mockRewrite(email, adjustment)
  }
}

module.exports = { generateEmail, rewriteEmail }
