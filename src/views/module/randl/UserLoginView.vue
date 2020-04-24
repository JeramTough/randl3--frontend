<template>
    <!-- 用户登录
     {{loginForm.credential}}
     {{loginForm.password}}-->
    <div id="body">
        <el-row type="flex" align="middle">
            <el-col :span="10" :offset="7">

                <el-card class="box-card" shadow="always">

                    <div slot="header" class="clearfix">
                        <span class="title">用户登录</span>
                    </div>

                    <el-form label-position="left" label-width="80px" :model="loginForm">
                        <el-form-item label="账号">
                            <el-input v-model="loginForm.credential" placeholder="手机号码或者邮箱地址"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" v-show="loginForm.loginWay===1">
                            <el-input v-model="loginForm.password" placeholder="8-16位字符密码" maxlength="16"
                                      show-password type="password"></el-input>
                        </el-form-item>
                    </el-form>

                    <el-form v-show="loginForm.loginWay===2"
                             :inline="true" class="demo-form-inline">
                        <el-form-item label="验证码">
                            <el-input
                                    placeholder="6位数字"
                                    v-model="loginForm.verificationCode"
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

                    <div>
                        <el-row>
                            <el-col :span="6">
                                <el-button v-show="loginForm.loginWay===1" type="text"
                                           @click.native.prevent="loginForm.loginWay=2">使用验证码登录？
                                </el-button>
                                <el-button v-show="loginForm.loginWay===2" type="text"
                                           @click.native.prevent="loginForm.loginWay=1">使用密码登录？
                                </el-button>
                            </el-col>
                            <el-col :span="3" :offset="11">
                                <el-button type="text">
                                    <router-link to="userRegister">没有账号？</router-link>
                                </el-button>
                            </el-col>
                            <el-col :span="3" :offset="1">
                                <el-button type="text">
                                    <router-link to="userForget">忘记密码？</router-link>
                                </el-button>
                            </el-col>
                        </el-row>
                    </div>

                    <div>
                        <el-button type="primary" @click="doLogin(loginForm)" round>登录</el-button>
                    </div>

                </el-card>

            </el-col>
        </el-row>
    </div>
</template>

<script>

    import jsValidate from '@/util/JsValidate';
    import apiHandler from "@/api/base/ApiHandler";

    export default {
        name: "UserLoginView",
        data() {
            return {
                isDoing: false,
                sendVerificationCodeButtonDisable: false,
                sendVerificationCodeText: "发送验证码",
                loginForm: {
                    loginWay: 1,
                    credential: this.$route.query.phoneOrEmail === undefined ? null : this.$route.query.phoneOrEmail,
                    password: this.$route.query.password === undefined ? null : this.$route.query.password,
                    verificationCode: null
                }
            }
        },
        methods: {
            doLogin(loginForm) {
                let Vue = this;

                if (jsValidate.isEmpty(loginForm.credential)) {
                    Vue.$messageUtil.error("登录凭证不能为空");
                }

                let caller = function (data) {
                    if (data.isSuccessful) {
                        let systemUser = data.responseBody.systemUser;
                        //保存用户登录成功数据
                        Vue.$store.commit('loginSuccessfully', systemUser);
                        //跳转
                        Vue.$messageUtil.success("【" + systemUser.username + "】登录成功！");
                        Vue.$router.push({path: 'registeredUserHome'});
                    }
                    else {
                        Vue.$messageUtil.error(data.responseBody);
                    }
                };

                switch (loginForm.loginWay) {
                    case 1:
                        if (jsValidate.isEmpty(loginForm.password)) {
                            Vue.$messageUtil.error("登录密码不能为空");
                            break;
                        }

                        apiHandler.getRegisteredUserLoginedApi().loginByPassword({
                            credential: Vue._data.loginForm.credential,
                            password: Vue._data.loginForm.password
                        }, caller);

                        break;
                    case 2:
                        if (jsValidate.isEmpty(loginForm.verificationCode)) {
                            Vue.$messageUtil.error("验证码不能为空");
                            break;
                        }

                        apiHandler.getRegisteredUserLoginedApi().loginByVerificationCode({
                            credential: Vue._data.loginForm.credential,
                            verificationCode: Vue._data.loginForm.verificationCode
                        }, caller);
                        break;
                    default:
                }
            }
            ,
            sendVerificationCode() {
                let sendWay = this.getSendWay();
                if (sendWay == null) {
                    return;
                }

                let Vue = this;
                if (!this.sendVerificationCodeButtonDisable) {
                    this.isDoing = true;
                    apiHandler.getVerificationCodeApi().send(
                        {
                            way: sendWay,
                            phoneOrEmail: Vue._data.loginForm.credential
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
            }
            ,
            getSendWay() {
                let sendWay = null;
                if (jsValidate.validatePhone(this.loginForm.credential)) {
                    sendWay = 1;
                }
                else {
                    if (jsValidate.validateEmail(this.loginForm.credential)) {
                        sendWay = 2;
                    }
                }
                if (sendWay === null) {
                    this.$messageUtil.error("账号格式不正确，只能为手机号码格式或者邮箱格式！");
                }
                return sendWay;
            }
        }
    }
</script>

<style scoped>
    #body {
        background-image: url("../../../assets/images/user_randl_bg1.jpg");
        height: 600px;
        background-size: cover;

    }

    .title {
        font-size: larger;
        font-weight: bolder;
    }

    .box-card {
        margin-top: 20%;
    }
</style>