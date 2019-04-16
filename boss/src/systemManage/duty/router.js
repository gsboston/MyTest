import DutyMgr from "./duty.vue";
import DutyCard from "./dutyCard.vue";

addRouter({
    code: "F0508",
    name: "职责管理",
    component: DutyMgr
});

addRouter({
    code: "dutyCard",
    name: "职责卡片",
    component: DutyCard
});