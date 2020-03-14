const _userInfo = {
  name: '张三',
  accounts: '15800807767'
}
import { wxCheckSession } from '../../utils/wxCheckLogin'
Page({
  data: {
  },
  onLoad () {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel && eventChannel.emit && eventChannel.emit('getLoginInfo', _userInfo)

  },
  _getPhoneNumber ({ detail }) {
    console.log(detail)
    const ok = detail.errMsg === 'getPhoneNumber:ok'
    if (ok) {
      const { encryptedData, iv } = detail
      wx.showLoading({ mask: true })
      wxCheckSession().then(token => {
        console.log(token)
        // const token = token
        // ...api.login({ encryptedData, iv, token }).then()
        // wx.navigateBack({ detail: 2 })
      })
    } else {
      wx.showModal({
        title: '授权失败',
        content: '您已拒绝获取微信绑定手机号登录授权，可使用其它手机号验证登录',
        cancelText: '知道了',
        confirmText: '验证登录',
        success (res) {
          if (res.confirm) {
            wx.navigateTo({ url: '/pages/register/index' })
          }
        }
      })
    }
  }
})