import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
// import store from './store'

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(VueAxios,axios);
Vue.use(Vuex);

const store12 = new Vuex.Store({
    state: {
        count: 0
    },
    mutations: {
        increment (state) {
            state.count++
        }
    }
});

new Vue({
    router,
    store12,
    render: h => h(App),
}).$mount('#app');

