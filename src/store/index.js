import Vuex from "vuex";
import Vue from 'vue';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        systemUser: {
            username: "test",
            role: {
                description: "游客"
            }
        },
        editingSystemUser: {
            uid: null,
            username: null,
            password: null,
            phoneNumber: null,
            emailAddress: null,
            accountStatus: null,
            role: {fid: null}
        }
    },
    mutations: {
        loginSuccessfully(state, systemUser) {
            state.systemUser = systemUser;
        },
        setEditingSystemUser(state, systemUser) {
            state.editingSystemUser = systemUser;
        }
    }
});

export default store;