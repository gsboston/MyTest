<style scoped>
    .container-query{
        width: 100%;
        padding: 15px 30px;
        background-color: #f6f6f6;
        overflow-y: auto;
        overflow: hidden;
    }
    .cascader >>> .ivu-input{
        cursor: pointer !important;
    }
    .query-content{
        width: 100%;
        background-color: white;
        margin-top: 10px;
    }
    .query-content{
        background-color: #FFFFFF;
        width: 100%;
        padding: 15px 15px;
        margin-top: 30px;
    }
    .query-content >>> .ivu-btn{
        color: #59b399;
        background: white;
        border-color: #59b399;
        border-radius: 3px;
        font-size: 12px;
        font-weight: 700;
    }
    .query-content .active {
        color: white;
        background: #59b399;
        border-color: #59b399;
        border-radius: 3px;
        font-size: 12px;
        font-weight: 700;
    }
    .list-item{
        height: 55px;
        font-size: 14px;
        line-height: 55px;
    }
    .list-content-item{
        cursor: pointer;
        color: #5d5d5d;
    }
    .list-content-item:hover{
        background-color: #F6FAF9 !important;
    }
    .list-content-item.beSelected{
        background-color: #59b399 !important;
        color: white !important;
    }
    .list-content-item.beSelected:hover{
        background-color: #59b399 !important;
        color: white !important;
    }
    .list-head-row1-color{
        background-color: #f6f6f6;
        text-align: center;
        color: #5d5d5d;
    }
    .list-head-row2-color{
        color: #bbbbbb;
    }
    .col-padding{
        padding: 0 5px 0 5px;
    }
    .text-align-right{
        text-align: right;
    }
    .col-name-padding{
        padding: 0 5px 0 15px;
    }
    .vertical-before:before{
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 1px;
        background: #e5e5e5;
    }
    .sort-up{
        cursor: pointer;
        position: relative;
        top: -3px;
        font-size: 16px;
        height: 18px;
        line-height: 1.5;
    }
    .current-sort{
        color: #59b399;
    }
    .sort-down{
        cursor: pointer;
        position: relative;
        top: 7px;
        left: -14px;
        font-size: 16px;
        height: 18px;
        line-height: 0.5;
    }
    .mask{
        position: fixed;
        top: 0px;
        left: 0px;
        right: 0px;
        height: 100%;
        background-color: black;
        opacity: 0.3;
        z-index: 100;
    }
    .bottom-transform{
        position: fixed;
        bottom: 0px;
        left: 0px;
        right: 0px;
        height: 0px;
        z-index: 150;
        transition: height 1s;
        background-color: white;
    }
    .bottom-list{
        overflow-x: hidden;
        overflow-y: auto;
        position: absolute;
        left: 10px;
        right: 10px;
        top: 50px;
        bottom: 20px;
    }
    .bottom-transform.show-contract-list{
        height: 50%;
    }
    .bottom-close{
        background-color: rgb(89, 179, 153);
        float: right;
        width: 32px;
        height: 32px;
        text-align: center;
        line-height: 32px;
        cursor: pointer;
    }
    .bottom-content{
        padding: 20px 10px 10px 10px;
    }
    .statusName{
        font-size: 12px;
        display: inline-block;
        width: auto;
        max-width: 190px;
        height: 24px;
        padding: 0 5px;
        border: 1px solid #59b399;
        border-radius: 15px;
        text-align: center;
        line-height: 24px;
        color: #59b399;
    }
