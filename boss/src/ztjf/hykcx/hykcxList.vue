<template>
    <div class="container">
        <div class="center">
            <Row>
                <i-col span="24">
                    <div style="display:inline-block;width: 100px">
                        <Select v-model="item.type" placeholder="选择卡类型">
                            <Option v-for="level in typeList" :value="level.value" :key="level.value">{{ level.name }}</Option>
                        </Select>
                    </div>
                    <div style="display:inline-block;margin-left: -4px;width: 140px">
                        <Input v-model="item.name" placeholder="输入卡名称" :maxlength="20"/>
                    </div>
                    <div style="display: inline-block;margin-left: 4px">
                        <Input v-model="item.minNo" placeholder="起始卡号"/>
                    </div>
                    至
                    <div style="display: inline-block;margin-left: 4px">
                        <Input v-model="item.maxNo" placeholder="截止卡号"/>
                    </div>
                    <div style="display: inline-block;margin-left: 4px">
                        <DatePicker v-model="startTime" clearable class="search-condition-date" type="date" placement="bottom-start" placeholder="开始时间"></DatePicker>
                    </div>
                    至
                    <div style="display: inline-block;margin-left: 4px">
                        <DatePicker v-model="endTime" clearable class="search-condition-date" type="date" placement="bottom-end" placeholder="截止时间"></DatePicker>
                    </div>
                    <div style="display:inline-block;margin-left: 4px;">
                        <auto-comp
                                ref="searchName"
                                v-model="searchName"
                                icon="ios-search"
                                placeholder="输入派发目标机构名称"
                                @on-search="searchList"
                                @on-select="getOrg"
                                style="width:200px;">
                            <Option v-for="option in searchResult" :value="option.name" :key="option.id">
                                {{option.name}}
                            </Option>
                        </auto-comp>
                    </div>
                    <div style="display: inline-block;margin-left: 4px">
                        <Button style="border-radius: 0" @click="search()">查询</Button>
                    </div>
                </i-col>
            </Row>
            <br/>
            <Row>
                <i-col span="24">
                    <ButtonGroup>
                        <Button :type="state==0?'primary':'ghost'" @click="searchCard(0)">卡号</Button>
                        <Button :type="state==1?'primary':'ghost'" @click="searchCard(1)">制卡中</Button>
                        <Button :type="state==2?'primary':'ghost'" @click="searchCard(2)">已制卡</Button>
                        <Button :type="state==3?'primary':'ghost'" @click="searchCard(3)">已派卡</Button>
                        <Button :type="state==4?'primary':'ghost'" @click="searchCard(4)">已开卡</Button>
                    </ButtonGroup>
                    <RadioGroup v-if="state==3" v-model="payState" @on-change="searchCard(3)">
                        <Radio label="">全部</Radio>
                        <Radio label="1">已收款{{receive}}元</Radio>
                        <Radio label="0">未收款{{unReceive}}元</Radio>
                    </RadioGroup>
                    <span v-if="state==0" style="float: right">列表卡号：{{total}}个&nbsp;&nbsp;&nbsp;&nbsp;<span><Button type="primary"
                                                                                                                    @click="deleteCardNo()">删除列表卡号</Button></span></span>
                    <span v-if="state==1" style="float: right">列表卡：{{total}}张&nbsp;&nbsp;&nbsp;&nbsp;<span><Button type="primary"
                                                                                                                   @click="cancelPrint()">取消列表制卡</Button></span></span>
                    <span v-if="state==2||state==4" style="float: right">列表卡：{{total}}张</span>
                    <span v-if="state==3" style="float: right">列表卡：{{total}}张&nbsp;&nbsp;&nbsp;&nbsp;<span><Button type="primary"
                                                                                                                   @click="gathering()">列表标记收款</Button></span></span>
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
                state: 0,
                startTime: '',
                endTime: '',
                payState: '',
                unReceive: '',
                receive: '',
                searchName: '',
                searchResult: [],
                typeList: {},
                invoiceStatus: '',
                orderType: [],
                curPage: 1,
                pageSize: 10,
                item: {},
                items: [],
                total: 0,
                current: 1,
                id: null,
                tableColumns: '',
                tableColumns0: [{
                    title: '卡号',
                    key: 'card_no'
                }, {
                    title: '卡名称',
                    key: 'name'
                }, {
                    title: '卡类型',
                    key: 'typeName'
                }, {
                    title: '操作人',
                    key: 'creatorName'
                }, {
                    title: '卡号生成时间', align: 'center', key: 'ts_insert', render: (h, params) => {
                        return window.DateFormat.dateToString(params.row.ts_insert, 'yyyy-MM-dd HH:mm:ss');
                    }
                }, {
                    title: '操作',
                    key: 'action',
                    width: 200,
                    align: 'left',
                    render: (h, params) => {
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
                                        this.infoBtn(params);
                                    }
                                }
                            }, '查看详情'),
                        ]);

                    }
                }],
                tableColumns1: [{
                    title: '卡号',
                    key: 'card_no'
                }, {
                    title: '卡名称',
                    key: 'name'
                }, {
                    title: '卡类型',
                    key: 'typeName'
                }, {
                    title: '操作人',
                    key: 'creatorName'
                }, {
                    title: '制卡时间', align: 'center', key: 'ts_insert', render: (h, params) => {
                        return window.DateFormat.dateToString(params.row.ts_insert, 'yyyy-MM-dd HH:mm:ss');
                    }
                }, {
                    title: '操作',
                    key: 'action',
                    width: 200,
                    align: 'left',
                    render: (h, params) => {
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
                                        this.infoBtn(params);
                                    }
                                }
                            }, '查看详情'),
                        ]);

                    }
                }],
                tableColumns2: [{
                    title: '卡号',
                    key: 'card_no'
                }, {
                    title: '卡名称',
                    key: 'name'
                }, {
                    title: '卡类型',
                    key: 'typeName'
                }, {
                    title: '操作人',
                    key: 'creatorName'
                }, {
                    title: '入库时间', align: 'center', key: 'ts_insert', render: (h, params) => {
                        return window.DateFormat.dateToString(params.row.ts_insert, 'yyyy-MM-dd HH:mm:ss');
                    }
                }, {
                    title: '操作',
                    key: 'action',
                    width: 200,
                    align: 'left',
                    render: (h, params) => {
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
                                        this.infoBtn(params);
                                    }
                                }
                            }, '查看详情'),
                        ]);

                    }
                }],
                tableColumns3: [{
                    title: '卡号',
                    key: 'card_no'
                }, {
                    title: '卡名称',
                    key: 'name'
                }, {
                    title: '卡类型',
                    key: 'typeName'
                }, {
                    title: '操作人',
                    key: 'creatorName'
                }, {
                    title: '派卡时间', align: 'center', key: 'distributeTime', render: (h, params) => {
                        return window.DateFormat.dateToString(params.row.ts_insert, 'yyyy-MM-dd HH:mm:ss');
                    }
                }, {
                    title: '目标机构',
                    key: 'recieveOrgName'
                }, {
                    title: '领卡人',
                    key: 'reciever'
                }, {
                    title: '收款',
                    key: 'unit_price'
                }, {
                    title: '操作',
                    key: 'action',
                    width: 200,
                    align: 'left',
                    render: (h, params) => {
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
                                        this.infoBtn(params);
                                    }
                                }
                            }, '查看详情'),
                        ]);

                    }
                }],
                tableColumns4: [{
                    title: '卡号',
                    key: 'card_no'
                }, {
                    title: '卡名称',
                    key: 'name'
                }, {
                    title: '卡类型',
                    key: 'typeName'
                }, {
                    title: '开卡人',
                    key: 'creatorName'
                }, {
                    title: '开卡机构',
                    key: 'bindOrgName'
                }, {
                    title: '开卡时间', align: 'center', key: 'ts_insert', render: (h, params) => {
                        return window.DateFormat.dateToString(params.row.ts_insert, 'yyyy-MM-dd HH:mm:ss');
                    }
                }, {
                    title: '操作',
                    key: 'action',
                    width: 200,
                    align: 'left',
                    render: (h, params) => {
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
                                        this.infoBtn(params);
                                    }
                                }
                            }, '查看详情'),
                        ]);

                    }
                }]
            }
        },
        created: function () {
            this.tableColumns = this.tableColumns0;
            this.item.state = 0;
            this.getCardType();
            this.getHykcxList();
        },
        methods: {
            searchCard(state) {
                this.state = state;
                this.item.state = state;
                if (state == 0) {
                    this.tableColumns = this.tableColumns0;
                }
                if (state == 1) {
                    this.tableColumns = this.tableColumns1;
                }
                if (state == 2) {
                    this.tableColumns = this.tableColumns2;
                }
                if (state == 3) {
                    this.tableColumns = this.tableColumns3;
                }
                if (state == 4) {
                    this.tableColumns = this.tableColumns4;
                }
                this.search();
            },
            deleteCardNo() {
                this.prompt({
                    title: '卡号删除确认',
                    code: "delkh",
                    width: 400,
                    height: 380,
                    props: {
                        item: this.item,
                    },
                    callback: (close) => {
                        close();
                        this.getHykcxList();
                    }
                });
            },
            cancelPrint() {
                this.prompt({
                    title: '制卡取消确认',
                    code: "delzk",
                    width: 400,
                    height: 380,
                    props: {
                        item: this.item,
                    },
                    callback: (close) => {
                        close();
                        this.getHykcxList();
                    }
                });
            },
            gathering() {
                this.prompt({
                    title: '派卡收款确认',
                    code: "delsk",
                    width: 400,
                    height: 380,
                    props: {
                        item: this.item,
                    },
                    callback: (close) => {
                        close();
                        this.getHykcxList();
                    }
                });
            },
            getCardType() {
                this.request({
                    url: "/tcgl/getKeyBook.do",
                    param: {
                        type: 'cardType',
                    }
                }).then(data => {
                    this.typeList = data;
                });
            },
            getHykcxList() {
                if (this.item.startTime > this.item.endTime) {
                    this.$Message.error('开始时间不能大于截止时间');
                    return;
                }
                let startTime = this.startTime ? window.DateFormat.dateToString(this.startTime, 'yyyy-MM-dd HH:mm:ss') : this.startTime;
                let endTime = this.endTime ? window.DateFormat.dateToString(this.endTime, 'yyyy-MM-dd HH:mm:ss') : this.endTime;
                this.item.page = this.curPage;
                this.item.size = this.pageSize;
                this.item.startTime = startTime;
                this.item.endTime = endTime;
                this.item.payState = this.payState;
                if (!this.searchName) {
                    this.item.recieveId = '';
                }
                this.request({
                    url: "/hykgl/searchCardsPage.do",
                    data: this.item,
                }).then(demand => {
                    if (demand.list) {
                        this.items = demand.list.records;
                        this.current = demand.list.current;
                        this.total = demand.list.total;
                        if (demand.unReceive) {
                            this.unReceive = demand.unReceive;
                            this.receive = demand.receive;
                        }
                    } else {
                        this.items = [];
                        this.current = 1;
                        this.total = 0;
                    }
                });
            },
            search() {
                this.curPage = 1;
                this.getHykcxList();
            },
            changePage(pageIndex) {
                this.curPage = pageIndex;
                this.getHykcxList();
            },
            infoBtn(item) {
                this.prompt({
                    title: '详情',
                    code: "hykxq",
                    width: 400,
                    height: 580,
                    props: {
                        item: item.row,
                    },
                    callback: (close) => {
                        close();
                    }
                });
            },
            searchList() {
                this.request({
                    url: "/crm/clueManagement/dispatch/orgsByName.do",
                    param: {
                        orgName: this.searchName,
                    }
                }).then(data => {
                    this.searchResult = data || [];
                    this.$refs.searchName.toggleMenu(this.searchResult && this.searchResult.length > 0);
                });
            },
            getOrg(value) {
                this.searchResult.map(item => {
                    if (item.name == value) {
                        this.item.recieveId = item.id;
                    }
                })
            }
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