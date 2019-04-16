<template>
    <div class="SD-List">
        <Row>
            <ul v-if="SDDataList.length>0">
                <li v-for="(SDInfo, index) in SDDataList" :key="index">
                    <div class="SD-info-code">
                        <p>{{ SDInfo.code }}</p>
                        <p>服务单号</p>
                    </div>
                    <div class="SD-info-name">
                        <b v-if="SDInfo.state == 'NONE_DISPATCH' || SDInfo.state == 'SEND_BACK_DISPATCH'" style="color: #54B499;">未指定服务方</b>
                        <b v-else>{{ SDInfo.dispatchType == 'OWN' ? SDInfo.saleOrgName : SDInfo.serveOrgName }}</b>
                    </div>
                    <div class="SD-info-type">
                        <span class="custom-btn">{{ SDInfo.billDefName }}</span>
                    </div>
                    <div class="SD-info-status">
                        <span>{{SDInfo | getEnumValue('name')}}</span>
                    </div>
                    <div class="SD-info-person">
                        <span>{{SDInfo | getEnumValue('listTitle')}}</span>
                        <template v-if="SDInfo.userList">
                            <span v-if="SDInfo.userList.length > 1">{{SDInfo.userList[0].name}} {{SDInfo.userList[0].phone}}...</span>
                            <span v-else-if="SDInfo.userList.length > 0">{{SDInfo.userList[0].name}} {{SDInfo.userList[0].phone}}</span>
                            <span v-else>暂无人员信息</span>

                            <Poptip v-if="SDInfo.userList.length > 1" placement="top" trigger="hover" class="contract-process">
                                <span style="color: #59b399;">更多</span>
                                <span slot="title" class="contract-process-title">{{SDInfo | getEnumValue('processTip')}}</span>

                                <div slot="content" style="width: 256px;">
                                    <p style="text-align: left;padding: 5px 0;font-weight: bold;">{{SDInfo | getEnumValue('contentTips')}}</p>
                                    <div v-for="(item, index) in SDInfo.userList" :key="index" style="display: flex;flex: 1;">
                                        <span style="flex: 1;text-align: right;">{{item.name}}:</span>
                                        <span style="flex: 1;padding-left: 20px;text-align: left;">{{item.phone}}</span>
                                    </div>
                                </div>
                            </Poptip>
                        </template>
                        <template v-else>
                            <span>{{SDInfo.serverName}} {{SDInfo.serverPhone}}</span>
                            <Poptip placement="top" trigger="hover" class="contract-process">
                                <span style="color: #59b399;">更多</span>
                                <span slot="title" class="contract-process-title">{{SDInfo | getEnumValue('processTip')}}</span>
                                <div slot="content" style="width: 256px;text-align: left;">
                                    <template v-if="SDInfo.serveState == 'UNSTARTED'">
                                        <p>服务进度：{{SDInfo.progressName}}{{SDInfo.progressCycleNum ? '（' + SDInfo.progressCycleNum + '期）' : ''}}</p>
                                        <p>开始时间：{{SDInfo.updateDate | formatDate}}</p>
                                        <p>服务人员：{{(SDInfo.serverName && SDInfo.serverName != '') ? SDInfo.serverName : '暂无人员信息'}}  {{(SDInfo.serverPhone && SDInfo.serverPhone != '') ? SDInfo.serverPhone : ''}}</p>
                                    </template>
                                    <template v-else>
                                        <p>最新进度：{{SDInfo.progressName}}{{SDInfo.progressCycleNum ? '（' + SDInfo.progressCycleNum + '期）' : ''}}</p>
                                        <p>服务人员：{{(SDInfo.serverName && SDInfo.serverName != '') ? SDInfo.serverName : '暂无人员信息'}}  {{(SDInfo.serverPhone && SDInfo.serverPhone != '') ? SDInfo.serverPhone : ''}}</p>
                                        <p>更新时间：{{SDInfo.updateDate | formatDate}}</p>
                                    </template>
                                </div>
                            </Poptip>
                        </template>
                    </div>
                    <div class="btn-div">
                        <Button type="primary" size="large" :disabled="SDInfo.state != 'ALREADY_RECEIVE'" @click="showServiceProgress(SDInfo.id)">查看详情</Button>
                    </div>
                </li>
            </ul>
            <div v-else class="no-change">
                <Icon type="information-circled" style="color: #2d8cf0"></Icon>
                <span>暂无可显示的服务进度信息</span>
            </div>
        </Row>
    </div>
</template>

