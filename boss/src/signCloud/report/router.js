import CollectionReport from "./collectionReport.vue";
import "./contractSign/router";
import "./audit/router";
import './invoice/router';
import "./contractParameter/router";
import "./allContractSearch/router";
import "./reportOrg/router";
import ReportPersonal from "./reportPersonal.vue";
import ReportOrg from "./reportOrg.vue";
import ResultsQuery from "./resultsQuery.vue";

window.addRouter({
    code: "F1101",
    name:"数据概览-个人",
    component: ReportPersonal
});

window.addRouter({
    code: "F1103",
    name:"数据概览",
    component: ReportOrg
});

window.addRouter({
    code: "F1106",
    name:"业绩查询",
    component: ResultsQuery
});