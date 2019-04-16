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
        <div class="title"><span class="title-text">选择岗位人员</span></div>
        <br>
        <div>
            <Transfer :data="allPersonList" :list-style="listStyle" :titles="['待选人员','已选人员']" :render-format="renderFormat" :target-keys="sendPersonList"   @on-change="changePerson"></Transfer>
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
                sendPersonList:[],
                allPersonList:[],
                listStyle: {
                    height: '350px'
                }
            }
        },
        created: function () {
            this.loadPostPerson();
            this.loadAllPerson();
        },
        methods: {
            save(){
                this.request({
                    url: "/systemManage/serviceSend/changePersonList.do",
                    data:{
                        id:this.id,
                        targetKeys:this.sendPersonList
                    }
                }).then(data => {
                    this.$Message.info('操作成功');
                    this.loadPostPerson();
                    this.callback();
                });
            },
            loadPostPerson(){
                this.request({
                    url: "/systemManage/serviceSend/personList.do?id="+this.id
                }).then(data => {
                    this.sendPersonList=data.map((m)=>{
                        return m.id;
                    });
                });
            },
            loadAllPerson(){
                this.request({
                    url: "/systemManage/serviceSend/allPersonList.do"
                }).then(data => {
                    this.allPersonList=data.map((m)=>{
                        m.key=m.id;
                        return m;
                    });
                });
            },
            changePerson(targetKeys){
                this.sendPersonList=targetKeys;
            },
            renderFormat (item) {
                return item.realName;
            }
        }
    };
</script>

