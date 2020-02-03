import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);
const routePaths = [
    {
        path: "/",
        component: ()=>import(/* webpackChunkName: "about" */ '@/views/HomeView.vue')
    },
    {
        path: "/test",
        component: ()=>import(/* webpackChunkName: "about" */ '@/views/TestView.vue')
    }
];

export default new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: routePaths
})
