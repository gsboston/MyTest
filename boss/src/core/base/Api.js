import Vue from "vue";

const Api = function() {};

Api.prototype._router = null;
Api.prototype._moduleCode = null;

Api.prototype.setRouter = function(router) {
    this.constructor.prototype._router = router;
    console.log("setRouter", this);
};

Api.prototype.init = function() {
    let keys = Object.keys(this);
    if(keys) {
        keys.forEach(key => {
            delete this[key];
        });
    }

    let index = location.href.indexOf("#/");
    let end = location.href.indexOf("?");
    this._moduleCode = location.href.substring(index + 2, end > -1 ? end : null);
};

Api.prototype.jump = function(moduleCode, funcCode, props) {
    let _props = (funcCode != null && funcCode.constructor == Object ? funcCode : props);
    let _funcCode = (funcCode == null || funcCode.constructor == Object ? moduleCode : funcCode);
    let _moduleCode = (funcCode == null || funcCode.constructor == Object ? this._moduleCode : moduleCode);
    console.log("jump", this);
    this._router.push({
        path: _moduleCode,
        query: {
            funcCode: _funcCode,
            props: _props != null ? JSON.stringify(_props) : null
        }
    });
};

Api.prototype.addContract = function(defCode, props) {
    Vue.$request({
        url: "/signCloud/contractBuilder/getTypeByDefCode.do",
        param: {
            code: defCode
        }
    }).then(items => {
        if(items.length == 1) {
            let item = items[0];
            this.jump("M03", "contractBuilder", {
                contractType: item.code,
                defId: item.id,
                isEditable: true,
                defaultInfo: props.defaultInfo,
                isInit: true,
                boId: props.boId,
                hxId: props.hxId,
            });
        }else {
            this.jump("M03", "contractSelector", {
                defaultItems: items,
                defaultInfo: props.defaultInfo,
                boId: props.boId,
                hxId: props.hxId,
            });
        }
    });
};

export default new Api();