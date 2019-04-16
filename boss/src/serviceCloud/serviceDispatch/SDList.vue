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
                        <span v-if="SDInfo.state == 'NONE_DISPATCH'">待派单</span>
                        <span v-else-if="SDInfo.state == 'SEND_BACK_DISPATCH'">派单退回</span>
                        <span v-else>已派单</span>
                    </div>
                    <div class="btn-div">
                        <Button v-if="SDInfo.state == 'NONE_DISPATCH' || SDInfo.state == 'SEND_BACK_DISPATCH'" type="primary" size="large" class="active" @click="dispatchService(SDInfo.id)">派单</Button>
                        <Button v-else type="primary" size="large" @click="showInfo(SDInfo.id)">详情</Button>
                    </div>
                    <div class="change-red" v-if="SDInfo.state== 'SEND_BACK_DISPATCH'">
                        <span>退</span>
                    </div>
                    <div v-else class="change-white">
                    </div>
                </li>
            </ul>
            <div v-else class="no-change">
                <span>暂无可显示的服务派单记录</span>
            </div>
        </Row>
    </div>
</template>

<script>
    export default {
        props: {
            contractInfo: null
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
                this.request({
                    url: '/serviceCloud/serviceDispatch/serviceList.do',
                    param: {
                        contractId: this.contractInfo.id
                    }
                }).then(data => {
                    this.SDDataList = data;
                });
            },
            dispatchService(infoId) {
                this.card({
                    code: "SDDispatchCard",
                    title: '派单',
                    width: 700,
                    height: 900,
                    props: {
                        serviceId: infoId,
                        contractInfo: this.contractInfo
                    },
                    callback: (status, type, close) => {
                        if (status) {
                            // if (type == 'dispatch') {
                            //     this.$api.refreshSDPage();
                            // }else {
                                this.$emit('on-refresh');
                            // }
                        }
                        close();
                    }
                });
            },
            showInfo(infoId) {
                this.card({
                    code: "SDInfo",
                    title: '详情',
                    width: 700,
                    height: 900,
                    props: {
                        id: infoId,
                        contractInfo: this.contractInfo
                    }
                });
            }
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
        width: 300px;
        font-size: 14px;
        margin-right: 20px;
    }

    .SD-info-status {
        font-size: 14px;
        color: #5D5D5D;
        margin: 0 50px;
        white-space: nowrap;
    }

    .SD-info-type {
        width: 100px;
        display: inline-block;
        text-align: center;
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
        margin-right: 60px;
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

    .no-change{
        position: relative;
        width: 100%;
        height: auto;
        padding-top: 253px;
        padding-bottom: 20px;
        background: #FFF url("../../signCloud/image/no-contract.png") center 100px no-repeat;
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
</style>