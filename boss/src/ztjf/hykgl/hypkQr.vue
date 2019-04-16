<template>
    <Row style="padding: 15px 30px;">
        <div style="font-size: 16px"><label>{{item.name}}</label></div>
        <div style="font-size: 12px"><label>{{item.typeDict.name}}</label></div>
        <div style="font-size: 14px;"><label>派发量：{{item.num}}张</label></div>
        <div style="font-size: 14px;"><label>派发单价：{{item.unitPrice}}元</label></div>
        <div style="font-size: 14px;"><label>派发总款：{{item.unitPrice*item.num}}元</label></div>
        <div style="font-size: 14px;"><label>涵盖号段：{{noScope}}</label></div>
        <div style="font-size: 12px"><label>收款状态：<span v-if="item.payState==1">已收款</span><span v-if="item.payState==0">未收款</span></label></div>
        <div style="font-size: 14px;"><label>派发对象：{{item.orgName}}</label></div>
        <br/>
        <div style="float: right;">
            <Button type="primary" @click="save()">确定</Button>
        </div>
    </Row>
</template>

<script>
    export default {
        props: {item: null},
        data: function () {
            return {
                noScope: '',
                data: {},
                params: {}
            }
        },
        created: function () {
            this.distributeCheck();
        },
        methods: {
            distributeCheck() {
                this.params.cardId = this.item.id;
                this.params.payState = this.item.payState;
                this.params.num = this.item.num;
                this.params.unitPrice = this.item.unitPrice;
                this.params.reciever = this.item.reciever;
                this.params.recieveOrgId = this.item.orgId;
                this.params.totalAmount = this.item.unitPrice * this.item.num;
                this.params.creator = window.Context.getCurrentUser().id;
                this.request({
                    url: "/hykgl/distributeCheck.do",
                    data: this.params
                }).then(demand => {
                    this.noScope = demand.noScope;
                });
            },
            save: function () {
                this.params.creator = window.Context.getCurrentUser().id;
                this.request({
                    url: "/hykgl/distributesSave.do",
                    data: this.params,
                }).then(res => {
                    this.$Message.success('派卡成功!');
                    // this.callback();
                    location.reload();
                }, error => {
                    this.$Message.error(error.message);
                });
            },
        }
    };
</script>