<template>
    <div>
        <el-row>
            <el-col :span="24">
                <div style="margin-bottom: 20px;">
                    <span>角色：</span>
                    <el-select v-model="selectedRole" placeholder="请选择要分配权限的角色">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>

                    <el-button
                            style="margin-left: 10px;"
                            type="primary" icon="el-icon-refresh" size="small" round @click="refreshData">刷新
                    </el-button>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="20" :offset="4">
                <div>
                    <el-transfer
                            style="text-align: left"
                            filterable
                            :filter-method="filterMethod"
                            filter-placeholder="请输入接口名"
                            v-model="selectedApis"
                            :data="transferData">
                    </el-transfer>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-button type="primary">提交</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "AllocationView",
        data() {
            return {
                options: [{
                    value: '选项1',
                    label: '黄金糕'
                }, {
                    value: '选项2',
                    label: '双皮奶'
                }, {
                    value: '选项3',
                    label: '蚵仔煎'
                }, {
                    value: '选项4',
                    label: '龙须面'
                }, {
                    value: '选项5',
                    label: '北京烤鸭'
                }],
                selectedRole: '',
                selectedApis: [],
                filterMethod(query, item) {
                    return item.pinyin.indexOf(query) > -1;
                }
            };
        }
        ,
        computed: {
            transferData: function () {
                const data = [];
                const cities = ['上海', '北京', '广州', '深圳', '南京', '西安', '成都'];
                const pinyin = ['shanghai', 'beijing', 'guangzhou', 'shenzhen', 'nanjing', 'xian', 'chengdu'];
                cities.forEach((city, index) => {
                    data.push({
                        label: city,
                        key: index,
                        pinyin: pinyin[index]
                    });
                });
                return data;
            },
            filterMethod1: function (query, item) {
                return item.pinyin.indexOf(query) > -1;
            }
        },
        methods: {
            refreshData: function () {

            }
        }
    };
</script>

<style scoped>
    .el-transfer {
        margin-left: 20px;
        padding: 6px 5px;
    }
</style>