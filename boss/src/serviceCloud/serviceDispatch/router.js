import SD from "./SDPage";
import SDContractList from "./SDContractList";
import SDContractContent from "./SDContractContent";
import SDContractInfo from "./SDContractInfo";
import SDList from "./SDList";
import SDCard from "./SDCard";
import SDInfo from "./SDInfo";
import NoContract from "../../signCloud/noContract";
import SDNewCard from "./SDNewCard";
import SDDispatchCard from "./SDDispatchCard";
import SDFileHistoryList from "./SDFileHistoryList";

window.addRouter({
    code: "F0701",
    name: "服务派单",
    component: SD
});

window.addRouter({
    code: "SDDContractList",
    name: "服务派单-左侧合约列表",
    component: SDContractList
});

window.addRouter({
    code: "SDContractContent",
    name: "服务派单-内容展示",
    component: SDContractContent
});

window.addRouter({
    code: "SDContractInfo",
    name: "服务派单-合约内容展示",
    component: SDContractInfo
});

window.addRouter({
    code: "SDList",
    name: "服务派单-服务单列表展示",
    component: SDList
});

window.addRouter({
    code: "SDCard",
    name: "服务派单-服务单编辑",
    component: SDCard
});

window.addRouter({
    code: "SDInfo",
    name: "服务派单-服务单详情",
    component: SDInfo
});

window.addRouter({
    code: "noService",
    component: NoContract
});

window.addRouter({
    code: "SDNewCard",
    name: "服务派单-生成服务单",
    component: SDNewCard
});

window.addRouter({
    code: "SDDispatchCard",
    name: "服务派单-派单",
    component: SDDispatchCard
});

window.addRouter({
    code: "SDFileHistoryList",
    name: "资料移交记录",
    component: SDFileHistoryList
});