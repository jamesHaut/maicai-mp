import { updateManager } from './utils/updateManager'
import { wxLogin } from './utils/wxCheckLogin'
//app.js
App({
  onLaunch: function () {
    // 版本更新
    updateManager()
    // // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    wxLogin().then(res => {
      this.globalData.userInfo = {
        mobile: res.mobile
      }
      this.globalData.cartCount = res.cartCount
      wx.setTabBarBadge({
        index: 2,
        text: parseInt(res.cartCount) ? res.cartCount + '' : ''
      })
    })
    // console.log(this)
  },
  globalData: {
    userInfo: null,
    orderStatusCount: [], // 我的tab页面 订单角标
    cartCount: 0, // 购物车商品数量
    switchClassifyId: null // 首页分类跳转到分类tab id
  }
})