<style scoped>
    .menu {
        text-align: center;
    }
    .common-menu-item {
        display: inline-block;
        position: relative;
        margin-right: 10px;
        padding: 0 10px;
        line-height: 50px;
        font-size: 16px;
        font-weight: 600;
        color: #eee;
        cursor: pointer;
    }
    .common-menu-item.current:after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 4px;
        background: #59b399;
    }
    .home-page {
        font-size: 24px;
        position: relative;
        top: 5px;
        left: 30px;
        cursor: pointer;
    }
    .cur-menu-title {
        display: inline-block;
        position: relative;
        margin-right: 20px;
        padding: 0 10px;
        line-height: 50px;
        font-size: 16px;
        font-weight: 600;
        color: #eee;
    }
    .cur-menu-title:after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 4px;
        background: #59b399;
    }
    .all-menu-btn {
        display: inline-block;
        position: relative;
        line-height: 50px;
        font-size: 16px;
        font-weight: 600;
        color: #eee;
        cursor: pointer;
    }
    .all-menu-btn:before {
        content: "";
        display: none;
        position: absolute;
        top: 29px;
        right: 40px;
        width: 16px;
        height: 16px;
        border: solid 8px transparent;
        border-bottom: solid 8px white;
        z-index: 21;
    }
    .navigate-panel {
        position: absolute;
        top: 45px;
        right: 0;
        width: auto;
        padding: 10px;
        background: white;
        border-radius: 3px;
        box-shadow: 1px 1px 5px #59b399;
        cursor: default;
        display: none;
        z-index: 20;
    }
    .all-menu-btn.active:before {
        display: block;
    }
    .all-menu-btn.active > .navigate-panel {
        display: block;
    }
    .module-panel {
        float: left;
        width: 140px;
    }
    .module-panel:not(:last-of-type) {
        margin-right: 20px;
    }
    .module-panel > .title {
        margin-bottom: 10px;
        padding-left: 15px;
        line-height: 30px;
        font-size: 15px;
        color: #333;
        text-align: left;
        border-bottom: solid 2px #aaa;
    }
    .menu-item {
        width: 140px;
        padding-left: 15px;
        line-height: 36px;
        font-size: 14px;
        color: #666;
        font-weight: 500;
        text-align: left;
        cursor: pointer;
    }
    .menu-item:hover {
        background: #59b399;
        border-radius: 5px;
        color: white;
    }
    .menu-item > .ivu-icon {
        float: right;
        color: transparent;
        font-size: 16px;
        margin-top: 10px;
        margin-right: 7px;
    }
    .menu-item:hover > .ivu-icon {
        color: white;
    }
    .menu-item.collection > .ivu-icon {
        color: orange;
    }

    .module-panel.double-width {
        width: 280px;
    }
    .module-panel.double-width > .menu-item {
        float: left;
    }
    .spotNews{
        background: red;
        position: absolute;
        top: 6px;
        right: -20px;
        min-width: 18px;
        height: 18px;
        border-radius: 50%;
        font-size: 12px;
        line-height: 18px;
        text-align: center;
        color: #fff;
    }
    .messageList li{
        border-bottom: 1px solid #e3e8ee;
        padding: 4px;
        margin-top: 2px;
    }
    .messageList li p{
        width: 80%;
        float: left;
    }
    .messageList li span{
        float: right;
    }
    .messageList li i{
        width: 6px;
        height: 6px;
        background: red;
        display: block;
        float: right;
        border-radius: 3px;
        margin-left: 4px;
    }
</style>

