import MyCollection from "./myCollection.vue";
import AddClues from "./addClues.vue";
import CommentOn from "./commentOn.vue";

window.addRouter({
    code: "F0202",
    name: "我的收藏",
    component: MyCollection
});

window.addRouter({
    code: "addClues",
    name: "添加线索",
    component: AddClues
});

window.addRouter({
    code: "commentOn",
    name: "发表评论",
    component: CommentOn
});