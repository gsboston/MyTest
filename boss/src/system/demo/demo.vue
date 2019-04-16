<template>
    <div>
        Hello World!
        <BSUpload multiple :beforeUpload="beforeUpload" multiple :onSuccess="onSuccess" :showProcess="false"><Button>上传</Button></BSUpload>
        <img v-if="url" :src="url"/>
        <a :href="url"></a>
    </div>
</template>

<script>
    export default {
        data: function() {
            return {
                url:"",
                list:[],
                flag:false
            };
        },
        methods: {
            beforeUpload:function(file){
                this.list.push(file);
                if(this.list.length>2){
                    if(!this.flag)
                        this.$Message.info('123123');
                    this.flag=true;
                    setTimeout(()=>{
                        this.flag=false;
                    },1500);
                }
            },
            onSuccess:function(id){
                this.url = this.$updateConfig.file+id;

            }
        }
    }
</script>

<style scoped>
</style>