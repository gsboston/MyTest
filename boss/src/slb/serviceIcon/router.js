import ServiceIconList from "./serviceIconList.vue";
import serviceIconAdd from "./serviceIconAdd.vue";

addRouter({
    code: "F0900",
    name: "服务标识",
    component: ServiceIconList
});

addRouter({
    code: "serviceIconAdd",
    name: "图标上传",
    component: serviceIconAdd
});

