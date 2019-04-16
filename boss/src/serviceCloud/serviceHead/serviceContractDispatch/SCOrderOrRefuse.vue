<style scoped>
    .ivu-collapse {
        border: 0;
    }
    .ivu-collapse >>> .ivu-collapse-header {
        padding-left: 5px;
    }
    .ivu-collapse >>> .ivu-collapse-header .ivu-icon.ivu-icon-arrow-right-b {
        display: none!important;
    }
    .ivu-collapse >>> .ivu-collapse-header span {
        font-size: 16px;
        color: #000;
        font-weight: 700;
    }
    .ivu-collapse >>> .ivu-collapse-header .collapse-icon {
        float: right;
        line-height: 38px;
        margin-right: 20px;
    }
    .ivu-collapse >>> .ivu-collapse-content {
        padding: 0;
    }
    .service-state {
        width: 0;
        height: 0;
        border-top: 40px solid #FFCC33;
        border-right: 40px solid transparent;
    }
    .service-state > span{
        position: relative;
        left: 5px;
        top: -38px;
        font-size: 14px;
        color: white;
    }
    .cancel-button{
        width: 80px;
        color: #59b399;
        background: white;
    }
    .save-button{
        width: 80px;
        color: white;
        background: #59b399;
    }
    .label-css{
        display: inline-block;
        width: 117px;
        color: #5d5d5d;
        font-weight: bold;
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
    .service-or-other-content{
        display: inline-block;
        color: #8c8c8c;
        width: 450px;
        word-break: break-all;
        word-wrap: break-word;
    }
    .info-css{
        display: inline-block;
        color: #8c8c8c;
    }
    .component-css >>> #gszcService .org-name {
        line-height: 33px;
        font-size: 14px;
        color: #8c8c8c;
        font-weight: normal;
    }
    .component-css >>> .ivu-form-item-label{
        color: #5d5d5d;
        font-weight: bold;
    }
    .customer-label{
        margin-top: 15px;
        padding-left: 25px;
    }
    .service-label{
        margin-top: 15px;
    }
    .invoice-form .ivu-form-item {
        margin-bottom: 15px;
    }
    .ivu-form-item-required >>> .ivu-form-item-error-tip {
        position: absolute;
        top: 100%;
        left: 0;
        line-height: 1;
        padding-top: 2px;
        color: #ed3f14;
    }
    .ivu-form-item-required >>> label{
        font-size: 14px;
        font-weight: 600;
    }
    .service-require >>> label{
        font-size: 14px;
        font-weight: 600;
    }
