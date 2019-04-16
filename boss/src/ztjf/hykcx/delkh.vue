<template>
    <Row style="padding: 15px 30px;">
        <div style="font-size: 12px;color: #999999;text-align: center"><label>确定删除下列卡号吗？</label></div>
        <br>
        <div v-for="item in card">
            <div style="font-size: 16px;"><label>{{item.name}}</label></div>
            <div style="font-size: 12px;"><label>{{item.type}}</label><span style="float: right">{{item.total}}</span></div>
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
                this.request({
                    url: "/hykgl/delCardRecords.do",
                    data: {'item': this.card},
                }).then(res => {
                    this.$Message.success('删除成功!');
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