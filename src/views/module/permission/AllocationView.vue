<template>
    <div>
        <el-row>
            <el-col :span="24">
                <div style="margin-bottom: 20px;">
                    <span>角色：</span>
                    <el-select v-model="roleHolder.selectedRoleId" placeholder="请选择要分配权限的角色"
                               @change="onRoleChanged">
                        <el-option v-for="item in roleHolder.roles" :label="item.description" :key="item.fid"
                                   :value="item.fid"/>
                    </el-select>

                    <el-button
                            style="margin-left: 10px;"
                            type="primary" icon="el-icon-refresh" size="small" round @click="refreshData">刷新
                    </el-button>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="20" :offset="4">
                <div>
                    <el-transfer
                            style="text-align: left"
                            filterable
                            :titles="['未拥有权限','已有权限']"
                            :filter-method="apiHolder.filterMethod"
                            filter-placeholder="请输入接口名"
                            v-model="apiHolder.selectedApiIds"
                            :data="transferData">
                    </el-transfer>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-button type="primary" @click="submitPermission">提交</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import apiHandler from "@/api/base/ApiHandler";

    export default {
        name: "AllocationView",
        created: function () {
            this.refreshData();
        },
        data() {
            return {
                roleHolder: {
                    roles: [],
                    selectedRoleId: null
                },
                apiHolder: {
                    selectedApiIds: [],
                    unselectedApis: [],
                    allApis: [],
                    filterMethod(queryStr, item) {
                        if (queryStr.length === 0) {
                            return true;
                        }
                        else {
                            let queryApiId = Number(queryStr);
                            return queryApiId === item.key;
                        }
                    }
                },
                transferData: [],
                permissionMap: new Map()
            };
        }
        ,
        computed: {},
        methods: {
            refreshData: function () {
                let Vue = this;
                this.roleHolder.selectedRoleId = null;
                this.roleHolder.selectedApis = [];

                const loading = this.$loading({
                    lock: true,
                    text: '获取角色权限信息中。。。',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                let sign = 0;

                apiHandler.getRoleApi().getAll(null, (data) => {
                    if (data.isSuccessful) {
                        Vue._data.roleHolder.roles = data.responseBody;
                        sign++;
                        if (sign === 3) {
                            loading.close();
                        }
                    }
                    else {
                        loading.close();
                        Vue.$messageUtil.error(data.responseBody);
                    }
                });
                apiHandler.getApiInfoApi().getAll(null, (data) => {
                    if (data.isSuccessful) {
                        Vue._data.apiHolder.allApis = data.responseBody;
                        sign++;
                        Vue._data.transferData = [];
                        for (let api of Vue._data.apiHolder.allApis) {
                            Vue._data.transferData.push({
                                label: api.path,
                                key: api.fid
                            });
                        }

                        if (sign === 3) {
                            loading.close();
                        }
                    }
                    else {
                        loading.close();
                        Vue.$messageUtil.error(data.responseBody);
                    }
                });
                apiHandler.getPermissionApi().getAll(null, (data) => {
                    if (data.isSuccessful) {
                        let allPermissions = data.responseBody;
                        for (let permission of allPermissions) {
                            let permissions = this.permissionMap.get(permission.roleId);
                            if (permissions == null) {
                                permissions = [];
                            }
                            permissions.push(permission);
                            this.permissionMap.set(permission.roleId, permissions);

                            sign++;
                            if (sign === 3) {
                                loading.close();
                            }
                        }
                    }
                    else {
                        loading.close();
                        Vue.$messageUtil.error(data.responseBody);
                    }
                });
            },
            onRoleChanged: function (selectedRoleId) {
                let Vue = this;
                let selectedPermissions = this.permissionMap.get(selectedRoleId);
                if (selectedPermissions === undefined) {
                    selectedPermissions = [];
                }
                //get到被选中的api
                this.apiHolder.selectedApiIds = [];
                for (let permission of selectedPermissions) {
                    this.apiHolder.selectedApiIds.push(permission.apiId);
                }
                //过滤出未被选中的api
                this.apiHolder.unselectedApis = this.apiHolder.allApis.filter(function (item) {
                    for (let selectApiId of Vue._data.apiHolder.selectedApiIds) {
                        if (selectApiId === item.fid) {
                            return false;
                        }
                    }
                    return true;
                });
            }
            ,
            submitPermission() {
                let Vue = this;
                if (this.roleHolder.selectedRoleId === null) {
                    this.$messageUtil.error("角色未选择");
                }
                else {
                    let data = {
                        roleId: Vue._data.roleHolder.selectedRoleId,
                        apiIds: Vue._data.apiHolder.selectedApiIds
                    };
                    apiHandler.getPermissionApi().set(data, (data) => {
                        if (data.isSuccessful) {
                            Vue.$messageUtil.success(data.responseBody);
                        }
                        else {
                            Vue.$messageUtil.error(data.responseBody);
                        }
                    });
                }
            }
        }
    };
</script>

<style scoped>
    .el-transfer {
        margin-left: 20px;
        padding: 6px 5px;
    }
</style>