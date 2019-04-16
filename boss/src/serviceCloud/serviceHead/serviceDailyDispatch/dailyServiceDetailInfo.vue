<style scoped>
    .content >>> .ivu-collapse{
        background-color: #f7f7f7;
        border-radius: 3px;
        border: 0;
    }
    .content >>> .ivu-collapse-item {
        border-top: 0;
    }
    .collapse-header >>> .ivu-collapse-header{
        position: relative;
        left: -35px;
        height: 38px;
        line-height: 38px;
        padding-left: 10px;
        color: #666;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
    }
    .collapse-header >>> .ivu-collapse-content {
        overflow: hidden;
        color: #495060;
        padding: 10px 16px 0 0;
        background-color: #fff;
    }
    .collapse-header >>> .ivu-collapse-header i{
        position: relative;
        left: 670px;
        margin-right: 20px;
    }
    .SD-list .time {
        width: auto;
        margin-right: 10px;
        margin-bottom: 14px;
    }

    .SD-list .content{
        position: relative;
        display: flex;
        width: 100%;
        min-height: 84px;
        background: #FFF;
        padding: 0 0 0 10px;
        align-items: baseline;
        color: #333;
        font-size: 14px;
    }

    .SD-list .content>div {
        line-height: 23px;
        width: 100%;
        white-space: nowrap;
    }

    .SD-list .content>div p{
        white-space: normal;
        color: #AAAAAA;
        font-size: 12px;
    }

    .SD-list .content>div p:first-child{
        font-size: 14px;
        color: #878787;
    }

    .SD-list .content>div p:first-child span{
        padding-left: 30px;
    }

    .SD-list >>> .ivu-timeline-item-head {
        width: 12px;
        height: 12px;
    }

    .SD-list >>> .ivu-timeline-item-head-blue {
        background: #59b399;
        border-color: #59b399;
        color: #59b399;
        left: 60px;
    }

    .SD-list >>> .ivu-timeline-item-content {
        display: block;
    }

    .SD-list >>> .ivu-timeline-item-content {
        padding: 1px 1px 10px 84px;
    }

    .SD-list >>> .ivu-timeline-item-content > p {
        position: absolute;
        left: 0;
        width: 60px;
        font-size: 14px;
        color: #757575;
        text-align: center;
        margin: 0;
    }

    .SD-list >>> .ivu-timeline-item-content > p span {
        display: inline-block;
        width: 100%;
        font-size: 14px;
        color: #757575;
    }

    .SD-list >>> .ivu-timeline-item-content > p span:last-child {
        font-size: 12px;
        color: #AAAAAA;
    }

    .SD-list .ivu-timeline-item >>> .ivu-timeline-item-tail {
        left: 66px;
    }

    .SD-list .ivu-timeline-item {
        padding: 0;
    }
    .icon-css{
        position: relative;
        left: 50%;
        margin-left:-15px;
        width: 30px;
        height: 30px;
        border: 1px solid #59b399;
        border-radius: 15px;
        background-color: #59b399;
        text-align: center;
        line-height: 33px;
    }
    .service-progress-record{
        font-size: 14px;
        margin-left: 20px;
    }
    .service-progress-record >>> .ivu-timeline-item-content{
        min-height: 60px;
        top: -15px;
        padding: 1px 1px 20px 24px;
    }
    .service-progress-record >>> .ivu-timeline-item-tail{
        left: 26px;
    }
    .service-progress-record >>> .ivu-collapse-content{
        padding: 10px 16px 0 0;
    }
    .label-css{
        display: inline-block;
        width: 117px;
        color: #5d5d5d;
        font-weight: bold;
    }
    .info-css{
        display: inline-block;
        color: #8c8c8c;
    }
    .state-button-green{
        font-size: 12px;
        height: 18px;
        padding: 0 5px 0 5px;
        border: 1px solid #59b399;
        border-radius: 5px;
        text-align: center;
        line-height: 18px;
        color: white;
        background-color: #59b399;
    }
    .state-button-margin{
        display: inline-block;
        margin-left: 30px;
    }
    .service-label{
        margin-top: 15px;
    }
    .state-button{
        font-size: 12px;
        height: 18px;
        padding: 0 5px 0 5px;
        border: 1px solid #59b399;
        border-radius: 5px;
        text-align: center;
        line-height: 18px;
        color: #59b399;
    }
    .component-css >>> #gszcService .org-name {
        line-height: 33px;
        font-size: 14px;
        color: #8c8c8c;
        font-weight: normal;
    }
