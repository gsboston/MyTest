import Vue from "vue";
import iView from "iview";
import Prompt from "./prompt.vue";

const PromptLoader = function(target, config) {
    let _this = this;
    _this._target = target;
    _this._config = config;
};

PromptLoader.show = function(config) {

    let route = window.getRouter(config.code);
    if(route == null) {
        // iView.Message.info("未查询到code为" + config.code + "的路由");
        console.log("未查询到code为" + config.code + "的路由");
    }

    let result = new PromptLoader(route.component, config);

    result._init();
    result._show();

    return result;

};

PromptLoader.prototype._init = function() {

    let _this = this;

    let instance = new Vue({
        render: function(createElement) {
            return createElement(Prompt, {
                props: _this._config
            });
        },
        methods: {
            remove: function() {
                this.$destroy();
                document.body.removeChild(this.$el);
            }
        }
    });
    let component = instance.$mount();

    _this._component = component;
    _this.container = instance.$children[0];

    _this._render();
};

PromptLoader.prototype._render = function() {

    let _this = this;

    let instance = new Vue({
        render: function(createElement) {
            return createElement(_this._target, {
                props: _this._config.props
            });
        }
    });
    let component = instance.$mount();
    _this.container.render(component.$el);

    _this.content = instance.$children[0];

    _this._initHandle();
};

PromptLoader.prototype._initHandle = function() {
    let _this = this;

    let _callback = function() {
        let _args = Array.prototype.slice.call(arguments);
        _args.push(_this.close.bind(_this));
        if(_this._config.callback) {
            _this._config.callback.apply(_this, _args);
        }
    };
    let _close = function() {
        _this.close();
    };

    _this.content.callback = _callback.bind(_this);
    _this.content.close = _close.bind(_this);
};

PromptLoader.prototype._show = function() {
    document.body.appendChild(this._component.$el);
    this.container.open();
};

PromptLoader.prototype.close = function() {
    this.container.closeSelf();
};

export default PromptLoader;