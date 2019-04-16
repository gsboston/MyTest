import contractDetails from "./contractDetails.vue";
import contractDetailsLess from "./contractDetailsLess.vue";
import contractPreview1 from "./contractPreview.vue";
import contractInfo from "./contractInfo.vue";
import CancelView from "./cancelView.vue";
import Termination from "./termination.vue";
import ContractSubjectChange from "./contractSubjectChange.vue";
window.addRouter({
    code: "F030301",
    name: "合约详情",
    component: contractDetails
});

window.addRouter({
    code: "contractDetailsLess",
    name: "合约详情-没有合约信息",
    component: contractDetailsLess
});

window.addRouter({
    code: "contractPreview1",
    name: "合约预览",
    component: contractPreview1
});

window.addRouter({
    code: "contractInfo",
    name: "合约信息",
    component: contractInfo
});
window.addRouter({
    code: "cancel",
    name: "取消审核",
    component: CancelView
});
window.addRouter({
    code: "termination",
    name: "合约解约录入",
    component: Termination
});

window.addRouter({
    code: "contractSubjectChange",
    name: "合约主体变更",
    component: ContractSubjectChange
});