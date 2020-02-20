import {randl2HttpClient} from './base/HttpClient'

const BASE = "/registeredUser";

export default {

    verifyPhoneOrEmailForNew(data, caller) {
        randl2HttpClient.post(BASE + "/verify/phoneOrEmailForNew", data, caller);
    },
    verifyPassword(data, caller) {
        randl2HttpClient.post(BASE + "/verify/password", data, caller);
    },
    register(params, caller) {
        randl2HttpClient.postWithParams(BASE + "/register", params, caller);
    },
    update(data, caller) {
        randl2HttpClient.post(BASE + "/update", data, caller);
    },
    byKeyword(params, caller) {
        randl2HttpClient.get(BASE + "/byKeyword", params, caller);
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