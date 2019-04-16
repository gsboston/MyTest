<style>
    .instead-css{
        position: relative;
        width: 920px;
        margin: 0 auto;
        background-color: white;
        padding: 20px 65px 0 15px;
    }
    .instead-css .part-content{
        padding-left: 40px;
        padding-right: 20px;
    }
    .instead-css .form-input{
        width: 260px;
    }
    .instead-css .form-input input{
        border-radius: 0px;
    }
    .instead-css .contract-name{
        position: relative;
        left: 35px;
        padding-bottom: 20px;
        font-size: 22px;
        font-weight: bold;
        color: #59b399;
    }
    .hr-css{
        border: 0.5px solid #e5e5e5;
    }
    .file-css{
        position: relative;
        width: 920px;
        margin: 0 auto;
        background-color: white;
        padding: 0 65px 20px 15px;

    }
    .file-css .contract {
        width: 100px;
        height: 120px;
        margin: auto;
        background-image: url("./image/contract-bg.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
    .upload-css{
        width: 100px;
        height: 135px;
        border: 1px dotted #a1a1a1;
        border-radius: 5px;
        text-align: center;
        margin: auto;
        display: inherit;
        padding: 20px 5px 0 5px;
    }
    .contract-builder-clearFix{
        text-align: center;
        padding-top: 20px;
        clear: both;
        background: #f6f6f6;
    }
    .contract-builder-clearFix .save-button{
        width: 129px;
        height: 39px;
        border: 1px solid #59b399;
        color: #59b399;
        border-radius: 5px;
    }
    .contract-builder-clearFix .audit-button{
        width: 129px;
        height: 39px;
        background-color: #59b399;
        border: 1px solid #59b399;
        border-radius: 5px;
    }
</style>
<template>
    <div class="container">
        <div class="instead-css">
            <div class="contract-name">
                <span>{{this.contractName}}</span>
            </div>
            <i-form :model="insteadForm" :label-width="90" ref="formRef" >
                <!-- 代录合约 -->
                <Row>
                    <i-col span="12" v-if="!this.contractId">
                        <div class="part-content">
                            <Form-item  label="合约编码">
                                <i-input class="form-input" v-model="insteadForm.code" placeholder="不填写则系统自动生成" :maxlength="200"></i-input>
                            </Form-item>
                        </div>
                    </i-col>
                    <i-col span="12" v-if="insteadForm.status != 'COMMITTED'" style="z-index:10;" :style="{'height': this.contractId ? '34px' : ''}">
                        <div class="part-content">
                            <Form-item  label="是否代录">
                                <Checkbox :disabled="!this.isEditable" v-model="insteadForm.agentMode"></Checkbox>
                            </Form-item>
                        </div>
                    </i-col>
                </Row>
                <Row v-if="insteadForm.agentMode">
                    <i-col span="12">
                        <div class="part-content">
                            <Form-item label="代录组织" style="display: inline-block">
                                <i-input class="form-input" v-model="insteadForm.createOrgName" :maxlength="50" disabled></i-input>
                            </Form-item>
                            <Form-item label="销售组织" style="display: inline-block;margin-bottom: 0">
                                <i-input class="form-input" :title="insteadForm.optOrgName" v-model="insteadForm.optOrgName" :disabled="!(this.isEditable && insteadForm.agentMode)" :maxlength="50" @on-focus="jumpSelectOrg"></i-input>
                            </Form-item>
                        </div>
                    </i-col>
                    <i-col span="12">
                        <div class="part-content">
                            <Form-item label="代录人" style="display: inline-block">
                                <i-input class="form-input" v-model="insteadForm.createUserName" :maxlength="50" disabled></i-input>
                            </Form-item>
                            <Form-item label="业务员" style="display: inline-block;margin-bottom: 0">
                                <i-input class="form-input" :title="insteadForm.optUserName" v-model="insteadForm.optUserName" :maxlength="50" disabled></i-input>
                            </Form-item>
                        </div>
                    </i-col>
                </Row>
            </i-form>
        </div>
        <div ref="content" class="main-contract-content"></div>
        <div class="file-css">
            <div class="hr-css"></div>
            <Row align="top" style="padding-left: 40px;padding-top: 40px">
                <i-col span="3">
                    <span style="color: #59b399;font-size: 18px">补充协议</span>
                </i-col>
                <i-col span="18">
                    <i-col span="5" v-for="(fileItem,index) in protocalAttList" :key="index" :value="fileItem.attachmentId" style="text-align: center">
                        <div class="contract" @click="showFile(fileItem.attachmentId)">
                            <div v-if="isEditable" style="position: relative;left: 82px;width: 18px;height: 18px;background: #a1a1a1;cursor: pointer" @click.stop="removeFile(index)">
                                <Icon style="font-size: 18px;color: #e5e5e5;" type="close-round"></Icon>
                            </div>
                        </div>
                        <div :title="fileItem.fileName">
                            <span>{{fileItem.fileName | wordLengthLimit}}</span>
                        </div>
                    </i-col>
                    <i-col span="5" v-if="this.isEditable">
                        <div class="upload-css">
                            <BSUpload style="position: absolute" :beforeUpload="beforeFileUpload" :onSuccess="onFileSuccess" :maxSize="20480" :showProcess="false" :type="['doc','docx','pdf','jpg','png','jpeg']">
                                <Icon type="plus-round" style="font-size: 28px;color: #59b399;"></Icon>
                                <div style="width: 90px;line-height: 15px">
                                    <span style="font-size: 12px">*支持word、pdf、jpg、png、jpeg等文件，大小不超过20M</span>
                                </div>
                            </BSUpload>
                        </div>
                    </i-col>
                </i-col>
            </Row>
        </div>
        <Row class="contract-builder-clearFix" v-if="this.isEditable">
            <i-button type="ghost" size="large" class="save-button" @click="save">保存合同</i-button>
            <i-button type="primary" size="large" class="audit-button" @click="save('submit')">提交审核</i-button>
        </Row>
    </div>
</template>

<script type="text/babel">
    import ICol from "../../../node_modules/iview/src/components/grid/col.vue";

    export default {
        components: {ICol},
        filters: {
            wordLengthLimit : function (value) {
                if(value && value.length > 6){
                    return value.substring(0,6) + "..." ;
                }
                return value;
            },
        },
        props:{
            isInit: false,
            contractId: null,
            contractType: null,
            isEditable: false,
            defId:'',
            defaultInfo:{},
            isContractPerfect: false,
            contractName: null,
            boId: null,
            hxId: null,
        },
        data () {
            return {
                sendData: null,
                insteadForm: {
                    code: "",
                    status: "",
                    createUserName: "",
                    createOrgName: "",
                    optUserName: "",
                    optOrgName: "",
                    userId:null,
                    userOrgId:null,
                    agentMode:false,
                },
                tpl: "",
                protocalAttList: []
            }
        },
        created:function(){
            this.$api.renderInsteadFromTemplate = this.renderInstead;
            if(this.isInit){
                this.jumpTarget();
            }
            this.insteadForm.createUserName = window.Context.getCurrentUser().realName;
            this.insteadForm.createOrgName = window.Context.getCurrentOrganization().name;
        },
        methods: {
            jumpTarget:function(){
                var vm = this;
                //判断合约所属人与当前用户是否为一个人
                if(!vm.contractId){
                    vm.renderTemplate(vm.contractId,vm.contractType,vm.isEditable,vm.defId,vm.defaultInfo,vm.isContractPerfect);
                }else{
                    vm.userId = window.Context.getCurrentUser().id;
                    vm.request({
                        url: "/signCloud/contractView/getCreaterIdByContractId.do",
                        param:{
                            contractId: vm.contractId
                        }
                    }).then((data)=>{
                        if(data && data.creator){
                            if(vm.isEditable && data.creator == vm.userId){
                                vm.isEditable = true;
                            }else{
                                vm.isEditable = false;
                            }
                        }
                        vm.renderTemplate(vm.contractId,vm.contractType,vm.isEditable,vm.defId,vm.defaultInfo,vm.isContractPerfect);
                    });
                }
            },
            renderTemplate(contractId,contractType,isEditable,defId,defaultInfo,isContractPerfect){
                this.request({
                    url:'/signCloud/getContractTemplate.do?typeId='+contractType,
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
                            contractId:contractId,
                            isEditable:isEditable,
                            defId:defId,
                            defaultInfo:defaultInfo,
                            isContractPerfect:isContractPerfect
                        });
                    });
                });
            },
            edit (){
                this.$api.agreementEdit("fullTest");
            },
            renderInstead (param) {
                this.insteadForm.agentMode = param.agentMode;
                if(param.agentMode){
                    this.insteadForm.optOrgName = param.optOrgName;
                    this.insteadForm.optUserName = param.optUserName;
                }
                this.insteadForm.userId = param.userId;
                this.insteadForm.userOrgId = param.userOrgId;
                this.insteadForm.status = param.status;
                if(param.protocalAttList){
                    this.protocalAttList = param.protocalAttList;
                }
            },
            beforeFileUpload () {
            },
            onFileSuccess (id,file) {
                this.protocalAttList.push({
                    "attachmentId":id,
                    "fileName":file.name,
                    "type":file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length)
                });
            },
            showFile (attachmentId) {
                window.open('/ossController/oss/file.do?id=' + attachmentId);
            },
            removeFile (index) {
                this.protocalAttList.splice(index,1);
            },
            save (type) {
                var vm = this;
                vm.sendData = null;
                vm.$api.contractSaveApi(function (contractInfo) {
                    vm.sendData = contractInfo;
                });
                if(!vm.sendData){
                    if(type=="submit"){
                        this.$Message.error({content:"合约信息项录入不完整，请完善后再提交审核！",duration:3});
                    }else{
                        this.$Message.error({content:"请完善合约填写信息后方可保存！",duration:3});
                    }
                }else{
                    if(vm.sendData.isCriterion != undefined && vm.sendData.isCriterion == 0 &&(!vm.sendData.contentAttList || vm.sendData.contentAttList.length == 0)){
                        this.$Message.error({content:"非标准合同需要上传合同正本，请上传之后再重新提交！",duration:3});
                        return;
                    }
                    if(type=="submit"){
                        vm.sendData.status = "COMMITTED";
                    }
                    if(vm.insteadForm.code){
                        vm.sendData.code = vm.insteadForm.code;
                    }
                    vm.sendData.agentMode = vm.insteadForm.agentMode;
                    vm.sendData.userId = vm.insteadForm.userId;
                    vm.sendData.userOrgId = vm.insteadForm.userOrgId;
                    //补充协议
                    vm.sendData.protocalAttList = this.protocalAttList;
                    vm.sendData.isAutoApprove = false;
                    //营销云那边传递过来的线索id要保存到合约中
                    if(vm.boId){
                        vm.sendData.boId = vm.boId;
                    }
                    if(vm.hxId){
                        vm.sendData.hxId = vm.hxId;
                    }
                    //验证是否有自动审核功能
                    if(type=="submit"){
                        var saleOrgId = null;//销售组织
                        var subjectId = vm.sendData.cSList[1].orgId;//签约组织
                        var contractDefId = vm.sendData.contractDefId;//合同定义
                        if(vm.insteadForm.agentMode){
                            saleOrgId = vm.sendData.userOrgId;
                        }else{
                            // saleOrgId = vm.sendData.cSList[1].orgId;

                            //2018-07-17 修改：非代录模式saleOrgId为当前组织
                            saleOrgId = this.$context.getCurrentOrganization().id;
                        }
                        vm.request({
                            url: "/signCloud/contractBuilder/saveValidation.do",
                            param: {
                                saleOrgId: saleOrgId,
                                subjectId: subjectId,
                                contractDefId: contractDefId,
                            }
                        }).then(data => {
                            if (data) {
                                this.prompt({
                                    code: "saveValidation",
                                    title:"确认对话框",
                                    width:400,
                                    height:200,
                                    callback: (flag,close) => {
                                        if(flag == "autoAudit"){
                                            vm.sendData.isAutoApprove = true;
                                            // vm.$Message.info("合约正在自动审核中！");
                                            vm.request({
                                                url: "/signCloud/contractBuilder/save.do",
                                                data:vm.sendData,
                                                timeout: 60000
                                            }).then(data => {
                                                vm.$Message.info({content:"合约已系统自动审核通过！",duration:3});
                                                if(vm.isContractPerfect){
                                                    vm.$api.newApiContractList();
                                                }else{
                                                    vm.$api.jump("M03","F0303","");
                                                }
                                            });
                                        }else if(flag == "personAudit"){
                                            console.log(vm.sendData);
                                            vm.request({
                                                url: "/signCloud/contractBuilder/save.do",
                                                data:vm.sendData,
                                                timeout: 60000
                                            }).then(data => {
                                                vm.$Message.info({content:"合约已提交审核，请稍等或直接联系审核人员！",duration:3});
                                                if(vm.isContractPerfect){
                                                    vm.$api.newApiContractList();
                                                }else{
                                                    vm.$api.jump("M03","F0303","");
                                                }
                                            });
                                        }else{
                                            return;
                                        }
                                        close();
                                    }
                                });
                            }else{
                                console.log(vm.sendData);
                                vm.request({
                                    url: "/signCloud/contractBuilder/save.do",
                                    data:vm.sendData,
                                    timeout: 60000
                                }).then(data => {
                                    vm.$Message.info({content:"合约已提交审核，请稍等或直接联系审核人员！",duration:3});
                                    if(vm.isContractPerfect){
                                        vm.$api.newApiContractList();
                                    }else{
                                        vm.$api.jump("M03","F0303","");
                                    }
                                });
                            }
                        });
                    }else{
                        vm.request({
                            url: "/signCloud/contractBuilder/save.do",
                            data:vm.sendData,
                            timeout: 60000
                        }).then(data => {
                            vm.$Message.info("保存成功");
                            if(vm.isContractPerfect){
                                vm.$api.newApiContractList();
                            }else{
                                vm.$api.jump("M03","F0303","");
                            }
                        });
                    }
                }
            },
            jumpSelectOrg:function () {
                this.prompt({
                    code: "jumpSelectOrg",
                    title:"选择组织",
                    width:800,
                    height:400,
                    callback: (selectedOrg,selectedUser,close) => {
                        if(selectedOrg && selectedUser){
                            this.insteadForm.userOrgId = selectedOrg.id;
                            this.insteadForm.optOrgName = selectedOrg.name;
                            this.insteadForm.userId = selectedUser.id;
                            this.insteadForm.optUserName = selectedUser.realName;
                        }
                        close();
                    }
                });
            },
        }
    }
