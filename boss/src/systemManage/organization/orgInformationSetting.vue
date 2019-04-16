<style scoped>
    .container{
        padding: 40px 90px 20px 45px;
    }
    .rule-head{
        font-size: 14px;
    }
    .container >>> .ivu-tooltip-inner {
        white-space: normal;
        min-width: 180px;
    }
    .rule-content{
        margin-top: 20px;
    }
    .rule-list{
        border: 1px solid #e5e5e5;
    }
    .rule-list >>> .ivu-switch-checked{
        border-color: #59b399;
        background-color: #59b399;
    }
    .rule-list-head{
        height: 45px;
        font-size: 14px;
        line-height: 45px;
        background-color: #f8f8f9;
    }
    .rule-list-content{
        cursor: pointer;
        height: 45px;
        font-size: 14px;
        line-height: 45px;
        border-top: 1px solid #e5e5e5;
    }
    .rule-list-type{
        text-align: center;
    }
    .rule-list-type-title{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 45px;
        line-height: 15px;
    }
    .rule-list-state{
        text-align: center;
        border-left: 1px solid #e5e5e5;
    }
    .active{
        background-color: #F6FAF9;
    }
    .rule-info{
        width: 100%;
    }
    .rule-info-list{
        margin-top: 20px;
    }
    .rule-info-list-head{
        height: 40px;
        font-size: 14px;
        line-height: 40px;
        text-align: center;
        background-color: #f8f8f9;
    }
    .rule-info-list-content{
        padding: 10px 2px;
        height: 65px;
        line-height: 50px;
        text-align: center;
        border-bottom: 1px solid #e5e5e5;
    }
    .rule-limit-info >>> .ivu-col-span-22,.rule-limit-info >>> .ivu-col-span-14,.rule-limit-info >>> .ivu-col-span-8,.rule-limit-info >>> .ivu-col-span-7,
    .rule-limit-info >>> .ivu-col-span-6,.rule-limit-info >>> .ivu-col-span-5,.rule-limit-info >>> .ivu-col-span-3{
        padding-left: 5px !important;
        padding-right: 0 !important;
    }
    .rule-limit-info >>> .ivu-col-span-2{
        padding-left: 0 !important;
        padding-right: 0 !important;
    }
    .rule-limit-info >>> .ivu-input{
        border-top: 0;
        border-left: 0;
        border-right: 0;
        border-radius: 0;
    }
    .rule-title{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50px;
        line-height: 20px;
    }
    .rule-info-list >>> .ivu-form-item{
        margin-bottom: 0;
    }
    .rule-info-list >>> .ivu-form-item-content{
        line-height: 50px;
    }
    .rule-info-list >>> .ivu-form-item-error-tip{
        position: relative;
        padding-top: 0;
    }
