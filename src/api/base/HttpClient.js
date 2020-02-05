import Vue from 'vue';

function HttpClient(baseUrl) {
    return {
        baseURL: baseUrl,

        openLog: function () {
            this.handle.isPrintedLog = true;
        },
        closeLog: function () {
            this.handle.isPrintedLog = false;
        },

        handle: {
            isPrintedLog: false,

            handleResponse: function (response, caller) {

                if (this.isPrintedLog) {
                    console.info(response);
                }

                if (response.status === 200) {
                    caller(response.data);
                } else {
                    caller({
                        isSuccessful: false,
                        responseBody: response.statusText,
                        statusCode: response.status
                    });
                }
            },

            handleError: function (error, caller) {
                console.error(error);
                caller({isSuccessful: false});
            }
        },

        get: function (url, params, caller) {
            let handle = this.handle;
            Vue.axios({
                baseURL: baseUrl,
                method: 'get',
                url: url,
                params: params
            }).then(function (response) {
                handle.handleResponse(response, caller);
            }).catch(function (error) {
                handle.handleError(error, caller);
            });
        },

        post: function (url, data, caller) {
            let handle = this.handle;
            Vue.axios({
                method: 'post',
                url: url,
                data: data
            }).then(function (response) {
                handle.handleResponse(response, caller);
            }).catch(function (error) {
                debugger;
                handle.handleError(error, caller);
            });
        },

        postWithParams: function (url, params, caller) {
            let handle = this.handle;
            Vue.axios({
                baseURL: baseUrl,
                method: 'post',
                url: url,
                params: params
            }).then(function (response) {
                handle.handleResponse(response, caller);
            }).catch(function (error) {
                debugger;
                handle.handleError(error, caller);
            });
        }
    };
}

const randl2HttpClient = new HttpClient("http://127.0.0.1:8088/randl2");


export {randl2HttpClient};