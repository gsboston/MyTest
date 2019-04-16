<template>
    <div style="padding: 10px 15px;">
        <Row>
            <Form class="invoice-form" ref="form" :model="SDInfo" label-position="left" :label-width="120">
                <i-col span="24">
                    <Collapse v-model="activeInfoCollapse">
                        <Panel name="info">
                            <div>
                                <span>客户相关信息</span>
                                <Icon class="collapse-icon" :type="collapseStyle"></Icon>
                            </div>
                            <i-col span="23" slot="content">
                                <FormItem class="s-price" label="合约编号">
                                    <span class="org-name">{{ contractInfo.code }}</span>
                                    <Button class="check-button" size="small" style="margin-left: 50px;">{{ contractInfo.serviceType }}</Button>
                                </FormItem>
                                <FormItem class="s-price customer-name" label="客户名称">
                                    <Tooltip :content="contractInfo.subjectAName" class="tips" placement="bottom">
                                        {{ contractInfo.subjectAName }}
                                    </Tooltip>
                                    <Button class="check-button" size="small" style="margin-left: 20px;height: 24px;">{{ contractInfo.customerType == 'PERSON' ? '自然人' : '企业' }}</Button>
                                </FormItem>
                                <FormItem class="s-price" label="证件号码">
                                    <span class="org-name">{{ contractInfo.customerNumber }}</span>
                                </FormItem>
                                <i-col span="12">
                                    <FormItem class="s-price" label="联系人">
                                        <span class="org-name">{{ contractInfo.contactName }}</span>
                                    </FormItem>
                                </i-col>
                                <i-col span="12">
                                    <FormItem class="s-price" label="联系电话">
                                        <span class="org-name">{{ contractInfo.contactPhone }}</span>
                                    </FormItem>
                                </i-col>
                            </i-col>
                        </Panel>
                    </Collapse>
                </i-col>

                <FormItem label="服务单信息" class="title" style="margin-bottom: 10px;text-align: left;"></FormItem>
                <!-- 编辑信息 -->
                <i-col span="23">
                    <i-col span="24">
                        <FormItem label="服务单编号">
                            <span>{{ SDInfo.code }}</span>
                        </FormItem>
                    </i-col>
                    <i-col span="24">
                        <FormItem label="服务单类型">
                            <Button class="check-button active" size="small">{{ SDInfo.billDefName }}</Button>
                        </FormItem>
                    </i-col>
                    <i-col span="24">
                        <FormItem label="客户经理">
                            <span>{{ SDInfo.managerUserName }}</span>
                        </FormItem>
                    </i-col>
                    <i-col span="24">
                        <FormItem label="派单方">
                            <span>{{ SDInfo.saleOrgName }}</span>
                        </FormItem>
                    </i-col>
                    <i-col span="24">
                        <Form-item label="服务频率">
                            <div>
                                <i-button v-if="SDInfo.serviceFrequency == 'DISPOSABLE'" class="check-button" size="small">一次性</i-button>
                                <i-button v-else class="check-button" size="small">周期性</i-button>
                            </div>
                        </Form-item>
                    </i-col>
                </i-col>

                <!-- 服务单模版 -->
                <i-col span="23" v-if="isShow">
                    <component is="ServiceBuilder" :serviceType="serviceType" :isEdit="false" :signedDate="contractInfo.signedTime" :serviceInfo="SDInfo"></component>
                </i-col>

                <i-col span="24">
                    <Collapse v-model="activeFileCollapse" :accordion="true" class="else-info">
                        <Panel name="1">
                            <div>
                                <span>资料清单</span>
                                <Icon class="collapse-icon" :type="activeFileCollapse ? (activeFileCollapse[0] == '1' ? 'chevron-right' : 'chevron-down') : 'chevron-down'"></Icon>
                            </div>
                            <Row slot="content">
                                <i-col span="24">
                                    <SDFileList :billId="SDInfo.id"></SDFileList>
                                </i-col>
                            </Row>
                        </Panel>

                        <Panel name="2">
                            <div>
                                <span>派单信息</span>
                                <Icon class="collapse-icon" :type="activeFileCollapse ? (activeFileCollapse[0] == '2' ? 'chevron-right' : 'chevron-down') : 'chevron-down'"></Icon>
                            </div>
                            <Row slot="content">
                                <i-col span="23">
                                    <i-col span="24">
                                        <FormItem label="服务方式">
                                            <Button class="check-button active" size="small">{{ SDInfo.dispatchType == 'EPIBOLY' ? '外包服务' : '自有服务' }}</Button>
                                        </FormItem>
                                    </i-col>
                                </i-col>
                                <i-col span="23" v-if="SDInfo.dispatchType == 'EPIBOLY'">
                                    <i-col span="24">
                                        <FormItem label="服务方">
                                            <span>{{ SDInfo.serveOrgName }}</span>
                                        </FormItem>
                                    </i-col>
                                    <i-col span="24">
                                        <FormItem label="服务结算价">
                                            <span>￥{{ SDInfo.settlementPrice ? SDInfo.settlementPrice : '0.00' }}</span>
                                        </FormItem>
                                    </i-col>
                                </i-col>

                                <i-col span="23" v-else>
                                    <i-col span="24">
                                        <FormItem label="服务负责人">
                                            <span>{{ SDInfo.serveLeaderName }}</span>
                                        </FormItem>
                                    </i-col>
                                    <i-col span="24">
                                        <FormItem label="服务方">
                                            <span>{{ SDInfo.saleOrgName }}</span>
                                        </FormItem>
                                    </i-col>
                                </i-col>

                                <i-col span="23">
                                    <i-col span="24">
                                        <FormItem label="服务说明" class="desc">
                                            <pre>{{ SDInfo.dispatchRemark | defaultShow }}</pre>
                                        </FormItem>
                                    </i-col>
                                </i-col>
                            </Row>
                        </Panel>

                        <Panel name="3">
                            <div>
                                <span>派单记录</span>
                                <Icon class="collapse-icon" :type="activeFileCollapse ? (activeFileCollapse[0] == '3' ? 'chevron-right' : 'chevron-down') : 'chevron-down'"></Icon>
                            </div>
                            <div slot="content" v-if="SDInfo.statusRecordList">
                                <Timeline class="SD-list">
                                    <TimelineItem v-for="(item, index) in SDInfo.statusRecordList" :key="index">
                                        <p class="time">
                                            <span>
                                                {{ item.operatorTime | formatTime}}
                                            </span>
                                            <span>{{ item.operatorTime | formatDate}}</span>
                                        </p>
                                        <div class="content">
                                            <div>
                                                <p style="margin-bottom: 10px;">
                                                    <span style="min-width: 120px;padding-left: 0;display: inline-block;">{{ item.operatorName }}</span>
                                                    <span>{{ item.operatorUserName }}</span>
                                                </p>
                                                <p>
                                                    {{ item.remark }}
                                                </p>
                                            </div>
                                        </div>
                                    </TimelineItem>
                                </Timeline>
                            </div>
                        </Panel>
                    </Collapse>
                </i-col>
            </Form>
        </Row>
    </div>
