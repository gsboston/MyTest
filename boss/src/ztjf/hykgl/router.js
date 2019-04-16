import hykList from "./hykList.vue";
import hykAdd from "./hykAdd.vue";
import hykhAdd from "./hykhAdd.vue";
import hyzkAdd from "./hyzkAdd.vue";
import hyrkAdd from "./hyrkAdd.vue";
import hyrkQr from "./hyrkQr.vue";
import hypkAdd from "./hypkAdd.vue";
import hypkQr from "./hypkQr.vue";
import hykRecordList from "./hykRecordList.vue";

addRouter({
    code: "F1004",
    name: "会员卡管理",
    component: hykList
});

addRouter({
    code: "hykAdd",
    name: "新增",
    component: hykAdd
});

addRouter({
    code: "hykhAdd",
    name: "生成卡号",
    component: hykhAdd
});

addRouter({
    code: "hyzkAdd",
    name: "制卡",
    component: hyzkAdd
});

addRouter({
    code: "hyrkAdd",
    name: "入库",
    component: hyrkAdd
});

addRouter({
    code: "hyrkQr",
    name: "入库确认",
    component: hyrkQr
});

addRouter({
    code: "hypkAdd",
    name: "派卡",
    component: hypkAdd
});

addRouter({
    code: "hypkQr",
    name: "派卡确认",
    component: hypkQr
});

addRouter({
    code: "hykRecordList",
    name: "会员卡操作记录",
    component: hykRecordList
});

