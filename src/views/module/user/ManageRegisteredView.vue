<template>

    <div>

        <el-row>
            <el-col :span="18">
                <div>
                    <el-form :inline="true" :model="searchParameter" class="demo-form-inline">
                        <el-form-item label="按关键字模糊搜索">
                            <el-input v-model="searchParameter.keyword" placeholder="账号名,手机号,邮箱"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" @click="queryByKeyword"
                                       v-bind:disabled="permissionHandler.dontHavePermissionByApiAlias('PUYH-GJZCX')">查询
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
            <el-col :span="6">
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
                    prop="enabled"
                    label="是否可用"
                    width="120">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="120">
                <template slot-scope="scope">
                    <el-button
                            @click.native.prevent="deleteRow(scope.$index, tableData)"
                            type="text"
                            size="small"
                            v-bind:disabled="permissionHandler.dontHavePermissionByApiAlias('PUYH-SCZH')">
                        删除
                    </el-button>

                    <el-button
                            @click.native.prevent="updateRow(scope.$index, tableData)"
                            type="text"
                            size="small"
                            v-bind:disabled="permissionHandler.dontHavePermissionByApiAlias('PUYH-ZHXXXG')">
                        修改
                    </el-button>
                    <el-button
                            @click.native.prevent="updateRowForPersonalInfo(scope.$index, tableData)"
                            type="text"
                            size="small"
                            v-bind:disabled="permissionHandler.dontHavePermissionByApiAlias('PUYH-GRXXXG')">
                        编辑资料
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

        <my-up-dialog :data-source="selectedEntity" :visible.sync="dialogVisible2" :title="'编辑用户个人信息'"/>
    </div>

</template>

<script>
    import apiHandler from "@/api/base/ApiHandler";
    import permissionHandler from '@/jscomponent/PermissionHanlder';
    import AUdialog from "@/components/UpdateRegisteredUserDialog.vue";
    import UPdialog from "@/components/UpdatePersonalInfoDialog.vue";

    export default {
        name: "ManageRegisteredUserView",
        components: {
            "my-au-dialog": AUdialog,
            "my-up-dialog": UPdialog
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
                    keyword: ''
                },
                selectedEntity: null,
                permissionHandler: permissionHandler
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
                apiHandler.getRegisteredUserApi().getByPage({
                    index: this.currentPageIndex,
                    size: this.currentPageSize
                }, function (data) {
                    if (data.isSuccessful) {
                        let pageData = data.responseBody;
                        Vue._data.isLoading = false;
                        for (let item of pageData.list) {
                            item.enabled = item.accountStatus === 1 ? '是' : '否';
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
            queryByKeyword() {
                let Vue = this;
                if (this.searchParameter.keyword.length > 0) {
                    apiHandler.getRegisteredUserApi().byKeyword({keyword: this.searchParameter.keyword}, (data) => {
                        if (data.isSuccessful) {
                            Vue._data.tableData = data.responseBody;
                        }
                        else {
                            Vue.$messageUtil.error(data.responseBody);
                        }
                        this.isLoading = false;
                    });
                }
                else {
                    this.obtainTableData();
                }

            },
            deleteRow(index, rows) {
                let uid = rows[index].uid;
                let Vue = this;
                this.$messageUtil.sureDialog("是否要删除该名注册用户" +
                    "【" + rows[index].account + "】", () => {
                    this.isLoading = true;
                    apiHandler.getRegisteredUserApi().remove({uid: uid}, (data) => {
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
                this.selectedEntity = editedRegisteredUser;
                this.selectedEntity.enabled = editedRegisteredUser.accountStatus === 1 ? '是' : '否';
                /*Object.keys(editedRegisteredUser).forEach(key => {
                    this.selectedEntity[key] = editedRegisteredUser[key];
                });*/
            }
        },
    }
</script>
