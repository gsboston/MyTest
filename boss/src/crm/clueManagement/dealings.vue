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
            id: null
        },
        data: function () {
            return {
                columns1: [
                    {
                        title: '时间',
                        align: 'center',
                        key: 'date',
                        width: 120
                    },
                    {
                        title: '服务类型',
                        align: 'left',
                        key: 'serviceField'
                    }
                ],
                list: [],
                page: 1,
                total: 0,
                pageSize: 5,
            }
        },
        created: function () {
            this.init();
        },
        methods: {
            init: function () {
                this.request({
                    url: '/crm/myCollection/dealingsList.do',
                    param: {
                        id: this.id,
                        page: this.page,
                        size: this.pageSize
                    }
                }).then(data => {
                    this.list = data.list || [];
                    this.page = data.current;
                    this.total = data.total;
                });
            },
            cluePageChange: function (page) {
                this.page = page;
                this.init();
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