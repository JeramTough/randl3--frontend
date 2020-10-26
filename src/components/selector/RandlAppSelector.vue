<template>
    <el-container
            v-loading="isLoading"
            element-loading-text="获取应用列表中。。。"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)">

        <el-table
                :data="tableData"
                style="width: 100%"
                max-height="320"
                highlight-current-row
                @current-change="handleTableIndexChange"
                ref="tableRef"
                :border="true">

            <el-table-column
                    label="应用名"
                    prop="appName"
                    align="left"
                    >
                <template slot="header" slot-scope="scope">
                    <el-select v-model="appNameFilter" filterable placeholder="输入应用筛选"
                               size="mini">
                        <el-option
                                v-for="item in tableData"
                                :key="item.fid"
                                :label="item.appName"
                                :value="item.fid">
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
        </el-table>

    </el-container>
</template>

<script>
    import apiHandler from "@/api/base/ApiHandler";

    export default {
        name: "RandlAppSelector",
        mounted: function () {
            this.obtainTableData();
        },
        data: function () {
            return {
                isLoading: false,
                options: [{
                    value: '选项1',
                    label: '黄金糕'
                }, {
                    value: '选项2',
                    label: '双皮奶'
                }, {
                    value: '选项3',
                    label: '蚵仔煎'
                }, {
                    value: '选项4',
                    label: '龙须面'
                }, {
                    value: '选项5',
                    label: '北京烤鸭'
                }],
                tableData: [],
                appNameFilter: ''
            }
        },
        methods: {
            handleTableIndexChange: function (currentData) {
                this.$emit('on-app-selected', currentData);
            },
            obtainTableData() {
                this.isLoading = true;
                let Vue = this;
                apiHandler.getRandlAppApi().allOnlyName().then(function (data) {
                    if (data.isSuccessful) {
                        Vue._data.tableData = data.responseBody;
                        Vue.$messageUtil.success1("刷新应用列表成功！");
                    }
                    else {
                        Vue.$messageUtil.error("操作失败！" + data.responseBody);
                    }
                    Vue._data.isLoading = false;
                });
            },
        }
    }
</script>

<style scoped>

</style>