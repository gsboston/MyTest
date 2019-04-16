<template>
    <div class="container">
        <div class="panel">
            <div class="tab-head">
                <div class="tab-panel clearFix">
                    <div class="tab-panel-left">
                        <div :class="isNoneActive" @click="switchState('NONE')">待派单</div>
                        <div :class="isAlreadyActive" @click="switchState('ALREADY')">已派单</div>
                        <Button type="ghost" class="refresh-btn" icon="loop" @click="refresh">刷新</Button>
                    </div>
                    <Input style="width: 260px;" icon="ios-search" :maxlength="20" v-model="inputVal" placeholder="客户名称/合约编号/服务组织名称"/>
                    <DatePicker v-if="status == 'ALREADY'" type="daterange" :value="dateRange" placement="bottom-end" placeholder="查询起止时间" :editable="false" @on-change="changeDateRange" style="width: 260px;margin: 0 20px;"></DatePicker>
                    <Button v-if="status == 'ALREADY'" type="primary" @click="refresh">查询</Button>
                </div>
            </div>
        </div>
        <div class="left">
            <component ref="contract" is="SDContractList" :inputVal="inputVal" :dateRange="dateRange" :status="status"></component>
        </div>
        <div class="center" ref="content"></div>
    </div>
</template>

<script>
    import SDContractList from "./SDContractList";
    import SDContractContent from "./SDContractContent";
    const ROUTER_STATUS = "sign_cloud_router_status";

    export default {
        components: {
            SDContractList,
            SDContractContent
        },
        data () {
            return {
                contractId: null,
                contract: {},
                inputVal: null,
                status: 'NONE',
                dateRange: []
            }
        },
        created () {
            window._signCloud = this;
            let endDate = new Date();
            let startDate = new Date();
            startDate.setDate(startDate.getDate() - 6);
            this.dateRange = [startDate, endDate];
            this.$api.init();
        },
        mounted () {
            this.$api.openRightPage = this.openRight;
            this.$api.refreshSDPage = this.refresh;
        },
        methods: {
            openRight (code, config) {
                this.$refs.content.innerHTML = "";
                let comp = this.getPage(code, config);
                if(comp) {
                    this.$refs.content.appendChild(comp.$el);
                    comp.jumpTarget && comp.jumpTarget();
                }
                this.setRouterStatus(code, config);
            },
            closeRight () {
                this.$refs.content.innerHTML = "";
            },
            setRouterStatus (code, config) {
                let routerStatus = {
                    code: code,
                    config: config
                };
                sessionStorage.setItem(ROUTER_STATUS, JSON.stringify(routerStatus));
            },
            refresh() {
                this.$refs['contract'].search();
            },
            switchState(state) {
                this.status = state;
            },
            changeDateRange(date) {
                this.dateRange = [];
                if (date[0]) {
                    if (!String.isNullOrBlank(date[0])) {
                        this.dateRange[0] = date[0];
                    }
                }
                if (date[1]) {
                    if (!String.isNullOrBlank(date[1])) {
                        this.dateRange[1] = date[1];
                    }
                }
            }
        },
        computed: {
            isNoneActive() {
                if (this.status == 'NONE') {
                    return 'tab-item active';
                }else {
                    return 'tab-item';
                }
            },
            isAlreadyActive() {
                if (this.status == 'ALREADY') {
                    return 'tab-item active';
                }else {
                    return 'tab-item';
                }
            }
        }
    }
</script>

<style scoped>
    .container {
        background: #f6f6f6;
    }
    .panel {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 50px;
        background: white;
        border-bottom: solid 1px #dddee1;
    }
    .left {
        position: absolute;
        top: 50px;
        left: 0;
        bottom: 0;
        width: 300px;
        padding-bottom: 10px;
        border-right: solid 1px #dddee1;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .center {
        position: absolute;
        top: 50px;
        left: 300px;
        right: 0;
        bottom: 0;
        background: #f7f7f7;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .tab-head{
        position: relative;
        /*height:50px;*/
        border-bottom: solid 1px #f6f6f6;
        padding: 8px 15px;
    }
    .tab-panel > .tab-panel-left {
        display: inline-block;
        width: 285px;
    }
    .tab-panel > .tab-panel-left .tab-item {
        position: relative;
        display: inline-block;
        line-height: 32px;
        font-size: 14px;
        color: #333;
        cursor: pointer;
    }
    .tab-panel > .tab-panel-left .tab-item:nth-child(2) {
        margin-left: 10px;
        padding-left: 10px;
    }
    .tab-panel > .tab-panel-left .tab-item.active {
        color: #59b399;
        font-weight: 700;
    }
    .tab-panel > .tab-panel-left .tab-item:nth-child(2):before {
        content: "";
        position: absolute;
        top: 7px;
        left: 0;
        bottom: 7px;
        width: 1px;
        background: #e5e5e5;
    }
    .tab-panel > .ivu-input-wrapper {

    }

    .tab-panel .refresh-btn {
        display: inline-block;
        float: right;
        height: 32px;
        border: 0;
        padding: 0;
        font-size: 14px;
        font-weight: normal;
        margin-right: 10px;
    }

    .tab-panel .refresh-btn >>> .ivu-icon {
        transform: rotate(90deg);
    }

    .ivu-date-picker >>> .ivu-input[readonly] {
        cursor: initial;
    }
</style>