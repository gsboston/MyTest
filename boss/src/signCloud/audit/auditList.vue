<template>
    <div id="ContractView">
        <div class="tab-head">
            <div class="tab-panel clearFix">
                <div class="tab-item" :class="{active:this.approvalStatus == 'PENDING'}" @click="changeStatus('PENDING')">待审核</div>
                <div class="tab-item" :class="{active:this.approvalStatus == 'ALREADY'}" @click="changeStatus('ALREADY')">已审核</div>
                <Input style="width: 180px; height: 28px;" icon="ios-search" :maxlength="20" @on-enter="search" @on-click="search" v-model="inputVal" placeholder="甲方/合约编号/创建人" />
            </div>
        </div>
        <div class="contract-list" style="top: 50px">
            <div class="contract-item" :class="{selected: item == selectedItem}" v-for="(item, index) in items" :key="index">
                <!--trigger="hover" placement="right" :transfer="true"-->
                <div v-if="item.audit_type == 'CONTRACT'" @click="selectItem(item)" >
                    <div class="contract-item-name">
                        <p>{{item.subject_name}}</p>
                    </div>
                    <div style="margin-top: 7px;height: 25px;line-height: 25px;">
                        <div class="contract-item-price">
                            <p>{{item.contract_code}}</p>
                        </div>
                        <div class="contract-item-service-type" :value="item.defCode">
                            <span>{{item.item_name | subStr}}</span>
                        </div>
                        <div class="contract-item-price" style="float: right;" v-if="item.contract_price">
                            <span>￥{{item.contract_price}}</span>
                        </div>
                    </div>
                </div>
                <div v-else @click="selectItem(item)" >
                    <div class="contract-item-name">
                        <p>{{item.subject_name}}</p>
                    </div>
                    <div style="margin-top: 7px;height: 25px;line-height: 25px;">
                        <div class="contract-item-price">
                            <p>{{ item.salesman_name }}</p>
                        </div>
                        <div class="contract-item-change-type" :value="item.defCode">
                            <span>{{ item.audit_type == 'SUBJECT' ? '主体变更' : '内容变更' }}</span>
                        </div>
                    </div>
                </div>
                <!--<div slot="content">-->
                    <!--<div class="contract-info">-->
                        <!--<p>-->
                            <!--<span>合约编号：</span>-->
                            <!--<span class="item-text">{{item.contract_code}}</span>-->
                        <!--</p>-->
                        <!--<p>-->
                            <!--<span>业务员：</span>-->
                            <!--<span class="item-text">{{ item.salesman_name }}</span>-->
                        <!--</p>-->
                        <!--<p>-->
                            <!--<span>联系电话：</span>-->
                            <!--<span class="item-text">{{ item.salesman_phone }}</span>-->
                        <!--</p>-->
                        <!--<button class="custom-button" style="cursor: pointer;" @click="preview(item)">查看原合约</button>-->
                    <!--</div>-->
                <!--</div>-->
            </div>
        </div>
        <Page v-if="items.length > 0" class="contract-page" size="small" :total="total" :current="current" @on-change="changePage"></Page>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                items: [],
                total: 0,
                current: 1,
                inputVal: null,
                selectedItem: null,
                tempContractId: null,
                approvalStatus: 'PENDING'
            }
        },
        filters: {
            subStr(value) {
                if (value) {
                    value = value.substring(0,2);
                }
                return value;
            }
        },
        created () {
            this.$api.auditSearch = this.search;
        },
        mounted () {
            this.search(null);
        },
        methods: {
            changePage (current) {
                this.current = current;
                this.search(null);
            },
            changeStatus (status) {
                this.approvalStatus = status;
                this.current = 1;
                this.inputVal = null;
                this.search(null);
            },
            search (contractId) {
                this.tempContractId = contractId;
                this.request({
                    url: "/signCloud/contractView/pendingAuditList.do",
                    data:{
                        page:this.current,
                        nameOrCode:this.inputVal,
                        status: this.approvalStatus
                    }
                }).then(items => {
                    this.items = items.records;
                    this.current = items.current;
                    this.total = items.total;
                    if(window._jumpSignCloudMode) {
                        delete window._jumpSignCloudMode;
                        return;
                    }
                    if(Array.notEmpty(this.items)){
                        //跳转到新增的合约查看页
                        if(this.tempContractId == null){
                            this.selectItem(items.records[0]);
                        }else{
                            for(var contractItem of this.items){
                                if(contractItem.id == contractId){
                                    this.selectItem(contractItem);
                                }
                            }
                        }
                    }else {
                        this.$api.openRight("noContract");
                    }
                });
            },
            //根据选中合约，跳转到对应的合约详情页
            selectItem (item) {
                this.selectedItem = item;
                if(item.audit_type == "CONTRACT"){//跳转到合约审核页面
                    item.defCode = item.def_code;
                    this.$api.openRight("audit",{
                        props: {
                            contractInfo: item
                        }
                    })
                }else {
                    this.request({
                        url: "/signCloud/contractDetails/getChangeInfoById.do",
                        data: {
                            id: item.id
                        }
                    }).then(data => {
                        this.$api.openRight("changeAudit",{
                            props: {
                                contractId: data.contractAgrement.signedContractId,
                                changeContractId: item.id,
                                changeType: item.audit_type,
                                contractNum: item.contract_code,
                                optUserName: item.salesman_name,
                                unsignedFile: item.unsigned_file
                            }
                        })
                    });
                }
            },
            preview(item) {
                if(item.status === "APPROVED") {
                    if (item.unsignedFile) {
                        window.open('/ossController/oss/file.do?id=' + item.unsignedFile);
                    }else {
                        this.$Message.error('没有合同文件！');
                    }
                }else {
                    if (item.signed_file) {
                        window.open('/ossController/oss/file.do?id=' + item.signed_file);
                    }else {
                        if (item.unsigned_file) {
                            window.open('/ossController/oss/file.do?id=' + item.unsigned_file);
                        }else {
                            this.$Message.error('没有合同文件！');
                        }
                    }

                }
            }
        }
    };
