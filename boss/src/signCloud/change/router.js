import ContractChange from "./contractChange.vue";
import NewContractChange from "./newContractChange.vue";
import NewSubjectChange from "./newSubjectChange.vue";
import ChangeNullifyView from "./changeNullifyView.vue";

window.addRouter({
    code: "contractChange",
    component: ContractChange
});
window.addRouter({
    code: "F0307",
    component: NewContractChange
});
window.addRouter({
    code: "newSubjectChange",
    component: NewSubjectChange
});
window.addRouter({
    code: "changeNullifyView",
    component: ChangeNullifyView
});