</style>
<template>
    <div class="container" style="padding: 10px 15px 10px 15px">
        <div class="content">
            <Row>
                <Collapse v-model="activeCollapse">
                    <Panel name="1">
                        <div>
                            <span>客户相关信息</span>
                            <Icon class="collapse-icon" :type="collapseStyle"></Icon>
                        </div>
                        <div slot="content" style="font-size: 14px;margin-top: 5px;color: #5d5d5d">
                            <i-col span="24" style="padding-left: 25px">
                                <div class="label-css">
                                    <span>合约编号</span>
                                </div>
                                <div class="info-css">
                                    <span>{{serviceOrderInfo.contractCode}}</span>
                                </div>
                                <div class="state-button-margin">
                                    <div class="state-button">
                                        <span>{{serviceOrderInfo.serviceType}}</span>
                                    </div>
                                </div>
                            </i-col>
                            <i-col span="24" class="customer-label">
                                <div class="label-css">
                                    <span>客户名称</span>
                                </div>
                                <div class="info-css">
                                    <span>{{serviceOrderInfo.customerName}}</span>
                                </div>
                                <div class="state-button-margin">
                                    <div class="state-button">
                                        <span>{{serviceOrderInfo.customerType=="PERSON"?"自然人":"企业"}}</span>
                                    </div>
                                </div>
                            </i-col>
                            <i-col span="24" class="customer-label">
                                <div class="label-css">
                                    <span>证件号码</span>
                                </div>
                                <div class="info-css">
                                    <span>{{serviceOrderInfo.customerNumber}}</span>
                                </div>
                            </i-col>
                            <i-col span="24" class="customer-label">
                                <div class="label-css">
                                    <span>联系人</span>
                                </div>
                                <div class="info-css" style="width: 100px">
                                    <span>{{serviceOrderInfo.contactName}}</span>
                                </div>
                                <div style="display: inline-block;margin-left: 50px;font-weight: bold">
                                    <span>联系电话</span>
                                </div>
                                <div class="info-css" style="margin-left: 30px">
                                    <span>{{serviceOrderInfo.contactPhone}}</span>
                                </div>
                            </i-col>
                            <i-col span="24" class="customer-label">
                                <div class="label-css">
                                    <span>客户经理</span>
                                </div>
                                <div class="info-css" style="width: 100px" :title="serviceOrderInfo.managerUserName">
                                    <span>{{serviceOrderInfo.managerUserName | postNameLimit}}</span>
                                </div>
                                <div style="display: inline-block;margin-left: 50px;font-weight: bold">
                                    <span>联系电话</span>
                                </div>
                                <div class="info-css" style="margin-left: 30px">
                                    <span>{{serviceOrderInfo.managerUserPhone}}</span>
                                </div>
                            </i-col>
                        </div>
                    </Panel>
                </Collapse>
            </Row>
            <Row style="margin-top: 20px;margin-left: 5px">
                <div style="font-size: 16px;font-weight: bold;color: black">服务单信息</div>
                <div style="font-size: 14px;padding: 22px 15px 10px 17px;color: #5d5d5d">
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
                    <i-col span="24" class="service-label component-css" v-if="isShow">
                        <component is="ServiceBuilder" :serviceType="this.serviceType" :isEdit="false" :serviceInfo="this.serviceInfo" :signedDate="this.serviceOrderInfo.tsSigned"></component>
                    </i-col>
                </div>
            </Row>
            <Row style="margin-top: 20px;margin-left: 5px">
                <div style="font-size: 16px;font-weight: bold;color: black">服务接单信息</div>
                <div style="font-size: 14px;padding: 10px 15px 10px 17px;color: #5d5d5d">
                    <i-col span="24" class="service-label">
                        <div class="label-css" style="float: left;">
                            <span>服务指派要求</span>
                        </div>
                        <div v-if="serviceOrderInfo.receiveRemark || serviceOrderInfo.dispatchRemark" class="info-css" style="word-wrap: break-word;word-break: break-all;width: 450px;margin-left: 3px">
                            <span v-if="serviceOrderInfo.dispatchRemark" style="white-space: pre-wrap">{{serviceOrderInfo.dispatchRemark}}</span>
                            <span v-else style="white-space: pre-wrap">{{serviceOrderInfo.receiveRemark}}</span>
                        </div>
                        <div v-else class="info-css" style="word-wrap: break-word;word-break: break-all;width: 450px;margin-left: 3px">
                            <span style="white-space: pre-wrap">暂无服务指派要求</span>
                        </div>
                    </i-col>
                </div>
            </Row>
            <Row style="margin-top: 20px;margin-left: 5px">
                <i-col span="24">
                    <Collapse v-model="activeFileCollapse">
                        <Panel name="1">
                            <div>
                                <span>资料清单</span>
                                <Icon class="collapse-icon" :type="fileCollapseStyle"></Icon>
                            </div>
                            <i-col span="24" slot="content">
                                <SDFileList :billId="this.serviceOrderId"></SDFileList>
                            </i-col>
                        </Panel>
                    </Collapse>
                </i-col>
            </Row>
            <Row style="margin-top: 20px;margin-left: 5px">
                <div style="font-size: 16px;font-weight: bold">服务派发信息</div>
                <Form class="invoice-form" ref="form" :model="serviceForm" label-position="left" :label-width="120" :rules="ruleValidate">
                    <div style="font-size: 14px;padding: 10px 15px 10px 17px;color: #5d5d5d">
                        <i-col v-if="this.serviceOrderInfo.serverRefuseResons && this.serviceOrderInfo.serverRefuseResons.length>0" span="24">
                            <div style="width: 100%;height: 60px;background-color: #f2f2f2">
                                <div class="service-state">
                                    <span>退</span>
                                </div>
                                <div style="position: absolute;left: 60px;top: 10px;color: #999999">
                                    <span>{{this.serviceOrderInfo.serverRefuseResons[0].operatorUserName}}</span>
                                </div>
                                <div style="position: absolute;left: 60px;top: 35px;color: #999999" :title="this.serviceOrderInfo.serverRefuseResons[0].remark">
                                    <span>{{this.serviceOrderInfo.serverRefuseResons[0].remark | wordLengthLimit}}</span>
                                </div>
                            </div>
                        </i-col>
                        <i-col span="24" style="margin-top: 10px">
                            <FormItem label="" :label-width="1" prop="orderOrRefuse">
                                <div>
                                    <RadioGroup v-model="orderOrRefuse">
                                        <Radio label="SERVER_RECEIVE" style="font-size: 14px;">派工</Radio>
                                        <Radio label="SERVER_BACK" style="font-size: 14px;">退回</Radio>
                                    </RadioGroup>
                                </div>
                            </FormItem>
                        </i-col>
                        <div v-show="this.orderOrRefuse == 'SERVER_RECEIVE'">
                            <!-- 接单至服务人员 -->
                            <div style="margin-top: 50px">
                                <component ref="serviceForm" is="SendToServicePerson" :serviceUsers="serviceOrderInfo.serveUserVoList" :serviceTypeList="serviceTypeList"></component>
                            </div>
                        </div>
                        <div v-if="this.orderOrRefuse == 'SERVER_BACK'">
                            <i-col span="24" style="margin-top: 20px">
                                <FormItem class="s-price ivu-form-item-required" label="退回原因" prop="refuseReason">
                                    <div class="service-or-other-content">
                                        <Input v-model="serviceForm.refuseReason" type="textarea" :rows="4" placeholder="请输入退回原因" :maxlength="500"></Input>
                                    </div>
                                </FormItem>
                            </i-col>
                        </div>
                    </div>
                </Form>
            </Row>
            <Row style="margin-top: 20px;margin-left: 5px">
                <div style="text-align: center">
                    <Button class="cancel-button" type="primary" @click="cancel">取消</Button>
                    <Button class="save-button" type="primary" @click="save">确认</Button>
                </div>
            </Row>
        </div>
    </div>
