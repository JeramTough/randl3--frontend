import AdminUserApi from "@/api/AdminUserApis";

let apiHandler = {
    getAdminUserApi: function () {
        return AdminUserApi;
    }
};

export default apiHandler;