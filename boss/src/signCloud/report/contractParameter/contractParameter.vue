<style scoped>
    .container{
        height: 100%;
        padding: 15px 45px;
        overflow-y: auto;
        overflow-x: hidden;
        background-color: #f6f6f6;
    }
    .contract-external{
        padding: 12px 5px;
        width: 100%;
        background-color: #fff;
        height: 285px;
        overflow: hidden;
    }
    .contract-head-left{
        font-size: 16px;
        font-weight: bold;
        color: #a1a1a1;
    }
    .contract-head-right{
        text-align: right;
        font-size: 14px;
        color: #bbbbbb;
        float: right;
        width: 200px;
    }
    .contract-head-right >>> .ivu-input{
        border-top: 0px;
        border-left: 0px;
        border-right: 0px;
        border-radius: 0px;
    }
    .contract-middle{
        padding-top: 10px;
        padding-left: 0px !important;
        padding-right: 0px !important;
    }
    .contract-num:hover{
        background-color: #F6FAF9;
        color: #59b399 !important;
    }
    .contract-middle .contract-price:hover .contract-num-content, .contract-middle .contract-price:hover .total-amount-title{
        background-color: #F6FAF9;
    }
    .contract-num{
        height: 115px;
        background-color: #59b399;
        color: #ffffff;
        cursor: pointer;
    }
    .contract-num-title{
        text-align: center;
        font-size: 14px;
        padding-top: 15px;
    }
    .contract-num-content{
        text-align: center;
        font-size: 42px;
    }
    .contract-price{
        height: 115px;
    }
    .total-amount-title {
        padding-top: 15px;
        text-align: center;
        font-size: 14px;
        color: #a1a1a1;
    }
    .receivable-total-amount-content{
        padding-top: 15px;
        text-align: center;
        font-size: 28px;
        color: #5d5d5d;
    }
    .paid-total-amount-content{
        padding-top: 15px;
        text-align: center;
        font-size: 28px;
        color: #59b399;
    }
    .need-total-amount-content{
        padding-top: 15px;
        text-align: center;
        font-size: 28px;
        color: #f28390;
    }
    .invoiceStateGauge{
        width: 260px;
        height: 150px;
    }
    .vertical-before:before{
        content: "";
        position: absolute;
        top: 21px;
        left: 0;
        bottom: 21px;
        width: 1px;
        background: #e5e5e5;
    }
    .hover-css{
       cursor: pointer;
    }
    .hover-css:hover .total-amount-title, .hover-css:hover .receivable-total-amount-content{
        background-color: #F6FAF9;
    }
    .list-name{
        background-color: #fff;
        height: 50px;
        width: 100%;
        margin-top: 20px;
        font-size: 14px;
        color: #a1a1a1;
        padding-left: 20px;
        line-height: 50px;
    }
    .search-text{
        width: 200px;
    }
    .search-text >>> .ivu-input-icon{
        font-size: 22px;
        color: #59b399;
    }
    .list-head{
        height: 55px;
        width: 100%;
        font-size: 14px;
        color: #5d5d5d;
        line-height: 55px;
        padding-left: 10px;
        padding-right: 10px;
        overflow: auto;
    }
    .contract-type{
        background-color: #FFF;
        border: 1px solid #54B499;
        border-radius: 10px;
        padding: 2px 15px;
        color: #54B499;
        font-size: 12px;
        line-height: initial;
        vertical-align: initial;
    }
    .list-date{
        text-align: center;
        width: 80px;
        display: inline-block;
    }
    .list-column-120{
        text-align: center;
        display: inline-block;
        width: 120px;
    }
    .list-column-150{
        text-align: center;
        width: 150px;
        display: inline-block;
    }
    .list-column-right{
        display: inline-block;
        float: right;
    }
    .no-contract{
        position: absolute;
        width: 300px;
        height: 230px;
        top: 370px;
        left: 50%;
        transform: translateX(-260px);
        background: #f6f6f6 url("../../image/no-contract.png") center 100px no-repeat;
        text-align: center;
        font-size: 16px;
    }
    .no-contract > span{
        position: relative;
        color: #b3b3b3;
        font-size: 14px;
        top: 150px;
        left: 180px;
    }
    .invoice-price{
        text-align: right;
        border-left: 2px solid #f2f2f2;
        border-right: 2px solid #f2f2f2;
        padding-right: 10px;
    }