</script>

<style scoped>
    .tab-head{
        position: relative;
        width: 300px;
        height:50px;
        border-bottom: solid 1px #f6f6f6;
        padding: 8px 5px;
    }
    .tab-panel > .tab-item {
        position: relative;
        float: left;
        line-height: 32px;
        font-size: 14px;
        color: #333;
        cursor: pointer;
    }
    .tab-panel > .tab-item:nth-child(2) {
        margin-left: 10px;
        padding-left: 10px;
    }
    .tab-panel > .tab-item.active {
        color: #59b399;
        font-weight: 700;
    }
    .tab-panel > .tab-item:nth-child(2):before {
        content: "";
        position: absolute;
        top: 7px;
        left: 0;
        bottom: 7px;
        width: 1px;
        background: #e5e5e5;
    }
    .tab-panel > .ivu-input-wrapper {
        float: right;
    }
    .agreement-state-item > span:first-child {
        color: #2b2b2b;
        font-weight: 700;
        margin-right: 15px;
    }
    .agreement-state-item > .ivu-icon {
        float: right;
        font-size: 14px;
        line-height: 20px;
        color: #aaa;
        transition: transform .2s ease;
    }
    .agreement-state-item > .ivu-icon.expand {
        transform: rotate(-90deg);
    }
    .agreement-state-item > .ivu-tag {
        height: 18px;
        margin: 0 7px 0 0;
        line-height: 16px;
        color: #999;
        border: none;
    }
    .agreement-state-item > .state-item {
        color: #999;
        margin-right: 10px;
        cursor: pointer;
    }
    .agreement-state-item > .state-item.selected {
        color: #59b399;
    }
    .contract-item >>> .ivu-poptip-rel {
        display: initial;
    }
    .contract-info {
        min-width: 262px;
        padding: 10px;
        color: rgb(135, 135, 135);
        font-size: 13px;
        font-weight: normal;
    }
    .contract-info p {
        line-height: 19px;
        margin-bottom: 5px;
    }
    .contract-info p span:first-child {
        min-width: 70px;
        display: inline-block;
    }
    .contract-item {
        position: relative;
        padding: 12px 20px;
        color: black;
        font-weight: 700;
        border-bottom: 1px solid #f6f6f6;
        width: 100%;
    }
    .contract-item.selected {
        color: #59b399 !important;
        background-color: #f6faf9 !important;
    }
    .contract-item:hover {
        background: #f2f6f9;
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
    .contract-item-name{
        font-size: 14px;
        color: #333;
        font-weight: 700;
        line-height: 24px;
    }
    .contract-item.selected .contract-item-name{
        color: #59b399;
    }
    .contract-item-price{
        display: inline-block;
        font-size: 14px;
        color: #999;
        line-height: 18px;
        font-weight: normal;
    }
    .contract-item.selected .contract-item-price{
        color: #59b399;
    }
    .contract-item-change-type{
        display: inline-block;
        float: right;
        background-color: #FFF;
        font-size: 12px;
        color: #59b399;
        width: 75px;
        height: 25px;
        line-height: 24px;
        border-radius: 14px;
        text-align: center;
        border: 1px solid #59b399;
    }
    .contract-item.selected .contract-item-change-type{
        color: #FFFFFF;
        background-color: #59b399;
    }
    .contract-item-service-type{
        display: inline-block;
        float: right;
        background-color: #ffc172;
        border-radius: 4px;
        padding: 1px 5px 0px 5px;
        font-size: 12px;
        color: white;
        line-height: 18px;
        margin: 0 8px;
    }
    .contract-item.selected .contract-item-service-type{
        background-color: #59b399;
    }
    .contract-page {
        padding: 5px 15px;
        text-align: right;
    }
    .ivu-page.mini >>> .ivu-page-next, .ivu-page.mini >>> .ivu-page-prev {
        margin: 0;
        min-width: 12px;
        height: 24px;
        line-height: 24px;
        border: 0;
    }
    .ivu-page.mini >>> .ivu-page-item-jump-next, .ivu-page.mini >>> .ivu-page-item-jump-prev, .ivu-page-next, .ivu-page-prev {
        display: inline-block;
        vertical-align: middle;
        min-width: 22px;
        height: 32px;
        line-height: 30px;
        list-style: none;
        text-align: center;
        cursor: pointer;
        color: #666;
        font-family: Arial;
        border-radius: 4px;
        transition: all .2s ease-in-out;
    }
    .contract-rejected > span{
        position: absolute;
        right: 5px;
        top: 2px;
        font-size: 14px;
        color: white;
    }

    .custom-button {
        float: right;
        background: transparent;
        color: rgb(135, 135, 135);
        border: 1px solid transparent;
        border-bottom: 1px solid rgb(135, 135, 135);
        border-radius: 0;
    }

</style>

<style>
    #ContractView .search-input input {
        border: transparent;
    }
    div[data-transfer="true"][x-placement="right"].ivu-poptip-popper {
        min-width: 262px;
        padding: 10px;
        left: 36px;
    }
    div[data-transfer="true"][x-placement="right"].ivu-poptip-popper .ivu-poptip-arrow {
        bottom: 5px;
    }
    div[data-transfer="true"][x-placement="right"].ivu-poptip-popper .ivu-poptip-arrow::after {
        border-right-color: rgb(246, 250, 249);
    }
    div[data-transfer="true"][x-placement="right"].ivu-poptip-popper .ivu-poptip-inner {
        background-color: rgb(246, 250, 249);
        border: 1px solid rgb(217, 217, 217);
    }
</style>