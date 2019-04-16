import ContractDefineList from "./contractDefineList.vue";
import AddContractDefine from "./addContractDefine.vue";
import AllotmentPage from "./allotmentPage.vue";
import AuditConfigurationPage from "./auditConfigurationPage.vue";

window.addRouter({
    code: "F0515",
    name: "合同定义管理",
    component: ContractDefineList
});
window.addRouter({
    code: "F0516",
    name: "新增合同定义",
    component: AddContractDefine
});
window.addRouter({
    code: "allotmentPage",
    name: "分配页面",
    component: AllotmentPage
});
window.addRouter({
    code: "auditConfigurationPage",
    name: "自动审核规则配置",
    component: AuditConfigurationPage
});


