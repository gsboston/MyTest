<style scoped>
    .container {
        background: #f6f6f6;
    }
    .panel {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 45px;
        padding: 7px;
        background: #f6f6f6;
        /*border-bottom: solid 1px #dddee1;*/
    }
    .item_name{
        border: 1px solid #59b399;
        border-radius: 4px;
        padding: 1px 0px 0px 0px;
        font-size: 12px;
        width: 30px;
        line-height: 14px;
    }
    .no-change{
        position: relative;
        width: 100%;
        height: auto;
        padding-top: 253px;
        background: #f6f6f6 url("../image/no-contract.png") center 100px no-repeat;
        background-color: white;
        text-align: center;
        font-size: 16px;
    }
    .change-red {
        width: 0;
        height: 0;
        border-top: 30px solid #FF6464;
        border-left: 30px solid transparent;
        float: right;
        margin-top: -15px;
        margin-right: 1px;
        opacity: 0.5;
    }
    .change-green {
        width: 0;
        height: 0;
        border-top: 30px solid #59b399;
        border-left: 30px solid transparent;
        float: right;
        margin-top: -15px;
        opacity: 0.5;
    }
    .change-green > span, .change-red > span{
        position: relative;
        right: 14px;
        top: -30px;
        font-size: 12px;
        color: white;
    }
    .contract-item {
        height:65px;
        border-bottom: 1px solid #e9e9e9
    }
    .contract-item.selected {
        color: #59b399 !important;
        background-color: #f6faf9 !important;
    }
    .contract-item.selected:before {
        content:"";
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 4px;
        background: #59b399;
    }
    .changeSelected{
        color: #59b399 !important;
        background-color: #f6faf9 !important;
    }
    .changeSelected:before {
        content:"";
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 4px;
        background: #59b399;
    }
    .contract-item-list{
        position: relative;
    }
    .contract-item-list.ivu-poptip{
        display: initial;
    }
    .contract-item-list >>> .ivu-poptip-rel {
        display: initial;
    }
    .contract-item-name{
        margin-bottom: 10px;
        margin-left: 10px;
        padding-top: 5px;
        font-weight: bold;
        color: #333;
        font-size: 14px;
        flex-wrap: wrap;
    }
    .selected .contract-item-name{
        color: #59b399;
        flex-wrap: wrap;
    }
    .contract-item-code{
        display: inline-block;
        width: 80px;
        margin-left: 10px;
        text-decoration: underline;
        color: #999999;
    }
    .selected .contract-item-code{
        color: #59b399;
    }
    .contract-item-service-type{
        width: 35px;
        background-color: #ffc172;
        border-radius: 4px;
        padding: 1px 5px 0px 5px;
        font-size: 12px;
        color: white;
    }
    .selected .contract-item-service-type{
        background-color: #59b399;
        color: white;
    }
</style>
<style>
    div[data-transfer="true"][x-placement="right"].ivu-poptip-popper {
        min-width: 262px;
        padding: 10px;
        left: 150px;
    }
    div[data-transfer="true"][x-placement="right"].ivu-poptip-popper .ivu-poptip-arrow {
        bottom: 5px;
        border-top-color: #f6f6f6;
    }
    div[data-transfer="true"][x-placement="right"].ivu-poptip-popper .ivu-poptip-arrow::after {
        border-top-color: rgb(246, 250, 249);
    }
    div[data-transfer="true"][x-placement="right"].ivu-poptip-popper .ivu-poptip-inner {
        background-color: rgb(246, 250, 249);
        border: 1px solid rgb(217, 217, 217);
    }
</style>