</style>
<template>
    <div class="container-query">
        <div :class="{'mask':this.selectedSaleMan != null}"></div>
        <Row style="display: flex;align-items: center">
            <i-col span="6">
                时间查询：
                <DatePicker v-model="dateRange" type="daterange" placement="bottom-start" placeholder="请选择时间区间" style="width: 200px" @on-change="selectDate"></DatePicker>
            </i-col>
            <i-col span="6" class="cascader">
                服务类型：
                <Cascader v-model="cascadeData" @on-change="selectServiceType" :data="cascadeGroup" trigger="hover" clearable style="width: 200px;display: inline-block"></Cascader>
            </i-col>
            <i-col span="6">
                <Button type="primary" style="margin-left: 20px" @click="initList">查询</Button>
                <span @click="exportFile" style="margin-left: 20px;cursor: pointer;"><Icon style="font-size: 18px;margin-right: 10px" type="ios-cloud-download-outline"></Icon>导出</span>
            </i-col>
        </Row>
        <div class="query-content">
            <Row style="padding-left: 15px;border-bottom: 1px solid #BBBBBB">
                <Button type="primary" :class="{'active':flag=='qy'}" @click="show('qy')">签约情况</Button>
                <Button type="primary" :class="{'active':flag=='hk'}" @click="show('hk')">回款情况</Button>
            </Row>
            <!-- 签约情况列表 -->
            <div v-if="this.flag == 'qy'">
                <div class="list-head">
                    <Row class="list-item list-head-row1-color">
                        <i-col span="5" offset="5" class="col-padding vertical-before"><span>正式合约</span></i-col>
                        <i-col span="9" class="col-padding vertical-before"><span>待签合约</span></i-col>
                        <i-col span="5" class="col-padding vertical-before"><span>解约合约</span></i-col>
                    </Row>
                    <Row class="list-item list-head-row2-color">
                        <i-col span="3" class="col-name-padding"><span>业务员</span></i-col>
                        <i-col span="2" class="col-padding"><span>联系电话</span></i-col>
                        <i-col span="2" class="vertical-before text-align-right">
                            <span>合约数</span>
                            <Icon type="arrow-up-b" class="sort-up" :class="{'current-sort': this.field=='signedContractNum' && this.way == 'up'}" @click.native="listSort('up','signedContractNum')"></Icon>
                            <Icon type="arrow-down-b" class="sort-down" :class="{'current-sort': this.field=='signedContractNum' && this.way == 'down'}" @click.native="listSort('down','signedContractNum')"></Icon>
                        </i-col>
                        <i-col span="3" class="text-align-right">
                            <span>合约金额</span>
                            <Icon type="arrow-up-b" class="sort-up" :class="{'current-sort': this.field=='signedContractPrice' && this.way == 'up'}" @click.native="listSort('up','signedContractPrice')"></Icon>
                            <Icon type="arrow-down-b" class="sort-down" :class="{'current-sort': this.field=='signedContractPrice' && this.way == 'down'}" @click.native="listSort('down','signedContractPrice')"></Icon>
                        </i-col>
                        <i-col span="2" class="vertical-before text-align-right">
                            <span>待提交</span>
                            <Icon type="arrow-up-b" class="sort-up" :class="{'current-sort': this.field=='tobeCommitContractNum' && this.way == 'up'}" @click.native="listSort('up','tobeCommitContractNum')"></Icon>
                            <Icon type="arrow-down-b" class="sort-down" :class="{'current-sort': this.field=='tobeCommitContractNum' && this.way == 'down'}" @click.native="listSort('down','tobeCommitContractNum')"></Icon>
                        </i-col>
                        <i-col span="2" class="text-align-right">
                            <span>待审核</span>
                            <Icon type="arrow-up-b" class="sort-up" :class="{'current-sort': this.field=='committedContractNum' && this.way == 'up'}" @click.native="listSort('up','committedContractNum')"></Icon>
                            <Icon type="arrow-down-b" class="sort-down" :class="{'current-sort': this.field=='committedContractNum' && this.way == 'down'}" @click.native="listSort('down','committedContractNum')"></Icon>
                        </i-col>
                        <i-col span="2" class="text-align-right">
                            <span>已审核</span>
                            <Icon type="arrow-up-b" class="sort-up" :class="{'current-sort': this.field=='approvedContractNum' && this.way == 'up'}" @click.native="listSort('up','approvedContractNum')"></Icon>
                            <Icon type="arrow-down-b" class="sort-down" :class="{'current-sort': this.field=='approvedContractNum' && this.way == 'down'}" @click.native="listSort('down','approvedContractNum')"></Icon>
                        </i-col>
                        <i-col span="3" class="text-align-right">
                            <span>待签金额</span>
                            <Icon type="arrow-up-b" class="sort-up" :class="{'current-sort': this.field=='tobeSignContractPrice' && this.way == 'up'}" @click.native="listSort('up','tobeSignContractPrice')"></Icon>
                            <Icon type="arrow-down-b" class="sort-down" :class="{'current-sort': this.field=='tobeSignContractPrice' && this.way == 'down'}" @click.native="listSort('down','tobeSignContractPrice')"></Icon>
                        </i-col>
                        <i-col span="2" class="vertical-before text-align-right">
                            <span>合约数</span>
                            <Icon type="arrow-up-b" class="sort-up" :class="{'current-sort': this.field=='terminatedContractNum' && this.way == 'up'}" @click.native="listSort('up','terminatedContractNum')"></Icon>
                            <Icon type="arrow-down-b" class="sort-down" :class="{'current-sort': this.field=='terminatedContractNum' && this.way == 'down'}" @click.native="listSort('down','terminatedContractNum')"></Icon>
                        </i-col>
                        <i-col span="3" class="text-align-right">
                            <span>原合约金额</span>
                            <Icon type="arrow-up-b" class="sort-up" :class="{'current-sort': this.field=='terminationPrice' && this.way == 'up'}" @click.native="listSort('up','terminationPrice')"></Icon>
                            <Icon type="arrow-down-b" class="sort-down" :class="{'current-sort': this.field=='terminationPrice' && this.way == 'down'}" @click.native="listSort('down','terminationPrice')"></Icon>
                        </i-col>
                    </Row>
                </div>
                <div class="list-content">
                    <Row class="list-item list-content-item" :class="{'beSelected':selectedSaleMan == salesmanInfo}" @click.native="selectSaleMan(salesmanInfo)" v-for="(salesmanInfo,index) in salesmanList" :style="{'background':index%2==1?'':'#f6f6f6'}">
                        <i-col span="3" class="col-name-padding" :title="salesmanInfo.real_name"><span>{{salesmanInfo.real_name | wordLengthLimit(7)}}</span></i-col>
                        <i-col span="2" class="col-padding" :title="salesmanInfo.phone"><span>{{salesmanInfo.phone | wordLengthLimit(11)}}</span></i-col>
                        <i-col span="2" class="col-padding vertical-before text-align-right"><span>{{salesmanInfo.signedContractNum}}</span></i-col>
                        <i-col span="3" class="col-padding text-align-right"><span>￥{{salesmanInfo.signedContractPrice | formatPrice}}</span></i-col>
                        <i-col span="2" class="col-padding vertical-before text-align-right"><span>{{salesmanInfo.tobeCommitContractNum}}</span></i-col>
                        <i-col span="2" class="col-padding text-align-right"><span>{{salesmanInfo.committedContractNum}}</span></i-col>
                        <i-col span="2" class="col-padding text-align-right"><span>{{salesmanInfo.approvedContractNum}}</span></i-col>
                        <i-col span="3" class="col-padding text-align-right"><span>￥{{salesmanInfo.tobeSignContractPrice | formatPrice}}</span></i-col>
                        <i-col span="2" class="col-padding vertical-before text-align-right"><span>{{salesmanInfo.terminatedContractNum}}</span></i-col>
                        <i-col span="3" class="col-padding text-align-right"><span>￥{{salesmanInfo.terminationPrice | formatPrice}}</span></i-col>
                    </Row>
                </div>
            </div>
            <!-- 回款情况列表 -->
            <div v-else>
                <div class="list-head">
                    <Row class="list-item list-head-row1-color">
                        <i-col span="7" offset="10" class="col-padding vertical-before"><span>正式合约</span></i-col>
                        <i-col span="7" class="col-padding vertical-before"><span>解约合约</span></i-col>
                    </Row>
                    <Row class="list-item list-head-row2-color">
                        <i-col span="5" class="col-name-padding"><span>业务员</span></i-col>
                        <i-col span="5" class="col-padding"><span>联系电话</span></i-col>
                        <i-col span="2" class="vertical-before text-align-right">
                            <span>合约数</span>
                            <Icon type="arrow-up-b" class="sort-up" :class="{'current-sort': this.field=='receiptNum' && this.way == 'up'}" @click.native="listSort('up','receiptNum')"></Icon>
                            <Icon type="arrow-down-b" class="sort-down" :class="{'current-sort': this.field=='receiptNum' && this.way == 'down'}" @click.native="listSort('down','receiptNum')"></Icon>
                        </i-col>
                        <i-col span="5" class="text-align-right">
                            <span>实收金额</span>
                            <Icon type="arrow-up-b" class="sort-up" :class="{'current-sort': this.field=='receiptTotalAmount' && this.way == 'up'}" @click.native="listSort('up','receiptTotalAmount')"></Icon>
                            <Icon type="arrow-down-b" class="sort-down" :class="{'current-sort': this.field=='receiptTotalAmount' && this.way == 'down'}" @click.native="listSort('down','receiptTotalAmount')"></Icon>
                        </i-col>
                        <i-col span="2" class="vertical-before text-align-right">
                            <span>合约数</span>
                            <Icon type="arrow-up-b" class="sort-up" :class="{'current-sort': this.field=='terminatedContractNum' && this.way == 'up'}" @click.native="listSort('up','terminatedContractNum')"></Icon>
                            <Icon type="arrow-down-b" class="sort-down" :class="{'current-sort': this.field=='terminatedContractNum' && this.way == 'down'}" @click.native="listSort('down','terminatedContractNum')"></Icon>
                        </i-col>
                        <i-col span="5" class="text-align-right">
                            <span>实收金额</span>
                            <Icon type="arrow-up-b" class="sort-up" :class="{'current-sort': this.field=='terminatedAmount' && this.way == 'up'}" @click.native="listSort('up','terminatedAmount')"></Icon>
                            <Icon type="arrow-down-b" class="sort-down" :class="{'current-sort': this.field=='terminatedAmount' && this.way == 'down'}" @click.native="listSort('down','terminatedAmount')"></Icon>
                        </i-col>
                    </Row>
                </div>
                <div class="list-content">
                    <Row class="list-item list-content-item" :class="{'beSelected':selectedSaleMan == salesmanInfo}" @click.native="selectSaleMan(salesmanInfo)" v-for="(salesmanInfo,index) in salesmanList" :style="{'background':index%2==1?'':'#f6f6f6'}">
                        <i-col span="5" class="col-name-padding" :title="salesmanInfo.real_name"><span>{{salesmanInfo.real_name | wordLengthLimit(15)}}</span></i-col>
                        <i-col span="5" class="col-padding"><span>{{salesmanInfo.phone}}</span></i-col>
                        <i-col span="2" class="col-padding vertical-before text-align-right"><span>{{salesmanInfo.receiptNum}}</span></i-col>
                        <i-col span="5" class="col-padding text-align-right"><span>￥{{salesmanInfo.receiptTotalAmount | formatPrice}}</span></i-col>
                        <i-col span="2" class="col-padding vertical-before text-align-right"><span>{{salesmanInfo.terminatedContractNum}}</span></i-col>
                        <i-col span="5" class="col-padding text-align-right"><span>{{salesmanInfo.terminatedAmount}}</span></i-col>
                    </Row>
                </div>
            </div>
        </div>
        <!-- 底部向上滑动 -->
        <div class="bottom-transform" :class="{'show-contract-list': this.selectedSaleMan != null}">
            <div>
                <div class="bottom-close" @click="closeBottom">
                    <Icon type="close" style="color: white;font-size: 30px"></Icon>
                </div>
            </div>
            <div class="bottom-content">
                <div style="font-size: 16px;color: #59b399;font-weight: bold;padding-left: 20px">
                    <span v-if="this.flag=='qy'">业务员签约详情</span>
                    <span v-else>业务员回款合约详情</span>
                </div>
                <div class="bottom-list" ref="bottomList">
                    <!-- 签约详情 -->
                    <div v-if="this.flag == 'qy'">
                        <div class="list-head">
                            <Row class="list-item" style="background-color: #f6f6f6">
                                <i-col span="3" class="col-name-padding"><span>合约编号</span></i-col>
                                <i-col span="2" class="col-padding"><span>合约类型</span></i-col>
                                <i-col span="2" class="col-padding"><span>合约状态</span></i-col>
                                <i-col span="9" class="col-padding"><span>客户名称</span></i-col>
                                <i-col span="4" class="col-padding vertical-before" style="text-align: right"><span>合约金额</span></i-col>
                                <i-col span="4" class="col-padding vertical-before" style="text-align: right"><span>实收金额</span></i-col>
                            </Row>
                        </div>
                        <div class="list-content">
                            <div v-if="contractInfoList.length <= 0" style="font-size: 16px;text-align: center;position: relative;top: 70px;">
                                <Icon type="information-circled" style="color: #bbbbbb"></Icon>
                                <span>暂无数据可显示</span>
                            </div>
                            <Row v-if="contractInfoList.length > 0" class="list-item list-content-item" v-for="(contractInfo,index) in contractInfoList" :style="{'background':index%2==1?'#f6f6f6':''}">
                                <i-col span="3" class="col-name-padding" :title="contractInfo.code"><span>{{contractInfo.code | wordLengthLimit(12)}}</span></i-col>
                                <i-col span="2" class="col-padding">
                                    <div>
                                        <div class="statusName" :title="contractInfo.defName">
                                            <span>{{contractInfo.defName | wordLengthLimit(5)}}</span>
                                        </div>
                                    </div>
                                </i-col>
                                <i-col span="2" class="col-padding"><span>{{contractInfo.status | statusName}}</span></i-col>
                                <i-col span="9" class="col-padding"><span>{{contractInfo.customerName}}</span></i-col>
                                <i-col span="4" class="col-padding vertical-before" style="text-align: right"><span>￥{{contractInfo.price | formatPrice}}</span></i-col>
                                <i-col span="4" class="col-padding vertical-before" style="text-align: right"><span>￥{{contractInfo.collectedAmount | formatPrice}}</span></i-col>
                            </Row>
                        </div>
                    </div>
                    <!-- 回款详情 -->
                    <div v-else>
                        <div class="list-head">
                            <Row class="list-item" style="background-color: #f6f6f6">
                                <i-col span="3" class="col-name-padding"><span>合约编号</span></i-col>
                                <i-col span="2" class="col-padding"><span>合约类型</span></i-col>
                                <i-col span="2" class="col-padding"><span>合约状态</span></i-col>
                                <i-col span="5" class="col-padding"><span>客户名称</span></i-col>
                                <i-col span="3" class="col-padding vertical-before" style="text-align: right"><span>合约金额</span></i-col>
                                <i-col span="3" class="col-padding vertical-before" style="text-align: right"><span>实收金额</span></i-col>
                                <i-col span="6" class="col-padding vertical-before" style="text-align: right"></i-col>
                            </Row>
                        </div>
                        <div class="list-content">
                            <div v-if="contractInfoList.length <= 0" style="font-size: 16px;text-align: center;position: relative;top: 70px;">
                                <Icon type="information-circled" style="color: #bbbbbb"></Icon>
                                <span>暂无数据可显示</span>
                            </div>
                            <Row v-if="contractInfoList.length > 0" class="list-item list-content-item" v-for="(contractInfo,index) in contractInfoList" :style="{'background':index%2==1?'#f6f6f6':''}">
                                <i-col span="3" class="col-name-padding" :title="contractInfo.code"><span>{{contractInfo.code | wordLengthLimit(10)}}</span></i-col>
                                <i-col span="2" class="col-padding">
                                    <div>
                                        <div class="statusName" :title="contractInfo.defName">
                                            <span>{{contractInfo.defName | wordLengthLimit(5)}}</span>
                                        </div>
                                    </div>
                                </i-col>
                                <i-col span="2" class="col-padding"><span>{{contractInfo.status | statusName}}</span></i-col>
                                <i-col span="5" class="col-padding"><span>{{contractInfo.customerName}}</span></i-col>
                                <i-col span="3" class="col-padding vertical-before" style="text-align: right"><span>￥{{contractInfo.price | formatPrice}}</span></i-col>
                                <i-col span="3" class="col-padding vertical-before" style="text-align: right"><span>￥{{contractInfo.collectedAmount | formatPrice}}</span></i-col>
                                <i-col span="6" class="col-padding" style="color: #BBBBBB;padding-left: 20px;font-size: 12px"><span>退款：￥{{contractInfo.returnAmount}}</span><span style="margin-left: 15px">补缴：￥{{contractInfo.compensateAmount}}</span></i-col>
                            </Row>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import ICol from "../../../node_modules/iview/src/components/grid/col.vue";

    export default {
        components: {ICol},

        filters: {
            statusName: function (value) {
                switch (value) {
                    case 'NONE':
                        return "待提交";
                    case 'COMMITTED':
                        return "待审核";
                    case 'APPROVED':
                        return "已核准";
                    case 'SIGNING':
                        return "签约中";
                    case 'SIGNED':
                        return "已签署";
                    case 'TERMINATION':
                        return "已解约";
                }
            },
            wordLengthLimit : function (value,len) {
                if(value && value.length > len){
                    return value.substring(0,len) + "..." ;
                }
                return value;
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
        mounted() {
            let $self = this;
            this.$nextTick(() => {
                if (document.getElementsByClassName('bottom-list').length > 0) {
                    let _tableBody = document.getElementsByClassName('bottom-list')[0];
                    _tableBody.addEventListener('scroll', function (e) {
                        if (this.scrollTop + this.offsetHeight == this.scrollHeight) {
                            $self.current += 1;
                            if($self.flag == "qy"){
                                $self.getSignInfo();
                            }else{
                                $self.getReceivableInfo();
                            }
                        }
                    });
                }
            });
        },
        created: function () {
            this.getCascadeGroup();
            this.initDateRange();
            this.initList();

        },
        data() {
            return{
                flag: "qy",
                way: null,
                field: null,
                dateRange: null,
                cascadeData: [],
                cascadeGroup: [],
                startDate: null,
                endDate: null,
                serviceItemIds: [],
                salesmanList: [],
                tempList: [],
                selectedSaleMan: null,
                current: 1,
                contractInfoList: [],
            }
        },
        methods: {
            getCascadeGroup () {
                this.request({
                    url: "/signCloud/report/getCascadeGroup.do"
                }).then(data=>{
                    if(data){
                        for(var i=0;i<data.length;i++){
                            if(data[i].children && data[i].children.length>0){
                                data[i].children.unshift({value: "0", label: "全部", code: data[i].value});
                            }
                        }
                        this.cascadeGroup = data;
                    }else{
                        this.cascadeGroup = [];
                    }
                })
            },
            initDateRange() {
                this.endDate = new Date();
                this.startDate = new Date();
                if(this.endDate.getMonth()-1 == 1){
                    this.startDate.setMonth(this.endDate.getMonth()-1,this.endDate.getDate()-3);
                }else{
                    this.startDate.setMonth(this.endDate.getMonth()-1,this.endDate.getDate());
                }
                var startTemp = this.startDate.format("yyyy-MM-dd");
                var endTemp = this.endDate.format("yyyy-MM-dd");
                this.dateRange = [startTemp,endTemp];
            },
            initList() {
                if(this.flag == "qy"){
                    this.getSignList();
                }else{
                    this.getReceivableList();
                }
            },
            getSignList() {
                this.request({
                    url: "/signCloud/report/getSignList.do",
                    param: {
                        startDate: this.startDate,
                        endDate: this.endDate,
                        serviceItemIds: this.serviceItemIds,
                    }
                }).then(data=>{
                    if(data){
                        this.salesmanList = data;
                    }else{
                        this.salesmanList = [];
                    }
                })
            },
            getReceivableList () {
                this.request({
                    url: "/signCloud/report/getReceivableList.do",
                    param: {
                        startDate: this.startDate,
                        endDate: this.endDate,
                        serviceItemIds: this.serviceItemIds,
                    }
                }).then(data=>{
                    if(data){
                        this.salesmanList = data;
                    }else{
                        this.salesmanList = [];
                    }
                })
            },
            selectDate (dateArray) {
                if(dateArray.length >1 && dateArray[0] && dateArray[1]){
                    this.startDate = new Date(dateArray[0]);
                    this.endDate = new Date(dateArray[1]);
                }else{
                    this.startDate = null;
                    this.endDate = null;
                }
            },
            selectServiceType (value,selectedData) {
                this.serviceItemIds = [];
                if(value && value.length>1){
                    if(value[1] != "0"){
                        this.serviceItemIds[0] = value[1];
                    }else{
                        for(var i=0;i<this.cascadeGroup.length;i++){
                            if(this.cascadeGroup[i].value == value[0]){
                                for(var j=0;j<this.cascadeGroup[i].children.length;j++){
                                    if(this.cascadeGroup[i].children[j].value != "0"){
                                        this.serviceItemIds.push(this.cascadeGroup[i].children[j].value);
                                    }
                                }
                                break;
                            }
                        }
                    }
                }else{
                    this.serviceItemIds = [];
                }
            },
            //升序
            quickSortASC (temp,field){
                if(temp.length <= 1){
                    return temp;
                }
                var left = [], right = [];
                var middleIndex = Math.floor(temp.length/2);
                var middleItem = temp.splice(middleIndex,1)[0];
                for(var i=0;i<temp.length;i++){
                    if(parseInt(middleItem[field]) > parseInt(temp[i][field])){
                        left.push(temp[i]);
                    }else{
                        right.push(temp[i]);
                    }
                }
                return this.quickSortASC(left,field).concat(middleItem,this.quickSortASC(right,field));
            },
            //降序
            quickSortDESC (temp,field){
                if(temp.length <= 1){
                    return temp;
                }
                var left = [], right = [];
                var middleIndex = Math.floor(temp.length/2);
                var middleItem = temp.splice(middleIndex,1)[0];
                for(var i=0;i<temp.length;i++){
                    if(parseInt(middleItem[field]) < parseInt(temp[i][field])){
                        left.push(temp[i]);
                    }else{
                        right.push(temp[i]);
                    }
                }
                return this.quickSortDESC(left,field).concat(middleItem,this.quickSortDESC(right,field));
            },
            listSort (way,field) {
                this.way = way;
                this.field = field;
                this.tempList = this.salesmanList;
                if(way == "up"){
                    this.salesmanList = this.quickSortASC(this.tempList,field);
                }else if(way == "down"){
                    this.salesmanList = this.quickSortDESC(this.tempList,field);
                }
            },
            selectSaleMan (selectedSaleMan) {
                this.selectedSaleMan = selectedSaleMan;
                this.current = 1;
                if(this.flag == "qy"){
                    this.getSignInfo();
                }else{
                    this.getReceivableInfo();
                }
            },
            exportFile() {
                let url = "/signCloud/contractParameter/exportFile.do";
                if(this.startDate != null && this.endDate != null){
                    url = url + "?startDate=" + this.startDate.format("yyyy-MM-dd") + "&endDate=" + this.endDate.format("yyyy-MM-dd");
                    if(this.serviceItemIds != null){
                        url = url + "&serviceItemIds=" + this.serviceItemIds;
                    }
                }else if(this.serviceItemIds != null){
                    url = url + "?serviceItemIds=" + this.serviceItemIds;
                    if(this.startDate != null && this.endDate != null){
                        url = url + "&startDate=" + this.startDate.format("yyyy-MM-dd") + "&endDate=" + this.endDate.format("yyyy-MM-dd");
                    }
                }
                window.open(url);
            },
            show (val) {
                if(this.flag != val){
                    this.closeBottom();
                    this.flag = val;
                    if(val == "qy"){
                        this.getSignList();
                    }else{
                        this.getReceivableList();
                    }
                }else{
                    return;
                }
            },
            closeBottom () {
                this.current = 1;
                this.contractInfoList = [];
                this.selectedSaleMan = null;
            },
            getSignInfo () {
                if(this.selectedSaleMan){
                    this.request({
                        url: "/signCloud/report/getSignInfo.do",
                        param: {
                            startDate: this.startDate,
                            endDate: this.endDate,
                            serviceItemIds: this.serviceItemIds,
                            userId: this.selectedSaleMan.userId,
                            page: this.current,
                        }
                    }).then(data=>{
                        if(data && data.records){
                            this.contractInfoList = this.contractInfoList.concat(data.records);
                        }else{
                            this.contractInfoList = [];
                        }
                        this.current = data.current;
                    })
                }
            },
            getReceivableInfo () {
                if(this.selectedSaleMan){
                    this.request({
                        url: "/signCloud/report/getReceivableInfo.do",
                        param: {
                            startDate: this.startDate,
                            endDate: this.endDate,
                            serviceItemIds: this.serviceItemIds,
                            userId: this.selectedSaleMan.userId,
                            page: this.current,
                        }
                    }).then(data=>{
                        if(data && data.records){
                            this.contractInfoList = this.contractInfoList.concat(data.records);
                        }else{
                            this.contractInfoList = [];
                        }
                        this.current = data.current;
                    })
                }
            },
        }
    }
</script>