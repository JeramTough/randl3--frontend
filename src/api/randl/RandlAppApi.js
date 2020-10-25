import {randl2HttpClient} from '../base/HttpClient'
import {randl2HttpClientV2} from '../base/HttpClientV2'

const BASE = "/randlApp";

export default {

    condition(params) {
        return randl2HttpClientV2.get(BASE + "/condition", params);
    },
    page(params) {
        return randl2HttpClientV2.get(BASE + "/page", params);
    },
    getAll(params, caller) {
        randl2HttpClient.get(BASE + "/all", params, caller);
    },
    remove(params, caller) {
        randl2HttpClient.postWithParams(BASE + "/remove", params, caller);
    },
    update(data) {
        return randl2HttpClientV2.post(BASE + "/update", data);
    }
}