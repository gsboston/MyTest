import ConllectionView from "./conllectionView.vue";
import AliPayView from "./aliPayView.vue";
import WechatPayView from "./wechatPayView.vue";
import EditReceiptView from "./editReceiptView.vue";
import CollectionPage from "./collectionPage.vue";


window.addRouter({
    code: "F0304",
    component: CollectionPage
});

window.addRouter({
    code: "collectionView",
    component: ConllectionView
});

window.addRouter({
    code: "aliPayView",
    component: AliPayView
});

window.addRouter({
    code: "wechatPayView",
    component: WechatPayView
});

window.addRouter({
    code: "editReceiptView",
    component: EditReceiptView
});
