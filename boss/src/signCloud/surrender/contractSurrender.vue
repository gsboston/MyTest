<style scoped>
    .content{
        position: relative;
        width: 920px;
        margin: 0 auto;
        background-color: white;
        top:45px;
        padding-bottom: 45px;
    }
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
        background: white;
        border-bottom: solid 1px #dddee1;
    }
    .item_name{
        border: 1px solid #59b399;
        border-radius: 4px;
        padding: 1px 0px 0px 0px;
        font-size: 12px;
        width: 30px;
        line-height: 14px;
    }
    .original-part-title{
        font-size: 18px;
        font-weight: 700;
        padding-left: 25px;
        padding-bottom: 10px;
        color: #59b399;
    }
    .original-content{
        padding: 20px 65px 40px 15px;
        position: relative;
        width: 100%;
        background-color: white;
        box-shadow: 0 2px 3px 0 rgba(175, 175, 175, 0.55);
    }
    .original-part-content{
        display: flex;
        display: -ms-flex;
        background-color: #f6faf9;
        margin-left: 40px;
        padding-right: 20px;
        padding: 20px 40px 20px 40px;
    }

    .contract-info {
        width:100%;
        flex: 1;
        -ms-flex: 1;
        padding: 20px 0;
    }
    .contract-info-table {
        width: 100%;
        display: table;
    }
    .contract-info-table-tr {
        display: table-row;
    }
    .contract-info-table-td {
        padding-top: 20px;
        display: table-cell; height: 100%;
    }
    .contract-info-row {
        display: table-row;
    }
    .contract-info-row > div {
        display: table-cell;
        padding-top: 20px;
    }

    .sub-table{
        width: 100%;height: 100%;display: table;
    }
    .sub-table-tr{
        display: table-row; height: 100%;
    }
    .sub-table-td{
        display: table-cell; height: 100%;text-align: left;
    }


    .contract-info-row-title {
    }
    .contract-info-row-title > div {
    }
    .contract-img {
        position: relative;
        width: 170px;
        height: 222px;
        background-image: url("../contract/image/contract-bg.png");
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;
        cursor: pointer;
    }
    .contract-img:hover{
        -webkit-box-shadow: #59b399 0px 0px 10px;
        -moz-box-shadow: #59b399 0px 0px 10px;
        box-shadow: #59b399 0px 0px 10px;
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

    .contract-sign-black {
        position: absolute;
        top: 20px;
        left: 0;
        width: 60px;
        height: 28px;
        line-height: 28px;
        background: rgb(152, 156, 156);
        box-shadow: 0 0 4px 0 rgba(197, 201, 201, 0.3);
        color: white;
        text-align: center;
        border-top-right-radius: 14px;
        border-bottom-right-radius: 14px;
        font-weight: bold;
        font-size: 14px;
    }
    .original-part-content{
        display: flex;
        display: -ms-flex;
        background-color: #f6faf9;
        margin-left: 40px;
        margin-right: 40px;
        padding-right: 20px;
        padding: 20px 40px 20px 40px;
    }
    .title {
        font-size: 18px;
        padding-left: 10px;
        padding-bottom: 10px;
        padding-top: 10px;
        margin-top: 15px;
        margin-bottom: 15px;
        line-height: 1;
        font-weight: bold;
        color: #aaa;
        background: #FFFFFF;
    }
    .contract-info-xy a{
        color: rgb(89,179,153);
        font-weight: bolder;
        word-break: keep-all;
    }
</style>
<template>
    <div class="container">
        <div class="panel">
            <Select @on-change="selectTab" v-model="selectedData"  style="width: 100px">
                <Option :value="1" selected="selected">发起解约</Option>
                <Option :value="2" >已解约</Option>
            </Select>

            <!--<Button size="small" style="width: 70px" :type="selectedTab==1?'default':'ghost'"  @click="selectTab(1)">-->
                <!--<span>发起解约</span>-->
            <!--</Button>-->
            <!--<Button size="small" style="width: 70px" :type="selectedTab==2?'default':'ghost'"  @click="selectTab(2)">-->
                <!--<span>已解约</span>-->
            <!--</Button>-->
            <!--<Search :condition="condition" @selected-contract="showSelectedContract" :isShowDate="true"  style="display: inline-block;margin-left: 20px"></Search>-->
            <Search ref="defaultSearch" :isShowQuick="false" v-if="selectedTab==1" :condition="condition" @selected-contract="showSelectedContract" :isShowDate="true"  style="display: inline-block;margin-left: 20px">
            </Search>
            <Search :isShowQuick="false" v-if="selectedTab==2" :condition="condition" @selected-contract="showSelectedContract" :isShowDate="true"  style="display: inline-block;margin-left: 20px"></Search>
            <!--<div v-if="this.contractInfo" style="display: inline-block" >-->
                <!--<div style="display: inline-flex;color: #59b399">-->
                    <!--<span>名称:{{this.contractInfo.contract_name}}</span>-->
                    <!--<span style="margin-left: 10px">合约编号:{{this.contractInfo.contract_code}}</span>-->
                    <!--<span style="margin-left: 10px">金额:￥{{this.contractInfo.contract_price}}</span>-->
                    <!--<div class="item_name" style="margin-left: 10px">-->
                        <!--<span>{{this.contractInfo.item_name}}</span>-->
                    <!--</div>-->
                    <!--<span style="margin-left: 10px">业务员:{{this.contractInfo.salesman_name}}</span>-->
                <!--</div>-->
            <!--</div>-->
        </div>
        <div class="content" v-if="selectedTab==1">
            <div v-if="contractId!=''">
                <Termination ref="termination" :contract="contractInfo" :isEditable="this.editable"></Termination>
            </div>
            <div class="original-content" v-if="contractId!=''" >
                <div class="original-part-title">解约发票处理</div>
                <div style="margin-top: 10px; margin-left: 50px; font-size: 13px;">
                    <Checkbox v-model="editInvoice">需要进行发票处理</Checkbox>
                </div>
                <component v-if="editInvoice" is="InvoiceView" ref="invoice" :isEditable="selectedTab==1" :agreementId="contractId" :B030602="true" :B030603="true" :isTermination="true"></component>
            </div>
            <div class="original-content" style="text-align: center;" v-if="contractId!=''&&selectedTab==1">
                <i-button v-if="this.editable" type="ghost" size="large" class="save-button" @click="submitTermination">确认解除当前合约</i-button>
            </div>
        </div>
        <div class="content" v-if="selectedTab==2&&contractId!=''">
            <Row style="background: #f6f6f6">
                <div class="title">已解约</div>
            </Row>
            <br>
            <Row>
                <div class="original-part-title">解约信息</div>
            </Row>
            <Row>
                <div >
                    <div class="original-part-content" style="background:#f6faf9">
                        <div>
                            <div class="contract-img" @click="preview" style="margin-right: 60px;">
                                <div class="contract-sign-black">
                                    <span>已解约</span>
                                </div>
                            </div>
                        </div>
                        <div class="contract-info">
                            <div class="contract-info-table" style="padding-top: 0px; display: table;">
                                <div class="contract-info-table-tr">
                                    <div class="contract-info-table-td">
                                        <div class="sub-table">
                                            <div class="sub-table-tr">
                                                <div class="sub-table-td" style="text-align: left;font-size: 14px; color: #888888;width: 22%;">甲　　方：</div>
                                                <div class="sub-table-td" style="text-align: left;font-size: 14px; color: #101010;width: 78%;">{{contractInfo.contract_name}}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="contract-info-table-tr">
                                    <div class="contract-info-table-td">
                                        <div class="sub-table">
                                            <div class="sub-table-tr">
                                                <div class="sub-table-td" style="text-align: left; width: 120px; font-size: 14px; color: #888888;width: 22%;">原合约编号：</div>
                                                <div class="sub-table-td" style="font-size: 14px; color: #101010;width: 78%;">{{contractInfo.contract_code}}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="contract-info-table-tr">
                                    <div class="contract-info-table-td">
                                        <div class="sub-table">
                                            <div class="sub-table-tr">
                                                <div class="sub-table-td" style="text-align: left; font-size: 14px; color: #888888;width: 22%;">原签约时间：</div>
                                                <div class="sub-table-td" style="font-size: 14px; color: #101010;width: 78%;">{{contractInfo.signed_date}}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="contract-info-table-tr">
                                    <div class="contract-info-table-td">
                                        <div class="sub-table">
                                            <div class="sub-table-tr">
                                                <div class="sub-table-td" style="text-align: left; font-size: 14px; color: #888888;width: 22%;">解约签署时间：</div>
                                                <div class="sub-table-td" style="font-size: 14px; color: #101010;width: 78%;">{{surrenderInfo.signDateFormat}}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="contract-info-table-tr">
                                    <div class="contract-info-table-td">
                                        <div class="sub-table">
                                            <div class="sub-table-tr">
                                                <div class="sub-table-td" style="text-align: left; width: 120px; font-size: 14px; color: #888888;width: 22%;">合约结算金额：</div>
                                                <div class="sub-table-td" style="font-size: 14px; color: #101010;width: 78%;">￥{{surrenderInfo.settlementPrice}}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!--<div class="contract-info-row">-->
                                    <!--<div class="" style="text-align: right;font-size: 14px; color: #5D5D5D;">甲　　方：</div>-->
                                    <!--<div class="">-->
                                        <!--<div class="sub-table">-->
                                            <!--<div class="sub-table-tr">-->
                                                <!--<div class="sub-table-td" style="text-align: right;font-size: 14px; color: #5D5D5D;width: 100%">{{contractInfo.contract_name}}</div>-->
                                            <!--</div>-->
                                        <!--</div>-->
                                    <!--</div>-->
                                <!--</div>-->
                                <!--<div class="contract-info-row">-->
                                    <!--<div style="text-align: right; width: 120px; font-size: 14px; color: #b3b3b3;">原合约编号：</div>-->
                                    <!--<div style="font-size: 14px; color: #b3b3b3;">{{contractInfo.contract_code}}</div>-->
                                <!--</div>-->
                                <!--<div class="contract-info-row">-->
                                    <!--<div style="text-align: right; width: 120px; font-size: 14px; color: #5D5D5D;">解约签署时间：</div>-->
                                    <!--<div style="font-size: 14px; color: #5D5D5D;">{{surrenderInfo.signDateFormat}}</div>-->
                                    <!--<div style="text-align: right; width: 100px; font-size: 14px; color: #b3b3b3;">原签约时间：</div>-->
                                    <!--<div style="padding-left: 30px; font-size: 14px; color: #b3b3b3;">{{contractInfo.signed_date}}</div>-->
                                <!--</div>-->
                                <!--<div class="contract-info-row">-->
                                    <!--<div style="text-align: right; width: 120px; font-size: 14px; color: #5D5D5D;">合约结算金额：</div>-->
                                    <!--<div style="font-size: 14px; color: #5D5D5D;">￥{{surrenderInfo.settlementPrice}}</div>-->
                                <!--</div>-->
                            </div>
                        </div>
                        <div class="contract-info-xy" v-if="surrenderInfo.attachmentId">
                            <a @click="openXY">解约协议</a>
                        </div>
                    </div>
                </div>
            </Row>
        </div>

    </div>
</template>

<script type="text/babel">
    import Option from "../contractSearch/SearchOption"
    import Search from "../contractSearch/contractSearch.vue";
    import Termination from "../contractDetails/termination.vue";
    import InvoiceView from "../invoice/invoiceView.vue";
    export default {
        components: {
            Search,
            Termination,
            InvoiceView
        },

        props: {
        },
        data () {
            return {
                editable: false,
                flag:true,
                selectedData:1,
                editInvoice:false,
                contractId: "",
                contractInfo: null,
                contractList: [],
                selectedTab:1,
                surrenderInfo:{},
                contractElseInfo:{},
                condition:new Option(Option.addSigned(true,false,true))
            }
        },
        created: function () {

        },
        mounted:function(){
            this.$refs['defaultSearch'].openacquiescence();
        },
        methods: {
            loadSurrenderInfo(){
                this.request({
                    url: '/signCloud/contractTermination/info.do',
                    param: {
                        id: this.contractId
                    }
                }).then(data => {
                    if(data&&data.id){
                        this.surrenderInfo = data;
                    }
                });
            },
            showSelectedContract:function(contract){
                this.contractInfo = contract;
                var userId = window.Context.getCurrentUser().id;
                var orgId = window.Context.getCurrentOrganization().id;
                if(contract.org_id == orgId || contract.creator == userId){
                    this.editable = true;
                }
                this.contractId = contract.contract_id;
                if(this.selectedTab ==1){
                    this.$nextTick( ()=> {
                        this.$refs['termination'].refresh();
                        this.$refs['termination'].mainInfo = {
                            contractId: this.contractId,
                            paymentProcess: "RETURN",
                            mode: "CASH",
                            amount: 0.00
                        };
                    });
                }else{
                    this.loadSurrenderInfo();
                    this.getContractElseInfo();
                }
            },
            getContractElseInfo(){
                this.request({
                    url: '/signCloud/contractView/getContractById.do',
                    param: {
                        id: this.contractId
                    }
                }).then((contractElseData) => {
                    this.contractElseInfo = contractElseData;
                });
            },
            selectTab(index){
                if(this.flag){
                    this.selectedTab = 0;
                    this.contractInfo = null;
                    this.contractId = '';
                    this.$nextTick(function () {
                        this.selectedTab = index;
                        if(index ==2)
                            this.condition = new Option(Option.addTermination(true,false,true));
                        else
                            this.condition = new Option(Option.addSigned(true,false,true));
                    });
                }else{
                    this.flag = true;
                }

            },
            submitTermination(){
                this.$refs['termination'].checkTerminationData().then((vaild)=>{
                    if(vaild){
                        var terminationData = this.$refs['termination'].getTerminationData();
                        var mainInfo = terminationData;
                        if(this.editInvoice){
                            var invoiceList = this.$refs['invoice'].handleGetInvoiceInfo();
                            mainInfo.hedges = invoiceList.hedgeInvoiceList;
                            mainInfo.invalidateds = invoiceList.invalidatedInvoiceList;
                            mainInfo.normals = invoiceList.newInvoiceList;
                        }
                        this.submit(mainInfo);
                    }
                });
            },
            submit(data){
                this.request({
                    url: "/signCloud/contract/terminationSubmit.do",
                    data: data
                }).then(data => {
                    this.$Message.success('合约已解除！');
                    this.flag = false;
                    this.selectedTab =2;
                    this.selectedData =2;
                    this.loadSurrenderInfo();
                    this.getContractElseInfo();
                });
            },
            preview: function () {
                if (this.contractElseInfo.signedFile) {
                    window.open('/ossController/oss/file.do?id=' + this.contractElseInfo.signedFile);
                }else {
                    if (this.contractElseInfo.unsignedFile) {
                        window.open('/ossController/oss/file.do?id=' + this.contractElseInfo.unsignedFile);
                    }else {
                        this.$Message.error('没有合同文件！');
                    }
                }
            },
            openXY(){
                if (this.surrenderInfo.attachmentId) {
                    window.open('/ossController/oss/file.do?id=' + this.surrenderInfo.attachmentId);
                }else {
                    this.$Message.error('没有合同文件！');
                }
            }
        }
    };
</script>
