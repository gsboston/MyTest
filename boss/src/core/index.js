import Axios from "axios";
import "../../core/base/ObjectExtend";
import Context from "./base/Context";
import RequestPool from "./request";
import Prompt from "./component/prompt";
import Card from "./component/card";
import RightPrompt from "./component/right-prompt.vue";
import BSUpload from "./component/upload/upload.vue";
import AutoComp from "./component/auto-comp/auto-comp.vue";
import UploadConfig from "./config/config";
import BSTree from "./component/tree";
import EditTable from "./component/edit-table/canEditTable.vue";
import "./style/global.css";
import DateFormat from "./base/DateFormat";
import Api from "./base/Api";
import Cache from "./base/Cache";

const baseCompList = {
    RightPrompt,
    BSUpload,
    BSTree,
    EditTable,
    AutoComp
};

const baseDirectList = {
};

const baseComp = {
    install: function(Vue){
        window.Context = Vue.prototype.$context = Context;
        window.$Http = RequestPool;
        Vue.$request = Vue.prototype.request = RequestPool.request;
        Vue.$get = Vue.prototype.get = RequestPool.get;
        Vue.$post = Vue.prototype.post = RequestPool.post;
        Vue.$put = Vue.prototype.put = RequestPool.put;
        Vue.$delete = Vue.prototype.delete = RequestPool.delete;

        Vue.$api = Vue.prototype.$api = Api;
        Vue.$cache = Vue.prototype.$cache = Cache;


        window.$Prompt = Prompt;
        Vue.prototype.prompt = Prompt.show;
        Vue.prototype.card = Card.show;
        //用于UPLOAD组件
        Axios.interceptors.request.use(function (config) {    // 这里的config包含每次请求的内容
            if (Context.getToken()) {
                config.headers.token = Context.getToken();
            }
            return config;
        }, function (err) {
            return Promise.reject(err);
        });
        Vue.prototype.$updateConfig = UploadConfig;
        Vue.prototype.axios = Axios;
        //---end
        window.DateFormat = DateFormat;

        Object.keys(baseCompList).forEach((key) => {
            Vue.component(key, baseCompList[key]);
        });
        Object.keys(baseDirectList).forEach((key) => {
            Vue.directive(key, baseDirectList[key]);
        });
    }

};

export default baseComp;
