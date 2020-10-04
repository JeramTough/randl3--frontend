import {randl2HttpClient} from '../base/HttpClient'

const BASE = "/registeredUser";

export default {

    loginByPassword(params, caller) {
        randl2HttpClient.postWithParams(BASE + "/login/byPassword", params, (data) => {
            if (data.isSuccessful) {
                let token = data.responseBody.token;
                randl2HttpClient.setAuthorization(token);
            }
            caller(data);
        });
    },
    loginByVerificationCode(params, caller) {
        randl2HttpClient.postWithParams(BASE + "/login/byVerificationCode", params, (data) => {
            if (data.isSuccessful) {
                let token = data.responseBody.token;
                randl2HttpClient.setAuthorization(token);
            }
            caller(data);
        });
    },
    getPersonalInfo(params, caller) {
        randl2HttpClient.get(BASE + "/logined/personalInfo", params, caller);
    },
    updatePersonalInfo(data, caller) {
        randl2HttpClient.post(BASE + "/logined/updatePersonalInfo", data, caller);
    },
    updateSurfaceImage(data, caller) {
        randl2HttpClient.post(BASE + "/logined/updateSurfaceImage", data, caller);
    },
    resetPassword(data, caller) {
        randl2HttpClient.post(BASE + "/logined/resetPassword", data, caller);
    },
    bindingPhoneOrEmail(data, caller) {
        randl2HttpClient.post(BASE + "/logined/bindingPhoneOrEmail", data, caller);
    },

}