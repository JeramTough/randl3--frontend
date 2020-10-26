<template>
    <div>
        <el-dialog slot="header" title="" :visible.sync="visible" width="70%" @open="onOpened"
                   :show-close="false" :center="true" :close-on-press-escape="false" :close-on-click-modal="false"
                   v-loading="true">

            <div class="title" style="background: #07d02c;color: #ffffff;" slot="title">{{title}}</div>

            <el-form :model="formData" label-position="left">
                <el-form-item label="应用名" :label-width="formLabelWidth">
                    <el-input v-model="formData.appName" autocomplete="off" @input="onFormChanged"></el-input>
                </el-form-item>

                <el-form-item v-if="isAddOption==false" label="应用代码" :label-width="formLabelWidth">
                    <el-input v-model="formData.appCode" autocomplete="off"
                              @input="onFormChanged" :disabled="true"></el-input>
                </el-form-item>

                <el-form-item v-if="isAddOption==false" label="是否可用" :label-width="formLabelWidth">
                    <el-switch v-model="isEnabled" @change="onFormChanged"></el-switch>
                </el-form-item>

                <el-form-item label="描述" :label-width="formLabelWidth">
                    <el-input class="input-textarea" type="textarea" v-model="formData.description" autocomplete="off"
                              @input="onFormChanged"
                              :autosize="{ minRows: 4, maxRows: 8}"
                              placeholder="请输入应用描述（255个字）"
                              maxlength="255"></el-input>
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
        name: "AddOrUpdateRandlUserDialog",
        props: ['dataSource', 'visible', 'title'],
        components: {},

        mounted: function () {

        },

        data: function () {
            return {
                passwordHint: null,
                formLabelWidth: '120px',
                roles: null,
                formData: {
                    fid: null,
                    appName: null,
                    description: null,
                    appCode: null,
                    isAble: null
                },
                isFormChanged: false,
                isProcessingOption: false
            }
        },
        computed: {
            isAddOption: function () {
                return this.dataSource == null;
            },
            isEnabled: {
                get: function () {
                    return this.formData.isAble === 1;
                },
                set: function (newValue) {
                    if (newValue) {
                        this.formData.isAble = 1;
                    }
                    else {
                        this.formData.isAble = 0;
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
                            Vue.$messageUtil.success1(data.responseBody);
                            Vue.handleDoneEvent();
                        }
                        else {
                            Vue._data.isProcessingOption = false;
                            Vue.$messageUtil.error("操作失败！" + data.responseBody);
                        }
                    };

                    if (this.isAddOption) {
                        apiHandler.getRandlAppApi().add1(this.formData).then(caller);
                    }
                    else {
                        apiHandler.getRandlAppApi().update(this.formData).then(caller);
                    }


                }
            }
            ,
            onOpened: function () {
                this.isFormChanged = false;

                if (this.isAddOption === false) {
                    this.formData.fid = this.dataSource.fid;
                    this.formData.appName = this.dataSource.appName;
                    this.formData.description = this.dataSource.description;
                    this.formData.appCode = this.dataSource.appCode;
                    this.formData.isAble = this.dataSource.isAble;
                }
                else {
                    Object.keys(this.formData).forEach(key => {
                        this.formData[key] = null;
                    });
                }
            },
            handleDoneEvent() {
                let entity = {};
                Object.keys(this.formData).forEach(key => {
                    entity[key] = this.formData[key];
                });
                this.$emit('done', entity);
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

    .el-form-item .input-textarea {
    }


</style>