<template>
    <div class="portal">
        <div class="header">
            <!--<div class="logo">神州顺利办业务管理系统</div>-->
            <div class="logo">
                <img src="./image/boss_logo_white.png" @click="setHomePageMenu" style="cursor: pointer">
                <!--<span>顺利办云管家</span>-->
                <span>{{envName}}</span>
                <Icon type="home" class="home-page" @click.native="setHomePageMenu"></Icon>
            </div>
            <div class="menu">
                <!--<Menu mode="horizontal" :active-name="activeName" ref="menu">-->
                    <!--<Menu-item v-for="item in moduleItems" :key="item.id" :name="item.code" @click.native="jump(item)">-->
                        <!--<Icon :type="item.icon"></Icon>-->
                        <!--{{item.name}}-->
                    <!--</Menu-item>-->
                <!--</Menu>-->
                <div class="common-menu-item" :class="{current: item === curCommonItem}" v-for="item in commonItems" @click="openFunc(item)">{{item.name}}</div>
                <div class="cur-menu-title" v-show="curMenuTitle != null">{{curMenuTitle}}</div>
                <div class="all-menu-btn" :class="{active: navigateShow}" @mouseenter="showNavigatePanel" @mouseleave="hideNavigatePanel">
                    菜单
                    <Icon type="chevron-down"></Icon>
                    <div class="navigate-panel" :style="navigatePanelStyle" v-show="true || navigateShow">
                        <div class="module-panel" v-for="(module, index) in navigateItems" :key="index" :class="{'double-width': module.children.length > 8}">
                            <div class="title">{{module.name}}</div>
                            <div class="menu-item" :class="{collection: menu.collection}" v-for="(menu, index) in module.children" :key="index" @click.self="openFunc(menu)">
                                {{menu.name}}
                                <Icon type="star" @click.native.stop="collectMenu(menu)"></Icon>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="header-right cleafFix">
                <div class="user-info">
                    <Dropdown trigger="click" style="cursor: pointer;">
                        {{userName}}
                        <div class="spotNews" @click="messageModalShow($event)" v-show="unReadMessageDataTotal">{{unReadMessageDataTotal}}</div>
                        <Icon type="chevron-down" style="font-size: 12px; margin-left: 3px;"></Icon>
                        <DropdownMenu slot="list">
                            <DropdownItem @click.native="messageModalShow($event)">消息中心</DropdownItem>
                            <DropdownItem @click.native="jumpSystemPage('userInfo')">个人信息</DropdownItem>
                            <DropdownItem @click.native="jumpSystemPage('changePassword')">修改密码</DropdownItem>
                            <DropdownItem @click.native="jumpSystemPage('changePhone')">修改手机号</DropdownItem>
                            <DropdownItem v-if="env != 'PRODUCTION'">
                                <a href="#/swagger">查看Swagger文档</a>
                            </DropdownItem>
                            <DropdownItem @click.native="jumpSystemPage('HelpCenter')">帮助中心</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <span style="margin-left: 5px;">|</span>
                </div>
                <div class="org-info" @mouseleave="hideOrgSelector">
                    <span @click="triggleOrgSelector" :style="{cursor: singleOrgMode ? 'default' : 'pointer'}">{{orgName}}</span>
                    <Icon type="chevron-down" @click.native="triggleOrgSelector" v-if="!singleOrgMode"></Icon>
                    <div class="org-selector" :class="{active: selectOrgMode}">
                        <h3>请选择要切换的机构</h3>
                        <div class="org-item" v-for="(item, index) in orgItems" :key="index" @click="switchOrg(item)">{{item.name}}</div>
                    </div>
                </div>
                <div class="logout" @click="logout">
                    <Icon type="log-out"></Icon>
                </div>
            </div>
        </div>
        <!--消息列表-->
        <Modal v-model="messageListShow" width="760">
            <p slot="header">
                <span>消息</span>
            </p>
            <div class="messageList" style="padding: 4px;">
                <template>
                    <Tabs active-key="key1"  type="card">
                        <Tab-pane label="未读消息" key="key1">
                            <ul>
                                <li class="clearFix" v-for="item  in unReadMessageData" @click="messageDetails(item,1)">
                                    <p>{{item.title}}</p>
                                    <span>{{item.tsInsert | formatDate}}</span>
                                </li>
                                <li class="clearFix" v-if="unReadMessageData.length==0" @click="messageDetails(item,1)">
                                    <p>暂无未读消息</p>
                                </li>
                            </ul>
                            <Page v-if="unReadMessageData.length>0" style="margin-top: 10px" size="small" :total="unReadMessageDataTotal" :current="unReadMessageDataPage" @on-change="changeUnReadMessageDataPage"></Page>

                        </Tab-pane>
                        <Tab-pane label="已读消息" key="key2">
                            <ul>
                                <li class="clearFix" v-for="item  in readMessageData" @click="messageDetails(item,2)">
                                    <p>{{item.title}}</p>
                                    <span>{{item.tsInsert | formatDate}}</span>
                                </li>
                                <li class="clearFix" v-if="readMessageData.length==0" @click="messageDetails(item,2)">
                                    <p>暂无已读消息</p>
                                </li>
                            </ul>
                            <Page v-if="readMessageData.length>0" style="margin-top: 10px" size="small" :total="readMessageDataTotal" :current="readMessageDataPage" @on-change="changeReadMessageDataPage"></Page>
                        </Tab-pane>
                    </Tabs>
                </template>
            </div>
            <div slot="footer" style="text-align: center;"></div>
        </Modal>
        <!--消息详情-->
        <Modal v-model="messageDetailsShow" width="560">
            <p slot="header">
                <span>消息</span>
            </p>
            <div class="messageList" style="padding: 4px;">
                <h3>{{detailTitle}}</h3>
                <p>{{detailContent}}</p>
            </div>
            <div slot="footer" style="text-align: center;"></div>
        </Modal>
        <div class="body">
            <router-view></router-view>
        </div>
    </div>
