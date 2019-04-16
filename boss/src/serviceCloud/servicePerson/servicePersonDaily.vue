<template>
    <div class="container">
        <div class="title" style="display: flex;margin-top: 10px;white-space: nowrap;">服务单编号
            <span style="margin: 0 50px;font-size: 16px; line-height: 18px;">{{ billInfo.code }}</span>
        </div>
        <br>

        <div class="box">
            <div class="title">服务单信息</div>
            <div class="contract-item">
                <i-col span="5">
                    <div>
                        <div class="contract-img" @click="preview"></div>
                    </div>
                </i-col>
                <i-col span="19">
                    <div class="contract-info">
                        <p style="line-height: 24px;">
                            <span>客户名称</span>
                            <Tooltip :content="billInfo.customerName" class="item-text" style="height: 24px;vertical-align: bottom;">
                                {{ billInfo.customerName | infoFilter }}
                            </Tooltip>
                            <span class="service-tag">日常服务</span>
                        </p>
                        <p>
                            <span>服务方式</span>
                            <span class="item-text">{{ billInfo.serveType | infoFilter }}</span>
                        </p>
                        <p>
                            <span>服务结算价</span>
                            <span class="item-text">￥{{ billInfo.settlementPrice | infoFilter('0.00') }}</span>
                        </p>
                        <p class="half-width">
                            <span>计划开始时间</span>
                            <span class="item-text">{{ billInfo.serviceLifeStart | formatDate }}</span>
                        </p>
                        <p class="half-width">
                            <span>计划结束时间</span>
                            <span class="item-text">{{ billInfo.serviceLifeEnd | formatDate }}</span>
                        </p>
                        <p class="half-width">
                            <span>派单人</span>
                            <span class="item-text">{{ billInfo.dispatcherName | infoFilter }}</span>
                        </p>
                        <p class="half-width">
                            <span>联系电话</span>
                            <span class="item-text">{{ billInfo.dispatcherPhone | infoFilter }}</span>
                        </p>
                    </div>
                </i-col>
            </div>
        </div>
        <br>

        <div class="box">
            <div style="margin-bottom: 10px;">
                <Row>
                    <i-col span="24">
                        <Timeline class="service-progress">
                            <TimelineItem class="active">服务开始</TimelineItem>
                            <TimelineItem v-for="(item, index) in billProcessNodeList" :key="index" @click.native="getBillProcessNodeInfo(item)" :class="[{'active': (item.completeState != null && item.completeState != 0)}, {'selected': selectedNode ? item.id == selectedNode.id : false}]">{{ item.name }}</TimelineItem>
                            <TimelineItem :class="{'active': billInfo.serveState == 'FINISHED'}" @click.native="showEndView">服务结束</TimelineItem>
                        </Timeline>
                    </i-col>
                </Row>
            </div>

            <div class="title">服务信息</div>
            <div class="collection-info">
                <div class="box-content" v-if="(billInfo.serveState == null || billInfo.serveState == 'UNSTARTED') && !finishStatus && this.isEditable">
                    <div style="padding-top: 15px;padding-left: 15px">
                        <RadioGroup v-model="billInfo.isAccept">
                            <Radio label="1">
                                接收任务
                            </Radio>
                            <Radio label="0">
                                拒收任务
                            </Radio>
                        </RadioGroup>
                    </div>

                    <div style="padding-top: 15px;padding-left: 15px" v-if="billInfo.isAccept == '0'">
                        <p class="required" style="margin: 15px 0 10px;">拒收任务原因</p>
                        <Input v-model="refuseInfo" style="margin-left: 15px;" type="textarea" placeholder="请输入拒收原因以便重新安排"></Input>
                    </div>

                    <div style="text-align: center;padding-top:30px">
                        <Button style="width: 100px" size="small" @click="changeServiceServeState">确认</Button>
                    </div>
                </div>
                <div class="box-content" v-else-if="selectedNode && billProcessNodeInfo && !finishStatus">
                    <div>
                        <span>服务节点：</span>
                        <span>{{selectedNode.name}}</span>
                    </div>
                    <!--<div style="padding-top: 15px;padding-left: 15px">-->
                        <!--<Button v-if="selectedNode.completeState == '1'" type="ghost" size="small" style="font-size: 12px;color: #59b399;border-color: #59b399;padding: 3px 21px;">已完成</Button>-->
                        <!--<RadioGroup v-else v-model="billProcessNodeInfo.completeState">-->
                            <!--<Radio label="0" :disabled="!isEditable">-->
                                <!--未完成-->
                            <!--</Radio>-->
                            <!--<Radio label="1" :disabled="!isEditable">-->
                                <!--已完成-->
                            <!--</Radio>-->
                        <!--</RadioGroup>-->
                    <!--</div>-->
                    <br>
                    <Row style="line-height: 47px;padding-right: 25px;">
                        <i-col span="3">
                            <span class="required" style="white-space: nowrap;">实际开始时间：</span>
                        </i-col>
                        <i-col span="6">
                            <DatePicker type="date" v-model="billProcessNodeInfo.nodeStart" :editable="false" placeholder="选择日期" :disabled="!isEditable" style="width: 100%"></DatePicker>
                        </i-col>
                        <i-col span="3" offset="6">
                            <span class="required" style="white-space: nowrap;">实际结束时间：</span>
                        </i-col>
                        <i-col span="6">
                            <DatePicker type="date" v-model="billProcessNodeInfo.nodeEnd" :editable="false" placeholder="选择日期" :disabled="!isEditable" style="width: 100%"></DatePicker>
                        </i-col>
                    </Row>
                    <div class="preInfo">
                        <div style="padding-bottom: 10px">
                            <span>准备资料：</span>
                        </div>
                        <SDFileList :billId="billId" :nodeId="billProcessNodeInfo.id" :billCycleId="billCycleId" :isShowFileType="false" fileType="PREPARE" :isAllowAddRow="isEditable" :isAllowEdit="isEditable"></SDFileList>
                    </div>
                    <div>
                        <div style="padding-bottom: 10px">
                            <span>产出资料：</span>
                        </div>
                        <SDFileList :billId="billId" :nodeId="billProcessNodeInfo.id" :billCycleId="billCycleId" :isShowFileType="false" fileType="OUTPUT" :isAllowAddRow="isEditable" :isAllowEdit="isEditable"></SDFileList>
                    </div>
                    <div>
                        <div  style="padding-bottom: 10px">
                            <span>相关说明：</span>
                        </div>
                        <div class="about">
                            <Input v-model="billProcessNodeInfo.remark" type="textarea" placeholder="请输入具体情况说明" :disabled="!isEditable"></Input>
                        </div>
                    </div>
                    <div style="text-align: center;padding-top:30px" v-if="isEditable">
                        <Button style="width: 100px" type="ghost" size="small" @click="nodeInfoSave('0')">暂存</Button>
                        <Button style="width: 100px" size="small" @click="nodeInfoSave('1')">完成节点</Button>
                    </div>
                </div>
                <div class="box-content" v-if="finishStatus">
                    <div>
                        <span>服务节点：</span>
                        <span>服务结束</span>
                    </div>
                    <br>
                    <div>
                        <span class="finishTitle">服务最终完成时间</span>
                        <DatePicker type="date" v-model="finishDate" placeholder="请选择服务完成时间" style="width: 200px;padding-left: 20px"></DatePicker>
                    </div>
                    <div style="text-align: center;padding-top:30px">
                        <Button style="width: 100px" size="small" @click="finishTask">确认</Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import SDFileList from '../serviceDispatch/SDFileList.vue'

    export default {
        components: {
            SDFileList
        },
        filters: {
            formatDate(time) {
                if (time) {
                    var date = new Date(time);
                    return date.format('yyyy/MM/dd');
                }
                return '暂无';
            },
            infoFilter(val, format) {
                if (!val) {
                    return format ? format : '暂无';
                }
                return val;
            }
        },
        props: {
            billId: null,
        },
        data: function() {
            return {
                isEditable: true,
                userId: null,
                contract: {},

                billInfo: {
                    serveState: null,
                    isAccept: 1
                },
                billProcessNodeList: [],
                selectedNode: null,
                billProcessNodeInfo: null,
                refuseInfo: '',
                finishStatus: false,
                finishDate: null,
                billCycleId: null
            }
        },
        watch: {
            billId(val) {
                this.billId = val;
                this.billInfo.isAccept = 1;
                this.refuseInfo = '';
                this.selectedNode = null;
                this.billCycleId = null;
                this.initServiceInfo();
            }
        },
        created: function () {
            this.userId = window.Context.getCurrentUser().id;
        },
        methods: {
            init(){
              this.initServiceInfo();
            },
            initServiceInfo () {
                if (this.billId) {
                    this.request({
                        url: '/serviceCloud/serviceDispatch/SDInfo.do',
                        param: {
                            id: this.billId
                        }
                    }).then(billInfo => {
                        this.finishStatus = false;
                        this.billInfo = Object.assign(this.billInfo, billInfo);
                        if (billInfo.serveState == 'FINISHED') {
                            this.isEditable = false;
                        }
                        this.getBillProcessNodeList();
                    });
                }
            },
            getBillProcessNodeList () {
                if (this.billInfo.serveState == null || this.billInfo.serveState == 'UNSTARTED') {
                    this.request({
                        url: '/serviceCloud/servicePerson/billDefProcessNodeList.do',
                        param: {
                            billDefId: this.billInfo.billDefId
                        }
                    }).then(data => {
                        this.billProcessNodeList = Object.assign([], data);
                        this.billProcessNodeList.forEach(item => {
                            item.nodeNumber = item.number;
                        });
                    });
                }else {
                    this.request({
                        url: '/serviceCloud/servicePerson/billProcessNodeList.do',
                        param: {
                            billId: this.billId
                        }
                    }).then(data => {
                        if (data) {
                            if (data.length > 0) {
                                this.billCycleId = data[0].id;
                                let nodeList = data[0].nodeVoList;
                                this.billProcessNodeList = Object.assign([], nodeList);
                                if (this.billInfo.serveState && this.billInfo.serveState != 'UNSTARTED') {
                                    let i;
                                    for (i = 0; i < this.billProcessNodeList.length; i++) {
                                        if (this.billInfo.serveState == 'FINISHED') {
                                            this.getBillProcessNodeInfo(this.billProcessNodeList[0]);
                                            break;
                                        }else if (this.billProcessNodeList[i].completeState == 0) {
                                            this.finishStatus = false;
                                            this.getBillProcessNodeInfo(this.billProcessNodeList[i]);
                                            break;
                                        }
                                    }
                                    if (i >= this.billProcessNodeList.length) {
                                        this.getBillProcessNodeInfo(this.billProcessNodeList[i - 1]);
                                        this.isEditable = false;
                                    }
                                }
                            }
                        }
                    });
                }
            },
            getBillProcessNodeInfo (item) {
                this.finishStatus = false;
                if (this.billInfo.serveState && this.billInfo.serveState != 'UNSTARTED') {
                    this.selectedNode = item;
                    this.request({
                        url: '/serviceCloud/servicePerson/billProcessNodeInfo.do',
                        param: {
                            id: this.selectedNode.id
                        }
                    }).then(data => {
                        this.billProcessNodeInfo = Object.assign({}, data);
                        if (data && this.billInfo.serveState != 'FINISHED') {
                            this.isEditable = (data.completeState == 0);
                        } else {
                            this.isEditable = false;
                        }
                    });
                }
            },
            changeServiceServeState () {
                if (!this.billInfo.isAccept || this.billInfo.isAccept == '0') {
                    if (String.isNullOrBlank(this.refuseInfo)) {
                        this.$Message.error('请输入拒收原因');
                        return;
                    }
                }
                this.request({
                    url: '/serviceCloud/servicePerson/receiveOrRefuse.do',
                    param: {
                        billId: this.billId,
                        state: this.billInfo.isAccept,
                        refuse: (!this.billInfo.isAccept || this.billInfo.isAccept == '0') ? this.refuseInfo : null
                    }
                }).then(data => {
                    this.initServiceInfo();
                    this.$Message.success((this.billInfo.isAccept == 1) ? '接收任务操作成功' : '拒收任务操作成功');
                    if (this.billInfo.isAccept == 0) {
                        //回调左侧任务列表
                        this.$emit('on-refresh-task-list');
                    }
                });
            },
            nodeInfoSave (state) {
                this.billProcessNodeInfo.completeState = state;
                let startDate = this.billProcessNodeInfo.nodeStart;
                let endDate = this.billProcessNodeInfo.nodeEnd;
                if (this.billProcessNodeInfo.completeState == '1') {
                    if (String.isNullOrBlank(startDate)) {
                        this.$Message.error('请输入实际开始时间');
                        return;
                    }
                    if (String.isNullOrBlank(endDate)) {
                        this.$Message.error('请输入实际结束时间');
                        return;
                    }
                }
                if (!String.isNullOrBlank(startDate) && !String.isNullOrBlank(endDate)) {
                    let months = Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()));
                    if (months < 0) {
                        this.$Message.error('服务结束时间不应该早于服务开始时间');
                        return;
                    }
                }
                this.request({
                    url: '/serviceCloud/servicePerson/billProcessNodeInfoSave.do',
                    data: this.billProcessNodeInfo
                }).then(data => {
                    this.initServiceInfo();
                    this.$Message.success('服务信息更新成功');
                });
            },
            showEndView() {
                if (this.billInfo.serveState && this.billInfo.serveState != 'UNSTARTED' && this.billInfo.serveState != 'FINISHED') {
                    this.selectedNode = null;
                    this.finishStatus = true;
                }else {
                    this.finishStatus = false;
                }
            },
            finishTask(){
                if(this.finishDate==''){
                    this.$Message.error('请输入服务最终完成时间');
                    return;
                }
                if(this.billInfo && this.billInfo.serveState == 'SERVING'){
                    let flag = true;
                    for (let i = 0; i < this.billProcessNodeList.length; i++) {
                        if (this.billProcessNodeList[i].completeState == 0) {
                            flag = false;
                            break;
                        }
                    }
                    if(!flag){
                        this.$Modal.confirm({
                            title: '请确认',
                            content: '当前服务环节尚有未完成节点，是否结束服务？',
                            onOk: () => {
                                this.finishConfirm();
                            }
                        });
                    }else{
                        this.finishConfirm();
                    }
                }
            },
            finishConfirm(){
                this.request({
                    url: "/serviceCloud/servicePerson/finishService.do",
                    param:{
                        billId: this.billId,
                        endDate:this.finishDate.format('yyyy-MM-dd')
                    }
                }).then(data => {
                    this.$Message.success('服务已结束');
                    this.$emit('on-refresh-task-list');
                });
            },
            preview: function () {
                if(this.billInfo){
                    if (this.billInfo.pdfFile) {
                        window.open('/ossController/oss/publicFile.do?id=' + this.billInfo.pdfFile);
                    }else {
                        this.$Message.error("无合约文件！");
                    }
                }else{
                    this.$Message.error("无合约文件！");
                }
            },
        }
    }
