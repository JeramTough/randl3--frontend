<template>
    <el-container>
        <!--侧边菜单Start-->
        <el-menu default-active="1" class="el-menu-vertical-demo"
                 @select="onMenuSelected"
                 :collapse="isCollapse"
                 background-color="#6fa55c"
                 text-color="#fff"
                 active-text-color="#ffd04b">

            <div style="background: #168825">
                <el-image
                        fit="fill" :src="logoUrl"></el-image>
            </div>

            <el-menu-item index="1">
                <i class="el-icon-s-home menu-icon"></i>
                <span slot="title" class="menu-title">首页</span>
            </el-menu-item>
            <el-submenu index="2">
                <template slot="title">
                    <i class="el-icon-s-custom menu-icon"></i>
                    <span slot="title" class="menu-title">用户管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="2-1">管理员账户管理</el-menu-item>
                    <el-menu-item index="2-2">普通用户管理</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
        </el-menu>
        <!--侧边菜单End-->

        <el-container>
            <!--头布局-->
            <el-header style="padding: 0;margin: 0;background: #b6ffab;color: #ffffff;">

                <div style="padding-top: 10px;">
                    <el-switch
                            v-model="isCollapse"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            style="float: left">
                    </el-switch>


                    <el-breadcrumb separator="/" style="float: left;color: white;">
                        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
                        <el-breadcrumb-item>活动列表</el-breadcrumb-item>
                        <el-breadcrumb-item>
                            <div>王小虎</div>
                        </el-breadcrumb-item>
                    </el-breadcrumb>


                    <div style="float: right; text-align: start">
                        <div class="block">
                            <el-avatar :size="30"
                                       src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=378824344,1185609431&fm=26&gp=0.jpg"></el-avatar>
                        </div>
                    </div>

                    <div style="float: right; text-align: start">
                        <i class="el-icon-edit"></i>
                        <i class="el-icon-share"></i>
                        <i class="el-icon-delete"></i>
                    </div>

                </div>

            </el-header>
            <!--头布局End-->

            <!--主布局Start-->
            <el-main style="padding: 0;margin: 0;">
                <el-tabs v-model="currentTabName" type="card" closable @tab-remove="removeTab"
                         @tab-click="onTabSelected">
                    <el-tab-pane
                            v-for="(item, index) in tabViewDataList"
                            :key="item.name"
                            :label="item.title"
                            :name="item.name">

                        <router-view :name="item.viewName"></router-view>

                    </el-tab-pane>


                </el-tabs>

            </el-main>
            <!--朱布局End-->

        </el-container>
    </el-container>
</template>

<style scoped>
    .el-menu {
        text-align: left;
        font-weight: bolder;
    }

    .menu-title {
        font-size: larger;
    }

    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        min-height: 400px;
    }

    .menu-icon {
        color: #ffffff;
        font-weight: bold;
    }
</style>

<script>
    export default {
        name: "MainView",
        data() {
            return {
                logoUrl: require('../assets/images/logo.png'),
                isCollapse: false,
                currentTabName: '2',
                tabViewDataList: [],
                tabIndex: 2
            }
        }
        ,
        mounted: function () {
            //默认第一个菜单被选中
            this.onMenuSelected("1",1);
        }
        ,
        methods: {
            onMenuSelected(index, indexPath) {
                let menuData = this.menuIndexMap.get(index);
                let isAddable = true;
                this.tabViewDataList.forEach(tabViewData => {
                    if (tabViewData.viewName === menuData.viewName) {
                        isAddable = false;
                    }
                });
                if (isAddable) {
                    this.addTabView(menuData);
                } else {
                    this.currentTabName = menuData.viewName;
                }
            }
            ,
            onTabSelected(tab) {
                console.info(tab);
            },
            addTabView(menuData) {
                this.tabViewDataList.push({
                    title: menuData.title,
                    name: menuData.viewName,
                    viewName: menuData.viewName
                });
                this.currentTabName = menuData.viewName;
            },
            removeTab(targetName) {
                let tabs = this.tabViewDataList;
                let activeName = this.currentTabName;
                if (activeName === targetName) {
                    tabs.forEach((tab, index) => {
                        if (tab.name === targetName) {
                            let nextTab = tabs[index + 1] || tabs[index - 1];
                            if (nextTab) {
                                activeName = nextTab.name;
                            }
                        }
                    });
                }

                this.currentTabName = activeName;
                this.tabViewDataList = tabs.filter(tab => tab.name !== targetName);
            }
        }
        ,
        computed: {
            menuIndexMap() {
                var menuIndexMap = new Map();
                menuIndexMap.set("1", {viewName: "home_view", title: "主页"});
                menuIndexMap.set("2-1", {viewName: "admin_user_view", title: "管理员账号管理"});
                menuIndexMap.set("2-2", {viewName: "registered_user_view", title: "普通用户管理"});
                return menuIndexMap;
            }
        }
    }
    ;
</script>
