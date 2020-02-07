<template>
    <div>
        <div style="display: inline">
            <i class="el-icon-edit"></i>
            <i class="el-icon-share"></i>
            <i class="el-icon-delete"></i>
        </div>

        <el-dropdown>
      <span class="el-dropdown-link">
                     <el-avatar :size="30"
                                src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=378824344,1185609431&fm=26&gp=0.jpg"></el-avatar>
<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>黄金糕</el-dropdown-item>
                <el-dropdown-item>狮子头</el-dropdown-item>
                <el-dropdown-item>螺蛳粉</el-dropdown-item>
                <el-dropdown-item disabled>双皮奶</el-dropdown-item>
                <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>

    </div>
</template>

<script>
    export default {
        name: "UserFrameView"
    }
</script>

<style scoped>

</style>