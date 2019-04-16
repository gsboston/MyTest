import OrgInfoHelp from "./orgInfoHelp";
import OrgSettingHelp from "./orgSettingHelp";
import AdviserGroundingHelp from "./AdviserGroundingHelp";
import ServiceProviderHelp from "./ServiceProviderHelp";
import ServiceSendPermissionHelp from "./ServiceSendPermissionHelp";
import SinglePermissionsHelp from "./SinglePermissionsHelp";
import ServicePostHelp from "./ServicePostHelp";

window.addRouter({
    code: "orgInfoHelp",
    name: "组织信息完善 -- 帮助",
    component: OrgInfoHelp
});

window.addRouter({
    code: "orgSettingHelp",
    name: "组织管理设置 -- 帮助",
    component: OrgSettingHelp
});

window.addRouter({
    code: "AdviserGroundingHelp",
    name: "顾问上架管理 -- 帮助",
    component: AdviserGroundingHelp
});

window.addRouter({
    code: "ServiceProviderHelp",
    name: "服务商管理 -- 帮助",
    component: ServiceProviderHelp
});

window.addRouter({
    code: "ServiceSendPermissionHelp",
    name: "派单权限管理 -- 帮助",
    component: ServiceSendPermissionHelp
});

window.addRouter({
    code: "SinglePermissionsHelp",
    name: "接单权限管理 -- 帮助",
    component: SinglePermissionsHelp
});

window.addRouter({
    code: "ServicePostHelp",
    name: "服务岗位设置 -- 帮助",
    component: ServicePostHelp
});