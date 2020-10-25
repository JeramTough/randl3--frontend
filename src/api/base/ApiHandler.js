import adminLoginApi from "@/api/randl/AdminLoginApi";
import randlUserApi from "@/api/randl/RandlUserApi";
import randlAppApi from "@/api/randl/RandlAppApi";
import roleApi from "@/api/randl/RoleApi";
import apiInfoApi from "@/api/randl/ApiInfoApi";
import permissionApi from "@/api/randl/PermissionApi";
import verificationCodeApi from "@/api/randl/VerificationCodeApi";
import registeredUserLoginedApi from "@/api/randl/RegisteredUserLoginedApi";
import personalInfoApi from "@/api/randl/PersonalInfoApi";
import surfaceImageApi from "@/api/randl/SurfaceImageApi";

let apiHandler = {
    getAdminLoginApi: function () {
        return adminLoginApi;
    },
    getRandlUserApi: function () {
        return randlUserApi;
    },
    getRoleApi: function () {
        return roleApi;
    },
    getApiInfoApi: function () {
        return apiInfoApi;
    },
    getPermissionApi: function () {
        return permissionApi;
    }
    ,
    getVerificationCodeApi: function () {
        return verificationCodeApi;
    }
    ,
    getUserApi: function () {
        return randlUserApi;
    }
    ,
    getPersonalInfoApi: function () {
        return personalInfoApi;
    }
    ,
    getSurfaceImageApi: function () {
        return surfaceImageApi;
    }
    , getRegisteredUserLoginedApi: function () {
        return registeredUserLoginedApi;
    }
    ,
    getRandlAppApi() {
        return randlAppApi;
    }
};

export default apiHandler;