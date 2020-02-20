<template>
    <el-dialog slot="header" title="" :visible.sync="visible" width="70%" @open="onOpened"
               :show-close="false" :center="true" :close-on-press-escape="false" :close-on-click-modal="false"
               v-loading="true">
        <div class="title" style="background: #07d02c;color: #ffffff;" slot="title">{{title}}</div>


        <div v-show="isLoading"><i style="font-size: large" class="el-icon-loading"></i>用户个人资料正在加载中。。。</div>

        <div v-if="!isLoading">
            <el-row>
                <el-col :span="24">
                    <div style="text-align: center">
                        <el-upload
                                class="avatar-uploader"
                                :auto-upload="false"
                                action="#"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess"
                                :on-change="onChangedImageSurfaceImage">
                            <img v-if="formData.surfaceImage" :src="formData.surfaceImage" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </div>
                </el-col>
            </el-row>

            <el-form ref="form" :model="formData" label-width="150px">

                <el-form-item label="昵称">
                    <el-input v-model="formData.nickname"
                              maxlength="20"
                              show-word-limit
                              @input="onFormChanged"></el-input>
                </el-form-item>

                <el-form-item
                        label="年龄"
                        prop="age"
                        :rules="[{ type: 'number', message: '年龄必须为数字值'}]">
                    <el-input type="age" v-model.number="formData.age" autocomplete="off"
                              maxlength="3"
                              show-word-limit
                              @input="onFormChanged"></el-input>
                </el-form-item>

                <el-form-item label="性别">
                    <el-radio-group v-model="formData.gender"
                                    @change="onFormChanged">
                        <el-radio label="男"></el-radio>
                        <el-radio label="女"></el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="生日">
                    <el-col :span="24">
                        <el-date-picker type="date" placeholder="选择日期" v-model="formData.birthday"
                                        style="width: 100%;"
                                        @change="onFormChanged"></el-date-picker>
                    </el-col>
                </el-form-item>

                <el-form-item label="真实姓名">
                    <el-input v-model="formData.realname"
                              maxlength="8"
                              show-word-limit
                              @input="onFormChanged"></el-input>
                </el-form-item>

                <el-form-item label="身份证号">
                    <el-input v-model="formData.identityNumber"
                              maxlength="18"
                              show-word-limit
                              @input="onFormChanged"></el-input>
                </el-form-item>

                <el-form-item label="毕业/在读学校">
                    <el-input v-model="formData.school"
                              maxlength="20"
                              show-word-limit
                              @input="onFormChanged"></el-input>
                </el-form-item>

                <el-form-item label="联系方式">
                    <el-input v-model="formData.contactWays"
                              maxlength="20"
                              show-word-limit
                              @input="onFormChanged"></el-input>
                </el-form-item>

                <el-form-item label="家庭地址">
                    <el-input v-model="formData.homeAddress"
                              maxlength="20"
                              show-word-limit
                              @input="onFormChanged"></el-input>
                </el-form-item>

                <el-form-item label="工作/职业">
                    <el-input v-model="formData.job"
                              maxlength="10"
                              show-word-limit
                              @input="onFormChanged"></el-input>
                </el-form-item>

                <el-form-item label="签名">
                    <el-input v-model="formData.personalizedSignature"
                              type="textarea"
                              maxlength="30"
                              show-word-limit
                              autosize
                              @input="onFormChanged"></el-input>
                </el-form-item>

            </el-form>
        </div>

        <div slot="footer" class="dialog-footer">
            <el-button @click.native.prevent="onClose">取 消</el-button>
            <el-button type="primary" @click.native.prevent="onSubmit"
                       :loading="isProcessingOption">修改
            </el-button>
        </div>

    </el-dialog>
</template>

<script>

    import apiHandler from "@/api/base/ApiHandler";

    export default {
        name: "UpdatePersonalInfoDialog",
        props: ['dataSource', 'visible', 'title'],
        data() {
            return {
                isLoading: false,
                dialogVisible: false,
                personalInfo: null,
                isProcessingOption: false,
                isFormChanged: false,
                isSurfaceImageChanged: false,
                formData: {
                    fid: 1,
                    surfaceImage: null,
                    nickname: "zhuzhu",
                    age: 15,
                    gender: "famale",
                    birthday: "2012-02-21",
                    realname: "韦芋竹",
                    identityNumber: 123312,
                    school: "南丹县高中",
                    contactWays: "2415598862",
                    homeAddress: "虎行路",
                    job: "学生",
                    personalizedSignature: "阿哥最帅"
                }
            };
        },
        methods: {
            handleAvatarSuccess(res, file) {
                // this.imageUrl = URL.createObjectURL(file.raw);
            },
            onChangedImageSurfaceImage(file) {
                let Vue = this;
                file = file = file.raw;

                this.isSurfaceImageChanged=true;
                this.onFormChanged();

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
            onOpened() {
                let Vue = this;
                this.isLoading = true;
                this.isSurfaceImageChanged=false;
                this.isFormChanged=false;

                apiHandler.getPersonalInfoApi().getOneByUid({uid: this.dataSource.uid}, (data) => {
                    if (data.isSuccessful) {
                        Vue._data.personalInfo = data.responseBody;
                        Object.keys(Vue._data.formData).forEach(key => {
                            Vue._data.formData[key] = data.responseBody[key] === undefined ? null : data.responseBody[key];
                        });
                        Vue._data.formData.surfaceImage = data.responseBody.surfaceImage.surfaceImage;
                        Vue._data.isLoading = false;
                    }
                    else {
                        Vue.$messageUtil.error(data.responseBody);
                    }

                })
            }
            ,
            onFormChanged() {
                this.isFormChanged = true;
            },
            onClose() {
                this.$emit('update:visible', false);
            }
            ,
            onSubmit() {
                let Vue = this;
                this.isProcessingOption = true;
                if (this.isSurfaceImageChanged) {
                    let data = {
                        surfaceImage: Vue._data.formData.surfaceImage
                    };
                    apiHandler.getSurfaceImageApi().upload(data, (data) => {
                        if (data.isSuccessful) {
                            Vue.updatePersonalInfo(data.responseBody);
                        }
                        else {
                            Vue.$messageUtil.error(data.responseBody);
                            Vue._data.isProcessingOption = false;
                        }
                    });
                }
                else {
                    Vue.updatePersonalInfo(null);
                }

            }
            ,
            updatePersonalInfo: function (surfaceImage) {
                let Vue = this;

                if (surfaceImage == null) {
                    this.formData.surfaceImageId = null;
                }
                else {
                    this.formData.surfaceImageId = surfaceImage.fid;
                }

               if (this.isFormChanged){
                   apiHandler.getPersonalInfoApi().update(this.formData, (data) => {
                       if (data.isSuccessful) {
                           Vue.$messageUtil.success(data.responseBody);
                           Vue.$emit('update:visible', false);
                       }
                       else {
                           Vue.$messageUtil.error(data.responseBody);
                       }
                       Vue._data.isProcessingOption = false;
                   });
               }
               else{
                   Vue._data.isProcessingOption = false;
                   Vue.$emit('update:visible', false);
               }

            }
        }
    }
</script>

<style scoped>
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