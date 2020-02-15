import AdminUserApi from "@/api/AdminUserApi";
import RoleApi from "@/api/RoleApi";
import ApiInfoApi from "@/api/ApiInfoApi";
import PermissionApi from "@/api/PermissionApi";

let apiHandler = {
    getAdminUserApi: function () {
        return AdminUserApi;
    },
    getRoleApi: function () {
        return RoleApi;
    },
    getApiInfoApi: function () {
        return ApiInfoApi;
    },
    getPermissionApi: function () {
        return PermissionApi;
    }

};

export default apiHandler;