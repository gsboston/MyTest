<template>
    <div class="container">
        <div class="center">
            <Row>
                <i-col span="19">
                    <ButtonGroup>
                        <Button @click="addBtn">新建卡</Button>
                    </ButtonGroup>
                    <ButtonGroup>
                        <Button type="ghost" :disabled="!id" @click="optRecord">操作记录</Button>
                    </ButtonGroup>
                </i-col>
            </Row>
            <br/>
            <Table size="small" :data="items" :columns="tableColumns" highlight-row @on-current-change="selectionHandler"></Table>
            <br/>
            <Page size="small" :total="total" :current="current" :page-size="pageSize" @on-change="changePage"></Page>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                curPage: 1,
                pageSize: 10,
                item: {},
                items: [],
                total: 0,
                current: 1,
                customServiceId: null,
                id: null,
                tableColumns: [{
                    title: '卡名称',
                    key: 'name',
                    width: 180
                }, {
                    title: '卡类型', align: 'center', key: 'type', render: (h, params) => {
                        return params.row.typeDict.name;
                    }
                }, {
                    title: '账套量',
                    key: 'accountNum'
                }, {
                    title: '使用期限',
                    key: 'usageTime'
                }, {
                    title: '卡面值',
                    key: 'price'
                }, {
                    title: '生成卡号',
                    key: 'totalNum'
                }, {
                    title: '未制卡',
                    key: 'newNum'
                }, {
                    title: '制卡中',
                    key: 'printingNum'
                }, {
                    title: '已制卡',
                    key: 'printedNum'
                }, {
                    title: '已派卡',
                    key: 'salesNum'
                }, {
                    title: '已开卡',
                    key: 'usedNum'
                }, {
                    title: '操作',
                    key: 'action',
                    width: 300,
                    align: 'left',
                    render: (h, params) => {
                        if (params.row.state == 1) {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.activateBtn(params);
                                        }
                                    }
                                }, '启用'),
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
                                            this.addKhBtn(params);
                                        }
                                    }
                                }, '生成卡号'),
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.addZkBtn(params);
                                        }
                                    }
                                }, '制卡'),
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.addRkBtn(params);
                                        }
                                    }
                                }, '入库'),
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.addPkBtn(params);
                                        }
                                    }
                                }, '派卡'),
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.activateBtn(params);
                                        }
                                    }
                                }, '停用'),

                            ]);
                        }
                    }
                }]
            }
        },
        created: function () {
            this.getHykglList();
        },
        methods: {
            getHykglList() {
                this.request({
                    url: "/hykgl/getHykglList.do",
                    param: {
                        curPage: this.curPage,
                        pageSize: this.pageSize
                    }
                }).then(demand => {
                    this.items = demand.records;
                    this.current = demand.current;
                    this.total = demand.total;
                });
            },
            changePage(pageIndex) {
                this.curPage = pageIndex;
                this.getHykglList();
            },
            selectionHandler(item) {
                this.id = item.id;
                this.item = item;
            },
            optRecord() {
                this.prompt({
                    title: '操作记录',
                    code: "hykRecordList",
                    width: 860,
                    height: 520,
                    props: {
                        id: this.id,
                    },
                    callback: (close) => {
                        close();
                    }
                });
            },
            addBtn() {
                this.prompt({
                    title: '新建卡',
                    code: "hykAdd",
                    width: 400,
                    height: 345,
                    props: {
                        item: {},
                    },
                    callback: (close) => {
                        close();
                        this.getHykglList();
                    }
                });
            },
            addKhBtn(item) {
                this.prompt({
                    title: '生成卡号',
                    code: "hykhAdd",
                    width: 400,
                    height: 220,
                    props: {
                        item: item.row,
                    },
                    callback: (close) => {
                        close();
                        this.getHykglList();
                    }
                });
            },
            addZkBtn(item) {
                this.prompt({
                    title: '制卡',
                    code: "hyzkAdd",
                    width: 400,
                    height: 240,
                    props: {
                        item: item.row,
                    },
                    callback: (close) => {
                        this.getHykglList();
                    }
                });
            },
            addRkBtn(item) {
                this.prompt({
                    title: '入库',
                    code: "hyrkAdd",
                    width: 400,
                    height: 200,
                    props: {
                        item: item.row,
                    },
                    callback: (close) => {
                        close();
                        this.getHykglList();
                    }
                });
            },
            addPkBtn(item) {
                this.prompt({
                    title: '派卡',
                    code: "hypkAdd",
                    width: 460,
                    height: 580,
                    props: {
                        item: item.row,
                    },
                    callback: (close) => {
                        close();
                        this.getHykglList();
                    }
                });
            },
            activateBtn(item) {
                let userId = window.Context.getCurrentUser().id;
                this.request({
                    url: "/hykgl/activate.do",
                    param: {
                        cardId: item.row.id,
                        userId: userId
                    }
                }).then(() => {
                    this.getHykglList();
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