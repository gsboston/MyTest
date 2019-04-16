<style scoped>
    .audit-container{
        padding: 20px 10px;
        font-size: 14px;
    }
    .rule-open{
        padding: 10px 0 30px 0;
    }
    .rule-open >>> .ivu-switch-checked{
        border-color: #59b399;
        background-color: #59b399;
    }
    .list-head{
        height: 55px;
        width: 100%;
        font-size: 14px;
        color: #5d5d5d;
        line-height: 55px;
        overflow: hidden;
    }
    .list-column-80{
        padding: 0 3px;
        text-align: center;
        display: inline-block;
        width: 80px;
        border-left: 1px solid #e5e5e5;
    }
    .list-column-90{
        padding: 0 3px;
        text-align: center;
        display: inline-block;
        width: 90px;
        border-left: 1px solid #e5e5e5;
    }
    .list-column-100{
        padding: 0 3px;
        text-align: center;
        display: inline-block;
        width: 100px;
        border-left: 1px solid #e5e5e5;
    }
    .list-column-130{
        padding: 0 3px;
        text-align: center;
        display: inline-block;
        width: 130px;
        border-left: 1px solid #e5e5e5;
    }
    .list-column-160{
        padding: 0 3px;
        text-align: center;
        display: inline-block;
        width: 160px;
    }
    .list-head >>> .ivu-input{
        border-top: 0;
        border-left: 0;
        border-right: 0;
        border-radius: 0;
    }
</style>
<template>
    <div class="audit-container">
        <Row class="rule-open">
            开关： <i-switch v-model="isAutoApprove" @on-change="changeOpenSwitch"></i-switch>
        </Row>
        <div style="border: 1px solid #e5e5e5;">
            <div class="list-head" style="background-color: #f8f8f9">
                <div class="list-column-160"><span>规则名称</span><span style="color: red">*</span></div>
                <div class="list-column-100"><span>规则描述</span><span style="color: red">*</span></div>
                <div class="list-column-90"><span>限制类型</span><span style="color: red">*</span></div>
                <div class="list-column-80"><span>单位</span><span style="color: red">*</span></div>
                <div class="list-column-90"><span>检测类</span><span style="color: red">*</span></div>
                <div class="list-column-130"><span>说明</span></div>
                <div class="list-column-80"><span>操作</span></div>
            </div>
            <div class="list-head" style="border-top: 1px solid #e5e5e5;" v-for="(item,index) in ruleList">
                <div class="list-column-160" :title="item.title?item.title:ruleItem.title">
                    <Input v-if="item.flag" v-model="ruleItem.title" placeholder="(必填)规则名称"></Input>
                    <span>{{item.title | wordLengthLimit9}}</span>
                </div>
                <div class="list-column-100">
                    <Input v-if="item.flag" v-model="ruleItem.describe" placeholder="(必填)金额/服务费/赠送月份"></Input>
                    <span>{{item.describe}}</span>
                </div>
                <div class="list-column-90">
                    <Select v-if="item.flag" v-model="ruleItem.type" placeholder="(必填)数字或文本">
                        <Option value="NUMBER">数字</Option>
                        <Option value="TEXT">文本</Option>
                    </Select>
                    <span>{{item.typeName}}</span>
                </div>
                <div class="list-column-80">
                    <Input v-if="item.flag" v-model="ruleItem.unit" placeholder="(必填)单位"></Input>
                    <span>{{item.unit}}</span>
                </div>
                <div class="list-column-90" :title="item.measureClass?item.measureClass:ruleItem.measureClass">
                    <Input v-if="item.flag" v-model="ruleItem.measureClass" placeholder="(必填)检测类名"></Input>
                    <span>{{item.measureClass | wordLengthLimit9}}</span>
                </div>
                <div class="list-column-130" :title="item.remark?item.remark:ruleItem.remark">
                    <Input v-if="item.flag" v-model="ruleItem.remark" placeholder="说明"></Input>
                    <span v-else>{{item.remark}}</span>
                </div>
                <div class="list-column-80">
                    <Button v-if="item.flag" type="primary" size="small" @click="saveRule(ruleItem)">保存</Button>
                    <Button v-else type="ghost" size="small" @click="removeRule(item)">删除</Button>
                </div>
            </div>
        </div>
        <Button size="small" type="primary" style="margin-top: 20px" @click="addRule">新增规则</Button>
    </div>
