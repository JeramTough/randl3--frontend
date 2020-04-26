<template>
    <div id="body">

        <el-card class="box-card" shadow="always">


            <div class="box-content">
                <el-row>
                    <el-col :span="12" style="background-color: rgba(199,255,201,0.35)">
                        <div>
                            <h3 class="title">账号信息</h3>
                        </div>


                        <div style="margin-top: 20%">
                            <el-upload
                                    class="avatar-uploader"
                                    :auto-upload="false"
                                    action="#"
                                    :show-file-list="false"
                                    :on-change="onChangedImageSurfaceImage"
                                    v-loading="isUpdatingImage"
                                    element-loading-text="上传中...">
                                <img height="120" width="120" v-if="surfaceImage!=null"
                                     :src="surfaceImage" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </div>

                        <div>
                            <el-dropdown @command="handleCommand">
                                     <span class="el-dropdown-link">
                                    <i class="el-icon-s-tools el-icon--right"></i>
                                    <i class="el-icon-arrow-down el-icon--right"></i>
                                     </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item icon="el-icon-s-help" command="0">编辑个人资料</el-dropdown-item>
                                    <el-dropdown-item icon="el-icon-s-help" command="1">账户绑定</el-dropdown-item>
                                    <el-dropdown-item icon="el-icon-s-help" command="2">修改密码</el-dropdown-item>
                                    <el-dropdown-item icon="el-icon-s-help" command="3">退出</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>

                        <div style="margin-top: 90px;margin-bottom: 120px;">
                            <div style="margin-bottom: 10px;font-size: large;font-weight: bold">
                                <span>{{ systemUser.username }}</span>
                            </div>
                            <div>
                                <i class="el-icon-postcard"></i>
                                <span>{{ systemUser.role.description }}</span>
                            </div>
                            <div v-if="systemUser.phoneNumber!=null">
                                <i class="el-icon-phone"></i>
                                <span>{{ systemUser.phoneNumber }}</span>
                            </div>
                            <div v-if="systemUser.emailAddress!=null">
                                <i class="el-icon-message"></i>
                                <span>{{ systemUser.emailAddress }}</span>
                            </div>
                        </div>

                    </el-col>
                    <el-col :span="12" v-loading="isLoading"
                            element-loading-text="正在加载中...">

                        <div style="">
                            <!--编辑个人资料页-->
                            <div v-show="selectedIndex===0">

                                <div class="title2"><i class="el-icon-user-solid"></i>编辑个人资料</div>

                                <el-form ref="form" :model="formData" label-width="150px" style="margin-right: 20px;">

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
                                            <el-date-picker type="date" placeholder="选择日期"
                                                            v-model="formData.birthday"
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

                                <el-button type="primary" style="margin-bottom: 3%;" round
                                           v-bind:disabled="!isFormChanged" @click="onSubmit">保存修改
                                </el-button>

                            </div>
                            <div v-show="selectedIndex===1">

                                <div class="title2"><i class="el-icon-user-solid"></i>账户绑定</div>

                                <el-form ref="form" :model="formData" label-width="150px" style="margin-right: 20px;
margin-top: 10%">

                                    <el-form-item label="绑定的手机号码"
                                                  v-show="isBindingEmail!==true">
                                        <el-input v-model="formData.phoneNumber"
                                                  suffix-icon="el-icon-phone"
                                                  :disabled="!isBindingPhone"></el-input>

                                        <div v-show="isBindingPhone" class="reminder-text">输入需要绑定或替换的手机号码
                                        </div>

                                        <el-button type="text" v-show="!isBindingPhone"
                                                   @click.native.prevent="isBindingPhone=true">更改/绑定
                                        </el-button>
                                    </el-form-item>

                                    <el-form-item label="绑定的邮箱" v-show="isBindingPhone!==true">
                                        <el-input v-model="formData.emailAddress"
                                                  suffix-icon="el-icon-message"
                                                  :disabled="!isBindingEmail"></el-input>

                                        <div v-show="isBindingEmail" class="reminder-text">输入需要绑定或替换的邮箱地址
                                        </div>

                                        <el-button type="text" v-show="!isBindingEmail"
                                                   @click.native.prevent="isBindingEmail=true">更改/绑定
                                        </el-button>
                                    </el-form-item>


                                </el-form>

                                <el-row v-show="isBindingEmail||isBindingPhone"
                                        style="margin-bottom: 40px;">
                                    <el-col :span="15">
                                        <div style="text-align: right">
                                            <el-input style="width: 150px;"
                                                      placeholder="6位数字"
                                                      size="small"
                                                      maxlength="6"
                                                      show-word-limit
                                                      v-model="formData.verificationCode"
                                                      clearable/>
                                        </div>
                                    </el-col>
                                    <el-col :span="9">
                                        <div style="text-align: left">
                                            <my-timer-button hint-content="发送验证码"
                                                             :count="60"
                                                             ref='myTimerButton'
                                                             @click.native.prevent="sendVerificationCode()"/>
                                        </div>
                                    </el-col>
                                </el-row>

                                <el-button type="primary" style="margin-bottom: 3%;" round
                                           @click="cancelBBinding"
                                           v-show="isBindingPhone||isBindingEmail">取消
                                </el-button>

                                <el-button type="primary" style="margin-bottom: 3%;" round
                                           @click="doBinding"
                                           v-show="isBindingPhone||isBindingEmail">确定
                                </el-button>


                            </div>
                            <div v-show="selectedIndex===2">

                                <div class="title2"><i class="el-icon-user-solid"></i>修改密码</div>

                                <el-form ref="form" :model="formData" label-width="150px" style="margin-right: 20px;">

                                    <el-form-item label="旧密码">
                                        <el-input v-model="formData.oldPassword"
                                                  maxlength="16"
                                                  show-word-limit
                                        ></el-input>
                                    </el-form-item>

                                    <el-form-item label="新密码">
                                        <el-input v-model="formData.newPassword"
                                                  maxlength="16"
                                                  show-word-limit
                                                  type="password"></el-input>
                                    </el-form-item>

                                    <el-form-item label="重复新密码">
                                        <el-input v-model="formData.repeatedNewPassword"
                                                  maxlength="16"
                                                  show-word-limit
                                                  type="password"></el-input>
                                    </el-form-item>

                                </el-form>

                                <el-button type="primary" style="margin-bottom: 3%;" round
                                           @click="resetPassword">确定修改
                                </el-button>

                            </div>

                        </div>

                    </el-col>
                </el-row>
            </div>

        </el-card>


    </div>

