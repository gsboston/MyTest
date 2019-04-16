<template>
    <Row style="padding: 15px 30px;">
        <div style="font-size: 24px"><label>{{item.orgName}}</label></div>
        <div style="font-size: 12px;color: #999999">机构编码：{{item.orgCode}}</div>
        <div>申请时间：{{item.tsInsert|dataTime('yyyy-MM-dd hh:mm:ss')}}</div>
        <div class="line"></div>
        <div>发票状态：<span v-if="item.status==1">已申请</span><span v-if="item.status==2">已送出</span></div>
        <div>快递公司：{{item.expressName}}</div>
        <div>快递单号：{{item.trackingNo}}</div>
        <div>送出时间：{{item.tsInsert|dataTime('yyyy-MM-dd hh:mm:ss')}}</div>
        <div>发票代码：{{item.code}}</div>
        <div>发票号码：{{item.no}}</div>
        <div class="line"></div>
        <div>发票信息（<span v-if="item.type==1">普票</span><span v-if="item.type==2">专票</span><span v-if="item.type==3">个人</span>）</div>
        <div>发票抬头：{{item.title}}</div>
        <div>税　　号：{{item.sh}}</div>
        <div>发票内容：{{item.note}}</div>
        <div>发票金额：{{item.money}}</div>
        <div>收件信息</div>
        <div>收 件 人：{{item.receiver}}</div>
        <div>联系方式：{{item.phone}}</div>
        <div>收件地址：{{item.address}}</div>
        <div>邮政编码：{{item.postal}}</div>
        <br>
        <div>包含订单</div>
        <div style="border:1px solid #ccc;padding: 5px 10px;margin-bottom: 5px" v-for="order in orderList">
            <span style="font-size: 18px;"><span v-if="order.type==1">账套续费</span><span v-if="order.type==2">账套扩容</span><span v-if="order.type==3">账套购买</span></span>
            <span style="font-size: 14px;float: right">{{order.tsInsert|dataTime('yyyy-MM-dd hh:mm:ss')}}</span>
            <br>
            <span>{{order.orderNo}}</span>
            <span style="font-size: 14px;float: right">{{order.payMoney}}</span>
        </div>
    </Row>
</template>

<script>
    export default {
        props: {item: null},
        data: function () {
            return {
                orderList: [],
            }
        },
        created: function () {
            this.getListByIdse();
        },
        methods: {
            getListByIdse() {
                this.request({
                    url: "/kpgl/listByIds.do",
                    param: {
                        ids: this.item.orderIds,
                    }
                }).then(data => {
                    this.orderList = data;
                });
            }
        }
    };
</script>

<style scoped>
    .line {
        margin: 5px auto;
        border-bottom: 1px solid #ccc;
        width: 100%;
    }
</style>s