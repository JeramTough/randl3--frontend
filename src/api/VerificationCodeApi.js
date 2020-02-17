import {randl2HttpClient} from './base/HttpClient'

const BASE = "/verificationCode";

export default {

    send(data, caller) {
        randl2HttpClient.post(BASE + "/send", data, caller);
    },
    verify(params, caller) {
        randl2HttpClient.postWithParams(BASE + "/verify", params, caller);
    }
}