<template>
    <div>
        <el-button type="primary" size="small" round v-bind:disabled="isCountDown">
            {{thisHintContent}}
        </el-button>
    </div>
</template>

<script>
    export default {
        name: "TimerButton"
        ,
        props: {
            hintContent: String,
            count: Number
        }
        ,
        data: function () {
            return {
                isCountDown: false,
                thisHintContent: this.hintContent
            }
        },

        methods: {
            doCountDown() {
                let Vue = this;
                this.isCountDown = true;
                let interval = this.count;
                let tempContent=this.hintContent;
                this.thisHintContent = "等待（" + interval + "）秒";
                let timer = self.setInterval(function () {
                    Vue._data.thisHintContent = "等待（" + interval + "）秒";
                    interval--;
                    if (interval === -1) {
                        window.clearInterval(timer);
                        Vue._data.isCountDown = false;
                        Vue._data.thisHintContent = tempContent;
                    }
                }, 1000);
            }
        }
    }
</script>

<style scoped>

</style>