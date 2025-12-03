import { getCartList, changeCount, delSelect } from '@/api/cart'
import { Toast } from 'vant'
export default {
  namespaced: true,
  state () {
    return {
      cartList: []
    }
  },
  mutations: {
    // 提供一个设置cartList的mutation
    setCartList (state, newList) {
      state.cartList = newList
    },
    toggleCheck (state, goodsId) {
      // 让对应的id的项，状态取反
      const goods = state.cartList.find(item => item.goods_id === goodsId)
      goods.isChecked = !goods.isChecked
    },
    toggleAllCheck (state, flag) {
      // 让所有的小选框，同步设置
      state.cartList.forEach(item => {
        item.isChecked = flag
      })
    },
    changeCount (state, { goodsId, goodsNum }) {
      const goods = state.cartList.find(item => item.goods_id === goodsId)
      goods.goods_num = goodsNum
    }
  },
  actions: {
    // 发请求异步操作
    async getCartAction (context) {
      const res = await getCartList()
      console.log(res)
      const { data } = res

      // 后台返回的数据中，不包含复选框的选中状态，为实现将来的功能，需要手动维护数据，给每一项都加一个ischecked状态
      data.list.forEach(item => {
        item.isChecked = true
      })
      context.commit('setCartList', data.list)
    },
    async changeCountAction (context, obj) {
      const { goodsNum, goodsId, goodsSkuId } = obj
      // 先本地修改
      context.commit('changeCount', { goodsId, goodsNum })
      // 再同步到后台
      await changeCount(goodsId, goodsNum, goodsSkuId)
    },
    // 删除购物车数据
    async delSelect (context) {
      const selCartList = context.getters.selCartList
      const cartIds = selCartList.map(item => item.id)
      console.log(cartIds)
      await delSelect(cartIds)
      Toast('删除成功')

      // 重新拉取最新的购物车数据（重新渲染）
      context.dispatch('getCartList')
    }
  },
  getters: {
    // 购物车商品总数量
    cartTotal (state) {
      return state.cartList.reduce((sum, item) => {
        return sum + item.goods_num
      }, 0)
    },
    // 选中的商品
    selCartList (state) {
      return state.cartList.filter(item => item.isChecked)
    },
    // 购物车选中总数
    selCount (state, getters) {
      return getters.selCartList.reduce((sum, item) => {
        return sum + item.goods_num
      }, 0)
    },
    // 购物车选中总价=选中总数*单价
    selPrice (state, getters) {
      return getters.selCartList.reduce((sum, item) => {
        return sum + item.goods_num * item.goods.goods_price_min
      }, 0).toFixed(2)
    },
    // 是否全选
    isAllChecked (state) {
      return state.cartList.every(item => item.isChecked)
    }
  }
}
