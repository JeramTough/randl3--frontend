<template>

    <div>

        <el-row>
            <el-col :span="21">
                <div>
                    <el-form :inline="true" :model="searchParameter" class="demo-form-inline">
                        <el-form-item label="关键字">
                            <el-input style="min-width: 250px"
                                      v-model="searchParameter.keyword" placeholder="模糊搜索(账号名,手机号,邮箱...)"></el-input>
                        </el-form-item>
                        <el-form-item label="注册时间">
                            <el-date-picker
                                    v-model="searchParameter.registerDateRange"
                                    type="daterange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" @click="queryByCondition">查询
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
            <el-col :span="3">
                <el-button type="primary" icon="el-icon-refresh" size="small" round @click="obtainTableData">刷新
                </el-button>
            </el-col>
        </el-row>

        <el-table
                :data="tableData"
                v-loading="isLoading"
                style="width: 100%"
                max-height="350">
            <el-table-column
                    fixed
                    prop="uid"
                    label="ID"
                    width="50">
            </el-table-column>
            <el-table-column
                    prop="account"
                    label="帐号名"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="phoneNumber"
                    label="手机号"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="emailAddress"
                    label="邮箱地址"
                    width="150">
            </el-table-column>
            <el-table-column
                    prop="registrationTime"
                    label="注册时间"
                    width="200">
            </el-table-column>

            <el-table-column
                    prop="registrationIp"
                    label="注册IP"
                    width="150">
            </el-table-column>

            <el-table-column
                    prop="channelName"
                    label="注册渠道"
                    width="150">
            </el-table-column>

            <el-table-column
                    label="是否可用"
                    width="120">
                <template slot-scope="scope">
                    <!--<el-popover trigger="hover" placement="top">
                        <p>姓名: {{ scope.row.name }}</p>
                        <p>住址: {{ scope.row.address }}</p>
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">{{ scope.row.name }}</el-tag>
                        </div>
                    </el-popover>-->
                    <el-switch v-model="tableData[scope.$index].enabled"/>
                </template>
            </el-table-column>

            <el-table-column
                    fixed="right"
                    label="操作"
                    width="120">
                <template slot-scope="scope">
                    <el-button
                            @click.native.prevent="deleteRow(scope.$index, tableData)"
                            type="text"
                            size="small">
                        删除
                    </el-button>

                    <el-button
                            @click.native.prevent="updateRow(scope.$index, tableData)"
                            type="text"
                            size="small">
                        修改
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="block">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPageIndex"
                    :page-sizes="[100, 200, 300, 400]"
                    :page-size="currentPageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="currentTotal">
            </el-pagination>
        </div>

        <el-divider/>

        <!--对话框控件-->
        <my-au-dialog :data-source="selectedEntity" :visible.sync="dialogVisible" :title="dialogTitle"
                      v-on:done="onDialogDone"/>
    </div>

</template>

<script>
    import apiHandler from "@/api/base/ApiHandler";
    import AUdialog from "@/components/dialog/UpdateRegisteredUserDialog.vue";
    import jsValidate from '@/util/JsValidate';
    import UPdialog from "@/components/dialog/UpdatePersonalInfoDialog.vue";

    export default {
        name: "ManageRegisteredUserView",
        components: {
            "my-au-dialog": AUdialog,
        },
        mounted: function () {
            this.obtainTableData();
        },
        data() {
            return {

                /**
                 *表格是否在加载中
                 */
                isLoading: false,

                dialogVisible: false,
                dialogVisible2: false,

                dialogTitle: "",
                /**
                 *表格当前页指针
                 */
                currentPageIndex: 1,
                /**
                 *表格当前页能显示的大小
                 */
                currentPageSize: 100,
                /**
                 *表格数据
                 */
                tableData: []
                ,
                searchParameter: {
                    keyword: null,
                    registerDateRange: null
                },
                selectedEntity: null,
            }
        }
        ,
        computed: {
            /**
             *所有数量数
             */
            currentTotal: function () {
                return this.tableData.length;
            },
            systemUser: function () {
                return this.$store.state.systemUser;
            }
        }
        ,
        methods: {
            obtainTableData() {
                this.isLoading = true;
                let Vue = this;
                apiHandler.getRandlUserApi().getByPage({
                    index: this.currentPageIndex,
                    size: this.currentPageSize
                }, function (data) {
                    if (data.isSuccessful) {
                        let pageData = data.responseBody;
                        Vue._data.isLoading = false;
                        //是视图化数据
                        for (let item of pageData.list) {
                            item.enabled = item.accountStatus != 0;
                            if (item.channel == 0) {
                                item.channelName = "0:管理员添加";
                            }
                            else if (item.channel == 1) {
                                item.channelName = "1:用户注册";
                            }
                            else if (item.channel == 2) {
                                item.channelName = "2:数据库添加";
                            }
                            else {
                                item.channelName = "其他";
                            }
                        }
                        Vue._data.tableData = pageData.list;

                    }
                    else {
                        Vue.$messageUtil.error(data.responseBody);
                    }
                });
            },
            handleSizeChange(val) {
                this.currentPageSize = val;
            },
            handleCurrentChange(val) {
                this.currentPageIndex = val;
                this.obtainTableData();
            },
            queryByCondition() {
                let Vue = this;
                this.searchParameter.index = this.currentPageIndex;
                this.searchParameter.size = this.currentPageSize;
                if (jsValidate.isEmpty(this.searchParameter.keyword)) {
                    this.searchParameter.keyword = null;
                }
                if (jsValidate.isEmpty(this.searchParameter.registerDateRange)) {
                    this.searchParameter.registerDateRange = null;
                }

                apiHandler.getUserApi().condition(this.searchParameter)
                    .then(function (data) {
                        if (data.isSuccessful) {
                            Vue._data.tableData = data.responseBody.list;
                        }
                        else {
                            Vue.$messageUtil.error(data.responseBody);
                        }
                        Vue.isLoading = false;
                    });
            },
            deleteRow(index, rows) {
                let uid = rows[index].uid;
                let Vue = this;
                this.$messageUtil.sureDialog("是否要删除该名注册用户" +
                    "【" + rows[index].account + "】", () => {
                    this.isLoading = true;
                    apiHandler.getUserApi().remove({uid: uid}, (data) => {
                        if (data.isSuccessful) {
                            Vue.$messageUtil.success(data.responseBody);
                            rows.splice(index, 1);
                        }
                        else {
                            Vue.$messageUtil.error(data.responseBody);
                        }
                        this.isLoading = false;
                    });
                });
            }
            ,
            updateRow(index, rows) {
                this.dialogTitle = "修改账号信息";
                this.selectedEntity = rows[index];
                this.dialogVisible = true;
            }
            ,
            updateRowForPersonalInfo(index, rows) {
                this.selectedEntity = rows[index];
                this.dialogVisible2 = true;
            }
            ,
            addRow() {
                this.dialogTitle = "添加新账号";
                this.dialogVisible = true;
                this.selectedEntity = null;
            }
            ,
            onDialogDone(editedRegisteredUser) {
                //更新的情况下
                // this.selectedEntity = editedRegisteredUser;
                this.selectedEntity.enabled = editedRegisteredUser.accountStatus === 1 ? '是' : '否';
                Object.keys(editedRegisteredUser).forEach(key => {
                    this.selectedEntity[key] = editedRegisteredUser[key];
                });
            }
        },
    }
</script>

<style scoped>

</style>
