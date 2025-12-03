import request from '@/utils/request'
// 获取首页数据的接口
export const getHomeData = () => {
  return request.get('http://smart-shop.itheima.net/index.php?s=/api/page/detail', {
    params: {
      pageId: 0
    }
  })
}
