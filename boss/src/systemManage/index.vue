<template>
    <div class="system-manage-container container" id="systemManageIndex">
        <!--<div class="menu-panel">-->
            <!--<Menu mode="vertical" width="100%" accordion @on-select="open">-->

                <!--<template v-for="(item, index) in menuItems">-->

                    <!--<Submenu v-if="item.category" :name="item.code">-->
                        <!--<template slot="title">{{item.title}}</template>-->
                        <!--<Menu-item v-for="(child, index) in item.children" :key="index" :name="child.funcCode" >{{child.title}}</Menu-item>-->
                    <!--</Submenu>-->

                    <!--<Menu-item v-else :name="item.funcCode">{{item.title}}</Menu-item>-->

                <!--</template>-->

            <!--</Menu>-->
        <!--</div>-->
        <div class="content-panel">
            <func-node v-if="funcCode != null" :code="funcCode"></func-node>
            <!--<Tabs class="system-tab" type="card" :animated="false" v-model="currentCode" @on-click="setOpenedCodes" closable @on-tab-remove="close">-->
                <!--<Tab-pane :ref="'content' + item.code" v-for="(item, index) in items" :key="item.code" :name="item.code" :label="item.name" :closable="index > 0">-->
                    <!--<func-node :code="item.code"></func-node>-->
                <!--</Tab-pane>-->
            <!--</Tabs>-->
        </div>
    </div>
</template>

<script>
    import "./router";
    const ROUTER_STATUS = "system_manage_router_status";

    export default {
        data: function() {
            return {
                funcCode: null,
                menuItems: [],
                items: [],
                currentCode: null
            };
        },
        created: function() {
//            this.getMenuList();
            let param = this.$route.query;
            if(param.funcCode) {
                this.open(param.funcCode);
            }
        },
        methods: {
            getMenuList () {
                let index = location.href.indexOf("#/");
                let moduleCode = location.href.substr(index + 2);
                this.request({
                    url: "/systemManage/system/getMenuList.do",
                    param: {
                        moduleCode: moduleCode
                    }
                }).then(items => {
                    this.menuItems = items;
                    if(Array.notEmpty(items) && !this.getOpenedCodes()) {
                        let firstItem = items[0];
                        if(firstItem.isCategory && Array.notEmpty(firstItem.children)) {
                            firstItem = firstItem.children[0];
                        }
                        this.open(firstItem.funcCode);
                    }
                });
            },
            open (code) {
                if(Context.hasResource(code)) {
                    this.funcCode = code;
                }
//                if(!this.switchToOpenedItem(code)) {
//                    this._open(code);
//                }
            },
            close (code) {
                for(let i = 0; i < this.items.length; i++) {
                    if(this.items[i].code == code) {
                        this.items.splice(i, 1);
                        break;
                    }
                }
                this.setOpenedCodes();
            },
            switchToOpenedItem (code) {
                let opened = false;
                for(let i = 0; i < this.items.length; i++) {
                    let _route = this.items[i];
                    if(_route.code == code) {
                        this.currentCode = code;
                        opened = true;
                        this.setOpenedCodes();
                        break;
                    }
                }
                return opened;
            },
            getOpenedCodes () {
                let openedCodes = sessionStorage.getItem(ROUTER_STATUS);
                if(openedCodes == null || openedCodes == "") {
                    return null;
                }else {
                    openedCodes = JSON.parse(openedCodes);
                    if(openedCodes.current == -1) {
                        sessionStorage.removeItem(ROUTER_STATUS);
                        return null;
                    }
                    let codes = openedCodes.codes;
                    for(let code in codes) {
                        this._open(code);
                    }
                    this.currentCode = openedCodes.current;
                }
                return true;
            },
            setOpenedCodes () {
                if(this.currentCode == -1) {
                    sessionStorage.removeItem(ROUTER_STATUS);
                    return;
                }
                let codes = {};
                for(let i = 0; i < this.items.length; i++) {
                    codes[this.items[i].code] = true;
                }
                let openedCodes = {
                    current: this.currentCode,
                    codes: codes
                };
                sessionStorage.setItem(ROUTER_STATUS, JSON.stringify(openedCodes));
            },
            _open (code) {
                let route = getRouter(code);
                if(route) {
                    this.items.push(route);
                    this.currentCode = route.code;
                    this.setOpenedCodes();
                }
            }
        },
        watch: {
            "$route" (to, from) {
                let param = this.$route.query;
                if(param.funcCode) {
                    this.open(param.funcCode);
                }
            }
        }
    }
