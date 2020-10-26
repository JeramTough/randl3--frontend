<template>

    <div>

        <el-row>
            <el-col :span="18">
                <div>
                    <el-form :inline="true" :model="searchParameter" class="demo-form-inline">
                        <el-form-item label="关键字">
                            <el-input style="min-width: 250px"
                                      v-model="searchParameter.keyword" placeholder="模糊搜索(ID,接口路径值,描述...)"
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
                            <el-button type="primary" icon="el-icon-search" @click="queryByCondition">查询</el-button>
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

        <el-row>
            <el-col :span="6">
                <randl-app-selector v-on:on-app-selected="onAppSelected"/>
            </el-col>
            <el-col :span="18">
                <el-table
                        :data="tableData"
                        v-loading="isLoading"
                        style="width: 100%"
                        height="400">
                    <el-table-column
                            fixed
                            prop="fid"
                            label="ID"
                            width="80">
                    </el-table-column>
                    <el-table-column
                            prop="path"
                            label="路径值"
                            width="250">
                    </el-table-column>
                    <el-table-column
                            prop="alias"
                            label="接口别名"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            prop="createTime"
                            label="创建时间"
                            width="150">
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
            </el-col>
        </el-row>

        <el-divider/>

        <!--对话框控件-->
        <my-au-dialog :data-source="selectedApi" :visible.sync="dialogVisible" :title="dialogTitle"
                      :app-id="selectedAppFid"
                      v-on:done="onDialogDone"/>
    </div>

</template>

<script>
    import apiHandler from "@/api/base/ApiHandler";
    import AUdialog from "@/components/dialog/AddOrUpdateApiDialog.vue";
    import RandlAppSelector from "@/components/selector/RandlAppSelector.vue";
    import jsValidate from '@/util/JsValidate';
    import dateTimeUtil from '@/util/DateTimeUtil.js';


    export default {
        name: "ManagerApiView",

        components: {
            "my-au-dialog": AUdialog,
            "randl-app-selector": RandlAppSelector
        },
        mounted: function () {
        },
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
                currentPageSize: 100,
                /**
                 *表格数据
                 */
                tableData: []
                ,
                dateSelectorArray: [],
                searchParameter: {
                    keyword: null,
                    startDate: null,
                    endDate: null
                },
                selectedApi: null,

                /**
                 *选中的RandlApp
                 */
                selectedApp: null
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
            selectedAppFid: function () {
                if (this.selectedApp) {
                    return this.selectedApp.fid;
                }
                else {
                    return 0;
                }
            }
        }
        ,
        methods: {

            onAppSelected(appData) {
                this.selectedApp = appData;
                this.obtainTableData();
            }
            ,
            obtainTableData() {
                this.isLoading = true;
                let Vue = this;

                if (this.selectedApp == null) {
                    Vue.$messageUtil.error("没有选中的app！");
                    return;
                }

                apiHandler.getApiInfoApi().condition({
                    index: this.currentPageIndex,
                    size: this.currentPageSize,
                    appId: this.selectedApp.fid
                }).then(function (data) {
                    if (data.isSuccessful) {
                        let pageData = data.responseBody;
                        Vue._data.isLoading = false;
                        Vue._data.tableData = pageData.list;
                        Vue.$messageUtil.success("刷新接口数据成功！");
                    }
                    else {
                        Vue.$messageUtil.error("操作失败！" + data.responseBody);
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

                apiHandler.getApiInfoApi().condition({
                    index: this.currentPageIndex,
                    size: this.currentPageSize,
                    appId: this.selectedApp.fid,
                    keyword: this.searchParameter.keyword,
                    startDate: this.searchParameter.startDate,
                    endDate: this.searchParameter.endDate,
                }).then(function (data) {
                    if (data.isSuccessful) {
                        let pageData = data.responseBody;
                        Vue._data.isLoading = false;
                        Vue._data.tableData = pageData.list;
                        Vue.$messageUtil.success("刷新接口数据成功！");
                    }
                    else {
                        Vue.$messageUtil.error("操作失败！" + data.responseBody);
                    }
                });

            },
            deleteRow(index, rows) {
                this.$messageUtil.sureDialog("是否删除该接口？", () => {
                    let fid = rows[index].fid;
                    this.isLoading = true;
                    let Vue = this;
                    apiHandler.getApiInfoApi().remove({fid: fid}, (data) => {
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
                this.dialogTitle = "修改接口信息";
                this.dialogVisible = true;
                this.selectedApi = rows[index];
            }
            ,
            addRow() {
                this.dialogTitle = "添加新接口";
                this.dialogVisible = true;
                this.selectedApi = null;
            }
            ,
            onDialogDone(editedApi) {

                if (editedApi.fid == null) {
                    //新增的情况下
                    this.obtainTableData();
                }
                else {
                    //更新的情况下
                    Object.keys(editedApi).forEach(key => {
                        this.selectedApi[key] = editedApi[key];
                    });
                }
            }
        },
    }
</script>