</style>
<template>
    <div class="container">
        <div class="rule-head">
            <div style="display: inline-block;font-weight: bold">
                <span>合约自动审核规则设置</span>
            </div>
            <!--<div style="display: inline-block;position: absolute;right: 90px">-->
                <!--<span>合约自动审核总开关：</span>-->
                <!--<span style="color: #59b399;">{{this.selectedRule.sysIsEnable?"开启":"关闭"}}</span>-->
                <!--<Tooltip placement="bottom">-->
                    <!--<Icon style="font-size: 18px" type="ios-help-outline"></Icon>-->
                    <!--<div slot="content">-->
                        <!--<div>合约自动审核总开关开启时，本组织合约自动审核规则生效；</div>-->
                        <!--<div>合约自动审核总开关关闭时，本组织合约自动审核的规则不生效</div>-->
                    <!--</div>-->
                <!--</Tooltip>-->
            <!--</div>-->
        </div>
        <div class="rule-content">
            <Row :gutter="24">
                <i-col span="6">
                    <div class="rule-list">
                        <div class="rule-list-head">
                            <i-col span="16" style="padding: 0 2px">
                                <div class="rule-list-type"><span>合约类型</span></div>
                            </i-col>
                            <i-col span="8" style="padding: 0 2px">
                                <div class="rule-list-state"><span>状态</span></div>
                            </i-col>
                        </div>
                        <div v-for="(item,index) in rulesList" :class="{active:item.contractDefId == selectedRule.contractDefId}" class="rule-list-content" @click.self="selectRule(item)">
                            <i-col span="16" @click.self="selectRule(item)" style="padding: 0 2px">
                                <div @click.self="selectRule(item)" class="rule-list-type rule-list-type-title" :title="item.contractDefName"><span @click.self="selectRule(item)">{{item.contractDefName}}</span></div>
                            </i-col>
                            <i-col span="8" @click.self="selectRule(item)" style="padding: 0 2px">
                                <div @click.self="selectRule(item)" class="rule-list-state">
                                    <i-switch v-model="item.isEnable" @on-change="changeOpenSwitch" :disabled="!(item.contractDefId == selectedRule.contractDefId && item.sysIsEnable)"></i-switch>
                                </div>
                            </i-col>
                        </div>
                    </div>
                </i-col>
                <i-col span="18">
                    <div class="rule-info">
                        <div style="line-height: 20px;padding-top: 20px">
                            <div style="font-size: 14px;height: 24px"><span>合约自动审核规则设置（如无限制则不启用）：</span></div>
                            <div style="height: 24px;"><span>说明：规则启用时生效，不启用则不生效；符合自动审核规则的合同提交后直接为“已审核”状态，不符合自动审核规则的需要提交人工审核。</span></div>
                            <div v-if="!selectedRule.sysIsEnable" style="height: 24px;">
                                <span style="color: red;font-size: 22px;line-height: 22px;vertical-align: text-top;">*</span>
                                <span style="color: red;">系统管理员已关闭此合约类型自动审核功能</span>
                            </div>
                        </div>
                        <div class="rule-info-list">
                            <Form class="invoice-form" ref="ruleInfoListForm" :model="ruleInfoListForm" :label-width="0" :rules="ruleValidate">
                                <div class="rule-info-list-head">
                                    <i-col span="2">
                                        <div><span>启用</span></div>
                                    </i-col>
                                    <i-col span="6">
                                        <div><span>规则名称</span></div>
                                    </i-col>
                                    <i-col span="4">
                                        <div><span>限制条件</span></div>
                                    </i-col>
                                    <i-col span="12">
                                        <div><span>规则内容（合约符合以下条件时可通过审核）</span></div>
                                    </i-col>
                                </div>
                                <div class="rule-info-list-content" v-for="(ruleInfoItem,index) in ruleInfoListForm.ruleInfoList">
                                    <i-col span="2">
                                        <FormItem label="">
                                            <div><Checkbox v-model="ruleInfoItem.isEnable"></Checkbox></div>
                                        </FormItem>
                                    </i-col>
                                    <i-col span="6">
                                        <FormItem label="">
                                            <div class="rule-title"><span>{{ruleInfoItem.title}}</span></div>
                                        </FormItem>
                                    </i-col>
                                    <i-col span="4">
                                        <div>
                                            <FormItem label="" :prop="'ruleInfoList[' + index + '].limitCondition'" :rules="{required: ruleInfoItem.isEnable, message: '限制条件不能为空', trigger: 'change'}">
                                                <Select size="small" v-model="ruleInfoItem.limitCondition" @on-change="changeCondition(ruleInfoItem)">
                                                    <Option v-for="limitConditionItem in ruleInfoListForm.ruleInfoList[index].limitConditionList" :value="limitConditionItem.value" :key="limitConditionItem.value">{{limitConditionItem.name}}</Option>
                                                </Select>
                                            </FormItem>
                                        </div>
                                    </i-col>
                                    <i-col span="12">
                                        <div class="rule-limit-info">
                                            <i-col span="7">
                                                <span>{{ruleInfoItem.describe}} {{ruleInfoItem.limitConditionName}}</span>
                                            </i-col>
                                            <i-col :span="ruleInfoItem.limitCondition && ruleInfoItem.limitCondition == 'range' ? 6:14">
                                                <FormItem label="" :prop="'ruleInfoList[' + index + '].values1'" :rules="{required: ruleInfoItem.isEnable, message: '不能为空', trigger: 'blur'}">
                                                    <Input v-model="ruleInfoItem.values1"></Input>
                                                </FormItem>
                                            </i-col>
                                            <i-col v-if="ruleInfoItem.limitCondition && ruleInfoItem.limitCondition == 'range'" span="8">
                                                <FormItem label="" :prop="'ruleInfoList[' + index + '].values2'" :rules="{required: ruleInfoItem.isEnable, message: '不能为空', trigger: 'blur'}">
                                                    <i-col span="2"><span>~</span></i-col>
                                                    <i-col span="22"><Input v-model="ruleInfoItem.values2"></Input></i-col>
                                                </FormItem>
                                            </i-col>
                                            <i-col span="3">
                                                <span>{{ruleInfoItem.unit}}</span>
                                            </i-col>
                                        </div>
                                    </i-col>
                                </div>

                            </Form>
                        </div>
                        <div style="text-align: center;margin-top: 20px" v-if="this.selectedRule.isEnable">
                            <Button type="primary" @click="saveRuleInfoList">保存</Button>
                        </div>
                    </div>
                </i-col>
            </Row>
        </div>
    </div>
