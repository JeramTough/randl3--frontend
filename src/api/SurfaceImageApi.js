import {randl2HttpClient} from './base/HttpClient'

const BASE = "/surfaceImage";

export default {

    uploadAndUpdate(data, caller) {
        randl2HttpClient.post(BASE + "/uploadAndUpdate", data, caller);
    },
    update(data, caller) {
        randl2HttpClient.post(BASE + "/update", data, caller);
    },
    upload(data, caller) {
        randl2HttpClient.post(BASE + "/upload", data, caller);
    },
    updateCurrentAdmin(data, caller) {
        randl2HttpClient.post(BASE + "/updateCurrentAdmin", data, caller);
    },

};