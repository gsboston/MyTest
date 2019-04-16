<style scoped>

</style>

<template>
    <div style="padding: 15px;">
        <div style="height:400px; overflow-y: auto;">
            <SDFileList :billId="billId" :isAllowAddRow="true"></SDFileList>
        </div>
        <!--<div style="float: right;">-->
            <!--<Button @click="close">关闭</Button>-->
        <!--</div>-->
    </div>
</template>

<script>
    import SDFileList from "../../serviceDispatch/SDFileList.vue";
    export default {
        components: {
            SDFileList
        },
        props:{
            billId:null,
        },
        data () {
            return {

            }
        },
        created: function () {
        },
        methods: {
            close() {
                this.callback();
            },
        },
    }
</script>