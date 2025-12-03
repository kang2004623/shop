import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '@/views/login'
import searchlist from '@/views/search/list.vue'
import search from '@/views/search'
import prodetail from '@/views/prodetail'
import pay from '@/views/pay'
import myorder from '@/views/myorder'

import store from '@/store'

// 按需加载，异步组件改造（只有当路由被访问的时候才加载对应组件）
const layout = () => import('@/views/layout')
const home = () => import('@/views/layout/home')
const category = () => import('@/views/layout/category')
const cart = () => import('@/views/layout/cart')
const user = () => import('@/views/layout/user')
const address = () => import('@/views/address')

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/login', component: login },
    {
      path: '/',
      component: layout,
      redirect: '/home',
      // 二级路由
      children: [
        { path: '/home', component: home },
        { path: '/category', component: category },
        { path: '/cart', component: cart },
        { path: '/user', component: user }
      ]

    },
    { path: '/search', component: search },
    { path: '/searchlist', component: searchlist },
    { path: '/prodetail/:id', component: prodetail },
    { path: '/pay', component: pay },
    { path: '/myorder', component: myorder },
    { path: '/address', component: address }
  ]
})
// 所有的路由在真正被访问到之前(解析渲染对应组件页面前)，都会先经过全局前置守卫
// 只有全局前置守卫放行了，才会到达对应的页面

// 全局前置导航守卫
// to:   到哪里去，到哪去的完整路由信息对象 (路径，参数)
// from: 从哪里来，从哪来的完整路由信息对象 (路径，参数)
// next(): 是否放行
// (1) next()     直接放行，放行到to要去的路径
// (2) next(路径)  进行拦截，拦截到next里面配置的路径

// 定义一个数组，专门用户存放所有需要权限访问的页面
const authUrls = ['/pay', 'myorder']
router.beforeEach((to, from, next) => {
// 是否访问权限页面
  if (!authUrls.includes(to.path)) {
    next()
    return
  }
  // 访问权限页面，判断token
  const token = store.getters.token
  if (token) {
    next()
  } else {
    next('/login')
  }
})
export default router
