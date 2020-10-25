<template>
    <div>
        <el-dialog slot="header" title="" :visible.sync="visible" width="70%" @open="onOpened"
                   :show-close="false" :center="true" :close-on-press-escape="false" :close-on-click-modal="false"
                   v-loading="true">

            <div class="title" style="background: #07d02c;color: #ffffff;" slot="title">{{title}}</div>

            <el-form :model="formData" label-position="left">
                <el-form-item label="帐号名" :label-width="formLabelWidth">
                    <el-input v-model="formData.account" autocomplete="off" @input="onFormChanged"></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth">
                    <el-input v-model.lazy="formData.password" autocomplete="off"
                              :placeholder="passwordHint" @input="onFormChanged"
                              v-bind:show-password="dataSource==null"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" :label-width="formLabelWidth">
                    <el-input v-model="formData.phoneNumber" autocomplete="off"
                              @input="onFormChanged"></el-input>
                </el-form-item>
                <el-form-item label="邮箱地址" :label-width="formLabelWidth">
                    <el-input v-model="formData.emailAddress" autocomplete="off"
                              @input="onFormChanged"></el-input>
                </el-form-item>

                <el-form-item v-show="dataSource!=null" label="是否可用" :label-width="formLabelWidth">
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
        name: "UpdateRandlUserDialog",
        props: ['dataSource', 'visible', 'title'],
        components: {},

        mounted: function () {
        },

        data: function () {
            return {
                passwordHint: "需要更新密码才填",
                formLabelWidth: '120px',
                formData: {
                    uid: null,
                    account: null,
                    password: null,
                    phoneNumber: null,
                    emailAddress: null,
                    accountStatus: null
                },
                isFormChanged: false,
                isProcessingOption: false
            }
        },
        computed: {
            isEnabled: {
                get: function () {
                    return this.formData.accountStatus === 1;
                },
                set: function (newValue) {
                    if (newValue) {
                        this.formData.accountStatus = 1;
                    }
                    else {
                        this.formData.accountStatus = 0;
                    }
                }
            }

        },
        methods: {
            /**
             * 当点击取消或者确定关闭对话框时
             * @param now 是否马上关闭
             */
            changeVisible(now) {
                let Vue = this;
                if (now || !this.isFormChanged) {
                    this.$emit('update:visible', false);
                }
                else {
                    this.isProcessingOption = true;

                    let caller = (data) => {
                        if (data.isSuccessful) {
                            Vue._data.isProcessingOption = false;
                            Vue.$emit('update:visible', false);
                            Vue.$messageUtil.success(data.responseBody);
                            Vue.handleDoneEvent();
                        }
                        else {
                            Vue._data.isProcessingOption = false;
                            Vue.$messageUtil.error("操作失败！" + data.responseBody);
                        }
                    };

                    apiHandler.getUserApi().update(this.formData, caller);
                }
            }
            ,
            onOpened: function () {
                let Vue=this;
                this.isFormChanged = false;
                this.loadingFormData();
            },
            loadingFormData() {
                this.formData.uid = this.dataSource.uid;
                this.formData.account = this.dataSource.account;
                this.formData.phoneNumber = this.dataSource.phoneNumber;
                this.formData.emailAddress = this.dataSource.emailAddress;
                this.formData.accountStatus = this.dataSource.accountStatus;
                this.formData.password = null;
            },
            handleDoneEvent() {
                let registeredUser = {};

                Object.keys(this.formData).forEach(key => {
                    registeredUser[key] = this.formData[key];
                });

                this.$emit('done', registeredUser);
            }
            ,
            onFormChanged() {
                this.isFormChanged = true;
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