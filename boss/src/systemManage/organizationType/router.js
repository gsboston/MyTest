import OrganizationType from "./organizationType.vue";
import OrganizationTypeCard from "./organizationTypeCard.vue";

window.addRouter({
    code: "organizationType",
    name: "组织类型管理",
    component: OrganizationType
});

window.addRouter({
    code: "organizationTypeCard",
    name: "组织编辑功能",
    component: OrganizationTypeCard
});