<style scoped>
    .container {
        background: #f7f7f7;
    }
    .panel {
        position: absolute;
        top: 0;
        left: 50px;
        right: 50px;
        height: 50px;
        /*background: white;*/
        /*border-bottom: solid 1px #dddee1;*/
    }
    .center {
        position: relative;
        /*top: 50px;*/
        /*left: 50px;*/
        /*right: 50px;*/
        width: 920px;
        margin: 0 auto;
        padding: 50px 65px 0 15px;
        /*text-align: center;*/
        box-shadow: 3px 3px 5px #f6f6f6;
    }
    .center-list {
        padding: 50px 50px 10px 50px;
    }
    .tab-head{
        position: relative;
        /*height:50px;*/
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
        margin-left: 50px;
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
        <div class="panel">
            <div class="tab-head">
                <div class="tab-panel clearFix">
                    <div v-if="!serviceOrderId" :class="isNoneActive">
                        <Dropdown>
                            <a href="javascript:void(0)">
                                新建任务
                                <Icon type="arrow-down-b"></Icon>
                            </a>
                            <DropdownMenu slot="list" v-for="dailyDef in dailyDefList" :key="dailyDef.id">
                                <DropdownItem @click.native="chooseDailyDef(dailyDef.id)" >{{dailyDef.name}}</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div v-else :class="isNoneActive">重新派单</div>
                    <div :class="isAlreadyActive" @click="switchState('LIST')">已派任务</div>
                    <div v-if="status=='LIST'" style="display:inline-block;margin-left: 20px">
                        <Input style="width: 260px;" icon="ios-search" :maxlength="20" v-model="searchText" placeholder="客户名称/服务单编号/客户地址" @on-keyup="getSearchText"/>
                    </div>
                    <div v-if="status=='LIST'" style="display:inline-block;margin-left: 20px">
                        <Select filterable style="width: 200px" v-model="servicePersonnel" placeholder="服务人员" clearable @on-change="changeServicePersonnel">
                            <Option v-for="servicePersonnelInfo in servicePersonnelList" :value="servicePersonnelInfo.id" :key="servicePersonnelInfo.id">{{ servicePersonnelInfo.realName }}</Option>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
        <div class="center" v-if="status=='NEW'">
            <func-node code="newDailyServiceBuilder" :serviceDefId="dailyDefId" :serviceOrderId="serviceOrderId"></func-node>
        </div>
        <div class="center-list" v-if="status=='LIST'">
            <i-col v-if="serviceList && serviceList.length>0" span="24">
                <div v-for="serviceInfo in serviceList" :key="serviceInfo.id" class="service-item" :class="{'service-item-selected':serviceInfo.isSelected}">
                    <div style="padding: 5px;">
                        <div v-if="serviceInfo.state=='SERVER_BACK'" class="service-state" style="float: right">
                            <span>拒</span>
                        </div>
                        <!--<div v-if="isBatchProcessing" class="service-no-selected-state" :class="{'service-selected-state':serviceInfo.isSelected}">-->
                            <!--<Icon class="service-select-icon" type="checkmark"></Icon>-->
                        <!--</div>-->
                        <div style="margin: 0 5px 0 5px;border-bottom: 1px solid #e5e5e5">
                            <span style="margin-left: 20px;color: #999999">派工时间：</span>
                            <span>{{serviceInfo.divide_date | formatDate}}</span>
                            <span style="margin-left: 20px;color: #999999">服务单号：{{serviceInfo.code}}</span>
                        </div>
                        <div style="padding: 5px 0 5px 0">
                            <div style="width: 120px;height: 50px;padding: 10px;margin: 5px 5px 5px 10px;border-right: 1px solid #e5e5e5;display: inline-block">
                                <div :title="serviceInfo.name" style="width: 80px;height: 30px;line-height: 30px;text-align: center;border: 1px solid #59b399;border-radius: 5px;color: #59b399">
                                    <span>{{serviceInfo.name | billDefNameLimit}}</span>
                                </div>
                            </div>
                            <div class="service-item-saleOrgName" style="display: inline-block;width: 450px;font-weight: bold;margin-left: 20px">
                                <Tooltip placement="top">
                                    <span>{{serviceInfo.customer_name | wordLengthLimit}}</span>
                                    <div slot="content">
                                        <p>联系人：{{serviceInfo.contactName}}</p>
                                        <p>联系电话：{{serviceInfo.contactPhone}}</p>
                                        <!--<p>地址：{{serviceInfo.customer_address}}</p>-->
                                    </div>
                                </Tooltip>
                            </div>
                            <div style="display: inline-block;width: 150px;margin-left: 20px">
                                <span>￥{{serviceInfo.settlement_price}}</span>
                            </div>
                            <div style="display: inline-block;width: 250px;margin-left: 20px;" :title="serviceInfo.saleOrgName">
                                <span>{{serviceInfo.saleOrgName | customerAddressLimit}}</span>
                            </div>
                            <div class="again-dispatching">
                                <Button type="ghost" @click="editFileList(serviceInfo)">补充资料</Button>
                                <Button v-if="serviceInfo.state!='SERVER_BACK'" type="ghost" @click="showServiceDetail(serviceInfo)">查看详情</Button>
                                <Button v-if="serviceInfo.state=='SERVER_BACK'" type="primary" @click="reDispatch(serviceInfo)">重新指派</Button>
                            </div>
                        </div>
                    </div>
                    <!--<div v-if="isBatchProcessing" class="service-item-mask" :class="{'service-item-mask-selected':serviceInfo.isSelected}" @click="selectService(serviceInfo)">-->
                    <!--</div>-->
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
</template>

<script>

    export default {
        data () {
            return {
                visible: false,
                total: 0,
                page: 1,
                pageSize: 10,
                searchText: "",
                status: "LIST",
                dailyDefId: "",
                dailyDefList:[],//日常服务单定义列表
                serviceList: [],//服务单列表
                serviceOrderId: null,
                servicePersonnelList:[],//组织下服务人员列表
                servicePersonnel: null,
            }
        },
        computed: {
            isNoneActive() {
                if (this.status == 'NEW') {
                    return 'tab-item active';
                }else {
                    return 'tab-item';
                }
            },
            isAlreadyActive() {
                if (this.status == 'LIST') {
                    return 'tab-item active';
                }else {
                    return 'tab-item';
                }
            }
        },
        filters: {
            wordLengthLimit : function (value) {
                if(value && value.length > 30){
                    return value.substring(0,30) + "..." ;
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
            this.$api.showList = this.showList;
            this.getDailyDefList();
            this.getServiceList();
            this.getServicePersonnelList();
        },
        methods: {
            //获取日常服务单定义列表
            getDailyDefList(){
                this.request({
                    url: "/serviceCloud/getDailyDefList.do",
                }).then((data)=>{
                    this.dailyDefList = data;
                });
            },
            chooseDailyDef(defId){
                this.dailyDefId = defId;
                this.switchState('NEW');
            },
            showList() {
                this.status = 'LIST';
                this.serviceOrderId = null;
                this.getServiceList();
            },
            switchState(state) {
                this.status = state;
                this.serviceOrderId = null;
                this.getServiceList();
            },
            getServiceList () {
                this.request({
                    url: "/serviceCloud/serviceHead/getDailyServiceList.do",
                    data: {
                        state: 'ALREADY_RECEIVE',
                        searchText: this.searchText,
                        billDefId:'',
                        page: this.page,
                        serveUserId: this.servicePersonnel,
                    }
                }).then((data)=>{
                    // if(data && data.records && data.records.length>0){
                        for(var i =0;i<data.records.length;i++){
                            data.records[i].isSelected = false;
                            data.records[i].templeteData = JSON.parse(data.records[i].templete_data);
                            data.records[i].contactName = data.records[i].templeteData.contactName;
                            data.records[i].contactPhone = data.records[i].templeteData.contactPhone;
                            // data.records[i].customerAddress = data.records[i].templeteData.customerAddress;
                        }
                        this.serviceList = data.records;
                        this.page = data.current;
                        this.total = data.total;
                    // }
                });
            },
            getServicePersonnelList () {
                this.request({
                    url: "/serviceCloud/serviceHead/getServicePersonnelList.do"
                }).then((data)=>{
                    if(data && data.records && data.records.length>0){
                        this.servicePersonnelList = data.records;
                    }
                });
            },
            changeServicePersonnel () {
                this.getServiceList();
            },
            getSearchText () {
                this.getServiceList();
            },
            changePage (page) {
                this.page = page;
                this.getServiceList();
            },
            //查看详情
            showServiceDetail(serviceInfo) {
                this.card({
                    title: "",
                    code: "dailyServiceDetailInfo",
                    width: 700,
                    props: {
                        serviceId: serviceInfo.id
                    },
                });
            },
            //重新派单
            reDispatch(serviceInfo) {
                this.serviceOrderId = serviceInfo.id;
                this.dailyDefId = serviceInfo.bill_def_id;
                this.status = "NEW";
            },
            //补充资料
            editFileList(serviceInfo) {
                this.prompt({
                    title: "补充资料",
                    code: "fileList",
                    width: 700,
                    height: 480,
                    props: {
                        billId: serviceInfo.id,
                    },
                    callback: (close) => {
                        close();
                    }
                });
            },
        },
    }
</script>