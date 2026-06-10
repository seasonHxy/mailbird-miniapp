const { getCategory } = require('../../data/scenes.js')

Page({
  data: { category: null },
  onLoad(query) {
    const category = getCategory(query.cat)
    if (!category) {
      wx.showToast({ title: '场景不存在', icon: 'none' })
      setTimeout(() => wx.navigateBack(), 800)
      return
    }
    this.setData({ category })
    wx.setNavigationBarTitle({ title: category.name })
  },
  onTapScene(e) {
    wx.navigateTo({ url: '/pages/form/form?scene=' + e.currentTarget.dataset.id })
  }
})