<template>
    <div class="container">

        <div class="panel">
            <Search :condition="condition" :isShowQuick="false" :isShowDate="false" @selected-contract="showSelectedContract" @contract-list="showSelectedContractList"></Search>
        </div>
        <div style="width: 200px;position: absolute;top: 45px;bottom: 0px;overflow-x: hidden;overflow-y: auto;background-color: #f6f6f6">
            <div style="padding: 15px 0 10px 0">
                <span style="font-weight: bold;font-size: 16px;margin-left: 10px">合约</span>
            </div>
            <hr style="border-top: 1px #dddee1;"/>
            <div v-if="this.contractList.length==0">
                <div style="position: absolute;top: 49%;text-align: center;width: 100%;font-size: 14px;color:#b3b3b3;">
                    <div style="text-align: center">
                        <span>输入条件搜索需要变更的合约</span>
                    </div>
                    <div style="text-align: center">
                        <span>
                            或查看
                            <span @click="getRejectingContract" style="text-decoration: underline;color: #59b399;cursor: pointer">变更中的合约</span>
                        </span>
                    </div>
                </div>
            </div>
            <div v-if="this.contractList.length>0" ref="contractQuickList">
                <div class="contract-item-list" v-for="(contractInfo, index) in contractList" :key="index">
                    <div class="contract-item" :class="{selected: contractInfo == selectedContractInfo}" @click="selectContract(contractInfo)">
                        <div class="contract-item-name">
                            <span style="display: block; white-space: nowrap; overflow: hidden;text-overflow: ellipsis;width: 180px;">{{contractInfo.contract_name}}</span>
                        </div>
                        <div class="contract-item-code">
                            <span>{{contractInfo.contract_code}}</span>
                        </div>
                        <div style="display: inline-block;width: 50px;float: right">
                            <div class="contract-item-service-type" :value="contractInfo.contract_def_code">
                                <span>{{contractInfo.item_name}}</span>
                            </div>
                        </div>
                    </div>
                    <!--<div slot="content">-->
                        <!--<div>-->
                            <!--<p>-->
                                <!--<span>甲方：</span>-->
                                <!--<span>{{contractInfo.contract_name}}</span>-->
                            <!--</p>-->
                            <!--<p>-->
                                <!--<span>合约金额：</span>-->
                                <!--<span>￥{{ contractInfo.contract_price }}</span>-->
                            <!--</p>-->
                            <!--<p>-->
                                <!--<span>签约时间：</span>-->
                                <!--<span>{{ contractInfo.signed_date }}</span>-->
                            <!--</p>-->
                        <!--</div>-->
                    <!--</div>-->
                </div>
                <Page style="margin-top: 5px" size="small" :total="contractTotal" :current="contractCurrent" @on-change="changeContractPage"></Page>
            </div>
        </div>
        <div style="position: absolute;width: 250px;left: 200px;top: 45px;bottom: 0px;overflow-x: hidden;overflow-y: auto;background-color: white;border-right: 1px solid #f6f6f6;">
            <div style="padding: 15px 0 10px 10px">
                <span style="font-size: 14px;font-weight: bold;font-size: 16px;display: inline-block;margin-left: 10px">变更记录</span>
                <div style="display: inline-block;float: right;margin-right: 10px;" v-if="this.isEditable">
                    <Poptip placement="bottom-end" width="80" trigger="hover">
                        <Icon style="color: #59b399;font-weight: bold;font-size: 24px;line-height: 24px" type="plus"></Icon>
                        <div slot="content">
                            <div>
                                <Button type="ghost" @click="addChangeContract('SUBJECT')">主体变更</Button>
                            </div>
                            <div style="margin-top: 5px">
                                <Button type="ghost" @click="addChangeContract('CONTENT')">内容变更</Button>
                            </div>
                        </div>
                    </Poptip>
                </div>
            </div>
            <hr style="border-top: 1px #dddee1;"/>
            <div v-if="this.changeList == null || this.changeList.length==0" style="position: absolute;width: 100%;top: 50%;text-align: center">
                <span style="color:#b3b3b3;font-size: 14px">该合约暂无变更记录</span>
            </div>
            <div v-if="this.changeList.length>0" ref="changeContractList" style="position: absolute;width: 100%">
                <div :class="{changeSelected: changeContractInfo == changeInfo}" @click="selectChange(changeContractInfo)" v-for="(changeContractInfo, index) in changeList" :key="index" style="color: #59b399;position: relative;height: 80px;border-bottom: 1px solid #f6f6f6;padding: 15px 0 10px 10px">
                    <div style="font-weight: bold;font-size: 14px;">
                        <span v-if="changeContractInfo.alertType=='SUBJECT'">主体变更</span>
                        <span v-if="changeContractInfo.alertType=='CONTENT'">内容变更</span>
                        <div v-if="changeContractInfo.status=='APPROVED'" class="change-green">
                            <span>过</span>
                        </div>
                        <div v-if="changeContractInfo.type=='REJECTED'" class="change-red">
                            <span>驳</span>
                        </div>
                        <div v-if="changeContractInfo.type=='CANCEL'" class="change-red">
                            <span>取</span>
                        </div>
                    </div>
                    <div style="display: inline-block;width: 150px;margin-top: 10px">
                        <span>{{changeContractInfo.code}}</span>
                    </div>
                    <div style="display: inline-block;width: 50px;margin-left: 10px">
                        <span v-if="changeContractInfo.status=='NONE'">待提交</span>
                        <span v-if="changeContractInfo.status=='REJECTING'">待审核</span>
                        <span v-if="changeContractInfo.status=='APPROVED'">已核准</span>
                        <span v-if="changeContractInfo.status=='EXECUTED'">已签署</span>
                        <span v-if="changeContractInfo.status=='INVALID'">已作废</span>
                    </div>
                    <!--<div style="display: inline-block;width: 70px;">-->
                        <!--<span v-if="changeContractInfo.status=='EXECUTED'">{{changeContractInfo.signedDate | formatDate}}</span>-->
                    <!--</div>-->
                </div>
                <Page style="margin-top: 10px" size="small" :total="changeTotal" :current="changeCurrent" @on-change="changeChangePage"></Page>
            </div>
        </div>
        <div style="position: absolute;left: 451px;right: 0px;top: 45px;bottom: 0px;overflow-x: hidden;overflow-y: auto;">
            <div v-if="this.changeType==null" class="no-change">
                <span>暂无可显示的变更内容</span>
            </div>
            <div v-if="this.changeType == 'SUBJECT' && !this.isAllowChange" class="no-change">
                <span>三方签署合约暂不支持主体变更哦！</span>
            </div>
            <SubjectChange v-else-if="this.changeType =='SUBJECT' && (changeInfo ==null || (changeInfo.status !='INVALID' && changeInfo.status !='APPROVED'))" :contractId="this.selectedContractInfo.contract_id" :changeContractId="this.changeInfo?this.changeInfo.id:''" :isEdited="this.isEdited"></SubjectChange>
            <ContentChange v-if="this.changeType =='CONTENT' && (changeInfo ==null || (changeInfo.status !='INVALID' && changeInfo.status !='APPROVED'))" :contractId="this.selectedContractInfo.contract_id" :changeContractId="this.changeInfo?this.changeInfo.id:''" :isEdited="this.isEdited"></ContentChange>
            <ChangeSignPage v-if="(this.changeType =='CONTENT' || this.changeType =='SUBJECT') && changeInfo !=null && changeInfo.status =='APPROVED'" :contractId="this.selectedContractInfo.contract_id" :changeInfo="this.changeInfo"></ChangeSignPage>
        </div>

    </div>
