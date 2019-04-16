import Cms from "./cms.vue";
import Bcqd from "./bcqd.vue";
import Tdk from "./tdk.vue";


addRouter({
  code: "F0904",
  name: "cms管理",
  component: Cms
});
addRouter({
  code: "F0905",
  name: "百城千店管理",
  component: Bcqd
});
addRouter({
  code: "F0906",
  name: "文章TDK管理",
  component: Tdk
});

