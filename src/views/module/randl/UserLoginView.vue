<template>
    <div>
        用户登录
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

</style>