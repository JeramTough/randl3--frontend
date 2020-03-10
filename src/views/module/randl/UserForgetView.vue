<template>
    <div id="body">
        <el-row type="flex" align="middle">
            <el-col :span="24">
                <el-card class="box-card" shadow="always" style="background-color: rgba(211,255,228,0.71);">
                    <div slot="header" class="clearfix">
                        <span class="title">找回密码</span>
                        <router-link style="float: right; padding: 3px 0;color: #06bb28" to="userLogin">去登录
                        </router-link>
                    </div>

                    <!--第一步视图-->
                    <div v-if="steps===1">
                        <div>
                            <el-input
                                    placeholder="请输入手机号码或者邮箱"
                                    v-model="registerForm.phoneOrEmail"
                                    clearable>
                            </el-input>
                        </div>
                    </div>

                    <!-- 第二步视图-->
                    <div v-if="steps===2">
                        <el-form :inline="true" class="demo-form-inline">
                            <el-form-item label="验证码">
                                <el-input
                                        placeholder="6位数字"
                                        v-model="registerForm.verificationCode"
                                        clearable>
                                </el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" :loading="isDoing"
                                           v-bind:disabled="sendVerificationCodeButtonDisable" round
                                           @click="sendVerificationCode">
                                    {{sendVerificationCodeText}}
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </div>

                    <!-- 第三步视图-->
                    <div v-if="steps===3">
                        <el-input v-model.lazy="registerForm.password" autocomplete="off"
                                  placeholder="密码" @input="100"
                                  maxlength="16"
                                  show-password
                                  type="password"></el-input>
                        <el-input v-model.lazy="registerForm.repeatedPassword" autocomplete="off"
                                  placeholder="确定密码" @input="100"
                                  style="margin-bottom: 20px;"
                                  maxlength="16"
                                  show-password
                                  type="password"></el-input>
                    </div>

                    <!-- 第三步视图-->
                    <div v-if="steps===4">
                        <div v-if="registeredUser!=null">
                            <i style="font-size: 100px;color: #00FF00;" class="el-icon-circle-check"></i>
                            <div style="margin-bottom: 20px;">用户【{{registeredUser.account}}】注册成功！</div>
                        </div>
                    </div>

                    <!--下一步按钮-->
                    <div style="margin-top: 20px;">
                        <el-button type="primary" @click="nextStep" :loading="isDoing" round>
                            {{optionText}}
                        </el-button>
                    </div>

                </el-card>
            </el-col>
        </el-row>
        <el-row type="flex" align="middle" style="margin-top: 50px;text-align: left">
            <el-col :span="24">
                <el-steps :active="steps" style="margin-left: 10%;margin-right: 10%">
                    <el-step title="步骤 1" description="输入注册方式"
                             @click.native.prevent="steps=1"></el-step>
                    <el-step title="步骤 2" description="校验验证码"
                             @click.native.prevent="steps=2"></el-step>
                    <el-step title="步骤 3" description="设置密码"
                             @click.native.prevent="steps=3"></el-step>
                    <el-step title="步骤 4" description="完成"
                             @click.native.prevent="steps=4"></el-step>
                </el-steps>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import jsValidate from '@/util/JsValidate';
    import apiHandler from "@/api/base/ApiHandler";

    export default {
        name: "UserRegisterView",
        data: function () {
            return {
                steps: 1,
                isDoing: false,
                registerForm: {
                    way: 1,
                    phoneOrEmail: null,
                    verificationCode: null,
                    password: null,
                    repeatedPassword: null
                },
                sendVerificationCodeText: "发送验证码",
                sendVerificationCodeButtonDisable: false,
                registeredUser: null

            }
        },
        computed: {
            optionText: function () {
                if (this.steps === 4) {
                    return "完成"
                }
                else {
                    return "下一步 >";
                }
            }
        }
        ,
        methods: {
            nextStep: function () {
                let Vue = this;

                switch (this.steps) {
                    case 1:
                        var isFormatRight = false;

                        if (jsValidate.validatePhone(this.registerForm.phoneOrEmail)) {
                            isFormatRight = true;
                            this.registerForm.way = 1;
                        }
                        else if (jsValidate.validateEmail(this.registerForm.phoneOrEmail)) {
                            isFormatRight = true;
                            this.registerForm.way = 2;
                        }
                        else {
                            this.$messageUtil.error("手机号码或邮箱地址格式错误");
                        }

                        if (isFormatRight) {
                            this.isDoing = true;
                            apiHandler.getRegisteredUserApi().verifyPhoneOrEmailByForget(
                                {
                                    way: this.registerForm.way,
                                    phoneOrEmail: this.registerForm.phoneOrEmail
                                }, (data) => {
                                    if (data.isSuccessful) {
                                        Vue.$messageUtil.success1(data.responseBody + ",下一步");
                                        Vue._data.steps++;
                                    }
                                    else {
                                        Vue.$messageUtil.error(data.responseBody);
                                    }
                                    Vue._data.isDoing = false;
                                });
                        }
                        break;
                    case 2:
                        if (this.registerForm.verificationCode == null || this.registerForm.verificationCode.length === 0) {
                            this.$messageUtil.error("验证码未填写");
                            break;
                        }

                        this.isDoing = true;
                        apiHandler.getVerificationCodeApi().verify({code: this.registerForm.verificationCode}, (data) => {
                            if (data.isSuccessful) {
                                Vue.$messageUtil.success1(data.responseBody);
                                Vue._data.steps++;
                            }
                            else {
                                Vue.$messageUtil.error(data.responseBody);
                            }
                            Vue._data.isDoing = false;
                        });

                        break;
                    case 3:
                        if (this.registerForm.password == null || this.registerForm.password.length > 16 || this.registerForm.password.length < 8) {
                            this.$messageUtil.error("密码格式不正确！允许长度范围在8-16位的非空白任意字符");
                            return;
                        }
                        if (this.registerForm.password !== this.registerForm.repeatedPassword) {
                            this.$messageUtil.error("两次密码不一致！");
                            return;
                        }
                        apiHandler.getRegisteredUserApi().verifyPassword({
                            password: this.registerForm.password,
                            repeatedPassword: this.registerForm.repeatedPassword
                        }, (data) => {
                            if (data.isSuccessful) {
                                Vue.$messageUtil.success1(data.responseBody);
                                apiHandler.getRegisteredUserApi().reset(null, (data) => {
                                    if (data.isSuccessful) {
                                        Vue._data.registeredUser = data.responseBody;
                                        Vue._data.steps++;
                                    }
                                    else {
                                        Vue.$messageUtil.error(data.responseBody);
                                    }
                                    Vue._data.isDoing = false;
                                });
                            }
                            else {
                                Vue.$messageUtil.error(data.responseBody);
                                Vue._data.isDoing = false;
                            }

                        });
                        this.isDoing = true;

                        break;
                    case 4:
                        if (this.registeredUser == null) {
                            Vue.$messageUtil.error("重置未成功！");
                            return;
                        }

                        this.$router.push({
                            path: 'userLogin', query: {
                                phoneOrEmail: this.registerForm.phoneOrEmail,
                                password: this.registerForm.password
                            }
                        });

                        break;
                    default:
                        break;
                }
            }
            ,
            sendVerificationCode() {
                let Vue = this;
                if (!this.sendVerificationCodeButtonDisable) {
                    this.isDoing = true;
                    apiHandler.getVerificationCodeApi().send(
                        {
                            way: this.registerForm.way,
                            phoneOrEmail: this.registerForm.phoneOrEmail
                        }, (data) => {
                            if (data.isSuccessful) {
                                Vue._data.sendVerificationCodeButtonDisable = true;
                                Vue.$messageUtil.success1(data.responseBody);
                                let interval = 60;
                                Vue._data.sendVerificationCodeText = "等待（" + interval + "）秒";
                                let timer = self.setInterval(function () {
                                    Vue._data.sendVerificationCodeText = "等待（" + interval + "）秒";
                                    interval--;
                                    if (interval === -1) {
                                        window.clearInterval(timer);
                                        Vue._data.sendVerificationCodeButtonDisable = false;
                                        Vue._data.sendVerificationCodeText = "发送验证码";
                                    }
                                }, 1000);
                            }
                            else {
                                Vue.$messageUtil.error(data.responseBody);
                            }
                            Vue._data.isDoing = false;
                        });
                }

            },
        }
    }
</script>

<style scoped>
    #body {
        background-image: url("../../../assets/images/user_randl_bg1.jpg");
        height: 600px;
        background-size: cover;

    }

    .el-card {
        margin-top: 10%;
        margin-left: 30%;
        margin-right: 30%;
    }

    .title {
        font-size: larger;
        font-weight: bolder;

    }
</style>