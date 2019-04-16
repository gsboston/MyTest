<template>
    <div class="container">
        <div class="center">
            <Row>
                <i-col span="19">
                    <ButtonGroup>
                        <Button type="ghost" :disabled="!id" @click="optRecord">操作记录</Button>
                    </ButtonGroup>
                    <ButtonGroup>
                        <Button @click="addBtn">新增套餐</Button>
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
                    title: '套餐编号',
                    key: 'packageNo'
                }, {
                    title: '使用时长',
                    key: 'packageLengthName'
                }, {
                    title: '账套数据(套)',
                    key: 'accountNumber'
                }, {
                    title: '购买组织类型',
                    key: 'orgTypeName'
                }, {
                    title: '售价(元)',
                    key: 'amount'
                }, {
                    title: '操作',
                    key: 'action',
                    width: 150,
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
                                        this.editBtn(params);
                                    }
                                }
                            }, '编辑'),
                            h('Button', {
                                props: {
                                    type: 'text',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.remove(params.row.id);
                                    }
                                }
                            }, '删除'),
                        ]);
                    }
                }]
            }
        },
        created: function () {
            this.getTcglList();
        },
        methods: {
            getTcglList() {
                this.request({
                    url: "/tcgl/getTcglList.do",
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
                this.getTcglList();
            },
            selectionHandler(item) {
                this.id = item.id;
                this.item = item;
            },
            optRecord() {
                this.prompt({
                    title: '操作记录',
                    code: "tcglRecordList",
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
                    title: '新增套餐',
                    code: "tcglAdd",
                    width: 400,
                    height: 345,
                    props: {
                        item: {},
                    },
                    callback: (close) => {
                        close();
                        this.getTcglList();
                    }
                });
            },
            editBtn(item) {
                if (item.row.id) {
                    this.request({
                        url: "/tcgl/getZtjfPackage.do",
                        param: {
                            packageId: item.row.id,
                        }
                    }).then(res => {
                        this.item = res;
                        this.prompt({
                            title: '编辑套餐',
                            code: "tcglAdd",
                            width: 400,
                            height: 345,
                            props: {
                                item: this.item,
                            },
                            callback: (close) => {
                                close();
                                this.getTcglList();
                            }
                        });
                    });
                }

            },
            remove(id) {
                this.$Modal.confirm({
                    content: "请确认删除操作",
                    onOk: () => {
                        this.request({
                            url: "/tcgl/delete.do",
                            param: {
                                id: id
                            }
                        }).then(() => {
                            this.getTcglList();
                        });
                    }
                });
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