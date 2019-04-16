<template>
    <div class="sign-cloud-container" ref="contractList">
        <div class="sign-cloud-left">
            <component is="AuditList" ref="contract"></component>
        </div>
        <div class="sign-cloud-center">
            <div class="sign-cloud-content" ref="content"></div>
        </div>
    </div>
</template>

<script>
    import Vue from "vue";
    import "./router";
    import AuditList from "./auditList.vue";
    const ROUTER_STATUS = "sign_cloud_router_status";

    export default {
        components: {
            AuditList
        },
        created () {
            window._signCloud = this;
            this.$api.init();
        },
        mounted () {
            this.$api.openRight = this.openRight;
            //审核页面刷新操作
            this.$api.apiAuditSuccess = this.refresh;
            this.$api.apiSureReject = this.refresh;
        },
        methods: {
            openRight (code, config) {
                this.$refs.content.innerHTML = "";
                this.$refs.contractList.scrollIntoView()
                let comp = this.getPage(code, config);
                if(comp) {
                    this.$refs.content.appendChild(comp.$el);
                    comp.jumpTarget && comp.jumpTarget();
                }
                this.setRouterStatus(code, config);
            },
            closeRight () {
                this.$refs.content.innerHTML = "";
            },
            setRouterStatus (code, config) {
                let routerStatus = {
                    code: code,
                    config: config
                };
                sessionStorage.setItem(ROUTER_STATUS, JSON.stringify(routerStatus));
            },
            refresh() {
                this.$refs['contract'].search(null);
            }
        }
    };
</script>

<style scoped>
    .sign-cloud-container {
        position: relative;
        display: flex;
        display: -ms-flexbox;
        width: 100%;
        min-height: 100%;
        overflow: hidden;
        background:#f6f6f6;
    }
    .sign-cloud-left {
        width: 300px;
        background: white;
    }
    .sign-cloud-center {
        position: relative;
        flex: 1;
        -ms-flex: 1;
        height: 100%;
        margin: 0 auto;
        padding: 0px 25px 20px 30px;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .sign-cloud-content {
        position: relative;
        width: 100%;
        height: auto;
        background: white;
    }
</style>