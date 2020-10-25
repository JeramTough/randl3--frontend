import Vue from 'vue';
import de from "element-ui/src/locale/lang/de";

function HttpClient(baseUrl) {
    return {
        baseURL: baseUrl,

        openLog: function () {
            this.handle.isPrintedLog = true;
        },
        closeLog: function () {
            this.handle.isPrintedLog = false;
        },

        get: function (path, params) {
            let handle = this.handle;

            let promise = Vue.axios({
                baseURL: baseUrl,
                method: 'get',
                url: path,
                withCredentials: true,
                params: params,
                headers: {'Authorization': handle.getAuthHeader()}
            }).then(function (response) {
                let data = handle.handleResponse(response);
                return data;
            }).catch(function (error) {
                return handle.handleError(error);
            });

            return promise;
        },

        post: function (path, data) {
            let handle = this.handle;
            let promise = Vue.axios({
                baseURL: baseUrl,
                method: 'post',
                url: path,
                withCredentials: true,
                data: data,
                headers: {'Authorization': handle.getAuthHeader()}
            }).then(function (response) {
                return handle.handleResponse(response);
            }).catch(function (error) {
                return handle.handleError(error);
            });
            return promise;
        },

        postWithParams: function (path, params) {
            let handle = this.handle;
            let promise =Vue.axios({
                baseURL: baseUrl,
                method: 'post',
                url: path,
                withCredentials: true,
                params: params,
                headers: {'Authorization': handle.getAuthHeader()}
            }).then(function (response) {
                return handle.handleResponse(response);
            }).catch(function (error) {
                return handle.handleError(error);
            });
            return promise;
        },

        setAuthorization(token) {
            let authHeader = "Bearer " + token;
            this.handle.setAuthHeader(authHeader);
        },

        removeAuthorization() {
            this.handle.setAuthHeader(null);
        },

        handle: {

            isPrintedLog: false,

            setAuthHeader: function (authHeader) {
                sessionStorage.setItem("authHeader", authHeader);
            },
            getAuthHeader: function () {
                return sessionStorage.getItem("authHeader");
            },
            handleResponse: function (response) {
                if (this.isPrintedLog) {
                    console.info(response);
                }

                if (response.status === 200) {
                    return response.data;
                }
                else {
                    return {
                        isSuccessful: false,
                        responseBody: response.statusText,
                        statusCode: response.status
                    }
                }
            },

            handleError: function (error) {
                console.error(error);
                return ({isSuccessful: false, responseBody: error.message});
            }
        },

    };
}

const randl2HttpClientV2 = new HttpClient("http://127.0.0.1:8088/randl2/adminApp");


export {randl2HttpClientV2};