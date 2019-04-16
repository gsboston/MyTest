import ContractParameter from "./contractParameter.vue";
import AuditedContractView from "./auditedContractView.vue";

window.addRouter({
    code: "F1102",
    name: "合约台账",
    component: ContractParameter
});

window.addRouter({
    code: "auditedContractView",
    name: "合约详情",
    component: AuditedContractView
});