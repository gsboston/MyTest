<style scoped>
    .payDoneBox{
        background: #000000;
        position: absolute;
        opacity: 0.5;
        width: 100%;
        height: 100%;
        color: #FFFFFF;
        font-weight: bold;
        display: flex;
        justify-content:center;
        align-items:center;
        display:flex;
    }
    .toPayRow{
        display: flex;
        width: 100%;
        padding-top: 13px;

    }
    .toPayRow>div{
        padding-top: 12px;
    }
    .payDoneRow{
        display: flex;
        width: 100%;
        padding-top: 5px;
        padding-bottom: 5px;
    }
    .payDoneRow-left{
        width: 20%;
        text-align: center;
        border-right: 1px solid #AEAFB2;
    }
    .payDoneRow-center{
        width: 60%;
    }
    .payDoneRow-center-down{
        display: flex;
    }

    .payDoneRow-center-down div{
        padding-left: 20px;
        padding-right: 20px;
    }

    .odd{
        background: #f2f2f2;
    }
    .even{
        background: #FFFFFF;
    }

    .payDoneRow-center-down *{
        font-size: 12px!important;
    }

    .payDoneRow-center-down-discount{
        width: 150px;
    }
    .payDoneRow-center-up{
        display: inline-flex;
        padding-bottom: 10px;
    }
    .payDoneRow-center-up div{
        padding-left: 20px;
        padding-right: 20px;
    }
    .payDoneRow-center-up-ss {
        border-right: 1px solid #AEAFB2;
        font-weight: bold;
        width: 150px;
    }
    .payDoneRow-right{
        text-align: center;
        display: table-cell;
        vertical-align: middle;
        height: 52px;
    }
    .box{
        border: 1px solid #efefef;
        padding: 20px;
    }
    .changePayBox{
        padding:15px 10px 15px 18px;
    }
    .changePayBox span{
        color: #000;
        padding-right: 25px;
    }
    .root-content > div{
        position: relative;
        max-width: 920px;
        margin: 0 auto;
        background-color: white;
    }
    .change-title{
        padding: 20px 0px 5px 15px;
        font-size: 24px;
        border-bottom: 2px solid #59b399;
        color: #59b399;
    }
    .change-content {
        padding: 0 65px 40px 15px;
    }
    .part-title{
        font-size: 18px;
        padding-top: 10px;
        padding-left: 40px;
        padding-bottom: 20px;
        color: #59b399;
    }
    .change-content .ivu-form-item-error-tip{
        padding-top: 3px;
        font-size: 14px !important;
    }
    .part-content{
        padding-left: 40px;
        padding-right: 20px;
    }
    .part-content *{
        font-size: 14px;
    }
    .text-row{
        display: flex;
    }
    .text-item{
        padding: 0px;
        height: 30px;
    }
    .discount{
        font-size: 12px!important;
        color: #dddee1;
    }
    .text-input{
        position: relative;
        top: -10px;
        width: 100px;
    }
    .began-date .ivu-form-item-error-tip{
        font-size: 12px !important;
        position: absolute;
        top: 25px;
    }



    .last-row{
        margin-left: 40px;
        padding-top: 28px;
    }
    .last-row .text-item{
        font-size: 14px;
        font-weight: bold;
    }
    .last-row .text-item-total-price{
        font-size: 18px;
        font-weight: bold;
    }
    .last-row .text-item-symbol{
        font-size: 14px;
        position: relative;
        top: 1px;
    }
    .last-row .text-item-symbol-total-price{
        font-size: 14px;
        position: relative;
        top: 5px;
    }
    .other-row{
        padding-top: 30px;
        clear: both;
    }
    .other-item{
        padding-bottom: 5px;
        width: 100%;
        display: flex;
    }
    .other-item .text-row{
        padding-left: 100px;
    }
    .other-item .text-row .text-input{
        top:0;
    }
    .other-item .text-row .text-input input{
        height: 20px;
    }
    .last-total{
        float: right;
    }
    .removeBtn{
        border: 1px solid #59b399;
        color: #59b399;
        border-radius: 5px;
    }
    .addBtn{
        background-color: #59b399;
        border: 1px solid #59b399;
        border-radius: 5px;
    }
    .change-content .ivu-form .ivu-form-item-label {
        text-align: justify;
        text-align-last: justify;
        vertical-align: middle;
        float: left;
        color: rgb(51,51,51);
        line-height: 1;
        padding: 10px 20px 10px 0;
        box-sizing: border-box;
    }
    .change-content .ivu-form-item {
        margin-bottom: 15px;
        vertical-align: top;
        zoom: 1;
    }
    .change-content .ivu-select-arrow {
        position: absolute;
        top: 50%;
        right: 15px;
        line-height: 1;
        margin-top: -7px;
        font-size: 14px;
        color: #80848f;
        transition: all .2s ease-in-out;
    }
    .change-content .ivu-checkbox {
        display: inline-block;
        vertical-align: middle;
        white-space: nowrap;
        cursor: pointer;
        outline: 0;
        line-height: 1;
        position: relative;
        padding-right: 10px;
    }
    .change-content .ivu-radio {
        display: inline-block;
        margin-right: 12px;
        white-space: nowrap;
        outline: 0;
        position: relative;
        line-height: 1;
        vertical-align: middle;
        cursor: pointer;
    }
    hr{
        margin-top: 20px;
        background-color: #e5e5e5;
        height: 1px;
        border: none;
    }
    .form-input{
        width: 260px;
    }
    .form-input-name{
        width: 110px;
    }
    .form-input-tel{
        width: 140px;
    }
    .form-input-price > input{
        position: relative;
        top: -5px;
        font-size: 20px;
    }
    .form-input-price-total-price > input{
        position: relative;
        top: -5px;
        font-size: 30px;
        color: #ff5a5a;
    }
    .other-item .form-input-price > input{
        font-size: 20px;
        height: 20px;
        top:5px;
    }
    .extra > div{
        font-size: 14px !important;
    }
    .other-item > label{
        font-size: 14px !important;
    }
    .other-item > input{
        font-size: 14px !important;
    }
    .other-item > div{
        font-size: 14px !important;
    }
    .extra .ivu-input{
        height: 20px;
    }
    .extra .text-input{
        top:0;
    }
    .extra .ivu-form-item-content{
        line-height: 20px;
    }
    .extra .ivu-row{
    }
    .ivu-input[disabled], fieldset[disabled] .ivu-input {
        background-color: #f9f6f6;
        opacity: 1;
        cursor: not-allowed;
        color: #738096;
    }
    .ivu-select-disabled .ivu-select-selection {
        background-color: #f9f6f6;
        opacity: 1;
        cursor: not-allowed;
        color: #738096;
    }
    .autoInput .ivu-auto-complete .ivu-select-dropdown{
        max-height: 200px!important;
    }

    .reject-reason{
        display: inline-block;
        margin-left: 20px;
        font-size: 14px;
    }

    .reject-contract{
        display: inline-block;
        float: right;
        margin-right: 40px;
        font-size: 14px;
    }
    .change-button{
        width: 100px;
    }
    .word-filters, .word-filters >>> input {
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .row-close-btn{
        position: absolute;
        right: 0;
        top: 0;
        border-top: 25px solid #e5e5e5;
        border-left: 25px solid transparent;
    }
    .row-close-btn > i {
        color: #a9a9a9;
        position: absolute;
        top: -24px;
        right: 4px;
        cursor: pointer;
        font-size: 12px !important;
    }
    .row-close-btn > i:hover{
        color: #59b399;
    }



</style>
<style>
    #contractChange .ivu-form-item-label{
        font-size: 14px !important;
    }
    #contractChange .ivu-form-item-error-tip{
        padding-top: 3px;
        font-size: 12px !important;
        margin-top: -10px;
    }

    #contractChange .ivu-input,.ivu-select-selection{
        border-radius: 0;
    }

    #contractChange .odd > .ivu-input{
        background: #F2F2F2;
        border-bottom: 1px solid #AEAFB2;
    }

    #contractChange .text-input .ivu-input[disabled]{
        background: #FFFFFF;
    }

    #contractChange .odd .text-input .ivu-input[disabled]{
        background: #f2f2f2;
        border-bottom: 1px solid #AEAFB2;
    }

    #contractChange .text-input input{
        border-top: none;
        border-left: none;
        border-right: none;
        text-align: center;
        height: 30px;
        font-size: 14px;
        font-weight: bolder;
    }
    #contractChange .ivu-tabs-ink-bar{
        background-color: #59b399;
    }
    #contractChange .ivu-tabs-nav .ivu-tabs-tab-active{
        color: #59b399;
    }
    #contractChange .tips .ivu-tooltip-inner{
        white-space: inherit;
    }


    #contractChange .ivu-input[disabled], fieldset[disabled] .ivu-input {
        background-color: #f2f2f2;
        opacity: 1;
        cursor: not-allowed;
        color: #333;
    }
    #contractChange .ivu-select-disabled .ivu-select-selection {
        background-color: #f2f2f2;
        opacity: 1;
        cursor: not-allowed;
        color: #333;
    }

    #contractChange .ivu-form-item-label {
        text-align: left;
    }



