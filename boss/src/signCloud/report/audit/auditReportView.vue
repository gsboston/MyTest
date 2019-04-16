<template>
    <div class="audit-report-view">
        <h1>我的审核</h1>
        <Row :gutter="16">
            <i-col span="15">
                <Card :bordered="false">
                    <p slot="title" class="title">待审核内容</p>
                    <div class="top-content top-content-left">
                        <i-col span="14" style="border-right: 1px solid #F2F2F2;">
                            <div id="pieReport"></div>
                        </i-col>
                        <i-col span="10">
                            <i-col span="12">
                                <div class="change-content">
                                    <Icon type="document-text" style="color: #2FC7C9;"></Icon>
                                    <span>{{ signContentNum }}</span>
                                    <span>内容变更</span>
                                </div>
                            </i-col>
                            <i-col span="12">
                                <div class="change-content">
                                    <Icon type="compose" style="color: #5AB1EF;"></Icon>
                                    <span>{{ signSubjectNum }}</span>
                                    <span>主体变更</span>
                                </div>
                            </i-col>
                        </i-col>
                    </div>
                </Card>
            </i-col>
            <i-col span="9">
                <Card :bordered="false">
                    <div slot="title" class="title title-custom">
                        <span>已核准内容</span>
                        <Select v-model="rightParam" style="float: right;width: 120px;" @on-change="initRight">
                            <Option value="CURRENT_MONTH">当月（{{ currentMonth }}月）</Option>
                            <Option value="HISTORY">历史</Option>
                        </Select>
                    </div>
                    <div class="top-content top-content-right">
                        <i-col span="24" class="border-bottom-1">
                            <div class="audit-count-content">
                                <span>已核准</span>
                                <span style="font-size: 28px;">{{ rightData.total }}</span>
                            </div>
                        </i-col>
                        <i-col span="12">
                            <div class="audit-count-content">
                                <span>已审合约</span>
                                <span>{{ rightData.approvaledContract }}</span>
                            </div>
                        </i-col>
                        <i-col span="12">
                            <div class="audit-count-content border-1">
                                <span>已审协议</span>
                                <span>{{ rightData.approvaledAgreement }}</span>
                            </div>
                        </i-col>
                        <!--<i-col span="8">-->
                            <!--<div class="audit-count-content">-->
                                <!--<span>已签约</span>-->
                                <!--<span>{{ rightData.signedContract }}</span>-->
                            <!--</div>-->
                        <!--</i-col>-->
                    </div>
                </Card>
            </i-col>
        </Row>
        <Row :gutter="16" style="padding-top: 16px;">
            <i-col span="24">
                <Card :bordered="false">
                    <p slot="title" class="title">待审核列表</p>
                    <div>
                        <Table stripe :columns="columns1" :data="auditData"></Table>
                    </div>
                </Card>
            </i-col>
        </Row>
    </div>
</template>

