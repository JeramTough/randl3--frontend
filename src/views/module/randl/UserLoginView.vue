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
                        <el-form-item label="密码" v-show="loginForm.isVerificationCode===false">
                            <el-input v-model="loginForm.password" placeholder="6位数字" maxlength="16"
                                      show-password type="password"></el-input>
                        </el-form-item>
                    </el-form>

                    <el-form v-show="loginForm.isVerificationCode===true"
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
                                <el-button v-show="loginForm.isVerificationCode===false" type="text"
                                           @click.native.prevent="loginForm.isVerificationCode=true">使用验证码登录？
                                </el-button>
                                <el-button v-show="loginForm.isVerificationCode===true" type="text"
                                           @click.native.prevent="loginForm.isVerificationCode=false">使用密码登录？
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
                        <el-button type="primary" @click="doLogin('loginForm')" round>登录</el-button>
                    </div>

                </el-card>

            </el-col>
        </el-row>
    </div>
</template>

<script>

    export default {
        name: "UserLoginView",
        data() {
            return {
                isDoing: false,
                sendVerificationCodeButtonDisable: false,
                sendVerificationCodeText: "发送验证码",
                loginForm: {
                    isVerificationCode: false,
                    credential: this.$route.query.phoneOrEmail === undefined ? null : this.$route.query.phoneOrEmail,
                    password: this.$route.query.password === undefined ? null : this.$route.query.password,
                    verificationCode: null
                }
            }
        },
        methods: {
            doLogin(loginForm) {
            }
            ,
            sendVerificationCode() {

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