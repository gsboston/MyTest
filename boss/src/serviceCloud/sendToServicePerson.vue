<style scoped>
    .no-label{
        display: inline-block;
    }
    .no-label >>> .ivu-form-item-content{
        margin-left: 0px !important;
    }
    .ivu-form-item-required >>> .ivu-form-item-error-tip {
        position: absolute;
        top: 100%;
        left: 0;
        line-height: 1;
        padding-top: 2px;
        color: #ed3f14;
    }
    .ivu-form-item-required >>> label{
        font-size: 14px;
        font-weight: 600;
    }
    .light-bulb >>> .ivu-select-selection{
        border-color: #59b399;
        box-shadow: 0 0 0 2px rgba(89, 179, 153, .2);
    }
    .plus-icon{
        width: 33px;
        height: 33px;
        border: 1px solid #dddeee;
        position: relative;
        top: -3px;
        margin-left: 10px;
        display: inline-block;
        text-align: center;
        border-radius: 3px;
    }
    .plus-icon > i{
        font-size: 12px;
        font-weight: bold;
        position: relative;
        top: 5px;
    }
    .no-label >>> .ivu-select-dropdown{
        max-height: 80px;
    }
    .no-label >>> .ivu-tooltip{
        width: 118px;
    }
</style>
<template>
    <div class="container">
        <Form class="invoice-form" ref="serviceForm" :model="serviceForm" label-position="left" :label-width="120" :rules="ruleValidate">
            <div v-for="(servicePersonnelInfo,index) in serviceForm.serverList">
                <div class="no-label">
                    <FormItem class="s-price ivu-form-item-required" style="width: 117px" label="" :prop="'serverList[' + index + '].secPostId'" :rules="{required: true, message: '服务岗位不能为空', trigger: 'change'}">
                        <Select v-model="servicePersonnelInfo.secPostId" :class="{'light-bulb':servicePersonnelInfo.lightBulb}" @on-change="postUserWorkloadList(servicePersonnelInfo.secPostId,index)" placeholder="服务岗位">
                            <Option :title="serviceTypeInfo.name" v-for="serviceTypeInfo in serviceTypeList" :value="serviceTypeInfo.id" :key="serviceTypeInfo.id">{{serviceTypeInfo.name | postNameLimit}}</Option>
                        </Select>
                    </FormItem>
                </div>
                <div class="no-label">
                    <FormItem class="s-price ivu-form-item-required" style="width: 150px" label="" :prop="'serverList[' + index + '].serveUserId'" :rules="{required: true, message: '服务人员不能为空', trigger: 'change'}">
                        <Select @click.native="checkPostUserWorkload(servicePersonnelInfo.secPostId,index)" @on-change="selectedPostUser(index, $event)" v-model="servicePersonnelInfo.serveUserId" placeholder="服务人员">
                            <Option v-for="servicePersonInfo in serviceForm.serverList[index].servicePersonList" :value="servicePersonInfo.id" :key="servicePersonInfo.id"  :disabled="servicePersonInfo.disabled == true">
                                <Tooltip placement="right" :transfer="true">
                                    <span>{{servicePersonInfo.realName}}</span>
                                    <div slot="content">
                                    <span>
                                        {{servicePersonInfo.current}}待办/{{servicePersonInfo.histoty}}已完成
                                    </span>
                                    </div>
                                </Tooltip>
                            </Option>
                        </Select>
                    </FormItem>
                </div>
                <div class="no-label">
                    <FormItem class="s-price ivu-form-item-required" style="width: 200px" label="" prop="remark">
                        <Input v-model="servicePersonnelInfo.remark" placeholder="服务说明"></Input>
                    </FormItem>
                </div>
                <div class="plus-icon" @click="addService">
                    <Icon type="plus"></Icon>
                </div>
                <div v-if="serviceForm.serverList.length>1" class="plus-icon" @click="removeService(index)">
                    <Icon type="close"></Icon>
                </div>
            </div>
        </Form>
    </div>
