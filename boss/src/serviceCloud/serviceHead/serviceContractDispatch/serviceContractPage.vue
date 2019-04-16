<style scoped>
    .conditions-head{
        display:inline-block;
        margin-left: 5px;
    }
    .conditions-head-selected{
        width: 200px;
    }
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
        background: #FFF url("../../../signCloud/image/no-contract.png") center 100px no-repeat;
        text-align: center;
        font-size: 16px;
    }
    .again-dispatching{
        display: inline-block;
        position: absolute;
        right: 100px;
        margin-top: 15px;
    }
    .again-dispatching >>> .ivu-btn.ivu-btn-ghost {
        background: transparent;
        color: #59b399;
        border-color: #59b399;
    }
</style>
<template>
    <div class="container">
        <div class="center">
            <div style="padding: 10px 50px 10px 50px">
                <i-col span="24">
                    <div style="display:inline-block;">
                        <Input :maxlength="50" v-model="searchText" style="width: 300px" icon="search" placeholder="客户名称/服务单号/客户地址"></Input>
                    </div>
                    <div class="conditions-head">
                        <Select class="conditions-head-selected" v-model="saleOrg" placeholder="派单方选择" clearable>
                            <Option v-for="saleOrgInfo in saleOrgList" :value="saleOrgInfo.orgId" :key="saleOrgInfo.orgId">{{ saleOrgInfo.orgName }}</Option>
                        </Select>
                    </div>
                    <div class="conditions-head">
                        <Select class="conditions-head-selected" v-model="serviceType" placeholder="服务单类型" clearable>
                            <Option v-for="serviceTypeInfo in serviceTypeList" :value="serviceTypeInfo.id" :key="serviceTypeInfo.id">{{ serviceTypeInfo.name }}</Option>
                        </Select>
                    </div>
                    <div class="conditions-head">
                        <Select ref="servicePersonnel" class="conditions-head-selected" v-model="servicePersonnel" placeholder="服务人员" clearable>
                            <Option v-for="servicePersonnelInfo in servicePersonnelList" :value="servicePersonnelInfo.id" :key="servicePersonnelInfo.id">{{ servicePersonnelInfo.realName }}</Option>
                        </Select>
                    </div>
                    <div class="conditions-head">
                        <DatePicker clearable class="conditions-head-selected" v-model="startAndEndDate" type="daterange" placement="bottom-end" placeholder="查询起止时间" @on-change="selectRangeDate"></DatePicker>
                    </div>
                    <div class="conditions-head">
                        <Button type="primary" @click="getServiceList">查询</Button>
                    </div>
                </i-col>
                <i-col span="24" style="margin-top: 10px;height: 40px">
                    <div class="tab-head">
                        <div class="tab-panel clearFix">
                            <div class="tab-item" :class="{active:dealWithState=='NONE_RECEIVE'}" @click="dealWith('NONE_RECEIVE')">未派工</div>
                            <div class="tab-item" :class="{active:dealWithState=='ALREADY_RECEIVE'}" @click="dealWith('ALREADY_RECEIVE')">已派工</div>
                        </div>
                    </div>
                    <!--<div v-if="dealWithState=='NONE_RECEIVE'" style="display: inline-block;float: right;">-->
                    <!--<Checkbox v-if="isBatchProcessing" v-model="isAll" @on-change="selectAllService">全选</Checkbox>-->
                    <!--<Button v-if="isBatchProcessing" type="primary" style="margin-left: 20px" @click="batchDealWith">处理</Button>-->
                    <!--<Button v-if="isBatchProcessing" type="primary" style="margin-left: 20px" @click="noBatchProcessing">取消管理</Button>-->
                    <!--<Button v-if="!isBatchProcessing" type="primary" style="margin-left: 20px" @click="batchProcessing">批量管理</Button>-->
                    <!--</div>-->
                </i-col>
                <i-col v-if="serviceList && serviceList.length>0" span="24">
                    <div v-for="serviceInfo in serviceList" :key="serviceInfo.id" class="service-item" :class="{'service-item-selected':serviceInfo.isSelected}">
                        <div style="padding: 5px;">
                            <div v-if="!isBatchProcessing && serviceInfo.state=='SERVER_BACK'" class="service-state" style="float: right">
                                <span>退</span>
                            </div>
                            <div v-if="isBatchProcessing" class="service-no-selected-state" :class="{'service-selected-state':serviceInfo.isSelected}">
                                <Icon class="service-select-icon" type="checkmark"></Icon>
                            </div>
                            <div style="margin: 0 5px 0 5px;border-bottom: 1px solid #e5e5e5">
                                <span style="margin-left: 20px;color: #999999">接单时间：</span>
                                <span>{{serviceInfo.receive_date | formatDate}}</span>
                                <span style="margin-left: 20px;color: #999999">服务单号：{{serviceInfo.code}}</span>
                            </div>
                            <div style="padding: 5px 0 5px 0">
                                <div style="width: 120px;height: 50px;padding: 10px;margin: 5px 5px 5px 10px;border-right: 1px solid #e5e5e5;display: inline-block">
                                    <div :title="serviceInfo.name" style="width: 80px;height: 30px;line-height: 30px;text-align: center;border: 1px solid #59b399;border-radius: 5px;color: #59b399">
                                        <span>{{serviceInfo.name | billDefNameLimit}}</span>
                                    </div>
                                </div>
                                <div class="service-item-saleOrgName" style="display: inline-block;width: 250px;font-weight: bold;margin-left: 20px">
                                    <Tooltip placement="top">
                                        <span>{{serviceInfo.customer_name | wordLengthLimit}}</span>
                                        <div slot="content">
                                            <p>客户名称：{{serviceInfo.customer_name}}</p>
                                            <p>联系人：{{serviceInfo.linkname ? serviceInfo.linkname : serviceInfo.contactName}}</p>
                                            <p>联系电话：{{serviceInfo.linkname ? serviceInfo.linkphone : serviceInfo.contactPhone}}</p>
                                            <p>地址：{{serviceInfo.linkname ? serviceInfo.address : serviceInfo.contactAddress}}</p>
                                        </div>
                                    </Tooltip>
                                </div>
                                <div style="display: inline-block;width: 150px;margin-left: 20px">
                                    <span>￥{{serviceInfo.settlement_price}}</span>
                                </div>
                                <div style="display: inline-block;max-width: 370px;margin-left: 20px;" :title="serviceInfo.saleOrgName">
                                    <span>{{serviceInfo.saleOrgName | customerAddressLimit}}</span>
                                </div>
                                <div v-if="dealWithState=='NONE_RECEIVE'" class="again-dispatching">
                                    <Button type="primary" @click="singleDealWith(serviceInfo)">派工</Button>
                                </div>
                                <div v-if="dealWithState=='ALREADY_RECEIVE'" class="again-dispatching">
                                    <Button v-if="serviceInfo.serveState != 'CUTOUT' && serviceInfo.serveState != 'FINISHED'" type="ghost" @click="singleDealWith(serviceInfo)">重新派工</Button>
                                    <Button type="primary" @click="showServiceProgress(serviceInfo)">服务进度</Button>
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
    import ICol from "../../../../node_modules/iview/src/components/grid/col.vue";
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
                if(value && value.length > 20){
                    return value.substring(0,20) + "..." ;
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
            this.getServicePersonnelList();
            this.getServiceList();
        },
        data () {
            return {
                total: 0,
                page: 1,
                pageSize: 10,
                isAll: false,
                isBatchProcessing: false,
                dealWithState: "NONE_RECEIVE",//ALREADY_RECEIVE    NONE_RECEIVE
                searchText: null,
                saleOrg: null,
                serviceType: null,
                startAndEndDate: null,
                startDate: null,
                endDate: null,
                servicePersonnel: null,
                saleOrgList: [],//派单方
                serviceTypeList: [],//服务单类型
                servicePersonnelList: [],//服务人员
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
                this.servicePersonnel = null;
                this.startDate = null;
                this.endDate = null;
                this.startAndEndDate = null;
                if(dealWithState == "ALREADY_RECEIVE"){//如果是已派工   查询最近7天数据
                    this.isAll = false;
                    this.isBatchProcessing = false;
                    this.endDate = (new Date()).format("yyyy-MM-dd");
                    var tempDate = (new Date().setDate(new Date().getDate()-6));
                    tempDate = new Date(tempDate);
                    this.startDate = tempDate.format("yyyy-MM-dd");
                    this.$set(this,"startAndEndDate",[this.startDate,this.endDate]);
                }
                this.page = 1;
                this.getServiceList();
            },
            //获取派单方下拉列表
            getSaleOrgList () {
                this.request({
                    url: "/serviceCloud/serviceOrder/getSaleOrgList.do"
                }).then((data)=>{
                    if(data && data.length>0){
                        this.saleOrgList = data;
                    }
                });
            },
            //获取服务单类型下拉列表
            getServiceTypeList () {
                this.request({
                    url: "/serviceCloud/serviceOrder/getServiceTypeList.do"
                }).then((data)=>{
                    if(data && data.length>0){
                        this.serviceTypeList = data;
                    }
                });
            },
            //获取服务人员下拉列表
            getServicePersonnelList () {
                this.request({
                    url: "/serviceCloud/serviceHead/getServicePersonnelList.do"
                }).then((data)=>{
                    if(data && data.records && data.records.length>0){
                        this.servicePersonnelList = data.records;
                    }
                });
            },
            //选择派工起止时间
            selectRangeDate (rangeDate) {
                if(rangeDate && rangeDate.length> 1){
                    this.startDate = rangeDate[0];
                    this.endDate = rangeDate[1];
                }
            },
            //查询服务单列表
            getServiceList () {
                this.request({
                    url: "/serviceCloud/serviceHead/getServiceList.do",
                    data: {
                        state: this.dealWithState,
                        searchText: this.searchText,
                        saleOrgId: this.saleOrg,
                        billDefId: this.serviceType,
                        serveUserId: this.servicePersonnel,
                        page: this.page,
                        startDate: this.startDate,
                        endDate: this.endDate
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
                    code: "SCOrderOrRefuse",
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