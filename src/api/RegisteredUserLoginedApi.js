import {randl2HttpClient} from './base/HttpClient'

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
    bindingPhoneOrEmail(data, caller) {
        randl2HttpClient.post(BASE + "/logined/bindingPhoneOrEmail", data, caller);
    },

}