</style>
<template>
    <div class="root-content" id="contractChange">
        <div  class="change-content">
            <div v-if="mainInfo.status=='NONE' && mainInfo.agrementApprovalVo" style="width: 100%;border-bottom: 1px;border: #f9cd89;height: 50px;background-color: #fffdec;font-size: 14px;line-height: 50px;color: #c5652a">
                <div v-if="mainInfo.agrementApprovalVo.type == 'REJECTED'" class="reject-reason" :title="mainInfo.agrementApprovalVo.comment">
                    <p>驳回原因：{{mainInfo.agrementApprovalVo.comment | wordLengthLimit}}</p>
                </div>
                <div v-if="mainInfo.agrementApprovalVo.type == 'CANCEL'" class="reject-reason" :title="mainInfo.agrementApprovalVo.comment">
                    <p>取消原因：{{mainInfo.agrementApprovalVo.comment | wordLengthLimit}}</p>
                </div>
            </div>
            <div style="padding: 15px 0 10px 40px">
                <span style="font-weight: bold;font-size: 16px;">内容变更</span>
            </div>
            <Form :label-width="90">
                <Row>
                    <Col span="12">
                    <div class="part-title">甲方基本信息</div>
                    <div class="part-content">
                        <FormItem label="甲方:">
                            <Input  class="form-input" v-model="subjectA.name" placeholder="甲方"  disabled></Input>
                        </FormItem>
                        <Row>
                            <Col span="13">
                            <FormItem label="联系人:" >
                                <Input class="form-input-name" v-model="subjectA.contactName" placeholder="联系人姓名" disabled></Input>
                            </FormItem>
                            </Col>
                            <Col span="10" offset="1">
                            <FormItem :label-width='1' >
                                <Input  class="form-input-tel" v-model="subjectA.contactPhone" placeholder="联系电话" style="width: 140px" disabled></Input>
                            </FormItem>
                            </Col>
                        </Row>
                        <FormItem label="邮箱:">
                            <Input  class="form-input" v-model="subjectA.email" placeholder="邮箱"  disabled></Input>
                        </FormItem>
                        <FormItem label="联系地址:" >
                            <Tooltip :content="subjectA.address" class="tips" placement="bottom">
                                <Input class="form-input" v-model="subjectA.address" placeholder="联系地址"  disabled></Input>
                            </Tooltip>
                        </FormItem>
                    </div>
                    </Col>
                    <Col span="12">
                    <div class="part-title">乙方基本信息</div>
                    <div class="part-content">
                        <FormItem label="乙方:">
                            <Input class="form-input" v-model="subjectB.name" placeholder="乙方" disabled></Input>
                        </FormItem>
                        <Row>
                            <Col span="13">
                            <FormItem label="联系人:" >
                                <Input class="form-input-name" v-model="subjectB.contactName" placeholder="联系人姓名" disabled></Input>
                            </FormItem>
                            </Col>
                            <Col span="10" offset="1">
                            <FormItem :label-width="1">
                                <Input class="form-input-tel" v-model="subjectB.contactPhone" placeholder="联系电话" disabled></Input>
                            </FormItem>
                            </Col>
                        </Row>
                        <FormItem label="邮箱:">
                            <Input  class="form-input" v-model="subjectB.email" placeholder="邮箱"  disabled></Input>
                        </FormItem>
                        <FormItem label="联系地址:">
                            <Tooltip :content="subjectB.address" class="tips" placement="bottom">
                                <Input class="form-input" v-model="subjectB.address"  placeholder="联系地址" disabled></Input>
                            </Tooltip>
                        </FormItem>

                    </div>
                    </Col>
                    <Col span="12" v-if="subjectC">
                    <div class="part-title">丙方基本信息</div>
                    <div class="part-content">
                        <FormItem label="丙方:">
                            <Input class="form-input" v-model="subjectC.name" placeholder="丙方"  disabled></Input>
                        </FormItem>
                        <Row>
                            <Col span="13">
                            <FormItem label="联系人:" >
                                <Input class="form-input-name" v-model="subjectC.contactName" placeholder="联系人姓名" disabled></Input>
                            </FormItem>
                            </Col>
                            <Col span="10" offset="1">
                            <FormItem :label-width='1' >
                                <Input class="form-input-tel" v-model="subjectC.contactPhone" placeholder="联系电话" style="width: 140px" disabled></Input>
                            </FormItem>
                            </Col>
                        </Row>
                        <FormItem label="邮箱:">
                            <Input  class="form-input" v-model="subjectC.email" placeholder="邮箱"  disabled></Input>
                        </FormItem>
                        <FormItem label="联系地址:" >
                            <Input class="form-input" v-model="subjectC.address" placeholder="联系地址" :maxlength="100" disabled></Input>
                        </FormItem>
                    </div>
                    </Col>
                </Row>
            </Form>
            <hr>
            <br>
            <Form :label-width="90" :model="mainInfo" :rules="ruleForm"  ref="formRef">
                <Row>
                    <div class="part-title">内容变更详细说明</div>
                    <div class="part-content">
                        <Row>
                            <div class="text-row">鉴于：</div>
                        </Row>
                        <Row>
                            <div class="text-row">
                                <div class="text-item">甲乙双方（甲乙丙三方）于</div>
                                <Form-item :label-width="1" prop="signedDate">
                                    <DatePicker :disabled="true" class="text-input"  placeholder="选择日期" v-model="mainInfo.signedDate" style="width:150px;"></DatePicker>
                                </Form-item>
                                <div class="text-item">共同签署了</div>
                                <Form-item :label-width="1" prop="signedContractName">
                                    <Tooltip v-if="!isEdited" :content="mainInfo.signedContractName" class="tips" placement="bottom">
                                        <Input class="text-input word-filters" style="width: 250px;" v-model="mainInfo.signedContractName" :maxlength="20" :disabled="!isEdited"/>
                                    </Tooltip>
                                    <Input v-else class="text-input word-filters" style="width: 250px;" v-model="mainInfo.signedContractName" :maxlength="20" :disabled="!isEdited"/>
                                </Form-item>
                            </div>
                            <div class="text-row">
                                <div class="text-item">（合同编号为</div>
                                <Form-item :label-width="1" prop="contractCode">
                                    <i-input :disabled="true" class="text-input" style="" v-model="mainInfo.contractCode" type="text"></i-input>
                                </Form-item>
                                <div class="text-item">，以下简称“原合同”），约定甲方委托乙方办理</div>
                                <Form-item :label-width="1" prop="signedContractContent">
                                    <Tooltip v-if="!isEdited" :content="mainInfo.signedContractContent" class="tips" placement="bottom">
                                        <Input class="text-input word-filters" style="width: 150px;" v-model="mainInfo.signedContractContent" :maxlength="20" :disabled="!isEdited"/>
                                    </Tooltip>
                                    <Input v-else class="text-input word-filters" style="width: 150px;" v-model="mainInfo.signedContractContent" :maxlength="20" :disabled="!isEdited"/>
                                </Form-item>
                                <div class="text-item">服务合作事宜。</div>
                            </div>
                            <div class="text-row">
                                甲、乙双方（甲乙丙三方）本着平等互利原则，经友好协商，达成如下一致意见，以兹共同遵守：
                            </div>
                        </Row>
                        <br>
                        <div class="box">
                            <Row>
                                <Col span="21">
                                <div class="text-row" style="font-weight: bolder">
                                    双方（三方）一致同意：

                                </div>
                                </Col>
                                <Col span="3">
                                <Button v-if="isEdited" size="small" class="addBtn" style="float: right" @click="addItem">添加</Button>
                                </Col>

                            </Row>
                            <br>
                            <Row v-for="(item,index) in mainInfo.termsList" :key="index">
                                <Col span="21">
                                <div class="text-row">
                                    <div class="text-item">{{index+1}}、将原合同</div>
                                    <Tooltip class="tips" :disabled="isEdited" :content="item.terms" placement="top">
                                        <Form-item :label-width="1" :prop="'termsList['+index+'].terms'"  :rules="ruleForm.termsListVid">
                                            <i-input :maxlength="50" :disabled="!isEdited" class="text-input"  style="width: 540px" type="text" v-model="item.terms"></i-input>
                                        </Form-item>
                                    </Tooltip>
                                </div>
                                </Col>
                                <Col span="3">
                                <Button size="small" class="removeBtn" type="ghost" style="float: right" @click="removeItem(index)" :disabled="!isEdited">删除</Button>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Row>
                <hr>
                <br>

                <Row>
                    <div class="part-title">其他变更调整</div>
                    <div class="part-content">
                        <Row>
                            <Checkbox :disabled="!isEdited" v-model="changePay">金额款项有变更</Checkbox>
                        </Row>
                        <div v-show="changePay" class="changePayBox">
                            <Row>
                                <span>待收金额</span><span style="font-weight: bold;">￥{{mainInfo.receivablePice}}</span>
                            </Row>
                            <br>
                            <Row>
                                <span>支付类型</span>
                                <div style="display: inline-block;width: 600px;padding-left: 5px">
                                    <Select :disabled="!isEdited" v-model="mainInfo.payType" style="width: 200px" @on-change="changePayType">
                                        <Option value="BATCH">周期性支付</Option>
                                        <Option value="ONCE">一次性支付</Option>
                                    </Select>
                                    <RadioGroup v-show="mainInfo.payType!='ONCE'" v-model="mainInfo.paymentType" style="padding-left:10px;width: 350px">
                                        <Radio :disabled="!isEdited" label="MONTHLY">月</Radio>
                                        <Radio :disabled="!isEdited" label="QUARTERLY">季度</Radio>
                                        <Radio :disabled="!isEdited" label="HALF_YEAR">半年</Radio>
                                        <Radio :disabled="!isEdited" label="PER_YEAR">一年</Radio>
                                    </RadioGroup>
                                </div>
                            </Row>
                            <br>
                            <Row>
                                <Tabs value="todo" >
                                    <TabPane label="收款计划" name="todo">
                                        <div>
                                            <div :class="index%2==0?'toPayRow odd':'toPayRow even'" style="position: relative" v-for="(item,index) in mainInfo.receivableList">
                                                <div style="padding-right: 20px;padding-left: 20px">
                                                    <Form-item :label-width="1">
                                                        <i-input placeholder="支付标题(第几笔)" :maxlength="10" :disabled="!isEdited" :class="index%2==0?'text-input odd':'text-input even'" style="width:150px;" type="text" v-model="item.title"></i-input>
                                                    </Form-item>
                                                </div>
                                                <div class="text-row">
                                                    <div class="text-item">应收</div>
                                                    <Form-item :label-width="1" :prop="'receivableList['+index+'].price'"  :rules="ruleForm.priceListVid">
                                                        <i-input :maxlength="6" :disabled="!isEdited" :class="index%2==0?'text-input odd':'text-input even'" style="width:150px;" type="text" v-model="item.price"></i-input>
                                                    </Form-item>
                                                </div>
                                                <div class="row-close-btn" v-if="isEdited" @click="removeToPay(index)">
                                                    <Icon type="close"></Icon>
                                                    <!--<Button :disabled="!isEdited" @click="removeToPay(index)" class="removeBtn"  type="ghost" size="small">X</Button>-->
                                                </div>
                                            </div>

                                            <div>
                                                <Button v-if="isEdited" @click="addPayItem"  long  type="ghost"  style="height: 60px;font-size: 30px;border: none;color: #59b399;background: #F6FAF9">+</Button>
                                            </div>
                                        </div>
                                    </TabPane>
                                    <TabPane label="收款记录" name="done">
                                        <div class="payDoneBox">
                                            已收款项不可变更
                                        </div>
                                        <div>
                                            <div :class="index%2==0?'payDoneRow odd':'payDoneRow even'" v-for="(item,index) in mainInfo.receiptleList">
                                                <div class="payDoneRow-left">
                                                    <div>{{getDate(item.tsReceipt)}}</div>
                                                    <div>收款日</div>
                                                </div>
                                                <div class="payDoneRow-center">
                                                    <div class="payDoneRow-center-up">
                                                        <div class="payDoneRow-center-up-ss">￥{{item.price}}</div>
                                                        <!--<div>应收金额&nbsp;￥{{item.receivablePrice}}</div>-->
                                                    </div>
                                                    <div class="payDoneRow-center-down">
                                                        <div class="payDoneRow-center-down-discount">优惠：￥{{item.benefitPrice}}</div>
                                                        <div>减免：￥{{item.reductionPrice}}</div>
                                                        <div>收款人：{{item.userName}}</div>
                                                    </div>
                                                </div>
                                                <div class="payDoneRow-right">
                                                    {{item.type=='CASH'?'现金':(item.type=='CHECK'?'支票':(item.type=='TRANSFER'?'对公转账':(item.type=='WECHAT'?'微信':(item.type=='ALIPAY'?'支付宝':''))))}}
                                                </div>
                                            </div>
                                        </div>
                                    </TabPane>
                                </Tabs>
                            </Row>
                        </div>
                    </div>
                </Row>
            </Form>

        </div>
        <Row v-if="isEdited" class="clearFix" style="text-align: center;padding-top: 20px;padding-bottom: 10px">
            <div>
                <Button type="ghost" size="large" class="change-button" @click="cancel">取消</Button>
                <Button type="primary" size="large" class="change-button" @click="save">提交审核</Button>
            </div>
        </Row>
        <div v-if="changeContractId && (mainInfo.status=='NONE' || mainInfo.status=='APPROVED') && isEdited" style="text-align: center;margin-top: 10px;padding-bottom: 20px">
            <span style="text-decoration: underline;font-size: 12px;color: #738096;cursor: pointer;" @click="nullifyAgreement">客户需求变更，作废当前合约</span>
        </div>
    </div>
