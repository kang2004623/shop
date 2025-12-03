import request from '@/utils/request'
// 订单结算确认
// mode :cart obj{cartIds}
// mode : buyNow obj{goodsId,goodsNum,goodsSkuId}
export const checkOrder = (mode, obj) => {
  return request.get('http://smart-shop.itheima.net/index.php?s=/api/checkout/order', {
    params: {
      mode,
      delivery: 10, // 10快递配送 20上门自提
      shopId: 0,
      couponId: 0,
      isUsePoints: 0,
      ...obj
    }
  })
}
// 提交订单
// mode :cart obj{cartIds,remark}
// mode : buyNow obj{goodsId,goodsNum,goodsSkuId,remark}
export const submitOrder = (mode, obj) => {
  return request.post('http://smart-shop.itheima.net/index.php?s=/api/checkout/submit', {
    mode,
    delivery: 10, // 10快递配送 20上门自提
    shopId: 0,
    couponId: 0, // 优惠券
    isUsePoints: 0, // 是否使用积分
    payType: 10, // 余额支付
    ...obj
  })
}
// 获取订单列表
export const getMyOrderList = (dataType, page) => {
  return request.get('http://smart-shop.itheima.net/index.php?s=/api/order/list', {
    params: {
      dataType,
      page
    }
  })
}
