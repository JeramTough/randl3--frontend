<template>
    <el-container>
        <!--侧边菜单Start-->
        <el-menu default-active="1-4-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
                 :collapse="isCollapse"
                 background-color="#6fa55c"
                 text-color="#fff"
                 active-text-color="#ffd04b">

            <div style="background: #168825">sdfs</div>

            <el-menu-item index="1">
                <i class="el-icon-s-home menu-icon"></i>
                <span slot="title">首页</span>
            </el-menu-item>
            <el-submenu index="2">
                <template slot="title">
                    <i class="el-icon-s-custom menu-icon"></i>
                    <span slot="title">用户管理</span>
                </template>
                <el-menu-item-group>
                    <span slot="title">分组一</span>
                    <el-menu-item index="1-1">选项1</el-menu-item>
                    <el-menu-item index="1-2">选项2</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="分组2">
                    <el-menu-item index="1-3">选项3</el-menu-item>
                </el-menu-item-group>
                <el-submenu index="1-4">
                    <span slot="title">选项4</span>
                    <el-menu-item index="1-4-1">选项1</el-menu-item>
                </el-submenu>
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
                            @click="addTab(editableTabsValue)"
                    >
                        add tab
                    </el-button>
                </div>
                <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">
                    <el-tab-pane
                            v-for="(item, index) in editableTabs"
                            :key="item.name"
                            :label="item.title+index"
                            :name="item.name"
                    >
                        {{item.content}}
                    </el-tab-pane>
                </el-tabs>
            </el-main>
            <!--朱布局End-->

        </el-container>
    </el-container>
</template>

<style scoped>
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
                isCollapse: false,
                editableTabsValue: '2',
                editableTabs: [{
                    title: 'Tab 1',
                    name: '1',
                    content: 'Tab 1 content'
                }, {
                    title: 'Tab 2',
                    name: '2',
                    content: 'Tab 2 content'
                }],
                tabIndex: 2
            }
        }
        ,
        methods: {
            handleOpen(key, keyPath) {
                // eslint-disable-next-line no-console
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                // eslint-disable-next-line no-console
                console.log(key, keyPath);
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
            },
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
    };
</script>
