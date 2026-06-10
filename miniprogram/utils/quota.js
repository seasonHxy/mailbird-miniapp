// 免费额度（MVP：本地按天计数，每天 5 次；正式版应由 server 按 openid 鉴权计数）
const KEY = 'daily_quota'
const FREE_PER_DAY = 5

function today() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

function read() {
  let q
  try { q = wx.getStorageSync(KEY) } catch (e) {}
  if (!q || q.date !== today()) q = { date: today(), used: 0 }
  return q
}

function remaining() {
  return Math.max(0, FREE_PER_DAY - read().used)
}

// 占用一次额度；返回 {ok, remaining}
function use() {
  const q = read()
  if (q.used >= FREE_PER_DAY) return { ok: false, remaining: 0 }
  q.used += 1
  try { wx.setStorageSync(KEY, q) } catch (e) {}
  return { ok: true, remaining: FREE_PER_DAY - q.used }
}

module.exports = { FREE_PER_DAY, remaining, use }
