import {randl2HttpClient} from './base/HttpClient'

const BASE = "/adminUser";

export default {
    login: function (params,caller) {
        randl2HttpClient.postWithParams(BASE+"/login",params,caller);
    }
};