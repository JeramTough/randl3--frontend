<template>
    <div>
        <el-dialog slot="header" title="" :visible.sync="visible" width="70%" @open="onOpened"
                   :show-close="false" :center="true" :close-on-press-escape="false" :close-on-click-modal="false">

            <div class="title" style="background: #07d02c;color: #ffffff;" slot="title">{{title}}</div>

            <div v-show="isLoading"><i class="el-icon-loading"></i>角色数据正在加载中。。。</div>

            <el-form v-if="((!isLoading)&&(visible))" :model="formData" label-position="left">
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input v-model="formData.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth">
                    <el-input v-model.lazy="formData.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" :label-width="formLabelWidth">
                    <el-input v-model="formData.phoneNumber" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱地址" :label-width="formLabelWidth">
                    <el-input v-model="formData.emailAddress" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色选择" :label-width="formLabelWidth" style="text-align: left">
                    <el-select v-model="formData.roleId" placeholder="角色拥有相应权限">
                        <el-option v-for="item in roles" :label="item.description" :key="item.fid"
                                   :value="item.fid"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否可用" :label-width="formLabelWidth">
                    <el-switch v-model="formData.isEnabled"></el-switch>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click.native.prevent="changeVisible(false)">取 消</el-button>
                <el-button type="primary" @click.native.prevent="changeVisible(false)">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import apiHandler from "@/api/base/ApiHandler";

    export default {
        name: "AddOrUpdateAdminUserDialog",
        props: ['visible', 'title'],
        components: {},

        mounted: function () {
            //添加响应式属性从store里边拉。
            let editingSystemUser = this.$store.state.editingSystemUser;
            editingSystemUser.roleId=null;
            editingSystemUser.isEnabled = null;
            this.formData = Object.assign({}, this.formData, editingSystemUser);
        },

        data: function () {
            return {
                some: false,
                formLabelWidth: '120px',
                roles: null,
                formData: {}
            }
        },
        computed: {
            isLoading: function () {
                return this.roles == null;
            }
        },
        methods: {
            changeVisible(newValue) {
                this.$emit('update:visible', newValue); //这种方法是对的
            }
            ,
            onOpened: function () {
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
                let editingSystemUser = this.$store.state.editingSystemUser;
                this.formData.uid = editingSystemUser.uid;
                this.formData.username = editingSystemUser.username;
                this.formData.password = editingSystemUser.password;
                this.formData.phoneNumber = editingSystemUser.phoneNumber;
                this.formData.emailAddress = editingSystemUser.emailAddress;
                this.formData.accountStatus = editingSystemUser.accountStatus;
                this.formData.roleId = editingSystemUser.role.fid;
                this.formData.isEnabled = editingSystemUser.accountStatus === 1;
            }
        },
        watch: {}
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