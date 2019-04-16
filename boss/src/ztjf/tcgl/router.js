import TcglList from "./tcglList.vue";
import tcglAdd from "./tcglAdd.vue";
import tcglRecordList from "./tcglRecordList.vue";

addRouter({
    code: "F1001",
    name: "套餐管理",
    component: TcglList
});

addRouter({
    code: "tcglAdd",
    name: "新增",
    component: tcglAdd
});

addRouter({
    code: "tcglRecordList",
    name: "账套套餐操作记录",
    component: tcglRecordList
});

