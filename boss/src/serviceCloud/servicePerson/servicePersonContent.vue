<style scoped>
    .container{
        padding: 10px 20px;
        background: #f6f6f6;
    }
    .title{
        color: #a8a8a8;
        font-size: 16px;
        line-height: 23px;
        font-weight: bold;
        font-style: normal;
    }
    .box{
        background: #fff;
        padding: 30px;
    }
    .box-title{
        color: #101010;
        line-height: 23px;
        font-weight: bold;
        font-size: 16px;
    }
    .box-content{
        padding-left: 50px;
        padding-right: 50px;
        position: relative;
    }


    .box-content-unStart{
        text-align: center;
        padding-top: 40px;
        padding-bottom: 100px;
    }
    .box-content-unStart >a{
        color: #54B499;
    }

    .box-content *{
        font-size: 14px;
    }
    .box-content .ivu-row{
        padding-bottom: 15px;
    }
    .service-img {
        position: relative;
        width: 130px;
        height: 170px;
        background-image: url("../image/contract-bg.png");
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;
        border: 1px solid #bec2c9;
        cursor: pointer;
    }
    .service-img-bottom{
        position: absolute;
        color: #ffffff;
        background: #54B499;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        text-align: center;
        border-color: #dddee1;
    }


    .infoEditItem{
        display: flex;
        padding-bottom: 15px;
    }
    .infoList{
        padding-left: 30px;
        padding-right: 30px;
    }
    .about{
        padding-left: 30px;
        padding-right: 30px;
    }

    .node-list{
        padding: 25px;
        /*display: -webkit-box;*/
        /*-webkit-box-orient: horizontal;*/
        /*-webkit-box-pack: center;*/

        display: flex;
        justify-content: center;
        align-items: center;
    }
    .node-start{
    }
    .node-start-icon{
        background-color:#54B499;
        -moz-border-radius: 25px;
        -webkit-border-radius: 25px;
        border-radius: 25px;
        width: 50px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        font-size: 30px;
        color: #FFF;
    }

    .node-start-icon-unStart{
        background-color:#FFF;
        border: 1px solid #54B499;
        -moz-border-radius: 25px;
        -webkit-border-radius: 25px;
        border-radius: 25px;
        width: 50px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        font-size: 30px;
        color: #54B499;
    }
    .node-end-icon-finished{
        background-color:#54B499!important;
        -moz-border-radius: 25px;
        -webkit-border-radius: 25px;
        border-radius: 25px;
        width: 50px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        font-size: 20px!important;
        color: #FFF!important;
    }

    .node-start-title{
        text-align: center;
        padding-top: 10px;
        font-size: 10px;
        color:#54B499 ;
    }
    .node-box{
        /*display: -webkit-box;*/
        /*-webkit-box-align: center;*/
        /*-webkit-box-orient: horizontal;*/
        /*-webkit-box-pack: center;*/
        display: flex;
        justify-content: center;
        align-items: center;

        height: 100px;
        border:1px dashed #54B499;
        width: 540px;
        margin-top: -20px;
        position: relative;
    }
    .node-box .node-line{
        margin-bottom: 25px;
    }
    .node-line{
        width: 25px;
        height: 50px;
        padding: 20px 5px 20px 5px;
    }
    .node-line div{
        border-top:1.5px dashed #a1a1a1;
        border-bottom:1.5px dashed #a1a1a1;
        height: 100%;
        width: 100%;
    }
    .node-line-complete{
        border-top:1.5px dashed #54B499!important;
        border-bottom:1.5px dashed #54B499!important;
    }
    .start div{
        border-top:1.5px dashed #54B499;
        border-bottom:1.5px dashed #54B499;
    }
    .node-end{
        cursor: pointer;
    }
    .node-end-icon{
        background-color:#FFF;
        border: 1px solid #54B499;
        -moz-border-radius: 25px;
        -webkit-border-radius: 25px;
        border-radius: 25px;
        width: 50px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        font-size: 20px;
        color: #54B499;
    }
    .node-end-title{
        text-align: center;
        padding-top: 10px;
        font-size: 10px;
        color:#54B499 ;
    }

    .node-item{

    }
    .node-item:hover{
        cursor: pointer;
    }

    .node-item-complete .node-item-icon{
        color: #54B499!important;
    }
    .node-item-complete .node-item-title{
        color: #54B499!important;
    }
    .node-item-icon:hover{
        font-size: 50px;
    }
    .node-item-select{
        font-size: 50px!important;
        color: #ffa800!important;
    }
    .node-item-title-select{
        padding-top: 10px!important;
        font-size: 12px!important;
        color: #ffa800!important;
    }
    .node-item-icon{
        font-size: 40px;
        text-align: center;
        line-height: 50px;
        color: #bbbcbf;
    }
    .node-item-title{
        padding-top: 10px;
        font-size: 10px;
        color:#bbbcbf ;
        white-space: nowrap;
    }

    .node-round{
        height: 160px;
        border:1px dashed #54B499;
        width: 500px;
        margin-top: -20px;
        position: relative;
    }
    .node-round-up{
        /*display: -webkit-box;*/
        /*-webkit-box-align: center;*/
        /*-webkit-box-orient: horizontal;*/
        /*-webkit-box-pack: center;*/
        display: flex;
        justify-content: center;
        align-items: center;

        height: 80px;
        line-height: 80px;

    }

    .node-round-up-tag{
        position: absolute;
        right: 0;
        background: #54B499;
        color: #FFFFFF;
        font-size: 10px;
        padding: 2px 4px 2px 4px;
    }

    .node-round-down-tag{
        position: absolute;
        right: 0;
        top:75px;
        background: #dedee4;
        color:#A1A1A1;
        padding: 1px 8px 1px 8px;
    }
    .node-round-item-icon{
        background-color:#FFF;
        border: 1px solid #54B499;
        -moz-border-radius: 22px;
        -webkit-border-radius: 22px;
        border-radius: 22px;
        width: 44px;
        height: 44px;
        text-align: center;
        line-height: 44px;
        font-size: 14px;
        color: #54B499;
    }
    .node-round-item-icon:hover{
        width: 50px;
        height: 50px;
        -moz-border-radius: 25px;
        -webkit-border-radius: 25px;
        border-radius: 25px;
        line-height: 50px;
    }
    .node-end-icon-selected{
        width: 50px;
        height: 50px;
        color: #FFFFFF;
        -moz-border-radius: 25px;
        -webkit-border-radius: 25px;
        border-radius: 25px;
        line-height: 50px;
        border-color: #ffa800;
        background: #ffa800;
    }
    .node-round-item-selected{
        width: 50px;
        height: 50px;
        color: #FFFFFF;
        -moz-border-radius: 25px;
        -webkit-border-radius: 25px;
        border-radius: 25px;
        line-height: 50px;
        border-color: #ffa800;
        background: #ffa800;
    }
    .node-round-item{
        padding-right: 10px;
        padding-left: 10px;
    }

    .roundComplete{
        color: #FFFFFF;
        background: #54B499;
        border-color: #54B499;
    }

    .node-btn{
        color: #D9D9D9;
        font-size: 16px;
    }

    .node-btn-enable{
        color: #54B499;
        cursor: pointer;
    }

    .node-round-down{
        height: 80px;
        background: #FFF;
        border-bottom:1px dashed #54B499;
        /*display: -webkit-box;*/
        /*-webkit-box-align: center;*/
        /*-webkit-box-orient: horizontal;*/
        /*-webkit-box-pack: center;*/
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .node-round-down .node-item{
        padding-right: 12px;
        padding-left: 12px;
    }

    .contractInfo{
        width: 640px;
    }
    .contract-img {
        position: relative;
        width: 115px;
        height: 150px;
        background-image: url("../../signCloud/contract/image/contract-bg.png");
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;
    }
    .contract-sign-red {
        position: absolute;
        top: 20px;
        left: 0;
        width: 60px;
        height: 28px;
        line-height: 28px;
        background: rgb(255, 100, 100);
        box-shadow: 0 0 4px 0 rgba(255, 100, 100, 0.3);
        color: white;
        text-align: center;
        border-top-right-radius: 14px;
        border-bottom-right-radius: 14px;
        font-weight: bold;
        font-size: 14px;
    }
    .contract-sign-black{
        position: absolute;
        top: 20px;
        left: 0;
        width: 60px;
        height: 28px;
        line-height: 28px;
        background: black;
        box-shadow: 0 0 4px 0 rgba(255, 100, 100, 0.3);
        color: white;
        text-align: center;
        border-top-right-radius: 14px;
        border-bottom-right-radius: 14px;
        font-weight: bold;
        font-size: 14px;
    }
    .contractRow{
        line-height: 28px;
    }
    .finishTitle:before{
        content: "*";
        display: inline-block;
        margin-right: 4px;
        line-height: 1;
        font-family: SimSun;
        font-size: 12px;
        color: #ed3f14;
    }
    .service-target-tips .ivu-tooltip{
        max-width: 100%;
    }

    .org-name-tip >>> .ivu-tooltip-rel {
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .org-name-tip >>> .ivu-tooltip-inner {
        white-space: normal;
        word-break: break-all;
    }

</style>
<style>
    .service-target-tips .ivu-tooltip-rel{
        max-width: 100%;
    }
</style>
<template>
    <div class="container" v-if="info.id">
        <div class="title">
            <span>服务单编号</span>
            <span>{{info.code}}</span>
        </div>

        <div class="box">
            <div class="box-title">
                服务单信息
            </div>
            <Row style="float: right;padding-right: 50px">
                <Poptip title="合约信息" content="提示内容" placement="bottom-end">
                    <a>合约信息</a>
                    <div slot="content" class="contractInfo">
                        <Row>
                            <i-col span="5">
                                <div class="contract-img">
                                    <div class="contract-sign-red">
                                        <span v-if="contractInfo.status === 'SIGNED'">已签署</span>
                                        <span v-if="contractInfo.status != 'SIGNED' && contractInfo.status != 'INVALID'">已核准</span>
                                        <span v-if="contractInfo.status === 'INVALID'">已作废</span>
                                    </div>
                                    <div v-if="contractInfo.status === 'TERMINATION'" class="contract-sign-black">
                                        <span v-if="contractInfo.status === 'TERMINATION'">已解约</span>
                                    </div>
                                </div>
                            </i-col>
                            <i-col span="19" style="padding-top: 30px">
                                <Row class="contractRow">
                                    <i-col span="3"><span>合约编号：</span></i-col>
                                    <i-col span="8"><span>{{contractInfo.code}}</span></i-col>
                                    <i-col span="4"><Tag type="border" color="green">{{contractInfo.serviceFullName}}</Tag></i-col>
                                </Row>
                                <Row  class="contractRow">
                                    <i-col span="3"><span>甲方：</span></i-col>
                                    <i-col span="8" class="service-target-tips">
                                        <Tooltip  placement="top" transfer>
                                            <p style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{contractInfo.subjectName}}</p>
                                            <p slot="content" style="white-space: normal;">
                                                {{contractInfo.subjectName}}
                                            </p>
                                        </Tooltip>
                                    </i-col>
                                    <i-col span="4"><Tag type="border" color="green">{{contractInfo.subjectType=='COMPANY'?'企业':(contractInfo.subjectType=='PERSON'?'个人':'其他')}}</Tag></i-col>
                                    <i-col span="3"><span>证件号码：</span></i-col>
                                    <i-col span="6"><span>{{contractInfo.idno}}</span></i-col>
                                </Row>
                                <Row  class="contractRow">
                                    <i-col span="3"><span>联系人：</span></i-col>
                                    <i-col span="8"><span>{{contractInfo.contactName}}</span></i-col>
                                    <i-col span="4">&nbsp;</i-col>
                                    <i-col span="3"><span>联系电话：</span></i-col>
                                    <i-col span="6"><span>{{contractInfo.contactPhone}}</span></i-col>
                                </Row>
                            </i-col>
                        </Row>
                    </div>
                </Poptip>

            </Row>
            <br>
            <div class="box-content">
                <Row>
                    <i-col span="5">
                        <div class="service-img" @click="preview" style="margin-right: 60px;">
                            <div class="service-img-bottom">
                                <span>服务单详情</span>
                            </div>
                        </div>
                    </i-col>
                    <i-col span="19">
                        <Row>
                            <i-col span="3"><span>客户名称</span></i-col>
                            <i-col span="8" class="service-target-tips">
                                <Tooltip  placement="top">
                                    <p style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{info.customerName}}</p>
                                    <p slot="content" style="white-space: normal">
                                        {{info.customerName}}
                                    </p>
                                </Tooltip>
                            </i-col>
                            <i-col span="8"><Tag color="blue">{{info.billDefName}}</Tag></i-col>
                        </Row>
                        <Row>
                            <i-col span="3"><span>销售组织</span></i-col>
                            <i-col span="8">
                                <Tooltip class="org-name-tip" placement="bottom" style="max-width: 100%;">
                                    {{info.saleOrgName}}
                                    <div slot="content">
                                        <span>{{info.saleOrgName}}</span>
                                    </div>
                                </Tooltip>

                            </i-col>
                        </Row>
                        <Row>
                            <i-col span="3"><span>派工时间</span></i-col>
                            <i-col span="8"><span>{{info.divideDate|formatDate}}</span></i-col>
                        </Row>
                        <Row>
                            <i-col span="3"><span>服务结算价</span></i-col>
                            <i-col span="8"><span>￥{{info.settlementPrice}}</span></i-col>
                            <i-col span="4">&nbsp;</i-col>
                            <i-col span="3"><span>服务频率</span></i-col>
                            <i-col span="6"><span>{{info.serviceFrequency=='PERIODIC'?'周期性':'一次性'}}</span></i-col>
                        </Row>
                        <Row>
                            <i-col span="3"><span>派单人</span></i-col>
                            <i-col span="8"><span>{{info.dispatcherName}}</span></i-col>
                            <i-col span="4">&nbsp;</i-col>
                            <i-col span="3"><span>联系电话</span></i-col>
                            <i-col span="6"><span>{{info.dispatcherPhone}}</span></i-col>
                        </Row>
                    </i-col>
                </Row>
            </div>
        </div>



        <br>
        <div class="box">
            <div class="node-list" v-if="info.serviceFrequency=='DISPOSABLE'">
                <div class="node-start">
                    <div :class="info.serveState=='UNSTARTED'?'node-start-icon-unStart':'node-start-icon'">
                        <Icon  style="padding-left: 4px;" type="ios-play"></Icon>
                    </div>
                    <div class="node-start-title">
                        <span>服务开始</span>
                    </div>
                </div>
                <div class="node-line" :class="info.serveState=='SERVING'||info.serveState=='FINISHED'?'start':''"><div></div></div>
                <div class="node-box">
                    <div class="node-round-item node-btn" :class="currentNodeIndex<=0?'':'node-btn-enable'" @click="changeNodeIndex(-1)">
                        <Icon type="chevron-left" ></Icon>
                    </div>
                    <template v-for="(process,index) in currentNodeList">
                        <div class="node-item" @click="selectNode(process,index)" :class="process.completeState=='1'?'node-item-complete':''">
                            <div class="node-item-icon" :class="selectedNode==process?'node-item-select':''">
                                <Icon type="document-text"></Icon>
                            </div>
                            <div class="node-item-title" :class="selectedNode==process?'node-item-title-select':''">
                                {{process.name}}
                            </div>
                        </div>
                        <div class="node-line" v-if="index<currentNodeList.length-1"><div :class="process.completeState=='1'?'node-line-complete':''"></div></div>
                    </template>
                    <div class="node-round-item node-btn" :class="(processList.length-currentNodeIndex<=6)?'':'node-btn-enable'" @click="changeNodeIndex(1)">
                        <Icon type="chevron-right" ></Icon>
                    </div>
                </div>
                <div class="node-line"><div :class="info.serveState=='FINISHED'?'node-line-complete':''"></div></div>
                <div class="node-end" @click="finishService(0)">
                    <div class="node-end-icon" :class="{'node-end-icon-finished':info.serveState=='FINISHED','node-end-icon-selected':finishView}">
                        <Icon type="stop"></Icon>
                    </div>
                    <div class="node-end-title" :class="{'node-item-title-select':finishView}">
                        <span>服务结束</span>
                    </div>
                </div>
            </div>
            <div class="node-list" v-if="info.serviceFrequency=='PERIODIC'">
                <div class="node-start">
                    <div :class="info.serveState=='UNSTARTED'?'node-start-icon-unStart':'node-start-icon'">
                        <Icon style="padding-left: 4px;" type="ios-play"></Icon>
                    </div>
                    <div class="node-start-title">
                        <span>服务开始</span>
                    </div>
                </div>
                <div class="node-line"><div></div></div>
                <div class="node-round">
                    <div class="node-round-up-tag">
                        <span>{{info.serviceLifeNum}}期</span>
                    </div>
                    <div class="node-round-down-tag">
                        <span>{{processList.length}}</span>
                    </div>
                    <div class="node-round-up"  v-if="info.serveState&&info.serveState!='UNSTARTED'">
                        <div class="node-round-item node-btn" :class="currentIndex<=0?'':'node-btn-enable'" @click="changeIndex(-1)">
                            <Icon type="chevron-left" ></Icon>
                        </div>
                        <div class="node-round-item" v-for="roundItem in currentRoundList">
                            <Tooltip :content="new Date(roundItem.cycleStart).getFullYear()+'年'+(new Date(roundItem.cycleStart).getMonth()+1)+'月第'+roundItem.cycleNumber+'期'" placement="top">
                                <div class="node-round-item-icon" :class="{'node-round-item-selected':roundItem==selectedRound,'roundComplete':roundItem.completeState=='1'}" @click="selectRound(roundItem)">
                                    <span>{{roundItem.cycleNumber}}期</span>
                                </div>
                            </Tooltip>
                        </div>
                        <div class="node-round-item node-btn" :class="(roundList.length-currentIndex<=6)?'':'node-btn-enable'" @click="changeIndex(1)">
                            <Icon type="chevron-right" ></Icon>
                        </div>
                    </div>
                    <!--没有生成周期前的期数-->
                    <div class="node-round-up"  v-if="!info.serveState||info.serveState=='UNSTARTED'">
                        <div class="node-round-item node-btn" >
                            <Icon type="chevron-left" ></Icon>
                        </div>
                        <div class="node-round-item" v-for="i in info.serviceLifeNum>6?6:info.serviceLifeNum">
                            <div class="node-round-item-icon">
                                <span>{{i}}期</span>
                            </div>
                        </div>
                        <div class="node-round-item node-btn"  >
                            <Icon type="chevron-right" ></Icon>
                        </div>
                    </div>

                    <div class="node-round-down">
                        <div class="node-item node-btn" :class="currentNodeIndex<=0?'':'node-btn-enable'" @click="changeNodeIndex(-1)">
                            <Icon type="chevron-left"></Icon>
                        </div>
                        <div class="node-item" :class="nodeItem.completeState=='1'?'node-item-complete':''" @click="selectNode(nodeItem,index)" v-for="(nodeItem,index) in currentNodeList">
                            <div class="node-item-icon" :class="selectedNode==nodeItem?'node-item-select':''">
                                <Icon type="document-text"></Icon>
                            </div>
                            <div class="node-item-title" :class="selectedNode==nodeItem?'node-item-title-select':''">
                                {{nodeItem.name}}
                            </div>
                        </div>
                        <div class="node-item node-btn" :class="(processList.length-currentNodeIndex<=6)?'':'node-btn-enable'" @click="changeNodeIndex(1)">
                            <Icon type="chevron-right"></Icon>
                        </div>
                    </div>
                </div>
                <div class="node-line"><div></div></div>
                <div class="node-end" @click="finishService(1)">
                    <div class="node-end-icon"  :class="{'node-end-icon-finished':info.serveState=='FINISHED','node-end-icon-selected':finishView}">
                        <Icon type="stop"></Icon>
                    </div>
                    <div class="node-end-title" :class="{'node-item-title-select':finishView}">
                        <span>服务结束</span>
                    </div>
                </div>
            </div>
            <div class="box-title">
                服务信息
            </div>
            <br>
            <div class="box-content-unStart"  v-if="!info.serveState||info.serveState=='UNSTARTED'">
                <p>服务尚未开始，本服务于<DatePicker :editable="false" placement="top" size="small" v-model="startDate" type="date" placeholder="服务开始时间" style="position:relative;width: 200px;padding-left: 5px;padding-right: 5px"></DatePicker>开始</p>
                <br>
                <p>
                    <Button @click="startService">开始服务</Button>
                </p>

            </div>
            <div class="box-content" v-if="info.serveState&&info.serveState!='UNSTARTED'&&!finishView">
                <div>
                    <span>服务节点：</span>
                    <span>{{selectedNode.name}}</span>
                </div>
                <!--<div style="padding-top: 15px;padding-left: 15px" v-if="selectedNode">-->
                    <!--<Tag v-if="selectedNode.completeState=='1'" type="border" color="green">已完成</Tag>-->
                    <!--<RadioGroup v-if="selectedNode.completeState=='0'" v-model="completeState">-->
                        <!--<Radio label="0">-->
                            <!--未完成-->
                        <!--</Radio>-->
                        <!--<Radio label="1">-->
                            <!--已完成-->
                        <!--</Radio>-->
                    <!--</RadioGroup>-->
                <!--</div>-->
                <br>
                <div class="preInfo">
                    <div style="padding-bottom: 10px">
                        <span>准备资料：</span>
                    </div>
                    <SDFileList :isAllowAddRow="selectedNode.completeState=='0'" :isAllowEdit="selectedNode.completeState=='0'" :nodeId="selectedNode.id" :billCycleId="selectedRound.id" :isShowFileType="false" fileType="PREPARE"  :billId="info.id"></SDFileList>
                </div>
                <div>
                    <div style="padding-bottom: 10px">
                        <span>产出资料：</span>
                    </div>
                    <SDFileList :isAllowAddRow="selectedNode.completeState=='0'" :isAllowEdit="selectedNode.completeState=='0'" :nodeId="selectedNode.id" :billCycleId="selectedRound.id" :isShowFileType="false" fileType="OUTPUT" :billId="info.id"></SDFileList>
                </div>
                <div>
                    <div  style="padding-bottom: 10px">
                        <span>相关说明：</span>
                    </div>
                    <div class="about" v-if="selectedNode">
                        <Input type="textarea" :readonly="selectedNode.completeState=='1'" placeholder="请输入具体情况说明" v-model="selectedNode.remark"></Input>
                    </div>
                </div>
                <br/>
                <!-- 注册信息登记 -->
                <div v-if="selectedNode.isOutCustomer">
                    <div>
                        <span>注册信息登记：</span>
                    </div>
                    <br/>
                    <RegisterInfoCard ref="registerForm" :registerInfo="selectedNode.content" :isEditable="selectedNode.completeState!='1'"></RegisterInfoCard>
                </div>

                <div style="text-align: center;padding-top:30px" v-if="selectedNode.completeState=='0'&&info.serveState!='FINISHED'">
                    <Button style="width: 100px" type="ghost" size="small" @click="checkRegisterForm('0')">暂存</Button>
                    <Button style="width: 100px" size="small" @click="checkRegisterForm('1')">完成节点</Button>
                </div>
            </div>
            <div class="box-content" v-if="info.serveState&&info.serveState!='UNSTARTED'&&finishView">
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
</template>

