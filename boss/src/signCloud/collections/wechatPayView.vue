<template>
    <div>
        <!--<Row type="flex" justify="center">-->
            <!--<i-col span="10">-->
                <!--<div style="display: block; margin-top: 10px; text-align: center; font-size: 16px; font-weight: bold; color: red;">￥{{item.price}}</div>-->
            <!--</i-col>-->
            <!--<i-col span="10">-->
            <!--</i-col>-->
        <!--</Row>-->
        <Row type="flex" justify="center" style="height: 250px; margin-top: 10px; text-align: center;">
            <i-col span="10">
                <div style="display: block; height: 25px; text-align: center; color:#999999; font-size: 13px;"><span style="padding-top: 10px; display: inline-block;">扫一扫付款（元）</span></div>
                <div style="display: block; height: 25px; text-align: center; color:red; font-size: 20px; font-weight: 700;">￥{{item.price}}</div>
                <div style="display: block; height: 190px; padding-top: 5px;"><img style="border: 1px solid #f2f2f2;" :src="wxCode" width="190" height="190"></div>
                <!--<div style="display: block; height: 50px;"><img src="../image/wxbt.jpg" width="160" height="40px;"></div>-->
            </i-col>
            <i-col span="10">
                <img width="200" height="250" src="../image/wxmobile.jpg">
            </i-col>
        </Row>
        <Row>
            <div style="text-align: center; padding-top: 60px;">
                <Button @click="payfail" style="font-size: 12px; border: 1px solid #59b399; color: #59b399; background: transparent;">其他支付方式</Button>
                <Button style="margin-left: 120px; font-size: 12px;" @click="paysuccess">客户已付款</Button>
            </div>
        </Row>
    </div>
</template>

<script>
    export default {
        props: {
            item: null,

        },
        data(){
            return {
                wxCode: "",
            }
        },
        created () {
            this.pay();
        },
        methods: {
            pay() {
                this.request({
                    url: "/signCloud/collection/wechatPay.do",
                    data: this.item,
                }).then(data => {
                    this.wxCode = "/signCloud/collection/wechatPayOpen.do?code="+encodeURI(data);
                });
                //this.wxCode = "/signCloud/collection/wechatPay.do?param="+encodeURI(JSON.stringify(this.item));
            },
            paysuccess () {
                this.callback(true);
            },
            payfail () {
                this.callback(false);
            },
        }
    };
</script>