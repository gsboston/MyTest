<template>
    <div>
        <component ref="invoice" :is="activeCode" :contractId="agreementId" :refreshNum="refreshNum" :currentUser="currentUser" :isTermination="isTermination" :auth="auth" @on-handle-refresh-status="handleRefreshStatus"></component>
        <div v-if="agreementId == null" class="no-change">
            <span>暂无可显示的开票记录</span>
        </div>
    </div>
</template>

<script>
    import B030601 from "./applyInvoice.vue";
    import B030603 from "./invoiceList.vue";
    import B030602 from "./newInvoice.vue";
    import InvoiceOfTermination from "./invoiceOfTermination.vue";

    export default {
        components: {
            B030601,
            B030602,
            B030603,
            InvoiceOfTermination,
        },
        props: {
            agreementId: null,
            B030601: false, //申请开票
            B030602: false, //确认开票
            B030603: false, //开票台账
            isTermination: false, //是否解约
            isMyContract: false, //是否为我的合约
            isEditable: true  //是否可编辑
        },
        data() {
            return {
                activeCode: null,
                contractInfo: null,
                contractPriceInfo: null,
                currentUser: null,
                auth: {},
                refreshNum: 0,
            }
        },
        watch: {
            agreementId(value) {
                this.agreementId = value;
                this.getContractData(true);
            }
        },
        created() {
            this.currentUser = window.Context.getCurrentUser();
            this.auth = this._props;
            if (this.B030601 || this.B030602 || this.B030603) {
                if (this.agreementId) {
                    this.getContractData();
                }
            }
            this.$api.refreshInvoicePage = this.getContractData;
        },
        methods: {
            getContractData (isRefresh = false) {
                if (isRefresh) {
                    this.refreshNum += 1;
                }
                this.request({
                    url: "/signCloud/contract/info.do",
                    param: {
                        contractId: this.agreementId
                    }
                },{
                    url: "/signCloud/invoice/getPrice.do",
                    param: {
                        contractId: this.agreementId
                    }
                }).then((info, priceInfo) => {
                    this.contractInfo = info;
                    this.contractPriceInfo = priceInfo;
                    if (this.contractInfo) {
                        if (this.isMyContract) {
                            this.activeCode = 'B030603';
                        }else {
                            if (this.isTermination) {
                                this.activeCode = 'InvoiceOfTermination';
                            }else if (this.contractPriceInfo){
                                if (this.B030602) {
                                    if (this.contractPriceInfo.invoicedPrice >= (this.contractPriceInfo.receiptPrice + this.contractPriceInfo.noneReceivablePrice)&& this.contractPriceInfo.noneInvoicedPrice == 0) {
                                        if (this.B030603) {
                                            this.activeCode = 'B030603';
                                        }
                                    }else {
                                        this.activeCode = 'B030602';
                                    }
                                }else if (this.B030601) {
                                    this.activeCode = 'B030601';
                                }
                            }
                        }
                    }
                });
            },
            handleRefreshStatus (contractId) {
                //发布公共API，刷新当前组件
                this.getContractData(true);
            },
            handleGetInvoiceInfo () {
                //获取当前页面发票处理后的数据
                return this.$refs['invoice'].handleGetInvoiceInfo();
            }
        }
    }
</script>

<style scoped>
    .no-change{
        position: relative;
        width: 100%;
        height: auto;
        padding-top: 253px;
        background: #FFF url("../image/no-contract.png") center 100px no-repeat;
        text-align: center;
        font-size: 16px;
    }
</style>