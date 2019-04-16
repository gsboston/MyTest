import ClueManagement from "./clueManagement.vue";
import errorRecovery from "./errorRecovery.vue";
import opportunityAdd from "./opportunityAdd.vue";
import documentaryAdd from "./documentaryAdd.vue";
import eyeSearchPrompt from "./eyeSearchPrompt.vue";
import dispath from "./dispatch.vue";
import cooperation from "./cooperation.vue";

window.addRouter({
    code: "F0201",
    name: "线索管理",
    component: ClueManagement
});

window.addRouter({
    code: "errorRecovery",
    name: "纠错",
    component: errorRecovery
});

window.addRouter({
    code: "opportunityAdd",
    name: "新增商机",
    component: opportunityAdd
});

window.addRouter({
    code: "documentaryAdd",
    name: "新增跟单记录",
    component: documentaryAdd
});

window.addRouter({
    code: "eyeSearchPrompt",
    name: "天眼查使用地图查询附近的公司",
    component: eyeSearchPrompt
});

window.addRouter({
    code: "dispath",
    name: "商机派单",
    component: dispath
});

window.addRouter({
    code: "cooperation",
    name: "协作",
    component: cooperation
});