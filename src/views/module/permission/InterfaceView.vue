<template>

    <div>

        <el-row>
            <el-col :span="18">
                <div>
                    <el-form :inline="true" :model="searchParameter" class="demo-form-inline">
                        <el-form-item label="模糊搜索">
                            <el-input v-model="searchParameter.keyword" placeholder="ID,接口路径值,描述"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" @click="queryByKeyword">查询</el-button>
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
                    width="80">
            </el-table-column>
            <el-table-column
                    prop="path"
                    label="路径值"
                    width="300">
            </el-table-column>
            <el-table-column
                    prop="description"
                    label="接口描述"
                    width="200">
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
        <my-au-dialog :data-source="selectedApi" :visible.sync="dialogVisible" :title="dialogTitle"
                      v-on:done="onDialogDone"/>
    </div>

</template>

<script>
    import apiHandler from "@/api/base/ApiHandler";
    import AUdialog from "@/components/AddOrUpdateApiDialog.vue";

    export default {
        name: "InterfaceView",

        components: {
            "my-au-dialog": AUdialog
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
                selectedApi: null
            }
        }
        ,
        computed: {
            /**
             *所有数量数
             */
            currentTotal: function () {
                return this.tableData.length;
            }
        }
        ,
        methods: {
            obtainTableData() {
                this.isLoading = true;
                let Vue = this;
                apiHandler.getApiInfoApi().getByPage({
                    index: this.currentPageIndex,
                    size: this.currentPageSize
                }, function (data) {
                    if (data.isSuccessful) {
                        let pageData = data.responseBody;
                        Vue._data.isLoading = false;
                        Vue._data.tableData = pageData.list;
                    }
                    else {
                        Vue.$message({
                            message: data.responseBody,
                            type: 'error'
                        });
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
                    apiHandler.getApiInfoApi().byKeyword({keyword: this.searchParameter.keyword}, (data) => {
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
                this.$messageUtil.sureDialog("是否删除该接口？",()=>{
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
