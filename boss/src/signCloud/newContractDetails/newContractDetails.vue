<template>
    <div class="container">
        <div class="title" style="display: flex;margin-top: 10px;white-space: nowrap;">合约编号:
            <span style="margin-left: 10px;font-size: 16px; line-height: 18px;color: #5D5D5D">{{contract.contractNum}}</span>
            <span style="margin: 0 0 0 100px;font-size: 16px; line-height: 18px;">合约类型:</span>
            <span style="margin-left: 10px;font-size: 16px; line-height: 18px;color: #5D5D5D">{{contract.serviceFullName}}</span>
            <div style="width: 100%;text-align: right;font-size: 14px;">
                <p style="display: inline-block;margin-right: 50px;">
                    <span>业务员：</span>
                    <span class="item-text">{{ contract.optUserName }}</span>
                </p>
            </div>
        </div>
        <div>
            <func-node code="newContractInfo" :isEditable="this.isEditable" :contractId="contractId" :isPreview="true" :isSign="true" :isShowProgress="true" :nullify="true" :isInvoice="true"></func-node>
        </div>

        <div v-if="contract.existAgrement" class="title">变更协议记录</div>
        <div v-if="contract.existAgrement" class="change-info">
            <func-node code="newChangeList" :contractId="contractId"></func-node>
        </div>
        <div class="title">收款信息</div>
        <div class="collection-info">
            <func-node code="newCollectionView" :contractId="contractId"></func-node>
        </div>
        <div v-if="this.contract.status != 'TERMINATION'" class="title" id="invoiceInfo">发票信息</div>
        <div v-if="this.contract.status != 'TERMINATION'" class="invoice-info">
            <func-node code="invoiceView" :agreementId="contractId" :B030601="true" :isMyContract="true" :B030603="true" :isEditable="this.isEditable"></func-node>
        </div>
        <div class="title">服务进度</div>
        <div class="service-info">
            <func-node code="serviceList" :contractInfo="contract"></func-node>
        </div>
    </div>
</template>

<script>
    export default {
        filters: {
            formatDate(time) {
                var date = new Date(time);
                return date.format('yyyy-MM-dd');
            }
        },
        props: {
            contractId: null,
            isOnlyShow: {
                type: Boolean,
                default: false,
            }
        },
        data: function() {
            return {
                isEditable: false,
                userId: null,
                contract: {},
            }
        },
        created: function () {
            this.userId = window.Context.getCurrentUser().id;
            this.initContract();
        },
        methods: {
            initContract: function () {
                var vm = this;
                this.request({
                    url: '/signCloud/contractDetails/info.do',
                    param: {
                        id: this.contractId
                    }
                }).then((contract) => {
                    vm.contract = contract;
                    if(contract.creator == vm.userId && !vm.isOnlyShow){
                        vm.isEditable = true;
                    }
                });
            },
        }
    }
</script>

<style scoped>
    .container {
        padding: 10px;
        background: #f6f6f6;
    }
    .container > .title {
        margin-top: 30px;
        font-size: 18px;
        line-height: 1;
        font-weight: bold;
        color: #aaa;
    }
    .container .item-text {
        color: #333;
        font-weight: normal;
    }
    .change-info,
    .collection-info,
    .invoice-info,
    .service-info {
        position: relative;
        margin-top: 15px;
        padding: 0;
        background: white;
        box-shadow: 0 2px 3px 0 rgba(175, 175, 175, 0.55);
    }

    .container .item-text {
        color: #333;
        font-weight: normal;
    }
</style>