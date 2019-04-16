<template>
    <div id="ContractView">
        <div ref="contractList" class="contract-list" style="top: 50px">
            <div class="contract-item" :class="{selected: item == selectedItem}" v-for="(item, index) in items" :key="index" trigger="hover" placement="top-start" :transfer="true">
                <div @click="selectItem(item)" >
                    <div class="contract-item-name">
                        <p>{{item.contract_name}}</p>
                    </div>
                    <div style="margin-top: 7px;height: 25px;line-height: 25px;">
                        <div class="contract-item-price">
                            <p>{{item.contract_code}}</p>
                        </div>
                        <div class="contract-item-service-type" :value="item.defCode">
                            <span>{{item.item_name | subStr}}</span>
                        </div>
                        <div class="contract-item-price" style="float: right;">
                            <span>￥{{item.contract_price}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Page v-if="items.length > 0" class="contract-page" size="small" :total="total" :current="current" @on-change="changePage"></Page>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                items: [],
                total: 0,
                current: 1,
                inputVal: null,
                selectedItem: null,
                tempContract: null
            }
        },
        created () {

        },
        filters: {
            subStr(value) {
                if (value) {
                    value = value.substring(0,2);
                }
                return value;
            }
        },
        mounted () {
            this.search(null);
        },
        methods: {
            changePage (current) {
                this.current = current;
                this.search(null);
                this.$refs.contractList.scrollTop = 0;
            },
            search (contractInfo) {
                this.tempContract = contractInfo;
                this.request({
                    url: "/signCloud/contract/getPageContractByInvoice.do",
                    data:{
                        page:this.current,
                    }
                }).then(items => {
                    this.items = items.records;
                    if (contractInfo) {
                        this.items.unshift(contractInfo);
                    }
                    this.current = items.current;
                    this.total = items.total;
                    if(window._jumpSignCloudMode) {
                        delete window._jumpSignCloudMode;
                        return;
                    }
                    if(Array.notEmpty(this.items)){
                        if(this.tempContractId == null){
                            this.selectItem(items.records[0]);
                        }else{
                            for(var contractItem of this.items){
                                if(contractItem.contract_id == contractId){
                                    this.selectItem(contractItem);
                                }
                            }
                        }
                    }else {
                        this.$api.openRight("noContract");
                    }
                });
            },
            //根据选中合约，跳转到对应的合约详情页
            selectItem (item) {
                this.selectedItem = item;
                this.$api.openRight("invoiceView",{
                    props: {
                        agreementId: item.contract_id,
                        B030602: "true",
                        B030603: "true"
                    }
                })
            }
        }
    };
</script>

