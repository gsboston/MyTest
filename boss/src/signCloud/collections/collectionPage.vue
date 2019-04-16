<style scoped>
    .container {
        background: #f6f6f6;
    }
    .content{
        position: relative;
        width: 920px;
        margin: 0 auto;
        background-color: #f6f6f6;
        top:45px;
        padding-bottom: 200px;
    }
    .center {
        position: absolute;
        top: 45px;
        left: 300px;
        right: 0px;
        bottom: 0;
        background: #f7f7f7;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .panel {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 45px;
        padding: 7px;
        background: white;
        border-bottom: solid 1px #dddee1;
    }
    .panel >>> .ivu-input-icon{
        color: #59b399;
        font-weight: bold;
        font-size: 20px;
    }
    .item_name{
        border: 1px solid #59b399;
        border-radius: 4px;
        padding: 1px 0px 0px 0px;
        font-size: 12px;
        width: 30px;
        line-height: 14px;
    }
    .title {
        margin-top: 15px;
        font-size: 18px;
        line-height: 1;
        font-weight: bold;
        color: #aaa;
    }

    .left {
        position: absolute;
        top: 45px;
        left: 0;
        bottom: 0;
        width: 300px;
        padding-bottom: 10px;
        border-right: solid 1px #dddee1;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .item_name{
        border: 1px solid #59b399;
        border-radius: 4px;
        padding: 1px 0 0 0;
        font-size: 12px;
        width: 30px;
        line-height: 14px;
    }
    .contract-list-item{
        color: #999;
        position: relative;
        height: 79px;
        padding: 12px 20px 12px 20px;
        border-bottom: 1px solid #f6f6f6;
    }
    .contract-list-item:hover{
        background: #f2f6f9;
    }
    .contract-item-service-type{
        width: 35px;
        background-color: #ffc172;
        border-radius: 4px;
        padding: 1px 5px 0px 5px;
        font-size: 12px;
        color: white;
    }
    .change-red {
        width: 0;
        height: 0;
        border-top: 30px solid #FF6464;
        border-left: 30px solid transparent;
        float: right;
        margin-top: -48px;
        margin-right: -20px;
        opacity: 0.5;
    }
    .change-red > span{
        position: relative;
        right: 14px;
        top: -30px;
        font-size: 12px;
        color: white;
    }
    .selected {
        color: #59b399 !important;
        background-color: #f6faf9 !important;
    }
    .selected:before {
        content:"";
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 4px;
        background: #59b399;
    }
    .collection-page{
        margin-top: 5px;
    }
    .collection-page >>> .ivu-page-item a{
        margin: 0 1px;
    }
    .collection-page >>> .ivu-page-item{
        min-width: 18px;
    }
</style>

