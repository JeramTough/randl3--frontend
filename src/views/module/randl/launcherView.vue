<template>
    <div>
        <el-row>
            <el-col :span="24">
                <div>加载系统资源。。。</div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-progress type="dashboard" :percentage="percentage" :color="colors"></el-progress>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <div></div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import apiHandler from "@/api/base/ApiHandler";

    export default {
        name: "launcherView"
        ,
        created: function(){
            this.obtainResource();
        },
        data() {
            return {
                percentage: 10,
                colors: [
                    {color: '#f56c6c', percentage: 20},
                    {color: '#e6a23c', percentage: 40},
                    {color: '#a4fc42', percentage: 60},
                    {color: '#81ff24', percentage: 80},
                    {color: '#3ad945', percentage: 100}
                ]
            };
        },
        computed: {
            systemUser: function () {
                return this.$store.state.systemUser;
            }
        },
        methods: {
            obtainResource: function () {
                //如果是超级管理员
                if (this.systemUser.role.fid===0){
                    //dosomething.
                }
            }
        }
    }
</script>

<style scoped>

</style>