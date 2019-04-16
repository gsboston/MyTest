<template>
    <div>
        <Table stripe :columns="columns1" :data="list" class="table"></Table>
        <Row class="cluePage">
            <i-col span="24">
                <Page size="small" :page-size="pageSize" :total="total" :current="page" @on-change="cluePageChange" show-total></Page>
            </i-col>
        </Row>
    </div>
</template>

<script>
    export default {
        props: {
            clueId: null
        },
        data: function () {
            return {
                columns1: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center'
                    },
                    {
                        title: '错误原因',
                        render: (h, params) => {
                            return params.row.details[0].catName;
                        }
                    },
                    {
                        title: '备注说明',
                        key: 'errorContent'
                    },
                    {
                        title: '门店信息',
                        key: 'organizationName'
                    },
                    {
                        title: '报错人',
                        key: 'createName'
                    },
                    {
                        title: '联系电话',
                        key: 'mobile'
                    },
                    {
                        title: '是否已解决',
                        align: 'left',
                        width: '150px',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'ghost',
                                        icon: 'ios-checkmark-outline',
                                    },
                                    style: {
                                        fontSize: '28px',
                                        color: params.row.details[0].status==2?'#53b89e':'#cccccc',
                                        fontWeight: 'bold',
                                        border: 'none',
                                        outline: 'none',
                                        boxShadow: 'none'
                                    },
                                    on: {
                                        click: () => {
                                            //this.show(params.index)
                                            params.row.details[0].status = 2;
                                            let data = [];
                                            data.push(params.row);
                                            this.changeErrorStatus(data);
                                        }
                                    }
                                })
                            ]);
                        },
                        renderHeader: (h, params) => {
                            return h('div', [
                                h('strong', '是否已解决'),
                                h('Button', {
                                    props: {
                                        type: 'ghost',
                                        icon: 'ios-checkmark-outline',
                                    },
                                    style: {
                                        fontSize: '28px',
                                        color: '#cccccc',
                                        fontWeight: 'bold',
                                        border: 'none',
                                        outline: 'none',
                                        boxShadow: 'none'
                                    },
                                    on: {
                                        click: () => {
                                            let uplist = [];

                                            this.list.forEach((item, index) => {
                                                if(item.details[0].status == 1) {
                                                    uplist.push(item);
                                                    item.details[0].status = 2;
                                                }
                                            });
                                            this.changeErrorStatus(uplist);
                                        }
                                    }
                                })
                            ]);
                        }
                    }
                ],
                list: [],
                page: 1,
                total: 0,
                pageSize: 3,
            }
        },
        created: function () {
            this.init();
        },
        methods: {
            init: function () {
                this.request({
                    url: '/crm/dataManage/findHintErrorListPage.do',
                    param: {
                        hxid: this.clueId,//'946655476244361218',//
                        page: this.page,
                        size: this.pageSize
                    }
                }).then(data => {
                    this.list = data.records || [];
                    this.page = data.current;
                    this.total = data.total;
                });
            },
            cluePageChange: function (page) {
                this.page = page;
                this.init();
            },
            changeErrorStatus(obj){
                this.request({
                    url: '/crm/dataManage/updateHintErrorStatus.do',
                    data: {
                        HintErrorVos: obj
                    }
                }).then(data => {
                    console.log('成功')
                });
            }
        }
    }
</script>

<style scoped>
    .table{
        border-right: none;
        border-bottom: none;
        border-left: none;
    }
    .cluePage{
        padding: 10px 30px;
    }
</style>