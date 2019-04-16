import kpglList from "./kpglList.vue";
import fpxq from "./fpxq.vue";
import kpxq from "./kpxq.vue";

addRouter({
    code: "F1003",
    name: "开票管理",
    component: kpglList
});

addRouter({
    code: "fpxq",
    name: "发票送出",
    component: fpxq
});

addRouter({
    code: "kpxq",
    name: "发票详情",
    component: kpxq
});

