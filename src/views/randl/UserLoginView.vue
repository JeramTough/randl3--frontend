<template>
    <div style="overflow-x: hidden;
        overflow-y: hidden;">

        <div id="main"></div>

        <div style="display: flex;justify-content: center;margin-top: 10%;">
            <el-card style="background: white;">
                <div slot="header" class="clearfix">
                    <div>
                        <el-image :src="srcImages.mIcon" fit="fill"></el-image>
                    </div>
                    <span id="title">管理员登录</span>
                </div>
                <table>
                    <tr>
                        <td>用户名</td>
                        <td>
                            <el-input v-model="user.username" placeholder="请输入用户名"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>密码</td>
                        <td>
                            <el-input type="password" v-model="user.password" placeholder="请输入密码"
                                      @keydown.enter.native="doLogin"></el-input>
                            <!-- @keydown.enter.native="doLogin"当按下enter键的时候也会执行doLogin方法-->
                        </td>
                    </tr>
                    <tr>
                        <!-- 占两行-->
                        <td colspan="2">
                            <!-- 点击事件的两种不同的写法v-on:click和 @click-->
                            <!--<el-button style="width: 300px" type="primary" v-on:click="doLogin">登录</el-button>-->
                            <el-button style="width: 300px" type="primary" @click="doLogin">登录</el-button>
                        </td>
                    </tr>
                </table>
            </el-card>
        </div>
    </div>
</template>

<script>

    const srcImages = {
        mIcon: require("@/assets/images/manager_icon.png")
    };

    export default {
        name: "AdminUserLoginView",
        data() {
            return {
                srcImages,
                user: {
                    username: 'zhangsan',
                    password: '123',
                }
            }
        },
        methods: {
            doLogin() {//一点击登录按钮，这个方法就会执行
                alert(JSON.stringify(this.user))//可以直接把this.user对象传给后端进行校验用户名和密码
            }
        }
    }
</script>

<style scoped>
    #main {
        position: absolute;
        width: 100%;
        height: 100%;
        background-image: url("../../assets/images/admin_login_bg.jpg");
        background-repeat: no-repeat;
        background-size: cover;
        text-align: center;
        overflow-x: hidden;
        overflow-y: hidden;
        /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
        -ms-overflow-style: none;
        /*火狐下隐藏滚动条*/
        overflow: -moz-scrollbars-none;
    }

    #title {
        font-size: larger;
        font-weight: bolder;
    }
</style>