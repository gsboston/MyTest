import ddglList from "./ddglList.vue";
import ddxq from "./ddxq.vue";

addRouter({
    code: "F1002",
    name: "订单管理",
    component: ddglList
});

addRouter({
    code: "ddxq",
    name: "订单详情",
    component: ddxq
});

