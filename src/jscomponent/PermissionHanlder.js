export default {

    permissions: [],
    permissionNameMap: [],

    init: function (permissions) {
        this.permissions = permissions;
    }

    ,

    hasPermissionByApiId(apiId) {
        for (let permission of this.permissions) {
            if (permission.apiId === apiId) {
                return true;
            }
        }
        return false;
    }
    ,

    hasPermissionByApiAlias(apiAlias) {

        for (let permission of this.permissions) {
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