const { getScene, TONES } = require('../../data/scenes.js')
const quota = require('../../utils/quota.js')

Page({
  data: {
    scene: null,
    tones: TONES,
    formData: {},     // 动态字段值 + tone + needEnglish
    canSubmit: false
  },
  onLoad(query) {
    const scene = getScene(query.scene)
    if (!scene) {
      wx.showToast({ title: '场景不存在', icon: 'none' })
      setTimeout(() => wx.navigateBack(), 800)
      return
    }
    this.setData({
      scene,
      formData: { tone: 'formal', needEnglish: !!scene.defaultEnglish }
    })
    wx.setNavigationBarTitle({ title: scene.name })
  },

  onInput(e) {
    const key = e.currentTarget.dataset.key
    this.setData({ ['formData.' + key]: e.detail.value }, () => this.validate())
  },
  onToneTap(e) {
    this.setData({ 'formData.tone': e.currentTarget.dataset.value })
  },
  onEnglishChange(e) {
    this.setData({ 'formData.needEnglish': e.detail.value })
  },

  validate() {
    const { scene, formData } = this.data
    const ok = scene.fields
      .filter(f => f.required)
      .every(f => (formData[f.key] || '').trim())
    this.setData({ canSubmit: ok })
  },

  onSubmit() {
    if (!this.data.canSubmit) {
      wx.showToast({ title: '请填写必填项', icon: 'none' })
      return
    }
    // 免费额度校验（MVP 本地计数；正式版由后端按 openid 鉴权）
    const q = quota.use()
    if (!q.ok) {
      wx.showModal({
        title: '今日免费次数已用完',
        content: `每天可免费生成 ${quota.FREE_PER_DAY} 次，开通会员享无限生成（开发中）`,
        showCancel: false
      })
      return
    }
    getApp().globalData.pending = {
      scene: this.data.scene.id,
      sceneName: this.data.scene.name,
      sceneIcon: this.data.scene.icon,
      category: this.data.scene.category,
      formData: this.data.formData
    }
    getApp().globalData.viewItem = null
    wx.navigateTo({ url: '/pages/result/result' })
  }
})