</template>

<script>

    import apiHandler from "@/api/base/ApiHandler";
    import jsValidate from "@/util/JsValidate";
    import TimerButton from "@/components/button/TimerButton.vue";

    export default {
        name: "RegisterUserHomeView"
        ,
        components: {
            "my-timer-button": TimerButton,
        },
        mounted: function () {
            this.$store.commit('initFromCache');

            this.obtainPersonalInfo();

            this.surfaceImage = this.systemUser.surfaceImage;
            this.formData.phoneNumber = this.systemUser.phoneNumber;
            this.formData.emailAddress = this.systemUser.emailAddress
        }
        ,
        data: () => {
            return {
                isLoading: false,
                isBindingPhone: false,
                isBindingEmail: false,
                isUpdatingImage: false,
                selectedIndex: 1,
                isFormChanged: false,
                surfaceImage: null,
                formData: {
                    fid: 1,
                    uid: 0,
                    nickname: "zhuzhu",
                    age: 15,
                    gender: "female",
                    birthday: "2012-02-21",
                    realname: "韦芋竹",
                    identityNumber: 123312,
                    school: "南丹县高中",
                    contactWays: "2415598862",
                    homeAddress: "虎行路",
                    job: "学生",
                    personalizedSignature: "---",

                    oldPassword: null,
                    newPassword: null,
                    repeatedNewPassword: null,

                    phoneNumber: "12321312",
                    emailAddress: null,
                    verificationCode: null
                }
            }
        }
        ,
        computed: {
            systemUser: function () {
                return this.$store.getters.getSystemUser;
            }
        }
        ,
        methods: {
            handleCommand(command) {
                let Vue = this;
                this.selectedIndex = Number(command);
                if (this.selectedIndex === 3) {
                    Vue.$router.push({path: 'userLogin'});
                    this.$store.commit('clearCache');
                }
            }
            ,
            onFormChanged() {
                this.isFormChanged = true;
            }
            ,
            obtainPersonalInfo() {
                let Vue = this;
                this.isLoading = true;
                apiHandler.getRegisteredUserLoginedApi().getPersonalInfo(null, (data) => {
                    if (data.isSuccessful) {
                        let personalInfo = data.responseBody;
                        Object.keys(Vue._data.formData).forEach(key => {
                            if (personalInfo[key] !== undefined || personalInfo[key] != null) {
                                Vue._data.formData[key] = personalInfo[key];
                            }
                        });
                        Vue._data.isLoading = false;
                    }
                    else {
                        Vue.$messageUtil.error(data.responseBody);
                    }
                });
            }
            ,
            onSubmit() {
                let Vue = this;
                this.isLoading = true;

                if (this.isFormChanged) {
                    apiHandler.getRegisteredUserLoginedApi().updatePersonalInfo(this.formData, (data) => {
                        if (data.isSuccessful) {
                            Vue.$messageUtil.success(data.responseBody);
                        }
                        else {
                            Vue.$messageUtil.error(data.responseBody);
                        }
                        Vue._data.isLoading = false;
                    });
                }
                else {
                    Vue._data.isProcessingOption = false;
                    Vue.$emit('update:visible', false);
                }
            }
            ,
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
                    Vue._data.surfaceImage = this.result;
                    Vue.updateSurfaceImage();
                };
                return isImage && isLt2M;
            },
            updateSurfaceImage: function () {
                let Vue = this;
                this.isUpdatingImage = true;
                apiHandler.getRegisteredUserLoginedApi().updateSurfaceImage({
                    surfaceImage: Vue._data.surfaceImage
                }, (data) => {
                    if (data.isSuccessful) {
                        Vue.$store.commit('updateSurfaceImage', Vue._data.surfaceImage);
                        Vue.$messageUtil.success(data.responseBody);
                    }
                    else {
                        Vue.$messageUtil.error(data.responseBody);
                    }
                    Vue._data.isUpdatingImage = false;
                });
            }
            ,
            resetPassword() {
                this.isLoading = true;
                let Vue = this;
                if (jsValidate.isEmpty(this.formData.oldPassword) ||
                    jsValidate.isEmpty(this.formData.newPassword) ||
                    jsValidate.isEmpty(this.formData.repeatedNewPassword)) {
                    Vue.$messageUtil.error("参数没有填写完全！请检查");
                    return;
                }

                apiHandler.getRegisteredUserLoginedApi().resetPassword(this.formData, (data) => {
                    if (data.isSuccessful) {
                        Vue.$messageUtil.success(data.responseBody);
                    }
                    else {
                        Vue.$messageUtil.error(data.responseBody);
                    }
                    Vue._data.isLoading = false;
                });
            }
            ,
            cancelBBinding() {
                this.isBindingPhone = false;
                this.isBindingEmail = false;
            }
            ,
            sendVerificationCode() {
                let Vue = this;
                let myTimerButton = this.$refs.myTimerButton;

                let sendWay = 0;
                let phoneOrEmail = null;

                if (this.isBindingPhone) {
                    let isPhone = jsValidate.validatePhone(this.formData.phoneNumber);
                    if (isPhone) {
                        sendWay = 1;
                        phoneOrEmail = this.formData.phoneNumber;
                    }
                    else {
                        this.$messageUtil.error("手机号码格式错误!");
                        return
                    }
                }
                if (this.isBindingEmail) {
                    let isEmail = jsValidate.validateEmail(this.formData.emailAddress);
                    if (isEmail) {
                        sendWay = 2;
                        phoneOrEmail = this.formData.emailAddress;
                    }
                    else {
                        this.$messageUtil.error("邮箱地址格式错误!");
                        return
                    }
                }

                myTimerButton.doCountDown();
                apiHandler.getVerificationCodeApi().send(
                    {
                        way: sendWay,
                        phoneOrEmail: phoneOrEmail
                    }, (data) => {
                        if (data.isSuccessful) {
                            Vue.$messageUtil.success1(data.responseBody);
                        }
                        else {
                            Vue.$messageUtil.error(data.responseBody);
                        }
                    });
            }
            ,
            doBinding() {
                let Vue = this;

                let sendWay = 0;
                let phoneOrEmail = null;

                if (this.isBindingPhone) {
                    sendWay = 1;
                    phoneOrEmail = this.formData.phoneNumber;
                }
                else {
                    if (this.isBindingEmail) {
                        sendWay = 2;
                        phoneOrEmail = this.formData.emailAddress;
                    }
                }
                this.isLoading = true;
                apiHandler.getRegisteredUserLoginedApi().bindingPhoneOrEmail({
                    way: sendWay,
                    phoneOrEmail: phoneOrEmail,
                    verificationCode: Vue._data.formData.verificationCode
                }, (data) => {
                    if (data.isSuccessful) {
                        Vue.$messageUtil.success(data.responseBody);
                        switch (sendWay) {
                            case 1:
                                Vue.$store.commit('updatePhoneNumber', phoneOrEmail);
                                break;
                            case 2:
                                Vue.$store.commit('updateEmailAddress', phoneOrEmail);
                                break;
                            default:
                                break
                        }

                        Vue._data.isBindingPhone=false;
                        Vue._data.isBindingEmail=false;

                    }
                    else {
                        Vue.$messageUtil.error(data.responseBody);
                    }
                    Vue._data.isLoading = false;
                });
            }
        }
    }


</script>

<style scoped>
    #body {


    }

    .title {
        color: transparent;
        -webkit-text-stroke: 1px rgba(38, 142, 31, 0.99);
        letter-spacing: 0.4em;
    }

    .title2 {
        color: rgba(0, 206, 18, 0.84);
        padding: 20px;
        border: 2px solid #a8fab1;
        border-radius: 30px;
        margin-bottom: 10px;
    }

    .box-card {
        padding-top: 2%;
        background-color: #07d02c;
    }

    .box-content {
        background-color: #ffffff;
        border-radius: 20px;
    }

    .reminder-text {
        font-size: small;
        color: rgba(52, 52, 52, 0.45);
    }
</style>