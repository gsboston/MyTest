import MetaManagementLis from "./metaManagementList.vue";
import metaManagementAdd from "./metaManagementAdd.vue";

addRouter({
    code: "F0903",
    name: "TDK编辑",
    component: MetaManagementLis
});

addRouter({
    code: "metaManagementAdd",
    name: "新增",
    component: metaManagementAdd
});

