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
    getAll(params) {
        return randl2HttpClientV2.get(BASE + "/all", params);
    },
    allOnlyName(params) {
        return randl2HttpClientV2.get(BASE + "/allOnlyName", params);
    },
    remove(params) {
        return randl2HttpClientV2.postWithParams(BASE + "/remove", params);
    },
    update(data) {
        return randl2HttpClientV2.post(BASE + "/update", data);
    },
    add(data, caller) {
        randl2HttpClient.post(BASE + "/add", data, caller);
    },
    add1(data) {
        return randl2HttpClientV2.post(BASE + "/add", data);
    },
}