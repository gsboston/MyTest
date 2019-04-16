import Organization from "./organization.vue";
import OrganizationCard from "./organizationCard.vue";
import OrganizationInfo from "./organizationInfo.vue";
import OrgCardManagement from "./orgManagementCard.vue";
import OrgSubjectCard from "./orgSubjectCard.vue";
import OrgAreaSearcher from "./orgAreaSearcher.vue";
import OrgRelation from "./orgRelation.vue";
import OutsideOrgRelation from "./outsideOrgRelation.vue";
import StoreGroundingManage from "./storeGroundingManage.vue";
import StoreGroundingManageNew from "./storeGroundingManageNew.vue";
import StoreGroundingManageCard from "./storeGroundingManageCard.vue";
import AdviserGroundingManageCardNew from "./adviserGroundingManageCardNew.vue";
import StoreGroundingManageCardNew from "./storeGroundingManageCardNew.vue";
import AdviserGroundingManage from "./adviserGroundingManage.vue";
import AdviserGroundingManageNew from "./adviserGroundingManageNew.vue";
import AdviserGroundingManageCard from "./adviserGroundingManageCard.vue";
import OrganizationSetting from "./organizationSetting.vue";
import CompanyOpenAudit from "./companyOpenAudit.vue";
import CompanyOpenRefuse from "./companyOpenRefuse.vue";
import CompanyOpenSuccess from "./companyOpenSuccess.vue";
import DepartmentCard from "./departmentCard";
import OrgInformationSetting from './orgInformationSetting.vue';
import OrgUserCard from '../user/orgUserCard.vue';
import OrgInfoRelation from './orgInfoRelation';

window.addRouter({
    code: "F0502",
    name: "组织管理",
    component: Organization
});

window.addRouter({
    code: "organizationCard",
    name: "修改组织",
    component: OrganizationCard
});

window.addRouter({
    code: "orgCardManagement",
    name: "创建机构管理员",
    component: OrgCardManagement
});

window.addRouter({
    code: "F0504",
    name: "机构信息",
    component: OrganizationInfo
});

window.addRouter({
    code: "orgSubjectCard",
    name: "签约主体信息",
    component: OrgSubjectCard
});

window.addRouter({
    code: "orgAreaSearcher",
    name: "行政区域选择器",
    component: OrgAreaSearcher
});

window.addRouter({
    code: "F0505",
    name: "机构管理",
    component: OrgRelation
});

window.addRouter({
    code: "F0528",
    name: "外部服务商机构管理",
    component: OutsideOrgRelation
});

window.addRouter({
    code: "F0521",
    name: "门店上架管理",
    component: StoreGroundingManage
});

window.addRouter({
    code: "F0551",
    name: "门店上架管理",
    component: StoreGroundingManageNew
});

window.addRouter({
    code: "storeGroundingManageCard",
    name: "门店上架信息维护",
    component: StoreGroundingManageCard
});

window.addRouter({
    code: "storeGroundingManageCardNew",
    name: "商家上架信息维护",
    component: StoreGroundingManageCardNew
});

window.addRouter({
    code: "F0522",
    name: "顾问上架管理",
    component: AdviserGroundingManage
});

window.addRouter({
    code: "adviserGroundingManageCard",
    name: "顾问上架信息维护",
    component: AdviserGroundingManageCard
});

window.addRouter({
    code: "F0552",
    name: "顾问上架管理",
    component: AdviserGroundingManageNew
});

window.addRouter({
    code: "adviserGroundingManageCardNew",
    name: "顾问上架信息维护",
    component: AdviserGroundingManageCardNew
});

window.addRouter({
    code: "F0556",
    name: "机构信息（组织信息设置）",
    component: OrganizationSetting
});
window.addRouter({
    code: "F0529",
    name: "企业开通审核",
    component: CompanyOpenAudit
});
window.addRouter({
    code: "companyOpenRefuse",
    name: "企业开通审核拒绝",
    component: CompanyOpenRefuse
});
window.addRouter({
    code: "companyOpenSuccess",
    name: "企业开通审核通过",
    component: CompanyOpenSuccess
});
window.addRouter({
    code: "departmentCard",
    name: "部门编辑功能",
    component: DepartmentCard
});

window.addRouter({
    code: "orgUserCard",
    name: "人员编辑功能",
    component: OrgUserCard
});
window.addRouter({
    code: "F0530",
    name: "审核规则设置",
    component: OrgInformationSetting
});
window.addRouter({
    code: "F0557",
    name: "组织信息管理",
    component: OrgInfoRelation
});
