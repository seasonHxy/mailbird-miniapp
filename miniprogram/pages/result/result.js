const api = require('../../services/api.js')
const history = require('../../utils/history.js')

// 改写选项（对应方案中的「改写选项页」，MVP 用 ActionSheet 实现）
const REWRITES = [
  { value: 'formal', label: '更正式' },
  { value: 'friendly', label: '更友好' },
  { value: 'shorter', label: '更简短' },
  { value: 'detailed', label: '更详细' },
  { value: 'translate', label: '翻译成英文' },
  { value: 'rephrase', label: '换个说法' }
]

Page({
  data: {
    loading: false,
    mode: 'generate',     // generate=新生成 view=查看历史
    sceneName: '',
    title: '',
    content: '',
    via: '',              // llm / mock
    saved: false
  },

  onLoad(query) {
    const g = getApp().globalData
    if (query.mode === 'view' && g.viewItem) {
      // 查看历史记录
      const it = g.viewItem
      this.setData({
        mode: 'view', sceneName: it.sceneName,
        title: it.title, content: it.content, saved: true
      })
      return
    }
    if (!g.pending) {
      wx.showToast({ title: '缺少生成参数', icon: 'none' })
      setTimeout(() => wx.navigateBack(), 800)
      return
    }
    this._pending = g.pending
    this.setData({ sceneName: this._pending.sceneName })
    this.generate()
  },

  async generate() {
    this.setData({ loading: true })
    try {
      const r = await api.generateEmail(this._pending.scene, this._pending.formData)
      this.setData({ title: r.title, content: r.content, via: r.via, loading: false, saved: false })
      this.save()
    } catch (e) {
      this.setData({ loading: false })
      wx.showToast({ title: '生成失败，请重试', icon: 'none' })
    }
  },

  save() {
    if (this.data.saved || !this.data.content) return
    history.add({
      scene: this._pending.scene,
      sceneName: this._pending.sceneName,
      sceneIcon: this._pending.sceneIcon,
      category: this._pending.category,
      title: this.data.title,
      content: this.data.content,
      formData: this._pending.formData
    })
    this.setData({ saved: true })
  },

  onCopy() {
    wx.setClipboardData({
      data: `${this.data.title}\n\n${this.data.content}`,
      success: () => wx.showToast({ title: '已复制', icon: 'success' })
    })
  },

  onRewrite() {
    wx.showActionSheet({
      itemList: REWRITES.map(r => r.label),
      success: async (res) => {
        const adj = REWRITES[res.tapIndex]
        this.setData({ loading: true })
        try {
          const r = await api.rewriteEmail(
            { title: this.data.title, content: this.data.content },
            adj.value
          )
          this.setData({ title: r.title, content: r.content, via: r.via, loading: false, saved: false })
          if (this._pending) this.save()
          wx.showToast({ title: '已' + adj.label, icon: 'none' })
        } catch (e) {
          this.setData({ loading: false })
          wx.showToast({ title: '改写失败', icon: 'none' })
        }
      }
    })
  },

  onRegenerate() {
    if (this.data.mode === 'view') return
    this.generate()
  }
})
