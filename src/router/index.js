import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const routePaths = [
    {
        path: "/adminLogin",
        component: () => import(/* webpackChunkName: "about" */ '@/views/module/randl/AdminUserLoginView.vue')
    }
    ,
    {
        path: "/launcher",
        component: () => import(/* webpackChunkName: "about" */ '@/views/module/randl/launcherView.vue'),
    }
    ,
    {
        path: "/",
        component: () => import(/* webpackChunkName: "about" */ '@/views/FrameView.vue'),
        redirect: '/adminLogin',
        children: [
            {
                // 当 /user/:id/profile 匹配成功，
                // UserProfile 会被渲染在 User 的 <router-view> 中
                path: 'Layout',
                components: {
                    //主框架的某个碎片区域
                    user_fragment: () => import(/* webpackChunkName: "about" */ '@/views/frame/UserFragment.vue'),
                    //菜单模块
                    home_view: () => import(/* webpackChunkName: "about" */ '@/views/module/home/HomeView.vue'),
                    admin_user_view: () => import(/* webpackChunkName: "about" */ '@/views/module/user/AdminUserView.vue'),
                    registered_user_view: () => import(/* webpackChunkName: "about" */ '@/views/module/user/RegisteredUserView.vue'),
                    interface_view: () => import(/* webpackChunkName: "about" */ '@/views/module/permission/InterfaceView.vue'),
                    role_view: () => import(/* webpackChunkName: "about" */ '@/views/module/permission/RoleView.vue'),
                    allocation_view: () => import(/* webpackChunkName: "about" */ '@/views/module/permission/AllocationView.vue')
                },
                //component: () => import(/* webpackChunkName: "about" */ '@/views/TestView.vue')
            }
        ]
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
