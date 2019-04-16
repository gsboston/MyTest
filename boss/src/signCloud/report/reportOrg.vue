<style scoped>
    .container{
        width: 100%;
        padding: 20px 55px;
        background-color: #f6f6f6;
    }
    .report-org-head >>> .ivu-btn{
        color: #59b399;
        background: white;
        border-color: #59b399;
        border-radius: 3px;
        font-size: 12px;
        font-weight: 700;
    }
    .report-org-head .active {
        color: white;
        background: #59b399;
        border-color: #59b399;
        border-radius: 3px;
        font-size: 12px;
        font-weight: 700;
    }
    .select-head{
        width: 200px;
        float: right;
    }
    .select-head >>> .ivu-select-selection{
        height: 32px;
    }
    .select-head >>> .ivu-select-selection .ivu-select-placeholder,.select-head >>> .ivu-select-selection .ivu-select-selected-value{
        height: 32px;
        line-height: 32px;
    }
</style>
<template>
    <div class="container">
        <div class="report-org-head">
            <Button type="primary" :class="{'active':this.flag=='all'}" @click="show('all')">全部合约</Button>
            <Button type="primary" :class="{'active':this.flag=='xs'}" @click="show('xs')">仅看销售合约</Button>
            <Button type="primary" :class="{'active':this.flag=='csb'}" @click="show('csb')">仅看作为销售主体合约</Button>
            <Select size="small" v-model="current" class="select-head" @on-change="getFormalContractInfo">
                <Option value="1">当月</Option>
                <Option value="0">历史</Option>
            </Select>
        </div>
        <TotalContract :flag="this.flag" :contractData="this.contractData"></TotalContract>
        <ContractDetail :contractData="this.contractData" :pieData="this.pieData"></ContractDetail>
        <CollectionAndInvoiceData :contractData="this.contractData"></CollectionAndInvoiceData>
        <BusinessData :current="this.current" :flag="this.flag"></BusinessData>
    </div>
</template>
<script>
    import TotalContract from "./reportOrg/totalContract.vue";
    import ContractDetail from "./reportOrg/contractDetail.vue";
    import CollectionAndInvoiceData from "./reportOrg/collectionAndInvoiceData.vue";
    import BusinessData from "./reportOrg/businessData.vue";

    export default {
        components: {
            TotalContract,
            ContractDetail,
            CollectionAndInvoiceData,
            BusinessData
        },
        data () {
          return {
              current: "1",
              flag: "all",
              contractData: {},
              pieData: {},
          }
        },
        created: function () {
            this.getAllData();
        },
        methods: {
            getDataOverview () {
                this.request({
                    url: "/signCloud/report/getDataOverview.do",
                    param: {
                        flag: this.flag,
                        current: this.current
                    }
                }).then(data => {
                    if(data){
                        this.contractData = data;
                    }
                })
            },
            getPieChartInDataOverview () {
                this.request({
                    url: "/signCloud/report/getPieChartInDataOverview.do",
                    param: {
                        flag: this.flag,
                        current: this.current
                    }
                }).then(data => {
                    this.$api.getBusinessList(1, this.flag, this.current, true);
                    if(data){
                        this.pieData = data;
                    }
                })
            },
            getAllData () {
                this.getDataOverview();
                this.getPieChartInDataOverview();
                // this.$api.getBusinessList(1, this.flag, this.current, true);
            },
            getFormalContractInfo (val) {
                this.current = val;
                this.getAllData();
            },
            show (flag) {
                this.flag = flag;
                this.getAllData();
            },
        }
    }
</script>