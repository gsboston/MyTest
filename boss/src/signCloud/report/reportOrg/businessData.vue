<template>
    <div class="audit-report-view">
        <Row :gutter="16" style="padding-top: 15px;">
            <i-col span="24">
                <Card :bordered="true">
                    <p slot="title" class="title">业绩统计</p>
                    <div>
                        <Table stripe :columns="columns1" :data="auditData" :show-header="false" highlight-row>
                            <template slot="header">
                                <div class="custom-header">
                                    <div style="flex: 150px 0 0;text-align: left;">
                                        <span style="margin-left: 20px;">业务员</span>
                                    </div>
                                    <div style="flex: 1;text-align: left;">
                                        <span style="margin-left: 20px;">联系电话</span>
                                    </div>
                                    <div style="display:inline-flex; width: 100%; flex: 230px 0 0;">
                                        <div style="width:100%; flex: 230px 0 0; line-height: 30px;height: 30px;border-bottom: 1px solid #e9eaec;">正式合约</div>
                                        <div style="flex: 1;line-height: 30px;height: 30px;border-right: 1px solid #e9eaec; text-align: right;">
                                            <span style="margin-right: 15px;">合约数</span>
                                        </div>
                                        <div style="flex: 150px 0 0;line-height: 30px;height: 30px;border-right: 1px solid #e9eaec; text-align: right;">
                                            <span style="margin-right: 15px;">合约金额</span>
                                        </div>
                                    </div>
                                    <div style="display:inline-flex; width: 100%; flex: 390px 0 0;">
                                        <div style="width:100%; flex: 390px 0 0; line-height: 30px;height: 30px;border-bottom: 1px solid #e9eaec;">待签合约</div>
                                        <div style="flex: 1;line-height: 30px;height: 30px;border-right: 1px solid #e9eaec; text-align: right;">
                                            <span style="margin-right: 15px;">待提交</span>
                                        </div>
                                        <div style="flex: 1;line-height: 30px;height: 30px;border-right: 1px solid #e9eaec; text-align: right;">
                                            <span style="margin-right: 15px;">待审核</span>
                                        </div>
                                        <div style="flex: 1;line-height: 30px;height: 30px;border-right: 1px solid #e9eaec; text-align: right;">
                                            <span style="margin-right: 15px;">已核准</span>
                                        </div>
                                        <div style="flex: 150px 0 0;line-height: 30px;height: 30px;border-right: 1px solid #e9eaec; text-align: right;">
                                            <span style="margin-right: 15px;">待签金额</span>
                                        </div>
                                    </div>
                                    <div style="display:inline-flex; width: 100%; flex: 230px 0 0;">
                                        <div style="width:100%; flex: 230px 0 0; line-height: 30px;height: 30px;border-bottom: 1px solid #e9eaec;">解约合约</div>
                                        <div style="flex: 1;line-height: 30px;height: 30px;border-right: 1px solid #e9eaec; text-align: right;">
                                            <span style="margin-right: 15px;">合约数</span>
                                        </div>
                                        <div style="flex: 150px 0 0;line-height: 30px;height: 30px;border-right: 1px solid #e9eaec; text-align: right;">
                                            <span style="margin-right: 15px;">解约金额</span>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </Table>
                    </div>
                </Card>
            </i-col>
        </Row>
    </div>
</template>

