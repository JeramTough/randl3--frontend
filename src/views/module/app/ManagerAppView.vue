<template>

    <div>

        <el-row>
            <el-col :span="18">
                <div>
                    <el-form :inline="true" :model="searchParameter" class="demo-form-inline">
                        <el-form-item label="关键字">
                            <el-input style="min-width: 250px"
                                      v-model="searchParameter.keyword" placeholder="模糊搜索(应用名,代码,描述...)"
                                      clearable @change="queryByCondition"></el-input>
                        </el-form-item>
                        <el-form-item label="创建时间">
                            <el-date-picker
                                    v-model="dateSelectorArray"
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
            <el-col :span="6">
                <el-button type="primary" icon="el-icon-refresh" size="small" round @click="obtainTableData">刷新
                </el-button>
                <el-button type="primary" icon="el-icon-plus" size="small" round @click="addRow">新增</el-button>
            </el-col>
        </el-row>

        <el-table
                :data="tableData"
                v-loading="isLoading"
                style="width: 100%"
                max-height="350">
            <el-table-column
                    fixed
                    prop="fid"
                    label="ID"
                    width="50">
            </el-table-column>
            <el-table-column
                    prop="appName"
                    label="应用名"
                    width="150">
            </el-table-column>
            <el-table-column
                    prop="appCode"
                    label="应用代码"
                    width="150">
            </el-table-column>
            <el-table-column
                    prop="createTime"
                    label="创建时间"
                    width="200">
            </el-table-column>
            <el-table-column
                    prop="description"
                    label="描述"
                    width="200">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top"
                                v-show="scope.row.description!=null&&scope.row.description.length>0">
                        <p> {{ scope.row.description }}</p>
                        <div slot="reference">
                            <el-tag type="info">{{
                                scope.row.description.length>8?scope.row.description.substring(0,8)+"...":scope.row.description
                                }}
                            </el-tag>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>

            <el-table-column
                    label="是否可用"
                    width="150">
                <template slot-scope="scope">
                    <!--<el-popover trigger="hover" placement="top">
                        <p>姓名: {{ scope.row.name }}</p>
                        <p>住址: {{ scope.row.address }}</p>
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">{{ scope.row.name }}</el-tag>
                        </div>
                    </el-popover>-->
                    <el-switch v-model="scope.row.enabled"
                               @change="handleSwitchChanged(scope.$index, tableData)"/>
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
                            @click.native.prevent="goUpdateRow(scope.$index, tableData)"
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
                    :page-sizes="[10, 20, 50, 100]"
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
    import AUdialog from "@/components/dialog/AddOrUpdateAppDialog.vue";
    import jsValidate from '@/util/JsValidate';
    import dateTimeUtil from '@/util/DateTimeUtil.js';

    export default {
        name: "ManagerAppView",
        components: {
            "my-au-dialog": AUdialog,
        },
        mounted: function () {
            this.obtainTableData();
        },
        /**
         *
         * @returns {{isLoading: boolean, currentPageSize: number, dialogVisible: boolean, registerDateArray: [], dialogVisible2: boolean, dialogTitle: string, tableData: [], searchParameter: {registerDateArray: [], registerDateRange: null, keyword: null}, currentPageIndex: number, selectedEntity: null}}
         */
        data() {
            return {

                /**
                 *表格是否在加载中
                 */
                isLoading: false,

                dialogVisible: false,

                dialogTitle: "",
                /**
                 *表格当前页指针
                 */
                currentPageIndex: 1,
                /**
                 *表格当前页能显示的大小
                 */
                currentPageSize: 10,

                /**
                 *
                 */
                dateSelectorArray: [],
                /**
                 *表格数据
                 */
                tableData: []
                ,
                searchParameter: {
                    keyword: null,
                    startDate: null,
                    endDate: null
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
                apiHandler.getRandlAppApi().page({
                    index: this.currentPageIndex,
                    size: this.currentPageSize
                }).then(function (data) {
                    Vue.processTableData(data);
                });
            },
            queryByCondition() {
                let Vue = this;


                this.searchParameter.index = this.currentPageIndex;
                this.searchParameter.size = this.currentPageSize;
                //参数为空设置
                if (jsValidate.isEmpty(this.searchParameter.keyword)) {
                    this.searchParameter.keyword = null;
                }
                //参数格式化时间
                if (this.dateSelectorArray != null && this.dateSelectorArray.length > 0) {
                    let startDate = this.dateSelectorArray[0];
                    let endDate = this.dateSelectorArray[1];
                    startDate = dateTimeUtil.formatDate("YYYY-mm-dd", startDate);
                    endDate = dateTimeUtil.formatDate("YYYY-mm-dd", endDate);
                    this.searchParameter.startDate = startDate
                    this.searchParameter.endDate = endDate;
                }
                else if (this.dateSelectorArray == null) {
                    this.searchParameter.startDate = null
                    this.searchParameter.endDate = null;
                }

                apiHandler.getRandlAppApi().condition(this.searchParameter)
                    .then(function (data) {
                        Vue.processTableData(data);
                    });
            },
            processTableData(data) {
                let Vue = this;
                if (data.isSuccessful) {
                    let pageData = data.responseBody;
                    Vue._data.isLoading = false;
                    //是视图化数据
                    for (let item of pageData.list) {
                        //do something
                        //是否是可用的
                        item.enabled = item.isAble === 1;
                    }
                    Vue._data.tableData = pageData.list;

                    Vue.$messageUtil.success("["+data.timestamp+"]刷新数据成功^v^");
                }
                else {
                    Vue.$messageUtil.error(data.responseBody);
                }
                Vue.isLoading = false;
            },
            handleSizeChange(val) {
                this.currentPageSize = val;
            },
            handleCurrentChange(val) {
                this.currentPageIndex = val;
                this.obtainTableData();
            },
            handleSwitchChanged(index, tableData) {
                let Vue = this;
                this.isLoading = true;
                apiHandler.getRandlAppApi().update(tableData[index]).then((data) => {
                    if (data.isSuccessful) {
                        Vue.$messageUtil.success(data.responseBody);
                    }
                    else {
                        Vue._data.tableData[index].enabled = !(Vue._data.tableData[index].enabled);
                        Vue.$messageUtil.error(data.responseBody);
                    }
                    this.isLoading = false;
                });
            },
            deleteRow(index, rows) {
                let fid = rows[index].fid;
                let Vue = this;
                this.$messageUtil.sureDialog("是否要删除该应用" +
                    "【" + rows[index].appName + "】", () => {
                    this.isLoading = true;
                    apiHandler.getRandlAppApi().remove({fid: fid}).then((data) => {
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
            goUpdateRow(index, rows) {
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
            onDialogDone(editedEntity) {
                //更新的情况下
                if (editedEntity.fid) {
                    //是否是可用的
                    this.selectedEntity.enabled = this.selectedEntity.isAble === 1;
                    Object.keys(editedEntity).forEach(key => {
                        this.selectedEntity[key] = editedEntity[key];
                    });
                }
                else {
                    this.obtainTableData();
                }

                this.selectedEntity.enabled = editedEntity.accountStatus === 1 ? '是' : '否';

            }
        },
    }
</script>

<style scoped>

</style>
