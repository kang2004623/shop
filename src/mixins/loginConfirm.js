export default {
  // 此处编写的是Vue组件实例的配置项，通过一定语法，可以直接混入到组件内部
  // 注意：如果此处和组件内，提供了同名的data 或 methods，则组件内优先级更高
  // 如果编写了生命周期函数，则mixins中的生命周期函数和页面的生面周期函数，会用数组管理统一执行
  methods: {
    // 根据登录状态，判断是否需要显示登录确认框
    // 1.如果未登录，显示确认框，返回true
    // 2.如果已登录，啥也不干，返回false
    loginconfirm () {
      // 判断有无token
      // 如果没有，弹确认框
      if (!this.$store.getters.token) {
        this.$dialog.confirm({
          title: '温馨提示',
          message: '此时需要先登录才能继续操作哦',
          confirmButtonText: '去登录',
          cancelButtonText: '再逛逛'
        }).then(() => {
          // 希望点了去登录，登录后再跳转回购物车页面，需要在跳转时去携带参数
          this.$router.replace({
            path: '/login',
            query: {
              backUrl: this.$route.fullPath
            }
          })
        }).catch(() => {})
        return true
      }
      return false
    }
  }
}
