<template>
    <el-container v-if="menuStructure!=null">

        <!--侧边菜单Start-->
        <el-menu default-active="0" class="el-menu-vertical-demo"
                 @select="onMenuSelected"
                 :collapse="isCollapse"
                 background-color="#6fa55c"
                 text-color="#fff"
                 active-text-color="#ffd04b">

            <div style="background: #168825">
                <el-image fit="fill" :src="logoUrl"></el-image>
            </div>



            <div v-for="(subMenuStructure,index1) in menuStructure.subs" :key="subMenuStructure.value.fid">

                <!--没有子菜单的菜单项-->
                <el-menu-item v-if="subMenuStructure.subs.length==0"
                              :disabled="!subMenuStructure.value.isAble"
                              :index="index1.toString()">
                    <i :class="subMenuStructure.value.icon"></i>
                    <span slot="title" class="menu-title">{{subMenuStructure.value.description}}</span>
                </el-menu-item>

                <!--有子菜单的菜单项-->
                <el-submenu v-if="subMenuStructure.subs.length>0"
                            :index="index1.toString()">

                    <template slot="title">
                        <i :class="subMenuStructure.value.icon"></i>
                        <span slot="title" class="menu-title">{{subMenuStructure.value.description}}</span>
                    </template>

                    <el-menu-item-group>
                        <el-menu-item
                                v-for="(subMenuStructureTwo,index2) in subMenuStructure.subs"
                                :disabled="!subMenuStructureTwo.value.isAble"
                                :index="index1+'-'+index2">
                            {{subMenuStructureTwo.value.description}}
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
                                    /&nbsp;{{ item.description }}
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
                            :key="item.name"
                            :label="item.description"
                            :name="item.name">

                        <router-view :name="item.path"></router-view>

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
    import StatusButton from '@/components/button/StatusButton.vue';
    import menuNoteHandler from '@/jscomponent/MenuNoteHandler';


    export default {
        name: "MainView",

        components: {
            "my-status-button": StatusButton
        }
        ,
        mounted: function () {
            //从浏览器缓存里恢复登录状态
            this.$store.commit('initFromCache');

            this.menuStructure = this.$store.state.systemUser.menu;

            this.menuNotes = menuNoteHandler.getNotes();
            //默认第一个菜单被选中
            // this.onMenuSelected("0", 1);
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
                menuStructure: null
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
                    menuData.index=index;
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
                        if (tab.viewName === targetName) {
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
            getMenuDataQueue: function (index) {
                let indexs = index.split("-");
                let menuDataQueue = [];
                let menuStructures = this.menuStructure.subs;

                indexs.forEach((value) => {
                    let menuData = menuStructures[Number(value)].value;
                    menuDataQueue.push(menuData);
                    menuStructures = menuStructures[Number(value)].subs;
                });

                return menuDataQueue;
            }
        }
        ,
        computed: {}
    }
    ;
</script>
