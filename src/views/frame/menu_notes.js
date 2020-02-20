export {menuNotes, menuNoteMap} ;

const menuNotes = [
    {
        index: "0",
        iconClass: "el-icon-s-home menu-icon",
        viewName: "home_view",
        title: "主页",
        children: null
    },
    {
        index: "1",
        iconClass: "el-icon-lock menu-icon",
        viewName: null,
        title: "权限管理",
        children:
            [
                {
                    index: "1-0",
                    iconClass: "el-icon-s-home menu-icon",
                    viewName: "interface_view",
                    title: "接口管理",
                    children: null
                },
                {
                    index: "1-1",
                    iconClass: "el-icon-s-home menu-icon",
                    viewName: "role_view",
                    title: "角色管理",
                    children: null
                },
                {
                    index: "1-2",
                    iconClass: "el-icon-s-home menu-icon",
                    viewName: "allocation_view",
                    title: "权限分配",
                    children: null
                }
            ]
    },
    {
        index: "2",
        iconClass: "el-icon-s-custom menu-icon",
        viewName: null,
        title: "用户管理",
        children:
            [
                {
                    index: "2-0",
                    iconClass: "el-icon-s-home menu-icon",
                    viewName: "admin_user_view",
                    title: "管理员账户管理",
                    children: null
                },
                {
                    index: "2-1",
                    iconClass: "el-icon-s-custom menu-icon",
                    viewName: "registered_user_view",
                    title: "普通用户管理",
                    children: null
                }
            ]
    },
];


let initMap = function () {
    let map = new Map();
    let tempList = [];
    if (menuNotes.length > 0) {
        for (let menuNote of menuNotes) {
            map.set(menuNote.index, menuNote);
            if (menuNote.children != null) {
                tempList.push(menuNote);
            }
        }
    }

    let tempNote;
    while (tempList.length > 0) {
        tempNote = tempList[0];
        tempList.splice(0, 1);
        let childrenNotes = tempNote.children;
        for (let menuNote of childrenNotes) {
            map.set(menuNote.index, menuNote);
            if (menuNote.children != null) {
                tempList.push(menuNote);
            }
        }
    }

    return map;

};

const menuNoteMap = initMap();



