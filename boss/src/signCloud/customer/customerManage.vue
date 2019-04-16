<style scoped>
    .container {
        position: relative;
        width: 100%;
        height: 100%;
        background: #f6f6f6;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .header {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 42px;
        padding: 5px 20px;
    }
    .body {
        position: absolute;
        top: 42px;
        left: 20px;
        right: 20px;
        bottom: 20px;
        overflow: hidden;
        border: solid 1px #dddee1;
        background: white;
    }
    .left {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 300px;
        overflow: hidden;
        border-right: solid 1px #dddee1;
    }
    .left > .customer-panel {
        position: absolute;
        top: 50px;
        left: 0;
        right: 0;
        bottom: 35px;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .left > .ivu-page {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 5px;
        padding-top: 5px;
        box-shadow: 0 -2px 4px #dddee1;
    }
    .center {
        position: relative;
        margin-left: 300px;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
    }
    h2 {
        padding: 10px;
    }
    .customer-item {
        position: relative;
        padding: 10px 10px 10px 15px;
        cursor: default;
    }
    .customer-item.active,
    .customer-item:hover {
        background: #f6faf9;
    }
    .customer-item.active:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 3px;
        background: #59b399;
    }
    .customer-item > p {
        height: 24px;
        line-height: 24px;
    }
    .customer-item > p:first-of-type {
        color: black;
        font-size: 14px;
        font-weight: 700;
        overflow: hidden;
    }
    .customer-item > p:last-of-type {
        font-size: 12px;
        color: dimgray;
    }
    .customer-item > p:last-of-type > span:first-of-type {
        float: left;
    }
    .customer-item > p:last-of-type > span:not(:first-of-type) {
        float: right;
    }
    .customer-info {
        padding: 0 30px;
        line-height: 34px;
        font-size: 14px;
    }
    .customer-info>div {
        display: inline-flex;
        width: 100%;
    }
    .customer-info .semantic {
        display: inline-block;
        width: 100px;
        color: black;
    }
    .customer-info .content {
        color: dimgray;
        max-width: 400px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: inline-block;
    }
    .customer-info .customer-type {
        padding: 2px 20px;
    }
    .service-info {
        margin-top: 10px;
        padding: 0 30px;
        line-height: 34px;
        font-size: 14px;
    }
    .service-item {
        display: table;
        width: 100%;
        padding: 20px 0;
    }
    .service-item:nth-child(odd) {
        background: #f2f2f2;
    }
    .service-item > div {
        display: table-cell;
        width: 100px;
        text-align: center;
        vertical-align: middle;
        line-height: 20px;
    }
    .service-item > div:first-of-type {
        font-size: 12px;
        border-right: solid 1px #dddee1;
    }
    .service-item >>> .ivu-btn {
        background: white;
        color: #59b399;
        border-color: #59b399;
        cursor: default;
    }
    .no-change{
        position: relative;
        width: 100%;
        height: auto;
        padding: 300px 80px 145px 60px!important;
        background: #FFF url("../image/no-contract.png") 260px 260px no-repeat;
        text-align: center;
        font-size: 16px;
        font-weight: 600;
    }

    .page-div {
        white-space: nowrap;
    }

    .page-div.ivu-page.mini >>> .ivu-page-item, .page-div.ivu-page.mini >>> .ivu-page-next, .page-div.ivu-page.mini >>> .ivu-page-prev {
        min-width: 18px;
    }

    .page-div >>> .ivu-page-item-jump-next, .page-div >>> .ivu-page-item-jump-prev, .page-div >>> .ivu-page-next, .page-div >>> .ivu-page-prev {
        min-width: 20px;
    }

    .container >>> .ivu-tooltip-inner {
        white-space: normal;
    }
</style>

