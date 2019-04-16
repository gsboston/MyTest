<style scoped>
    .container {
        background: #f6f6f6;
    }
    .panel {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 50px;
        background: white;
        border-bottom: solid 1px #dddee1;
    }
    .left {
        position: absolute;
        top: 50px;
        left: 0;
        bottom: 0;
        width: 300px;
        padding-bottom: 10px;
        border-right: solid 1px #dddee1;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .center {
        position: absolute;
        top: 50px;
        left: 300px;
        right: 0;
        bottom: 0;
        background: #f7f7f7;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .tab-head{
        position: relative;
        /*height:50px;*/
        border-bottom: solid 1px #f6f6f6;
        padding: 8px 15px;
    }
    .tab-panel > .tab-item {
        position: relative;
        float: left;
        line-height: 32px;
        font-size: 14px;
        color: #333;
        cursor: pointer;
    }
    .tab-panel > .tab-item:nth-child(2) {
        margin-left: 10px;
        padding-left: 10px;
    }
    .tab-panel > .tab-item.active {
        color: #59b399;
        font-weight: 700;
    }
    .tab-panel > .tab-item:nth-child(2):before {
        content: "";
        position: absolute;
        top: 7px;
        left: 0;
        bottom: 7px;
        width: 1px;
        background: #e5e5e5;
    }
    .tab-panel > .ivu-input-wrapper {
        margin-left: 10px;
    }
    .tab-tool-left{
        border-right: 2px solid #F2F2F2;
        padding-right: 5px;
        color: #A2A2A4;
        font-weight: bold;
        cursor: pointer;
    }
    .tab-tool-right{
        padding-left: 5px;
        color: #A2A2A4;
        font-weight: bold;
        cursor: pointer;
    }
    .tab-tool-active{
        color: #59b399;
    }
</style>
<template>
    <div class="container">
        <div class="panel">
            <div class="tab-head">
                <div class="tab-panel clearFix">
                    <span class="tab-tool-left" :class="state=='2'?'tab-tool-active':''" @click="selectTab('2')">待处理</span>
                    <span class="tab-tool-right" :class="state=='1'?'tab-tool-active':''" @click="selectTab('1')">已处理</span>
                    <Input v-model="searchText" style="width: 260px;" icon="ios-search" :maxlength="20" placeholder="客户名称/客户电话/服务单编号" @on-click="searchList"/>
                </div>
            </div>
        </div>
        <div class="left">
            <ServicePersonList ref="taskListRef" :state="state" :searchText="searchText" @change="changeItem"></ServicePersonList>

        </div>
        <div class="center">
            <ServicePersonContent v-if="billId!=''&&contentType=='CONTRACT_SHEET'" ref="taskContentRef" :billId="billId"  @on-refresh-task-list="refreshTask"></ServicePersonContent>
            <ServicePersonDailyContent v-if="billId!=''&&contentType=='DAILY_SHEET'" ref="taskContentRef" :billId="billId" @on-refresh-task-list="refreshTask"></ServicePersonDailyContent>
        </div>
    </div>
</template>
<script type="text/babel">
    import ServicePersonList from "./servicePersonList.vue"
    import ServicePersonContent from "./servicePersonContent.vue"
    import ServicePersonDailyContent from "./servicePersonDaily.vue"
    export default {
        components: {
            ServicePersonList,
            ServicePersonContent,
            ServicePersonDailyContent
        },
        data () {
            return {
                searchText:'',
                billId:'',
                contentType:'',
                state:'2'
            }
        },
        methods:{
            searchList(){
                this.$refs['taskListRef'].loadData();
            },
            selectTab(state){
                this.state = state;
                this.billId="";
                this.$nextTick(()=>{
                    this.searchList();
                });
            },
            changeItem(item){
                if(item==''){
                    this.billId = '';
                }else{
                    this.billId=item.id;
                    this.contentType=item.billDefType;
                    this.$nextTick(()=>{
                        this.$refs['taskContentRef'].init();
                    });
                }

            },
            refreshTask(){
                this.searchList();
            }
        }
    }
</script>