<script type="text/babel">
    import SDFileList from '../serviceDispatch/SDFileList.vue';
    import RegisterInfoCard from './registerInfoCard';

    export default {
        components: {
            SDFileList,
            RegisterInfoCard
        },
        filters: {
            formatDate(time) {
                if (time) {
                    var date = new Date(time);
                    return date.format('yyyy/MM/dd');
                }
                return '暂无';
            }
        },
        props:{
            billId:{
                type:String,
                default:''
            }
        },
        computed:{
            currentNodeList(){
                let start = this.currentNodeIndex;
                let end = start+6;
                let result = [];
                this.processList.map((m,i)=>{
                    if(i>=start&&i<end)
                        result.push(m);
                });
                return  result;

            },
            currentRoundList(){
                let start = this.currentIndex;
                let end = start+6;
                let result = [];
                this.roundList.map((m,i)=>{
                    if(i>=start&&i<end)
                        result.push(m);
                });
                return  result;
            }
        },
        data () {
            return {
                startDate:'',
                flag:'',
                finishView:false,
                finishDate:'',
                completeState:0,
                roundList:[],
                info:{
                },
                processList:[],
                currentIndex:0,
                currentNodeIndex:0,
                selectedNode:{
                    completeState:0
                },
                selectedRound:{},
                contractInfo:{},
                nodeIndex:0
            }
        },
        created () {
            // this.loadData();
        },
        mounted () {
        },
        methods: {
            finishConfirm(){
                this.request({
                    url: "serviceCloud/servicePerson/finishService.do",
                    param:{
                        billId:this.billId,
                        endDate:this.finishDate.format('yyyy-MM-dd')
                    }
                }).then(data => {
                    this.$Message.success('服务已结束');
                    this.finishDate = "";
                    this.info={};
                    this.$emit('on-refresh-task-list');
                });
            },
            finishTask(){
                if(this.finishDate==''){
                    this.$Message.error('请输入服务最终完成时间');
                    return;
                }
                if(this.info.serviceLifeStart&&this.finishDate<this.info.serviceLifeStart){
                    this.$Message.error('服务结束时间不能小于服务开始时间');
                    return;
                }

                if(this.info&&this.info.serveState=='SERVING'){
                    //一次性
                    if(this.flag==0){
                        var cs = this.processList.findIndex((node)=>{
                            return node.completeState==0
                        });
                        if(cs>-1){
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
                    }else{
                        var result = [];
                        this.roundList.map(round=>{
                            if(round.completeState==0)
                                result.push("第"+round.cycleNumber+"期");
                        });
                        if(result.length>0){
                            this.$Modal.confirm({
                                title: '请确认',
                                content: '当前周期服务尚有【'+result.join(',')+'】未完成，是否结束服务？',
                                onOk: () => {
                                    this.finishConfirm();
                                }
                            });
                        }else{
                            this.finishConfirm();
                        }
                    }
                }
            },
            finishService(flag){
                if(this.info.serveState=='SERVING'){
                    this.nodeIndex = 0;
                    this.finishView = true;
                    this.selectedNode = {};
                    this.flag = flag;
                }
            },
            loadContractInfo(){
                this.request({
                    url: "serviceCloud/servicePerson/contractInfo.do",
                    param:{
                        id:this.info.contractId,
                        saleOrgId:this.info.saleOrgId,
                        billDefId:this.info.billDefId
                    }
                }).then(data => {
                    this.contractInfo = data;
                });
            },
            updateProcessList(){
                if(this.selectedRound){
                    this.processList = this.selectedRound.nodeVoList;
//                    this.selectedNode = this.processList[this.nodeIndex];
                    var index  = this.processList.findIndex((m)=>{
                        return m.id == this.selectedNode.id;
                    });
                    index = index==-1?0:index;
                    this.selectedNode = this.processList[index];
                }
            },
            selectRound(round){
                this.selectedRound = round;
                this.finishView = false;
                this.updateProcessList();
            },
            checkRegisterForm(state) {
                if (this.selectedNode.isOutCustomer) {
                    this.$refs['registerForm'].save(this.saveNode, state);
                }else {
                    this.saveNode(null, state);
                }
            },
            saveNode(registerInfo, state){
                this.selectedNode.content = registerInfo;
                this.selectedNode.completeState = state;
                this.request({
                    url: "serviceCloud/servicePerson/saveNode.do",
                    data:{
                        nodeInfo:this.selectedNode
                    }
                }).then(() => {
                    this.$Message.success("保存成功");
                    this.completeState = 0;
                    this.loadData();
                },()=>{
                    this.completeState = 0;
                    this.loadData();
                });
            },
            selectNode(row,index){
                this.selectedNode=row;
                this.nodeIndex = index;
                this.finishView = false;
            },
            changeIndex(num){
                if((this.currentIndex<=0&&num<0))
                    return;
                if(this.roundList.length-this.currentIndex<=6&&num>0)
                    return;
                this.currentIndex+=num;
            },
            changeNodeIndex(num){
                if((this.currentNodeIndex<=0&&num<0))
                    return;
                if(this.processList.length-this.currentNodeIndex<=6&&num>0)
                    return;
                this.currentNodeIndex+=num;
            },
            loadProcessDef(){
                this.request({
                    url: "serviceCloud/servicePerson/processDef.do",
                    param:{
                        defId:this.info.billDefId
                    }
                }).then(data => {
                    this.processList = data;
                });
            },
            loadProcessNodeList(){
                this.request({
                    url: "serviceCloud/servicePerson/processNodeList.do",
                    param:{
                        billId:this.info.id
                    }
                }).then(data => {
                    this.roundList=data;
                    let roundIndex = 0;
                    if(this.selectedRound&&this.selectedRound.cycleNumber){
                        roundIndex = this.selectedRound.cycleNumber-1;
                    }
                    this.selectedRound = data[roundIndex];
                    this.updateProcessList();
                });
            },
            init(){
                this.completeState=0;
                this.roundList=[];
                this.processList=[];
                this.currentIndex=0;
                this.flag = '';
                this.finishView = false;
                this.selectedNode={
                    completeState:0
                };
                this.selectedRound={};
                this.contractInfo={};
                this.nodeIndex=0;
                this.finishDate = '';
                this.loadData();
            },
            loadData(){
                if(this.billId){
                    this.request({
                        url: "serviceCloud/servicePerson/taskInfo.do",
                        param:{
                            billId:this.billId
                        }
                    }).then(data => {
                        this.info = data;
                        //未开始从定义获取流程
                        if(this.info.serveState=='UNSTARTED'){
                            this.loadProcessDef();
                        }else{
                            this.loadProcessNodeList();
                        }
                        this.loadContractInfo();
                    });
                }

            },
            startService(){
                if(this.startDate==''){
                    this.$Message.error('请输入服务开始时间');
                    return;
                }
                this.request({
                    url: "serviceCloud/servicePerson/startService.do",
                    param:{
                        billId:this.billId,
                        beginDate:this.startDate.format('yyyy-MM-dd')
                    }
                }).then(data => {
                    this.$Message.success("服务已开启");
                    this.startDate = '';
                    this.nodeIndex = 0;
                    this.loadData();
                });
            },
            preview(){
                if(!this.info.pdfFile){
                    this.$Message.error("该服务单没有生成pdf文件");
                }else{
                    window.open(this.$updateConfig.file+this.info.pdfFile);
                }

            },
            uploadInputFile(){

            }
        }
    };
</script>