<template>
    <div class="container">
        <div class="header">
            <Input :maxlength="50" v-model="searchText" style="width: 500px" icon="search" placeholder="客户名称/证件号/联系人/联系电话/客户经理/客户管家" @on-click="getCustomerList(1)" @keyup.native.enter="getCustomerList(1)"></Input>
        </div>
        <div class="body">
            <div class="left">
                <h2 style="box-shadow: 0 2px 4px #dddee1;">客户</h2>
                <div class="customer-panel">
                    <div class="customer-item" v-for="item in customerItems" :class="{active: item === selectedCustomerItem}" @click="selectCustomer(item)">
                        <p>{{item.customerName}}</p>
                        <p>
                            <span>{{item.housekeeperName || '暂无客户管家'}}</span>
                            <span v-if="item.housekeepePhone != null">管家电话：{{item.housekeepePhone}}</span>
                        </p>
                    </div>
                </div>
                <Page class="page-div" style="margin-top: 10px;" size="small" :total="total" :current="page" @on-change="getCustomerList"></Page>
            </div>
            <div class="center">
                <div class="center-panel" v-if="customerItem">
                    <h2>基本信息</h2>
                    <div class="customer-info clearFix">
                        <div>
                            <span class="semantic">客户名称</span>
                            <Tooltip :content="customerItem.customerName" class="item-text" style="height: 24px;vertical-align: bottom;">
                                <span class="content">{{customerItem.customerName}}</span>
                            </Tooltip>
                            <Button class="customer-type" size="small" style="margin-left: 50px;">{{ customerItem.customerType == 'COMPANY' ? '企业' : '自然人' }}</Button>
                        </div>
                        <div>
                            <span class="semantic">证件号码</span>
                            <span class="content">{{customerItem.customerIdNumber}}</span>
                        </div>
                        <div style="float: left; width: 50%;">
                            <span class="semantic">联系人</span>
                            <span class="content">
                                {{customerItem.contactName}}
                                <a href="javascript: void(0)" style="margin-left: 20px; cursor: pointer;" @click="viewContactList">更多</a>
                            </span>
                        </div>
                        <div style="float: left; width: 50%;">
                            <span class="semantic">联系电话</span>
                            <span class="content">{{customerItem.contactPhone}}</span>
                        </div>
                        <div>
                            <span class="semantic">地址</span>
                            <span class="content">{{customerItem.customerAddress}}</span>
                        </div>
                        <div style="float: left; width: 50%;">
                            <span class="semantic">客户管家</span>
                            <span class="content">
                                {{customerItem.housekeeperName}}
                                <Icon style="cursor: pointer; font-size: 16px; margin-left: 20px;" type="compose" @click.native="selectHouseKeeper"></Icon>
                            </span>
                        </div>
                        <div style="float: left; width: 50%;">
                            <span class="semantic">管家电话</span>
                            <span class="content">{{customerItem.housekeepePhone}}</span>
                        </div>
                    </div>
                    <br/>
                    <h2>服务信息</h2>
                    <div class="service-info">
                        <div class="service-item" v-for="item in serviceItems">
                            <div>
                                {{item.billCode}}
                                <br/>
                                服务单号
                            </div>
                            <div>
                                <Button disabled>{{item.billDefName}}</Button>
                            </div>
                            <div>合约：{{item.contractCode}}</div>
                            <div v-if="!item.billServeState || item.billServeState == 'UNSTARTED'">未开始</div>
                            <div v-else-if="item.billServeState == 'SERVING'">服务中</div>
                            <div v-else-if="item.billServeState == 'CUTOUT'">已终止</div>
                            <div v-else>已完成</div>
                            <div style="width: 200px; padding-right: 20px;">客户经理：{{item.cmuserName}}</div>
                            <div style="width: 60px;">
                                <Icon style="font-size: 20px; cursor: pointer;" type="compose" @click.native="selectManager(item)"></Icon>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="no-change" style="height: 100%;">
                    <span>暂无记录</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                searchText: null,
                customerItems: [],
                page: 1,
                total: 0,
                selectedCustomerItem: null,
                customerItem: {},
                serviceItems: []
            };
        },
        created () {
            this.getCustomerList();
        },
        methods: {
            getCustomerList (page = 1) {
                this.get({
                    url: "/signCloud/getCustomerList.do",
                    param: {
                        searchText: this.searchText,
                        page: page
                    }
                }).then(demand => {
                    this.customerItems = demand.data;
                    this.page = demand.page;
                    this.total = demand.total;
                    if(this.customerItems.length > 0) {
                        this.selectCustomer(this.customerItems[0]);
                    }else {
                        this.customerItem = null;
                    }
                });
            },
            selectCustomer (item) {
                this.selectedCustomerItem = item;
                this.getCustomerInfo();
            },
            getCustomerInfo () {
                this.customerItem = Object.assign({}, this.selectedCustomerItem);
                this.getServiceList();
            },
            getServiceList () {
                this.get({
                    url: "/signCloud/getCustomerServiceList.do",
                    param: {
                        customerId: this.customerItem.customerId
                    }
                }).then(data => {
                    this.serviceItems = data;
                });
            },
            selectHouseKeeper () {
                this.prompt({
                    code: "selectManagerForCustomer",
                    callback: (user, close) => {
                        this.request({
                            url: "/signCloud/saveHouseKeeper.do",
                            param: {
                                customerId: this.customerItem.customerId,
                                userId: user.id
                            }
                        }).then(() => {
                            this.$set(this.selectedCustomerItem, "housekeeperName", user.realName);
                            this.$set(this.selectedCustomerItem, "housekeepePhone", user.phone);
                            this.$set(this.customerItem, "housekeeperName", user.realName);
                            this.$set(this.customerItem, "housekeepePhone", user.phone);
                            this.getServiceList();
                        });
                        close();
                    }
                });
            },
            selectManager (item) {
                this.prompt({
                    code: "selectManagerForCustomer",
                    callback: (user, close) => {
                        close();
                        this.request({
                            url: "/signCloud/saveManager.do",
                            param: {
                                billId: item.billId,
                                customerId: this.customerItem.customerId,
                                userId: user.id
                            }
                        }).then(() => {
                            this.getServiceList();
                        });
                    }
                });
            },
            viewContactList () {
                this.prompt({
                    code: "viewContactList",
                    props: {
                        customerId: this.customerItem.customerId
                    }
                });
            }
        }
    };
</script>