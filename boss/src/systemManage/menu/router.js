import MenuList from "./menuList.vue";
import MenuCard from "./menuCard.vue";

addRouter({
    code: "F0511",
    name: "菜单管理",
    component: MenuList
});

addRouter({
    code: "50010602",
    name: "新增&修改菜单",
    component: MenuCard
});