</style>
<template>
    <div class="container" style="padding: 10px">
        <div class="content">
            <Row>
                <Collapse class="collapse-header" v-model="value1">
                    <Panel name="1">
                        服务单详情
                        <div slot="content" style="font-size: 14px">
                            <div style="padding: 0px 30px 10px 15px; font-size: 18px; font-weight: 700;">客户信息</div>
                            <div style="font-size: 14px;padding: 0 15px 10px 30px;color: #5d5d5d">
                                <i-col span="24">
                                    <div class="label-css">
                                        <span>客户名称</span>
                                    </div>
                                    <div class="info-css">
                                        <Tooltip placement="top">
                                            <span>{{serviceOrderInfo.customerName | wordLengthLimit}}</span>
                                            <div slot="content" style="white-space: normal;">
                                                <p>{{serviceOrderInfo.customerName}}</p>
                                            </div>
                                        </Tooltip>
                                    </div>
                                    <div class="state-button-margin">
                                        <div class="state-button-green">
                                            <span>{{serviceOrderInfo.customerType=='COMPANY'?'企业':'个人'}}</span>
                                        </div>
                                    </div>
                                </i-col>
                                <i-col span="24" class="service-label">
                                    <div class="label-css">
                                        <span>证件号码</span>
                                    </div>
                                    <div class="info-css">
                                        <span>{{serviceOrderInfo.customerNumber}}</span>
                                    </div>
                                    <!--<div class="state-button-margin">-->
                                        <!--<div class="state-button">-->
                                            <!--<span>{{serviceOrderInfo.serviceFrequency=='PERIODIC'?"周期性":"一次性"}}</span>-->
                                        <!--</div>-->
                                    <!--</div>-->
                                </i-col>
                                <i-col span="24" class="service-label">
                                    <div class="label-css">
                                        <span>联系人</span>
                                    </div>
                                    <div class="info-css" style="width:150px;">
                                        <span>{{serviceOrderInfo.contactName}}</span>
                                    </div>
                                    <div style="display: inline-block;margin-left: 55px;font-weight: bold">
                                        <span>联系电话</span>
                                    </div>
                                    <div style="display: inline-block;color: #8c8c8c;margin-left: 50px">
                                        <span>{{serviceOrderInfo.contactPhone}}</span>
                                    </div>
                                </i-col>
                                <!--<i-col span="24" class="service-label">-->
                                    <!--<div class="label-css" style="float: left;">-->
                                        <!--<span>客户地址</span>-->
                                    <!--</div>-->
                                    <!--<div class="info-css" style="word-wrap: break-word;word-break: break-all;width: 450px;">-->
                                        <!--<span style="white-space: pre-wrap">{{serviceOrderInfo.customerAddress}}</span>-->
                                    <!--</div>-->
                                <!--</i-col>-->
                                <i-col span="24" class="service-label component-css">
                                    <!--<component is="ServiceBuilder" :serviceType="this.serviceType" :isEdit="false" :serviceInfo="this.serviceInfo" :signedDate="this.serviceOrderInfo.tsSigned"></component>-->
                                </i-col>
                            </div>
                            <div style="padding: 0px 30px 10px 15px; font-size: 18px; font-weight: 700;">服务单信息</div>
                            <div style="font-size: 14px;padding: 0 15px 10px 30px;color: #5d5d5d">
                                <i-col span="24">
                                    <div class="label-css">
                                        <span>服务单编号</span>
                                    </div>
                                    <div class="info-css">
                                        <span>{{serviceOrderInfo.code}}</span>
                                    </div>
                                    <div class="state-button-margin">
                                        <div class="state-button-green">
                                            <span>{{serviceOrderInfo.billDefName}}</span>
                                        </div>
                                    </div>
                                </i-col>
                                <i-col span="24" class="service-label">
                                    <div class="label-css">
                                        <span>服务结算价</span>
                                    </div>
                                    <div class="info-css">
                                        <span>￥{{serviceOrderInfo.settlementPrice}}</span>
                                    </div>
                                    <div class="state-button-margin">
                                        <div class="state-button">
                                            <span>{{serviceOrderInfo.serveType}}</span>
                                        </div>
                                    </div>
                                </i-col>
                                <i-col span="24" class="service-label">
                                    <div class="label-css">
                                        <span>派单人</span>
                                    </div>
                                    <div class="info-css" style="width:150px;">
                                        <span>{{serviceOrderInfo.dispatcherName}}</span>
                                    </div>
                                    <div style="display: inline-block;margin-left: 55px;font-weight: bold">
                                        <span>联系电话</span>
                                    </div>
                                    <div style="display: inline-block;color: #8c8c8c;margin-left: 50px">
                                        <span>{{serviceOrderInfo.dispatcherPhone}}</span>
                                    </div>
                                </i-col>
                                <i-col span="24" class="service-label">
                                    <div class="label-css">
                                        <span>计划开始时间</span>
                                    </div>
                                    <div class="info-css" style="width:150px;">
                                        <span>{{serviceOrderInfo.serviceLifeStart}}</span>
                                    </div>
                                    <div style="display: inline-block;margin-left: 55px;font-weight: bold">
                                        <span>计划结束时间</span>
                                    </div>
                                    <div style="display: inline-block;color: #8c8c8c;margin-left: 25px;">
                                        <span>{{serviceOrderInfo.serviceLifeEnd}}</span>
                                    </div>
                                </i-col>
                                <i-col span="24" class="service-label">
                                    <div class="label-css" style="float: left;">
                                        <span>服务内容</span>
                                    </div>
                                    <div class="info-css" style="word-wrap: break-word;word-break: break-all;width: 450px;">
                                        <span style="white-space: pre-wrap">{{serviceOrderInfo.serviceContent}}</span>
                                    </div>
                                </i-col>
                                <i-col span="24" class="service-label">
                                    <div class="label-css" style="float: left;">
                                        <span>服务达成标准</span>
                                    </div>
                                    <div class="info-css" style="word-wrap: break-word;word-break: break-all;width: 450px;">
                                        <span style="white-space: pre-wrap">{{serviceOrderInfo.otherContent}}</span>
                                    </div>
                                </i-col>
                                <i-col span="24" class="service-label component-css">
                                    <!--<component is="ServiceBuilder" :serviceType="this.serviceType" :isEdit="false" :serviceInfo="this.serviceInfo" :signedDate="this.serviceOrderInfo.tsSigned"></component>-->
                                </i-col>
                            </div>
                            <div style="padding: 0px 30px 10px 15px; font-size: 18px; font-weight: 700;">服务单派工信息</div>
                            <div style="font-size: 14px;padding: 0 15px 10px 30px;color: #5d5d5d">
                                <i-col span="24" v-for="user in serviceOrderInfo.serveUserVoList" :key="user.id">
                                    <div class="label-css">
                                        <span>{{user.postName}}</span>
                                    </div>
                                    <div class="label-css" style="width:200px;">
                                        <span>{{user.userName}}</span>
                                    </div>
                                    <div style="padding-left: 120px;">
                                        <span>{{user.remark}}</span>
                                    </div>
                                </i-col>

                            </div>
                        </div>
                    </Panel>
                </Collapse>
            </Row>
            <Row style="margin-top: 20px">
                <Collapse class="collapse-header" v-model="value1">
                    <Panel name="2">
                        派单记录
                        <div slot="content" style="font-size: 14px">
                            <Timeline class="SD-list">
                                <TimelineItem v-for="(saleRecordInfo,index) in saleRecordList" :key="index" :style="{'font-weight':index==0?'bold':''}">
                                    <p class="time">
                                        <span>{{saleRecordInfo.operatorTime | formatTime}}</span>
                                        <span>{{saleRecordInfo.operatorTime | formatDate}}</span>
                                    </p>
                                    <div class="content">
                                        <div>
                                            <p style="margin-bottom: 10px;">
                                                <span style="min-width: 200px;padding-left: 0;display: inline-block;">{{saleRecordInfo.operatorName}}</span>
                                                <span>{{saleRecordInfo.operatorUserName}}</span>
                                            </p>
                                            <p>{{saleRecordInfo.remark}}</p>
                                        </div>
                                    </div>
                                </TimelineItem>
                            </Timeline>
                        </div>
                    </Panel>
                </Collapse>
            </Row>
            <!--<Row style="margin-top: 20px">-->
                <!--<Collapse class="collapse-header" v-model="value1">-->
                    <!--<Panel name="3">-->
                        <!--服务记录-->
                        <!--<div slot="content" class="service-progress-record">-->
                            <!--<Timeline>-->
                                <!--<Timeline-item color="green">-->
                                    <!--<div style="width: 80px" slot="dot">-->
                                        <!--<div class="icon-css">-->
                                            <!--<Icon type="play" style="font-size: 20px;color: white"></Icon>-->
                                        <!--</div>-->
                                        <!--<span>服务开始</span>-->
                                    <!--</div>-->
                                    <!--<div style="margin-left: 60px">-->
                                        <!--<span>2017/11/27 16:35</span>-->
                                        <!--<span style="margin-left: 50px">服务开始</span>-->
                                    <!--</div>-->
                                <!--</Timeline-item>-->
                                <!--<TimelineItem v-for="(serviceRecordInfo,index) in serviceRecordList" :key="index" :style="{'font-weight':index==0?'bold':''}">-->
                                    <!--<div style="width: 80px" slot="dot">-->
                                        <!--<div class="icon-css">-->
                                            <!--<Icon type="edit" style="font-size: 20px;color: white"></Icon>-->
                                        <!--</div>-->
                                        <!--<span style="color: #999999">{{serviceRecordInfo.name}}</span>-->
                                    <!--</div>-->
                                    <!--<div style="margin-left: 60px">-->
                                        <!--<div>-->
                                            <!--<span>{{serviceRecordInfo.date}}  {{serviceRecordInfo.time}}</span>-->
                                            <!--<span style="margin-left: 50px">{{serviceRecordInfo.name}}</span>-->
                                        <!--</div>-->
                                        <!--<div style="font-size: 12px;color: #999999">-->
                                            <!--<span>{{serviceRecordInfo.remark}}</span>-->
                                        <!--</div>-->
                                    <!--</div>-->
                                <!--</TimelineItem>-->
                                <!--<Timeline-item color="green">-->
                                    <!--<div style="width: 80px" slot="dot">-->
                                        <!--<div class="icon-css">-->
                                            <!--<Icon type="play" style="font-size: 20px;color: white"></Icon>-->
                                        <!--</div>-->
                                        <!--<span>服务结束</span>-->
                                    <!--</div>-->
                                    <!--<div style="margin-left: 60px">-->
                                        <!--<span>2017/11/27 16:35</span>-->
                                        <!--<span style="margin-left: 50px">服务结束</span>-->
                                    <!--</div>-->
                                <!--</Timeline-item>-->
                            <!--</Timeline>-->
                        <!--</div>-->
                    <!--</Panel>-->
                <!--</Collapse>-->
            <!--</Row>-->
            <Row style="margin-top: 20px">
                <Collapse class="collapse-header" v-model="value1" accordion>
                    <Panel name="3">
                        服务进度
                        <div slot="content" class="service-progress-record">
                            <component is="ServiceProgressComponent" :serviceId="this.serviceId" :serveState="serviceOrderInfo.serveState" :showDateTime="false"></component>
                        </div>
                    </Panel>
                </Collapse>
            </Row>
        </div>
    </div>
