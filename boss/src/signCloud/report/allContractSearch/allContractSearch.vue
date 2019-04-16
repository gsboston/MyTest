<style scoped>
    .container{
        height: 100%;
        padding: 15px 15px;
        overflow-y: auto;
        overflow-x: hidden;
        background-color: #f6f6f6;
    }
    .head{
        padding: 0 30px;
    }
    .row-top{
        margin-top: 10px;
    }
    .search-text{
        width: 300px;
    }
    .search-text >>> .ivu-input-icon{
        font-size: 22px;
        color: #59b399;
    }
    .three-row-width{
        width: 250px;
    }
    .three-row-left{
        margin-left: 20px;
    }
    .btn-head{
        background-color: #FFFFFF;
        width: 100%;
        padding: 15px 30px;
        margin-top: 30px;
    }
    .btn-head >>> .ivu-btn{
        color: #59b399;
        background: white;
        border-color: #59b399;
        border-radius: 3px;
        font-size: 12px;
        font-weight: 700;
    }
    .btn-head .active {
        color: white;
        background: #59b399;
        border-color: #59b399;
        border-radius: 3px;
        font-size: 12px;
        font-weight: 700;
    }

    .list-head{
        height: 55px;
        width: 2150px;
        font-size: 14px;
        color: #5d5d5d;
        line-height: 55px;
        padding-left: 10px;
        padding-right: 10px;
        overflow: auto;
    }
    .contract-type{
        background-color: #FFF !important;
        border: 1px solid #54B499;
        border-radius: 10px !important;
        padding: 2px 15px;
        color: #54B499 !important;
        font-size: 12px !important;
        line-height: initial;
        vertical-align: initial;
    }
    .list-column-80{
        text-align: center;
        padding: 0 5px;
        display: inline-block;
        width: 80px;
    }
    .list-column-120{
        text-align: center;
        padding: 0 5px;
        display: inline-block;
        width: 120px;
    }
    .list-column-130{
        text-align: right;
        padding: 0 10px;
        display: inline-block;
        width: 130px;
    }
    .list-column-150{
        text-align: right;
        padding: 0 10px;
        display: inline-block;
        width: 150px;
    }
    .list-column-210{
        text-align: center;
        padding: 0 5px;
        display: inline-block;
        width: 210px;
    }
    .list-column-240{
        text-align: center;
        padding: 0 5px;
        display: inline-block;
        width: 240px;
    }
    .list-font{
        color: #a1a1a1;
        text-align: left;
    }
    .list-border-left{
        border-left: 1px solid #f6f6f6;
    }