</template>

<script type="text/babel">
    export default {
        computed:{
            receivablePiceAfterSum:function(){
                var result = 0;
                if(this.mainInfo.receivableList&&this.mainInfo.receivableList.map){
                    this.mainInfo.receivableList.map((item)=>{
                        if(!isNaN(item.price)){
                            result+=Number(item.price);
                        }
                    });
                }
                return result;
            }
        },
        props:{
            contractId:'',
            changeContractId:'',
            isEdited:true
        },
        filters: {
            wordLengthLimit : function (value) {
                if(value && value.length > 25){
                    return value.substring(0,25) + "..." ;
                }
                return value;
            },
            wordLengthLimitName : function (value) {
                if(value && value.length > 10){
                    return value.substring(0,10) + "..." ;
                }
                return value;
            }
        },
        data () {
            return {
                subjectA:{},
                subjectB:{},
                subjectC:null,
                changePay:false,
                mainInfo:{
                    alertType:'CONTENT',
                    termsList:[],
                    receivableList:[],
                    payType:'ONCE',
                    paymentType:'ONCE',
                    maxIdx:0
//                    agrementApprovalVo:{}
                },
                ruleForm:{
                    signedDate: [
                        { required: true, message: '该项不能为空'}
                    ],
                    signedContractName: [
                        { required: true, message: '该项不能为空'}
                    ],
                    contractCode: [
                        { required: true, message: '该项不能为空'}
                    ],
                    signedContractContent: [
                        { required: true, message: '该项不能为空'}
                    ],
                    termsListVid:[
                        {required: true, message: '该项不能为空'}
                    ],
                    priceListVid:[
                        {required: true, message: '该项不能为空'},
                        { pattern:  /^-?\d+(\.\d+)?$/ ,message:'请输入数字'},
                        { pattern:   /^[0-9]+([.]{1}[0-9]{1,2})?$/ ,message:'请输入合理数字'}
                    ]
                }
            }
        },
        created:function(){
            this.loadData();
        },
        methods: {
            getDate(date){
                return DateFormat.dateToString(date);
            },
            loadData:function(){
                if(this.changeContractId&&this.contractId!=''){
                    this.request({
                        url: "/signCloud/contractChange/getContractInfo.do?id="+this.contractId
                    }).then(data => {
                        if(data.subjectList[0]){this.subjectA = data.subjectList[0]}
                        if(data.subjectList[1]){this.subjectB = data.subjectList[1]}
                        if(data.subjectList[2]){this.subjectC = data.subjectList[2]}
                    });
                    this.request({
                        url: "/signCloud/contractChange/getContractInfoByChangeId.do?id="+this.changeContractId
                    }).then(data => {
                        this.mainInfo = data.contractAgrement;
                        this.mainInfo.id =this.changeContractId;
                        this.mainInfo.signedContractId =this.contractId;
                        this.mainInfo.agrementApprovalVo =data.agrementApprovalVo;
                        this.changePay = data.changePay;
                        this.mainInfo.signedDate = DateFormat.dateToString(data.contractAgrement.signedDate,'yyyy-MM-dd');
                        this.mainInfo.contractCode=data.contractAgrement.signedContractCode;
                        this.mainInfo.receivablePice=data.receivablePice;
                        // if(data.receivableVoList&&data.receivableVoList.length>0){

//                        if(this.changePay){
                        if(data.contractAgrement.paymentType=='ONCE')
                            this.mainInfo.payType = 'ONCE';
                        else
                            this.mainInfo.payType = 'BATCH';
                        this.mainInfo.paymentType = data.contractAgrement.paymentType;
//                        }
                        // }
                        this.$set(this.mainInfo,'termsList',data.termsVoList);
                        this.$set(this.mainInfo,'receivableList',data.receivableVoList);
                        /* if(data.receivableVoList&&data.receivableVoList.length>0){
                         this.changePay = true;
                         this.$set(this.mainInfo,'receivableList',data.receivableVoList);
                         }*/

                        this.$set(this.mainInfo,'receiptleList',data.receiptVoList);
                    });
                }else if(this.contractId!=''){
                    this.request({
                        url: "/signCloud/contractChange/getContractInfo.do?id="+this.contractId
                    }).then(data => {
                        this.mainInfo = data;
                        this.mainInfo.oldSignedDate = data.signedDate;
                        if(data.paymentType=='ONCE')
                            this.mainInfo.payType='ONCE';
                        else
                            this.mainInfo.payType='BATCH';
                        this.mainInfo.signedDate = DateFormat.dateToString(data.signedDate,'yyyy-MM-dd');
                        if(data.maxIdx=='')
                            this.mainInfo.maxIdx =1;
                        this.$set(this.mainInfo,'termsList',[]);
                        if(data.subjectList[0]){this.subjectA = data.subjectList[0]}
                        if(data.subjectList[1]){this.subjectB = data.subjectList[1]}
                        if(data.subjectList[2]){this.subjectC = data.subjectList[2]}
                    });
                }
            },
            addItem:function(){
                if(!this.mainInfo.termsList||!(this.mainInfo.termsList instanceof Array))
                    this.mainInfo.termsList = [];
                this.mainInfo.termsList.push({
                    idx:this.mainInfo.termsList.length>0?this.mainInfo.termsList[this.mainInfo.termsList.length-1].idx+1:0,
                    terms:''
                });

            },
            removeItem:function(index){
                this.mainInfo.termsList.splice(index, 1);
            },
            removeToPay:function(index){
                this.mainInfo.receivableList.splice(index, 1);
            },
            changePayType:function(type){
                if(type=='ONCE'){
                    this.mainInfo.paymentType='ONCE';
                }else{
                    if(this.mainInfo.paymentType=='ONCE')
                        this.mainInfo.paymentType='MONTHLY';
                }
            },
            addPayItem:function(){
                if(!this.mainInfo.maxIdx||this.mainInfo.maxIdx=='')
                    this.mainInfo.maxIdx=0;
                this.mainInfo.receivableList.push({
                    title:"",
                    contractId:this.mainInfo.contractId,
                    idx:this.mainInfo.receivableList.length>0?this.mainInfo.receivableList[this.mainInfo.receivableList.length-1].idx+1:0,
                    price:'',
                    remark:''
                });
            },
            nullifyAgreement () {
                this.prompt({
                    code: "changeNullifyView",
                    title: "请填写变更协议作废原因",
                    width:600,
                    height:360,
                    props: {
                        changeContractId:this.changeContractId,
                    },
                    callback: (flag,close) => {
                        close();
                        if(flag=="nullify"){
                            this.$api.getApiChangeList(this.contractId);
                        }
                    }
                });
            },
            save:function(){
                this.$refs['formRef'].validate((valid)=>{
                    if (valid) {
                        this.mainInfo.signedContractCode = this.mainInfo.contractCode;
                        this.mainInfo.changePay = this.changePay;
                        if(!this.mainInfo.signedContractId)
                            this.mainInfo.signedContractId =this.mainInfo.contractId;
                        if(!this.changePay){
                            this.mainInfo.receivableList=[];
                        }
                        this.request({
                            url: "/signCloud/contractChange/save.do",
                            data:this.mainInfo
                        }).then(data => {
                            this.$Message.info("内容变更已提交审核");
                            this.$api.getApiChangeList(this.contractId);
                        });
                    }else {
                        this.$Message.error({content:"信息项录入不完整，请完善后再提交审核！",duration:3});
                    }
                });
            },
            cancel () {
                this.$api.changeCacel();
            }
        }
    }
</script>

