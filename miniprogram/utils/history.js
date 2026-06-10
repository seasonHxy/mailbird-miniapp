// 历史记录（MVP：本地 storage，上限 50 条；二期同步到 server /api/history）
const KEY = 'mail_history'
const MAX = 50

function list() {
  try { return wx.getStorageSync(KEY) || [] } catch (e) { return [] }
}

function add(item) {
  const records = list()
  const record = {
    id: 'H' + Date.now(),
    scene: item.scene,
    sceneName: item.sceneName,
    sceneIcon: item.sceneIcon || '✉️',
    category: item.category,
    title: item.title,
    content: item.content,
    formData: item.formData || {},
    createdAt: formatDate(new Date())
  }
  records.unshift(record)
  try { wx.setStorageSync(KEY, records.slice(0, MAX)) } catch (e) {}
  return record
}

function remove(id) {
  const records = list().filter(r => r.id !== id)
  try { wx.setStorageSync(KEY, records) } catch (e) {}
}

function clear() {
  try { wx.removeStorageSync(KEY) } catch (e) {}
}

function formatDate(d) {
  const p = n => (n < 10 ? '0' + n : '' + n)
  return `${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

module.exports = { list, add, remove, clear }
