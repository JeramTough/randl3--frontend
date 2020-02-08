import AdminUserApi from "@/api/AdminUserApi";

let apiHandler = {
    getAdminUserApi: function () {
        return AdminUserApi;
    }
};

export default apiHandler;