import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const routePaths = [
    {
        path: "/",
        component: () => import(/* webpackChunkName: "about" */ '@/views/FrameView.vue'),
        redirect: 'Layout',
        children: [
            {
                // 当 /user/:id/profile 匹配成功，
                // UserProfile 会被渲染在 User 的 <router-view> 中
                path: 'Layout',
                components: {
                    default: () => import(/* webpackChunkName: "about" */ '@/views/TestView.vue'),
                    home_view: () => import(/* webpackChunkName: "about" */ '@/views/HomeView.vue'),
                    admin_user_view: () => import(/* webpackChunkName: "about" */ '@/views/user/AdminUserView.vue'),
                    registered_user_view: () => import(/* webpackChunkName: "about" */ '@/views/user/RegisteredUserView.vue')
                },
                //component: () => import(/* webpackChunkName: "about" */ '@/views/TestView.vue')
            }
        ]
    },
    {
        path: "/adminLogin",
        component: () => import(/* webpackChunkName: "about" */ '@/views/randl/AdminUserLoginView.vue')
    },
    {
        path: "/test",
        component: () => import(/* webpackChunkName: "about" */ '@/views/TestView.vue')
    }
];

export default new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: routePaths
})
