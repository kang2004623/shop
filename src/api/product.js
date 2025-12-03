import request from '@/utils/request'
// 获取搜索商品列表的数据
export const getProList = (obj) => {
  const { categoryId, goodsName, page } = obj
  return request.get('http://smart-shop.itheima.net/index.php?s=/api/goods/list', {
    params: {
      categoryId,
      goodsName,
      page
    }
  })
}
// 获取商品详情数据
export const getProDetail = (goodsId) => {
  return request.get('http://smart-shop.itheima.net/index.php?s=/api/goods/detail', {
    params: {
      goodsId
    }
  })
}
// 获取商品评价
export const getProComments = (goodsId, limit) => {
  return request.get('http://smart-shop.itheima.net/index.php?s=/api/comment/listRows', {
    params: {
      goodsId,
      limit// 获取评价数量
    }
  })
}