</template>
<script>
    import ICol from "../../../../node_modules/iview/src/components/grid/col.vue";
    import ServiceProgressComponent from "../../serviceOrder/serviceProgressComponent";
//    import ServiceBuilder from '../service/serviceBuilder.vue';
    export default {
        components: {
            ICol,
            ServiceProgressComponent,
//            ServiceBuilder
        },
        props: {
            serviceId: null,
        },
        filters: {
            wordLengthLimit : function (value) {
                if(value && value.length > 27){
                    return value.substring(0,27) + "..." ;
                }
                return value;
            },
            formatDate(time) {
                var date = new Date(time);
                return date.format('MM-dd');
            },
            formatTime(time) {
                var date = new Date(time);
                return date.format('hh:mm');
            },
        },
        created: function () {
            this.initContent();
            this.getServiceProgress();
        },
        data () {
            return{
                value1: "1",
                serviceOrderInfo: {},
                serviceType: null,
                serviceInfo: null,
                saleRecordList: [],
                start: "我是服务具体",
                serviceRecordList: [
                    {id:1,name:'节点1',isCurrent:false,date:"2017/11/27",time:"16:35",remark:"我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明"},
                    {id:2,name:'节点2',isCurrent:false,date:"2017/11/27",time:"16:35",remark:"我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明"},
                    {id:3,name:'节点3',isCurrent:true,date:"2017/11/27",time:"16:35",remark:"我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明"},
                    {id:4,name:'节点4',isCurrent:false,date:"2017/11/27",time:"16:35",remark:"我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明我我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明是服务具体说明"},
                    {id:5,name:'节点5',isCurrent:false,date:"2017/11/27",time:"16:35",remark:"我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明我是服务具我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明体说明"},
                    {id:6,name:'节点6',isCurrent:false,date:"2017/11/27",time:"16:35",remark:"我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明"},
                    {id:7,name:'节点7',isCurrent:false,date:"2017/11/27",time:"16:35",remark:"我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明"},
                    {id:8,name:'节点8',isCurrent:false,date:"2017/11/27",time:"16:35",remark:"我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明"},
                    {id:9,name:'节点9',isCurrent:false,date:"2017/11/27",time:"16:35",remark:"我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明"},
                    {id:10,name:'节点10',isCurrent:false,date:"2017/11/27",time:"16:35",remark:"我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明我是服务具体说明"},
                ],
            }
        },
        methods: {
            initContent () {
                var vm = this;
                this.request({
                    url: "/serviceCloud/orderOrRefuse/getServiceInfoById.do",
                    data: {
                        serviceOrderId: this.serviceId
                    }
                },{
                    url: '/serviceCloud/serviceDispatch/SDInfo.do',
                    param: {
                        id: this.serviceId
                    }
                }).then((data,pram)=>{
                    this.serviceOrderInfo = data;
                    this.serviceInfo = Object.assign({}, pram);
                    this.serviceOrderInfo.templeteData = JSON.parse(data.templeteData);
                    this.serviceOrderInfo.contactName = this.serviceOrderInfo.templeteData.contactName;
                    this.serviceOrderInfo.contactPhone = this.serviceOrderInfo.templeteData.contactPhone;
                    // this.serviceOrderInfo.customerAddress = this.serviceOrderInfo.templeteData.customerAddress;
                    this.serviceOrderInfo.serviceLifeStart = new Date(data.serviceLifeStart).format("yyyy-MM-dd hh:mm");
                    this.serviceOrderInfo.serviceLifeEnd = new Date(data.serviceLifeEnd).format("yyyy-MM-dd hh:mm");
                    pram.serveUserVoList;
                    // for(var i=0;i<pram.serveUserVoList.length;i++){
                    //     pram.serveUserVoList[i]
                    // }

                    if (data.inputTemplateId) {
                        vm.serviceType = data.inputTemplateId;
                    }
                });
            },
            getServiceProgress () {
                this.request({
                    url: "/serviceCloud/serviceProgress/getServiceRecordList.do",
                    param: {
                        serviceId: this.serviceId
                    }
                }).then((data)=>{
                    if(data && data.length>0){
                        for(var i=0;i<data.length;i++){
                            switch (data[i].operatorType){
                                case "NONE_DISPATCH" :
                                    data[i].operatorTypeName = "待派单";
                                    break;
                                case "ALREADY_DISPATCH" :
                                    data[i].operatorTypeName = "已派单";
                                    break;
                                case "SEND_BACK_DISPATCH" :
                                    data[i].operatorTypeName = "派单退回";
                                    break;
                                case "NONE_RECEIVE" :
                                    data[i].operatorTypeName = "待派工";
                                    break;
                                case "ALREADY_RECEIVE" :
                                    data[i].operatorTypeName = "已派工";
                                    break;
                                case "SEND_BACK_RECEIVE" :
                                    data[i].operatorTypeName = "派工退回";
                                    break;
                                case "SALE_DISPATCH" :
                                    data[i].operatorTypeName = "销售派单";
                                    break;
                                case "SERVER_RECEIVE" :
                                    data[i].operatorTypeName = "服务接单";
                                    break;
                                case "SERVER_BACK" :
                                    data[i].operatorTypeName = "服务退回";
                                    break;
                                case "SERVE_LEADER_DISPATCH" :
                                    data[i].operatorTypeName = "服务负责人派工";
                                    break;
                                case "SERVE_LEADER_BACK" :
                                    data[i].operatorTypeName = "服务负责人退回";
                                    break;
                                case "DAILY_SERVE_LEADER_DISPATCH" :
                                    data[i].operatorTypeName = "服务负责人生成日常服务单并派工";
                                    break;
                                default:
                                    data[i].operatorTypeName = "无服务记录";
                                    break;
                            }
                        }
                        this.saleRecordList = data;
                    }else{
                        this.saleRecordList = [];
                    }
                });
            },
        }
    }
</script>