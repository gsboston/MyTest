<style scoped>
    .container {
        height: calc(100% - 45px);
    }
    .panel {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        padding: 7px;
        background: white;
        border-bottom: solid 1px #dddee1;
    }
    .invoice-left {
        float: left;
        width: 300px;
        background: white;
    }
    .invoice-center {
        position: relative;
        background: #FFF;
        margin-left: 300px;
        /*height: 100%;*/
        padding: 0px 25px 20px 30px;
        overflow-x: hidden;
        overflow-y: auto;
        border-left: 1px solid #eeeeee;
    }
    .invoice-content {
        position: relative;
        width: 100%;
        height: auto;
        background: white;
    }

    .invoice-content >>> .container, .invoice-content >>> .container > .tips {
        background-color: #FFF;
    }

    .invoice-info {
        height: 100%;
        padding: 0;
        margin-top: 47px;
    }
</style>

<template>
    <div class="container" id="invoiceWindow">

        <div class="panel">
            <Search :condition="condition" :isShowDate="false" :isShowQuick="false" :isContractOrg="null" :isSubjectBOrg="true" @selected-contract="showSelectedContract" style="display: inline-block"></Search>
        </div>

        <div class="invoice-info">
            <div class="invoice-left">
                <component is="ApplyListView" ref="applyList"></component>
            </div>
            <div class="invoice-center">
                <div class="invoice-content" ref="invoiceContent"></div>
            </div>
        </div>

    </div>
</template>

<script>
    import Option from "../contractSearch/SearchOption"
    import Search from "../contractSearch/contractSearch.vue";
    import ApplyListView from "./applyListView.vue";
    const ROUTER_STATUS = "sign_cloud_router_status";

    export default {
        data () {
            return {
                contractInfo: null,
                condition: new Option(
                    Option.addApproved(true,false,true),
                    Option.addSigning(true,false,true),
                    Option.addSigned(true,false,true),
//                    Option.addInvoiceNone(true,false),
//                    Option.addInvoiceInvoiced(true,false),
//                    Option.addInvoiceFinish(true,false),
                )
            }
        },
        created () {
            window._signCloud = this;
            this.$api.init();
        },
        mounted () {
            this.$api.openRight = this.openRight;
            this.$api.refreshApplyInvoice = this.onRefresh;
        },
        components: {
            Search,
            ApplyListView
        },
        methods: {
            showSelectedContract (contractInfo) {
                this.contractInfo = contractInfo;
                this.onRefresh(contractInfo);
            },
            openRight (code, config) {
                this.$refs.invoiceContent.innerHTML = "";
                let comp = this.getPage(code, config);
                if(comp) {
                    this.$refs.invoiceContent.appendChild(comp.$el);
                    comp.jumpTarget && comp.jumpTarget();
                }
                this.setRouterStatus(code, config);
            },
            closeRight () {
                this.$refs.invoiceContent.innerHTML = "";
            },
            setRouterStatus (code, config) {
                let routerStatus = {
                    code: code,
                    config: config
                };
                sessionStorage.setItem(ROUTER_STATUS, JSON.stringify(routerStatus));
            },
            onRefresh(contractInfo = null) {
                this.$refs['applyList'].search(contractInfo);
                document.getElementById('invoiceWindow').parentNode.scrollTop = 0;
            },
        }
    }
</script>