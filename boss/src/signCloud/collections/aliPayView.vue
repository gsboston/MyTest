<template>
    <div>
        <Row>
            <!--<div style="display: block; margin-left: 20px; margin-right: 20px; border-bottom: 1px solid #5c5c5c; font-size: 22px; font-weight: bold;">支付金额： ￥{{item.price}}</div>-->
            <div style="display: block; text-align: center; padding-top: 20px; color:#999999; font-size: 13px;">收款金额</div>
            <div style="display: block; height: 25px; text-align: center; color:red; font-size: 20px; font-weight: 700;">￥{{item.price}}</div>
        </Row>
        <Row style="height: 90px; margin-top: 20px;">
            <div style="display: block; text-align: center">
                <img src="../image/zfb.png" width="200" height="70"></img>
            </div>
        </Row>
        <Row style="height: 70px;">
            <div style="display: block; text-align: center; font-size: 13px; color: #878787;">
                支付状态确认中...
            </div>
        </Row>
        <div style="text-align: center;">
            <Button type="ghost" @click="payfail" style="font-size: 12px; border: 1px solid #59b399; color: #59b399; background: transparent;">其他支付方式</Button>
            <Button style="margin-left: 120px; font-size: 12px;" @click="paysuccess">客户已付款</Button>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            item: null,
        },
        created () {
            this.pay();
        },
        methods: {
            pay() {
                window.addEventListener("message", () => {
                    aliPayWindow.close();
                    this.callback(true);
                });
                this.request({
                    url: "/signCloud/collection/aliPay.do",
                    data: this.item,
                }).then(data => {
                    let aliPayWindow = window.open("/signCloud/collection/aliPayOpen.do?id=" + data);
                });
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