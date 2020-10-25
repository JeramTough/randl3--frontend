import {randl2HttpClient} from '../base/HttpClient'
import {randl2HttpClientV2} from '../base/HttpClientV2'
const BASE = "/randlPersonalInfo";

export default {

    getOneByUid(params, caller) {
        randl2HttpClient.get(BASE + "/oneByUid", params, caller);
    },
    update(data, caller) {
        randl2HttpClient.post(BASE + "/update", data, caller);
    },
    getByPage(params){
        return randl2HttpClientV2.get(BASE + "/page", params);
    }
};