<style scoped>
    .tab-head{
        position: relative;
        height:50px;
        border-bottom: solid 1px #f6f6f6;
        padding: 8px 15px;
    }
    .tab-panel > .tab-item {
        position: relative;
        float: left;
        line-height: 32px;
        font-size: 14px;
        color: #333;
        cursor: pointer;
    }
    .tab-panel > .tab-item:nth-child(2) {
        margin-left: 10px;
        padding-left: 10px;
    }
    .tab-panel > .tab-item.active {
        color: #59b399;
        font-weight: 700;
    }
    .tab-panel > .tab-item:nth-child(2):before {
        content: "";
        position: absolute;
        top: 7px;
        left: 0;
        bottom: 7px;
        width: 1px;
        background: #e5e5e5;
    }
    .tab-panel > .ivu-input-wrapper {
        float: right;
    }
    .agreement-state-item > span:first-child {
        color: #2b2b2b;
        font-weight: 700;
        margin-right: 15px;
    }
    .agreement-state-item > .ivu-icon {
        float: right;
        font-size: 14px;
        line-height: 20px;
        color: #aaa;
        transition: transform .2s ease;
    }
    .agreement-state-item > .ivu-icon.expand {
        transform: rotate(-90deg);
    }
    .agreement-state-item > .ivu-tag {
        height: 18px;
        margin: 0 7px 0 0;
        line-height: 16px;
        color: #999;
        border: none;
    }
    .agreement-state-item > .state-item {
        color: #999;
        margin-right: 10px;
        cursor: pointer;
    }
    .agreement-state-item > .state-item.selected {
        color: #59b399;
    }
    .contract-item >>> .ivu-poptip-rel {
        display: initial;
    }
    .contract-info {
        min-width: 262px;
        padding: 10px;
        color: rgb(135, 135, 135);
        font-size: 13px;
        font-weight: normal;
    }
    .contract-info p {
        line-height: 19px;
        margin-bottom: 5px;
    }
    .contract-info p span:first-child {
        min-width: 70px;
        display: inline-block;
    }
    .contract-item {
        position: relative;
        padding: 12px 20px;
        color: black;
        font-weight: 700;
        border-bottom: 1px solid #f6f6f6;
        width: 100%;
    }
    .contract-item.selected {
        color: #59b399 !important;
        background-color: #f6faf9 !important;
    }
    .contract-item:hover {
        background: #f2f6f9;
    }
    .contract-item.selected:before {
        content:"";
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 4px;
        background: #59b399;
    }
    .contract-item-name{
        font-size: 14px;
        color: #333;
        font-weight: 700;
        line-height: 24px;
    }
    .contract-item.selected .contract-item-name{
        color: #59b399;
    }
    .contract-item-price{
        display: inline-block;
        font-size: 14px;
        color: #999;
        line-height: 24px;
        font-weight: normal;
    }
    .contract-item.selected .contract-item-price{
        color: #59b399;
    }
    .contract-item-change-type{
        display: inline-block;
        float: right;
        background-color: #FFF;
        font-size: 12px;
        color: #59b399;
        width: 75px;
        height: 25px;
        line-height: 24px;
        border-radius: 14px;
        text-align: center;
        border: 1px solid #59b399;
    }
    .contract-item.selected .contract-item-change-type{
        color: #FFFFFF;
        background-color: #59b399;
    }
    .contract-item-service-type{
        display: inline-block;
        float: right;
        background-color: #ffc172;
        border-radius: 4px;
        padding: 1px 5px 0px 5px;
        font-size: 12px;
        color: white;
        line-height: 24px;
        margin: 0 8px;
    }
    .contract-item.selected .contract-item-service-type{
        background-color: #59b399;
    }
    .contract-page {
        padding: 5px 15px;
        text-align: right;
    }
    .ivu-page.mini >>> .ivu-page-next, .ivu-page.mini >>> .ivu-page-prev {
        margin: 0;
        min-width: 12px;
        height: 24px;
        line-height: 24px;
        border: 0;
    }
    .ivu-page.mini >>> .ivu-page-item-jump-next, .ivu-page.mini >>> .ivu-page-item-jump-prev, .ivu-page-next, .ivu-page-prev {
        display: inline-block;
        vertical-align: middle;
        min-width: 22px;
        height: 32px;
        line-height: 30px;
        list-style: none;
        text-align: center;
        cursor: pointer;
        color: #666;
        font-family: Arial;
        border-radius: 4px;
        transition: all .2s ease-in-out;
    }
    .contract-rejected > span{
        position: absolute;
        right: 5px;
        top: 2px;
        font-size: 14px;
        color: white;
    }

    .custom-button {
        float: right;
        background: transparent;
        color: rgb(135, 135, 135);
        border: 1px solid transparent;
        border-bottom: 1px solid rgb(135, 135, 135);
        border-radius: 0;
    }

</style>

<style>
    #ContractView .search-input input {
        border: transparent;
    }
    /*div[data-transfer="true"].ivu-poptip-popper {*/
        /*min-width: 262px;*/
        /*padding: 10px;*/
    /*}*/
    /*div[data-transfer="true"].ivu-poptip-popper .ivu-poptip-arrow {*/
        /*bottom: 5px;*/
        /*border-top-color: rgb(217, 217, 217);*/
    /*}*/
    /*div[data-transfer="true"].ivu-poptip-popper .ivu-poptip-arrow::after {*/
        /*border-top-color: rgb(246, 250, 249);*/
    /*}*/
    /*div[data-transfer="true"].ivu-poptip-popper .ivu-poptip-inner {*/
        /*background-color: rgb(246, 250, 249);*/
        /*border: 1px solid rgb(217, 217, 217);*/
    /*}*/
</style>