</template>
<script>
    import ICol from "../../../../node_modules/iview/src/components/grid/col.vue";
    import ServiceBuilder from '../../service/serviceBuilder.vue';
    import SDFileList from "../../serviceDispatch/SDFileList.vue";
    import SendToServicePerson from "../../sendToServicePerson.vue";
    export default {
        components: {
            ICol,
            ServiceBuilder,
            SDFileList,
            SendToServicePerson
        },
        props: {
            serviceOrderId: null,
        },
        computed: {
            collapseStyle() {
                if (Array.isEmpty(this.activeCollapse)) {
                    return 'chevron-right';
                }else {
                    return 'chevron-down';
                }
            },
            fileCollapseStyle() {
                if (Array.isEmpty(this.activeFileCollapse)) {
                    return 'chevron-right';
                }else {
                    return 'chevron-down';
                }
            },
        },
        created: function () {
            this.initContent();
        },
        filters: {
            wordLengthLimit : function (value) {
                if(value && value.length > 35){
                    return value.substring(0,35) + "..." ;
                }
                return value;
            },
            postNameLimit : function (value) {
                if(value && value.length > 6){
                    return value.substring(0,6) + "..." ;
                }
                return value;
            },
            formatDate(time) {
                var date = new Date(time);
                return date.format('yyyy年MM月');
            },
        },
        data () {
            return {
                activeCollapse: ['1'],
                activeFileCollapse: ['1'],
                orderOrRefuse: "SERVER_RECEIVE",//接单/拒单
                serviceOrderInfo: {
                    serveUserVoList: []
                },
                serviceType: null,
                serviceInfo: null,
                serviceForm: {
                    billId: null,
                    refuseReason: "",//拒单原因
                },
                serviceTypeList: [],
                ruleValidate: {
                    refuseReason: [
                        {required: true, message: '退回原因不能为空', trigger: 'blur'}
                    ],
                },
                isShow: false,
            }
        },
        methods: {
            initContent () {
                var vm = this;
                this.request({
                    url: "/serviceCloud/orderOrRefuse/getServiceInfoById.do",
                    data: {
                        serviceOrderId: this.serviceOrderId
                    }
                },{
                    url: '/serviceCloud/serviceDispatch/SDInfo.do',
                    param: {
                        id: this.serviceOrderId
                    }
                }).then((data,pram)=>{
                    vm.serviceOrderInfo = data;
                    vm.serviceInfo = Object.assign({}, pram);
                    this.getOrgServePostList();
                    if (data.inputTemplateId) {
                        this.isShow = true;
                        vm.serviceType = data.inputTemplateId;
                    }else {
                        this.isShow = false;
                    }
                });
            },
            cancel () {
                this.close();
            },
            save () {
                var vm = this;
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        if(this.orderOrRefuse == "SERVER_RECEIVE"){//派工
                            if(this.$refs['serviceForm'].childComponentCheck()){
                                vm.serviceForm.users = vm.$refs['serviceForm'].serviceForm.serverList;
                                var sendData = Object.assign({}, vm.serviceForm);
                                sendData.billId = vm.serviceInfo.id;
                                this.request({
                                    url: "/serviceCloud/SCOrderOrRefuse/dispatch.do",
                                    data: sendData
                                }).then(()=>{
                                    vm.$Message.info("派工成功！");
                                    vm.cancel();
                                    vm.callback();
                                });
                            }
                        }else if(this.orderOrRefuse == "SERVER_BACK"){//退回
                            this.request({
                                url: "/serviceCloud/SCOrderOrRefuse/retreat.do",
                                param: {
                                    billId: this.serviceInfo.id,
                                    reason: this.serviceForm.refuseReason
                                }
                            }).then(()=>{
                                vm.$Message.info("退回成功！");
                                vm.cancel();
                                vm.callback();
                            });
                        }
                    }
                });
            },
            //获取服务岗位列表
            getOrgServePostList () {
                this.request({
                    url: "/serviceCloud/orderOrRefuse/getOrgServePostList.do",
                    param: {
                        billDefId: this.serviceInfo.billDefId
                    }
                }).then((data)=>{
                    this.serviceTypeList = data;
                })
            },
        },
    }
</script>