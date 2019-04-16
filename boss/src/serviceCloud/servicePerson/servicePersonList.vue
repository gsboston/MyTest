<template>
    <div id="ContractView">
        <div class="contract-list">
            <div v-for="item in taskList" class="contract-item" :class="selectedTask==item?'selected':''">
                <div @click="selectItem(item)" >
                    <div class="contract-item-name">
                        <p>{{item.customer_name}}</p>
                    </div>
                    <div style="margin-top: 7px;height: 25px;line-height: 25px;">
                        <div class="contract-item-price">
                            <p>￥{{item.settlement_price}}</p>
                        </div>
                        <div class="contract-item-service-type">
                            <Tag :type="selectedTask==item?null:'border'" :color="item.billDefType=='CONTRACT_SHEET'?'#54B499':'#F28390'">{{item.name}}</Tag>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="taskList.length<=0" class="contract-item" style="background: #f6faf9;color: #59b399">
                <div style="text-align: center">
                    <p>暂无数据</p>
                </div>
            </div>
        </div>
        <Page v-if="taskList.length>0" class="contract-page" size="small" :total="total" :current="current" @on-change="changePage"></Page>
    </div>
</template>

<script type="text/babel">
    export default {
        props:{
            searchText:{
                type:String,
                default:''
            },
            type:{
                type:String,
                default:''
            },
            state:{
                type:String,
                default:''
            }
        },
        data () {
            return {
                taskList: [],
                selectedTask:null,
                total: 0,
                current: 1
            }
        },
        created () {
            this.loadData();
        },
        mounted () {
        },
        methods: {
            loadData(){
                this.request({
                    url: "serviceCloud/servicePerson/taskList.do",
                    param:{
                        searchText:this.searchText,
                        page:this.current,
                        billType:this.type,
                        state:this.state
                    }
                }).then(data => {
                    this.taskList = data.records;
                    this.current = data.current;
                    this.total = data.total;
                    if(this.taskList&&this.taskList.length>0){
                        this.selectedTask = this.taskList[0];
                        this.$emit('change',this.selectedTask);
                    }else{
                        this.$emit('change','');
                    }
                });
            },
            selectItem(row){
                this.selectedTask=row;
                this.$emit('change',this.selectedTask);
            },
            changePage(page){
                this.current = page;
                this.loadData();
            }
        }
    };
</script>

<style scoped>
    .agreement-state-item > span:first-child {
        color: #2b2b2b;
        font-weight: 700;
        margin-right: 15px;
    }
    .agreement-state-item > .ivu-icon {
        float: right;
        font-size: 14px;
        line-height: 20px;
        color: #aaa;
        transition: transform .2s ease;
    }
    .agreement-state-item > .ivu-icon.expand {
        transform: rotate(-90deg);
    }
    .agreement-state-item > .ivu-tag {
        height: 18px;
        margin: 0 7px 0 0;
        line-height: 16px;
        color: #999;
        border: none;
    }
    .agreement-state-item > .state-item {
        color: #999;
        margin-right: 10px;
        cursor: pointer;
    }
    .agreement-state-item > .state-item.selected {
        color: #59b399;
    }
    .contract-item >>> .ivu-poptip-rel {
        display: initial;
    }
    .contract-info {
        min-width: 262px;
        padding: 10px;
        color: rgb(135, 135, 135);
        font-size: 13px;
        font-weight: normal;
    }
    .contract-info p {
        line-height: 19px;
        margin-bottom: 5px;
    }
    .contract-info p span:first-child {
        min-width: 70px;
        display: inline-block;
    }
    .contract-item {
        position: relative;
        padding: 12px 20px;
        color: black;
        font-weight: 700;
        border-bottom: 1px solid #f6f6f6;
        width: 100%;
    }
    .contract-item.selected {
        color: #59b399 !important;
        background-color: #f6faf9 !important;
    }
    .contract-item:hover {
        background: #f2f6f9;
    }
    .contract-item.selected:before {
        content:"";
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 4px;
        background: #59b399;
    }
    .contract-item-name{
        font-size: 14px;
        color: #333;
        font-weight: 700;
        line-height: 24px;
    }
    .contract-item.selected .contract-item-name{
        color: #59b399;
    }
    .contract-item-price{
        display: inline-block;
        font-size: 14px;
        color: #999;
        line-height: 18px;
        font-weight: normal;
    }
    .contract-item.selected .contract-item-price{
        color: #59b399;
    }
    .contract-item-change-type{
        display: inline-block;
        float: right;
        background-color: #FFF;
        font-size: 12px;
        color: #59b399;
        width: 75px;
        height: 25px;
        line-height: 24px;
        border-radius: 14px;
        text-align: center;
        border: 1px solid #59b399;
    }
    .contract-item.selected .contract-item-change-type{
        color: #FFFFFF;
        background-color: #59b399;
    }
    .contract-item-service-type{
        display: inline-block;
        float: right;
        font-size: 12px;
        font-weight: lighter;
    }


    .contract-page {
        padding: 5px 15px;
        text-align: right;
    }
    .ivu-page.mini >>> .ivu-page-next, .ivu-page.mini >>> .ivu-page-prev {
        margin: 0;
        min-width: 12px;
        height: 24px;
        line-height: 24px;
        border: 0;
    }
    .ivu-page.mini >>> .ivu-page-item-jump-next, .ivu-page.mini >>> .ivu-page-item-jump-prev, .ivu-page-next, .ivu-page-prev {
        display: inline-block;
        vertical-align: middle;
        min-width: 22px;
        height: 32px;
        line-height: 30px;
        list-style: none;
        text-align: center;
        cursor: pointer;
        color: #666;
        font-family: Arial;
        border-radius: 4px;
        transition: all .2s ease-in-out;
    }
    .contract-rejected > span{
        position: absolute;
        right: 5px;
        top: 2px;
        font-size: 14px;
        color: white;
    }

    .custom-button {
        float: right;
        background: transparent;
        color: rgb(135, 135, 135);
        border: 1px solid transparent;
        border-bottom: 1px solid rgb(135, 135, 135);
        border-radius: 0;
    }

    .change-red {
        position: absolute;
        top: 0;
        right: 0;
        width: 0;
        height: 0;
        border-top: 40px solid #FF6464;
        border-left: 40px solid transparent;
        opacity: 0.75;
    }

    .change-red > span {
        position: absolute;
        top: -33px;
        right: 5px;
        color: #FFF;
    }

</style>