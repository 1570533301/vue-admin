import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//导入插件
import ZkTable from 'vue-table-with-tree-grid'
//全局注册
Vue.component('tree-table', ZkTable)
Vue.config.productionTip = false
//导入全局样式表
import './assets/css/global.css'
//导入element.js
import './assets/js/element.js'
//引入网络请求
import './api/index.js'
//导入富文本编译器
import VueQuillEditor from 'vue-quill-editor'
//样式导入
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
Vue.use(VueQuillEditor)
//时间过滤器
Vue.filter('dataFormat',function(val){
  const dt=new Date(val)
  const y=dt.getFullYear()
  const m=(dt.getMonth()+1+'').padStart(2,'0')
  const d=(dt.getDate()+'').padStart(2,'0')
  const hh=(dt.getHours()+'').padStart(2,'0')
  const mm=(dt.getMinutes()+'').padStart(2,'0')
  const ss=(dt.getSeconds()+'').padStart(2,'0')

   return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
