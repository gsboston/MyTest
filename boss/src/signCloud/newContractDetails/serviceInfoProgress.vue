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
    import ServiceProgressComponent from "../../serviceCloud/serviceOrder/serviceProgressComponent"
    export default {
        components: {
            ServiceProgressComponent
        },
        props: {
          serviceId: null,
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