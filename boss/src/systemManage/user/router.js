import UserList from "./userList.vue";
import UserAdd from "./userAdd.vue"
import UserEdit from "./userEdit.vue"
import RelevanceOrg from "./relevanceOrg.vue"
import UserListOrg from "./userListOrg.vue"
import userAddOrgList from "./userAddOrg.vue"
import userEditOrgList from "./userEditOrg.vue"
import RelevancePost from "./relevancePost.vue"
import OrgUserCard from "./orgUserCard.vue"


//系统管理员查询列表页
addRouter({
    code: "F0555",
    name: "用户管理", //系统管理员
    component: UserList
});


addRouter({
    code: "userAddList",
    name: "新增用户",
    component: UserAdd
});

addRouter({
    code: "userEditList",
    name: "编辑用户",
    component: UserEdit
});

addRouter({
    code: "RelevanceOrg",
    name: "关联组织",
    component: RelevanceOrg
});


//关联岗位
addRouter({
    code: "RelevancePost",
    name: "关联岗位", //系统管理员
    component: RelevancePost
});

//机构用户信息管理
addRouter({
    code: "OrgUserCard",
    name: "关联岗位", //系统管理员
    component: OrgUserCard
});



