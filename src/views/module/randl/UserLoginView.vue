<template>
    <div>
        用户登录
        {{loginForm.credential}}
        {{loginForm.password}}
    </div>
</template>

<script>

    export default {
        name: "UserLoginView",
        data() {
            return {
                loginForm: {
                    credential: this.$route.query.phoneOrEmail === undefined ? null : this.$route.query.phoneOrEmail,
                    password: this.$route.query.password === undefined ? null : this.$route.query.password,
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