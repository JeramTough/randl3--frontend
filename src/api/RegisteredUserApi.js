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
    }
}