</template>

<script>
    import ServiceBuilder from '../service/serviceBuilder';
    import SDFileList from './SDFileList';

    export default {
        data() {
            return {
                SDInfo: {
                    statusRecordList: null
                },
                isNormalInvoice: true,
                contractType: 'PERSON',
                serviceType: '自有服务',
                activeCollapse: ['1'],
                activeInfoCollapse: ['info'],
                isShow: false,
                serviceType: null,
                activeFileCollapse: []
            }
        },
        filters: {
            formatDate(time) {
                var date = new Date(time);
                return date.format('MM-dd');
            },
            formatTime(time) {
                var date = new Date(time);
                return date.format('hh:mm');
            },
            defaultShow(val) {
                if (!val || String.isNullOrBlank(val)) {
                    return '暂无说明';
                }
                return val;
            }
        },
        computed: {
            collapseStyle() {
                if (Array.isEmpty(this.activeCollapse)) {
                    return 'chevron-right';
                }else {
                    return 'chevron-down';
                }
            }
        },
        props: {
            id: null,
            contractInfo: null
        },
        created() {
            this.initSDInfo();
        },
        methods: {
            initSDInfo() {
                this.request({
                    url: '/serviceCloud/serviceDispatch/SDInfo.do',
                    param: {
                        id: this.id
                    }
                }).then(data => {
                    this.SDInfo = data;
                    if (data.inputTemplateId) {
                        this.isShow = true;
                        this.serviceType = data.inputTemplateId;
                        // this.serviceType = 'ZZQ';
                    }
                });
            }
        },
        components: {
            ServiceBuilder,
            SDFileList
        }
    }
