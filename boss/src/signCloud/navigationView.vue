<template>
    <div class="navigation clearFix">
        <ContractSearch :condition="condition" :isShowDate="true"></ContractSearch>
        <ButtonGroup class="nav-items">
            <Button class="nav-item" type="ghost" :class="{selected:1==selectedPhase}" :disabled="!this.auditContract"  @click="audit(1)">
                审核环节
                <!--<span class="badge" v-if="this.auditContract && auditCount !=0">{{auditCount}}</span>-->
                <span class="badgeRed" v-if="this.auditContract && auditCount !=0"></span>
            </Button>
            <Button class="nav-item" type="ghost" :class="{selected:2==selectedPhase}" :disabled="!this.sealContract" @click="contract(2)">
                签署环节
                <!--<span class="badge" v-if="this.sealContract && approvedCount !=0">{{approvedCount}}</span>-->
                <span class="badgeRed" v-if="this.sealContract && approvedCount !=0"></span>
            </Button>
            <Button class="nav-item" type="ghost" :class="{selected:3==selectedPhase}" :disabled="!this.collectionContract" @click="collection(3)">
                收款环节
                <!--<span class="badge" v-if="this.collectionContract && collectionCount !=0">{{collectionCount}}</span>-->
                <span class="badgeRed" v-if="this.collectionContract && collectionCount !=0"></span>
            </Button>
            <Button class="nav-item" type="ghost" :class="{selected:4==selectedPhase}" :disabled="!this.drawBillContract" @click="invoice(4)">
                开票环节
                <!--<span class="badge" v-if="this.drawBillContract && invoiceCount !=0">{{invoiceCount}}</span>-->
                <span class="badgeRed" v-if="this.drawBillContract && invoiceCount !=0"></span>
            </Button>
            <Button class="nav-item" type="ghost" :class="{selected:5==selectedPhase}" :disabled="!this.terminationContract" @click="termination(5)">
                解约环节
                <!--<span class="badge" v-if="this.drawBillContract && invoiceCount !=0">{{invoiceCount}}</span>-->
                <span class="badgeRed" v-if="this.terminationContract && invoiceCount !=0"></span>
            </Button>
            <Button class="nav-item" type="ghost" :class="{selected:6==selectedPhase}" :disabled="!this.updateContract" @click="update(6)">
                变更环节
                <!--<span class="badge" v-if="this.drawBillContract && invoiceCount !=0">{{invoiceCount}}</span>-->
                <span class="badgeRed" v-if="this.updateContract && invoiceCount !=0"></span>
            </Button>
        </ButtonGroup>
        <Button class="add-btn" :disabled="!this.addNewContract" @click="addContract"><Icon type="plus"></Icon> 新建合约</Button>
    </div>
</template>

<script>
    import Option from "./contractSearch/SearchOption";
    import ContractSearch from "./contractSearch/contractSearch.vue";
    export default {
        components: {
            ContractSearch
        },
        data () {
            return {
                addNewContract: false,
                auditContract: false,
                sealContract: false,
                collectionContract: false,
                drawBillContract: false,
                auditCount: 0,
                approvedCount: 0,
                collectionCount: 0,
                invoiceCount: 0,
                selectedPhase: 0,
                condition: new Option(
                    Option.addNone(),
                    Option.addCommited(),
                    Option.addApproved(),
                    Option.addSigning(),
                    Option.addSigned(),
                    Option.addTermination()
                )
            }
        },
        created () {
            this.$api.getHeadCount = this.getHeadCount;
            this.$api.audit = this.audit;
            this.$api.contract = this.contract;
            this.$api.collection = this.collection;
            this.$api.invoice = this.invoice;
            this.$api.termination = this.termination;
            this.$api.update = this.update;
            let authRes = window.Context._getAuthResources("F0302");
            this.addNewContract = authRes.B030201;
            this.auditContract = authRes.B030202;
            this.sealContract = authRes.B030203;
            this.collectionContract = authRes.B030204;
            this.drawBillContract = authRes.B030205;
            this.terminationContract = authRes.B030206;
            this.updateContract = authRes.B030207;
            this.getHeadCount();
        },
        methods: {
            addContract () {
                this.$emit("on-add");
            },
            audit () {
                this.selectedPhase = 1;
                this.$emit("on-audit");
            },
            contract () {
                this.selectedPhase = 2;
                this.$emit("on-contract");
            },
            collection () {
                this.selectedPhase = 3;
                this.$emit("on-collection");
            },
            invoice () {
                this.selectedPhase = 4;
                this.$emit("on-invoice");
            },
            termination () {
                this.selectedPhase = 5;
                this.$emit("on-termination");
            },
            update () {
                this.selectedPhase = 6;
                this.$emit("on-update");
            },
            getHeadCount () {
                this.request({
                    url: "/signCloud/navigationView/getCount.do",
                }).then(items => {
                    this.auditCount = items.data.auditNum;
                    this.approvedCount = items.data.signedNum;
                    this.collectionCount = items.data.receiptNum;
                    this.invoiceCount = items.data.invoiceNum;
                });
            },
        }
    };
</script>

<style scoped>
    .disabled {
        pointer-events: none;
        background-color: #F6F6F6;
        color: #ccc;
    }
    .navigation {
        position: relative;
        width: 100%;
        height: 100%;
        padding: 10px 40px 0 40px;
        background: white;
        border-left: solid 1px #F6F6F6;
        border-bottom: solid 1px #e7e9ef;
        box-shadow: 1px 1px 10px rgba(150, 150, 150, .2);
    }
    .navigation > .add-btn,
    .navigation > .nav-items > .nav-item {
        height: 28px;
        padding: 6px 20px;
        line-height: 14px;
    }
    .nav-item.selected{
        background-color: white;
        color: #59b399;
        border: 1px solid #59b399;
    }
    .navigation  .add-btn {
        float: right;
        margin-right: 10px;
    }
    .navigation > .nav-items {
        float: right;
    }
    .navigation > .nav-items .badge {
        position: absolute;
        top: 1px;
        right: 1px;
        /*width: 12px;*/
        height: 12px;
        padding: 0 3px;
        background: #ef7369;
        color: white;
        line-height: 12px;
        font-size: 12px;
        border-radius: 6px;
    }
    .navigation > .nav-items .badgeRed {
        position: absolute;
        top: 1px;
        right: 13px;
        width: 8px;
        height: 8px;
        padding: 0 3px;
        background: #ef7369;
        color: white;
        line-height: 12px;
        font-size: 10px;
        border-radius: 6px;
    }
</style>