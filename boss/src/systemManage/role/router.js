import RoleMgr from "./role.vue";
import RoleCard from "./roleCard.vue";
import RoleDutyCard from "./roleDutyRef.vue";

addRouter({
    code: "F0507",
    name: "角色管理",
    component: RoleMgr
});

addRouter({
    code: "roleCard",
    name: "角色卡片",
    component: RoleCard
});

addRouter({
    code: "roleDutyCard",
    name: "角色职责卡片",
    component: RoleDutyCard
});