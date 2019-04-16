<template>
    <div class="service-cloud-container">
        <div class="service-cloud-center">
            <div class="service-cloud-content" ref="content"></div>
        </div>
    </div>
</template>

<script>
    import Vue from "vue";
    import "./router";

    export default {
        components: {
        },
        created () {
            this.$api.init();
        },
        mounted () {
            this._open();
        },
        methods: {
            _open () {
                let param = this.$route.query;
                let funcCode = param.funcCode;
                let props = param.props;
                if(funcCode) {
                    let config = (props == null ? null : {
                        props: JSON.parse(props)
                    });
                    this.renderPage(param.funcCode, config);
                }
            },
            renderPage (code, config) {
                this.$refs.content.innerHTML = "";
                if(Context.hasResource(code)) {
                    let comp = this.getPage(code, config);
                    if(comp) {
                        this.$refs.content.appendChild(comp.$el);
                    }
                }
            },
        },
        watch: {
            "$route" (to, from) {
                this._open();
            }
        }
    };
</script>

<style scoped>
    .service-cloud-container {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background:#f6f6f6;
    }
    .service-cloud-center {
        position: relative;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .service-cloud-content {
        position: relative;
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
    }
</style>