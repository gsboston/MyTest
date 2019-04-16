import zhztList from "./zhztList.vue";
import zhztsz from "./zhztsz.vue";
import zhztxf from "./zhztxf.vue";
import zhztkr from "./zhztkr.vue";
import zhztRecordList from "./zhztRecordList.vue";

addRouter({
    code: "F1006",
    name: "账户状态",
    component: zhztList
});

addRouter({
    code: "zhztsz",
    name: "设置",
    component: zhztsz
});

addRouter({
    code: "zhztxf",
    name: "续费",
    component: zhztxf
});

addRouter({
    code: "zhztkr",
    name: "扩容",
    component: zhztkr
});

addRouter({
    code: "zhztRecordList",
    name: "操作详情",
    component: zhztRecordList
});

