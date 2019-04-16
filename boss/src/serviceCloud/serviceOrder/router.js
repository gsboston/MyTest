import ServiceOrder from "./serviceOrder.vue";
import OrderOrRefuse from "./orderOrRefuse.vue"
import OrderOrRefuseBatch from "./orderOrRefuseBatch.vue"
import ServiceProgress from "./serviceProgress.vue"

window.addRouter({
    code: "F0702",
    name: "服务接单",
    component: ServiceOrder
});
window.addRouter({
    code: "OrderOrRefuse",
    name: "接单或拒单",
    component: OrderOrRefuse
});
window.addRouter({
    code: "OrderOrRefuseBatch",
    name: "批量接单或拒单",
    component: OrderOrRefuseBatch
});
window.addRouter({
    code: "ServiceProgress",
    name: "服务进度",
    component: ServiceProgress
});