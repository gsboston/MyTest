import ServiceProvider from "./serviceProvider.vue";
import ServiceProviderCard from "./serviceProviderCard.vue";
import OrgSearcher from "./orgSearcher";

window.addRouter({
    code: "F0524",
    name: "服务商管理",
    component: ServiceProvider
});

window.addRouter({
    code: "serviceProviderCard",
    name: "服务商编辑",
    component: ServiceProviderCard
});

window.addRouter({
    code: "orgSearcher",
    name: "组织筛选",
    component: OrgSearcher
});