<style scoped>
    .layer {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: transparent;
        /*background: rgba(200, 200, 200, .3);*/
        z-index: 1000;
    }
    .layer > div {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 200px;
        height: 60px;
        margin-top: -20px;
        margin-left: -100px;
        line-height: 60px;
        font-size: 16px;
        font-weight: bold;
        background: rgba(100, 100, 100, .5);
        border-radius: 7px;
        color: white;
        text-align: center;
    }
</style>

<template>
    <div class="layer" v-if="showMode">
        <div>加载中，请稍后......</div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                showTime: null,
                queue: 0,
                showMode: false
            };
        },
        methods: {
            show () {
                this.showTime = new Date().getTime();
                this.queue++;
                this.showMode = true;
            },
            hide () {
                this.queue--;
                if(this.queue <= 0) {
                    this.queue == 0;
                }
                let _hide = (function() {
                    this.showMode = false;
                }).bind(this);
                let during = new Date().getTime() - this.showTime;
                if(during < 500) {
                    setTimeout(_hide, 500 - during)
                }else {
                    _hide();
                }
            }
        }
    };
</script>