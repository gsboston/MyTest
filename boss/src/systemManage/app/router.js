import AppList from "./appList.vue";
import AppCard from "./appCard.vue";

addRouter({
    code: "F0558",
    name: "应用管理",
    component: AppList
});

addRouter({
    code: "F055801",
    name: "新增&修改应用",
    component: AppCard
});