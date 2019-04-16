import CustomerManage from "./customerManage.vue";
import SelectUser from "./selectUser.vue";
import viewContactList from "./viewContactList.vue";

window.addRouter({
    code: "F0308",
    component: CustomerManage
});

window.addRouter({
    code: "selectManagerForCustomer",
    component: SelectUser
});

window.addRouter({
    code: "viewContactList",
    component: viewContactList
});