</style>
<template>
    <div class="container">
        <div class="head">
            <Row class="row-top">
                合约搜索：<Input v-model="searchText" class="search-text" icon="search" placeholder="客户名称/合约编号" @on-click="searchContractList" @on-enter="searchContractList"></Input>
            </Row>
            <Row class="row-top">
                状态查询：<Select v-model="contractStatus" clearable placeholder="合约状态" style="width: 200px" @on-change="changeContractStatus">
                    <Option value="NONE">待提交</Option>
                    <Option value="COMMITTED">待审核</Option>
                    <Option value="APPROVED">已核准</Option>
                    <Option value="SIGNING">签约中</Option>
                    <Option value="SIGNED">已签署</Option>
                    <Option value="TERMINATION">已解约</Option>
                </Select>
            </Row>
            <Row class="row-top">
                时间查询：<Select v-model="dateFlag" clearable placeholder="合约时间维度选择" class="three-row-width" @on-change="changeDateFlag">
                    <Option value="create">创建时间</Option>
                    <Option value="submit">提交时间</Option>
                    <Option value="approved">审核时间</Option>
                    <Option value="signed">签约时间</Option>
                    <Option value="receipt">收款时间</Option>
                </Select>
                <DatePicker :disabled="!this.dateFlag" @on-change="selectStartDate" v-model="startDate" type="date" placeholder="开始时间" class="three-row-width three-row-left"></DatePicker>
                <DatePicker :disabled="!this.dateFlag" @on-change="selectEndDate" v-model="endDate" type="date" placeholder="结束时间" class="three-row-width three-row-left"></DatePicker>
            </Row>
        </div>
        <div class="btn-head">
            <Row>
                <Button type="primary" :class="{'active':this.flag=='all'}" @click="show('all')">全部合约</Button>
                <Button type="primary" :class="{'active':this.flag=='xs'}" @click="show('xs')">仅看销售合约</Button>
                <Button type="primary" :class="{'active':this.flag=='csb'}" @click="show('csb')">仅看作为销售主体合约</Button>
                <span @click="exportFile" style="margin-right: 30px;cursor: pointer;color: #a1a1a1;float: right"><Icon style="font-size: 18px;margin-right: 10px" type="ios-cloud-download-outline"></Icon>导出</span>
            </Row>
            <div style="overflow-x: auto;">
                <div class="list-head" style="color: #bbbbbb;margin-top: 10px;">
                    <div class="list-column-120" style="text-align: left"><span>服务名称</span></div>
                    <div class="list-column-120" style="text-align: left"><span>合约编号</span></div>
                    <div class="list-column-80" style="text-align: left"><span>合约状态</span></div>
                    <div class="list-column-210" style="text-align: left"><span>客户名称</span></div>
                    <div class="list-column-130 list-border-left"><span>合约金额</span></div>
                    <div class="list-column-130"><span>实收金额</span></div>
                    <div class="list-column-130"><span>开票金额</span></div>
                    <div class="list-column-240 list-border-left" style="text-align: left"><span>销售组织</span></div>
                    <div class="list-column-240" style="text-align: left"><span>签约组织</span></div>
                    <div class="list-column-120 list-border-left" style="text-align: left"><span>业务员</span></div>
                    <div class="list-column-240" style="text-align: left"><span>业务员所属部门</span></div>
                    <div class="list-column-80 list-border-left"><span>创建时间</span></div>
                    <div class="list-column-80"><span>提交时间</span></div>
                    <div class="list-column-80"><span>审核时间</span></div>
                    <div class="list-column-80" style="width: 70px;"><span>签约时间</span></div>
                </div>
                <div class="list-head" v-for="(item,index) in contractList" :style="{'background':index%2==1?'':'#f6f6f6'}" style="cursor: pointer;color: #5d5d5d; overflow-y: hidden;" @click="showDetail(item)">
                    <div class="list-column-120" style="text-align: left" :title="item.item_name">
                        <Button class="contract-type" size="small">{{item.item_name | wordLengthLimit(5)}}</Button>
                    </div>
                    <div class="list-column-120" style="ytext-align: left" :title="item.code"><span>{{item.code | wordLengthLimit(10)}}</span></div>
                    <div class="list-column-80 list-font"><span>{{item.statusName}}</span></div>
                    <div class="list-column-210" style="font-weight: bold;text-align: left" :title="item.name"><span>{{item.name | wordLengthLimit(12)}}</span></div>
                    <div class="list-column-130 list-border-left" :title="'￥' + item.price"><span>￥{{item.price | formatPrice}}</span></div>
                    <div class="list-column-130" :title="'￥' + item.receipt_price"><span>￥{{item.receipt_price | formatPrice}}</span></div>
                    <div class="list-column-130" :title="'￥' + item.invoiced_price"><span>￥{{item.invoiced_price | formatPrice}}</span></div>
                    <div class="list-column-240 list-border-left" style="text-align: left" :title="item.xs_org_name"><span>{{item.xs_org_name | wordLengthLimit(14)}}</span></div>
                    <div class="list-column-240" style="text-align: left" :title="item.csb_org_name"><span>{{item.csb_org_name | wordLengthLimit(14)}}</span></div>
                    <div class="list-column-120 list-border-left" style="text-align: left" :title="item.xs_org_name"><span>{{item.salesman_real_name | wordLengthLimit(5)}}</span></div>
                    <div class="list-column-240" style="text-align: left" :title="item.csb_org_name"><span>{{item.salesman_dept_name | wordLengthLimit(10)}}</span></div>
                    <div class="list-column-80 list-font list-border-left"><span>{{item.ts_insert| formatSignDate}}</span></div>
                    <div class="list-column-80 list-font"><span>{{item.submit_date| formatSignDate}}</span></div>
                    <div class="list-column-80 list-font"><span>{{item.approved_date| formatSignDate}}</span></div>
                    <div class="list-column-80 list-font" style="width: 70px;"><span>{{item.ts_signed| formatSignDate}}</span></div>
                </div>
            </div>
            <Page :page-size="pageSize" style="margin-top: 5px" size="small" :total="total" :current="current" @on-change="changePage"></Page>
        </div>
    </div>
