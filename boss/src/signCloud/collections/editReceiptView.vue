<style scoped>
    .benefitCode {
        width: 100%;
    }

    .benefitCode >>> .ivu-poptip-rel {
        width: 100%;
    }

    .benefitCode > .ivu-poptip-popper {
    }

    .benefitCode.active > .ivu-poptip-popper {
    }

    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        /*overflow: hidden;*/
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 8px;
    }
    .demo-upload-list > .ivu-poptip-body-content{
        overflow:inherit;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-inner{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        /*overflow: hidden;*/
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 8px;
    }
    .demo-upload-list-inner img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list-cover-inner{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-inner:hover .demo-upload-list-cover-inner{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
    .demo-upload-list-cover-inner i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
    .demo-upload-list-cover-inner i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
    .upload-button {
        /*display: inline-block;*/
        /*width:58px;*/
        /*border: 1px dashed #dddee1;*/
        /*border-radius: 3px;*/

        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px dashed #dddee1;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        /*box-shadow: 0 1px 1px rgba(0,0,0,.2);*/
        margin-right: 4px;
    }
    .upload-button:hover {
        border: 1px dashed #59b399;
    }
    .file-pdf-show {
        position: absolute;
        width: 100%;
        left: 0;
        top: 0;
    }
</style>

<template>
    <div>
        <Row>
            <Form class="collection-form" :label-width="100" ref="form" :model="item" :rules="ruleCustom">
                <FormItem style="padding-top: 20px;" :label-width="100" label="收款方式" prop="payWay">
                    <Button :class="item.type == 'CASH' ? 'check-button active' : 'check-button'" size="small" @click="choosePayWay('CASH')">现金</Button>
                    <Button :class="item.type == 'CHECK' ? 'check-button active' : 'check-button'" size="small"  @click="choosePayWay('CHECK')" >支票</Button>
                    <Button :class="item.type == 'TRANSFER' ? 'check-button active' : 'check-button'" size="small"  @click="choosePayWay('TRANSFER')">对公转账</Button>
                </FormItem>
                <Row>
                    <i-col span="8" v-if="item.type=='CHECK'">
                        <FormItem :label-width="150" label="付款行名称" prop="checkBankName" :rules="{required: true, message: '请输入付款行名称'}">
                            <Input class="aaa" v-model="item.checkBankName" placeholder="请输入" :maxlength="30"/>
                        </FormItem>
                    </i-col>
                    <i-col span="8" v-if="item.type=='CHECK'">
                        <FormItem :label-width="150" label="出票人帐号" prop="checkDrawerAccount" :rules="{required: true, message: '请输入出票人帐号'}">
                            <Input v-model="item.checkDrawerAccount" placeholder="请输入" :maxlength="30"></Input>
                        </FormItem>
                    </i-col>
                    <i-col span="8" v-if="item.type=='CHECK'">
                        <FormItem :label-width="150" label="支票号" prop="checkNumber" :rules="{required: true, message: '请输入支票号'}">
                            <Input v-model="item.checkNumber" placeholder="请输入" :maxlength="30"/>
                        </FormItem>
                    </i-col>

                    <i-col span="8" v-if="item.type=='TRANSFER'">
                        <FormItem :label-width="150" prop="transferAccountName" label="付款方户名" :rules="{required: true, message: '请输入付款方户名'}">
                            <Input v-model="item.transferAccountName" placeholder="请输入" :maxlength="30"/>
                        </FormItem>
                    </i-col>
                    <i-col span="8" v-if="item.type=='TRANSFER'">
                        <FormItem :label-width="150" prop="transferAccount" label="付款方帐号" :rules="{required: true, message: '请输入付款方帐号'}">
                            <Input v-model="item.transferAccount" placeholder="请输入" :maxlength="30"/>
                        </FormItem>
                    </i-col>
                    <i-col span="8" v-if="item.type=='TRANSFER'">
                        <FormItem :label-width="150" prop="transferBankName" label="付款方开户行名称" :rules="{required: true, message: '请输入付款方开户行名称'}">
                            <Input v-model="item.transferBankName" placeholder="请输入" :maxlength="30"/>
                        </FormItem>
                    </i-col>
                    <i-col span="8" v-if="item.type=='TRANSFER'">
                        <FormItem class="transfer" :label-width="150" prop="transferBankNumber" label="付款方开户行行号">
                            <Input v-model="item.transferBankNumber" placeholder="请输入" :maxlength="30"/>
                        </FormItem>
                    </i-col>
                    <i-col style="color: #59b399;min-height: 65px;" span="16" v-if="item.type == 'TRANSFER'">
                        <FormItem class="transfer" :label-width="150" label="上传凭证">
                            <div class="demo-upload-list" v-for="(img,index) in item.uploadIdList">
                                <img v-if="img.type != 'pdf'" :src="$updateConfig.file+img.fileId">
                                <span v-else class="file-pdf-show">pdf文件</span>
                                <div class="demo-upload-list-cover">
                                    <Icon type="ios-eye-outline" @click.native="handleView(img.fileId, img.type)"></Icon>
                                    <div style="cursor:pointer;" class="ivu-badge-count" @click="handleRemove(img)">x</div>
                                </div>
                            </div>
                            <!--<div class="demo-upload-list" v-if="item.uploadIdList.length>5">-->
                                <!--&lt;!&ndash;<span style="cursor: pointer; margin-top: 5px;">更多</span>&ndash;&gt;-->
                                <!--<Poptip placement="left" v-if="item.uploadIdList.length>0" style="position: absolute; top: 0; left: 0; width: 100%;">-->
                                    <!--&lt;!&ndash;<span style="cursor: pointer; margin-top: 5px;">更多</span>&ndash;&gt;-->
                                    <!--<span>更多</span>-->
                                    <!--<div slot="content" style="overflow: visible">-->
                                        <!--<div class="demo-upload-list-inner" v-for="item_f in item.uploadIdList">-->
                                            <!--<img v-if="item_f.type != 'pdf'" :src="$updateConfig.file+item_f.fileId">-->
                                            <!--<span v-else class="file-pdf-show">pdf文件</span>-->
                                            <!--<div class="demo-upload-list-cover-inner">-->
                                                <!--<Icon type="ios-eye-outline" @click.native="handleView(item_f.fileId, item_f.type)"></Icon>-->
                                                <!--<div style="cursor:pointer;" class="ivu-badge-count" @click="handleRemove(item_f)">x</div>-->
                                            <!--</div>-->
                                        <!--</div>-->
                                    <!--</div>-->
                                <!--</Poptip>-->
                            <!--</div>-->
                            <BSUpload v-if="item.uploadIdList.length<9" class="upload-button" :beforeUpload="beforeUpload" :onSuccess="onSuccess" :showProcess="true" :type="['bmp','gif','ico','jpg','jpeg','png','pdf']">
                                <div style="width: 58px;height:58px;line-height: 58px; text-align:center;">
                                    <Icon type="camera" size="20"></Icon>
                                </div>
                            </BSUpload>
                            <Modal title="查看图片" v-model="visible">
                                <img :src="$updateConfig.file + imgName" v-if="visible" style="width: 100%">
                            </Modal>
                        </FormItem>
                    </i-col>
                </Row>
                <hr size="1" color="#59b399" v-if="(item.type=='TRANSFER' || item.type=='CHECK')">
                <i-col span="8" offset="8" pull="8" v-if="item.type != '' " style="padding-top: 15px;">
                    <FormItem :label-width="100" prop="receivablePrice" label="应收金额">
                        <Input class="currency" v-model="item.receivablePrice" placeholder="0.00" icon="social-yen" :disabled="item.benefit" :maxlength="9">
                        </Input>
                    </FormItem>
                </i-col>
                <i-col span="8" pull="8" v-if="item.type != '' " style="padding-top: 15px;">
                    <FormItem :label-width="100" prop="tsReceipt" label="收款日期">
                        <DatePicker type="date" v-model="item.tsReceipt" :editable="false" :clearable="false" ></DatePicker>
                    </FormItem>
                </i-col>
                <i-col span="8" v-if="item.type != '' " >
                    <FormItem :label-width="100" prop="benefitPrice" label="优惠金额">
                        <Input class="currency" v-model="item.benefitPrice" number readonly placeholder="0.00" icon="social-yen"></Input>
                    </FormItem>
                </i-col>
                <i-col span="8" >
                    <FormItem :label-width="100" prop="benefitCode" label="优惠码">
                        <Poptip class="benefitCode" :class="{active: item.benefitCode != null && item.benefitCode != ''}"  trigger="focus" placement="top-start" style="width: 100%;">
                        <Input v-model="item.benefitCode" placeholder="请输入" @on-change="getCouponDetail" :disabled="item.benefit" style="width: 100%;" :maxlength="8">
                            <Poptip slot="append" placement="top">
                                <Icon v-if="couponItem.success" type="help-circled" style="cursor: pointer; color: #59b399;"></Icon>
                                <Icon v-else="couponItem.success" type="alert" style="color: #f45a43; font-size: 8px;"></Icon>
                                <div v-if="couponItem.success" slot="content" style="overflow-x: hidden; overflow-y: hidden;">
                                    <div><span><strong>优惠券使用说明</strong></span></div>
                                    <div style="text-align: left"><span style="padding-left: 5px;">活动时间:  {{couponItem.data.coupon.beginTime}}至{{couponItem.data.coupon.endTime}}</span></div>
                                    <div style="text-align: left"><span style="padding-left: 5px;">优惠券面值:  ￥{{couponItem.data.coupon.discountMoneyPrecision}}</span></div>
                                    <div style="text-align: left"><span style="padding-left: 5px;">使用金额限制: 订单满{{couponItem.data.coupon.limitedMoneyPrecision}}元可用</span></div>
                                    <div style="text-align: left"><span style="padding-left: 5px;">使用张数限制: 单笔订单最多使用{{couponItem.data.coupon.limitedUsedCount}}张</span></div>
                                    <div style="text-align: left">
                                        <span style="padding-left: 5px;">优惠券有效期:</span>
                                        <span v-if="couponItem.data.coupon.couponValidateType==1">{{couponItem.data.coupon.couponValidateBeginTime}}-{{couponItem.data.coupon.couponValidateEndTime}}</span>
                                        <span v-if="couponItem.data.coupon.couponValidateType==2">自领取日{{couponItem.data.coupon.couponValidateDays}}日内有效</span>
                                    </div>
                                    <div style="text-align: left; width: 300px; white-space: normal;"><div style="padding-left: 5px; display: inline;">服务范围限定:</div> <span v-if="couponItem.data.coupon.service.length == 0">暂无限定范围</span></div>
                                    <div v-if="service.serviceType.serviceAllowed" v-for="(service, index) in couponItem.data.coupon.service" :key="index" style="text-align: left">
                                        <span style="padding-left: 5px;">{{service.serviceType.serviceName}}:</span>
                                        <span v-if="serviceItem.serviceAllowed" v-for="(serviceItem, index) in service.services">『{{serviceItem.serviceName}}』</span>
                                    </div>
                                </div>
                                <div v-else slot="content">
                                    请输入正确的优惠码后查看优惠券说明
                                </div>
                            </Poptip>
                        </Input>
                            <div slot="content" style="display: inline-block; color: firebrick; font-size: 22px; height:20px; line-height: 20px; overflow-x: hidden; overflow-y: hidden;">{{ showBenefitCode }}</div>
                        </Poptip>
                    </FormItem>
                </i-col>
                <i-col span="8" >
                    <FormItem :label-width="120" prop="benefitMobile" label="优惠领取手机号">
                        <Input  v-model="item.benefitMobile" placeholder="请输入" @on-change="resetBenefitCode" :disabled="item.benefit" :maxlength="11"></Input>
                    </FormItem>
                </i-col>
                <!--<i-col span="8">-->
                    <!--<FormItem :label-width="100" prop="reductionPrice" label="减免金额">-->
                        <!--<Input class="currency" v-model="item.reductionPrice" number placeholder="0.00" icon="social-yen"></Input>-->
                    <!--</FormItem>-->
                <!--</i-col>-->
                <!--<i-col span="16">-->
                    <!--<FormItem :label-width="100" prop="reductionReason" label="减免原因">-->
                        <!--<Input v-model="item.reductionReason" placeholder="请输入"></Input>-->
                    <!--</FormItem>-->
                <!--</i-col>-->
                <!--<i-col span="8">-->
                    <!--<FormItem :label-width="100" prop="reductionType" label="调整类型">-->
                        <!--<Select class="reductionType" v-model="item.reductionType" @on-change="resetReduction">-->
                            <!--<Option v-for="list in reductionTypeList" :value="list.value" :key="list.value">{{ list.label }}</Option>-->
                        <!--</Select>-->
                    <!--</FormItem>-->
                <!--</i-col>-->
                <i-col span="8">
                    <FormItem :label-width="100" prop="reductionPrice" label="减免金额">
                        <Input class="currency" v-model="item.reductionPrice" number placeholder="0.00" icon="social-yen" :maxlength="12"></Input>
                    </FormItem>
                </i-col>
                <i-col span="16">
                    <FormItem :label-width="100" prop="reductionReason" label="减免原因">
                        <Input v-model="item.reductionReason" placeholder="请输入" :maxlength="100"></Input>
                    </FormItem>
                </i-col>
                <i-col style="color: #59b399; padding-top: 15px;" span="24" v-if="item.type != ''">
                    <FormItem :label-width="100" prop="remark" label="收费说明">
                        <Input v-model="item.remark" type="textarea" :autosize="{minRows: 2,maxRows: 3}" placeholder="收费说明" :maxlength="100"></Input>
                    </FormItem>
                </i-col>
                <br>
                <i-col style="padding-top: 25px;" span="8" offset="16" >
                    <FormItem id="receiptLabel" :label-width="100" prop="price" label="实收金额">
                        <Input class="currency" v-model="totalPrice" readonly placeholder="0.00" icon="social-yen"></Input>
                    </FormItem>
                </i-col>
                <i-col span="22" style="padding-top: 15px;">
                    <FormItem class="saveBtn">
                        <Button @click="collectChecked">确认修改</Button>
                    </FormItem>
                </i-col>
            </Form>
        </Row>
    </div>
</template>

<script>
    export default {
        props: {
            contractReceiptId: null,
            receivableInfo: null,
        },
        data() {
            const validateReceivablePrice = (rule, value, callback) => {
                if(Object.isNull(value) || String.isBlank(String(value))) {
                    callback(new Error("金额不能为空"));
                } else if (isNaN(value)) {
                    callback(new Error('请输入数字!'));
                } else if (value < 0) {
                    callback(new Error('请输入大于0的金额!'));
                } else if (!/^\d+(\.\d{1,2})?$/.test(value)) {
                    callback(new Error('请把小数点位数限制在2位以内!'));
                } else if (value.length>1 && value.substr(0, 1)=='0' && value.indexOf('.')==-1) {
                    callback(new Error('请输入合理数字!'));
                } else {
                    callback();
                }
            };
            const validateBenefitPriceInput = (rule, value, callback) => {
                if(Object.isNull(value) || String.isBlank(String(value))) {
                    callback(new Error("金额不能为空"));
                } else if (isNaN(value)) {
                    callback(new Error('请输入数字!'));
                } else if (value < 0) {
                    callback(new Error('请输入大于0的金额!'));
                } else if (!/^\d+(\.\d{1,2})?$/.test(value)) {
                    callback(new Error('请把小数点位数限制在2位以内!'));
                } else if (this.totalPrice < 0) {
                    return callback(new Error('减免金额要小于等于'+Math.format(this.item.receivablePrice-this.item.benefitPrice, 2)+'元！'));
                } else if (value.length>1 && value.substr(0, 1)=='0' && value.indexOf('.')==-1) {
                    callback(new Error('请输入合理数字!'));
                } else {
                    callback();
                }
            };
            const validateBenefitPrice = (rule, value, callback) => {
                if (!this.couponItem.success && this.item.benefitCode != null && this.item.benefitCode.length > 0 && !this.item.benefit) {
                    return callback(new Error('请输入正确的优惠码！'));
                } else {
                    callback();
                }
            };
            const validateReductionPrice = (rule, value, callback) => {
                if (this.item.reductionPrice != 0 && (value == null || value == "")) {
                    return callback(new Error('请输入减免原因！'));
                } else {
                    callback();
                }
            };

            const validateBenefitMobile = (rule, value, callback) => {
                if (this.item.benefitCode != null && this.item.benefitCode.length > 0) {
                    var pattern = /0?(13|14|15|17|18)[0-9]{9}/;
                    if (pattern.test(this.item.benefitMobile)) {
                        callback();
                    } else {
                        return callback(new Error('请输入格式正确的手机号！'));
                    }
                } else {
                    callback();
                }
            };

            const validateNumber = (rule, value, callback) => {
                if (value != null && value.length > 0) {
                    if (isNaN(value)) {
                        callback(new Error('请输数字！'));
                    } else {
                        return callback();
                    }
                } else {
                    callback();
                }
            };

            return {
                server: '/ossController/oss/file.do?id=',
                imgName: '',
                visible: false,
                reductionTypeList: [
                    { value: 0, label:"不调整"},
                    { value: 2, label:"减免"},
                    { value: 1, label:"加收"},
                ],
                item: {
                    price: 0,
                    benefitPrice: 0,
                    reductionPrice: 0,
                    reductionType: 2,
                    uploadIdList:[],//上传文件列表
                },
                benefitCodeStr: "",
                couponItem: { success: false},
                couponValidateItem : {//优惠券验证列表
                    strategy: 2, //策略类型：如果优惠码中任一优惠码校验失败，则所有优惠券码均不能使用
                    validates: [
                        {
                            code:"",
                            mobile:"",
                        },
                    ],//将要使用的优惠券列表。
                },
                couponValidateResult:{},//优惠券验证返回结果
                ruleCustom: {
                    receivablePrice : [
                        { validator: validateReceivablePrice, trigger: "change"}
                    ],
                    checkDrawerAccount: [
                        {required: true, message: '请输入出票人帐号'},
                        { validator: validateNumber, trigger: "change"}
                    ],
                    checkNumber: [
                        {required: true, message: '请输入支票号'},
                        { validator: validateNumber, trigger: "change"}
                    ],
                    transferAccount: [
                        {required: true, message: '请输入付款方帐号'},
                        { validator: validateNumber, trigger: "change"}
                    ],
                    transferBankNumber: [
//                        {required: true, message: '请输入付款方开户行行号'},
                        { validator: validateNumber, trigger: "change"}
                    ],
//                    benefitPrice:[
//                        { validator: validateBenefitPriceInput, trigger: "change"}
//                    ],
                    reductionPrice:[
                        { validator: validateBenefitPriceInput, trigger: "change"}
                    ],
                    benefitCode: [
                        { validator: validateBenefitPrice, trigger: "blur" }
                    ],
                    reductionReason: [
                        { validator: validateReductionPrice, trigger: "blur" }
                    ],
                    benefitMobile: [
                        { validator: validateBenefitMobile, trigger: "blur" }
                    ],
                },
            }
        },
        computed: {
            totalPrice() {
                return this.benefitAndreduction();
            },
            showBenefitCode() {
                var benefitCode = "";
                if (this.item.benefitCode) {
                    for (var index=0;index<this.item.benefitCode.length;index++) {
                        if (index == 2 || index == 4 || index == 6) {
                            benefitCode =  benefitCode + "-" + this.item.benefitCode[index];
                        } else {
                            benefitCode =  benefitCode + "" + this.item.benefitCode[index];
                        }
                    }
                }
                return benefitCode;
            }
        },
        created () {
            this.getReceipt();
        },
        methods: {
            /**
             * 保存修改台帐信息
             */
            getReceipt() {//获取已收款台帐数据
                this.request({
                    url: "/signCloud/collection/getReceipt.do",
                    param: {
                        contractReceiptId: this.contractReceiptId
                    }
                }).then(data => {
                    this.item = data;
                });
            },

            /**
             * 选择支付方式
             */
            choosePayWay(type) {
                this.item.type = type;
            },

            /**
             * 优惠、减免
             */
            benefitAndreduction() {
                if (this.item.reductionType == "1") {
                    return Math.format(Math.format(this.item.receivablePrice-this.item.benefitPrice, 2)+this.item.reductionPrice, 2);
                } else {
                    return Math.format(Math.format(this.item.receivablePrice-this.item.benefitPrice, 2)-this.item.reductionPrice, 2);
                }
            },

            resetReduction() {
                if(this.item.reductionType == 0) {
                    this.$set(this.item, "reductionPrice", 0);
                    this.$set(this.item, "reductionReason", "");
                    this.item.reductionReason = "";
                }
            },

            /**
             * 重置优惠券编码
             */
            resetBenefitCode() {
                this.$set(this.item, "benefitPrice", 0);
                this.$set(this.item, "benefitCode", null);
                this.item.benefitId = null;
                this.couponItem = {success : false};
                this.couponValidateItem.validates[0].code = null;
                this.couponValidateItem.validates[0].mobile = null;
                this.couponValidateResult = {};
//                this.benefitCodeStr = "";
            },


            /**
             * 获取优惠券详情
             */
            getCouponDetail() {
                if (this.item.benefitMobile == "") {
                    this.$Message.warning({
                        content: "请先输入优惠领取手机号",
                    });
                    return ;
                }
                if (this.item.benefitCode.length == 8) {
                    this.request({
                        url: "/signCloud/collection/couponDetail.do",
                        param: {
                            code: this.item.benefitCode,
                            mobile: this.item.benefitMobile,
                        },
                    }).then(data => {
                        this.couponItem = data;
                        if (this.couponItem.success) {
                            this.item.benefitId = this.couponItem.data.id;
                            this.couponValidateItem.validates[0].code = this.item.benefitCode;
                            this.couponValidateItem.validates[0].mobile = this.item.benefitMobile;
                            if (this.couponItem.data.coupon.discountMoneyPrecision > this.item.receivablePrice) {
                                this.$set(this.item, "benefitPrice", this.item.receivablePrice);
                            } else {
                                this.$set(this.item, "benefitPrice", this.couponItem.data.coupon.discountMoneyPrecision);
                            }
                        } else {
                            this.$set(this.item, "benefitPrice", 0);
                            this.item.benefitId = null;
                            this.couponItem = {success : false};
                            this.couponValidateItem.validates[0].code = null;
                            this.couponValidateItem.validates[0].mobile = null;
                            this.couponValidateResult = {};
                        }
                    });
                } else {
                    this.$set(this.item, "benefitPrice", 0);
                    this.item.benefitId = null;
                    this.couponItem = {success : false};
                    this.couponValidateItem.validates[0].code = null;
                    this.couponValidateItem.validates[0].mobile = null;
                    this.couponValidateResult = {};
                }
            },
            /**
             * 收款检查操作
             */
            collectChecked() {
                this.$set(this.item, "price", this.totalPrice);
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        if (this.item.benefitCode != undefined && this.item.benefitCode != "" && !this.item.isBenefit && !this.item.benefit) {
                            if (this.couponItem.success) {
                                this.checkCoupon();
                            } else {
                                this.$Message.warning({
                                    content: "请输入正确的优惠码和手机号!",
                                });
                            }
                        } else {
                            this.saveReceipt();
                        }
                    }
                })
            },
            /**
             * 验证优惠券
             */
            checkCoupon() {
                this.request({
                    url: "/signCloud/collection/CheckCoupon.do",
                    data: {
                        receivableInfo: this.receivableInfo,
                        couponItem: this.couponItem,
                    },
                }).then(data => {
                    if(data.success) {
                        this.useCoupon();
                    } else {
                        this.$Message.warning({
                            content: data.msg,
                        });
                    }
                });
            },
            /**
             * 使用优惠券
             */
            useCoupon() {
                this.request({
                    url: "/signCloud/collection/UseCoupon.do",
                    data: this.couponValidateItem,
                }).then(data => {
                    this.couponValidateResult = data;
                    if (data.success) {
                        this.saveReceipt();
                    } else {
                        this.$Message.warning({
                            content: this.couponValidateResult.data.validates[0].validateBody.msg,
                        });
                    }

                });
            },
            saveReceipt() {//保存已收款台帐数据
                this.request({
                    url: "/signCloud/collection/editReceipt.do",
                    data: this.item,
                }).then(data => {
                    this.callback();
                });
            },

            beforeUpload:function(file){
            },
            onSuccess:function(id, file){
                var fileObj = new Object();
                fileObj.fileId = id;
                fileObj.type = file.name.split(".")[1];
                this.item.uploadIdList.push(fileObj);
            },
            handleView (name, type) {
                if (type != 'pdf') {
                    this.imgName = name;
                    this.visible = true;
                }else {
                    window.open(this.server + name);
                }
            },
            handleRemove (file) {
                const fileList = this.item.uploadIdList;
                this.item.uploadIdList.splice(fileList.indexOf(file), 1);
                if (file.id) {
                    this.request({
                        url: "/signCloud/collection/receipt/file.do",
                        param: {
                            receiptFileId: file.id
                        },
                    }).then(() => {
                    });
                }
            },
        }
    };
