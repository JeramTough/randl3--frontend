<template>
    <div id="body">
        <el-row type="flex" align="middle">
            <el-col :span="24">
                <el-card class="box-card" shadow="always" style="background-color: rgba(211,255,228,0.71);">
                    <div slot="header" class="clearfix">
                        <span class="title">用户注册</span>
                        <el-button style="float: right; padding: 3px 0" type="text">去登录</el-button>
                    </div>

                    <!--第一步视图-->
                    <div v-if="steps===1">
                        <div v-if="registerForm.way===1">
                            <div>
                                <el-input
                                        placeholder="请输入手机号码进行注册"
                                        v-model="registerForm.phoneNumber"
                                        clearable>
                                </el-input>
                            </div>
                            <div>
                                <el-button type="text" @click.native.prevent="registerForm.way=2">
                                    没有手机，用<span style="font-size: large;font-weight: bold">邮箱</span>注册？
                                </el-button>
                            </div>
                        </div>
                        <div v-if="registerForm.way===2">
                            <div>
                                <el-input
                                        placeholder="请输入邮箱地址进行注册"
                                        v-model="registerForm.emailAddress"
                                        clearable>
                                </el-input>
                            </div>
                            <div>
                                <el-button type="text" @click.native.prevent="registerForm.way=1">
                                    没有邮箱，用<span style="font-size: large;font-weight: bold">手机</span>注册？
                                </el-button>
                            </div>
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

                    <!--下一步按钮-->
                    <div>
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
                    <el-step title="步骤 1" description="输入注册方式"></el-step>
                    <el-step title="步骤 2" description="校验验证码"></el-step>
                    <el-step title="步骤 3" description="设置密码"></el-step>
                    <el-step title="步骤 4" description="完成"></el-step>
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
                    phoneNumber: null,
                    emailAddress: null,
                    verificationCode: null,
                    phoneOrEmail: null
                },
                sendVerificationCodeText: "发送验证码",
                sendVerificationCodeButtonDisable: false,


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
                        if (this.registerForm.way === 1) {
                            if (jsValidate.validatePhone(this.registerForm.phoneNumber)) {
                                isFormatRight = true;
                                this.registerForm.phoneOrEmail = this.registerForm.phoneNumber;
                            }
                            else {
                                this.$messageUtil.error("手机号码格式错误");
                            }
                        }
                        else if (this.registerForm.way === 2) {
                            if (jsValidate.validateEmail(this.registerForm.emailAddress)) {
                                isFormatRight = true;
                                this.registerForm.phoneOrEmail = this.registerForm.emailAddress;
                            }
                            else {
                                this.$messageUtil.error("邮箱格式错误");
                            }
                        }
                        if (isFormatRight) {
                            this.isDoing = true;
                            apiHandler.getRegisteredUserApi().verifyPhoneOrEmailForNew(
                                {
                                    way: this.registerForm.way,
                                    phoneOrEmail: this.registerForm.phoneOrEmail
                                }, (data) => {
                                    if (data.isSuccessful) {
                                        Vue.$messageUtil.success1(data.responseBody);
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
                        break;
                    default:
                        break;
                }
            }
            ,
            sendVerificationCode() {
                let Vue = this;
                /* if (this.registerForm.verificationCode == null || this.registerForm.verificationCode.length === 0) {
                     this.$messageUtil.error("验证码未填写");
                     return;
                 }
                 this.sendVerificationCodeButtonDisable=true;*/

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
        height: 1000px;
        background-size: cover;

    }

    .el-card {
        margin-top: 20%;
        margin-left: 20%;
        margin-right: 20%;
    }

    .title {
        font-size: larger;
        font-weight: bolder;

    }
</style>