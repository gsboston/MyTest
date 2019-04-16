<template>
    <div>
        <div style="text-align: center;padding: 30px 0">
            <Icon style="font-size: 40px;color: orange" type="help-circled"></Icon>
            <span style="position: relative;top: -10px;left: 10px">是否使用系统自动审核</span>
        </div>
        <div style="text-align: center">
            <Button type="primary" @click="autoAudit">系统自动审核</Button>
            <Button type="ghost" @click="personAudit">提交人工审核</Button>
        </div>
    </div>
</template>

<script>

    export default {
        created:function(){
        },
        data () {
            return {
            }
        },
        methods: {
            autoAudit(){
                this.callback("autoAudit");
            },
            personAudit(){
                this.callback("personAudit");
            },
        },
    }
</script>
<style scoped>
</style>
