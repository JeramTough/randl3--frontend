<template>
    <el-container v-if="menuNotes!=null">
        <!--侧边菜单Start-->
        <el-menu default-active="0" class="el-menu-vertical-demo"
                 @select="onMenuSelected"
                 :collapse="isCollapse"
                 background-color="#6fa55c"
                 text-color="#fff"
                 active-text-color="#ffd04b">

            <div style="background: #168825">
                <el-image
                        fit="fill" :src="logoUrl"></el-image>
            </div>


            <div v-for="menuNote in menuNotes" :key="menuNote.index">

                <!--没有子菜单的菜单项-->
                <el-menu-item v-if="menuNote.children==null&&menuNote.isAble!==false" :index="menuNote.index">
                    <i :class="menuNote.iconClass"></i>
                    <span slot="title" class="menu-title">{{menuNote.title}}</span>
                </el-menu-item>

                <!--有子菜单的菜单项-->
                <el-submenu v-if="menuNote.children!=null&&menuNote.isAble!==false" :index="menuNote.index">
                    <template slot="title">
                        <i :class="menuNote.iconClass"></i>
                        <span slot="title" class="menu-title">{{menuNote.title}}</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item
                                v-for="childrenMenuNote in menuNote.children" :index="childrenMenuNote.index"
                                v-show="childrenMenuNote.isAble!==false">
                            {{childrenMenuNote.title}}
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
            </div>


        </el-menu>
        <!--侧边菜单End-->

        <el-container>
            <!--头布局-->
            <el-header style="padding: 0;margin: 0;background: #b6ffab;color: #ffffff;height: auto;">
                <div>
                    <el-row type="flex" align="middle">
                        <el-col :span="2">
                            <div style="text-align: left;padding-left: 2%;">
                                <my-status-button style="margin-left: 1%;display: inline;"
                                                  v-on:statuschanged="onStatusButtonChanged"/>
                            </div>
                        </el-col>
                        <el-col :span="14">
                            <div style="color: #000000;font-size: small;margin-left: 3px;margin-right: 3px;text-align: left;">
                                <span v-for="item in menuDataQueue" v-bind:key="item.index">
                                    /&nbsp;{{ item.title }}
                                </span>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div style="text-align: right">
                                <!-- 用户视图板块-Start-->
                                <router-view name="user_fragment"></router-view>
                                <!-- 用户视图板块-End-->
                            </div>

                        </el-col>
                    </el-row>
                </div>

            </el-header>
            <!--头布局End-->

            <!--主布局Start-->
            <el-main style="padding: 0;margin: 0;">
                <el-tabs v-model="currentTabName" type="card" closable @tab-remove="removeTab"
                         @tab-click="onTabSelected">
                    <el-tab-pane
                            v-for="(item, index) in tabViewDataList"
                            :key="item.viewName"
                            :label="item.title"
                            :name="item.viewName">

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
    import StatusButton from '@/components/StatusButton.vue';
    import menuNoteHandler from '@/jscomponent/MenuNoteHandler';


    export default {
        name: "MainView",

        components: {
            "my-status-button": StatusButton
        },
        mounted: function () {
            this.$store.commit('initFromCache');

            this.menuNotes = menuNoteHandler.getNotes();
            //默认第一个菜单被选中
            this.onMenuSelected("0", 1);
        }
        ,
        data() {
            return {
                logoUrl: require('../assets/images/logo_bar.jpg'),
                isCollapse: false,
                currentTabName: null,
                //缓存TabView的视图数据
                tabViewDataList: [],
                //当前选中的菜单队列数据
                menuDataQueue: [],
                menuNotes: null,
            }
        }
        ,
        methods: {
            onStatusButtonChanged(status) {
                this.isCollapse = status;
            },

            onMenuSelected(index, indexPath) {
                this.menuDataQueue = this.getMenuDataQueue(index);
                let menuData = this.menuDataQueue[this.menuDataQueue.length - 1];
                let isAddable = true;
                this.tabViewDataList.forEach(tabViewData => {
                    if (tabViewData.viewName === menuData.viewName) {
                        isAddable = false;
                    }
                });
                if (isAddable) {
                    this.addTabView(menuData);
                }
                else {
                    this.currentTabName = menuData.viewName;
                }
            }
            ,
            onTabSelected(tab) {
                let menuData = this.tabViewDataList[tab.index];
                this.menuDataQueue = this.getMenuDataQueue(menuData.index);
            },

            addTabView(menuData) {
                this.tabViewDataList.push(menuData);
                this.currentTabName = menuData.viewName;
            },

            removeTab(targetName) {
                let tabs = this.tabViewDataList;
                let activeName = this.currentTabName;
                if (activeName === targetName) {
                    tabs.forEach((tab, index) => {
                        if (tab.viewName === targetName) {
                            let nextTab = tabs[index + 1] || tabs[index - 1];
                            if (nextTab) {
                                activeName = nextTab.viewName;
                            }
                        }
                    });
                }

                this.currentTabName = activeName;
                this.tabViewDataList = tabs.filter(tab => tab.viewName !== targetName);
            }
            ,
            getMenuDataQueue: function (index) {
                let indexs = index.split("-");
                let menuDataQueue = [];
                let menuTree = this.menuNotes;
                indexs.forEach((value) => {
                    let menuData = menuTree[Number(value)];
                    menuDataQueue.push(menuData);
                    menuTree = menuData.children;
                });

                return menuDataQueue;
            }
        }
        ,
        computed: {}
    }
    ;
</script>
