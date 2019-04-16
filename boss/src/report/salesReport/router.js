/**
 * Created by bj-n126 on 2017/11/21.
 */
import SalesReport from './report.vue'
import Sale from './sale.vue'

window.addRouter({
    code: "F0102",
    name: "销售员报表",
    component: SalesReport
});

window.addRouter({
    code: "F0103",
    name: "销售统计报表",
    component: Sale
});
