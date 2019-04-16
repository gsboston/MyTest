import ThematicManagementLis from "./thematicManagementList.vue";
import thematicManagementAdd from "./thematicManagementAdd.vue";

addRouter({
    code: "F0902",
    name: "专题管理",
    component: ThematicManagementLis
});

addRouter({
    code: "thematicManagementAdd",
    name: "新增",
    component: thematicManagementAdd
});

