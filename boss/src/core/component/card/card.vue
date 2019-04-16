<style scoped>
    .prompt-container {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0);
        z-index: 999;
        transition: all 300ms;
    }
    .prompt-panel {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        width: 800px;
        margin-right: -850px;
        /*width: 0;*/
        /*border: solid 1px rgba(102, 102, 102, 0.5);*/
        /*box-shadow: 0 3px 3px gray;*/
        /*border-radius: 7px;*/
        border-top: solid 4px #59b399;
        background: white;
        transition: all 300ms ease;
        /*transform: translateX(800px);*/
    }
    .prompt-dialog {
        position: relative;
        width: 100%;
        height: 100%;
    }
    .prompt-dialog > .header {
        position: absolute;
        top: -4px;
        right: 100%;
        width: 41px;
        height: 45px;
        background: #59b399;
        text-align: center;
        border-top: solid 4px #59b399;
        border-left: solid 1px white;
        border-bottom: solid 1px white;
        border-bottom-left-radius: 3px;
        cursor: pointer;
    }
    .prompt-dialog > .header > .close {
        /*color: #999;*/
        color: white;
        font-size: 20px;
        line-height: 40px;
    }
    .prompt-dialog > .header:hover {
        background: white;
        border-left: solid 1px #59b399;
        border-bottom: solid 1px #59b399;
    }
    .prompt-dialog > .header:hover > .close {
        color: #59b399;
    }
    .prompt-dialog > .body {
        width: 100%;
        height: 100%;
        padding: 5px;
        overflow-x: hidden;
        overflow-y: auto;
    }
</style>

<template>
    <div class="prompt-container" ref="container">
        <div class="prompt-panel" :style="panelStyle" ref="panel" >
            <div class="prompt-dialog">
                <div class="header" @click="closeSelf">
                    <a href="javascript: void(0);" class="close">
                        <Icon type="close"></Icon>
                    </a>
                </div>
                <!--<div class="header">-->
                    <!--{{title}}-->
                    <!--<a href="javascript: void(0);" class="close" @click="closeSelf">-->
                        <!--<Icon type="close"></Icon>-->
                    <!--</a>-->
                <!--</div>-->
                <div class="body" ref="body">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,
                default: ""
            },
            width: {
                type: [Number, String],
                default: 800
            },
            height: {
                type: Number,
                default: 500
            },
        },
        data: function() {
            return {};
        },
        methods: {
            render: function(content) {
                this.$refs.body.appendChild(content);
            },
            open () {
                this.$nextTick(() => {
                    this.$refs.container.style.background = "rgba(55, 55, 55, 0.6)";
                    setTimeout(() => {
                        this.$refs.panel.style.marginRight = 0;
//                        this.$refs.panel.style.transform = "translateX(0px)";
                    });
                });
            },
            closeSelf: function() {
                this.$nextTick(() => {
                    this.$refs.container.style.background = "rgba(255, 255, 255, 0)";
                    this.$refs.panel.style.marginRight = this.marginRight;
//                    this.$refs.panel.style.transform = "translateX(" + this.width + "px)";
                    setTimeout(() => {
                        this.$parent.remove();
                    }, 300);
                });
            }
        },
        computed: {
            marginRight () {
                return "-" + (this.width + 50) + "px";
            },
            panelStyle: function() {
                return {
                    width: this.width + (String(this.width).indexOf("%") == -1 ? "px" : ""),
                    marginRight: this.marginRight
                }
            }
        }
    }
</script>