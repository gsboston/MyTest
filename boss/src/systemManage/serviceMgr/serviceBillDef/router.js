import ServiceBillDef from "./serviceBillDef.vue";
import ServiceBillProcess from "./serviceBillProcess.vue";
import ChooseList from "./chooseList.vue";

window.addRouter({
    code: "F0523",
    name: "服务单定义",
    component: ServiceBillDef
});

window.addRouter({
    code: "F052301",
    name: "服务单流程定义卡片",
    component: ServiceBillProcess
});

window.addRouter({
    code: "chooseList",
    name: "选择列表",
    component: ChooseList
});