<style scoped>
    .start-node{
        position: relative;
        left: 15px;
        margin-bottom: 30px;
    }
    .start-node-icon{
        width: 80px;
        text-align: center;
    }
    .start-node-name-css{
        font-size: 12px;
        color: #999999;
    }
    .start-node-name-css.active{
        color: #59b399;
    }
    .start-time-node{
        position: absolute;
        left: 99px;
        top: 10px;
        font-size: 14px;
    }
    .start-time-node span, .end-time-node span {
        min-width: 110px;
        display: inline-block;
    }
    .start-time-node-cycle{
        position: absolute;
        left: 119px;
        top: 10px;
        font-size: 14px;
    }
    .start-node-dashed{
        position: relative;
        left: 35px;
        width: 10px;
        height: 30px;
        border-left: 1px dashed #ABABAB;
        border-right: 1px dashed #ABABAB;
    }
    .start-node-dashed.active{
        border-left: 1px dashed #59b399;
        border-right: 1px dashed #59b399;
    }
    .icon-css{
        position: relative;
        left: 50%;
        margin-left:-20px;
        width: 40px;
        height: 40px;
        border: 1px solid #59b399;
        border-radius: 20px;
        background-color: white;
        text-align: center;
        font-size: 20px;
        color: #59b399;
        line-height: 40px;
    }
    .icon-css.active{
        background-color: #59b399;
        color: white;
    }
    .node-name-css{
        margin-left: 80px;
    }
    .service-node-css{
        width: 100px;
        color: #ABABAB;
    }
    .service-node-css.active{
        width: 100px;
        color: #59b399;
    }
    .service-node-css >>> span {
        display: inline-block;
        width: 100%;
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .service-node-icon{
        font-size: 35px;
    }
    .service-node >>> .ivu-timeline-item-content{
        min-height: 85px;
    }
    .service-node:last-child >>> .ivu-timeline-item-content{
        min-height: 40px;
    }
    .service-node >>> .ivu-timeline-item-tail{
        width: 10px;
        height: 30px;
        border-left: 1px dashed #ABABAB;
        border-right: 1px dashed #ABABAB;
        position: absolute;
        left: 30px!important;
        top: 50%;
        transform: translateY(-40%);
        margin-top: 10px;
    }
    .service-node.active >>> .ivu-timeline-item-tail{
        border-left: 1px dashed #59b399;
        border-right: 1px dashed #59b399;
    }
    .service-node-remark{
        font-size: 12px;
        color: #999999;
    }
    .end-node{
        position: relative;
        left: 15px;
        top: -20px;
        margin-bottom: 30px;
    }
    .end-node-dashed{
        position: relative;
        left: 35px;
        bottom: 10px;
        margin-top: 20px;
        width: 10px;
        height: 30px;
        border-left: 1px dashed #ABABAB;
        border-right: 1px dashed #ABABAB;
    }
    .end-node-dashed.active{
        border-left: 1px dashed #59b399;
        border-right: 1px dashed #59b399;
    }
    .end-time-node{
        position: absolute;
        left: 99px;
        top: 10px;
        font-size: 14px;
    }
    .end-time-node-cycle{
        position: absolute;
        left: 119px;
        top: 40px;
        font-size: 14px;
    }
    .time-node{
        margin-left: 80px;
        font-size: 14px;
    }
    .cycle-css{
        position: relative;
        top: -20px;
    }
    .cycle-time-line{
        padding-top: 25px;
        padding-left: 20px;
        padding-right: 60px;
        border: 1px solid #59b399;
        background-color: #f6f6f6;
    }
    .cycle-css >>> .ivu-select-selection{
        background-color: #59b399;
        color: white;
    }
    .cycle-css >>> .ivu-select-arrow{
        color: white;
    }
    .cycle-css >>> .ivu-select-selected-value{
        font-size: 14px;
    }
    .cycle-css >>> .ivu-select-item{
        font-size: 14px !important;
    }
    .cycle-css >>> .ivu-select-item:hover{
        background-color: #F6FAF9;
        color: #495060;
    }
    .cycle-css >>> .ivu-timeline-item-head{
        width: 100px;
        background-color: #f6f6f6;
        z-index: 2;
    }
    .no-change{
        position: relative;
        width: 100%;
        height: auto;
        padding-top: 253px;
        background: #f6f6f6 url("../../signCloud/image/no-contract.png") center 100px no-repeat;
        background-color: white;
        text-align: center;
        font-size: 16px;
    }
</style>
<template>
    <div v-if="isBegin">
        <!-- 开始 -->
        <div color="green" class="start-node">
            <div class="start-node-icon" slot="dot">
                <div :class="serviceLifeStart ? 'icon-css active': 'icon-css'">
                    <Icon type="play"></Icon>
                </div>
                <span :class="serviceLifeStart ? 'start-node-name-css active': 'start-node-name-css'">服务开始</span>
            </div>
            <div :class="cycleList.length > 1 ? 'start-time-node-cycle': 'start-time-node'">
                <span>{{(serviceLifeStart ? serviceLifeStart : null) | formatDate('yyyy/MM/dd')}}</span>
                <span class="node-name-css">服务开始</span>
            </div>
            <div :class="serviceLifeStart ? 'start-node-dashed active': 'start-node-dashed'"></div>
        </div>
        <!-- 一次性 -->
        <Timeline v-if="cycleList.length == 1" style="padding-left: 20px;">
            <TimelineItem :class="serviceRecordInfo.completeState==1 ? 'service-node active':'service-node'" v-for="(serviceRecordInfo,index) in serviceProgressList" :key="index">
                <div :class="serviceRecordInfo.completeState==1 ? 'service-node-css active':'service-node-css'" slot="dot">
                    <Tooltip :content="serviceRecordInfo.name" class="tips" placement="bottom">
                        <template>
                            <div class="service-node-icon">
                                <Icon type="document-text"></Icon>
                            </div>
                            <span>{{serviceRecordInfo.name}}</span>
                        </template>
                    </Tooltip>
                </div>
                <div class="time-node">
                    <div v-if="serviceRecordInfo.nodeEnd">
                        <span>{{serviceRecordInfo.nodeEnd | formatDate(showDateTime ? undefined : 'yyyy/MM/dd')}}</span>
                        <span class="node-name-css">{{serviceRecordInfo.name}}</span>
                    </div>
                    <div class="service-node-remark">
                        <span>{{serviceRecordInfo.remark}}</span>
                    </div>
                </div>
            </TimelineItem>
            <div></div>
        </Timeline>
        <!-- 周期性 -->
        <div v-if="cycleList.length > 1" class="cycle-css">
            <Select v-model="cycleId" placeholder="服务周期" @on-change="selectCycle">
                <Option v-for="(cycleInfo, index) in cycleList" :value="cycleInfo.id" :key="cycleInfo.id">第{{cycleInfo.cycleNumber}}期&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ cycleInfo.cycleStart | formatMonth}}</Option>
            </Select>
            <Timeline class="cycle-time-line">
                <TimelineItem :class="serviceRecordInfo.completeState==1 ? 'service-node active':'service-node'" v-for="(serviceRecordInfo,index) in serviceProgressList" :key="index">
                    <div :class="serviceRecordInfo.completeState==1 ? 'service-node-css active':'service-node-css'" slot="dot">
                        <Tooltip :content="serviceRecordInfo.name" class="tips" placement="bottom">
                            <template>
                                <div class="service-node-icon">
                                    <Icon type="document-text"></Icon>
                                </div>
                                <span>{{serviceRecordInfo.name}}</span>
                            </template>
                        </Tooltip>
                    </div>
                    <div class="time-node">
                        <div v-if="serviceRecordInfo.nodeEnd">
                            <span>{{serviceRecordInfo.nodeEnd | formatDate(showDateTime ? undefined : 'yyyy/MM/dd')}}</span>
                            <span class="node-name-css">{{serviceRecordInfo.name}}</span>
                        </div>
                        <div class="service-node-remark">
                            <span>{{serviceRecordInfo.remark}}</span>
                        </div>
                    </div>
                </TimelineItem>
            </Timeline>
        </div>
        <!--结束-->
        <div color="green" class="end-node">
            <div v-if="cycleList.length > 1" :class="serviceLifeEnd && (serveState=='CUTOUT' || serveState=='FINISHED') ? 'end-node-dashed active': 'end-node-dashed'"></div>
            <div class="start-node-icon" slot="dot">
                <div :class="serviceLifeEnd && (serveState=='CUTOUT' || serveState=='FINISHED') ? 'icon-css active': 'icon-css'">
                    <Icon type="stop"></Icon>
                </div>
                <span :class="serviceLifeEnd && (serveState=='CUTOUT' || serveState=='FINISHED') ? 'start-node-name-css active': 'start-node-name-css'">服务结束</span>
            </div>
            <div :class="cycleList.length > 1 ? 'end-time-node-cycle': 'end-time-node'" v-if="serviceLifeEnd && (serveState=='CUTOUT' || serveState=='FINISHED')">
                <span>{{(serviceLifeEnd ? serviceLifeEnd : null) | formatDate('yyyy/MM/dd')}}</span>
                <span class="node-name-css">服务结束</span>
            </div>
        </div>
    </div>
    <div v-else class="no-change">
        服务暂未开始
    </div>