</template>
<script>
    export default {
        props: {
            serviceUsers: {
                type: Array,
                default: []
            },
            serviceTypeList: null
        },
        watch: {
            serviceUsers (val) {
                if(this.isFirstInit && val && val.length>0 ){
                    this.isFirstInit = !this.isFirstInit;
                    this.$set(this.serviceForm,"serverList",val);
                    this.loadServicePersonInfo();
                }
            }
        },
        filters: {
            postNameLimit : function (value) {
                if(value && value.length > 6){
                    return value.substring(0,6) + "..." ;
                }
                return value;
            },
        },
        created: function () {
        },
        data () {
            return {
                isFirstInit: true,
                serviceForm: {
                    serverList: [
                        {
                            secPostId: null,
                            serveUserId: null,
                            remark: "",
                            lightBulb: false,
                            servicePersonList: []
                        }
                    ],
                },
                selectedUserList: [],
                ruleValidate: {},
            }
        },
        methods: {
            //子组件表单验证是否为空
            childComponentCheck () {
                var val = false;
                this.$refs['serviceForm'].validate(valid => {
                    val = valid;
                });
                return val;
            },
            //加载选择的服务人员列表
            loadServicePersonInfo () {
                for(let i=0;i<this.serviceForm.serverList.length;i++){
                    this.postUserWorkloadList (this.serviceForm.serverList[i].secPostId,i);
                }
            },
            //根据服务岗位获取服务人员列表
            postUserWorkloadList (secPostId,index) {
                var vm = this;
                if(!secPostId){
                    return;
                }
                this.request({
                    url: "/serviceCloud/orderOrRefuse/postUserWorkloadList.do",
                    param: {
                        secPostId: secPostId
                    }
                }).then((data)=>{
                    if (data && vm.serviceForm.serverList) {
                        data.forEach((item, index1) => {
                            for(let i = 0; i < vm.serviceForm.serverList.length; i++) {
                                if (item.id == vm.serviceForm.serverList[i].serveUserId) {
                                    data[index1].disabled = true;
                                }
                            }
                        });
                    }
                    vm.$set(vm.serviceForm.serverList[index], 'servicePersonList', data);
                })
            },
            //未选服务岗位的情况下直接选择服务人员的提醒样式
            checkPostUserWorkload (secPostId,index) {
                var vm = this;
                if(!secPostId){
                    for(var i=0;i<this.serviceForm.serverList.length;i++){
                        if(index == i){
                            this.serviceForm.serverList[i].lightBulb = true;
                            setTimeout(function () {
                                vm.serviceForm.serverList[index].lightBulb = false;
                            },300);
                            setTimeout(function () {
                                vm.serviceForm.serverList[index].lightBulb = true;
                            },600);
                            setTimeout(function () {
                                vm.serviceForm.serverList[index].lightBulb = false;
                            },900);
                        }
                    }
                }
            },
            //选择服务人员
            selectedPostUser(index, item) {
                if (this.selectedUserList[index]) {
                    this.selectedUserList[index] = item;
                }else {
                    this.selectedUserList.push(item);
                }
                this.handleChangePostUser();
            },
            //更改服务人员项对已有数据进行处理
            handleChangePostUser() {
                if (this.serviceForm.serverList) {
                    this.serviceForm.serverList.forEach((item, index) => {
                        if(this.serviceForm.serverList[index].servicePersonList){
                            this.serviceForm.serverList[index].servicePersonList.forEach((item1, index1) => {
                                item1.disabled = false;
                                for(let i = 0; i < this.selectedUserList.length; i++) {
                                    if (item1.id == this.selectedUserList[i]) {
                                        this.serviceForm.serverList[index].servicePersonList[index1].disabled = true;
                                    }
                                }
                            });
                        }
                    });
                }
            },
            //新增一行服务人员记录
            addService () {
                this.serviceForm.serverList.push({
                    secPostId: null,
                    serveUserId: null,
                    remark: "",
                    lightBulb: false,
                    servicePersonList: []
                });
            },
            //删除一行服务人员记录
            removeService (index) {
                if (this.serviceForm.serverList) {
                    let serveUserId = this.serviceForm.serverList[index].serveUserId + '';
                    if (serveUserId) {
                        this.selectedUserList.splice(this.selectedUserList.findIndex(item => item == serveUserId), 1);
                        this.handleChangePostUser();
                    }
                    this.serviceForm.serverList.splice(index,1);
                }
            },
        }
    }
</script>