<template>
    <div class="container">
        <div class="center">
            <Row>
                <i-col span="24">
                    <div style="display:inline-block;">
                        <Select class="search-condition" placeholder="全部缴费类型" v-model="type">
                            <Option v-for="(searchConditionInfo,index) in orderType" :key="index" :value="searchConditionInfo.value">{{searchConditionInfo.name}}</Option>
                        </Select>
                    </div>
                    <div style="display: inline-block;margin-left: 4px">
                        <DatePicker v-model="beginTime" clearable class="search-condition-date" type="date" placement="bottom-start" placeholder="不限开始时间"></DatePicker>
                    </div>
                    至
                    <div style="display: inline-block;margin-left: 4px">
                        <DatePicker v-model="endTime" clearable class="search-condition-date" type="date" placement="bottom-end" placeholder="不限截止时间"></DatePicker>
                    </div>
                    <div style="display: inline-block;margin-left: 4px">
                        <Select class="search-condition" placeholder="全部开票状态" v-model="invoiceStatus">
                            <Option v-for="(searchConditionInfo,index) in orderInvoiceStatus" :key="index" :value="searchConditionInfo.value">{{searchConditionInfo.name}}</Option>
                        </Select>
                    </div>
                    <div style="display:inline-block;margin-left: 4px">
                        <Input placeholder="输入用户名称或订单编号进行查询" :maxlength="50" v-model="searchText" class="search-text" style="width: 200px"/>
                    </div>
                    <div style="display: inline-block;margin-left: 4px">
                        <Button style="border-radius: 0" @click="search()">查询</Button>
                    </div>
                </i-col>
            </Row>
            <br/>
            <Table size="small" :data="items" :columns="tableColumns" highlight-row></Table>
            <br/>
            <Page size="small" :total="total" :current="current" :page-size="pageSize" @on-change="changePage"></Page>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                type: '',
                beginTime: '',
                endTime: '',
                invoiceStatus: '',
                searchText: '',
                orderInvoiceStatus: [],
                orderType: [],
                curPage: 1,
                pageSize: 10,
                item: {},
                items: [],
                total: 0,
                current: 1,
                id: null,
                tableColumns: [{
                    title: '订单编号',
                    key: 'orderNo'
                }, {
                    title: '缴费类型', align: 'center', key: 'type', render: (h, params) => {
                        return params.row.typeDict.name;
                    }
                }, {
                    title: '组织名称',
                    key: 'orgName'
                }, {
                    title: '组织类型', align: 'center', key: 'orgType', render: (h, params) => {
                        return params.row.orgTypeDict.name;
                    }
                }, {
                    title: '缴费金额（元）',
                    key: 'payMoney'
                }, {
                    title: '付款时间', align: 'center', key: 'payTime', render: (h, params) => {
                        return window.DateFormat.dateToString(params.row.payTime, 'yyyy-MM-dd HH:mm:ss');
                    }
                }, {
                    title: '开票状态', align: 'center', key: 'invoiceStatus', render: (h, params) => {
                        return params.row.invoiceStatusDict.name;
                    }
                }, {
                    title: '操作',
                    key: 'action',
                    width: 200,
                    align: 'left',
                    render: (h, params) => {
                        if (params.row.notifyStatus != 1) {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.notifyBtn(params);
                                        }
                                    }
                                }, '通知开户'),
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.editBtn(params);
                                        }
                                    }
                                }, '查看详情'),
                            ]);
                        }
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'text',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.editBtn(params);
                                    }
                                }
                            }, '查看详情'),
                        ]);
                    }
                }]
            }
        },
        created: function () {
            this.getDdglList();
            this.getOrderInvoiceStatus();
            this.getOrderType();
        },
        methods: {
            getOrderInvoiceStatus() {
                this.request({
                    url: "/tcgl/getKeyBook.do",
                    param: {
                        type: 'orderInvoiceStatus',
                    }
                }).then(data => {
                    this.orderInvoiceStatus = data;
                });
            },
            getOrderType() {
                this.request({
                    url: "/tcgl/getKeyBook.do",
                    param: {
                        type: 'orderType ',
                    }
                }).then(data => {
                    this.orderType = data;
                });
            },
            getDdglList() {
                if (this.beginTime > this.endTime) {
                    this.$Message.error('开始时间不能大于截止时间');
                    return;
                }
                let beginTime = this.beginTime ? window.DateFormat.dateToString(this.beginTime, 'yyyy-MM-dd HH:mm:ss') : this.beginTime;
                let endTime = this.endTime ? window.DateFormat.dateToString(this.endTime, 'yyyy-MM-dd HH:mm:ss') : this.endTime;
                this.request({
                    url: "/ddgl/getDdglList.do",
                    param: {
                        curPage: this.curPage,
                        pageSize: this.pageSize,
                        type: this.type,
                        beginTime: beginTime,
                        endTime: endTime,
                        invoiceStatus: this.invoiceStatus,
                        searchText: this.searchText
                    }
                }).then(demand => {
                    this.items = demand.records;
                    this.current = demand.current;
                    this.total = demand.total;
                });
            },
            search() {
                this.curPage = 1;
                this.getDdglList();
            },
            changePage(pageIndex) {
                this.curPage = pageIndex;
                this.getDdglList();
            },
            notifyBtn(item) {
                this.request({
                    url: "/ddgl/notifyOrg.do",
                    param: {
                        orderId: item.row.id,
                    }
                }).then(demand => {
                    this.$Message.success('通知成功!');
                    this.getDdglList();
                }, error => {
                    this.$Message.error(error.message);
                });
            },
            editBtn(item) {
                this.prompt({
                    title: '订单详情',
                    code: "ddxq",
                    width: 400,
                    height: 380,
                    props: {
                        item: item.row,
                    },
                    callback: (close) => {
                        close();
                    }
                });
            },
        }
    }
</script>

<style scoped>
    .center {
        position: relative;
        padding: 15px;
    }

    .infoDiv label {
        margin: 0 20px 0 12px;
    }
</style>