</script>

<style scoped>
    .container {
        padding: 10px;
        background: #f6f6f6;
    }
    .container .box {
        background: #FFF;
        padding: 30px;
    }
    .container .title {
        color: #101010;
        line-height: 23px;
        font-weight: bold;
        font-size: 16px;
    }
    .container > .title {
        margin-top: 30px;
        font-size: 18px;
        line-height: 1;
        font-weight: bold;
        color: #aaa;
    }
    .container .item-text {
        color: #333;
        font-weight: normal;
    }
    .container .item-text >>> .ivu-tooltip-rel {
        display: inline-block;
        max-width: 300px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .change-info,
    .collection-info,
    .invoice-info {
        position: relative;
    }

    .container .item-text {
        color: #333;
        font-weight: normal;
    }

    .service-progress {
        display: table;
        margin: auto;
        padding-top: 15px;
    }

    .service-progress .ivu-timeline-item {
        float: left;
        margin: 12px 0 0!important;
    }

    .service-progress >>> .ivu-timeline-item-tail {
        height: 10px;
        width: 30%;
        margin-left: 35%;
        border-right: 0;
        position: absolute;
        left: 50px;
        top: 18px;
        border-left: 0;
        border-top: 1.5px dashed #a1a1a1;
        border-bottom: 1.5px dashed #a1a1a1;
    }

    .service-progress >>> .ivu-timeline-item-head {
        left: 28px;
        width: 45px;
        height: 45px;
        font-family: Ionicons;
        text-align: center;
        line-height: 45px;
        padding-left: 2px;
        color: #ababab;
        border: 0;
        /*background: #f6f6f6;*/
        font-size: 36px;
    }

    .service-progress .ivu-timeline-item:first-child >>> .ivu-timeline-item-head, .service-progress .ivu-timeline-item:last-child >>> .ivu-timeline-item-head {
        border: 1px solid #59b399;
        font-size: 18px;
        background: #FFF;
        color: #59b399;
    }

    .service-progress >>> .ivu-timeline-item-content {
        min-width: 100px;
        padding: 51px 12px 0px 12px;
        text-align: center;
    }

    .service-progress .ivu-timeline-item>>> .ivu-timeline-item-head::after {
        content: '\F12E';
    }

    .service-progress .ivu-timeline-item:first-child >>> .ivu-timeline-item-head::after {
        content: '\F215';
    }

    .service-progress .ivu-timeline-item:last-child >>> .ivu-timeline-item-head::after {
        content: '\F24F';
    }

    .service-progress .ivu-timeline-item.active >>> .ivu-timeline-item-tail {
        border-color: #59b399;
    }

    .service-progress .ivu-timeline-item.active >>> .ivu-timeline-item-head {
        color: #59b399!important;
        /*background: -webkit-gradient(linear, left top, left bottom, from(#FFF), to(#59b399), color-stop(0.5, #FFF), color-stop(0.5, #59b399));*/
    }

    .service-progress .ivu-timeline-item.active >>> .ivu-timeline-item-content {
        color: #495060!important;
    }

    .service-progress .ivu-timeline-item.active:first-child >>> .ivu-timeline-item-head, .service-progress .ivu-timeline-item.active:last-child >>> .ivu-timeline-item-head {
        background: #59b399!important;
        color: #FFF!important;
    }

    .contract-item {
        position: relative;
        display: flex;
        padding: 20px 50px 0;
    }

    .contract-info {
        width: 100%;
        font-size: 14px;
    }

    .contract-item .contract-img {
        position: relative;
        width: 130px;
        height: 170px;
        margin-right: 60px;
        background-image: url("../../signCloud/contract/image/contract-bg.png");
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;
        border: 1px solid #bec2c9;
    }

    .contract-item .contract-img::after {
        content: '服务单详情';
        position: absolute;
        bottom: 0;
        display: block;
        width: 100%;
        background: #59b399;
        line-height: 30px;
        font-size: 14px;
        font-weight: 600;
        text-align: center;
        color: #FFF;
    }

    .contract-item .contract-info p {
        margin-bottom: 15px;
    }

    .contract-item .contract-info p span:first-child{
        display: inline-block;
        min-width: 85px;
        margin-right: 20px;
        color: #aaa;
        font-weight: 600;
    }

    .contract-item .contract-info .half-width {
        width: 48%;
        display: inline-block;
    }

    .contract-item .item-text {
        color: #333;
        font-weight: normal;
    }

    .contract-item .service-tag {
        background: rgb(242, 131, 144);
        color: #FFF;
        font-size: 12px;
        padding: 5px 16px;
        border-radius: 5px;
        margin-left: 30px;
        font-weight: 600;
    }

    .box-content{
        padding: 20px 50px 0;
        position: relative;
    }
    .box-content *{
        font-size: 14px;
    }
    .box-content .ivu-row{
        padding-bottom: 15px;
    }

    .about {
        padding: 0 25px 0 30px;
    }

    .selected >>> .ivu-timeline-item-head {
        color: #ffa800;
        font-size: 50px;
    }

    .selected >>> .ivu-timeline-item-content {
        color: #ffa800;
        font-size: 15px;
    }

    .container >>> .ivu-tooltip-inner {
        white-space: normal;
    }

    .required:before {
        content: '*';
        display: inline-block;
        margin-right: 4px;
        line-height: 1;
        font-family: SimSun;
        font-size: 12px;
        color: #ed3f14;
    }
</style>