</style>
<template>
    <div class="container">
        <Row :gutter="8">
            <!-- 正式合约情况统计 -->
            <i-col span="14">
                <div class="contract-external">
                    <div>
                        <span class="contract-head-left">正式合约情况统计</span>
                        <DatePicker class="contract-head-right" type="daterange" placement="bottom-end" placeholder="签约时间" @on-change="changeDateRange"></DatePicker>
                    </div>
                    <div>
                        <i-col span="8" class="contract-middle">
                            <div class="contract-num" @click="showFormalList('formal')">
                                <div class="contract-num-title">
                                    <span>合约数</span>
                                </div>
                                <div class="contract-num-content">
                                    <span>{{this.signedContractReport.contract_num}}</span>
                                </div>
                            </div>
                        </i-col>
                        <i-col span="16" style="padding-top: 2px">
                            <div class="contract-price">
                                <div class="total-amount-title">
                                    <span>应收总额</span>
                                </div>
                                <div class="receivable-total-amount-content" :title="'￥' + this.signedContractReport.receivable_price">
                                    <span>￥{{this.signedContractReport.receivable_price | formatPrice}}</span>
                                </div>
                            </div>
                        </i-col>
                    </div>
                    <div>
                        <i-col span="8">
                            <div class="total-amount-title">
                                <span>开票情况</span>
                            </div>
                            <Tooltip placement="top" style="width: 260px;position: relative;left: 50%;margin-left: -130px;">
                                <div id="invoiceStateGauge" class="invoiceStateGauge"></div>
                                <div slot="content">
                                    <p>可开票总额：￥{{this.signedContractReport.invoice_price}}</p>
                                    <p>已开票金额：￥{{this.signedContractReport.invoiced_price}}</p>
                                    <p>待开票金额：￥{{this.signedContractReport.pending_invoice_price}}</p>
                                </div>
                            </Tooltip>
                        </i-col>
                        <i-col span="8">
                            <div>
                                <div class="total-amount-title">
                                    <span>实收总额</span>
                                </div>
                                <div class="paid-total-amount-content" :title="'￥' + this.signedContractReport.receipt_price">
                                    <span>￥{{this.signedContractReport.receipt_price | formatPrice}}</span>
                                </div>
                            </div>
                        </i-col>
                        <i-col span="8" class="vertical-before">
                            <div>
                                <div class="total-amount-title">
                                    <span>待收总额</span>
                                </div>
                                <div class="need-total-amount-content" :title="'￥' + this.signedContractReport.pending_price">
                                    <span>￥{{this.signedContractReport.pending_price | formatPrice}}</span>
                                </div>
                            </div>
                        </i-col>
                    </div>
                </div>
            </i-col>
            <!-- 待签合约情况统计 -->
            <i-col span="10">
                <div class="contract-external">
                    <div>
                        <span class="contract-head-left">待签合约情况统计</span>
                        <span class="contract-head-right">统计截至{{this.pendingSignedContractReport.deadline}}</span>
                    </div>
                    <div>
                        <i-col span="8" class="contract-middle" :style="{'background-color': this.contractState=='toSign' && this.pendingState==null?'#F6FAF9':''}">
                            <div class="contract-price" style="cursor: pointer" @click="showFormalList('toSign')">
                                <div class="total-amount-title">
                                    <span :style="{'color': this.contractState=='toSign' && this.pendingState==null?'#59b399 !important':''}">合约数</span>
                                </div>
                                <div class="contract-num-content">
                                    <span :style="{'color': this.contractState=='toSign' && this.pendingState==null?'#59b399 !important':''}">{{this.pendingSignedContractReport.contract_num}}</span>
                                </div>
                            </div>
                        </i-col>
                        <i-col span="16" class="vertical-before" style="padding-top: 10px">
                            <div class="contract-price">
                                <div class="total-amount-title">
                                    <span>合约金额</span>
                                </div>
                                <div class="receivable-total-amount-content" :title="'￥' + this.pendingSignedContractReport.price">
                                    <span>￥{{this.pendingSignedContractReport.price | formatPrice}}</span>
                                </div>
                            </div>
                        </i-col>
                    </div>
                    <div>
                        <i-col span="8" class="hover-css" :style="{'background-color': this.contractState=='toSign' && this.pendingState=='NONE'?'#F6FAF9':''}">
                            <div>
                                <div class="total-amount-title">
                                    <span :style="{'color': this.contractState=='toSign' && this.pendingState=='NONE'?'#59b399 !important':''}">待提交</span>
                                </div>
                                <div class="receivable-total-amount-content" @click="showFormalList('toSign','NONE')">
                                    <span :style="{'color': this.contractState=='toSign' && this.pendingState=='NONE'?'#59b399 !important':''}">{{this.pendingSignedContractReport.none_num}}</span>
                                </div>
                            </div>
                        </i-col>
                        <i-col span="8" class="vertical-before hover-css" :style="{'background-color': this.contractState=='toSign' && this.pendingState=='COMMITTED'?'#F6FAF9':''}">
                            <div>
                                <div class="total-amount-title">
                                    <span :style="{'color': this.contractState=='toSign' && this.pendingState=='COMMITTED'?'#59b399 !important':''}">待审核</span>
                                </div>
                                <div class="receivable-total-amount-content" @click="showFormalList('toSign','COMMITTED')">
                                    <span :style="{'color': this.contractState=='toSign' && this.pendingState=='COMMITTED'?'#59b399 !important':''}">{{this.pendingSignedContractReport.committed_num}}</span>
                                </div>
                            </div>
                        </i-col>
                        <i-col span="8" class="vertical-before hover-css" :style="{'background-color': this.contractState=='toSign' && this.pendingState=='APPROVED'?'#F6FAF9':''}">
                            <div>
                                <div class="total-amount-title">
                                    <span :style="{'color': this.contractState=='toSign' && this.pendingState=='APPROVED'?'#59b399 !important':''}">已核准</span>
                                </div>
                                <div class="receivable-total-amount-content" @click="showFormalList('toSign','APPROVED')">
                                    <span :style="{'color': this.contractState=='toSign' && this.pendingState=='APPROVED'?'#59b399 !important':''}">{{this.pendingSignedContractReport.approved_num}}</span>
                                </div>
                            </div>
                        </i-col>
                    </div>
                </div>
            </i-col>
        </Row>
        <div>
            <div class="list-name">
                <span>{{listName}}</span>
                <div v-if="listName" style="float: right;padding-right: 10px">
                    <Input v-model="searchText" class="search-text" icon="search" placeholder="客户名称/合约编号" @on-click="searchContractList" @on-enter="searchContractList"></Input>
                    <span @click="exportFile" style="margin-left: 20px;cursor: pointer"><Icon style="font-size: 18px;margin-right: 10px" type="ios-cloud-download-outline"></Icon>导出</span>
                </div>
            </div>
            <div v-if="!listName" class="no-contract">
                <span>请选择相应的合约数查看关联合约</span>
            </div>
            <div v-if="listName && contractList.length > 0" class="list-head" style="color: #bbbbbb">
                <div v-if="contractState=='formal'" class="list-date"><span>签约时间</span></div>
                <div class="list-column-120"><span>合约编号</span></div>
                <div class="list-column-120" style="text-align: left"><span>合约类型</span></div>
                <div v-if="contractState=='toSign'" class="list-column-120"><span>合约状态</span></div>
                <div style="display: inline-block"><span>甲方名称</span></div>
                <div v-if="contractState=='formal'" class="list-column-right">
                    <div class="list-column-150" style="text-align: right;border-left: 2px solid #f2f2f2"><span>应收金额</span></div>
                    <div class="list-column-150" style="text-align: right"><span>实收金额</span></div>
                    <div class="list-column-150" style="text-align: right"><span>待收金额</span></div>
                    <div class="list-column-150" style="text-align: right"><span>开票金额</span></div>
                </div>
                <div v-if="contractState=='toSign'" class="list-column-right">
                    <div class="list-column-150 invoice-price"><span>合约金额</span></div>
                    <div class="list-column-150"><span>创建时间</span></div>
                    <div class="list-column-150"><span>审核时间</span></div>
                    <!--<div class="list-column-120"><span>发起签约时间</span></div>-->
                </div>
            </div>
            <div class="list-head" v-for="(item,index) in contractList" :style="{'background':index%2==1?'':'white'}" style="cursor: pointer;" @click="showDetail(item)">
                <div v-if="contractState=='formal'" class="list-date"><span>{{item.ts_signed | formatSignDate}}</span></div>
                <div class="list-column-120" :title="item.code"><span>{{item.code | wordLengthLimit9}}</span></div>
                <div class="list-column-120" :title="item.item_name" style="text-align: left">
                    <Button class="contract-type" size="small">{{item.item_name | wordLengthLimit6}}</Button>
                </div>
                <div v-if="contractState=='toSign'" class="list-column-120"><span>{{item.status | formatStatus}}</span></div>
                <div style="display: inline-block" :title="item.name"><span>{{item.name | wordLengthLimit13}}</span></div>
                <div v-if="contractState=='formal'" class="list-column-right">
                    <div class="list-column-150" style="text-align: right;border-left: 2px solid #f2f2f2" :title="'￥' + item.receivable_price"><span>￥{{item.receivable_price | formatPrice}}</span></div>
                    <div class="list-column-150" style="text-align: right" :title="'￥' + item.receipt_price"><span>￥{{item.receipt_price | formatPrice}}</span></div>
                    <div class="list-column-150" style="text-align: right" :title="'￥' + item.pending_price"><span>￥{{item.pending_price | formatPrice}}</span></div>
                    <div class="list-column-150" style="text-align: right" :title="'￥' + item.invoiced_price"><span>￥{{item.invoiced_price | formatPrice}}</span></div>
                </div>
                <div v-if="contractState=='toSign'" class="list-column-right">
                    <div class="list-column-150 invoice-price" :title="'￥' + item.price"><span>￥{{item.price | formatPrice}}</span></div>
                    <div class="list-column-150"><span>{{item.ts_insert| formatToSignDate}}</span></div>
                    <div class="list-column-150"><span>{{item.approved_date| formatToSignDate}}</span></div>
                    <!--<div class="list-column-120"><span>￥111,111,111.00</span></div>-->
                </div>
            </div>
            <Page v-if="listName && contractList.length > 0" :page-size="pageSize" style="margin-top: 5px" size="small" :total="total" :current="current" @on-change="changePage"></Page>
        </div>
    </div>
