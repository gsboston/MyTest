<style>

</style>
<template>
    <div class="container">
        <ContractSign v-if="B110101"></ContractSign>
        <AuditReportView v-if="B110103"></AuditReportView>
        <CollectionReport v-if="B110104"></CollectionReport>
        <Invoice v-if="B110102"></Invoice>
    </div>
</template>
<script>
    import ContractSign from "./contractSign/contractSign.vue";
    import AuditReportView from "./audit/auditReportView.vue";
    import Invoice from "./invoice/invoice.vue";
    import CollectionReport from "./collectionReport.vue";
    export default {
        props: {
            B110101:{
                type:Boolean,
                default: false
            },
            B110102:{
                type:Boolean,
                default: false
            },
            B110103:{
                type:Boolean,
                default: false
            },
            B110104:{
                type:Boolean,
                default: false
            },
        },
        components: {
            ContractSign,
            AuditReportView,
            Invoice,
            CollectionReport
        },
        created: function () {
        },
        data() {
            return{
            }
        },
        methods: {

        }
    }
</script>