</template>
<script>
    export default {
        filters: {
            wordLengthLimit : function (value,len) {
                if(value && value.length > len){
                    return value.substring(0,len) + "..." ;
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
                var index = num.indexOf(".");
                let cents = 0;
                if(index > 0){
                    cents = num.substring(index+1,num.length);
                    num = num.substring(0,index);
                }
                // 补足小数位到指定的位数
                while(cents.length<cent){
                    cents = "0" + cents;
                }
                if(isThousand) {
                    // 对整数部分进行千分位格式化.
                    var isPositiveNumber = true;//是否正数
                    if(num < 0){
                        isPositiveNumber = false;
                        num = num.substring(1,num.length);
                    }
                    for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++) {
                        num = num.substring(0,num.length-(4*i+3))+','+ num.substring(num.length-(4*i+3));
                    }
                    if(!isPositiveNumber){
                        num = "-" + num;
                    }
                }
                var finallyPrice = "";
                if (cents == 0) {
                    finallyPrice = num + ".00";
                } else {
                    finallyPrice = num + '.' + cents;
                }
                if(finallyPrice && finallyPrice.length > 13){
                    return finallyPrice.substring(0,12) + "..." ;
                }else{
                    return (finallyPrice);
                }
            },
        },
        created: function() {
            this.getContractList();
        },
        data () {
            return {
                current: 1,
                total: 0,
                pageSize: 10,
                searchText: null,
                contractStatus: null,
                dateFlag: null,
                startDate: null,
                endDate: null,
                flag: "all",
                contractList: [],
                temp: false,
            }
        },
        methods: {
            getContractList () {
                if(this.startDate){
                    var date = new Date(this.startDate);
                    this.startDate = date.format("yyyy-MM-dd");
                }
                if(this.endDate){
                    var date = new Date(this.endDate);
                    this.endDate = date.format("yyyy-MM-dd");
                }
                this.request({
                    url: "/signCloud/allContractSearch/getContractList.do",
                    param: {
                        searchText: this.searchText,
                        current: this.current,
                        contractStatus: this.contractStatus,
                        dateFlag: this.dateFlag,
                        flag: this.flag,
                        startDate: this.startDate,
                        endDate: this.endDate,
                    }
                }).then(data=>{
                    this.current = data.current;
                    this.total = data.total;
                    if(data && data.records && data.records.length > 0){
                        for(var i=0;i<data.records.length;i++){
                            if(data.records[i].status == "NONE"){
                                data.records[i].statusName = "待提交";
                            }else if(data.records[i].status == "COMMITTED"){
                                data.records[i].statusName = "待审核";
                            }else if (data.records[i].status == "APPROVED"){
                                data.records[i].statusName = "已核准";
                            }else if (data.records[i].status == "SIGNING"){
                                data.records[i].statusName = "签约中";
                            }else if (data.records[i].status == "SIGNED"){
                                data.records[i].statusName = "已签署";
                            }else if (data.records[i].status == "TERMINATION"){
                                data.records[i].statusName = "已解约";
                            }
                        }
                        this.contractList = data.records;
                    }else{
                        this.contractList = [];
                    }
                    this.temp = false;
                });
            },
            show (flag) {
                this.current = 1;
                this.flag = flag;
                this.getContractList();
            },
            searchContractList () {
                this.current = 1;
                this.getContractList();
            },
            changeContractStatus(val) {
                this.current = 1;
                if(val){
                    this.contractStatus = val;
                    this.getContractList();
                }else if(val == ""){
                    this.contractStatus = null;
                    this.getContractList();
                }
            },
            changeDateFlag (val) {
                if(val == ""){
                    this.current = 1;
                    this.dateFlag = null;
                    this.temp = true;
                    this.startDate = null;
                    this.endDate = null;
                    this.getContractList();
                }
            },
            selectStartDate (val) {
                if(val){
                    this.startDate = val + "";
                }else{
                    this.startDate = null;
                }
                if(!this.temp){
                    this.current = 1;
                    this.getContractList();
                }
            },
            selectEndDate (val) {
                if(val){
                    this.endDate = val + "";
                }else{
                    this.endDate = null;

                }
                if(!this.temp){
                    this.current = 1;
                    this.getContractList();
                }
            },
            exportFile () {
                var startDate = null;
                var endDate = null;
                if(this.startDate){
                    var date = new Date(this.startDate);
                    startDate = date.format("yyyy-MM-dd");
                }
                if(this.endDate){
                    var date = new Date(this.endDate);
                    endDate = date.format("yyyy-MM-dd");
                }
                let url = "/signCloud/allContractSearch/exportFile.do?flag=" + this.flag;
                if(this.contractStatus){
                    url = url + "&contractStatus=" + this.contractStatus;
                }
                if(this.searchText){
                    url = url + "&key=" + this.searchText;
                }
                if(this.dateFlag){
                    url = url + "&dateFlag=" + this.dateFlag;
                }
                if(this.startDate){
                    url = url + "&startDate=" + startDate;
                }
                if(this.endDate){
                    url = url + "&endDate=" + endDate;
                }
                window.open(url);
                //ie10不支持a.download  改为open
//                var a = document.createElement("a");
//                a.href = url;
//                console.info(a);
//                a.download = url;
//                a.click();
            },
            changePage (val) {
                this.current = val;
                this.getContractList();
            },
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
        }
    }
</script>