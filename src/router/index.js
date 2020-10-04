import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const routePaths = [
    {
        path: "*",
        component: () => import( '@/views/module/error/Error404View.vue')
    },
    {
        path: "/adminLogin",
        component: () => import( '@/views/module/randl/AdminUserLoginView.vue')
    }
    ,
    {
        path: "/userLogin",
        component: () => import( '@/views/module/randl/UserLoginView.vue')
    }
    ,
    {
        path: "/userRegister",
        component: () => import( '@/views/module/randl/UserRegisterView.vue'),
    },
    {
        path: "/registeredUserHome",
        component: () => import( '@/views/module/registeruser/RegisterUserHomeView.vue'),
    }
    ,
    {
        path: "/userForget",
        component: () => import( '@/views/module/randl/UserForgetView.vue'),
    }
    ,
    {
        path: "/",
        component: () => import( '@/views/FrameView.vue'),
        redirect: '/adminLogin',
        children: [
            {
                // 当 /user/:id/profile 匹配成功，
                // UserProfile 会被渲染在 User 的 <router-view> 中
                path: 'Layout',
                components: {
                    //主框架的某个碎片区域
                    user_fragment: () => import('@/views/frame/UserFragment.vue'),
                    //菜单模块
                    home_view: () => import('@/views/module/home/HomeView.vue'),
                    admin_user_view: () => import('@/views/module/systemsetting/ManageAdminView.vue'),
                    registered_user_view: () => import('@/views/module/user/ManageRegisteredView.vue'),
                    personal_info_view: () => import('@/views/module/user/ManagePersonalInfoView.vue'),
                    interface_view: () => import('@/views/module/permission/InterfaceView.vue'),
                    role_view: () => import('@/views/module/permission/RoleView.vue'),
                    allocation_view: () => import('@/views/module/permission/AllocationView.vue'),
                    system_menu_view: () => import('@/views/module/systemsetting/SystemMenuView.vue'),
                    operation_log_view: () => import('@/views/module/systemsetting/OperationLogView.vue'),
                    thirdparty_app_view: () => import('@/views/module/app/ManagerThirdpartyAppView.vue'),
                },
            }
        ]
    },
    {
        path: "/test",
        component: () => import('@/views/TestView.vue')
    }
];

export default new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: routePaths
})