</template>
<script>
    import ICol from "../../../node_modules/iview/src/components/grid/col.vue";

    export default {
        components: {ICol},
        filters: {
            wordLengthLimit12 : function (value) {
                if(value && value.length > 12){
                    return value.substring(0,12) + "..." ;
                }
                return value;
            },
        },
        created: function () {
            this.getRuleList();
        },
        data () {
            return {
                isInit: true,
                ruleInfoListForm: {
                    ruleInfoList: [
                        {
                            isEnable: false,
                            title: "",
                            limitCondition: null,
                            values1: "",
                            values2: "",
                            limitConditionList: []
                        }
                    ],
                },
                ruleValidate: {},
                rulesList: [],
                selectedRule: {},
//                ruleInfoList: [
////                    {title:"一般纳税人",limitCondition:"greater",type:"数字",remark:"合同字段",isEnable:false},
////                    {title:"小规模纳税人",limitCondition:"greater",type:"数字",remark:"合同字段",isEnable:false},
////                    {title:"所得税年报网上申报并提交报表",limitCondition:"greater",type:"文本",remark:"合同字段",isEnable:false},
////                    {title:"账册等会计档案保管",limitCondition:"greater",type:"数字",remark:"合同字段",isEnable:false},
//                ],
            }
        },
        methods: {
            getRuleList () {
                var vm = this;
                this.request({
                    url: "/systemManage/orgInformationSetting/getRulesList.do",
                }).then((data) => {
                    if(data){
                        vm.rulesList = data;
                        if(vm.isInit){
                            vm.selectRule(vm.rulesList[0]);
                            vm.isInit = false;
                        }
                    }else{
                        vm.rulesList = [];
                    }
                });
            },
            changeOpenSwitch (val) {
                this.$set(this.selectedRule,"isEnable",val);
                this.request({
                    url: "/systemManage/orgInformationSetting/changeOpenSwitch.do",
                    param: {
                        contractDefId: this.selectedRule.contractDefId,
                        check: val,
                    }
                }).then((data) => {

                });
            },
            selectRule (item) {
                var vm = this;
                if(vm.selectedRule.contractDefId){
                    this.request({
                        url: "/systemManage/orgInformationSetting/getRuleInfoList.do",
                        param: {
                            contractDefId: vm.selectedRule.contractDefId
                        }
                    }).then((data) => {
                        if(data && data.length > 0){
                            var flag = false;
                            for(var i=0;i<data.length;i++){
                                if(data[i].isEnable){
                                    flag = true;
                                    break;
                                }
                            }
                            if(flag){
                                vm.selectedRule = item;
                                vm.getRuleInfoList(item.contractDefId);
                            }else{
                                vm.$set(vm.selectedRule,"isEnable",false);
                                vm.request({
                                    url: "/systemManage/orgInformationSetting/changeOpenSwitch.do",
                                    param: {
                                        contractDefId: vm.selectedRule.contractDefId,
                                        check: false,
                                    }
                                }).then((data) => {
                                    vm.selectedRule = item;
                                    vm.getRuleInfoList(item.contractDefId);
                                });
                            }
                        }else{
                            vm.$set(vm.selectedRule,"isEnable",false);
                            vm.request({
                                url: "/systemManage/orgInformationSetting/changeOpenSwitch.do",
                                param: {
                                    contractDefId: vm.selectedRule.contractDefId,
                                    check: false,
                                }
                            }).then((data) => {
                                vm.selectedRule = item;
                                vm.getRuleInfoList(item.contractDefId);
                            });
                        }
                    });
                }else{
                    vm.selectedRule = item;
                    vm.getRuleInfoList(item.contractDefId);
                }
            },
            getRuleInfoList (contractDefId) {
                var vm = this;
                this.request({
                    url: "/systemManage/orgInformationSetting/getRuleInfoList.do",
                    param: {
                        contractDefId: contractDefId
                    }
                }).then((data) => {
                    if(data){
                        data.forEach(item=>{
                            item.limitConditionList = [
                                {value:"greaterThan",name:"大于"},
                                {value:"greaterThanEquals",name:"大于等于"},
                                {value:"lessThan",name:"小于"},
                                {value:"lessThanEquals",name:"小于等于"},
                                {value:"equals",name:"等于"},
                                {value:"unequals",name:"不等于"},
                                {value:"range",name:"介于"}
                            ];
                            if(item.limitConditionList){
                                this.changeCondition (item);
                            }else{
                                item.limitConditionName = "";
                            }
                        })
                        vm.$set(vm.ruleInfoListForm,"ruleInfoList",data);
                    }else{
                        this.$Message.error("该合约无自动审核定义！");
                        vm.ruleInfoListForm.ruleInfoList = [];
                    }
                }
//                , error => {
////                    this.$Message.error(error.message);
//                    vm.ruleInfoListForm.ruleInfoList = [];
//                }
                );
            },
            saveRuleInfoList () {
                var vm = this;
                var flag = false;
                for(var i=0;i<vm.ruleInfoListForm.ruleInfoList.length;i++){
                    if(vm.ruleInfoListForm.ruleInfoList[i].isEnable){
                        flag = true;
                        break;
                    }
                }
                if(!flag){
                    vm.$Message.error("请选择要保存的审核规则！");
                    return;
                }
                vm.$refs['ruleInfoListForm'].validate(valid => {
                    if (valid) {
                        this.request({
                            url: "/systemManage/orgInformationSetting/saveRuleInfoList.do",
                            data: vm.ruleInfoListForm
                        }).then((data) => {
                            vm.$Message.info("保存完成！");
                        });
                    }else{
                        return;
                    }
                });
            },
            changeCondition (ruleInfoItem) {
                if(ruleInfoItem.limitCondition == "greaterThan"){
                    ruleInfoItem.limitConditionName = "大于";
                }else if(ruleInfoItem.limitCondition == "greaterThanEquals"){
                    ruleInfoItem.limitConditionName = "大于等于";
                }else if(ruleInfoItem.limitCondition == "lessThan"){
                    ruleInfoItem.limitConditionName = "小于";
                }else if(ruleInfoItem.limitCondition == "lessThanEquals"){
                    ruleInfoItem.limitConditionName = "小于等于";
                }else if(ruleInfoItem.limitCondition == "equals"){
                    ruleInfoItem.limitConditionName = "等于";
                }else if(ruleInfoItem.limitCondition == "unequals"){
                    ruleInfoItem.limitConditionName = "不等于";
                }else if(ruleInfoItem.limitCondition == "range"){
                    ruleInfoItem.limitConditionName = "介于";
                }
            }
        }
    }
</script>