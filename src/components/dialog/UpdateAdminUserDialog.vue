<template>
    <div>
        <el-dialog slot="header" title="" :visible.sync="visible" width="70%" @open="onOpened"
                   :show-close="false" :center="true" :close-on-press-escape="false" :close-on-click-modal="false"
                   v-loading="true">

            <div class="title" style="background: #07d02c;color: #ffffff;" slot="title">修改管理员账户信息</div>

            <el-row>
                <el-col :span="24">
                    <div style="text-align: center">
                        <el-upload
                                class="avatar-uploader"
                                :auto-upload="false"
                                action="#"
                                :show-file-list="false"
                                :on-change="onChangedImageSurfaceImage">
                            <img v-if="formData.surfaceImage" :src="formData.surfaceImage" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </div>
                </el-col>
            </el-row>

            <el-form :model="formData" label-position="left">
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input v-model="formData.username" autocomplete="off" @input="onFormChanged"
                              :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth">
                    <el-input v-model.lazy="formData.password" autocomplete="off"
                              placeholder="需要更新密码才填" @input="onFormChanged"
                              v-bind:show-password="true"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" :label-width="formLabelWidth">
                    <el-input v-model="formData.phoneNumber" autocomplete="off"
                              @input="onFormChanged"></el-input>
                </el-form-item>
                <el-form-item label="邮箱地址" :label-width="formLabelWidth">
                    <el-input v-model="formData.emailAddress" autocomplete="off"
                              @input="onFormChanged"></el-input>
                </el-form-item>
                <el-form-item label="角色" :label-width="formLabelWidth">
                    <el-input v-model="systemUser.role.description" autocomplete="off"
                              :disabled="true"></el-input>
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click.native.prevent="onClose">取 消</el-button>
                <el-button type="primary" @click.native.prevent="onSubmit"
                           :loading="isProcessingOption">修改
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import apiHandler from "@/api/base/ApiHandler";

    export default {
        name: "UpdateAdminUserDialog",
        props: ['visible'],
        components: {},

        mounted: function () {
        },

        data: function () {
            return {
                formLabelWidth: '120px',
                systemUser: {role: {description: null}},
                formData: {
                    uid: null,
                    username: null,
                    password: null,
                    phoneNumber: null,
                    emailAddress: null,
                    surfaceImage: null,
                },
                isFormChanged: false,
                isSurfaceImageChanged: false,
                isProcessingOption: false
            }
        },
        computed: {},
        methods: {
            onOpened: function () {
                this.isFormChanged = false;
                this.isSurfaceImageChanged=false;
                this.refreshFormData();
            },
            refreshFormData() {
                this.systemUser = this.$store.state.systemUser;

                this.formData.uid = this.systemUser.uid;
                this.formData.username = this.systemUser.username;
                this.formData.phoneNumber = this.systemUser.phoneNumber;
                this.formData.emailAddress = this.systemUser.emailAddress;
                this.formData.surfaceImage = this.systemUser.surfaceImage;
            },
            onChangedImageSurfaceImage(file) {
                let Vue = this;
                file = file = file.raw;

                this.isSurfaceImageChanged = true;

                const isJPG = file.type === 'image/jpeg';
                const isPNG = file.type === 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 0.5;
                let isImage = isJPG || isPNG;


                if (!isImage) {
                    this.$messageUtil.error('上传头像图片只能是 JPG或者PNG格式!');
                }
                if (!isLt2M) {
                    this.$messageUtil.error('上传头像图片大小不能超过 500KB!');
                }

                // this.imageUrl = URL.createObjectURL(file);

                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (e) {
                    Vue._data.formData.surfaceImage = this.result;
                };

                return isImage && isLt2M;
            },
            onClose() {
                this.$emit('update:visible', false);
            }
            ,
            onSubmit() {
                let Vue = this;

                let updateAdminInfo = function () {
                    apiHandler.getRandlUserApi().updateCurrent({
                        phoneNumber: Vue._data.formData.phoneNumber,
                        emailAddress: Vue._data.formData.emailAddress,
                        password: Vue._data.formData.password
                    }, (data) => {
                        if (data.isSuccessful) {
                            Vue.$messageUtil.success1(data.responseBody);
                            Vue._data.systemUser.phoneNumber = Vue._data.formData.phoneNumber;
                            Vue._data.systemUser.emailAddress = Vue._data.formData.emailAddress;
                            //更新用户登录数据
                            Vue.$store.commit('loginSuccessfully', Vue._data.systemUser);
                            Vue.$emit('update:visible', false);
                        }
                        else {
                            Vue.$messageUtil.error(data.responseBody);
                        }
                        Vue._data.isProcessingOption = false;
                    });
                };

                if (this.isSurfaceImageChanged) {
                    this.isProcessingOption = true;
                    let data = {
                        surfaceImage: Vue._data.formData.surfaceImage
                    };
                    apiHandler.getSurfaceImageApi().updateCurrentAdmin(data, (data) => {
                        if (data.isSuccessful) {
                            Vue._data.surfaceImage = data.responseBody.surfaceImage;
                            Vue.$store.commit('loginSuccessfully', Vue._data.systemUser);
                            Vue.$messageUtil.success1("更新头像成功！下次登录生效");

                            if (!Vue._data.isFormChanged) {
                                Vue._data.isProcessingOption = false;
                                Vue.$emit('update:visible', false);
                            }
                            else {
                                updateAdminInfo();
                            }
                        }
                        else {
                            Vue.$messageUtil.error(data.responseBody);
                            Vue._data.isProcessingOption = false;
                        }
                    });
                }
                else {
                    if (this.isFormChanged) {
                        this.isProcessingOption = true;
                        updateAdminInfo();
                    }
                    else{
                        Vue.$emit('update:visible', false);
                    }
                }
            },
            handleDoneEvent() {
                let systemUser = {};

                let selectRole=null;
                for (let role of this.roles){
                    if (role.fid===this.formData.roleId){
                        selectRole=role;
                        break;
                    }
                }
                systemUser.role=selectRole;

                Object.keys(this.formData).forEach(key => {
                    systemUser[key] = this.formData[key];
                });
                this.$emit('done', systemUser);
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

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>