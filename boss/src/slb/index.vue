<style scoped>
    .container {
        position: relative;
        width: 100%;
        height: 100%;
        min-height: 100%;
    }

    .content-panel {
        position: absolute;
        top: 20px;
        left: 25px;
        /*left: 225px;*/
        right: 25px;
        bottom: 20px;
        background: white;
        border-radius: 0;
        overflow-x: hidden;
        overflow-y: auto;
        box-shadow: 5px 5px 10px #e0e0e0;
    }
</style>

<template>
    <div class="container" id="systemManageIndex">
        <div class="content-panel">
            <func-node v-if="funcCode != null" :code="funcCode"></func-node>
        </div>
    </div>
</template>

<script>
    import "./router";

    export default {
        data: function () {
            return {
                funcCode: null
            };
        },
        created: function () {
            this.$api.init();
            let param = this.$route.query;
            if (param.funcCode) {
                this.open(param.funcCode);
            }
        },
        methods: {
            open(code) {
                if (Context.hasResource(code)) {
                    this.funcCode = code;
                }
            }
        },
        watch: {
            "$route"(to, from) {
                let param = this.$route.query;
                if (param.funcCode) {
                    this.open(param.funcCode);
                }
            }
        }
    }
</script>