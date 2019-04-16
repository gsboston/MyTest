import ServiceSendPermission from "./serviceSendPermission.vue";
import ServiceSendPersonCard from "./serviceSendPersonCard.vue";
import ServiceSendAgreementCard from "./serviceSendAgreementCard.vue";
import ServiceSendPostCard from "./servicePostCard.vue";

window.addRouter({
    code: "F0527",
    name: "派单权限管理",
    component: ServiceSendPermission
});

window.addRouter({
    code: "F052701",
    name: "派单权限选择人员",
    component: ServiceSendPersonCard
});

window.addRouter({
    code: "F052702",
    name: "派单权限选择合约",
    component: ServiceSendAgreementCard
});

window.addRouter({
    code: "F052703",
    name: "派单岗位卡片",
    component: ServiceSendPostCard
});