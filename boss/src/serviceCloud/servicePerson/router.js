import ServicePerson from "./servicePerson.vue";
import ServicePersonList from "./servicePersonList.vue";
import ServicePersonContent from "./servicePersonContent.vue";
import ServicePersonDaily from "./servicePersonDaily";

window.addRouter({
    code: "F0705",
    name: "服务人员",
    component: ServicePerson
});

window.addRouter({
    code: "ServicePersonList",
    name: "服务人员-任务列表",
    component: ServicePersonList
});
window.addRouter({
    code: "ServicePersonContent",
    name: "服务人员-合约服务单",
    component: ServicePersonContent
});

window.addRouter({
    code: "ServicePersonDaily",
    name: "服务人员-日常服务单",
    component: ServicePersonDaily
});

