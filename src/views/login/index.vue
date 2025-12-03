<template>
  <div class="login">
    <!-- 头部 -->
    <van-nav-bar title="会员登录" left-text="" left-arrow @click-left='$router.back()' />
    <!-- 主体 -->
    <div class="container">
      <div class="title">
        <h3>手机号登录</h3>
        <p>未注册的手机号登录后将自动注册</p>
      </div>

      <div class="form">
        <div class="form-item">
          <input v-model="mobile" class="inp" maxlength="11" placeholder="请输入手机号码" type="text">
        </div>
        <div class="form-item">
          <input v-model="piccode" class="inp" maxlength="5" placeholder="请输入图形验证码" type="text">
          <img v-if="picurl" :src="picurl" @click="getPicCode" alt="">
        </div>
        <div class="form-item">
          <input v-model="msgCode" class="inp" placeholder="请输入短信验证码" type="text">
          <button @click="getCode">{{ second===totalSecond?'获取验证码':second+'秒后重新发送' }}</button>
        </div>
      </div>

      <div @click="Login" class="login-btn">登录</div>
    </div>
  </div>
</template>

<script>
import { CodeLogin, getMsgCode, getPicCode } from '@/api/login'
import { Toast } from 'vant'
export default {
  name: 'LoginPage',
  data () {
    return {
      picurl: '', // 存储请求渲染的图片地址
      pickey: '', // 将来请求传递的图形验证码的唯一标识
      totalSecond: 60, // 总秒数
      second: 60, // 当前秒数，开启定时器后是对它进行--
      timer: null,
      piccode: '', // 用户输入的图形验证码
      mobile: '', // 手机号
      msgCode: ''// 短信验证码
    }
  },
  async created () {
    this.getPicCode()
  },
  // 关闭页面后清除定时器
  destroyed () {
    clearInterval(this, this.timer)
  },
  methods: {
    // 校验输入框内容
    validFn () {
      if (!/^1[3-9]\d{9}$/.test(this.mobile)) {
        Toast('请输入正确的手机号')
        return false
      }
      if (!/^\w{4}$/.test(this.piccode)) {
        Toast('请输入正确的图形验证码')
        return false
      }
      return true
    },
    // 获取图形验证码
    async getPicCode () {
      const res = await getPicCode()
      console.log(res)
      this.picurl = res.data.base64
      this.pickey = res.data.key

      Toast('获取图形验证码成功')
    },
    // 获取短信验证码倒计时效果
    async getCode () {
      if (!this.validFn()) {
        return
      }
      // 当无定时器且当前秒数与总秒数相同时，开启定时器
      if (this.timer === null && this.second === this.totalSecond) {
        const res = await getMsgCode(this.piccode, this.pickey, this.mobile)
        console.log(res)
        this.$toast('短信发送成功')
        this.timer = setInterval(() => {
          this.second--

          if (this.second <= 0) {
            clearInterval(this.timer)
            this.timer = null
            this.second = this.totalSecond
          }
        }, 1000)
      }
    },
    async Login () {
      if (!this.validFn()) {
        return
      }
      if (!/^\d{6}$/.test(this.msgCode)) {
        Toast('请输入正确的短信验证码')
        return false
      }
      const res = await CodeLogin(this.mobile, this.msgCode)
      // 组件中提交调用mutations
      this.$store.commit('user/setUserInfo', res.data)
      this.$toast('登录成功')
      // 进行判断，看地址栏有无回跳地址
      // 若有，说明是其他页面拦截到登录来的，需要回跳
      // 若没有，正常去首页
      const url = this.$route.query.backUrl || '/'
      this.$router.replace(url)
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  padding: 49px 29px;

  .title {
    margin-bottom: 20px;
    h3 {
      font-size: 26px;
      font-weight: normal;
    }
    p {
      line-height: 40px;
      font-size: 14px;
      color: #b8b8b8;
    }
  }

  .form-item {
    border-bottom: 1px solid #f3f1f2;
    padding: 8px;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    .inp {
      display: block;
      border: none;
      outline: none;
      height: 32px;
      font-size: 14px;
      flex: 1;
    }
    img {
      width: 94px;
      height: 31px;
    }
    button {
      height: 31px;
      border: none;
      font-size: 13px;
      color: #cea26a;
      background-color: transparent;
      padding-right: 9px;
    }
  }

  .login-btn {
    width: 100%;
    height: 42px;
    margin-top: 39px;
    background: linear-gradient(90deg,#ecb53c,#ff9211);
    color: #fff;
    border-radius: 39px;
    box-shadow: 0 10px 20px 0 rgba(0,0,0,.1);
    letter-spacing: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
