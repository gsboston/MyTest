import CustomServiceLis from "./customServiceList.vue";
import customServiceAdd from "./customServiceAdd.vue";

addRouter({
    code: "F0901",
    name: "客服管理",
    component: CustomServiceLis
});

addRouter({
    code: "customServiceAdd",
    name: "编辑小能ID",
    component: customServiceAdd
});

