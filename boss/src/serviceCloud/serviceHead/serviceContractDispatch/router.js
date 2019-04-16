import ServiceContractPage from "./serviceContractPage.vue";
import SCOrderOrRefuse from "./SCOrderOrRefuse.vue";

window.addRouter({
    code: "F0704",
    name: "合约服务单列表",
    component: ServiceContractPage
});

window.addRouter({
    code: "SCOrderOrRefuse",
    name: "服务单派工/退回",
    component: SCOrderOrRefuse
});