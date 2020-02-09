import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './store'
import messageUtil from './util/MessageUtil';

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(VueAxios, axios);

// 把全局js挂接到vue原型上
Vue.prototype.$messageUtil = messageUtil;

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');

