import ResourceList from "./resourceList.vue";
import ResourceAdd from "./resourceAdd.vue";
import ResourceEdit from "./resourceEdit.vue";
import FuncBtnInfo from "./funcBtnInfo.vue";

addRouter({
    code: "F0510",
    name: "功能管理",
    component: ResourceList
});

addRouter({
    code: "resourceAdd",
    name: "新增功能",
    component: ResourceAdd
});

addRouter({
    code: "resourceEdit",
    name: "修改功能",
    component: ResourceEdit
});

addRouter({
    code: "resourceList_FuncBtnInfo",
    name: "新增按钮",
    component: FuncBtnInfo
});