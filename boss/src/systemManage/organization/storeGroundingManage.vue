<template>
    <div>
        <div class="center">
            <Row>
                <Input icon="search" @on-enter="search" @on-click="search" v-model="searchName" style="width:400px; float: right;">
                    <Select v-model="searchType" slot="prepend" style="width:80px;">
                        <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </Input>
            </Row>
            <br/>
            <Table border :columns="storesColumns" :data="stores"></Table>
            <br/>
            <Page size="small" :total="storesTotal" :current="current" :page-size="pageSize" @on-change="changePage"></Page>
        </div>
    </div>
</template>

<script>
    export default {
        props: {

        },
        data () {
            return {
                cityList: [
                    {
                        value: 1,
                        label: '门店名称'
                    },
                    {
                        value: 2,
                        label: '组织名称'
                    },
                    {
                        value: 3,
                        label: '所属公司'
                    },

                ],
                searchType: 1,
                searchName: "",
                stores:[],
                storesColumns:[
                    {
                        title: '所属公司',
                        key: 'companyName',
                        align: 'left'
                    },
                    {
                        title: '组织名称',
                        key: 'name',
                        align: 'left'
                    },
                    {
                        title: '门店名称',
                        key: 'deptName',
                        align: 'left'
                    },
                    {
                        title: '上架状态',
                        key: 'status',
                        align: 'center',
                        render: (h, params) => {
                            if (this.stores[params.index].status==0) {
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
                            if (this.stores[params.index].status!=0) {
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
                storesTotal: 0,
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
                    url: "/systemManage/organization/storeGrounding/stores.do",
                    param: {
                        searchType: this.searchType,
                        searchName: this.searchName,
                        curPage: this.current,
                        pageSize: this.pageSize,
                    }
                }).then(data => {
                    this.stores = data.records;
                    this.storesTotal = data.total;
                });
            },
            changePage (pageIndex) {
                this.current = pageIndex;
                this.search();
            },
            edit(index) {
                this.prompt({
                    title: "门店信息维护",
                    code: 'storeGroundingManageCard',
                    props: {
                        editType: 'EDIT',
                        storeItem: this.stores[index]
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
                    title: '门店下架确认',
                    content: '<p>门店下架时也会把该门店的顾问全部下架，您确定要下架这个门店吗？</p>',
                    onOk: () => {
                        this.request({
                            url: "/systemManage/organization/storeGrounding/unGrounding.do",
                            param: {
                                id: this.stores[index].deptId,
                            }
                        }).then(data => {
                            this.$Message.success('门店下架成功!');
                            this.search();
                        });
                    },
                });
            },
            grounding(index) {
                this.prompt({
                    title: "门店信息上架",
                    code: 'storeGroundingManageCard',
                    props: {
                        editType: 'GROUNDING',
                        storeItem: this.stores[index]
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