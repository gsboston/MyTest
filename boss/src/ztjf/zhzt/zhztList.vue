<template>
    <div class="container">
        <div class="center">
            <Row>
                <i-col span="24">
                    <div style="display: inline-block;margin-left: 4px">
                        <Select class="search-condition" placeholder="全部用户类型" v-model="orgType">
                            <Option v-for="(searchConditionInfo,index) in orgTypeList" :key="index" :value="searchConditionInfo.value">{{searchConditionInfo.name}}</Option>
                        </Select>
                    </div>
                    <div style="display: inline-block;margin-left: 4px">
                        <Select class="search-condition" placeholder="全部账套状态" v-model="status">
                            <Option v-for="(searchConditionInfo,index) in orgPlusStatusList" :key="index" :value="searchConditionInfo.value">{{searchConditionInfo.name}}</Option>
                        </Select>
                    </div>
                    <div style="display:inline-block;margin-left: 4px">
                        <Input placeholder="输入机构名称进行查询" :maxlength="50" v-model="searchText" class="search-text" style="width: 200px"/>
                    </div>
                    <div style="display: inline-block;margin-left: 4px">
                        <Button style="border-radius: 0" @click="search()">查询</Button>
                        <ButtonGroup>
                            <Button type="ghost" :disabled="!id" @click="optRecord">操作记录</Button>
                        </ButtonGroup>
                    </div>
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
                status: '',
                orgType: '',
                searchText: '',
                orgTypeList: [],
                orgPlusStatusList: [],
                curPage: 1,
                pageSize: 10,
                item: {},
                items: [],
                total: 0,
                current: 1,
                id: null,
                tableColumns: [{
                    title: '机构类型', align: 'center', key: 'orgType', render: (h, params) => {
                        return params.row.orgTypeDict.name;
                    }
                }, {
                    title: '机构名称',
                    key: 'orgName'
                }, {
                    title: '机构编码',
                    key: 'orgCode'
                }, {
                    title: '账套总量（套）',
                    key: 'totalNum'
                }, {
                    title: '账套到期时间', align: 'center', width: 200, key: 'tsInsert', render: (h, params) => {
                        return window.DateFormat.dateToString(params.row.tsInsert, 'yyyy-MM-dd HH:mm:ss');
                    }
                }, {
                    title: '账套状态', align: 'center', key: 'status', render: (h, params) => {
                        return params.row.statusDict.name;
                    }
                }, {
                    title: '操作',
                    key: 'action',
                    width: 200,
                    align: 'left',
                    render: (h, params) => {
                        if (this.items[params.index].status == 1) {
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
                                            this.krBtn(params);
                                        }
                                    }
                                }, '扩容'),
                            ]);
                        } else if (this.items[params.index].status == 2) {
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
                                            this.xfBtn(params);
                                        }
                                    }
                                }, '续费'),
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
                                            this.szBtn(params);
                                        }
                                    }
                                }, '设置'),
                            ]);
                        }

                    }
                }]
            }
        },
        created: function () {
            this.getOrgType();
            this.getOrgPlusStatus();
            this.getZhztList();
        },
        methods: {
            getOrgType() {
                this.request({
                    url: "/tcgl/getKeyBook.do",
                    param: {
                        type: 'orgType',
                    }
                }).then(data => {
                    this.orgTypeList = data;
                });
            },
            getOrgPlusStatus() {
                this.request({
                    url: "/tcgl/getKeyBook.do",
                    param: {
                        type: 'orgPlusStatus',
                    }
                }).then(data => {
                    this.orgPlusStatusList = data;
                });
            },
            getZhztList() {
                this.request({
                    url: "/zhzt/page.do",
                    data: {
                        page: this.curPage,
                        size: this.pageSize,
                        orgType: this.orgType,
                        status: this.status,
                        searchText: this.searchText
                    }
                }).then(demand => {
                    if (demand.records) {
                        this.items = demand.records;
                        this.current = demand.current;
                        this.total = demand.total;
                    } else {
                        this.items = [];
                        this.current = 1;
                        this.total = 0;
                    }
                });
            },
            search() {
                this.curPage = 1;
                this.getZhztList();
            },
            changePage(pageIndex) {
                this.curPage = pageIndex;
                this.getZhztList();
            },
            selectionHandler(item) {
                this.id = item.orgId;
            },
            optRecord() {
                this.prompt({
                    title: '操作记录',
                    code: "zhztRecordList",
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
            xfBtn(item) {
                this.prompt({
                    title: '续费',
                    code: "zhztxf",
                    width: 400,
                    height: 320,
                    props: {
                        item: item.row,
                    },
                    callback: (close) => {
                        close();
                        this.getZhztList();
                    }
                });
            },
            szBtn(item) {
                this.prompt({
                    title: '设置',
                    code: "zhztsz",
                    width: 400,
                    height: 320,
                    props: {
                        item: item.row,
                    },
                    callback: (close) => {
                        close();
                        this.getZhztList();
                    }
                });
            },
            krBtn(item) {
                this.prompt({
                    title: '扩容',
                    code: "zhztkr",
                    width: 400,
                    height: 320,
                    props: {
                        item: item.row,
                    },
                    callback: (close) => {
                        close();
                        this.getZhztList();
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