</script>

<style scope>
    .currency >  .ivu-input {
        padding-left: 30px;
    }
    .currency >  .ivu-icon {
        left: 0;
        font-size: 12px;
        color: #666;
    }
    .transfer > .ivu-form-item-label:before {
        content: '';
    }
    .collection-form .transfer .ivu-form-item-content {
        /*overflow-y: auto;*/
        height: auto!important;
    }
    .collection-form {
        padding: 0 30px;
    }

    .collection-form .ivu-form-item {
        margin-bottom: 20px;
    }

    .collection-form .ivu-form-item .ivu-form-item-content {
        height: 32px;
        font-size: 14px;
    }

    .collection-form .ivu-form-item input {
        border-radius: 0;
    }

    .collection-form .ivu-form-item.normal {
        padding-left: 0;
        margin-bottom: 20px;
        font-size: 14px;
    }

    .collection-form .ivu-date-picker {
        width: 100%;
    }

    .collection-form .ivu-form-item.normal .ivu-form-item-content{
        margin-left: 0!important;
    }

    .collection-form .money-info {
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
        color: #333;
        font-weight: 600;
    }
    .collection-form .money-info span:first-child{
        /*width: 100px;*/
        display: inline-block;
    }

    .collection-form .money-info span:nth-child(2){
        color: #333333;
        font-weight: 700;
    }

    .collection-form .check-button {
        color: rgb(102,102,102);
        background: #eee;
        border: 2px solid #eee;
        padding: 3px 22px;
        margin: 0 10px 0 5px;
    }

    .collection-form .check-button.active {
        color: rgb(89,179,153);
        background: #FFF;
        border: 2px solid rgb(89,179,153);
        background-color: rgb(255,255,255);
    }

    .collection-form .saveBtn {
        text-align: center;
        padding: 0!important;
    }

</style>