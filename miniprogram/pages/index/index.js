const { CATEGORIES } = require('../../data/scenes.js')
const history = require('../../utils/history.js')

Page({
  data: {
    categories: CATEGORIES,
    recent: []
  },
  onShow() {
    this.setData({ recent: history.list().slice(0, 3) })
  },
  onTapCategory(e) {
    wx.navigateTo({ url: '/pages/category/category?cat=' + e.currentTarget.dataset.id })
  },
  onTapRecent(e) {
    const item = this.data.recent.find(r => r.id === e.currentTarget.dataset.id)
    if (!item) return
    getApp().globalData.viewItem = item
    getApp().globalData.pending = null
    wx.navigateTo({ url: '/pages/result/result?mode=view' })
  }
})
