import {randl2HttpClient} from '../base/HttpClient'

const BASE = "/personalInfo";

export default {

    getOneByUid(params, caller) {
        randl2HttpClient.get(BASE + "/oneByUid", params, caller);
    },
    update(data, caller) {
        randl2HttpClient.post(BASE + "/update", data, caller);
    },
};