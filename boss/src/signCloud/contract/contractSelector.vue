<template>
    <div class="parent-container">
        <!-- 筛选条件 -->
        <div class="tab-head">
            <div class="tab-panel clearFix">
                <Form :label-width="100">
                    <Row :gutter="32">
                        <i-col span="6">
                            <FormItem label="服务群组：">
                                <Select v-model="serviceGroupIndex" @on-change="changeServiceGroup" placeholder="全部">
                                    <Option value="">全部</Option>
                                    <Option v-for="item in serviceGroupData" :value="item.code" :key="item.code">{{ item.name }}</Option>
                                </Select>
                            </FormItem>
                        </i-col>
                        <i-col span="6">
                            <FormItem label="服务：" :label-width="60">
                                <Select v-model="serviceCode" placeholder="全部">
                                    <Option value="">全部</Option>
                                    <Option v-for="item in serviceData" :value="item.code" :key="item.code">{{ item.name }}</Option>
                                </Select>
                            </FormItem>
                        </i-col>
                        <i-col span="6">
                            <FormItem label="合约名称：">
                                <Input class="search-contract" style="width: 100%;" icon="ios-close" :maxlength="20" v-model="contractName" placeholder="合约名称" @on-click="clearContractName"/>
                            </FormItem>
                        </i-col>
                        <i-col span="6">
                            <Button size="small" class="btn-search" @click="getContractDef">搜索</Button>
                        </i-col>
                    </Row>
                </Form>
            </div>
        </div>

        <!-- 合约列表 -->
        <div v-if="items.length > 0" class="container clearFix">
            <div class="contract-panel" v-for="(item, index) in items" :key="index">
                <div class="contract" @click="selectHandler(item)"></div>
                <div class="contract-name">{{item.name}}</div>
            </div>
        </div>
        <div v-else class="nodata">
            <img src="../image/no-contract.png" alt="">
            <div class="nodataText">您搜索的合约未找到！</div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            defaultItems: null,
            defaultInfo: null,
            boId: null,
            hxId: null,
        },
        data () {
            return {
                items: [],
                serviceGroupCode: '',
                serviceGroupData: [],
                serviceGroupIndex: 0,
                serviceCode: '',
                serviceData: [],
                contractName: '',
                selectedGroupId: null,
            };
        },
        created: function () {
            if(Array.notEmpty(this.defaultItems)) {
                this.items = this.defaultItems;
            }else {
                this.getContractDef();
            }
            this.getServiceGroupData();
        },
        methods: {
            selectHandler (item) {
                this.$api.jump("contractBuilder", {
                    contractId: "",
                    contractType: item.code,
                    isEditable: true,
                    isInit: true,
                    defId: item.id,
                    defaultInfo: this.defaultInfo,
                    contractName: item.name,
                    boId: this.boId,
                    hxId: this.hxId,
                });
            },
            getContractDef (){
                this.request({
                    url: "/signCloud/contractSelector/getContractDef.do",
                    param: {
                        serviceItemCode: this.serviceCode,
                        itemServiceCode: this.serviceGroupCode,
                        name: this.contractName
                    }
                }).then(items => {
                    if (items) {
                        this.items = items.records;
                    }else {
                        this.items = [];
                    }
                });
            },
            getServiceGroupData () {
                this.request({
                    url: '/systemManage/bd/getAllGroupList.do'
                }).then(data => {
                    this.serviceGroupData = data;
                })
            },
            getServiceData () {
                this.request({
                    url: '/systemManage/bd/getServiceItemByGroupId.do',
                    param: {
                        groupId: this.selectedGroupId
                    }
                }).then(data => {
                    this.serviceData = data;
                })
            },
            changeServiceGroup(index) {
                this.serviceGroupIndex = index;
                if (index > 0) {
                    this.serviceGroupCode = this.serviceGroupData[index - 1].code;
                    this.selectedGroupId = this.serviceGroupData[index - 1].id;
                    this.getServiceData();
                }else {
                    this.serviceGroupCode = '';
                    this.selectedGroupId = null;
                    this.serviceData = [];
                    this.serviceCode = '';
                }
            },
            clearContractName() {
                this.contractName = '';
            }
        }
    }
</script>

<style scoped>
    .parent-container {
        position: relative;
        min-height: 100%;
        background: #f6f6f6;
    }
    .container {
        position: relative;
        height: 100%;
        padding: 65px 20px 0;
        background: #f6f6f6;
    }
    .contract-panel {
        position: relative;
        float: left;
        width: 138px;
        height: 244px;
        margin: 0 18px;
        /*padding: 10px 30px 0 30px;*/
    }
    .contract {
        position: relative;
        width: 100%;
        height: 180px;
        background-image: url("./image/contract-bg.png");
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;
    }
    .contract-name {
        font-family:"Helvetica Neue",Helvetica,Arial,"Microsoft Yahei","Hiragino Sans GB","Heiti SC","WenQuanYi Micro Hei",sans-serif;
        font-size: 14px;
        /*line-height: 54px;*/
        font-weight: 700;
        text-align: center;
        margin: 10px 0;
    }
    .contract-panel:hover > .contract:after {
        content: "创建合约";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        padding-top: 146px;
        line-height: 34px;
        font-weight: 700;
        font-size: 14px;
        color: white;
        border: solid 2px #59b399;
        border-bottom-width: 34px;
        text-align: center;
        cursor: pointer;
    }

    .tab-head{
        position: fixed;
        width: 100%;
        height:50px;
        top: 50px;
        border-bottom: solid 1px #f6f6f6;
        padding: 8px 15px;
        background: #FFF;
        z-index: 2;
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

    .tab-head .ivu-form-item {
        margin: 0;
    }

    .btn-search {
        line-height: 27px;
        padding: 2px 18px;
    }

    .ivu-form >>> .ivu-form-item-label {
        font-weight: 600;
    }

    .nodata {
        padding: 285px 0 65px;
        text-align: center;
    }

    .nodataText {
        margin: 30px auto;
        font-size: 16px;
        color: #727375;
    }

    .search-contract >>> .ivu-icon-ios-close {
        cursor: pointer;
    }
</style>
