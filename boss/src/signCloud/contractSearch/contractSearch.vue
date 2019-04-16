<style scoped>
    .container {
        display: inline-block;
    }
    .quick-select {
        line-height: 30px;
    }
    .search-input-out {
        width: 260px;
        display: inline-block;
    }
    .search-input-out >>> .ivu-input{
        display: inline-block;
        width: 100%;
        height: 32px;
        line-height: 1.5;
        font-size: 14px;
        border: 1px solid #59b399;
        border-radius: 4px;
        color: #495060;
        background-color: #fff;
        background-image: none;
        position: relative;
        cursor: text;
    }
    .search-input-out >>> .ivu-input-icon {
        width: 32px;
        height: 32px;
        line-height: 32px;
        font-size: 20px;
        text-align: center;
        color: #59b399;
        position: absolute;
        right: 0;
        z-index: 3;
    }
    .search-input-out:hover,
    .search-input-out:focus {
        border-color: #59b399;
    }
    .layer {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, .5);
        z-index: 20;
    }
    .acquiescence {
        position: relative;
        width: 700px;
        margin: 50px auto 0px auto;
        padding: 15px 15px 0px 15px;
        background: white;
        border-radius: 5px 5px 0px 0px;
        display: flow-root;
    }
    .acquiescence .search-input {
        width: 100%;
        margin: 0;
        border: 1px solid #59b399;
        line-height: 26px;
        border-radius: 5px;
        font-size: 14px;
        color: black;
        font-weight: 600;
    }
    .acquiescence .search-input >>> .ivu-input{
        display: inline-block;
        width: 100%;
        height: 31px;
        line-height: 1.5;
        font-size: 12px;
        border: 0 solid #dddee1;
        border-radius: 4px;
        color: #495060;
        background-color: #fff;
        background-image: none;
        position: relative;
        cursor: text;
        transition: border .2s ease-in-out,background .2s ease-in-out,box-shadow .2s ease-in-out;
    }
    .acquiescence .search-input >>> .ivu-input-icon {
        width: 32px;
        height: 32px;
        line-height: 32px;
        font-size: 20px;
        text-align: center;
        color: #59b399;
        position: absolute;
        right: 0;
        z-index: 3;
    }
    .acquiescence .date-range{
        margin-top: 10px;
        margin-bottom: 10px;
        height: 32px;
        line-height: 0px;
        display: inline-block;
    }
    .acquiescence .date-range .date-range-input >>> .ivu-input{
        display: inline-block;
        width: 250px;
        height: 32px;
        line-height: 1.5;
        padding: 4px 7px;
        font-size: 14px;
        border: 1px solid #dddee1;
        border-radius: 4px;
        color: #495060;
        background-color: #fff;
        background-image: none;
        position: relative;
        cursor: text;
        transition: border .2s ease-in-out,background .2s ease-in-out,box-shadow .2s ease-in-out;
    }
    .date-range-input >>> input::-webkit-input-placeholder {
        color:#bbbec4;
        font-weight: 100;
        font-size: 14px;
    }
    .date-range-input >>> input:-moz-placeholder {
        color:#bbbec4;
        font-weight: 100;
        font-size: 14px;
    }
    .date-range-input >>> input::-moz-placeholder {
        color:#bbbec4;
        font-weight: 100;
        font-size: 14px;
    }
    .date-range-input >>> input:-ms-input-placeholder {
        color:#bbbec4;
        font-weight: 100;
        font-size: 14px;
    }
    input::-webkit-input-placeholder {
        color:#bbbec4;
        font-weight: 100;
        font-size: 14px;
    }
    input:-moz-placeholder {
        color:#bbbec4;
        font-weight: 100;
        font-size: 14px;
    }
    input::-moz-placeholder {
        color:#bbbec4;
        font-weight: 100;
        font-size: 14px;
    }
    input:-ms-input-placeholder {
        color:#bbbec4;
        font-weight: 100;
        font-size: 14px;
    }
    .contract-list{
        position: absolute;
        width: 700px;
        bottom: 50px;
        overflow-y: auto;
        left: 50%;
        margin-left: -350px;
        padding: 15px;
        background: white;
        border-radius: 0px 0px 5px 5px;
    }
    .contract-no-list{
        position: absolute;
        width: 700px;
        height: 400px;
        text-align: center;
        left: 50%;
        margin-left: -350px;
        padding: 15px;
        background: white;
        border-radius: 0px 0px 5px 5px;
    }
    .contract-page{
        margin-top: 10px;
    }
    .item_name{
        border: 1px solid #59b399;
        border-radius: 4px;
        padding: 1px 5px 0px 6px;
        font-size: 12px;
        width: 40px;
        line-height: 18px;
    }
    .contract-list-item{
        color: #59b399;
        font-size: 12px;
    }
    .contract-list-item:hover{
        background-color: #59b399;
        color: white;
    }
    .contract-list-item:hover .item_name{
        border: 1px solid white;
    }
    .no-change{
        position: relative;
        width: 455px;
        height: 250px;
        background: #f6f6f6 url("../image/no-contract.png") center 105px no-repeat;
        background-color: white;
        text-align: center;
        font-size: 16px;
    }
    .no-find-contract{
        position: relative;
        width: 455px;
        height: 250px;
        background: #f6f6f6 url("../image/no-find-contract.png") center 105px no-repeat;
        background-color: white;
        text-align: center;
        font-size: 16px;
    }
