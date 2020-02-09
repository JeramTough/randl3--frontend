import Vue from 'vue';
import {
    Message
} from 'element-ui'

export default {

    success: function (message) {
        Message({
            message: message,
            type: 'success'
        });
    },
    error: function (message) {
        Message({
            message: message,
            type: 'error'
        });
    }
}