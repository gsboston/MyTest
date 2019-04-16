<template>
    <div class="container">
        <div class="title" style="display: flex;margin-top: 10px;white-space: nowrap;">合约编号
            <span style="margin: 0 50px;font-size: 16px; line-height: 18px;">{{contractInfo.code}}</span>
            <div style="width: 100%;text-align: right;font-size: 14px;">
                <p style="display: inline-block;margin-right: 50px;" v-if="contractInfo.optUserName">
                    <span>业务员：</span>
                    <span class="item-text">{{ contractInfo.optUserName }}</span>
                </p>
                <p style="display: inline-block;margin-right: 50px;" v-if="contractInfo.approvalUseName">
                    <span>审核员：</span>
                    <span class="item-text">{{ contractInfo.approvalUseName }}</span>
                </p>
            </div>
        </div>
        <div class="clearFix">
            <component is="SDContractInfo" :contractInfo="contractInfo" @on-refresh="refresh"></component>
        </div>

        <div class="title">服务派单</div>
        <div class="collection-info">
            <component is="SDList" :contractInfo="contractInfo" ref="serviceView" @on-refresh="refresh"></component>
        </div>
    </div>
</template>

<script>
    import SDContractInfo from "./SDContractInfo";
    import SDList from "./SDList";

    export default {
        components: {
            SDContractInfo,
            SDList
        },
        props: {
            contractInfo: null
        },
        filters: {
            formatDate(time) {
                var date = new Date(time);
                return date.format('yyyy-MM-dd');
            }
        },
        data: function() {
            return {
                contractElseInfo: {},
            }
        },
        created: function () {

        },
        methods: {
            showPDF (pdfId) {
                if (pdfId) {
                    window.open('/ossController/oss/file.do?id=' + pdfId);
                }else {
                    this.$Message.error('没有合同文件！');
                }
            },
            refresh() {
                this.$refs['serviceView'].initSDList();
            }
        }
    }
</script>

<style scoped>
    .container {
        padding: 10px 20px;
        background: #f6f6f6;
    }

    .container > .title {
        margin-top: 30px;
        font-size: 18px;
        line-height: 1;
        font-weight: bold;
        color: #aaa;
    }

    .container .item-text {
        color: #333;
        font-weight: normal;
    }
</style>