</style>

<template>
    <div class="container">
        <div style="background-color: #f6f6f6">
            <Input icon="search" class="search-input-out" @on-focus="openacquiescence" v-model="searchText" placeholder="甲方/合约编号/业务员"></Input>
        </div>
        <div class="layer" v-show="acquiescenceShow" @click.self="hideacquiescence">
            <div class="acquiescence">
                <div v-if="showSignState" style="padding-bottom: 10px">
                    <div style="display: inline-block">
                        <span>合约状态:</span>
                    </div>
                    <div style="display: inline-block;margin-left: 24px">
                        <Checkbox-Group v-model="selectedState" @on-change="changeSelectedState">
                            <Checkbox v-if="contractState.visible" v-for="(contractState,index) in condition.state" :label="contractState.code" :value="contractState.code" :key="index">{{contractState.name}}</Checkbox>
                        </Checkbox-Group>
                    </div>
                    <!--<div style="display: inline-block;float: right;margin-bottom: 5px">-->
                        <!--<Button type="primary" size="small" @click="reinstate">重置</Button>-->
                    <!--</div>-->
                </div>
                <div v-if="isShowDate" style="height: 52px;line-height: 52px;display: inline-block">
                    <div v-if="isShowDate" class="date-range" :style="{'margin-left':showInvoiceState?'15px':'0'}">
                        <div style="display: inline-block;font-size: 14px">
                            <span>签约起止时间:</span>
                        </div>
                        <DatePicker class="date-range-input" @on-change="changeDateRange" v-model="selectedDateRange" type="daterange" placement="bottom-start" placeholder="签约起止时间"></DatePicker>
                        <div style="display: inline-block;margin-left: 20px">
                            <span v-if="condition.state[0].code=='SIGNED'">发起解约查询</span>
                            <span v-if="condition.state[0].code=='TERMINATION'">已解约查询</span>
                        </div>
                    </div>
                </div>
                <div style="padding-bottom: 10px">
                    <Input icon="search" class="search-input" ref="input" v-model="searchText" placeholder="甲方/合约编号/业务员" @on-keyup="getSearchText"/>
                </div>
            </div>
            <div v-if="noFindTemp" class="contract-no-list">
                <div class="no-change">
                    <span style="position: relative;top: 150px;font-size: 14px;color: #cccccc;right: -170px;">请输入内容搜索您要处理的合约</span>
                </div>
            </div>
            <div v-if="!noFindTemp && (!this.contractList || this.contractList.length==0)" class="contract-no-list">
                <div class="no-find-contract">
                    <span style="position: relative;top: 150px;font-size: 14px;color: #cccccc;right: -170px;">该条件暂无匹配结果</span>
                </div>
            </div>
            <div ref="contractList" v-if="this.contractList && this.contractList.length>0" class="contract-list" :style="{top: this.contractListHeight}">
                <div @click="selectContract(contractInfo)" v-for="(contractInfo, index) in contractList" :key="index" class="contract-list-item">
                    <div style="margin-bottom: 10px;margin-left: 10px;padding-top: 5px;font-weight: bold;font-size: 14px">
                        <span>{{contractInfo.contract_name}}</span>
                    </div>
                    <div style="display: inline-block;width: 100px;margin-left: 10px">
                        <span>{{contractInfo.contract_code}}</span>
                    </div>
                    <div style="display: inline-block;width: 100px;">
                        <span>￥{{contractInfo.contract_price}}</span>
                    </div>
                    <div style="display: inline-block;;width: 80px;">
                        <span>{{contractInfo.contract_status_name}}</span>
                    </div>
                    <div style="display: inline-block;width: 70px;">
                        <div class="item_name">
                            <span>{{contractInfo.item_name}}</span>
                        </div>
                    </div>
                    <div style="display: inline-block;">
                        <span>{{contractInfo.salesman_name}}</span>
                    </div>
                    <hr style="margin-top: 5px;border-top: 1px #dddee1;"/>
                </div>
                <Page class="contract-page" size="small" :total="total" :current="current" @on-change="changePage"></Page>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">
    export default {
        props: {
            condition: null,
            isShowDate: {
                type: Boolean,
                default: false
            },
            isShowQuick: {
                type: Boolean,
                default: false
            },
            isMyOwn: {
                type: Boolean,
                default: false
            },
            isContractOrg: {
                type: Boolean,
                default: true
            },
            isSubjectBOrg: {
                type: Boolean,
                default: null
            },
            isChanging: {
                type: Boolean,
                default: false
            },
            isInitialSearch: {
                type: Boolean,
                default: false
            },
            noFind: {
                type: Boolean,
                default: true
            },
            isPayee: {
                type: Boolean,
                default: false
            },
        },
        data () {
            return {
                showSignState: false,
                showInvoiceState: false,
                acquiescenceShow: false,
                searchText: null,
                baseState:[],
                selectedState:[],
                tempSelectedState:[],
                dateRange: null,
                originalCondition: [],
                selectedDateRange:"",
                contractList:[],
                contractQuickList:[],
                total: 0,
                current: 1,
                isShowContractList: false,
                contractListHeight:105,
                noFindTemp: false
            }
        },
        created () {
            this.noFindTemp = this.noFind;
            this.originalCondition = this.condition;
            for(var i=0;i<this.condition.state.length;i++){
                if(this.condition.state[i].isBasis){
                    this.baseState.push(this.condition.state[i].code);
                }
                if(this.condition.state[i].visible){
                    this.showSignState = true;
                }
            }
            if(this.isShowDate && this.showSignState){
                this.contractListHeight = "188px";
            }else if (this.isShowDate && !this.showSignState){
                this.contractListHeight = "155px";
            }else if(!this.isShowDate && this.showSignState){
                this.contractListHeight = "135px";
            }else if(!this.isShowDate && !this.showSignState){
                this.contractListHeight = "105px";
            }
            this.renderState(this.condition);
        },
        methods: {
            openacquiescence () {
                this.acquiescenceShow = true;
                this.$nextTick(() => {
                    this.$refs.input.focus();
                });
                if(this.isInitialSearch){
                    this.searchContractList(1);
                }
            },
            hideacquiescence () {
                this.acquiescenceShow = false;
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
                this.searchContractList();
                this.$refs.contractList.scrollTop = 0;
                if(this.isShowContractList && this.contractQuickList && this.contractQuickList.length>0){
                    this.$refs.contractQuickList.scrollTop = 0;
                }
            },
            renderState (condition) {
                this.selectedState.splice(0,this.selectedState.length);
                if(condition && condition.state){
                    for(let i=0;i<condition.state.length;i++){
                        if(condition.state[i].visible && condition.state[i].selected){
                            this.selectedState.push(condition.state[i].code);
                        }
                    }
                }
            },
            changeSelectedState (){
                this.searchContractList(1);
            },
            changeSelectedInvoiceState () {
                this.searchContractList(1);
            },
            getSearchText (event) {
                if(event.keyCode == 13){
                    this.$emit("contract-list",[this.contractList,this.current,this.total,this.selectedState]);
                    this.hideacquiescence();
                }else{
                    this.searchContractList(1);
                }
            },
            changeDateRange (dateRangeArray) {
                if(dateRangeArray && dateRangeArray.length>1){
                    if(dateRangeArray[0] == "" || dateRangeArray[0] == undefined || dateRangeArray[1] == "" || dateRangeArray[1] == undefined){
                        this.selectedDateRange = null;
                    }else{
                        this.selectedDateRange = dateRangeArray;
                    }
                }
                this.searchContractList(1);
            },
            searchContractList(currentPage){
                if(this.noFindTemp){
                    this.noFindTemp = false;
                }
                var vm = this;
                var startDate = "";
                var endDate = "";
                if(currentPage){
                    this.current = currentPage;
                }
                if(this.isShowDate && this.selectedDateRange && this.selectedDateRange.length>1){
                    startDate = new Date(this.selectedDateRange[0]).format("yyyy-MM-dd");
                    endDate = new Date(this.selectedDateRange[1]).format("yyyy-MM-dd");
                }
                if(this.selectedState==null || this.selectedState==[] || this.selectedState.length == 0){
                    this.tempSelectedState = null;
                }else{
                    this.tempSelectedState = this.selectedState;
                }
                if(this.baseState==null || this.baseState==[] || this.baseState.length == 0){
                    this.baseState = null;
                }
//                if(this.selectedInvoiceState==null || this.selectedInvoiceState==[] || this.selectedInvoiceState.length == 0){
//                    this.tempSelectedInvoiceState = null;
//                }else{
//                    this.tempSelectedInvoiceState = this.selectedInvoiceState;
//                }
                this.request({
                    url: "/signCloud/contractSearch/searchContractList.do",
                    data: {
                        myOwn: this.isMyOwn,
                        searchStatus: this.tempSelectedState,
                        baseStatus: this.baseState,
                        invoiceStatus: null,
                        nameOrCode: this.searchText,
                        signedStartDate: startDate,
                        signedEndDate: endDate,
                        current: this.current,
                        isContractOrg: this.isContractOrg,
                        isSubjectBOrg: this.isSubjectBOrg,
                        isChanging: this.isChanging,
                        isPayee: this.isPayee
                    },
                    loading: false
                }).then(items => {
                    if(items && items.records){
                        for(var i=0;i<items.records.length;i++){
                            items.records[i].item_name = items.records[i].item_name.substring(0,2);
                            items.records[i].contract_status_name = this.getContractStatusName(items.records[i].contract_status);
                        }
                        vm.contractList = items.records;
                        vm.contractQuickList = items.records;
                        vm.current = items.current;
                        vm.total = items.total;
                        vm.quickCurrent = items.current;
                        vm.quickTotal = items.total;
                    }
                });
            },
            selectContract (contractInfo) {
                this.$emit("selected-contract",contractInfo);
                this.hideacquiescence();
            },
        }
    }
</script>