import ContractSelector from "./contractSelector.vue";
import ContractBuilder from "./contractBuilder.vue";
import JumpSelectOrg from "./jumpSelectOrg.vue";
import SaveValidation from "./saveValidation.vue";

window.addRouter({
    code: "contractSelector",
    component: ContractSelector
});

window.addRouter({
    code: "F0301",
    name: "新建合约",
    component: ContractSelector
});

window.addRouter({
    code: "contractBuilder",
    name: "合约录入",
    component: ContractBuilder
});
window.addRouter({
   code: "jumpSelectOrg",
    name: "组织选择",
    component: JumpSelectOrg
});

window.addRouter({
    code: "saveValidation",
    name: "人工审核/自动审核",
    component: SaveValidation
});

