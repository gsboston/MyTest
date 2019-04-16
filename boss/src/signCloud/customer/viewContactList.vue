<style scoped></style>

<template>
    <div>
        <Table size="small" :data="items" :columns="columns" highlight-row></Table>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                items: [],
                columns: [
                    {title: '联系人', key: 'contactName', align: 'center'},
                    {title: '联系电话', align: 'center', key: 'contactPhone',}
                ],
            }
        },
        props: {
            customerId: null
        },
        created () {
            this.getContactList();
        },
        methods: {
            getContactList () {
                this.request({
                    url: "/signCloud/getContactList.do",
                    param: {
                        customerId: this.customerId
                    }
                }).then(data => {
                    this.items = data;
                });
            }
        }
    };
</script>