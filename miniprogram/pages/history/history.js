const history = require('../../utils/history.js')

Page({
  data: { records: [], keyword: '' },
  onShow() {
    this.refresh()
  },
  refresh() {
    const all = history.list()
    const kw = this.data.keyword.trim()
    this.setData({
      records: kw ? all.filter(r => (r.title + r.sceneName).includes(kw)) : all
    })
  },
  onSearch(e) {
    this.setData({ keyword: e.detail.value }, () => this.refresh())
  },
  onTapItem(e) {
    const item = this.data.records.find(r => r.id === e.currentTarget.dataset.id)
    if (!item) return
    getApp().globalData.viewItem = item
    getApp().globalData.pending = null
    wx.navigateTo({ url: '/pages/result/result?mode=view' })
  },
  onDelete(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '删除这条记录？',
      success: res => {
        if (res.confirm) {
          history.remove(id)
          this.refresh()
        }
      }
    })
  }
})
