const quota = require('../../utils/quota.js')
const history = require('../../utils/history.js')

Page({
  data: { remaining: 0, total: quota.FREE_PER_DAY },
  onShow() {
    this.setData({ remaining: quota.remaining() })
  },
  onVip() {
    wx.showModal({
      title: '会员功能开发中',
      content: '月卡 ¥19.9：无限生成 / 高级模板 / 英文增强。敬请期待！',
      showCancel: false
    })
  },
  onClear() {
    wx.showModal({
      title: '清空所有历史记录？',
      success: res => {
        if (res.confirm) {
          history.clear()
          wx.showToast({ title: '已清空', icon: 'success' })
        }
      }
    })
  },
  onFeedback() {
    wx.showToast({ title: '可通过小程序客服反馈', icon: 'none' })
  }
})
