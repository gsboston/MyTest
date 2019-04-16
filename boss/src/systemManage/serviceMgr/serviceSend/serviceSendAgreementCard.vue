<style scoped>
.root{
    padding: 20px;
}
.title-text{
    font-size: 18px;
    font-weight: bold;
}
</style>

<template>
    <div class="root">
        <div class="title"><span class="title-text">选择可派合约</span></div>
        <div>
            <Transfer :list-style="listStyle" :data="allAgreementList" :render-format="renderFormat" :target-keys="sendAgreementList"   @on-change="changeAgreement"></Transfer>
        </div>
        <br>
        <div style="float: right;padding-right: 24px">
            <Button @click="save" type="ghost">保存</Button>
        </div>
    </div>
</template>

<script type="text/babel">
    export default {
        props:{
            id:''
        },
        data () {
            return {
                sendAgreementList:[],
                allAgreementList:[],
                listStyle: {
                    height: '350px'
                }
            }
        },
        created: function () {
            this.loadPostAgreement();
            this.loadAllAgreement();
        },
        methods: {
            save(){
                this.request({
                    url: "/systemManage/serviceSend/changeAgreementList.do",
                    data:{
                        id:this.id,
                        targetKeys:this.sendAgreementList
                    }
                }).then(data => {
                    this.$Message.info('操作成功');
                    this.loadPostAgreement();
                    this.callback();
                });
            },
            loadPostAgreement(){
                this.request({
                    url: "/systemManage/serviceSend/agreementList.do?id="+this.id
                }).then(data => {
                    this.sendAgreementList=data.map((m)=>{
                        return m.id;
                    });
                });
            },
            loadAllAgreement(){
                this.request({
                    url: "/systemManage/serviceSend/allAgreementList.do"
                }).then(data => {
                    this.allAgreementList=data.map((m)=>{
                        m.key=m.id;
                        return m;
                    });
                });
            },
            changeAgreement(targetKeys){
               this.sendAgreementList = targetKeys;
            },
            renderFormat (item) {
                return item.name;
            }
        }
    };
</script>

