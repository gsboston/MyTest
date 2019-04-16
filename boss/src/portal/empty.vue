<template>
    <div class="container">
        <div class="tips">您没有可供操作的模块，请联系系统管理员～</div>
    </div>
</template>

<script>
    export default {};
</script>

<style scoped>
    .container {
        position: relative;
        width: 100%;
        height: auto;
        padding-top: 253px;
        background: #f6f6f6 url("../image/empty.png") center 100px no-repeat;
        text-align: center;
    }
    .container > .tips {
        font-size: 16px;
        line-height: 1.5;
        text-align: center;
        color: #333;
        background: #f6f6f6;
    }
</style>