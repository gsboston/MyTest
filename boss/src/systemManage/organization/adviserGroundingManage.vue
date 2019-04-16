<template>
    <div>
        <div class="center">
            <Row>
                <i-col span="8">
                    <Button @click="newConsultant">新增顾问</Button>
                </i-col>
                <i-col span="16">
                    <Input icon="search" @on-enter="search" @on-click="search" v-model="searchName" style="width:400px; float: right;">
                    <Select v-model="searchType" slot="prepend" style="width:80px;">
                        <Option v-for="item in searchBy" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    </Input>
                </i-col>
            </Row>
            <br/>
            <Table border :columns="consultantsColumns" :data="consultants"></Table>
            <br/>
            <Page size="small" :total="consultantsTotal" :current="current" :page-size="pageSize" @on-change="changePage"></Page>
        </div>
    </div>
</template>

<script>
    export default {
        props: {

        },
        data () {
            return {
                searchBy: [
                    {
                        value: '1',
                        label: '门店名称'
                    },
                    {
                        value: '2',
                        label: '顾问姓名'
                    }
                ],
                searchType: "1",
                searchName: "",
                consultants:[],
                consultantsColumns:[
                    {
                        title: '所属门店',
                        key: 'store',
                        align: 'left',
                        render: (h, params) => {
                        return this.consultants[params.index].store.orgName + (this.consultants[params.index].store.status==1?'(已下架)':'');
                        },
                    },
                    {
                        title: '顾问姓名',
                        key: 'name',
                        align: 'left'
                    },
                    {
                        title: '手机',
                        key: 'phone',
                        align: 'left'
                    },
                    {
                        title: '等级',
                        key: 'level',
                        align: 'center',
                        render: (h, params) => {
                            if (this.consultants[params.index].level==0) {
                                return '普通';
                            }
                            if (this.consultants[params.index].level==1) {
                                return '中级';
                            }
                            if (this.consultants[params.index].level==2) {
                                return '高级';
                            }
                            if (this.consultants[params.index].level==3) {
                                return '专家';
                            }
                            return "";
                        }
                    },
                    {
                        title: '上架状态',
                        key: 'status',
                        align: 'center',
                        render: (h, params) => {
                            if (this.consultants[params.index].status==0) {
                                return h('Icon', {
                                    props:{
                                        type: 'checkmark',
                                    },
                                    style: {
                                        fontSize: '16px'
                                    },
                                });
                            }
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'left',
                        render: (h, params) => {
                            if (this.consultants[params.index].status!=0) {
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'text',
                                            size: 'small',
                                            disabled: this.consultants[params.index].store.status==1,
                                        },
                                        style: {
                                            marginRight: '5px',
                                        },
                                        on: {
                                            click: () => {
                                                this.grounding(params.index);
                                            }
                                        }
                                    }, '上架'),
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
                                                this.unGrounding(params.index);
                                            }
                                        }
                                    }, '下架'),
                                    h('Button', {
                                        props: {
                                            type: 'text',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                this.edit(params.index);
                                            }
                                        }
                                    }, '维护'),
                                ]);
                            }

                        }
                    }
                ],
                consultantsTotal: 0,
                current: 1,
                pageSize: 10,
            }
        },
        created: function () {
            this.search();
        },
        methods: {
            search() {
                this.request({
                    url: "/systemManage/adviser/adviserGrounding/consultants.do",
                    param: {
                        curPage: this.current,
                        pageSize: this.pageSize,
                        searchType: this.searchType,
                        searchName: this.searchName,
                    }
                }).then(data => {
                    this.consultants = data.records;
                    this.consultantsTotal = data.total;
                });
            },
            changePage (pageIndex) {
                this.current = pageIndex;
                this.search();
            },
            newConsultant() {
                this.prompt({
                    title: "新增顾问信息",
                    code: 'adviserGroundingManageCard',
                    props: {
                        editType: 'NEW',
                    },
                    width: 900,
                    height: 500,
                    callback: (close) => {
                        this.search();
                        close();
                    }
                });
            },
            edit(index) {
                this.prompt({
                    title: "顾问信息维护",
                    code: 'adviserGroundingManageCard',
                    props: {
                        editType: 'EDIT',
                        storeItem: this.consultants[index]
                    },
                    width: 900,
                    height: 500,
                    callback: (close) => {
                        this.search();
                        close();
                    }
                });
            },
            unGrounding (index) {
                this.$Modal.confirm({
                    title: '顾问下架确认',
                    content: '<p>您确定要下架这名顾问吗？</p>',
                    onOk: () => {
                        this.request({
                            url: "/systemManage/adviser/adviserGrounding/unGrounding.do",
                            param: {
                                id: this.consultants[index].id,
                            }
                        }).then(data => {
                            this.$Message.success('顾问下架成功!');
                            this.search();
                        });
                    },
                });

            },
            grounding(index) {
                this.prompt({
                    title: "顾问上架",
                    code: 'adviserGroundingManageCard',
                    props: {
                        editType: 'GROUNDING',
                        storeItem: this.consultants[index]
                    },
                    width: 900,
                    height: 500,
                    callback: (close) => {
                        this.search();
                        close();
                    }
                });
            }
        }
    };
</script>

<style scoped>
    .center {
        height: 100%;
        padding: 15px;
    }
</style>