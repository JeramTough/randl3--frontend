export default {

    permissions: null,

    init: function (permissions) {
        this.permissions = permissions;
        sessionStorage.setItem("permissions", JSON.stringify(permissions));
    }

    ,
    getPermissions(){
        if (this.permissions===null){
            this.permissions=JSON.parse(sessionStorage.getItem("permissions"));
        }
        return this.permissions;
    }
    ,

    hasPermissionByApiId(apiId) {
        for (let permission of this.getPermissions()) {
            if (permission.apiId === apiId) {
                return true;
            }
        }
        return false;
    }
    ,

    hasPermissionByApiAlias(apiAlias) {

        for (let permission of this.getPermissions()) {
            if (permission.apiAlias === apiAlias) {
                return true;
            }
        }
        return false;
    }
    ,

    dontHavePermissionByApiAlias(apiAlias) {
        return !this.hasPermissionByApiAlias(apiAlias);
    }

}