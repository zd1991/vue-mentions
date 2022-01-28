import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 导入组件
import { mentions } from './components/index';

import App from './App.vue'

Vue.config.productionTip = false;

Vue.use(mentions);
Vue.use(ElementUI);

new Vue({
  render: h => h(App),
}).$mount('#app')
