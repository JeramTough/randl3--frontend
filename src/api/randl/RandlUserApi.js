import {randl2HttpClient} from '../base/HttpClient'
import {randl2HttpClientV2} from '../base/HttpClientV2'

const BASE = "/randlUser";

export default {

    verifyPhoneOrEmailForNew(data, caller) {
        randl2HttpClient.post(BASE + "/verify/phoneOrEmailForNew", data, caller);
    },
    verifyPhoneOrEmailByForget(data, caller) {
        randl2HttpClient.post(BASE + "/verify/phoneOrEmailByForget", data, caller);
    },
    verifyPassword(data, caller) {
        randl2HttpClient.post(BASE + "/verify/password", data, caller);
    },
    verifyPasswordByForget(data, caller) {
        randl2HttpClient.post(BASE + "/verify/passwordByForget", data, caller);
    },
    register(data, caller) {
        randl2HttpClient.post(BASE + "/register", data, caller);
    },
    reset(data, caller) {
        randl2HttpClient.post(BASE + "/reset", data, caller);
    },
    update(data, caller) {
        randl2HttpClient.post(BASE + "/update", data, caller);
    },
    update1(data) {
        return randl2HttpClientV2.post(BASE + "/update", data);
    },
    condition(params) {
        return randl2HttpClientV2.get(BASE + "/condition", params);
    },
    getByPage(params, caller) {
        randl2HttpClient.get(BASE + "/page", params, caller);
    },
    getAll(params, caller) {
        randl2HttpClient.get(BASE + "/all", params, caller);
    },
    remove(params, caller) {
        randl2HttpClient.postWithParams(BASE + "/remove", params, caller);
    },
}