<template>
    <div class="container">
        <div class="tips">没有查询到符合条件的合约<span v-if="B030201">，快去创建吧～</span></div>
        <div class="btn-panel">
            <Button v-if="B030201" size="large" @click.native="addContract"><Icon type="plus"></Icon> 新建合约</Button>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                B030201: false
            };
        },
        created () {
            let authRes = window.Context._getAuthResources("F0302");
            this.B030201 = authRes.B030201;
        },
        methods: {
            addContract () {
                this.$api.openRight("contractSelector");
            }
        }
    };
</script>

<style scoped>
    .container {
        position: relative;
        width: 100%;
        height: auto;
        padding-top: 253px;
        background: #f6f6f6 url("./image/no-contract.png") center 100px no-repeat;
        /*background-size: 116px 119px;*/
        text-align: center;
    }
    .container > .tips {
        font-size: 16px;
        line-height: 1.5;
        text-align: center;
        color: #333;
        background: #f6f6f6;
    }
    .container > .btn-panel {
        margin-top: 30px;
        text-align: center;
        background: #f6f6f6;
    }
    .container > .btn-panel > .ivu-btn {
        width: 150px;
        background: #59b399;
        color: white;
    }
</style>