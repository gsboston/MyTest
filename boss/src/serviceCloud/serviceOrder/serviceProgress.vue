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
    .collapse-header >>> .ivu-collapse-content{
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
                <Collapse class="collapse-header" v-model="value1" accordion>
                    <Panel name="1">
                        服务单信息
                        <div slot="content" style="font-size: 14px">
                            <div style="font-size: 14px;padding: 0 15px 10px 17px;color: #5d5d5d">
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
                                            <span>{{serviceOrderInfo.serviceFrequency=='PERIODIC'?"周期性":"一次性"}}</span>
                                        </div>
                                    </div>
                                </i-col>
                                <i-col span="24" class="service-label">
                                    <div class="label-css">
                                        <span>派单方</span>
                                    </div>
                                    <div class="info-css">
                                        <span>{{serviceOrderInfo.saleOrgName}}</span>
                                    </div>
                                    <div class="state-button-margin">
                                        <div class="state-button">
                                            <span>{{serviceOrderInfo.dispatchType=='EPIBOLY'?"外包服务":"自有服务"}}</span>
                                        </div>
                                    </div>
                                </i-col>
                                <i-col span="24" class="service-label">
                                    <div class="label-css">
                                        <span>派单人</span>
                                    </div>
                                    <div class="info-css">
                                        <span>{{serviceOrderInfo.dispatcherName}}</span>
                                    </div>
                                    <div style="display: inline-block;margin-left: 55px;font-weight: bold">
                                        <span>联系电话</span>
                                    </div>
                                    <div style="display: inline-block;color: #8c8c8c;margin-left: 50px">
                                        <span>{{serviceOrderInfo.dispatcherPhone}}</span>
                                    </div>
                                </i-col>
                                <i-col span="24" class="service-label component-css">
                                    <component v-if="this.serviceInfo" is="ServiceBuilder" :serviceType="this.serviceType" :isEdit="false" :serviceInfo="this.serviceInfo" :signedDate="this.serviceOrderInfo.tsSigned"></component>
                                </i-col>
                            </div>
                        </div>
                    </Panel>
                </Collapse>
            </Row>
            <Row style="margin-top: 20px">
                <Collapse class="collapse-header" v-model="value1" accordion>
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
            <Row style="margin-top: 20px">
                <Collapse class="collapse-header" v-model="value1" accordion>
                    <Panel name="3">
                        服务进度
                        <div slot="content" class="service-progress-record">
                            <component is="ServiceProgressComponent" :serviceId="this.serviceId" :serveState="serviceOrderInfo.serveState"></component>
                        </div>
                    </Panel>
                </Collapse>
            </Row>
        </div>
    </div>
</template>
<script>
    import ICol from "../../../node_modules/iview/src/components/grid/col.vue";
    import ServiceBuilder from '../service/serviceBuilder.vue';
    import ServiceProgressComponent from "../serviceOrder/serviceProgressComponent.vue"
    export default {
        components: {
            ICol,
            ServiceBuilder,
            ServiceProgressComponent
        },
        props: {
          serviceId: null,
        },
        filters: {
            wordLengthLimit : function (value) {
                if(value && value.length > 30){
                    return value.substring(0,30) + "..." ;
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
                value1: "3",
                serviceOrderInfo: {},
                serviceType: null,
                serviceInfo: null,
                saleRecordList: [],
                start: "我是服务具体",
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
                    vm.serviceOrderInfo = data;
                    vm.serviceInfo = Object.assign({}, pram);
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
                        this.saleRecordList = data;
                    }else{
                        this.saleRecordList = [];
                    }
                });
            },
        }
    }
</script>