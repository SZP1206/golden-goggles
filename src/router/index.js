import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import User from '../components/users/User'
import Rights from '../components/power/Rights'
import Role from '../components/power/Role'
import GoodsCategory from '../components/goods/GoodsCategory'
import CategoryParams from '../components/goods/CategoryParams'
import GoodsList from '../components/goods/GoodsList'
import Add from '../components/goods/Add'
import Order from '../components/order/Order'
import Report from '../components/report/Report'

Vue.use(VueRouter)

const routes = [
  { path: '/login', component: Login },
  { path: '/', redirect: '/login' },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: User },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Role },
      { path: '/categories', component: GoodsCategory },
      { path: '/params', component: CategoryParams },
      { path: '/goods', component: GoodsList },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report },
    ],
  },
]

const router = new VueRouter({
  routes,
})

// 路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
