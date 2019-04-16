<template>
    <div class="container">

        <div class="title">收款信息</div>
        <div class="collection-info">
            <func-node code="F0305" :contractId="contractId"></func-node>
        </div>

        <div class="title">发票信息</div>
        <div class="invoice-info">
            <func-node code="F0306" :agreementId="contractId"></func-node>
        </div>

    </div>
</template>

<script>
    export default {
        props: {
            contractId: null,
            businessPerson: false
        },
        data: function() {
            return {
                collapseValue: '2',
                contract: {},
                model1: ''
            }
        },
        created: function () {

        },
        methods: {

        }
    }
</script>

<style scoped>
    .container {
        background: #f1f2f7;
    }
    .container > .title {
        margin-top: 30px;
        font-size: 18px;
        line-height: 1;
        font-weight: bold;
        color: #aaa;
    }

    .collection-info,
    .invoice-info {
        position: relative;
        margin-top: 15px;
        padding: 0;
        background: white;
        box-shadow: 1px 1px 10px rgba(150, 150, 150, .2);
    }
</style>