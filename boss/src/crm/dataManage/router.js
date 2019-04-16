import index from "./index.vue";
import EditEnterprise from "./editEnterprise.vue";
import EditPersonal from "./editPersonal.vue";

window.addRouter({
    code: "F0204",
    name: "数据管理",
    component: index
});

window.addRouter({
    code: "editEnterprise",
    name: "修改线索",
    component: EditEnterprise
});

window.addRouter({
    code: "editPersonal",
    name: "修改线索",
    component: EditPersonal
});