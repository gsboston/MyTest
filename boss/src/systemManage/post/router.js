import PostList from "./postList.vue";
import PostAdd from "./postAdd.vue";
import PostRoleCard from "./postRoleCard.vue";
import PostBatchSetCard from "./postBatchSetCard";

addRouter({
    code: "F0506",
    name: "岗位管理",
    component: PostList
});

addRouter({
    code: "postAdd",
    name: "新增岗位",
    component: PostAdd
});

addRouter({
    code: "postRoleCard",
    name: "岗位角色编辑卡片",
    component: PostRoleCard
});

addRouter({
    code: "postBatchSetCard",
    name: "批量设置岗位",
    component: PostBatchSetCard
});
