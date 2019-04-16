<template>
    <Row style="padding: 15px 30px;">
        <div style="font-size: 16px"><label>{{item.name}}</label></div>
        <div style="font-size: 12px"><label>{{item.typeDict.name}}</label></div>
        <div style="font-size: 14px;"><label>标记卡数：{{count}}张</label></div>
        <div style="font-size: 14px;"><label>标记号段：{{item.minNo}}-{{item.maxNo}}</label></div>
        <br/>
        <div style="float: right;">
            <Button type="primary" @click="save()">确定</Button>
        </div>
    </Row>
</template>

<script>
    export default {
        props: {item: null},
        data: function () {
            return {
                count: 0,
                data: {},
            }
        },
        created: function () {
            this.count = parseInt(this.subtract(this.item.maxNo, this.item.minNo)) + 1;
        },
        methods: {
            subtract: function (a, b) {
                var result = [];
                //是否有借位
                var minusOne = 0;
                //去掉a,b开头的0
                a = this.ltrimZero(a);
                b = this.ltrimZero(b);
                //补零对齐
                while (a.length < b.length) {
                    a = "0" + a;
                }
                while (b.length < a.length) {
                    b = "0" + b;
                }
                //从后面位数往前相减
                for (var i = a.length - 1; i >= 0; i--) {
                    var c1 = a.charAt(i) - 0;
                    var c2 = b.charAt(i) - 0;
                    //如果当前位数无须借位
                    if (c1 - minusOne >= c2) {
                        result.unshift(c1 - c2 - minusOne);
                        minusOne = 0;
                    }
                    else {
                        result.unshift(c1 + 10 - c2 - minusOne);
                        minusOne = 1;
                    }
                }
                //如果最高位仍然要借位
                //比如："99999" - "100000"
                if (minusOne) {
                    //=> -(100000 - 99999) => -1
                    var newResult = this.subtract(b, a);
                    newResult = this.ltrimZero(newResult);
                    return "-" + newResult;
                }
                result = result.join("");
                result = this.ltrimZero(result);
                return result ? result : "0";
            },
            //去掉字符串开头的0
            ltrimZero: function (str) {
                for (var i = 0; i < str.length && str.charAt(i) === "0"; i++) ;
                return str.slice(i);
            },
            save: function () {
                this.data.userId = window.Context.getCurrentUser().id;
                this.data.cardId = this.item.id;
                this.data.minNo = this.item.minNo;
                this.data.maxNo = this.item.maxNo;
                this.request({
                    url: "/hykgl/putIn.do",
                    data: this.data,
                }).then(res => {
                    this.$Message.success('入库成功!');
                    location.reload();
                }, error => {
                    this.$Message.error(error.message);
                });
            },
        }
    };
</script>