</template>

<script type="text/javascript">
    import HomePage from "./system/homepage/homepage.vue";
    export default {
        components : {
            HomePage
        },
        filters: {
            formatDate(time) {
                var date = new Date(time);
                return date.format('yyyy-MM-dd hh:mm');
            }
        },
        data () {
            return {
                moduleItems: [],
                activeName: null,
                userName: null,
                orgName: null,
                selectOrgMode: false,
                orgItems: [],
                singleOrgMode: true,
                navigateItems: [],
                commonItems: [],
                curCommonItem: null,
                navigateShow: false,
                curMenuTitle: null,
                env: "PRODUCTION",
                envName: null,
                messageListShow:false,
                readMessageData:[],
                readMessageDataPage:1,
                readMessageDataTotal:0,
                unReadMessageData:[],
                unReadMessageDataPage:1,
                unReadMessageDataTotal:0,
                messageDetailsShow:false,
                detailTitle:null,
                detailContent:null
            };
        },
        created () {
            window._portal = this;
            this.userName = window.Context.getCurrentUser().realName;
            this.orgName = window.Context.getCurrentOrganization().name;
//            this.getModuleList();
            this.getEnv();
            this.getOrgList();
            this.getUnReadMessageData();
            this.navigateItems = Context._portalMenus;
            this.commonItems = Context._commonMenus;
            let param = this.$route.query;
            if(param && param.funcCode) {
                this.setCurMenu();
            }else {
                this.setHomePageMenu();
//                let module = this.navigateItems[0];
//                let menu = module.children[0];
//                this.openFunc(menu);
            }
        },
        methods: {
            getModuleList () {
                this.request({
                    url: "/system/getModuleList.do"
                }).then(items => {
                    this.moduleItems = items;
                    this.initCurrentModule();
                });
            },
            getOrgList () {
                this.request({
                    url: "/system/getBindOrgList.do"
                }).then(items => {
                    this.orgItems = items;
                    if(items.length > 1) {
                        this.singleOrgMode = false;
                    }
                });
            },
            initCurrentModule () {
                let index = location.href.indexOf("#/");
                let activeName = "";
                if(index > -1) {
                    activeName = location.href.substr(index + 2);
                }else if(Array.notEmpty(this.moduleItems)) {
                    activeName = this.moduleItems[0].code;
                }
                this.$nextTick(function() {
                    this.activeName = activeName;
                    if(Object.notNull(this.$refs.menu)) {
                        this.$refs.menu.updateActiveName();
                    }
                });
            },
            jump (item) {
                window._frameRouter.push(item.code);
            },
            jumpSystemPage (code) {
                window._frameRouter.push(code);
            },
            showNavigatePanel () {
                this.navigateShow = true;
            },
            hideNavigatePanel () {
                this.navigateShow = false;
            },
            openFunc (menu) {
                this.$router.push({
                    path: menu.moduleCode,
                    query: {
                        funcCode: menu.funcCode
                    }
                });
                this.hideNavigatePanel();
            },
            collectMenu (menu) {
                if(!menu.collection && this.commonItems.length > 2) {
                    this.$Message.info("常用菜单数量不能超过3个～");
                    return;
                }
                let url = "/portal/menu/collection/save.do";
                if(menu.collection) {
                    url = "/portal/menu/collection/remove.do";
                }
                this.request({
                    url: url,
                    param: {
                        menuId: menu.id
                    }
                }).then(() => {
                    menu.collection = !menu.collection;
                    if(menu.collection) {
                        this.commonItems.push(menu);
                    }else {
                        let index = this.commonItems.indexOf(menu);
                        this.commonItems.splice(index, 1);
                    }
                    this.setCurMenu();
                });
            },
            setHomePageMenu () {
                this.curCommonItem = null;
                this.curMenuTitle = null;
                this.$router.push("/");
            },
            setCurMenu () {
                let param = this.$route.query;
                if(!param.funcCode) {
                    return;
                }
                let funcCode = param.funcCode;
                let isCommon = false;
                for(let i = 0; i < this.commonItems.length; i++) {
                    let commonItem = this.commonItems[i];
                    if(commonItem.funcCode == funcCode) {
                        isCommon = true;
                        this.curMenuTitle = null;
                        this.curCommonItem = commonItem;
                        break;
                    }
                }
                if(!isCommon) {
                    this.curCommonItem = null;
                    this.curMenuTitle = Context.getMenuName(funcCode);
                }
            },
            triggleOrgSelector () {
                if(this.singleOrgMode) {
                    return;
                }
                this.selectOrgMode = !this.selectOrgMode;
            },
            hideOrgSelector () {
                this.selectOrgMode = false;
            },
            switchOrg (item) {
                sessionStorage.removeItem("crm_router_status");
                sessionStorage.removeItem("sign_cloud_router_status");
                sessionStorage.removeItem("system_manage_router_status");
                this.request({
                    url: "/system/switchOrg.do",
                    param: {
                        id: item.id,
                        name: item.name
                    }
                }).then(() => {
                    location.href = location.origin;
                });
            },
            getEnv () {
                this.request({
                    url: "/portal/getEnv.do"
                }).then(data => {
                    this.env = data.env;
                    this.envName = data.envName;
                });
            },
            logout () {
                this.request({
                    url: "/system/logout.do"
                }).then(() => {
                    sessionStorage.removeItem("crm_router_status");
                    sessionStorage.removeItem("sign_cloud_router_status");
                    sessionStorage.removeItem("system_manage_router_status");
                    Context.logout();
                    window._frameRouter.push("/login");
                }, error => {
                    if(error.status != 100) {
                        this.$Notice.error({
                            desc: "系统异常，请稍后再试",
                            duration: 3
                        });
                    }
                    window._frameRouter.push("/login");
                });
            },
            getReadMessageData () {
                this.request({
                    url: "/system/getMessageListHaveRead.do",
                    param:{
                        page:this.readMessageDataPage,
                        size:10,
                        type:1,
                        userType:1
                    }
                }).then(data => {
                    if(data){
                        this.readMessageData = data.records;
                        this.readMessageDataTotal = data.total;
                    }else{
                        this.readMessageData = [];
                        this.readMessageDataTotal = 0;
                    }
                });
            },
            getUnReadMessageData () {
                this.request({
                    url: "/system/getMessageListUnRead.do",
                    param:{
                        page:this.unReadMessageDataPage,
                        size:10,
                        type:1,
                        userType:1
                    }
                }).then(data => {
                    if(data){
                        this.unReadMessageData = data.records;
                        this.unReadMessageDataTotal = data.total;
                    }else{
                        this.unReadMessageData = [];
                        this.unReadMessageDataTotal = 0;
                    }
                });
            },
            setMessage (id) {
                this.request({
                    url: "/system/setMessage.do",
                    param:{
                        id:id,
                        type:1,
                        userType:1
                    }
                }).then(data => {
                    this.messageDetailsShow = true;
                    this.getUnReadMessageData();
                    this.getReadMessageData();
                });
            },
            messageDetails (item,n) {
                if(n==1){
                    this.setMessage(item.id);
                }else{
                    this.messageDetailsShow = true;
                    this.getReadMessageData();
                }
                this.detailContent = item.content;
                this.detailTitle = item.title;
            },
            messageModalShow (event){
                event.cancelBubble = true;
                this.messageListShow = true;
                this.getReadMessageData();
                this.getUnReadMessageData();
            },
            changeReadMessageDataPage (pageIndex) {
                this.readMessageDataPage = pageIndex;
                this.getReadMessageData();
            },
            changeUnReadMessageDataPage (pageIndex) {
                this.unReadMessageDataPage = pageIndex;
                this.getUnReadMessageData();
            },
        },
        computed: {
            navigatePanelStyle () {
                let style = {};
                if(Array.notEmpty(this.navigateItems)) {
                    let width = 10;
                    this.navigateItems.forEach(item => {
                        if(item.children.length > 8) {
                            width += 300;
                        }else {
                            width += 160;
                        }
                    });
                    style.width = width + "px";
                    style.left = "-" + (width / 2) + "px";
                }
                return style;
            }
        },
        watch: {
            "$route" (to, from) {
                this.setCurMenu();
            }
        }
    };
