<style scoped>
</style>
<template>
    <div>
        <Transfer
                :titles="titles"
                :data="allDutyList"
                :list-style="listStyle"
                :target-keys="usedDutyList"
                filterable
                :operations="['解除','分配']"
                @on-change="handleChange"></Transfer>
    </div>
</template>

<script>
    export default {
        props:{
            roleId:undefined
        },
        data: function() {
            return {
                allDutyList:[],
                usedDutyList:[],
                listStyle: {
                    width: '300px',
                    height: '400px'
                },
                titles:['待分配职责','已分配职责']
            }
        },
        created: function() {
            this.loadAllDuty();
            this.loadUsedDuty();
        },
        methods: {
            loadAllDuty(){
                this.request({
                    url: "/systemManage/duty/findAllDuty.do"
                }).then(data => {
                    this.allDutyList = data.map((item)=>{
                        return {
                            'key':item.id,
                            'label':item.name,
                            'id':item.id
                        }
                    });
                });
            },
            loadUsedDuty(){
                this.request({
                    url: "/systemManage/role/findDutyByRole.do?id="+this.roleId
                }).then(data => {
                    this.usedDutyList = data.map((item)=>{
                        return item.id;
                    });
                });
            },
            handleChange (targetKeys) {
                this.request({
                    url: "/systemManage/role/refRoleDuty.do",
                    data:{
                        id:this.roleId,
                        dutyList:targetKeys
                    }
                }).then(data => {
                    this.loadUsedDuty();
                    this.callback();
                });
            },
            filterMethod (data, query) {
            }
        }
    };
</script>

