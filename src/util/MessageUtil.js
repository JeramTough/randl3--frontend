import Vue from 'vue';
import {
    Message,
    MessageBox,
    Notification
} from 'element-ui'

export default {

    success: function (message) {
        Message({
            message: message,
            type: 'success'
        });
    },
    success1: function (message) {
        Notification({
            title: '成功',
            message: message,
            type: 'success'
        });
    },
    error: function (message) {
        Message({
            message: message,
            type: 'error'
        });
    },
    error1: function (message) {
        Notification({
            title: '失败',
            message: message,
            type: 'error'
        });
    },
    sureDialog: function (message, caller) {
        MessageBox(message, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            showCancelButton: true,
            type: 'warning'
        }).then(() => {
            caller();
        }).catch(() => {
            Message({
                type: 'info',
                message: '已取消删除'
            });
        });
    }
}