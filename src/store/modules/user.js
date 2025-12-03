import { getInfo, setInfo } from '@/utils/storage'
export default {
  namespaced: true, // 命名空间，使其独立
  state () {
    return {
      userInfo: getInfo()
    }
  },
  mutations: {
    // 第一个参数永远都是state
    setUserInfo (state, obj) {
      state.userInfo = obj
      setInfo(obj)
    }
  },
  actions: {
    logout (context) {
      // 个人信息要重置
      context.commit('setUserInfo', {})
      // 购物车信息要重置（跨模块调用mutation)
      context.commit('cart/setCartList', [], { root: true })
    }
  },
  getters: {

  }
}
