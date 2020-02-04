<template>
    <el-container>
        <!--侧边菜单Start-->
        <el-menu default-active="home" class="el-menu-vertical-demo"
                 @select="onMenuSelected"
                 :collapse="isCollapse"
                 background-color="#6fa55c"
                 text-color="#fff"
                 active-text-color="#ffd04b">

            <div style="background: #168825">
                <el-image
                        fit="fill" :src="logoUrl"></el-image>
            </div>

            <el-menu-item index="home">
                <i class="el-icon-s-home menu-icon"></i>
                <span slot="title" class="menu-title">首页</span>
            </el-menu-item>
            <el-submenu index="2">
                <template slot="title">
                    <i class="el-icon-s-custom menu-icon"></i>
                    <span slot="title" class="menu-title">用户管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="admin-user-management">管理员账户管理</el-menu-item>
                    <el-menu-item index="registered-user-management">普通用户管理</el-menu-item>
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
                <div style="margin-bottom: 20px;">
                    <el-button
                            size="small"
                            @click="addTab(editableTabsValue)">
                        add tab
                    </el-button>
                </div>
                <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab"
                         @tab-click="onTabSelected">
                    <el-tab-pane
                            v-for="(item, index) in editableTabs"
                            :key="item.name"
                            :label="item.title+index"
                            :name="item.name">

                        <router-view :name="item.content"></router-view>
                        
                    </el-tab-pane>


                </el-tabs>

                <div>
                    {{editableTabsValue}}
                    <router-view></router-view>
                </div>

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
                editableTabsValue: '2',
                editableTabs: [{
                    title: 'Tab 1',
                    name: '1',
                    content: 'home_view'
                }, {
                    title: 'Tab 2',
                    name: '2',
                    content: 'admin_user_view'
                }],
                tabIndex: 2
            }
        }
        ,
        methods: {
            onMenuSelected(index, indexPath) {
                console.info(index + "===" + indexPath)
            }
            ,
            onTabSelected(tab) {
                console.info(tab);
            },
            // eslint-disable-next-line no-unused-vars
            addTab(targetName) {
                let newTabName = ++this.tabIndex + '';
                this.editableTabs.push({
                    title: 'New Tab',
                    name: newTabName,
                    content: 'New Tab content'
                });
                this.editableTabsValue = newTabName;
            }
            ,
            removeTab(targetName) {
                let tabs = this.editableTabs;
                let activeName = this.editableTabsValue;
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

                this.editableTabsValue = activeName;
                this.editableTabs = tabs.filter(tab => tab.name !== targetName);
            }
        }
    }
    ;
</script>
