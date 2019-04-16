<style scoped>
    .root-content{
        background-color: #f6f6f6;
    }
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

    .benefitCodeErrorTip >>> .ivu-form-item-error-tip {
        margin-top: -11px;
    }

    .reductionType > .ivu-select-selection {
        /*border-radius: 0;*/
    }
    .currency >>> .ivu-input {
        padding-left: 30px;
    }
    .currency >>>  .ivu-icon {
        left: 0;
        font-size: 10px;
        color: #666;
    }
    .transfer >>> .ivu-form-item-label:before {
        content: '';
    }
    #conllectionView .ivu-input-wrapper > .ivu-input {
        font-size: 12px;
        color: rgb(51,51,51);
        font-weight: bold;
    }

    #conllectionView .ivu-form-item-label {
        font-size: 14px;
        color: rgb(105,105,105);
    }

    #receiptLabel .ivu-form-item-label {
        font-size: 14px;
        color: #59b399;
    }

    #conllectionView .ivu-alert-info {
        border: 0px solid #d5e8fc;
        border-top: 1px solid #d5f1fc;
        border-bottom: 1px solid #d5f1fc;
        background-color: #eafef9;
    }

    #conllectionView .ivu-alert {
        border-radius: 0px;
        line-height: 38px;
    }
    [conllectionAlert] .ivu-icon {
        color: #59b399;
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
    .demo-upload-list img{
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
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
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
    <!--<div style="padding: 10px 60px;">-->
    <div id="conllectionView" style="padding-top: 30px;">
        <Row class="top-info" style="">
            <i-col :xs="12" :sm="12" :md="12" :lg="12" style="display: inline-block;">
                <span>待收金额</span>
                <b><span>￥</span>{{ receivableInfo.receivedPrice ? receivableInfo.receivedPrice.toFixed(2) : 0.00}}</b>
            </i-col>
            <i-col :xs="12" :sm="12" :md="12" :lg="12" style="display: inline-block;">
                <span>已收金额</span>
                <b><span>￥</span>{{receivableInfo.receiptPrice ? receivableInfo.receiptPrice.toFixed(2) : '0.00'}}</b>
            </i-col>
            <i-col :xs="12" :sm="12" :md="12" :lg="12" style="display: inline-block; padding-top: 15px;">
                <span>合约总额</span>
                <b><span>￥</span>{{ receivableInfo.price ? receivableInfo.price.toFixed(2) : 0.00 }}</b>
            </i-col>
            <i-col :xs="12" :sm="12" :md="12" :lg="12" style="display: inline-block; padding-top: 15px;">
                <span>支付类型</span>
                <b>{{receivableInfo.pamentType}}</b>
            </i-col>
        </Row>
        <div class="tab-button-bar">
            <div :class="tabStatus == 2 ? 'tab-button active' : 'tab-button'" @click="checkTab(2)">
                <span>收款记录</span>
            </div>
            <div :class="tabStatus == 1 ? 'tab-button active' : 'tab-button'" @click="checkTab(1)">
                <span>收款计划</span>
            </div>
        </div>
        <Row v-if="tabStatus==1">
            <ul style="border-top: 1px solid #e8e8e8" v-if="receivables.length>0">
                <li style="height: 54px; line-height: 54px; border-bottom: 1px solid #e8e8e8;" v-for="(receivable, index) in receivables" :key="index">
                    <!--<div style="display: inline-block; padding-left: 66px; margin-right: 15px;">-->
                        <!--<Checkbox v-if="collectionAuth" style="display:inline;" v-model="receivable.isReceipt" @on-change="chooseReceivable">-->
                            <!--<span style="display: inline-block;"></span>-->
                        <!--</Checkbox>-->
                    <!--</div>-->
                    <div style="display: inline-block; padding-left: 46px; margin-right: 25px; font-size: 14px; color: rgb(51,51,51);"><b>{{receivable.title}}</b></div>
                    <div style="display: inline-block; font-size: 14px; color: rgb(51,51,51);"><b>计划收款　　 ￥ {{ receivable.price ? receivable.price.toFixed(2) : 0.00 }}</b></div>
                    <div v-if="receivable.tsReceive!=''" style="display: inline-block; float: right;  padding-right: 50px; font-size: 12px; color: rgb(153,153,153);"><span style="padding-right: 10px;">应收款日</span><span>{{receivable.tsReceive}}</span></div>
                </li>
                <!--<li style="height: 54px; border-bottom: 1px solid #e8e8e8; background-color: #f6faf9 !important;" v-if="collectionAuth && receivables.length > 0 && receivableInfo.pamentType!='一次性支付'">-->
                    <!--<div style="display: inline-block; padding-top:15px; padding-left: 66px;">-->
                        <!--<Checkbox v-model="isMergeReceipt" @on-change="checkAll" >-->
                            <!--<span style="display: inline-block;"></span>-->
                        <!--</Checkbox>-->
                    <!--</div>-->
                    <!--<div style="display: inline-block; padding-left: 15px; font-size: 14px; color: rgb(51,51,51);"><b>合并收款</b></div>-->
                <!--</li>-->
            </ul>
            <Alert conllectionAlert show-icon v-else class="custom-alert">暂无待收款项</Alert>
        </Row>
        <div v-if="tabStatus==2">
            <div style="width: 100%; display:table; height: 54px; border-top: 1px solid #e8e8e8;" v-for="(receipt, index) in receipts" :key="index">
                <div style="display: table-row;">
                    <div style="display: table-cell; width: 100%">
                        <div style="display: table;">
                            <div style="display: table-cell; width: 210px; font-size: 14px;"><span style="display:inline-block; padding-top:15px; padding-left: 46px;">收款日</span><span style="display:inline-block; padding-top:15px; padding-left: 15px;">{{receipt.tsReceipt.substring(0,10)}}</span></div>
                            <div style="display: table-cell; width: 200px; font-size: 14px; color: rgb(51,51,51);"><span style="padding-left: 30px;"><b>应收 ￥ {{receipt.receivablePrice ? receipt.receivablePrice.toFixed(2) : 0.00 }}</b></span></div>
                            <div style="display: table-cell; width: 120px; font-size: 14px; color: rgb(51,51,51);">优惠 ￥ {{receipt.benefitPrice ? receipt.benefitPrice.toFixed(2) : 0.00 }}</div>
                            <div style="display: table-cell; width: 120px; font-size: 14px; color: rgb(51,51,51);"><span v-if="receipt.reductionType!=1">减免</span><span v-else>加收</span> ￥ {{receipt.reductionPrice.toFixed(2)}}</div>
                            <div style="display: table-cell; text-align: center; font-size: 14px; color: rgb(51,51,51); vertical-align: middle;">
                                <Tooltip :content="receipt.type" placement="top" style="position: relative;">
                                    <img v-if="receipt.type=='现金'" src="../../../static/collection/cash.png" style="width:18px; height:18px; margin-top: 4px;" />
                                    <img v-if="receipt.type=='对公转账'" src="../../../static/collection/transfer.png" style="width:18px; height:18px; margin-top: 4px;" />
                                    <img v-if="receipt.type=='支票'" src="../../../static/collection/check.png" style="width:18px; height:18px; margin-top: 4px;" />
                                    <img v-if="receipt.type=='微信'" src="../../../static/collection/wxpay.png" style="width:18px; height:18px; margin-top: 4px;" />
                                    <img v-if="receipt.type=='支付宝'" src="../../../static/collection/alipay.png" style="width:18px; height:18px; margin-top: 4px;" />
                                </Tooltip>
                            </div>
                            <div style="display: table-cell; width: 180px; text-align: right; font-size: 14px;"><span style="padding-right: 26px;"><b>实收 ￥ {{receipt.price ? receipt.price.toFixed(2) : 0.00 }}</b></span></div>
                            <div v-if="collectionAuth && receipt.type != '微信' && receipt.type != '支付宝'" style="display: table-cell; width: 30px; text-align: right; font-size: 20px; color: #59b399;" @click="editContractReceiptBtn(receipt.contractReceiptId)">
                                <Icon type="compose" style="cursor: pointer; padding-right: 16px;"></Icon>
                            </div>
                            <div style="display: table-cell; width: 46px; text-align: right; font-size: 20px; color: #59b399;">
                                <Poptip placement="left" style="width: auto; position: relative; " v-if="receipt.uploadIdList.length>0 && receipt.type == '对公转账'">
                                    <Icon type="camera" style="cursor: pointer; padding-right: 26px;"></Icon>
                                    <div slot="content" style="overflow-x: hidden; overflow-y: hidden;">
                                        <div class="demo-upload-list" v-for="item in receipt.uploadIdList">
                                            <img v-if="item.type != 'pdf'" :src="$updateConfig.file+item.fileId">
                                            <span v-else class="file-pdf-show">pdf文件</span>
                                            <div class="demo-upload-list-cover">
                                                <Icon type="ios-eye-outline" @click.native="handleView(item.fileId, item.type)"></Icon>
                                                <!--<Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>-->
                                                <!--<div style="cursor:pointer;" class="ivu-badge-count" @click="handleRemove(item)">x</div>-->
                                            </div>
                                        </div>
                                    </div>
                                </Poptip>
                                <Icon v-if="receipt.uploadIdList.length==0 && receipt.type == '对公转账'" type="camera" style=" padding-right: 26px; color:#ddd;"></Icon>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="display: table-row;">
                    <div style="display: table-cell; width: 100%">
                        <div style="display: table; font-size: 12px; color: #666;padding-left: 45px; padding-right: 45px;">
                            收费说明：{{receipt.remark}}
                        </div>
                    </div>
                </div>
            </div>
            <Alert conllectionAlert show-icon v-if="receipts.length==0" class="custom-alert">暂无已收款项记录</Alert>
        </div>
        <Row v-if="collectionAuth">
            <Form class="collection-form" :label-width="100" ref="form" :model="receiptItem" :rules="ruleCustom">
                <FormItem style="padding-top: 20px;" :label-width="100" label="收款方式" prop="payWay">
                    <Button :class="receiptItem.type == 'CASH' ? 'check-button active' : 'check-button'" size="small" @click="choosePayWay('CASH')">现金</Button>
                    <Button :class="receiptItem.type == 'CHECK' ? 'check-button active' : 'check-button'" size="small"  @click="choosePayWay('CHECK')" >支票</Button>
                    <Button :class="receiptItem.type == 'TRANSFER' ? 'check-button active' : 'check-button'" size="small"  @click="choosePayWay('TRANSFER')">对公转账</Button>
                    <Button :class="receiptItem.type == 'WECHAT' ? 'check-button active' : 'check-button'" size="small"  @click="choosePayWay('WECHAT')">微信支付</Button>
                    <Button :class="receiptItem.type == 'ALIPAY' ? 'check-button active' : 'check-button'" size="small"  @click="choosePayWay('ALIPAY')">支付宝支付</Button>
                </FormItem>
            </Form>
                <Row>
                <Form class="collection-form" :label-width="100" ref="formCheck" :model="receiptItem" :rules="ruleCustom">
                    <i-col span="8" v-if="receiptItem.type=='CHECK'">
                        <FormItem :label-width="150" label="付款行名称" prop="checkBankName">
                            <Input class="aaa" v-model="receiptItem.checkBankName" placeholder="请输入" :maxlength="30"/>
                        </FormItem>
                    </i-col>
                    <i-col span="8" v-if="receiptItem.type=='CHECK'">
                        <FormItem :label-width="150" label="出票人帐号" prop="checkDrawerAccount" :rules="{required: true, message: '请输入出票人帐号'}">
                            <Input v-model="receiptItem.checkDrawerAccount" placeholder="请输入" :maxlength="30"></Input>
                        </FormItem>
                    </i-col>
                    <i-col span="8" v-if="receiptItem.type=='CHECK'">
                        <FormItem :label-width="150" label="支票号" prop="checkNumber" :rules="{required: true, message: '请输入支票号'}">
                            <Input v-model="receiptItem.checkNumber" placeholder="请输入" :maxlength="30"/>
                        </FormItem>
                    </i-col>
                </Form>
                <Form class="collection-form" :label-width="100" ref="formTransfer" :model="receiptItem" :rules="ruleCustom">
                    <i-col span="8" v-if="receiptItem.type=='TRANSFER'">
                        <FormItem :label-width="150" prop="transferAccountName" label="付款方户名" :rules="{required: true, message: '请输入付款方户名'}">
                            <Input v-model="receiptItem.transferAccountName" placeholder="请输入" :maxlength="30"/>
                        </FormItem>
                    </i-col>
                    <i-col span="8" v-if="receiptItem.type=='TRANSFER'">
                        <FormItem :label-width="150" prop="transferAccount" label="付款方帐号">
                            <Input v-model="receiptItem.transferAccount" placeholder="请输入" :maxlength="30"/>
                        </FormItem>
                    </i-col>
                    <i-col span="8" v-if="receiptItem.type=='TRANSFER'">
                        <FormItem :label-width="150" prop="transferBankName" label="付款方开户行名称" :rules="{required: true, message: '请输入付款方开户行名称'}">
                            <Input v-model="receiptItem.transferBankName" placeholder="请输入" :maxlength="30"/>
                        </FormItem>
                    </i-col>
                    <i-col span="8" v-if="receiptItem.type=='TRANSFER'">
                        <FormItem class="transfer" :label-width="150" prop="transferBankNumber" label="付款方开户行行号">
                            <Input v-model="receiptItem.transferBankNumber" placeholder="请输入" :maxlength="30"/>
                        </FormItem>
                    </i-col>
                    <i-col style="color: #59b399; height: 70px;" span="16" v-if="receiptItem.type == 'TRANSFER'">
                        <FormItem class="transfer" :label-width="150" label="上传凭证">
                            <div class="demo-upload-list" v-for="item in receiptItem.uploadIdList">
                                <img v-if="item.type != 'pdf'" :src="$updateConfig.file+item.fileId">
                                <span v-else class="file-pdf-show">pdf文件</span>
                                <div class="demo-upload-list-cover">
                                    <Icon type="ios-eye-outline" @click.native="handleView(item.fileId, item.type)"></Icon>
                                    <!--<Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>-->
                                    <div style="cursor:pointer;" class="ivu-badge-count" @click="handleRemove(item)">x</div>
                                </div>
                            </div>
                            <BSUpload v-if="receiptItem.uploadIdList.length<9" class="upload-button" :beforeUpload="beforeUpload" :onSuccess="onSuccess" :showProcess="true" :type="['bmp','gif','ico','jpg','jpeg','png','pdf']">
                                <div style="width: 58px;height:58px;line-height: 58px; text-align:center;">
                                    <Icon type="camera" size="20"></Icon>
                                </div>
                            </BSUpload>
                        </FormItem>
                    </i-col>
                </Form>
                </Row>
                <Modal title="查看图片" v-model="visible">
                    <img :src="$updateConfig.file + imgName" v-if="visible" style="width: 100%">
                </Modal>

                <hr size="1" color="#59b399" v-if="(receiptItem.type=='TRANSFER' || receiptItem.type=='CHECK')" :style="receiptItem.uploadIdList.length>4?'margin-top: 70px;':''">
            <Form class="collection-form" :label-width="100" ref="form" :model="receiptItem" :rules="ruleCustom">
                <i-col span="8" offset="8" pull="8" v-if="receiptItem.type != '' " style="padding-top: 15px;">
                    <FormItem :label-width="100" prop="receivablePrice" label="应收金额">
                        <Input class="currency" v-model="receiptItem.receivablePrice" placeholder="0.00" icon="social-yen" @on-change="resetBenefitCode" :maxlength="9">
                        </Input>
                    </FormItem>
                </i-col>
                <i-col span="8" pull="8" v-if="receiptItem.type != '' " style="padding-top: 15px;">
                    <FormItem :label-width="100" prop="tsReceipt" label="收款日期">
                        <DatePicker type="date" v-model="receiptItem.tsReceipt" :editable="false" :clearable="false" ></DatePicker>
                    </FormItem>
                </i-col>
                <i-col span="8" v-if="receiptItem.type != '' " >
                    <FormItem :label-width="100" prop="benefitPrice" label="优惠金额">
                        <Input class="currency" v-model="receiptItem.benefitPrice" number readonly placeholder="0.00" icon="social-yen"></Input>
                    </FormItem>
                </i-col>
                <i-col class="benefitCodeErrorTip" span="8" v-if="receiptItem.type != ''" style="height: 52.8px;">
                    <FormItem :label-width="100" prop="benefitCode" label="优惠码">
                        <Poptip class="benefitCode" :class="{active: receiptItem.benefitCode != null && receiptItem.benefitCode != ''}" trigger="focus" placement="top-start" style="width: 100%;">
                            <Input v-model="receiptItem.benefitCode" placeholder="请输入" @on-change="getCouponDetail" style="width: 100%;" :maxlength="8">
                                <Poptip slot="append" placement="top" style="overflow-x: hidden; overflow-y: hidden;">
                                    <Icon v-if="couponItem.success" type="help-circled" style="cursor: pointer; color: #59b399;"></Icon>
                                    <Icon v-else="couponItem.success" type="alert" style="color: #f45a43; font-size: 8px;"></Icon>
                                    <div v-if="couponItem.success" slot="content" style="overflow-x: hidden; overflow-y: hidden;">
                                        <div><span><strong>优惠券使用说明</strong></span></div>
                                        <div style="text-align: left"><span style="padding-left: 5px;">活动时间:  {{couponItem.data.coupon.beginTime}}至{{couponItem.data.coupon.endTime}}</span></div>
                                        <div style="text-align: left"><span style="padding-left: 5px;">优惠券面值:  ￥{{couponItem.data.coupon.discountMoneyPrecision}}</span></div>
                                        <div style="text-align: left"><span style="padding-left: 5px;">使用金额限制: 订单满{{couponItem.data.coupon.limitedMoneyPrecision}}元可用</span></div>
                                        <div style="text-align: left">
                                            <span style="padding-left: 5px;" v-if="couponItem.data.coupon.limitedUsedCount > 0">使用张数限制: 单笔订单最多使用{{couponItem.data.coupon.limitedUsedCount}}张</span>
                                            <span style="padding-left: 5px;" v-else>使用张数限制: 不限制使用张数</span>
                                        </div>
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
                            <div slot="content" style="display: inline-block;color: firebrick; font-size: 22px; height: 20px; line-height: 20px; overflow-x: hidden; overflow-y: hidden;">{{receiptItem.benefitCode | showBenefitCode}}</div>
                        </Poptip>
                    </FormItem>
                </i-col>
                <i-col span="8" v-if="receiptItem.type != ''" >
                    <FormItem :label-width="120" prop="benefitMobile" label="优惠领取手机号">
                        <Input  v-model="receiptItem.benefitMobile" placeholder="请输入" @on-change="resetBenefitCode" :maxlength="11"></Input>
                    </FormItem>
                </i-col>
                <!--<i-col span="8" v-if="receiptItem.type != ''">-->
                    <!--<FormItem :label-width="100" prop="reductionType" label="调整类型">-->
                        <!--<Select class="reductionType" v-model="receiptItem.reductionType" @on-change="resetReduction">-->
                            <!--<Option v-for="list in reductionTypeList" :value="list.value" :key="list.value">{{ list.label }}</Option>-->
                        <!--</Select>-->
                    <!--</FormItem>-->
                <!--</i-col>-->
                <i-col span="8" v-if="receiptItem.type != ''">
                    <FormItem :label-width="100" prop="reductionPrice" label="减免金额">
                        <Input class="currency" v-model="receiptItem.reductionPrice" number placeholder="0.00" icon="social-yen" :maxlength="12"></Input>
                    </FormItem>
                </i-col>
                <i-col span="16" v-if="receiptItem.type != ''">
                    <FormItem :label-width="100" prop="reductionReason" label="减免原因">
                        <Input v-model="receiptItem.reductionReason" placeholder="请输入" :maxlength="100"></Input>
                    </FormItem>
                </i-col>
                <i-col style="color: #59b399; padding-top: 15px;" span="24" v-if="receiptItem.type != ''">
                    <FormItem :label-width="100" prop="remark" label="收费说明">
                        <Input v-model="receiptItem.remark" type="textarea" :autosize="{minRows: 2,maxRows: 3}" placeholder="收费说明" :maxlength="100"></Input>
                    </FormItem>
                </i-col>
                <br v-if="receiptItem.type != ''">
                <i-col style="color: #59b399; padding-top: 25px;" span="8" offset="16" v-if="receiptItem.type != ''">
                    <FormItem id="receiptLabel" :label-width="100" prop="price" label="实收金额">
                        <Input class="currency" v-model="totalPrice" readonly placeholder="0.00" icon="social-yen"></Input>
                    </FormItem>
                </i-col>
                <i-col span="22" v-if="receiptItem.type != ''">
                    <FormItem class="saveBtn">
                        <Button @click="collectChecked" :disabled="receiptItem.receivablePrice <= 0 ">确认收款</Button>
                    </FormItem>
                </i-col>
            </Form>
        </Row>
    </div>
</template>

<script type="text/babel">
    export default {
        props: {
            //合约主体ID
            contractId: null,
            //收款操作
            collectionAuth: false
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
                }
                else if (this.totalPrice < 0) {
                    return callback(new Error('减免金额要小于等于'+Math.format(this.receiptItem.receivablePrice-this.receiptItem.benefitPrice, 2)+'元！'));
                }
                else {
                    callback();
                }
            };
            const validateBenefitPrice = (rule, value, callback) => {
                if (!this.couponItem.success && this.receiptItem.benefitCode != null && this.receiptItem.benefitCode.length > 0) {
                    return callback(new Error('请输入正确的优惠码！'));
                } else {
                    callback();
                }
            };
            const validateReductionPrice = (rule, value, callback) => {
                if (this.receiptItem.reductionPrice != 0 && (value == null || value == "")) {
                    return callback(new Error('请输入减免原因！'));
                } else {
                    callback();
                }
            };

            const validateBenefitMobile = (rule, value, callback) => {
                if (this.receiptItem.benefitCode != null && this.receiptItem.benefitCode.length > 0) {
                    var pattern = /0?(13|14|15|17|18)[0-9]{9}/;
                    if (pattern.test(this.receiptItem.benefitMobile)) {
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
                    { value: "0", label:"不调整"},
                    { value: "2", label:"减免"},
                    { value: "1", label:"加收"},
                ],
                tabStatus: 2,//默认选择待收款选项卡
                receivableInfo:{},//收款主体信息
                receivables:[],//待收款列表
                receipts:[],//已收款列表
                isMergeReceipt: false,//是否合并收款
                receiptItem: {//收款对象
                    contractId: this.contractId,
                    tsReceipt: new Date(),
                    type: "",
                    receivablePrice: 0.00,
                    benefitPrice: 0.00,
                    reductionPrice: 0.00,
                    reductionType: "2",
                    receivableIds:[],//已选择待收款ID
                    uploadIdList:[],//上传文件列表
                },
                couponItem: {//优惠券
                    success : false,
                },
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
                        { validator: validateReceivablePrice, trigger: "change"},
                        // { pattern:  /^0{1}([.][1-9]{1})$|^0{1}([.]\d{1}[1-9]{1})$|^[1-9]\d*([.]{1}[0-9]{1,2})?$/ ,message:'请输入合理数字'}
                    ],
                    checkBankName: [
                        {required: true, message: '请输入付款行名称'}
                    ],
                    checkDrawerAccount: [
                        // {required: true, message: '请输入出票人帐号'},
                        { validator: validateNumber, trigger: "change"}
                    ],
                    checkNumber: [
                        // {required: true, message: '请输入支票号'},
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
//                    benefitCode: [
//                        { validator: validateBenefitPrice, trigger: "blur" }
//                    ],
                    reductionReason: [
                        { validator: validateReductionPrice, trigger: "blur" }
                    ],
                    benefitMobile: [
                        { validator: validateBenefitMobile, trigger: "blur" }
                    ],
                },
                benefitCodeStr : "",//优惠券编码-显示

            }
        },
        filters: {
            showBenefitCode : function (value) {
                var benefitCode = "";
                if (value) {
                    for (var index=0;index<value.length;index++) {
                        if (index == 2 || index == 4 || index == 6) {
                            benefitCode =  benefitCode + "-" + value[index];
                        } else {
                            benefitCode =  benefitCode + "" + value[index];
                        }
                    }
                }
                return benefitCode;
            },
        },
        computed: {
            receivableInfoPrice() {
                return Math.format(this.receivableInfo.receivablePrice-this.receivableInfo.receiptPrice, 2) < 0 ? 0.00: Math.format(this.receivableInfo.receivablePrice-this.receivableInfo.receiptPrice, 2);
            },
            totalPrice() {
                return this.benefitAndreduction();
            },
        },
        created: function() {

            //获取收款主体信息
            this.getReceivableInfo();

            //获取待收款列表
            this.getReceivables();

            //获取已收款列表
            this.getReceipts();

        },
        methods: {
            /**
             * 切换选项卡
             */
            checkTab(status) {
                this.tabStatus = status;
            },
            /**
             * 选择待收款记录
             */
            chooseReceivable() {
//                this.computationReceiptPrice();
                this.updateMergeStatus();
            },
            /**
             * 全选待收款记录
             */
            checkAll() {//全选待收款记录
                if (this.isMergeReceipt) {
                    for(var index_i=0;index_i<this.receivables.length;index_i++){
                        this.$set(this.receivables[index_i], "isReceipt", true);
                    }
                } else {
                    for(var index_j=0;index_j<this.receivables.length;index_j++){
                        this.$set(this.receivables[index_j], "isReceipt", false);
                    }
                }
//                this.computationReceiptPrice();
            },
            /**
             * 更新合并收款按钮状态
             */
            updateMergeStatus() {
                var n=0;
                for(var i=0;i<this.receivables.length;i++){
                    if (this.receivables[i].isReceivable == 0 && !this.receivables[i].isReceipt) {
                        n++;
                    }
                }
                if (n===0) {
                    this.isMergeReceipt = true;
                } else {
                    this.isMergeReceipt = false;
                }
            },
            /**
             * 获取财务收款主体信息
             */
            getReceivableInfo() {
                this.request({
                    url: "/signCloud/collection/receivableInfo.do",
                    param: {
                        contractId: this.contractId
                    }
                }).then(data => {
                    this.receivableInfo = data;
                    this.receivableInfo.id = this.contractId;
                    this.receiptItem.benefitMobile = this.receivableInfo.mobile;
                    this.$set(this.receiptItem, "price", 0.00);
                });
            },
            /**
             * 获取待收款列表
             */
            getReceivables() {
                this.request({
                    url: "/signCloud/collection/receivables.do",
                    param: {
                        contractId: this.contractId
                    }
                }).then(data => {
                    this.receivables = data;
//                    if (this.receivables.length>0) {
//                        this.$set(this.receiptItem, "type", "");
//                        this.$set(this.receivables[0], "isReceipt", true);
//                        this.computationReceiptPrice();
//                    }
                });
            },
            /**
             * 获取已收款列表
             */
            getReceipts() {
                this.request({
                    url: "/signCloud/collection/receipts.do",
                    param: {
                        contractId: this.contractId
                    }
                }).then(data => {
                    this.receipts = data;
                });
            },
//            /**
//             * 1.计算每个选中的应收款记录所得的应收金额
//             * 2.选择所选待收款记录ID
//             * 3.重置优惠金额与减免金额
//             */
//            computationReceiptPrice() {
//                this.$set(this.receiptItem, "receivablePrice", 0);
//                this.receiptItem.receivableIds = [];
//                for(var i=0;i<this.receivables.length;i++) {
//                    if (this.receivables[i].isReceipt) {
//                        this.receiptItem.receivableIds.push(this.receivables[i].receivableId);
//                        this.receiptItem.receivablePrice += this.receivables[i].price;
//                    }
//                }
//                this.receiptItem.price = this.receiptItem.receivablePrice;
//                this.$set(this.receiptItem, "benefitPrice", 0);
//                this.$set(this.receiptItem, "benefitCode", null);
//                this.$set(this.receiptItem, "reductionPrice", 0);
//            },
            /**
             * 重置优惠券编码
             */
            resetBenefitCode() {
                this.$set(this.receiptItem, "benefitPrice", 0);
                this.$set(this.receiptItem, "benefitCode", null);
                this.receiptItem.benefitId = null;
                this.couponItem = {success : false};
                this.couponValidateItem.validates[0].code = null;
                this.couponValidateItem.validates[0].mobile = null;
                this.couponValidateResult = {};
                this.benefitCodeStr = "";
            },

            /**
             * 获取优惠券详情
             */
            getCouponDetail() {
                if (this.receiptItem.benefitMobile == "") {
                    this.$Message.warning({
                        content: "请先输入优惠领取手机号",
                    });
                    return ;
                }
                if (this.receiptItem.benefitCode.length == 8) {
                    this.request({
                        url: "/signCloud/collection/couponDetail.do",
                        param: {
                            code: this.receiptItem.benefitCode,
                            mobile: this.receiptItem.benefitMobile,
                        },
                    }).then(data => {
                        this.couponItem = data;
                        if (this.couponItem.success) {
                            this.receiptItem.benefitId = this.couponItem.data.id;
                            this.couponValidateItem.validates[0].code = this.receiptItem.benefitCode;
                            this.couponValidateItem.validates[0].mobile = this.receiptItem.benefitMobile;
                            if (parseFloat(this.couponItem.data.coupon.discountMoneyPrecision) > parseFloat(this.receiptItem.receivablePrice)) {
                                this.$set(this.receiptItem, "benefitPrice", this.receiptItem.receivablePrice);
                            } else {
                                this.$set(this.receiptItem, "benefitPrice", this.couponItem.data.coupon.discountMoneyPrecision);
                            }
                        } else {
                            this.$set(this.receiptItem, "benefitPrice", 0);
                            this.receiptItem.benefitId = null;
                            this.couponItem = {success : false};
                            this.couponValidateItem.validates[0].code = null;
                            this.couponValidateItem.validates[0].mobile = null;
                            this.couponValidateResult = {};
                        }
                    });
                } else {
                    this.$set(this.receiptItem, "benefitPrice", 0);
                    this.receiptItem.benefitId = null;
                    this.couponItem = {success : false};
                    this.couponValidateItem.validates[0].code = null;
                    this.couponValidateItem.validates[0].mobile = null;
                    this.couponValidateResult = {};
                }
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
                        this.collect();
                    } else {
                        this.$Message.warning({
                            content: this.couponValidateResult.data.validates[0].validateBody.msg,
                        });
                    }

                });
            },
            /**
             * 优惠、减免或加收
             */
            benefitAndreduction() {
//                if (this.receiptItem.reductionType == "1") {
//                    return Math.format(Math.format(this.receiptItem.receivablePrice-this.receiptItem.benefitPrice, 2)+this.receiptItem.reductionPrice, 2);
//                } else {
                    return Math.format(Math.format(this.receiptItem.receivablePrice-this.receiptItem.benefitPrice, 2)-this.receiptItem.reductionPrice, 2);
//                }
            },
            resetReduction() {
                this.$set(this.receiptItem, "reductionPrice", 0);
                this.$set(this.receiptItem, "reductionReason", "");
//                this.receiptItem.reductionReason = null;
            },
            accAdd(arg1,arg2){
                var r1,r2,m;
                try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
                try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
                m=Math.pow(10,Math.max(r1,r2))
                return (arg1*m+arg2*m)/m
            },
            /**
             * 选择支付方式
             */
            choosePayWay(type) {
                this.$set(this.receiptItem, "type", type);
                this.resetBenefitCode();
                this.resetReduction();
            },
            /**
             * 收款检查操作
             */
            collectChecked() {
                if (!this.couponItem.success && this.receiptItem.benefitCode != null && this.receiptItem.benefitCode.length > 0) {
                    this.$Message.warning({
                        content: "请输入正确的优惠码!",
                    });
                    return;
                }
                if (this.totalPrice == 0 && (this.receiptItem.type == 'WECHAT' || this.receiptItem.type == 'ALIPAY')) {
                    this.$Message.warning({
                        content: "当前实收金额为0元，请不要选择微信或支付宝收款！",
                    });
                    return;
                }
                this.$set(this.receiptItem, "price", this.totalPrice);
//                if (this.receiptItem.receivableIds.length>0) {
                    var flag1 = true;
                    var flag2 = true;
                    if (this.receiptItem.type == 'CHECK') {
                        this.$refs['formCheck'].validate(valid => {
                            flag1 = valid;
                        })
                    }
                    if (this.receiptItem.type == 'TRANSFER') {
                        this.$refs['formTransfer'].validate(valid => {
                            flag2 = valid;
                        })
                    }
                    this.$refs['form'].validate(valid => {
                        if (valid&&flag1&&flag2) {
                            if (this.receiptItem.benefitCode != undefined && this.receiptItem.benefitCode != "") {
                                if (this.couponItem.success) {
                                    this.checkCoupon();
                                } else {
                                    this.$Message.warning({
                                        content: "请输入正确的优惠码和手机号!",
                                    });
                                }

                            } else {
                                this.collect();
                            }
                        }
                    })
//                } else {
//                    this.$Message.error("请选择要付款的待支付记录！");
//                }
            },

            /**
             * 收款操作
             */
            collect() {
                if (this.receiptItem.type == 'ALIPAY') {//支付宝收款
                    this.openPayView(this.receiptItem.type);
                } else if (this.receiptItem.type == 'WECHAT') {//微信收款
                    this.openPayView(this.receiptItem.type);
                } else {
                    this.request({
                        url: "/signCloud/collection/saveReceipt.do",
                        data: this.receiptItem,
                    }).then(() => {
                        this.$Message.success('款项已收到，确认收款入账！');
                        //获取收款主体信息
                        this.getReceivableInfo();
                        //获取待收款列表
                        this.getReceivables();
                        //获取已收款列表
                        this.getReceipts();
                        //重置优惠券相关
                        this.resetBenefitCode();
                        //重置减免相关
                        this.resetReduction();
                        this.$refs['form'].resetFields();
                        this.receiptItem.remark = "";
                        this.receiptItem.uploadIdList = [];
                        this.receiptItem.receivablePrice = 0;
                        this.receiptItem.receivableIds = [];

                    });
                }
            },

            openPayView(type){
                if (type == 'ALIPAY') {
                    this.prompt({
                        title: "支付宝收款",
                        code: "aliPayView",
                        width: 500,
                        height: 310,
                        props: {
                            item: this.receiptItem,
                        },
                        callback: (payResult, close) => {
                            close();
                            if(payResult) {
                                //获取收款主体信息
                                this.getReceivableInfo();
                                //获取待收款列表
                                this.getReceivables();
                                //获取已收款列表
                                this.getReceipts();
                                //重置优惠券相关
                                this.resetBenefitCode();
                                //重置减免相关
                                this.resetReduction();
                                this.$refs['form'].resetFields();
                                this.receiptItem.remark = "";
                                this.receiptItem.receivablePrice = 0;
                                this.receiptItem.receivableIds = [];
                                this.isMergeReceipt = false;
                            }
                        }
                    });
                } else if (type == 'WECHAT') {
                    this.prompt({
                        title: "微信收款",
                        code: "wechatPayView",
                        height: 380,
                        width: 600,
                        props: {
                            item: this.receiptItem,
                        },
                        callback: (payResult, close) => {
                            close();
                            if(payResult) {
                                //获取收款主体信息
                                this.getReceivableInfo();
                                //获取待收款列表
                                this.getReceivables();
                                //获取已收款列表
                                this.getReceipts();
                                //重置优惠券相关
                                this.resetBenefitCode();
                                //重置减免相关
                                this.resetReduction();
                                this.$refs['form'].resetFields();
                                this.receiptItem.remark = "";
                                this.receiptItem.receivablePrice = 0;
                                this.receiptItem.receivableIds = [];
                                this.isMergeReceipt = false;
                            }
                        }
                    });
                }
            },
            /**
             * 编辑已收款记录
             */
            editContractReceiptBtn(id) {
                // this.card({
                //     title: "",
                //     code: "auditedContractView",
                //     width: 940,
                //     props: {
                //         contractId:item.id
                //     },
                // });
                this.card({
                    title: "编辑已收款台帐",
                    code: "editReceiptView",
                    width: 930,
                    // height: 585,
                    props: {
                        contractReceiptId: id,
                        receivableInfo: this.receivableInfo,
                    },
                    callback: (close) => {
                        close();
//                        if(editResult) {
                            //获取收款主体信息
                            this.getReceivableInfo();
                            //获取已收款列表
                            this.getReceipts();
                            this.$Message.success('收款台帐已更新！');
                            this.$api.refreshInvoicePage && this.$api.refreshInvoicePage(true);
//                        }
                    }
                });
            },

            beforeUpload:function(file){
            },
            onSuccess:function(id,file){
                var fileObj = new Object();
                fileObj.fileId = id;
                fileObj.type = file.name.split(".")[1];
                this.receiptItem.uploadIdList.push(fileObj);
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
                const fileList = this.receiptItem.uploadIdList;
                this.receiptItem.uploadIdList.splice(fileList.indexOf(file), 1);
            },
        }
    };
