<style scoped>
    .treeNodeItem{
        display: inline-block;
        cursor: pointer;
    }
    .treeNodeItem:hover{
        color: #FFF;
        background: #59b399;
    }
    .selected{
        color: #FFF;
        background: #59b399;
    }
    .treeNodeItem *{
        display: inline-block;
        padding-right: 30px;
    }
    .treeNodeItem-code{
    }
    .treeNodeItem-title{
    }
    .treeNodeItem-describe{

    }
</style>
<template>
    <div  :class="node.selected?'treeNodeItem selected':'treeNodeItem'"   class="" @click="handleSelect">
        <div class="treeNodeItem-code">【{{node.code}}】</div>
        <div class="treeNodeItem-title">{{node.title}}</div>
        <div class="treeNodeItem-describe">{{node.describe?('—&nbsp;&nbsp;&nbsp;&nbsp;'+node.describe):''}}</div>
    </div>
</template>

<script>
    export default {
        name: 'bdTreeNode',
        props:{
            node:{}
        },
        data: function() {
            return {
                selectedId:0
            };
        },
        created: function() {

        },
        methods: {
            handleSelect(){
                this.$parent.handleSelect();
            }
        }
    };
</script>

