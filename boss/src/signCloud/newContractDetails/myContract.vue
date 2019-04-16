<style scoped>
    .container {
        background: #f6f6f6;
    }
    .no-contract{
        position: absolute;
        width: 100%;
        height: 500px;
        top: 50%;
        transform: translateY(-50%);
        background: #f6f6f6 url("../image/no-contract.png") center 100px no-repeat;
        text-align: center;
        font-size: 16px;
    }
    .no-contract > span{
        position: relative;
        top: 220px;
    }
    .panel {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        padding: 7px;
        background: white;
        /*border-bottom: solid 1px #dddee1;*/
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
    .center {
        position: absolute;
        top: 45px;
        left: 300px;
        right: 0;
        bottom: 0;
        background: #f7f7f7;
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
    .contract-item-service-type{
        width: 35px;
        background-color: #ffc172;
        border-radius: 4px;
        padding: 1px 5px 0px 5px;
        font-size: 12px;
        color: white;
    }
    .selected .contract-item-service-type{
        background-color: #59b399;
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
    .my-contract-page{
        margin-top: 5px;
    }
    .my-contract-page.ivu-page.mini >>> .ivu-page-item{
        border: 0;
        margin: 0;
        min-width: 15px;
        height: 24px;
        line-height: 24px;
        border-radius: 3px;
    }
    .my-contract-page.ivu-page.mini >>> .ivu-page-item a {
         margin: 0 0;
        text-decoration: none;
        color: #495060;
    }

    .left >>> .ivu-poptip-popper {
        width: 260px;
    }

    .left >>> .ivu-poptip-body {
        padding: 18px 16px;
    }

    .contract-process {
        position: absolute;
        top: 20px;
        right: 20px;
        font-size: 11px;
        color: #696464;
        /*font-weight: normal;*/
    }

    .contract-process .title-flag:hover {
        color: #FF9800;
    }

    .contract-process-title {
        font-size: 12px;
        color: #59b399;
        font-weight: bold;
    }

    .contract-process-title::before {
        content: '.';
        font-size: 30px;
        line-height: 20px;
        vertical-align: baseline;
        margin-right: 5px;
        color: #000;
    }
</style>
<template>
    <div class="container">
        <div class="panel">
            <Search :condition="condition" :noFind="false" :isInitialSearch="true" :isShowQuick="false" :isMyOwn="true" :isShowDate="false" @contract-list="returnContractList" @selected-contract="getSelectedContractInfo"></Search>
        </div>
        <div class="left" v-if="this.contractQuickList.length>0" ref="contractQuickList">
            <div class="contract-list-item" :class="{selected: contractQuickInfo == contract}" @click="selectContract(contractQuickInfo)" v-for="(contractQuickInfo, index) in contractQuickList" :key="index">
                <div :title="contractQuickInfo.contract_name" style="margin-bottom: 10px;padding-top: 5px;font-weight: bold;color: #333;font-size: 14px">
                    <span>{{contractQuickInfo.contract_name | wordLengthLimit}}</span>
                </div>
                <Poptip v-if="contractQuickInfo.contract_status!='NONE'" placement="bottom-end" trigger="hover" class="contract-process">
                    <span class="title-flag">合约进度</span>
                    <span slot="title" class="contract-process-title">合约进度：{{contractQuickInfo.contract_status_name}}</span>
                    <div slot="content">
                        <template v-if="contractQuickInfo.contract_status!='COMMITTED'">
                            <p v-for="(item, index) in contractQuickInfo.contractProcessList" :key="index" style="color: #474646;white-space: normal;">{{item}}</p>
                        </template>
                        <template v-else>
                            <p style="padding: 5px 0;font-weight: bold;">可联系审核人员进行合约审核：</p>
                            <div v-for="(item, index) in contractQuickInfo.contractProcessList" :key="index" style="display: flex;color: #474646;">
                                <span style="flex: 1;text-align: right;">{{item.name}}：</span>
                                <span style="flex: 1;text-align: left;">{{item.phone}}</span>
                            </div>
                        </template>
                    </div>
                </Poptip>
                <div v-if="contractQuickInfo.approved_type=='CANCEL'" class="change-red">
                    <span>取</span>
                </div>
                <div v-if="contractQuickInfo.approved_type=='REJECTED'" class="change-red">
                    <span>驳</span>
                </div>
                <div style="display: inline-block;width: 40px;">
                    <span>￥{{contractQuickInfo.contract_price.toFixed(2)}}</span>
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
            <Page class="my-contract-page" size="small" :page-size="pageSize" :total="total" :current="current" @on-change="changePage"></Page>
        </div>
        <div class="center" v-if="this.contractQuickList.length==0" >
            <div v-if="this.contractQuickList.length==0" class="no-contract">
                <span>暂无可显示的合约记录</span>
            </div>
        </div>
        <div class="center" v-if="this.contractId && this.contract.contract_status == 'NONE'" >
            <ContractPerfect :contractId="this.contractId" :defId="this.contract.contract_def_id" :contractType="this.contract.contract_def_code"></ContractPerfect>
        </div>
        <div class="center" v-if="this.contractId && this.contract.contract_status == 'COMMITTED'" >
            <NewAudit :contractInfo="this.contract"></NewAudit>
        </div>
        <div class="center" v-if="this.contractId && (this.contract.contract_status == 'APPROVED' || this.contract.contract_status == 'SIGNING' || this.contract.contract_status == 'SIGNED' || this.contract.contract_status == 'TERMINATION')">
            <NewContractDetails :contractId="this.contractId"></NewContractDetails>
        </div>
    </div>
</template>

<script>
    import Option from "../contractSearch/SearchOption";
    import Search from "../contractSearch/contractSearch.vue";
    import NewContractDetails from "../newContractDetails/newContractDetails.vue";
    import NewAudit from "../audit/newAudit.vue";
    import ContractPerfect from "../newContractDetails/contractPerfect.vue";
    export default {
        components: {
            Search,
            NewContractDetails,
            NewAudit,
            ContractPerfect
        },
        filters: {
            formatDate(time) {
                var date = new Date(time);
                return date.format('yyyy-MM-dd');
            },
            wordLengthLimit : function (value) {
                if(value && value.length > 10){
                    return value.substring(0,10) + "..." ;
                }
                return value;
            }
        },
        data: function() {
            return {
                contractId: null,
                contract: {},
                contractQuickList: [],
                total: 0,
                current: 1,
                pageSize: 10,
                baseState:[],
                selectedState:[],
                condition: new Option(
                    Option.addNone(true,true,true),
                    Option.addCommited(true,true,true),
                    Option.addApproved(true,true,true),
                    Option.addSigning(true,true,true),
                    Option.addSigned(true,true),
                    Option.addTermination(true,true),
                )
            }
        },
        created: function () {
            this.$api.newApiContractList = this.initApiContract;
//            this.$set(this,"baseState",["NONE", "COMMITTED", "APPROVED", "SIGNING"]);
//            this.$set(this,"selectedState",["NONE", "COMMITTED", "APPROVED", "SIGNING"]);
            this.selectedState.splice(0,this.selectedState.length);
            for(var i=0;i<this.condition.state.length;i++){
                if(this.condition.state[i].isBasis){
                    this.baseState.push(this.condition.state[i].code);
                }
                if(this.condition.state[i].visible && this.condition.state[i].selected){
                    this.selectedState.push(this.condition.state[i].code);
                }
            }
            this.initContract();
        },
        methods: {
            initApiContract: function () {
                this.initContract();
            },
            initContract: function () {
                if(this.selectedState==null || this.selectedState==[] || this.selectedState.length == 0){
                    this.selectedState = null;
                }
                if(this.baseState==null || this.baseState==[] || this.baseState.length == 0){
                    this.baseState = null;
                }
                this.request({
                    url: "/signCloud/contractSearch/searchContractList.do",
                    data: {
                        myOwn: true,
                        searchStatus: this.selectedState,
                        baseStatus: this.baseState,
                        invoiceStatus: null,
                        nameOrCode: null,
                        signedStartDate: null,
                        signedEndDate: null,
                        current: this.current,
                        isContractOrg: true,
                        isSubjectBOrg: null,
                        isChanging: false
                    },
                    loading: false
                }).then(items => {
                    if(items && items.records){
                        for(var i=0;i<items.records.length;i++){
                            items.records[i].temp_item_name = items.records[i].item_name;
                            items.records[i].item_name = items.records[i].item_name.substring(0,2);
                            items.records[i].contractProcessList = new Array();
                            items.records[i].contract_status_name = this.getContractStatusName(items.records[i].contract_status, items.records[i]);
                        }
                        this.contractQuickList = items.records;
                        if(items.records.length>0){
                            this.current = items.current;
                            this.total = items.total;
                            if(this.contractQuickList && this.contractQuickList.length>0){
                                this.selectContract(this.contractQuickList[0]);
                            }
                        }else{
                            this.contractId = null;
                        }
                    }
                });
            },
            getContractStatusName (contract_status, item) {
                var contract_status_name="";
                if(contract_status=='NONE'){
                    contract_status_name='待提交';
                }else if(contract_status=='COMMITTED'){
                    contract_status_name='待审核';
                    if (item) {
                        this.getApproveUsers(item);
                    }
                }else if(contract_status=='APPROVED'){
                    contract_status_name='已核准';
                    if (item) {
                        if(item.approved_user_name == "超级管理员"){
                            item.contractProcessList.push('审核人员： 系统自动审核');
                        }else{
                            item.contractProcessList.push('审核人员：' + item.approved_user_name + ' ' + item.approved_user_phone);
                        }
                        if(item.approval_date){
                            item.contractProcessList.push('审核时间：' + item.approval_date.substring(0,10));
                        }else{
                            item.contractProcessList.push('审核时间： 暂无');
                        }
//                        item.contractProcessList.push('审核时间：' + window.DateFormat.dateToString(new Date(item.approval_date), 'yyyy-MM-dd'));
                    }
                }else if(contract_status=='SIGNING'){
                    contract_status_name='签约中';
                    if (item) {
                        item.contractProcessList.push('甲方：' + item.csa_name);
                        item.contractProcessList.push('乙方：' + item.csb_name);
                    }
                }else if(contract_status=='SIGNED'){
                    contract_status_name='已签署';
                    if (item) {
                        if(item.signed_date){
                            item.contractProcessList.push('签约时间：' + item.signed_date.substring(0,10));
                        }else{
                            item.contractProcessList.push('签约时间： 暂无');
                        }
//                        item.contractProcessList.push('签约时间：' + window.DateFormat.dateToString(new Date(item.signed_date), 'yyyy-MM-dd'));
                    }
                }else if(contract_status=='TERMINATION'){
                    contract_status_name='已解约';
                    if (item) {
                        if (item.termination_user_name && item.termination_user_name != null && item.termination_user_name != undefined) {
                            item.contractProcessList.push('解约人员：' + item.termination_user_name + ' ' + item.termination_user_phone);
                        }
                        if(item.termination_date){
                            item.contractProcessList.push('解约时间：' + item.termination_date.substring(0,10));
                        }else{
                            item.contractProcessList.push('解约时间： 暂无');
                        }
//                        item.contractProcessList.push('解约时间：' + window.DateFormat.dateToString(new Date(item.termination_date), 'yyyy-MM-dd'));
                    }
                }
                return contract_status_name;
            },
            changePage (current) {
                this.current = current;
                this.initContract();
                this.$refs.contractQuickList.scrollTop = 0;
            },
            selectContract (contractQuickInfo) {
                this.contract = contractQuickInfo;
                this.$set(this.contract,"id",contractQuickInfo.contract_id);
                this.contractId = null;
                this.$nextTick(function () {
                    this.contractId = contractQuickInfo.contract_id;
                });
            },
            getSelectedContractInfo (contractInfo) {
                contractInfo.contractProcessList = new Array();
                contractInfo.contract_status_name = this.getContractStatusName(contractInfo.contract_status, contractInfo);
                var selectedContractInfo = [contractInfo];
                this.contractQuickList = selectedContractInfo;
                this.selectContract(contractInfo);
                this.current = 1;
                this.total = 1;
            },
            returnContractList (data) {
                var returnContractList = data[0];
                for(var i=0;i<returnContractList.length;i++){
                    returnContractList[i].temp_item_name = returnContractList[i].item_name;
                    returnContractList[i].item_name = returnContractList[i].item_name.substring(0,2);
                    returnContractList[i].contractProcessList = new Array();
                    returnContractList[i].contract_status_name = this.getContractStatusName(returnContractList[i].contract_status, returnContractList[i]);
                }
                this.contractQuickList = returnContractList;
                this.total = data[2];
                this.current = data[1];
                this.selectedState = data[3];
                if(this.contractQuickList && this.contractQuickList.length>0){
                    this.selectContract(this.contractQuickList[0]);
                }
            },
            getApproveUsers(itemData) {
                this.request({
                    url: "/signCloud/contractSearch/getApproveUsers.do",
                    param: {
                        contractId: itemData.contract_id
                    }
                }).then(items => {
                    if (items) {
                        items.forEach(item => {
                            itemData.contractProcessList.push({
                                name: item.name,
                                phone: item.phone
                            });
                        });
                    }else {
                        itemData.contractProcessList.push('暂无可联系审核人员信息');
                    }
                });
            }
        }
    }
</script>