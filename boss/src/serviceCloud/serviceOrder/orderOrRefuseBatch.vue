<style scoped="">
    .serviceHeader{
        display: inline-block;
        width: 200px;
    }
    .serviceHeader >>> .ivu-select-dropdown {
        width: inherit;
        max-height: 200px;
        overflow: auto;
        margin: 0;
        padding: 5px 0;
        background-color: #fff;
        box-sizing: border-box;
        border-radius: 4px;
        box-shadow: 0 1px 6px rgba(0,0,0,.2);
        position: absolute !important;
        z-index: 900;
    }
    .service-state {
        width: 0;
        height: 0;
        border-top: 40px solid #FF6464;
        border-left: 40px solid transparent;
        float: right;
        margin-top: -60px;
        margin-right: -5px;
    }
    .service-state > span{
        position: relative;
        right: 18px;
        top: -36px;
        font-size: 14px;
        color: white;
    }
    .service-item-saleOrgName{
        position: relative;
        top: -5px;
        display: inline-block;
        width: 250px;
        font-weight: bold;
        margin-left: 20px;
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
    .service-item{
        margin: 0 10px;
    }
    .service-item:nth-child(odd){
        background-color: white;
    }
    .service-item:nth-child(even){
        background-color: #f2f2f2;
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
    <div class="container" style="padding: 10px">
        <div class="content">
            <Row>
                <div style="font-size: 16px;font-weight: bold">服务单处理</div>
                <Form class="invoice-form" ref="form" :model="serviceForm" label-position="left" :label-width="120" :rules="ruleValidate">
                    <div style="font-size: 14px;padding: 10px 15px 10px 17px;color: #5d5d5d">
                        <i-col span="24" style="margin-top: 10px">
                            <div>
                                <RadioGroup v-model="orderOrRefuse"  @on-change="refreshForm">
                                    <Radio label="SERVER_RECEIVE" style="font-size: 14px;">接单</Radio>
                                    <Radio label="SERVER_BACK" style="font-size: 14px;">拒单</Radio>
                                </RadioGroup>
                            </div>
                        </i-col>
                        <div v-if="this.orderOrRefuse == 'SERVER_RECEIVE'">
                            <i-col span="24" style="margin-top: 20px">
                                <FormItem class="s-price ivu-form-item-required" label="服务负责人" prop="serviceHeader">
                                    <Select v-model="serviceForm.serviceHeader" @on-change="changeServiceHeader" style="width: 200px" placeholder="服务负责人">
                                        <Option v-for="serviceHeaderInfo in serviceHeaderList" :value="serviceHeaderInfo.serveLeaderId" :key="serviceHeaderInfo.serveLeaderId">{{serviceHeaderInfo.serveLeaderName}}</Option>
                                    </Select>
                                </FormItem>
                            </i-col>
                            <i-col span="24">
                                <FormItem class="s-price ivu-form-item-required" label="联系电话" prop="serviceHeaderPhone">
                                    <Input v-model="serviceForm.serviceHeaderPhone" style="width: 200px;" placeholder="xxx-xxxxxxxx/xxxx-xxxxxxx/手机号" :maxlength="50"></Input>
                                </FormItem>
                            </i-col>
                            <i-col span="24">
                                <FormItem class="s-price service-require" label="服务要求">
                                    <div class="service-or-other-content">
                                        <Input v-model="serviceForm.serviceRequire" type="textarea" :rows="4" placeholder="请输入服务单的具体指派说明" :maxlength="500"></Input>
                                    </div>
                                </FormItem>
                            </i-col>
                        </div>
                        <div v-if="this.orderOrRefuse == 'SERVER_BACK'">
                            <i-col span="24" style="margin-top: 20px">
                                <FormItem class="s-price ivu-form-item-required" label="拒单原因" prop="refuseReason">
                                    <div class="service-or-other-content">
                                        <Input v-model="serviceForm.refuseReason" type="textarea" :rows="4" placeholder="请输入拒单原因" :maxlength="500"></Input>
                                    </div>
                                </FormItem>
                            </i-col>
                        </div>
                    </div>
                </Form>
            </Row>
            <Row style="margin-top: 20px">
                <div style="font-size: 16px;font-weight: bold;margin-bottom: 20px">服务单信息</div>
                <div v-for="serviceInfo in selectedList" :key="serviceInfo.id" class="service-item">
                    <div style="padding: 0 5px">
                        <div style="padding: 5px 0 5px 0;" >
                            <div style="text-align: center;width: 100px;height: 50px;padding: 5px;border-right: 1px solid #e5e5e5;display: inline-block">
                                <div>
                                    <span>{{serviceInfo.dispatchTime | formatDate}}</span>
                                </div>
                                <div>
                                    <span style="color: #999999">派单日期</span>
                                </div>
                            </div>
                            <div class="service-item-saleOrgName" :title="serviceInfo.saleOrgName">
                                <span>{{serviceInfo.saleOrgName | wordLengthLimit}}</span>
                            </div>
                            <div style="position: relative;top: -5px;display: inline-block;width: 100px;margin-left: 20px">
                                <div :title="serviceInfo.billDefName" style="font-size: 12px;width: 80px;height: 24px;line-height: 24px;text-align: center;border: 1px solid #59b399;border-radius: 5px;color: #59b399">
                                    <span>{{serviceInfo.billDefName | billDefNameLimit}}</span>
                                </div>
                            </div>
                            <div style="position: relative;top: -5px;display: inline-block;width: 100px;margin-left: 20px">
                                <span>￥{{serviceInfo.settlementPrice}}</span>
                            </div>
                        </div>
                        <Tooltip placement="left" style="float: right;margin-top: -13px">
                            <div v-if="serviceInfo.isBack" class="service-state">
                                <span>退</span>
                            </div>
                            <div slot="content" style="white-space: normal;">
                                <p>派单人：{{serviceInfo.saleName}}</p>
                                <p>联系电话：{{serviceInfo.salePhone}}</p>
                                <p>销售组织：{{serviceInfo.saleOrgName}}</p>
                            </div>
                        </Tooltip>
                    </div>
                </div>
            </Row>
            <Row style="margin-top: 20px">
                <div style="text-align: center">
                    <Button class="cancel-button" type="primary" @click="cancel">取消</Button>
                    <Button class="save-button" type="primary" @click="save">确认</Button>
                </div>
            </Row>
        </div>
    </div>
</template>
<script>
    import ICol from "../../../node_modules/iview/src/components/grid/col.vue";
    export default {
        components: {ICol},
        props: {
            selectedList: null,
        },
        created: function () {
            this.getServiceHeaderList();
        },
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
            formatDate(time) {
                var date = new Date(time);
                return date.format('yyyy/MM/dd');
            }
        },
        data () {
            return {
                orderOrRefuse: "SERVER_RECEIVE",//接单/拒单
                serviceHeader: null,//服务负责人
                serviceHeaderName:null,//服务负责人名字
                serviceHeaderPhone:null,//服务负责人电话
                serviceHeaderList: [],
                serviceForm: {
                    refuseReason: "",//拒单原因
                    serviceRequire: "",//服务要求
                },
                ruleValidate: {
                    serviceHeader: [
                        {required: true, message: '服务负责人不能为空'}
                    ],
                    serviceHeaderPhone: [
                        {required: true, message: "请输入联系电话", trigger: 'blur'},
                        { pattern:  /^((\d{3}-\d{8}|\d{4}-\{7,8})|(1[2-9]\d{9}))$/ ,message:'请输入有效的联系电话'}
                    ],
                    refuseReason: [
                        {required: true, message: '拒单原因不能为空', trigger: 'blur'}
                    ],
                },
            }
        },
        methods: {
            getServiceHeaderList() {
                var vm = this;
                var billDefIds = [];
                for(var i=0;i<this.selectedList.length;i++){
                    if(billDefIds.indexOf(this.selectedList[i].billDefId) == -1){
                        billDefIds.push(this.selectedList[i].billDefId);
                    }
                }
                this.request({
                    url: "/serviceCloud/orderOrRefuse/getServiceHeaderList.do",
                    data: {
                        billDefids: billDefIds
                    }
                }).then((data)=>{
                    if(data && data.length>0){
                        vm.serviceHeaderList = data;
                    }else{
                        vm.serviceHeaderList = [];
                    }
                });
            },
            changeServiceHeader (selectedServiceHeader) {
                for(var i=0;i<this.serviceHeaderList.length;i++){
                    if(this.serviceHeaderList[i].serveLeaderId == selectedServiceHeader){
                        this.$set(this,"serviceHeaderPhone",this.serviceHeaderList[i].serveLeaderPhone);
                        this.$set(this,"serviceHeaderName",this.serviceHeaderList[i].serveLeaderName);
                    }
                }
            },
            refreshForm () {
                this.$refs['form'].resetFields();
            },
            cancel () {
                this.close();
            },
            save () {
                var vm = this;
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        var billIds = "";
                        for(var i=0;i<this.selectedList.length;i++){
                            billIds = billIds + this.selectedList[i].id + ",";
                        }
                        if(billIds && billIds.length>0){
                            billIds = billIds.substring(0,billIds.length-1);
                        }
                        if(this.orderOrRefuse == "SERVER_RECEIVE"){//接单
                            this.request({
                                url: "/serviceCloud/orderOrRefuse/save.do",
                                param: {
                                    billIds: billIds,
                                    operatorType: this.orderOrRefuse,
                                    serveLeaderId: this.serviceForm.serviceHeader,
                                    serveLeaderName: this.serviceHeaderName,
                                    serveLeaderPhone: this.serviceForm.serviceHeaderPhone,
                                    divideRemark: this.serviceForm.serviceRequire
                                }
                            }).then(()=>{
                                vm.$Message.info("接单成功！");
                                vm.cancel();
                                vm.callback();
                            });
                        }else if(this.orderOrRefuse == "SERVER_BACK"){//拒单
                            this.request({
                                url: "/serviceCloud/orderOrRefuse/save.do",
                                param: {
                                    billIds: billIds,
                                    operatorType: this.orderOrRefuse,
                                    divideRemark: this.serviceForm.refuseReason
                                }
                            }).then(()=>{
                                vm.$Message.info("拒单成功！");
                                vm.cancel();
                                vm.callback();
                            });
                        }
                    }
                });

            },
        },
    }
</script>