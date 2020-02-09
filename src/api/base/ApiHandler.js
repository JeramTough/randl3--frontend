import AdminUserApi from "@/api/AdminUserApi";
import RoleApi from "@/api/RoleApi";

let apiHandler = {
    getAdminUserApi: function () {
        return AdminUserApi;
    },
    getRoleApi: function () {
        return RoleApi;
    }
};

export default apiHandler;