</script>

<style scoped>
    .invoice-form .ivu-col-span-23 {
        padding: 0 25px;
    }

    .invoice-form .ivu-form-item.title {
        padding-left: 0;
    }

    .invoice-form >>> .ivu-form-item-label {
        color: #5D5D5D;
        font-weight: 600;
        line-height: 16px;
        font-size: 14px;
        /*padding-left: 17px;*/
    }

    .invoice-form .title >>> .ivu-form-item-label {
        text-align: left;
        font-size: 16px;
        color: #000;
        font-weight: 700;
        padding-left: 5px;
    }

    .invoice-form .normal >>> .ivu-form-item-label {
        text-align: right;
    }

    .invoice-form >>> .ivu-input-group-append, .invoice-form >>> .ivu-input-group-prepend {
        background-color: transparent;
        border: 0;
        border-bottom: 1px solid #eee;
        border-radius: 0;
    }

    .invoice-form .invoice-info span:first-child {
        margin-right: 20px;
    }

    .invoice-form .invoiced-price span {
        font-size: 12px;
    }

    .invoice-form .check-button {
        background-color: #FFF;
        border: 1px solid #54B499;
        border-radius: 4px;
        color: #54B499;
        font-size: 12px;
        /*padding: 6px 23px;*/
    }

    .invoice-form .check-button.active {
        background-color: #54B499;
        color: #FFF;
    }

    .invoice-info .invoice-empty-list {
        height: 84px;
        text-align: center;
        color: #333;
        font-size: 16px;
        line-height: 84px;
    }

    .invoice-form >>> input {
        border-radius: 0;
        height: 36px;
    }

    .invoice-form .price >>> input,  .invoice-form >>> input[readonly]{
        border: 1px solid transparent;
        border-bottom: 1px solid #eee;
        border-radius: 0;
    }

    .invoice-form .date >>> input {
        border: 1px solid #eee;
    }

    .invoice-form .saveBtn {
        text-align: center;
        margin: 10px 0;
    }

    .invoice-form .saveBtn button {
        padding: 6px 45px;
    }

    .invoice-form .ivu-select-single >>> .ivu-select-selection {
        height: 36px;
        border-radius: 0;
    }

    .invoice-form .ivu-select-single >>> .ivu-select-selection span {
        height: 34px;
        line-height: 34px;
    }

    .invoice-form >>> .ivu-poptip-body {
        padding: 0;
    }

    .invoice-form >>> .ivu-form-item-error-tip {
        top: 36px;
    }

    /*.invoice-form >>> .ivu-select-dropdown {*/
        /*top: initial!important;*/
        /*bottom: initial!important;*/
        /*left: initial!important;*/
        /*right: initial!important;*/
    /*}*/

    .invoice-form .org-name {
        /*display: inline-block;*/
        line-height: 36px;
        font-size: 14px;
        color: #a1a1a1;
        font-weight: normal;
    }

    .invoice-form >>> .ivu-form-item-content {
        line-height: 36px;
        font-size: 14px;
        color: #a1a1a1;
        font-weight: normal;
    }

    .invoice-form .service-type >>> .ivu-form-item-content{
        margin-left: 22px!important;
    }

    .invoice-form .service-type >>> .ivu-radio-wrapper {
        font-size: 14px;
    }

    .desc {
        word-wrap: break-word;
        word-break: break-all;
        overflow: hidden;
    }

    .ivu-form-item {
        margin-bottom: 10px;
    }

    .ivu-collapse {
        border: 0;
    }

    .ivu-collapse >>> .ivu-collapse-header {
        padding-left: 5px;
    }

    .ivu-collapse >>> .ivu-collapse-header .ivu-icon.ivu-icon-arrow-right-b {
        display: none!important;
    }

    .ivu-collapse >>> .ivu-collapse-header span {
        font-size: 16px;
        color: #000;
        font-weight: 700;
    }

    .ivu-collapse >>> .ivu-collapse-header .collapse-icon {
        float: right;
        line-height: 38px;
        margin-right: 20px;
    }

    .SD-list .time {
        width: auto;
        margin-right: 10px;
        margin-bottom: 14px;
    }

    .SD-list .content{
        position: relative;
        display: flex;
        width: 100%;
        min-height: 84px;
        background: #FFF;
        padding: 0 0 0 10px;
        align-items: baseline;
        color: #333;
        font-size: 14px;
    }

    .SD-list .content>div {
        line-height: 23px;
        width: 100%;
        white-space: nowrap;
    }

    .SD-list .content>div p{
        white-space: normal;
        color: #AAAAAA;
        font-size: 12px;
    }

    .SD-list .content>div p:first-child{
        font-size: 14px;
        color: #878787;
    }

    .SD-list .content>div p:first-child span{
        padding-left: 30px;
    }

    .SD-list >>> .ivu-timeline-item-head {
        width: 12px;
        height: 12px;
    }

    .SD-list >>> .ivu-timeline-item-head-blue {
        background: #59b399;
        border-color: #59b399;
        color: #59b399;
        left: 60px;
    }

    .SD-list >>> .ivu-timeline-item-content {
        display: block;
    }

    .SD-list >>> .ivu-timeline-item-content {
        padding: 1px 1px 10px 84px;
    }

    .SD-list >>> .ivu-timeline-item-content > p {
        position: absolute;
        left: 0;
        width: 60px;
        font-size: 14px;
        color: #757575;
        text-align: center;
        margin: 0;
    }

    .SD-list >>> .ivu-timeline-item-content > p span {
        display: inline-block;
        width: 100%;
        font-size: 14px;
        color: #757575;
    }

    .SD-list >>> .ivu-timeline-item-content > p span:last-child {
        font-size: 12px;
        color: #AAAAAA;
    }

    .SD-list .ivu-timeline-item >>> .ivu-timeline-item-tail {
        left: 66px;
    }

    .SD-list .ivu-timeline-item {
        padding: 0;
    }

    .ivu-collapse >>> .ivu-collapse-content {
        padding: 0;
    }

    .ivu-collapse >>> .ivu-collapse-content .ivu-form-item{
        margin-bottom: 0;
    }

    .invoice-form .ivu-form-item {
         margin-bottom: 15px;
    }

    .invoice-form pre {
        font-family: Helvetica Neue,Helvetica,Arial,Microsoft Yahei,Hiragino Sans GB,Heiti SC,WenQuanYi Micro Hei,sans-serif!important;
        white-space: pre-wrap;
        margin: 0;
    }

    .ivu-collapse >>> .ivu-collapse-content > .ivu-collapse-content-box {
        padding-top: 13px;
        padding-bottom: 13px;
    }

    .else-info {
        background-color: #FFF;
    }

    .else-info .ivu-collapse-item {
        margin-bottom: 10px;
        background-color: #f7f7f7;
        border: 0;
    }

    .ivu-collapse >>> .ivu-collapse-content {
        overflow: initial;
        padding: 0;
    }
    .customer-name >>> .ivu-form-item-content {
        display: flex;
        align-items: center;
    }

    .customer-name >>> .ivu-tooltip {
        height: 36px;
    }

    .customer-name >>> .ivu-tooltip-rel {
        height: 36px;
        line-height: 36px;
        font-size: 14px;
        color: #8c8c8c;
        max-width: 400px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>