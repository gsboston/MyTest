<template>
    <div class="container">
        <div class="center">
            <Row>
                <i-col span="24">
                    <div style="display: inline-block;margin-left: 4px">
                        <DatePicker v-model="beginTime" clearable class="search-condition-date" type="date" placement="bottom-start" placeholder="不限开始时间"></DatePicker>
                    </div>
                    至
                    <div style="display: inline-block;margin-left: 4px">
                        <DatePicker v-model="endTime" clearable class="search-condition-date" type="date" placement="bottom-end" placeholder="不限截止时间"></DatePicker>
                    </div>
                    <div style="display: inline-block;margin-left: 4px">
                        <Select class="search-condition" placeholder="全部发票状态" v-model="invoiceStatus">
                            <Option v-for="(searchConditionInfo,index) in orderInvoiceStatus" :key="index" :value="searchConditionInfo.value">{{searchConditionInfo.name}}</Option>
                        </Select>
                    </div>
                    <div style="display:inline-block;margin-left: 4px">
                        <Input placeholder="输入开票组织名称进行查询" :maxlength="50" v-model="searchText" class="search-text" style="width: 200px"/>
                    </div>
                    <div style="display: inline-block;margin-left: 4px">
                        <Button style="border-radius: 0" @click="search()">查询</Button>
                    </div>
                </i-col>
            </Row>
            <br/>
            <Row>
                <i-col span="24">
                    <span>列表开票申请数量：{{count}}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>列表发票金额：{{money}}元</span>
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
                money: 0,
                count: 0,
                beginTime: '',
                endTime: '',
                invoiceStatus: '',
                searchText: '',
                orderInvoiceStatus: [{"value": "1", 'name': '已申请'}, {"value": "2", "name": "已送出"}],
                orderType: [],
                curPage: 1,
                pageSize: 10,
                item: {},
                items: [],
                total: 0,
                current: 1,
                id: null,
                tableColumns: [{
                    title: '开票组织名称',
                    key: 'orgName'
                }, {
                    title: '税号',
                    key: 'sh'
                }, {
                    title: '申请时间', align: 'center', width: 200, key: 'tsInsert', render: (h, params) => {
                        return window.DateFormat.dateToString(params.row.tsInsert, 'yyyy-MM-dd HH:mm:ss');
                    }
                }, {
                    title: '发票面值',
                    key: 'money'
                }, {
                    title: '发票状态', align: 'center', key: 'status', render: (h, params) => {
                        if (params.row.status == 1) {
                            return '已申请'
                        } else {
                            return '已送出'
                        }
                    }
                }, {
                    title: '快递公司',
                    key: 'expressName'
                }, {
                    title: '快递单号',
                    key: 'trackingNo'
                }, {
                    title: '操作',
                    key: 'action',
                    width: 200,
                    align: 'left',
                    render: (h, params) => {
                        if (this.items[params.index].status != 2) {
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
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.send(params);
                                        }
                                    }
                                }, '发票送出'),
                            ]);
                        } else {
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
                    }
                }]
            }
        },
        created: function () {
            this.getKpglList();
        },
        methods: {
            getKpglList() {
                if (this.beginTime > this.endTime) {
                    this.$Message.error('开始时间不能大于截止时间');
                    return;
                }
                let beginTime = this.beginTime ? window.DateFormat.dateToString(this.beginTime, 'yyyy-MM-dd HH:mm:ss') : this.beginTime;
                let endTime = this.endTime ? window.DateFormat.dateToString(this.endTime, 'yyyy-MM-dd HH:mm:ss') : this.endTime;
                this.request({
                    url: "/kpgl/getKpglList.do",
                    param: {
                        curPage: this.curPage,
                        pageSize: this.pageSize,
                        beginTime: beginTime,
                        endTime: endTime,
                        invoiceStatus: this.invoiceStatus,
                        searchText: this.searchText
                    }
                }).then(demand => {
                    this.count = demand.count;
                    this.money = demand.money;
                    if (demand.page) {
                        this.items = demand.page.records;
                        this.current = demand.page.current;
                        this.total = demand.page.total;
                    } else {
                        this.items = [];
                        this.current = 1;
                        this.total = 0;
                    }
                });
            },
            search() {
                this.curPage = 1;
                this.getKpglList();
            },
            changePage(pageIndex) {
                this.curPage = pageIndex;
                this.getKpglList();
            },
            editBtn(item) {
                this.prompt({
                    title: '查看详情',
                    code: "fpxq",
                    width: 400,
                    height: 520,
                    props: {
                        item: item.row,
                    },
                    callback: (close) => {
                        close();
                        this.getKpglList();
                    }
                });
            },
            send(item) {
                this.prompt({
                    title: '发票送出',
                    code: "kpxq",
                    width: 400,
                    height: 420,
                    props: {
                        item: item.row,
                    },
                    callback: (close) => {
                        close();
                        this.getKpglList();
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