const deleteIconSrc = '/assets/trash.png'
const computedBehavior = require('miniprogram-computed')
Component({
  behaviors: [computedBehavior],
  options: {
    addGlobalClass: true,
    pureDataPattern: /^(_|list)/ // 指定所有 _ 或者 list 开头的数据字段为纯数据字段
  },
  properties: {
    list: Array,
    checkedAll: {
      type: Boolean,
      value: true
    }
  },
  observers: {
    /**
     * todo 初始化组件数据作为内部数据
     */
    list: function (res) {
      const arr = res.map(item => {
        const id = item.id
        return {
          ...item,
          checked: true,
          delete: [{ src: deleteIconSrc, data: id }]
        }
      })
      this.setData({ result: arr })
    },
    /**
     * todo 全选或者全取消选中
     * * 根据父级全选按钮状态判断
     */
    checkedAll (val) {
      // console.log('watch checkedAll', val)
      this.data.result.forEach(item => {
        item.checked = val
      })
      // console.log('watch checkedAll', val, this.data.result)
      const _this = this
      this.setData({
        result: this.data.result
      }, () => {
        _this.triggerEvent('calc', { sum: _this.data.sum, isCheckedAll: val, checkedList: _this.data.checkedList })
        // console.log('sum', _this.data.sum, 'isCheckedAll', val, 'checkedList', _this.data.checkedList)
      })
    }
  },
  computed: {
    // 总价
    sum (data) {
      const sum = data.result.reduce((acc, obj) => {
        if (obj.checked) {
          return acc + parseFloat(obj.qty) * parseFloat(obj.amt)
        }
        return acc
      }, 0)
      return Math.round(sum * 100)/ 100
    },
    // 当前选中的项目
    checkedList (data) {
      return data.result.filter(item => item.checked)
    },
    // 是否全部选中
    isCheckedAll (data) {
      return data.checkedList.length === data.result.length
    }
  },
  data: {
    // sum: 0,
    result: [],
    _isClose: true, // 左滑状态是否关闭
    _transitionEnd: true // 左滑动画效果是否结束
  },
  methods: {
    /**
     * 左滑删除按钮
     * @param {*} id 商品id
     */
    slideButtonTap({ detail: { data: id }}) {
      const targetItemIndex = this.data.result.findIndex(item => item.id === id)
      this.deleteItem(targetItemIndex)
    },
    // 左滑动画结束事件
    slideTransitionEnd (e) {
      if (!this.data._isClose) return
      this.data._transitionEnd = true
    },
    // 左滑状态隐藏
    slideHide (e) {
      this.data._isClose = true
    },
    // 左滑显示状态
    slideShow (e) {
      this.data._isClose = false
      this.data._transitionEnd = false
    },
    // 单击切换选中状态
    onItemCheck ({ currentTarget: { dataset: { index } }, detail }) {
      const key = `result[${index}].checked`
      const _this = this
      this.setData({
        [key]: detail
      }, () => {
        _this.triggerEvent('calc', { sum: _this.data.sum, isCheckedAll: _this.data.isCheckedAll, checkedList: _this.data.checkedList })
        // console.log('sum', _this.data.sum, 'isCheckedAll', _this.data.isCheckedAll, 'checkedList', _this.data.checkedList)
      })
    },
    // 单击跳转到详情页
    onItemClick (e) {
      if (!this.canClick()) return
      wx.navigateTo({
        url: '/pages/details/index'
      })
    },
    // 阻止stepper组件事件冒泡
    stopBubble (e) {
      return false
    },
    // 修改订量
    onChangeQty ({
      detail,
      currentTarget: {
        dataset: { index }
      }
    }) {
      if (!this.canClick()) return
      if (detail) {
        const key = `result[${index}].qty`
        const _this = this
        this.setData({
          [key]: detail
        }, () => {
          _this.triggerEvent('calc', { sum: _this.data.sum, isCheckedAll: _this.data.isCheckedAll, checkedList: _this.data.checkedList })
          // console.log('sum', _this.data.sum, 'isCheckedAll', _this.data.isCheckedAll, 'checkedList', _this.data.checkedList)
        })
      } else {
        this.deleteItem(index)
      }
    },
    // 判断当前左滑组件是否可以点击
    canClick () {
      return this.data._isClose && this.data._transitionEnd
    },
    /**
     * 删除指定商品
     * @param {index} 商品下标 
     */
    deleteItem (index) {
      const _this = this
      wx.showModal({
        content: '确定删除该商品吗？',
        confirmColor: '#f75355',
        success ({ confirm, cancel }) {
          if (confirm) {
            _this.data.result.splice(index, 1)
            wx.showLoading()
            setTimeout(() => {
              _this.setData({
                result: _this.data.result
              }, () => {
                _this.triggerEvent('calc', { sum: _this.data.sum, isCheckedAll: _this.data.isCheckedAll, checkedList: _this.data.checkedList })
                // console.log('sum', _this.data.sum, 'isCheckedAll', _this.data.isCheckedAll, 'checkedList', _this.data.checkedList)
                wx.hideLoading()
              })
            }, 300)
          }
        }
      })
    }
  }
})