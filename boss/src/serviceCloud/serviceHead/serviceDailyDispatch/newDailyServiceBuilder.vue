<style scoped>
    .ddd >>> .ivu-steps-item.ivu-steps-status-process .ivu-steps-head-inner {
        border-color: #59b399;
        background-color: #59b399;
    }

    .ddd >>> .ivu-steps-item.ivu-steps-status-finish .ivu-steps-head-inner {
        border-color: #59b399;
        background-color: #fff;
    }

    .ddd >>> .ivu-steps-item.ivu-steps-status-finish .ivu-steps-tail>i:after {
        background-color: #59b399;
    }

    .ddd >>> .ivu-steps-item.ivu-steps-status-finish .ivu-steps-head-inner span, .ivu-steps-item.ivu-steps-status-finish .ivu-steps-head-inner>.ivu-steps-icon{
        color: #59b399;
    }

</style>

<template>
    <div class="container">
        <div style="background-color: white; padding-left: 250px;">
            <div style="display: inline-block; width: 500px;">
                <Steps class="ddd" :current="step">
                    <Step :title="serviceOrderId?'重新指派服务单':'新建日常服务单'"></Step>
                    <Step title="上传资料"></Step>
                </Steps>
            </div>
        </div>
        <div v-if="step==0">
            <div ref="content"></div>
        </div>
        <div v-if="step==1" style="background-color: white;">
            <div style="font-size: 18px; font-weight: 700; padding: 20px 0px 20px 45px;">资料清单</div>
            <SDFileList :billId="billId" :isAllowAddRow="true"></SDFileList>
            <Row class="clearFix" style="text-align: center;padding-top: 50px;padding-bottom: 20px;clear: both;">
                <!--<i-button type="ghost" size="large" class="save-button" @click="save">取消</i-button>-->
                <i-button type="primary" size="large" class="audit-button" @click="showList">完成</i-button>
            </Row>
        </div>
    </div>
</template>

<script>
    import SDFileList from "../../serviceDispatch/SDFileList.vue";
    export default {
        components: {
            SDFileList
        },
        props:{
            isInit: false,
            serviceOrderId: null,
            serviceDefId:null,
        },
        data () {
            return {
                tpl:"",
                step: 0,
                billId: null,
            }
        },
        created: function () {
            this.$api.saveServiceDailyFromTemplate = this.saveServiceDaily;
            // if(this.isInit){
                this.jumpTarget();
            // }
        },
        methods: {
            /**
             * 跳转日常服务单页面
             */
            jumpTarget: function(){
                var vm = this;
                vm.renderTemplate(vm.serviceOrderId,true, vm.serviceDefId);
            },

            renderTemplate(serviceOrderId,isEditable,serviceDefId){
                this.request({
                    url:'/serviceCloud/getServiceDailyTemplate.do?serviceDefId='+serviceDefId,
                    // url:'/serviceCloud/getServiceDailyTemplate.do?typeId=JCRCFW',
                    responseType:'text'
                }).then((tpl)=>{
                    var contractContent = document.createElement('div');
                    contractContent.innerHTML = tpl;
                    if(this.$refs.content){
                        this.$refs.content.innerHTML = '';
                        this.$refs.content.appendChild(contractContent);
                    }
                    this.$nextTick(() => {
                        var scriptEl = contractContent.getElementsByTagName('script')[0];
                        contractContent.removeChild(scriptEl);
                        var instance = eval(scriptEl.innerHTML);
                        instance.$api = this.$api;
                        instance.init({
                            serviceDefId:serviceDefId,
                            serviceOrderId:serviceOrderId,
                            isEditable:isEditable,
                        });
                    });
                });
            },
            /**
             * 保存日常服务单
             */
            saveServiceDaily(sendData) {
////                alert("保存日常服务单");
                var vm = this;
                vm.request({
                    url: "/serviceCloud/saveDailyOrder.do",
                    data:sendData,
                    timeout: 60000
                }).then(data => {
                    this.billId = data;
                    this.step = 1;
//                    if(vm.isContractPerfect){
//                        vm.$api.newApiContractList();
//                    }else{
//                        vm.$api.jump("M03","F0303","");
//                    }
                });
            },
            showList() {
                this.$api.showList();
            },
        },
    }
</script>