</template>
<script>
    import ICol from "../../../../node_modules/iview/src/components/grid/col.vue";
    import echarts from 'echarts';
    export default {
        components: {ICol},
        filters: {
            wordLengthLimit6 : function (value) {
                if(value && value.length > 6){
                    return value.substring(0,6) + "..." ;
                }
                return value;
            },
            wordLengthLimit9 : function (value) {
                if(value && value.length > 9){
                    return value.substring(0,8) + "..." ;
                }
                return value;
            },
            wordLengthLimit13 : function (value) {
                if(value && value.length > 13){
                    return value.substring(0,13) + "..." ;
                }
                return value;
            },
            wordLengthLimit20 : function (value) {
                if(value && value.length > 20){
                    return value.substring(0,19) + "..." ;
                }
                return value;
            },
            formatSignDate(time) {
                if(time){
                    var date = new Date(time);
                    return date.format('yyyy/MM/dd');
                }else{
                    return "--/--";
                }
            },
            formatToSignDate(time) {
                if(time){
                    var date = new Date(time);
                    return date.format('MM/dd hh:mm');
                }else{
                    return "--/--";
                }
            },
            formatStatus (status) {
                var formatStatus = "";
                if(status == "NONE"){
                    formatStatus = "待提交";
                }
                if(status == "COMMITTED"){
                    formatStatus = "待审核";
                }
                if(status == "APPROVED"){
                    formatStatus = "已核准";
                }
                if(status == "SIGNING"){
                    formatStatus = "签约中";
                }
                if(status == "SIGNED"){
                    formatStatus = "已签署";
                }
                return formatStatus;
            },
            formatPrice(num) {
                if(num == undefined || num == null){
                    return
                }
                let cent = 2;
                let isThousand = 1;
                num = num.toString().replace(/\$|\,/g,'');
                // 检查传入数值为数值类型
                if(isNaN(num)) {
                    num = "0";
                }
                num = Math.floor(num*Math.pow(10,cent)+0.50000000001); // 把指定的小数位先转换成整数.多余的小数位四舍五入
                let cents = num%Math.pow(10,cent);       // 求出小数位数值
                num = Math.floor(num/Math.pow(10,cent)).toString();  // 求出整数位数值
                cents = cents.toString();        // 把小数位转换成字符串,以便求小数位长度

                // 补足小数位到指定的位数
                while(cents.length<cent){
                    cents = "0" + cents;
                }
                if(isThousand) {
                    // 对整数部分进行千分位格式化.
                    for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++) {
                        num = num.substring(0,num.length-(4*i+3))+','+ num.substring(num.length-(4*i+3));
                    }
                }
                var finallyPrice = "";
                if (cent > 0) {
                    finallyPrice = num + '.' + cents;
                } else {
                    finallyPrice = num;
                }
                if(finallyPrice && finallyPrice.length > 13){
                    return finallyPrice.substring(0,12) + "..." ;
                }else{
                    return (finallyPrice);
                }
            },
        },
        created: function () {
            this.getSignedContractReport();
            this.getPendingSignedContractReport();
        },
        data () {
            return{
                total: 0,
                current: 1,
                pageSize: 10,
                searchText: "",
                signedStart: null,
                signedEnd: null,
                signedContractReport: {},
                pendingSignedContractReport: {},
                listName: null,
                contractState: null,
                pendingState: "",
                contractList: [],
                exportFileUrl: ""
            }
        },
        methods: {
            showDetail(item){
                if (item.status == "NONE") {
                    this.$Message.warning('合约尚未提交审核，暂无内容展示!');
                } else {
                    this.card({
                        title: "",
                        code: "auditedContractView",
                        width: 940,
                        props: {
                            contractId:item.id
                        },
                    });
                }
            },
            //获取正式合约情况统计
            getSignedContractReport () {
                this.request({
                    url: "/signCloud/contractParameter/getSignedContractReport.do",
                    param: {
                        signedStart: this.signedStart,
                        signedEnd: this.signedEnd
                    }
                }).then(data=>{
                    this.signedContractReport = data;
                    this.drawGauge(data.invoice_price,data.invoiced_price);
                });
            },
            //获取待签合约情况统计
            getPendingSignedContractReport () {
                this.request({
                    url: "/signCloud/contractParameter/getPendingSignedContractReport.do"
                }).then(data=>{
                    this.pendingSignedContractReport = data;
                });
            },
            changeDateRange (dateRange) {
                if(dateRange && dateRange.length>0 && dateRange[0] && dateRange[1]){
                    this.current = 1;
                    this.contractState = "formal";
                    this.listName = "正式合约";
                    this.signedStart = dateRange[0];
                    this.signedEnd = dateRange[1];
                    this.getSignedContractReport();
                    this.getSignedContractByPage();
                }else{
                    this.signedStart = null;
                    this.signedEnd = null;
                    this.getSignedContractReport();
                    this.getSignedContractByPage();
                }
            },
            drawGauge(invoice_price,invoiced_price){
                var invoiceRatio = 0;
                if(invoice_price != 0){
                    invoiceRatio = invoiced_price/invoice_price;
                }else{
                    if(invoiced_price == 0){
                        invoice_price+=1;
                    }
                }
                this.$nextTick(()=>{
                    this.charts = echarts.init(document.getElementById("invoiceStateGauge"),'macarons')
                    this.charts.clear();
                    this.charts.setOption({
                        series: [{
                            type: "gauge",
                            startAngle: 180,
                            endAngle: 0,
                            min: 0,
                            max: invoice_price,
                            radius: "100%",
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    width: 40,
                                    color: [
                                        [0, '#ff7100'],
                                        [invoiceRatio, '#ff7100'],
                                        [1, '#e5e5e5']
                                    ]
                                }
                            },
                            axisTick: {
                                show: false
                            },
                            axisLabel: {
                                show: false
                            },
                            splitLine: {
                                show: false
                            },
                            pointer: {
                                width: "5%",
                                length: '90%',
                                color: "black"
                            },
                            itemStyle: {
                                normal: {
                                    color: "black"
                                }
                            },
                            title: {
                                show: false
                            },
                            detail: {
                                show: false
                            },
                            data:[{value:invoiced_price,name:'开票情况'}]
                        }]
                    }, true);
                });
            },
            showFormalList(state,pendingState) {
                if(this.contractState != state || (state == 'toSign' && this.pendingState != pendingState)){
                    this.contractState = state;
                    this.current = 1;
                }else{
                    return;
                }
                if(state == "formal"){
                    this.listName = "正式合约";
                    this.getSignedContractByPage();
                }else{
                    this.listName = "待签合约";
                    if(pendingState){
                        this.pendingState = pendingState;
                    }else{
                        this.pendingState = null;
                    }
                    this.getPendingSignedContractByPage();
                }
            },
            changePage (page) {
                this.current = page;
                if(this.contractState == "formal"){
                    this.getSignedContractByPage();
                }else{
                    this.getPendingSignedContractByPage();
                }
            },
            searchContractList () {
                if(this.contractState == "formal"){
                    this.getSignedContractByPage();
                }else{
                    this.getPendingSignedContractByPage();
                }
            },
            //获取正式合约列表
            getSignedContractByPage () {
                this.request({
                    url: "/signCloud/contractParameter/getSignedContractByPage.do",
                    param: {
                        searchText: this.searchText,
                        current: this.current,
                        signedStart: this.signedStart,
                        signedEnd: this.signedEnd
                    }
                }).then(data=>{
                    this.current = data.current;
                    this.total = data.total;
                    if(data && data.records && data.records.length > 0){
                        this.contractList = data.records;
                    }else{
                        this.contractList = [];
                    }
                });
            },
            //获取待签合约列表
            getPendingSignedContractByPage () {
                this.request({
                    url: "/signCloud/contractParameter/getPendingSignedContractByPage.do",
                    param: {
                        searchText: this.searchText,
                        current: this.current,
                        status: this.pendingState
                    }
                }).then(data=>{
                    this.current = data.current;
                    this.total = data.total;
                    if(data && data.records && data.records.length > 0){
                        this.contractList = data.records;
                    }else{
                        this.contractList = [];
                    }
                });
            },
            exportFile () {
                let url = "/signCloud/contractParameter/exportFile.do?contractState=" + this.contractState;
                console.log(this.contractState);
                if(this.contractState === "formal"){
                    if(this.searchText && this.signedStart && this.signedEnd){
                        url = url + "&key=" + this.searchText + "&signedStart=" + this.signedStart + "&signedEnd=" + this.signedEnd;
                    }else if(this.searchText){
                        url = url + "&key=" + this.searchText
                    }else if (this.signedStart && this.signedEnd){
                        url = url + "&signedStart=" + this.signedStart + "&signedEnd=" + this.signedEnd;
                    }
                }else if(this.contractState === "toSign"){
                    if(this.searchText && this.pendingState){
                        url = url + "&key=" + this.searchText + "&pendingState=" + this.pendingState;
                    }else if(this.searchText){
                        url = url + "&key=" + this.searchText
                    }else if (this.pendingState){
                        url = url + "&pendingState=" + this.pendingState
                    }
                }
                window.open(url);
                //ie10不支持a.download  改为open
//                var a = document.createElement("a");
//                a.href = url;
//                a.download = url;
//                a.click();
            }
        }
    }
</script>