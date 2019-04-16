<template>
    <Tooltip :content="describe" class="tooltip">
        <div style="width: 100%; cursor: default; overflow: hidden; white-space: nowrap; text-overflow:ellipsis;">
            {{describe}}
        </div>
    </Tooltip>
</template>

<script>
    export default {
        props: {
            describe: ""
        }
    };
</script>

<style scoped>
    .tooltip {
        width: 100%;
        height: 100%;
    }
    .ivu-tooltip >>> .ivu-tooltip-rel {
        display: block;
    }
</style>

<style>

</style>