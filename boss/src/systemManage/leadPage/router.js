import LPOrgInfo from "./LPOrgInfo";
import LPOrgSetting from "./LPOrgSetting";

addRouter({
    code: "LPOrgInfo",
    name: "引导页 -- 组织信息完善",
    component: LPOrgInfo
});

addRouter({
    code: "LPOrgSetting",
    name: "引导页 -- 组织管理设置",
    component: LPOrgSetting
});