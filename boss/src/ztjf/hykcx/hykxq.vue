<template>
    <Row style="padding: 15px 30px;">
        <div style="font-size: 24px"><label>{{info.name}}</label></div>
        <div>{{info.typeName}}</div>
        <div class="line"></div>
        <div>卡号：{{info.cardNo}}</div>
        <div>密码：{{info.cardPwd}}</div>
        <div>面值：{{info.price}}</div>
        <div v-if="info.newTime">
            <div class="line"></div>
            <div style="font-size: 14px;font-weight: 700">生成信息</div>
            <div>生成时间：{{info.newTime|dataTime('yyyy-MM-dd hh:mm:ss')}}</div>
            <div>操作人：{{info.newOptorName}}</div>
        </div>
        <div v-if="info.printTime">
            <div class="line"></div>
            <div style="font-size: 14px;font-weight: 700">制卡信息</div>
            <div>制卡时间：{{info.printTime|dataTime('yyyy-MM-dd hh:mm:ss')}}</div>
            <div>操作人：{{info.printOptorName}}</div>
            <div>入库时间：{{info.putInTime|dataTime('yyyy-MM-dd hh:mm:ss')}}</div>
            <div>操作人：{{info.putInOptorName}}</div>
        </div>
        <div v-if="info.distTime">
            <div class="line"></div>
            <div style="font-size: 14px;font-weight: 700">派卡信息</div>
            <div>派卡时间：{{info.distTime|dataTime('yyyy-MM-dd hh:mm:ss')}}</div>
            <div>操作人：{{info.distOptorName}}</div>

            <div>派卡目标：{{info.recieveOrgName}}</div>
            <div>收卡人：{{info.reciever}}</div>

            <div>收费金额：{{info.unitPrice}}</div>
            <div>收款人：{{info.payOptorName}}</div>
            <div>收款时间：{{info.payTime|dataTime('yyyy-MM-dd hh:mm:ss')}}</div>
        </div>
        <div v-if="info.usedTime">
            <div class="line"></div>
            <div style="font-size: 14px;font-weight: 700">开卡信息</div>
            <div>开卡时间：{{info.usedTime|dataTime('yyyy-MM-dd hh:mm:ss')}}</div>
            <div>开卡机构：{{info.bindOrgName}}</div>
            <div>机构编码：{{info.bindOrgCode}}</div>
            <div>操作人：{{info.usedOptorName}}</div>
            <br>
        </div>
    </Row>
</template>

<script>
    export default {
        props: {item: null},
        data: function () {
            return {
                info: '',
            }
        },
        created: function () {
            this.getInfo();
        },
        methods: {
            getInfo() {
                this.request({
                    url: "/hykgl/getInfo.do",
                    param: {
                        id: this.item.id,
                    }
                }).then(res => {
                    this.info = res;
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