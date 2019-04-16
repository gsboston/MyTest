import orgSystemList from "./orgSystemList.vue";
import orgSystemAdd from "./orgSystemAdd.vue";
import orgSystemEdit from "./orgSystemEdit.vue";

window.addRouter({
    code: "F0503",
    name: "组织体系",
    component: orgSystemList
});

window.addRouter({
    code: "orgSystemAdd",
    name: "组织体系卡片",
    component: orgSystemAdd
});

window.addRouter({
    code: "orgSystemEdit",
    name: "修改组织体系",
    component: orgSystemEdit
});