import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
//导入全局样式表
import './assets/css/global.css'
//导入element.js
import './assets/js/element.js'
//引入网络请求
import './api/index.js'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