<script>
    import echarts from 'echarts';
    require('echarts/theme/macarons');

    export default {
        data () {
            return {
                charts: '',
                pieData: [],
                pieLegendData: [],
                pieLegendFormat: {},
                auditContractNum: 0,
                signContentNum: 0,
                signSubjectNum: 0,
                rightParam: 'CURRENT_MONTH',
                currentMonth: 12,
                rightData: {
                    total: 0,
                    approvaledContract: 0,
                    approvaledAgreement: 0,
                    signedContract: 0
                },
                columns1: [
                    {
                        title: '合约编号',
                        key: 'contract_code',
                        width: 150,
                        maxWidth: 150,
                        render(h, params) {
                            return h('Tooltip', {
                                props: {
                                    content: params.row.contract_code,
                                    placement: 'top'
                                },
                            }, [
                                h('span', {
                                    attrs: {
                                        style: 'color: #bbbbbb;font-size: 14px;font-weight: 600;'
                                    }
                                }, params.row.contract_code)
                            ]);
                        }
                    }, {
                        title: '合约类型',
                        key: 'audit_type',
                        width: 100,
                        maxWidth: 100,
                        render: (h, params) => {
                            let title = '';
                            if (params.row.audit_type == 'CONTRACT') {
                                title = params.row.item_name.substring(0, 2);
                            }else if (params.row.audit_type == 'CONTENT') {
                                title = '内容变更';
                            }else {
                                title = '主体变更';
                            }
                            return h('div', {
                                attrs: {
                                    class: 'contract-type'
                                }
                            }, title);
                        }
                    }, {
                        title: '甲方名称',
                        key: 'subject_name',
                        width: 450,
                        maxWidth: 450,
                        render(h, params) {
                            return h('Tooltip', {
                                props: {
                                    content: params.row.subject_name,
                                    placement: 'top'
                                },
                            }, [
                                h('span', params.row.subject_name)
                            ]);
                        }
                    }, {
                        title: '合约金额',
                        key: 'contract_price',
                        align: 'right',
                        render: (h, params) => {
                            let _price = params.row.contract_price.toString();
                            return '￥ ' + (_price.indexOf('.') > -1 ? _price : (_price + '.00'));
                        }
                    }, {
                        title: '审核状态',
                        key: 'status',
                        align: 'right',
                        width: 100,
                        maxWidth: 100,
                        render: (h, params) => {
                            return '待审核';
                        }
                    }, {
                        title: '提交审核时间',
                        key: 'submit_date',
                        align: 'right',
                        width: 120,
                        maxWidth: 120,
                        render(h, params) {
                            let _date = params.row.submit_date;
                            if (_date) {
                                _date = _date.replace(/-/g, '/');
                                _date = window.DateFormat.dateToString(new Date(_date), 'yyyy/MM/dd');
                            }
                            return h('span', {
                                attrs: {
                                    style: 'color: #bbbbbb;font-size: 12px;'
                                }
                            }, _date);
                        }
                    }
                ],
                auditData: [],
                current: 1,
            }
        },
        created () {
            this.currentMonth = new Date().getMonth() + 1;
            this.initLeft();
            this.initRight();
            this.initAuditList();
        },
        methods: {
            initLeft() {
                this.request({
                    url: `/signCloud/report/tobeApproval.do`
                }).then(data => {
                    this.pieData = data.pieData;
                    this.pieLegendData = data.pieLegendData;
                    this.pieLegendFormat = data.pieLegendFormat;
                    if (data.pieData.length == 0) {
                        this.pieData.push({
                            value: 0,
                            name: '暂无数据',
                            itemStyle: {
                                normal: {
                                    color: '#fff',
                                    borderColor: '#fff',
                                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                                    shadowBlur: 10
                                }
                            }
                        });
                        this.pieLegendData.push('暂无数据');
                        this.pieLegendFormat['暂无数据'] = '';
                    }
                    this.auditContractNum = data.auditContractNum;
                    this.signContentNum = data.signContent;
                    this.signSubjectNum = data.signSubject;
                    this.drawPie();
                });
            },
            initRight() {
                this.request({
                    url: `/signCloud/report/approvaled.do`,
                    param: {
                        type: this.rightParam
                    }
                }).then(data => {
                    this.rightData = data;
                });
            },
            initAuditList() {
                this.request({
                    url: "/signCloud/contractView/pendingAuditList.do",
                    data:{
                        page: this.current,
                        status: 'PENDING',
                        size: 5,
                    }
                }).then(items => {
                    let _data = this.auditData;
                    if (items.records.length > 0) {
                        this.auditData = [..._data, ...(items.records)];
                    }
                    this.current = items.current;
                });
            },
            drawPie() {
                let $self = this;
                try {
                    this.charts = echarts.init(document.getElementById('pieReport'),'macarons')
                    this.charts.setOption({
                        title: {
                            left: '92',
                            y: 'center',
                            width: '50%',
                            text: '{a|' + $self.auditContractNum + '\n待审合约}',
                            textStyle: {
                                rich: {
                                    a: {
                                        color: '#5D5D5D',
                                        fontSize: 14,
                                        lineHeight: 20,
                                        align: 'center',
                                        verticalAlign: 'middle'
                                    }
                                }
                            },
                        },
                        tooltip: {
                            show: true
                        },
                        legend: {
                            orient : 'vertical',
                            // x : 'right',
                            y: 'center',
                            right: '8%',
                            align: 'left',
                            itemWidth: 13,
                            itemHeight: 13,
                            textStyle: {
                                fontSize: '14',
                                color: '#9B9B9B',
                                fontWeight: 'bold',
                            },
                            data: this.pieLegendData,
                            formatter: function (name) {
                                var _num = name.length > 4 ? 0 : (4 - name.length);
                                var _name = name.length > 4 ? name.substring(0, 4) : name;
                                for(var i = 0; i < _num; i++) {
                                    _name = _name + '   ';
                                }
                                return _name + '      ' + ($self.pieLegendFormat[name] ? $self.pieLegendFormat[name] : '');
                            },
                            tooltip: {
                                show: true,
                                formatter: function (obj) {
                                    if (obj.name == '其他') {
                                        return '    ' + obj.name + '    ';
                                    }
                                    return obj.name;
                                }
                            }
                        },
                        series: [
                            {
                                name:'访问来源',
                                type:'pie',
                                center: ['124', '50%'],
                                radius: ['50%', '80%'],
                                avoidLabelOverlap: false,
                                label: {
                                    normal: {
                                        show: false,
                                        position: 'center'
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                data: this.pieData
                            }
                        ]
                    });
                }catch (e) {}
            },
            toAuditPage() {
                this.$router.push({
                    path: '/M03',
                    query: {
                        funcCode: 'F0302',
                    }
                });
            }
        },
        mounted() {
            let $self = this;
            this.$nextTick(() => {
                if (document.getElementsByClassName('ivu-table-body').length > 0) {
                    let _tableBody = document.getElementsByClassName('ivu-table-body')[0];
                    _tableBody.addEventListener('scroll', function (e) {
                        if (this.scrollTop + this.offsetHeight == this.scrollHeight) {
                            $self.current += 1;
                            $self.initAuditList();
                        }
                    });
                }
            });
        }
    };
</script>

<style scoped>
    .audit-report-view {
        padding: 15px 45px 0;
        background: #F6F6F6;
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
    }
    .audit-report-view .title {
        height: 32px;
        line-height: 32px;
        font-size: 16px;
        font-weight: bold;
        color: #bbbbbb;
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
</style>