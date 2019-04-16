import BDPage from "./bd.vue";
import BDCard from "./bdCard.vue";
import BDGroup from "./bdGroup.vue";
import BDGroupCard from "./bdGroupCard.vue";
import BDItemCard from "./bdItemCard.vue"
import BDServiceCard from "./bdServiceCard.vue"
import BDServicePage from "./bdService.vue";
import ZoneMgr from "./zoneMgr.vue";
import ZoneCard from "./zoneCard.vue";
import AdministrativeArea from "./administrativeArea.vue";
import TrademarkCategory from "./trademarkCategory.vue";
import TrademarkCategoryCard from "./trademarkCategoryCard.vue";

addRouter({
    code: "F0512",
    name: "自定义档案维护",
    component: BDPage
});

addRouter({
    code: "bdCard",
    name: "档案分类卡片",
    component: BDCard
});

addRouter({
    code: "bdItemCard",
    name: "档案项卡片",
    component: BDItemCard
});

addRouter({
    code: "bdServiceCard",
    name: "服务档案卡片",
    component: BDServiceCard
});

addRouter({
    code: "zoneCard",
    name: "战区卡片",
    component: ZoneCard
});

addRouter({
    code: "F0513",
    name: "服务档案维护",
    component: BDServicePage
});

addRouter({
    code: "F0520",
    name: "服务群组维护",
    component: BDGroup
});

addRouter({
    code: "bdGroupCard",
    name: "服务群组卡片",
    component: BDGroupCard
});

addRouter({
    code: "F0514",
    name: "战区管理",
    component: ZoneMgr
});

addRouter({
    code: "F0518",
    name: "行政区划管理",
    component: AdministrativeArea
});

addRouter({
    code: "F0519",
    name: "商标类别管理",
    component: TrademarkCategory
});

addRouter({
    code: "trademarkCategoryCard",
    name: "新增&修改商标类别",
    component: TrademarkCategoryCard
});




