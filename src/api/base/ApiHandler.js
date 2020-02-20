import adminUserApi from "@/api/AdminUserApi";
import roleApi from "@/api/RoleApi";
import apiInfoApi from "@/api/ApiInfoApi";
import permissionApi from "@/api/PermissionApi";
import verificationCodeApi from "@/api/VerificationCodeApi";
import registeredUserApi from "@/api/RegisteredUserApi";
import personalInfoApi from "@/api/PersonalInfoApi";
import surfaceImageApi from "@/api/SurfaceImageApi";

let apiHandler = {
    getAdminUserApi: function () {
        return adminUserApi;
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
    getRegisteredUserApi: function () {
        return registeredUserApi;
    }
    ,
    getPersonalInfoApi: function () {
        return personalInfoApi;
    }
    ,
    getSurfaceImageApi: function () {
        return surfaceImageApi;
    }
};

export default apiHandler;