import Vuex from "vuex";
import Vue from 'vue';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        systemUser: {}
    },
    mutations: {
        loginSuccessfully(state, systemUser) {
            state.systemUser = systemUser;
        }
    }
});

export default store;