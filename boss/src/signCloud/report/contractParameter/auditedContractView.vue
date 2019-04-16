<template>
    <div class="container">
        <div class="center" v-if="this.contractId && this.contract.status == 'COMMITTED'" >
            <NewAudit :contractInfo="this.contract"></NewAudit>
        </div>
        <div class="center" v-if="this.contractId && (this.contract.status == 'APPROVED' || this.contract.status == 'SIGNING' || this.contract.status == 'SIGNED' || this.contract.status == 'TERMINATION')">
            <NewContractDetails :contractId="this.contractId" :isOnlyShow="true"></NewContractDetails>
        </div>
    </div>
</template>

<script>
    import NewContractDetails from "../../newContractDetails/newContractDetails.vue";
    import NewAudit from "../../audit/newAudit.vue";
    export default {
        components: {
            NewContractDetails,
            NewAudit,
        },
        props: {
            contractId: null,

        },
        data: function() {
            return {
                contract: {},
            }
        },
        created:function() {
            this.getContract();
        },
        methods: {
            getContract(){
                this.request({
                    url: "/signCloud/contractView/getContractById.do",
                    param:{id:this.contractId}
                }).then(data => {
                    this.contract = data;
                    this.$set(this.contract, 'contract_def_id', this.contract.contractDefId);
                    this.$set(this.contract, 'contract_id', this.contract.id);
                });
            }
        },
    }
</script>

<style scoped>
    .container {
        background: #f6f6f6;
    }
    .center {
        position: absolute;
        top: 5px;
        bottom: 5px;
        right: 5px;
        left: 5px;
        /*top: 45px;*/
        background: #f7f7f7;
        overflow-x: hidden;
        overflow-y: auto;
    }
</style>