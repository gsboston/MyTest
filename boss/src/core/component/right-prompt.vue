<style scoped>
    .container {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        width: 400px;
        padding: 15px 5px;
        background: white;
        transition: transform .3s;
        transform: translate(100%);
        overflow-x: hidden;
        overflow-y: auto;
        z-index: 5;
    }
    .container.open {
        transform: translate(0);
        border-left: solid 1px #dddee1;
        box-shadow: -1px 0 5px 0 #eaebee;
    }
</style>

<template>
    <div class="container" :class="{open: open}" :style="{width: width + 'px'}">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        props: {
            width: {
                type: Number || String,
                default: 400
            },
            open: {
                type: Boolean,
                default: false
            }
        }
    };
</script>