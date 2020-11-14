import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'

// TODO: 为何要在挂载原型链前配置baseURL，顺序互换有何影响？
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

// 时间过滤器
// 将时间格式由 Unix 转为 本地时
Vue.filter('dateFormat', function(rawDate) {
  const dt = new Date(rawDate)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, 0)
  const hh = (dt.getHours() + '').padStart(2, 0)
  const mm = (dt.getMinutes() + '').padStart(2, 0)
  const ss = (dt.getSeconds() + '').padStart(2, 0)

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
