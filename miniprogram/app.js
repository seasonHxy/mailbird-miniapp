App({
  globalData: {
    // 页面间传参：form -> result
    pending: null,   // { scene, formData }
    viewItem: null   // 历史记录查看：history -> result
  },
  onLaunch() {
    console.log('[mailbird] launched')
  }
})
