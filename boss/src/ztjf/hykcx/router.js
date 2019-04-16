import hykcxList from "./hykcxList.vue";
import hykxq from "./hykxq.vue";
import delkh from "./delkh.vue";
import delzk from "./delzk.vue";
import delsk from "./delsk.vue";

addRouter({
    code: "F1005",
    name: "会员卡查询",
    component: hykcxList
});

addRouter({
    code: "hykxq",
    name: "详情",
    component: hykxq
});

addRouter({
    code: "delkh",
    name: "卡号删除确认",
    component: delkh
});

addRouter({
    code: "delzk",
    name: "制卡取消确认",
    component: delzk
});

addRouter({
    code: "delsk",
    name: "派卡收款确认",
    component: delsk
});