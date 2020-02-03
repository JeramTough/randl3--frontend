<template>
    <div>
        <el-col :span="16"><div class="">sssssssssssssssss</div></el-col>
        <el-col :span="8"><div class="">aaaaaaaaaaaaa</div></el-col>

    </div>
</template>

<style scoped>
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        min-height: 400px;
    }

    .el-header {
        background-color: #B3C0D1;
        color: #333;
        line-height: 60px;
    }

    .el-aside {
        color: #333;
        width: 20px;
        background: #ff2b1d;
        text-align: left;
    }

    .el-main {
        text-align: right;
        font-size: 12px;
        background: #000000;
    }

</style>

<script>
    export default {
        name: "MainView",
        data() {
            return {
                isCollapse: true
            }
        }
        ,
        methods: {
            handleOpen(key, keyPath) {
                // eslint-disable-next-line no-console
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                // eslint-disable-next-line no-console
                console.log(key, keyPath);
            }
        }
    };
</script>
