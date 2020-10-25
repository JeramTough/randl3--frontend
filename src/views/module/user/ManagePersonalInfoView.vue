<template>

    <div>

        <el-row>
            <el-col :span="18">
                <div>
                    <el-form :inline="true" :model="searchParameter" class="demo-form-inline">
                        <el-form-item label="按关键字模糊搜索">
                            <el-input v-model="searchParameter.keyword" placeholder="关键字"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" @click="queryByKeyword">查询
                            </el-button>
                            <el-button type="primary" icon="el-icon-s-grid" @click="queryByKeyword">高级搜索
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
                    type="expand"
                    label=">(点击)"
                    width="100">
                <template slot-scope="props">
                    <div>
                        <el-form label-position="left" class="table-expand">
                            <el-form-item label="帐号名">
                                <span>{{ props.row.account }}</span>
                            </el-form-item>
                            <el-form-item label="真实名字">
                                <span>{{ props.row.realname }}</span>
                            </el-form-item>
                            <el-form-item label="昵称">
                                <span>{{ props.row.nickname }}</span>
                            </el-form-item>
                            <el-form-item label="年龄">
                                <span>{{ props.row.age }}</span>
                            </el-form-item>
                            <el-form-item label="性别">
                                <span>{{ props.row.gender }}</span>
                            </el-form-item>
                            <el-form-item label="生日">
                                <span>{{ props.row.birthday }}</span>
                            </el-form-item>
                            <el-form-item label="手机号码">
                                <span>{{ props.row.phoneNumber }}</span>
                            </el-form-item>
                            <el-form-item label="手机号码">
                                <span>{{ props.row.phoneNumber }}</span>
                            </el-form-item>
                            <el-form-item label="身份证号码">
                                <span>{{ props.row.identityNumber }}</span>
                            </el-form-item>
                            <el-form-item label="联系方式">
                                <span>{{ props.row.contactWays }}</span>
                            </el-form-item>
                            <el-form-item label="毕业学校">
                                <span>{{ props.row.school }}</span>
                            </el-form-item>
                            <el-form-item label="职业">
                                <span>{{ props.row.job }}</span>
                            </el-form-item>
                            <el-form-item label="家庭地址">
                                <span>{{ props.row.homeAddress }}</span>
                            </el-form-item>
                            <el-form-item label="个性签名">
                                <span>{{ props.row.personalizedSignature }}</span>
                            </el-form-item>
                        </el-form>
                    </div>
                </template>
            </el-table-column>

            <el-table-column
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
                    prop="realname"
                    label="真实名字"
                    width="120">
                <template slot-scope="scope">
                    <el-tag v-show="scope.row.realname!=null&&scope.row.realname.length>0">
                        <div style="font-weight: bolder">{{ scope.row.realname }}</div>
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column
                    prop="nickname"
                    label="昵称"
                    width="120">
                <template slot-scope="scope">
                    <el-tag v-show="scope.row.nickname!=null&&scope.row.nickname.length>0" type="info">
                        <div style="font-weight: bolder">{{ scope.row.nickname }}</div>
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column
                    prop="gender"
                    label="性别"
                    width="120">
                <template slot-scope="scope">
                    <el-tag type="success" effect="dark"
                            v-show="scope.row.gender==='男'">
                        <div style="font-weight: bolder"><i class="el-icon-male"></i></div>
                    </el-tag>
                    <el-tag type="danger" effect="dark"
                            v-show="scope.row.gender==='女'">
                        <div style="font-weight: bolder"><i class="el-icon-female"></i></div>
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column
                    prop="age"
                    label="年龄"
                    width="120">
            </el-table-column>

            <el-table-column
                    prop="phoneNumber"
                    label="手机号"
                    width="120">
            </el-table-column>


            <el-table-column
                    fixed="right"
                    label="操作"
                    width="120">
                <template slot-scope="scope">
                    <el-button
                            @click.native.prevent="updateRowForPersonalInfo(scope.$index, tableData)"
                            type="text"
                            size="small">
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
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="currentPageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="currentTotal">
            </el-pagination>
        </div>

        <el-divider/>

        <!--对话框控件-->
        <my-up-dialog :data-source="selectedEntity" :visible.sync="dialogVisible2" :title="'编辑用户个人信息'"
                      v-on:done="onDialogDone"/>
    </div>

</template>

<script>
    import apiHandler from "@/api/base/ApiHandler";
    import UPdialog from "@/components/dialog/UpdatePersonalInfoDialog.vue";

    export default {
        name: "ManagePersonalInfoView",
        components: {
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
                apiHandler.getPersonalInfoApi().getByPage({
                    index: this.currentPageIndex,
                    size: this.currentPageSize
                }).then(function (data) {
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
                    Vue._data.isLoading = false;
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
                    apiHandler.getUserApi().condition({keyword: this.searchParameter.keyword}, (data) => {
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
            onDialogDone(editedPersonalInfo) {
                //更新的情况下
                // this.selectedEntity = editedRegisteredUser;
                Object.keys(editedPersonalInfo).forEach(key => {
                    this.selectedEntity[key] = editedPersonalInfo[key];
                });
            }
        },
    }
</script>

<style>
    .table-expand {
        font-size: 0;
    }

    .table-expand label {
        width: 100px;
        color: #009e21;
        font-weight: bold;
    }

    .table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 100%;
        text-align: left;
        border-style: dotted;
        border-color: #aec684;
        color: black;
    }
</style>