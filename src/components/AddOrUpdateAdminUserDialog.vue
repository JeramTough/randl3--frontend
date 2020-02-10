<template>
    <div>
        <el-dialog slot="header" title="" :visible.sync="visible" width="70%" @open="onOpened"
                   :show-close="false" :center="true" :close-on-press-escape="false" :close-on-click-modal="false"
                   v-loading="true">

            <div class="title" style="background: #07d02c;color: #ffffff;" slot="title">{{title}}</div>

            <div v-show="isLoading"><i style="font-size: large" class="el-icon-loading"></i>角色数据正在加载中。。。</div>

            <el-form v-if="((!isLoading))" :model="formData" label-position="left">
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input v-model="formData.username" autocomplete="off" @input="onFormChanged"></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth">
                    <el-input v-model.lazy="formData.password" autocomplete="off"
                              placeholder="需要修改密码才填" @input="onFormChanged"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" :label-width="formLabelWidth">
                    <el-input v-model="formData.phoneNumber" autocomplete="off"
                              @input="onFormChanged"></el-input>
                </el-form-item>
                <el-form-item label="邮箱地址" :label-width="formLabelWidth">
                    <el-input v-model="formData.emailAddress" autocomplete="off"
                              @input="onFormChanged"></el-input>
                </el-form-item>
                <el-form-item label="角色选择" :label-width="formLabelWidth" style="text-align: left">
                    <el-select v-model="formData.roleId" placeholder="角色拥有相应权限"
                               @change="onFormChanged">
                        <el-option v-for="item in roles" :label="item.description" :key="item.fid"
                                   :value="item.fid"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否可用" :label-width="formLabelWidth">
                    <el-switch v-model="isEnabled" @change="onFormChanged"></el-switch>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click.native.prevent="changeVisible(true)">取 消</el-button>
                <el-button type="primary" @click.native.prevent="changeVisible(false)"
                           :loading="isProcessingOption">确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import apiHandler from "@/api/base/ApiHandler";

    export default {
        name: "AddOrUpdateAdminUserDialog",
        props: ['dataSource', 'visible', 'title'],
        components: {},

        mounted: function () {
        },

        data: function () {
            return {
                formLabelWidth: '120px',
                roles: null,
                formData: {
                    uid: null,
                    username: null,
                    password: null,
                    phoneNumber: null,
                    emailAddress: null,
                    accountStatus: null,
                    roleId: null
                },
                isFormChanged: false,
                isProcessingOption: false
            }
        },
        computed: {
            isLoading: function () {
                return this.roles == null;
            },
            isEnabled: {
                get: function () {
                    return this.formData.accountStatus === 1;
                },
                set: function (newValue) {
                    if (newValue) {
                        this.formData.accountStatus = 1;
                    } else {
                        this.formData.accountStatus = 0;
                    }
                }
            }

        },
        methods: {
            changeVisible(now) {
                let Vue = this;
                if (now || !this.isFormChanged) {
                    this.$emit('update:visible', false);
                } else {
                    this.isProcessingOption = true;
                    apiHandler.getAdminUserApi().update(this.formData, (data) => {
                        if (data.isSuccessful) {
                            Vue._data.isProcessingOption = false;
                            Vue.$emit('update:visible', false);
                            Vue.$messageUtil.success(data.responseBody);
                            Vue.handleDoneEvent();
                        } else {
                            Vue._data.isProcessingOption = false;
                            Vue.$messageUtil.error("操作失败！" + data.responseBody);
                        }
                    });
                }
            }
            ,
            onOpened: function () {
                this.isFormChanged = false;

                let Vue = this;
                if (this.roles == null) {
                    apiHandler.getRoleApi().getAll(null, (data) => {
                        if (data.isSuccessful) {
                            Vue._data.roles = data.responseBody;
                            this.refreshFormData();
                        } else {
                            Vue.$messageUtil.error(data.responseBody);
                        }
                    });
                } else {
                    this.refreshFormData();
                }
            },
            refreshFormData() {
                this.formData.uid = this.dataSource.uid;
                this.formData.username = this.dataSource.username;
                this.formData.password = this.dataSource.password;
                this.formData.phoneNumber = this.dataSource.phoneNumber;
                this.formData.emailAddress = this.dataSource.emailAddress;
                this.formData.accountStatus = this.dataSource.accountStatus;
                this.formData.roleId = this.dataSource.role.fid;
                // this.formData.isEnabled = this.dataSource.accountStatus === 1;
            },
            handleDoneEvent() {
                let systemUser = {};
                Object.keys(this.formData).forEach(key => {
                    systemUser[key] = this.formData[key];
                });
                let thisRoleId = this.formData.roleId;
                debugger;
                let tempRoles = (this.roles.filter(item => item.fid === thisRoleId));
                systemUser.role = tempRoles[0];
                this.$emit('done', systemUser);
            }
            ,
            onFormChanged() {
                this.isFormChanged = true;
            }
        },
        watch: {
            dataSource: function (newVlue) {

            }
        }
    }
</script>

<style scoped>

    .title {
        padding: 10px;
        font-size: larger;
        /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#cbeaaf+0,74bf72+39,74bf72+67,cdeb8b+100 */
        background: #cbeaaf; /* Old browsers */
        background: -moz-linear-gradient(top, #cbeaaf 0%, #74bf72 39%, #74bf72 67%, #cdeb8b 100%); /* FF3.6-15 */
        background: -webkit-linear-gradient(top, #cbeaaf 0%, #74bf72 39%, #74bf72 67%, #cdeb8b 100%); /* Chrome10-25,Safari5.1-6 */
        background: linear-gradient(to bottom, #cbeaaf 0%, #74bf72 39%, #74bf72 67%, #cdeb8b 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
        filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#cbeaaf', endColorstr='#cdeb8b', GradientType=0); /* IE6-9 */

    }
</style>