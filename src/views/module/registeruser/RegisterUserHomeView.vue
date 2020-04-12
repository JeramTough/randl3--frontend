<template>
    <div>
        用户页
    </div>
</template>

<script>

    import apiHandler from "@/api/base/ApiHandler";

    export default {
        name: "RegisterUserHomeView",
        data: () => {
            return {}
        }
        ,
        mounted: function () {
            apiHandler.getRegisteredUserLoginedApi().bindingPhoneOrEmail(null,(data)=>{
                console.info(data);
            });
        }
    }


</script>

<style scoped>

</style>