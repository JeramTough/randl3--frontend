import {randl2HttpClient} from './base/HttpClient'

const BASE = "/verificationCode";

export default {

    send(params, caller) {
        randl2HttpClient.postWithParams(BASE + "/send", params, caller);
    },
    verify(params, caller) {
        randl2HttpClient.postWithParams(BASE + "/verify", params, caller);
    }
}