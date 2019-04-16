import ModuleList from "./moduleList.vue";
import ModuleCard from "./moduleCard.vue";

addRouter({
    code: "F0509",
    name: "业务模块列表",
    component: ModuleList
});

addRouter({
    code: "moduleCard",
    name: "业务模块卡片",
    component: ModuleCard
});