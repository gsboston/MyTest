<template>
    <Row style="padding: 15px 30px;">
        <div v-for="item in card">
            <div style="font-size: 16px;"><label>{{item.name}}</label></div>
            <div style="font-size: 12px;"><label>{{item.type}}</label></div>
            <br>
            <div style="font-size: 12px;"><label>收款对象：{{item.recieveOrgName}}</label></div>
            <div style="font-size: 12px;"><label>收款卡数：{{item.total}}张</label></div>
            <div style="font-size: 12px;"><label>单　　价：{{item.price}}元</label></div>
            <div style="font-size: 12px;"><label>收款总计：{{item.totalAmount}}元</label></div>
            <br>
            <br>
        </div>
        <Button style="float: right;" type="primary" @click="save('item')">确定</Button>
    </Row>
</template>

<script>
    export default {
        props: {item: null},
        data: function () {
            return {
                card: ''
            }
        },
        created: function () {
            this.getDetail();
        },
        methods: {
            getDetail() {
                delete this.item.page;
                delete this.item.size;
                this.request({
                    url: "/hykgl/staticCardRecords.do",
                    data: this.item
                }).then(res => {
                    this.card = res;
                }, error => {
                    this.$Message.error(error.message);
                });
            },
            save: function (name) {
                let gatherId = window.Context.getCurrentUser().id;
                this.request({
                    url: "/hykgl/gathering.do",
                    param: {
                        gatherId: gatherId
                    },
                    data: {'item': this.card},
                }).then(res => {
                    this.$Message.success('收款成功!');
                    this.callback();
                }, error => {
                    this.$Message.error(error.message);
                });
            },
        }
    };
</script>

<style scoped>
    .line {
        margin: 5px auto;
        border-bottom: 1px solid #ccc;
        width: 100%;
    }
</style>