</template>
<script>
    export default {
        props:{
            serviceId: null,
            serveState: null,
            showDateTime: {
                type: Boolean,
                default: true
            }
        },
        created: function () {
            this.getServiceCycleList();
        },
        filters: {
            formatDate(time, formatStr = 'yyyy/MM/dd  hh:mm:ss') {
                var date = new Date(time);
                return date.format(formatStr);
            },
            formatMonth(time) {
                var date = new Date(time);
                return date.format('yyyy年MM月');
            },
        },
        data () {
            return{
                isBegin: false,
                cycleList: [],
                serviceProgressList: [],
                cycleId: null,
                cycleIndex: null,
                cycleNum: null,
                serviceLifeStart: null,
                serviceLifeEnd: null,
            }
        },
        methods: {
            getServiceCycleList() {
                this.request({
                    url: "/serviceCloud/serviceProgressComponent/getServiceCycleList.do",
                    param: {
                        serviceId: this.serviceId
                    }
                }).then(data=>{
                    if(data && data.serviceLifeStart){
                        this.isBegin = true;
                        this.serviceLifeStart = data.serviceLifeStart;
                        this.serviceLifeEnd = data.serviceLifeEnd;
                        if(data.billCycleVos && data.billCycleVos.length>0){
                            this.cycleNum = data.billCycleVos.length;
                            if(data.cycleNumber && data.cycleNumber>0){
                                this.cycleId = data.billCycleVos[data.cycleNumber-1].id;
                            }
                            this.cycleList = data.billCycleVos;
                            this.getServiceProgressList();
                        }
//                        this.getServiceCycleAllDataList();
                    }else if(data == "暂未开始服务"){
                        this.isBegin = false;
                    }
                })
            },
            getServiceProgressList() {
                this.request({
                    url: "/serviceCloud/serviceProgressComponent/getServiceProgressList.do",
                    param: {
                        serviceId: this.serviceId,
                        cycleId: this.cycleId
                    }
                }).then(data=>{
                    if(data && data.length>0){
                        this.serviceProgressList = data;
                    }
                })
            },
//            getServiceCycleAllDataList() {
//                let vm = this;
//                this.request({
//                    url: "serviceCloud/servicePerson/processNodeList.do",
//                    param: {
//                        billId: this.serviceId
//                    }
//                }).then(data => {
//                    if (data) {
//                        if (data.length > 0) {
//                            vm.cycleIndex = null;
//                            vm.cycleList = data;
//                            vm.cycleNum = data.length;
//                            data.forEach((item, index) => {
//                                let flag = item.nodeVoList.every(item => {
//                                    return item.completeState == 1;
//                                });
//                                if (flag) {
//                                    if (index + 1 >= data.length) {
//                                        if (String.isNullOrBlank(vm.cycleIndex)) {
//                                            vm.cycleIndex = 0;
//                                        }
//                                    }else {
//                                        vm.cycleIndex = index + 1;
//                                    }
//                                }else if(String.isNullOrBlank(vm.cycleIndex)) {
//                                    vm.cycleIndex = 0;
//                                }
//                            });
//                            vm.selectCycle(vm.cycleIndex);
//                        }
//                    }
//                });
//            },
            selectCycle (selectedCycleId) {
                this.cycleId = selectedCycleId;
//                this.serviceProgressList = this.cycleList[selectedCycleIndex].nodeVoList;
                 this.getServiceProgressList();
            }
        },
    }
</script>
