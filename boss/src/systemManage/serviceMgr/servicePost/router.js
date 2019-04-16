import ServicePost from "./servicePost.vue";
import ServicePostCard from "./servicePostCard.vue";
import ServicePostStaffl from "./servicePostStaffl.vue";

window.addRouter({
    code: "F0526",
    name: "服务岗位设置",
    component: ServicePost
});

window.addRouter({
    code: "servicePostCard",
    name: "服务岗位编辑",
    component: ServicePostCard
});

window.addRouter({
    code: "servicePostStaffl",
    name: "选择人员",
    component: ServicePostStaffl
});
