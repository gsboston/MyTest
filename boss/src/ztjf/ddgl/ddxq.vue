<template>
    <Row style="padding: 15px 30px;">
        <div style="font-size: 16px"><label>{{order.orgName}}</label></div>
        <div style="font-size: 12px"><label>{{order.orgTypeDict.name}}</label></div>
        <div style="font-size: 12px;color:#999999"><label>机构编码：{{orgCode}}</label></div>
        <br>
        <div style="font-size: 16px;"><label><span v-if="order.type==1">账套续费</span><span v-if="order.type==2">账套扩容</span><span v-if="order.type==3">账套购买</span></label></div>
        <div style="font-size: 12px;"><label>订单编号：{{order.orderNo}}</label></div>
        <div style="font-size: 12px;"><label>付费金额：{{order.payMoney}}</label></div>
        <div style="font-size: 12px;"><label>付费时间：{{order.payTime|dataTime('yyyy-MM-dd hh:mm:ss')}}</label></div>
        <div class="line"></div>
        <div v-if="order.type==2" style="font-size: 12px;"><label>扩容账套使用天数：{{order.totalDay}}</label></div>
        <div v-if="order.type==2" style="font-size: 12px;"><label>使用套餐价格类别：<span v-if="order.packageType==1">一年</span><span v-else-if="order.packageType==2">二年</span><span
                v-else-if="order.packageType==3">三年</span><span v-else>永久</span> 使用期套餐</label></div>
        <div v-if="order.type==2" style="font-size: 12px;"><label>扩容账套数量：{{order.totalNum}}套</label></div>
        <div v-if="order.type==1" style="font-size: 12px;"><label>续费时长：<span v-if="order.packageType==1">一年</span><span v-else-if="order.packageType==2">二年</span><span
                v-else-if="order.packageType==3">三年</span><span v-else>永久</span></label></div>
        <div v-if="order.type==1" style="font-size: 12px;"><label>续费账套数量：{{order.totalNum}}套</label></div>
        <div v-if="order.type==3" style="font-size: 12px;"><label>使用时长：<span v-if="order.packageType==1">一年</span><span v-else-if="order.packageType==2">二年</span><span
                v-else-if="order.packageType==3">三年</span><span v-else>永久</span></label></div>
        <div v-if="order.type==3" style="font-size: 12px;"><label>购买账套数量：{{order.totalNum}}套</label></div>
        <br>
        <div style="border:1px solid #ccc;padding: 5px 10px;margin-bottom: 5px" v-for="item in order.ztjfOrderPackageVoList">
            <span style="font-size: 18px;">{{item.accountNumber}} 套</span>
            <span style="font-size: 14px;margin-left: 60px"><label style="color: red">{{item.amount}}</label> 元</span>
            <span style="font-size: 14px;margin-left: 60px">X{{item.buyNumber}}</span>
        </div>
    </Row>
</template>

<script>
    export default {
        props: {item: null},
        data: function () {
            return {
                orgCode: '',
                order: {}
            }
        },
        created: function () {
            this.getDetail();
        },
        methods: {
            getDetail() {
                this.request({
                    url: "/ddgl/detail.do",
                    param: {
                        id: this.item.id
                    }
                }).then(res => {
                    this.order = res;
                    this.getOrgCode(this.order.orgId);
                }, error => {
                    this.$Message.error(error.message);
                });
            },
            getOrgCode(orgId) {
                this.request({
                    url: '/getHttpOtherPlatform.do',
                    data: {
                        url: '/api/wechat/getOrgByParam.do',
                        orgId: orgId
                    }
                }).then(res => {
                    if (JSON.parse(res).data.orgCode) {
                        this.orgCode = JSON.parse(res).data.orgCode;
                    }
                })
            },
        }
    };
</script>

<style scoped>
    .line {
        margin: 5px auto;
        border-bottom: 1px solid #ccc;
        width: 100%;
    }
</style>