<template>
    <div class="container">
        <div class="panel">
            <Input v-model="nameOrCode" icon="ios-search-strong" placeholder="甲方/合约编号" style="width: 250px"></Input>
            <Select v-model="payeeStatus" clearable style="width:250px;margin-left: 20px" placeholder="请选择收款情况">
                <Option value="none">未收款</Option>
                <Option value="section">部分收款</Option>
                <Option value="complete">全部收款</Option>
            </Select>
            <Button type="primary" style="margin-left: 20px" @click="initContract">查询</Button>
            <Button type="primary" @click="reset">重置</Button>
        </div>
        <div class="left" v-if="this.contractQuickList.length>0" ref="contractQuickList">
            <div class="contract-list-item" :class="{selected: contractQuickInfo == contractInfo}" @click="showSelectedContract(contractQuickInfo)" v-for="(contractQuickInfo, index) in contractQuickList" :key="index">
                <div :title="contractQuickInfo.contract_name" style="margin-bottom: 10px;padding-top: 5px;font-weight: bold;color: #333;font-size: 14px">
                    <span>{{contractQuickInfo.contract_name | wordLengthLimit}}</span>
                </div>
                <div v-if="contractQuickInfo.approved_type=='CANCEL'" class="change-red">
                    <span>取</span>
                </div>
                <div v-if="contractQuickInfo.approved_type=='REJECTED'" class="change-red">
                    <span>驳</span>
                </div>
                <div style="display: inline-block;width: 40px;">
                    <span>￥{{contractQuickInfo.contract_price}}</span>
                </div>
                <div style="display: inline-block;width: 40px;float: right">
                    <div class="contract-item-service-type" :value="contractQuickInfo.contract_def_code">
                        <span>{{contractQuickInfo.item_name}}</span>
                    </div>
                </div>
                <div style="display: inline-block;width: 40px;float: right;margin-right: 10px">
                    <span>{{contractQuickInfo.contract_status_name}}</span>
                </div>
                <!--<hr style="margin-top: 5px;border-top: 1px #dddee1;"/>-->
            </div>
            <Page class="collection-page" size="small" :total="total" :current="current" @on-change="changePage"></Page>
        </div>
        <div class="center" v-if="contractId != null" style="padding-left: 45px; padding-right: 45px;">
            <div class="title" style="display: flex; padding-bottom: 15px;white-space: nowrap;background: #f6f6f6;">合约信息</div>
            <func-node style="margin-top:0px;" v-if="contractId != ''" code="newContractInfo" :contractId="contractId" :isPreview="true" :isSign="false" :isShowProgress="false" :nullify="false" :isInvoice="false"></func-node>
            <div class="title" style="display: flex; padding-bottom: 15px;padding-top: 15px; margin-top: 0px;white-space: nowrap;background: #f6f6f6;">收款操作</div>
            <div style="background-color: white;box-shadow: 0 2px 3px 0 rgba(175, 175, 175, 0.55);" v-if="contractId != ''">
                <func-node code="collectionView" :contractId="contractId" :collectionAuth="true"></func-node>
            </div>
        </div>
        <div class="center" v-else style="text-align: center;">
            <div style="padding-top: 260px">
                <img src="/static/noMessage.png"/>
            </div>
            <div>
                <span style="font-size: 16px !important;">请输入条件搜索需要收款的合约~</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                vm: {},
                nameOrCode: null,
                payeeStatus: null,
                contractQuickList: [],
                contractId: null,
                contractInfo: null,
                total: 0,
                current: 1,
            }
        },
        created: function () {
            this.initContract();
        },
        mounted:function(){
        },
        filters: {
            formatDate(time) {
                var date = new Date(time);
                return date.format('yyyy-MM-dd');
            },
            wordLengthLimit : function (value) {
                if(value && value.length > 15){
                    return value.substring(0,15) + "..." ;
                }
                return value;
            }
        },
        methods: {
            initContract () {
                this.request({
                    url: "/signCloud/collectionPage/getContractList.do",
                    param: {
                        nameOrCode: this.nameOrCode,
                        payeeStatus: this.payeeStatus,
                        current: this.current,
                    }
                }).then(items => {
                    this.current = items.current;
                    this.total = items.total;
                    if(items && items.records && items.records.length>0){
                        for(var i=0;i<items.records.length;i++){
                            items.records[i].item_name = items.records[i].item_name.substring(0,2);
                            items.records[i].contract_status_name = this.getContractStatusName(items.records[i].contract_status);
                        }
                        this.contractQuickList = items.records;
                        this.showSelectedContract(this.contractQuickList[0]);
                    }else{
                        this.contractQuickList = [];
                        this.contractId = null;
                    }
                })
            },
            reset () {
                this.nameOrCode = null;
                this.payeeStatus = null;
            },
            showSelectedContract (contractInfo) {
                this.contractInfo = contractInfo;
                this.contractId = "";
                this.$nextTick(function () {
                    this.contractId = contractInfo.contract_id;
                });

            },
            getContractStatusName (contract_status) {
                var contract_status_name="";
                if(contract_status=='NONE'){
                    contract_status_name='待提交';
                }else if(contract_status=='COMMITTED'){
                    contract_status_name='待审核';
                }else if(contract_status=='APPROVED'){
                    contract_status_name='已核准';
                }else if(contract_status=='SIGNING'){
                    contract_status_name='签约中';
                }else if(contract_status=='SIGNED'){
                    contract_status_name='已签署';
                }else if(contract_status=='TERMINATION'){
                    contract_status_name='已解约';
                }
                return contract_status_name;
            },
            changePage (current) {
                this.current = current;
                this.initContract();
                this.$refs.contractQuickList.scrollTop = 0;
            },
        },
    }
</script>