</template>
<script>
    import ICol from "../../../node_modules/iview/src/components/grid/col.vue";

    export default {
        components: {
            ICol
        },
        filters: {
            wordLengthLimit9 : function (value) {
                if(value && value.length > 9){
                    return value.substring(0,9) + "..." ;
                }
                return value;
            },
        },
        props: {
            contractDefId: null,
            contractIsAutoApprove: {
                type: Boolean,
                default: false
            },
        },
        data () {
            return {
                isAutoApprove: false,
                ruleItem: {
                    title: null,
                    describe: null,
                    type: "NUMBER",
                    unit: null,
                    measureClass: null,
                    remark: null,
                },
                ruleList: [
                ],
            }
        },
        created:function(){
            this.isAutoApprove = this.contractIsAutoApprove;
            this.getRulesListById();
        },
        methods:{

            //控制开关
            changeOpenSwitch (status) {
                this.request({
                    url: "/systemManage/auditConfigurationPage/changeOpenSwitch.do",
                    param: {
                        contractDefId: this.contractDefId,
                        status: status,
                    }
                }).then(() => {
                });
            },
            //获取规则列表
            getRulesListById () {
                var vm = this;
                this.request({
                    url: "/systemManage/auditConfigurationPage/getRulesListById.do",
                    param: {
                        contractDefId: this.contractDefId
                    }
                }).then((data) => {
                    if(data){
                        data.forEach(item =>{
                            if(item.type == "NUMBER"){
                                item.typeName = "数字";
                            }else{
                                item.typeName = "文本";
                            }
                            if(!item.remark){
                                item.remark = "-";
                            }
                        });
                        vm.ruleList = data;
                    }else{
                        vm.ruleList = [];
                    }
                });
            },
            //新增规则
            addRule () {
                for(var i=0;i<this.ruleList.length;i++){
                    if(this.ruleList[i].flag){
                        this.$Message.info("请先保存上一条审核规则！");
                        return;
                    }
                }
                this.ruleList.push({title:"",describe:"",type:"",unit:"",measureClass:"",remark:"",flag:true});
            },
            //保存规则
            saveRule (item) {
                if(!item.title){
                    this.$Message.error("请填写规则名称！");
                    return;
                }
                if(!item.describe){
                    this.$Message.error("请填写规则描述！");
                    return;
                }
                if(!item.type){
                    this.$Message.error("请选择限制类型！");
                    return;
                }
                if(!item.unit){
                    this.$Message.error("请填写单位！");
                    return;
                }
                if(!item.measureClass){
                    this.$Message.error("请填写检测类名称！");
                    return;
                }
                let sendData = {};
                sendData.contractDef = this.contractDefId;
                sendData.title = item.title;
                sendData.describe = item.describe;
                sendData.type = item.type;
                sendData.unit = item.unit;
                sendData.measureClass = item.measureClass;
                sendData.remark = item.remark;
                this.request({
                    url: "/systemManage/auditConfigurationPage/saveRule.do",
                    data: sendData
                }).then(() => {
                    this.getRulesListById();
                    this.ruleItem = {
                        title: null,
                        describe: null,
                        type: "NUMBER",
                        unit: null,
                        measureClass: null,
                        remark: null,
                    };
                });
            },
            //删除规则
            removeRule (item) {
                this.request({
                    url: "/systemManage/auditConfigurationPage/removeRule.do",
                    param: {
                        ruleId: item.id
                    }
                }).then(() => {
                    this.getRulesListById();
                });
            },
        }
    }
</script>