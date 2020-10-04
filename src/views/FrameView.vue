<template>
    <el-container v-if="moduleAuthList!=null">

        <!--侧边菜单Start-->
        <el-menu default-active="0" class="el-menu-vertical-demo"
                 @select="onMenuSelected"
                 :collapse="isCollapse"
                 background-color="#6fa55c"
                 text-color="#fff"
                 active-text-color="#ffd04b"
                 :default-openeds="['1']">

            <div style="background: #168825">
                <el-image fit="fill" :src="logoUrl"></el-image>
            </div>


            <div v-for="(moduleAuth,index1) in moduleAuthList" :key="moduleAuth.mid">

                <!--没有子菜单的菜单项-->
                <el-menu-item v-if="!moduleAuth.hasChildren"
                              v-show="moduleAuth.isAuth"
                              :disabled="!moduleAuth.isAble"
                              :index="index1.toString()">
                    <i :class="moduleAuth.icon"></i>
                    <span slot="title" class="menu-title">{{moduleAuth.name}}</span>
                </el-menu-item>

                <!--有子菜单的菜单项-->
                <el-submenu v-if="moduleAuth.hasChildren"
                            v-show="moduleAuth.isAuth"
                            :index="index1.toString()">

                    <template slot="title">
                        <i :class="moduleAuth.icon"></i>
                        <span slot="title" class="menu-title">{{moduleAuth.name}}</span>
                    </template>

                    <el-menu-item-group>
                        <el-menu-item
                                v-for="(subModuleAuth,index2) in moduleAuth.children"
                                v-show="subModuleAuth.isAuth"
                                :disabled="!subModuleAuth.isAble"
                                :index="index1+'-'+index2">
                            {{subModuleAuth.name}}
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
                                    /&nbsp;{{ item.name }}
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
                            :key="item.mid"
                            :label="item.name"
                            :name="item.name">

                        <router-view :name="item.path"></router-view>

                    </el-tab-pane>


                </el-tabs>

            </el-main>
            <!--朱布局End-->

        </el-container>
    </el-container>
</template>


<script>
    import StatusButton from '@/components/button/StatusButton.vue';


    export default {
        name: "MainView",

        components: {
            "my-status-button": StatusButton
        }
        ,
        mounted: function () {
            //从浏览器缓存里恢复登录状态
            this.$store.commit('initFromCache');

            //模块授权信息
            this.moduleAuthList = this.$store.state.systemUser.moduleAuthList;

            //默认第一个菜单被选中
            this.onMenuSelected("0", null);
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
                moduleAuthList: null
            }
        }
        ,
        methods: {
            onStatusButtonChanged(status) {
                this.isCollapse = status;
            },

            onMenuSelected(index, indexPath) {
                this.menuDataQueue = this.getMenuDataQueue(index);

                //取到队列最后的数据，也就是即将要被添加的数据
                let menuData = this.menuDataQueue[this.menuDataQueue.length - 1];
                //如果这个选项卡没有添加过才添加
                let isAddable = true;
                this.tabViewDataList.forEach(tabViewData => {
                    if (tabViewData.name === menuData.name) {
                        isAddable = false;
                    }
                });
                if (isAddable) {
                    //附上index属性
                    menuData.index = index;
                    this.addTabView(menuData);
                }
                //根据currentTabName去找相应的View视图
                this.currentTabName = menuData.name;
            }
            ,
            onTabSelected(tab) {
                let menuData = this.tabViewDataList[tab.index];
                this.menuDataQueue = this.getMenuDataQueue(menuData.index);
            },

            addTabView(menuData) {
                this.tabViewDataList.push(menuData);
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
            ,
            /**
             *
             * 根据菜单序列号，取到菜单模块数据队列
             *
             */
            getMenuDataQueue: function (index) {
                let indexs = index.split("-");
                let menuDataQueue = [];
                let moduleAuthList = this.moduleAuthList;

                indexs.forEach((i) => {
                    let menuData = moduleAuthList[Number(i)];
                    menuDataQueue.push(menuData);
                    moduleAuthList = moduleAuthList[Number(i)].children;
                });

                return menuDataQueue;
            }
        }
        ,
        computed: {}
    }
    ;
</script>

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