<template>
    <div>
        <!-- <div style="display:inline">
             <i class="el-icon-edit"></i>
             <i class="el-icon-share"></i>
             <i class="el-icon-delete"></i>
         </div>-->
        <el-row type="flex" align="middle">
            <el-col :span="16">
                <div style="color: #000000;text-align: right;">
                    <div style="color: #0d8f13;font-size: small">
                        <i class="el-icon-postcard"></i>
                        {{systemUsesr.role.description}}
                    </div>
                    <div style="font-size: large">{{systemUsesr.username}}</div>
                </div>
            </el-col>
            <el-col :span="8">
                <div style="text-align: left">
                    <el-dropdown style="" @command="handleMenuCommand">
                        <span class="el-dropdown-link">
                            <el-avatar :size="30"
                                       src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=378824344,1185609431&fm=26&gp=0.jpg"></el-avatar>
                            <i class="el-icon-arrow-down el-icon&#45;&#45;right"/>
                        </span>

                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="0">修改信息</el-dropdown-item>
                            <el-dropdown-item command="1">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "UserFrameView",
        data: function () {
            return {}
        },
        computed: {
            systemUsesr: function () {

                return this.$store.state.systemUser;
            }
        },
        methods: {
            handleMenuCommand(command) {

                switch (Number(command)) {
                    case 0:
                        break;
                    case 1:
                        this.$router.push({path: '/adminLogin'});
                        break;
                    default:
                        break;
                }

            }
        }
    }
</script>

<style scoped>

</style>