</script>

<style scoped>
    .system-manage-container {
        position: relative;
        width: 100%;
        height: 100%;
    }
    .container {
        position: relative;
        min-height: 100%;
    }
    .menu-panel {
        position: relative;
        width: 200px;
        height: 100%;
    }
    .menu-panel > .ivu-menu {
        width: 100%;
        height: 100%;
        padding-top: 20px;
    }
    .content-panel {
        position: absolute;
        top: 20px;
        left: 25px;
        /*left: 225px;*/
        right: 25px;
        bottom: 20px;
        background: white;
        border-radius: 0;
        overflow-x: hidden;
        overflow-y: auto;
        box-shadow: 5px 5px 10px #e0e0e0;
    }
    .content-panel > .ivu-tabs {
        width: 100%;
        height: 100%;
    }
</style>

<style>
    #systemManageIndex .ivu-menu-vertical > .ivu-menu-item,
    #systemManageIndex .ivu-menu-vertical > .ivu-menu-submenu > .ivu-menu-submenu-title {
        height: 41px;
        padding: 10px 30px;
        font-weight: bold;
    }
    #systemManageIndex .ivu-menu-vertical > .ivu-menu-item,
    #systemManageIndex .ivu-menu-vertical > .ivu-menu-submenu {
        border-bottom: solid 1px #e5e5e5;
    }
    #systemManageIndex .ivu-menu-vertical > .ivu-menu-submenu .ivu-menu-item {
        height: 41px;
        line-height: 21px;
        padding: 10px 30px 10px 58px;
        font-size: 12px;
    }
    #systemManageIndex .ivu-menu-vertical .ivu-menu-item-active {
        border-right: transparent;
        color: rgb(73, 80, 96);
    }
    #systemManageIndex .ivu-menu-vertical .ivu-menu-submenu > .ivu-menu-submenu-title {
        border-bottom: solid 1px transparent;
    }
    #systemManageIndex .ivu-menu-vertical .ivu-menu-opened > .ivu-menu-submenu-title {
        color: #59b399;
        background: #f7faf9;
        border-bottom: solid 1px #e5e5e5;
    }
    #systemManageIndex .ivu-menu-vertical .ivu-menu-opened > .ivu-menu-submenu-title:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 4px;
        background: #59b399;
    }
    #systemManageIndex .system-tab > .ivu-tabs-bar {
        height: 36px;
        margin: 0;
        border: none;
        background: #f9f9f9;
        color: #333;
    }
    #systemManageIndex .system-tab > .ivu-tabs-bar .ivu-tabs-nav-container {
        height: 36px;
        margin-bottom: 0;
    }
    #systemManageIndex .system-tab > .ivu-tabs-bar .ivu-tabs-nav {
        padding-left: 30px;
    }
    #systemManageIndex .system-tab > .ivu-tabs-bar .ivu-tabs-ink-bar {
        background: transparent;
    }
    #systemManageIndex .system-tab > .ivu-tabs-bar .ivu-tabs-tab {
        height: 38px;
        line-height: 28px;
        margin: 0;
        padding-left: 20px;
        padding-right: 20px;
        border-left: solid 1px transparent;
        border-right: solid 1px transparent;
        border-top: none;
        font-size: 14px;
        color: #333;
    }
    #systemManageIndex .system-tab > .ivu-tabs-bar .ivu-tabs-tab:hover {
        color: #59b399;
    }
    #systemManageIndex .system-tab > .ivu-tabs-bar .ivu-tabs-tab-active {
        background: white;
        border-left-color: #e8e8e8;
        border-right-color: #e8e8e8;
        color: #59b399;
        font-weight: bold;
    }
    #systemManageIndex .system-tab > .ivu-tabs-bar .ivu-tabs-tab-active:before {
        content: "";
        position: absolute;
        top: 0;
        left: -1px;
        right: -1px;
        height: 2px;
        background: #59b399;
    }

    #systemManageIndex .system-tab > .ivu-tabs-content {
        position: absolute;
        top: 36px;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
    }

    #systemManageIndex .system-tab > .ivu-tabs-content > .ivu-tabs-tabpane {
        position: relative;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
    }
</style>