<script>
    const stateTypeEnum = {
        NONE_DISPATCH: {
            name: '待派单',
            listTitle: '待派单人员',
            processTip: '派单进度：待派单',
            contentTips: '可联系服务派单人员进行派单：'
        },
        SEND_BACK_DISPATCH: {
            name: '待派单',
            listTitle: '待派单人员',
            processTip: '派单进度：待派单',
            contentTips: '可联系服务派单人员进行派单：'
        },
        ALREADY_DISPATCH: {
            name: '待接单',
            listTitle: '待接单人员',
            processTip: '派单进度：待接单',
            contentTips: '可联系服务接单人员进行接单：'
        },
        NONE_RECEIVE: {
            name: '待派工',
            listTitle: '待派工人员',
            processTip: '派单进度：待派工',
            contentTips: '可联系服务负责人进行派工：'
        },
        SEND_BACK_RECEIVE: {
            name: '待派工',
            listTitle: '待派工人员',
            processTip: '派单进度：待派工',
            contentTips: '可联系服务负责人进行派工：'
        },
        ALREADY_RECEIVE: {
            UNSTARTED: {
                name: '待服务',
                listTitle: '服务人员',
                processTip: '服务状态：待服务',
                contentTips: '可服务人员：'
            },
            SERVING: {
                name: '服务中',
                listTitle: '服务人员',
                processTip: '服务状态：服务中',
                contentTips: ''
            },
            CUTOUT: {
                name: '服务结束',
                listTitle: '服务人员',
                processTip: '服务状态：服务终止',
                contentTips: ''
            },
            FINISHED: {
                name: '服务结束',
                listTitle: '服务人员',
                processTip: '服务状态：服务结束',
                contentTips: ''
            }
        },
    };

    export default {
        props: {
            contractInfo: null
        },
        watch: {
            contractInfo (val) {
                this.contractInfo = val;
                this.initSDList();
            }
        },
        filters: {
            getEnumValue(item, type) {
                if (item.state != 'ALREADY_RECEIVE') {
                    return stateTypeEnum[item.state][type];
                }else {
                    if (item.serveState) {
                        return stateTypeEnum[item.state][item.serveState][type];
                    }else {
                        return '暂无时间信息';
                    }
                }
            },
            formatDate(value) {
                if (value) {
                    let newDate = new Date(value);
                    if (newDate) {
                        let y = newDate.getFullYear();
                        let m = newDate.getMonth() + 1;
                        m = m < 10 ? '0' + m : m;
                        let d = newDate.getDate();
                        d = d < 10 ? ('0' + d) : d;
                        return y + '-' + m + '-' + d;
                    }
                }
                return value;
            }
        },
        data () {
            return {
                SDDataList: []
            }
        },
        created () {
            this.initSDList();
        },
        methods: {
            initSDList() {
                if (this.contractInfo.id) {
                    this.request({
                        url: '/serviceCloud/service/serviceList.do',
                        param: {
                            contractId: this.contractInfo.id
                        }
                    }).then(data => {
                        this.SDDataList = data;
                    });
                }else {
                    this.SDDataList = [];
                }
            },
            showServiceProgress (serviceId) {
                this.card({
                    title: "",
                    code: "serviceInfoProgress",
                    width: 700,
                    props: {
                        serviceId: serviceId
                    },
                });
            },
        }
    };
</script>

<style scoped>
    .SD-List {
        position: relative;
        margin-top: 15px;
        background: white;
        box-shadow: 0 2px 3px 0 rgba(175, 175, 175, 0.55);
    }

    .SD-List ul {
        padding: 0 20px;
        border-top: 1px solid #e8e8e8;
    }

    .SD-List ul>li {
        display: flex;
        align-items: center;
        height: 75px;
        border-bottom: 1px solid #e8e8e8;
        font-size: 14px;
        padding: 7px 10px;
    }

    .SD-info-code {
        width: 153px;
        font-size: 12px;
        color: #707070;
        text-align: center;
        border-right: 1px solid #d9d9d9;
        margin-right: 30px;
    }

    .SD-info-name {
        width: 240px;
        font-size: 14px;
        margin-right: 20px;
    }

    .SD-info-status {
        font-size: 14px;
        color: #5D5D5D;
        margin: 0 30px;
        white-space: nowrap;
    }

    .SD-info-type {
        width: 100px;
        display: inline-block;
        text-align: center;
    }

    .SD-info-person {
        display: flex;
        flex-direction: column;
        width: 200px;
        margin-left: 20px;
        font-size: 12px;
        text-align: center;
    }

    .SD-info-person > span:nth-child(2) {
        font-weight: bold;
    }

    .custom-btn {
        display: inline-block;
        border: 1px solid #54B499;
        border-radius: 4px;
        color: #54B499;
        font-size: 12px;
        padding: 7px 14px;
        font-weight: 700;
    }

    .btn-div {
        flex: 1;
        text-align: right;
        /*margin-right: 60px;*/
    }

    .btn-div button{
        background-color: #FFF;
        border: 1px solid #54B499;
        border-radius: 4px;
        color: #54B499;
        font-size: 12px;
        padding: 6px 23px;
    }

    .btn-div button.active {
        background-color: #54B499;
        color: #FFF;
    }

    .btn-div button[disabled] {
        color: #bbbec4;
        background: #f7f7f7;
        border-color: #dddee1;
    }

    .no-change{
        position: relative;
        width: 100%;
        height: 160px;
        line-height: 160px;
        /*padding-top: 253px;*/
        padding-bottom: 20px;
        /*background: #FFF url("../../signCloud/image/no-contract.png") center 100px no-repeat;*/
        text-align: center;
        font-size: 16px;
    }

    .change-white{
        position: relative;
        top: -19px;
        right: -10px;
        width: 0;
        height: 0;
        border-top: 40px solid white;
        border-left: 40px solid transparent;
        opacity: .75;
    }
    .change-red{
        position: relative;
        top: -19px;
        right: -10px;
        width: 0;
        height: 0;
        border-top: 40px solid #ff6464;
        border-left: 40px solid transparent;
        opacity: .75;
    }

    .change-red>span {
        position: relative;
        top: -37px;
        right: 20px;
        color: #fff;
    }

    .contract-process-title {
        display: block;
        width: 100%;
        text-align: left;
        font-size: 12px;
        color: #59b399;
        font-weight: bold;
    }

    .contract-process-title::before {
        content: '.';
        font-size: 30px;
        line-height: 20px;
        vertical-align: baseline;
        margin-right: 5px;
        color: #000;
    }
</style>