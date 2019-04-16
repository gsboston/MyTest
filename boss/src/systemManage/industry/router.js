import Industry from "./industry.vue";
import IndustryCard from "./industryCard.vue";

addRouter({
    code: "F0517",
    name: "行业档案维护",
    component: Industry
});

addRouter({
    code: "industryCard",
    name: "新增&修改行业档案",
    component: IndustryCard
});