import Vuex from "vuex";
import Vue from 'vue';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        systemUser: {
            username: "test",
            role: {
                description: "游客"
            },
            surfaceImage: "http://img.hao661.com/qq.hao661.com/uploads/allimg/c160130/1454094J19DP-2X553.jpg"
        }
    },
    mutations: {
        loginSuccessfully(state, systemUser) {
            state.systemUser = systemUser;
        }
    }
});

export default store;