</script>

<style scoped>
    .top-info {
        padding: 0 46px;
    }
    .top-info > div > span {
        font-size: 14px;
        color: #5c5c5c;
    }
    .top-info > div > b {
        font-size: 16px;
        color: #333;
        margin-left: 20px;
    }
    .top-info > div > b > span {
        font-size: 12px;
    }

    .tab-button-bar {
        padding: 20px 0 0 46px;
    }
    .tab-button {
        padding-top:5px;
        display: inline-block;
        width: 80px;
        height: 30px;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
        text-align: center;
        background-color: #eee;
        cursor: pointer;
    }
    .tab-button > span {
        font-size: 14px;
        color: rgb(153,153,153);
    }
    .tab-button.active {
        padding-top:5px;
        display: inline-block;
        width: 80px;
        height: 30px;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
        text-align: center;
        background-color: #59b399;
    }
    .tab-button.active > span {
        font-size: 14px;
        color: rgb(255,255,255);
    }
</style>

<style scoped>
    .received-list-item:nth-child(even) {
        background: #f7f7f7;
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

    .collection-form >>> .ivu-date-picker {
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

    .receivable-list li{
        position: relative;
        display: flex;
        align-items: center;
        padding: 15px 30px;
        border-top: 1px solid #eee;
    }

    .receivable-list li:first-child{
        border-top: 0;
    }

    .receivable-list li>div:first-child {
        font-weight: 600;
        height: 50px;
        width: 50px;
        border-radius: 50%;
        background: #F5F5F5;
        line-height: 50px;
        text-align: center;
        padding: 0;
        color: #333;
    }
    .receivable-list .disabled {
        color: #a2a2a2;
        font-weight: 100;
    }
    .collection-form .receivable-price {
        font-size: 14px;
        font-weight: 700;
    }
    .collection-form .receivable-time {
        position: absolute;
        right: 16px;
        top: 50%;
        transform: translateY(-50%);
    }

    /* 样式修改 By LiYue */
    .receivable-list, .received-list {
        border: 1px solid #eee;
    }

    .custom-pane .ivu-tabs-bar{
        background: #F5F5F5;
        border-bottom: 0;
        margin-bottom: 0;
        padding: 5px 15px;
        border: 1px solid #eee;
        border-bottom: 0;
    }

    .custom-pane .custom-alert {
        position: relative;
        border: 1px solid #eee;
        background-color: initial;
        border-radius: 0;
        margin-bottom: 0;
        /*margin-top: 20px;*/
        padding: 30px 33px;
    }

    .custom-pane .custom-alert > .ivu-alert-icon {
        top: 30PX;
    }
</style>