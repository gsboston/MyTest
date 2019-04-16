<template>
    <div class="container">
        <!--<div class="menu-panel clearFix">-->
            <!--<div class="menu-item" v-for="(item, index) in items" :key="index" :class="{active: item.funcCode == currentCode}" @click="open(item)">{{item.title}}</div>-->
        <!--</div>-->
        <div class="content-panel" ref="content">
            <func-node v-for="(item, index) in items" :key="index" :code="item.funcCode" v-show="item.funcCode == currentCode" :ref="item.funcCode"></func-node>
        </div>
    </div>
</template>

<script>
    import Vue from "vue";
    import "./router";
    const ROUTER_STATUS = "crm_router_status";


    export default {
        data: function() {
            return {
                moduleCode: null,
                items: [],
                currentCode: null
            };
        },
        created () {
            this.$api.init();
        },
        mounted () {
            this.getMenuList();
        },
        methods: {
            getMenuList () {
                this.request({
                    url: "/crm/system/getMenuList.do",
                    param: {
                        moduleCode: "M02"
                    }
                }).then(items => {
                    this.items = items;
                    this.$nextTick(() => {
                        this._open();
                    });
                });
            },
            getOpenedCodes : function() {
                let code = sessionStorage.getItem(ROUTER_STATUS);
                if(code) {
                    this.currentCode = code;
                    return true;
                }
                return false;
            },
            setOpenedCodes: function() {
                if(!this.currentCode) {
                    sessionStorage.removeItem(ROUTER_STATUS);
                    return;
                }
                sessionStorage.setItem(ROUTER_STATUS, this.currentCode);
            },
            _open () {
                let param = this.$route.query;
                if(param.funcCode) {
                    this.currentCode = param.funcCode;
                    if(param.props) {
                        let func = this.$refs[param.funcCode][0];
                        if(func && func.$children) {
                            func = func.$children[0];
                        }
                        if(func.init) {
                            func.init.call(func, JSON.parse(param.props));
                        }
                    }
                }
            }
        },
        watch: {
            "$route" (to, from) {
                this._open();
            }
        }
    }
</script>

<style scoped>
    .container {
        position: relative;
        width: 100%;
        height: 100%;
        background: #f6f6f6;
    }
    .menu-panel {
        position: relative;
        width: 100%;
        height: 40px;
        padding-top: 7px;
        text-align: center;
        background: white;
        border-bottom: solid 1px #e7e9ef;
        box-shadow: 1px 1px 10px rgba(229, 229, 229, .8);
        z-index: 1;
    }
    .menu-item {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 32px;
        margin: 0 30px;
        line-height: 30px;
        color: #333;
        text-align: center;
        background: white;
        cursor: pointer;
        font-size: 13px;
    }
    .menu-item.active {
        color: #59b399;
        background: #fff;
        border-color: #fff;
        border-bottom: solid 2px #59b399;
    }
    .content-panel {
        position: absolute;
        top: 2px;
        /*top: 42px;*/
        left: 0;
        right: 0;
        bottom: 0;
        overflow-x: hidden;
        overflow-y: auto;
    }
</style>
