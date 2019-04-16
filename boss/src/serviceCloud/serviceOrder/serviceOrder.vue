<style scoped>
    .tab-head{
        position: relative;
        height:50px;
        border-bottom: solid 1px #f6f6f6;
        display: inline-block;
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
    .service-item{
        width: 100%;
        height: 100px;
        border: 1px solid #e5e5e5;
        background-color: white;
        font-size: 14px;
        /*padding: 5px;*/
        margin-top: 5px;
    }
    .service-item-selected{
        border: 1px solid #59b399;
    }
    .service-item-mask{
        position: relative;
        top: -102px;
        width: 100%;
        height: 98px;
        background-color: #666666;
        opacity: 0.5;
    }
    .service-item-mask-selected{
        position: relative;
        top: -102px;
        width: 100%;
        height: 98px;
        background-color: #666666;
        opacity: 0;
    }
    .service-state {
        width: 0;
        height: 0;
        border-top: 40px solid #FF6464;
        border-left: 40px solid transparent;
        float: right;
        margin-top: -6px;
        margin-right: -5px;
    }
    .service-state > span{
        position: relative;
        right: 18px;
        top: -36px;
        font-size: 14px;
        color: white;
    }
    .service-no-selected-state{
        width: 0;
        height: 0;
        border-top: 40px solid #5d5d5d;
        border-left: 40px solid transparent;
        float: right;
        margin-top: -6px;
        margin-right: -5px;
    }
    .service-selected-state{
        border-top: 40px solid #59b399;
    }
    .service-select-icon{
        position: relative;
        top: -38px;
        right: 20px;
        font-size: 18px;
        color: white;
    }
    .service-item-saleOrgName:hover{
        color: #59b399;
    }
    .service-item-saleOrgName >>> .ivu-tooltip-inner {
        max-width: 250px;
        min-height: 34px;
        padding: 8px 12px;
        color: #fff;
        text-align: left;
        text-decoration: none;
        background-color: rgba(70,76,91,.9);
        border-radius: 4px;
        box-shadow: 0 1px 6px rgba(0,0,0,.2);
        white-space: normal;
    }
    .no-service{
        position: relative;
        width: 100%;
        height: 500px;
        padding-top: 253px;
        padding-bottom: 20px;
        background: #FFF url("../../signCloud/image/no-contract.png") center 100px no-repeat;
        text-align: center;
        font-size: 16px;
    }
</style>
<style>

</style>
<template>
    <div class="container">
        <div class="center">
            <div style="padding: 10px 50px 10px 50px">
                <i-col span="24">
                    <div style="display:inline-block;">
                        <Input :maxlength="50" v-model="searchText" style="width: 300px" icon="search" placeholder="客户名称/服务单号/客户地址" @on-keyup="getSearchText"></Input>
                    </div>
                    <div style="display:inline-block;margin-left: 20px">
                        <Select style="width: 200px" v-model="saleOrg" placeholder="派单方选择" clearable @on-change="changeSaleOrg">
                            <Option v-for="saleOrgInfo in saleOrgList" :value="saleOrgInfo.orgId" :key="saleOrgInfo.orgId">{{ saleOrgInfo.orgName }}</Option>
                        </Select>
                    </div>
                    <div style="display:inline-block;margin-left: 20px">
                        <Select style="width: 200px" v-model="serviceType" placeholder="服务单类型" clearable @on-change="changeServiceType">
                            <Option v-for="serviceTypeInfo in serviceTypeList" :value="serviceTypeInfo.id" :key="serviceTypeInfo.id">{{ serviceTypeInfo.name }}</Option>
                        </Select>
                    </div>
                </i-col>
                <i-col span="24" style="margin-top: 10px;height: 40px">
                    <div class="tab-head">
                        <div class="tab-panel clearFix">
                            <div class="tab-item" :class="{active:dealWithState=='NONE'}" @click="dealWith('NONE')">未处理</div>
                            <div class="tab-item" :class="{active:dealWithState=='ALREADY'}" @click="dealWith('ALREADY')">已处理</div>
                        </div>
                    </div>
                    <!--<div v-if="dealWithState=='NONE'" style="display: inline-block;float: right;">-->
                        <!--<Checkbox v-if="isBatchProcessing" v-model="isAll" @on-change="selectAllService">全选</Checkbox>-->
                        <!--<Button v-if="isBatchProcessing" type="primary" style="margin-left: 20px" @click="batchDealWith">处理</Button>-->
                        <!--<Button v-if="isBatchProcessing" type="primary" style="margin-left: 20px" @click="noBatchProcessing">取消管理</Button>-->
                        <!--<Button v-if="!isBatchProcessing" type="primary" style="margin-left: 20px" @click="batchProcessing">批量管理</Button>-->
                    <!--</div>-->
                </i-col>
                <i-col v-if="serviceList && serviceList.length>0" span="24">
                    <div v-for="serviceInfo in serviceList" :key="serviceInfo.id" class="service-item" :class="{'service-item-selected':serviceInfo.isSelected}">
                        <div style="padding: 5px;">
                            <div v-if="!isBatchProcessing && serviceInfo.state=='SEND_BACK_RECEIVE'" class="service-state" style="float: right">
                                <span>退</span>
                            </div>
                            <div v-if="isBatchProcessing" class="service-no-selected-state" :class="{'service-selected-state':serviceInfo.isSelected}">
                                <Icon class="service-select-icon" type="checkmark"></Icon>
                            </div>
                            <div style="margin: 0 5px 0 5px;border-bottom: 1px solid #e5e5e5">
                                <span style="margin-left: 20px;color: #999999">派单日期：</span>
                                <span>{{serviceInfo.dispatchDate | formatDate}}</span>
                                <span style="margin-left: 20px;color: #999999">服务单号：{{serviceInfo.code}}</span>
                            </div>
                            <div style="padding: 5px 0 5px 0">
                                <div style="width: 120px;height: 50px;padding: 10px;margin: 5px 5px 5px 10px;border-right: 1px solid #e5e5e5;display: inline-block">
                                    <div :title="serviceInfo.billDefName" style="width: 80px;height: 30px;line-height: 30px;text-align: center;border: 1px solid #59b399;border-radius: 5px;color: #59b399">
                                        <span>{{serviceInfo.billDefName | billDefNameLimit}}</span>
                                    </div>
                                </div>
                                <div class="service-item-saleOrgName" style="display: inline-block;width: 250px;font-weight: bold;margin-left: 20px">
                                    <Tooltip placement="top">
                                        <span>{{serviceInfo.saleOrgName | wordLengthLimit}}</span>
                                        <div slot="content">
                                            <p>派单人：{{serviceInfo.dispatcherName}}</p>
                                            <p>联系电话：{{serviceInfo.dispatcherPhone}}</p>
                                            <p>派单方：{{serviceInfo.saleOrgName}}</p>
                                        </div>
                                    </Tooltip>
                                </div>
                                <div style="display: inline-block;width: 150px;margin-left: 20px">
                                    <span>￥{{serviceInfo.settlementPrice}}</span>
                                </div>
                                <div style="display: inline-block;width: 450px;height: 60px;margin-left: 20px;position: relative;top: 10px;">
                                    <div>
                                        <span>{{serviceInfo.customerName}}</span>
                                    </div>
                                    <div style="color: #999999" :title="serviceInfo.customerAddress">
                                        <span>{{serviceInfo.customerAddress | customerAddressLimit}}</span>
                                    </div>
                                </div>
                                <div v-if="dealWithState=='NONE'" style="display: inline-block;position: absolute;right: 100px;margin-top: 15px">
                                    <Button type="primary" @click="singleDealWith(serviceInfo)">处理</Button>
                                </div>
                                <div v-if="dealWithState=='ALREADY'" style="display: inline-block;position: absolute;right: 100px;margin-top: 15px">
                                    <Button type="primary" @click="showServiceProgress(serviceInfo)">查看进度</Button>
                                </div>
                            </div>
                        </div>
                        <div v-if="isBatchProcessing" class="service-item-mask" :class="{'service-item-mask-selected':serviceInfo.isSelected}" @click="selectService(serviceInfo)">
                        </div>
                    </div>
                </i-col>
                <i-col v-else span="24">
                    <div class="no-service">
                        <span>暂无可显示的服务单记录</span>
                    </div>
                </i-col>
                <i-col v-if="this.serviceList && this.serviceList.length>0" span="24" style="margin-top: 10px">
                    <Page size="small" :total="total" :current="page" :page-size="pageSize" @on-change="changePage"></Page>
                </i-col>
            </div>
        </div>
    </div>
</template>
<script>
    import ICol from "../../../node_modules/iview/src/components/grid/col.vue";
    export default {
        components: {ICol},
        filters: {
            wordLengthLimit : function (value) {
                if(value && value.length > 15){
                    return value.substring(0,15) + "..." ;
                }
                return value;
            },
            billDefNameLimit : function (value) {
                if(value && value.length > 5){
                    return value.substring(0,4) + "..." ;
                }
                return value;
            },
            customerAddressLimit : function (value) {
                if(value && value.length > 30){
                    return value.substring(0,30) + "..." ;
                }
                return value;
            },
            formatDate(time) {
                var date = new Date(time);
                return date.format('yyyy/MM/dd');
            }
        },
        created: function () {
            this.getSaleOrgList();
            this.getServiceTypeList();
            this.getServiceList();
        },
        data () {
            return {
                total: 0,
                page: 1,
                pageSize: 10,
                isAll: false,
                isBatchProcessing: false,
                dealWithState: "NONE",
                searchText: null,
                saleOrg: null,
                serviceType: null,
                saleOrgList: [],//派单方
                serviceTypeList: [],//服务单类型
                selectedSaleOrg: null,//选中的派单方
                selectedServiceType: null,//选中的服务单类型
                serviceList: [],//服务单列表
            }
        },
        methods:{
            dealWith (dealWithState) {
                this.dealWithState = dealWithState;
                this.searchText = null;
                this.saleOrg = null;
                this.serviceType = null;
                if(dealWithState == "ALREADY"){
                    this.isAll = false;
                    this.isBatchProcessing = false;
                }
                this.page = 1;
                this.getServiceList();
            },
            getSaleOrgList () {
                this.request({
                    url: "/serviceCloud/serviceOrder/getSaleOrgList.do"
                }).then((data)=>{
                    if(data && data.length>0){
                        this.saleOrgList = data;
                    }
                });
            },
            getServiceTypeList () {
                this.request({
                    url: "/serviceCloud/serviceOrder/getServiceTypeList.do"
                }).then((data)=>{
                    if(data && data.length>0){
                        this.serviceTypeList = data;
                    }
                });
            },
            getServiceList () {
                this.request({
                    url: "/serviceCloud/serviceOrder/getServiceList.do",
                    data: {
                        status: this.dealWithState,
                        searchContent: this.searchText,
                        saleOrgId: this.saleOrg,
                        billDefId: this.serviceType,
                        page: this.page
                    }
                }).then((data)=>{
                    if(data && data.records && data.records.length>0){
                        for(var i =0;i<data.records.length;i++){
                            data.records[i].isSelected = false;
                        }
                        this.serviceList = data.records;
                        this.page = data.current;
                        this.total = data.total;
                    }else{
                        this.serviceList = [];
                        if(data && data.total > 0 && data.records && data.records.length == 0){
                            this.page = 1;
                            this.getServiceList();
                            this.noBatchProcessing();
                        }
                    }
                    if(this.isBatchProcessing == true){
                        this.isAll = false;
                    }
                });
            },
            changePage (page) {
                this.isAll = false;
                this.page = page;
                this.getServiceList();
            },
            getSearchText () {
                this.getServiceList();
            },
            changeSaleOrg () {
                this.getServiceList();
            },
            changeServiceType () {
                this.getServiceList();
            },
            batchProcessing () {
               this.isBatchProcessing = true;
            },
            noBatchProcessing () {
                this.isBatchProcessing = false;
                this.isAll = false;
                for(var i=0;i<this.serviceList.length;i++){
                    if(this.serviceList[i].isSelected == true){
                        this.serviceList[i].isSelected = false;
                    }
                }
            },
            selectService (serviceInfo) {
                serviceInfo.isSelected = !serviceInfo.isSelected;
                var flag = true;
                for(var i=0;i<this.serviceList.length;i++){
                    if(this.serviceList[i].isSelected == false){
                        flag = false;
                    }
                }
                if(flag){
                    this.isAll = true;
                }else{
                    this.isAll = false;
                }
            },
            selectAllService() {
                if(this.isAll){
                    for(var i=0;i<this.serviceList.length;i++){
                        this.serviceList[i].isSelected = true;
                    }
                }else{
                    for(var i=0;i<this.serviceList.length;i++){
                        this.serviceList[i].isSelected = false;
                    }
                }
            },
            getSelectedList () {
                var selectedList = [];
                for(var i=0;i<this.serviceList.length;i++){
                    if(this.serviceList[i].isSelected){
                        selectedList.push(this.serviceList[i]);
                    }
                }
                return selectedList;
            },
            //单一服务单处理
            singleDealWith (serviceInfo) {
                this.card({
                    title: "",
                    code: "OrderOrRefuse",
                    width: 700,
                    props: {
                        serviceOrderId: serviceInfo.id,
                    },
                    callback: () => {
                        this.getServiceList();
                    }
                });
            },
            batchDealWith () {
                var vm = this;
                var selectedList = this.getSelectedList();
                if(selectedList && selectedList.length>0){
                    this.card({
                        title: "",
                        code: "OrderOrRefuseBatch",
                        width: 700,
                        props: {
                            selectedList: selectedList
                        },
                        callback: () => {
                            vm.getServiceList();
                        }
                    });
                }else{
                    this.$Message.error("请选择要进行批量处理的服务单！");
                }
            },
            showServiceProgress (serviceInfo) {
                this.card({
                    title: "",
                    code: "ServiceProgress",
                    width: 700,
                    props: {
                        serviceId: serviceInfo.id
                    },
                });
            },
        },

    }
</script>