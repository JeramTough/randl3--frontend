<template>
    <div>
        <el-dialog slot="header" title="" :visible.sync="visible" width="70%" @open="onOpened"
                   :show-close="false" :center="true" :close-on-press-escape="false" :close-on-click-modal="false"
                   v-loading="true">

            <div class="title" style="background: #07d02c;color: #ffffff;" slot="title">{{title}}</div>

            <el-form :model="formData" label-position="left">
                <el-form-item label="路径值" :label-width="formLabelWidth">
                    <el-input v-model="formData.path" autocomplete="off"
                              @input="onFormChanged"></el-input>
                </el-form-item>
                <el-form-item label="接口别名" :label-width="formLabelWidth">
                    <el-input v-model="formData.alias" autocomplete="off"
                              @input="onFormChanged"></el-input>
                </el-form-item>
                <el-form-item label="接口描述" :label-width="formLabelWidth">
                    <el-input v-model="formData.description" autocomplete="off"
                              @input="onFormChanged" placeholder="可以留空"></el-input>
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
        name: "AddOrUpdateApiDialog",
        props: ['dataSource', 'visible', 'title', 'appId'],
        components: {},

        mounted: function () {
        },

        data: function () {
            return {
                formLabelWidth: '120px',
                formData: {
                    fid: null,
                    path: null,
                    alias: null,
                    description: null,
                    appId: null
                },
                isFormChanged: false,
                isProcessingOption: false
            }
        },
        computed: {
            isAddOption: function () {
                return this.dataSource == null;
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
                            Vue.$messageUtil.success(data.responseBody);
                            Vue.$emit('update:visible', false);
                            Vue.handleDoneEvent();
                        }
                        else {
                            Vue._data.isProcessingOption = false;
                            Vue.$messageUtil.error("操作失败！" + data.responseBody);
                        }
                    };

                    if (!this.isAddOption) {
                        apiHandler.getApiInfoApi().update(this.formData, caller);
                    }
                    else {
                        apiHandler.getApiInfoApi().add(this.formData, caller);
                    }


                }
            }
            ,
            onOpened: function () {
                this.isFormChanged = false;
                this.refreshFormData();
            },
            refreshFormData() {
                if (!this.isAddOption) {
                    //if it's the update option’
                    this.formData.fid = this.dataSource.fid;
                    this.formData.path = this.dataSource.path;
                    this.formData.alias = this.dataSource.alias;
                    this.formData.description = this.dataSource.description;
                    this.formData.appId = this.dataSource.appId;
                }
                else {
                    //if it's the update option’
                    Object.keys(this.formData).forEach(key => {
                        this.formData[key] = null;
                    });
                    this.formData.appId = this.appId;
                }

            },
            handleDoneEvent() {
                let api = {};
                Object.keys(this.formData).forEach(key => {
                    api[key] = this.formData[key];
                });
                this.$emit('done', api);
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

