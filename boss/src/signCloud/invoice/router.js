import InvoiceView from "./invoiceView.vue";
import InvoiceList from "./invoiceList.vue";
import ApplyInvoice from "./applyInvoice.vue";
import NewInvoice from "./newInvoice.vue";
import InvoiceInfo from "./invoiceInfo.vue";
import InvoiceDetail from "./invoiceDetail.vue";
import InvoiceCard from "./invoiceCard.vue";
import NullifyInvoice from "./nullifyInvoice.vue";
import InvoicePage from "./invoicePage.vue";


window.addRouter({
    code: "F0305",
    name: "合约开票",
    component: InvoicePage
});

window.addRouter({
    code: "invoiceView",
    name: "合约开票",
    component: InvoiceView
});

window.addRouter({
    code: "B030601",
    name: "申请开票",
    component: ApplyInvoice
});

window.addRouter({
    code: "B030602",
    name: "确认开票",
    component: NewInvoice
});

window.addRouter({
    code: "B030603",
    name: "开票台账",
    component: InvoiceList
});

window.addRouter({
    code: "invoiceInfo",
    name: "发票信息",
    component: InvoiceInfo
});

window.addRouter({
    code: "invoiceDetail",
    name: "发票明细",
    component: InvoiceDetail
});

window.addRouter({
    code: "invoiceCard",
    name: "发票冲红",
    component: InvoiceCard
});

window.addRouter({
    code: "nullifyInvoice",
    name: "发票作废",
    component: NullifyInvoice
});