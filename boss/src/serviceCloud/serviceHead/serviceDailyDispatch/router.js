import SDD from "./SDDPage.vue";
import NewDailyServiceBuilder from "./newDailyServiceBuilder.vue";
import DailyServiceList from "./dailyServiceList.vue";
import DailyServiceDetailInfo from "./dailyServiceDetailInfo.vue";
import FileList from "./fileList.vue";

window.addRouter({
    code: "F0703",
    name: "日常任务派工",
    component: SDD
});

window.addRouter({
    code: "newDailyServiceBuilder",
    name: "新建日常派工任务",
    component: NewDailyServiceBuilder
});

window.addRouter({
    code: "dailyServiceList",
    name: "日常任务已派工",
    component: DailyServiceList
});

window.addRouter({
    code: "dailyServiceDetailInfo",
    name: "日常任务详情",
    component: DailyServiceDetailInfo
});

window.addRouter({
    code: "fileList",
    name: "补充资料",
    component: FileList
});

