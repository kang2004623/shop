// 此处用于存放所有登录相关的接口请求
// 1.获取图形验证码
import request from '@/utils/request'
// 相当于const getPicCode = function() {
//   return request.get('...')
// }

export const getPicCode = () => {
  return request.get('http://smart-shop.itheima.net/index.php?s=/api/captcha/image')
}
// 2.获取短信验证码
export const getMsgCode = (captchaCode, captchaKey, mobile) => {
  return request.post('http://smart-shop.itheima.net/index.php?s=/api/captcha/sendSmsCaptcha', {
    form: {
      captchaCode,
      captchaKey,
      mobile
    }
  })
}
// 登录
export const CodeLogin = (mobile, smsCode) => {
  return request.post('http://smart-shop.itheima.net/index.php?s=/api/passport/login', {
    form: {
      isParty: false,
      mobile,
      partyData: {},
      smsCode,
      platform: 'H5'
    }
  })
}
