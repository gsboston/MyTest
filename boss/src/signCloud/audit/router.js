import Audit from "./audit.vue";
import RejectView from "./rejectView.vue";
import ChangeAudit from "./changeAudit.vue";
import RejectChangeView from "./rejectChangeView.vue";
import AuditViewPage from "./auditViewPage.vue";
import CancelAuditView from "../contractDetails/cancelView.vue";
import ChangeCancelAuditView from "./changeCancelAuditView.vue";

window.addRouter({
    code: "audit",
    name: "合约审核",
    component: Audit
});
window.addRouter({
    code: "rejectView",
    name: "合同驳回",
    component: RejectView
});
window.addRouter({
    code: "changeAudit",
    name: "变更协议审核",
    component: ChangeAudit
});
window.addRouter({
    code: "rejectChangeView",
    name: "变更协议驳回",
    component: RejectChangeView
});
window.addRouter({
    code: "F0302",
    name: "合约审核环节",
    component: AuditViewPage
});
window.addRouter({
    code: "cancelAuditView",
    name: "合约取消审核环节",
    component: CancelAuditView
});
window.addRouter({
    code: "changeCancelAuditView",
    name: "变更协议取消审核环节",
    component: ChangeCancelAuditView
});