</script>

<style scoped>
    .portal {
        position: relative;
        width: 100%;
        height: 100%;
        background: #f6f6f6;
    }
    .header {
        position: relative;
        width: 100%;
        height: 50px;
        background: #404356;
    }

    .header > .logo {
        float: left;
        width: 310px;
        height: 100%;
        margin-left: 10px;
        padding: 0;
        line-height: 50px;
        color: white;
        /*background: url("./image/boss_logo_white.png") left center  no-repeat;*/
        /*text-align: right;*/
    }
    .header > .logo > img {
        width: auto;
        height: 32px;
        vertical-align: middle;
    }
    /*.header > .logo > span:first-of-type {*/
        /*margin-left: 5px;*/
        /*font-size: 20px;*/
        /*line-height: 50px;*/
        /*font-weight: bold;*/
        /*vertical-align: middle;*/
    /*}*/
    .header > .logo > span {
        font-size: 14px;
        line-height: 50px;
        vertical-align: middle;
    }

    .header > .menu {
        /*position: absolute;*/
        /*top: 0;*/
        /*left: 280px;*/
        /*right: 400px;*/
        /*bottom: 0;*/
        width: 700px;
        height: 100%;
        margin: 0 auto;
    }
    .header > .menu > .ivu-menu {
        height: 100%;
        line-height: 50px;
        background: transparent;
    }
    .header > .menu > .ivu-menu:after {
        background: transparent;
    }

    .header > .header-right {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
    }
    .header > .header-right > .user-info {
        position: relative;
        float: left;
        height: 100%;
        padding-right: 10px;
        line-height: 50px;
        color: #ddd;
        font-size: 13px;
        font-weight: bold;
    }
    .header > .header-right > .user-info >>> .ivu-dropdown-rel:hover {
         color: white;
     }
    .header >>> .ivu-select-dropdown {
        margin-top: -10px;
    }
    .spotNewsList >>> .ivu-select-dropdown {
        margin-top: 0;
        max-height: 200px;
        overflow-y: scroll;
    }
    .header > .header-right > .org-info {
        position: relative;
        float: left;
        height: 100%;
        padding-right: 15px;
        line-height: 50px;
        color: #ddd;
        font-size: 13px;
        font-weight: bold;
    }
    .header > .header-right > .org-info > span {
        max-width: 150px;
        vertical-align: middle;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .header > .header-right > .org-info:hover {
        color: white;
    }
    .header > .header-right > .org-info > .ivu-icon {
        padding-left: 3px;
        /*margin-left: 10px;*/
        font-size: 12px;
        cursor: pointer;
    }
    .header > .header-right > .org-info > .org-selector {
        position: absolute;
        top: 40px;
        right: 10px;
        width: 300px;
        height: 0;
        background: white;
        box-shadow: 5px 5px 10px rgba(229, 229, 229, .8);
        border-radius: 5px;
        transition: height .1s ease;
        overflow: hidden;
        z-index: 100;
    }
    .header > .header-right > .org-info > .org-selector:after {
        content: "";
        position: absolute;
        top: 20px;
        width: 8px;
        height: 8px;
        border: solid 4px transparent;
        border-bottom: gray;
    }
    .header > .header-right > .org-info > .org-selector.active {
        height: 200px;
        border: solid 1px #e8e8e8;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .header > .header-right > .org-info > .org-selector > h3 {
        position: relative;
        padding: 10px 10px 5px 10px;
        margin-bottom: 5px;
        line-height: 20px;
        font-size: 13px;
        color: #888;
    }
    .header > .header-right > .org-info > .org-selector > h3:after {
        content: "";
        position: absolute;
        left: 7px;
        right: 7px;
        bottom: 0;
        height: 1px;
        background: #e8e8e8;

    }
    .header > .header-right > .org-info > .org-selector > .org-item {
        line-height: 1.5;
        padding: 5px 10px;
        color: #666;
        cursor: pointer;
    }
    .header > .header-right > .org-info > .org-selector > .org-item:hover {
        background: #e8e8e8;
    }

    .header > .header-right > .logout {
        position: relative;
        float: right;
        width: 35px;
        height: 100%;
        padding: 15px 10px 15px 10px;
        cursor: pointer;
    }

    .header > .header-right > .logout > .ivu-icon {
        font-size: 20px;
        font-weight:200;
        color: #aaa;
        cursor: pointer;
    }
    .header > .header-right > .logout:before {
        content: "";
        position: absolute;
        top: 15px;
        left: 0;
        bottom: 15px;
        width: 1px;
        background: #e8e8e8;
    }
    .header > .header-right > .logout:hover > .ivu-icon {
        color: #bbb;
    }

    .body {
        position: absolute;
        top: 50px;
        left: 0;
        right: 0;
        bottom: 0;
    }
    .header >>> .ivu-menu-item {
        font-size: 16px;
        font-weight: bold;
        color: #aaa;
    }
    .header >>> .ivu-menu-item:hover {
        border-bottom: transparent;
        color: #fff;
    }
    .header >>> .ivu-menu-item-active {
        border-bottom-color: #404356;
        color: #fff;
    }
</style>