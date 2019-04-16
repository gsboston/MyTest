import SinglePermissions from "./singlePermissions.vue";
import SinglePermissionsCard from "./singlePermissionsCard.vue";
import SinglePermissionsPersonnel from "./singlePermissionsPersonnel.vue";

window.addRouter({
    code: "F0525",
    name: "接单权限管理",
    component: SinglePermissions
});

window.addRouter({
    code: "singlePermissionsCard",
    name: "接单权限编辑",
    component: SinglePermissionsCard
});

window.addRouter({
    code: "singlePermissionsPersonnel",
    name: "选择人员",
    component: SinglePermissionsPersonnel
});