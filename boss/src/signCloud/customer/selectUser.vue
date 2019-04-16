<style scoped></style>

<template>
    <div>
        <Table size="small" :data="items" :columns="columns" highlight-row @on-current-change="currentChange"></Table>
        <Page style="margin-top: 10px" size="small" :total="total" :current="curPage" @on-change="getUserList"></Page>
        <div v-for="item in items" :key="item.id">
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                items: [],
                columns: [
                    {title: '姓名', key: 'realName', align: 'center'},
                    {title: '联系电话', align: 'center', key: 'phone',},
                    {title: '登录账号', align: 'center', key: 'userName'}
                ],

                curPage: 1,
                total: 0
            }
        },
        created () {
            this.getUserList(1);
        },
        methods: {
            getUserList (pageIndex) {
                this.curPage = pageIndex;
                this.get({
                    url: "/signCloud/jumpSelectOrg/searchUserList.do",
                    param: {
                        page: this.curPage,
                        orgId: Context.getCurrentOrganization().id
                    }
                }).then(data => {
                    this.items = data.records;
                    this.total = data.total;
                });
            },
            currentChange(currentRow){
                this.callback(currentRow);
            },
        }
    };
</script>