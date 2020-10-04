import {randl2HttpClient} from '../base/HttpClient'

const BASE = "/role";

export default {

    getByPage(params, caller) {
        randl2HttpClient.get(BASE + "/page", params, caller);
    },
    remove(params, caller) {
        randl2HttpClient.postWithParams(BASE + "/remove", params, caller);
    },
    getAll(params, caller) {
        randl2HttpClient.get(BASE + "/all", params, caller);
    },
    getAdminAll(params, caller) {
        randl2HttpClient.get(BASE + "/adminAll", params, caller);
    },
    getUserAll(params, caller) {
        randl2HttpClient.get(BASE + "/userAll", params, caller);
    },
    add(data, caller) {
        randl2HttpClient.post(BASE + "/add", data, caller);
    },
    update(data, caller) {
        randl2HttpClient.post(BASE + "/update", data, caller);
    },
    byKeyword(params, caller) {
        randl2HttpClient.get(BASE + "/byKeyword", params, caller);
    }
};