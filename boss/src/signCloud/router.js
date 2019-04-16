import "./contract/router";
import "./collections/router";
import "./contractDetails/router";
import "./change/router";
import "./invoice/router";
import "./audit/router";
import "./newContractDetails/router";
import "./surrender/router";
import "./customer/router";
import "./report/router";
import "../systemManage/report/router";
import NoContract from "./noContract.vue";
import NullifyView from "./nullifyView.vue"


window.addRouter({
    code: "noContract",
    component: NoContract
});

window.addRouter({
    code: "nullify",
    name: "合同作废",
    component: NullifyView
});