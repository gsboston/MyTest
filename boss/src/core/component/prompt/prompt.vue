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
        position: relative;
        width: 800px;
        margin: 30px auto;
        /*margin-top: -0px;*/
        border: solid 1px rgba(102, 102, 102, 0.5);
        box-shadow: 0 3px 3px gray;
        /*border-radius: 7px;*/
        border-bottom-left-radius: 7px;
        border-bottom-right-radius: 7px;
        background: white;
        transition: all 300ms ease;
        /*transform: translateY(-500px);*/
    }
    .prompt-dialog {
        position: relative;
        width: 100%;
        height: 100%;
    }
    .prompt-dialog > .header {
        /*box-shadow: 0 0px 0px gray;*/
        background-color: white;
        position: absolute;
        top: -49px;
        height: 49px;
        line-height: 30px;
        font-size: 16px;
        color: #1c2438;
        padding: 9px 16px;
        border-bottom: 1px solid #e7e9ef;
        border-top: solid 1px rgba(102, 102, 102, 0.5);
        border-left: solid 1px rgba(102, 102, 102, 0.5);
        border-right: solid 1px rgba(102, 102, 102, 0.5);
        border-top-left-radius: 7px;
        border-top-right-radius: 7px;
    }
    .prompt-dialog > .header > .close {
        float: right;
        color: #999;
        font-size: 20px;
        line-height: 30px;
    }
    .prompt-dialog > .header > .close:hover {
        color: #444;
    }
    .prompt-dialog > .body {
        padding: 5px;
        overflow-x: hidden;
        overflow-y: auto;
    }
</style>

<template>
    <div class="prompt-container" ref="container">
        <div class="prompt-panel" :style="panelStyle" ref="panel">
            <div class="prompt-dialog">
                <div class="header" ref="header" :style="headerStyle" style="left: -1px;">
                    {{title}}
                    <a href="javascript: void(0);" class="close" @click="handleBeforeClose">
                        <Icon type="close"></Icon>
                    </a>
                </div>
                <div class="body" :style="bodyStyle" ref="body">
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
                type: [Number, String],
                default: 500,
            },
            top: {
                type: Number,
                default: 50
            },
            bottom: {
                type: Number,
                default: 0
            },
            beforeClose: {
                type: Function,
                default: null
            },
            afterClose: {
                type: Function,
                default: null
            }
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
                        this.$refs.panel.style.marginTop = (this.top + 49) +  "px";
//                        this.$refs.panel.style.transform = "translateY(0px)";
                    });
                });
            },
            handleBeforeClose() {
                if (!this.beforeClose) {
                    return this.closeSelf();
                }

                const before = this.beforeClose();
                if (before && before.then) {
                    before.then(() => {
                        this.closeSelf();
                    }, () => {

                    });
                } else if (before !== false) {
                    this.closeSelf();
                } else {

                }
            },
            handleAfterClose() {
                this.afterClose && this.afterClose();
            },
            closeSelf: function() {
                this.$nextTick(() => {
                    this.$refs.container.style.background = "rgba(255, 255, 255, 0)";
                    this.$refs.panel.style.marginTop = this.marginTop;
//                    this.$refs.panel.style.transform = this.translateY;
                    setTimeout(() => {
                        this.$parent.remove();
                        this.handleAfterClose();
                    }, 300);
                });
            }
        },
        computed: {
            translateY () {
                return "translateY(-" + (this.height + this.top + 50) + "px)";
            },
            marginTop () {
//                return "-" + this.height + "px";
                return (String(this.height).indexOf("%") == -1 ? "px" : "%") + " - 49px";
            },
            panelStyle: function() {
                return {
                    width: (String(this.width).indexOf("%") == -1 ? ((this.width)+"px") : document.body.clientWidth * (String(this.width).split('%')[0]) / 100 +"px"),
//                    width: this.width + (String(this.width).indexOf("%") == -1 ? "px" : "%"),
//                    marginTop: this.marginTop
//                    transform: this.translateY
                }
            },
            headerStyle: function() {
                return {
//                    width: (this.width + 2) + (String(this.width).indexOf("%") == -1 ? "px" : "%"),
                    width: (String(this.width).indexOf("%") == -1 ? ((this.width)+"px") : document.body.clientWidth * (String(this.width).split('%')[0]) / 100 +"px"),
                }
            },
            bodyStyle: function() {
                return {
                    width: (String(this.width).indexOf("%") == -1 ? ((this.width)+"px") : document.body.clientWidth * (String(this.width).split('%')[0]) / 100 +"px"),
                    height: (String(this.height).indexOf("%") == -1 ? ((this.height)+"px") : document.body.clientHeight * (String(this.height).split('%')[0]) / 100 - this.bottom+ "px")
                }
            }
        }
    }
</script>