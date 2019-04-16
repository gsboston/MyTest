import contractPreview from "../contractDetails/contractPreview.vue";
import NewContractInfo from "./newContractInfo.vue";
import NewContractDetails from "./newContractDetails.vue";
import NewChangeList from "./newChangeList.vue";
import MyContract from "./myContract.vue";
import NewCollectionView from "./newCollectionView.vue";
import ContractPerfect from "./contractPerfect.vue"
import ServiceList from "./serviceList"
import ServiceInfoProgress from "./serviceInfoProgress"

window.addRouter({
    code: "F0303",
    name: "我的合约",
    component: MyContract
});
window.addRouter({
    code: "newContractDetails",
    name: "新版合约详情",
    component: NewContractDetails
});
window.addRouter({
    code: "contractPreview",
    name: "新版合约预览",
    component: contractPreview
});
window.addRouter({
    code: "newContractInfo",
    name: "新版合约信息",
    component: NewContractInfo
});
window.addRouter({
    code: "newChangeList",
    name: "新版合约变更协议列表",
    component: NewChangeList
});
window.addRouter({
    code: "newCollectionView",
    name: "新版合约收款信息",
    component: NewCollectionView
});
window.addRouter({
    code: "contractPerfect",
    name: "新版合约完善",
    component: ContractPerfect
});
window.addRouter({
    code: "serviceList",
    name: "新版合约服务进度",
    component: ServiceList
});
window.addRouter({
    code: "serviceInfoProgress",
    name: "新版合约服务进度详情",
    component: ServiceInfoProgress
});