import request from '@/utils/request'

// 获取个人信息
export const getUserInfoDetail = () => {
  return request.get('http://smart-shop.itheima.net/index.php?s=/api/user/info')
}
