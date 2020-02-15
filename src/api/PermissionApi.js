import {randl2HttpClient} from './base/HttpClient'

const BASE = "/permission";

export default {

    getAll(params, caller) {
        randl2HttpClient.get(BASE + "/all", params, caller);
    },
    set(data, caller) {
        randl2HttpClient.post(BASE + "/set", data, caller);
    },
    getByRoleId(params, caller) {
        randl2HttpClient.get(BASE + "/byRole", params, caller);
    }
}