<script>
    import ICol from "../../../../node_modules/iview/src/components/grid/col.vue";
    export default {
        props:{
            flag: null,
            current: null,
        },
        components: {ICol},
        data () {
            return {
                columns1: [
                    {
                        title: '业务员',
                        key: 'real_name',
                        align: 'left',
                        width: 150,
                    },
                    {
                        title: '联系电话',
                        key: 'phone',
                        align: 'left',
                    },
                    {
                        title: '合约数',
                        key: 'signed_contract_num',
                        align: 'right',
                        width: 80,
                    },
                    {
                        title: '合约金额',
                        key: 'signed_contract_price',
                        align: 'right',
                        width: 150,
                        render: (h, params) => {
                            let price = this.auditData[params.index].signed_contract_price;
                            return '￥'+this.formatPrice(price);
                        }
                    },
                    {
                        title: '待提交',
                        key: 'none_contract_num',
                        align: 'right',
                        width: 80,
                    }, {
                        title: '待审核',
                        key: 'committed_contract_num',
                        align: 'right',
                        width: 80,
                    },
                    {
                        title: '已审核',
                        key: 'approved_contract_num',
                        align: 'right',
                        width: 80,
                    },
                    {
                        title: '待签金额',
                        key: 'pending_contract_price',
                        align: 'right',
                        width: 150,
                        render: (h, params) => {
                            let price = this.auditData[params.index].pending_contract_price;
                            return '￥'+this.formatPrice(price);
                        }
                    },
                    {
                        title: '合约数',
                        key: 'termination_contract_num',
                        align: 'right',
                        width: 80,
                    },
                    {
                        title: '解约金额',
                        key: 'settlement_contract_price',
                        align: 'right',
                        width: 150,
                        render: (h, params) => {
                            let price = this.auditData[params.index].settlement_contract_price;
                            return '￥'+this.formatPrice(price);
                        }
                    },
                ],
                auditData: [],
                pageNum: 1,
                pageTotal: 0,
            }
        },
        filters: {

        },
        created () {
            this.$api.getBusinessList = this.initAuditList;
            this.initAuditList(1, this.flag, this.current, false);
        },
        methods: {
            initAuditList(page, flag, current, refresh) {
                this.request({
                    url: "/signCloud/report/BusinessData.do",
                    data:{
                        flag: flag,
                        current: current,
                        pageNum: page,
                        size: 5,
                    }
                }).then(items => {
                    let _data = this.auditData;
                    if (refresh) {
                        _data = [];
                    }
                    if (items.records.length > 0) {
                        this.auditData = [..._data, ...(items.records)];
                    }
                    if (items.records.length == 0) {
                        this.auditData = [];
                    }
                    this.pageNum = page;
                    this.pageTotal = items.pages;
                });
            },
            formatPrice(num) {
                if (!num) {
                    return "0.00";
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

                if (cent > 0) {
                    return (num + '.' + cents);
                } else {
                    return num;
                }
            },
        },
        mounted() {
            let $self = this;
            this.$nextTick(() => {
                if (document.getElementsByClassName('ivu-table-body').length > 0) {
                    let _tableBody = document.getElementsByClassName('ivu-table-body')[0];
                    _tableBody.addEventListener('scroll', function (e) {
                        if (this.scrollTop + this.offsetHeight == this.scrollHeight) {
                            if ($self.pageTotal > $self.pageNum) {
                                $self.pageNum += 1;
                                $self.initAuditList($self.pageNum, $self.flag, $self.current, false);
                            }
                        }
                    });
                }
            });
        }
    };
</script>

<style scoped>
    .audit-report-view {
        position: relative;
        height: 100%;
    }
    .audit-report-view h1 {
        font-size: 16px;
        font-weight: bold;
        color: #50B599;
        padding-left: 10px;
        padding-bottom: 20px;
    }
    .audit-report-view >>> .ivu-card-head {
        border-bottom: 0;
        padding-bottom: 0px;
    }
    .audit-report-view .title {
        height: 32px;
        line-height: 32px;
        font-size: 16px;
        font-weight: bold;
        color: #59b399;
    }
    .audit-report-view .title.title-custom {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .audit-report-view .top-content {
        height: 230px;
        overflow: hidden;
    }
    .audit-report-view .top-content-left #pieReport {
        height: 230px;
    }

    .audit-report-view .top-content-left .change-content {
        display: -ms-flexbox;
        display: flex;
        margin: auto;
        height: 230px;
        -ms-flex-direction: column;
        flex-direction: column;
        -ms-flex-align: center;
        align-items: center;
        -ms-flex-pack: center;
        justify-content: center;
    }
    .audit-report-view .top-content-left .change-content .ivu-icon{
        font-size: 60px;
    }
    .audit-report-view .top-content-left .change-content span:nth-of-type(1) {
        display: block;
        font-size: 20px;
        color: #5D5D5D;
        font-weight: bold;
    }
    .audit-report-view .top-content-left .change-content span:last-child {
        font-size: 14px;
        color: #9B9B9B;
        font-weight: bold;
    }
    .audit-report-view .top-content-right .ivu-col {
        padding: 20px 0;
    }
    .audit-report-view .top-content-right .audit-count-content {
        display: -ms-flexbox;
        display: flex;
        height: 75px;
        -ms-flex-direction: column;
        flex-direction: column;
        -ms-flex-align: center;
        align-items: center;
        -ms-flex-pack: center;
        justify-content: center;
    }
    .audit-report-view .top-content-right .border-bottom-1 {
        border-bottom: 1px solid #F2F2F2;
    }
    .audit-report-view .top-content-right .audit-count-content.border-1 {
        border-left: 1px solid #F2F2F2;
        border-right: 1px solid #F2F2F2;
    }
    .audit-report-view .top-content-right .audit-count-content span {
        display: block;
        font-size: 14px;
        font-weight: bold;
        color: #9B9B9B;
    }
    .audit-report-view .top-content-right .audit-count-content span:last-child {
        margin-top: 10px;
        font-size: 20px;
        color: #5D5D5D;
        font-weight: normal;
    }

    .audit-report-view >>> .ivu-table-body {
        height: 238px;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .audit-report-view >>> .contract-type {
        color: #54B499;
        border: 1px solid #54B499;
        background-color: #FFF;
        border-radius: 10px;
        text-align: center;
        font-weight: bold;
    }

    .audit-report-view >>> .ivu-tooltip {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
    }

    .audit-report-view >>> .ivu-tooltip-inner {
        white-space: normal;
    }

    .custom-header {
        width: 100%;
        margin: 0;
        height: 100%;
        display: flex;
        background: #f8f8f9;
        text-align: center;
        font-weight: bold;
        border-bottom: 1px solid #e9eaec;
    }

    .custom-header > div {
        width: 0;
        /*flex: 100px 0 0;*/
        flex-wrap: wrap;
        border-right: 1px solid #e9eaec;
    }

    .audit-report-view >>> .ivu-table-title {
        height: 60px;
        line-height: 60px;
        border-bottom: 0;
    }

    .audit-report-view >>> .ivu-table td {
        vertical-align: baseline;
        padding: 10px 0;
        border-bottom: 0;
    }

    .audit-report-view >>> .ivu-table td:nth-child(4) .ivu-table-cell {
        white-space: pre;
    }

    /*.custom-header > div:first-child {*/
        /*display: inline-flex;*/
    /*}*/

    /*.custom-header > div:nth-child(2) {*/
        /*flex: 1;*/
        /*border-right: 0;*/
    /*}*/

    /*.custom-header .multiple-head {*/
        /*flex: 1;*/
        /*line-height: 30px;*/
        /*height: 30px;*/
        /*border-right: 1px solid #e9eaec;*/
    /*}*/

    /*.custom-header .multiple-head:first-child {*/
        /*width: 100%;*/
        /*flex: 100px 0 0;*/
        /*border-bottom: 1px solid #e9eaec;*/
        /*border-right: 0;*/
    /*}*/

    /*.custom-header .multiple-head:last-child {*/
        /*border-right: 0;*/
    /*}*/
</style>