import AdminUserApi from "@/api/AdminUserApi";
import RoleApi from "@/api/RoleApi";
import ApiInfoApi from "@/api/ApiInfoApi";

let apiHandler = {
    getAdminUserApi: function () {
        return AdminUserApi;
    },
    getRoleApi: function () {
        return RoleApi;
    },
    getApiInfoApi: function () {
        return ApiInfoApi;
    }
};

export default apiHandler;