</script>

<style scoped>
    .container {
        padding: 15px 0;
        background-color: #f6f6f6;
    }

    .container .main-contract-content >>> .ivu-input {
        line-height: 1;
    }

    /**合约总额*/
    .container .main-contract-content >>> #gszc .form-input-price > input,
    .container .main-contract-content >>> #csgl .form-input-price-total-price > input,
    .container .main-contract-content >>> #ssch .form-input-price-total-price > input,
    .container .main-contract-content >>> #zzq .form-input-price > input,
    .container .main-contract-content >>> #zzdl .form-input-price > input,
    .container .main-contract-content >>> #sbzc .form-input-price > input,
    .container .main-contract-content >>> #zl .form-input-price > input,
    .container .main-contract-content >>> #csj_ssch .form-input-price-total-price > input,
    .container .main-contract-content >>> #hdgqssch .form-input-price-total-price > input,
    .container .main-contract-content >>> #hdssch .form-input-price-total-price > input,
    .container .main-contract-content >>> #masssch .form-input-price-total-price > input,
    .container .main-contract-content >>> #fb_two .form-input-price-total-price > input,
    .container .main-contract-content >>> #fb_three .form-input-price-total-price > input {
        height: auto;
    }

    /**其他金额*/
    .container .main-contract-content >>> #csgl .other-item .form-input-price > input {
        top: -5px;
        height: 30px;
    }
    .container .main-contract-content >>> #ssch .other-item .form-input-price > input,
    .container .main-contract-content >>> #csj_ssch .other-item .form-input-price > input,
    .container .main-contract-content >>> #hdgqssch .other-item .form-input-price > input,
    .container .main-contract-content >>> #hdssch .other-item .form-input-price > input {
        height: 30px;
    }
    .container .main-contract-content >>> #zzq .form-input-copyright-price > input,
    .container .main-contract-content >>> #sbzc .form-input-tradeMark-price > input {
        height: initial;
    }

    /**输入框placeholder颜色设置*/
    .container .main-contract-content >>> input:-ms-input-placeholder {
        color: #bbbec4!important;
    }
</style>