</template>

<script>
    import Option from "../contractSearch/SearchOption"
    import Search from "../contractSearch/contractSearch.vue";
    import ContentChange from "../change/contractChange.vue";
    import SubjectChange from "../change/newSubjectChange.vue";
    import ChangeSignPage from "../change/changeSignPage.vue";
    export default {
        data () {
            return {
                selectedContractInfo: null,
                changeInfo: null,
                changeList: [],
                contractList: [],
                changeTotal: 0,
                changeCurrent: 1,
                contractTotal: 0,
                contractCurrent: 1,
                isEdited: false,
                changeType: null,
                condition: new Option(
                    Option.addSigned(true,false,true),
                ),
                isAllowChange: true,
                isEditable: true
            }
        },
        filters: {
            wordLengthLimit : function (value) {
                if(value && value.length > 10){
                    return value.substring(0,10) + "..." ;
                }
                return value;
            },
            formatDate(value) {
                if (value) {
                    let newDate = new Date(value);
                    if (newDate) {
                        let y = newDate.getFullYear();
                        let m = newDate.getMonth() + 1;
                        m = m < 10 ? '0' + m : m;
                        let d = newDate.getDate();
                        d = d < 10 ? ('0' + d) : d;
                        return y + '/' + m + '/' + d;
                    }
                }
                return value;
            }
        },
        created: function () {
            this.$api.getApiChangeList = this.getApiChangeList;
            this.$api.changeCacel = this.changeCancel;
        },
        components: {
            Search,
            ContentChange,
            SubjectChange,
            ChangeSignPage
         },
        methods: {
            showSelectedContract (selectedContractInfo) {
//                this.selectedContractInfo = selectedContractInfo;
                var list = [selectedContractInfo];
                this.contractList = list;
                this.selectContract (selectedContractInfo);
//                this.getChangeList();
            },
            showSelectedContractList (data) {
                this.contractList = data[0];
                this.contractCurrent = data[1];
                this.contractTotal = data[2];
                if(contractList && contractList.length>0){
                    this.selectContract(contractList[0]);
                }
            },
            changeCancel () {
                this.changeType = null;
                this.changeInfo = null;
            },
            //获取变更中的合约
            getRejectingContract () {
                this.request({
                    url: "/signCloud/contractSearch/searchContractList.do",
                    data: {
                        myOwn: false,
                        searchStatus: ['SIGNED'],
                        baseStatus: ['SIGNED'],
                        invoiceStatus: null,
                        nameOrCode: "",
                        signedStartDate: "",
                        signedEndDate: "",
                        current: 1,
                        isContractOrg: true,
                        isSubjectBOrg: null,
                        isChanging: true
                    }
                }).then(items => {
                    if(items && items.records){
                        for(var i=0;i<items.records.length;i++){
                            items.records[i].item_name = items.records[i].item_name.substring(0,2);
                        }
                        this.contractList = items.records;
                        this.current = items.current;
                        this.total = items.total;
                    }
                });
            },
            //变更协议签署调用api刷新变更协议列表
            getApiChangeList(contractId){
                this.selectedContractInfo.contract_id = contractId;
                this.getChangeList();
            },
            getChangeList () {
                this.request({
                    url: "/signCloud/newContractChange/getChangeList.do",
                    data: {
                        contractId: this.selectedContractInfo.contract_id,
                    },
                    loading: false
                }).then(items => {
                    if(items){
                        this.changeList = items;
                        this.changeCurrent = items.current;
                        this.changeTotal = items.total;
                        this.selectChange(this.changeList[0]);
                    }else{
                        this.changeList = [];
                        this.changeCurrent = 1;
                        this.changeTotal = 0;
                        this.changeCancel();
                    }
                });
            },
            changeChangePage (current) {
                this.changeCurrent = current;
                this.getChangeList();
                this.$refs.changeContractList.scrollTop = 0;
            },
            changeContractPage (current) {
                this.contractCurrent = current;
            },
            addChangeContract (changeType) {
                if(this.selectedContractInfo && this.selectedContractInfo.contract_id){
                    this.$set(this,"changeType",null);
                    this.request({
                        url: '/signCloud/contractSubjectChange/subjectsAndSignedInfo.do',
                        param: {
                            id: this.selectedContractInfo.contract_id
                        }
                    }).then(data => {
                        this.isAllowChange = true;
                        if (data.subjectList) {
                            if (data.subjectList.length > 2) {
                                this.isAllowChange = false;
                            }
                        }
                        this.$nextTick(function () {
                            this.$set(this,"changeType",changeType);
                            if(this.isEditable){
                                this.$set(this,"isEdited",true);
                            }else{
                                this.$set(this,"isEdited",false);
                            }
                            this.$set(this,"changeInfo",null);
                        });
                    });
                }else{
                    this.$Message.info("请先选择合约，再新增变更协议！");
                }
            },
            selectChange (selectedChangeInfo) {
                this.$set(this,"changeType",null);
                this.$nextTick(function () {
                    this.changeInfo = selectedChangeInfo;
                    this.$set(this,"changeType",this.changeInfo.alertType);
                });
                if(selectedChangeInfo.status == "NONE"){
                    if(this.isEditable){
                        this.$set(this,"isEdited",true);
                    }else{
                        this.$set(this,"isEdited",false);
                    }
                }else{
                    this.$set(this,"isEdited",false);
                }
            },
            selectContract (contractInfo) {
                this.selectedContractInfo = contractInfo;
                var userId = window.Context.getCurrentUser().id;
                var orgId = window.Context.getCurrentOrganization().id;
                if(contractInfo.org_id == orgId || userId == contractInfo.creator){
                    this.isEditable = true;
                }else{
                    this.isEditable = false;
                }
                this.getChangeList();
            },
        },
    }
</script>